export const AIGC_MODALITIES = ['text', 'image', 'audio', 'video'] as const;
export type AigcModality = (typeof AIGC_MODALITIES)[number];

export const AIGC_FUNCS = ['audit', 'detect'] as const;
export type AigcFunc = (typeof AIGC_FUNCS)[number];

export const ALGORITHM_KEY_MAP: Record<AigcModality, Record<AigcFunc, string>> = {
  text: { audit: 'text_review', detect: 'text_detect' },
  image: { audit: 'image_review', detect: 'image_detect' },
  audio: { audit: 'audio_review', detect: 'audio_detect' },
  video: { audit: 'video_review', detect: 'video_detect' },
};

/** analyze 接口超时：统一 30 分钟（算法侧可能较慢） */
export const ANALYZE_TIMEOUT_MS: Record<AigcModality, number> = {
  text: 1_800_000,
  image: 1_800_000,
  audio: 1_800_000,
  video: 1_800_000,
};

export function getAlgorithmKey(modality: string, func: string): string {
  const m = modality as AigcModality;
  const f = func as AigcFunc;
  return ALGORITHM_KEY_MAP[m]?.[f] ?? `${modality}_${func === 'audit' ? 'review' : 'detect'}`;
}

export function generateTaskId(): string {
  return `aigc_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export function mapAigcErrorMessage(status?: number, message?: string): string {
  if (message && message !== 'Internal Server Error') return message;
  const map: Record<number, string> = {
    400: '请求参数有误，请检查文本内容或文件格式',
    404: '算法服务不存在，请检查 algorithm_key',
    500: '算法服务异常或未启动，请稍后重试或联系管理员',
    502: '网关暂不可用，请联系管理员',
    503: '服务繁忙，请稍后重试',
    504: '检测超时，请尝试较小文件或稍后重试',
  };
  return (status && map[status]) || '请求失败，请稍后重试';
}

/** analyze 可能 HTTP 200，但 body.status=failed；尽量抽出可读错误文案 */
export function formatAigcAnalyzeError(error: unknown): string {
  if (error == null || error === '') return '';
  if (typeof error === 'string') {
    const jsonMatch = error.match(/\{[\s\S]*\}$/);
    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[0]) as {
          error?: { message?: string };
          message?: string;
        };
        const nested = parsed.error?.message || parsed.message;
        if (nested?.trim()) return nested.trim();
      } catch {
        /* keep raw */
      }
    }
    return error.trim();
  }
  if (typeof error === 'object') {
    const obj = error as { message?: string; error?: { message?: string } | string };
    if (typeof obj.error === 'string' && obj.error.trim()) return obj.error.trim();
    if (obj.error && typeof obj.error === 'object' && obj.error.message?.trim()) {
      return obj.error.message.trim();
    }
    if (obj.message?.trim()) return obj.message.trim();
  }
  return String(error);
}

/**
 * 取出 analyze 业务体（兼容网关包裹）。
 * 若 status 为 failed/error，抛出带可读文案的 Error，供页面 toast / 错误区展示。
 */
export function assertAigcAnalyzeSuccess(response: unknown): Record<string, unknown> {
  const root = (response && typeof response === 'object'
    ? response
    : {}) as Record<string, unknown>;
  const nested = root.data;
  const payload = (
    nested
    && typeof nested === 'object'
    && !Array.isArray(nested)
    && ('status' in nested || 'error' in nested || 'task_id' in nested || 'result' in nested)
      ? nested
      : root
  ) as Record<string, unknown>;

  const status = String(payload.status ?? '').toLowerCase();
  if (status === 'failed' || status === 'error') {
    throw new Error(formatAigcAnalyzeError(payload.error) || '检测失败，请稍后重试');
  }
  return payload;
}

export interface ParsedAigcDisplay {
  result: Record<string, unknown>;
  reportInfo: Record<string, unknown> | null;
  briefView: Record<string, unknown>;
  detectionResult: Record<string, unknown>;
  rankedView: unknown[];
  panel: Record<string, unknown> | null;
  algorithmKey: string | null;
}

export function parseDisplayResponse(response: unknown): ParsedAigcDisplay {
  const root = response as { data?: { result?: unknown; report_info?: unknown } } | null;
  const payload = (root?.data?.result ?? root?.data ?? response ?? {}) as Record<string, unknown>;
  const result = typeof payload === 'object' && payload !== null ? payload : {};

  const panel =
    (result.text_content_audit_panel as Record<string, unknown> | undefined) ??
    (result.text_authenticity_panel as Record<string, unknown> | undefined) ??
    (result.image_content_audit_panel as Record<string, unknown> | undefined) ??
    (result.image_authenticity_panel as Record<string, unknown> | undefined) ??
    (result.audio_content_audit_panel as Record<string, unknown> | undefined) ??
    (result.audio_authenticity_panel as Record<string, unknown> | undefined) ??
    (result.video_content_audit_panel as Record<string, unknown> | undefined) ??
    (result.video_authenticity_panel as Record<string, unknown> | undefined) ??
    null;

  return {
    result,
    reportInfo: (result.report_info as Record<string, unknown> | undefined)
      ?? (root?.data?.report_info as Record<string, unknown> | undefined)
      ?? null,
    briefView: (result.brief_view as Record<string, unknown> | undefined) ?? {},
    detectionResult: (result.detection_result as Record<string, unknown> | undefined) ?? {},
    rankedView: Array.isArray(result.ranked_view) ? result.ranked_view : [],
    panel,
    algorithmKey: (result.content_type as string | undefined) ?? null,
  };
}
