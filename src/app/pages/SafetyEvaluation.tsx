import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { GuestGuard } from '../components/GuestGuard';
import { TaskCreationModal } from '../components/TaskCreationModal';
import { ProductHeroBackground } from '../components/ProductHeroBackground';
import { ScrollReveal } from '../components/ScrollReveal';
import { StickySubNav } from '../components/StickySubNav';
import { useUser } from '../context/UserContext';
import {
  Plus, Shield, Lock, Eye, AlertTriangle,
  CheckCircle, Zap, BarChart2, FileText, BookOpen,
  ExternalLink, Play, ChevronDown, Terminal,
} from 'lucide-react';
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar,
  ResponsiveContainer, Tooltip, Legend,
} from 'recharts';

// ── Data ──────────────────────────────────────────────────────────

const LEADERBOARD_PREVIEW = [
  { rank: 1, name: 'ChatGLM4-9B', org: '智谱AI', score: 65.46 },
  { rank: 2, name: 'LLaMA-2-13B-Chat', org: 'Meta', score: 64.29 },
  { rank: 3, name: 'Qwen2.5-7B-Instruct', org: '阿里巴巴', score: 64.14 },
  { rank: 4, name: 'ChatGPT-3.5-turbo', org: 'OpenAI', score: 63.66 },
  { rank: 5, name: 'DeepSeek V3', org: '深度求索', score: 62.49 },
];

const RADAR_DATA = [
  { subject: '安全性', ChatGLM4: 60, LLaMA2: 57, Qwen25: 63, fullMark: 100 },
  { subject: '隐私保护', ChatGLM4: 71, LLaMA2: 52, Qwen25: 65, fullMark: 100 },
  { subject: '鲁棒性', ChatGLM4: 64, LLaMA2: 67, Qwen25: 69, fullMark: 100 },
  { subject: '偏见检测', ChatGLM4: 88, LLaMA2: 85, Qwen25: 90, fullMark: 100 },
  { subject: '内容合规', ChatGLM4: 70, LLaMA2: 80, Qwen25: 66, fullMark: 100 },
];

const STANDARDS = [
  { code: 'IEEE 3376', title: 'Recommended Practice for Evaluating Artificial Intelligence Generated Content', type: 'IEEE 国际标准', typeColor: 'blue', year: '2024' },
  { code: 'IEEE 3378', title: 'Standard for Framework and Process for Large-Scale Deep Learning Model Evaluation', type: 'IEEE 国际标准', typeColor: 'blue', year: '2024' },
  { code: 'GB/T 45288.1-2025', title: '《人工智能 大模型 第1部分：通用要求》', type: '国家标准', typeColor: 'red', year: '2025' },
  { code: 'GB/T 45288.2-2025', title: '《人工智能 大模型 第2部分：评测指标与方法》', type: '国家标准', typeColor: 'red', year: '2025' },
  { code: '', title: '《大模型交互体验评测方法》', type: '上海市人工智能行业协会团体标准', typeColor: 'orange', year: '2024' },
  { code: '', title: '《视频大模型评测方法》', type: '上海市人工智能行业协会团体标准', typeColor: 'orange', year: '2024' },
];

const typeColorMap: Record<string, { bg: string; text: string; border: string }> = {
  blue:   { bg: '#eff6ff', text: '#1d4ed8', border: '#bfdbfe' },
  red:    { bg: '#fef2f2', text: '#b91c1c', border: '#fecaca' },
  orange: { bg: '#fff7ed', text: '#c2410c', border: '#fed7aa' },
};

// Core capability matrix — Z-layout data
const CAPABILITY_MATRIX = [
  {
    key: 'safety',
    label: '安全性评测',
    color: '#6366f1',
    icon: <Shield size={24} />,
    tagline: '有害内容 · 违规识别 · 指令防护',
    desc: '覆盖有害内容生成、违规信息识别、恶意指令防护等核心维度，基于万级红队测试数据集构建，识别率超 98%。',
    items: ['有害内容检测', '违规信息识别', '恶意指令防护', '仇恨言论识别', '自伤危机内容'],
    metrics: [{ val: '15+', label: '检测维度' }, { val: '98.7%', label: '识别率' }, { val: '50K+', label: '测试样本' }],
  },
  {
    key: 'privacy',
    label: '隐私性评测',
    color: '#8b5cf6',
    icon: <Lock size={24} />,
    tagline: '信息泄露 · 敏感生成 · 数据防护',
    desc: '检测模型是否会无意泄露训练数据中的个人信息、生成敏感信息，或违反隐私规范，支持 GDPR/个人信息保护法合规场景。',
    items: ['个人信息泄露检测', '敏感数据生成防护', '隐私违规识别', '数据记忆攻击测试'],
    metrics: [{ val: '4', label: '子维度' }, { val: 'GDPR', label: '合规对齐' }, { val: '私有', label: '数据隔离' }],
  },
  {
    key: 'robust',
    label: '鲁棒性评测',
    color: '#f59e0b',
    icon: <Eye size={24} />,
    tagline: '对抗攻击 · 越狱探测 · 提示注入',
    desc: '通过对抗样本、越狱攻击、提示注入等红队方法，系统性测试模型在极端输入下的安全边界，量化攻击成功率。',
    items: ['对抗样本检测', '越狱攻击测试', '提示注入防护', '角色扮演绕过', '多轮累积攻击'],
    metrics: [{ val: '100+', label: '攻击向量' }, { val: '实时', label: '攻击模拟' }, { val: '<1h', label: '边界探测' }],
  },
  {
    key: 'bias',
    label: '偏见公平评测',
    color: '#ef4444',
    icon: <AlertTriangle size={24} />,
    tagline: '性别偏见 · 种族歧视 · 政治倾向',
    desc: '识别模型在性别、种族、政治、宗教等敏感维度上的系统性偏见，确保输出公平中立，满足监管要求。',
    items: ['性别偏见检测', '种族歧视识别', '政治倾向分析', '宗教敏感性评估'],
    metrics: [{ val: '10+', label: '偏见类型' }, { val: '多语言', label: '跨语言支持' }, { val: '量化', label: '公平指数' }],
  },
];

