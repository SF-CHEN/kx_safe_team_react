import { tempRequest } from '@/api/request'
import type {
  ModelTrustEvaluationTask,
  PageQuery,
  PageResult,
} from '@/api/types'
import { unwrapGatewayData } from '@/utils/gateway'
import type { CreateFileEvaluationTaskInput } from './fileTask.types'

export async function addModelTrustEvaluationTask(
  payload: CreateFileEvaluationTaskInput,
): Promise<ModelTrustEvaluationTask> {
  const { data } = await tempRequest.post('/temp/model-trust-evaluation-task/add', payload, {
    headers: { 'Content-Type': 'application/json' },
  })
  return unwrapGatewayData<ModelTrustEvaluationTask>(data)
}

export async function updateModelTrustEvaluationTask(
  payload: ModelTrustEvaluationTask,
): Promise<boolean> {
  const { data } = await tempRequest.put('/temp/model-trust-evaluation-task/update', payload, {
    headers: { 'Content-Type': 'application/json' },
  })
  return unwrapGatewayData<boolean>(data)
}

export async function getModelTrustEvaluationTaskById(
  id: number,
): Promise<ModelTrustEvaluationTask> {
  const { data } = await tempRequest.get('/temp/model-trust-evaluation-task/getDetailById', {
    params: { id },
  })
  return unwrapGatewayData<ModelTrustEvaluationTask>(data)
}

export async function pageModelTrustEvaluationTasks(
  query: PageQuery<ModelTrustEvaluationTask>,
): Promise<PageResult<ModelTrustEvaluationTask>> {
  const { data } = await tempRequest.post('/temp/model-trust-evaluation-task/page', query, {
    headers: { 'Content-Type': 'application/json' },
  })
  return unwrapGatewayData<PageResult<ModelTrustEvaluationTask>>(data)
}

export async function deleteModelTrustEvaluationTask(id: number): Promise<boolean> {
  const { data } = await tempRequest.delete('/temp/model-trust-evaluation-task/deleteOne', {
    params: { id },
  })
  return unwrapGatewayData<boolean>(data)
}

export async function batchDeleteModelTrustEvaluationTasks(ids: number[]): Promise<boolean> {
  const { data } = await tempRequest.delete('/temp/model-trust-evaluation-task/batchDel', {
    params: { ids },
    paramsSerializer: { indexes: null },
  })
  return unwrapGatewayData<boolean>(data)
}
