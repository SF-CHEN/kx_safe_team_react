import React, { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { cn } from './ui/utils';

export interface DataPaginationProps {
  total: number;
  page: number;
  pageSize: number;
  pageSizeOptions?: number[];
  disabled?: boolean;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  className?: string;
}

function buildPageList(current: number, totalPages: number): Array<number | 'ellipsis'> {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  if (current <= 4) {
    return [1, 2, 3, 4, 5, 'ellipsis', totalPages];
  }
  if (current >= totalPages - 3) {
    return [1, 'ellipsis', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  }
  return [1, 'ellipsis', current - 1, current, current + 1, 'ellipsis', totalPages];
}

/** 表格底部分页：共 N 条 / 每页条数 / 页码 / 前往，风格接近常见后台分页 */
export function DataPagination({
  total,
  page,
  pageSize,
  pageSizeOptions = [10, 20, 50, 100],
  disabled,
  onPageChange,
  onPageSizeChange,
  className,
}: DataPaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize) || 1);
  const pages = useMemo(() => buildPageList(page, totalPages), [page, totalPages]);
  const [jumpValue, setJumpValue] = useState(String(page));

  useEffect(() => {
    setJumpValue(String(page));
  }, [page]);

  const goTo = (next: number) => {
    if (disabled) return;
    const clamped = Math.min(totalPages, Math.max(1, next));
    if (clamped !== page) onPageChange(clamped);
  };

  const commitJump = () => {
    const n = Number.parseInt(jumpValue, 10);
    if (Number.isFinite(n)) goTo(n);
    else setJumpValue(String(page));
  };

  return (
    <div
      className={cn(
        'flex flex-wrap items-center justify-end gap-x-3 gap-y-2 px-5 py-3 text-sm text-slate-600',
        className,
      )}
    >
      <span className="text-slate-500">共 {total} 条</span>

      {onPageSizeChange && (
        <Select
          value={String(pageSize)}
          disabled={disabled}
          onValueChange={(value) => {
            onPageSizeChange(Number(value));
          }}
        >
          <SelectTrigger className="h-8 w-[104px] border-slate-200 bg-white text-xs shadow-none">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {pageSizeOptions.map((size) => (
              <SelectItem key={size} value={String(size)}>
                {size}条/页
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      <div className="flex items-center gap-1">
        <button
          type="button"
          aria-label="上一页"
          disabled={disabled || page <= 1}
          onClick={() => goTo(page - 1)}
          className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {pages.map((item, index) =>
          item === 'ellipsis' ? (
            <span key={`e-${index}`} className="flex h-8 w-8 items-center justify-center text-slate-400">
              …
            </span>
          ) : (
            <button
              key={item}
              type="button"
              disabled={disabled}
              onClick={() => goTo(item)}
              className={cn(
                'flex h-8 min-w-8 items-center justify-center rounded-md px-2 text-sm font-medium transition',
                item === page
                  ? 'bg-blue-600 text-white'
                  : 'border border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:text-blue-600',
              )}
            >
              {item}
            </button>
          ),
        )}

        <button
          type="button"
          aria-label="下一页"
          disabled={disabled || page >= totalPages}
          onClick={() => goTo(page + 1)}
          className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="flex items-center gap-1.5 text-slate-500">
        <span>前往</span>
        <input
          type="text"
          inputMode="numeric"
          disabled={disabled}
          value={jumpValue}
          onChange={(e) => setJumpValue(e.target.value.replace(/[^\d]/g, ''))}
          onBlur={commitJump}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              commitJump();
            }
          }}
          className="h-8 w-12 rounded-md border border-slate-200 bg-white px-2 text-center text-sm text-slate-700 outline-none focus:border-blue-500"
        />
        <span>页</span>
      </div>
    </div>
  );
}
