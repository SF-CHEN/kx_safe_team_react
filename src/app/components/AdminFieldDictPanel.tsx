import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Layers, Pencil, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  addEvaluationDimension,
  deleteEvaluationDimension,
  fetchDimensionOptions,
  fetchEvaluationDimensionPage,
  updateEvaluationDimension,
} from '@/api/evaluationDimension';
import {
  addPresetScene,
  deletePresetScene,
  fetchPresetScenePage,
  updatePresetScene,
} from '@/api/presetScene';
import type {
  EvaluationDimension,
  EvaluationTaskKind,
  PresetScene,
} from '@/api/types';
import { DataPagination } from './DataPagination';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { addAdminOperationLog } from '../data/workflowStore';

type DictTab = 'DIMENSION' | 'PRESET_SCENE';

const TABS: { key: DictTab; label: string; hint: string }[] = [
  {
    key: 'DIMENSION',
    label: '评测维度',
    hint: '管理评测维度条目（名称、排序、任务类型）',
  },
  {
    key: 'PRESET_SCENE',
    label: '预设场景',
    hint: '管理大模型评测创建任务中可选的预设场景；dimensionIds 为子维度 id 集合',
  },
];

const TASK_KIND_OPTIONS: { value: EvaluationTaskKind; label: string }[] = [
  { value: 'PERFORMANCE', label: '性能评测' },
  { value: 'SAFETY', label: '安全评测' },
];

function formatDateTime(value?: string) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString('zh-CN', { hour12: false });
}

function formatTaskKind(value?: EvaluationTaskKind) {
  if (value === 'PERFORMANCE') return '性能评测';
  if (value === 'SAFETY') return '安全评测';
  return '—';
}

/** 解析场景 dimensionIds：子维度 id 集合，支持逗号/中文逗号/空白分隔 */
function parseIdList(value?: string): number[] {
  if (!value?.trim()) return [];
  return [
    ...new Set(
      value
        .split(/[,，\s]+/)
        .map((part) => Number(part.trim()))
        .filter((id) => Number.isFinite(id) && id > 0),
    ),
  ];
}

function joinIdList(ids: number[]): string {
  return [...new Set(ids.filter((id) => Number.isFinite(id) && id > 0))]
    .sort((a, b) => a - b)
    .join(',');
}

type FormState = {
  id?: number;
  name: string;
  /** 场景：子维度 id 集合；维度表单不用 */
  dimensionIds: string;
  sortOrder: string;
};

const emptyForm = (): FormState => ({
  name: '',
  dimensionIds: '',
  sortOrder: '',
});

function DimensionIdMultiSelect({
  options,
  selectedIds,
  onChange,
  disabled,
}: {
  options: EvaluationDimension[];
  selectedIds: number[];
  onChange: (ids: number[]) => void;
  disabled?: boolean;
}) {
  const selected = useMemo(() => new Set(selectedIds), [selectedIds]);

  const toggle = (id: number) => {
    if (disabled) return;
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    onChange([...next]);
  };

  if (!options.length) {
    return (
      <div className="rounded-xl border border-dashed border-slate-200 px-3 py-6 text-center text-xs text-slate-400">
        暂无评测维度，请先在「评测维度」中创建
      </div>
    );
  }

  return (
    <div className="max-h-48 space-y-1 overflow-y-auto rounded-xl border border-slate-200 bg-slate-50/60 p-2">
      {options.map((item) => {
        if (item.id == null) return null;
        const checked = selected.has(item.id);
        return (
          <label
            key={item.id}
            className={`flex cursor-pointer items-center gap-2 rounded-lg px-2.5 py-2 text-sm transition ${
              checked ? 'bg-blue-50 text-blue-700' : 'bg-white text-slate-700 hover:bg-slate-50'
            }`}
          >
            <input
              type="checkbox"
              className="rounded border-slate-300"
              checked={checked}
              disabled={disabled}
              onChange={() => toggle(item.id!)}
            />
            <span className="min-w-0 flex-1 truncate font-medium">{item.name || `#${item.id}`}</span>
            <span className="shrink-0 text-[11px] text-slate-400">#{item.id}</span>
          </label>
        );
      })}
    </div>
  );
}

