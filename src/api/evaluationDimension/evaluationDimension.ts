import { createTempClient } from '@/api/client';
import type {
  EvaluationDimension,
  EvaluationTaskKind,
  PageQuery,
  PageResult,
  TreeDropEvaluationDimension,
} from '@/api/types';
import { unwrapGatewayData } from '@/utils/gateway';

const pageInflight = new Map<string, Promise<PageResult<EvaluationDimension>>>();

function pageCacheKey(query: PageQuery<EvaluationDimension>): string {
  return JSON.stringify({
    pageSize: query.pageSize ?? null,
    pageCurrent: query.pageCurrent ?? null,
    orderColumn: query.orderColumn ?? null,
    orderType: query.orderType ?? null,
    entity: query.entity ?? null,
  });
}

/** 获取维度下拉树；须传 evaluationTaskType */
export async function fetchDimensionDropdown(
  evaluationTaskType: EvaluationTaskKind,
): Promise<TreeDropEvaluationDimension[]> {
  const client = createTempClient();
  const { data } = await client.get('/temp/evaluation-dimension/dimensionDropdown', {
    params: { evaluationTaskType },
  });
  return unwrapGatewayData<TreeDropEvaluationDimension[]>(data) || [];
}

/** 将维度下拉树展平为列表（选项/多选场景用） */
export function flattenTreeDropEvaluationDimension(
  nodes: TreeDropEvaluationDimension[],
): EvaluationDimension[] {
  const result: EvaluationDimension[] = [];
  const walk = (list: TreeDropEvaluationDimension[]) => {
    for (const node of list) {
      const item: EvaluationDimension = node.data
        ? { ...node.data, id: node.data.id ?? node.id, name: node.data.name ?? node.name }
        : { id: node.id, name: node.name };
      if (item.id != null) result.push(item);
      if (node.childs?.length) walk(node.childs);
    }
  };
  walk(nodes);
  return result;
}

/**
 * 拉取可选维度全量（管理端场景勾选子维度等）。
 * 必须用 dimensionDropdown，禁止用 page 硬拉一页凑选项。
 */
export async function fetchDimensionOptions(
  evaluationTaskType: EvaluationTaskKind,
): Promise<EvaluationDimension[]> {
  const tree = await fetchDimensionDropdown(evaluationTaskType);
  return flattenTreeDropEvaluationDimension(tree);
}

export async function pageEvaluationDimensions(
  query: PageQuery<EvaluationDimension>,
): Promise<PageResult<EvaluationDimension>> {
  const key = pageCacheKey(query);
  const existing = pageInflight.get(key);
  if (existing) return existing;

  const request = (async () => {
    const client = createTempClient();
    const { data } = await client.post('/temp/evaluation-dimension/page', query, {
      headers: { 'Content-Type': 'application/json' },
    });
    return (
      unwrapGatewayData<PageResult<EvaluationDimension>>(data) || {
        records: [],
        total: 0,
      }
    );
  })().finally(() => {
    pageInflight.delete(key);
  });

  pageInflight.set(key, request);
  return request;
}

export async function addEvaluationDimension(
  payload: EvaluationDimension,
): Promise<EvaluationDimension> {
  const client = createTempClient();
  const { data } = await client.post('/temp/evaluation-dimension/add', payload, {
    headers: { 'Content-Type': 'application/json' },
  });
  return unwrapGatewayData<EvaluationDimension>(data);
}

export async function updateEvaluationDimension(
  payload: EvaluationDimension,
): Promise<boolean> {
  const client = createTempClient();
  const { data } = await client.put('/temp/evaluation-dimension/update', payload, {
    headers: { 'Content-Type': 'application/json' },
  });
  return unwrapGatewayData<boolean>(data);
}

export async function getEvaluationDimensionById(
  id: number,
): Promise<EvaluationDimension> {
  const client = createTempClient();
  const { data } = await client.get('/temp/evaluation-dimension/getDetailById', {
    params: { id },
  });
  return unwrapGatewayData<EvaluationDimension>(data);
}

export async function deleteEvaluationDimension(id: number): Promise<boolean> {
  const client = createTempClient();
  const { data } = await client.delete('/temp/evaluation-dimension/deleteOne', {
    params: { id },
  });
  return unwrapGatewayData<boolean>(data);
}

export async function batchDeleteEvaluationDimensions(
  ids: number[],
): Promise<boolean> {
  const client = createTempClient();
  const { data } = await client.delete('/temp/evaluation-dimension/batchDel', {
    params: { ids },
    paramsSerializer: { indexes: null },
  });
  return unwrapGatewayData<boolean>(data);
}

/** 管理端列表：按任务类型分页 */
export async function fetchEvaluationDimensionPage(params: {
  evaluationTaskType: EvaluationTaskKind;
  pageCurrent?: number;
  pageSize?: number;
  name?: string;
}): Promise<{ items: EvaluationDimension[]; total: number }> {
  const entity: EvaluationDimension = {
    evaluationTaskType: params.evaluationTaskType,
  };
  if (params.name?.trim()) entity.name = params.name.trim();
  const page = await pageEvaluationDimensions({
    pageSize: params.pageSize ?? 10,
    pageCurrent: params.pageCurrent ?? 1,
    entity,
  });
  return {
    items: page.records || [],
    total: page.total ?? 0,
  };
}
