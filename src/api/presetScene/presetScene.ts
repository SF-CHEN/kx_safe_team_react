import {
  add3PresetScene,
  deleteOne4PresetScene,
  findPage4PresetScene,
  presetScene,
  update3PresetScene,
} from '@/api/generated/preset-scene'
import type { PresetScene, PresetSceneVo } from '@/api/generated/types/preset-scene'
import type { PageQuery, PageResult } from '@/api/pagination'
import { unwrapApiResult, unwrapApiResultOr } from '@/api/result'

export type EvaluationTaskKind = NonNullable<PresetScene['evaluationTaskType']>

/** 获取预制场景（前台创建任务卡片）；须传 evaluationTaskType。 */
export async function fetchPresetScenes(
  evaluationTaskType: EvaluationTaskKind,
): Promise<PresetSceneVo[]> {
  return unwrapApiResultOr(await presetScene({ evaluationTaskType }), [], '加载预置场景失败')
}

export async function pagePresetScenes(
  query: PageQuery<PresetScene>,
): Promise<PageResult<PresetScene>> {
  return unwrapApiResultOr(
    await findPage4PresetScene(query as Parameters<typeof findPage4PresetScene>[0]),
    { records: [], total: 0 },
    '查询预置场景失败',
  )
}

export async function addPresetScene(payload: PresetScene): Promise<PresetScene> {
  return unwrapApiResult(await add3PresetScene(payload), '新增预置场景失败')
}

export async function updatePresetScene(payload: PresetScene): Promise<boolean> {
  return unwrapApiResult(await update3PresetScene(payload), '修改预置场景失败')
}

export async function deletePresetScene(id: number): Promise<boolean> {
  return unwrapApiResult(await deleteOne4PresetScene({ id }), '删除预置场景失败')
}

/** 管理端列表：按任务类型分页。 */
export async function fetchPresetScenePage(params: {
  evaluationTaskType: EvaluationTaskKind
  pageCurrent?: number
  pageSize?: number
  name?: string
}): Promise<{ items: PresetScene[]; total: number }> {
  const entity: PresetScene = { evaluationTaskType: params.evaluationTaskType }
  if (params.name?.trim()) entity.name = params.name.trim()

  const page = await pagePresetScenes({
    pageSize: params.pageSize ?? 10,
    pageCurrent: params.pageCurrent ?? 1,
    entity,
  })
  return { items: page.records || [], total: page.total ?? 0 }
}

export type { PresetScene, PresetSceneVo } from '@/api/generated/types/preset-scene'
