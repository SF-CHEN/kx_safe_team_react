import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { toast } from 'sonner';
import {
  Activity, Bell, ChartNoAxesCombined, ChevronRight, ClipboardCheck, ClipboardList,
  FileCheck2, History, KeyRound, Layers, LogOut, Mail, Search, User, Users, X,
} from 'lucide-react';
import { fetchAdminEvaluationTasks } from '@/api/evaluation';
import { fetchOperationalOverview } from '@/api/overview';
import type { OverviewVo } from '@/api/types';
import {
  ADMIN_REMOTE_EVENT,
  AdminOperationLogPanel, AdminWorkflowWorkbench, RegisteredUserPanel,
  mapEvalRowToWorkflow, type TaskGroup,
} from '../components/AdminWorkflowWorkbench';
import { AdminFieldDictPanel } from '../components/AdminFieldDictPanel';
import { AuthBrandPanel } from '../components/AuthBrandPanel';
import { useUser } from '../context/UserContext';
import {
  TERMINAL_WORKFLOW_STATUSES,
  type WorkflowTask,
} from '../data/workflowStore';

type AdminSection = 'overview' | 'users' | 'fields' | 'tasks' | 'logs';

const ADMIN_SECTIONS: AdminSection[] = ['overview', 'users', 'fields', 'tasks', 'logs'];
const TERMINAL = new Set(TERMINAL_WORKFLOW_STATUSES);

function parseAdminSection(value?: string): AdminSection {
  if (value && ADMIN_SECTIONS.includes(value as AdminSection)) {
    return value as AdminSection;
  }
  return 'overview';
}

function useAdminData(enabled: boolean) {
  const [tasks, setTasks] = useState<WorkflowTask[]>([]);
  const [overview, setOverview] = useState<OverviewVo | null>(null);

  const load = useCallback(async () => {
    if (!enabled) return;
    try {
      const [evalRows, overviewData] = await Promise.all([
        // 运营总览「最近任务」只需少量明细，不拉 200
        fetchAdminEvaluationTasks({ pageSize: 10, pageCurrent: 1 }),
        fetchOperationalOverview(),
      ]);
      setTasks(evalRows.map(mapEvalRowToWorkflow));
      setOverview(overviewData);
    } catch (err) {
      toast.error(err instanceof Error && err.message.trim() ? err.message : '管理后台数据加载失败');
      setTasks([]);
      setOverview(null);
    }
  }, [enabled]);

  useEffect(() => { void load(); }, [load]);
  useEffect(() => {
    const refreshRemote = () => { void load(); };
    window.addEventListener(ADMIN_REMOTE_EVENT, refreshRemote);
    return () => window.removeEventListener(ADMIN_REMOTE_EVENT, refreshRemote);
  }, [load]);

  return { tasks, overview };
}

