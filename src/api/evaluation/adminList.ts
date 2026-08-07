import { pageEvaluationTasks } from '@/api/evaluation/evaluationTask';
import {
  pageModelDataSafetyEvaluationTasks,
  updateModelDataSafetyEvaluationTask,
} from '@/api/evaluation/modelDataSafety';
import {
  pageModelTrustEvaluationTasks,
  updateModelTrustEvaluationTask,
} from '@/api/evaluation/modelTrust';
import { fetchSysFilesByIds } from '@/api/file';
import type {
  EvaluationTask,
  ModelDataSafetyEvaluationTask,
  ModelTrustEvaluationTask,
  SysFile,
} from '@/api/types';

export type AdminEvalSource = 'trust' | 'data-safety' | 'evaluation';

/** 管理端列表行：对齐现有 WorkflowTask 展示字段，缺省用 — */
export interface AdminEvalTaskRow {
  id: string;
  source: AdminEvalSource;
  numericId: number;
  userId: string;
  userName: string;
  contact: string;
  name: string;
  product: string;
  model: string;
  requirement: string;
  configSummary?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  fileId?: number;
  emailStatus?: string;
  inputs: Array<{ id: string; name: string; size: number }>;
  outputs: Array<{ id: string; name: string }>;
}

const LIST_PAGE_SIZE = 200;

function formatDateTime(value?: string) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString('zh-CN', { hour12: false });
}

function buildConfigSummary(fileId?: number, emailStatus?: string) {
  const parts: string[] = [];
  if (fileId != null) parts.push(`关联文件 ID：${fileId}`);
  if (emailStatus) parts.push(`邮件状态：${emailStatus}`);
  return parts.length ? parts.join(' · ') : undefined;
}

function parseCustomModelName(config?: string) {
  if (!config?.trim()) return '—';
  try {
    const parsed = JSON.parse(config) as {
      name?: string;
      modelName?: string;
      baseUrl?: string;
    };
    return parsed.name || parsed.modelName || parsed.baseUrl || '—';
  } catch {
    return '—';
  }
}

function formatEvaluationProduct(type?: string) {
  const value = type?.trim();
  if (value === 'PERFORMANCE' || value === '大模型性能评测' || value === '大模型评测') {
    return '大模型性能评测';
  }
  if (value === 'SAFETY' || value === '大模型安全评测') return '大模型安全评测';
  if (value === '多模态大模型安全评测') return '多模态大模型安全评测';
  return value || '大模型评测';
}

function buildEvaluationConfigSummary(row: EvaluationTask) {
  const parts: string[] = [];
  if (row.useModelType) parts.push(`模型来源：${row.useModelType}`);
  if (row.evaluationDimensionType) parts.push(`维度：${row.evaluationDimensionType}`);
  if (row.presumedSceneDimensionId != null) {
    parts.push(`预设场景 ID：${row.presumedSceneDimensionId}`);
  }
  if (row.needSendEmail) parts.push(`邮件：${row.email || '已开启'}`);
  if (row.hasSendEmail) parts.push('邮件已发送');
  return parts.length ? parts.join(' · ') : undefined;
}

function requirementText(value?: string) {
  const text = value?.trim();
  return text || '—';
}

function taskTitle(id: number | undefined, requirement?: string) {
  const text = requirement?.trim();
  if (text) return text.length > 48 ? `${text.slice(0, 48)}…` : text;
  return id != null ? `任务 #${id}` : '未命名任务';
}

function inputsFromFile(fileId: number | undefined, fileMap: Map<number, SysFile>) {
  if (fileId == null) return [];
  const file = fileMap.get(fileId);
  if (!file) {
    return [{ id: String(fileId), name: `文件 #${fileId}`, size: 0 }];
  }
  return [
    {
      id: String(file.id ?? fileId),
      name: file.originalName?.trim() || `文件 #${fileId}`,
      size: typeof file.size === 'number' ? file.size : 0,
    },
  ];
}

function mapTrust(
  row: ModelTrustEvaluationTask,
  fileMap: Map<number, SysFile>,
): AdminEvalTaskRow | null {
  if (row.id == null) return null;
  const requirement = requirementText(row.evaluationRequirement);
  return {
    id: `trust:${row.id}`,
    source: 'trust',
    numericId: row.id,
    userId: row.userId != null ? String(row.userId) : '—',
    userName: row.userId != null ? `用户 #${row.userId}` : '—',
    contact: '—',
    name: taskTitle(row.id, row.evaluationRequirement),
    product: '深度模型可信测评',
    model: '—',
    requirement,
    configSummary: buildConfigSummary(row.fileId, row.emailStatus),
    status: row.status?.trim() || '待受理',
    createdAt: formatDateTime(row.createdAt),
    updatedAt: formatDateTime(row.updatedAt),
    fileId: row.fileId,
    emailStatus: row.emailStatus,
    inputs: inputsFromFile(row.fileId, fileMap),
    outputs: [],
  };
}

