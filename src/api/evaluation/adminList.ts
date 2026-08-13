import { getModelDataSafetyEvaluationTaskById } from '@/api/evaluation/modelDataSafety';
import { getModelTrustEvaluationTaskById } from '@/api/evaluation/modelTrust';
import {
  formatMasterDateTime,
  isMasterProductType,
  isMasterSubmitType,
  mapMasterProductLabel,
  mapMasterStatusToWorkflow,
  mapMasterSubmitTypeLabel,
  mapWorkflowStatusToMaster,
  masterRowId,
  pageEvaluationTaskMasters,
  updateEvaluationTaskMaster,
} from '@/api/evaluation/evaluationTaskMaster';
import { fetchSysFilesByIds } from '@/api/file';
import type {
  EvaluationTaskMaster,
  EvaluationTaskMasterProductType,
  EvaluationTaskMasterSubmitType,
  SysFile,
} from '@/api/types';

export type AdminEvalSource = 'trust' | 'data-safety' | 'evaluation';

/** 管理端列表行：对齐现有 WorkflowTask 展示字段，缺省用 — */
export interface AdminEvalTaskRow {
  id: string;
  source: AdminEvalSource;
  numericId: number;
  taskRefId?: number;
  productType?: EvaluationTaskMasterProductType;
  submitType?: EvaluationTaskMasterSubmitType;
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
  inputs: Array<{ id: string; name: string; size: number }>;
  outputs: Array<{ id: string; name: string }>;
}

const LIST_PAGE_SIZE = 200;

function sourceFromProduct(
  productType?: string,
): AdminEvalSource {
  if (productType === 'TRUST') return 'trust';
  if (productType === 'DATA_SAFETY') return 'data-safety';
  return 'evaluation';
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

function mapMaster(
  row: EvaluationTaskMaster,
  fileId: number | undefined,
  fileMap: Map<number, SysFile>,
): AdminEvalTaskRow | null {
  if (row.id == null) return null;
  const name = row.name?.trim() || `任务 #${row.id}`;
  const target = row.targetObject?.trim() || '—';
  return {
    id: masterRowId(row.id),
    source: sourceFromProduct(row.productType),
    numericId: row.id,
    taskRefId: row.taskRefId,
    productType: isMasterProductType(row.productType) ? row.productType : undefined,
    submitType: isMasterSubmitType(row.submitType) ? row.submitType : undefined,
    userId: row.userId != null ? String(row.userId) : '—',
    userName: row.userId != null ? `用户 #${row.userId}` : '—',
    contact: '—',
    name,
    product: mapMasterProductLabel(row.productType),
    model: target,
    requirement: name,
    configSummary: [
      row.submitType ? `提交方式：${mapMasterSubmitTypeLabel(row.submitType)}` : '',
      row.taskRefId != null ? `关联任务 #${row.taskRefId}` : '',
    ]
      .filter(Boolean)
      .join(' · ') || undefined,
    status: mapMasterStatusToWorkflow(row.status),
    createdAt: formatMasterDateTime(row.createdAt),
    updatedAt: formatMasterDateTime(row.updatedAt),
    fileId,
    inputs: inputsFromFile(fileId, fileMap),
    outputs: [],
  };
}

function sortByCreatedDesc(a: AdminEvalTaskRow, b: AdminEvalTaskRow) {
  return String(b.createdAt).localeCompare(String(a.createdAt), 'zh-CN');
}

async function resolveFileId(
  row: EvaluationTaskMaster,
): Promise<number | undefined> {
  if (row.taskRefId == null) return undefined;
  try {
    if (row.productType === 'TRUST') {
      const detail = await getModelTrustEvaluationTaskById(row.taskRefId);
      return detail.fileId;
    }
    if (row.productType === 'DATA_SAFETY') {
      const detail = await getModelDataSafetyEvaluationTaskById(row.taskRefId);
      return detail.fileId;
    }
  } catch {
    return undefined;
  }
  return undefined;
}

/** 拉取评测任务总表（单页上限 LIST_PAGE_SIZE，超出写入对接纪要） */
export async function fetchAdminEvaluationTasks(): Promise<AdminEvalTaskRow[]> {
  const page = await pageEvaluationTaskMasters({
    pageSize: LIST_PAGE_SIZE,
    pageCurrent: 1,
    orderColumn: 'createdAt',
    orderType: 'desc',
  });
  const records = page.records || [];

  const fileIdsByMasterId = new Map<number, number | undefined>();
  await Promise.all(
    records.map(async (row) => {
      if (row.id == null) return;
      fileIdsByMasterId.set(row.id, await resolveFileId(row));
    }),
  );

  const fileIds = [...fileIdsByMasterId.values()].filter(
    (id): id is number => id != null,
  );
  const fileMap = await fetchSysFilesByIds(fileIds);

  return records
    .map((row) => mapMaster(row, fileIdsByMasterId.get(row.id ?? -1), fileMap))
    .filter((row): row is AdminEvalTaskRow => row != null)
    .sort(sortByCreatedDesc);
}

export async function updateAdminEvaluationTaskStatus(
  task: AdminEvalTaskRow,
  status: string,
): Promise<void> {
  await updateEvaluationTaskMaster({
    id: task.numericId,
    name: task.name === '—' ? undefined : task.name,
    productType: task.productType,
    targetObject: task.model === '—' ? undefined : task.model,
    submitType: task.submitType,
    status: mapWorkflowStatusToMaster(status),
    taskRefId: task.taskRefId,
    ...(task.userId !== '—' && Number.isFinite(Number(task.userId))
      ? { userId: Number(task.userId) }
      : {}),
  });
}
