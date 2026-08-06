import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import {
  AlertTriangle, Bell, Bot, CheckCircle2, ChevronRight, Clock, Download,
  FileArchive, FileText, LoaderCircle, Mail, MessageSquare, PackageCheck,
  Search, Settings2, ShieldCheck, Upload, XCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import { useUser, type EvalTask } from '../context/UserContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import {
  downloadAttachment, fileToStoredAttachment, getWorkflowTasks, updateWorkflowTask,
  type WorkflowStatus,
} from '../data/workflowStore';

const FORMAL_TYPES = new Set<EvalTask['evalType']>([
  '模型数据安全评测', '深度模型可信测评', '智能体安全评测',
  '大模型评测', '大模型安全评测', '多模态大模型安全评测',
]);

const PRODUCT_OPTIONS = [
  '全部产品', '模型数据安全评测', '深度模型可信测评',
  '智能体安全评测', '大模型性能评测', '大模型安全评测',
];

const STATUS_OPTIONS = ['全部状态', '待受理', '材料已接收', '处理中', '待补充材料', '待交付', '报告已交付', '处理异常'];

const STATUS_UI: Record<string, { label: string; style: string; icon: React.ElementType }> = {
  待受理: { label: '待受理', style: 'bg-amber-50 text-amber-700', icon: Clock },
  材料已接收: { label: '材料已接收', style: 'bg-cyan-50 text-cyan-700', icon: PackageCheck },
  处理中: { label: '处理中', style: 'bg-blue-50 text-blue-700', icon: LoaderCircle },
  待补充材料: { label: '待补充材料', style: 'bg-orange-50 text-orange-700', icon: AlertTriangle },
  待交付: { label: '待交付', style: 'bg-violet-50 text-violet-700', icon: FileText },
  已推送: { label: '报告已交付', style: 'bg-emerald-50 text-emerald-700', icon: CheckCircle2 },
  处理异常: { label: '处理异常', style: 'bg-red-50 text-red-700', icon: XCircle },
};

function productLabel(type: EvalTask['evalType']) {
  if (type === '大模型评测') return '大模型性能评测';
  if (type === '多模态大模型安全评测') return '大模型安全评测';
  return type;
}

function submissionLabel(task: EvalTask) {
  if (task.attachments?.length) return '本地文件上传';
  if (task.modelType === '自定义') return '模型 API 配置';
  return task.modelType || '任务表单';
}

