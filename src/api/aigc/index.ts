/**
 * [INPUT]: AIGC 算法 key、文本/文件、样例与报告查询参数
 * [OUTPUT]: 对外提供 AIGC 分析、报告、算法状态与内置样例 API
 * [POS]: AIGC 手写业务 API；因网关未进入 OpenAPI，明确不放入 src/api/generated
 */
import { getAigcClient } from '@/api/aigc/request'
import {
  ANALYZE_TIMEOUT_MS,
  assertAigcAnalyzeSuccess,
  getAlgorithmKey,
  type AigcModality,
} from '@/api/aigc/keys'
import {
  inferMediaTypeFromAlgorithmKey,
  isBuiltinSampleText,
  parseContentDispositionFilename,
  resolveSampleFileName,
  resolveSampleMimeType,
} from '@/api/aigc/sampleUtils'
import { getGatewayBase, unwrapGatewayData } from '@/utils/gateway'

export {
  getSampleDisplayName,
  guessMimeFromFileName,
  isBuiltinSampleText,
  resolveSampleFileName,
  resolveSampleMimeType,
} from '@/api/aigc/sampleUtils'

export function buildAnalyzeURL(algorithmKey: string): string {
  return `${getGatewayBase()}/api/aigc/${algorithmKey}/api/analyze`
}

export async function analyzeText(
  algorithmKey: string,
  payload: { task_id?: string; text: string },
  timeout = ANALYZE_TIMEOUT_MS.text,
): Promise<Record<string, unknown>> {
  const { data } = await getAigcClient(timeout).post(
    `/api/aigc/${algorithmKey}/api/analyze`,
    payload,
    { headers: { 'Content-Type': 'application/json' } },
  )
  return assertAigcAnalyzeSuccess(data)
}

export async function analyzeFile(
  algorithmKey: string,
  file: File,
  options: { taskId?: string; text?: string; modality?: string } = {},
): Promise<Record<string, unknown>> {
  const { taskId, text, modality = 'image' } = options
  const timeout = ANALYZE_TIMEOUT_MS[modality as AigcModality] ?? 1_800_000
  const formData = new FormData()
  formData.append('file', file)
  if (taskId) formData.append('task_id', taskId)
  if (text) formData.append('text', text)

  const { data } = await getAigcClient(timeout).post(
    `/api/aigc/${algorithmKey}/api/analyze`,
    formData,
  )
  return assertAigcAnalyzeSuccess(data)
}

export async function submitAnalyze(
  modality: string,
  func: string,
  payload: { taskId?: string; text?: string; file?: File },
): Promise<Record<string, unknown>> {
  const algorithmKey = getAlgorithmKey(modality, func)
  const taskId = payload.taskId ?? `aigc_${Date.now()}`

  if (modality === 'text' && payload.text && !payload.file) {
    return analyzeText(algorithmKey, { task_id: taskId, text: payload.text })
  }
  if (payload.file) {
    return analyzeFile(algorithmKey, payload.file, {
      taskId,
      text: payload.text,
      modality,
    })
  }
  throw new Error('请提供文本内容或上传文件')
}

export async function fetchAigcReports(params?: Record<string, unknown>) {
  const { data } = await getAigcClient(30_000).get('/api/aigc/reports', { params })
  return unwrapGatewayData<{ items?: unknown[]; total?: number }>(data)
}

export async function fetchAigcReport(recordId: string | number) {
  const { data } = await getAigcClient(30_000).get(`/api/aigc/reports/${recordId}`)
  return unwrapGatewayData(data)
}

export async function fetchAigcReportDisplay(recordId: string | number) {
  const { data } = await getAigcClient(60_000).get(`/api/aigc/reports/${recordId}/display`)
  const payload = unwrapGatewayData<{ result?: unknown }>(data)
  return payload?.result ?? payload
}

export async function removeAigcReport(recordId: string | number) {
  const { data } = await getAigcClient(30_000).delete(`/api/aigc/reports/${recordId}`)
  return unwrapGatewayData(data)
}

export async function getAigcHealth() {
  const { data } = await getAigcClient(10_000).get('/api/aigc/health')
  return data
}

export async function fetchAigcAlgorithmList() {
  const { data } = await getAigcClient(10_000).get('/api/aigc/algorithms')
  return unwrapGatewayData(data)
}

