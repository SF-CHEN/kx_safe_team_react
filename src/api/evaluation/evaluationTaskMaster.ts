import { tempRequest } from '@/api/request'
import type {
  DeliverTaskSo,
  EvaluationTaskMaster,
  EvaluationTaskMasterDetailVo,
  PageQuery,
  PageResult,
  SupplementMaterialSo,
} from '@/api/types'
import { unwrapGatewayData } from '@/utils/gateway'

export * from './taskMeta'

export async function pageEvaluationTaskMasters(
  query: PageQuery<EvaluationTaskMaster>,
): Promise<PageResult<EvaluationTaskMaster>> {
  const { data } = await tempRequest.post('/temp/evaluation-task-master/page', query, {
    headers: { 'Content-Type': 'application/json' },
  })
  return unwrapGatewayData<PageResult<EvaluationTaskMaster>>(data)
}

/** 详情返回 DetailVo（含用户名、材料、交付文件等）。 */
export async function getEvaluationTaskMasterById(
  id: number,
): Promise<EvaluationTaskMasterDetailVo> {
  const { data } = await tempRequest.get('/temp/evaluation-task-master/getDetailById', {
    params: { id },
  })
  return unwrapGatewayData<EvaluationTaskMasterDetailVo>(data)
}

/** 管理员交付：需先 uploadSysFile 得到 deliverFileId。 */
export async function deliverEvaluationTaskMaster(payload: DeliverTaskSo): Promise<boolean> {
  const { data } = await tempRequest.post('/temp/evaluation-task-master/deliver', payload, {
    headers: { 'Content-Type': 'application/json' },
  })
  return unwrapGatewayData<boolean>(data)
}

export async function deleteEvaluationTaskMaster(id: number): Promise<boolean> {
  const { data } = await tempRequest.delete('/temp/evaluation-task-master/deleteOne', {
    params: { id },
  })
  return unwrapGatewayData<boolean>(data)
}

export async function batchDeleteEvaluationTaskMasters(ids: number[]): Promise<boolean> {
  const { data } = await tempRequest.delete('/temp/evaluation-task-master/batchDel', {
    params: { ids },
    paramsSerializer: { indexes: null },
  })
  return unwrapGatewayData<boolean>(data)
}

/** 用户补充材料（资源中心）。 */
export async function supplementEvaluationTaskMaterial(
  payload: SupplementMaterialSo,
): Promise<boolean> {
  const { data } = await tempRequest.post(
    '/temp/evaluation-task-master/supplementMaterial',
    payload,
    { headers: { 'Content-Type': 'application/json' } },
  )
  return unwrapGatewayData<boolean>(data)
}
