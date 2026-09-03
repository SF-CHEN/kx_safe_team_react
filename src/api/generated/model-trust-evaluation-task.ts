/**
 * [INPUT]: 由 OpenAPI 的 model-trust-evaluation-task paths 生成，并依赖 @/api/request 的 requestData
 * [OUTPUT]: 对外提供 model-trust-evaluation-task 模块的类型安全 API 请求函数
 * [POS]: src/api/generated 的自动生成 API 模块，供页面 Query 或 src/api 手写业务封装调用
 */
import type {
  BatchDel5ModelTrustEvaluationTaskParams,
  DeleteOne5ModelTrustEvaluationTaskParams,
  GetDetailById5ModelTrustEvaluationTaskParams,
  ModelTrustEvaluationTask,
  PageQuery,
  ResultBoolean,
  ResultModelTrustEvaluationTask,
  ResultPageModelTrustEvaluationTask,
} from './types/model-trust-evaluation-task'
import { requestData } from '@/api/request'

/** 修改模型可信评测任务表 */
export function update4ModelTrustEvaluationTask(data: ModelTrustEvaluationTask): Promise<ResultBoolean> {
  return requestData<ResultBoolean>({
    url: `/temp/model-trust-evaluation-task/update`,
    method: 'PUT',
    data,
  })
}

/** 分页查询模型可信评测任务表 */
export function findPage5ModelTrustEvaluationTask(data: PageQuery): Promise<ResultPageModelTrustEvaluationTask> {
  return requestData<ResultPageModelTrustEvaluationTask>({
    url: `/temp/model-trust-evaluation-task/page`,
    method: 'POST',
    data,
  })
}

/** 新增模型可信评测任务表 */
export function add4ModelTrustEvaluationTask(data: ModelTrustEvaluationTask): Promise<ResultModelTrustEvaluationTask> {
  return requestData<ResultModelTrustEvaluationTask>({
    url: `/temp/model-trust-evaluation-task/add`,
    method: 'POST',
    data,
  })
}

/** 获取模型可信评测任务表 */
export function getDetailById5ModelTrustEvaluationTask(params: GetDetailById5ModelTrustEvaluationTaskParams): Promise<ResultModelTrustEvaluationTask> {
  return requestData<ResultModelTrustEvaluationTask>({
    url: `/temp/model-trust-evaluation-task/getDetailById`,
    method: 'GET',
    params,
  })
}

/** 删除模型可信评测任务表 */
export function deleteOne5ModelTrustEvaluationTask(params: DeleteOne5ModelTrustEvaluationTaskParams): Promise<ResultBoolean> {
  return requestData<ResultBoolean>({
    url: `/temp/model-trust-evaluation-task/deleteOne`,
    method: 'DELETE',
    params,
  })
}

/** 批量删除模型可信评测任务表 */
export function batchDel5ModelTrustEvaluationTask(params: BatchDel5ModelTrustEvaluationTaskParams): Promise<ResultBoolean> {
  return requestData<ResultBoolean>({
    url: `/temp/model-trust-evaluation-task/batchDel`,
    method: 'DELETE',
    params,
  })
}
