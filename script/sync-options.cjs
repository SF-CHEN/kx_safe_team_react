/**
 * [INPUT]: 依赖 load-swagger.cjs 的标准化 OpenAPI schema、generate-api.cjs 生成的 enums.ts，以及 option-label-overrides.cjs 的人工覆盖配置
 * [OUTPUT]: 重新生成 src/api/generated/meta/options.ts，优先使用人工覆盖，其次使用 Swagger 中文说明，最后回退英文枚举值
 * [POS]: script 的 options 后处理器，解决自动中文匹配不完整和重新生成覆盖人工修正的问题
 */
const fs = require('node:fs')
const path = require('node:path')
const { ensureDir, loadSwagger } = require('./load-swagger.cjs')
const optionLabelOverrides = require('./option-label-overrides.cjs')

const META_DIR = path.resolve(__dirname, '../src/api/generated/meta')
const OPTIONS_FILE = path.join(META_DIR, 'options.ts')

function toPascalCase(value) {
  return String(value || '')
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')
}

function tsString(value) {
  return `'${String(value).replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`
}

function enumKey(value, index) {
  const key = String(value).replace(/[^A-Za-z0-9_$]/g, '_').replace(/^([0-9])/, '_$1')
  return key || `VALUE_${index + 1}`
}

function hasChinese(value) {
  return /[\u3400-\u9fff]/.test(String(value || ''))
}

function normalizeEnumLabelSource(source, values) {
  if (Array.isArray(source) && source.length === values.length) {
    return source.map((label, index) => String(label || values[index]).trim() || String(values[index]))
  }

  if (source && typeof source === 'object' && !Array.isArray(source)) {
    const labels = values.map(value => source[value] ?? source[String(value)])
    if (labels.every(label => label !== undefined && label !== null && String(label).trim())) {
      return labels.map(label => String(label).trim())
    }
  }

  return null
}

function trimLabel(value) {
  return String(value || '')
    .replace(/^["'`\s:：,，、;；/|()（）\-–—]+/, '')
    .replace(/["'`\s:：,，、;；/|()（）\-–—]+$/, '')
    .trim()
}

function labelsFromExplicitDescription(description, values) {
  if (!description || !values.length) return null

  const text = String(description)
  const positions = []
  let cursor = 0

  for (const value of values) {
    const token = String(value)
    const index = text.indexOf(token, cursor)
    if (index === -1) return null
    positions.push({ start: index, end: index + token.length })
    cursor = index + token.length
  }

  const labels = positions.map((position, index) => {
    const nextStart = positions[index + 1]?.start ?? text.length
    return trimLabel(text.slice(position.end, nextStart)) || String(values[index])
  })

  return labels.some(hasChinese) ? labels : null
}

function splitDescriptionList(value) {
  return String(value || '')
    .split(/[、，,]|和/)
    .map(trimLabel)
    .filter(Boolean)
}

function labelsFromOrderedDescription(description, values) {
  if (!description || values.length < 2) return null

  const text = String(description)
  const candidates = []

  for (const match of text.matchAll(/[（(]([^（）()]+)[）)]/g)) {
    candidates.push(match[1])
  }

  for (const marker of ['分别为', '分为', '包括', '包含']) {
    const index = text.indexOf(marker)
    if (index !== -1) candidates.push(text.slice(index + marker.length))
  }

  const commaIndex = text.indexOf('，')
  if (commaIndex !== -1) candidates.push(text.slice(commaIndex + 1))

  for (const candidate of candidates) {
    const labels = splitDescriptionList(candidate)
    if (labels.length === values.length && labels.every(hasChinese)) return labels
  }

  return null
}

function enumOptionLabels(property) {
  const values = property.enum || []
  const candidates = [
    normalizeEnumLabelSource(property['x-enum-descriptions'], values),
    normalizeEnumLabelSource(property['x-enumDescriptions'], values),
    normalizeEnumLabelSource(property['x-enum-labels'], values),
    normalizeEnumLabelSource(property['x-enumLabels'], values),
    labelsFromExplicitDescription(property.description, values),
    labelsFromOrderedDescription(property.description, values),
    normalizeEnumLabelSource(property['x-enum-varnames'], values),
    normalizeEnumLabelSource(property['x-enumNames'], values),
    normalizeEnumLabelSource(property['x-enum-names'], values),
  ].filter(Boolean)

  const chineseCandidate = candidates
    .map(labels => ({ labels, score: labels.filter(hasChinese).length }))
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)[0]

  return chineseCandidate?.labels || candidates[0] || values.map(String)
}

function collectEnums(schemas) {
  const result = []
  const bySignature = new Map()

  for (const [schemaName, schema] of Object.entries(schemas)) {
    for (const [propertyName, property] of Object.entries(schema?.properties || {})) {
      if (!property.enum?.length) continue

      const signature = property.enum.map(String).sort().join('\0')
      const labels = enumOptionLabels(property)
      const existing = bySignature.get(signature)

      if (existing) {
        const currentChineseCount = existing.labels.filter(hasChinese).length
        const nextChineseCount = labels.filter(hasChinese).length
        if (nextChineseCount > currentChineseCount) {
          existing.labels = labels
          existing.description = property.description || existing.description
        }
        continue
      }

      const item = {
        typeName: `${schemaName}${toPascalCase(propertyName)}`,
        values: property.enum,
        labels,
        description: property.description || `${schemaName}.${propertyName}`,
      }
      result.push(item)
      bySignature.set(signature, item)
    }
  }

  return result
}

function resolvedLabel(item, value, index) {
  const optionName = `${item.typeName}Options`
  const groupOverrides = optionLabelOverrides[optionName]
  return groupOverrides?.[String(value)] || item.labels[index] || String(value)
}

function buildOptionsContent(enums) {
  const imports = enums.map(item => `${item.typeName}Enum`).join(', ')
  const optionBlocks = enums.map(item => {
    const rows = item.values
      .map((value, index) => `  { label: ${tsString(resolvedLabel(item, value, index))}, value: ${item.typeName}Enum.${enumKey(value, index)} },`)
      .join('\n')

    return `/** ${item.description} 下拉选项 */\nexport const ${item.typeName}Options = [\n${rows}\n] as const`
  })

  return `/**
 * [INPUT]: 依赖 OpenAPI 枚举说明、./enums.ts 和 script/option-label-overrides.cjs 的人工 label 覆盖
 * [OUTPUT]: 对外提供人工覆盖优先、Swagger 中文说明其次、英文枚举值兜底的 Select、Radio、Checkbox 选项
 * [POS]: src/api/generated/meta 的自动生成选项文件，与 enums.ts 保持一一对应
 */
import { ${imports} } from './enums'

${optionBlocks.join('\n\n')}
`
}

async function main() {
  const { schema } = await loadSwagger()
  const enums = collectEnums(schema.components?.schemas || {})

  ensureDir(META_DIR)
  fs.writeFileSync(OPTIONS_FILE, buildOptionsContent(enums), 'utf-8')
  console.log(`✅ options 已同步: ${path.relative(process.cwd(), OPTIONS_FILE)}`)
}

main().catch(error => {
  console.error(`❌ ${error.message}`)
  process.exitCode = 1
})
