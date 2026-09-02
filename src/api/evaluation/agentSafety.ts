import { tempRequest } from '@/api/request'
import type {
  AgentSafetyEvaluationTask,
  PageQuery,
  PageResult,
} from '@/api/types'
import { unwrapGatewayData } from '@/utils/gateway'
import type { CreateFileEvaluationTaskInput } from './fileTask.types'

export async function addAgentSafetyEvaluationTask(
  payload: CreateFileEvaluationTaskInput,
): Promise<AgentSafetyEvaluationTask> {
  const { data } = await tempRequest.post('/temp/agent-safety-evaluation-task/add', payload, {
    headers: { 'Content-Type': 'application/json' },
  })
  return unwrapGatewayData<AgentSafetyEvaluationTask>(data)
}

export async function updateAgentSafetyEvaluationTask(
  payload: AgentSafetyEvaluationTask,
): Promise<boolean> {
  const { data } = await tempRequest.put('/temp/agent-safety-evaluation-task/update', payload, {
    headers: { 'Content-Type': 'application/json' },
  })
  return unwrapGatewayData<boolean>(data)
}

export async function getAgentSafetyEvaluationTaskById(
  id: number,
): Promise<AgentSafetyEvaluationTask> {
  const { data } = await tempRequest.get('/temp/agent-safety-evaluation-task/getDetailById', {
    params: { id },
  })
  return unwrapGatewayData<AgentSafetyEvaluationTask>(data)
}

export async function pageAgentSafetyEvaluationTasks(
  query: PageQuery<AgentSafetyEvaluationTask>,
): Promise<PageResult<AgentSafetyEvaluationTask>> {
  const { data } = await tempRequest.post('/temp/agent-safety-evaluation-task/page', query, {
    headers: { 'Content-Type': 'application/json' },
  })
  return unwrapGatewayData<PageResult<AgentSafetyEvaluationTask>>(data)
}

export async function deleteAgentSafetyEvaluationTask(id: number): Promise<boolean> {
  const { data } = await tempRequest.delete('/temp/agent-safety-evaluation-task/deleteOne', {
    params: { id },
  })
  return unwrapGatewayData<boolean>(data)
}

export async function batchDeleteAgentSafetyEvaluationTasks(ids: number[]): Promise<boolean> {
  const { data } = await tempRequest.delete('/temp/agent-safety-evaluation-task/batchDel', {
    params: { ids },
    paramsSerializer: { indexes: null },
  })
  return unwrapGatewayData<boolean>(data)
}
