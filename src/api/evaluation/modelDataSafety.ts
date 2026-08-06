import { createTempClient } from '@/api/client';
import type {
  ModelDataSafetyEvaluationTask,
  PageQuery,
  PageResult,
} from '@/api/types';
import { unwrapGatewayData } from '@/utils/gateway';

export async function addModelDataSafetyEvaluationTask(
  payload: ModelDataSafetyEvaluationTask,
): Promise<ModelDataSafetyEvaluationTask> {
  const client = createTempClient();
  const { data } = await client.post('/temp/model-data-safety-evaluation-task/add', payload, {
    headers: { 'Content-Type': 'application/json' },
  });
  return unwrapGatewayData<ModelDataSafetyEvaluationTask>(data);
}

export async function updateModelDataSafetyEvaluationTask(
  payload: ModelDataSafetyEvaluationTask,
): Promise<boolean> {
  const client = createTempClient();
  const { data } = await client.put('/temp/model-data-safety-evaluation-task/update', payload, {
    headers: { 'Content-Type': 'application/json' },
  });
  return unwrapGatewayData<boolean>(data);
}

export async function getModelDataSafetyEvaluationTaskById(
  id: number,
): Promise<ModelDataSafetyEvaluationTask> {
  const client = createTempClient();
  const { data } = await client.get('/temp/model-data-safety-evaluation-task/getDetailById', {
    params: { id },
  });
  return unwrapGatewayData<ModelDataSafetyEvaluationTask>(data);
}

export async function pageModelDataSafetyEvaluationTasks(
  query: PageQuery<ModelDataSafetyEvaluationTask>,
): Promise<PageResult<ModelDataSafetyEvaluationTask>> {
  const client = createTempClient();
  const { data } = await client.post('/temp/model-data-safety-evaluation-task/page', query, {
    headers: { 'Content-Type': 'application/json' },
  });
  return unwrapGatewayData<PageResult<ModelDataSafetyEvaluationTask>>(data);
}

export async function deleteModelDataSafetyEvaluationTask(id: number): Promise<boolean> {
  const client = createTempClient();
  const { data } = await client.delete('/temp/model-data-safety-evaluation-task/deleteOne', {
    params: { id },
  });
  return unwrapGatewayData<boolean>(data);
}

export async function batchDeleteModelDataSafetyEvaluationTasks(
  ids: number[],
): Promise<boolean> {
  const client = createTempClient();
  const { data } = await client.delete('/temp/model-data-safety-evaluation-task/batchDel', {
    params: { ids },
    paramsSerializer: { indexes: null },
  });
  return unwrapGatewayData<boolean>(data);
}