export async function fetchAigcAlgorithmStatus(algorithmKey: string) {
  const { data } = await getAigcClient(10_000).get(`/api/aigc/${algorithmKey}/status`)
  return unwrapGatewayData(data)
}

export async function startAigcAlgorithm(algorithmKey: string) {
  const { data } = await getAigcClient(60_000).post(`/api/aigc/${algorithmKey}/start`)
  return unwrapGatewayData(data)
}

export async function stopAigcAlgorithm(algorithmKey: string) {
  const { data } = await getAigcClient(30_000).post(`/api/aigc/${algorithmKey}/stop`)
  return unwrapGatewayData(data)
}

export async function getAlgorithmHealth(algorithmKey: string) {
  const { data } = await getAigcClient(10_000).get(`/api/aigc/${algorithmKey}/health`)
  return data
}

export async function getAigcSamplesMeta() {
  const { data } = await getAigcClient(10_000).get('/api/aigc/samples/meta')
  return unwrapGatewayData(data)
}

export async function getAigcSamples(params?: Record<string, unknown>) {
  const { data } = await getAigcClient(10_000).get('/api/aigc/samples', { params })
  return unwrapGatewayData<{ items?: unknown[]; total?: number }>(data)
}

export async function fetchAigcSamples(params?: Record<string, unknown>) {
  return getAigcSamples(params)
}

export async function getRandomAigcSamples(params: {
  algorithmKey: string
  count?: number
  replace?: boolean
  categories?: string[]
  mediaType?: string
  taskType?: string
  seed?: string | number
}) {
  const {
    algorithmKey,
    count = 1,
    replace = true,
    categories,
    mediaType,
    taskType,
    seed,
  } = params

  const query: Record<string, unknown> = {
    algorithm_key: algorithmKey,
    count,
    replace,
  }
  if (categories?.length) query.categories = categories.join(',')
  if (mediaType) query.media_type = mediaType
  if (taskType) query.task_type = taskType
  if (seed != null) query.seed = seed

  const { data } = await getAigcClient(30_000).get('/api/aigc/samples/random', { params: query })
  return unwrapGatewayData<{ items?: Record<string, unknown>[] }>(data)
}

export async function getAigcSample(sampleId: string) {
  const { data } = await getAigcClient(10_000).get(`/api/aigc/samples/${sampleId}`)
  return unwrapGatewayData(data)
}

export async function downloadAigcSample(sampleId: string) {
  const response = await getAigcClient(120_000).get(`/api/aigc/samples/${sampleId}/download`, {
    responseType: 'blob',
  })
  return {
    blob: response.data as Blob,
    filename: parseContentDispositionFilename(response.headers['content-disposition']),
  }
}

export async function runBuiltinSampleAnalyze(
  sample: Record<string, unknown>,
  taskId?: string,
): Promise<Record<string, unknown>> {
  const algorithmKey = sample.algorithm_key as string | undefined
  if (!algorithmKey) throw new Error('样例缺少 algorithm_key')

  const resolvedTaskId = taskId ?? `builtin_${sample.sample_id}_${Date.now()}`

  if (isBuiltinSampleText(sample)) {
    const text = sample.text as string | undefined
    if (!text?.trim()) throw new Error('文本样例内容为空')
    return analyzeText(algorithmKey, { task_id: resolvedTaskId, text })
  }

  let blob: Blob
  if (sample.sample_id) {
    const downloaded = await downloadAigcSample(String(sample.sample_id))
    blob = downloaded.blob
  } else if (sample.download_url) {
    const path = String(sample.download_url).replace(/^https?:\/\/[^/]+/, '')
    const response = await getAigcClient(120_000).get(path, { responseType: 'blob' })
    blob = response.data as Blob
  } else {
    throw new Error('文件样例缺少 sample_id 或 download_url')
  }

  const mergedSample = {
    ...sample,
    file_name: sample.file_name ?? sample.filename,
  }
  const fileName = resolveSampleFileName(mergedSample, blob)
  const file = new File([blob], fileName, {
    type: resolveSampleMimeType(mergedSample, blob, fileName),
  })
  const mediaType = String(
    sample.media_type ?? inferMediaTypeFromAlgorithmKey(algorithmKey) ?? 'image',
  )
  return analyzeFile(algorithmKey, file, { taskId: resolvedTaskId, modality: mediaType })
}

export * from '@/api/aigc/keys'
export * from '@/api/aigc/mappers/reportMapper'
export * from '@/api/aigc/mappers/sampleMapper'
