import React, { useMemo, useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { useLocation } from 'react-router';
import { TaskCreationModal } from '../components/TaskCreationModal';
import { AgentEvalModal } from '../components/AgentEvalModal';
import { AigcTaskModal } from '../components/AigcTaskModal';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription
} from '../components/ui/dialog';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger
} from '../components/ui/dropdown-menu';
import {
  LayoutGrid, Database, Bot, Search, MoreHorizontal, Eye,
  Pause, RefreshCw, FileText, Trash2, Share2, Copy, CheckCircle2,
  Clock, XCircle, AlertTriangle, PlayCircle, Mail, Link,
  Plus, Shield, BarChart2, Cpu, ChevronDown,
  BookOpen, GraduationCap, Scale, Newspaper, Download, ArrowRight, LibraryBig,
  Sparkles, ArrowUpRight, Clock3,
} from 'lucide-react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import {
  downloadAigcSample,
  fetchAigcReports,
  getAigcSamples,
  getAigcSamplesMeta,
  isBuiltinSampleText,
  mapReportToTaskRow,
  mapSampleToEvalSetRow,
  removeAigcReport,
  resolveSampleFileName,
  type AigcReportRow,
  type AigcSampleRow,
} from '@/api/aigc';
import { ReportDetailDialog } from '../components/ReportDetailDialog';
import {
  KNOWLEDGE_CATEGORIES,
  KNOWLEDGE_RESOURCES,
  KnowledgeCategory,
} from '../data/knowledgeResources';

// ── Product group config ─────────────────────────────────────────
const PRODUCT_GROUP_CONFIG: Record<string, {
  label: string;
  subtitle: string;
  color: string;
  bg: string;
  icon: React.ElementType;
}> = {
  '个人敏感信息审查': {
    label: '个人敏感信息审查',
    subtitle: '',
    color: '#7c3aed',
    bg: 'rgba(124,58,237,0.07)',
    icon: Shield,
  },
  '模型数据安全评测': {
    label: '模型数据安全评测',
    subtitle: '',
    color: '#0891b2',
    bg: 'rgba(8,145,178,0.07)',
    icon: Database,
  },
  'AIGC内容审核': {
    label: 'AIGC内容审核与鉴伪',
    subtitle: '',
    color: '#8b5cf6',
    bg: 'rgba(139,92,246,0.07)',
    icon: Bot,
  },
  'AIGCAI鉴伪': {
    label: 'AIGC AI鉴伪',
    subtitle: '',
    color: '#7c3aed',
    bg: 'rgba(124,58,237,0.07)',
    icon: Bot,
  },
  '大模型安全评测': {
    label: '大模型安全评测',
    subtitle: '',
    color: '#3b82f6',
    bg: 'rgba(59,130,246,0.07)',
    icon: Shield,
  },
  '多模态大模型安全评测': {
    label: '多模态大模型安全评测',
    subtitle: '',
    color: '#06b6d4',
    bg: 'rgba(6,182,212,0.07)',
    icon: Database,
  },
  '大模型评测': {
    label: '大模型性能评测',
    subtitle: '',
    color: '#10b981',
    bg: 'rgba(16,185,129,0.07)',
    icon: BarChart2,
  },
  '深度模型可信测评': {
    label: '深度模型可信测评',
    subtitle: '',
    color: '#4f46e5',
    bg: 'rgba(79,70,229,0.07)',
    icon: BarChart2,
  },
  '智能体安全评测': {
    label: '智能体安全评测',
    subtitle: '',
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.07)',
    icon: Cpu,
  },
  '训练集评测': {
    label: '训练集评测',
    subtitle: '',
    color: '#ef4444',
    bg: 'rgba(239,68,68,0.07)',
    icon: FileText,
  },
};

type Tab = 'tasks' | 'evalsets' | 'models';

const STATUS_CONFIG: Record<string, { color: string; icon: React.ElementType; label: string }> = {
  '评测中': { color: 'bg-blue-100 text-blue-700', icon: PlayCircle, label: '评测中' },
  '排队中': { color: 'bg-amber-100 text-amber-700', icon: Clock, label: '排队中' },
  '评测完成': { color: 'bg-green-100 text-green-700', icon: CheckCircle2, label: '评测完成' },
  '评测失败': { color: 'bg-red-100 text-red-700', icon: XCircle, label: '评测失败' },
  '已暂停': { color: 'bg-gray-100 text-gray-600', icon: Pause, label: '已暂停' },
};

const PLAN_CONFIG: Record<string, string> = {
  free: 'bg-gray-100 text-gray-500',
  paid: 'bg-amber-100 text-amber-700',
};

