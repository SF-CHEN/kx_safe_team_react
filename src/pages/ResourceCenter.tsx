import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useSearchParams } from 'react-router';
import {
  AlertTriangle, Bell, Bot, CheckCircle2, ChevronRight,
  Download, FileArchive, LoaderCircle, MessageSquare,
  Search, Settings2, ShieldCheck, Upload, XCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  parseMasterRowId,
  supplementEvaluationTaskMaterial,
  type MyResourceTask,
} from '@/api/evaluation';
import { downloadSysFile, uploadSysFile } from '@/api/file';
import type {
  EvaluationTaskMasterProductType,
  EvaluationTaskMasterStatus,
} from '@/api/evaluation/taskMeta';
import { useUser, type EvalTask } from '../context/UserContext';
import { DataPagination } from '../components/DataPagination';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import type { StoredAttachment } from '../data/workflowStore';
import {
  resourceCenterKeys,
  resourceModelsQueryOptions,
  resourceOverviewQueryOptions,
  resourceTasksQueryOptions,
} from './ResourceCenter.query';

const PRODUCT_OPTIONS = [
  '全部产品', '数据集安全评测', '深度模型可信测评',
  '智能体安全评测', '大模型性能评测', '大模型安全评测',
];

const STATUS_OPTIONS = ['全部状态', '处理中', '待用户补充', '已交付', '已终止'];

const STATUS_UI: Record<string, { label: string; style: string; icon: React.ElementType }> = {
  处理中: { label: '处理中', style: 'bg-blue-50 text-blue-700', icon: LoaderCircle },
  待用户补充: { label: '待用户补充', style: 'bg-orange-50 text-orange-700', icon: AlertTriangle },
  已交付: { label: '已交付', style: 'bg-emerald-50 text-emerald-700', icon: CheckCircle2 },
  已终止: { label: '已终止', style: 'bg-slate-100 text-slate-600', icon: XCircle },
};

function productLabel(type: EvalTask['evalType']) {
  if (type === '大模型评测') return '大模型性能评测';
  if (type === '多模态大模型安全评测') return '大模型安全评测';
  if (type === '模型数据安全评测') return '数据集安全评测';
  return type;
}

function submissionLabel(task: EvalTask) {
  if (task.modelType === '用户模型' || task.modelType === '自定义') return '模型 API 配置';
  if (task.modelType === '本地工程文件') return '本地文件上传';
  return task.modelType || '任务表单';
}

function fileStub(id: number | undefined, category: StoredAttachment['category']): StoredAttachment[] {
  if (id == null) return [];
  return [{
    id: String(id),
    name: `文件 #${id}`,
    size: 0,
    type: '',
    category,
    uploadedAt: '',
  }];
}

function productTypeFromLabel(product: string): EvaluationTaskMasterProductType | undefined {
  if (product === '数据集安全评测' || product === '模型数据安全评测') return 'DATA_SAFETY';
  if (product === '深度模型可信测评') return 'TRUST';
  if (product === '大模型性能评测') return 'PERFORMANCE';
  if (product === '大模型安全评测') return 'SAFETY';
  if (product === '智能体安全评测') return 'AGENT_SAFETY';
  return undefined;
}

function statusFromLabel(status: string): EvaluationTaskMasterStatus | undefined {
  if (status === '处理中') return 'PROCESSING';
  if (status === '待用户补充') return 'AWAIT_SUPPLEMENT';
  if (status === '已交付') return 'DELIVERED';
  if (status === '已终止') return 'TERMINATED';
  return undefined;
}

function parseSearchQuery(raw: string): { name?: string; id?: number } {
  const value = raw.trim();
  if (!value) return {};
  const masterId = parseMasterRowId(value);
  if (masterId != null) return { id: masterId };
  if (/^\d+$/.test(value)) return { id: Number(value) };
  return { name: value };
}

function toEvalTask(row: MyResourceTask): EvalTask {
  return {
    id: row.id,
    name: row.name,
    model: row.model,
    modelType: row.modelType,
    evalSet: row.evalSet,
    evalType: row.evalType,
    status: row.status as EvalTask['status'],
    score: null,
    createdAt: row.createdAt,
    plan: 'paid',
    requirement: row.requirement,
    configSummary: row.configSummary,
    attachments: fileStub(row.supplementFileId, 'input'),
    reports: fileStub(row.deliverFileId, 'report'),
  };
}