function DictFormDialog({
  open,
  tab,
  title,
  initial,
  taskKindLabel,
  dimensionOptions,
  saving,
  onClose,
  onSubmit,
}: {
  open: boolean;
  tab: DictTab;
  title: string;
  initial: FormState;
  taskKindLabel: string;
  dimensionOptions: EvaluationDimension[];
  saving: boolean;
  onClose: () => void;
  onSubmit: (form: FormState) => void;
}) {
  const [form, setForm] = useState<FormState>(initial);
  const sceneDimensionIds = useMemo(
    () => parseIdList(form.dimensionIds),
    [form.dimensionIds],
  );

  useEffect(() => {
    if (open) setForm(initial);
  }, [open, initial]);

  const canSubmit =
    !!form.name.trim() &&
    (tab === 'PRESET_SCENE' ? sceneDimensionIds.length > 0 : true);

  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent className={tab === 'PRESET_SCENE' ? 'max-w-lg' : 'max-w-md'}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            onSubmit(form);
          }}
        >
          <div className="rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-500">
            任务类型：<span className="font-semibold text-slate-700">{taskKindLabel}</span>
            <span className="text-slate-400">（由上方筛选决定）</span>
          </div>

          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-slate-500">名称</span>
            <input
              required
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
              placeholder={tab === 'PRESET_SCENE' ? '如：内容安全综合场景' : '如：有害内容生成'}
            />
          </label>

          {tab === 'PRESET_SCENE' ? (
            <div className="block">
              <span className="mb-1.5 block text-xs font-semibold text-slate-500">
                子维度 <span className="font-normal text-slate-400">（dimensionIds，必选）</span>
              </span>
              <DimensionIdMultiSelect
                options={dimensionOptions}
                selectedIds={sceneDimensionIds}
                disabled={saving}
                onChange={(ids) =>
                  setForm((prev) => ({ ...prev, dimensionIds: joinIdList(ids) }))
                }
              />
              <p className="mt-1.5 text-[11px] text-slate-400">
                将写入 dimensionIds，格式如 <code className="text-slate-500">1,2,3</code>
                {sceneDimensionIds.length > 0 ? ` · 已选 ${sceneDimensionIds.length} 个` : ''}
              </p>
            </div>
          ) : null}

          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-slate-500">
              排序 <span className="font-normal text-slate-400">（可选，越小越靠前）</span>
            </span>
            <input
              type="number"
              value={form.sortOrder}
              onChange={(e) => setForm((prev) => ({ ...prev, sortOrder: e.target.value }))}
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
              placeholder="如：10"
            />
          </label>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={saving || !canSubmit}
              className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {saving ? '保存中…' : '保存'}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/** 列表内快捷编辑场景的子维度 id 集合（写回 scene.dimensionIds） */
