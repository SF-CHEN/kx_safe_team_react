/** AIGC 网关公共工具：错误解包 / 会话失效回调 */

let unauthorizedHandler: (() => void) | null = null;

export function setUnauthorizedHandler(handler: (() => void) | null): void {
  unauthorizedHandler = handler;
}

export function notifyUnauthorized(): void {
  unauthorizedHandler?.();
}

export function getGatewayBase(): string {
  return String(import.meta.env.VITE_AIGC_GATEWAY ?? '').replace(/\/$/, '');
}

/** temp-maven 业务后端（api.json servers） */
export function getTempApiBase(): string {
  return String(import.meta.env.VITE_TEMP_API ?? '').replace(/\/$/, '');
}

export function extractGatewayErrorMessage(error: unknown): string {
  const err = error as { response?: { data?: unknown }; message?: string };
  const data = err?.response?.data ?? error;
  if (!data) return err?.message || '请求失败';
  if (typeof data === 'string') return data;
  if (typeof data === 'object' && data !== null) {
    const detail = (data as { detail?: unknown }).detail;
    if (typeof detail === 'string') return detail;
    if (Array.isArray(detail) && detail.length > 0) {
      return detail
        .map((item) => {
          if (item && typeof item === 'object') {
            const row = item as { msg?: string; message?: string };
            return row.msg || row.message || String(item);
          }
          return String(item);
        })
        .join('；');
    }
    const payload = data as { message?: string; msg?: string };
    return payload.message || payload.msg || err?.message || '请求失败';
  }
  return '请求失败';
}

function isApiSuccessCode(code: number): boolean {
  return code === 0 || code === 200;
}

export function unwrapGatewayData<T = unknown>(response: unknown): T {
  const payload = (response as { data?: unknown })?.data ?? response;
  if (payload && typeof payload === 'object' && 'code' in payload && 'data' in payload) {
    const body = payload as { code: number; message?: string; detail?: string; data: T };
    if (!isApiSuccessCode(body.code)) {
      throw new Error(body.message || body.detail || '请求失败');
    }
    return body.data;
  }
  if (
    payload &&
    typeof payload === 'object' &&
    'detail' in payload &&
    !('token' in payload) &&
    !('items' in payload)
  ) {
    throw new Error(extractGatewayErrorMessage(payload));
  }
  return payload as T;
}

export type GatewayError = Error & {
  status?: number;
  response?: unknown;
};
