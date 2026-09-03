import {
  adminReplyEvaluationTaskMasterCommunication,
  listByMasterIdEvaluationTaskMasterCommunication,
} from '@/api/generated/evaluation-task-master-communication'
import type {
  AdminReplySo,
  EvaluationTaskMasterCommunication,
} from '@/api/generated/types/evaluation-task-master-communication'
import { unwrapApiResult, unwrapApiResultOr } from '@/api/result'

/** 管理员返回意见：请求补件 / 终止任务。 */
export async function adminReplyEvaluationTask(payload: AdminReplySo): Promise<boolean> {
  return unwrapApiResult(
    await adminReplyEvaluationTaskMasterCommunication(payload),
    '提交管理员意见失败',
  )
}

/** 按总表 id 查询沟通记录。 */
export async function listCommunicationsByMasterId(
  evaluationTaskMasterId: number,
): Promise<EvaluationTaskMasterCommunication[]> {
  return unwrapApiResultOr(
    await listByMasterIdEvaluationTaskMasterCommunication({ evaluationTaskMasterId }),
    [],
    '加载沟通记录失败',
  )
}

export type {
  AdminReplySo,
  EvaluationTaskMasterCommunication,
} from '@/api/generated/types/evaluation-task-master-communication'
