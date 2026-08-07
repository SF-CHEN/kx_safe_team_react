const fs = require("node:fs")
const path = require("node:path")
const { loadSwagger, ensureDirForFile } = require("./load-swagger.cjs")

/**
 * 从 OpenAPI 生成 AI / 对接用 Markdown 文档（不生成业务代码）
 * 输出：src/api/docs/api.json（拉取缓存）+ src/api/docs/api.md
 * 用法：npm run api:docs
 */
const outputFilePath = path.join(__dirname, "../src/api/docs/api.md")

/** SCREAMING_SNAKE_CASE -> camelCase，如 MODEL_TYPE -> modelType */
function dictTypeToField(dictType) {
  return dictType
    .toLowerCase()
    .split("_")
    .map((part, index) => (index === 0 ? part : part.charAt(0).toUpperCase() + part.slice(1)))
    .join("")
}

/** 从 schemas 与 paths 中收集 dictType 等 enum 定义 */
function collectEnumValues(schemas, paths) {
  const enumMap = new Map()

  function addEnum(name, values, source) {
    if (!Array.isArray(values) || values.length === 0) return
    const key = name || "unknown"
    const existing = enumMap.get(key)
    if (!existing) {
      enumMap.set(key, { values: [...values], sources: [source] })
      return
    }
    values.forEach((value) => {
      if (!existing.values.includes(value)) existing.values.push(value)
    })
    if (!existing.sources.includes(source)) existing.sources.push(source)
  }

  for (const [schemaName, schema] of Object.entries(schemas)) {
    if (schema.properties) {
      for (const [propName, propConfig] of Object.entries(schema.properties)) {
        if (propConfig.enum) {
          addEnum(propName, propConfig.enum, `${schemaName}.${propName}`)
        }
      }
    }
    if (schema.enum) {
      addEnum(schemaName, schema.enum, schemaName)
    }
  }

  for (const methods of Object.values(paths)) {
    for (const operation of Object.values(methods)) {
      if (!operation || typeof operation !== "object") continue
      for (const param of operation.parameters || []) {
        if (param.schema?.enum) {
          addEnum(param.name, param.schema.enum, `param:${param.name}`)
        }
      }
    }
  }

  return enumMap
}

/** 扫描所有 schema 字段描述，为 dictType 推断业务含义 */
function buildDictTypeMeta(dictTypes, schemas) {
  const fieldDescMap = new Map()

  for (const schema of Object.values(schemas)) {
    if (!schema.properties) continue
    for (const [field, config] of Object.entries(schema.properties)) {
      if (config.description && !fieldDescMap.has(field)) {
        fieldDescMap.set(field, config.description.split("，")[0].split(",")[0].split(":")[0].trim())
      }
    }
  }

  return dictTypes.map((dictType) => {
    const field = dictTypeToField(dictType)
    return {
      dictType,
      field,
      description: fieldDescMap.get(field) || ""
    }
  })
}

function formatEnumUnion(values) {
  return values.map(value => `'${value}'`).join(" | ")
}

