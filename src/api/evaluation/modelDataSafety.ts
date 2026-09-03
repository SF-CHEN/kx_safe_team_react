import {
  add5ModelDataSafetyEvaluationTask,
  batchDel6ModelDataSafetyEvaluationTask,
  deleteOne6ModelDataSafetyEvaluationTask,
  findPage6ModelDataSafetyEvaluationTask,
  getDetailById6ModelDataSafetyEvaluationTask,
  update5ModelDataSafetyEvaluationTask,
} from '@/api/generated/model-data-safety-evaluation-task'
import type { ModelDataSafetyEvaluationTask as GeneratedModelDataSafetyEvaluationTask } from '@/api/generated/types/model-data-safety-evaluation-task'
import { unwrapApiResult, unwrapApiResultOr } from '@/api/result'
import type {
  ModelDataSafetyEvaluationTask,
  PageQuery,
  PageResult,
} from '@/api/types'
import type { CreateFileEvaluationTaskInput } from './fileTask.types'

export async function addModelDataSafetyEvaluationTask(
  payload: CreateFileEvaluationTaskInput,
): Promise<ModelDataSafetyEvaluationTask> {
  const result = await add5ModelDataSafetyEvaluationTask(payload as GeneratedModelDataSafetyEvaluationTask)
  return unwrapApiResult(result, '创建模型数据安全评测任务失败') as ModelDataSafetyEvaluationTask
}

export async function updateModelDataSafetyEvaluationTask(
  payload: ModelDataSafetyEvaluationTask,
): Promise<boolean> {
  const result = await update5ModelDataSafetyEvaluationTask(payload as GeneratedModelDataSafetyEvaluationTask)
  return unwrapApiResult(result, '修改模型数据安全评测任务失败')
}

export async function getModelDataSafetyEvaluationTaskById(
  id: number,
): Promise<ModelDataSafetyEvaluationTask> {
  const result = await getDetailById6ModelDataSafetyEvaluationTask({ id })
  return unwrapApiResult(result, '获取模型数据安全评测任务失败') as ModelDataSafetyEvaluationTask
}

export async function pageModelDataSafetyEvaluationTasks(
  query: PageQuery<ModelDataSafetyEvaluationTask>,
): Promise<PageResult<ModelDataSafetyEvaluationTask>> {
  const result = await findPage6ModelDataSafetyEvaluationTask(
    query as Parameters<typeof findPage6ModelDataSafetyEvaluationTask>[0],
  )
  return unwrapApiResultOr(result, { records: [], total: 0 }, '查询模型数据安全评测任务失败') as PageResult<ModelDataSafetyEvaluationTask>
}

export async function deleteModelDataSafetyEvaluationTask(id: number): Promise<boolean> {
  const result = await deleteOne6ModelDataSafetyEvaluationTask({ id })
  return unwrapApiResult(result, '删除模型数据安全评测任务失败')
}

export async function batchDeleteModelDataSafetyEvaluationTasks(ids: number[]): Promise<boolean> {
  const result = await batchDel6ModelDataSafetyEvaluationTask({ ids })
  return unwrapApiResult(result, '批量删除模型数据安全评测任务失败')
}
