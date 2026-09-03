/**
 * [INPUT]: Axios、AIGC 网关地址、鉴权头与统一错误处理
 * [OUTPUT]: 对外提供按 timeout 复用的 AIGC Axios 实例
 * [POS]: AIGC 手写 API 的专用 HTTP 基础设施；AIGC 不进入 OpenAPI generated 目录
 */
import axios, { type AxiosInstance } from 'axios'

import { getAuthHeader } from '@/utils/auth'
import {
  extractGatewayErrorMessage,
  getGatewayBase,
  notifyUnauthorized,
  type GatewayError,
} from '@/utils/gateway'

const aigcClients = new Map<number, AxiosInstance>()

/** AIGC 使用独立网关；相同 timeout 复用实例，避免重复注册拦截器。 */
export function getAigcClient(timeout = 120_000): AxiosInstance {
  const cached = aigcClients.get(timeout)
  if (cached) return cached

  const client = axios.create({
    baseURL: getGatewayBase(),
    timeout,
  })

  client.interceptors.request.use((config) => {
    Object.assign(config.headers, getAuthHeader())
    return config
  })

  client.interceptors.response.use(
    (response) => response,
    (error) => {
      const status = error.response?.status as number | undefined
      if (status === 401 || status === 403) notifyUnauthorized()

      const normalized = new Error(extractGatewayErrorMessage(error)) as GatewayError
      normalized.status = status
      normalized.response = error.response
      return Promise.reject(normalized)
    },
  )

  aigcClients.set(timeout, client)
  return client
}
