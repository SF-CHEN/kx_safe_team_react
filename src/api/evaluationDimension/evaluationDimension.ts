import {
  add7EvaluationDimension,
  batchDel9EvaluationDimension,
  deleteOne9EvaluationDimension,
  dimensionDropdownEvaluationDimension,
  findPage9EvaluationDimension,
  getDetailById9EvaluationDimension,
  update6EvaluationDimension,
} from '@/api/generated/evaluation-dimension'
import type { EvaluationDimension as GeneratedEvaluationDimension } from '@/api/generated/types/evaluation-dimension'
import { unwrapApiResult, unwrapApiResultOr } from '@/api/result'
import type {
  EvaluationDimension,
  EvaluationTaskKind,
  PageQuery,
  PageResult,
  TreeDropEvaluationDimension,
} from '@/api/types'

/** 获取维度下拉树；须传 evaluationTaskType。 */
export async function fetchDimensionDropdown(
  evaluationTaskType: EvaluationTaskKind,
): Promise<TreeDropEvaluationDimension[]> {
  const result = await dimensionDropdownEvaluationDimension({ evaluationTaskType })
  return unwrapApiResultOr(result, [], '加载评测维度失败') as TreeDropEvaluationDimension[]
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

/**
 * 拉取可选维度全量（管理端场景勾选子维度等）。
 * 必须用 dimensionDropdown，禁止用 page 硬拉一页凑选项。
 */
export async function fetchDimensionOptions(
  evaluationTaskType: EvaluationTaskKind,
): Promise<EvaluationDimension[]> {
  const tree = await fetchDimensionDropdown(evaluationTaskType)
  return flattenTreeDropEvaluationDimension(tree)
}

export async function pageEvaluationDimensions(
  query: PageQuery<EvaluationDimension>,
): Promise<PageResult<EvaluationDimension>> {
  // OpenAPI 未保留 PageQuery.entity 泛型，只在 generated 边界转换。
  const result = await findPage9EvaluationDimension(
    query as Parameters<typeof findPage9EvaluationDimension>[0],
  )
  return unwrapApiResultOr(result, { records: [], total: 0 }, '查询评测维度失败') as PageResult<EvaluationDimension>
}

export async function addEvaluationDimension(
  payload: EvaluationDimension,
): Promise<EvaluationDimension> {
  const result = await add7EvaluationDimension(payload as GeneratedEvaluationDimension)
  return unwrapApiResult(result, '新增评测维度失败') as EvaluationDimension
}

export async function updateEvaluationDimension(
  payload: EvaluationDimension,
): Promise<boolean> {
  const result = await update6EvaluationDimension(payload as GeneratedEvaluationDimension)
  return unwrapApiResult(result, '修改评测维度失败')
}

export async function getEvaluationDimensionById(
  id: number,
): Promise<EvaluationDimension> {
  const result = await getDetailById9EvaluationDimension({ id })
  return unwrapApiResult(result, '获取评测维度失败') as EvaluationDimension
}

export async function deleteEvaluationDimension(id: number): Promise<boolean> {
  const result = await deleteOne9EvaluationDimension({ id })
  return unwrapApiResult(result, '删除评测维度失败')
}

export async function batchDeleteEvaluationDimensions(
  ids: number[],
): Promise<boolean> {
  const result = await batchDel9EvaluationDimension({ ids })
  return unwrapApiResult(result, '批量删除评测维度失败')
}

/** 管理端列表：按任务类型分页。 */
export async function fetchEvaluationDimensionPage(params: {
  evaluationTaskType: EvaluationTaskKind
  pageCurrent?: number
  pageSize?: number
  name?: string
}): Promise<{ items: EvaluationDimension[]; total: number }> {
  const entity: EvaluationDimension = {
    evaluationTaskType: params.evaluationTaskType,
  }
  if (params.name?.trim()) entity.name = params.name.trim()

  const page = await pageEvaluationDimensions({
    pageSize: params.pageSize ?? 10,
    pageCurrent: params.pageCurrent ?? 1,
    entity,
  })
  return {
    items: page.records || [],
    total: page.total ?? 0,
  }
}
