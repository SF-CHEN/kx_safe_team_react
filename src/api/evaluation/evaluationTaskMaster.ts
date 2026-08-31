import { createTempClient } from '@/api/client';
import type {
  DeliverTaskSo,
  EvaluationTaskMaster,
  EvaluationTaskMasterDetailVo,
  EvaluationTaskMasterProductType,
  EvaluationTaskMasterStatus,
  EvaluationTaskMasterSubmitType,
  PageQuery,
  PageResult,
  SupplementMaterialSo,
} from '@/api/types';
import { unwrapGatewayData } from '@/utils/gateway';

const pageInflight = new Map<string, Promise<PageResult<EvaluationTaskMaster>>>();
const pageFailAt = new Map<string, number>();
const PAGE_FAIL_COOLDOWN_MS = 4000;

function masterPageKey(query: PageQuery<EvaluationTaskMaster>) {
  const entity = query.entity;
  return JSON.stringify({
    pageSize: query.pageSize ?? null,
    pageCurrent: query.pageCurrent ?? null,
    orderColumn: query.orderColumn ?? null,
    orderType: query.orderType ?? null,
    id: entity?.id ?? null,
    name: entity?.name ?? null,
    productType: entity?.productType ?? null,
    status: entity?.status ?? null,
    targetObject: entity?.targetObject ?? null,
    userId: entity?.userId ?? null,
  });
}

export async function pageEvaluationTaskMasters(
  query: PageQuery<EvaluationTaskMaster>,
): Promise<PageResult<EvaluationTaskMaster>> {
  const key = masterPageKey(query);
  const pending = pageInflight.get(key);
  if (pending) return pending;

  const failedAt = pageFailAt.get(key);
  if (failedAt && Date.now() - failedAt < PAGE_FAIL_COOLDOWN_MS) {
    throw new Error('评测任务列表暂时不可用，请稍后重试');
  }

  const request = (async () => {
    const client = createTempClient();
    const { data } = await client.post('/temp/evaluation-task-master/page', query, {
      headers: { 'Content-Type': 'application/json' },
    });
    return unwrapGatewayData<PageResult<EvaluationTaskMaster>>(data);
  })();

  pageInflight.set(key, request);
  try {
    const result = await request;
    pageFailAt.delete(key);
    return result;
  } catch (err) {
    pageFailAt.set(key, Date.now());
    throw err;
  } finally {
    pageInflight.delete(key);
  }
}

/** 详情返回 DetailVo（含用户名、材料、交付文件等） */
export async function getEvaluationTaskMasterById(
  id: number,
): Promise<EvaluationTaskMasterDetailVo> {
  const client = createTempClient();
  const { data } = await client.get('/temp/evaluation-task-master/getDetailById', {
    params: { id },
  });
  return unwrapGatewayData<EvaluationTaskMasterDetailVo>(data);
}

/** 管理员交付：需先 uploadSysFile 得到 deliverFileId */
export async function deliverEvaluationTaskMaster(
  payload: DeliverTaskSo,
): Promise<boolean> {
  const client = createTempClient();
  const { data } = await client.post('/temp/evaluation-task-master/deliver', payload, {
    headers: { 'Content-Type': 'application/json' },
  });
  return unwrapGatewayData<boolean>(data);
}

export async function deleteEvaluationTaskMaster(id: number): Promise<boolean> {
  const client = createTempClient();
  const { data } = await client.delete('/temp/evaluation-task-master/deleteOne', {
    params: { id },
  });
  return unwrapGatewayData<boolean>(data);
}

export async function batchDeleteEvaluationTaskMasters(
  ids: number[],
): Promise<boolean> {
  const client = createTempClient();
  const { data } = await client.delete('/temp/evaluation-task-master/batchDel', {
    params: { ids },
    paramsSerializer: { indexes: null },
  });
  return unwrapGatewayData<boolean>(data);
}

/** 用户补充材料（资源中心） */
export async function supplementEvaluationTaskMaterial(
  payload: SupplementMaterialSo,
): Promise<boolean> {
  const client = createTempClient();
  const { data } = await client.post(
    '/temp/evaluation-task-master/supplementMaterial',
    payload,
    { headers: { 'Content-Type': 'application/json' } },
  );
  return unwrapGatewayData<boolean>(data);
}

