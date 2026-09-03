import {
  formatMasterDateTime,
  mapMasterEvalType,
  mapMasterStatusToWorkflow,
  mapMasterSubmitTypeLabel,
  masterRowId,
  pageEvaluationTaskMasters,
} from '@/api/evaluation/evaluationTaskMaster'
import type { EvaluationTaskMaster } from '@/api/generated/types/evaluation-task-master'
import type {
  EvaluationTaskMasterProductType,
  EvaluationTaskMasterStatus,
  ResourceEvalType,
  ResourceTaskStatus,
} from './taskMeta'

/** 资源中心列表行（对齐门户展示字段，不含附件二进制）。 */
export interface MyResourceTask {
  id: string
  numericId: number
  name: string
  model: string
  modelType: string
  evalSet: string
  evalType: ResourceEvalType
  status: ResourceTaskStatus
  createdAt: string
  requirement?: string
  configSummary?: string
  supplementFileId?: number
  deliverFileId?: number
}

export interface FetchMyResourceTasksQuery {
  userId: number
  pageCurrent: number
  pageSize: number
  name?: string
  id?: number
  productType?: EvaluationTaskMasterProductType
  status?: EvaluationTaskMasterStatus
}

export interface MyResourceTaskPage {
  items: MyResourceTask[]
  total: number
}

function fileIdOrUndef(id?: number) {
  return id != null && Number.isFinite(id) && id > 0 ? id : undefined
}

function mapMaster(row: EvaluationTaskMaster): MyResourceTask | null {
  if (row.id == null) return null
  const name = row.name?.trim() || `任务 #${row.id}`
  const target = row.targetObject?.trim() || '—'
  const summaryBits = [
    row.configSummary?.trim() || '',
    row.submitType ? `提交方式：${mapMasterSubmitTypeLabel(row.submitType)}` : '',
    row.taskRefId != null ? `关联任务 #${row.taskRefId}` : '',
  ].filter(Boolean)

  return {
    id: masterRowId(row.id),
    numericId: row.id,
    name,
    model: target,
    modelType: mapMasterSubmitTypeLabel(row.submitType),
    evalSet: name,
    evalType: mapMasterEvalType(row.productType),
    status: mapMasterStatusToWorkflow(row.status),
    createdAt: formatMasterDateTime(row.createdAt),
    requirement: name,
    configSummary: summaryBits.join(' · ') || undefined,
    supplementFileId: fileIdOrUndef(row.supplementFileId),
    deliverFileId: fileIdOrUndef(row.deliverFileId),
  }
}

function compactEntity(entity: EvaluationTaskMaster): EvaluationTaskMaster {
  const next: EvaluationTaskMaster = { userId: entity.userId }
  if (entity.id != null) next.id = entity.id
  if (entity.name) next.name = entity.name
  if (entity.productType) next.productType = entity.productType
  if (entity.status) next.status = entity.status
  return next
}

/** 资源中心：按当前用户分页拉取评测任务总表。 */
export async function fetchMyResourceTasks(
  query: FetchMyResourceTasksQuery,
): Promise<MyResourceTaskPage> {
  const page = await pageEvaluationTaskMasters({
    pageSize: query.pageSize,
    pageCurrent: query.pageCurrent,
    orderColumn: 'createdAt',
    orderType: 'desc',
    entity: compactEntity({
      userId: query.userId,
      id: query.id,
      name: query.name,
      productType: query.productType,
      status: query.status,
    }),
  })

  return {
    items: (page.records || [])
      .map(mapMaster)
      .filter((row): row is MyResourceTask => row != null),
    total: Number(page.total) || 0,
  }
}
