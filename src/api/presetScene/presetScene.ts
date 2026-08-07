import { createTempClient } from '@/api/client';
import type {
  EvaluationTaskKind,
  PageQuery,
  PageResult,
  PresetScene,
  PresetSceneVo,
} from '@/api/types';
import { unwrapGatewayData } from '@/utils/gateway';

const pageInflight = new Map<string, Promise<PageResult<PresetScene>>>();

function pageCacheKey(query: PageQuery<PresetScene>): string {
  return JSON.stringify({
    pageSize: query.pageSize ?? null,
    pageCurrent: query.pageCurrent ?? null,
    orderColumn: query.orderColumn ?? null,
    orderType: query.orderType ?? null,
    entity: query.entity ?? null,
  });
}

/** 获取预制场景（前台创建任务卡片）；须传 evaluationTaskType */
export async function fetchPresetScenes(
  evaluationTaskType: EvaluationTaskKind,
): Promise<PresetSceneVo[]> {
  const client = createTempClient();
  const { data } = await client.get('/temp/preset-scene/presetScene', {
    params: { evaluationTaskType },
  });
  return unwrapGatewayData<PresetSceneVo[]>(data) || [];
}

export async function pagePresetScenes(
  query: PageQuery<PresetScene>,
): Promise<PageResult<PresetScene>> {
  const key = pageCacheKey(query);
  const existing = pageInflight.get(key);
  if (existing) return existing;

  const request = (async () => {
    const client = createTempClient();
    const { data } = await client.post('/temp/preset-scene/page', query, {
      headers: { 'Content-Type': 'application/json' },
    });
    return unwrapGatewayData<PageResult<PresetScene>>(data) || { records: [], total: 0 };
  })().finally(() => {
    pageInflight.delete(key);
  });

  pageInflight.set(key, request);
  return request;
}

export async function addPresetScene(payload: PresetScene): Promise<PresetScene> {
  const client = createTempClient();
  const { data } = await client.post('/temp/preset-scene/add', payload, {
    headers: { 'Content-Type': 'application/json' },
  });
  return unwrapGatewayData<PresetScene>(data);
}

export async function updatePresetScene(payload: PresetScene): Promise<boolean> {
  const client = createTempClient();
  const { data } = await client.put('/temp/preset-scene/update', payload, {
    headers: { 'Content-Type': 'application/json' },
  });
  return unwrapGatewayData<boolean>(data);
}

export async function getPresetSceneById(id: number): Promise<PresetScene> {
  const client = createTempClient();
  const { data } = await client.get('/temp/preset-scene/getDetailById', {
    params: { id },
  });
  return unwrapGatewayData<PresetScene>(data);
}

export async function deletePresetScene(id: number): Promise<boolean> {
  const client = createTempClient();
  const { data } = await client.delete('/temp/preset-scene/deleteOne', {
    params: { id },
  });
  return unwrapGatewayData<boolean>(data);
}

export async function batchDeletePresetScenes(ids: number[]): Promise<boolean> {
  const client = createTempClient();
  const { data } = await client.delete('/temp/preset-scene/batchDel', {
    params: { ids },
    paramsSerializer: { indexes: null },
  });
  return unwrapGatewayData<boolean>(data);
}

/** 管理端列表：按任务类型分页 */
export async function fetchPresetScenePage(params: {
  evaluationTaskType: EvaluationTaskKind;
  pageCurrent?: number;
  pageSize?: number;
  name?: string;
}): Promise<{ items: PresetScene[]; total: number }> {
  const entity: PresetScene = {
    evaluationTaskType: params.evaluationTaskType,
  };
  if (params.name?.trim()) entity.name = params.name.trim();
  const page = await pagePresetScenes({
    pageSize: params.pageSize ?? 10,
    pageCurrent: params.pageCurrent ?? 1,
    entity,
  });
  return {
    items: page.records || [],
    total: page.total ?? 0,
  };
}
