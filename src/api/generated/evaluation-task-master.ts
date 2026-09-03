/**
 * [INPUT]: 由 OpenAPI 的 evaluation-task-master paths 生成，并依赖 @/api/request 的 requestData
 * [OUTPUT]: 对外提供 evaluation-task-master 模块的类型安全 API 请求函数
 * [POS]: src/api/generated 的自动生成 API 模块，供页面 Query 或 src/api 手写业务封装调用
 */
import type {
  BatchDel8EvaluationTaskMasterParams,
  DeleteOne8EvaluationTaskMasterParams,
  DeliverTaskSo,
  GetDetailById8EvaluationTaskMasterParams,
  PageQuery,
  ResultBoolean,
  ResultEvaluationTaskMasterDetailVo,
  ResultPageEvaluationTaskMaster,
  SupplementMaterialSo,
} from './types/evaluation-task-master'
import { requestData } from '@/api/request'

/** 用户补充评测材料 */
export function supplementMaterialEvaluationTaskMaster(data: SupplementMaterialSo): Promise<ResultBoolean> {
  return requestData<ResultBoolean>({
    url: `/temp/evaluation-task-master/supplementMaterial`,
    method: 'POST',
    data,
  })
}

/** 分页查询评测任务总表（统一管理四种评测任务） */
export function findPage8EvaluationTaskMaster(data: PageQuery): Promise<ResultPageEvaluationTaskMaster> {
  return requestData<ResultPageEvaluationTaskMaster>({
    url: `/temp/evaluation-task-master/page`,
    method: 'POST',
    data,
  })
}

/** 管理员交付评测任务 */
export function deliverEvaluationTaskMaster(data: DeliverTaskSo): Promise<ResultBoolean> {
  return requestData<ResultBoolean>({
    url: `/temp/evaluation-task-master/deliver`,
    method: 'POST',
    data,
  })
}

/** 获取评测任务总表（统一管理四种评测任务） */
export function getDetailById8EvaluationTaskMaster(params: GetDetailById8EvaluationTaskMasterParams): Promise<ResultEvaluationTaskMasterDetailVo> {
  return requestData<ResultEvaluationTaskMasterDetailVo>({
    url: `/temp/evaluation-task-master/getDetailById`,
    method: 'GET',
    params,
  })
}

/** 删除评测任务总表（统一管理四种评测任务） */
export function deleteOne8EvaluationTaskMaster(params: DeleteOne8EvaluationTaskMasterParams): Promise<ResultBoolean> {
  return requestData<ResultBoolean>({
    url: `/temp/evaluation-task-master/deleteOne`,
    method: 'DELETE',
    params,
  })
}

/** 批量删除评测任务总表（统一管理四种评测任务） */
export function batchDel8EvaluationTaskMaster(params: BatchDel8EvaluationTaskMasterParams): Promise<ResultBoolean> {
  return requestData<ResultBoolean>({
    url: `/temp/evaluation-task-master/batchDel`,
    method: 'DELETE',
    params,
  })
}
