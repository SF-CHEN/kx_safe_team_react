import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../components/ui/dialog';
import {
  fetchAigcReportDisplay,
  parseDisplayResponse,
  type AigcReportRow,
  type ParsedAigcDisplay,
} from '@/api/aigc';

function formatScore(score: unknown): string {
  if (score == null || score === '') return '—';
  const num = Number(score);
  if (Number.isNaN(num)) return String(score);
  return `${Math.round(num <= 1 ? num * 100 : num)}%`;
}

function ReportResultBody({ parsed }: { parsed: ParsedAigcDisplay }) {
  const brief = parsed.briefView || {};
  const detection = parsed.detectionResult || {};
  const panel = parsed.panel || {};
  const status = String(
    brief.status
      ?? detection.risk_level_cn
      ?? brief.decision
      ?? '检测完成',
  );
  const decisionText = String(
    brief.decision_text
      ?? detection.decision_text
      ?? brief.summary_text
      ?? brief.panel_summary
      ?? detection.reasoning_summary
      ?? '',
  );
  const score = formatScore(brief.score ?? detection.risk_score);
  const rows = (
    (Array.isArray(brief.top_rows) && brief.top_rows)
    || (Array.isArray(panel.rows) && panel.rows)
    || (Array.isArray(parsed.rankedView) && parsed.rankedView)
    || []
  ) as Record<string, unknown>[];

  return (
    <div className="space-y-4 text-left">
      <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-md bg-blue-600 px-2 py-0.5 text-xs font-bold text-white">{status}</span>
          <span className="font-mono text-sm font-bold text-slate-700">{score}</span>
        </div>
        {decisionText ? <p className="mt-2 text-xs leading-6 text-slate-600">{decisionText}</p> : null}
      </div>
      {rows.length > 0 && (
        <div className="space-y-2">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">检测维度</p>
          {rows.slice(0, 8).map((row, index) => (
            <div
              key={String(row.code ?? row.label ?? index)}
              className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-xs"
            >
              <span className="text-slate-700">{String(row.label ?? row.name ?? `维度 ${index + 1}`)}</span>
              <span className="font-mono font-bold text-slate-800">
                {String(row.display_value ?? row.display_percent ?? row.status ?? formatScore(row.score))}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function ReportDetailDialog({
  open,
  onOpenChange,
  task,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: AigcReportRow | null;
}) {
  const [loading, setLoading] = useState(false);
  const [parsed, setParsed] = useState<ParsedAigcDisplay | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !task?.recordId) {
      setParsed(null);
      setError(null);
      return;
    }
    let cancelled = false;
    (async () => {
      setLoading(true);
      setParsed(null);
      setError(null);
      try {
        const data = await fetchAigcReportDisplay(task.recordId!);
        if (!cancelled) setParsed(parseDisplayResponse(data));
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : '报告加载失败');
          setParsed(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [open, task?.recordId]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[860px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{task?.name ?? '检测报告'}</DialogTitle>
          <DialogDescription>
            {task ? `${task.model} · ${task.evalType} · 报告 ID ${task.recordId}` : 'AIGC 网关报告详情'}
          </DialogDescription>
        </DialogHeader>
        {loading ? (
          <div className="flex min-h-[200px] flex-col items-center justify-center text-blue-600">
            <Loader2 className="mb-2 h-8 w-8 animate-spin" />
            <span className="text-sm">加载报告中…</span>
          </div>
        ) : error ? (
          <p className="py-8 text-center text-sm text-red-500">{error}</p>
        ) : parsed ? (
          <ReportResultBody parsed={parsed} />
        ) : (
          <p className="py-8 text-center text-sm text-slate-400">报告加载失败，请稍后重试</p>
        )}
      </DialogContent>
    </Dialog>
  );
}
