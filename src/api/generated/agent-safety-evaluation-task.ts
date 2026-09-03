/**
 * [INPUT]: 由 OpenAPI 的 agent-safety-evaluation-task paths 生成，并依赖 @/api/request 的 requestData
 * [OUTPUT]: 对外提供 agent-safety-evaluation-task 模块的类型安全 API 请求函数
 * [POS]: src/api/generated 的自动生成 API 模块，供页面 Query 或 src/api 手写业务封装调用
 */
import type {
  AgentSafetyEvaluationTask,
  BatchDel11AgentSafetyEvaluationTaskParams,
  DeleteOne11AgentSafetyEvaluationTaskParams,
  GetDetailById11AgentSafetyEvaluationTaskParams,
  PageQuery,
  ResultAgentSafetyEvaluationTask,
  ResultBoolean,
  ResultPageAgentSafetyEvaluationTask,
} from './types/agent-safety-evaluation-task'
import { requestData } from '@/api/request'

/** 修改智能体安全评测任务表 */
export function update8AgentSafetyEvaluationTask(data: AgentSafetyEvaluationTask): Promise<ResultBoolean> {
  return requestData<ResultBoolean>({
    url: `/temp/agent-safety-evaluation-task/update`,
    method: 'PUT',
    data,
  })
}

/** 分页查询智能体安全评测任务表 */
export function findPage11AgentSafetyEvaluationTask(data: PageQuery): Promise<ResultPageAgentSafetyEvaluationTask> {
  return requestData<ResultPageAgentSafetyEvaluationTask>({
    url: `/temp/agent-safety-evaluation-task/page`,
    method: 'POST',
    data,
  })
}

/** 新增智能体安全评测任务表 */
export function add9AgentSafetyEvaluationTask(data: AgentSafetyEvaluationTask): Promise<ResultAgentSafetyEvaluationTask> {
  return requestData<ResultAgentSafetyEvaluationTask>({
    url: `/temp/agent-safety-evaluation-task/add`,
    method: 'POST',
    data,
  })
}

/** 获取智能体安全评测任务表 */
export function getDetailById11AgentSafetyEvaluationTask(params: GetDetailById11AgentSafetyEvaluationTaskParams): Promise<ResultAgentSafetyEvaluationTask> {
  return requestData<ResultAgentSafetyEvaluationTask>({
    url: `/temp/agent-safety-evaluation-task/getDetailById`,
    method: 'GET',
    params,
  })
}

/** 删除智能体安全评测任务表 */
export function deleteOne11AgentSafetyEvaluationTask(params: DeleteOne11AgentSafetyEvaluationTaskParams): Promise<ResultBoolean> {
  return requestData<ResultBoolean>({
    url: `/temp/agent-safety-evaluation-task/deleteOne`,
    method: 'DELETE',
    params,
  })
}

/** 批量删除智能体安全评测任务表 */
export function batchDel11AgentSafetyEvaluationTask(params: BatchDel11AgentSafetyEvaluationTaskParams): Promise<ResultBoolean> {
  return requestData<ResultBoolean>({
    url: `/temp/agent-safety-evaluation-task/batchDel`,
    method: 'DELETE',
    params,
  })
}
