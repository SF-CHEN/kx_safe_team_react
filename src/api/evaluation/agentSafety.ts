import {
  add9AgentSafetyEvaluationTask,
  batchDel11AgentSafetyEvaluationTask,
  deleteOne11AgentSafetyEvaluationTask,
  findPage11AgentSafetyEvaluationTask,
  getDetailById11AgentSafetyEvaluationTask,
  update8AgentSafetyEvaluationTask,
} from '@/api/generated/agent-safety-evaluation-task'
import type { AgentSafetyEvaluationTask } from '@/api/generated/types/agent-safety-evaluation-task'
import type { PageQuery, PageResult } from '@/api/pagination'
import { unwrapApiResult, unwrapApiResultOr } from '@/api/result'
import type { CreateFileEvaluationTaskInput } from './fileTask.types'

export async function addAgentSafetyEvaluationTask(
  payload: CreateFileEvaluationTaskInput,
): Promise<AgentSafetyEvaluationTask> {
  return unwrapApiResult(
    await add9AgentSafetyEvaluationTask(payload as AgentSafetyEvaluationTask),
    '创建智能体安全评测任务失败',
  )
}

export async function updateAgentSafetyEvaluationTask(
  payload: AgentSafetyEvaluationTask,
): Promise<boolean> {
  return unwrapApiResult(
    await update8AgentSafetyEvaluationTask(payload),
    '修改智能体安全评测任务失败',
  )
}

export async function getAgentSafetyEvaluationTaskById(
  id: number,
): Promise<AgentSafetyEvaluationTask> {
  return unwrapApiResult(
    await getDetailById11AgentSafetyEvaluationTask({ id }),
    '获取智能体安全评测任务失败',
  )
}

export async function pageAgentSafetyEvaluationTasks(
  query: PageQuery<AgentSafetyEvaluationTask>,
): Promise<PageResult<AgentSafetyEvaluationTask>> {
  return unwrapApiResultOr(
    await findPage11AgentSafetyEvaluationTask(
      query as Parameters<typeof findPage11AgentSafetyEvaluationTask>[0],
    ),
    { records: [], total: 0 },
    '查询智能体安全评测任务失败',
  )
}

export async function deleteAgentSafetyEvaluationTask(id: number): Promise<boolean> {
  return unwrapApiResult(
    await deleteOne11AgentSafetyEvaluationTask({ id }),
    '删除智能体安全评测任务失败',
  )
}

export async function batchDeleteAgentSafetyEvaluationTasks(ids: number[]): Promise<boolean> {
  return unwrapApiResult(
    await batchDel11AgentSafetyEvaluationTask({ ids }),
    '批量删除智能体安全评测任务失败',
  )
}
