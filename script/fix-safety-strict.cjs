const fs = require('node:fs')

const file = 'src/pages/SafetyEvaluation.tsx'
const original = fs.readFileSync(file, 'utf8')
const target = 'metrics: [],'
const replacement = "metrics: [] as Array<{ label: string; val?: string; value?: string }>,"
const count = original.split(target).length - 1

if (count !== 7) {
  throw new Error(`Expected exactly 7 empty metrics arrays in ${file}, found ${count}`)
}

fs.writeFileSync(file, original.split(target).join(replacement))
console.log(`Typed ${count} empty metrics arrays in ${file}.`)
