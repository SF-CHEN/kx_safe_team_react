import axios, { type AxiosInstance } from 'axios';
import { getXTokenHeader } from '@/utils/auth';
import {
  extractGatewayErrorMessage,
  getTempApiBase,
  notifyUnauthorized,
  type GatewayError,
} from '@/utils/gateway';

/** 对接 temp-maven（api.json）的 axios 客户端 */
export function createTempClient(timeout = 30_000): AxiosInstance {
  const client = axios.create({
    baseURL: getTempApiBase(),
    timeout,
    withCredentials: false,
  });

  client.interceptors.request.use((config) => {
    Object.assign(config.headers, getXTokenHeader());
    return config;
  });

  client.interceptors.response.use(
    (response) => response,
    (error) => {
      const status = error.response?.status as number | undefined;
      if (status === 401 || status === 403) {
        notifyUnauthorized();
      }
      const err = new Error(extractGatewayErrorMessage(error)) as GatewayError;
      err.status = status;
      err.response = error.response;
      return Promise.reject(err);
    },
  );

  return client;
}
