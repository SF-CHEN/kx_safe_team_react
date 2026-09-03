import {
  batchDel8EvaluationTaskMaster,
  deleteOne8EvaluationTaskMaster,
  deliverEvaluationTaskMaster as deliverEvaluationTaskMasterApi,
  findPage8EvaluationTaskMaster,
  getDetailById8EvaluationTaskMaster,
  supplementMaterialEvaluationTaskMaster,
} from '@/api/generated/evaluation-task-master'
import { unwrapApiResult, unwrapApiResultOr } from '@/api/result'
import type {
  DeliverTaskSo,
  EvaluationTaskMaster,
  EvaluationTaskMasterDetailVo,
  PageQuery,
  PageResult,
  SupplementMaterialSo,
} from '@/api/types'

export * from './taskMeta'

export async function pageEvaluationTaskMasters(
  query: PageQuery<EvaluationTaskMaster>,
): Promise<PageResult<EvaluationTaskMaster>> {
  // OpenAPI 未保留 PageQuery.entity 泛型，只在 generated 边界转换。
  const result = await findPage8EvaluationTaskMaster(
    query as Parameters<typeof findPage8EvaluationTaskMaster>[0],
  )
  return unwrapApiResultOr(result, { records: [], total: 0 }, '查询任务列表失败') as PageResult<EvaluationTaskMaster>
}

/** 详情返回 DetailVo（含用户名、材料、交付文件等）。 */
export async function getEvaluationTaskMasterById(
  id: number,
): Promise<EvaluationTaskMasterDetailVo> {
  const result = await getDetailById8EvaluationTaskMaster({ id })
  return unwrapApiResult(result, '获取任务详情失败') as EvaluationTaskMasterDetailVo
}

/** 管理员交付：需先 uploadSysFile 得到 deliverFileId。 */
export async function deliverEvaluationTaskMaster(payload: DeliverTaskSo): Promise<boolean> {
  const result = await deliverEvaluationTaskMasterApi(payload)
  return unwrapApiResult(result, '交付评测任务失败')
}

export async function deleteEvaluationTaskMaster(id: number): Promise<boolean> {
  const result = await deleteOne8EvaluationTaskMaster({ id })
  return unwrapApiResult(result, '删除评测任务失败')
}

export async function batchDeleteEvaluationTaskMasters(ids: number[]): Promise<boolean> {
  const result = await batchDel8EvaluationTaskMaster({ ids })
  return unwrapApiResult(result, '批量删除评测任务失败')
}

/** 用户补充材料（资源中心）。 */
export async function supplementEvaluationTaskMaterial(
  payload: SupplementMaterialSo,
): Promise<boolean> {
  const result = await supplementMaterialEvaluationTaskMaster(payload)
  return unwrapApiResult(result, '补充评测材料失败')
}
