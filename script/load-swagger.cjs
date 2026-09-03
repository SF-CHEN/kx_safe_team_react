/**
 * [INPUT]: 依赖 Node.js fs/path、项目 .env、命令行参数或 Swagger/OpenAPI JSON 地址
 * [OUTPUT]: 对外提供 loadSwagger、版本识别、v2/v3 归一化和目录辅助函数
 * [POS]: script 的 OpenAPI 输入层，为 generate-api.cjs 与 doc.cjs 提供统一 schema
 */
const fs = require('node:fs')
const path = require('node:path')

const PROJECT_ROOT = path.resolve(__dirname, '..')
const DEFAULT_FILE = path.resolve(__dirname, 'api.json')

const SCHEMA_NAME_MAP = {
  '文件分片对象': 'FileChunk',
  '中间数据': 'ExchangeData',
  '分页查询实体类': 'PageQuery',
  '字典表实体': 'DictEntity',
  '快速检测任务响应DTO': 'DetectTaskResponse',
  '快速检测任务接收DTO': 'DetectTaskRequest',
}

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true })
}

function ensureDirForFile(filePath) {
  ensureDir(path.dirname(filePath))
}

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return

  const content = fs.readFileSync(filePath, 'utf-8')
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue

    const equalIndex = trimmed.indexOf('=')
    if (equalIndex === -1) continue

    const key = trimmed.slice(0, equalIndex).trim()
    let value = trimmed.slice(equalIndex + 1).trim()
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1)
    }

    if (process.env[key] === undefined) process.env[key] = value
  }
}

function loadProjectEnv() {
  loadEnvFile(path.join(PROJECT_ROOT, '.env'))
  loadEnvFile(path.join(PROJECT_ROOT, `.env.${process.env.NODE_ENV || 'development'}`))
}

function parseArgs() {
  loadProjectEnv()

  const args = process.argv.slice(2)
  let url = (process.env.SWAGGER_URL || '').trim()
  let file = (process.env.SWAGGER_FILE || '').trim()

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index]
    if (arg === '--url' && args[index + 1]) url = args[++index]
    else if (arg.startsWith('--url=')) url = arg.slice('--url='.length)
    else if (arg === '--file' && args[index + 1]) file = args[++index]
    else if (arg.startsWith('--file=')) file = arg.slice('--file='.length)
    else if (!arg.startsWith('-')) {
      if (/^https?:\/\//i.test(arg)) url = arg
      else file = arg
    }
  }

  return {
    url,
    file: file ? path.resolve(process.cwd(), file) : DEFAULT_FILE,
  }
}

function detectSwaggerVersion(schema) {
  if (schema?.swagger === '2.0') return 'v2'
  if (typeof schema?.openapi === 'string' && schema.openapi.startsWith('3')) return 'v3'
  throw new Error('无法识别 Swagger/OpenAPI 版本，需要 swagger: "2.0" 或 openapi: "3.x"')
}

function toPascalCase(value) {
  let source = String(value || '').trim()
  if (SCHEMA_NAME_MAP[source]) return SCHEMA_NAME_MAP[source]

  for (const [chinese, english] of Object.entries(SCHEMA_NAME_MAP)) {
    source = source.split(chinese).join(english)
  }

  return source
    .replace(/对象/g, '')
    .replace(/实体类?/g, 'Entity')
    .replace(/«([^«»]+)»/g, ' $1 ')
    .split(/[^A-Za-z0-9_$]+/)
    .filter(Boolean)
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')
}

function sanitizeTypeName(rawName) {
  let name = String(rawName || '')

  // Swagger 2 常见 Result«Page«User对象»»，由内向外展开成合法 TypeScript 名称
  let previous = ''
  while (name.includes('«') && previous !== name) {
    previous = name
    name = name.replace(/([^«»]+)«([^«»]+)»/g, (_, outer, inner) => `${outer}${toPascalCase(inner)}`)
  }

  const sanitized = toPascalCase(name) || 'UnknownSchema'
  return /^[A-Za-z_$]/.test(sanitized) ? sanitized : `T${sanitized}`
}

function createSchemaNameMap(schemas = {}) {
  return new Map(Object.keys(schemas).map(name => [name, sanitizeTypeName(name)]))
}

