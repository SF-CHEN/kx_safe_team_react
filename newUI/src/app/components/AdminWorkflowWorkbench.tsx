import React, { useEffect, useMemo, useState } from 'react';
import { Activity, AlertTriangle, Ban, CheckCircle2, ChevronLeft, ChevronRight, Clock3, Download, Edit3, FileArchive, FileUp, History, KeyRound, Mail, MessageSquareWarning, Power, PowerOff, RefreshCw, Search, Send, ShieldCheck, Trash2, UserRound, UsersRound, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { adminResetLocalPassword } from '../context/UserContext';
import { WORKFLOW_EVENT, addAdminOperationLog, deliverTaskToUser, downloadAttachment, fileToStoredAttachment, getAdminOperationLogs, getPlatformActivities, getPlatformUsers, getWorkflowTasks, requestTaskSupplement, setPlatformUserStatus, terminateWorkflowTask, updatePlatformUser, updateWorkflowTask, type AdminOperationLog, type PlatformUserRecord, type WorkflowStatus, type WorkflowTask } from '../data/workflowStore';
const TERMINAL = new Set<WorkflowStatus>(['已交付', '已终止']);
const statusStyle: Record<WorkflowStatus, string> = {
  处理中: 'bg-blue-50 text-blue-700',
  待用户补充: 'bg-orange-50 text-orange-700',
  已交付: 'bg-emerald-50 text-emerald-700',
  已终止: 'bg-slate-100 text-slate-500'
};
const statusBar: Record<WorkflowStatus, string> = {
  处理中: 'bg-blue-600',
  待用户补充: 'bg-orange-500',
  已交付: 'bg-emerald-500',
  已终止: 'bg-slate-400'
};
function useWorkflowData() {
  const read = () => ({
    tasks: getWorkflowTasks(),
    users: getPlatformUsers(),
    logs: getAdminOperationLogs(),
    activities: getPlatformActivities()
  });
  const [data, setData] = useState(read);
  useEffect(() => {
    const refresh = () => setData(read());
    window.addEventListener(WORKFLOW_EVENT, refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener(WORKFLOW_EVENT, refresh);
      window.removeEventListener('storage', refresh);
    };
  }, []);
  return data;
}
function maskContact(contact: string) {
  if (/^1\d{10}$/.test(contact)) return `${contact.slice(0, 3)}****${contact.slice(-4)}`;
  const [name, domain] = contact.split('@');
  if (domain) return `${name.slice(0, 2)}***@${domain}`;
  return contact || '—';
}
function dateValue(value: string) {
  return new Date(value.replace(/\//g, '-')).getTime() || 0;
}
export function RegisteredUserPanel({
  initialUserId
}: {
  initialUserId?: string;
}) {
  const {
    tasks,
    users,
    activities
  } = useWorkflowData();
  const [query, setQuery] = useState('');
  const [editing, setEditing] = useState<PlatformUserRecord | null>(null);
  const [historyUser, setHistoryUser] = useState<PlatformUserRecord | null>(null);
  const today = new Date().toLocaleDateString('zh-CN');
  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const activeUserIds = new Set(activities.filter(item => dateValue(item.createdAt) >= sevenDaysAgo && (item.type === '在线体验' || item.type === '提交任务')).map(item => item.userId));
  const stats = [{
    label: '总注册用户',
    value: users.length,
    icon: UsersRound,
    tone: 'bg-blue-50 text-blue-600'
  }, {
    label: '今日新增用户',
    value: users.filter(user => new Date(user.registeredAt).toLocaleDateString('zh-CN') === today).length,
    icon: UserRound,
    tone: 'bg-cyan-50 text-cyan-600'
  }, {
    label: '近 7 天活跃用户',
    value: activeUserIds.size,
    icon: Activity,
    tone: 'bg-emerald-50 text-emerald-600'
  }, {
    label: '当前禁用账号',
    value: users.filter(user => user.status === '已停用').length,
    icon: Ban,
    tone: 'bg-amber-50 text-amber-600'
  }];
  const filtered = users.filter(user => !query.trim() || `${user.name}${user.contact}${user.id}`.toLowerCase().includes(query.trim().toLowerCase()));
  useEffect(() => {
    if (initialUserId) setHistoryUser(users.find(user => user.id === initialUserId) || null);
  }, [initialUserId, users]);
  const toggleStatus = (user: PlatformUserRecord) => {
    const next = user.status === '正常' ? '已停用' : '正常';
    setPlatformUserStatus(user.id, next);
    toast.success(`账号已${next === '正常' ? '启用' : '禁用'}`);
  };
  const resetPassword = async (user: PlatformUserRecord) => {
    const temporary = `Xj${Math.random().toString(36).slice(2, 8)}!`;
    if (!(await adminResetLocalPassword(user.id, temporary))) return toast.error('该用户凭证不在当前浏览器环境，需由后端重置');
    addAdminOperationLog({
      operator: 'admin',
      action: '重置用户密码',
      detail: user.id
    });
    window.prompt('临时密码已生成，请通过安全渠道告知用户：', temporary);
  };
  const saveEdit = () => {
    if (!editing?.name.trim() || !editing.contact.trim()) return toast.error('用户名和联系方式不能为空');
    updatePlatformUser(editing.id, {
      name: editing.name.trim(),
      contact: editing.contact.trim()
    });
    setEditing(null);
    toast.success('用户资料已更新');
  };
  return <>
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{stats.map((item, index) => {
        const Icon = item.icon;
        return <div key={item.label} className={`group relative overflow-hidden rounded-2xl border p-5 shadow-[0_10px_28px_rgba(15,23,42,.05)] transition hover:-translate-y-0.5 hover:shadow-lg ${index === 0 ? 'border-blue-100 bg-gradient-to-br from-white to-blue-50' : index === 1 ? 'border-cyan-100 bg-gradient-to-br from-white to-cyan-50' : index === 2 ? 'border-emerald-100 bg-gradient-to-br from-white to-emerald-50' : 'border-amber-100 bg-gradient-to-br from-white to-amber-50'}`}><span className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/60" /><div className="relative flex items-center justify-between"><span className={`flex h-11 w-11 items-center justify-center rounded-xl shadow-sm ${item.tone}`}><Icon className="h-5 w-5" /></span><span className="text-3xl font-black text-slate-950">{item.value}</span></div><div className="relative mt-4 text-sm font-bold text-slate-600">{item.label}</div><div className="relative mt-3 h-1 overflow-hidden rounded-full bg-white"><span className={`block h-full rounded-full ${index === 0 ? 'w-4/5 bg-blue-500' : index === 1 ? 'w-2/5 bg-cyan-500' : index === 2 ? 'w-3/5 bg-emerald-500' : 'w-1/4 bg-amber-500'}`} /></div></div>;
      })}</div>
    <section className="mt-5 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_14px_40px_rgba(15,23,42,.06)]">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b px-6 py-5"><div><h3 className="font-black text-slate-900">平台用户</h3><p className="mt-1 text-xs text-slate-400">账号注册后直接启用，不设人工审核流程</p></div><div className="relative"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="搜索用户名、账号或 UID" className="h-10 w-72 rounded-xl border border-slate-200 pl-10 pr-4 text-sm outline-none focus:border-blue-500" /></div></div>
      {!filtered.length ? <div className="py-16 text-center text-sm text-slate-400">暂无符合条件的用户记录</div> : <div className="overflow-x-auto"><table className="w-full min-w-[1100px] text-left text-sm"><thead className="bg-slate-50 text-xs text-slate-400"><tr><th className="px-6 py-3">用户</th><th className="px-5 py-3">联系方式</th><th className="px-5 py-3">注册时间</th><th className="px-5 py-3">最后登录</th><th className="px-5 py-3">进行中任务</th><th className="px-5 py-3">状态</th><th className="px-5 py-3">操作</th></tr></thead><tbody>{filtered.map(user => {
              const ownTasks = tasks.filter(task => task.userId === user.id);
              const ongoing = ownTasks.filter(task => !TERMINAL.has(task.status)).length;
              return <tr key={user.id} className="border-t hover:bg-slate-50/70"><td className="px-6 py-4"><div className="font-bold text-slate-800">{user.name}</div><div className="mt-1 font-mono text-[10px] text-slate-400">{user.id}</div></td><td className="px-5 py-4 text-slate-600">{maskContact(user.contact)}</td><td className="px-5 py-4 text-xs text-slate-500">{user.registeredAt}</td><td className="px-5 py-4 text-xs text-slate-500">{user.lastLoginAt}</td><td className="px-5 py-4 font-bold text-blue-600">{ongoing || '—'}</td><td className="px-5 py-4"><span className={`rounded-full px-2.5 py-1 text-xs font-bold ${user.status === '正常' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>{user.status}</span></td><td className="px-5 py-4"><div className="flex flex-wrap gap-2"><button onClick={() => setEditing({
                      ...user
                    })} className="text-xs font-semibold text-blue-600">编辑</button><button onClick={() => toggleStatus(user)} className="text-xs font-semibold text-slate-600">{user.status === '正常' ? '禁用' : '启用'}</button><button onClick={() => resetPassword(user)} className="text-xs font-semibold text-amber-600">重置密码</button><button onClick={() => setHistoryUser(user)} className="text-xs font-semibold text-violet-600">历史任务</button></div></td></tr>;
            })}</tbody></table></div>}
    </section>
    {editing && <Modal title="编辑用户资料" onClose={() => setEditing(null)}><label className="block text-xs font-bold text-slate-500">用户名<input value={editing.name} onChange={e => setEditing({
          ...editing,
          name: e.target.value
        })} className="mt-2 h-11 w-full rounded-xl border px-3 text-sm" /></label><label className="mt-4 block text-xs font-bold text-slate-500">手机号／邮箱<input value={editing.contact} onChange={e => setEditing({
          ...editing,
          contact: e.target.value
        })} className="mt-2 h-11 w-full rounded-xl border px-3 text-sm" /></label><button onClick={saveEdit} className="mt-6 h-11 w-full rounded-xl bg-blue-600 text-sm font-bold text-white">保存修改</button></Modal>}
    {historyUser && <Modal title={`${historyUser.name} · 历史任务`} onClose={() => setHistoryUser(null)} wide><div className="space-y-2">{tasks.filter(task => task.userId === historyUser.id).map(task => <div key={task.id} className="flex items-center justify-between rounded-xl border p-4"><div><b className="text-sm text-slate-800">{task.name}</b><p className="mt-1 text-xs text-slate-400">{task.id} · {task.product}</p></div><span className={`rounded-full px-2 py-1 text-xs font-bold ${statusStyle[task.status]}`}>{task.status}</span></div>)}{!tasks.some(task => task.userId === historyUser.id) && <div className="py-12 text-center text-sm text-slate-400">暂无历史任务</div>}</div></Modal>}
  </>;
}
export type TaskGroup = 'pending' | 'waiting' | 'closed' | 'all';
const ADMIN_PRODUCT_OPTIONS = ['全部产品', '数据集安全评测', '深度模型可信测评', '智能体安全评测', '大模型性能评测', '大模型安全评测'];
function canonicalProduct(product: string) {
  if (product === '大模型评测') return '大模型性能评测';
  if (product === '多模态大模型安全评测') return '大模型安全评测';
  return product;
}
function taskGroupForStatus(status: WorkflowStatus): TaskGroup {
  if (status === '待用户补充') return 'waiting';
  if (TERMINAL.has(status)) return 'closed';
  return 'pending';
}
export function AdminWorkflowWorkbench({
  initialTaskId,
  initialGroup
}: {
  initialTaskId?: string;
  initialGroup?: TaskGroup;
}) {
  const {
    tasks
  } = useWorkflowData();
  const [selected, setSelected] = useState<string | null>(initialTaskId || tasks[0]?.id || null);
  const [query, setQuery] = useState('');
  const [product, setProduct] = useState('全部产品');
  const [group, setGroup] = useState<TaskGroup>(() => initialGroup || taskGroupForStatus(tasks.find(task => task.id === initialTaskId)?.status || '处理中'));
  const [pageSize, setPageSize] = useState(5);
  const [page, setPage] = useState(1);
  const [publicText, setPublicText] = useState('');
  const [feedbackAction, setFeedbackAction] = useState<'supplement' | 'terminate'>('supplement');
  const [terminationConfirmOpen, setTerminationConfirmOpen] = useState(false);
  const productTasks = useMemo(() => tasks.filter(task => product === '全部产品' || canonicalProduct(task.product) === product), [tasks, product]);
  const filtered = useMemo(() => productTasks.filter(task => {
    const match = !query.trim() || `${task.id}${task.name}${task.userName}${task.contact}`.toLowerCase().includes(query.trim().toLowerCase());
    const groupMatch = group === 'all' || (group === 'closed' ? TERMINAL.has(task.status) : group === 'waiting' ? task.status === '待用户补充' : task.status === '处理中');
    return match && groupMatch;
  }), [productTasks, query, group]);
  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const visible = filtered.slice((page - 1) * pageSize, page * pageSize);
  const current = filtered.find(task => task.id === selected) || filtered[0] || tasks[0];
  const hasMatches = filtered.length > 0;
  useEffect(() => {
    setPage(1);
  }, [query, product, group, pageSize]);
  useEffect(() => {
    if (page > pages) setPage(pages);
  }, [page, pages]);
  useEffect(() => {
    if (initialTaskId?.startsWith('group:')) {
      setQuery(''); setProduct('全部产品'); setGroup(initialTaskId.slice(6) as TaskGroup); setSelected(null);
      return;
    }
    if (initialTaskId) {
      const task = tasks.find(item => item.id === initialTaskId);
      if (!task) return;
      setQuery('');
      setProduct('全部产品');
      setGroup(initialGroup || taskGroupForStatus(task.status));
      setSelected(task.id);
    } else if (initialGroup) {
      setQuery('');
      setProduct('全部产品');
      setGroup(initialGroup);
      setSelected(null);
    }
  }, [initialTaskId, initialGroup, tasks]);
  useEffect(() => {
    if (filtered.length && !filtered.some(task => task.id === selected)) setSelected(filtered[0].id);
  }, [filtered, selected]);
  useEffect(() => {
    setPublicText('');
    setFeedbackAction('supplement');
    setTerminationConfirmOpen(false);
  }, [current?.id]);
  const uploadOutputs = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!current || TERMINAL.has(current.status) || !event.target.files?.length) return;
    const files = await Promise.all(Array.from(event.target.files).map(file => fileToStoredAttachment(file, file.name.toLowerCase().includes('report') || file.name.endsWith('.pdf') ? 'report' : 'result')));
    updateWorkflowTask(current.id, {
      outputs: [...current.outputs, ...files]
    });
    addAdminOperationLog({
      operator: 'admin',
      taskId: current.id,
      action: '上传交付文件',
      detail: files.map(file => file.name).join('、')
    });
    toast.success(`已上传 ${files.length} 个交付文件`);
    event.target.value = '';
  };
  const removeOutput = (fileId: string) => {
    if (!current || TERMINAL.has(current.status)) return;
    const file = current.outputs.find(item => item.id === fileId);
    updateWorkflowTask(current.id, {
      outputs: current.outputs.filter(item => item.id !== fileId)
    });
    addAdminOperationLog({
      operator: 'admin',
      taskId: current.id,
      action: '删除交付文件',
      detail: file?.name || fileId
    });
    toast.success('交付文件已删除');
  };
  const replaceOutput = async (event: React.ChangeEvent<HTMLInputElement>, fileId: string) => {
    if (!current || TERMINAL.has(current.status) || !event.target.files?.[0]) return;
    const source = event.target.files[0];
    const replacement = await fileToStoredAttachment(source, source.name.toLowerCase().includes('report') || source.name.endsWith('.pdf') ? 'report' : 'result');
    updateWorkflowTask(current.id, {
      outputs: current.outputs.map(item => item.id === fileId ? replacement : item)
    });
    addAdminOperationLog({
      operator: 'admin',
      taskId: current.id,
      action: '替换交付文件',
      detail: replacement.name
    });
    toast.success('交付文件已替换');
    event.target.value = '';
  };
  const requestSupplement = () => {
    if (!current || !publicText.trim()) return toast.error('请填写需要用户补充的内容');
    requestTaskSupplement(current.id, publicText.trim(), '补充材料', '', 'admin');
    setGroup('waiting');
    setPublicText('');
    toast.success('补件要求已推送至用户资源中心');
  };
  const deliver = () => {
    if (!current?.outputs.length) return toast.error('请先上传报告或结果文件');
    if (deliverTaskToUser(current.id, '', 'admin')) {
      setGroup('closed');
      toast.success('报告已交付，用户资源中心与消息中心已同步');
    }
  };
  const submitFeedback = () => {
    if (!current || !publicText.trim()) return toast.error(feedbackAction === 'supplement' ? '请填写需要用户补充的内容' : '请填写终止原因，以便用户了解处理结果');
    if (feedbackAction === 'terminate') {
      setTerminationConfirmOpen(true);
      return;
    }
    requestSupplement();
  };
  const terminate = () => {
    if (!current || !publicText.trim()) return;
    terminateWorkflowTask(current.id, publicText.trim(), 'admin');
    setGroup('closed');
    setPublicText('');
    setTerminationConfirmOpen(false);
    toast.success('任务已终止并通知用户');
  };
  const download = (file: WorkflowTask['inputs'][number]) => {
    if (!current) return;
    if (!downloadAttachment(file)) toast.error('该大文件仅保存了元信息，正式下载需接入对象存储');else addAdminOperationLog({
      operator: 'admin',
      taskId: current.id,
      action: '下载用户材料',
      detail: file.name
    });
  };
  const downloadAllInputs = () => current?.inputs.forEach(download);
  const renderOutputFile = (file: WorkflowTask['outputs'][number]) => <div key={file.id} className="flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-1.5 text-sm text-slate-700"><CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" /><span className="min-w-0 flex-1 truncate">{file.name}</span><label title="替换文件" className="cursor-pointer rounded p-1 text-blue-600 hover:bg-white"><RefreshCw className="h-3.5 w-3.5" /><input type="file" className="hidden" onChange={event => replaceOutput(event, file.id)} /></label><button type="button" title="删除文件" onClick={() => removeOutput(file.id)} className="rounded p-1 text-red-500 hover:bg-white"><Trash2 className="h-3.5 w-3.5" /></button></div>;
  const outputManager = !TERMINAL.has(current?.status) && current?.outputs.length ? <section className="rounded-lg border border-blue-200 bg-white p-3"><div className="mb-2 text-xs font-bold text-slate-500">已上传交付文件（可替换或删除）</div><div className="space-y-1.5">{current.outputs.map(renderOutputFile)}</div></section> : null;
  const tabs: {
    key: TaskGroup;
    label: string;
    count: number;
  }[] = [{
    key: 'pending',
    label: '处理中',
    count: productTasks.filter(t => t.status === '处理中').length
  }, {
    key: 'waiting',
    label: '待用户补充',
    count: productTasks.filter(t => t.status === '待用户补充').length
  }, {
    key: 'closed',
    label: '已结束',
    count: productTasks.filter(t => TERMINAL.has(t.status)).length
  }, {
    key: 'all',
    label: '全部任务',
    count: productTasks.length
  }];
  if (!tasks.length) return <div className="rounded-3xl border border-dashed border-blue-200 bg-[linear-gradient(135deg,#fff,#f4f8ff)] px-8 py-24 text-center shadow-sm"><div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50"><FileArchive className="h-7 w-7 text-blue-500" /></div><h3 className="mt-5 font-black text-slate-800">暂无待处理的用户任务</h3><p className="mt-2 text-sm text-slate-400">用户从支持“创建任务”的正式产品提交后，会实时出现在这里。</p></div>;
  return <div className="overflow-hidden rounded-2xl border border-slate-200 bg-[#F5F7FA] text-sm leading-6 shadow-sm">
    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 bg-white px-6 py-5"><div><h3 className="text-base font-black text-slate-900">任务处理工作台</h3><p className="mt-1 text-sm leading-6 text-slate-500">从任务队列选择记录，在同一工作区完成核验、补件和交付</p></div><span className="text-sm text-slate-500">共 {tasks.length} 个任务</span></div>
    <div className="grid items-stretch 2xl:grid-cols-[360px_minmax(0,1fr)]">
    <section className="flex min-h-0 border-r border-slate-200 bg-slate-100/70 p-3">
      <div className="flex min-h-[680px] w-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="bg-[linear-gradient(145deg,#f8fbff,#eef5ff)] p-4"><div className="relative"><Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-blue-500" /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="搜索任务 ID、用户名" className="h-11 w-full rounded-xl border border-blue-100 bg-white/90 pl-10 pr-3 text-sm shadow-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100" /></div><label className="mt-3 block"><span className="mb-1.5 block text-[11px] font-bold text-slate-500">产品类型</span><select value={product} onChange={e => setProduct(e.target.value)} className="h-10 w-full rounded-xl border border-blue-100 bg-white px-3 text-sm font-semibold text-slate-700 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100">{ADMIN_PRODUCT_OPTIONS.map(item => <option key={item}>{item}</option>)}</select></label><div className="mt-3 grid grid-cols-2 gap-2">{tabs.map(tab => <button key={tab.key} onClick={() => setGroup(tab.key)} className={`rounded-xl px-3 py-2.5 text-xs font-bold transition ${group === tab.key ? 'bg-blue-600 text-white shadow-md shadow-blue-200' : 'bg-white/80 text-slate-500 hover:bg-white hover:text-blue-600'}`}>{tab.label}<span className="ml-1 opacity-70">{tab.count}</span></button>)}</div></div>
        <div className="min-h-0 flex-1 divide-y divide-slate-100 overflow-y-auto border-t border-slate-100 bg-white">{visible.map(task => {
              const active = current.id === task.id;
              return <button key={task.id} onClick={() => setSelected(task.id)} className={`group relative block w-full overflow-hidden border-l-4 px-4 py-4 text-left transition ${active ? 'border-blue-600 bg-[#E6F7FF] shadow-[inset_0_0_0_1px_rgba(37,99,235,.16)]' : 'border-transparent hover:bg-slate-50'}`}><span className={`absolute inset-y-3 left-0 w-1 rounded-r-full ${active ? 'bg-blue-600' : statusBar[task.status]}`} /><div className="flex items-start justify-between gap-3"><span className={`line-clamp-2 pl-1 text-sm font-black ${active ? 'text-blue-950' : 'text-slate-800'}`}>{task.name}</span><span className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold ${statusStyle[task.status]}`}>{task.status}</span></div><div className={`mt-2 pl-1 text-xs ${active ? 'font-semibold text-blue-700' : 'text-slate-500'}`}>{task.userName} · {canonicalProduct(task.product)}</div><div className="mt-2 flex items-center justify-between pl-1"><span className="font-mono text-[10px] text-slate-400">{task.id}</span><span className={`text-[11px] font-bold text-blue-600 transition ${active ? 'opacity-100' : 'translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100'}`}>{active ? '当前任务' : '处理 →'}</span></div></button>;
            })}{!visible.length && <div className="px-6 py-16 text-center"><FileArchive className="mx-auto h-8 w-8 text-slate-300" /><div className="mt-3 text-sm font-bold text-slate-500">没有符合条件的任务</div><div className="mt-1 text-xs text-slate-400">请调整产品、状态或搜索条件</div></div>}</div>
        <div className="flex h-14 shrink-0 items-center justify-between border-t border-slate-200 bg-slate-50 px-4 text-xs text-slate-500"><select value={pageSize} onChange={e => setPageSize(Number(e.target.value))} className="rounded-lg border border-slate-200 bg-white px-2 py-1.5"><option value={5}>5 条/页</option><option value={10}>10 条/页</option><option value={20}>20 条/页</option></select><div className="flex items-center gap-3"><button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="rounded-md p-1 hover:bg-white disabled:opacity-30"><ChevronLeft className="h-4 w-4" /></button><span>{page}/{pages}</span><button disabled={page === pages} onClick={() => setPage(p => p + 1)} className="rounded-md p-1 hover:bg-white disabled:opacity-30"><ChevronRight className="h-4 w-4" /></button></div></div>
      </div>
    </section>

    <section className="min-w-0 bg-[#F5F7FA] p-5">
      {hasMatches ? <>
      <header className="relative overflow-hidden rounded-lg border border-blue-200 bg-[#E6F7FF] px-5 py-6 shadow-[0_5px_16px_rgba(37,99,235,.09)] sm:px-7"><span className="absolute inset-y-0 left-0 w-1.5 bg-blue-600" /><div className="break-all font-mono text-[10px] tracking-wider text-blue-400 sm:absolute sm:right-7 sm:top-6 sm:text-xs">TASK {current.id}</div><div className="sm:pr-40"><div className="text-xs font-black tracking-[.16em] text-blue-700">{canonicalProduct(current.product)}</div><h2 className="mt-2 text-xl font-black leading-7 text-blue-950">{current.name}</h2><p className="mt-2 text-sm leading-6 text-blue-700/70">被测对象：{current.model}</p></div><div className="mt-5 flex flex-wrap items-center gap-3"><span className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-black ${statusStyle[current.status]}`}><span className={`h-2 w-2 rounded-full ${statusBar[current.status]}`} />{current.status}</span></div>
      </header>

      <div className="mt-5 grid items-stretch gap-5 xl:grid-cols-[minmax(0,1.3fr)_minmax(340px,.7fr)]">
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_5px_18px_rgba(15,23,42,.05)]">
          <section className="border-b border-slate-200 p-5"><div className="mb-4 flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white"><ShieldCheck className="h-4 w-4" /></span><div><h3 className="text-base font-black text-slate-900">任务概况</h3><p className="text-sm leading-6 text-slate-500">用户、诉求与提交配置</p></div></div><div className="grid gap-3 lg:grid-cols-2"><div className="rounded-lg border border-slate-100 bg-[#FAFAFA] p-4"><span className="text-sm font-bold text-slate-500">提交用户</span><b className="mt-2 block text-lg font-black leading-7 text-blue-700">{current.userName}</b><span className="mt-1 flex items-center gap-1.5 text-sm leading-6 text-slate-600"><Mail className="h-4 w-4 text-blue-500" />{current.contact}</span></div><div className="rounded-lg border border-slate-100 bg-[#FAFAFA] p-4"><span className="text-sm font-bold text-slate-500">评测诉求</span><p className="mt-2 text-sm font-semibold leading-6 text-slate-700">{current.requirement}</p></div></div>{current.configSummary && <div className="mt-3 rounded-lg border border-blue-100 bg-blue-50/50 px-4 py-3 text-sm leading-6 text-slate-600">配置摘要：{current.configSummary}</div>}</section>

          <section className="border-b border-slate-200 p-5"><div className="flex items-start justify-between gap-4"><div><h3 className="text-base font-black text-slate-900">用户提交材料</h3><p className="mt-1 text-sm leading-6 text-slate-500">下载后转入内部服务器执行正式评测</p></div><span className="shrink-0 text-lg font-black text-blue-600">{current.inputs.length} <small className="text-sm font-bold">个文件</small></span></div>{current.inputs.length ? <div className="mt-3 flex items-center gap-4"><div className="grid min-w-0 flex-1 gap-3 sm:grid-cols-2">{current.inputs.map(file => <div key={file.id} className="flex items-center gap-3 rounded-lg border border-slate-200 bg-[#FAFAFA] p-4 transition hover:border-blue-300"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-blue-50"><FileArchive className="h-5 w-5 text-blue-600" /></span><span className="min-w-0 flex-1"><b className="block truncate text-sm leading-6 text-slate-700">{file.name}</b><span className="mt-1 block text-sm text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</span></span></div>)}</div><button onClick={downloadAllInputs} className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-xs font-bold text-blue-700 transition hover:border-blue-600 hover:bg-blue-600 hover:text-white"><Download className="h-3.5 w-3.5" />{current.inputs.length > 1 ? '下载全部' : '下载文件'}</button></div> : <div className="mt-3 rounded-lg border border-dashed border-slate-200 bg-[#FAFAFA] p-7 text-center text-sm leading-6 text-slate-500">该任务使用模型 API 配置，无本地上传文件</div>}</section>

          <section className="p-5"><div className="flex items-center gap-2"><History className="h-5 w-5 text-blue-500" /><h3 className="text-base font-black text-slate-900">用户沟通记录</h3></div>{current.communications?.length ? <div className="relative mt-4 space-y-3 pl-5 before:absolute before:bottom-2 before:left-[6px] before:top-2 before:w-px before:bg-slate-200">{current.communications.slice().reverse().map(item => <div key={item.id} className="relative rounded-lg border border-slate-100 bg-[#FAFAFA] px-4 py-3 before:absolute before:-left-[18px] before:top-5 before:h-2.5 before:w-2.5 before:rounded-full before:bg-blue-500 before:ring-4 before:ring-white"><div className="flex justify-between gap-3"><b className="text-sm leading-6 text-slate-700">{item.type} · {item.sender === 'admin' ? '管理员' : item.sender === 'user' ? '用户' : '系统'}</b><span className="text-xs leading-6 text-slate-500">{item.createdAt}</span></div><p className="mt-1.5 text-sm leading-6 text-slate-600">{item.content}</p></div>)}</div> : <div className="mt-4 rounded-lg bg-[#FAFAFA] py-8 text-center text-sm leading-6 text-slate-500">暂无沟通记录</div>}</section>
        </div>

        <aside className="flex h-full flex-col gap-3 rounded-xl border border-blue-300 bg-[#EEF6FF] p-4 shadow-[0_10px_28px_rgba(37,99,235,.13)] xl:sticky xl:top-[88px] xl:self-start">
          <h3 className="text-lg font-black leading-7 text-slate-950">管理员操作台</h3>{outputManager}
          {TERMINAL.has(current.status) ? <div className={`rounded-2xl border p-5 ${current.status === '已交付' ? 'border-emerald-200 bg-emerald-50' : 'border-slate-200 bg-white'}`}><div className="flex items-center gap-3">{current.status === '已交付' ? <CheckCircle2 className="h-6 w-6 text-emerald-600" /> : <XCircle className="h-6 w-6 text-slate-500" />}<div><h4 className="text-sm font-black text-slate-800">任务流程已结束</h4><p className="mt-1 text-xs leading-5 text-slate-500">当前状态为“{current.status}”，补件、上传、交付和终止操作均已锁定。</p></div></div></div> : <>
          <section className="rounded-xl border border-orange-200 bg-white p-4 shadow-sm"><div className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-500 text-white"><MessageSquareWarning className="h-4 w-4" /></span><div><h4 className="text-base font-black text-slate-900">返回意见</h4><p className="text-xs leading-5 text-orange-700">先选择处理结果，再填写用户可见说明</p></div></div><label className="mt-4 block text-xs font-bold text-slate-500">处理结果<select value={feedbackAction} onChange={event => setFeedbackAction(event.target.value as 'supplement' | 'terminate')} className="mt-2 h-10 w-full rounded-lg border border-orange-100 bg-white px-3 text-sm font-semibold text-slate-700 outline-none focus:border-orange-400"><option value="supplement">请求用户补件</option><option value="terminate">终止任务</option></select></label><textarea value={publicText} onChange={event => setPublicText(event.target.value)} className="mt-3 min-h-24 w-full resize-y rounded-lg border border-orange-100 bg-white p-3 text-sm leading-6 outline-none focus:border-orange-400" placeholder={feedbackAction === 'supplement' ? '例如：请重新提交 XXXX 文件' : '请填写用户可见的终止原因'} /><button onClick={submitFeedback} className={`mt-3 w-full rounded-lg px-4 py-2.5 text-sm font-black text-white shadow-md transition ${feedbackAction === 'supplement' ? 'bg-orange-500 shadow-orange-200 hover:bg-orange-600' : 'bg-red-600 shadow-red-200 hover:bg-red-700'}`}>{feedbackAction === 'supplement' ? '发送补件要求' : '继续终止任务'}</button></section>

          <section className="overflow-hidden rounded-lg border border-blue-200 bg-white shadow-sm"><div className="p-4"><div className="flex items-center gap-3"><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-700"><Send className="h-4 w-4" /></span><div><h4 className="text-base font-black text-slate-900">正常交付</h4><p className="text-xs leading-5 text-slate-500">上传文件并正式推送给用户</p></div></div><label className="mt-3 flex min-h-16 cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-blue-200 bg-blue-50/60 text-sm font-bold text-blue-700 transition hover:border-blue-500 hover:bg-blue-50"><FileUp className="h-4 w-4" />上传报告／结果文件<input type="file" multiple className="hidden" onChange={uploadOutputs} /></label>{current.outputs.length > 0 && <div className="mt-2 max-h-24 space-y-1.5 overflow-y-auto">{current.outputs.map(file => <div key={file.id} className="flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-1.5 text-sm text-slate-700"><CheckCircle2 className="h-4 w-4 text-emerald-600" /><span className="truncate">{file.name}</span></div>)}</div>}<button onClick={deliver} disabled={current.status === '已交付' || !current.outputs.length} className="mt-2 w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-black text-white shadow-sm hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400">{current.status === '已交付' ? '已完成交付' : current.outputs.length ? '确认交付并推送用户' : '请先上传交付文件'}</button></div>{current.pushedAt && <div className="border-t border-blue-100 bg-blue-50/60 px-4 py-2 text-xs leading-5 text-blue-700">最近交付：{current.pushedAt} · v{current.outputVersion || 1}</div>}</section>

          </>}
          {terminationConfirmOpen && <Modal title="确认终止任务" onClose={() => setTerminationConfirmOpen(false)}><div className="rounded-2xl border border-red-100 bg-red-50 p-4"><div className="flex items-start gap-3"><AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" /><div><p className="text-sm font-black text-red-900">终止后任务将立即归入“已结束”并通知用户</p><p className="mt-2 text-xs leading-6 text-red-700">用户可见说明：{publicText}</p></div></div></div><div className="mt-5 flex gap-3"><button onClick={() => setTerminationConfirmOpen(false)} className="h-11 flex-1 rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-600">取消</button><button onClick={terminate} className="h-11 flex-1 rounded-xl bg-red-600 text-sm font-black text-white hover:bg-red-700">确认终止并通知用户</button></div></Modal>}
        </aside>
      </div>
      </> : <div className="flex min-h-[680px] items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white/70 px-8 text-center"><div><FileArchive className="mx-auto h-12 w-12 text-slate-300" /><h3 className="mt-4 text-base font-black text-slate-700">没有符合条件的任务</h3><p className="mt-2 text-sm text-slate-500">请在左侧调整产品类型、任务状态或搜索关键词。</p></div></div>}
    </section>
    </div>
  </div>;
}
export function AdminOperationLogPanel() {
  const {
    logs
  } = useWorkflowData();
  const [query, setQuery] = useState('');
  const filtered = logs.filter(log => !query.trim() || `${log.action}${log.taskId}${log.operator}${log.detail}`.toLowerCase().includes(query.trim().toLowerCase()));
  const exportCsv = () => {
    const escape = (value: unknown) => `"${String(value ?? '').replace(/"/g, '""')}"`;
    const csv = ['操作,任务ID,操作人,详情,时间', ...filtered.map(log => [log.action, log.taskId || '', log.operator, log.detail || '', log.createdAt].map(escape).join(','))].join('\n');
    const anchor = document.createElement('a');
    anchor.href = URL.createObjectURL(new Blob(['\ufeff', csv], {
      type: 'text/csv;charset=utf-8'
    }));
    anchor.download = `玄鉴管理员操作日志-${new Date().toISOString().slice(0, 10)}.csv`;
    anchor.click();
    URL.revokeObjectURL(anchor.href);
    addAdminOperationLog({
      operator: 'admin',
      action: '导出操作日志',
      detail: `${filtered.length} 条`
    });
  };
  return <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="flex flex-wrap items-center justify-between gap-3 border-b px-6 py-5"><div><h3 className="flex items-center gap-2 font-black text-slate-900"><History className="h-4 w-4 text-blue-500" />操作日志</h3><p className="mt-1 text-xs text-slate-400">追踪任务、账号、下载、交付与通知操作</p></div><div className="flex gap-2"><div className="relative"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="搜索操作或任务 ID" className="h-9 w-60 rounded-lg border pl-9 pr-3 text-xs" /></div><button onClick={exportCsv} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white"><Download className="h-4 w-4" />导出 CSV</button></div></div>{filtered.length ? <div className="divide-y">{filtered.map(log => <div key={log.id} className="grid gap-2 px-6 py-4 text-sm md:grid-cols-[170px_150px_1fr_210px]"><span className="font-semibold text-slate-700">{log.action}</span><span className="font-mono text-xs text-blue-600">{log.taskId || '平台用户'}</span><span className="text-slate-500">{log.detail || '—'}</span><span className="text-xs text-slate-400">{log.operator} · {log.createdAt}</span></div>)}</div> : <div className="px-6 py-16 text-center text-sm text-slate-400"><AlertTriangle className="mx-auto mb-3 h-8 w-8 text-slate-300" />暂无匹配的操作记录</div>}</section>;
}
function InfoCard({
  label,
  title,
  body,
  icon: Icon
}: {
  label: string;
  title: string;
  body: string;
  icon: React.ElementType;
}) {
  return <div className="rounded-xl bg-slate-50 p-4"><div className="flex items-center gap-2 text-xs font-bold text-slate-400"><Icon className="h-4 w-4 text-blue-500" />{label}</div><div className="mt-2 font-bold leading-6 text-slate-800">{title}</div><div className="mt-1 text-sm leading-6 text-slate-500">{body}</div></div>;
}
function Modal({
  title,
  onClose,
  children,
  wide = false
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  wide?: boolean;
}) {
  return <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/45 p-5 backdrop-blur-sm"><div className={`max-h-[84vh] w-full overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl ${wide ? 'max-w-2xl' : 'max-w-md'}`}><div className="mb-5 flex items-center justify-between"><h3 className="text-lg font-black text-slate-900">{title}</h3><button onClick={onClose} className="text-slate-400"><XCircle className="h-5 w-5" /></button></div>{children}</div></div>;
}
