import {
  add3PresetScene,
  batchDel4PresetScene,
  deleteOne4PresetScene,
  findPage4PresetScene,
  getDetailById4PresetScene,
  presetScene,
  update3PresetScene,
} from '@/api/generated/preset-scene'
import type {
  PresetScene as GeneratedPresetScene,
  PresetSceneVo as GeneratedPresetSceneVo,
} from '@/api/generated/types/preset-scene'
import { unwrapApiResult, unwrapApiResultOr } from '@/api/result'
import type {
  EvaluationTaskKind,
  PageQuery,
  PageResult,
  PresetScene,
  PresetSceneVo,
} from '@/api/types'

/** 获取预制场景（前台创建任务卡片）；须传 evaluationTaskType。 */
export async function fetchPresetScenes(
  evaluationTaskType: EvaluationTaskKind,
): Promise<PresetSceneVo[]> {
  const result = await presetScene({ evaluationTaskType })
  return unwrapApiResultOr(result, [], '加载预置场景失败') as GeneratedPresetSceneVo[] as PresetSceneVo[]
}

export async function pagePresetScenes(
  query: PageQuery<PresetScene>,
): Promise<PageResult<PresetScene>> {
  // OpenAPI 中 PageQuery.entity 的泛型被擦除，generated 暂时错误指向 UserContact；
  // 仅在生成代码边界转换，禁止手改 generated 类型。
  const result = await findPage4PresetScene(query as Parameters<typeof findPage4PresetScene>[0])
  const page = unwrapApiResultOr(result, { records: [], total: 0 }, '查询预置场景失败')
  return page as PageResult<PresetScene>
}

export async function addPresetScene(payload: PresetScene): Promise<PresetScene> {
  const result = await add3PresetScene(payload as GeneratedPresetScene)
  return unwrapApiResult(result, '新增预置场景失败') as PresetScene
}

export async function updatePresetScene(payload: PresetScene): Promise<boolean> {
  const result = await update3PresetScene(payload as GeneratedPresetScene)
  return unwrapApiResult(result, '修改预置场景失败')
}

export async function getPresetSceneById(id: number): Promise<PresetScene> {
  const result = await getDetailById4PresetScene({ id })
  return unwrapApiResult(result, '获取预置场景失败') as PresetScene
}

export async function deletePresetScene(id: number): Promise<boolean> {
  const result = await deleteOne4PresetScene({ id })
  return unwrapApiResult(result, '删除预置场景失败')
}

export async function batchDeletePresetScenes(ids: number[]): Promise<boolean> {
  const result = await batchDel4PresetScene({ ids })
  return unwrapApiResult(result, '批量删除预置场景失败')
}

/** 管理端列表：按任务类型分页。 */
export async function fetchPresetScenePage(params: {
  evaluationTaskType: EvaluationTaskKind
  pageCurrent?: number
  pageSize?: number
  name?: string
}): Promise<{ items: PresetScene[]; total: number }> {
  const entity: PresetScene = {
    evaluationTaskType: params.evaluationTaskType,
  }
  if (params.name?.trim()) entity.name = params.name.trim()

  const page = await pagePresetScenes({
    pageSize: params.pageSize ?? 10,
    pageCurrent: params.pageCurrent ?? 1,
    entity,
  })
  return {
    items: page.records || [],
    total: page.total ?? 0,
  }
}
