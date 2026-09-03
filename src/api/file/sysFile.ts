import {
  deleteOne2SysFile,
  findPage2SysFile,
  getDetailById2SysFile,
  uploadSysFile as uploadSysFileApi,
} from '@/api/generated/sys-file'
import { unwrapApiResult, unwrapApiResultOr } from '@/api/result'
import { createTempClient } from '@/api/request'
import type { PageQuery, PageResult, SysFile } from '@/api/types'
import { extractGatewayErrorMessage } from '@/utils/gateway'

/** 上传/下载超时：OpenAPI 上限 50MB，需要比普通请求更长。 */
const FILE_TRANSFER_TIMEOUT_MS = 180_000
const MAX_UPLOAD_BYTES = 50 * 1024 * 1024

export function assertSysFileSize(file: File, maxBytes = MAX_UPLOAD_BYTES): void {
  if (file.size > maxBytes) {
    throw new Error(`文件大小不能超过 ${Math.floor(maxBytes / 1024 / 1024)}MB`)
  }
}

/** 文件上传：实际按 multipart/form-data 字段 `file` 提交。 */
export async function uploadSysFile(file: File): Promise<SysFile> {
  assertSysFileSize(file)
  const form = new FormData()
  form.append('file', file)

  // Swagger 将 multipart requestBody 泛化成 Record；运行时仍由 Axios 正确识别 FormData 并补 boundary。
  const result = await uploadSysFileApi(form as unknown as Record<string, unknown>)
  return unwrapApiResult(result, '上传文件失败') as SysFile
}

export async function getSysFileById(id: number): Promise<SysFile> {
  const result = await getDetailById2SysFile({ id })
  return unwrapApiResult(result, '获取文件信息失败') as SysFile
}

export async function pageSysFiles(query: PageQuery<SysFile>): Promise<PageResult<SysFile>> {
  // OpenAPI 未保留 PageQuery.entity 泛型，只在 generated 边界转换。
  const result = await findPage2SysFile(query as Parameters<typeof findPage2SysFile>[0])
  return unwrapApiResultOr(result, { records: [], total: 0 }, '查询文件列表失败') as PageResult<SysFile>
}

export async function deleteSysFile(id: number): Promise<boolean> {
  const result = await deleteOne2SysFile({ id })
  return unwrapApiResult(result, '删除文件失败')
}

async function blobToErrorMessage(blob: Blob): Promise<string | null> {
  const type = blob.type || ''
  if (!type.includes('json') && !type.includes('text')) return null
  try {
    const text = await blob.text()
    const parsed = JSON.parse(text) as unknown
    return extractGatewayErrorMessage(parsed)
  } catch {
    return null
  }
}

function filenameFromContentDisposition(header?: string): string | undefined {
  if (!header) return undefined
  const utf8 = /filename\*=UTF-8''([^;]+)/i.exec(header)
  if (utf8?.[1]) {
    try {
      return decodeURIComponent(utf8[1].trim().replace(/^"|"$/g, ''))
    } catch {
      return utf8[1].trim().replace(/^"|"$/g, '')
    }
  }
  const plain = /filename="?([^";]+)"?/i.exec(header)
  return plain?.[1]?.trim()
}

/**
 * 下载文件并触发浏览器保存；返回用于展示的文件名。
 *
 * WHY: 当前 Swagger 将下载响应描述为 void，模板生成函数不会附带 responseType:'blob'；
 * 该二进制传输暂时保留手写请求，不能手改 generated 文件，否则下次生成会丢失。
 */
export async function downloadSysFile(id: number, fallbackName = `file-${id}`): Promise<string> {
  const client = createTempClient(FILE_TRANSFER_TIMEOUT_MS)
  const response = await client.get('/temp/sys-file/download', {
    params: { id },
    responseType: 'blob',
  })

  const blob = response.data as Blob
  const errMsg = await blobToErrorMessage(blob)
  if (errMsg) throw new Error(errMsg)

  const header = response.headers?.['content-disposition'] as string | undefined
  const filename = filenameFromContentDisposition(header) || fallbackName
  const url = URL.createObjectURL(blob)
  try {
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = filename
    anchor.rel = 'noopener'
    document.body.appendChild(anchor)
    anchor.click()
    anchor.remove()
  } finally {
    URL.revokeObjectURL(url)
  }
  return filename
}

/** 批量拉取文件详情；失败的 id 忽略，不阻塞列表。 */
export async function fetchSysFilesByIds(ids: number[]): Promise<Map<number, SysFile>> {
  const unique = [...new Set(ids.filter((id) => Number.isFinite(id) && id > 0))]
  const map = new Map<number, SysFile>()
  if (!unique.length) return map

  const results = await Promise.all(
    unique.map(async (id) => {
      try {
        const file = await getSysFileById(id)
        return { id, file }
      } catch {
        return { id, file: null as SysFile | null }
      }
    }),
  )

  for (const row of results) {
    if (row.file) map.set(row.id, row.file)
  }
  return map
}
