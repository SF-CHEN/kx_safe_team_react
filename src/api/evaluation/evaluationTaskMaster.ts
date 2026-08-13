import { createTempClient } from '@/api/client';
import type {
  EvaluationTaskMaster,
  EvaluationTaskMasterProductType,
  EvaluationTaskMasterStatus,
  EvaluationTaskMasterSubmitType,
  PageQuery,
  PageResult,
} from '@/api/types';
import { unwrapGatewayData } from '@/utils/gateway';

export async function updateEvaluationTaskMaster(
  payload: EvaluationTaskMaster,
): Promise<boolean> {
  const client = createTempClient();
  const { data } = await client.put('/temp/evaluation-task-master/update', payload, {
    headers: { 'Content-Type': 'application/json' },
  });
  return unwrapGatewayData<boolean>(data);
}

export async function pageEvaluationTaskMasters(
  query: PageQuery<EvaluationTaskMaster>,
): Promise<PageResult<EvaluationTaskMaster>> {
  const client = createTempClient();
  const { data } = await client.post('/temp/evaluation-task-master/page', query, {
    headers: { 'Content-Type': 'application/json' },
  });
  return unwrapGatewayData<PageResult<EvaluationTaskMaster>>(data);
}

export async function getEvaluationTaskMasterById(
  id: number,
): Promise<EvaluationTaskMaster> {
  const client = createTempClient();
  const { data } = await client.get('/temp/evaluation-task-master/getDetailById', {
    params: { id },
  });
  return unwrapGatewayData<EvaluationTaskMaster>(data);
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
  if (upper === 'COMPLETED') return '已交付';
  if (upper === 'FAILED') return '已终止';
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
  if (upper === 'COMPLETED' || value === '已交付' || value === '已推送') {
    return 'COMPLETED';
  }
  if (upper === 'FAILED' || value === '已终止' || value === '处理异常') {
    return 'FAILED';
  }
  if (upper === 'WAITING') return 'WAITING';
  return 'PROCESSING';
}

export function mapMasterProductLabel(
  productType?: string,
): string {
  if (productType === 'PERFORMANCE') return '大模型性能评测';
  if (productType === 'SAFETY') return '大模型安全评测';
  if (productType === 'DATA_SAFETY') return '模型数据安全评测';
  if (productType === 'TRUST') return '深度模型可信测评';
  return productType?.trim() || '—';
}

/** 资源中心 evalType：性能走「大模型评测」，由页面 productLabel 再显示为性能评测 */
export function mapMasterEvalType(
  productType?: string,
): '模型数据安全评测' | '深度模型可信测评' | '大模型评测' | '大模型安全评测' {
  if (productType === 'SAFETY') return '大模型安全评测';
  if (productType === 'DATA_SAFETY') return '模型数据安全评测';
  if (productType === 'TRUST') return '深度模型可信测评';
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

export function isMasterProductType(
  value?: string,
): value is EvaluationTaskMasterProductType {
  return (
    value === 'PERFORMANCE' ||
    value === 'SAFETY' ||
    value === 'DATA_SAFETY' ||
    value === 'TRUST'
  );
}

export function isMasterSubmitType(
  value?: string,
): value is EvaluationTaskMasterSubmitType {
  return value === 'LOCAL_PROJECT_FILE' || value === 'USER_MODEL';
}
