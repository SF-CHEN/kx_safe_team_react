import {
  add9AgentSafetyEvaluationTask,
  batchDel11AgentSafetyEvaluationTask,
  deleteOne11AgentSafetyEvaluationTask,
  findPage11AgentSafetyEvaluationTask,
  getDetailById11AgentSafetyEvaluationTask,
  update8AgentSafetyEvaluationTask,
} from '@/api/generated/agent-safety-evaluation-task'
import type { AgentSafetyEvaluationTask as GeneratedAgentSafetyEvaluationTask } from '@/api/generated/types/agent-safety-evaluation-task'
import { unwrapApiResult, unwrapApiResultOr } from '@/api/result'
import type {
  AgentSafetyEvaluationTask,
  PageQuery,
  PageResult,
} from '@/api/types'
import type { CreateFileEvaluationTaskInput } from './fileTask.types'

export async function addAgentSafetyEvaluationTask(
  payload: CreateFileEvaluationTaskInput,
): Promise<AgentSafetyEvaluationTask> {
  const result = await add9AgentSafetyEvaluationTask(payload as GeneratedAgentSafetyEvaluationTask)
  return unwrapApiResult(result, '创建智能体安全评测任务失败') as AgentSafetyEvaluationTask
}

export async function updateAgentSafetyEvaluationTask(
  payload: AgentSafetyEvaluationTask,
): Promise<boolean> {
  const result = await update8AgentSafetyEvaluationTask(payload as GeneratedAgentSafetyEvaluationTask)
  return unwrapApiResult(result, '修改智能体安全评测任务失败')
}

export async function getAgentSafetyEvaluationTaskById(
  id: number,
): Promise<AgentSafetyEvaluationTask> {
  const result = await getDetailById11AgentSafetyEvaluationTask({ id })
  return unwrapApiResult(result, '获取智能体安全评测任务失败') as AgentSafetyEvaluationTask
}

export async function pageAgentSafetyEvaluationTasks(
  query: PageQuery<AgentSafetyEvaluationTask>,
): Promise<PageResult<AgentSafetyEvaluationTask>> {
  const result = await findPage11AgentSafetyEvaluationTask(
    query as Parameters<typeof findPage11AgentSafetyEvaluationTask>[0],
  )
  return unwrapApiResultOr(result, { records: [], total: 0 }, '查询智能体安全评测任务失败') as PageResult<AgentSafetyEvaluationTask>
}

export async function deleteAgentSafetyEvaluationTask(id: number): Promise<boolean> {
  const result = await deleteOne11AgentSafetyEvaluationTask({ id })
  return unwrapApiResult(result, '删除智能体安全评测任务失败')
}

export async function batchDeleteAgentSafetyEvaluationTasks(ids: number[]): Promise<boolean> {
  const result = await batchDel11AgentSafetyEvaluationTask({ ids })
  return unwrapApiResult(result, '批量删除智能体安全评测任务失败')
}
