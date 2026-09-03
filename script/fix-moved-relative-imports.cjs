const fs = require('node:fs')
const path = require('node:path')

const ROOTS = ['src/pages', 'src/components', 'src/context', 'src/data']
const EXTENSIONS = ['', '.ts', '.tsx', '.js', '.jsx', '.json', '.css', '.png', '.jpg', '.jpeg', '.svg', '.webp', '.mp4', '.csv']

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name)
    return entry.isDirectory() ? walk(full) : [full]
  })
}

function resolves(fromFile, specifier) {
  const base = path.resolve(path.dirname(fromFile), specifier)
  return EXTENSIONS.some((ext) => fs.existsSync(base + ext)) ||
    ['index.ts', 'index.tsx', 'index.js', 'index.jsx'].some((name) => fs.existsSync(path.join(base, name)))
}

const sourceFiles = ROOTS.flatMap((root) => fs.existsSync(root) ? walk(root) : [])
  .filter((file) => /\.(?:ts|tsx|js|jsx)$/.test(file))

let changedFiles = 0
let changedImports = 0

for (const file of sourceFiles) {
  const original = fs.readFileSync(file, 'utf8')
  const next = original.replace(/(['"])(\.\.\/(?:\.\.\/)+[^'"\n]+)\1/g, (match, quote, specifier) => {
    if (resolves(file, specifier)) return match
    const shorter = specifier.replace(/^\.\.\//, '')
    if (!shorter.startsWith('../') && !shorter.startsWith('./')) return match
    if (!resolves(file, shorter)) return match
    changedImports += 1
    console.log(`${file}: ${specifier} -> ${shorter}`)
    return `${quote}${shorter}${quote}`
  })

  if (next !== original) {
    fs.writeFileSync(file, next)
    changedFiles += 1
  }
}

console.log(`Fixed ${changedImports} moved relative imports in ${changedFiles} files.`)