async function main() {
  const { schema: apiData, version } = await loadSwagger()
  const schemas = apiData.components?.schemas || {}
  const paths = apiData.paths || {}
  const enumMap = collectEnumValues(schemas, paths)
  const dictTypeEntry = enumMap.get("dictType")
  const dictTypes = dictTypeEntry?.values || []

  let mdContent = `# ${apiData.info?.title || "API Document"}\n\n`
  mdContent += `> 版本: ${apiData.info?.version || "-"}\n`
  mdContent += `> 文档规范: ${version === "v2" ? "Swagger 2.0（已归一化）" : "OpenAPI 3.x"}\n`
  mdContent += `> 描述: 此文档由脚本生成，旨在供 AI 助手理解系统接口定义。\n\n`

  function resolveType(schema) {
    if (!schema) return "any"

    if (schema.$ref) {
      const refName = schema.$ref.split("/").pop()
      const refSchema = schemas[refName]
      if (refSchema) {
        if (refSchema.enum) return formatEnumUnion(refSchema.enum)
        if (refSchema.type === "object" || refSchema.properties) return refName
      }
      return refName
    }

    if (schema.enum) {
      return formatEnumUnion(schema.enum)
    }

    if (schema.type === "array") {
      return `${resolveType(schema.items)}[]`
    }

    if (schema.type) {
      if (schema.type === "integer") return "number"
      return schema.type
    }

    return "any"
  }

  mdContent += `## 1. 数据模型定义 (Data Models)\n\n`
  mdContent += `以下是系统中涉及的所有数据结构的 TypeScript 接口定义：\n\n`
  mdContent += "```typescript\n"

  for (const [name, schema] of Object.entries(schemas)) {
    const description = schema.description ? ` // ${schema.description}` : ""
    mdContent += `interface ${name} {${description}\n`

    if (schema.properties) {
      for (const [propName, propConfig] of Object.entries(schema.properties)) {
        const propType = resolveType(propConfig)
        const propDesc = propConfig.description ? ` // ${propConfig.description}` : ""
        mdContent += `  ${propName}?: ${propType};${propDesc}\n`
      }
    }
    mdContent += `}\n\n`
  }
  mdContent += "```\n\n"

  if (dictTypes.length > 0) {
    const dictMeta = buildDictTypeMeta(dictTypes, schemas)

    mdContent += `## 2. 系统字典定义 (System Dictionary)\n\n`
    mdContent += `系统通过 \`SysDict\` 表统一管理枚举值。前端对接时使用 \`dictType\` 区分字典类别，\`dictValue\` 作为传输值，\`name\` 作为展示文案。\n\n`

    mdContent += `### DictType 枚举\n\n`
    mdContent += "```typescript\n"
    mdContent += `type DictType =\n`
    dictTypes.forEach((type) => {
      mdContent += `  | '${type}'\n`
    })
    mdContent += "```\n\n"

    mdContent += `### 字典类型对照表\n\n`
    mdContent += `| dictType | 关联字段 | 说明 |\n`
    mdContent += `| --- | --- | --- |\n`
    dictMeta.forEach(({ dictType, field, description }) => {
      mdContent += `| \`${dictType}\` | \`${field}\` | ${description || "-"} |\n`
    })
    mdContent += `\n`

    mdContent += `### 字典数据结构\n\n`
    mdContent += "```typescript\n"
    mdContent += `interface SysDictItem {\n`
    mdContent += `  id?: number;\n`
    mdContent += `  dictType?: DictType; // 字典类型\n`
    mdContent += `  dictValue?: string; // 字典值（用于传输/API 提交）\n`
    mdContent += `  name?: string; // 字典名称（用于界面展示）\n`
    mdContent += `  sortOrder?: number; // 排序号\n`
    mdContent += `  enabled?: boolean; // 是否启用\n`
    mdContent += `  pid?: number; // 父字典 ID，级联字典时传入\n`
    mdContent += `}\n\n`
    mdContent += `interface BaseDropSysDict {\n`
    mdContent += `  id?: number;\n`
    mdContent += `  name?: string; // 下拉展示文案\n`
    mdContent += `  data?: SysDictItem; // 完整字典项\n`
    mdContent += `}\n`
    mdContent += "```\n\n"

    mdContent += `### 获取字典下拉\n\n`
    mdContent += `- **Method**: \`GET\`\n`
    mdContent += `- **URL**: \`/sys-dict/dropdown\`\n`
    mdContent += `- **Query Parameters**:\n`
    mdContent += `  - \`dictType\`: DictType (Required) — 字典类型，见上表\n`
    mdContent += `  - \`pid\`: number (Optional, default: 0) — 父级字典 ID，获取子级选项时使用\n`
    mdContent += `- **Response**: \`ResultListBaseDropSysDict\` → \`data: BaseDropSysDict[]\`\n\n`
    mdContent += `> 级联关系示例：先请求 \`dictType=DATA_MODALITY\` 获取数据模态，再以其某项 \`id\` 作为 \`pid\` 请求 \`dictType=DATA_TYPE\` 获取下级选项。\n\n`
  }

  mdContent += `## ${dictTypes.length > 0 ? "3" : "2"}. 接口列表 (API Endpoints)\n\n`

  const groups = {}
  const httpMethods = new Set(["get", "post", "put", "delete", "patch", "head", "options"])

  for (const [endpoint, methods] of Object.entries(paths)) {
    for (const [method, operation] of Object.entries(methods)) {
      if (!httpMethods.has(method.toLowerCase())) continue
      if (!operation || typeof operation !== "object") continue

      const tag = operation.tags ? operation.tags[0] : "其他"
      const summary = operation.summary || "无描述"

      if (!groups[tag]) groups[tag] = []

      let itemMd = `### ${summary}\n\n`
      itemMd += `- **Method**: \`${method.toUpperCase()}\`\n`
      itemMd += `- **URL**: \`${endpoint}\`\n`

      if (operation.parameters && operation.parameters.length > 0) {
        itemMd += `- **Query / Path Parameters**:\n`
        operation.parameters.forEach((p) => {
          const reqMark = p.required ? "(Required)" : "(Optional)"
          const pType = resolveType(p.schema)
          itemMd += `  - \`${p.name}\` (${p.in || "query"}): ${pType} ${reqMark} \n`
        })
      }

      if (operation.requestBody) {
        const jsonContent = operation.requestBody.content?.["application/json"]
        if (jsonContent) {
          const bodyType = resolveType(jsonContent.schema)
          itemMd += `- **Request Body**: \`${bodyType}\`\n`
        }
      }

      const successResp = operation.responses?.["200"]
      if (successResp) {
        const jsonContent = successResp.content?.["*/*"] || successResp.content?.["application/json"]
        if (jsonContent) {
          const returnType = resolveType(jsonContent.schema)
          itemMd += `- **Response**: \`${returnType}\`\n`
        } else {
          itemMd += `- **Response**: OK (No Content)\n`
        }
      }

      itemMd += `\n---\n\n`
      groups[tag].push(itemMd)
    }
  }

  for (const [tag, items] of Object.entries(groups)) {
    mdContent += `### 📂 ${tag}\n\n`
    items.forEach((item) => {
      mdContent += item
    })
  }

  ensureDirForFile(outputFilePath)
  fs.writeFileSync(outputFilePath, mdContent, "utf-8")
  console.log(`\n🎉 文档已生成:`)
  console.log(`   - ${path.relative(process.cwd(), path.join(__dirname, "../src/api/docs/api.json"))}`)
  console.log(`   - ${path.relative(process.cwd(), outputFilePath)}`)
}

main().catch((err) => {
  console.error("❌ 生成失败:", err.message)
  process.exit(1)
})
