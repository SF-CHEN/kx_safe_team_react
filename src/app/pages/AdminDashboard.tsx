import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router';
import {
  Users, BarChart2, LogOut, Search, AlertTriangle, CheckCircle,
  XCircle, Clock, RefreshCw, Trash2, Eye, Edit2, Lock, Unlock,
  RotateCcw, StopCircle, X, Bell, Activity, ChevronRight,
  FileText, Shield, Settings, User, ChevronDown, AlertCircle,
  Terminal, Play, Download, Database, Bot, Cpu, LayoutGrid,
  TrendingUp, Layers,
} from 'lucide-react';

// ─── Credentials ──────────────────────────────────────────────────
const ADMIN_USER = 'admin';
const ADMIN_PASS = 'admin2026';
const STORAGE_KEY = 'xj_admin_token';

// ─── Types ────────────────────────────────────────────────────────
type AdminSection = 'users' | 'tasks';
type UserTab      = 'list' | 'audit';
type UserStatus   = 'active' | 'pending' | 'banned';
type TaskStatus   = 'queued' | 'running' | 'completed' | 'failed';

interface MockUser {
  id: string; name: string; email: string; phone: string;
  registeredAt: string; status: UserStatus; lastLogin: string;
  role: 'user' | 'enterprise';
}
interface AuditRequest {
  id: string; applicant: string; type: string; material: string;
  submittedAt: string; userId: string;
}
interface MockTask {
  id: string;
  userId: string;
  userName: string;
  evalType: string;      // maps to SERVICE_GROUPS
  model: string;         // e.g. "GPT-4o"
  evalSet: string;       // e.g. "通用安全数据集-v3"
  submittedAt: string;
  status: TaskStatus;
  duration?: string;
  errorCode?: string;    // short code for tooltip: GPU_OOM, API_TIMEOUT, etc.
  errorMessage?: string;
  params?: string;
  logs?: string[];
}

// ─── Service Groups Config (mirrors ResourceCenter PRODUCT_GROUP_CONFIG) ──
const SERVICE_GROUPS: Record<string, { label: string; subtitle: string; color: string; bg: string; icon: React.ElementType }> = {
  '大模型安全评测':     { label: '大模型安全评测',     subtitle: '模型评测', color: '#3b82f6', bg: 'rgba(59,130,246,0.08)',   icon: Shield    },
  '大模型评测':        { label: '大模型性能评测',     subtitle: '模型评测', color: '#10b981', bg: 'rgba(16,185,129,0.08)',   icon: BarChart2 },
  '智能体安全评测':    { label: '智能体安全评测',     subtitle: '模型评测', color: '#f59e0b', bg: 'rgba(245,158,11,0.08)',   icon: Cpu       },
  'AIGC内容审核':      { label: 'AIGC内容审核与鉴伪', subtitle: '数据智能', color: '#8b5cf6', bg: 'rgba(139,92,246,0.08)',   icon: Bot       },
  '多模态大模型安全评测': { label: '模型数据安全评测',  subtitle: '数据智能', color: '#06b6d4', bg: 'rgba(6,182,212,0.08)',    icon: Database  },
};

// ─── Mock Data ────────────────────────────────────────────────────
const INIT_USERS: MockUser[] = [
  { id: 'U00001', name: '张伟', email: 'zhangwei@horizon-ai.com', phone: '138****8866', registeredAt: '2025-11-02 09:30', status: 'active', lastLogin: '2026-06-11 14:22', role: 'enterprise' },
  { id: 'U00002', name: '刘敏', email: 'liumin@techcorp.cn', phone: '139****2233', registeredAt: '2025-11-18 14:05', status: 'active', lastLogin: '2026-06-12 08:11', role: 'user' },
  { id: 'U00003', name: '陈建国', email: 'chenjg@deepvision.ai', phone: '137****4411', registeredAt: '2025-12-03 10:45', status: 'pending', lastLogin: '2026-06-09 17:30', role: 'enterprise' },
  { id: 'U00004', name: '王芳', email: 'wangfang@edu.cn', phone: '186****6677', registeredAt: '2025-12-20 16:22', status: 'active', lastLogin: '2026-06-10 11:05', role: 'user' },
  { id: 'U00005', name: '赵强', email: 'zhaoqiang@spam.xyz', phone: '135****9988', registeredAt: '2026-01-07 22:18', status: 'banned', lastLogin: '2026-01-08 23:51', role: 'user' },
  { id: 'U00006', name: '孙晓燕', email: 'sunxy@mediagroup.com', phone: '188****5544', registeredAt: '2026-01-15 09:10', status: 'active', lastLogin: '2026-06-12 09:44', role: 'enterprise' },
  { id: 'U00007', name: '李鹏飞', email: 'lipengfei@fintech.com', phone: '132****7788', registeredAt: '2026-02-01 11:30', status: 'pending', lastLogin: '2026-06-07 16:20', role: 'user' },
  { id: 'U00008', name: '周雅婷', email: 'zhouyt@healthai.com', phone: '177****3322', registeredAt: '2026-02-14 14:00', status: 'active', lastLogin: '2026-06-11 20:30', role: 'enterprise' },
  { id: 'U00009', name: '吴宇', email: 'wuyu@illegal-resell.net', phone: '155****8899', registeredAt: '2026-03-05 03:40', status: 'banned', lastLogin: '2026-03-05 04:12', role: 'user' },
  { id: 'U00010', name: '郑秀英', email: 'zhengxy@govtech.cn', phone: '199****1100', registeredAt: '2026-03-20 10:15', status: 'active', lastLogin: '2026-06-12 08:55', role: 'enterprise' },
  { id: 'U00011', name: '黄磊', email: 'huanglei@startup.io', phone: '183****4466', registeredAt: '2026-04-10 15:22', status: 'active', lastLogin: '2026-06-11 13:10', role: 'user' },
  { id: 'U00012', name: '蔡文辉', email: 'caiwh@bigdata.cn', phone: '136****2255', registeredAt: '2026-05-08 11:05', status: 'pending', lastLogin: '2026-06-08 09:33', role: 'enterprise' },
];

const INIT_AUDIT: AuditRequest[] = [
  { id: 'A00001', applicant: '北京天际智能科技有限公司', type: '企业认证', material: '营业执照+法人证件', submittedAt: '2026-06-08 10:15', userId: 'U00003' },
  { id: 'A00002', applicant: '李鹏飞 (个人)', type: '高级API权限申请', material: '项目说明书.pdf', submittedAt: '2026-06-09 14:30', userId: 'U00007' },
  { id: 'A00003', applicant: '杭州晨辉数据有限公司', type: '企业认证', material: '营业执照+银行流水', submittedAt: '2026-06-10 09:00', userId: 'U00012' },
  { id: 'A00004', applicant: '上海绿洲人工智能研究院', type: '学术机构认证', material: '机构证明文件.pdf', submittedAt: '2026-06-11 16:45', userId: 'U00007' },
  { id: 'A00005', applicant: '深圳博远网络安全有限公司', type: '企业认证', material: '营业执照+安全资质证书', submittedAt: '2026-06-12 08:30', userId: 'U00011' },
];

