/**
 * [INPUT]: 由 OpenAPI 的 preset-scene paths 生成，并依赖 @/api/request 的 requestData
 * [OUTPUT]: 对外提供 preset-scene 模块的类型安全 API 请求函数
 * [POS]: src/api/generated 的自动生成 API 模块，供页面 Query 或 src/api 手写业务封装调用
 */
import type {
  BatchDel4PresetSceneParams,
  DeleteOne4PresetSceneParams,
  GetDetailById4PresetSceneParams,
  PageQuery,
  PresetScene,
  PresetSceneParams,
  ResultBoolean,
  ResultListPresetSceneVo,
  ResultPagePresetScene,
  ResultPresetScene,
} from './types/preset-scene'
import { requestData } from '@/api/request'

/** 修改预制场景表，原sys_dict中type=PRESET_SCENE的数据迁移至此 */
export function update3PresetScene(data: PresetScene): Promise<ResultBoolean> {
  return requestData<ResultBoolean>({
    url: `/temp/preset-scene/update`,
    method: 'PUT',
    data,
  })
}

/** 分页查询预制场景表，原sys_dict中type=PRESET_SCENE的数据迁移至此 */
export function findPage4PresetScene(data: PageQuery): Promise<ResultPagePresetScene> {
  return requestData<ResultPagePresetScene>({
    url: `/temp/preset-scene/page`,
    method: 'POST',
    data,
  })
}

/** 新增预制场景表，原sys_dict中type=PRESET_SCENE的数据迁移至此 */
export function add3PresetScene(data: PresetScene): Promise<ResultPresetScene> {
  return requestData<ResultPresetScene>({
    url: `/temp/preset-scene/add`,
    method: 'POST',
    data,
  })
}

/** 获取预制场景 */
export function presetScene(params: PresetSceneParams): Promise<ResultListPresetSceneVo> {
  return requestData<ResultListPresetSceneVo>({
    url: `/temp/preset-scene/presetScene`,
    method: 'GET',
    params,
  })
}

/** 获取预制场景表，原sys_dict中type=PRESET_SCENE的数据迁移至此 */
export function getDetailById4PresetScene(params: GetDetailById4PresetSceneParams): Promise<ResultPresetScene> {
  return requestData<ResultPresetScene>({
    url: `/temp/preset-scene/getDetailById`,
    method: 'GET',
    params,
  })
}

/** 删除预制场景表，原sys_dict中type=PRESET_SCENE的数据迁移至此 */
export function deleteOne4PresetScene(params: DeleteOne4PresetSceneParams): Promise<ResultBoolean> {
  return requestData<ResultBoolean>({
    url: `/temp/preset-scene/deleteOne`,
    method: 'DELETE',
    params,
  })
}

/** 批量删除预制场景表，原sys_dict中type=PRESET_SCENE的数据迁移至此 */
export function batchDel4PresetScene(params: BatchDel4PresetSceneParams): Promise<ResultBoolean> {
  return requestData<ResultBoolean>({
    url: `/temp/preset-scene/batchDel`,
    method: 'DELETE',
    params,
  })
}
