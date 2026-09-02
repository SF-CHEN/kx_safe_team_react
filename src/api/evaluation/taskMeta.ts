import type {
  EvaluationTaskMasterProductType,
  EvaluationTaskMasterStatus,
  EvaluationTaskMasterSubmitType,
} from '@/api/types'

export type ResourceEvalType =
  | '模型数据安全评测'
  | '深度模型可信测评'
  | '大模型评测'
  | '大模型安全评测'
  | '智能体安全评测'

export function formatMasterDateTime(value?: string) {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleString('zh-CN', { hour12: false })
}

/** 后端总表状态 → 门户统一工作流状态。 */
export function mapMasterStatusToWorkflow(status?: string): string {
  const value = status?.trim()
  if (!value) return '处理中'

  const upper = value.toUpperCase()
  if (upper === 'AWAIT_SUPPLEMENT') return '待用户补充'
  if (upper === 'DELIVERED' || upper === 'COMPLETED') return '已交付'
  if (upper === 'TERMINATED' || upper === 'FAILED') return '已终止'
  if (upper === 'PROCESSING' || upper === 'WAITING') return '处理中'

  if (value === '待补充材料') return '待用户补充'
  if (value === '已推送') return '已交付'
  if (value === '处理异常') return '已终止'
  if (value === '待受理' || value === '材料已接收' || value === '待交付') return '处理中'
  return value
}

/** 门户工作流状态/筛选文案 → 后端正式状态枚举。 */
export function mapWorkflowStatusToMaster(status: string): EvaluationTaskMasterStatus {
  const value = status.trim()
  const upper = value.toUpperCase()
  if (
    upper === 'AWAIT_SUPPLEMENT' ||
    value === '待用户补充' ||
    value === '待补充材料'
  ) return 'AWAIT_SUPPLEMENT'

  if (
    upper === 'DELIVERED' ||
    upper === 'COMPLETED' ||
    value === '已交付' ||
    value === '已推送'
  ) return 'DELIVERED'

  if (
    upper === 'TERMINATED' ||
    upper === 'FAILED' ||
    value === '已终止' ||
    value === '处理异常'
  ) return 'TERMINATED'

  return 'PROCESSING'
}

export function mapMasterProductLabel(productType?: string): string {
  if (productType === 'PERFORMANCE') return '大模型性能评测'
  if (productType === 'SAFETY') return '大模型安全评测'
  if (productType === 'DATA_SAFETY') return '模型数据安全评测'
  if (productType === 'TRUST') return '深度模型可信测评'
  if (productType === 'AGENT_SAFETY') return '智能体安全评测'
  return productType?.trim() || '—'
}

/** 资源中心内部 evalType，保持现有 EvalTask 兼容值。 */
export function mapMasterEvalType(productType?: string): ResourceEvalType {
  if (productType === 'SAFETY') return '大模型安全评测'
  if (productType === 'DATA_SAFETY') return '模型数据安全评测'
  if (productType === 'TRUST') return '深度模型可信测评'
  if (productType === 'AGENT_SAFETY') return '智能体安全评测'
  return '大模型评测'
}

/** 资源中心产品筛选文案 → 后端产品枚举。 */
export function mapProductFilterToMaster(
  product: string,
): EvaluationTaskMasterProductType | undefined {
  if (product === '数据集安全评测' || product === '模型数据安全评测') return 'DATA_SAFETY'
  if (product === '深度模型可信测评') return 'TRUST'
  if (product === '大模型性能评测') return 'PERFORMANCE'
  if (product === '大模型安全评测') return 'SAFETY'
  if (product === '智能体安全评测') return 'AGENT_SAFETY'
  return undefined
}

/** 资源中心状态筛选文案 → 后端状态枚举。 */
export function mapStatusFilterToMaster(status: string): EvaluationTaskMasterStatus | undefined {
  if (status === '全部状态') return undefined
  if (status === '处理中') return 'PROCESSING'
  if (status === '待用户补充' || status === '待补充材料') return 'AWAIT_SUPPLEMENT'
  if (status === '已交付') return 'DELIVERED'
  if (status === '已终止') return 'TERMINATED'
  return undefined
}

export function mapMasterSubmitTypeLabel(submitType?: string) {
  if (submitType === 'LOCAL_PROJECT_FILE') return '本地工程文件'
  if (submitType === 'USER_MODEL') return '用户模型'
  return submitType?.trim() || '—'
}

export function masterRowId(id: number) {
  return `master:${id}`
}

export function parseMasterRowId(id: string): number | null {
  const matched = /^master:(\d+)$/i.exec(id.trim())
  if (matched) return Number(matched[1])
  const numeric = Number(id)
  return Number.isFinite(numeric) && numeric > 0 ? numeric : null
}

export function isMasterProductType(value?: string): value is EvaluationTaskMasterProductType {
  return (
    value === 'PERFORMANCE' ||
    value === 'SAFETY' ||
    value === 'DATA_SAFETY' ||
    value === 'TRUST' ||
    value === 'AGENT_SAFETY'
  )
}

export function isMasterSubmitType(value?: string): value is EvaluationTaskMasterSubmitType {
  return value === 'LOCAL_PROJECT_FILE' || value === 'USER_MODEL'
}