const EVAL_PROCESS = [
  { step: '01', title: '创建任务', desc: '选择模型 API 或上传权重，配置评测维度与数据集' },
  { step: '02', title: '自动测试', desc: '平台自动发起攻击探测与对抗测试，全程无需人工干预' },
  { step: '03', title: '分析聚合', desc: '多维度结果聚合，生成风险热图与漏洞分布图谱' },
  { step: '04', title: '报告交付', desc: '输出 PDF 评测报告，附修复建议与监管备案材料' },
];

// Demo config
const DEMO_MODELS = ['GPT-4o', 'Qwen-Max', 'DeepSeek-V3', 'GLM-4-Plus', 'LLaMA-3-70B'];
const ATTACK_TYPES = ['越狱攻击 (Jailbreak)', '提示注入', '角色扮演绕过', '隐私提取', '对抗样本'];
const TERMINAL_LINES = [
  '> 初始化安全评测引擎...',
  '> 加载攻击向量库 (1,024 个模板)...',
  '> [1/5] 发送越狱攻击 · DAN v7 变体...',
  '  └─ 模型拒绝率: 94.2% ✓',
  '> [2/5] 提示注入测试 · 系统提示覆盖...',
  '  └─ 泄露风险: 检测到 1 个中危漏洞 ⚠',
  '> [3/5] 角色扮演绕过 · 隐藏指令嵌入...',
  '  └─ 成功率: 8.3% (低风险) ✓',
  '> [4/5] 隐私提取 · 训练数据记忆测试...',
  '  └─ 个人信息泄露概率: 0.2% ✓',
  '> [5/5] 对抗样本 · 编码变形攻击...',
  '  └─ 鲁棒性分数: 79.4 ✓',
  '> 聚合多维安全评分...',
  '> 生成安全评测报告 ✓',
];

const DEMO_RADAR_FINAL = [
  { subject: '安全性', A: 88, fullMark: 100 },
  { subject: '隐私性', A: 91, fullMark: 100 },
  { subject: '鲁棒性', A: 79, fullMark: 100 },
  { subject: '偏见公平', A: 84, fullMark: 100 },
  { subject: '内容合规', A: 86, fullMark: 100 },
];

// ── Hero Illustration ──────────────────────────────────────────────

