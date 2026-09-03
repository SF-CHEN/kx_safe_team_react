/**
 * [INPUT]: 由 OpenAPI 的 model-data-safety-evaluation-task paths 生成，并依赖 @/api/request 的 requestData
 * [OUTPUT]: 对外提供 model-data-safety-evaluation-task 模块的类型安全 API 请求函数
 * [POS]: src/api/generated 的自动生成 API 模块，供页面 Query 或 src/api 手写业务封装调用
 */
import type {
  BatchDel6ModelDataSafetyEvaluationTaskParams,
  DeleteOne6ModelDataSafetyEvaluationTaskParams,
  GetDetailById6ModelDataSafetyEvaluationTaskParams,
  ModelDataSafetyEvaluationTask,
  PageQuery,
  ResultBoolean,
  ResultModelDataSafetyEvaluationTask,
  ResultPageModelDataSafetyEvaluationTask,
} from './types/model-data-safety-evaluation-task'
import { requestData } from '@/api/request'

/** 修改模型数据安全评测任务表 */
export function update5ModelDataSafetyEvaluationTask(data: ModelDataSafetyEvaluationTask): Promise<ResultBoolean> {
  return requestData<ResultBoolean>({
    url: `/temp/model-data-safety-evaluation-task/update`,
    method: 'PUT',
    data,
  })
}

/** 分页查询模型数据安全评测任务表 */
export function findPage6ModelDataSafetyEvaluationTask(data: PageQuery): Promise<ResultPageModelDataSafetyEvaluationTask> {
  return requestData<ResultPageModelDataSafetyEvaluationTask>({
    url: `/temp/model-data-safety-evaluation-task/page`,
    method: 'POST',
    data,
  })
}

/** 新增模型数据安全评测任务表 */
export function add5ModelDataSafetyEvaluationTask(data: ModelDataSafetyEvaluationTask): Promise<ResultModelDataSafetyEvaluationTask> {
  return requestData<ResultModelDataSafetyEvaluationTask>({
    url: `/temp/model-data-safety-evaluation-task/add`,
    method: 'POST',
    data,
  })
}

/** 获取模型数据安全评测任务表 */
export function getDetailById6ModelDataSafetyEvaluationTask(params: GetDetailById6ModelDataSafetyEvaluationTaskParams): Promise<ResultModelDataSafetyEvaluationTask> {
  return requestData<ResultModelDataSafetyEvaluationTask>({
    url: `/temp/model-data-safety-evaluation-task/getDetailById`,
    method: 'GET',
    params,
  })
}

/** 删除模型数据安全评测任务表 */
export function deleteOne6ModelDataSafetyEvaluationTask(params: DeleteOne6ModelDataSafetyEvaluationTaskParams): Promise<ResultBoolean> {
  return requestData<ResultBoolean>({
    url: `/temp/model-data-safety-evaluation-task/deleteOne`,
    method: 'DELETE',
    params,
  })
}

/** 批量删除模型数据安全评测任务表 */
export function batchDel6ModelDataSafetyEvaluationTask(params: BatchDel6ModelDataSafetyEvaluationTaskParams): Promise<ResultBoolean> {
  return requestData<ResultBoolean>({
    url: `/temp/model-data-safety-evaluation-task/batchDel`,
    method: 'DELETE',
    params,
  })
}
