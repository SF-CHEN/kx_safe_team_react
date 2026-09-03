import {
  formatMasterDateTime,
  getEvaluationTaskMasterById,
  isMasterProductType,
  isMasterSubmitType,
  mapMasterProductLabel,
  mapMasterStatusToWorkflow,
  mapMasterSubmitTypeLabel,
  masterRowId,
  pageEvaluationTaskMasters,
  deliverEvaluationTaskMaster,
} from '@/api/evaluation/evaluationTaskMaster'
import {
  adminReplyEvaluationTask,
  listCommunicationsByMasterId,
} from '@/api/evaluation/evaluationTaskMasterCommunication'
import type { EvaluationTaskMaster } from '@/api/generated/types/evaluation-task-master'
import type { EvaluationTaskMasterCommunication } from '@/api/generated/types/evaluation-task-master-communication'
import { uploadSysFile } from '@/api/file'
import type {
  EvaluationTaskMasterProductType,
  EvaluationTaskMasterSubmitType,
  ResourceEvalType,
  ResourceTaskStatus,
} from './taskMeta'

export type AdminEvalSource = 'trust' | 'data-safety' | 'evaluation'

export interface AdminEvalFileRef {
  id: string
  name: string
  size: number
}

export interface AdminEvalCommunication {
  id: string
  sender: 'admin' | 'user' | 'system'
  type: '补充材料请求' | '补充材料提交' | '交付说明' | '终止通知' | '状态更新'
  content: string
  createdAt: string
}

/** 管理端列表行：直接输出门户标准产品与状态。 */
export interface AdminEvalTaskRow {
  id: string
  source: AdminEvalSource
  numericId: number
  taskRefId?: number
  productType: EvaluationTaskMasterProductType
  submitType?: EvaluationTaskMasterSubmitType
  userId: string
  userName: string
  contact: string
  name: string
  product: ResourceEvalType
  model: string
  requirement: string
  configSummary?: string
  status: ResourceTaskStatus
  createdAt: string
  updatedAt: string
  /** 列表态可能为空；选中后由详情补齐 */
  inputs: AdminEvalFileRef[]
  outputs: AdminEvalFileRef[]
  communications: AdminEvalCommunication[]
  pushedAt?: string
}

export interface AdminEvalTaskDetail {
  requirement: string
  userName: string
  contact: string
  configSummary?: string
  status: ResourceTaskStatus
  inputs: AdminEvalFileRef[]
  outputs: AdminEvalFileRef[]
  communications: AdminEvalCommunication[]
  pushedAt?: string
}

const LIST_PAGE_SIZE = 200

function sourceFromProduct(productType: EvaluationTaskMasterProductType): AdminEvalSource {
  if (productType === 'TRUST') return 'trust'
  if (productType === 'DATA_SAFETY') return 'data-safety'
  return 'evaluation'
}

function fileRef(id?: number, name?: string, size = 0): AdminEvalFileRef | null {
  if (id == null || !Number.isFinite(id) || id <= 0) return null
  return {
    id: String(id),
    name: name?.trim() || `文件 #${id}`,
    size,
  }
}

function mapCommunications(
  rows: EvaluationTaskMasterCommunication[],
): AdminEvalCommunication[] {
  const items: AdminEvalCommunication[] = []
  for (const row of rows) {
    const createdAt = formatMasterDateTime(row.createdAt)
    const baseId = row.id != null ? String(row.id) : `comm-${createdAt}`
    if (row.adminComment?.trim()) {
      const isTerminate = row.handleResult === 'TERMINATE'
      items.push({
        id: `${baseId}-admin`,
        sender: 'admin',
        type: isTerminate ? '终止通知' : '补充材料请求',
        content: row.adminComment.trim(),
        createdAt,
      })
    }
    if (row.userReplied) {
      const fileHint =
        row.supplementFileName?.trim() ||
        (row.supplementFileId != null ? `文件 #${row.supplementFileId}` : '')
      items.push({
        id: `${baseId}-user`,
        sender: 'user',
        type: '补充材料提交',
        content: fileHint ? `已补充材料：${fileHint}` : '用户已回复补充材料',
        createdAt: formatMasterDateTime(row.updatedAt) || createdAt,
      })
    }
  }
  return items
}