function rewriteRefs(value, nameMap) {
  if (Array.isArray(value)) return value.map(item => rewriteRefs(item, nameMap))
  if (!value || typeof value !== 'object') return value

  const next = {}
  for (const [key, item] of Object.entries(value)) {
    if (key === '$ref' && typeof item === 'string') {
      const match = item.match(/^#\/(?:definitions|components\/schemas)\/(.+)$/)
      next[key] = match
        ? `#/components/schemas/${nameMap.get(match[1]) || sanitizeTypeName(match[1])}`
        : item
    } else {
      next[key] = rewriteRefs(item, nameMap)
    }
  }
  return next
}

function normalizeV2Parameter(param) {
  if (param.in === 'body') return param
  if (param.schema) return param

  return {
    ...param,
    schema: {
      type: param.type || 'string',
      format: param.format,
      items: param.items,
      enum: param.enum,
    },
  }
}

function normalizeV2Operation(operation = {}) {
  const parameters = []
  let requestBody

  for (const param of operation.parameters || []) {
    if (param.in === 'body') {
      requestBody = {
        required: param.required !== false,
        description: param.description,
        content: {
          'application/json': { schema: param.schema || { type: 'object' } },
        },
      }
    } else {
      parameters.push(normalizeV2Parameter(param))
    }
  }

  const responses = {}
  for (const [code, response] of Object.entries(operation.responses || {})) {
    if (response?.schema) {
      const { schema, ...rest } = response
      responses[code] = {
        ...rest,
        content: { 'application/json': { schema } },
      }
    } else {
      responses[code] = response
    }
  }

  return { ...operation, parameters, requestBody, responses }
}

function normalizeSwaggerV2(raw) {
  const definitions = raw.definitions || {}
  const nameMap = createSchemaNameMap(definitions)
  const rewritten = rewriteRefs(raw, nameMap)
  const schemas = {}

  for (const [name, schema] of Object.entries(rewritten.definitions || {})) {
    schemas[nameMap.get(name) || sanitizeTypeName(name)] = schema
  }

  const paths = {}
  for (const [url, methods] of Object.entries(rewritten.paths || {})) {
    paths[url] = {}
    for (const [method, operation] of Object.entries(methods || {})) {
      paths[url][method] = method === 'parameters' ? operation : normalizeV2Operation(operation)
    }
  }

  return {
    openapi: '3.0.0',
    info: rewritten.info || { title: 'API', version: '1.0.0' },
    paths,
    components: { schemas },
  }
}

function normalizeSwaggerV3(raw) {
  const originalSchemas = raw.components?.schemas || {}
  const nameMap = createSchemaNameMap(originalSchemas)
  const rewritten = rewriteRefs(raw, nameMap)
  const schemas = {}

  for (const [name, schema] of Object.entries(rewritten.components?.schemas || {})) {
    schemas[nameMap.get(name) || sanitizeTypeName(name)] = schema
  }

  return {
    ...rewritten,
    components: { ...(rewritten.components || {}), schemas },
  }
}

async function loadSwagger() {
  const { url, file } = parseArgs()
  let rawSchema

  if (url) {
    console.log(`📥 正在拉取 Swagger/OpenAPI: ${url}`)
    const response = await fetch(url)
    if (!response.ok) throw new Error(`Swagger 请求失败: ${response.status} ${response.statusText}`)

    rawSchema = await response.json()
    ensureDirForFile(file)
    fs.writeFileSync(file, JSON.stringify(rawSchema, null, 2), 'utf-8')
    console.log(`💾 已缓存: ${path.relative(process.cwd(), file)}`)
  } else {
    if (!fs.existsSync(file)) {
      throw new Error(`未找到 Swagger 文件: ${file}\n请配置 SWAGGER_URL 或使用 --url / --file`)
    }
    rawSchema = JSON.parse(fs.readFileSync(file, 'utf-8'))
    console.log(`📄 读取 Swagger: ${path.relative(process.cwd(), file)}`)
  }

  const version = detectSwaggerVersion(rawSchema)
  const schema = version === 'v2' ? normalizeSwaggerV2(rawSchema) : normalizeSwaggerV3(rawSchema)
  console.log(`🔎 文档版本: ${version === 'v2' ? 'Swagger 2.0' : 'OpenAPI 3.x'}`)
  return { schema, version, rawSchema, file }
}

module.exports = {
  DEFAULT_FILE,
  detectSwaggerVersion,
  ensureDir,
  ensureDirForFile,
  loadSwagger,
  sanitizeTypeName,
}
