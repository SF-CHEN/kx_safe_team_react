import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Activity, AlertTriangle, Ban, CheckCircle2, ChevronLeft, ChevronRight, Clock3,
  Download, Edit3, FileArchive, FileUp, History, KeyRound, Mail, MessageSquareWarning,
  Power, PowerOff, RefreshCw, Search, Send, ShieldCheck, Trash2, UserRound, UsersRound, XCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import { fetchAuthUsers, updateAuthUserStatus, type AuthUser } from '@/api/auth';
import { resetSysUserPassword, updateSysUser } from '@/api/user';
import {
  adminDeliverTask,
  adminRequestSupplement,
  adminTerminateTask,
  fetchAdminEvaluationTaskDetail,
  fetchAdminEvaluationTaskPage,
  fetchAdminEvaluationTasks,
  type AdminEvalTaskDetail,
  type AdminEvalTaskRow,
} from '@/api/evaluation';
import { downloadSysFile } from '@/api/file';
import { fetchUserOverview } from '@/api/overview';
import type { UserOverviewVo } from '@/api/generated/types/overview';
import { DataPagination } from './DataPagination';
import {
  WORKFLOW_EVENT, addAdminOperationLog,
  getAdminOperationLogs,
  type AdminOperationLog, type PlatformUserRecord, type WorkflowStatus, type WorkflowTask,
} from '../data/workflowStore';

export const ADMIN_REMOTE_EVENT = 'xuanjian-admin-remote';

export function notifyAdminRemoteChanged() {
  window.dispatchEvent(new Event(ADMIN_REMOTE_EVENT));
}

const TERMINAL = new Set<WorkflowStatus>(['已交付', '已终止']);
const statusStyle: Record<string, string> = {
  处理中: 'bg-blue-50 text-blue-700', 待用户补充: 'bg-orange-50 text-orange-700',
  已交付: 'bg-emerald-50 text-emerald-700', 已终止: 'bg-slate-100 text-slate-500',
};
const statusBar: Record<string, string> = {
  处理中: 'bg-blue-600', 待用户补充: 'bg-orange-500',
  已交付: 'bg-emerald-500', 已终止: 'bg-slate-400',
};
const fallbackStatusStyle = 'bg-slate-100 text-slate-600';
const fallbackStatusBar = 'bg-slate-400';

export function normalizeAdminStatus(status: string): WorkflowStatus {
  const upper = status.trim().toUpperCase();
  if (status === '待用户补充' || upper === 'AWAIT_SUPPLEMENT') return '待用户补充';
  if (status === '已交付' || upper === 'DELIVERED') return '已交付';
  if (status === '已终止' || upper === 'TERMINATED') return '已终止';
  return '处理中';
}

const ADMIN_PRODUCT_OPTIONS = ['全部产品', '数据集安全评测', '深度模型可信测评', '智能体安全评测', '大模型性能评测', '大模型安全评测'];

function canonicalProduct(product: string) {
  if (product === '大模型评测') return '大模型性能评测';
  if (product === '多模态大模型安全评测') return '大模型安全评测';
  if (product === '模型数据安全评测') return '数据集安全评测';
  return product;
}

export function mapAuthUserToRecord(user: AuthUser): PlatformUserRecord {
  return {
    id: String(user.id),
    name: user.nickname || user.username || String(user.id),
    contact: user.username || '—',
    registeredAt: user.created_at ? new Date(user.created_at).toLocaleString('zh-CN', { hour12: false }) : '—',
    lastLoginAt: user.last_login_at
      ? new Date(user.last_login_at).toLocaleString('zh-CN', { hour12: false })
      : '—',
    status: user.is_active === false ? '已停用' : '正常',
    role: user.role === 'admin' ? 'admin' : 'user',
  };
}

export function mapEvalRowToWorkflow(row: AdminEvalTaskRow): WorkflowTask {
  return {
    id: row.id,
    userId: row.userId,
    userName: row.userName,
    contact: row.contact,
    name: row.name,
    product: row.product,
    model: row.model,
    requirement: row.requirement,
    configSummary: row.configSummary,
    status: normalizeAdminStatus(row.status),
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    inputs: row.inputs.map((file) => ({
      id: file.id,
      name: file.name,
      size: file.size,
      type: '',
      category: 'input',
      uploadedAt: row.createdAt,
    })),
    outputs: row.outputs.map((file) => ({
      id: file.id,
      name: file.name,
      size: file.size,
      type: '',
      category: 'report' as const,
      uploadedAt: row.updatedAt,
    })),
    communications: row.communications || [],
    pushedAt: row.pushedAt,
  };
}

function mergeTaskWithDetail(
  task: WorkflowTask,
  detail?: AdminEvalTaskDetail | null,
  pendingDeliver?: { id: string; name: string; size: number } | null,
): WorkflowTask {
  if (!detail && !pendingDeliver) return task;
  const inputs = detail
    ? detail.inputs.map((file) => ({
        id: file.id,
        name: file.name,
        size: file.size,
        type: '',
        category: 'input' as const,
        uploadedAt: task.createdAt,
      }))
    : task.inputs;
  const remoteOutputs = detail
    ? detail.outputs.map((file) => ({
        id: file.id,
        name: file.name,
        size: file.size,
        type: '',
        category: 'report' as const,
        uploadedAt: task.updatedAt,
      }))
    : task.outputs;
  const outputs = pendingDeliver
    ? [{
        id: pendingDeliver.id,
        name: pendingDeliver.name,
        size: pendingDeliver.size,
        type: '',
        category: 'report' as const,
        uploadedAt: task.updatedAt,
      }]
    : remoteOutputs;
  return {
    ...task,
    userName: detail && detail.userName !== '—' ? detail.userName : task.userName,
    contact: detail && detail.contact !== '—' ? detail.contact : task.contact,
    requirement:
      detail && detail.requirement !== '—' ? detail.requirement : task.requirement,
    configSummary: detail?.configSummary || task.configSummary,
    status: detail ? normalizeAdminStatus(detail.status) : task.status,
    inputs,
    outputs,
    communications: detail?.communications ?? task.communications,
    pushedAt: detail?.pushedAt || task.pushedAt,
  };
}