function makeLog(id: string, evalType: string, status: TaskStatus, ts: string, model: string): string[] {
  const base = [
    `[${ts} +0.000s] ▶ Task ${id} accepted | service=${evalType} | worker=W04`,
    `[${ts} +0.312s] ✓ Input validation passed`,
    `[${ts} +1.120s] ✓ Model endpoint reachable: ${model}`,
    `[${ts} +1.820s] ✓ Eval framework loaded: XJ_EvalEngine v4.1`,
    `[${ts} +1.821s] ▷ Evaluation started on GPU CUDA:0`,
  ];
  if (status === 'completed') return [
    ...base,
    `[${ts} +8.440s] ✓ Batch 1/4 done (25%)`,
    `[${ts} +14.310s] ✓ Batch 2/4 done (50%)`,
    `[${ts} +20.890s] ✓ Batch 3/4 done (75%)`,
    `[${ts} +26.220s] ✓ Batch 4/4 done (100%)`,
    `[${ts} +27.010s] ✓ Score aggregation complete`,
    `[${ts} +27.340s] ✓ Task COMPLETED · risk_score=0.87 · verdict=pass`,
  ];
  if (status === 'failed') return [
    ...base,
    `[${ts} +3.210s] ✓ Pre-processing complete`,
    `[${ts} +4.510s] ✓ Batch 1/4 started`,
    `[${ts} +8.800s] ✗ ERROR: ${id.includes('001') ? 'CUDA out of memory. Tried to allocate 2.34 GiB (CUDA:0)' : id.includes('005') ? 'Task exceeded max execution time (300s). Forcibly terminated.' : 'API connection timeout after 30s (endpoint=' + model + ')'}`,
    `[${ts} +8.801s] ✗ Traceback: eval_runner.py:L242 → model_client.py:L88`,
    `[${ts} +8.802s] ✗ Task FAILED · exit_code=1`,
  ];
  return base;
}

const INIT_TASKS: MockTask[] = [
  // ── 大模型安全评测 ────────────────────────────────────────────
  {
    id: 'TASK-S-0612-001', userId: 'U00001', userName: '张伟',
    evalType: '大模型安全评测', model: 'GPT-4o', evalSet: '通用安全评测集-v3.1',
    submittedAt: '2026-06-12 08:05', status: 'failed', duration: '2m 34s',
    errorCode: 'GPU_OOM', errorMessage: 'CUDA out of memory. Tried to allocate 2.34 GiB (CUDA:0; 23.69 GiB total).',
    params: '{\n  "evalType": "大模型安全评测",\n  "model": "GPT-4o",\n  "evalSet": "通用安全评测集-v3.1",\n  "samples": 500,\n  "dimensions": ["价值对齐","对抗鲁棒性","隐私保护"]\n}',
    logs: makeLog('TASK-S-0612-001','大模型安全评测','failed','2026-06-12 08:05:12','GPT-4o'),
  },
  {
    id: 'TASK-S-0612-003', userId: 'U00004', userName: '王芳',
    evalType: '大模型安全评测', model: 'DeepSeek-V3', evalSet: '价值观对齐评测集-v2',
    submittedAt: '2026-06-12 08:30', status: 'running', duration: '1m 02s',
    params: '{"evalType":"大模型安全评测","model":"DeepSeek-V3","evalSet":"价值观对齐评测集-v2","samples":300}',
    logs: makeLog('TASK-S-0612-003','大模型安全评测','completed','2026-06-12 08:30:00','DeepSeek-V3'),
  },
  {
    id: 'TASK-S-0612-007', userId: 'U00011', userName: '黄磊',
    evalType: '大模型安全评测', model: 'Qwen-Max', evalSet: '通用安全评测集-v3.1',
    submittedAt: '2026-06-12 09:20', status: 'completed', duration: '3m 18s',
    params: '{"evalType":"大模型安全评测","model":"Qwen-Max","evalSet":"通用安全评测集-v3.1","samples":500}',
    logs: makeLog('TASK-S-0612-007','大模型安全评测','completed','2026-06-12 09:20:00','Qwen-Max'),
  },
  {
    id: 'TASK-S-0612-008', userId: 'U00001', userName: '张伟',
    evalType: '大模型安全评测', model: 'Claude-3.5-Sonnet', evalSet: '对抗鲁棒性测试集-v1',
    submittedAt: '2026-06-12 09:35', status: 'queued',
    params: '{"evalType":"大模型安全评测","model":"Claude-3.5-Sonnet","evalSet":"对抗鲁棒性测试集-v1"}',
    logs: [],
  },
  // ── 大模型性能评测 ────────────────────────────────────────────
  {
    id: 'TASK-P-0612-002', userId: 'U00002', userName: '刘敏',
    evalType: '大模型评测', model: 'GPT-3.5-turbo', evalSet: 'MMLU综合基准-EN',
    submittedAt: '2026-06-12 08:12', status: 'completed', duration: '0m 52s',
    params: '{"evalType":"大模型评测","model":"GPT-3.5-turbo","evalSet":"MMLU综合基准-EN","samples":100}',
    logs: makeLog('TASK-P-0612-002','大模型评测','completed','2026-06-12 08:12:05','GPT-3.5-turbo'),
  },
  {
    id: 'TASK-P-0612-009', userId: 'U00002', userName: '刘敏',
    evalType: '大模型评测', model: 'Llama-3-70B', evalSet: 'C-Eval中文理解基准',
    submittedAt: '2026-06-12 09:40', status: 'failed', duration: '1m 05s',
    errorCode: 'API_TIMEOUT', errorMessage: 'Connection timeout after 30s. Endpoint: api.llama3.local:8080 unreachable.',
    params: '{"evalType":"大模型评测","model":"Llama-3-70B","evalSet":"C-Eval中文理解基准","samples":200}',
    logs: makeLog('TASK-P-0612-009','大模型评测','failed','2026-06-12 09:40:00','Llama-3-70B'),
  },
  // ── 智能体安全评测 ────────────────────────────────────────────
  {
    id: 'TASK-A-0612-004', userId: 'U00006', userName: '孙晓燕',
    evalType: '智能体安全评测', model: 'GPT-4o (Agent Mode)', evalSet: 'WebArena-Safety-v1',
    submittedAt: '2026-06-12 08:44', status: 'completed', duration: '4m 12s',
    params: '{"evalType":"智能体安全评测","model":"GPT-4o (Agent Mode)","evalSet":"WebArena-Safety-v1","tasks":30}',
    logs: makeLog('TASK-A-0612-004','智能体安全评测','completed','2026-06-12 08:44:00','GPT-4o'),
  },
  {
    id: 'TASK-A-0612-005', userId: 'U00008', userName: '周雅婷',
    evalType: '智能体安全评测', model: 'AutoAgent-v2.1', evalSet: 'WebArena-Safety-v1',
    submittedAt: '2026-06-12 09:01', status: 'failed', duration: '4m 10s',
    errorCode: 'TASK_TIMEOUT', errorMessage: 'Task exceeded max execution time (300s). Worker forcibly terminated.',
    params: '{"evalType":"智能体安全评测","model":"AutoAgent-v2.1","evalSet":"WebArena-Safety-v1","tasks":50}',
    logs: makeLog('TASK-A-0612-005','智能体安全评测','failed','2026-06-12 09:01:30','AutoAgent-v2.1'),
  },
  // ── AIGC内容审核 ──────────────────────────────────────────────
  {
    id: 'TASK-C-0612-006', userId: 'U00010', userName: '郑秀英',
    evalType: 'AIGC内容审核', model: 'XJ-AIGC-Detector-v2.6', evalSet: '综合内容安全集-video',
    submittedAt: '2026-06-12 09:15', status: 'queued',
    params: '{"evalType":"AIGC内容审核","modality":"video","mode":"deepfake_detect","samples":20}',
    logs: [],
  },
  {
    id: 'TASK-C-0612-010', userId: 'U00006', userName: '孙晓燕',
    evalType: 'AIGC内容审核', model: 'XJ-AIGC-Detector-v2.6', evalSet: '综合内容安全集-audio',
    submittedAt: '2026-06-12 09:55', status: 'running', duration: '0m 38s',
    params: '{"evalType":"AIGC内容审核","modality":"audio","mode":"tts_detect","samples":50}',
    logs: makeLog('TASK-C-0612-010','AIGC内容审核','completed','2026-06-12 09:55:00','XJ-AIGC-Detector-v2.6'),
  },
  {
    id: 'TASK-C-0612-011', userId: 'U00004', userName: '王芳',
    evalType: 'AIGC内容审核', model: 'XJ-AIGC-Detector-v2.6', evalSet: '综合内容安全集-image',
    submittedAt: '2026-06-12 10:02', status: 'completed', duration: '0m 44s',
    params: '{"evalType":"AIGC内容审核","modality":"image","mode":"audit","samples":80}',
    logs: makeLog('TASK-C-0612-011','AIGC内容审核','completed','2026-06-12 10:02:00','XJ-AIGC-Detector-v2.6'),
  },
  // ── 模型数据安全评测 ──────────────────────────────────────────
  {
    id: 'TASK-D-0612-012', userId: 'U00008', userName: '周雅婷',
    evalType: '多模态大模型安全评测', model: 'GPT-4V', evalSet: '多模态隐私泄露测试集',
    submittedAt: '2026-06-12 10:18', status: 'completed', duration: '2m 19s',
    params: '{"evalType":"多模态大模型安全评测","model":"GPT-4V","evalSet":"多模态隐私泄露测试集","samples":100}',
    logs: makeLog('TASK-D-0612-012','多模态大模型安全评测','completed','2026-06-12 10:18:00','GPT-4V'),
  },
];

