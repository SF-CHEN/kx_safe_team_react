/**
 * [INPUT]: 由 OpenAPI 的 evaluation-task paths 生成，并依赖 @/api/request 的 requestData
 * [OUTPUT]: 对外提供 evaluation-task 模块的类型安全 API 请求函数
 * [POS]: src/api/generated 的自动生成 API 模块，供页面 Query 或 src/api 手写业务封装调用
 */
import type {
  BatchDel7EvaluationTaskParams,
  DeleteOne7EvaluationTaskParams,
  EvaluationTask,
  GetDetailById7EvaluationTaskParams,
  PageQuery,
  ResultBoolean,
  ResultEvaluationTask,
  ResultPageEvaluationTask,
} from './types/evaluation-task'
import { requestData } from '@/api/request'

/** 分页查询评测任务 */
export function findPage7EvaluationTask(data: PageQuery): Promise<ResultPageEvaluationTask> {
  return requestData<ResultPageEvaluationTask>({
    url: `/temp/evaluation-task/page`,
    method: 'POST',
    data,
  })
}

/** 新增评测任务 */
export function add6EvaluationTask(data: EvaluationTask): Promise<ResultEvaluationTask> {
  return requestData<ResultEvaluationTask>({
    url: `/temp/evaluation-task/add`,
    method: 'POST',
    data,
  })
}

/** 获取评测任务 */
export function getDetailById7EvaluationTask(params: GetDetailById7EvaluationTaskParams): Promise<ResultEvaluationTask> {
  return requestData<ResultEvaluationTask>({
    url: `/temp/evaluation-task/getDetailById`,
    method: 'GET',
    params,
  })
}

/** 删除评测任务 */
export function deleteOne7EvaluationTask(params: DeleteOne7EvaluationTaskParams): Promise<ResultBoolean> {
  return requestData<ResultBoolean>({
    url: `/temp/evaluation-task/deleteOne`,
    method: 'DELETE',
    params,
  })
}

/** 批量删除评测任务 */
export function batchDel7EvaluationTask(params: BatchDel7EvaluationTaskParams): Promise<ResultBoolean> {
  return requestData<ResultBoolean>({
    url: `/temp/evaluation-task/batchDel`,
    method: 'DELETE',
    params,
  })
}
