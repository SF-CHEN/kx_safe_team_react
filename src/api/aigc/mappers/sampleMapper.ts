import { getSampleDisplayName, isBuiltinSampleText } from '@/api/aigc/sampleUtils';
import { MEDIA_TYPE_LABELS, TASK_TYPE_LABELS } from '@/api/aigc/mappers/reportMapper';

export const INPUT_TYPE_LABELS: Record<string, string> = {
  text: '文本直传',
  file: '文件上传',
};

export interface AigcSampleRow {
  id: string;
  name: string;
  category: string;
  categories: unknown[];
  algorithmKey?: string;
  algorithmName: string;
  mediaType?: string;
  mediaLabel: string;
  taskType: string;
  evalType: string;
  inputType: string;
  inputLabel: string;
  count: number | null;
  countLabel: string;
  difficulty?: unknown;
  description?: string;
  textPreview?: string;
  expectedResult?: unknown;
  source?: unknown;
  raw: Record<string, unknown>;
}

/** 内置样例 item → 评测集卡片行（对齐 Vue aigcSampleMapper） */
export function mapSampleToEvalSetRow(item: Record<string, unknown>): AigcSampleRow {
  const isText = isBuiltinSampleText(item);
  const categories = Array.isArray(item.risk_categories) && item.risk_categories.length
    ? item.risk_categories
    : (Array.isArray(item.tags) ? item.tags : []);

  const taskType = String(item.task_type ?? '');
  const funcLabel = TASK_TYPE_LABELS[taskType]
    ?? (taskType.includes('review') ? '内容审核' : 'AI鉴伪');

  return {
    id: String(item.sample_id ?? ''),
    name: getSampleDisplayName(item),
    category: String(categories[0] ?? '—'),
    categories,
    algorithmKey: item.algorithm_key as string | undefined,
    algorithmName: String(item.algorithm_name || item.algorithm_key || '—'),
    mediaType: item.media_type as string | undefined,
    mediaLabel: MEDIA_TYPE_LABELS[String(item.media_type)] ?? String(item.media_type ?? '—'),
    taskType,
    evalType: funcLabel,
    inputType: String(item.input_type ?? item.sample_type ?? (isText ? 'text' : 'file')),
    inputLabel: isText ? '文本' : '文件',
    count: isText ? Number(item.text_length ?? 0) : null,
    countLabel: isText
      ? `${item.text_length ?? 0} 字`
      : String(item.file_name ?? item.filename ?? '文件样例'),
    difficulty: item.difficulty,
    description: item.description as string | undefined,
    textPreview: (item.text_preview ?? item.text) as string | undefined,
    expectedResult: item.expected_result,
    source: item.source,
    raw: item,
  };
}