function mapDataSafety(
  row: ModelDataSafetyEvaluationTask,
  fileMap: Map<number, SysFile>,
): AdminEvalTaskRow | null {
  if (row.id == null) return null;
  const requirement = requirementText(row.evaluationRequirement);
  return {
    id: `data-safety:${row.id}`,
    source: 'data-safety',
    numericId: row.id,
    userId: row.userId != null ? String(row.userId) : '—',
    userName: row.userId != null ? `用户 #${row.userId}` : '—',
    contact: '—',
    name: taskTitle(row.id, row.evaluationRequirement),
    product: '模型数据安全评测',
    model: '—',
    requirement,
    configSummary: buildConfigSummary(row.fileId, row.emailStatus),
    status: row.status?.trim() || '待受理',
    createdAt: formatDateTime(row.createdAt),
    updatedAt: formatDateTime(row.updatedAt),
    fileId: row.fileId,
    emailStatus: row.emailStatus,
    inputs: inputsFromFile(row.fileId, fileMap),
    outputs: [],
  };
}

function mapEvaluation(row: EvaluationTask): AdminEvalTaskRow | null {
  if (row.id == null) return null;
  return {
    id: `evaluation:${row.id}`,
    source: 'evaluation',
    numericId: row.id,
    userId: row.userId != null ? String(row.userId) : '—',
    userName: row.userId != null ? `用户 #${row.userId}` : '—',
    contact: row.email?.trim() || '—',
    name: row.name?.trim() || taskTitle(row.id, row.demandSupplement),
    product: formatEvaluationProduct(row.type),
    model: parseCustomModelName(row.customModelConfig),
    requirement: requirementText(row.demandSupplement),
    configSummary: buildEvaluationConfigSummary(row),
    status: row.status?.trim() || '待受理',
    createdAt: formatDateTime(row.createdAt),
    updatedAt: formatDateTime(row.updatedAt),
    inputs: [],
    outputs: [],
  };
}

function sortByCreatedDesc(a: AdminEvalTaskRow, b: AdminEvalTaskRow) {
  return String(b.createdAt).localeCompare(String(a.createdAt), 'zh-CN');
}

/** 合并拉取三类评测任务（单页上限 LIST_PAGE_SIZE，超出写入对接纪要） */
export async function fetchAdminEvaluationTasks(): Promise<AdminEvalTaskRow[]> {
  const [trustPage, dataPage, evalPage] = await Promise.all([
    pageModelTrustEvaluationTasks({ pageSize: LIST_PAGE_SIZE, pageCurrent: 1 }),
    pageModelDataSafetyEvaluationTasks({ pageSize: LIST_PAGE_SIZE, pageCurrent: 1 }),
    pageEvaluationTasks({ pageSize: LIST_PAGE_SIZE, pageCurrent: 1 }),
  ]);

  const trustRecords = trustPage.records || [];
  const dataRecords = dataPage.records || [];
  const fileIds = [
    ...trustRecords.map((row) => row.fileId),
    ...dataRecords.map((row) => row.fileId),
  ].filter((id): id is number => id != null);

  const fileMap = await fetchSysFilesByIds(fileIds);

  const trustRows = trustRecords
    .map((row) => mapTrust(row, fileMap))
    .filter((row): row is AdminEvalTaskRow => row != null);
  const dataRows = dataRecords
    .map((row) => mapDataSafety(row, fileMap))
    .filter((row): row is AdminEvalTaskRow => row != null);
  const evalRows = (evalPage.records || [])
    .map(mapEvaluation)
    .filter((row): row is AdminEvalTaskRow => row != null);

  return [...trustRows, ...dataRows, ...evalRows].sort(sortByCreatedDesc);
}

export async function updateAdminEvaluationTaskStatus(
  task: AdminEvalTaskRow,
  status: string,
): Promise<void> {
  if (task.source === 'evaluation') {
    // OpenAPI 无 /temp/evaluation-task/update；见对接纪要
    throw new Error('大模型评测任务暂无修改接口，无法更新状态');
  }

  const payload = {
    id: task.numericId,
    status,
    ...(task.userId !== '—' && Number.isFinite(Number(task.userId))
      ? { userId: Number(task.userId) }
      : {}),
    ...(task.requirement !== '—' ? { evaluationRequirement: task.requirement } : {}),
    ...(task.fileId != null ? { fileId: task.fileId } : {}),
    ...(task.emailStatus ? { emailStatus: task.emailStatus } : {}),
  };

  if (task.source === 'trust') {
    await updateModelTrustEvaluationTask(payload);
    return;
  }
  await updateModelDataSafetyEvaluationTask(payload);
}