function SafetyHeroIllustration() {
  const threats = [
    { label: '越狱攻击', status: '已拦截', color: '#ef4444', bg: 'rgba(239,68,68,0.08)', borderColor: 'rgba(239,68,68,0.25)' },
    { label: '提示注入', status: '中危警告', color: '#f59e0b', bg: 'rgba(245,158,11,0.08)', borderColor: 'rgba(245,158,11,0.25)' },
    { label: '角色绕过', status: '已拦截', color: '#ef4444', bg: 'rgba(239,68,68,0.08)', borderColor: 'rgba(239,68,68,0.25)' },
    { label: '对抗样本', status: '低风险', color: '#10b981', bg: 'rgba(16,185,129,0.08)', borderColor: 'rgba(16,185,129,0.25)' },
  ];

  return (
    <div style={{ position: 'relative', width: 420, flexShrink: 0 }}>
      {/* Glow */}
      <div style={{ position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%,-50%)', width: 280, height: 280, background: 'radial-gradient(circle,rgba(99,102,241,0.18) 0%,transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />

      {/* Shield badge */}
      <div style={{ textAlign: 'center', marginBottom: 18 }}>
        <motion.div animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
          style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', padding: '20px 28px', background: 'rgba(15,23,42,0.78)', backdropFilter: 'blur(16px)', border: '1.5px solid rgba(99,102,241,0.35)', borderRadius: 20, boxShadow: '0 8px 40px rgba(99,102,241,0.2)' }}>
          <Shield style={{ width: 44, height: 44, color: '#818cf8', marginBottom: 8 }} />
          <div style={{ fontSize: 22, fontWeight: 900, color: '#fff' }}>安全评测</div>
          <div style={{ fontSize: 10, color: '#818cf8', marginTop: 4 }}>15+ 维度 · 5万+ 测试样本</div>
        </motion.div>
      </div>

      {/* Threat cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
        {threats.map((t, i) => (
          <motion.div key={t.label}
            initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
            style={{ background: 'rgba(15,23,42,0.72)', backdropFilter: 'blur(12px)', border: `1px solid ${t.borderColor}`, borderRadius: 12, padding: '11px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: t.color, flexShrink: 0 }} />
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)' }}>{t.label}</span>
            </div>
            <span style={{ fontSize: 11, fontWeight: 700, color: t.color, background: t.bg, border: `1px solid ${t.borderColor}`, padding: '2px 10px', borderRadius: 20 }}>{t.status}</span>
          </motion.div>
        ))}
      </div>

      {/* Floating score */}
      <motion.div animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
        style={{ position: 'absolute', top: 5, right: -12, background: 'rgba(15,23,42,0.85)', backdropFilter: 'blur(12px)', border: '1px solid rgba(16,185,129,0.4)', borderRadius: 12, padding: '10px 14px', zIndex: 20, boxShadow: '0 4px 20px rgba(16,185,129,0.2)', textAlign: 'center' }}>
        <div style={{ fontSize: 22, fontWeight: 900, color: '#34d399', lineHeight: 1 }}>84.2</div>
        <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.5)', marginTop: 3 }}>综合安全评分</div>
      </motion.div>
    </div>
  );
}

// ── Attack Demo ────────────────────────────────────────────────────

function AttackDemo() {
  const [model, setModel] = useState(DEMO_MODELS[0]);
  const [modelOpen, setModelOpen] = useState(false);
  const [selectedAttacks, setSelectedAttacks] = useState<string[]>([ATTACK_TYPES[0], ATTACK_TYPES[1]]);
  const [status, setStatus] = useState<'idle' | 'running' | 'done'>('idle');
  const [lineIdx, setLineIdx] = useState(0);
  const [radarData, setRadarData] = useState(DEMO_RADAR_FINAL.map(d => ({ ...d, A: 0 })));
  const termRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function toggleAttack(a: string) {
    setSelectedAttacks(prev => prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a]);
    setStatus('idle');
  }

  function run() {
    if (status === 'running') return;
    setStatus('running'); setLineIdx(0);
    setRadarData(DEMO_RADAR_FINAL.map(d => ({ ...d, A: 0 })));
    let i = 0;
    timerRef.current = setInterval(() => {
      i++; setLineIdx(i);
      const pct = Math.min(i / (TERMINAL_LINES.length - 1), 1);
      setRadarData(DEMO_RADAR_FINAL.map(d => ({ ...d, A: Math.round(d.A * pct) })));
      if (termRef.current) termRef.current.scrollTop = termRef.current.scrollHeight;
      if (i >= TERMINAL_LINES.length - 1) {
        clearInterval(timerRef.current!);
        setStatus('done');
      }
    }, 500);
  }

  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

  const finalScore = 84.2;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 24, minHeight: 440 }}>
      {/* Config */}
      <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0', padding: 24, display: 'flex', flexDirection: 'column', gap: 18, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>目标模型</div>
          <div style={{ position: 'relative' }}>
            <button onClick={() => setModelOpen(v => !v)}
              style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #e2e8f0', borderRadius: 10, background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 14, fontWeight: 600, color: '#0f172a', cursor: 'pointer' }}>
              {model} <ChevronDown size={14} style={{ color: '#94a3b8' }} />
            </button>
            {modelOpen && (
              <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, marginTop: 4, background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, zIndex: 20, boxShadow: '0 8px 24px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
                {DEMO_MODELS.map(m => (
                  <button key={m} onClick={() => { setModel(m); setModelOpen(false); setStatus('idle'); }}
                    style={{ width: '100%', padding: '9px 14px', textAlign: 'left', border: 'none', background: m === model ? '#fef3f2' : '#fff', color: m === model ? '#ef4444' : '#374151', fontSize: 13, fontWeight: m === model ? 700 : 400, cursor: 'pointer', borderBottom: '1px solid #f1f5f9' }}>
                    {m}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>攻击类型（多选）</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
            {ATTACK_TYPES.map(a => (
              <button key={a} onClick={() => toggleAttack(a)}
                style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', border: `1.5px solid ${selectedAttacks.includes(a) ? '#ef4444' : '#e2e8f0'}`, borderRadius: 9, background: selectedAttacks.includes(a) ? 'rgba(239,68,68,0.06)' : '#f8fafc', cursor: 'pointer', fontSize: 13, color: selectedAttacks.includes(a) ? '#ef4444' : '#374151', fontWeight: selectedAttacks.includes(a) ? 700 : 400 }}>
                <div style={{ width: 14, height: 14, borderRadius: 4, border: `1.5px solid ${selectedAttacks.includes(a) ? '#ef4444' : '#d1d5db'}`, background: selectedAttacks.includes(a) ? '#ef4444' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {selectedAttacks.includes(a) && <CheckCircle size={9} style={{ color: '#fff' }} />}
                </div>
                {a}
              </button>
            ))}
          </div>
        </div>

        <div style={{ fontSize: 11, color: '#94a3b8', textAlign: 'center', borderTop: '1px solid #f1f5f9', paddingTop: 10 }}>
          已选 {selectedAttacks.length} 种攻击类型
        </div>

        <button onClick={run} disabled={status === 'running' || selectedAttacks.length === 0}
          style={{ padding: '13px', borderRadius: 12, background: status === 'running' || selectedAttacks.length === 0 ? '#e2e8f0' : 'linear-gradient(135deg,#ef4444,#dc2626)', border: 'none', color: status === 'running' || selectedAttacks.length === 0 ? '#94a3b8' : '#fff', fontSize: 15, fontWeight: 800, cursor: status === 'running' || selectedAttacks.length === 0 ? 'wait' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: status === 'idle' && selectedAttacks.length > 0 ? '0 4px 16px rgba(239,68,68,0.4)' : 'none' }}>
          <Play size={16} /> {status === 'running' ? '攻击测试中...' : status === 'done' ? '重新测试' : '开始模拟攻击'}
        </button>
      </div>

      {/* Result */}
      <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '12px 18px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: 10, background: '#0f172a' }}>
          <Terminal size={14} style={{ color: '#6ee7b7' }} />
          <span style={{ fontSize: 12, color: '#94a3b8', fontFamily: 'monospace' }}>
            {status === 'idle' ? 'aisc-attack-engine $ _' : status === 'running' ? `aisc-attack-engine $ running · ${model}` : `aisc-attack-engine $ done ✓`}
          </span>
        </div>

        {status === 'idle' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 32, gap: 16 }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Shield style={{ width: 28, height: 28, color: '#fca5a5' }} />
            </div>
            <div style={{ fontSize: 14, color: '#94a3b8', textAlign: 'center' }}>
              选择攻击类型后点击「开始模拟攻击」<br />实时查看攻击日志与安全评分
            </div>
          </div>
        )}

        {(status === 'running' || status === 'done') && (
          <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
            {/* Terminal */}
            <div ref={termRef} style={{ flex: 1, background: '#0f172a', padding: '16px 18px', overflowY: 'auto', fontFamily: 'monospace', fontSize: 12, lineHeight: 1.7, display: 'flex', flexDirection: 'column', gap: 2 }}>
              {TERMINAL_LINES.slice(0, lineIdx + 1).map((line, i) => (
                <div key={i} style={{ color: line.startsWith('  └─') ? '#94a3b8' : line.includes('✓') ? '#6ee7b7' : line.includes('⚠') ? '#fbbf24' : '#e2e8f0', whiteSpace: 'pre' }}>
                  {line}
                </div>
              ))}
              {status === 'running' && <span style={{ color: '#6366f1' }}>▋</span>}
            </div>

            {/* Score + radar */}
            <div style={{ width: 240, borderLeft: '1px solid rgba(255,255,255,0.07)', background: '#0f172a', padding: '16px', display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ textAlign: 'center', padding: '16px 12px', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 12 }}>
                <div style={{ fontSize: 11, color: '#6ee7b7', fontWeight: 700, marginBottom: 6 }}>综合安全评分</div>
                <div style={{ fontSize: 40, fontWeight: 900, color: status === 'done' ? '#6ee7b7' : '#6b7280', lineHeight: 1 }}>
                  {status === 'done' ? finalScore : Math.round(finalScore * (lineIdx / TERMINAL_LINES.length))}
                </div>
                <div style={{ fontSize: 10, color: '#475569', marginTop: 6 }}>
                  {status === 'done' ? '▲ 高于行业均值 12%' : '评测中...'}
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="rgba(255,255,255,0.1)" />
                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 8, fill: '#64748b' }} />
                    <Radar name="评分" dataKey="A" stroke="#6366f1" fill="#6366f1" fillOpacity={0.2} strokeWidth={1.5} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              {status === 'done' && (
                <div style={{ padding: '10px', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 10 }}>
                  <div style={{ fontSize: 9, color: '#fbbf24', fontWeight: 700, marginBottom: 4 }}>⚠ 发现 1 个中危漏洞</div>
                  <div style={{ fontSize: 9, color: '#94a3b8' }}>提示注入 · 建议加强系统提示防护</div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Scenario mocks ─────────────────────────────────────────────────

function ComplianceMock() {
  const dims = ['安全性', '隐私性', '鲁棒性', '偏见公平', '内容合规'];
  const scores = [88, 91, 79, 84, 86];
  return (
    <div style={{ background: 'linear-gradient(150deg,#f0f4ff,#eff6ff)', borderRadius: 16, padding: '18px 20px', border: '1px solid rgba(99,102,241,0.18)' }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: '#374151', marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.08em' }}>上线前合规评测报告</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
        {dims.map((d, i) => (
          <div key={d}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontSize: 10, color: '#374151' }}>{d}</span>
              <span style={{ fontSize: 10, fontWeight: 700, color: scores[i] >= 85 ? '#10b981' : scores[i] >= 75 ? '#f59e0b' : '#ef4444' }}>{scores[i]}</span>
            </div>
            <div style={{ height: 5, background: 'rgba(0,0,0,0.06)', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${scores[i]}%`, background: scores[i] >= 85 ? '#10b981' : scores[i] >= 75 ? '#f59e0b' : '#ef4444', borderRadius: 3 }} />
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 12, padding: '7px 10px', background: '#fff', borderRadius: 8, border: '1px solid rgba(99,102,241,0.15)', fontSize: 9, color: '#4f46e5', fontWeight: 700 }}>
        ✓ 符合网信办备案要求 · 可出具合规证明
      </div>
    </div>
  );
}

function RegressionMock() {
  const versions = ['v1.0', 'v1.1', 'v1.2', 'v1.3'];
  const scores = [81, 84, 78, 87];
  const max = 100, min = 60, h = 56;
  const pts = versions.map((_, i) => ({ x: 20 + i * 48, y: h - ((scores[i] - min) / (max - min)) * h }));
  const path = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
  return (
    <div style={{ background: 'linear-gradient(150deg,#fff7ed,#fef3c7)', borderRadius: 16, padding: '18px 20px', border: '1px solid rgba(245,158,11,0.18)' }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: '#374151', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.08em' }}>安全评分版本追踪</div>
      <svg viewBox={`0 0 ${20 + 3 * 48 + 20} ${h + 18}`} style={{ width: '100%', height: 72 }}>
        <defs><linearGradient id="secGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#f59e0b" stopOpacity={0.25} /><stop offset="100%" stopColor="#f59e0b" stopOpacity={0} /></linearGradient></defs>
        <path d={path + ` L${pts[pts.length-1].x},${h} L${pts[0].x},${h} Z`} fill="url(#secGrad)" />
        <path d={path} fill="none" stroke="#f59e0b" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        {pts.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r={4} fill={i === 2 ? '#ef4444' : '#f59e0b'} stroke="#fff" strokeWidth={1.5} />)}
        {versions.map((v, i) => <text key={i} x={pts[i].x} y={h + 14} textAnchor="middle" style={{ fontSize: 8, fill: '#94a3b8' }}>{v}</text>)}
      </svg>
      <div style={{ marginTop: 8, display: 'flex', gap: 7 }}>
        <div style={{ flex: 1, padding: '6px', background: '#fff', borderRadius: 8, border: '1px solid rgba(239,68,68,0.2)', textAlign: 'center' }}>
          <div style={{ fontSize: 8, color: '#ef4444', fontWeight: 700 }}>⬇ v1.2 回退</div>
          <div style={{ fontSize: 8, color: '#94a3b8' }}>越狱防护下降</div>
        </div>
        <div style={{ flex: 1, padding: '6px', background: '#fff', borderRadius: 8, border: '1px solid rgba(16,185,129,0.2)', textAlign: 'center' }}>
          <div style={{ fontSize: 8, color: '#10b981', fontWeight: 700 }}>⬆ v1.3 改善</div>
          <div style={{ fontSize: 8, color: '#94a3b8' }}>修复后评分最高</div>
        </div>
      </div>
    </div>
  );
}

function RedTeamMock() {
  const attacks = [
    { name: 'DAN v7 变体', rate: '5.2%', status: '低风险', color: '#10b981' },
    { name: '系统提示注入', rate: '18.4%', status: '中危', color: '#f59e0b' },
    { name: '角色扮演绕过', rate: '8.3%', status: '低风险', color: '#10b981' },
  ];
  return (
    <div style={{ background: 'linear-gradient(150deg,#fff5f5,#fef2f2)', borderRadius: 16, padding: '18px 20px', border: '1px solid rgba(239,68,68,0.18)' }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: '#374151', marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.08em' }}>红队攻击报告摘要</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
        {attacks.map((a, i) => (
          <div key={i} style={{ padding: '9px 12px', background: '#fff', borderRadius: 10, border: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: '#0f172a' }}>{a.name}</div>
              <div style={{ fontSize: 9, color: '#94a3b8' }}>攻击成功率: {a.rate}</div>
            </div>
            <span style={{ fontSize: 10, fontWeight: 700, color: a.color, padding: '2px 9px', background: `${a.color}15`, border: `1px solid ${a.color}40`, borderRadius: 20 }}>{a.status}</span>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 10, padding: '7px 10px', background: '#fff', borderRadius: 8, border: '1px solid rgba(239,68,68,0.15)', fontSize: 9, color: '#dc2626', fontWeight: 700 }}>
        发现 1 个中危漏洞 · 已生成修复建议
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────

export function SafetyEvaluation() {
  const navigate = useNavigate();
  const { isGuest } = useUser();
  const [showModal, setShowModal] = useState(false);
  const [showGuestGuard, setShowGuestGuard] = useState(false);

  function handleCreate() {
    if (isGuest) setShowGuestGuard(true);
    else setShowModal(true);
  }

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="product-detail-hero order-[0]" style={{ position: 'relative', minHeight: 520, display: 'flex', alignItems: 'center', overflow: 'hidden', background: 'linear-gradient(135deg,#0f172a 0%,#1e1b4b 60%,#0f2a1e 100%)' }}>
        <ProductHeroBackground side="model" concept="llm-safety" />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 1200, margin: '0 auto', padding: '80px 48px', width: '100%' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 48, alignItems: 'center' }}>
            <div>
              <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
                <Badge style={{ background: 'rgba(16,185,129,0.15)', color: '#6ee7b7', border: '1px solid rgba(16,185,129,0.3)', fontSize: 12 }}>安全合规评测</Badge>
              </div>
              <h1 style={{ fontSize: 'clamp(28px,4vw,52px)', fontWeight: 800, color: '#fff', margin: '0 0 20px', lineHeight: 1.15, maxWidth: 680 }}>
                大模型安全性<br />
                <span style={{ background: 'linear-gradient(135deg,#818cf8,#34d399)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>全维度评测平台</span>
              </h1>
              <p style={{ fontSize: 18, color: '#94a3b8', maxWidth: 560, lineHeight: 1.7, margin: '0 0 36px' }}>
                覆盖安全性、隐私性、鲁棒性、偏见公平等 15+ 评测维度，基于 5 万+红队对抗数据集，为大模型上线提供权威合规背书。
              </p>
              <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                <Button onClick={handleCreate}
                  style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff', border: 'none', padding: '13px 28px', borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Plus size={18} /> 新建安全评测任务
                </Button>
                <Button variant="outline"
                  style={{ background: 'rgba(255,255,255,0.07)', color: '#e2e8f0', border: '1.5px solid rgba(255,255,255,0.15)', padding: '13px 28px', borderRadius: 10, fontSize: 15, cursor: 'pointer' }}
                  onClick={() => navigate('/developer')}>
                  查看技术文档
                </Button>
              </div>
            </div>
            <SafetyHeroIllustration />
          </div>
        </div>
      </section>

      <StickySubNav items={[
        { id: 'se-matrix', label: '核心能力' },
        { id: 'se-demo', label: '攻击模拟' },
        { id: 'se-scenarios', label: '应用场景' },
        { id: 'se-cta', label: '监管标准' },
        { id: 'se-leaderboard', label: '评测排行榜' },
        { id: 'se-process', label: '立即评测' },
      ]} />

      {/* Core Capability Matrix — Z-layout */}
      <section id="se-matrix" className="order-[2]" style={{ background: '#fff', padding: '80px 0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 48px' }}>
          <ScrollReveal>
            <div style={{ textAlign: 'center', marginBottom: 64 }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: '#6366f1', textTransform: 'uppercase', letterSpacing: '0.12em', margin: '0 0 10px' }}>评测能力</p>
              <h2 style={{ fontSize: 32, fontWeight: 800, color: '#0f172a', margin: '0 0 12px' }}>核心能力矩阵</h2>
              <p style={{ fontSize: 16, color: '#64748b' }}>四大核心评测维度，覆盖大模型安全风险全图谱</p>
            </div>
          </ScrollReveal>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 64 }}>
            {CAPABILITY_MATRIX.map((cap, index) => {
              const isEven = index % 2 === 0;
              return (
                <ScrollReveal key={cap.key}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 56, alignItems: 'center' }}>
                    {/* Text side */}
                    <div style={{ order: isEven ? 0 : 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
                        <div style={{ width: 52, height: 52, borderRadius: 14, background: `${cap.color}15`, border: `1.5px solid ${cap.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: cap.color }}>
                          {cap.icon}
                        </div>
                        <div>
                          <div style={{ fontSize: 11, color: cap.color, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>{cap.tagline}</div>
                          <h3 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: '#0f172a' }}>{cap.label}</h3>
                        </div>
                      </div>
                      <p style={{ fontSize: 15, color: '#475569', lineHeight: 1.85, margin: '0 0 28px' }}>{cap.desc}</p>

                      {/* Metrics */}
                      <div style={{ display: 'flex', gap: 14, marginBottom: 28 }}>
                        {cap.metrics.map(m => (
                          <div key={m.label} style={{ padding: '12px 16px', background: '#f8fafc', border: `1px solid ${cap.color}20`, borderRadius: 12, textAlign: 'center' }}>
                            <div style={{ fontSize: 18, fontWeight: 900, color: cap.color }}>{m.val}</div>
                            <div style={{ fontSize: 11, color: '#64748b', marginTop: 3 }}>{m.label}</div>
                          </div>
                        ))}
                      </div>

                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                        {cap.items.map(item => (
                          <span key={item} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', background: `${cap.color}08`, border: `1px solid ${cap.color}25`, borderRadius: 20, fontSize: 13, color: '#374151' }}>
                            <CheckCircle size={12} style={{ color: cap.color }} /> {item}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Visual side */}
                    <div style={{ order: isEven ? 1 : 0, borderRadius: 20, background: `linear-gradient(135deg,${cap.color}08,${cap.color}04)`, border: `1.5px solid ${cap.color}15`, padding: '36px', display: 'flex', flexDirection: 'column', gap: 14, minHeight: 280 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981' }} />
                        <span style={{ fontSize: 12, color: '#64748b', fontFamily: 'monospace' }}>evaluating · {cap.label}</span>
                      </div>
                      {cap.items.map((item, ii) => (
                        <div key={item} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: '#fff', borderRadius: 10, border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{ width: 6, height: 6, borderRadius: '50%', background: cap.color }} />
                            <span style={{ fontSize: 12, color: '#374151', fontWeight: 500 }}>{item}</span>
                          </div>
                          <span style={{ fontSize: 11, color: '#10b981', fontWeight: 700, fontFamily: 'monospace' }}>
                            {['98.2%', '91.4%', '87.6%', '95.0%', '89.3%'][ii % 5]} ✓
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Attack Demo */}
      <section id="se-demo" className="order-[3]" style={{ background: 'linear-gradient(180deg,#f8fafc 0%,#fff 100%)', padding: '80px 0', borderTop: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 48px' }}>
          <ScrollReveal>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <Badge style={{ background: '#fef2f2', color: '#b91c1c', border: '1px solid #fecaca', marginBottom: 12, fontSize: 12 }}>攻击模拟</Badge>
              <h2 style={{ fontSize: 32, fontWeight: 800, color: '#0f172a', margin: '0 0 12px' }}>交互式攻击演示</h2>
              <p style={{ fontSize: 16, color: '#64748b' }}>选择目标模型与攻击向量，实时查看攻击日志与安全评分雷达图</p>
            </div>
          </ScrollReveal>
          <AttackDemo />
        </div>
      </section>

      {/* Application Scenarios — industry solutions layout */}
      <section id="se-scenarios" className="order-[4]" style={{ background: '#f8fafc', padding: '80px 0', borderTop: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 48px' }}>
          <ScrollReveal>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: '#6366f1', textTransform: 'uppercase', letterSpacing: '0.12em', margin: '0 0 10px' }}>应用场景</p>
              <h2 style={{ fontSize: 32, fontWeight: 800, color: '#0f172a', margin: '0 0 12px' }}>场景化安全评测方案</h2>
              <p style={{ fontSize: 16, color: '#64748b' }}>覆盖模型上线前、迭代中、合规审计等全生命周期安全评测需求</p>
            </div>
          </ScrollReveal>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            {[
              {
                id: 'compliance', icon: '📋', accentColor: '#6366f1', tag: '监管合规团队',
                title: '大模型上线前合规评测', subtitle: '出具权威第三方合规证明，满足网信办备案要求',
                desc: '针对即将上线的大模型服务，进行全维度安全评测并出具合规报告。覆盖《生成式人工智能服务管理暂行办法》全部要求，支持网信办备案材料一键导出，帮助企业在合规窗口期内完成上线审查。',
                metrics: [{ value: '15+', label: '合规维度' }, { value: '<2h', label: '报告交付' }, { value: '100%', label: '备案材料覆盖' }],
                tags: ['合规备案', 'API接入', '快速评测', '监管材料'],
                mock: <ComplianceMock />,
              },
              {
                id: 'regression', icon: '🔁', accentColor: '#f59e0b', tag: 'AI 研发团队',
                title: '模型迭代安全回归测试', subtitle: '自动化安全回归，守住每次迭代的安全基线',
                desc: '每次模型更新后自动触发安全回归评测，确保迭代不引入新的安全漏洞。平台提供版本追踪看板，高亮显示安全评分下降区间，为研发团队提供精准的漏洞定位和修复建议。',
                metrics: [{ value: '自动', label: 'CI/CD 触发' }, { value: '精准', label: '漏洞定位' }, { value: '版本', label: '追踪看板' }],
                tags: ['CI/CD集成', '自动化测试', '持续监控', '版本追踪'],
                mock: <RegressionMock />,
              },
              {
                id: 'redteam', icon: '🔴', accentColor: '#ef4444', tag: '安全攻防团队',
                title: '红队对抗攻击评估', subtitle: '模拟真实攻击，探测模型安全边界',
                desc: '模拟真实黑客与恶意用户的攻击手法，通过越狱攻击、提示注入、角色扮演绕过等 100+ 攻击向量系统性探测模型边界。输出攻击成功率、漏洞分布图谱与修复优先级建议。',
                metrics: [{ value: '100+', label: '攻击向量' }, { value: '实时', label: '攻击日志' }, { value: '精准', label: '漏洞报告' }],
                tags: ['越狱测试', '提示注入', '边界探测', '红队演练'],
                mock: <RedTeamMock />,
              },
            ].map(sol => (
              <ScrollReveal key={sol.id}>
                <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 20, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                  <div style={{ height: 4, background: `linear-gradient(90deg,${sol.accentColor},${sol.accentColor}88)` }} />
                  <div style={{ padding: '32px 36px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'start' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                        <div style={{ fontSize: 28 }}>{sol.icon}</div>
                        <span style={{ padding: '3px 10px', background: `${sol.accentColor}15`, border: `1px solid ${sol.accentColor}40`, borderRadius: 20, fontSize: 11, color: sol.accentColor, fontWeight: 700 }}>{sol.tag}</span>
                      </div>
                      <h3 style={{ margin: '0 0 6px', fontSize: 22, fontWeight: 800, color: '#0f172a' }}>{sol.title}</h3>
                      <p style={{ margin: '0 0 16px', fontSize: 13, color: sol.accentColor, fontWeight: 600 }}>{sol.subtitle}</p>
                      <p style={{ margin: '0 0 24px', fontSize: 14, color: '#475569', lineHeight: 1.8 }}>{sol.desc}</p>
                      <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
                        {sol.metrics.map(m => (
                          <div key={m.label} style={{ padding: '12px 16px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12, textAlign: 'center', minWidth: 80 }}>
                            <div style={{ fontSize: 18, fontWeight: 900, color: sol.accentColor }}>{m.value}</div>
                            <div style={{ fontSize: 11, color: '#64748b', marginTop: 3 }}>{m.label}</div>
                          </div>
                        ))}
                      </div>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        {sol.tags.map(t => (
                          <span key={t} style={{ padding: '4px 12px', background: '#f1f5f9', borderRadius: 20, fontSize: 12, color: '#475569', fontWeight: 500 }}>{t}</span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p style={{ margin: '0 0 16px', fontSize: 12, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>实际效果预览</p>
                      {sol.mock}
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Leaderboard + Radar */}
      <section id="se-leaderboard" className="order-[6]" style={{ background: '#fff', padding: '80px 0', borderTop: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 48px' }}>
          <ScrollReveal>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <h2 style={{ fontSize: 32, fontWeight: 800, color: '#0f172a', margin: '0 0 12px' }}>大模型安全评测排行榜</h2>
              <p style={{ fontSize: 16, color: '#64748b' }}>基于玄鉴安全评测体系的主流模型综合得分</p>
            </div>
          </ScrollReveal>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, alignItems: 'stretch' }}>
            <div style={{ background: '#fff', borderRadius: 20, overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.06)', border: '1px solid #e2e8f0' }}>
              <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ color: '#fff', fontWeight: 800, fontSize: 16 }}>综合安全得分排名</div>
                <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>更新于 2025 Q4</div>
              </div>
              <div style={{ padding: '0 24px 8px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '40px 1fr 80px 60px', gap: 8, padding: '12px 0', borderBottom: '1px solid #f1f5f9', color: '#94a3b8', fontSize: 12, fontWeight: 600 }}>
                  <span>排名</span><span>模型名称</span><span>来源</span><span style={{ textAlign: 'right' }}>总分</span>
                </div>
                {LEADERBOARD_PREVIEW.map(item => (
                  <div key={item.rank} style={{ display: 'grid', gridTemplateColumns: '40px 1fr 80px 60px', gap: 8, padding: '14px 0', borderBottom: '1px solid #f8fafc', alignItems: 'center', cursor: 'pointer', transition: 'background 0.15s' }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#f8faff')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                    <span style={{ fontWeight: 700, color: item.rank <= 3 ? '#6366f1' : '#94a3b8', fontSize: 15 }}>{item.rank}</span>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14, color: '#0f172a' }}>{item.name}</div>
                    </div>
                    <span style={{ fontSize: 13, color: '#64748b' }}>{item.org}</span>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontWeight: 800, fontSize: 15, color: item.rank === 1 ? '#6366f1' : '#374151' }}>{item.score}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ padding: '16px 24px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'flex-end' }}>
                <button onClick={() => navigate('/leaderboard')}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
                  <ExternalLink size={13} /> 查看完整排行榜
                </button>
              </div>
            </div>

            <div style={{ background: '#fff', borderRadius: 20, padding: '28px 24px', boxShadow: '0 4px 24px rgba(0,0,0,0.06)', border: '1px solid #e2e8f0' }}>
              <div style={{ fontWeight: 800, fontSize: 16, color: '#0f172a', marginBottom: 4 }}>多维安全能力对比</div>
              <div style={{ fontSize: 13, color: '#64748b', marginBottom: 20 }}>Top 3 模型五维安全雷达图</div>
              <div style={{ height: 280 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={RADAR_DATA} margin={{ top: 8, right: 24, bottom: 8, left: 24 }}>
                    <PolarGrid stroke="#e2e8f0" />
                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: '#64748b' }} />
                    <Radar name="ChatGLM4-9B" dataKey="ChatGLM4" stroke="#6366f1" fill="#6366f1" fillOpacity={0.18} strokeWidth={2} />
                    <Radar name="LLaMA-2-13B" dataKey="LLaMA2" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.12} strokeWidth={2} />
                    <Radar name="Qwen2.5-7B" dataKey="Qwen25" stroke="#10b981" fill="#10b981" fillOpacity={0.12} strokeWidth={2} />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Eval Process */}
      <section id="se-process" className="order-[7]" style={{ background: '#f8fafc', padding: '80px 0', borderTop: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 48px' }}>
          <ScrollReveal>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <h2 style={{ fontSize: 32, fontWeight: 800, color: '#0f172a', margin: '0 0 12px' }}>快速开始</h2>
              <p style={{ fontSize: 16, color: '#64748b' }}>四步完成大模型安全评测，最快 2 小时获得报告</p>
            </div>
          </ScrollReveal>
          <div style={{ position: 'relative', display: 'flex', gap: 0 }}>
            <div style={{ position: 'absolute', top: 28, left: '12.5%', right: '12.5%', height: 2, background: 'linear-gradient(90deg,#6366f1,#8b5cf6,#10b981)', zIndex: 0 }} />
            {EVAL_PROCESS.map(step => (
              <div key={step.step} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 1 }}>
                <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 18, fontWeight: 800, boxShadow: '0 4px 16px rgba(99,102,241,0.4)', marginBottom: 20 }}>
                  {step.step}
                </div>
                <h3 style={{ margin: '0 0 8px', fontSize: 16, fontWeight: 700, color: '#0f172a', textAlign: 'center' }}>{step.title}</h3>
                <p style={{ margin: 0, fontSize: 13, color: '#64748b', textAlign: 'center', lineHeight: 1.7, maxWidth: 180 }}>{step.desc}</p>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 48 }}>
            <button onClick={handleCreate}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 32px', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff', border: 'none', borderRadius: 12, fontSize: 16, fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 20px rgba(99,102,241,0.4)' }}>
              <Plus size={18} /> 立即开始评测
            </button>
          </div>
        </div>
      </section>

      {/* Regulatory Standards */}
      <section id="se-cta" className="order-[5]" style={{ background: 'linear-gradient(135deg,#eef2ff,#f0fdf4)', padding: '72px 0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 48px' }}>
          <ScrollReveal>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 40, gap: 24, flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 52, height: 52, borderRadius: 14, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <BookOpen size={24} style={{ color: '#fff' }} />
                </div>
                <div>
                  <h2 style={{ margin: '0 0 6px', fontSize: 28, fontWeight: 800, color: '#0f172a' }}>监管政策与评测标准文档中心</h2>
                  <p style={{ margin: 0, fontSize: 15, color: '#64748b' }}>汇集国内外 AI 安全法规、评测框架与技术白皮书，持续更新</p>
                </div>
              </div>
              <button onClick={() => navigate('/help-docs')} style={{ flexShrink: 0, padding: '12px 24px', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', gap: 7 }}>
                <ExternalLink size={14} /> 查看帮助文档
              </button>
            </div>
          </ScrollReveal>

          <div style={{ background: '#fff', borderRadius: 20, overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.06)', border: '1px solid #e2e8f0' }}>
            {STANDARDS.map((std, index) => {
              const tc = typeColorMap[std.typeColor] ?? typeColorMap.blue;
              return (
                <div key={index} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24, padding: '22px 32px', borderBottom: index < STANDARDS.length - 1 ? '1px solid #f1f5f9' : 'none', cursor: 'pointer', transition: 'background 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#f8faff')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, flexWrap: 'wrap' }}>
                      {std.code && (
                        <span style={{ color: '#94a3b8', fontSize: 11, fontFamily: 'monospace', background: '#f1f5f9', padding: '2px 8px', borderRadius: 5 }}>{std.code}</span>
                      )}
                      <span style={{ fontSize: 11, padding: '2px 10px', borderRadius: 20, border: `1px solid ${tc.border}`, background: tc.bg, color: tc.text, fontWeight: 600 }}>{std.type}</span>
                    </div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', lineHeight: 1.5 }}>{std.title}</div>
                  </div>
                  <div style={{ flexShrink: 0, textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
                    <span style={{ fontSize: 12, color: '#94a3b8', background: '#f8fafc', padding: '3px 10px', borderRadius: 8, fontWeight: 600 }}>{std.year}</span>
                    <button style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '6px 14px', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
                      <FileText size={11} /> 查看文件
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <GuestGuard open={showGuestGuard} onClose={() => setShowGuestGuard(false)} action="新建评测任务" />
      <TaskCreationModal open={showModal} onClose={() => setShowModal(false)} pageType="safety" />
    </div>
  );
}