function useAdminLogs() {
  const [logs, setLogs] = useState<AdminOperationLog[]>(() => getAdminOperationLogs());
  useEffect(() => {
    const refresh = () => setLogs(getAdminOperationLogs());
    window.addEventListener(WORKFLOW_EVENT, refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener(WORKFLOW_EVENT, refresh);
      window.removeEventListener('storage', refresh);
    };
  }, []);
  return logs;
}

function maskContact(contact: string) {
  if (/^1\d{10}$/.test(contact)) return `${contact.slice(0, 3)}****${contact.slice(-4)}`;
  const [name, domain] = contact.split('@');
  if (domain) return `${name.slice(0, 2)}***@${domain}`;
  return contact || '—';
}

function errorMessage(err: unknown, fallback: string) {
  return err instanceof Error && err.message.trim() ? err.message : fallback;
}

export function RegisteredUserPanel({ initialUserId }: { initialUserId?: string }) {
  const [users, setUsers] = useState<PlatformUserRecord[]>([]);
  const [userOverview, setUserOverview] = useState<UserOverviewVo | null>(null);
  const [query, setQuery] = useState('');
  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<PlatformUserRecord | null>(null);
  const [historyUser, setHistoryUser] = useState<PlatformUserRecord | null>(null);
  const [historyTasks, setHistoryTasks] = useState<WorkflowTask[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyPage, setHistoryPage] = useState(1);
  const [historyPageSize, setHistoryPageSize] = useState(10);
  const [historyTotal, setHistoryTotal] = useState(0);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const userPage = await fetchAuthUsers({
        pageSize,
        pageCurrent: page,
        username: keyword || undefined,
      });
      setUsers(userPage.items.map(mapAuthUserToRecord));
      setTotal(Number(userPage.total) || 0);
    } catch (err) {
      toast.error(errorMessage(err, '用户列表加载失败'));
      setUsers([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [keyword, page, pageSize]);

  const loadOverview = useCallback(async () => {
    try {
      setUserOverview(await fetchUserOverview());
    } catch (err) {
      toast.error(errorMessage(err, '用户统计加载失败'));
      setUserOverview(null);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setKeyword(query.trim());
      setPage(1);
    }, 300);
    return () => window.clearTimeout(timer);
  }, [query]);

  useEffect(() => { void loadUsers(); }, [loadUsers]);
  useEffect(() => { void loadOverview(); }, [loadOverview]);
  useEffect(() => {
    const refreshRemote = () => {
      void loadUsers();
      void loadOverview();
    };
    window.addEventListener(ADMIN_REMOTE_EVENT, refreshRemote);
    return () => {
      window.removeEventListener(ADMIN_REMOTE_EVENT, refreshRemote);
    };
  }, [loadUsers, loadOverview]);

  const stats = [
    { label: '总注册用户', value: userOverview?.totalUserCount ?? total, icon: UsersRound, tone: 'bg-blue-50 text-blue-600' },
    { label: '今日新增用户', value: userOverview?.todayNewUserCount ?? 0, icon: UserRound, tone: 'bg-cyan-50 text-cyan-600' },
    { label: '近 7 天活跃用户', value: userOverview?.activeUserCountLast7Days ?? 0, icon: Activity, tone: 'bg-emerald-50 text-emerald-600' },
    { label: '当前禁用账号', value: userOverview?.disabledUserCount ?? 0, icon: Ban, tone: 'bg-amber-50 text-amber-600' },
  ];

  useEffect(() => {
    if (!initialUserId) return;
    const matched = users.find(user => user.id === initialUserId);
    setHistoryPage(1);
    setHistoryUser(matched || {
      id: initialUserId,
      name: `用户 #${initialUserId}`,
      contact: '—',
      registeredAt: '—',
      lastLoginAt: '—',
      status: '正常',
      role: 'user',
    });
  }, [initialUserId, users]);

  useEffect(() => {
    if (!historyUser) {
      setHistoryTasks([]);
      setHistoryTotal(0);
      setHistoryLoading(false);
      return;
    }
    const userId = Number(historyUser.id);
    if (!Number.isFinite(userId)) {
      setHistoryTasks([]);
      setHistoryTotal(0);
      return;
    }
    let cancelled = false;
    setHistoryLoading(true);
    void fetchAdminEvaluationTaskPage({
      userId,
      pageCurrent: historyPage,
      pageSize: historyPageSize,
    })
      .then((result) => {
        if (cancelled) return;
        setHistoryTasks(result.items.map(mapEvalRowToWorkflow));
        setHistoryTotal(result.total);
      })
      .catch((err) => {
        if (cancelled) return;
        setHistoryTasks([]);
        setHistoryTotal(0);
        toast.error(errorMessage(err, '历史任务加载失败'));
      })
      .finally(() => {
        if (!cancelled) setHistoryLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [historyUser, historyPage, historyPageSize]);

  const openHistory = (user: PlatformUserRecord) => {
    setHistoryPage(1);
    setHistoryUser(user);
  };
  const toggleStatus = async (user: PlatformUserRecord) => {
    if (user.role === 'admin') return toast.error('管理员账号不可操作');
    const nextActive = user.status !== '正常';
    try {
      await updateAuthUserStatus(user.id, nextActive);
      addAdminOperationLog({ operator: 'admin', action: nextActive ? '启用账号' : '禁用账号', detail: user.id });
      notifyAdminRemoteChanged();
      const nextStatus = nextActive ? '正常' : '已停用';
      setUsers((prev) => prev.map((item) => (item.id === user.id ? { ...item, status: nextStatus } : item)));
      setUserOverview((prev) => {
        if (!prev) return prev;
        const disabled = Number(prev.disabledUserCount || 0);
        return {
          ...prev,
          disabledUserCount: nextActive ? Math.max(0, disabled - 1) : disabled + 1,
        };
      });
      toast.success(`账号已${nextActive ? '启用' : '禁用'}`);
    } catch (err) {
      toast.error(errorMessage(err, '账号状态更新失败'));
    }
  };

  const resetPassword = async (user: PlatformUserRecord) => {
    if (user.role === 'admin') return toast.error('管理员账号不可操作');
    const userId = Number(user.id);
    if (!Number.isFinite(userId)) return toast.error('无法重置该用户密码');
    try {
      await resetSysUserPassword({ userId });
      addAdminOperationLog({ operator: 'admin', action: '重置用户密码', detail: user.id });
      notifyAdminRemoteChanged();
      toast.success('密码已重置');
      // 后端固定重置为 123456 的 MD5，明文告知管理员用于安全渠道传达
      window.prompt('密码已重置为默认值，请通过安全渠道告知用户：', '123456');
    } catch (err) {
      toast.error(errorMessage(err, '重置密码失败'));
    }
  };

  const saveEdit = async () => {
    if (!editing) return;
    if (editing.role === 'admin') return toast.error('管理员账号不可操作');
    if (!editing.name.trim()) return toast.error('用户名不能为空');
    const id = Number(editing.id);
    if (!Number.isFinite(id)) return toast.error('无法保存该用户');
    try {
      await updateSysUser({ id, username: editing.name.trim() });
      addAdminOperationLog({ operator: 'admin', action: '编辑用户资料', detail: editing.id });
      notifyAdminRemoteChanged();
      const nextUser = {
        ...editing,
        name: editing.name.trim(),
        contact: editing.contact.trim() || editing.name.trim(),
      };
      setUsers((prev) => prev.map((item) => (item.id === editing.id ? nextUser : item)));
      setEditing(null);
      toast.success(editing.contact.trim() && editing.contact.trim() !== editing.name.trim()
        ? '用户名已更新；联系方式暂无独立接口，未写入后端'
        : '用户资料已更新');
    } catch (err) {
      toast.error(errorMessage(err, '用户资料更新失败'));
    }
  };

  return <>
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{stats.map((item, index) => { const Icon = item.icon; return <div key={item.label} className={`group relative overflow-hidden rounded-2xl border p-5 shadow-[0_10px_28px_rgba(15,23,42,.05)] transition hover:-translate-y-0.5 hover:shadow-lg ${index === 0 ? 'border-blue-100 bg-gradient-to-br from-white to-blue-50' : index === 1 ? 'border-cyan-100 bg-gradient-to-br from-white to-cyan-50' : index === 2 ? 'border-emerald-100 bg-gradient-to-br from-white to-emerald-50' : 'border-amber-100 bg-gradient-to-br from-white to-amber-50'}`}><span className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/60" /><div className="relative flex items-center justify-between"><span className={`flex h-11 w-11 items-center justify-center rounded-xl shadow-sm ${item.tone}`}><Icon className="h-5 w-5" /></span><span className="text-3xl font-black text-slate-950">{item.value}</span></div><div className="relative mt-4 text-sm font-bold text-slate-600">{item.label}</div><div className="relative mt-3 h-1 overflow-hidden rounded-full bg-white"><span className={`block h-full rounded-full ${index === 0 ? 'w-4/5 bg-blue-500' : index === 1 ? 'w-2/5 bg-cyan-500' : index === 2 ? 'w-3/5 bg-emerald-500' : 'w-1/4 bg-amber-500'}`} /></div></div>; })}</div>
    <section className="mt-5 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_14px_40px_rgba(15,23,42,.06)]">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b px-6 py-5"><div><h3 className="font-black text-slate-900">平台用户</h3><p className="mt-1 text-xs text-slate-400">账号注册后直接启用，不设人工审核流程</p></div><div className="relative"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="搜索用户名、账号或 UID" className="h-10 w-72 rounded-xl border border-slate-200 pl-10 pr-4 text-sm outline-none focus:border-blue-500" /></div></div>
      {!users.length ? <div className="py-16 text-center text-sm text-slate-400">{loading ? '正在加载用户…' : '暂无符合条件的用户记录'}</div> : <div className="overflow-x-auto"><table className="w-full min-w-[1100px] text-left text-sm"><thead className="bg-slate-50 text-xs text-slate-400"><tr><th className="px-6 py-3">用户</th><th className="px-5 py-3">联系方式</th><th className="px-5 py-3">注册时间</th><th className="px-5 py-3">最后登录</th><th className="px-5 py-3">进行中任务</th><th className="px-5 py-3">状态</th><th className="px-5 py-3">操作</th></tr></thead><tbody>{users.map(user => { const isAdminUser = user.role === 'admin'; return <tr key={user.id} className="border-t hover:bg-slate-50/70"><td className="px-6 py-4"><div className="flex items-center gap-2"><span className="font-bold text-slate-800">{user.name}</span>{isAdminUser && <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500">管理员</span>}</div><div className="mt-1 font-mono text-[10px] text-slate-400">{user.id}</div></td><td className="px-5 py-4 text-slate-600">{maskContact(user.contact)}</td><td className="px-5 py-4 text-xs text-slate-500">{user.registeredAt}</td><td className="px-5 py-4 text-xs text-slate-500">{user.lastLoginAt}</td><td className="px-5 py-4 font-bold text-slate-400">—</td><td className="px-5 py-4"><span className={`rounded-full px-2.5 py-1 text-xs font-bold ${user.status === '正常' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>{user.status}</span></td><td className="px-5 py-4"><div className="flex flex-wrap gap-2">{isAdminUser ? <span className="text-xs text-slate-400">不可操作</span> : <><button onClick={() => setEditing({ ...user })} className="text-xs font-semibold text-blue-600">编辑</button><button onClick={() => toggleStatus(user)} className="text-xs font-semibold text-slate-600">{user.status === '正常' ? '禁用' : '启用'}</button><button onClick={() => resetPassword(user)} className="text-xs font-semibold text-amber-600">重置密码</button></>}<button onClick={() => openHistory(user)} className="text-xs font-semibold text-violet-600">历史任务</button></div></td></tr>; })}</tbody></table></div>}
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
    </section>
    {editing && <Modal title="编辑用户资料" onClose={() => setEditing(null)}><label className="block text-xs font-bold text-slate-500">用户名<input value={editing.name} onChange={e => setEditing({ ...editing, name: e.target.value })} className="mt-2 h-11 w-full rounded-xl border px-3 text-sm" /></label><label className="mt-4 block text-xs font-bold text-slate-500">手机号／邮箱<input value={editing.contact} onChange={e => setEditing({ ...editing, contact: e.target.value })} className="mt-2 h-11 w-full rounded-xl border px-3 text-sm" /></label><button onClick={saveEdit} className="mt-6 h-11 w-full rounded-xl bg-blue-600 text-sm font-bold text-white">保存修改</button></Modal>}
    {historyUser && (
      <Modal title={`${historyUser.name} · 历史任务`} onClose={() => setHistoryUser(null)} wide>
        <div className="space-y-2">
          {historyLoading ? (
            <div className="py-12 text-center text-sm text-slate-400">正在加载历史任务…</div>
          ) : historyTasks.length ? (
            historyTasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between rounded-xl border p-4">
                <div>
                  <b className="text-sm text-slate-800">{task.name}</b>
                  <p className="mt-1 text-xs text-slate-400">{task.id} · {task.product}</p>
                </div>
                <span className={`rounded-full px-2 py-1 text-xs font-bold ${statusStyle[task.status] || fallbackStatusStyle}`}>{task.status}</span>
              </div>
            ))
          ) : (
            <div className="py-12 text-center text-sm text-slate-400">暂无历史任务</div>
          )}
        </div>
        <div className="mt-4 border-t">
          <DataPagination
            total={historyTotal}
            page={historyPage}
            pageSize={historyPageSize}
            disabled={historyLoading}
            onPageChange={setHistoryPage}
            onPageSizeChange={(size) => {
              setHistoryPageSize(size);
              setHistoryPage(1);
            }}
          />
        </div>
      </Modal>
    )}
  </>;
}

export type TaskGroup = 'pending' | 'waiting' | 'closed' | 'all';

function taskGroupForStatus(status: WorkflowStatus): TaskGroup {
  if (status === '待用户补充') return 'waiting';
  if (TERMINAL.has(status)) return 'closed';
  return 'pending';
}

export function AdminWorkflowWorkbench({ initialTaskId, initialGroup }: { initialTaskId?: string; initialGroup?: TaskGroup }) {
  const [rows, setRows] = useState<AdminEvalTaskRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string | null>(initialTaskId || null);
  const [query, setQuery] = useState('');
  const [product, setProduct] = useState('全部产品');
  const [group, setGroup] = useState<TaskGroup>(initialGroup || 'pending');
  const [pageSize, setPageSize] = useState(5);
  const [page, setPage] = useState(1);
  const [publicText, setPublicText] = useState('');
  const [feedbackMode, setFeedbackMode] = useState<'supplement' | 'terminate'>('supplement');
  const [terminationConfirmOpen, setTerminationConfirmOpen] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState<AdminEvalTaskDetail | null>(null);
  const [pendingDeliver, setPendingDeliver] = useState<{
    id: string;
    name: string;
    size: number;
    file: File;
  } | null>(null);
  const [actionBusy, setActionBusy] = useState(false);

  const load = useCallback(async () => {
    try {
      const evalRows = await fetchAdminEvaluationTasks();
      setRows(evalRows);
    } catch (err) {
      toast.error(errorMessage(err, '任务列表加载失败'));
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void load(); }, [load]);
  useEffect(() => {
    const refresh = () => { void load(); };
    window.addEventListener(ADMIN_REMOTE_EVENT, refresh);
    return () => window.removeEventListener(ADMIN_REMOTE_EVENT, refresh);
  }, [load]);

  const tasks = useMemo(() => rows.map(mapEvalRowToWorkflow), [rows]);
  const rowById = useMemo(() => new Map(rows.map((row) => [row.id, row])), [rows]);
  const productTasks = useMemo(
    () => tasks.filter((task) => product === '全部产品' || canonicalProduct(task.product) === product),
    [tasks, product],
  );
  const filtered = useMemo(() => productTasks.filter((task) => {
    const match = !query.trim() || `${task.id}${task.name}${task.userName}${task.contact}`.toLowerCase().includes(query.trim().toLowerCase());
    const groupMatch = group === 'all' || (group === 'closed' ? TERMINAL.has(task.status) : group === 'waiting' ? task.status === '待用户补充' : task.status === '处理中');
    return match && groupMatch;
  }), [productTasks, query, group]);
  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const visible = filtered.slice((page - 1) * pageSize, page * pageSize);
  const baseCurrent = filtered.find((task) => task.id === selected) || filtered[0] || tasks[0];
  const hasMatches = filtered.length > 0;
  const currentRow = baseCurrent ? rowById.get(baseCurrent.id) : undefined;
  const current = baseCurrent
    ? mergeTaskWithDetail(baseCurrent, selectedDetail, pendingDeliver)
    : undefined;
  const displayStatus = current?.status || currentRow?.status || '处理中';
  const normalizedStatus = normalizeAdminStatus(displayStatus);

  useEffect(() => { setPage(1); }, [query, product, group, pageSize]);
  useEffect(() => { if (page > pages) setPage(pages); }, [page, pages]);
  useEffect(() => {
    if (initialTaskId?.startsWith('group:')) {
      setQuery('');
      setProduct('全部产品');
      setGroup(initialTaskId.slice(6) as TaskGroup);
      setSelected(null);
      return;
    }
    if (initialTaskId) {
      const task = tasks.find((item) => item.id === initialTaskId);
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
    if (filtered.length && !filtered.some((task) => task.id === selected)) setSelected(filtered[0].id);
  }, [filtered, selected]);
  useEffect(() => {
    setPublicText('');
    setFeedbackMode('supplement');
    setTerminationConfirmOpen(false);
    setPendingDeliver(null);
    setSelectedDetail(null);
  }, [baseCurrent?.id]);

  useEffect(() => {
    if (!currentRow?.numericId) return;
    let cancelled = false;
    const masterId = currentRow.numericId;
    void (async () => {
      try {
        const detail = await fetchAdminEvaluationTaskDetail(masterId);
        if (!cancelled) setSelectedDetail(detail);
      } catch (err) {
        if (!cancelled) {
          setSelectedDetail(null);
          toast.error(errorMessage(err, '任务详情加载失败'));
        }
      }
    })();
    return () => { cancelled = true; };
  }, [currentRow?.numericId]);

  const uploadOutputs = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    event.target.value = '';
    if (!current || TERMINAL.has(normalizedStatus)) return;
    if (!files.length) return;
    if (files.length > 1) {
      toast.message('当前交付接口仅支持单个文件，已取第一个');
    }
    const file = files[0];
    setPendingDeliver({
      id: `pending-${Date.now()}`,
      name: file.name,
      size: file.size,
      file,
    });
  };
  const removeOutput = () => {
    setPendingDeliver(null);
  };
  const replaceOutput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    event.target.value = '';
    if (!files.length) return;
    const file = files[0];
    setPendingDeliver({
      id: `pending-${Date.now()}`,
      name: file.name,
      size: file.size,
      file,
    });
  };
  const requestSupplement = async () => {
    if (!current || !currentRow || !publicText.trim()) return toast.error('请填写需要用户补充的内容');
    if (actionBusy) return;
    setActionBusy(true);
    try {
      await adminRequestSupplement(currentRow.numericId, publicText.trim());
      addAdminOperationLog({ operator: 'admin', taskId: current.id, action: '请求用户补件', detail: publicText.trim() });
      notifyAdminRemoteChanged();
      await load();
      const detail = await fetchAdminEvaluationTaskDetail(currentRow.numericId);
      setSelectedDetail(detail);
      setGroup('waiting');
      setPublicText('');
      toast.success('已发送补件要求');
    } catch (err) {
      toast.error(errorMessage(err, '补件状态更新失败'));
    } finally {
      setActionBusy(false);
    }
  };
  const deliver = async () => {
    if (!current || !currentRow) return;
    if (!pendingDeliver) return toast.error('请先上传报告或结果文件');
    if (actionBusy) return;
    setActionBusy(true);
    try {
      await adminDeliverTask(currentRow.numericId, pendingDeliver.file);
      addAdminOperationLog({
        operator: 'admin',
        taskId: current.id,
        action: '确认交付',
        detail: pendingDeliver.name,
      });
      setPendingDeliver(null);
      notifyAdminRemoteChanged();
      await load();
      const detail = await fetchAdminEvaluationTaskDetail(currentRow.numericId);
      setSelectedDetail(detail);
      setGroup('closed');
      toast.success('已确认交付并推送用户');
    } catch (err) {
      toast.error(errorMessage(err, '交付失败'));
    } finally {
      setActionBusy(false);
    }
  };
  const terminate = async () => {
    if (!current || !currentRow) return;
    if (!publicText.trim()) return toast.error('请填写终止原因，以便用户了解处理结果');
    if (actionBusy) return;
    setActionBusy(true);
    try {
      await adminTerminateTask(currentRow.numericId, publicText.trim());
      addAdminOperationLog({ operator: 'admin', taskId: current.id, action: '终止任务', detail: publicText.trim() });
      notifyAdminRemoteChanged();
      await load();
      const detail = await fetchAdminEvaluationTaskDetail(currentRow.numericId);
      setSelectedDetail(detail);
      setGroup('closed');
      setPublicText('');
      setTerminationConfirmOpen(false);
      toast.success('任务已终止');
    } catch (err) {
      toast.error(errorMessage(err, '终止任务失败'));
    } finally {
      setActionBusy(false);
    }
  };
  const submitFeedback = () => {
    if (!current || !publicText.trim()) {
      return toast.error(feedbackMode === 'supplement' ? '请填写需要用户补充的内容' : '请填写终止原因，以便用户了解处理结果');
    }
    if (feedbackMode === 'terminate') {
      setTerminationConfirmOpen(true);
      return;
    }
    void requestSupplement();
  };
  const download = async (file: WorkflowTask['inputs'][number]) => {
    if (!current) return;
    const fileId = Number(file.id);
    if (!Number.isFinite(fileId) || fileId <= 0) {
      toast.error('无法下载该文件');
      return;
    }
    try {
      await downloadSysFile(fileId, file.name);
      addAdminOperationLog({ operator: 'admin', taskId: current.id, action: '下载用户材料', detail: file.name });
    } catch (err) {
      toast.error(errorMessage(err, '下载失败'));
    }
  };
  const downloadAllInputs = () => current?.inputs.forEach((file) => { void download(file); });
  const renderOutputFile = (file: WorkflowTask['outputs'][number]) => (
    <div key={file.id} className="flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-1.5 text-sm text-slate-700">
      <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
      <span className="min-w-0 flex-1 truncate">{file.name}</span>
      <label title="替换文件" className="cursor-pointer rounded p-1 text-blue-600 hover:bg-white">
        <RefreshCw className="h-3.5 w-3.5" />
        <input type="file" className="hidden" onChange={replaceOutput} />
      </label>
      <button type="button" title="删除文件" onClick={removeOutput} className="rounded p-1 text-red-500 hover:bg-white">
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  );
  const outputManager = current && !TERMINAL.has(normalizedStatus) && current.outputs.length ? (
    <section className="rounded-lg border border-blue-200 bg-white p-3">
      <div className="mb-2 text-xs font-bold text-slate-500">已上传交付文件（可替换或删除）</div>
      <div className="space-y-1.5">{current.outputs.map(renderOutputFile)}</div>
    </section>
  ) : null;

  const tabs: { key: TaskGroup; label: string; count: number }[] = [
    { key: 'pending', label: '处理中', count: productTasks.filter((t) => t.status === '处理中').length },
    { key: 'waiting', label: '待用户补充', count: productTasks.filter((t) => t.status === '待用户补充').length },
    { key: 'closed', label: '已结束', count: productTasks.filter((t) => TERMINAL.has(t.status)).length },
    { key: 'all', label: '全部任务', count: productTasks.length },
  ];

  if (loading || !tasks.length) return <div className="rounded-3xl border border-dashed border-blue-200 bg-[linear-gradient(135deg,#fff,#f4f8ff)] px-8 py-24 text-center shadow-sm"><div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50"><FileArchive className="h-7 w-7 text-blue-500" /></div><h3 className="mt-5 font-black text-slate-800">{loading ? '正在加载任务…' : '暂无待处理的用户任务'}</h3><p className="mt-2 text-sm text-slate-400">{loading ? '正在从评测任务接口拉取管理端列表' : '用户从支持“创建任务”的正式产品提交后，会实时出现在这里。'}</p></div>;

  return <div className="overflow-hidden rounded-2xl border border-slate-200 bg-[#F5F7FA] text-sm leading-6 shadow-sm">
    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 bg-white px-6 py-5"><div><h3 className="text-base font-black text-slate-900">任务处理工作台</h3><p className="mt-1 text-sm leading-6 text-slate-500">从任务队列选择记录，在同一工作区完成核验、补件和交付</p></div><span className="text-sm text-slate-500">共 {tasks.length} 个任务</span></div>
    <div className="grid items-stretch 2xl:grid-cols-[360px_minmax(0,1fr)]">
    <section className="flex min-h-0 border-r border-slate-200 bg-slate-100/70 p-3">
      <div className="flex min-h-[680px] w-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="bg-[linear-gradient(145deg,#f8fbff,#eef5ff)] p-4"><div className="relative"><Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-blue-500" /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="搜索任务 ID、用户名" className="h-11 w-full rounded-xl border border-blue-100 bg-white/90 pl-10 pr-3 text-sm shadow-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100" /></div><label className="mt-3 block"><span className="mb-1.5 block text-[11px] font-bold text-slate-500">产品类型</span><select value={product} onChange={e => setProduct(e.target.value)} className="h-10 w-full rounded-xl border border-blue-100 bg-white px-3 text-sm font-semibold text-slate-700 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100">{ADMIN_PRODUCT_OPTIONS.map(item => <option key={item}>{item}</option>)}</select></label><div className="mt-3 grid grid-cols-2 gap-2">{tabs.map(tab => <button key={tab.key} onClick={() => setGroup(tab.key)} className={`rounded-xl px-3 py-2.5 text-xs font-bold transition ${group === tab.key ? 'bg-blue-600 text-white shadow-md shadow-blue-200' : 'bg-white/80 text-slate-500 hover:bg-white hover:text-blue-600'}`}>{tab.label}<span className="ml-1 opacity-70">{tab.count}</span></button>)}</div></div>
        <div className="min-h-0 flex-1 divide-y divide-slate-100 overflow-y-auto border-t border-slate-100 bg-white">{visible.map(task => {
              const detailStatus =
                selectedDetail && task.id === current?.id
                  ? normalizeAdminStatus(selectedDetail.status)
                  : undefined;
              const rawStatus = detailStatus || rowById.get(task.id)?.status || task.status;
              const active = current?.id === task.id;
              return <button key={task.id} onClick={() => setSelected(task.id)} className={`group relative block w-full overflow-hidden border-l-4 px-4 py-4 text-left transition ${active ? 'border-blue-600 bg-[#E6F7FF] shadow-[inset_0_0_0_1px_rgba(37,99,235,.16)]' : 'border-transparent hover:bg-slate-50'}`}><span className={`absolute inset-y-3 left-0 w-1 rounded-r-full ${active ? 'bg-blue-600' : statusBar[rawStatus] || fallbackStatusBar}`} /><div className="flex items-start justify-between gap-3"><span className={`line-clamp-2 pl-1 text-sm font-black ${active ? 'text-blue-950' : 'text-slate-800'}`}>{task.name}</span><span className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold ${statusStyle[rawStatus] || fallbackStatusStyle}`}>{rawStatus}</span></div><div className={`mt-2 pl-1 text-xs ${active ? 'font-semibold text-blue-700' : 'text-slate-500'}`}>{task.userName} · {canonicalProduct(task.product)}</div><div className="mt-2 flex items-center justify-between pl-1"><span className="font-mono text-[10px] text-slate-400">{task.id}</span><span className={`text-[11px] font-bold text-blue-600 transition ${active ? 'opacity-100' : 'translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100'}`}>{active ? '当前任务' : '处理 →'}</span></div></button>;
            })}{!visible.length && <div className="px-6 py-16 text-center"><FileArchive className="mx-auto h-8 w-8 text-slate-300" /><div className="mt-3 text-sm font-bold text-slate-500">没有符合条件的任务</div><div className="mt-1 text-xs text-slate-400">请调整产品、状态或搜索条件</div></div>}</div>
        <div className="flex h-14 shrink-0 items-center justify-between border-t border-slate-200 bg-slate-50 px-4 text-xs text-slate-500"><select value={pageSize} onChange={e => setPageSize(Number(e.target.value))} className="rounded-lg border border-slate-200 bg-white px-2 py-1.5"><option value={5}>5 条/页</option><option value={10}>10 条/页</option><option value={20}>20 条/页</option></select><div className="flex items-center gap-3"><button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="rounded-md p-1 hover:bg-white disabled:opacity-30"><ChevronLeft className="h-4 w-4" /></button><span>{page}/{pages}</span><button disabled={page === pages} onClick={() => setPage(p => p + 1)} className="rounded-md p-1 hover:bg-white disabled:opacity-30"><ChevronRight className="h-4 w-4" /></button></div></div>
      </div>
    </section>

    <section className="min-w-0 bg-[#F5F7FA] p-5">
      {hasMatches && current ? <>
      <header className="relative overflow-hidden rounded-lg border border-blue-200 bg-[#E6F7FF] px-5 py-6 shadow-[0_5px_16px_rgba(37,99,235,.09)] sm:px-7"><span className="absolute inset-y-0 left-0 w-1.5 bg-blue-600" /><div className="break-all font-mono text-[10px] tracking-wider text-blue-400 sm:absolute sm:right-7 sm:top-6 sm:text-xs">TASK {current.id}</div><div className="sm:pr-40"><div className="text-xs font-black tracking-[.16em] text-blue-700">{canonicalProduct(current.product)}</div><h2 className="mt-2 text-xl font-black leading-7 text-blue-950">{current.name}</h2><p className="mt-2 text-sm leading-6 text-blue-700/70">被测对象：{current.model}</p></div><div className="mt-5 flex flex-wrap items-center gap-3"><span className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-black ${statusStyle[displayStatus] || fallbackStatusStyle}`}><span className={`h-2 w-2 rounded-full ${statusBar[displayStatus] || fallbackStatusBar}`} />{displayStatus}</span></div>
      </header>

      <div className="mt-5 grid items-stretch gap-5 xl:grid-cols-[minmax(0,1.3fr)_minmax(340px,.7fr)]">
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_5px_18px_rgba(15,23,42,.05)]">
          <section className="border-b border-slate-200 p-5"><div className="mb-4 flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white"><ShieldCheck className="h-4 w-4" /></span><div><h3 className="text-base font-black text-slate-900">任务概况</h3><p className="text-sm leading-6 text-slate-500">用户、诉求与提交配置</p></div></div><div className="grid gap-3 lg:grid-cols-2"><div className="rounded-lg border border-slate-100 bg-[#FAFAFA] p-4"><span className="text-sm font-bold text-slate-500">提交用户</span><b className="mt-2 block text-lg font-black leading-7 text-blue-700">{current.userName}</b><span className="mt-1 flex items-center gap-1.5 text-sm leading-6 text-slate-600"><Mail className="h-4 w-4 text-blue-500" />{current.contact}</span></div><div className="rounded-lg border border-slate-100 bg-[#FAFAFA] p-4"><span className="text-sm font-bold text-slate-500">评测诉求</span><p className="mt-2 text-sm font-semibold leading-6 text-slate-700">{current.requirement}</p></div></div>{current.configSummary && <div className="mt-3 rounded-lg border border-blue-100 bg-blue-50/50 px-4 py-3 text-sm leading-6 text-slate-600">配置摘要：{current.configSummary}</div>}</section>

          <section className="border-b border-slate-200 p-5"><div className="flex items-start justify-between gap-4"><div><h3 className="text-base font-black text-slate-900">用户提交材料</h3><p className="mt-1 text-sm leading-6 text-slate-500">下载后转入内部服务器执行正式评测</p></div><span className="shrink-0 text-lg font-black text-blue-600">{current.inputs.length} <small className="text-sm font-bold">个文件</small></span></div>{current.inputs.length ? <div className="mt-3 flex items-center gap-4"><div className="grid min-w-0 flex-1 gap-3 sm:grid-cols-2">{current.inputs.map(file => <div key={file.id} className="flex items-center gap-3 rounded-lg border border-slate-200 bg-[#FAFAFA] p-4 transition hover:border-blue-300"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-blue-50"><FileArchive className="h-5 w-5 text-blue-600" /></span><span className="min-w-0 flex-1"><b className="block truncate text-sm leading-6 text-slate-700">{file.name}</b><span className="mt-1 block text-sm text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</span></span></div>)}</div><button onClick={downloadAllInputs} className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-xs font-bold text-blue-700 transition hover:border-blue-600 hover:bg-blue-600 hover:text-white"><Download className="h-3.5 w-3.5" />{current.inputs.length > 1 ? '下载全部' : '下载文件'}</button></div> : <div className="mt-3 rounded-lg border border-dashed border-slate-200 bg-[#FAFAFA] p-7 text-center text-sm leading-6 text-slate-500">该任务使用模型 API 配置，无本地上传文件</div>}</section>

          <section className="p-5"><div className="flex items-center gap-2"><History className="h-5 w-5 text-blue-500" /><h3 className="text-base font-black text-slate-900">用户沟通记录</h3></div>{current.communications?.length ? <div className="relative mt-4 space-y-3 pl-5 before:absolute before:bottom-2 before:left-[6px] before:top-2 before:w-px before:bg-slate-200">{current.communications.slice().reverse().map(item => <div key={item.id} className="relative rounded-lg border border-slate-100 bg-[#FAFAFA] px-4 py-3 before:absolute before:-left-[18px] before:top-5 before:h-2.5 before:w-2.5 before:rounded-full before:bg-blue-500 before:ring-4 before:ring-white"><div className="flex justify-between gap-3"><b className="text-sm leading-6 text-slate-700">{item.type} · {item.sender === 'admin' ? '管理员' : item.sender === 'user' ? '用户' : '系统'}</b><span className="text-xs leading-6 text-slate-500">{item.createdAt}</span></div><p className="mt-1.5 text-sm leading-6 text-slate-600">{item.content}</p></div>)}</div> : <div className="mt-4 rounded-lg bg-[#FAFAFA] py-8 text-center text-sm leading-6 text-slate-500">暂无沟通记录</div>}</section>
        </div>

        <aside className="flex h-full flex-col gap-3 rounded-xl border border-blue-300 bg-[#EEF6FF] p-4 shadow-[0_10px_28px_rgba(37,99,235,.13)] xl:sticky xl:top-[88px] xl:self-start">
          <h3 className="text-lg font-black leading-7 text-slate-950">管理员操作台</h3>{outputManager}
          {TERMINAL.has(normalizedStatus) ? <div className={`rounded-2xl border p-5 ${normalizedStatus === '已交付' ? 'border-emerald-200 bg-emerald-50' : 'border-slate-200 bg-white'}`}><div className="flex items-center gap-3">{normalizedStatus === '已交付' ? <CheckCircle2 className="h-6 w-6 text-emerald-600" /> : <XCircle className="h-6 w-6 text-slate-500" />}<div><h4 className="text-sm font-black text-slate-800">任务流程已结束</h4><p className="mt-1 text-xs leading-5 text-slate-500">当前状态为“{displayStatus}”，补件、上传、交付和终止操作均已锁定。</p></div></div></div> : <>
          <section className="rounded-lg border border-orange-200 bg-white p-4">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500 text-white"><MessageSquareWarning className="h-4 w-4" /></span>
              <div>
                <h4 className="text-base font-black text-slate-900">返回意见</h4>
                <p className="text-xs leading-5 text-orange-700">先选择处理结果，再填写用户可见说明</p>
              </div>
            </div>
            <label className="mt-3 block">
              <span className="mb-1.5 block text-xs font-bold text-slate-500">处理结果</span>
              <select
                value={feedbackMode}
                onChange={(e) => setFeedbackMode(e.target.value as 'supplement' | 'terminate')}
                className="h-9 w-full rounded-lg border border-orange-100 bg-white px-2 text-sm"
              >
                <option value="supplement">请求用户补件</option>
                <option value="terminate">终止任务</option>
              </select>
            </label>
            <label className="mt-3 block">
              <span className="mb-1.5 block text-xs font-bold text-slate-500">意见说明</span>
              <textarea
                value={publicText}
                onChange={e => setPublicText(e.target.value)}
                className="min-h-20 w-full resize-y rounded-lg border border-orange-100 bg-white p-3 text-sm leading-5 outline-none focus:border-orange-400"
                placeholder={feedbackMode === 'terminate' ? '填写终止原因，例如：材料长期缺失，任务无法继续' : '例如：请重新提交 XXXX 文件'}
              />
            </label>
            <button
              type="button"
              onClick={submitFeedback}
              disabled={actionBusy || (feedbackMode === 'terminate' && normalizedStatus === '已终止')}
              className={`mt-3 w-full rounded-lg px-4 py-2.5 text-sm font-black text-white shadow-md transition disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none ${feedbackMode === 'supplement' ? 'bg-orange-500 shadow-orange-200 hover:bg-orange-600' : 'bg-red-600 shadow-red-200 hover:bg-red-700'}`}
            >
              {feedbackMode === 'terminate' ? (normalizedStatus === '已终止' ? '任务已终止' : '继续终止任务') : '发送补件要求'}
            </button>
          </section>

          <section className="overflow-hidden rounded-lg border border-blue-200 bg-white shadow-sm"><div className="p-4"><div className="flex items-center gap-3"><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-700"><Send className="h-4 w-4" /></span><div><h4 className="text-base font-black text-slate-900">正常交付</h4><p className="text-xs leading-5 text-slate-500">上传文件并正式推送给用户</p></div></div><label className="mt-3 flex min-h-16 cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-blue-200 bg-blue-50/60 text-sm font-bold text-blue-700 transition hover:border-blue-500 hover:bg-blue-50"><FileUp className="h-4 w-4" />上传报告／结果文件<input type="file" multiple className="hidden" onChange={uploadOutputs} /></label>{(pendingDeliver || current.outputs.length > 0) && <div className="mt-2 max-h-24 space-y-1.5 overflow-y-auto">{pendingDeliver ? renderOutputFile({ id: pendingDeliver.id, name: pendingDeliver.name, size: pendingDeliver.size, category: 'report', type: '', uploadedAt: '' }) : current.outputs.map(file => <div key={file.id} className="flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-1.5 text-sm text-slate-700"><CheckCircle2 className="h-4 w-4 text-emerald-600" /><span className="truncate">{file.name}</span></div>)}</div>}<button onClick={() => { void deliver(); }} disabled={actionBusy || normalizedStatus === '已交付' || !pendingDeliver} className="mt-2 w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-black text-white shadow-sm hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400">{normalizedStatus === '已交付' ? '已完成交付' : pendingDeliver ? '确认交付并推送用户' : '请先上传交付文件'}</button></div>{current.pushedAt && <div className="border-t border-blue-100 bg-blue-50/60 px-4 py-2 text-xs leading-5 text-blue-700">最近交付：{current.pushedAt} · v{current.outputVersion || 1}</div>}</section>
          </>}
          {terminationConfirmOpen && <Modal title="确认终止任务" onClose={() => setTerminationConfirmOpen(false)}><div className="rounded-2xl border border-red-100 bg-red-50 p-4"><div className="flex items-start gap-3"><AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" /><div><p className="text-sm font-black text-red-900">终止后任务将立即归入“已结束”并通知用户</p><p className="mt-2 text-xs leading-6 text-red-700">用户可见说明：{publicText}</p></div></div></div><div className="mt-5 flex gap-3"><button type="button" onClick={() => setTerminationConfirmOpen(false)} className="h-11 flex-1 rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-600">取消</button><button type="button" onClick={() => { void terminate(); }} className="h-11 flex-1 rounded-xl bg-red-600 text-sm font-black text-white hover:bg-red-700">确认终止并通知用户</button></div></Modal>}
        </aside>
      </div>
      </> : <div className="flex min-h-[680px] items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white/70 px-8 text-center"><div><FileArchive className="mx-auto h-12 w-12 text-slate-300" /><h3 className="mt-4 text-base font-black text-slate-700">没有符合条件的任务</h3><p className="mt-2 text-sm text-slate-500">请在左侧调整产品类型、任务状态或搜索关键词。</p></div></div>}
    </section>
    </div>
  </div>;
}

export function AdminOperationLogPanel() {
  const logs = useAdminLogs();
  const [query, setQuery] = useState('');
  const filtered = logs.filter(log => !query.trim() || `${log.action}${log.taskId}${log.operator}${log.detail}`.toLowerCase().includes(query.trim().toLowerCase()));
  const exportCsv = () => {
    const escape = (value: unknown) => `"${String(value ?? '').replace(/"/g, '""')}"`;
    const csv = ['操作,任务ID,操作人,详情,时间', ...filtered.map(log => [log.action, log.taskId || '', log.operator, log.detail || '', log.createdAt].map(escape).join(','))].join('\n');
    const anchor = document.createElement('a'); anchor.href = URL.createObjectURL(new Blob(['\ufeff', csv], { type: 'text/csv;charset=utf-8' })); anchor.download = `玄鉴管理员操作日志-${new Date().toISOString().slice(0, 10)}.csv`; anchor.click(); URL.revokeObjectURL(anchor.href);
    addAdminOperationLog({ operator: 'admin', action: '导出操作日志', detail: `${filtered.length} 条` });
  };
  return <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="flex flex-wrap items-center justify-between gap-3 border-b px-6 py-5"><div><h3 className="flex items-center gap-2 font-black text-slate-900"><History className="h-4 w-4 text-blue-500" />操作日志</h3><p className="mt-1 text-xs text-slate-400">追踪任务、账号、下载、交付与通知操作</p></div><div className="flex gap-2"><div className="relative"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="搜索操作或任务 ID" className="h-9 w-60 rounded-lg border pl-9 pr-3 text-xs" /></div><button onClick={exportCsv} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white"><Download className="h-4 w-4" />导出 CSV</button></div></div>{filtered.length ? <div className="divide-y">{filtered.map(log => <div key={log.id} className="grid gap-2 px-6 py-4 text-sm md:grid-cols-[170px_150px_1fr_210px]"><span className="font-semibold text-slate-700">{log.action}</span><span className="font-mono text-xs text-blue-600">{log.taskId || '平台用户'}</span><span className="text-slate-500">{log.detail || '—'}</span><span className="text-xs text-slate-400">{log.operator} · {log.createdAt}</span></div>)}</div> : <div className="px-6 py-16 text-center text-sm text-slate-400"><AlertTriangle className="mx-auto mb-3 h-8 w-8 text-slate-300" />暂无匹配的操作记录</div>}</section>;
}

function InfoCard({ label, title, body, icon: Icon }: { label: string; title: string; body: string; icon: React.ElementType }) {
  return <div className="rounded-xl bg-slate-50 p-4"><div className="flex items-center gap-2 text-xs font-bold text-slate-400"><Icon className="h-4 w-4 text-blue-500" />{label}</div><div className="mt-2 font-bold leading-6 text-slate-800">{title}</div><div className="mt-1 text-sm leading-6 text-slate-500">{body}</div></div>;
}

function Modal({ title, onClose, children, wide = false }: { title: string; onClose: () => void; children: React.ReactNode; wide?: boolean }) {
  return <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/45 p-5 backdrop-blur-sm"><div className={`max-h-[84vh] w-full overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl ${wide ? 'max-w-2xl' : 'max-w-md'}`}><div className="mb-5 flex items-center justify-between"><h3 className="text-lg font-black text-slate-900">{title}</h3><button onClick={onClose} className="text-slate-400"><XCircle className="h-5 w-5" /></button></div>{children}</div></div>;
}
