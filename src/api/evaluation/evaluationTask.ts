import { add6EvaluationTask } from '@/api/generated/evaluation-task'
import type { EvaluationTask } from '@/api/generated/types/evaluation-task'
import { unwrapApiResult } from '@/api/result'

export type EvaluationTaskKind = NonNullable<EvaluationTask['type']>
export type EvaluationUseModelType = NonNullable<EvaluationTask['useModelType']>
export type EvaluationDimensionType = NonNullable<EvaluationTask['evaluationDimensionType']>

/** 创建参数单独建模，避免把后端返回 DTO 的可选字段直接当表单输入。 */
export interface CreateEvaluationTaskInput {
  type: EvaluationTaskKind
  name: string
  useModelType: EvaluationUseModelType
  modelId?: number
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

export async function addEvaluationTask(payload: CreateEvaluationTaskInput): Promise<EvaluationTask> {
  if (!payload.name.trim()) throw new Error('创建评测任务缺少 name')

  return unwrapApiResult(
    await add6EvaluationTask({ ...payload, name: payload.name.trim() }),
    '创建评测任务失败',
  )
}

export type { EvaluationTask } from '@/api/generated/types/evaluation-task'
