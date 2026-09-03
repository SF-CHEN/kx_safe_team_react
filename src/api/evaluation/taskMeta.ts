import type { EvaluationTaskMaster } from '@/api/generated/types/evaluation-task-master'

export type EvaluationTaskMasterProductType = NonNullable<EvaluationTaskMaster['productType']>
export type EvaluationTaskMasterStatus = NonNullable<EvaluationTaskMaster['status']>
export type EvaluationTaskMasterSubmitType = NonNullable<EvaluationTaskMaster['submitType']>

export type ResourceEvalType =
  | '数据集安全评测'
  | '深度模型可信测评'
  | '大模型性能评测'
  | '大模型安全评测'
  | '智能体安全评测'

export type ResourceTaskStatus = '处理中' | '待用户补充' | '已交付' | '已终止'

export function formatMasterDateTime(value?: string) {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleString('zh-CN', { hour12: false })
}

/** 后端总表状态 → 门户工作流状态。 */
export function mapMasterStatusToWorkflow(
  status?: EvaluationTaskMasterStatus,
): ResourceTaskStatus {
  if (status === 'AWAIT_SUPPLEMENT') return '待用户补充'
  if (status === 'DELIVERED') return '已交付'
  if (status === 'TERMINATED') return '已终止'
  return '处理中'
}

/** 门户工作流状态 → 后端状态。 */
export function mapWorkflowStatusToMaster(status: ResourceTaskStatus): EvaluationTaskMasterStatus {
  if (status === '待用户补充') return 'AWAIT_SUPPLEMENT'
  if (status === '已交付') return 'DELIVERED'
  if (status === '已终止') return 'TERMINATED'
  return 'PROCESSING'
}

export function mapMasterProductLabel(productType?: EvaluationTaskMasterProductType): string {
  if (productType === 'PERFORMANCE') return '大模型性能评测'
  if (productType === 'SAFETY') return '大模型安全评测'
  if (productType === 'DATA_SAFETY') return '数据集安全评测'
  if (productType === 'TRUST') return '深度模型可信测评'
  if (productType === 'AGENT_SAFETY') return '智能体安全评测'
  return '—'
}

export function mapMasterEvalType(productType?: EvaluationTaskMasterProductType): ResourceEvalType {
  if (productType === 'SAFETY') return '大模型安全评测'
  if (productType === 'DATA_SAFETY') return '数据集安全评测'
  if (productType === 'TRUST') return '深度模型可信测评'
  if (productType === 'AGENT_SAFETY') return '智能体安全评测'
  return '大模型性能评测'
}

/** 资源中心产品筛选文案 → 后端产品枚举。 */
export function mapProductFilterToMaster(
  product: string,
): EvaluationTaskMasterProductType | undefined {
  if (product === '数据集安全评测') return 'DATA_SAFETY'
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
  if (status === '待用户补充') return 'AWAIT_SUPPLEMENT'
  if (status === '已交付') return 'DELIVERED'
  if (status === '已终止') return 'TERMINATED'
  return undefined
}

export function mapMasterSubmitTypeLabel(submitType?: EvaluationTaskMasterSubmitType) {
  if (submitType === 'LOCAL_PROJECT_FILE') return '本地工程文件'
  if (submitType === 'USER_MODEL') return '用户模型'
  return '—'
}

export function masterRowId(id: number) {
  return `master:${id}`
}

export function parseMasterRowId(id: string): number | null {
  const matched = /^master:(\d+)$/i.exec(id.trim())
  return matched ? Number(matched[1]) : null
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
