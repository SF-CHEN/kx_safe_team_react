/**
 * [INPUT]: 由 OpenAPI 的 evaluation-dimension paths 生成，并依赖 @/api/request 的 requestData
 * [OUTPUT]: 对外提供 evaluation-dimension 模块的类型安全 API 请求函数
 * [POS]: src/api/generated 的自动生成 API 模块，供页面 Query 或 src/api 手写业务封装调用
 */
import type {
  BatchDel9EvaluationDimensionParams,
  DeleteOne9EvaluationDimensionParams,
  DimensionDropdownEvaluationDimensionParams,
  EvaluationDimension,
  GetDetailById9EvaluationDimensionParams,
  PageQuery,
  ResultBoolean,
  ResultEvaluationDimension,
  ResultListTreeDropEvaluationDimension,
  ResultPageEvaluationDimension,
} from './types/evaluation-dimension'
import { requestData } from '@/api/request'

/** 修改评测维度表，树形结构，原sys_dict中type=DIMENSION的数据迁移至此 */
export function update6EvaluationDimension(data: EvaluationDimension): Promise<ResultBoolean> {
  return requestData<ResultBoolean>({
    url: `/temp/evaluation-dimension/update`,
    method: 'PUT',
    data,
  })
}

/** 分页查询评测维度表，树形结构，原sys_dict中type=DIMENSION的数据迁移至此 */
export function findPage9EvaluationDimension(data: PageQuery): Promise<ResultPageEvaluationDimension> {
  return requestData<ResultPageEvaluationDimension>({
    url: `/temp/evaluation-dimension/page`,
    method: 'POST',
    data,
  })
}

/** 新增评测维度表，树形结构，原sys_dict中type=DIMENSION的数据迁移至此 */
export function add7EvaluationDimension(data: EvaluationDimension): Promise<ResultEvaluationDimension> {
  return requestData<ResultEvaluationDimension>({
    url: `/temp/evaluation-dimension/add`,
    method: 'POST',
    data,
  })
}

/** 获取评测维度表，树形结构，原sys_dict中type=DIMENSION的数据迁移至此 */
export function getDetailById9EvaluationDimension(params: GetDetailById9EvaluationDimensionParams): Promise<ResultEvaluationDimension> {
  return requestData<ResultEvaluationDimension>({
    url: `/temp/evaluation-dimension/getDetailById`,
    method: 'GET',
    params,
  })
}

/** 获取维度下拉树 */
export function dimensionDropdownEvaluationDimension(params: DimensionDropdownEvaluationDimensionParams): Promise<ResultListTreeDropEvaluationDimension> {
  return requestData<ResultListTreeDropEvaluationDimension>({
    url: `/temp/evaluation-dimension/dimensionDropdown`,
    method: 'GET',
    params,
  })
}

/** 删除评测维度表，树形结构，原sys_dict中type=DIMENSION的数据迁移至此 */
export function deleteOne9EvaluationDimension(params: DeleteOne9EvaluationDimensionParams): Promise<ResultBoolean> {
  return requestData<ResultBoolean>({
    url: `/temp/evaluation-dimension/deleteOne`,
    method: 'DELETE',
    params,
  })
}

/** 批量删除评测维度表，树形结构，原sys_dict中type=DIMENSION的数据迁移至此 */
export function batchDel9EvaluationDimension(params: BatchDel9EvaluationDimensionParams): Promise<ResultBoolean> {
  return requestData<ResultBoolean>({
    url: `/temp/evaluation-dimension/batchDel`,
    method: 'DELETE',
    params,
  })
}
