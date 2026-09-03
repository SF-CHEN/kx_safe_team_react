import {
  deleteOne2SysFile,
  findPage2SysFile,
  getDetailById2SysFile,
  uploadSysFile as uploadSysFileApi,
} from '@/api/generated/sys-file'
import type { SysFile } from '@/api/generated/types/sys-file'
import type { PageQuery, PageResult } from '@/api/pagination'
import { unwrapApiResult, unwrapApiResultOr } from '@/api/result'
import { createTempClient } from '@/api/request'
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
  return unwrapApiResult(
    await uploadSysFileApi(form as unknown as Record<string, unknown>),
    '上传文件失败',
  )
}

export async function getSysFileById(id: number): Promise<SysFile> {
  return unwrapApiResult(await getDetailById2SysFile({ id }), '获取文件信息失败')
}

export async function pageSysFiles(query: PageQuery<SysFile>): Promise<PageResult<SysFile>> {
  return unwrapApiResultOr(
    await findPage2SysFile(query as Parameters<typeof findPage2SysFile>[0]),
    { records: [], total: 0 },
    '查询文件列表失败',
  )
}

export async function deleteSysFile(id: number): Promise<boolean> {
  return unwrapApiResult(await deleteOne2SysFile({ id }), '删除文件失败')
}

async function blobToErrorMessage(blob: Blob): Promise<string | null> {
  const type = blob.type || ''
  if (!type.includes('json') && !type.includes('text')) return null
  try {
    const text = await blob.text()
    return extractGatewayErrorMessage(JSON.parse(text) as unknown)
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
  return /filename="?([^";]+)"?/i.exec(header)?.[1]?.trim()
}

/**
 * 下载接口的 Swagger 响应仍是 void，generated 无法声明 responseType:'blob'。
 * 在后端补齐二进制 OpenAPI 描述前，这里保留唯一的文件传输例外。
 */
export async function downloadSysFile(id: number, fallbackName = `file-${id}`): Promise<string> {
  const response = await createTempClient(FILE_TRANSFER_TIMEOUT_MS).get('/temp/sys-file/download', {
    params: { id },
    responseType: 'blob',
  })

  const blob = response.data as Blob
  const errMsg = await blobToErrorMessage(blob)
  if (errMsg) throw new Error(errMsg)

  const filename =
    filenameFromContentDisposition(response.headers?.['content-disposition'] as string | undefined) ||
    fallbackName
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
  if (!unique.length) return new Map()

  const results = await Promise.all(
    unique.map(async (id) => {
      try {
        return [id, await getSysFileById(id)] as const
      } catch {
        return null
      }
    }),
  )

  return new Map(results.filter((row): row is readonly [number, SysFile] => row !== null))
}

export type { SysFile } from '@/api/generated/types/sys-file'