function SceneDimensionValuePanel({
  scene,
  taskKind,
  onChanged,
}: {
  scene: PresetScene;
  taskKind: EvaluationTaskKind;
  onChanged: () => void;
}) {
  const [options, setOptions] = useState<EvaluationDimension[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>(() =>
    parseIdList(scene.dimensionIds),
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setSelectedIds(parseIdList(scene.dimensionIds));
  }, [scene.dimensionIds, scene.id]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    void fetchDimensionOptions(taskKind)
      .then((list) => {
        if (!cancelled) setOptions(list);
      })
      .catch(() => {
        if (!cancelled) setOptions([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [taskKind]);

  const save = async () => {
    if (scene.id == null) return;
    if (selectedIds.length === 0) {
      toast.error('请至少选择一个子维度');
      return;
    }
    setSaving(true);
    try {
      const nextValue = joinIdList(selectedIds);
      await updatePresetScene({
        ...scene,
        id: scene.id,
        dimensionIds: nextValue,
      });
      addAdminOperationLog({
        operator: 'admin',
        action: '更新场景子维度',
        detail: `${scene.name} → ${nextValue}`,
      });
      toast.success('子维度已更新');
      onChanged();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : '保存失败');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-sm font-bold text-slate-800">子维度 id 集合（dimensionIds）</div>
          <p className="mt-0.5 text-xs text-slate-400">勾选后写入场景 dimensionIds</p>
        </div>
        <button
          type="button"
          disabled={saving || loading}
          onClick={() => void save()}
          className="rounded-lg bg-blue-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-blue-700 disabled:opacity-60"
        >
          {saving ? '保存中…' : '保存子维度'}
        </button>
      </div>
      {loading ? (
        <p className="text-xs text-slate-400">加载维度列表…</p>
      ) : (
        <DimensionIdMultiSelect
          options={options}
          selectedIds={selectedIds}
          disabled={saving}
          onChange={setSelectedIds}
        />
      )}
      <p className="mt-2 text-[11px] text-slate-400">
        当前 dimensionIds：{joinIdList(selectedIds) || '（空）'}
      </p>
    </div>
  );
}

type ListRow = EvaluationDimension | PresetScene;

/** 后台 · 字段管理：维度与预设场景（preset-scene / evaluation-dimension） */
export function AdminFieldDictPanel() {
  const [tab, setTab] = useState<DictTab>('DIMENSION');
  const [taskKind, setTaskKind] = useState<EvaluationTaskKind>('PERFORMANCE');
  const [items, setItems] = useState<ListRow[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [dimensionOptions, setDimensionOptions] = useState<EvaluationDimension[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formInitial, setFormInitial] = useState<FormState>(emptyForm());
  const [saving, setSaving] = useState(false);
  const [expandedSceneId, setExpandedSceneId] = useState<number | null>(null);

  const tabMeta = TABS.find((t) => t.key === tab)!;
  const taskKindLabel =
    TASK_KIND_OPTIONS.find((o) => o.value === taskKind)?.label || taskKind;

  const loadList = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        evaluationTaskType: taskKind,
        pageCurrent: page,
        pageSize,
        name: keyword || undefined,
      };
      const result =
        tab === 'PRESET_SCENE'
          ? await fetchPresetScenePage(params)
          : await fetchEvaluationDimensionPage(params);
      setItems(result.items);
      setTotal(result.total);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : '加载字段列表失败');
      setItems([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [keyword, page, pageSize, tab, taskKind]);

  const loadDimensionOptions = useCallback(async () => {
    try {
      setDimensionOptions(await fetchDimensionOptions(taskKind));
    } catch {
      setDimensionOptions([]);
    }
  }, [taskKind]);

  useEffect(() => {
    void loadList();
  }, [loadList]);

  const dimensionNameMap = useMemo(() => {
    const map = new Map<number, string>();
    for (const item of items) {
      if (item.id != null) map.set(item.id, item.name || `#${item.id}`);
    }
    for (const item of dimensionOptions) {
      if (item.id != null) map.set(item.id, item.name || `#${item.id}`);
    }
    return map;
  }, [dimensionOptions, items]);

  const openCreate = () => {
    setFormInitial(emptyForm());
    setDialogOpen(true);
    if (tab === 'PRESET_SCENE') void loadDimensionOptions();
  };

  const openEdit = (row: ListRow) => {
    setFormInitial({
      id: row.id,
      name: row.name || '',
      dimensionIds:
        tab === 'PRESET_SCENE' ? (row as PresetScene).dimensionIds || '' : '',
      sortOrder: row.sortOrder != null ? String(row.sortOrder) : '',
    });
    setDialogOpen(true);
    if (tab === 'PRESET_SCENE') void loadDimensionOptions();
  };

  const parseSortOrder = (raw: string): number | undefined => {
    const trimmed = raw.trim();
    if (!trimmed) return undefined;
    const n = Number(trimmed);
    return Number.isFinite(n) ? n : undefined;
  };

  const submitForm = async (form: FormState) => {
    const name = form.name.trim();
    if (!name) {
      toast.error('请填写名称');
      return;
    }

    const sortOrder = parseSortOrder(form.sortOrder);

    setSaving(true);
    try {
      if (tab === 'PRESET_SCENE') {
        const ids = parseIdList(form.dimensionIds);
        if (ids.length === 0) {
          toast.error('请至少选择一个子维度');
          setSaving(false);
          return;
        }
        const payload: PresetScene = {
          name,
          dimensionIds: joinIdList(ids),
          evaluationTaskType: taskKind,
          ...(sortOrder != null ? { sortOrder } : {}),
        };
        if (form.id != null) {
          payload.id = form.id;
          await updatePresetScene(payload);
          addAdminOperationLog({
            operator: 'admin',
            action: '修改预设场景',
            detail: name,
          });
          toast.success('已更新');
        } else {
          await addPresetScene(payload);
          addAdminOperationLog({
            operator: 'admin',
            action: '新增预设场景',
            detail: name,
          });
          toast.success('已新增');
        }
      } else {
        const payload: EvaluationDimension = {
          name,
          evaluationTaskType: taskKind,
          parentId: 0,
          ...(sortOrder != null ? { sortOrder } : {}),
        };
        if (form.id != null) {
          payload.id = form.id;
          await updateEvaluationDimension(payload);
          addAdminOperationLog({
            operator: 'admin',
            action: '修改评测维度',
            detail: name,
          });
          toast.success('已更新');
        } else {
          await addEvaluationDimension(payload);
          addAdminOperationLog({
            operator: 'admin',
            action: '新增评测维度',
            detail: name,
          });
          toast.success('已新增');
        }
      }
      setDialogOpen(false);
      await loadList();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : '保存失败');
    } finally {
      setSaving(false);
    }
  };

  const removeRow = async (row: ListRow) => {
    if (row.id == null) return;
    const label = tab === 'PRESET_SCENE' ? '预设场景' : '评测维度';
    if (!window.confirm(`确认删除${label}「${row.name}」？`)) return;
    try {
      if (tab === 'PRESET_SCENE') {
        await deletePresetScene(row.id);
      } else {
        await deleteEvaluationDimension(row.id);
      }
      addAdminOperationLog({
        operator: 'admin',
        action: tab === 'PRESET_SCENE' ? '删除预设场景' : '删除评测维度',
        detail: row.name || String(row.id),
      });
      toast.success('已删除');
      if (expandedSceneId === row.id) setExpandedSceneId(null);
      await loadList();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : '删除失败');
    }
  };

  const switchTab = (next: DictTab) => {
    setTab(next);
    setPage(1);
    setKeyword('');
    setSearchInput('');
    setExpandedSceneId(null);
  };

  const switchTaskKind = (next: EvaluationTaskKind) => {
    setTaskKind(next);
    setPage(1);
    setExpandedSceneId(null);
  };

  const formatSceneDimensions = (dimensionIds?: string) => {
    const ids = parseIdList(dimensionIds);
    if (!ids.length) return '—';
    const labels = ids.map((id) => dimensionNameMap.get(id) || `#${id}`);
    return labels.join('、');
  };

  return (
    <section className="mb-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b px-5 py-4">
        <div>
          <h3 className="font-bold text-slate-900">字段管理</h3>
          <p className="mt-1 text-xs text-slate-400">{tabMeta.hint}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex rounded-xl border border-slate-200 bg-slate-50 p-1">
            {TASK_KIND_OPTIONS.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => switchTaskKind(item.value)}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                  taskKind === item.value
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className="flex rounded-xl border border-slate-200 bg-slate-50 p-1">
            {TABS.map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => switchTab(item.key)}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                  tab === item.key
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700"
          >
            <Plus className="h-3.5 w-3.5" />
            新增{tab === 'PRESET_SCENE' ? '场景' : '维度'}
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 border-b bg-slate-50/80 px-5 py-3">
        <input
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              setKeyword(searchInput.trim());
              setPage(1);
            }
          }}
          className="w-full max-w-xs rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
          placeholder="按名称搜索，回车查询"
        />
        <button
          type="button"
          onClick={() => {
            setKeyword(searchInput.trim());
            setPage(1);
          }}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 hover:border-blue-300 hover:text-blue-600"
        >
          查询
        </button>
        <span className="ml-auto rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
          {total} 条
        </span>
      </div>

      {loading ? (
        <div className="px-6 py-10 text-center text-sm text-slate-400">加载中…</div>
      ) : items.length === 0 ? (
        <div className="px-6 py-14 text-center">
          <Layers className="mx-auto h-9 w-9 text-slate-300" />
          <p className="mt-3 text-sm text-slate-500">
            暂无{tab === 'PRESET_SCENE' ? '预设场景' : '评测维度'}
          </p>
          <p className="mt-1 text-xs text-slate-400">点击右上角新增，保存后前台评测创建页将同步可选</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs text-slate-400">
              <tr>
                <th className="px-5 py-3">ID</th>
                <th className="px-5 py-3">名称</th>
                <th className="px-5 py-3">
                  {tab === 'PRESET_SCENE' ? '子维度' : '排序'}
                </th>
                <th className="px-5 py-3">任务类型</th>
                <th className="px-5 py-3">创建时间</th>
                <th className="px-5 py-3">操作</th>
              </tr>
            </thead>
            <tbody>
              {items.map((row) => {
                const expanded = tab === 'PRESET_SCENE' && expandedSceneId === row.id;
                const colSpan = 6;
                return (
                  <React.Fragment key={row.id}>
                    <tr className="border-t">
                      <td className="px-5 py-3 text-xs text-slate-400">{row.id ?? '—'}</td>
                      <td className="px-5 py-3 font-semibold text-slate-800">{row.name || '—'}</td>
                      <td className="max-w-[240px] px-5 py-3 text-xs text-slate-600">
                        {tab === 'PRESET_SCENE' ? (
                          <span
                            className="line-clamp-2"
                            title={(row as PresetScene).dimensionIds || ''}
                          >
                            {formatSceneDimensions((row as PresetScene).dimensionIds)}
                            {(row as PresetScene).dimensionIds ? (
                              <span className="mt-0.5 block text-[10px] text-slate-400">
                                {(row as PresetScene).dimensionIds}
                              </span>
                            ) : null}
                          </span>
                        ) : (
                          row.sortOrder ?? '—'
                        )}
                      </td>
                      <td className="px-5 py-3 text-xs text-slate-500">
                        {formatTaskKind(row.evaluationTaskType)}
                      </td>
                      <td className="px-5 py-3 text-xs text-slate-500">
                        {formatDateTime(row.createdAt)}
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex flex-wrap items-center gap-2">
                          {tab === 'PRESET_SCENE' && row.id != null && (
                            <button
                              type="button"
                              onClick={() =>
                                setExpandedSceneId(expanded ? null : row.id!)
                              }
                              className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:border-blue-300 hover:text-blue-600"
                            >
                              {expanded ? '收起' : '管理子维度'}
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => openEdit(row)}
                            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:border-blue-300 hover:text-blue-600"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                            编辑
                          </button>
                          <button
                            type="button"
                            onClick={() => void removeRow(row)}
                            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:border-red-200 hover:text-red-600"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            删除
                          </button>
                        </div>
                      </td>
                    </tr>
                    {expanded && row.id != null && tab === 'PRESET_SCENE' && (
                      <tr className="border-t bg-slate-50/50">
                        <td colSpan={colSpan} className="px-5 py-4">
                          <SceneDimensionValuePanel
                            scene={row as PresetScene}
                            taskKind={taskKind}
                            onChanged={() => void loadList()}
                          />
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <div className="border-t">
        <DataPagination
          total={total}
          page={page}
          pageSize={pageSize}
          disabled={loading}
          onPageChange={setPage}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setPage(1);
          }}
        />
      </div>

      <DictFormDialog
        open={dialogOpen}
        tab={tab}
        title={
          formInitial.id != null
            ? `编辑${tab === 'PRESET_SCENE' ? '预设场景' : '评测维度'}`
            : `新增${tab === 'PRESET_SCENE' ? '预设场景' : '评测维度'}`
        }
        initial={formInitial}
        taskKindLabel={taskKindLabel}
        dimensionOptions={dimensionOptions}
        saving={saving}
        onClose={() => setDialogOpen(false)}
        onSubmit={(form) => void submitForm(form)}
      />
    </section>
  );
}
