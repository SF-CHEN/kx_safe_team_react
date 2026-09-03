import {
  add7EvaluationDimension,
  batchDel9EvaluationDimension,
  deleteOne9EvaluationDimension,
  dimensionDropdownEvaluationDimension,
  findPage9EvaluationDimension,
  getDetailById9EvaluationDimension,
  update6EvaluationDimension,
} from '@/api/generated/evaluation-dimension'
import type {
  EvaluationDimension,
  TreeDropEvaluationDimension,
} from '@/api/generated/types/evaluation-dimension'
import type { PageQuery, PageResult } from '@/api/pagination'
import { unwrapApiResult, unwrapApiResultOr } from '@/api/result'

export type EvaluationTaskKind = NonNullable<EvaluationDimension['evaluationTaskType']>

/** 获取维度下拉树；须传 evaluationTaskType。 */
export async function fetchDimensionDropdown(
  evaluationTaskType: EvaluationTaskKind,
): Promise<TreeDropEvaluationDimension[]> {
  return unwrapApiResultOr(
    await dimensionDropdownEvaluationDimension({ evaluationTaskType }),
    [],
    '加载评测维度失败',
  )
}

/** 将维度下拉树展平为列表（选项/多选场景用）。 */
export function flattenTreeDropEvaluationDimension(
  nodes: TreeDropEvaluationDimension[],
): EvaluationDimension[] {
  const result: EvaluationDimension[] = []
  const walk = (list: TreeDropEvaluationDimension[]) => {
    for (const node of list) {
      const item: EvaluationDimension = node.data
        ? { ...node.data, id: node.data.id ?? node.id, name: node.data.name ?? node.name }
        : { id: node.id, name: node.name }
      if (item.id != null) result.push(item)
      if (node.childs?.length) walk(node.childs)
    }
  }
  walk(nodes)
  return result
}

/** 拉取全部可选维度，场景配置等需要完整维度树时使用。 */
export async function fetchDimensionOptions(
  evaluationTaskType: EvaluationTaskKind,
): Promise<EvaluationDimension[]> {
  return flattenTreeDropEvaluationDimension(await fetchDimensionDropdown(evaluationTaskType))
}

export async function pageEvaluationDimensions(
  query: PageQuery<EvaluationDimension>,
): Promise<PageResult<EvaluationDimension>> {
  return unwrapApiResultOr(
    await findPage9EvaluationDimension(
      query as Parameters<typeof findPage9EvaluationDimension>[0],
    ),
    { records: [], total: 0 },
    '查询评测维度失败',
  )
}

export async function addEvaluationDimension(
  payload: EvaluationDimension,
): Promise<EvaluationDimension> {
  return unwrapApiResult(await add7EvaluationDimension(payload), '新增评测维度失败')
}

export async function updateEvaluationDimension(
  payload: EvaluationDimension,
): Promise<boolean> {
  return unwrapApiResult(await update6EvaluationDimension(payload), '修改评测维度失败')
}

export async function getEvaluationDimensionById(
  id: number,
): Promise<EvaluationDimension> {
  return unwrapApiResult(await getDetailById9EvaluationDimension({ id }), '获取评测维度失败')
}

export async function deleteEvaluationDimension(id: number): Promise<boolean> {
  return unwrapApiResult(await deleteOne9EvaluationDimension({ id }), '删除评测维度失败')
}

export async function batchDeleteEvaluationDimensions(ids: number[]): Promise<boolean> {
  return unwrapApiResult(await batchDel9EvaluationDimension({ ids }), '批量删除评测维度失败')
}

/** 管理端列表：按任务类型分页。 */
export async function fetchEvaluationDimensionPage(params: {
  evaluationTaskType: EvaluationTaskKind
  pageCurrent?: number
  pageSize?: number
  name?: string
}): Promise<{ items: EvaluationDimension[]; total: number }> {
  const entity: EvaluationDimension = { evaluationTaskType: params.evaluationTaskType }
  if (params.name?.trim()) entity.name = params.name.trim()

  const page = await pageEvaluationDimensions({
    pageSize: params.pageSize ?? 10,
    pageCurrent: params.pageCurrent ?? 1,
    entity,
  })
  return { items: page.records || [], total: page.total ?? 0 }
}

export type {
  EvaluationDimension,
  TreeDropEvaluationDimension,
} from '@/api/generated/types/evaluation-dimension'
