import { add5ModelDataSafetyEvaluationTask } from '@/api/generated/model-data-safety-evaluation-task'
import type { ModelDataSafetyEvaluationTask } from '@/api/generated/types/model-data-safety-evaluation-task'
import { unwrapApiResult } from '@/api/result'
import type { CreateFileEvaluationTaskInput } from './fileTask.types'

export async function addModelDataSafetyEvaluationTask(
  payload: CreateFileEvaluationTaskInput,
): Promise<ModelDataSafetyEvaluationTask> {
  return unwrapApiResult(
    await add5ModelDataSafetyEvaluationTask(payload as ModelDataSafetyEvaluationTask),
    '创建模型数据安全评测任务失败',
  )
}

export type { ModelDataSafetyEvaluationTask } from '@/api/generated/types/model-data-safety-evaluation-task'
