import {
  add4ModelTrustEvaluationTask,
  batchDel5ModelTrustEvaluationTask,
  deleteOne5ModelTrustEvaluationTask,
  findPage5ModelTrustEvaluationTask,
  getDetailById5ModelTrustEvaluationTask,
  update4ModelTrustEvaluationTask,
} from '@/api/generated/model-trust-evaluation-task'
import type { ModelTrustEvaluationTask } from '@/api/generated/types/model-trust-evaluation-task'
import type { PageQuery, PageResult } from '@/api/pagination'
import { unwrapApiResult, unwrapApiResultOr } from '@/api/result'
import type { CreateFileEvaluationTaskInput } from './fileTask.types'

export async function addModelTrustEvaluationTask(
  payload: CreateFileEvaluationTaskInput,
): Promise<ModelTrustEvaluationTask> {
  return unwrapApiResult(
    await add4ModelTrustEvaluationTask(payload as ModelTrustEvaluationTask),
    '创建模型可信评测任务失败',
  )
}

export async function updateModelTrustEvaluationTask(
  payload: ModelTrustEvaluationTask,
): Promise<boolean> {
  return unwrapApiResult(
    await update4ModelTrustEvaluationTask(payload),
    '修改模型可信评测任务失败',
  )
}

export async function getModelTrustEvaluationTaskById(
  id: number,
): Promise<ModelTrustEvaluationTask> {
  return unwrapApiResult(
    await getDetailById5ModelTrustEvaluationTask({ id }),
    '获取模型可信评测任务失败',
  )
}

export async function pageModelTrustEvaluationTasks(
  query: PageQuery<ModelTrustEvaluationTask>,
): Promise<PageResult<ModelTrustEvaluationTask>> {
  return unwrapApiResultOr(
    await findPage5ModelTrustEvaluationTask(
      query as Parameters<typeof findPage5ModelTrustEvaluationTask>[0],
    ),
    { records: [], total: 0 },
    '查询模型可信评测任务失败',
  )
}

export async function deleteModelTrustEvaluationTask(id: number): Promise<boolean> {
  return unwrapApiResult(
    await deleteOne5ModelTrustEvaluationTask({ id }),
    '删除模型可信评测任务失败',
  )
}

export async function batchDeleteModelTrustEvaluationTasks(ids: number[]): Promise<boolean> {
  return unwrapApiResult(
    await batchDel5ModelTrustEvaluationTask({ ids }),
    '批量删除模型可信评测任务失败',
  )
}

export type { ModelTrustEvaluationTask } from '@/api/generated/types/model-trust-evaluation-task'
