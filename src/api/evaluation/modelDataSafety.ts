import {
  add5ModelDataSafetyEvaluationTask,
  batchDel6ModelDataSafetyEvaluationTask,
  deleteOne6ModelDataSafetyEvaluationTask,
  findPage6ModelDataSafetyEvaluationTask,
  getDetailById6ModelDataSafetyEvaluationTask,
  update5ModelDataSafetyEvaluationTask,
} from '@/api/generated/model-data-safety-evaluation-task'
import type { ModelDataSafetyEvaluationTask } from '@/api/generated/types/model-data-safety-evaluation-task'
import type { PageQuery, PageResult } from '@/api/pagination'
import { unwrapApiResult, unwrapApiResultOr } from '@/api/result'
import type { CreateFileEvaluationTaskInput } from './fileTask.types'

export async function addModelDataSafetyEvaluationTask(
  payload: CreateFileEvaluationTaskInput,
): Promise<ModelDataSafetyEvaluationTask> {
  return unwrapApiResult(
    await add5ModelDataSafetyEvaluationTask(payload as ModelDataSafetyEvaluationTask),
    '创建模型数据安全评测任务失败',
  )
}

export async function updateModelDataSafetyEvaluationTask(
  payload: ModelDataSafetyEvaluationTask,
): Promise<boolean> {
  return unwrapApiResult(
    await update5ModelDataSafetyEvaluationTask(payload),
    '修改模型数据安全评测任务失败',
  )
}

export async function getModelDataSafetyEvaluationTaskById(
  id: number,
): Promise<ModelDataSafetyEvaluationTask> {
  return unwrapApiResult(
    await getDetailById6ModelDataSafetyEvaluationTask({ id }),
    '获取模型数据安全评测任务失败',
  )
}

export async function pageModelDataSafetyEvaluationTasks(
  query: PageQuery<ModelDataSafetyEvaluationTask>,
): Promise<PageResult<ModelDataSafetyEvaluationTask>> {
  return unwrapApiResultOr(
    await findPage6ModelDataSafetyEvaluationTask(
      query as Parameters<typeof findPage6ModelDataSafetyEvaluationTask>[0],
    ),
    { records: [], total: 0 },
    '查询模型数据安全评测任务失败',
  )
}

export async function deleteModelDataSafetyEvaluationTask(id: number): Promise<boolean> {
  return unwrapApiResult(
    await deleteOne6ModelDataSafetyEvaluationTask({ id }),
    '删除模型数据安全评测任务失败',
  )
}

export async function batchDeleteModelDataSafetyEvaluationTasks(ids: number[]): Promise<boolean> {
  return unwrapApiResult(
    await batchDel6ModelDataSafetyEvaluationTask({ ids }),
    '批量删除模型数据安全评测任务失败',
  )
}

export type { ModelDataSafetyEvaluationTask } from '@/api/generated/types/model-data-safety-evaluation-task'