// ─── Style tokens ─────────────────────────────────────────────────
const SB_WIDTH = 240;
const S = { pageBg: '#f1f5f9' };

// ─── Status Badge with Tooltip ────────────────────────────────────
function TaskStatusBadge({ status, errorCode }: { status: TaskStatus; errorCode?: string }) {
  const [hov, setHov] = useState(false);
  const cfg: Record<TaskStatus, { label: string; bg: string; color: string; icon: React.ReactNode }> = {
    queued:    { label: '排队中', bg: 'rgba(148,163,184,0.15)', color: '#64748b', icon: <Clock size={10} /> },
    running:   { label: '运行中', bg: 'rgba(59,130,246,0.12)',  color: '#2563eb', icon: <Activity size={10} /> },
    completed: { label: '成功',   bg: 'rgba(34,197,94,0.12)',   color: '#16a34a', icon: <CheckCircle size={10} /> },
    failed:    { label: '失败',   bg: 'rgba(239,68,68,0.12)',   color: '#dc2626', icon: <XCircle size={10} /> },
  };
  const c = cfg[status];
  return (
    <div style={{ position: 'relative', display: 'inline-block' }}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, background: c.bg, color: c.color, border: `1px solid ${c.color}30`, cursor: errorCode ? 'help' : 'default' }}>
        {c.icon}{c.label}
        {errorCode && <span style={{ fontSize: 9, opacity: 0.7 }}>?</span>}
      </span>
      {hov && errorCode && (
        <div style={{ position: 'absolute', bottom: 'calc(100% + 6px)', left: 0, background: '#0f172a', color: '#fff', padding: '6px 10px', borderRadius: 7, fontSize: 11, whiteSpace: 'nowrap', zIndex: 200, boxShadow: '0 4px 14px rgba(0,0,0,0.3)', lineHeight: 1.5, maxWidth: 280 }}>
          <span style={{ color: '#ef4444', fontWeight: 700, fontFamily: 'monospace', marginRight: 5 }}>[{errorCode}]</span>
          <span style={{ color: '#94a3b8' }}>{
            errorCode === 'GPU_OOM' ? 'CUDA Out of Memory' :
            errorCode === 'API_TIMEOUT' ? 'API Connection Timeout' :
            errorCode === 'TASK_TIMEOUT' ? 'Task Execution Timeout' :
            errorCode === 'CODEC_ERROR' ? 'Unsupported Video Codec' :
            errorCode
          }</span>
          <div style={{ position: 'absolute', top: '100%', left: 14, width: 0, height: 0, borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderTop: '5px solid #0f172a' }} />
        </div>
      )}
    </div>
  );
}

