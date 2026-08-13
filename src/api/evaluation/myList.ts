import {
  formatMasterDateTime,
  mapMasterEvalType,
  mapMasterStatusToWorkflow,
  mapMasterSubmitTypeLabel,
  masterRowId,
  pageEvaluationTaskMasters,
} from '@/api/evaluation/evaluationTaskMaster';
import type { EvaluationTaskMaster } from '@/api/types';

const LIST_PAGE_SIZE = 200;

/** 资源中心列表行（对齐门户 EvalTask 展示字段，不含附件二进制） */
export interface MyResourceTask {
  id: string;
  name: string;
  model: string;
  modelType: string;
  evalSet: string;
  evalType:
    | '模型数据安全评测'
    | '深度模型可信测评'
    | '大模型评测'
    | '大模型安全评测'
    | '多模态大模型安全评测';
  status: string;
  createdAt: string;
  requirement?: string;
  configSummary?: string;
}

function mapMaster(row: EvaluationTaskMaster): MyResourceTask | null {
  if (row.id == null) return null;
  const name = row.name?.trim() || `任务 #${row.id}`;
  const target = row.targetObject?.trim() || '—';
  return {
    id: masterRowId(row.id),
    name,
    model: target,
    modelType: mapMasterSubmitTypeLabel(row.submitType),
    evalSet: name,
    evalType: mapMasterEvalType(row.productType),
    status: mapMasterStatusToWorkflow(row.status),
    createdAt: formatMasterDateTime(row.createdAt),
    requirement: name,
    configSummary: [
      row.submitType ? `提交方式：${mapMasterSubmitTypeLabel(row.submitType)}` : '',
      row.taskRefId != null ? `关联任务 #${row.taskRefId}` : '',
    ]
      .filter(Boolean)
      .join(' · ') || undefined,
  };
}

function sortByCreatedDesc(a: MyResourceTask, b: MyResourceTask) {
  return String(b.createdAt).localeCompare(String(a.createdAt), 'zh-CN');
}

/**
 * 资源中心：按当前用户拉取评测任务总表。
 * 智能体安全等尚无专用产品类型，本接口不包含。
 */
export async function fetchMyResourceTasks(
  userId: number,
): Promise<MyResourceTask[]> {
  const page = await pageEvaluationTaskMasters({
    pageSize: LIST_PAGE_SIZE,
    pageCurrent: 1,
    orderColumn: 'createdAt',
    orderType: 'desc',
    entity: { userId },
  });

  return (page.records || [])
    .map(mapMaster)
    .filter((row): row is MyResourceTask => row != null)
    .sort(sortByCreatedDesc);
}
