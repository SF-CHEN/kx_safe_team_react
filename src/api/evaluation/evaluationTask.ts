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

function normalizeCreateInput(payload: EvaluationTask | CreateEvaluationTaskInput): CreateEvaluationTaskInput {
  if (!payload.type) throw new Error('创建评测任务缺少 type')
  if (!payload.name?.trim()) throw new Error('创建评测任务缺少 name')
  if (!payload.useModelType) throw new Error('创建评测任务缺少 useModelType')

  return {
    ...payload,
    type: payload.type,
    name: payload.name.trim(),
    useModelType: payload.useModelType,
  }
}

/**
 * 旧页面仍可能持有宽松的 EvaluationTask DTO，因此这里保留兼容输入并在 API 边界做运行时收窄。
 * 新代码必须直接使用 CreateEvaluationTaskInput。
 */
export async function addEvaluationTask(
  payload: CreateEvaluationTaskInput | EvaluationTask,
): Promise<EvaluationTask> {
  const input = normalizeCreateInput(payload)
  const { data } = await tempRequest.post('/temp/evaluation-task/add', input, {
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
