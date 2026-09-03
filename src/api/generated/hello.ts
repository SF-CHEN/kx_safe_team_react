/**
 * [INPUT]: 由 OpenAPI 的 hello paths 生成，并依赖 @/api/request 的 requestData
 * [OUTPUT]: 对外提供 hello 模块的类型安全 API 请求函数
 * [POS]: src/api/generated 的自动生成 API 模块，供页面 Query 或 src/api 手写业务封装调用
 */
import type { ResultString } from './types/hello'
import { requestData } from '@/api/request'

/** 你好 */
export function hello(): Promise<ResultString> {
  return requestData<ResultString>({
    url: `/temp/hello/`,
    method: 'GET',
  })
}
