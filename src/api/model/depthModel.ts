import { add8DepthModel, dropdownDepthModel } from '@/api/generated/depth-model'
import type {
  BaseDropDepthModel as GeneratedBaseDropDepthModel,
  DepthModel as GeneratedDepthModel,
} from '@/api/generated/types/depth-model'
import { unwrapApiResult, unwrapApiResultOr } from '@/api/result'
import type { BaseDropDepthModel, DepthModel, DepthModelType } from '@/api/types'

/** 模型下拉（内置 / 用户）。 */
export async function fetchDepthModelDropdown(
  type?: DepthModelType,
): Promise<BaseDropDepthModel[]> {
  const result = await dropdownDepthModel(type ? { type } : {})
  return unwrapApiResultOr(result, [], '加载模型下拉失败') as GeneratedBaseDropDepthModel[] as BaseDropDepthModel[]
}

/** 新增用户模型（自定义 API 保存后进入后端下拉）。 */
export async function addDepthModel(payload: DepthModel): Promise<DepthModel> {
  const result = await add8DepthModel(payload as GeneratedDepthModel)
  return unwrapApiResult(result, '保存模型失败') as DepthModel
}