export function ResourceCenter() {
  const { user, isGuest, notifications, unreadCount, markNoticeRead, markAllNoticesRead } = useUser();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [product, setProduct] = useState('全部产品');
  const [status, setStatus] = useState('全部状态');
  const [selectedTask, setSelectedTask] = useState<EvalTask | null>(null);
  const [modelsOpen, setModelsOpen] = useState(false);
  const [messagesOpen, setMessagesOpen] = useState(false);
  const supplementRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const tab = params.get('tab');
    if (tab === 'models') setModelsOpen(true);
    if (tab === 'messages') setMessagesOpen(true);
  }, [params]);

  const formalTasks = useMemo(() => user.myTasks.filter(task => FORMAL_TYPES.has(task.evalType)), [user.myTasks]);
  const filteredTasks = useMemo(() => formalTasks.filter(task => {
    const queryMatch = !search.trim() || `${task.name}${task.id}${task.model}`.toLowerCase().includes(search.trim().toLowerCase());
    const productMatch = product === '全部产品' || productLabel(task.evalType) === product;
    const displayedStatus = task.status === '已推送' ? '报告已交付' : task.status;
    const statusMatch = status === '全部状态' || displayedStatus === status;
    return queryMatch && productMatch && statusMatch;
  }), [formalTasks, search, product, status]);

  const stats = {
    all: formalTasks.length,
    pending: formalTasks.filter(task => task.status === '待受理' || task.status === '材料已接收').length,
    processing: formalTasks.filter(task => task.status === '处理中' || task.status === '待交付').length,
    supplement: formalTasks.filter(task => task.status === '待补充材料').length,
    delivered: formalTasks.filter(task => task.status === '已推送').length,
  };

  if (isGuest) return <div className="mx-auto max-w-2xl px-6 py-24 text-center"><div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-50"><FileArchive className="h-9 w-9 text-blue-500" /></div><h1 className="mt-6 text-2xl font-black text-slate-900">登录后查看任务与报告</h1><p className="mt-3 text-sm leading-6 text-slate-500">提交正式评测任务后，可在这里查看受理进度、补充材料并下载管理员交付的报告。</p><div className="mt-7 flex justify-center gap-3"><Button onClick={() => navigate('/login')} className="bg-blue-600">登录账号</Button><Button variant="outline" onClick={() => navigate('/register')}>注册账号</Button></div></div>;

  const closeModels = () => { setModelsOpen(false); params.delete('tab'); setParams(params, { replace: true }); };
  const closeMessages = () => { setMessagesOpen(false); params.delete('tab'); setParams(params, { replace: true }); };

  const supplementMaterial = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedTask || !event.target.files?.length) return;
    const additions = await Promise.all(Array.from(event.target.files).map(file => fileToStoredAttachment(file, 'input')));
    const workflow = getWorkflowTasks().find(item => item.id === selectedTask.id);
    updateWorkflowTask(selectedTask.id, { inputs: [...(workflow?.inputs || []), ...additions], status: '材料已接收' });
    toast.success('补充材料已提交，等待管理员确认');
    event.target.value = '';
  };

  return <div className="min-h-[calc(100vh-120px)] bg-slate-50/80 py-8">
    <div className="mx-auto max-w-[1500px] px-6">
      <section className="overflow-hidden rounded-2xl border border-blue-100 bg-[linear-gradient(120deg,#eff6ff,#ffffff_48%,#eef2ff)] px-7 py-7 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-5"><div><div className="text-xs font-black tracking-[.18em] text-blue-600">TASK & REPORT CENTER</div><h1 className="mt-2 text-2xl font-black text-slate-950">我的任务与报告</h1><p className="mt-2 text-sm text-slate-500">查看正式评测的受理进度、管理员反馈与交付文件</p></div><div className="flex gap-3"><Button variant="outline" className="bg-white" onClick={() => setModelsOpen(true)}><Settings2 className="mr-2 h-4 w-4" />模型 API 配置</Button><Button variant="outline" className="relative bg-white" onClick={() => setMessagesOpen(true)}><Bell className="mr-2 h-4 w-4" />消息通知{unreadCount > 0 && <span className="ml-2 rounded-full bg-red-500 px-1.5 py-0.5 text-[10px] font-bold text-white">{unreadCount}</span>}</Button></div></div>
        <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-6">{[
          ['全部任务', stats.all, 'text-slate-900'], ['待受理', stats.pending, 'text-amber-600'], ['处理中', stats.processing, 'text-blue-600'], ['待补充', stats.supplement, 'text-orange-600'], ['已交付', stats.delivered, 'text-emerald-600'], ['未读消息', unreadCount, 'text-red-500'],
        ].map(([label, value, color]) => <div key={String(label)} className="rounded-xl border border-white bg-white/80 px-4 py-3 shadow-sm"><div className={`text-2xl font-black ${color}`}>{value}</div><div className="mt-1 text-xs text-slate-400">{label}</div></div>)}</div>
      </section>

      <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b px-6 py-5"><div><h2 className="font-black text-slate-900">正式评测任务</h2><p className="mt-1 text-xs text-slate-400">仅展示当前支持任务创建的5类正式产品</p></div><div className="flex flex-wrap gap-2"><div className="relative"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><Input value={search} onChange={event => setSearch(event.target.value)} placeholder="搜索任务名称或编号" className="h-9 w-56 pl-9 text-sm" /></div><select value={product} onChange={event => setProduct(event.target.value)} className="h-9 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-600">{PRODUCT_OPTIONS.map(item => <option key={item}>{item}</option>)}</select><select value={status} onChange={event => setStatus(event.target.value)} className="h-9 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-600">{STATUS_OPTIONS.map(item => <option key={item}>{item}</option>)}</select></div></div>
        {filteredTasks.length === 0 ? <div className="px-6 py-24 text-center"><FileArchive className="mx-auto h-11 w-11 text-slate-200" /><h3 className="mt-4 font-bold text-slate-600">{formalTasks.length ? '没有符合条件的任务' : '还没有正式评测任务'}</h3><p className="mt-2 text-sm text-slate-400">任务提交后将自动进入管理员受理流程，并在这里持续更新。</p><Button className="mt-5 bg-blue-600" onClick={() => { navigate('/#product-matrix'); window.setTimeout(() => document.getElementById('product-matrix')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 120); }}>查看产品矩阵</Button></div> : <div className="overflow-x-auto"><table className="w-full min-w-[1100px] text-left"><thead className="bg-slate-50 text-xs font-semibold text-slate-400"><tr><th className="px-6 py-3">任务名称</th><th className="px-5 py-3">产品</th><th className="px-5 py-3">被测对象</th><th className="px-5 py-3">提交方式</th><th className="px-5 py-3">当前状态</th><th className="px-5 py-3">提交时间</th><th className="px-5 py-3 text-right">操作</th></tr></thead><tbody>{filteredTasks.map(task => { const config = STATUS_UI[task.status] || STATUS_UI['待受理']; const Icon = config.icon; return <tr key={task.id} className="border-t transition hover:bg-blue-50/30"><td className="px-6 py-4"><button onClick={() => setSelectedTask(task)} className="max-w-[240px] truncate text-sm font-bold text-slate-800 hover:text-blue-600">{task.name}</button><div className="mt-1 font-mono text-[10px] text-slate-400">{task.id}</div></td><td className="px-5 py-4 text-sm text-slate-600">{productLabel(task.evalType)}</td><td className="max-w-[180px] px-5 py-4 text-sm text-slate-600"><span className="block truncate">{task.model}</span></td><td className="px-5 py-4 text-sm text-slate-500">{submissionLabel(task)}</td><td className="px-5 py-4"><span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${config.style}`}><Icon className={`h-3.5 w-3.5 ${task.status === '处理中' ? 'animate-spin' : ''}`} />{config.label}</span></td><td className="px-5 py-4 text-xs text-slate-400">{task.createdAt}</td><td className="px-5 py-4 text-right"><Button variant="ghost" size="sm" className="text-blue-600" onClick={() => setSelectedTask(task)}>查看进度<ChevronRight className="ml-1 h-4 w-4" /></Button></td></tr>; })}</tbody></table></div>}
      </section>
    </div>

    <Dialog open={!!selectedTask} onOpenChange={open => !open && setSelectedTask(null)}><DialogContent className="max-h-[88vh] max-w-3xl overflow-y-auto"><DialogHeader><DialogTitle>任务详情与交付</DialogTitle></DialogHeader>{selectedTask && <TaskDetail task={selectedTask} onSupplement={() => supplementRef.current?.click()} />}<input ref={supplementRef} type="file" multiple className="hidden" onChange={supplementMaterial} /></DialogContent></Dialog>

    <Dialog open={modelsOpen} onOpenChange={open => !open && closeModels()}><DialogContent className="max-w-2xl"><DialogHeader><DialogTitle>模型 API 配置</DialogTitle></DialogHeader><p className="text-sm text-slate-500">供智能体安全评测、大模型性能评测和大模型安全评测创建任务时复用。平台不在此展示 API Key 明文。</p>{user.myModels.length === 0 ? <div className="rounded-xl border border-dashed py-14 text-center"><Bot className="mx-auto h-9 w-9 text-slate-300" /><p className="mt-3 text-sm text-slate-500">暂无已保存的模型 API 配置</p><p className="mt-1 text-xs text-slate-400">在上述产品创建任务时选择“自定义模型”即可保存。</p></div> : <div className="space-y-3">{user.myModels.map(model => <div key={model.id} className="flex items-center gap-4 rounded-xl border p-4"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50"><Bot className="h-5 w-5 text-blue-600" /></div><div className="min-w-0 flex-1"><div className="font-bold text-slate-800">{model.name}</div><div className="mt-1 truncate text-xs text-slate-400">{model.apiBase} · {model.modelId}</div></div><Badge variant="outline">API配置</Badge></div>)}</div>}</DialogContent></Dialog>

    <Dialog open={messagesOpen} onOpenChange={open => !open && closeMessages()}><DialogContent className="max-h-[82vh] max-w-2xl overflow-y-auto"><DialogHeader><div className="flex items-center justify-between pr-8"><DialogTitle>消息通知</DialogTitle>{unreadCount > 0 && <Button variant="ghost" size="sm" onClick={markAllNoticesRead}>全部标为已读</Button>}</div></DialogHeader>{notifications.length === 0 ? <div className="py-16 text-center text-sm text-slate-400"><Bell className="mx-auto mb-3 h-9 w-9 text-slate-200" />暂无消息</div> : <div className="space-y-2">{notifications.map(notice => <button key={notice.id} onClick={() => markNoticeRead(notice.id)} className={`flex w-full gap-3 rounded-xl border p-4 text-left ${notice.read ? 'bg-white' : 'border-blue-200 bg-blue-50'}`}><span className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${notice.read ? 'bg-slate-200' : 'bg-red-500'}`} /><span className="flex-1"><span className="block text-sm font-bold text-slate-800">{notice.title}</span><span className="mt-1 block text-sm leading-6 text-slate-500">{notice.content}</span><span className="mt-2 block text-xs text-slate-400">{notice.createdAt}</span></span></button>)}</div>}</DialogContent></Dialog>
  </div>;
}