export function formatMasterDateTime(value?: string) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString('zh-CN', { hour12: false });
}

/** 总表英文态 → 现有工作流中文态（资源中心 / 管理端分组依赖这四个值） */
export function mapMasterStatusToWorkflow(status?: string): string {
  const value = status?.trim();
  if (!value) return '处理中';

  const upper = value.toUpperCase();
  if (upper === 'AWAIT_SUPPLEMENT') return '待用户补充';
  if (upper === 'DELIVERED' || upper === 'COMPLETED') return '已交付';
  if (upper === 'TERMINATED' || upper === 'FAILED') return '已终止';
  if (upper === 'PROCESSING' || upper === 'WAITING') return '处理中';

  if (value === '待补充材料') return '待用户补充';
  if (value === '已推送') return '已交付';
  if (value === '处理异常') return '已终止';
  if (
    value === '待受理' ||
    value === '材料已接收' ||
    value === '待交付'
  ) {
    return '处理中';
  }
  return value;
}

/** 中文工作流态 → 总表正式枚举（筛选 / 展示用；改状态请走 adminReply / deliver） */
export function mapWorkflowStatusToMaster(
  status: string,
): EvaluationTaskMasterStatus {
  const value = status.trim();
  const upper = value.toUpperCase();
  if (
    upper === 'AWAIT_SUPPLEMENT' ||
    value === '待用户补充' ||
    value === '待补充材料'
  ) {
    return 'AWAIT_SUPPLEMENT';
  }
  if (
    upper === 'DELIVERED' ||
    upper === 'COMPLETED' ||
    value === '已交付' ||
    value === '已推送'
  ) {
    return 'DELIVERED';
  }
  if (
    upper === 'TERMINATED' ||
    upper === 'FAILED' ||
    value === '已终止' ||
    value === '处理异常'
  ) {
    return 'TERMINATED';
  }
  return 'PROCESSING';
}

export function mapMasterProductLabel(
  productType?: string,
): string {
  if (productType === 'PERFORMANCE') return '大模型性能评测';
  if (productType === 'SAFETY') return '大模型安全评测';
  if (productType === 'DATA_SAFETY') return '模型数据安全评测';
  if (productType === 'TRUST') return '深度模型可信测评';
  if (productType === 'AGENT_SAFETY') return '智能体安全评测';
  return productType?.trim() || '—';
}

/** 资源中心 evalType：性能走「大模型评测」，由页面 productLabel 再显示为性能评测 */
export function mapMasterEvalType(
  productType?: string,
): '模型数据安全评测' | '深度模型可信测评' | '大模型评测' | '大模型安全评测' | '智能体安全评测' {
  if (productType === 'SAFETY') return '大模型安全评测';
  if (productType === 'DATA_SAFETY') return '模型数据安全评测';
  if (productType === 'TRUST') return '深度模型可信测评';
  if (productType === 'AGENT_SAFETY') return '智能体安全评测';
  return '大模型评测';
}

export function mapMasterSubmitTypeLabel(submitType?: string) {
  if (submitType === 'LOCAL_PROJECT_FILE') return '本地工程文件';
  if (submitType === 'USER_MODEL') return '用户模型';
  return submitType?.trim() || '—';
}

export function masterRowId(id: number) {
  return `master:${id}`;
}

export function parseMasterRowId(id: string): number | null {
  const matched = /^master:(\d+)$/i.exec(id.trim());
  if (matched) return Number(matched[1]);
  const numeric = Number(id);
  return Number.isFinite(numeric) && numeric > 0 ? numeric : null;
}

export function isMasterProductType(
  value?: string,
): value is EvaluationTaskMasterProductType {
  return (
    value === 'PERFORMANCE' ||
    value === 'SAFETY' ||
    value === 'DATA_SAFETY' ||
    value === 'TRUST' ||
    value === 'AGENT_SAFETY'
  );
}

export function isMasterSubmitType(
  value?: string,
): value is EvaluationTaskMasterSubmitType {
  return value === 'LOCAL_PROJECT_FILE' || value === 'USER_MODEL';
}
