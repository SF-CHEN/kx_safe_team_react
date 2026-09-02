import { tempRequest } from '@/api/request'
import type { BaseDropDepthModel, DepthModel, DepthModelType } from '@/api/types'
import { unwrapGatewayData } from '@/utils/gateway'

/** 模型下拉（内置 / 用户）。 */
export async function fetchDepthModelDropdown(
  type?: DepthModelType,
): Promise<BaseDropDepthModel[]> {
  const { data } = await tempRequest.get('/temp/depth-model/dropdown', {
    params: type ? { type } : undefined,
  })
  return unwrapGatewayData<BaseDropDepthModel[]>(data) || []
}

/** 新增用户模型（自定义 API 保存后进入后端下拉）。 */
export async function addDepthModel(payload: DepthModel): Promise<DepthModel> {
  const { data } = await tempRequest.post('/temp/depth-model/add', payload, {
    headers: { 'Content-Type': 'application/json' },
  })
  return unwrapGatewayData<DepthModel>(data)
}