function TaskDetail({ task, onSupplement }: { task: EvalTask; onSupplement: () => void }) {
  const config = STATUS_UI[task.status] || STATUS_UI['待受理'];
  const Icon = config.icon;
  return <div className="space-y-5 pt-2"><div className="rounded-xl bg-slate-50 p-5"><div className="flex flex-wrap items-start justify-between gap-3"><div><div className="font-mono text-xs text-blue-600">{task.id}</div><h3 className="mt-2 text-lg font-black text-slate-900">{task.name}</h3><p className="mt-1 text-sm text-slate-500">{productLabel(task.evalType)}</p></div><span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ${config.style}`}><Icon className="h-3.5 w-3.5" />{config.label}</span></div></div><div className="grid gap-4 sm:grid-cols-2"><Info label="被测对象" value={task.model} /><Info label="提交方式" value={submissionLabel(task)} /><Info label="提交时间" value={task.createdAt} /><Info label="当前阶段" value={config.label} /></div><div><div className="mb-2 text-sm font-bold text-slate-800">评测诉求／测试场景</div><div className="rounded-xl border bg-white p-4 text-sm leading-6 text-slate-600">{task.requirement || task.evalSet || '按提交配置开展评测'}</div></div><div><div className="mb-2 text-sm font-bold text-slate-800">已提交材料</div>{task.attachments?.length ? <div className="space-y-2">{task.attachments.map(file => <div key={file.id} className="flex items-center gap-3 rounded-lg border px-4 py-3"><FileArchive className="h-4 w-4 text-blue-500" /><span className="min-w-0 flex-1 truncate text-sm text-slate-600">{file.name}</span><span className="text-xs text-slate-400">{(file.size / 1024 / 1024).toFixed(2)} MB</span></div>)}</div> : <div className="rounded-xl border border-dashed p-4 text-sm text-slate-400">该任务使用模型 API 配置，无本地上传材料。</div>}</div>{task.status === '待补充材料' && <Button className="bg-orange-600 hover:bg-orange-700" onClick={onSupplement}><Upload className="mr-2 h-4 w-4" />补充上传材料</Button>}<div><div className="mb-2 text-sm font-bold text-slate-800">报告与结果文件</div>{task.status === '已推送' && task.reports?.length ? <div className="space-y-2">{task.reports.map(report => <button key={report.id} onClick={() => downloadAttachment(report)} className="flex w-full items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-left"><ShieldCheck className="h-5 w-5 text-emerald-600" /><span className="min-w-0 flex-1"><span className="block truncate text-sm font-bold text-emerald-900">{report.name}</span><span className="text-xs text-emerald-700">管理员正式交付文件</span></span><Download className="h-4 w-4 text-emerald-600" /></button>)}</div> : <div className="rounded-xl border border-dashed p-5 text-center text-sm text-slate-400">管理员推送后，报告和结果文件将在此显示。</div>}</div>{task.status === '处理异常' && <div className="rounded-xl bg-red-50 p-4 text-sm text-red-700"><MessageSquare className="mr-2 inline h-4 w-4" />任务处理出现异常，请通过玄鉴智能助手联系技术顾问。</div>}</div>;
}

function Info({ label, value }: { label: string; value: string }) {
  return <div className="rounded-xl border bg-white p-4"><div className="text-xs font-semibold text-slate-400">{label}</div><div className="mt-2 text-sm font-bold text-slate-700">{value || '—'}</div></div>;
}
