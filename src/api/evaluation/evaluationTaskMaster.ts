import {
  batchDel8EvaluationTaskMaster,
  deleteOne8EvaluationTaskMaster,
  deliverEvaluationTaskMaster as deliverEvaluationTaskMasterApi,
  findPage8EvaluationTaskMaster,
  getDetailById8EvaluationTaskMaster,
  supplementMaterialEvaluationTaskMaster,
} from '@/api/generated/evaluation-task-master'
import type {
  DeliverTaskSo,
  EvaluationTaskMaster,
  EvaluationTaskMasterDetailVo,
  SupplementMaterialSo,
} from '@/api/generated/types/evaluation-task-master'
import type { PageQuery, PageResult } from '@/api/pagination'
import { unwrapApiResult, unwrapApiResultOr } from '@/api/result'

export * from './taskMeta'

export async function pageEvaluationTaskMasters(
  query: PageQuery<EvaluationTaskMaster>,
): Promise<PageResult<EvaluationTaskMaster>> {
  return unwrapApiResultOr(
    await findPage8EvaluationTaskMaster(
      query as Parameters<typeof findPage8EvaluationTaskMaster>[0],
    ),
    { records: [], total: 0 },
    '查询任务列表失败',
  )
}

/** 详情返回 DetailVo（含用户名、材料、交付文件等）。 */
export async function getEvaluationTaskMasterById(
  id: number,
): Promise<EvaluationTaskMasterDetailVo> {
  return unwrapApiResult(await getDetailById8EvaluationTaskMaster({ id }), '获取任务详情失败')
}

/** 管理员交付：需先 uploadSysFile 得到 deliverFileId。 */
export async function deliverEvaluationTaskMaster(payload: DeliverTaskSo): Promise<boolean> {
  return unwrapApiResult(await deliverEvaluationTaskMasterApi(payload), '交付评测任务失败')
}

export async function deleteEvaluationTaskMaster(id: number): Promise<boolean> {
  return unwrapApiResult(await deleteOne8EvaluationTaskMaster({ id }), '删除评测任务失败')
}

export async function batchDeleteEvaluationTaskMasters(ids: number[]): Promise<boolean> {
  return unwrapApiResult(await batchDel8EvaluationTaskMaster({ ids }), '批量删除评测任务失败')
}

/** 用户补充材料（资源中心）。 */
export async function supplementEvaluationTaskMaterial(
  payload: SupplementMaterialSo,
): Promise<boolean> {
  return unwrapApiResult(
    await supplementMaterialEvaluationTaskMaster(payload),
    '补充评测材料失败',
  )
}

export type {
  DeliverTaskSo,
  EvaluationTaskMaster,
  EvaluationTaskMasterDetailVo,
  SupplementMaterialSo,
} from '@/api/generated/types/evaluation-task-master'