function TaskActions({
  task,
  onAigcDeleted,
}: {
  task: AigcReportRow;
  onAigcDeleted?: () => void;
}) {
  const navigate = useNavigate();
  const { updateTask, deleteTask } = useUser();
  const [shareOpen, setShareOpen] = useState(false);
  const [logOpen, setLogOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const isAigc = task.source === 'aigc' && Boolean(task.recordId);

  const shareUrl = task.shareLink || `https://share.aisafepro.com/report/${task.id}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl).catch(() => {}).finally(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handlePause = () => {
    updateTask(task.id, { status: '已暂停' });
    toast.success(`任务「${task.name}」已暂停`);
  };

  const handleStop = () => {
    updateTask(task.id, { status: '评测失败' });
    toast.success(`任务「${task.name}」已终止`);
  };

  const handleRetry = () => {
    updateTask(task.id, { status: task.plan === 'free' ? '排队中' : '评测中' });
    toast.success(`任务「${task.name}」已重新提交`);
  };

  const handleDelete = async () => {
    if (isAigc) {
      if (!window.confirm('确定删除该检测报告？此操作不可恢复。')) return;
      setDeleting(true);
      try {
        await removeAigcReport(task.recordId!);
        toast.success('报告已删除');
        onAigcDeleted?.();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : '删除失败');
      } finally {
        setDeleting(false);
      }
      return;
    }
    deleteTask(task.id);
    toast.success('任务已删除');
  };

  const handleView = () => {
    if (isAigc) {
      setDetailOpen(true);
      return;
    }
    navigate(`/task-detail/${task.id}`);
  };

  // Dynamic actions based on task status
  const renderActionButtons = () => {
    if (isAigc) {
      return (
        <>
          <Button variant="ghost" size="sm" className="h-7 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-2" onClick={handleView}>
            <Eye className="w-3.5 h-3.5 mr-1" />
            查看报告
          </Button>
          <Button variant="ghost" size="sm" className="h-7 text-xs text-red-500 hover:bg-red-50 px-2" disabled={deleting} onClick={handleDelete}>
            <Trash2 className="w-3.5 h-3.5 mr-1" />
            {deleting ? '删除中…' : '删除'}
          </Button>
        </>
      );
    }

    if (task.status === '评测完成') {
      return (
        <>
          <Button variant="ghost" size="sm" className="h-7 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-2" onClick={handleView}>
            <Eye className="w-3.5 h-3.5 mr-1" />
            查看详情
          </Button>
          <Button variant="ghost" size="sm" className="h-7 text-xs text-gray-600 hover:bg-gray-100 px-2">
            编辑
          </Button>
          <Button variant="ghost" size="sm" className="h-7 text-xs text-gray-600 hover:bg-gray-100 px-2" onClick={() => setLogOpen(true)}>
            日志
          </Button>
          <Button variant="ghost" size="sm" className="h-7 text-xs text-red-500 hover:bg-red-50 px-2" onClick={handleDelete}>
            删除
          </Button>
        </>
      );
    }

    if (task.status === '评测失败') {
      return (
        <>
          <Button variant="ghost" size="sm" className="h-7 text-xs text-blue-600 hover:bg-blue-50 px-2" onClick={handleRetry}>
            <RefreshCw className="w-3.5 h-3.5 mr-1" />
            重试
          </Button>
          <Button variant="ghost" size="sm" className="h-7 text-xs text-gray-600 hover:bg-gray-100 px-2">
            编辑
          </Button>
          <Button variant="ghost" size="sm" className="h-7 text-xs text-gray-600 hover:bg-gray-100 px-2" onClick={() => setLogOpen(true)}>
            日志
          </Button>
          <Button variant="ghost" size="sm" className="h-7 text-xs text-red-500 hover:bg-red-50 px-2" onClick={handleDelete}>
            删除
          </Button>
        </>
      );
    }

    if (task.status === '评测中' || task.status === '排队中') {
      return (
        <>
          <Button variant="ghost" size="sm" className="h-7 text-xs text-amber-600 hover:bg-amber-50 px-2" onClick={handlePause}>
            <Pause className="w-3.5 h-3.5 mr-1" />
            暂停
          </Button>
          <Button variant="ghost" size="sm" className="h-7 text-xs text-red-500 hover:bg-red-50 px-2" onClick={handleStop}>
            <XCircle className="w-3.5 h-3.5 mr-1" />
            终止
          </Button>
          <Button variant="ghost" size="sm" className="h-7 text-xs text-gray-600 hover:bg-gray-100 px-2" onClick={() => setLogOpen(true)}>
            日志
          </Button>
          <Button variant="ghost" size="sm" className="h-7 text-xs text-red-500 hover:bg-red-50 px-2" onClick={handleDelete}>
            删除
          </Button>
        </>
      );
    }

    // Default case (已暂停 etc)
    return (
      <>
        <Button variant="ghost" size="sm" className="h-7 text-xs text-blue-600 hover:bg-blue-50 px-2" onClick={handleView}>
          <Eye className="w-3.5 h-3.5 mr-1" />
          查看详情
        </Button>
        <Button variant="ghost" size="sm" className="h-7 text-xs text-gray-600 hover:bg-gray-100 px-2" onClick={() => setLogOpen(true)}>
          日志
        </Button>
        <Button variant="ghost" size="sm" className="h-7 text-xs text-red-500 hover:bg-red-50 px-2" onClick={handleDelete}>
          删除
        </Button>
      </>
    );
  };

  return (
    <>
      <div className="flex items-center gap-1">
        {renderActionButtons()}
      </div>

      <ReportDetailDialog open={detailOpen} onOpenChange={setDetailOpen} task={isAigc ? task : null} />

      {/* Share Dialog */}
      <Dialog open={shareOpen} onOpenChange={setShareOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Share2 className="w-4 h-4 text-blue-500" />
              分享评测报告
            </DialogTitle>
            <DialogDescription>
              生成公开分享链接，任何人均可通过此链接查看报告（不含敏感配置信息）
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-lg border">
              <Link className="w-4 h-4 text-gray-400 shrink-0" />
              <span className="text-xs text-gray-600 flex-1 truncate">{shareUrl}</span>
              <button onClick={handleCopy} className="shrink-0 text-blue-600 hover:text-blue-700">
                {copied ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={handleCopy}>
              {copied ? '已复制链接！' : '复制分享链接'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Log Dialog */}
      <Dialog open={logOpen} onOpenChange={setLogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-gray-500" />
              任务日志 - {task.name}
            </DialogTitle>
          </DialogHeader>
          <div className="bg-gray-900 rounded-lg p-4 font-mono text-xs text-green-400 space-y-1 max-h-64 overflow-y-auto">
            <p>[{task.createdAt}] 任务创建成功，ID: {task.id}</p>
            <p>[{task.createdAt}] 模型连接验证: {task.model} ✓</p>
            <p>[{task.createdAt}] 数据集加载: {task.evalSet}</p>
            {task.status !== '排队中' && (
              <>
                <p className="text-blue-400">[INFO] 开始评测，共 {task.plan === 'free' ? '50' : '500'} 条样本</p>
                <p className="text-blue-400">[INFO] 维度配置: {task.evalSet}</p>
              </>
            )}
            {task.status === '排队中' && (
              <p className="text-amber-400">[QUEUE] 任务排队中，当前位置: 3，预计等待时间: 15分钟</p>
            )}
            {task.status === '评测中' && (
              <>
                <p className="text-blue-400">[INFO] 已处理: 128/500 (25.6%)</p>
                <p className="text-blue-400">[INFO] 当前速率: 12.3 条/秒</p>
              </>
            )}
            {task.status === '评测完成' && (
              <>
                <p className="text-green-400">[SUCCESS] 评测完成，耗时: 2m 34s</p>
                <p className="text-green-400">[SUCCESS] 综合评分: {task.score}</p>
                <p className="text-green-400">[SUCCESS] 报告已生成，可在报告页面查看</p>
                {task.plan === 'free' && <p className="text-amber-400">[NOTICE] 免费用户只显示基础评分报告</p>}
              </>
            )}
            {task.status === '评测失败' && (
              <p className="text-red-400">[ERROR] 评测失败: API连接超时 (timeout after 30s)</p>
            )}
            {task.status === '已暂停' && (
              <p className="text-amber-400">[PAUSE] 任务已暂停，可点击继续恢复评测</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

// ── Grouped Task List ────────────────────────────────────────────
function GroupedTaskList({ tasks, navigate, searchQuery, statusFilter, onAigcDeleted }: {
  tasks: AigcReportRow[];
  navigate: ReturnType<typeof useNavigate>;
  searchQuery: string;
  statusFilter: string;
  onAigcDeleted?: () => void;
}) {
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});

  const toggleGroup = (key: string) => {
    setCollapsedGroups(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Filter first
  const filtered = tasks.filter(t => {
    const matchSearch = !searchQuery || t.name.toLowerCase().includes(searchQuery.toLowerCase()) || t.model.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = statusFilter === 'all' || t.status === statusFilter;
    return matchSearch && matchStatus;
  });

  // Group by evalType
  const groupMap = new Map<string, AigcReportRow[]>();
  for (const task of filtered) {
    const key = task.evalType;
    if (!groupMap.has(key)) groupMap.set(key, []);
    groupMap.get(key)!.push(task);
  }

  // Sort each group's tasks by createdAt descending
  for (const [, list] of groupMap) {
    list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  // Sort groups by most recent task createdAt descending
  const groups = Array.from(groupMap.entries())
    .sort((a, b) => {
      const aLatest = a[1][0]?.createdAt ?? '';
      const bLatest = b[1][0]?.createdAt ?? '';
      return bLatest.localeCompare(aLatest);
    });

  if (groups.length === 0) {
    return (
      <div className="bg-white rounded-xl border py-24 text-center">
        <LayoutGrid className="w-10 h-10 text-gray-300 mx-auto mb-3" />
        <div className="text-gray-500 text-sm">
          {searchQuery || statusFilter !== 'all'
            ? '没有符合筛选条件的任务'
            : (<>暂无任务，快去 <button className="text-blue-600 underline" onClick={() => navigate('/online-experience?tab=aigc')}>在线体验</button> 吧</>)}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <AnimatePresence initial={false}>
        {groups.map(([evalType, groupTasks]) => {
          const cfg = PRODUCT_GROUP_CONFIG[evalType] ?? {
            label: evalType,
            subtitle: '',
            color: '#6b7280',
            bg: 'rgba(107,114,128,0.07)',
            icon: LayoutGrid,
          };
          const Icon = cfg.icon;
          const isCollapsed = !!collapsedGroups[evalType];

          return (
            <motion.div
              key={evalType}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.22 }}
              className="bg-white rounded-xl border shadow-sm overflow-hidden"
            >
              {/* Group header */}
              <button
                onClick={() => toggleGroup(evalType)}
                className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-gray-50/60 transition-colors"
                style={{ borderBottom: isCollapsed ? 'none' : '1px solid #f1f5f9' }}
              >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: cfg.bg, border: `1.5px solid ${cfg.color}30` }}>
                  <Icon className="w-4 h-4" style={{ color: cfg.color }} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-800 text-sm">{cfg.label}</span>
                    {cfg.subtitle && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.color}25` }}>
                        {cfg.subtitle}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-gray-400 mt-0.5">
                    共 {groupTasks.length} 个任务 · 最近更新 {groupTasks[0]?.createdAt?.slice(0, 10) ?? '—'}
                  </div>
                </div>
                <Badge className="text-[10px] h-5 px-2 border-0" style={{ background: cfg.bg, color: cfg.color }}>
                  {groupTasks.length}
                </Badge>
                <motion.div animate={{ rotate: isCollapsed ? -90 : 0 }} transition={{ duration: 0.2 }}>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </motion.div>
              </button>

              {/* Task rows */}
              <AnimatePresence initial={false}>
                {!isCollapsed && (
                  <motion.div
                    key="rows"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.22 }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-gray-50/70 border-b">
                            <th className="px-5 py-3 text-left text-xs text-gray-400 font-medium">序号</th>
                            <th className="px-5 py-3 text-left text-xs text-gray-400 font-medium">任务名称</th>
                            <th className="px-5 py-3 text-left text-xs text-gray-400 font-medium">评测模型</th>
                            <th className="px-5 py-3 text-left text-xs text-gray-400 font-medium">模型类型</th>
                            <th className="px-5 py-3 text-left text-xs text-gray-400 font-medium">评测集</th>
                            <th className="px-5 py-3 text-left text-xs text-gray-400 font-medium">状态</th>
                            <th className="px-5 py-3 text-left text-xs text-gray-400 font-medium">邮件</th>
                            <th className="px-5 py-3 text-left text-xs text-gray-400 font-medium">创建时间</th>
                            <th className="px-5 py-3 text-left text-xs text-gray-400 font-medium">操作</th>
                          </tr>
                        </thead>
                        <tbody>
                          {groupTasks.map((task, idx) => {
                            const statusConf = STATUS_CONFIG[task.status] || STATUS_CONFIG['评测完成'];
                            const StatusIcon = statusConf.icon;
                            return (
                              <tr key={`${task.source}-${task.recordId ?? task.id}-${idx}`} className="border-b last:border-0 hover:bg-blue-50/20 transition-colors">
                                <td className="px-5 py-3.5 text-gray-400 text-xs">{idx + 1}</td>
                                <td className="px-5 py-3.5">
                                  <div className="font-medium text-sm text-gray-800 max-w-[120px] truncate">{task.name}</div>
                                  <Badge className={`text-[9px] px-1 h-4 mt-0.5 bg-gray-100 text-gray-500 border-0`}>
                                    {task.source === 'aigc' ? 'AIGC' : '标准版'}
                                  </Badge>
                                </td>
                                <td className="px-5 py-3.5 text-xs text-gray-600 max-w-[120px]"><span className="truncate block">{task.model}</span></td>
                                <td className="px-5 py-3.5"><Badge className="text-[10px] bg-gray-100 text-gray-500 border-0">{task.modelType}</Badge></td>
                                <td className="px-5 py-3.5 text-xs text-gray-600 max-w-[100px]"><span className="truncate block">{task.evalSet}</span></td>
                                <td className="px-5 py-3.5">
                                  <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] ${statusConf.color}`}>
                                    <StatusIcon className="w-2.5 h-2.5" />
                                    {statusConf.label}
                                  </div>
                                  {task.riskLevel ? <div className="text-[10px] text-slate-500 mt-0.5">{task.riskLevel}</div> : null}
                                  {task.score !== null && <div className="text-xs font-bold text-blue-600 mt-0.5">{task.score}分</div>}
                                </td>
                                <td className="px-5 py-3.5">
                                  {(task.status === '评测完成' || task.status === '评测失败') ? (
                                    <div className="flex items-center gap-1 text-xs text-green-600"><Mail className="w-3.5 h-3.5" /><span>已发送</span></div>
                                  ) : <span className="text-xs text-gray-400">-</span>}
                                </td>
                                <td className="px-5 py-3.5 text-xs text-gray-400 whitespace-nowrap">{task.createdAt}</td>
                                <td className="px-5 py-3.5"><TaskActions task={task} onAigcDeleted={onAigcDeleted} /></td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

// ── Modal action types ────────────────────────────────────────────
type ModalAction =
  | { type: 'taskCreation'; pageType: 'llm' | 'safety' }
  | { type: 'agentEval' }
  | { type: 'aigc'; modality: 'text' | 'image' | 'audio' | 'video'; func: 'audit' | 'detect' }
  | { type: 'navigate'; path: string };

interface QSItem { label: string; sub?: string; action: ModalAction; icon?: string }
interface QSCard {
  id: string; title: string; icon: React.ElementType;
  color: string; grad: string; desc: string; items: QSItem[];
}

const QUICK_START_CARDS: QSCard[] = [
  {
    id: 'model', title: '模型评测', icon: BarChart2, color: '#3b82f6', grad: 'from-blue-500 to-indigo-600',
    desc: '大模型可信度 / 性能 / 安全全方位评测',
    items: [
      { label: '大模型性能评测',     action: { type: 'taskCreation', pageType: 'llm' } },
      { label: '大模型安全评测',     action: { type: 'taskCreation', pageType: 'safety' } },
      { label: '智能体安全评测',     action: { type: 'agentEval' } },
      { label: '深度模型可信测评',   action: { type: 'navigate', path: '/deep-model-eval' } },
    ],
  },
  {
    id: 'data', title: '数据智能', icon: Database, color: '#8b5cf6', grad: 'from-violet-500 to-purple-600',
    desc: '数据安全 / 内容审核 / AIGC鉴伪',
    items: [
      { label: '个人敏感信息审查', sub: '批量任务', icon: '🔐', action: { type: 'navigate', path: '/privacy-data-audit' } },
      { label: '模型数据安全评测', sub: '数据集任务', icon: '🗂️', action: { type: 'navigate', path: '/model-safety-eval' } },
      { label: '文本内容审核',   sub: 'AIGC', icon: '📝', action: { type: 'aigc', modality: 'text',  func: 'audit'  } },
      { label: '图像内容审核',   sub: 'AIGC', icon: '🖼️', action: { type: 'aigc', modality: 'image', func: 'audit'  } },
      { label: '音频内容审核',   sub: 'AIGC', icon: '🎵', action: { type: 'aigc', modality: 'audio', func: 'audit'  } },
      { label: '视频内容审核',   sub: 'AIGC', icon: '🎬', action: { type: 'aigc', modality: 'video', func: 'audit'  } },
      { label: '文本 AI 鉴伪',  sub: 'AIGC', icon: '📝', action: { type: 'aigc', modality: 'text',  func: 'detect' } },
      { label: '图像 AI 鉴伪',  sub: 'AIGC', icon: '🖼️', action: { type: 'aigc', modality: 'image', func: 'detect' } },
      { label: '音频 AI 鉴伪',  sub: 'AIGC', icon: '🎵', action: { type: 'aigc', modality: 'audio', func: 'detect' } },
      { label: 'Deepfake 视频鉴伪', sub: 'AIGC', icon: '🎬', action: { type: 'aigc', modality: 'video', func: 'detect' } },
    ],
  },
  {
    id: 'app', title: '系统安全', icon: Shield, color: '#06b6d4', grad: 'from-cyan-500 to-blue-600',
    desc: '代码漏洞 / 网络渗透全面扫描',
    items: [
      { label: '代码漏洞审查', action: { type: 'navigate', path: '/code-vulnerability-audit' } },
      { label: '网络渗透测试', action: { type: 'navigate', path: '/penetration-test' } },
    ],
  },
  {
    id: 'service', title: '合规治理', icon: FileText, color: '#10b981', grad: 'from-emerald-500 to-teal-600',
    desc: '备案服务 / 标准制定 / 安全教育',
    items: [
      { label: '人工智能安全教学平台',   action: { type: 'navigate', path: '/ai-safety-edu' } },
      { label: '大模型备案服务',         action: { type: 'navigate', path: '/model-filing-service' } },
      { label: '可信安全标准制定服务',   action: { type: 'navigate', path: '/tianche-standard-service' } },
    ],
  },
];

function QuickStartSection({ collapsed, onCollapse }: { collapsed: boolean; onCollapse: () => void }) {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState<ModalAction | null>(null);

  const handleAction = (action: ModalAction) => {
    if (action.type === 'navigate') {
      window.scrollTo(0, 0);
      navigate(action.path);
    } else {
      setOpenModal(action);
    }
  };

  const closeModal = () => setOpenModal(null);

  return (
    <>
      {/* Modals */}
      {openModal?.type === 'taskCreation' && (
        <TaskCreationModal open onClose={closeModal} pageType={openModal.pageType} />
      )}
      {openModal?.type === 'agentEval' && (
        <AgentEvalModal open onClose={closeModal} />
      )}
      {openModal?.type === 'aigc' && (
        <AigcTaskModal open onClose={closeModal} defaultModality={openModal.modality} defaultFunc={openModal.func} />
      )}

      {collapsed ? (
        <div className="flex items-center justify-between px-4 py-2.5 bg-white rounded-xl border border-gray-200 shadow-sm mb-6">
          <span className="text-sm font-medium text-gray-600 flex items-center gap-2">
            <Plus className="w-4 h-4 text-blue-500" />
            新建评测任务
          </span>
          <button onClick={onCollapse} className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
            展开 <ChevronDown className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900">欢迎使用玄鉴平台，请选择您的体验服务</h3>
              <p className="text-sm text-gray-500 mt-0.5">支持数据、模型、应用及合规全方位检测，点击下方卡片快速创建任务</p>
            </div>
            <button onClick={onCollapse} className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1 mt-1 shrink-0 ml-4">
              折叠 <ChevronDown className="w-3.5 h-3.5 rotate-180" />
            </button>
          </div>

          {/* Fix 2: items-start so expanding one card doesn't stretch siblings */}
          <div className="grid grid-cols-4 gap-4 items-start">
            {QUICK_START_CARDS.map(card => {
              const Icon = card.icon;
              const isOpen = expanded === card.id;
              return (
                <div
                  key={card.id}
                  className="rounded-2xl border shadow-sm flex flex-col"
                  style={{ borderColor: `${card.color}30`, background: `linear-gradient(160deg, ${card.color}06 0%, white 60%)` }}
                >
                  {/* Card header — fixed height always */}
                  <button
                    className="flex items-center gap-3 p-4 text-left hover:bg-white/60 transition-colors w-full rounded-t-2xl"
                    style={{ borderBottom: isOpen ? `1px solid ${card.color}20` : 'none' }}
                    onClick={() => setExpanded(isOpen ? null : card.id)}
                  >
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.grad} flex items-center justify-center shrink-0`}
                      style={{ boxShadow: `0 3px 10px ${card.color}35` }}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-gray-800 text-sm">{card.title}</div>
                      <div className="text-[11px] text-gray-400 truncate">{card.desc}</div>
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                      style={{ color: card.color }}
                    />
                  </button>

                  {/* Expanded items — each card grows independently */}
                  {isOpen && (
                    <div className="divide-y divide-gray-50">
                      {card.items.map(item => {
                        const isNavOnly = item.action.type === 'navigate';
                        return (
                          <button
                            key={item.label}
                            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-left hover:bg-gray-50 transition-colors group"
                            onClick={() => handleAction(item.action)}
                          >
                            {item.icon
                              ? <span className="text-sm shrink-0">{item.icon}</span>
                              : <Plus className="w-3.5 h-3.5 shrink-0" style={{ color: card.color }} />
                            }
                            <span className="text-sm text-gray-700 group-hover:text-gray-900 flex-1">{item.label}</span>
                            {isNavOnly
                              ? <span className="text-[10px] text-gray-400 shrink-0">查看详情 →</span>
                              : <span className="text-[10px] shrink-0 px-1.5 py-0.5 rounded font-medium"
                                  style={{ background: `${card.color}15`, color: card.color }}>创建任务</span>
                            }
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}

const KNOWLEDGE_CATEGORY_META: Record<KnowledgeCategory, { icon: React.ElementType; desc: string }> = {
  白皮书: { icon: BookOpen, desc: '体系化梳理 AI 安全评测、系统防护与合规治理方法' },
  实践指南: { icon: GraduationCap, desc: '面向项目落地的数据集、备案与企业治理操作指引' },
  合规报告: { icon: Scale, desc: '追踪监管政策、备案标准与 AI 伦理治理要求' },
  研究文章: { icon: Newspaper, desc: '聚焦模型幻觉、多模态安全与智能体可信评估' },
};

function KnowledgeLibraryPage({
  initialCategory,
  selectedResourceId,
  isGuest,
  onOpenWorkspace,
}: {
  initialCategory: KnowledgeCategory;
  selectedResourceId?: string;
  isGuest: boolean;
  onOpenWorkspace: () => void;
}) {
  const [activeCategory, setActiveCategory] = useState<KnowledgeCategory>(initialCategory);
  const [activeResourceId, setActiveResourceId] = useState(selectedResourceId || '');
  const [knowledgeSearch, setKnowledgeSearch] = useState('');

  useEffect(() => {
    setActiveCategory(initialCategory);
    setActiveResourceId(selectedResourceId || '');
  }, [initialCategory, selectedResourceId]);

  useEffect(() => {
    if (!activeResourceId) return;
    const timer = window.setTimeout(() => {
      document.getElementById(`knowledge-${activeResourceId}`)?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }, 120);
    return () => window.clearTimeout(timer);
  }, [activeCategory, activeResourceId]);

  const CategoryIcon = KNOWLEDGE_CATEGORY_META[activeCategory].icon;
  const visibleResources = useMemo(() => {
    const keyword = knowledgeSearch.trim().toLowerCase();
    const source = keyword
      ? KNOWLEDGE_CATEGORIES.flatMap(category => KNOWLEDGE_RESOURCES[category])
      : KNOWLEDGE_RESOURCES[activeCategory];
    return source.filter(resource => !keyword || `${resource.title}${resource.desc}`.toLowerCase().includes(keyword));
  }, [activeCategory, knowledgeSearch]);
  const featured = KNOWLEDGE_RESOURCES.白皮书[0];

  return (
    <div className="rs-page">
      <section id="knowledge-library" className="border-b border-slate-200/80 bg-white/70" aria-labelledby="knowledge-library-title">
        <div className="rs-container grid gap-8 py-14 lg:grid-cols-[1.05fr_.95fr] lg:items-center">
          <div>
            <span className="rs-eyebrow"><LibraryBig className="h-4 w-4" />Xuanjian Resource Center</span>
            <h1 id="knowledge-library-title" className="mt-4 text-4xl font-black tracking-[-.035em] text-slate-950 md:text-5xl">AI 安全资源中心</h1>
            <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600">
              汇聚白皮书、实践指南、合规报告与研究文章，为产品建设、评测决策和合规落地提供可复用参考。
            </p>
            <div className="relative mt-7 max-w-xl">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                value={knowledgeSearch}
                onChange={event => setKnowledgeSearch(event.target.value)}
                placeholder="搜索白皮书、合规政策或技术主题"
                className="rs-focus-ring h-13 w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-12 pr-4 text-sm shadow-lg shadow-slate-200/60 outline-none"
              />
            </div>
          </div>
          <article className="relative overflow-hidden rounded-3xl bg-[#0c2d5a] p-7 text-white shadow-2xl shadow-blue-900/15">
            <div className="absolute -right-16 -top-20 h-52 w-52 rounded-full bg-blue-400/20 blur-2xl" />
            <span className="relative inline-flex items-center gap-2 text-xs font-bold tracking-widest text-blue-200"><Sparkles className="h-4 w-4" />精选内容</span>
            <h2 className="relative mt-5 max-w-md text-2xl font-black leading-9">{featured.title}</h2>
            <p className="relative mt-3 max-w-lg text-sm leading-7 text-blue-100/75">{featured.desc}</p>
            <div className="relative mt-7 flex items-center justify-between border-t border-white/10 pt-5">
              <span className="flex items-center gap-2 text-xs text-blue-200"><Clock3 className="h-4 w-4" />{featured.date}</span>
              <button
                onClick={() => { setActiveCategory('白皮书'); setActiveResourceId(featured.id); }}
                className="inline-flex items-center gap-2 text-sm font-bold text-white"
              >
                查看白皮书 <ArrowUpRight className="h-4 w-4" />
              </button>
            </div>
          </article>
        </div>
      </section>

      <section className="rs-container py-11">
        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="rs-section-title">探索专业内容</h2>
            <p className="mt-2 rs-section-copy">按内容类型查找资料，或进入账户工作台管理评测任务与报告。</p>
          </div>
          <button
            type="button"
            onClick={onOpenWorkspace}
            className="rs-focus-ring inline-flex items-center justify-center gap-2 rounded-xl border border-blue-200 bg-white px-5 py-3 text-sm font-bold text-blue-700 hover:bg-blue-50"
          >
            {isGuest ? '登录管理我的资源' : '进入我的资源'} <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4" role="tablist" aria-label="知识库分类">
          {KNOWLEDGE_CATEGORIES.map(category => {
            const meta = KNOWLEDGE_CATEGORY_META[category];
            const Icon = meta.icon;
            const selected = activeCategory === category && !knowledgeSearch;
            return (
              <button
                key={category}
                role="tab"
                aria-selected={selected}
                onClick={() => { setKnowledgeSearch(''); setActiveCategory(category); setActiveResourceId(''); }}
                className={`rs-focus-ring rounded-2xl border p-4 text-left transition hover:-translate-y-0.5 ${selected ? 'border-blue-300 bg-blue-50/70 shadow-lg shadow-blue-100/70' : 'border-slate-200 bg-white hover:border-blue-200'}`}
              >
                <span className={`grid h-10 w-10 place-items-center rounded-xl ${selected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                  <Icon className="h-5 w-5" />
                </span>
                <strong className="mt-4 block text-sm text-slate-900">{category}</strong>
                <span className="mt-1 block text-xs leading-5 text-slate-500">{meta.desc}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-9 flex items-center gap-2 text-sm text-slate-500">
          <CategoryIcon className="h-4 w-4" />
          <span>{knowledgeSearch ? '搜索结果' : activeCategory}</span>
          <span className="text-slate-300">·</span>
          <span>{visibleResources.length} 篇内容</span>
        </div>

        <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {visibleResources.map(resource => {
            const selected = activeResourceId === resource.id;
            return (
              <article
                id={`knowledge-${resource.id}`}
                key={resource.id}
                tabIndex={0}
                onClick={() => setActiveResourceId(resource.id)}
                onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') setActiveResourceId(resource.id); }}
                className="rs-focus-ring group relative cursor-pointer overflow-hidden rounded-2xl border bg-white p-6 transition hover:-translate-y-1 hover:shadow-xl"
                style={{ borderColor: selected ? resource.color : '#e5eaf1', boxShadow: selected ? `0 18px 45px ${resource.color}18` : undefined }}
              >
                <div className="flex items-center justify-between">
                  <span className="rounded-full px-2.5 py-1 text-[11px] font-bold" style={{ color: resource.color, background: `${resource.color}12` }}>{knowledgeSearch ? '精选内容' : activeCategory}</span>
                  <span className="text-xs text-slate-400">{resource.date}</span>
                </div>
                <h3 className="mt-5 text-lg font-black leading-7 text-slate-900 group-hover:text-blue-700">{resource.title}</h3>
                <p className="mt-3 min-h-[52px] text-sm leading-7 text-slate-500">{resource.desc}</p>
                <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
                  <span className="text-xs font-semibold text-slate-500">{selected ? '已选中该内容' : '查看摘要'}</span>
                  <button
                    type="button"
                    className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-700"
                    onClick={event => { event.stopPropagation(); toast.success(`已准备《${resource.title.replace(/[《》]/g, '')}》下载任务`); }}
                  >
                    <Download className="h-4 w-4" />下载阅读
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}

export function ResourceCenter() {
  const { user, isGuest } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<Tab>('tasks');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [aigcReports, setAigcReports] = useState<AigcReportRow[]>([]);
  const [reportsTotal, setReportsTotal] = useState(0);
  const [reportsLoading, setReportsLoading] = useState(false);
  const [reportsError, setReportsError] = useState<string | null>(null);
  const [reportsTick, setReportsTick] = useState(0);

  const [aigcSamples, setAigcSamples] = useState<AigcSampleRow[]>([]);
  const [samplesTotal, setSamplesTotal] = useState(0);
  const [samplesLoading, setSamplesLoading] = useState(false);
  const [samplesError, setSamplesError] = useState<string | null>(null);
  const [sampleKeyword, setSampleKeyword] = useState('');
  const [sampleDetail, setSampleDetail] = useState<AigcSampleRow | null>(null);

  const isNewUser = user?.myTasks?.length === 0 && aigcReports.length === 0;
  // For users with tasks, start collapsed; for new users, start expanded
  const [quickStartCollapsed, setQuickStartCollapsed] = useState(!isNewUser);

  // If navigated via "试用体验" button, expand and switch to tasks tab
  useEffect(() => {
    const state = location.state as { showQuickStart?: boolean } | null;
    if (state?.showQuickStart) {
      setQuickStartCollapsed(false);
      setActiveTab('tasks');
    }
  }, [location.state]);

  useEffect(() => {
    if (isGuest) {
      setAigcReports([]);
      setReportsTotal(0);
      return;
    }
    let cancelled = false;
    const timer = window.setTimeout(async () => {
      setReportsLoading(true);
      setReportsError(null);
      try {
        const params: Record<string, unknown> = { page: 1, page_size: 50 };
        if (searchQuery.trim()) params.keyword = searchQuery.trim();
        const data = await fetchAigcReports(params);
        const items = Array.isArray(data?.items) ? data.items : [];
        if (!cancelled) {
          setAigcReports(items.map((item) => mapReportToTaskRow(item as Record<string, unknown>)));
          setReportsTotal(Number(data?.total ?? items.length));
        }
      } catch (err) {
        if (!cancelled) {
          setReportsError(err instanceof Error ? err.message : '报告加载失败');
          setAigcReports([]);
          setReportsTotal(0);
        }
      } finally {
        if (!cancelled) setReportsLoading(false);
      }
    }, searchQuery ? 300 : 0);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [isGuest, user.id, searchQuery, reportsTick]);

  useEffect(() => {
    if (isGuest) return;
    getAigcSamplesMeta()
      .then((meta) => {
        const count = Number((meta as { sample_count?: number } | null)?.sample_count);
        if (!Number.isNaN(count) && count > 0) setSamplesTotal(count);
      })
      .catch(() => {});
  }, [isGuest, user.id]);

  useEffect(() => {
    if (activeTab !== 'evalsets' || isGuest) return;
    let cancelled = false;
    const timer = window.setTimeout(async () => {
      setSamplesLoading(true);
      setSamplesError(null);
      try {
        const params: Record<string, unknown> = { page: 1, page_size: 24 };
        if (sampleKeyword.trim()) params.keyword = sampleKeyword.trim();
        const data = await getAigcSamples(params);
        const items = Array.isArray(data?.items) ? data.items : [];
        if (!cancelled) {
          setAigcSamples(items.map((item) => mapSampleToEvalSetRow(item as Record<string, unknown>)));
          setSamplesTotal(Number(data?.total ?? items.length));
        }
      } catch (err) {
        if (!cancelled) {
          setSamplesError(err instanceof Error ? err.message : '评测集加载失败');
          setAigcSamples([]);
          setSamplesTotal(0);
        }
      } finally {
        if (!cancelled) setSamplesLoading(false);
      }
    }, sampleKeyword ? 300 : 0);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [activeTab, isGuest, user.id, sampleKeyword]);

  const handleSampleDownload = async (sample: AigcSampleRow) => {
    if (isBuiltinSampleText(sample.raw)) {
      toast.info('文本样例无需下载，请使用「查看详情」预览');
      return;
    }
    try {
      const { blob, filename } = await downloadAigcSample(sample.id);
      const fileName = filename ?? resolveSampleFileName(sample.raw, blob);
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = fileName;
      anchor.click();
      URL.revokeObjectURL(url);
      toast.success('样例文件已开始下载');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : '下载失败');
    }
  };

  const mergedTasks = useMemo(() => {
    const local = user.myTasks.map((task) => ({ ...task, source: 'local' as const }));
    const localIds = new Set(local.map((t) => t.id));
    const remote = aigcReports.filter((r) => !localIds.has(r.id));
    return [...remote, ...local] as AigcReportRow[];
  }, [user.myTasks, aigcReports]);

  if (isGuest) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-5">
          <LayoutGrid className="w-10 h-10 text-blue-400" />
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">登录后查看资源中心</h2>
        <p className="text-gray-500 text-sm mb-6">资源中心包括您的评测任务、评测集和模型，登录后即可管理。</p>
        <div className="flex gap-3 justify-center">
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => navigate('/login')}>登录账号</Button>
          <Button variant="outline" onClick={() => navigate('/register')}>注册新账号</Button>
        </div>
      </div>
    );
  }

  const tabs = [
    { key: 'tasks' as Tab, label: '我的评测', icon: LayoutGrid, count: reportsTotal || mergedTasks.length },
    { key: 'evalsets' as Tab, label: '我的评测集', icon: Database, count: samplesTotal || aigcSamples.length },
    { key: 'models' as Tab, label: '我的模型', icon: Bot, count: user.myModels.length },
  ];

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Sidebar */}
      <div className="w-48 bg-white border-r shrink-0 py-5 px-3">
        <div className="text-xs text-gray-400 uppercase tracking-wide px-2 mb-2">评测任务管理</div>
        <nav className="space-y-1">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                  activeTab === tab.key
                    ? 'bg-blue-50 text-blue-600 font-medium'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="flex-1 text-left">{tab.label}</span>
                <Badge className={`text-[10px] h-4 px-1 ${activeTab === tab.key ? 'bg-blue-100 text-blue-600 border-0' : 'bg-gray-100 text-gray-500 border-0'}`}>
                  {tab.count}
                </Badge>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        {/* My Evaluations Tab — dynamic grouped view */}
        {activeTab === 'tasks' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-bold text-gray-800 text-lg">我的评测</h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  AIGC 报告库 + 本地任务 · {reportsLoading ? '报告加载中…' : reportsError ? `报告加载失败：${reportsError}` : `已同步 ${reportsTotal || aigcReports.length} 条网关报告`}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="搜索任务名称"
                    className="pl-8 h-8 w-44 text-xs"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                  />
                </div>
                <select
                  className="h-8 text-xs border rounded-md px-2 bg-white text-gray-600"
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                >
                  <option value="all">全部状态</option>
                  <option value="评测中">评测中</option>
                  <option value="排队中">排队中</option>
                  <option value="评测完成">评测完成</option>
                  <option value="评测失败">评测失败</option>
                  <option value="已暂停">已暂停</option>
                </select>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 text-xs"
                  onClick={() => setReportsTick((n) => n + 1)}
                >
                  <RefreshCw className="w-3.5 h-3.5 mr-1" />
                  刷新
                </Button>
              </div>
            </div>
            <GroupedTaskList
              tasks={mergedTasks}
              navigate={navigate}
              searchQuery={searchQuery}
              statusFilter={statusFilter}
              onAigcDeleted={() => setReportsTick((n) => n + 1)}
            />
          </div>
        )}

        {/* My Eval Sets Tab — 网关内置样例 */}
        {activeTab === 'evalsets' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-bold text-gray-800 text-lg">我的评测集</h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  网关内置样例 · {samplesLoading ? '加载中…' : samplesError ? `加载失败：${samplesError}` : `共 ${samplesTotal || aigcSamples.length} 条`}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="搜索样例"
                    className="pl-8 h-8 w-44 text-xs"
                    value={sampleKeyword}
                    onChange={e => setSampleKeyword(e.target.value)}
                  />
                </div>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-xs" onClick={() => navigate('/online-experience?tab=aigc')}>
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  去检测体验
                </Button>
              </div>
            </div>
            {samplesLoading && aigcSamples.length === 0 ? (
              <div className="bg-white rounded-xl border py-24 text-center text-sm text-gray-400">评测集加载中…</div>
            ) : aigcSamples.length === 0 ? (
              <div className="bg-white rounded-xl border py-24 text-center">
                <Database className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <div className="text-gray-500 text-sm">{samplesError || '暂无内置样例'}</div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-6">
                {aigcSamples.map(set => (
                  <div key={set.id} className="bg-white rounded-xl border p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                          <Database className="w-5 h-5 text-blue-500" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-800 text-sm">{set.name}</div>
                          <div className="mt-1 flex flex-wrap gap-1">
                            <Badge className="bg-gray-100 text-gray-500 border-0 text-[10px]">{set.category}</Badge>
                            <Badge className="bg-violet-50 text-violet-600 border-0 text-[10px]">{set.mediaLabel}</Badge>
                            <Badge className="bg-blue-50 text-blue-600 border-0 text-[10px]">{set.evalType}</Badge>
                          </div>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setSampleDetail(set)}>查看详情</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleSampleDownload(set)}>下载数据集</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <div className="mt-3 flex items-center justify-between text-xs text-gray-400">
                      <span>{set.countLabel}</span>
                      <span>{set.algorithmName}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <Dialog open={Boolean(sampleDetail)} onOpenChange={(open) => !open && setSampleDetail(null)}>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>{sampleDetail?.name ?? '样例详情'}</DialogTitle>
                  <DialogDescription>
                    {sampleDetail ? `${sampleDetail.mediaLabel} · ${sampleDetail.evalType} · ${sampleDetail.inputLabel}` : ''}
                  </DialogDescription>
                </DialogHeader>
                {sampleDetail && (
                  <div className="space-y-3 text-sm text-slate-600">
                    <p>算法：{sampleDetail.algorithmName}</p>
                    <p>类别：{sampleDetail.category}</p>
                    {sampleDetail.description ? <p>说明：{sampleDetail.description}</p> : null}
                    {sampleDetail.textPreview ? (
                      <div className="rounded-lg border bg-slate-50 p-3 text-xs leading-6 max-h-48 overflow-y-auto whitespace-pre-wrap">
                        {sampleDetail.textPreview}
                      </div>
                    ) : null}
                    <div className="flex justify-end gap-2 pt-2">
                      <Button variant="outline" size="sm" onClick={() => handleSampleDownload(sampleDetail)}>
                        <Download className="w-3.5 h-3.5 mr-1" />下载
                      </Button>
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700" onClick={() => {
                        const modality = sampleDetail.mediaType || 'text';
                        const fn = sampleDetail.taskType.includes('forgery') || sampleDetail.evalType.includes('鉴伪')
                          ? 'authenticity'
                          : 'audit';
                        navigate(`/online-experience?tab=aigc&modality=${modality}&function=${fn}`);
                      }}>
                        去体验
                      </Button>
                    </div>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </div>
        )}

        {/* My Models Tab */}
        {activeTab === 'models' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-bold text-gray-800 text-lg">我的模型</h2>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-xs" onClick={() => navigate('/safety-evaluation')}>
                <Plus className="w-3.5 h-3.5 mr-1" />
                添加API模型
              </Button>
            </div>
            {user.myModels.length === 0 ? (
              <div className="bg-white rounded-xl border py-24 text-center">
                <Bot className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <div className="text-gray-500 text-sm mb-3">暂无模型，请通过创建API模型进行创建</div>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-xs" onClick={() => navigate('/safety-evaluation')}>
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  创建API模型
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-6">
                {user.myModels.map(model => (
                  <div key={model.id} className="bg-white rounded-xl border p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                          <Bot className="w-5 h-5 text-indigo-500" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-800 text-sm">{model.name}</div>
                          <div className="text-xs text-gray-400 mt-0.5 truncate max-w-[200px]">{model.apiBase}</div>
                          <Badge className={`mt-1 text-[10px] border-0 ${
                            model.type === '开源' ? 'bg-green-100 text-green-600' :
                            model.type === '闭源' ? 'bg-gray-100 text-gray-500' :
                            'bg-blue-100 text-blue-600'
                          }`}>
                            {model.type}
                          </Badge>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>编辑配置</DropdownMenuItem>
                          <DropdownMenuItem>连通性测试</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-500">删除</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <div className="mt-3 text-xs text-gray-400 flex items-center justify-between">
                      <span>模型ID: {model.modelId}</span>
                      <span>添加于 {model.createdAt}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
