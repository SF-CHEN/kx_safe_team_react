import { add4ModelTrustEvaluationTask } from '@/api/generated/model-trust-evaluation-task'
import type { ModelTrustEvaluationTask } from '@/api/generated/types/model-trust-evaluation-task'
import { unwrapApiResult } from '@/api/result'
import type { CreateFileEvaluationTaskInput } from './fileTask.types'

export async function addModelTrustEvaluationTask(
  payload: CreateFileEvaluationTaskInput,
): Promise<ModelTrustEvaluationTask> {
  return unwrapApiResult(
    await add4ModelTrustEvaluationTask(payload as ModelTrustEvaluationTask),
    '创建模型可信评测任务失败',
  )
}

export type { ModelTrustEvaluationTask } from '@/api/generated/types/model-trust-evaluation-task'
