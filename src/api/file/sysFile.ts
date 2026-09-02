import { createTempClient, tempRequest } from '@/api/request'
import type { PageQuery, PageResult, SysFile } from '@/api/types'
import { extractGatewayErrorMessage, unwrapGatewayData } from '@/utils/gateway'

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

  const client = createTempClient(FILE_TRANSFER_TIMEOUT_MS)
  // 不手动设置 Content-Type，让浏览器补齐 multipart boundary。
  const { data } = await client.post('/temp/sys-file/upload', form)
  return unwrapGatewayData<SysFile>(data)
}

export async function getSysFileById(id: number): Promise<SysFile> {
  const { data } = await tempRequest.get('/temp/sys-file/getDetailById', {
    params: { id },
  })
  return unwrapGatewayData<SysFile>(data)
}

export async function pageSysFiles(query: PageQuery<SysFile>): Promise<PageResult<SysFile>> {
  const { data } = await tempRequest.post('/temp/sys-file/page', query, {
    headers: { 'Content-Type': 'application/json' },
  })
  return unwrapGatewayData<PageResult<SysFile>>(data)
}

export async function deleteSysFile(id: number): Promise<boolean> {
  const { data } = await tempRequest.delete('/temp/sys-file/deleteOne', {
    params: { id },
  })
  return unwrapGatewayData<boolean>(data)
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

/** 下载文件并触发浏览器保存；返回用于展示的文件名。 */
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
