/**
 * @deprecated 维度/场景已迁至 `/temp/preset-scene`、`/temp/evaluation-dimension`。
 * 本文件仅保留兼容再导出，新代码请从 `@/api/presetScene` / `@/api/evaluationDimension` 导入。
 */
export {
  fetchPresetScenes,
  pagePresetScenes as pageSysDictPresetScenes,
  addPresetScene,
  updatePresetScene,
  getPresetSceneById,
  deletePresetScene,
  batchDeletePresetScenes,
  fetchPresetScenePage,
} from '@/api/presetScene';

export {
  fetchDimensionDropdown,
  fetchDimensionOptions,
  flattenTreeDropEvaluationDimension as flattenTreeDropSysDict,
  pageEvaluationDimensions,
  addEvaluationDimension,
  updateEvaluationDimension,
  getEvaluationDimensionById,
  deleteEvaluationDimension,
  batchDeleteEvaluationDimensions,
  fetchEvaluationDimensionPage,
} from '@/api/evaluationDimension';
