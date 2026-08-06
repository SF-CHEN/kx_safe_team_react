export const MEDIA_TYPE_LABELS: Record<string, string> = {
  text: '文本',
  image: '图像',
  audio: '音频',
  video: '视频',
};

export const TASK_TYPE_LABELS: Record<string, string> = {
  content_review: '内容审核',
  review: '内容审核',
  forgery: 'AI鉴伪',
  content_forgery: 'AI鉴伪',
};

export const RISK_TAG_TYPE: Record<string, string> = {
  high: 'danger',
  medium: 'warning',
  low: 'success',
  none: 'info',
};

export function formatReportTime(ms?: number | null): string {
  if (!ms) return '—';
  const d = new Date(ms);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

/** 报告列表行（API 层自包含，不依赖 React Context） */
export interface AigcReportRow {
  id: string;
  name: string;
  model: string;
  modelType: string;
  evalSet: string;
  evalType: string;
  /** 网关风险文案；列表徽章仍按「评测完成」展示时可同时读 riskLevel */
  status: string;
  score: number | null;
  createdAt: string;
  plan: 'free' | 'paid';
  shareLink?: string;
  recordId?: number | string;
  source: 'aigc' | 'local';
  riskLevel?: string;
  decision?: string;
  decisionText?: string;
  mediaType?: string;
  taskType?: string;
  raw?: Record<string, unknown>;
}

/** 报告库 item → 表格行（对齐 Vue aigcReportMapper） */
export function mapReportToTaskRow(item: Record<string, unknown>): AigcReportRow {
  const taskType = String(item.task_type ?? '');
  const funcLabel = TASK_TYPE_LABELS[taskType]
    ?? (taskType.includes('review') ? '内容审核' : 'AI鉴伪');

  return {
    id: String(item.task_id ?? item.record_id),
    recordId: item.record_id as number | string | undefined,
    name: String(item.summary_text || item.task_id || `报告 #${item.record_id}`),
    model: String(item.algorithm_name || item.algorithm_key || '—'),
    modelType: String(item.algorithm_key || '—'),
    evalSet: String(
      item.main_category
        || MEDIA_TYPE_LABELS[String(item.media_type)]
        || item.media_type
        || '—',
    ),
    evalType: `AIGC${funcLabel}`,
    // 网关报告均为已完成分析；风险文案放入 riskLevel / decision，避免打乱原型状态徽章
    status: '评测完成',
    score: item.risk_score != null ? Math.round(Number(item.risk_score) * 100) : null,
    createdAt: formatReportTime(item.created_at_ms as number | undefined),
    plan: 'free',
    mediaType: item.media_type as string | undefined,
    taskType,
    riskLevel: (item.risk_level_cn as string | undefined)
      ?? (item.risk_level as string | undefined),
    decision: item.decision as string | undefined,
    decisionText: item.decision_text as string | undefined,
    source: 'aigc',
    raw: item,
  };
}
