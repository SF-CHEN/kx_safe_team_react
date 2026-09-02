import { tempRequest } from '@/api/request'
import type {
  EvaluationDimensionType,
  EvaluationTask,
  EvaluationTaskKind,
  EvaluationUseModelType,
  PageQuery,
  PageResult,
} from '@/api/types'
import { unwrapGatewayData } from '@/utils/gateway'

/** evaluation-task 创建接口的真实输入模型，与后端返回 DTO 分离。 */
export interface CreateEvaluationTaskInput {
  type: EvaluationTaskKind
  name: string
  useModelType: EvaluationUseModelType
  modelId?: number
  /** CUSTOM 模型时使用的 JSON 配置。 */
  customModelConfig?: string
  sampleSize?: number
  evaluationDimensionType?: EvaluationDimensionType
  presumedSceneDimensionId?: number
  customDimensionIds?: string
  needSendEmail?: boolean
  email?: string
  userId?: number
  demandSupplement?: string
}

export async function addEvaluationTask(
  payload: CreateEvaluationTaskInput,
): Promise<EvaluationTask> {
  const { data } = await tempRequest.post('/temp/evaluation-task/add', payload, {
    headers: { 'Content-Type': 'application/json' },
  })
  return unwrapGatewayData<EvaluationTask>(data)
}

export async function getEvaluationTaskById(id: number): Promise<EvaluationTask> {
  const { data } = await tempRequest.get('/temp/evaluation-task/getDetailById', {
    params: { id },
  })
  return unwrapGatewayData<EvaluationTask>(data)
}

export async function pageEvaluationTasks(
  query: PageQuery<EvaluationTask>,
): Promise<PageResult<EvaluationTask>> {
  const { data } = await tempRequest.post('/temp/evaluation-task/page', query, {
    headers: { 'Content-Type': 'application/json' },
  })
  return unwrapGatewayData<PageResult<EvaluationTask>>(data)
}

export async function deleteEvaluationTask(id: number): Promise<boolean> {
  const { data } = await tempRequest.delete('/temp/evaluation-task/deleteOne', {
    params: { id },
  })
  return unwrapGatewayData<boolean>(data)
}

export async function batchDeleteEvaluationTasks(ids: number[]): Promise<boolean> {
  const { data } = await tempRequest.delete('/temp/evaluation-task/batchDel', {
    params: { ids },
    paramsSerializer: { indexes: null },
  })
  return unwrapGatewayData<boolean>(data)
}
