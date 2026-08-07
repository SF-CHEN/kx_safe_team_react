import { createTempClient } from '@/api/client';
import type { EvaluationTask, PageQuery, PageResult } from '@/api/types';
import { unwrapGatewayData } from '@/utils/gateway';

export async function addEvaluationTask(
  payload: EvaluationTask,
): Promise<EvaluationTask> {
  const client = createTempClient();
  const { data } = await client.post('/temp/evaluation-task/add', payload, {
    headers: { 'Content-Type': 'application/json' },
  });
  return unwrapGatewayData<EvaluationTask>(data);
}

export async function getEvaluationTaskById(id: number): Promise<EvaluationTask> {
  const client = createTempClient();
  const { data } = await client.get('/temp/evaluation-task/getDetailById', {
    params: { id },
  });
  return unwrapGatewayData<EvaluationTask>(data);
}

export async function pageEvaluationTasks(
  query: PageQuery<EvaluationTask>,
): Promise<PageResult<EvaluationTask>> {
  const client = createTempClient();
  const { data } = await client.post('/temp/evaluation-task/page', query, {
    headers: { 'Content-Type': 'application/json' },
  });
  return unwrapGatewayData<PageResult<EvaluationTask>>(data);
}

export async function deleteEvaluationTask(id: number): Promise<boolean> {
  const client = createTempClient();
  const { data } = await client.delete('/temp/evaluation-task/deleteOne', {
    params: { id },
  });
  return unwrapGatewayData<boolean>(data);
}

export async function batchDeleteEvaluationTasks(ids: number[]): Promise<boolean> {
  const client = createTempClient();
  const { data } = await client.delete('/temp/evaluation-task/batchDel', {
    params: { ids },
    paramsSerializer: { indexes: null },
  });
  return unwrapGatewayData<boolean>(data);
}
