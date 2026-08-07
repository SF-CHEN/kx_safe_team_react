import React, { useMemo, useState } from 'react';
import { ChevronsUpDown, X } from 'lucide-react';
import { LUCIDE_ICON_OPTIONS, resolveLucideIcon } from '@/utils/lucideIconMap';
import { cn } from './ui/utils';

export type IconPickerProps = {
  value?: string;
  onChange: (iconName: string) => void;
  disabled?: boolean;
  className?: string;
  /** 允许清空已选图标 */
  allowClear?: boolean;
};

/** Lucide 图标选择：存组件名字符串（如 Shield） */
export function IconPicker({
  value = '',
  onChange,
  disabled,
  className,
  allowClear = true,
}: IconPickerProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const SelectedIcon = resolveLucideIcon(value);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return LUCIDE_ICON_OPTIONS;
    return LUCIDE_ICON_OPTIONS.filter(
      (item) =>
        item.name.toLowerCase().includes(q) || item.label.includes(query.trim()),
    );
  }, [query]);

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex gap-2">
        <button
          type="button"
          disabled={disabled}
          onClick={() => setOpen((v) => !v)}
          className={cn(
            'flex flex-1 items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-left text-sm outline-none transition hover:border-blue-300 focus:border-blue-500 disabled:opacity-60',
            open && 'border-blue-400 ring-2 ring-blue-100',
          )}
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-50 text-slate-600">
            {SelectedIcon ? (
              <SelectedIcon className="h-[18px] w-[18px]" />
            ) : (
              <span className="text-xs text-slate-300">无</span>
            )}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate font-medium text-slate-800">
              {value || '选择图标'}
            </span>
            <span className="block text-xs text-slate-400">
              {SelectedIcon
                ? LUCIDE_ICON_OPTIONS.find((i) => i.name === value)?.label || '已选'
                : '可选，存 Lucide 名称'}
            </span>
          </span>
          <ChevronsUpDown className="h-4 w-4 shrink-0 text-slate-400" />
        </button>
        {allowClear && value ? (
          <button
            type="button"
            disabled={disabled}
            title="清除图标"
            onClick={() => {
              onChange('');
              setOpen(false);
            }}
            className="flex h-auto items-center justify-center rounded-xl border border-slate-200 px-3 text-slate-400 hover:border-red-200 hover:text-red-500 disabled:opacity-60"
          >
            <X className="h-4 w-4" />
          </button>
        ) : null}
      </div>

      {open && (
        <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-3">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="搜索名称或中文…"
            className="mb-3 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
          />
          <div className="grid max-h-52 grid-cols-6 gap-1.5 overflow-y-auto sm:grid-cols-8">
            {filtered.map((item) => {
              const active = value === item.name;
              const Icon = item.Icon;
              return (
                <button
                  key={item.name}
                  type="button"
                  title={`${item.label} (${item.name})`}
                  onClick={() => {
                    onChange(item.name);
                    setOpen(false);
                    setQuery('');
                  }}
                  className={cn(
                    'flex aspect-square items-center justify-center rounded-lg border transition',
                    active
                      ? 'border-blue-400 bg-blue-50 text-blue-600'
                      : 'border-transparent bg-white text-slate-600 hover:border-slate-200 hover:bg-white',
                  )}
                >
                  <Icon className="h-4 w-4" />
                </button>
              );
            })}
          </div>
          {filtered.length === 0 && (
            <p className="py-4 text-center text-xs text-slate-400">无匹配图标</p>
          )}
        </div>
      )}
    </div>
  );
}
