import {
  add4ModelTrustEvaluationTask,
  batchDel5ModelTrustEvaluationTask,
  deleteOne5ModelTrustEvaluationTask,
  findPage5ModelTrustEvaluationTask,
  getDetailById5ModelTrustEvaluationTask,
  update4ModelTrustEvaluationTask,
} from '@/api/generated/model-trust-evaluation-task'
import type { ModelTrustEvaluationTask as GeneratedModelTrustEvaluationTask } from '@/api/generated/types/model-trust-evaluation-task'
import { unwrapApiResult, unwrapApiResultOr } from '@/api/result'
import type {
  ModelTrustEvaluationTask,
  PageQuery,
  PageResult,
} from '@/api/types'
import type { CreateFileEvaluationTaskInput } from './fileTask.types'

export async function addModelTrustEvaluationTask(
  payload: CreateFileEvaluationTaskInput,
): Promise<ModelTrustEvaluationTask> {
  const result = await add4ModelTrustEvaluationTask(payload as GeneratedModelTrustEvaluationTask)
  return unwrapApiResult(result, '创建模型可信评测任务失败') as ModelTrustEvaluationTask
}

export async function updateModelTrustEvaluationTask(
  payload: ModelTrustEvaluationTask,
): Promise<boolean> {
  const result = await update4ModelTrustEvaluationTask(payload as GeneratedModelTrustEvaluationTask)
  return unwrapApiResult(result, '修改模型可信评测任务失败')
}

export async function getModelTrustEvaluationTaskById(
  id: number,
): Promise<ModelTrustEvaluationTask> {
  const result = await getDetailById5ModelTrustEvaluationTask({ id })
  return unwrapApiResult(result, '获取模型可信评测任务失败') as ModelTrustEvaluationTask
}

export async function pageModelTrustEvaluationTasks(
  query: PageQuery<ModelTrustEvaluationTask>,
): Promise<PageResult<ModelTrustEvaluationTask>> {
  const result = await findPage5ModelTrustEvaluationTask(
    query as Parameters<typeof findPage5ModelTrustEvaluationTask>[0],
  )
  return unwrapApiResultOr(result, { records: [], total: 0 }, '查询模型可信评测任务失败') as PageResult<ModelTrustEvaluationTask>
}

export async function deleteModelTrustEvaluationTask(id: number): Promise<boolean> {
  const result = await deleteOne5ModelTrustEvaluationTask({ id })
  return unwrapApiResult(result, '删除模型可信评测任务失败')
}

export async function batchDeleteModelTrustEvaluationTasks(ids: number[]): Promise<boolean> {
  const result = await batchDel5ModelTrustEvaluationTask({ ids })
  return unwrapApiResult(result, '批量删除模型可信评测任务失败')
}
