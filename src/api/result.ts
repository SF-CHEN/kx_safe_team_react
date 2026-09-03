/**
 * [INPUT]: OpenAPI 自动生成接口返回的 Result<T> 结构
 * [OUTPUT]: 对外提供统一业务状态校验与 data 解包
 * [POS]: generated API 与业务适配层之间的响应边界，避免每个模块重复判断 code/message
 */
export interface ApiResult<T> {
  code?: number
  message?: string
  data?: T
}

function assertBusinessSuccess(result: ApiResult<unknown>, fallbackMessage: string): void {
  if (result.code !== undefined && result.code !== 0 && result.code !== 200) {
    throw new Error(result.message || fallbackMessage)
  }
}

/** 必须返回 data 的接口使用；只把 undefined 视为缺失，false/0/空字符串都属于合法值。 */
export function unwrapApiResult<T>(result: ApiResult<T>, fallbackMessage = '请求失败'): T {
  assertBusinessSuccess(result, fallbackMessage)
  if (result.data === undefined) throw new Error(result.message || fallbackMessage)
  return result.data
}

/** 列表、概览等允许后端省略 data 的接口使用，由调用方提供业务兜底值。 */
export function unwrapApiResultOr<T>(
  result: ApiResult<T>,
  fallback: T,
  fallbackMessage = '请求失败',
): T {
  assertBusinessSuccess(result, fallbackMessage)
  return result.data === undefined ? fallback : result.data
}
