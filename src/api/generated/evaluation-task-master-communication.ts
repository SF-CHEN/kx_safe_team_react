/**
 * [INPUT]: 由 OpenAPI 的 evaluation-task-master-communication paths 生成，并依赖 @/api/request 的 requestData
 * [OUTPUT]: 对外提供 evaluation-task-master-communication 模块的类型安全 API 请求函数
 * [POS]: src/api/generated 的自动生成 API 模块，供页面 Query 或 src/api 手写业务封装调用
 */
import type {
  AdminReplySo,
  ListByMasterIdEvaluationTaskMasterCommunicationParams,
  ResultBoolean,
  ResultListEvaluationTaskMasterCommunication,
} from './types/evaluation-task-master-communication'
import { requestData } from '@/api/request'

/** 管理员返回意见 */
export function adminReplyEvaluationTaskMasterCommunication(data: AdminReplySo): Promise<ResultBoolean> {
  return requestData<ResultBoolean>({
    url: `/temp/evaluation-task-master-communication/adminReply`,
    method: 'POST',
    data,
  })
}

/** 查询用户沟通记录 */
export function listByMasterIdEvaluationTaskMasterCommunication(params: ListByMasterIdEvaluationTaskMasterCommunicationParams): Promise<ResultListEvaluationTaskMasterCommunication> {
  return requestData<ResultListEvaluationTaskMasterCommunication>({
    url: `/temp/evaluation-task-master-communication/listByMasterId`,
    method: 'GET',
    params,
  })
}