export function ResourceCenter() {
  const { user, isGuest, notifications, unreadCount, markNoticeRead, markAllNoticesRead } = useUser();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [params, setParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [keyword, setKeyword] = useState('');
  const [product, setProduct] = useState('全部产品');
  const [status, setStatus] = useState('全部状态');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedTask, setSelectedTask] = useState<EvalTask | null>(null);
  const [modelsOpen, setModelsOpen] = useState(false);
  const [messagesOpen, setMessagesOpen] = useState(false);
  const supplementRef = useRef<HTMLInputElement>(null);

  const userId = Number(user.id);
  const canLoadServerData = !isGuest && Number.isFinite(userId);
  const taskQueryInput = {
    userId,
    pageCurrent: page,
    pageSize,
    productType: productTypeFromLabel(product),
    status: statusFromLabel(status),
    ...parseSearchQuery(keyword),
  };

  const tasksQuery = useQuery(resourceTasksQueryOptions(taskQueryInput, canLoadServerData));
  const overviewQuery = useQuery(resourceOverviewQueryOptions(userId, canLoadServerData));
  const modelsQuery = useQuery(resourceModelsQueryOptions(userId, modelsOpen && canLoadServerData));

  // 选中详情依赖任务对象引用；仅在 Query 数据真正变化时重建数组，避免 effect 因每次 render 的新数组反复 setState。
  const formalTasks = useMemo(
    () => (tasksQuery.data?.items ?? []).map(toEvalTask),
    [tasksQuery.data?.items],
  );
  const total = tasksQuery.data?.total ?? 0;
  const taskOverview = overviewQuery.data ?? null;
  const apiModels = modelsQuery.data ?? [];
  const loading = tasksQuery.isPending && !tasksQuery.data;
  const modelsLoading = modelsQuery.isPending && !modelsQuery.data;

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setKeyword(search.trim());
      setPage(1);
    }, 300);
    return () => window.clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    if (!tasksQuery.error) return;
    toast.error(tasksQuery.error instanceof Error ? tasksQuery.error.message : '加载任务列表失败');
  }, [tasksQuery.error]);

  useEffect(() => {
    if (!overviewQuery.error) return;
    toast.error(overviewQuery.error instanceof Error ? overviewQuery.error.message : '加载任务概览失败');
  }, [overviewQuery.error]);

  useEffect(() => {
    if (!modelsOpen || !modelsQuery.error) return;
    toast.error(modelsQuery.error instanceof Error ? modelsQuery.error.message : '加载模型配置失败');
  }, [modelsOpen, modelsQuery.error]);

  useEffect(() => {
    if (!tasksQuery.data) return;
    const maxPage = Math.max(1, Math.ceil(tasksQuery.data.total / pageSize) || 1);
    if (page > maxPage) setPage(maxPage);
  }, [page, pageSize, tasksQuery.data]);

  useEffect(() => {
    const tab = params.get('tab');
    if (tab === 'models') setModelsOpen(true);
    if (tab === 'messages') setMessagesOpen(true);
  }, [params]);

  useEffect(() => {
    if (!selectedTask) return;
    const next = formalTasks.find((task) => task.id === selectedTask.id);
    if (next) setSelectedTask(next);
  }, [formalTasks, selectedTask?.id]);

  if (isGuest) return <div className="mx-auto max-w-2xl px-6 py-24 text-center"><div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-50"><FileArchive className="h-9 w-9 text-blue-500" /></div><h1 className="mt-6 text-2xl font-black text-slate-900">登录后查看任务与报告</h1><p className="mt-3 text-sm leading-6 text-slate-500">提交正式评测任务后，可在这里查看受理进度、补充材料并下载管理员交付的报告。</p><div className="mt-7 flex justify-center gap-3"><Button onClick={() => navigate('/login')} className="bg-blue-600">登录账号</Button><Button variant="outline" onClick={() => navigate('/register')}>注册账号</Button></div></div>;

  const closeModels = () => { setModelsOpen(false); params.delete('tab'); setParams(params, { replace: true }); };
  const closeMessages = () => { setMessagesOpen(false); params.delete('tab'); setParams(params, { replace: true }); };

  const openNotificationTask = (notice: (typeof notifications)[number]) => {
    markNoticeRead(notice.id);
    if (!notice.taskId) return;
    const task = formalTasks.find(item => item.id === notice.taskId);
    if (!task) return toast.error('该任务已不存在或当前账号无权查看');
    setSearch(''); setProduct('全部产品'); setStatus('全部状态'); setPage(1);
    closeMessages();
    setSelectedTask(task);
  };

  const selectStatusCard = (label: string) => {
    if (label === '未读消息') return setMessagesOpen(true);
    setStatus(label === '待补充' ? '待用户补充' : label === '全部任务' ? '全部状态' : label);
    setPage(1);
  };

  const supplementMaterial = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!selectedTask || !files?.length) return;
    const masterId = parseMasterRowId(selectedTask.id);
    if (masterId == null) {
      toast.error('无法识别该任务');
      event.target.value = '';
      return;
    }
    if (files.length > 1) toast.info('当前接口仅支持一个补充文件，已使用所选的第一个');
    try {
      const uploaded = await uploadSysFile(files[0]);
      if (uploaded.id == null) throw new Error('上传未返回文件编号');
      await supplementEvaluationTaskMaterial({ id: masterId, supplementFileId: uploaded.id });
      await queryClient.invalidateQueries({ queryKey: resourceCenterKeys.all });
      toast.success('补充材料已提交');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : '补充材料提交失败');
    } finally {
      event.target.value = '';
    }
  };

  const overviewCounts = {
    processing: taskOverview?.processingCount ?? null,
    awaitSupplement: taskOverview?.awaitSupplementCount ?? null,
    delivered: taskOverview?.deliveredCount ?? null,
    terminated: taskOverview?.terminatedCount ?? null,
  };
  const totalTaskCount =
    overviewCounts.processing != null
    || overviewCounts.awaitSupplement != null
    || overviewCounts.delivered != null
    || overviewCounts.terminated != null
      ? (overviewCounts.processing ?? 0)
        + (overviewCounts.awaitSupplement ?? 0)
        + (overviewCounts.delivered ?? 0)
        + (overviewCounts.terminated ?? 0)
      : null;
  const formatCount = (value: number | null) => (value == null ? '—' : String(value));

  return <div className="min-h-[calc(100vh-120px)] bg-slate-50/80 py-8">
    <div className="mx-auto max-w-[1500px] px-6">
      <section className="overflow-hidden rounded-2xl border border-blue-100 bg-[linear-gradient(120deg,#eff6ff,#ffffff_48%,#eef2ff)] px-7 py-7 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-5"><div><div className="text-xs font-black tracking-[.18em] text-blue-600">TASK & REPORT CENTER</div><h1 className="mt-2 text-2xl font-black text-slate-950">我的任务与报告</h1><p className="mt-2 text-sm text-slate-500">查看正式评测的处理状态、管理员反馈与交付文件</p></div><div className="flex gap-3"><Button variant="outline" className="bg-white" onClick={() => setModelsOpen(true)}><Settings2 className="mr-2 h-4 w-4" />模型 API 配置</Button><Button variant="outline" className="relative bg-white" onClick={() => setMessagesOpen(true)}><Bell className="mr-2 h-4 w-4" />消息通知{unreadCount > 0 && <span className="ml-2 rounded-full bg-red-500 px-1.5 py-0.5 text-[10px] font-bold text-white">{unreadCount}</span>}</Button></div></div>
        <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-6">{[
          ['全部任务', formatCount(totalTaskCount), 'text-slate-900'],
          ['处理中', formatCount(overviewCounts.processing), 'text-blue-600'],
          ['待补充', formatCount(overviewCounts.awaitSupplement), 'text-orange-600'],
          ['已交付', formatCount(overviewCounts.delivered), 'text-emerald-600'],
          ['已终止', formatCount(overviewCounts.terminated), 'text-slate-600'],
          ['未读消息', String(unreadCount), 'text-red-500'],
        ].map(([label, value, color]) => {
          const active = label === '未读消息'
            ? messagesOpen
            : status === (label === '待补充' ? '待用户补充' : label === '全部任务' ? '全部状态' : label);
          return (
            <button
              type="button"
              key={label}
              onClick={() => selectStatusCard(label)}
              className={`rounded-xl border px-4 py-3 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md ${active ? 'border-blue-400 bg-blue-50 ring-2 ring-blue-100' : 'border-white bg-white/80'}`}
            >
              <div className={`text-2xl font-black ${color}`}>{value}</div>
              <div className="mt-1 text-xs text-slate-500">{label}</div>
            </button>
          );
        })}</div>
      </section>

      <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b px-6 py-5"><div><h2 className="font-black text-slate-900">正式评测任务</h2><p className="mt-1 text-xs text-slate-400">仅展示当前支持任务创建的正式产品（可信 / 数据安全 / 大模型性能与安全）</p></div><div className="flex flex-wrap gap-2"><div className="relative"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><Input value={search} onChange={event => setSearch(event.target.value)} placeholder="搜索任务名称或编号" className="h-9 w-56 pl-9 text-sm" /></div><select value={product} onChange={event => { setProduct(event.target.value); setPage(1); }} className="h-9 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-600">{PRODUCT_OPTIONS.map(item => <option key={item}>{item}</option>)}</select><select value={status} onChange={event => { setStatus(event.target.value); setPage(1); }} className="h-9 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-600">{STATUS_OPTIONS.map(item => <option key={item}>{item}</option>)}</select></div></div>
        {loading ? <div className="px-6 py-24 text-center text-sm text-slate-400">加载任务列表…</div> : formalTasks.length === 0 ? <div className="px-6 py-24 text-center"><FileArchive className="mx-auto h-11 w-11 text-slate-200" /><h3 className="mt-4 font-bold text-slate-600">{keyword || product !== '全部产品' || status !== '全部状态' ? '没有符合条件的任务' : '还没有正式评测任务'}</h3><p className="mt-2 text-sm text-slate-400">任务提交后将直接进入处理中，并在这里持续更新。</p><Button className="mt-5 bg-blue-600" onClick={() => { navigate('/'); window.setTimeout(() => document.getElementById('product-matrix')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 120); }}>查看产品矩阵</Button></div> : <><div className="hidden overflow-x-auto md:block"><table className="w-full min-w-[1100px] text-left"><thead className="bg-slate-50 text-xs font-semibold text-slate-400"><tr><th className="px-6 py-3">任务名称</th><th className="px-5 py-3">产品</th><th className="px-5 py-3">被测对象</th><th className="px-5 py-3">提交方式</th><th className="px-5 py-3">当前状态</th><th className="px-5 py-3">提交时间</th><th className="px-5 py-3 text-right">操作</th></tr></thead><tbody>{formalTasks.map(task => { const config = STATUS_UI[task.status] || STATUS_UI['处理中']; const Icon = config.icon; return <tr key={task.id} className="border-t transition hover:bg-blue-50/30"><td className="px-6 py-4"><button onClick={() => setSelectedTask(task)} className="max-w-[240px] truncate text-sm font-bold text-slate-800 hover:text-blue-600">{task.name}</button><div className="mt-1 font-mono text-[10px] text-slate-400">{task.id}</div></td><td className="px-5 py-4 text-sm text-slate-600">{productLabel(task.evalType)}</td><td className="max-w-[180px] px-5 py-4 text-sm text-slate-600"><span className="block truncate">{task.model}</span></td><td className="px-5 py-4 text-sm text-slate-500">{submissionLabel(task)}</td><td className="px-5 py-4"><span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${config.style}`}><Icon className={Icon === LoaderCircle ? 'h-3.5 w-3.5 animate-spin' : 'h-3.5 w-3.5'} />{config.label}</span></td><td className="px-5 py-4 text-xs text-slate-400">{task.createdAt}</td><td className="px-5 py-4 text-right"><Button variant="ghost" size="sm" className="text-blue-600" onClick={() => setSelectedTask(task)}>查看详情<ChevronRight className="ml-1 h-4 w-4" /></Button></td></tr>; })}</tbody></table></div><div className="divide-y md:hidden">{formalTasks.map(task => { const config = STATUS_UI[task.status] || STATUS_UI['处理中']; const Icon = config.icon; return <button key={task.id} onClick={() => setSelectedTask(task)} className="block w-full px-4 py-4 text-left transition hover:bg-blue-50"><div className="flex items-start justify-between gap-3"><span className="min-w-0"><b className="block truncate text-sm text-slate-800">{task.name}</b><span className="mt-1 block truncate font-mono text-[10px] text-slate-400">{task.id}</span></span><span className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-1 text-[10px] font-bold ${config.style}`}><Icon className="h-3 w-3" />{config.label}</span></div><div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 text-xs"><span className="truncate text-slate-600">{productLabel(task.evalType)}</span><span className="truncate text-right text-slate-500">{task.model}</span><span className="text-slate-400">{submissionLabel(task)}</span><span className="text-right text-slate-400">{task.createdAt}</span></div><span className="mt-3 inline-flex items-center text-xs font-bold text-blue-600">查看详情<ChevronRight className="ml-1 h-3.5 w-3.5" /></span></button>; })}</div></>}
        <div className="border-t">
          <DataPagination
            total={total}
            page={page}
            pageSize={pageSize}
            disabled={loading || tasksQuery.isFetching}
            onPageChange={setPage}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setPage(1);
            }}
          />
        </div>
      </section>
    </div>

    <Dialog open={!!selectedTask} onOpenChange={open => !open && setSelectedTask(null)}><DialogContent className="max-h-[88vh] max-w-3xl overflow-y-auto"><DialogHeader><DialogTitle>任务详情与交付</DialogTitle></DialogHeader>{selectedTask && <TaskDetail task={selectedTask} onSupplement={() => supplementRef.current?.click()} />}<input ref={supplementRef} type="file" multiple className="hidden" onChange={supplementMaterial} /></DialogContent></Dialog>

    <Dialog open={modelsOpen} onOpenChange={open => !open && closeModels()}><DialogContent className="max-w-2xl"><DialogHeader><DialogTitle>模型 API 配置</DialogTitle></DialogHeader><p className="text-sm text-slate-500">来自模型库下拉（内置 / 用户）。平台不在此展示 API Key 明文。</p>{modelsLoading ? <div className="py-14 text-center text-sm text-slate-400">加载模型配置…</div> : apiModels.length === 0 ? <div className="rounded-xl border border-dashed py-14 text-center"><Bot className="mx-auto h-9 w-9 text-slate-300" /><p className="mt-3 text-sm text-slate-500">暂无已保存的模型 API 配置</p><p className="mt-1 text-xs text-slate-400">在大模型性能/安全评测创建任务时选择“自定义模型”即可保存到模型库。</p></div> : <div className="space-y-3">{apiModels.map((item, index) => { const model = item.data; const id = model?.id ?? item.id ?? index; const name = model?.name || item.name || `模型 #${id}`; const baseUrl = model?.baseUrl || '—'; const typeLabel = model?.type === 'BUILT_IN' ? '内置' : '用户'; return <div key={id} className="flex items-center gap-4 rounded-xl border p-4"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50"><Bot className="h-5 w-5 text-blue-600" /></div><div className="min-w-0 flex-1"><div className="font-bold text-slate-800">{name}</div><div className="mt-1 truncate text-xs text-slate-400">{baseUrl}</div></div><Badge variant="outline">{typeLabel}</Badge></div>; })}</div>}</DialogContent></Dialog>

    <Dialog open={messagesOpen} onOpenChange={open => !open && closeMessages()}><DialogContent className="max-h-[82vh] max-w-2xl overflow-y-auto"><DialogHeader><div className="flex items-center justify-between pr-8"><DialogTitle>消息通知</DialogTitle>{unreadCount > 0 && <Button variant="ghost" size="sm" onClick={markAllNoticesRead}>全部标为已读</Button>}</div></DialogHeader>{notifications.length === 0 ? <div className="py-16 text-center text-sm text-slate-400"><Bell className="mx-auto mb-3 h-9 w-9 text-slate-200" />暂无消息</div> : <div className="space-y-2">{notifications.map(notice => <button key={notice.id} onClick={() => openNotificationTask(notice)} className={`flex w-full gap-3 rounded-xl border p-4 text-left ${notice.read ? 'bg-white' : 'border-blue-200 bg-blue-50'}`}><span className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${notice.read ? 'bg-slate-200' : 'bg-red-500'}`} /><span className="flex-1"><span className="block text-sm font-bold text-slate-800">{notice.title}</span><span className="mt-1 block text-sm leading-6 text-slate-500">{notice.content}</span><span className="mt-2 block text-xs text-slate-400">{notice.createdAt}</span></span></button>)}</div>}</DialogContent></Dialog>
  </div>;
}

function TaskDetail({ task, onSupplement }: { task: EvalTask; onSupplement: () => void }) {
  const rawStatus = String(task.status);
  const config = STATUS_UI[task.status] || STATUS_UI['处理中'];
  const Icon = config.icon;
  const downloadReport = async (report: NonNullable<EvalTask['reports']>[number]) => {
    const fileId = Number(report.id);
    if (!Number.isFinite(fileId) || fileId <= 0) {
      toast.error('无法下载该文件');
      return;
    }
    try {
      await downloadSysFile(fileId, report.name);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : '下载失败');
    }
  };
  const messageTone = rawStatus === '待用户补充' || rawStatus === '待补充材料'
    ? 'border-orange-200 bg-orange-50 text-orange-800'
    : rawStatus === '已终止'
      ? 'border-red-100 bg-red-50 text-red-700'
      : 'border-blue-100 bg-blue-50 text-blue-700';

  return (
    <div className="space-y-5 pt-2">
      <div className="rounded-xl bg-slate-50 p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="font-mono text-xs text-blue-600">{task.id}</div>
            <h3 className="mt-2 text-lg font-black text-slate-900">{task.name}</h3>
            <p className="mt-1 text-sm text-slate-500">{productLabel(task.evalType)}</p>
          </div>
          <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ${config.style}`}>
            <Icon className={Icon === LoaderCircle ? 'h-3.5 w-3.5 animate-spin' : 'h-3.5 w-3.5'} />{config.label}
          </span>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Info label="被测对象" value={task.model} />
        <Info label="提交方式" value={submissionLabel(task)} />
        <Info label="提交时间" value={task.createdAt} />
        <Info label="当前阶段" value={config.label} />
      </div>

      <div>
        <div className="mb-2 text-sm font-bold text-slate-800">评测诉求／测试场景</div>
        <div className="rounded-xl border bg-white p-4 text-sm leading-6 text-slate-600">
          {task.requirement || task.evalSet || '按提交配置开展评测'}
        </div>
      </div>

      {task.publicMessage && (
        <div className={`rounded-xl border p-4 text-sm leading-6 ${messageTone}`}>
          <MessageSquare className="mr-2 inline h-4 w-4" />
          {task.publicMessage}
          {task.supplementDueAt && (
            <span className="ml-2 font-bold">请于 {task.supplementDueAt} 前补充</span>
          )}
        </div>
      )}

      <div>
        <div className="mb-2 text-sm font-bold text-slate-800">已提交材料</div>
        {task.attachments?.length ? (
          <div className="space-y-2">
            {task.attachments.map(file => (
              <div key={file.id} className="flex items-center gap-3 rounded-lg border px-4 py-3">
                <FileArchive className="h-4 w-4 text-blue-500" />
                <span className="min-w-0 flex-1 truncate text-sm text-slate-600">{file.name}</span>
                {file.size > 0 && <span className="text-xs text-slate-400">{(file.size / 1024 / 1024).toFixed(2)} MB</span>}
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed p-4 text-sm text-slate-400">
            该任务暂无已提交材料。
          </div>
        )}
      </div>

      {(rawStatus === '待用户补充' || rawStatus === '待补充材料') && (
        <Button className="bg-orange-600 hover:bg-orange-700" onClick={onSupplement}>
          <Upload className="mr-2 h-4 w-4" />按要求补充材料
        </Button>
      )}

      <div>
        <div className="mb-2 text-sm font-bold text-slate-800">报告与结果文件</div>
        {(rawStatus === '已交付' || rawStatus === '已推送') && task.reports?.length ? (
          <div className="space-y-2">
            {task.reports.map(report => (
              <button
                key={report.id}
                onClick={() => downloadReport(report)}
                className="flex w-full items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-left"
              >
                <ShieldCheck className="h-5 w-5 text-emerald-600" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-bold text-emerald-900">{report.name}</span>
                  <span className="text-xs text-emerald-700">管理员正式交付文件</span>
                </span>
                <Download className="h-4 w-4 text-emerald-600" />
              </button>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed p-5 text-center text-sm text-slate-400">
            任务交付后，报告和结果文件将在此显示。
          </div>
        )}
      </div>

      {!!task.communications?.length && (
        <div>
          <div className="mb-2 text-sm font-bold text-slate-800">任务沟通记录</div>
          <div className="space-y-2">
            {task.communications.slice().reverse().map(item => (
              <div key={item.id} className="rounded-xl border px-4 py-3">
                <div className="flex justify-between gap-3">
                  <b className="text-xs text-slate-700">{item.type}</b>
                  <span className="text-[10px] text-slate-400">{item.createdAt}</span>
                </div>
                <p className="mt-2 text-xs leading-5 text-slate-500">{item.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {rawStatus === '处理异常' && !task.publicMessage && (
        <div className="rounded-xl bg-red-50 p-4 text-sm text-red-700">
          <MessageSquare className="mr-2 inline h-4 w-4" />
          任务处理出现异常，请通过玄鉴智能助手联系技术顾问。
        </div>
      )}
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return <div className="rounded-xl border bg-white p-4"><div className="text-xs font-semibold text-slate-400">{label}</div><div className="mt-2 text-sm font-bold text-slate-700">{value || '—'}</div></div>;
}
