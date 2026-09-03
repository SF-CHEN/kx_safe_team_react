import {
  add6EvaluationTask,
  batchDel7EvaluationTask,
  deleteOne7EvaluationTask,
  findPage7EvaluationTask,
  getDetailById7EvaluationTask,
} from '@/api/generated/evaluation-task'
import type { EvaluationTask as GeneratedEvaluationTask } from '@/api/generated/types/evaluation-task'
import { unwrapApiResult, unwrapApiResultOr } from '@/api/result'
import type {
  EvaluationDimensionType,
  EvaluationTask,
  EvaluationTaskKind,
  EvaluationUseModelType,
  PageQuery,
  PageResult,
} from '@/api/types'

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
 * generated DTO 与旧业务 DTO 字段目前一致；这里集中转换，避免页面直接依赖自动生成文件路径。
 * 后端 OpenAPI 变化时优先让 generated 重新生成，再只在此处处理业务兼容。
 */
function toBusinessTask(task: GeneratedEvaluationTask): EvaluationTask {
  return task as EvaluationTask
}

export async function addEvaluationTask(
  payload: CreateEvaluationTaskInput | EvaluationTask,
): Promise<EvaluationTask> {
  const input = normalizeCreateInput(payload)
  const result = await add6EvaluationTask(input)
  return toBusinessTask(unwrapApiResult(result, '创建评测任务失败'))
}

export async function getEvaluationTaskById(id: number): Promise<EvaluationTask> {
  const result = await getDetailById7EvaluationTask({ id })
  return toBusinessTask(unwrapApiResult(result, '获取评测任务失败'))
}

export async function pageEvaluationTasks(
  query: PageQuery<EvaluationTask>,
): Promise<PageResult<EvaluationTask>> {
  // OpenAPI 中 PageQuery.entity 的泛型信息已丢失，generated 将它误生成为 UserContact；
  // HTTP 参数结构本身正确，因此只在 generated 边界做一次窄化转换，不修改自动生成文件。
  const result = await findPage7EvaluationTask(query as Parameters<typeof findPage7EvaluationTask>[0])
  const page = unwrapApiResultOr(result, { records: [], total: 0 }, '查询评测任务失败')
  return page as PageResult<EvaluationTask>
}

export async function deleteEvaluationTask(id: number): Promise<boolean> {
  const result = await deleteOne7EvaluationTask({ id })
  return unwrapApiResult(result, '删除评测任务失败')
}

export async function batchDeleteEvaluationTasks(ids: number[]): Promise<boolean> {
  const result = await batchDel7EvaluationTask({ ids })
  return unwrapApiResult(result, '批量删除评测任务失败')
}