function mapMaster(row: EvaluationTaskMaster): AdminEvalTaskRow | null {
  if (row.id == null || !isMasterProductType(row.productType)) return null
  const name = row.name?.trim() || `任务 #${row.id}`
  const target = row.targetObject?.trim() || '—'
  const deliver = fileRef(row.deliverFileId)
  const supplement = fileRef(row.supplementFileId)
  const status = mapMasterStatusToWorkflow(row.status)

  return {
    id: masterRowId(row.id),
    source: sourceFromProduct(row.productType),
    numericId: row.id,
    taskRefId: row.taskRefId,
    productType: row.productType,
    submitType: isMasterSubmitType(row.submitType) ? row.submitType : undefined,
    userId: row.userId != null ? String(row.userId) : '—',
    userName: row.userId != null ? `用户 #${row.userId}` : '—',
    contact: '—',
    name,
    product: mapMasterProductLabel(row.productType),
    model: target,
    requirement: name,
    configSummary:
      [
        row.configSummary?.trim() || '',
        row.submitType ? `提交方式：${mapMasterSubmitTypeLabel(row.submitType)}` : '',
        row.taskRefId != null ? `关联任务 #${row.taskRefId}` : '',
      ]
        .filter(Boolean)
        .join(' · ') || undefined,
    status,
    createdAt: formatMasterDateTime(row.createdAt),
    updatedAt: formatMasterDateTime(row.updatedAt),
    inputs: supplement ? [supplement] : [],
    outputs: deliver ? [deliver] : [],
    communications: [],
    pushedAt: status === '已交付' ? formatMasterDateTime(row.updatedAt) : undefined,
  }
}

function sortByCreatedDesc(a: AdminEvalTaskRow, b: AdminEvalTaskRow) {
  return String(b.createdAt).localeCompare(String(a.createdAt), 'zh-CN')
}

export interface AdminEvalTaskPage {
  items: AdminEvalTaskRow[]
  total: number
}

/** 分页拉取评测任务总表；可按 userId 过滤 */
export async function fetchAdminEvaluationTaskPage(options?: {
  userId?: number
  pageSize?: number
  pageCurrent?: number
}): Promise<AdminEvalTaskPage> {
  const page = await pageEvaluationTaskMasters({
    pageSize: options?.pageSize ?? LIST_PAGE_SIZE,
    pageCurrent: options?.pageCurrent ?? 1,
    orderColumn: 'createdAt',
    orderType: 'desc',
    entity: options?.userId != null ? { userId: options.userId } : undefined,
  })
  const records = page.records || []
  return {
    items: records
      .map(mapMaster)
      .filter((row): row is AdminEvalTaskRow => row != null)
      .sort(sortByCreatedDesc),
    total: Number(page.total) || 0,
  }
}

/** 拉取评测任务总表（返回当前页 items；需要 total 时用 fetchAdminEvaluationTaskPage） */
export async function fetchAdminEvaluationTasks(options?: {
  userId?: number
  pageSize?: number
  pageCurrent?: number
}): Promise<AdminEvalTaskRow[]> {
  return (await fetchAdminEvaluationTaskPage(options)).items
}

/** 选中任务后补齐详情、材料与沟通记录 */
export async function fetchAdminEvaluationTaskDetail(
  masterId: number,
): Promise<AdminEvalTaskDetail> {
  const [detail, communications] = await Promise.all([
    getEvaluationTaskMasterById(masterId),
    listCommunicationsByMasterId(masterId),
  ])

  const inputs: AdminEvalFileRef[] = []
  const evalMaterial = fileRef(
    detail.evaluationMaterialFileId,
    detail.evaluationMaterialName || detail.materialName,
  )
  if (evalMaterial) inputs.push(evalMaterial)
  const supplement = fileRef(detail.supplementFileId, detail.materialName)
  if (supplement && !inputs.some((item) => item.id === supplement.id)) inputs.push(supplement)

  const deliver = fileRef(detail.deliverFileId, detail.deliverFileName)
  const status = mapMasterStatusToWorkflow(detail.status)

  return {
    requirement: detail.evaluationRequirement?.trim() || '—',
    userName: detail.username?.trim() || '—',
    contact: detail.email?.trim() || '—',
    configSummary: detail.configSummary?.trim() || undefined,
    status,
    inputs,
    outputs: deliver ? [deliver] : [],
    communications: mapCommunications(communications),
    pushedAt: status === '已交付' ? formatMasterDateTime(detail.createdAt) : undefined,
  }
}

export async function adminRequestSupplement(
  masterId: number,
  adminComment: string,
): Promise<void> {
  await adminReplyEvaluationTask({
    evaluationTaskMasterId: masterId,
    handleResult: 'REQUEST_SUPPLEMENT',
    adminComment: adminComment.trim(),
  })
}

export async function adminTerminateTask(
  masterId: number,
  adminComment: string,
): Promise<void> {
  await adminReplyEvaluationTask({
    evaluationTaskMasterId: masterId,
    handleResult: 'TERMINATE',
    adminComment: adminComment.trim(),
  })
}

/** 上传交付文件并确认交付（接口仅支持单个 deliverFileId） */
export async function adminDeliverTask(masterId: number, file: File): Promise<void> {
  const uploaded = await uploadSysFile(file)
  if (uploaded.id == null) throw new Error('交付文件上传成功但未返回文件 id')
  await deliverEvaluationTaskMaster({ id: masterId, deliverFileId: uploaded.id })
}
