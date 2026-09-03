import {
  adminReplyEvaluationTaskMasterCommunication,
  listByMasterIdEvaluationTaskMasterCommunication,
} from '@/api/generated/evaluation-task-master-communication'
import { unwrapApiResult, unwrapApiResultOr } from '@/api/result'
import type {
  AdminReplySo,
  EvaluationTaskMasterCommunication,
} from '@/api/types'

/** 管理员返回意见：请求补件 / 终止任务。 */
export async function adminReplyEvaluationTask(payload: AdminReplySo): Promise<boolean> {
  const result = await adminReplyEvaluationTaskMasterCommunication(payload)
  return unwrapApiResult(result, '提交管理员意见失败')
}

/** 按总表 id 查询沟通记录。 */
export async function listCommunicationsByMasterId(
  evaluationTaskMasterId: number,
): Promise<EvaluationTaskMasterCommunication[]> {
  const result = await listByMasterIdEvaluationTaskMasterCommunication({ evaluationTaskMasterId })
  return unwrapApiResultOr(result, [], '加载沟通记录失败') as EvaluationTaskMasterCommunication[]
}
