import {
  pageModelDataSafetyEvaluationTasks,
  updateModelDataSafetyEvaluationTask,
} from '@/api/evaluation/modelDataSafety';
import {
  pageModelTrustEvaluationTasks,
  updateModelTrustEvaluationTask,
} from '@/api/evaluation/modelTrust';
import type {
  ModelDataSafetyEvaluationTask,
  ModelTrustEvaluationTask,
} from '@/api/types';

export type AdminEvalSource = 'trust' | 'data-safety';

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

/** 管理端评测任务列表变更（改状态后刷新顶栏徽标） */
export const ADMIN_EVAL_TASKS_EVENT = 'xuanjian-admin-eval-tasks';

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

function requirementText(value?: string) {
  const text = value?.trim();
  return text || '—';
}

function taskTitle(id: number | undefined, requirement?: string) {
  const text = requirement?.trim();
  if (text) return text.length > 48 ? `${text.slice(0, 48)}…` : text;
  return id != null ? `任务 #${id}` : '未命名任务';
}

function mapTrust(row: ModelTrustEvaluationTask): AdminEvalTaskRow | null {
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
    inputs: [],
    outputs: [],
  };
}

function mapDataSafety(row: ModelDataSafetyEvaluationTask): AdminEvalTaskRow | null {
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
    inputs: [],
    outputs: [],
  };
}

function sortByCreatedDesc(a: AdminEvalTaskRow, b: AdminEvalTaskRow) {
  return String(b.createdAt).localeCompare(String(a.createdAt), 'zh-CN');
}

/** 合并拉取两类评测任务（单页上限 LIST_PAGE_SIZE，超出写入对接纪要） */
export async function fetchAdminEvaluationTasks(): Promise<AdminEvalTaskRow[]> {
  const [trustPage, dataPage] = await Promise.all([
    pageModelTrustEvaluationTasks({ pageSize: LIST_PAGE_SIZE, pageCurrent: 1 }),
    pageModelDataSafetyEvaluationTasks({ pageSize: LIST_PAGE_SIZE, pageCurrent: 1 }),
  ]);

  const trustRows = (trustPage.records || [])
    .map(mapTrust)
    .filter((row): row is AdminEvalTaskRow => row != null);
  const dataRows = (dataPage.records || [])
    .map(mapDataSafety)
    .filter((row): row is AdminEvalTaskRow => row != null);

  return [...trustRows, ...dataRows].sort(sortByCreatedDesc);
}

export function notifyAdminEvaluationTasksChanged() {
  window.dispatchEvent(new CustomEvent(ADMIN_EVAL_TASKS_EVENT));
}

export async function updateAdminEvaluationTaskStatus(
  task: AdminEvalTaskRow,
  status: string,
): Promise<void> {
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
