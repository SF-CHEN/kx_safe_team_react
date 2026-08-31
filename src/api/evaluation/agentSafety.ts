import { createTempClient } from '@/api/client';
import type {
  AgentSafetyEvaluationTask,
  PageQuery,
  PageResult,
} from '@/api/types';
import { unwrapGatewayData } from '@/utils/gateway';

export async function addAgentSafetyEvaluationTask(
  payload: AgentSafetyEvaluationTask,
): Promise<AgentSafetyEvaluationTask> {
  const client = createTempClient();
  const { data } = await client.post('/temp/agent-safety-evaluation-task/add', payload, {
    headers: { 'Content-Type': 'application/json' },
  });
  return unwrapGatewayData<AgentSafetyEvaluationTask>(data);
}

export async function updateAgentSafetyEvaluationTask(
  payload: AgentSafetyEvaluationTask,
): Promise<boolean> {
  const client = createTempClient();
  const { data } = await client.put('/temp/agent-safety-evaluation-task/update', payload, {
    headers: { 'Content-Type': 'application/json' },
  });
  return unwrapGatewayData<boolean>(data);
}

export async function getAgentSafetyEvaluationTaskById(
  id: number,
): Promise<AgentSafetyEvaluationTask> {
  const client = createTempClient();
  const { data } = await client.get('/temp/agent-safety-evaluation-task/getDetailById', {
    params: { id },
  });
  return unwrapGatewayData<AgentSafetyEvaluationTask>(data);
}

export async function pageAgentSafetyEvaluationTasks(
  query: PageQuery<AgentSafetyEvaluationTask>,
): Promise<PageResult<AgentSafetyEvaluationTask>> {
  const client = createTempClient();
  const { data } = await client.post('/temp/agent-safety-evaluation-task/page', query, {
    headers: { 'Content-Type': 'application/json' },
  });
  return unwrapGatewayData<PageResult<AgentSafetyEvaluationTask>>(data);
}

export async function deleteAgentSafetyEvaluationTask(id: number): Promise<boolean> {
  const client = createTempClient();
  const { data } = await client.delete('/temp/agent-safety-evaluation-task/deleteOne', {
    params: { id },
  });
  return unwrapGatewayData<boolean>(data);
}

export async function batchDeleteAgentSafetyEvaluationTasks(
  ids: number[],
): Promise<boolean> {
  const client = createTempClient();
  const { data } = await client.delete('/temp/agent-safety-evaluation-task/batchDel', {
    params: { ids },
    paramsSerializer: { indexes: null },
  });
  return unwrapGatewayData<boolean>(data);
}
