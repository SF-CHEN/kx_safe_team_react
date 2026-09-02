import { tempRequest } from '@/api/request'
import type {
  AdminReplySo,
  EvaluationTaskMasterCommunication,
} from '@/api/types'
import { unwrapGatewayData } from '@/utils/gateway'

/** 管理员返回意见：请求补件 / 终止任务。 */
export async function adminReplyEvaluationTask(payload: AdminReplySo): Promise<boolean> {
  const { data } = await tempRequest.post(
    '/temp/evaluation-task-master-communication/adminReply',
    payload,
    { headers: { 'Content-Type': 'application/json' } },
  )
  return unwrapGatewayData<boolean>(data)
}

/** 按总表 id 查询沟通记录。 */
export async function listCommunicationsByMasterId(
  evaluationTaskMasterId: number,
): Promise<EvaluationTaskMasterCommunication[]> {
  const { data } = await tempRequest.get(
    '/temp/evaluation-task-master-communication/listByMasterId',
    { params: { evaluationTaskMasterId } },
  )
  return unwrapGatewayData<EvaluationTaskMasterCommunication[]>(data) || []
}
