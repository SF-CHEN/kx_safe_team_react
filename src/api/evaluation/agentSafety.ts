import { add9AgentSafetyEvaluationTask } from '@/api/generated/agent-safety-evaluation-task'
import type { AgentSafetyEvaluationTask } from '@/api/generated/types/agent-safety-evaluation-task'
import { unwrapApiResult } from '@/api/result'
import type { CreateFileEvaluationTaskInput } from './fileTask.types'

export async function addAgentSafetyEvaluationTask(
  payload: CreateFileEvaluationTaskInput,
): Promise<AgentSafetyEvaluationTask> {
  return unwrapApiResult(
    await add9AgentSafetyEvaluationTask(payload as AgentSafetyEvaluationTask),
    '创建智能体安全评测任务失败',
  )
}
