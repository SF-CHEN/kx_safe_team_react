import { add8DepthModel, dropdownDepthModel } from '@/api/generated/depth-model'
import type { BaseDropDepthModel, DepthModel } from '@/api/generated/types/depth-model'
import { unwrapApiResult, unwrapApiResultOr } from '@/api/result'

export type DepthModelType = NonNullable<DepthModel['type']>

/** 模型下拉（内置 / 用户）。 */
export async function fetchDepthModelDropdown(
  type?: DepthModelType,
): Promise<BaseDropDepthModel[]> {
  return unwrapApiResultOr(
    await dropdownDepthModel(type ? { type } : {}),
    [],
    '加载模型下拉失败',
  )
}

/** 新增用户模型（自定义 API 保存后进入后端下拉）。 */
export async function addDepthModel(payload: DepthModel): Promise<DepthModel> {
  return unwrapApiResult(await add8DepthModel(payload), '保存模型失败')
}

export type { BaseDropDepthModel, DepthModel } from '@/api/generated/types/depth-model'