function AdminLogin() {
  const navigate = useNavigate();
  const { login, clearSession } = useUser();
  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      const next = await login(account.trim(), password, true);
      if (next.role !== 'admin') {
        clearSession();
        setError('该账号不是管理员，无法进入管理后台，请使用管理员账号登录');
        return;
      }
    } catch {
      setError('管理员账号或密码错误');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_18%_10%,rgba(37,99,235,.10),transparent_28rem),linear-gradient(180deg,#f8fbff,#eef3f8)]">
      <header className="h-[72px] border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-full max-w-[1180px] items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-4">
            <img src="/rongsu-logo.png" alt="榕数科技" className="h-10 w-auto" />
            <span className="border-l border-slate-200 pl-4 text-base font-bold text-slate-800">玄鉴管理后台</span>
          </Link>
          <div className="flex gap-7 text-sm text-slate-500">
            <Link to="/" className="hover:text-blue-600">返回门户首页</Link>
            <Link to="/login" className="hover:text-blue-600">普通用户登录</Link>
          </div>
        </div>
      </header>
      <main className="mx-auto grid max-w-[1180px] overflow-hidden border border-white/80 bg-white shadow-[0_28px_80px_rgba(15,23,42,0.12)] lg:my-14 lg:grid-cols-[1.08fr_.72fr] lg:rounded-3xl">
        <AuthBrandPanel mode="admin" />
        <div className="flex min-h-[620px] items-center px-7 py-12 sm:px-12 lg:px-14">
          <div className="w-full">
            <div className="text-xs font-black tracking-[.18em] text-blue-600">XUANJIAN ADMIN</div>
            <h1 className="mt-3 text-3xl font-black text-slate-950">管理员登录</h1>
            <p className="mt-2 text-sm text-slate-500">仅限榕数科技内部授权人员访问</p>
            <div className="mt-8 border-b border-slate-200 pb-3">
              <span className="relative text-sm font-black text-blue-700">
                账号密码登录
                <span className="absolute -bottom-[13px] left-0 right-0 h-0.5 bg-blue-600" />
              </span>
            </div>
            <form onSubmit={(e) => void submit(e)} className="mt-7 space-y-4">
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={account}
                  onChange={(e) => {
                    setAccount(e.target.value);
                    setError('');
                  }}
                  placeholder="管理员账号"
                  className="h-12 w-full rounded-xl border border-slate-200 pl-11 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>
              <div className="relative">
                <KeyRound className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  placeholder="登录密码"
                  className="h-12 w-full rounded-xl border border-slate-200 pl-11 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>
              {error && (
                <p className="rounded-xl bg-red-50 px-4 py-3 text-xs text-red-600">{error}</p>
              )}
              <button
                type="submit"
                disabled={loading}
                className="h-12 w-full rounded-xl bg-blue-600 text-sm font-black text-white shadow-lg shadow-blue-200 hover:bg-blue-700 disabled:opacity-60"
              >
                {loading ? '登录中…' : '安全登录'}
              </button>
            </form>
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="mt-7 text-xs font-semibold text-slate-500 hover:text-blue-600"
            >
              ← 返回普通用户登录
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

function Sidebar({
  active,
  onChange,
  userCount,
  pendingTaskCount,
  adminLabel,
}: {
  active: AdminSection;
  onChange: (section: AdminSection) => void;
  userCount: number;
  pendingTaskCount: number;
  adminLabel: string;
}) {
  const items = [
    { key: 'overview' as const, label: '运营总览', icon: ChartNoAxesCombined, badge: 0 },
    { key: 'users' as const, label: '用户管理', icon: Users, badge: userCount },
    { key: 'fields' as const, label: '字段管理', icon: Layers, badge: 0 },
    { key: 'tasks' as const, label: '任务运维', icon: Activity, badge: pendingTaskCount },
    { key: 'logs' as const, label: '操作日志', icon: History, badge: 0 },
  ];

  return (
    <aside className="fixed inset-y-0 left-0 z-20 flex w-[252px] flex-col border-r border-slate-200 bg-white">
      <div className="border-b px-5 py-5">
        <div className="flex items-center gap-3">
          <img src="/rongsu-logo.png" alt="榕数科技" className="h-9 w-auto max-w-[118px] object-contain" />
          <div className="border-l pl-3">
            <div className="text-sm font-black text-slate-900">玄鉴管理后台</div>
            <div className="mt-0.5 text-[10px] tracking-widest text-slate-400">ADMIN CONSOLE</div>
          </div>
        </div>
      </div>
      <nav className="p-3">
        <div className="px-3 pb-2 pt-3 text-[11px] font-bold tracking-widest text-slate-400">工作台</div>
        {items.map((item) => {
          const Icon = item.icon;
          const selected = active === item.key;
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => onChange(item.key)}
              className={`mb-1 flex w-full items-center gap-3 rounded-xl px-4 py-3.5 text-left text-sm font-semibold transition ${
                selected
                  ? 'bg-[linear-gradient(90deg,#eaf3ff,#f7faff)] text-blue-700 shadow-sm ring-1 ring-blue-100'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span className="flex-1">{item.label}</span>
              {item.badge > 0 && (
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                    item.key === 'tasks' ? 'bg-red-500 text-white' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>
      <div className="mx-4 mt-3 border-t border-slate-100 pt-4">
        <button
          type="button"
          onClick={() => onChange('tasks')}
          className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs text-slate-500 transition hover:bg-slate-50 hover:text-blue-700"
        >
          <span>进行中任务</span>
          <b className="rounded-md bg-slate-100 px-2 py-1 text-slate-700">{pendingTaskCount}</b>
        </button>
      </div>
      <div className="flex-1" />
      <div className="border-t p-4">
        <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600">
            <User className="h-4 w-4 text-white" />
          </div>
          <div className="min-w-0">
            <div className="truncate text-sm font-bold text-slate-800">超级管理员</div>
            <div className="truncate text-xs text-slate-400">{adminLabel}</div>
          </div>
        </div>
      </div>
    </aside>
  );
}

function Sparkline({ values, color }: { values: number[]; color: string }) {
  const max = Math.max(...values, 1);
  return (
    <div className="flex h-8 items-end gap-1">
      {values.map((value, index) => (
        <span
          key={index}
          className={`w-2 rounded-t ${color}`}
          style={{ height: `${Math.max(18, (value / max) * 100)}%`, opacity: 0.35 + index * 0.08 }}
        />
      ))}
    </div>
  );
}

function AdminOverview({
  tasks,
  overview,
  onOpenTask,
}: {
  tasks: WorkflowTask[];
  overview: OverviewVo | null;
  onOpenTask: (id?: string, group?: TaskGroup) => void;
}) {
  const days = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(Date.now() - (6 - index) * 86400000);
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  });
  const key = (value: string) => {
    const date = new Date(value.replace(/\//g, '-'));
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  };
  const daily = (values: string[]) => days.map((day) => values.filter((value) => key(value) === day).length);
  const pending = tasks.filter((task) => !TERMINAL.has(task.status));
  const processingFromList = tasks.filter((t) => t.status === '处理中').length;
  const deliveredFromList = tasks.filter((task) => task.status === '已交付').length;
  const weeklyDeliveredFromList = daily(
    tasks.filter((t) => t.pushedAt).map((t) => t.pushedAt!),
  ).reduce((a, b) => a + b, 0);

  const totalUsers = overview?.totalUserCount ?? 0;
  const weeklyNewUsers = overview?.weeklyNewUserCount ?? 0;
  const processingTasks = overview?.processingTaskCount ?? pending.length;
  const inProcessingTasks = overview?.inProcessingTaskCount ?? processingFromList;
  // 无「活跃用户」字段：用近 7 天新增任务数展示（见对接纪要 Q1）
  const recent7DaysNewTasks = overview?.recent7DaysNewTaskCount;
  const totalDelivered = overview?.totalDeliveredCount ?? deliveredFromList;
  const weeklyDelivered = overview?.weeklyDeliveredCount ?? weeklyDeliveredFromList;

  const cards = [
    {
      label: '平台注册用户',
      value: totalUsers,
      note: `本周新增 ${weeklyNewUsers} 位`,
      icon: Users,
      iconTone: 'bg-blue-100 text-blue-700',
      // 侧栏已停拉用户 page；无按日序列时 sparkline 置空
      bars: days.map(() => 0),
      bar: 'bg-blue-500',
    },
    {
      label: '进行中任务',
      value: processingTasks,
      note: `其中 ${inProcessingTasks} 项处理中`,
      icon: ClipboardCheck,
      iconTone: 'bg-violet-100 text-violet-700',
      bars: daily(tasks.map((t) => t.createdAt)),
      bar: 'bg-violet-500',
    },
    {
      label: '近 7 天新增任务',
      value: recent7DaysNewTasks ?? daily(tasks.map((t) => t.createdAt)).reduce((a, b) => a + b, 0),
      note: '评测任务总表近 7 日新增',
      icon: Activity,
      iconTone: 'bg-cyan-100 text-cyan-700',
      bars: daily(tasks.map((t) => t.createdAt)),
      bar: 'bg-cyan-500',
    },
    {
      label: '累计完成交付',
      value: totalDelivered,
      note: `本周交付 ${weeklyDelivered} 项`,
      icon: FileCheck2,
      iconTone: 'bg-emerald-100 text-emerald-700',
      bars: daily(tasks.filter((t) => t.pushedAt).map((t) => t.pushedAt!)),
      bar: 'bg-emerald-500',
    },
  ];
  const rowColor = (task: WorkflowTask) =>
    (task.status === '待用户补充'
      ? 'bg-orange-500'
      : task.status === '已交付'
        ? 'bg-emerald-500'
        : task.status === '已终止'
          ? 'bg-slate-400'
          : 'bg-blue-500');
  const awaitSupplementFromOverview =
    overview?.processingTaskCount != null && overview?.inProcessingTaskCount != null
      ? Math.max(0, overview.processingTaskCount - overview.inProcessingTaskCount)
      : null;
  const queue = [
    {
      label: '处理中',
      count: overview?.inProcessingTaskCount ?? tasks.filter((task) => task.status === '处理中').length,
      tone: 'text-blue-700 bg-blue-50',
      group: 'pending' as TaskGroup,
    },
    {
      label: '待用户补充',
      count:
        awaitSupplementFromOverview ??
        tasks.filter((task) => task.status === '待用户补充').length,
      tone: 'text-orange-700 bg-orange-50',
      group: 'waiting' as TaskGroup,
    },
    {
      label: '已交付',
      count: tasks.filter((task) => task.status === '已交付').length,
      tone: 'text-emerald-700 bg-emerald-50',
      group: 'closed' as TaskGroup,
    },
    {
      label: '已终止',
      count: tasks.filter((task) => task.status === '已终止').length,
      tone: 'text-slate-600 bg-slate-100',
      group: 'closed' as TaskGroup,
    },
  ];

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${card.iconTone}`}>
                  <Icon className="h-5 w-5" />
                </span>
                <Sparkline values={card.bars} color={card.bar} />
              </div>
              <div className="mt-5">
                <b className="text-3xl font-black text-slate-950">{card.value}</b>
                <h3 className="mt-1 text-sm font-bold text-slate-700">{card.label}</h3>
              </div>
              <p className="mt-3 text-xs font-semibold text-slate-400">{card.note}</p>
            </div>
          );
        })}
      </div>

      <section className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b px-6 py-5">
          <div>
            <h3 className="font-black text-slate-900">任务状态概览</h3>
            <p className="mt-1 text-xs text-slate-400">按统一任务状态快速进入运维列表</p>
          </div>
          <button type="button" onClick={() => onOpenTask()} className="text-xs font-bold text-blue-600">
            进入任务运维 →
          </button>
        </div>
        <div className="grid divide-y sm:grid-cols-2 sm:divide-x sm:divide-y-0 xl:grid-cols-4">
          {queue.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => onOpenTask(undefined, item.group)}
              className="flex items-center justify-between px-6 py-4 text-left transition hover:bg-slate-50"
            >
              <span className="text-sm font-semibold text-slate-700">{item.label}</span>
              <span className={`rounded-lg px-3 py-1.5 text-sm font-black ${item.tone}`}>{item.count}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b px-6 py-5">
          <div>
            <h3 className="font-black text-slate-900">最近任务</h3>
            <p className="mt-1 text-xs text-slate-400">查看最新提交并直接进入处理工作区</p>
          </div>
          <button type="button" onClick={() => onOpenTask()} className="text-xs font-bold text-blue-600">
            全部任务 →
          </button>
        </div>
        <div>
          {tasks.slice(0, 8).map((task) => (
            <div
              key={task.id}
              className="group relative flex flex-wrap items-center gap-4 border-b px-6 py-4 last:border-0 hover:bg-blue-50/40"
            >
              <span className={`absolute inset-y-3 left-0 w-1 rounded-r ${rowColor(task)}`} />
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                  TERMINAL.has(task.status) ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'
                }`}
              >
                <ClipboardCheck className="h-4 w-4" />
              </span>
              <div className="min-w-[180px] flex-1">
                <b className="block truncate text-sm text-slate-800">{task.name}</b>
                <span className="mt-1 block text-xs text-slate-400">
                  {task.userName} · {task.product}
                </span>
              </div>
              <span className="font-mono text-xs text-slate-400">{task.id}</span>
              <span className="rounded-full px-2.5 py-1 text-xs font-bold text-slate-600">{task.status}</span>
              <button
                type="button"
                onClick={() => onOpenTask(task.id)}
                className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-blue-600 opacity-0 transition group-hover:opacity-100"
              >
                处理
              </button>
            </div>
          ))}
          {!tasks.length && <div className="py-16 text-center text-sm text-slate-400">暂无任务数据</div>}
        </div>
      </section>
    </>
  );
}

function GlobalSearch({
  tasks,
  onTask,
}: {
  tasks: WorkflowTask[];
  onTask: (id: string) => void;
}) {
  const [query, setQuery] = useState('');
  const matches = query.trim()
    ? {
        tasks: tasks
          .filter((t) => `${t.id}${t.name}${t.userName}`.toLowerCase().includes(query.toLowerCase()))
          .slice(0, 5),
      }
    : { tasks: [] };

  return (
    <div className="relative">
      <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-blue-500" />
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="搜索最近任务 ID 或名称"
        className="h-11 w-[380px] rounded-xl border border-blue-100 bg-[#f3f7fc] pl-10 pr-4 text-sm shadow-inner outline-none focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50"
      />
      {query && (
        <div className="absolute left-0 top-13 z-50 w-[430px] overflow-hidden rounded-2xl border bg-white shadow-2xl">
          <div className="bg-slate-50 px-4 py-2 text-[10px] font-bold tracking-widest text-slate-400">任务</div>
          {matches.tasks.map((task) => (
            <button
              key={task.id}
              type="button"
              onClick={() => {
                onTask(task.id);
                setQuery('');
              }}
              className="flex w-full justify-between px-4 py-3 text-left hover:bg-blue-50"
            >
              <span>
                <b className="block text-sm text-slate-700">{task.name}</b>
                <small className="text-slate-400">
                  {task.id} · {task.userName}
                </small>
              </span>
              <span className="text-xs font-bold text-blue-600">{task.status}</span>
            </button>
          ))}
          {!matches.tasks.length && (
            <div className="py-8 text-center text-sm text-slate-400">未找到匹配结果</div>
          )}
        </div>
      )}
    </div>
  );
}

function AdminNoticePanel({
  tasks,
  onClose,
  onOpenTask,
}: {
  tasks: WorkflowTask[];
  onClose: () => void;
  onOpenTask: (id?: string) => void;
}) {
  return (
    <div className="absolute right-0 top-12 z-50 w-[380px] overflow-hidden rounded-2xl border bg-white shadow-2xl">
      <div className="flex items-center justify-between border-b px-5 py-4">
        <div>
          <b className="text-sm text-slate-900">待办提醒</b>
          <p className="mt-1 text-xs text-slate-400">尚未结束的任务</p>
        </div>
        <button type="button" onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100">
          <X className="h-4 w-4" />
        </button>
      </div>
      {tasks.length ? (
        <div className="max-h-[360px] divide-y overflow-y-auto">
          {tasks.slice(0, 8).map((task) => (
            <button
              key={task.id}
              type="button"
              onClick={() => onOpenTask(task.id)}
              className="block w-full px-5 py-4 text-left hover:bg-blue-50"
            >
              <div className="flex justify-between gap-3">
                <b className="truncate text-sm text-slate-700">{task.name}</b>
                <span className="shrink-0 text-xs font-bold text-blue-600">{task.status}</span>
              </div>
              <p className="mt-1 text-xs text-slate-400">
                {task.userName} · {task.id}
              </p>
            </button>
          ))}
        </div>
      ) : (
        <div className="px-6 py-10 text-center">
          <ClipboardList className="mx-auto h-8 w-8 text-slate-300" />
          <p className="mt-3 text-sm text-slate-500">暂无待办任务</p>
        </div>
      )}
    </div>
  );
}

export function AdminDashboard() {
  const navigate = useNavigate();
  const { section: sectionParam } = useParams<{ section?: string }>();
  const { user, isAdmin, sessionReady, logout } = useUser();
  const section = parseAdminSection(sectionParam);
  const [noticeOpen, setNoticeOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string>();
  const [selectedTaskGroup, setSelectedTaskGroup] = useState<TaskGroup>();
  const [selectedUserId, setSelectedUserId] = useState<string>();
  const data = useAdminData(sessionReady && isAdmin);
  const pendingTasks = useMemo(
    () => data.tasks.filter((task) => !TERMINAL.has(task.status)),
    [data.tasks],
  );
  const userCount = data.overview?.totalUserCount ?? 0;
  const pendingCount = data.overview?.processingTaskCount ?? 0;

  const setSection = (next: AdminSection) => {
    navigate(`/admin/${next}`, { replace: false });
  };

  const openTask = (id?: string, group?: TaskGroup) => {
    setSelectedTaskId(id);
    setSelectedTaskGroup(group);
    setNoticeOpen(false);
    setSection('tasks');
  };

  useEffect(() => {
    localStorage.removeItem('xj_admin_token');
  }, []);

  useEffect(() => {
    if (!sessionReady || !isAdmin) return;
    if (!sectionParam || !ADMIN_SECTIONS.includes(sectionParam as AdminSection)) {
      navigate(`/admin/${section}`, { replace: true });
    }
  }, [isAdmin, navigate, section, sectionParam, sessionReady]);

  if (!sessionReady) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_18%_10%,rgba(37,99,235,.10),transparent_28rem),linear-gradient(180deg,#f8fbff,#eef3f8)] text-sm text-slate-500">
        加载中…
      </div>
    );
  }

  if (!isAdmin) return <AdminLogin />;

  const titles = {
    overview: ['运营总览', '掌握用户、任务与交付的实时运行情况'],
    users: ['用户管理', '查看用户资料、活跃情况、账号状态与历史任务'],
    fields: ['字段管理', '维护评测维度与预设场景，供前台创建任务时选用'],
    tasks: ['任务运维', '受理任务、请求补件、上传结果并完成交付'],
    logs: ['操作日志', '审计管理员执行的关键业务操作'],
  } as const;
  const [title, subtitle] = titles[section];
  const adminLabel = user.username || user.email || user.name || 'admin';

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_85%_0%,rgba(219,234,254,.6),transparent_28rem),#f3f6fb]">
      <Sidebar
        active={section}
        onChange={setSection}
        userCount={userCount}
        pendingTaskCount={pendingCount}
        adminLabel={adminLabel}
      />
      <main className="ml-[252px] min-h-screen">
        <header className="sticky top-0 z-30 flex h-[72px] items-center justify-between border-b border-slate-200 bg-white px-8">
          <GlobalSearch
            tasks={data.tasks}
            onTask={openTask}
          />
          <div className="flex items-center gap-3">
            <div className="relative">
              <button
                type="button"
                onClick={() => setNoticeOpen((open) => !open)}
                className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm hover:border-blue-200 hover:text-blue-600"
              >
                <Bell className="h-4 w-4" />
                {pendingCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-black text-white">
                    {pendingCount}
                  </span>
                )}
              </button>
              {noticeOpen && (
                <AdminNoticePanel
                  tasks={pendingTasks}
                  onClose={() => setNoticeOpen(false)}
                  onOpenTask={openTask}
                />
              )}
            </div>
            <button
              type="button"
              onClick={() => {
                void logout();
              }}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-600 shadow-sm hover:border-red-200 hover:text-red-600"
            >
              <LogOut className="h-4 w-4" />
              退出登录
            </button>
          </div>
        </header>

        <div className="p-8">
          <div className="mb-6">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              玄鉴后台
              <ChevronRight className="h-3 w-3" />
              {title}
            </div>
            <h1 className="mt-2 text-3xl font-black text-slate-950">{title}</h1>
            <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
          </div>

          {section === 'overview' && (
            <AdminOverview
              tasks={data.tasks}
              overview={data.overview}
              onOpenTask={openTask}
            />
          )}
          {section === 'users' && <RegisteredUserPanel initialUserId={selectedUserId} />}
          {section === 'fields' && <AdminFieldDictPanel />}
          {section === 'tasks' && <AdminWorkflowWorkbench initialTaskId={selectedTaskId} initialGroup={selectedTaskGroup} />}
          {section === 'logs' && <AdminOperationLogPanel />}
        </div>
      </main>
    </div>
  );
}
