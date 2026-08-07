import { pageEvaluationTasks } from '@/api/evaluation/evaluationTask';
import { pageModelDataSafetyEvaluationTasks } from '@/api/evaluation/modelDataSafety';
import { pageModelTrustEvaluationTasks } from '@/api/evaluation/modelTrust';
import type {
  EvaluationTask,
  ModelDataSafetyEvaluationTask,
  ModelTrustEvaluationTask,
} from '@/api/types';

const LIST_PAGE_SIZE = 200;

const WORKFLOW_STATUSES = new Set([
  '待受理',
  '材料已接收',
  '处理中',
  '待补充材料',
  '待交付',
  '已推送',
  '处理异常',
]);

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

function formatDateTime(value?: string) {
  if (!value) return new Date().toLocaleString('zh-CN', { hour12: false });
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString('zh-CN', { hour12: false });
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

/** 后端英文态 → 资源中心工作流中文态；已是中文则透传 */
function mapStatus(raw?: string): string {
  const value = raw?.trim();
  if (!value) return '待受理';
  if (WORKFLOW_STATUSES.has(value)) return value;

  const upper = value.toUpperCase();
  if (upper === 'PENDING' || upper === 'QUEUED') return '待受理';
  if (upper === 'RUNNING') return '处理中';
  if (upper === 'SUCCESS') return '已推送';
  if (upper === 'FAILED') return '处理异常';
  return '待受理';
}

function mapEvaluationType(type?: string): MyResourceTask['evalType'] {
  const value = type?.trim();
  if (value === 'PERFORMANCE' || value === '大模型性能评测' || value === '大模型评测') {
    return '大模型评测';
  }
  if (value === 'SAFETY' || value === '大模型安全评测') return '大模型安全评测';
  if (value === '多模态大模型安全评测') return '多模态大模型安全评测';
  return '大模型评测';
}

function titleFromRequirement(id: number, requirement?: string) {
  const text = requirement?.trim();
  if (text) return text.length > 48 ? `${text.slice(0, 48)}…` : text;
  return `任务 #${id}`;
}

function mapTrust(row: ModelTrustEvaluationTask): MyResourceTask | null {
  if (row.id == null) return null;
  return {
    // 前缀避免与其它表自增 id 冲突
    id: `trust:${row.id}`,
    name: titleFromRequirement(row.id, row.evaluationRequirement),
    model: '用户上传的模型工程',
    modelType: '本地工程文件',
    evalSet: row.evaluationRequirement?.trim() || '—',
    evalType: '深度模型可信测评',
    status: mapStatus(row.status),
    createdAt: formatDateTime(row.createdAt),
    requirement: row.evaluationRequirement?.trim() || undefined,
    configSummary:
      row.fileId != null ? `关联文件 ID：${row.fileId}` : undefined,
  };
}

function mapDataSafety(row: ModelDataSafetyEvaluationTask): MyResourceTask | null {
  if (row.id == null) return null;
  return {
    id: `data-safety:${row.id}`,
    name: titleFromRequirement(row.id, row.evaluationRequirement),
    model: '用户上传的数据工程',
    modelType: '本地工程文件',
    evalSet: row.evaluationRequirement?.trim() || '—',
    evalType: '模型数据安全评测',
    status: mapStatus(row.status),
    createdAt: formatDateTime(row.createdAt),
    requirement: row.evaluationRequirement?.trim() || undefined,
    configSummary:
      row.fileId != null ? `关联文件 ID：${row.fileId}` : undefined,
  };
}

function mapEvaluation(row: EvaluationTask): MyResourceTask | null {
  if (row.id == null) return null;
  const supplement = row.demandSupplement?.trim();
  return {
    id: `evaluation:${row.id}`,
    name: row.name?.trim() || `任务 #${row.id}`,
    model: parseCustomModelName(row.customModelConfig),
    modelType:
      row.useModelType === 'BUILT_IN'
        ? '内置'
        : row.useModelType === 'USER_MODEL'
          ? '用户模型'
          : '自定义',
    evalSet: supplement || (row.presumedSceneDimensionId != null
      ? `预设场景 #${row.presumedSceneDimensionId}`
      : '—'),
    evalType: mapEvaluationType(row.type),
    status: mapStatus(row.status),
    createdAt: formatDateTime(row.createdAt),
    requirement: supplement || undefined,
    configSummary: [
      row.useModelType ? `模型来源：${row.useModelType}` : '',
      row.evaluationDimensionType
        ? `维度：${row.evaluationDimensionType}`
        : '',
      row.presumedSceneDimensionId != null
        ? `场景 ID：${row.presumedSceneDimensionId}`
        : '',
    ]
      .filter(Boolean)
      .join(' · ') || undefined,
  };
}

function sortByCreatedDesc(a: MyResourceTask, b: MyResourceTask) {
  return String(b.createdAt).localeCompare(String(a.createdAt), 'zh-CN');
}

/**
 * 资源中心：按当前用户拉取已对接的三类评测任务。
 * 智能体安全等尚无专用表，本接口不包含。
 */
export async function fetchMyResourceTasks(
  userId: number,
): Promise<MyResourceTask[]> {
  const entity = { userId };
  const query = { pageSize: LIST_PAGE_SIZE, pageCurrent: 1, entity };

  const [trustPage, dataPage, evalPage] = await Promise.all([
    pageModelTrustEvaluationTasks(query),
    pageModelDataSafetyEvaluationTasks(query),
    pageEvaluationTasks(query),
  ]);

  const trustRows = (trustPage.records || [])
    .map(mapTrust)
    .filter((row): row is MyResourceTask => row != null);
  const dataRows = (dataPage.records || [])
    .map(mapDataSafety)
    .filter((row): row is MyResourceTask => row != null);
  const evalRows = (evalPage.records || [])
    .map(mapEvaluation)
    .filter((row): row is MyResourceTask => row != null);

  return [...trustRows, ...dataRows, ...evalRows].sort(sortByCreatedDesc);
}