// ─── User Status Badge ────────────────────────────────────────────
function UserStatusBadge({ status }: { status: UserStatus }) {
  const cfg: Record<UserStatus, { label: string; bg: string; color: string }> = {
    active:  { label: '正常',   bg: 'rgba(34,197,94,0.12)',  color: '#16a34a' },
    pending: { label: '待审核', bg: 'rgba(245,158,11,0.14)', color: '#d97706' },
    banned:  { label: '已封禁', bg: 'rgba(239,68,68,0.12)',  color: '#dc2626' },
  };
  const c = cfg[status];
  return <span style={{ padding: '2px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, background: c.bg, color: c.color, border: `1px solid ${c.color}30` }}>{c.label}</span>;
}

// ─── Log Drawer ───────────────────────────────────────────────────
function LogDrawer({ task, onClose }: { task: MockTask; onClose: () => void }) {
  const cfg = SERVICE_GROUPS[task.evalType] ?? { label: task.evalType, color: '#6b7280', icon: LayoutGrid };
  const Icon = cfg.icon;
  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.45)', zIndex: 200, backdropFilter: 'blur(3px)' }} />
      <div style={{ position: 'fixed', right: 0, top: 0, bottom: 0, width: 560, background: '#fff', zIndex: 201, display: 'flex', flexDirection: 'column', boxShadow: '-10px 0 40px rgba(0,0,0,0.18)', animation: 'slideIn 0.22s ease' }}>

        {/* Header */}
        <div style={{ padding: '18px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'flex-start', gap: 12, flexShrink: 0 }}>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: cfg.bg ?? 'rgba(99,102,241,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Icon size={16} style={{ color: cfg.color }} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: '#0f172a' }}>运行日志 / Debug</div>
            <div style={{ fontSize: 11.5, color: '#64748b', marginTop: 2, fontFamily: 'monospace' }}>{task.id}</div>
          </div>
          <button onClick={onClose} style={{ width: 30, height: 30, border: 'none', borderRadius: 7, background: '#f1f5f9', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <X size={14} color="#64748b" />
          </button>
        </div>

        {/* Task Meta */}
        <div style={{ padding: '12px 24px', borderBottom: '1px solid #f1f5f9', background: '#f8fafc', flexShrink: 0 }}>
          <div style={{ display: 'flex', gap: 20, fontSize: 12 }}>
            <div><span style={{ color: '#94a3b8' }}>评测模型：</span><strong style={{ color: '#0f172a', fontFamily: 'monospace' }}>{task.model}</strong></div>
            <div><span style={{ color: '#94a3b8' }}>评测集：</span><strong style={{ color: '#0f172a' }}>{task.evalSet}</strong></div>
            <div><span style={{ color: '#94a3b8' }}>耗时：</span><strong style={{ color: '#0f172a' }}>{task.duration ?? '—'}</strong></div>
          </div>
        </div>

        {/* Error banner */}
        {task.errorMessage && (
          <div style={{ margin: '12px 24px 0', padding: '10px 14px', background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 8, flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 5 }}>
              <AlertTriangle size={13} color="#dc2626" />
              <span style={{ fontSize: 11.5, fontWeight: 700, color: '#dc2626' }}>错误信息 [{task.errorCode}]</span>
            </div>
            <code style={{ fontSize: 12, color: '#991b1b', fontFamily: 'monospace', lineHeight: 1.6 }}>{task.errorMessage}</code>
          </div>
        )}

        {/* Logs */}
        <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', margin: '12px 24px 0' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Terminal size={12} />系统日志
          </div>
          <div style={{ flex: 1, background: '#0f172a', borderRadius: 10, padding: '14px 16px', overflow: 'auto', fontFamily: '"JetBrains Mono",Consolas,monospace', fontSize: 12, lineHeight: 1.85 }}>
            {(task.logs ?? []).map((line, i) => {
              const isErr = line.includes('✗') || line.includes('ERROR') || line.includes('FAILED');
              const isOk  = line.includes('✓') || line.includes('COMPLETED');
              const isWarn = line.includes('▶') || line.includes('▷');
              return (
                <div key={i} style={{ color: isErr ? '#fca5a5' : isOk ? '#86efac' : isWarn ? '#fbbf24' : '#64748b' }}>{line}</div>
              );
            })}
            {(!task.logs || task.logs.length === 0) && <div style={{ color: '#334155' }}>暂无日志记录</div>}
          </div>
        </div>

        {/* Footer actions */}
        <div style={{ padding: '14px 24px', borderTop: '1px solid #e2e8f0', display: 'flex', gap: 10, flexShrink: 0 }}>
          {task.status === 'failed' && (
            <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 18px', border: 'none', borderRadius: 8, background: '#2563eb', color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer', flex: 1, justifyContent: 'center' }}>
              <RotateCcw size={13} /> 重试任务
            </button>
          )}
          <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 18px', border: '1.5px solid #e2e8f0', borderRadius: 8, background: '#f8fafc', color: '#374151', fontWeight: 600, fontSize: 13, cursor: 'pointer', flex: task.status === 'failed' ? 'unset' : 1, justifyContent: 'center' }}>
            <Download size={13} /> 下载完整日志
          </button>
        </div>
      </div>
      <style>{`@keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }`}</style>
    </>
  );
}

// ─── Grouped Task Table ───────────────────────────────────────────
function GroupedTaskTable({ tasks, serviceFilter, searchQuery, statusFilter, onShowLog }: {
  tasks: MockTask[];
  serviceFilter: string;
  searchQuery: string;
  statusFilter: string;
  onShowLog: (t: MockTask) => void;
}) {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [confirm, setConfirm] = useState<{ type: 'retry' | 'terminate'; taskId: string } | null>(null);
  const [toast, setToast] = useState('');
  const [taskList, setTaskList] = useState(tasks);
  const showToast = (m: string) => { setToast(m); setTimeout(() => setToast(''), 3000); };

  // Filter
  const filtered = taskList.filter(t => {
    const q = searchQuery.toLowerCase();
    const matchQ = !q || t.id.toLowerCase().includes(q) || t.userName.toLowerCase().includes(q) || t.model.toLowerCase().includes(q);
    const matchSvc = serviceFilter === 'all' || t.evalType === serviceFilter;
    const matchSt = statusFilter === 'all' || t.status === statusFilter;
    return matchQ && matchSvc && matchSt;
  });

  // Group by evalType
  const groupMap = new Map<string, MockTask[]>();
  for (const t of filtered) {
    if (!groupMap.has(t.evalType)) groupMap.set(t.evalType, []);
    groupMap.get(t.evalType)!.push(t);
  }
  const groups = Array.from(groupMap.entries()).sort((a, b) => {
    const aFail = a[1].some(t => t.status === 'failed') ? -1 : 0;
    const bFail = b[1].some(t => t.status === 'failed') ? -1 : 0;
    return aFail - bFail;
  });

  const thStyle: React.CSSProperties = { padding: '9px 14px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' };

  if (groups.length === 0) {
    return (
      <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', padding: '48px 0', textAlign: 'center', color: '#94a3b8', fontSize: 13 }}>
        <LayoutGrid size={32} color="#e2e8f0" style={{ margin: '0 auto 12px' }} />暂无符合条件的任务
      </div>
    );
  }

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {groups.map(([evalType, groupTasks]) => {
          const cfg = SERVICE_GROUPS[evalType] ?? { label: evalType, subtitle: '', color: '#6b7280', bg: 'rgba(107,114,128,0.08)', icon: LayoutGrid };
          const Icon = cfg.icon;
          const isOpen = !collapsed[evalType];
          const failCount = groupTasks.filter(t => t.status === 'failed').length;

          return (
            <div key={evalType} style={{ background: '#fff', borderRadius: 12, border: `1px solid ${failCount > 0 ? 'rgba(239,68,68,0.3)' : '#e2e8f0'}`, overflow: 'hidden', boxShadow: failCount > 0 ? '0 2px 12px rgba(239,68,68,0.08)' : '0 2px 8px rgba(0,0,0,0.04)' }}>

              {/* Group header */}
              <button onClick={() => setCollapsed(c => ({ ...c, [evalType]: !c[evalType] }))}
                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px', border: 'none', background: isOpen ? '#fff' : '#fafafa', cursor: 'pointer', borderBottom: isOpen ? '1px solid #f1f5f9' : 'none', textAlign: 'left', transition: 'background 0.15s' }}>
                <div style={{ width: 34, height: 34, borderRadius: 9, background: cfg.bg, border: `1.5px solid ${cfg.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={15} style={{ color: cfg.color }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontWeight: 800, color: '#0f172a', fontSize: 13.5 }}>{cfg.label}</span>
                    {cfg.subtitle && <span style={{ fontSize: 10, padding: '1px 7px', borderRadius: 20, background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.color}25`, fontWeight: 600 }}>{cfg.subtitle}</span>}
                    {failCount > 0 && (
                      <span style={{ fontSize: 10, padding: '1px 8px', borderRadius: 20, background: 'rgba(239,68,68,0.12)', color: '#dc2626', border: '1px solid rgba(239,68,68,0.3)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 3 }}>
                        <AlertTriangle size={9} />⚠ {failCount} 个失败
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>共 {groupTasks.length} 个任务 · 最近：{groupTasks[0]?.submittedAt?.slice(0, 10)}</div>
                </div>
                <span style={{ padding: '2px 9px', borderRadius: 20, fontSize: 11, fontWeight: 700, background: cfg.bg, color: cfg.color }}>{groupTasks.length}</span>
                <ChevronDown size={15} color="#94a3b8" style={{ transform: isOpen ? 'rotate(0deg)' : 'rotate(-90deg)', transition: 'transform 0.2s', flexShrink: 0 }} />
              </button>

              {/* Task table */}
              {isOpen && (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5 }}>
                    <thead>
                      <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                        <th style={thStyle}>任务ID</th>
                        <th style={thStyle}>所属用户</th>
                        <th style={thStyle}>评测模型</th>
                        <th style={thStyle}>评测集</th>
                        <th style={thStyle}>提交时间</th>
                        <th style={thStyle}>耗时</th>
                        <th style={thStyle}>状态</th>
                        <th style={thStyle}>操作</th>
                      </tr>
                    </thead>
                    <tbody>
                      {groupTasks.map((t, i) => (
                        <tr key={t.id} style={{ borderBottom: i < groupTasks.length - 1 ? '1px solid #f1f5f9' : 'none', background: t.status === 'failed' ? 'rgba(239,68,68,0.025)' : 'transparent', borderLeft: t.status === 'failed' ? '3px solid #ef4444' : '3px solid transparent' }}>
                          <td style={{ padding: '11px 14px', fontFamily: 'monospace', fontSize: 11, color: '#374151' }}>{t.id}</td>
                          <td style={{ padding: '11px 14px' }}>
                            <div style={{ fontWeight: 600, color: '#0f172a' }}>{t.userName}</div>
                            <div style={{ fontSize: 10.5, color: '#94a3b8' }}>{t.userId}</div>
                          </td>
                          <td style={{ padding: '11px 14px' }}>
                            <div style={{ fontWeight: 600, color: '#0f172a', fontFamily: 'monospace', fontSize: 11.5 }}>{t.model}</div>
                          </td>
                          <td style={{ padding: '11px 14px', maxWidth: 140 }}>
                            <div style={{ color: '#374151', fontSize: 11.5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={t.evalSet}>{t.evalSet}</div>
                          </td>
                          <td style={{ padding: '11px 14px', color: '#64748b', fontSize: 11.5, whiteSpace: 'nowrap' }}>{t.submittedAt}</td>
                          <td style={{ padding: '11px 14px', fontFamily: 'monospace', fontSize: 11.5, color: t.status === 'failed' ? '#dc2626' : '#64748b', fontWeight: t.status === 'failed' ? 700 : 400 }}>{t.duration ?? '—'}</td>
                          <td style={{ padding: '11px 14px' }}>
                            <TaskStatusBadge status={t.status} errorCode={t.errorCode} />
                          </td>
                          <td style={{ padding: '11px 14px' }}>
                            <div style={{ display: 'flex', gap: 5 }}>
                              {/* Log/Debug — primary action for failed */}
                              <ActionBtn icon={<Terminal size={11} />} label="日志" onClick={() => onShowLog(t)}
                                color={t.status === 'failed' ? '#6366f1' : '#64748b'} bold={t.status === 'failed'} />
                              {t.status === 'failed' && (
                                <ActionBtn icon={<RotateCcw size={11} />} label="重试" onClick={() => setConfirm({ type: 'retry', taskId: t.id })} color="#2563eb" bold />
                              )}
                              {(t.status === 'running' || t.status === 'queued') && (
                                <ActionBtn icon={<StopCircle size={11} />} label="终止" onClick={() => setConfirm({ type: 'terminate', taskId: t.id })} color="#dc2626" />
                              )}
                              {t.status === 'completed' && (
                                <ActionBtn icon={<Eye size={11} />} label="详情" onClick={() => {}} color="#10b981" />
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {confirm && (
        <ConfirmDialog
          danger={confirm.type === 'terminate'}
          title={confirm.type === 'retry' ? '确认重试任务' : '确认终止任务'}
          message={confirm.type === 'retry' ? '该任务将重新加入处理队列，资源消耗将被重新计量。' : '终止后任务无法恢复，请确认。'}
          confirmLabel={confirm.type === 'retry' ? '确认重试' : '确认终止'}
          onConfirm={() => {
            setTaskList(ts => ts.map(t => t.id === confirm.taskId ? { ...t, status: confirm.type === 'retry' ? 'queued' : 'failed' } : t));
            showToast(confirm.type === 'retry' ? '任务已重新加入队列' : '任务已终止');
            setConfirm(null);
          }}
          onCancel={() => setConfirm(null)} />
      )}
      {toast && <Toast msg={toast} />}
    </>
  );
}

// ─── Task Monitor Section ─────────────────────────────────────────
function TaskMonitorSection() {
  const [serviceFilter, setServiceFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [logTask, setLogTask] = useState<MockTask | null>(null);

  const tasks = INIT_TASKS;
  const counts = {
    total: tasks.length,
    running: tasks.filter(t => t.status === 'running').length,
    completed: tasks.filter(t => t.status === 'completed').length,
    failed: tasks.filter(t => t.status === 'failed').length,
  };

  // Avg duration of completed tasks
  const completedWithDuration = tasks.filter(t => t.status === 'completed' && t.duration);
  const avgMin = completedWithDuration.reduce((sum, t) => {
    const m = parseInt(t.duration?.split('m')[0] ?? '0');
    const s = parseInt(t.duration?.split('m')[1] ?? '0');
    return sum + m * 60 + s;
  }, 0) / (completedWithDuration.length || 1);
  const avgStr = `${Math.floor(avgMin / 60)}m ${Math.round(avgMin % 60)}s`;

  // Service breakdown
  const svcCount = Object.keys(SERVICE_GROUPS).map(k => ({
    key: k, label: SERVICE_GROUPS[k].label, color: SERVICE_GROUPS[k].color,
    count: tasks.filter(t => t.evalType === k).length,
  })).filter(s => s.count > 0).sort((a, b) => b.count - a.count);
  const totalTasks = tasks.length;

  const inputStyle: React.CSSProperties = { padding: '7px 12px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 12.5, outline: 'none', background: '#fff', color: '#0f172a' };

  return (
    <>
      {/* ── Stats row ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12, marginBottom: 20 }}>
        {[
          { label: '今日总任务', value: counts.total, color: '#3b82f6', bg: 'rgba(59,130,246,0.08)', icon: <BarChart2 size={17} color="#3b82f6" /> },
          { label: '运行中', value: counts.running, color: '#f59e0b', bg: 'rgba(245,158,11,0.08)', icon: <Activity size={17} color="#f59e0b" /> },
          { label: '成功', value: counts.completed, color: '#16a34a', bg: 'rgba(34,197,94,0.08)', icon: <CheckCircle size={17} color="#16a34a" /> },
          { label: '失败/异常', value: counts.failed, color: '#dc2626', bg: 'rgba(239,68,68,0.08)', icon: <AlertTriangle size={17} color="#dc2626" /> },
          { label: '平均耗时', value: avgStr, color: '#6366f1', bg: 'rgba(99,102,241,0.08)', icon: <TrendingUp size={17} color="#6366f1" /> },
        ].map(m => (
          <div key={m.label} style={{ background: '#fff', border: `1px solid ${m.color}22`, borderRadius: 11, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12, boxShadow: `0 2px 8px ${m.color}0d` }}>
            <div style={{ width: 38, height: 38, borderRadius: 9, background: m.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{m.icon}</div>
            <div>
              <div style={{ fontSize: 20, fontWeight: 900, color: m.color, lineHeight: 1 }}>{m.value}</div>
              <div style={{ fontSize: 11, color: '#64748b', marginTop: 3 }}>{m.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Service distribution bar ── */}
      <div style={{ background: '#fff', borderRadius: 11, border: '1px solid #e2e8f0', padding: '14px 18px', marginBottom: 18, display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
          <Layers size={13} color="#64748b" />
          <span style={{ fontSize: 11.5, fontWeight: 700, color: '#64748b' }}>服务分布</span>
        </div>
        {/* Stacked bar */}
        <div style={{ flex: 1, display: 'flex', height: 8, borderRadius: 4, overflow: 'hidden', gap: 1 }}>
          {svcCount.map(s => (
            <div key={s.key} title={`${s.label}: ${s.count}个`} style={{ flex: s.count, background: s.color, minWidth: 4, cursor: 'pointer' }}
              onClick={() => setServiceFilter(serviceFilter === s.key ? 'all' : s.key)} />
          ))}
        </div>
        {/* Legend */}
        <div style={{ display: 'flex', gap: 12, flexShrink: 0, flexWrap: 'wrap' }}>
          {svcCount.map(s => (
            <div key={s.key} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: '#64748b', cursor: 'pointer', opacity: serviceFilter === 'all' || serviceFilter === s.key ? 1 : 0.45 }}
              onClick={() => setServiceFilter(serviceFilter === s.key ? 'all' : s.key)}>
              <div style={{ width: 8, height: 8, borderRadius: 2, background: s.color, flexShrink: 0 }} />
              {s.label.length > 8 ? s.label.slice(0, 8) + '…' : s.label} ({Math.round(s.count / totalTasks * 100)}%)
            </div>
          ))}
        </div>
      </div>

      {/* ── Filters ── */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 16, alignItems: 'center', flexWrap: 'wrap' }}>
        {/* Service pills */}
        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
          {[{ key: 'all', label: '全部服务' }, ...Object.entries(SERVICE_GROUPS).map(([k, v]) => ({ key: k, label: v.label }))].map(opt => (
            <button key={opt.key} onClick={() => setServiceFilter(opt.key)}
              style={{ padding: '5px 12px', border: `1.5px solid ${serviceFilter === opt.key ? (SERVICE_GROUPS[opt.key]?.color ?? '#2563eb') : '#e2e8f0'}`, borderRadius: 20, fontSize: 11.5, fontWeight: serviceFilter === opt.key ? 700 : 500, background: serviceFilter === opt.key ? `${SERVICE_GROUPS[opt.key]?.bg ?? 'rgba(37,99,235,0.08)'}` : '#fff', color: serviceFilter === opt.key ? (SERVICE_GROUPS[opt.key]?.color ?? '#2563eb') : '#64748b', cursor: 'pointer', transition: 'all 0.15s' }}>
              {opt.label}
            </button>
          ))}
        </div>
        <div style={{ flex: 1 }} />
        {/* Search */}
        <div style={{ position: 'relative' }}>
          <Search size={13} color="#94a3b8" style={{ position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
          <input placeholder="搜ID/用户/模型..." value={search} onChange={e => setSearch(e.target.value)} style={{ ...inputStyle, paddingLeft: 30, width: 180 }} />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}>
          <option value="all">全部状态</option>
          <option value="queued">排队中</option>
          <option value="running">运行中</option>
          <option value="completed">成功</option>
          <option value="failed">失败</option>
        </select>
      </div>

      {/* ── Grouped Table ── */}
      <GroupedTaskTable tasks={tasks} serviceFilter={serviceFilter} searchQuery={search} statusFilter={statusFilter} onShowLog={setLogTask} />

      {/* ── Log Drawer ── */}
      {logTask && <LogDrawer task={logTask} onClose={() => setLogTask(null)} />}
    </>
  );
}

// ─── User List ────────────────────────────────────────────────────
function UserListSection() {
  const [users, setUsers] = useState<MockUser[]>(INIT_USERS);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<UserStatus | 'all'>('all');
  const [editUser, setEditUser] = useState<MockUser | null>(null);
  const [confirm, setConfirm] = useState<{ type: 'ban' | 'unban' | 'delete' | 'resetpw'; userId: string } | null>(null);
  const [toast, setToast] = useState('');
  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const filtered = users.filter(u => {
    const q = search.toLowerCase();
    return (!q || u.name.includes(q) || u.id.toLowerCase().includes(q) || u.email.toLowerCase().includes(q))
      && (statusFilter === 'all' || u.status === statusFilter);
  });

  const handleConfirm = () => {
    if (!confirm) return;
    if (confirm.type === 'delete') { setUsers(us => us.filter(u => u.id !== confirm.userId)); showToast('用户已删除'); }
    else if (confirm.type === 'ban') { setUsers(us => us.map(u => u.id === confirm.userId ? { ...u, status: 'banned' } : u)); showToast('用户已封禁'); }
    else if (confirm.type === 'unban') { setUsers(us => us.map(u => u.id === confirm.userId ? { ...u, status: 'active' } : u)); showToast('用户已解封'); }
    else { showToast('密码重置邮件已发送'); }
    setConfirm(null);
  };

  const inputStyle: React.CSSProperties = { padding: '8px 12px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 13, outline: 'none', background: '#fff', color: '#0f172a' };

  return (
    <div>
      <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 200, maxWidth: 320 }}>
          <Search size={14} color="#94a3b8" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
          <input placeholder="搜索用户名 / ID / 邮箱..." value={search} onChange={e => setSearch(e.target.value)} style={{ ...inputStyle, paddingLeft: 32, width: '100%', boxSizing: 'border-box' }} />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as UserStatus | 'all')} style={{ ...inputStyle, minWidth: 130, cursor: 'pointer' }}>
          <option value="all">全部状态</option>
          <option value="active">正常</option>
          <option value="pending">待审核</option>
          <option value="banned">已封禁</option>
        </select>
        <div style={{ marginLeft: 'auto', fontSize: 12, color: '#94a3b8' }}>共 {filtered.length} 条</div>
      </div>
      <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              {['用户ID','用户名','邮箱 / 手机','注册时间','状态','最后登录','操作'].map(h => (
                <th key={h} style={{ padding: '11px 14px', textAlign: 'left', fontSize: 11.5, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((u, i) => (
              <tr key={u.id} style={{ borderBottom: i < filtered.length - 1 ? '1px solid #f1f5f9' : 'none', background: u.status === 'banned' ? 'rgba(239,68,68,0.03)' : 'transparent' }}>
                <td style={{ padding: '11px 14px', fontFamily: 'monospace', fontSize: 12, color: '#64748b' }}>{u.id}</td>
                <td style={{ padding: '11px 14px' }}>
                  <div style={{ fontWeight: 600, color: '#0f172a' }}>{u.name}</div>
                  <div style={{ fontSize: 11, color: '#94a3b8' }}>{u.role === 'enterprise' ? '企业用户' : '普通用户'}</div>
                </td>
                <td style={{ padding: '11px 14px' }}>
                  <div style={{ color: '#374151' }}>{u.email}</div>
                  <div style={{ fontSize: 11, color: '#94a3b8' }}>{u.phone}</div>
                </td>
                <td style={{ padding: '11px 14px', color: '#64748b', fontSize: 12, whiteSpace: 'nowrap' }}>{u.registeredAt}</td>
                <td style={{ padding: '11px 14px' }}><UserStatusBadge status={u.status} /></td>
                <td style={{ padding: '11px 14px', color: '#64748b', fontSize: 12, whiteSpace: 'nowrap' }}>{u.lastLogin}</td>
                <td style={{ padding: '11px 14px' }}>
                  <div style={{ display: 'flex', gap: 5 }}>
                    <ActionBtn icon={<Edit2 size={12} />} label="编辑" onClick={() => setEditUser(u)} />
                    <ActionBtn icon={<Lock size={12} />} label="重置密码" onClick={() => setConfirm({ type: 'resetpw', userId: u.id })} color="#6366f1" />
                    {u.status === 'banned'
                      ? <ActionBtn icon={<Unlock size={12} />} label="解封" onClick={() => setConfirm({ type: 'unban', userId: u.id })} color="#16a34a" />
                      : <ActionBtn icon={<Lock size={12} />} label="封禁" onClick={() => setConfirm({ type: 'ban', userId: u.id })} color="#f97316" />}
                    <ActionBtn icon={<Trash2 size={12} />} label="删除" onClick={() => setConfirm({ type: 'delete', userId: u.id })} color="#dc2626" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <div style={{ padding: '40px 0', textAlign: 'center', color: '#94a3b8', fontSize: 13 }}>暂无匹配用户</div>}
      </div>
      {editUser && (
        <EditUserModal user={editUser} onClose={() => setEditUser(null)}
          onSave={saved => { setUsers(us => us.map(u => u.id === saved.id ? saved : u)); setEditUser(null); showToast('用户信息已更新'); }} />
      )}
      {confirm && (
        <ConfirmDialog danger={confirm.type === 'delete' || confirm.type === 'ban'}
          title={confirm.type === 'delete' ? '确认删除用户' : confirm.type === 'ban' ? '确认封禁用户' : confirm.type === 'unban' ? '确认解封用户' : '确认重置密码'}
          message={confirm.type === 'delete' ? '此操作不可撤销，用户数据将被永久删除。' : confirm.type === 'ban' ? '封禁后该用户将无法登录，可随时解封。' : confirm.type === 'unban' ? '解封后用户将恢复正常访问权限。' : '系统将向用户邮箱发送密码重置链接。'}
          confirmLabel={confirm.type === 'delete' ? '确认删除' : confirm.type === 'ban' ? '确认封禁' : confirm.type === 'unban' ? '确认解封' : '发送重置邮件'}
          onConfirm={handleConfirm} onCancel={() => setConfirm(null)} />
      )}
      {toast && <Toast msg={toast} />}
    </div>
  );
}

// ─── User Audit ───────────────────────────────────────────────────
function UserAuditSection() {
  const [items, setItems] = useState<AuditRequest[]>(INIT_AUDIT);
  const [rejectTarget, setRejectTarget] = useState<AuditRequest | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [toast, setToast] = useState('');
  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ fontSize: 13, color: '#64748b' }}>共 <strong style={{ color: '#0f172a' }}>{items.length}</strong> 条待审核申请</div>
      </div>
      <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              {['申请ID','申请人','申请类型','提交材料','申请时间','操作'].map(h => (
                <th key={h} style={{ padding: '11px 14px', textAlign: 'left', fontSize: 11.5, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => (
              <tr key={item.id} style={{ borderBottom: i < items.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                <td style={{ padding: '13px 14px', fontFamily: 'monospace', fontSize: 12, color: '#64748b' }}>{item.id}</td>
                <td style={{ padding: '13px 14px' }}>
                  <div style={{ fontWeight: 600, color: '#0f172a' }}>{item.applicant}</div>
                  <div style={{ fontSize: 11, color: '#94a3b8' }}>UID: {item.userId}</div>
                </td>
                <td style={{ padding: '13px 14px' }}>
                  <span style={{ padding: '2px 10px', borderRadius: 6, fontSize: 11, fontWeight: 600, background: 'rgba(99,102,241,0.1)', color: '#4f46e5', border: '1px solid rgba(99,102,241,0.25)' }}>{item.type}</span>
                </td>
                <td style={{ padding: '13px 14px' }}>
                  <button style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '4px 10px', border: '1px solid #e2e8f0', borderRadius: 6, background: '#f8fafc', color: '#374151', fontSize: 12, cursor: 'pointer', fontWeight: 500 }}>
                    <Eye size={12} />{item.material}
                  </button>
                </td>
                <td style={{ padding: '13px 14px', color: '#64748b', fontSize: 12, whiteSpace: 'nowrap' }}>{item.submittedAt}</td>
                <td style={{ padding: '13px 14px' }}>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button onClick={() => { setItems(its => its.filter(it => it.id !== item.id)); showToast(`已通过 ${item.applicant} 的申请`); }}
                      style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '5px 12px', border: 'none', borderRadius: 6, background: '#16a34a', color: '#fff', fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>
                      <CheckCircle size={12} /> 通过
                    </button>
                    <button onClick={() => { setRejectTarget(item); setRejectReason(''); }}
                      style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '5px 12px', border: '1.5px solid #dc2626', borderRadius: 6, background: '#fff', color: '#dc2626', fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>
                      <XCircle size={12} /> 驳回
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {items.length === 0 && (
          <div style={{ padding: '48px 0', textAlign: 'center' }}>
            <CheckCircle size={36} color="#22c55e" style={{ margin: '0 auto 10px' }} />
            <div style={{ fontSize: 14, color: '#64748b' }}>暂无待审核申请，队列清空 ✓</div>
          </div>
        )}
      </div>
      {rejectTarget && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.55)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: '28px 32px', width: 440, boxShadow: '0 24px 64px rgba(0,0,0,0.18)' }}>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', marginBottom: 6 }}>填写驳回原因</div>
            <div style={{ fontSize: 13, color: '#64748b', marginBottom: 16 }}>申请人：{rejectTarget.applicant}</div>
            <textarea value={rejectReason} onChange={e => setRejectReason(e.target.value)} placeholder="请填写详细的驳回原因..." rows={4}
              style={{ width: '100%', boxSizing: 'border-box', padding: '10px 12px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 13, resize: 'vertical', outline: 'none', fontFamily: 'inherit', lineHeight: 1.7 }} />
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 16 }}>
              <button onClick={() => setRejectTarget(null)} style={{ padding: '8px 20px', borderRadius: 8, border: '1.5px solid #e2e8f0', background: '#fff', color: '#374151', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>取消</button>
              <button disabled={!rejectReason.trim()} onClick={() => { setItems(its => its.filter(it => it.id !== rejectTarget.id)); showToast(`已驳回 ${rejectTarget.applicant} 的申请`); setRejectTarget(null); }}
                style={{ padding: '8px 20px', borderRadius: 8, border: 'none', background: !rejectReason.trim() ? '#94a3b8' : '#dc2626', color: '#fff', fontWeight: 700, fontSize: 13, cursor: !rejectReason.trim() ? 'not-allowed' : 'pointer' }}>确认驳回</button>
            </div>
          </div>
        </div>
      )}
      {toast && <Toast msg={toast} />}
    </div>
  );
}

// ─── Generic helpers ──────────────────────────────────────────────
function ActionBtn({ icon, label, onClick, color = '#64748b', bold }: { icon: React.ReactNode; label: string; onClick: () => void; color?: string; bold?: boolean }) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} title={label}
      style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 9px', border: `1.5px solid ${hov || bold ? color : '#e2e8f0'}`, borderRadius: 6, background: hov || bold ? `${color}12` : '#fff', color: hov || bold ? color : '#64748b', fontSize: 11.5, fontWeight: bold ? 700 : 600, cursor: 'pointer', transition: 'all 0.15s', whiteSpace: 'nowrap' }}>
      {icon}{label}
    </button>
  );
}

function Toast({ msg }: { msg: string }) {
  return (
    <div style={{ position: 'fixed', bottom: 28, left: '50%', transform: 'translateX(-50%)', background: '#0f172a', color: '#fff', padding: '10px 20px', borderRadius: 10, fontSize: 13, fontWeight: 600, zIndex: 2000, boxShadow: '0 8px 24px rgba(0,0,0,0.25)', display: 'flex', alignItems: 'center', gap: 8 }}>
      <CheckCircle size={14} color="#22c55e" /> {msg}
    </div>
  );
}

// ─── Confirm Dialog ───────────────────────────────────────────────
interface ConfirmDialogProps { title: string; message: string; danger?: boolean; confirmLabel?: string; onConfirm: () => void; onCancel: () => void; }
function ConfirmDialog({ title, message, danger, confirmLabel = '确认', onConfirm, onCancel }: ConfirmDialogProps) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.55)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
      <div style={{ background: '#fff', borderRadius: 16, padding: '28px 32px', width: 420, maxWidth: '90vw', boxShadow: '0 24px 64px rgba(0,0,0,0.18)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 20 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: danger ? 'rgba(239,68,68,0.1)' : 'rgba(59,130,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            {danger ? <AlertTriangle size={20} color="#dc2626" /> : <AlertCircle size={20} color="#2563eb" />}
          </div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', marginBottom: 6 }}>{title}</div>
            <div style={{ fontSize: 13.5, color: '#475569', lineHeight: 1.7 }}>{message}</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button onClick={onCancel} style={{ padding: '8px 20px', borderRadius: 8, border: '1.5px solid #e2e8f0', background: '#fff', color: '#374151', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>取消</button>
          <button onClick={onConfirm} style={{ padding: '8px 20px', borderRadius: 8, border: 'none', background: danger ? '#dc2626' : '#2563eb', color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}

// ─── Edit User Modal ──────────────────────────────────────────────
function EditUserModal({ user, onSave, onClose }: { user: MockUser; onSave: (u: MockUser) => void; onClose: () => void }) {
  const [form, setForm] = useState({ name: user.name, email: user.email, role: user.role });
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.55)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
      <div style={{ background: '#fff', borderRadius: 16, padding: '28px 32px', width: 440, maxWidth: '90vw', boxShadow: '0 24px 64px rgba(0,0,0,0.18)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <div style={{ fontSize: 16, fontWeight: 800, color: '#0f172a' }}>编辑用户 · {user.id}</div>
          <button onClick={onClose} style={{ width: 28, height: 28, border: 'none', borderRadius: 6, background: '#f1f5f9', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={14} color="#64748b" /></button>
        </div>
        {[['用户名', 'name', 'text'], ['邮箱', 'email', 'email']].map(([label, key, type]) => (
          <div key={key} style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 6 }}>{label}</label>
            <input type={type} value={form[key as keyof typeof form] as string} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
              style={{ width: '100%', boxSizing: 'border-box', padding: '9px 12px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 13, outline: 'none' }} />
          </div>
        ))}
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 6 }}>账户类型</label>
          <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value as 'user' | 'enterprise' }))}
            style={{ width: '100%', padding: '9px 12px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 13, outline: 'none', background: '#fff' }}>
            <option value="user">普通用户</option>
            <option value="enterprise">企业用户</option>
          </select>
        </div>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{ padding: '8px 20px', borderRadius: 8, border: '1.5px solid #e2e8f0', background: '#fff', color: '#374151', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>取消</button>
          <button onClick={() => onSave({ ...user, ...form })} style={{ padding: '8px 20px', borderRadius: 8, border: 'none', background: '#2563eb', color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>保存修改</button>
        </div>
      </div>
    </div>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────
function Sidebar({ active, setActive, pendingAudit, failedTasks }: { active: AdminSection; setActive: (s: AdminSection) => void; pendingAudit: number; failedTasks: number }) {
  const navItems: { section: AdminSection; icon: React.ReactNode; label: string; badge?: number }[] = [
    { section: 'users', icon: <Users size={16} />, label: '用户管理', badge: pendingAudit },
    { section: 'tasks', icon: <Activity size={16} />, label: '任务运维', badge: failedTasks },
  ];
  return (
    <div style={{ width: SB_WIDTH, background: '#fff', borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', flexShrink: 0, position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 10 }}>
      <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid #f1f5f9' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,#2563eb,#4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Shield size={16} color="#fff" />
          </div>
          <div>
            <div style={{ fontSize: 13.5, fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>玄鉴管理后台</div>
            <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 3 }}>Admin Dashboard</div>
          </div>
        </div>
      </div>
      <nav style={{ flex: 1, padding: '12px 12px' }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', padding: '8px 8px 6px' }}>核心功能</div>
        {navItems.map(item => {
          const isActive = active === item.section;
          return (
            <button key={item.section} onClick={() => setActive(item.section)}
              style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 10px', border: 'none', borderRadius: 8, background: isActive ? 'rgba(37,99,235,0.08)' : 'transparent', color: isActive ? '#2563eb' : '#475569', fontWeight: isActive ? 700 : 500, fontSize: 13.5, cursor: 'pointer', marginBottom: 2, textAlign: 'left', transition: 'all 0.15s' }}>
              {item.icon}
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.badge != null && item.badge > 0 && (
                <span style={{ padding: '1px 7px', borderRadius: 20, fontSize: 10, fontWeight: 800, background: item.section === 'tasks' ? '#dc2626' : '#f59e0b', color: '#fff' }}>{item.badge}</span>
              )}
            </button>
          );
        })}
      </nav>
      <div style={{ padding: '14px 12px', borderTop: '1px solid #f1f5f9' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 8, background: '#f8fafc' }}>
          <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'linear-gradient(135deg,#2563eb,#4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <User size={14} color="#fff" />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: '#0f172a' }}>超级管理员</div>
            <div style={{ fontSize: 10.5, color: '#94a3b8' }}>admin</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Admin Login ──────────────────────────────────────────────────
function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    setTimeout(() => {
      if (username === ADMIN_USER && password === ADMIN_PASS) { localStorage.setItem(STORAGE_KEY, 'true'); onLogin(); }
      else setError('用户名或密码错误');
      setLoading(false);
    }, 600);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#0f172a,#1e1b4b,#1e3a8a)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: '40px 44px', width: 380, backdropFilter: 'blur(20px)', boxShadow: '0 32px 80px rgba(0,0,0,0.4)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32, justifyContent: 'center' }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg,#2563eb,#4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Shield size={22} color="#fff" />
          </div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 900, color: '#fff', lineHeight: 1 }}>玄鉴管理后台</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', marginTop: 3 }}>仅限授权管理员访问</div>
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          {[{ label: '管理员账号', key: 'username', value: username, set: setUsername, type: 'text', ph: '请输入管理员账号' },
            { label: '登录密码',   key: 'password', value: password, set: setPassword, type: 'password', ph: '请输入密码' }].map(f => (
            <div key={f.key} style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: 'rgba(255,255,255,0.65)', marginBottom: 7 }}>{f.label}</label>
              <input type={f.type} value={f.value} onChange={e => { f.set(e.target.value); setError(''); }} placeholder={f.ph} required
                style={{ width: '100%', boxSizing: 'border-box', padding: '11px 14px', border: `1.5px solid ${error ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.12)'}`, borderRadius: 10, background: 'rgba(255,255,255,0.06)', color: '#fff', fontSize: 14, outline: 'none' }} />
            </div>
          ))}
          {error && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 12px', background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, marginBottom: 16 }}>
              <AlertTriangle size={13} color="#fca5a5" /><span style={{ fontSize: 12.5, color: '#fca5a5' }}>{error}</span>
            </div>
          )}
          <button type="submit" disabled={loading}
            style={{ width: '100%', padding: '12px', border: 'none', borderRadius: 10, background: loading ? 'rgba(37,99,235,0.6)' : 'linear-gradient(135deg,#2563eb,#4f46e5)', color: '#fff', fontWeight: 800, fontSize: 15, cursor: loading ? 'not-allowed' : 'pointer', marginTop: 4 }}>
            {loading ? '验证中...' : '安全登录'}
          </button>
        </form>

        {/* Return to regular login */}
        <div style={{ textAlign: 'center', marginTop: 22, paddingTop: 18, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <Link to="/login"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12.5, color: 'rgba(255,255,255,0.38)', textDecoration: 'none', transition: 'color 0.15s' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.7)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.38)')}>
            ← 返回普通用户登录
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─── Main AdminDashboard ──────────────────────────────────────────
export function AdminDashboard() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [activeSection, setActiveSection] = useState<AdminSection>('users');
  const [userTab, setUserTab] = useState<UserTab>('list');

  useEffect(() => { if (localStorage.getItem(STORAGE_KEY) === 'true') setLoggedIn(true); }, []);

  const handleLogout = () => { localStorage.removeItem(STORAGE_KEY); setLoggedIn(false); };

  if (!loggedIn) return <AdminLogin onLogin={() => setLoggedIn(true)} />;

  const pendingAudit = INIT_AUDIT.length;
  const failedTasks  = INIT_TASKS.filter(t => t.status === 'failed').length;

  const breadcrumb = activeSection === 'users'
    ? ['用户管理', userTab === 'list' ? '用户列表' : '用户审核']
    : ['任务运维', '任务监控'];

  return (
    <div style={{ minHeight: '100vh', background: S.pageBg, display: 'flex' }}>
      <Sidebar active={activeSection} setActive={setActiveSection} pendingAudit={pendingAudit} failedTasks={failedTasks} />
      <div style={{ flex: 1, marginLeft: SB_WIDTH, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {/* Topbar */}
        <div style={{ height: 56, background: '#fff', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 28px', position: 'sticky', top: 0, zIndex: 5 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
            <span style={{ color: '#94a3b8' }}>玄鉴后台</span>
            {breadcrumb.map((b, i) => (
              <React.Fragment key={b}>
                <ChevronRight size={12} color="#cbd5e1" />
                <span style={{ color: i === breadcrumb.length - 1 ? '#0f172a' : '#64748b', fontWeight: i === breadcrumb.length - 1 ? 700 : 400 }}>{b}</span>
              </React.Fragment>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ position: 'relative' }}>
              <button style={{ width: 34, height: 34, border: '1.5px solid #e2e8f0', borderRadius: 8, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <Bell size={15} color="#64748b" />
              </button>
              {failedTasks > 0 && <span style={{ position: 'absolute', top: -4, right: -4, width: 16, height: 16, borderRadius: '50%', background: '#dc2626', color: '#fff', fontSize: 9, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{failedTasks}</span>}
            </div>
            <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', border: '1.5px solid #e2e8f0', borderRadius: 8, background: '#fff', color: '#374151', fontWeight: 600, fontSize: 12.5, cursor: 'pointer' }}>
              <LogOut size={13} /> 退出登录
            </button>
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, padding: 28 }}>
          {activeSection === 'users' && (
            <div>
              <div style={{ marginBottom: 20 }}>
                <h1 style={{ margin: 0, fontSize: 22, fontWeight: 900, color: '#0f172a' }}>用户管理</h1>
                <p style={{ margin: '4px 0 0', fontSize: 13, color: '#64748b' }}>管理平台注册用户及审核申请</p>
              </div>
              <div style={{ display: 'flex', gap: 2, marginBottom: 20, background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, padding: 4, width: 'fit-content' }}>
                {([
                  { key: 'list' as UserTab, label: '用户列表', icon: <Users size={13} /> },
                  { key: 'audit' as UserTab, label: `用户审核${pendingAudit > 0 ? ` (${pendingAudit})` : ''}`, icon: <FileText size={13} /> },
                ]).map(t => {
                  const active = userTab === t.key;
                  return (
                    <button key={t.key} onClick={() => setUserTab(t.key)}
                      style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 18px', border: 'none', borderRadius: 7, background: active ? '#2563eb' : 'transparent', color: active ? '#fff' : '#64748b', fontWeight: active ? 700 : 500, fontSize: 13, cursor: 'pointer', transition: 'all 0.15s' }}>
                      {t.icon}{t.label}
                    </button>
                  );
                })}
              </div>
              {userTab === 'list' ? <UserListSection /> : <UserAuditSection />}
            </div>
          )}

          {activeSection === 'tasks' && (
            <div>
              <div style={{ marginBottom: 20 }}>
                <h1 style={{ margin: 0, fontSize: 22, fontWeight: 900, color: '#0f172a' }}>任务运维</h1>
                <p style={{ margin: '4px 0 0', fontSize: 13, color: '#64748b' }}>
                  按评测服务分组监控任务，快速定位异常
                  {failedTasks > 0 && <span style={{ color: '#dc2626', fontWeight: 700, marginLeft: 8 }}>⚠ 当前有 {failedTasks} 个失败任务需处理</span>}
                </p>
              </div>
              <TaskMonitorSection />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
