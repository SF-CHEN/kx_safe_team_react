import {
  add6EvaluationTask,
  batchDel7EvaluationTask,
  deleteOne7EvaluationTask,
  findPage7EvaluationTask,
  getDetailById7EvaluationTask,
} from '@/api/generated/evaluation-task'
import type { EvaluationTask } from '@/api/generated/types/evaluation-task'
import type { PageQuery, PageResult } from '@/api/pagination'
import { unwrapApiResult, unwrapApiResultOr } from '@/api/result'

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

export async function getEvaluationTaskById(id: number): Promise<EvaluationTask> {
  return unwrapApiResult(await getDetailById7EvaluationTask({ id }), '获取评测任务失败')
}

export async function pageEvaluationTasks(
  query: PageQuery<EvaluationTask>,
): Promise<PageResult<EvaluationTask>> {
  // OpenAPI 的 PageQuery.entity 泛型信息丢失，只在 generated 调用边界转换。
  return unwrapApiResultOr(
    await findPage7EvaluationTask(query as Parameters<typeof findPage7EvaluationTask>[0]),
    { records: [], total: 0 },
    '查询评测任务失败',
  )
}

export async function deleteEvaluationTask(id: number): Promise<boolean> {
  return unwrapApiResult(await deleteOne7EvaluationTask({ id }), '删除评测任务失败')
}

export async function batchDeleteEvaluationTasks(ids: number[]): Promise<boolean> {
  return unwrapApiResult(await batchDel7EvaluationTask({ ids }), '批量删除评测任务失败')
}

export type { EvaluationTask } from '@/api/generated/types/evaluation-task'
