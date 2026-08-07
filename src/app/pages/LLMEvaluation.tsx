import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { GuestGuard } from '../components/GuestGuard';
import { TaskCreationModal } from '../components/TaskCreationModal';
import { ProductHeroBackground } from '../components/ProductHeroBackground';
import { ScrollReveal } from '../components/ScrollReveal';
import { StickySubNav } from '../components/StickySubNav';
import { useUser } from '../context/UserContext';
import {
  Plus, BarChart2, Brain, Code2, BookOpen,
  Zap, Shield, Target, TrendingUp, ChevronDown, Play, CheckCircle, CheckCircle2,
  ExternalLink, ArrowRight,
} from 'lucide-react';
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar,
  ResponsiveContainer, Tooltip, Legend,
} from 'recharts';

// ── Data ──────────────────────────────────────────────────────────

const EVAL_DIMS = [
  {
    title: '生成能力',
    color: '#6366f1',
    icon: <Brain size={18} />,
    items: ['文本续写', '文本扩写', '文本改写', '摘要总结', '文本翻译', '半结构化数据生成'],
  },
  {
    title: '理解能力',
    color: '#10b981',
    icon: <BookOpen size={18} />,
    items: ['语义理解', '情感分析', '文本分类', '信息抽取', '阅读理解'],
  },
  {
    title: '推理能力',
    color: '#8b5cf6',
    icon: <BarChart2 size={18} />,
    items: ['数学推理', '逻辑推理', '常识推理', '因果分析'],
  },
  {
    title: '代码能力',
    color: '#f59e0b',
    icon: <Code2 size={18} />,
    items: ['代码生成', '代码补全', '代码调试', '算法实现'],
  },
];

const QUICK_START = [
  { step: '01', title: '选择模型', desc: '接入 API 或上传模型权重，支持 30+ 主流模型' },
  { step: '02', title: '配置评测', desc: '选择评测维度与数据集，支持自定义上传' },
  { step: '03', title: '自动执行', desc: '平台自动化评测，分布式引擎并行加速' },
  { step: '04', title: '获取报告', desc: '可视化评测报告，附详细分析与优化建议' },
];

const MODELS_DEMO = ['Llama-3-70B', 'Qwen-Max', 'GPT-4o', 'DeepSeek-V3', 'GLM-4-Plus'];
const DATASETS_DEMO = ['MMLU', 'HumanEval', 'GSM8K', 'C-Eval', 'MBPP'];

const DEMO_RADAR_DATA = [
  { subject: '生成能力', A: 0, B: 0, C: 0, fullMark: 100 },
  { subject: '理解能力', A: 0, B: 0, C: 0, fullMark: 100 },
  { subject: '推理能力', A: 0, B: 0, C: 0, fullMark: 100 },
  { subject: '代码能力', A: 0, B: 0, C: 0, fullMark: 100 },
  { subject: '知识覆盖', A: 0, B: 0, C: 0, fullMark: 100 },
];

const DEMO_RADAR_FINAL = [
  { subject: '生成能力', A: 82, B: 74, C: 68, fullMark: 100 },
  { subject: '理解能力', A: 79, B: 81, C: 72, fullMark: 100 },
  { subject: '推理能力', A: 71, B: 65, C: 75, fullMark: 100 },
  { subject: '代码能力', A: 88, B: 60, C: 55, fullMark: 100 },
  { subject: '知识覆盖', A: 76, B: 78, C: 70, fullMark: 100 },
];

const EVAL_STEPS_DEMO = [
  '初始化评测引擎...',
  '加载 MMLU 数据集 (14,042 题)...',
  '并行推理：批次 1/8 完成...',
  '并行推理：批次 4/8 完成...',
  '并行推理：批次 8/8 完成...',
  '聚合多维度评分...',
  '生成能力雷达图...',
  '评测完成 ✓',
];

// ── Hero Illustration ─────────────────────────────────────────────

function LLMHeroIllustration() {
  const metrics = [
    { label: 'MMLU', val: 79.8, color: '#818cf8' },
    { label: 'HumanEval', val: 88.4, color: '#34d399' },
    { label: 'GSM8K', val: 92.1, color: '#f59e0b' },
    { label: 'C-Eval', val: 76.3, color: '#f87171' },
  ];

  return (
    <div style={{ position: 'relative', width: 440, flexShrink: 0 }}>
      <style>{`
        @keyframes llmFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
        @keyframes llmPulse{0%,100%{opacity:0.2}50%{opacity:0.5}}
        @keyframes llmBar{from{width:0}to{width:var(--w)}}
      `}</style>
      {/* Background glow */}
      <div style={{ position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%,-50%)', width: 280, height: 280, background: 'radial-gradient(circle,rgba(99,102,241,0.2) 0%,transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />

      {/* Central badge */}
      <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', marginBottom: 20, animation: 'llmFloat 5s ease-in-out infinite' }}>
        <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', padding: '20px 32px', background: 'rgba(15,23,42,0.75)', backdropFilter: 'blur(16px)', border: '1.5px solid rgba(99,102,241,0.4)', borderRadius: 20, boxShadow: '0 8px 40px rgba(99,102,241,0.25)' }}>
          <Brain style={{ width: 40, height: 40, color: '#818cf8', marginBottom: 8 }} />
          <div style={{ fontSize: 26, fontWeight: 900, color: '#fff', lineHeight: 1 }}>玄鉴</div>
          <div style={{ fontSize: 11, color: '#818cf8', marginTop: 4 }}>大模型综合评测</div>
        </div>
      </div>

      {/* Metric bar cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {metrics.map((m, i) => (
          <motion.div key={m.label}
            initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.12, duration: 0.5 }}
            style={{ background: 'rgba(15,23,42,0.7)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '12px 16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 7 }}>
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>{m.label}</span>
              <span style={{ fontSize: 14, fontWeight: 900, color: m.color }}>{m.val}</span>
            </div>
            <div style={{ height: 5, background: 'rgba(255,255,255,0.07)', borderRadius: 3, overflow: 'hidden' }}>
              <motion.div
                initial={{ width: 0 }} animate={{ width: `${m.val}%` }} transition={{ delay: 0.6 + i * 0.12, duration: 0.8, ease: 'easeOut' }}
                style={{ height: '100%', background: m.color, borderRadius: 3 }} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Floating stat */}
      <motion.div
        animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
        style={{ position: 'absolute', top: 10, right: -10, background: 'rgba(15,23,42,0.82)', backdropFilter: 'blur(12px)', border: '1px solid rgba(99,102,241,0.4)', borderRadius: 12, padding: '10px 14px', zIndex: 20, boxShadow: '0 4px 20px rgba(99,102,241,0.25)' }}>
        <div style={{ fontSize: 20, fontWeight: 900, color: '#818cf8', lineHeight: 1 }}>30+</div>
        <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.5)', marginTop: 3 }}>支持模型</div>
      </motion.div>
      <motion.div
        animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut', delay: 1 }}
        style={{ position: 'absolute', bottom: 10, left: -10, background: 'rgba(15,23,42,0.82)', backdropFilter: 'blur(12px)', border: '1px solid rgba(52,211,153,0.4)', borderRadius: 12, padding: '10px 14px', zIndex: 20, boxShadow: '0 4px 20px rgba(52,211,153,0.2)' }}>
        <div style={{ fontSize: 20, fontWeight: 900, color: '#34d399', lineHeight: 1 }}>600+</div>
        <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.5)', marginTop: 3 }}>数据集</div>
      </motion.div>
    </div>
  );
}

// ── Interactive Demo ──────────────────────────────────────────────

function EvalDemo({ onStart: _onStart }: { onStart: () => boolean }) {
  const [model, setModel] = useState(MODELS_DEMO[0]);
  const [dataset, setDataset] = useState(DATASETS_DEMO[0]);
  const [modelOpen, setModelOpen] = useState(false);
  const [datasetOpen, setDatasetOpen] = useState(false);
  const [status, setStatus] = useState<'idle' | 'running' | 'done'>('done');
  const [step, setStep] = useState(0);
  const [radarData, setRadarData] = useState(DEMO_RADAR_FINAL);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 24, minHeight: 420 }}>
      {/* Left — config */}
      <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0', padding: 24, display: 'flex', flexDirection: 'column', gap: 18, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>选择模型</div>
          <div style={{ position: 'relative' }}>
            <button onClick={() => { setModelOpen(v => !v); setDatasetOpen(false); }}
              style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #e2e8f0', borderRadius: 10, background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 14, fontWeight: 600, color: '#0f172a', cursor: 'pointer' }}>
              {model} <ChevronDown size={14} style={{ color: '#94a3b8' }} />
            </button>
            {modelOpen && (
              <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, marginTop: 4, background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, zIndex: 20, boxShadow: '0 8px 24px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
                {MODELS_DEMO.map(m => (
                  <button key={m} onClick={() => { setModel(m); setModelOpen(false); setStatus('done'); setRadarData(DEMO_RADAR_FINAL); }}
                    style={{ width: '100%', padding: '9px 14px', textAlign: 'left', border: 'none', background: m === model ? '#eff6ff' : '#fff', color: m === model ? '#2563eb' : '#374151', fontSize: 13, fontWeight: m === model ? 700 : 400, cursor: 'pointer', borderBottom: '1px solid #f1f5f9' }}>
                    {m}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>选择数据集</div>
          <div style={{ position: 'relative' }}>
            <button onClick={() => { setDatasetOpen(v => !v); setModelOpen(false); }}
              style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #e2e8f0', borderRadius: 10, background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 14, fontWeight: 600, color: '#0f172a', cursor: 'pointer' }}>
              {dataset} <ChevronDown size={14} style={{ color: '#94a3b8' }} />
            </button>
            {datasetOpen && (
              <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, marginTop: 4, background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, zIndex: 20, boxShadow: '0 8px 24px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
                {DATASETS_DEMO.map(d => (
                  <button key={d} onClick={() => { setDataset(d); setDatasetOpen(false); setStatus('done'); setRadarData(DEMO_RADAR_FINAL); }}
                    style={{ width: '100%', padding: '9px 14px', textAlign: 'left', border: 'none', background: d === dataset ? '#eff6ff' : '#fff', color: d === dataset ? '#2563eb' : '#374151', fontSize: 13, fontWeight: d === dataset ? 700 : 400, cursor: 'pointer', borderBottom: '1px solid #f1f5f9' }}>
                    {d}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div style={{ padding: '14px', background: '#f8fafc', borderRadius: 10, border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#64748b', marginBottom: 6 }}>评测配置预览</div>
          <div style={{ fontSize: 12, color: '#374151', display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div>模型：<span style={{ color: '#6366f1', fontWeight: 700 }}>{model}</span></div>
            <div>数据集：<span style={{ color: '#6366f1', fontWeight: 700 }}>{dataset}</span></div>
            <div>维度：<span style={{ color: '#6366f1', fontWeight: 700 }}>全部 4 个</span></div>
          </div>
        </div>

        <div style={{ fontSize: 11, color: '#94a3b8', textAlign: 'center', padding: '8px 0', borderTop: '1px solid #f1f5f9' }}>
          内置样例用于展示正式报告结构
        </div>

        <div style={{ padding: '13px', borderRadius: 12, background: '#eef2ff', color: '#4338ca', fontSize: 14, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <CheckCircle2 size={16} /> 基准评测结果预览
        </div>
      </div>

      {/* Right — results */}
      <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: 10, background: '#f8fafc' }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: status === 'done' ? '#10b981' : status === 'running' ? '#f59e0b' : '#e2e8f0' }} />
          <span style={{ fontSize: 13, color: '#374151', fontFamily: 'monospace', fontWeight: 500 }}>
            {status === 'idle' ? '等待启动评测...' : status === 'running' ? `正在评测 · ${model} × ${dataset}` : `✓ 评测完成 · ${model}`}
          </span>
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {status === 'idle' && (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 32, gap: 16 }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <BarChart2 style={{ width: 28, height: 28, color: '#94a3b8' }} />
              </div>
              <div style={{ fontSize: 14, color: '#94a3b8', textAlign: 'center' }}>
                选择内置模型与数据集，查看多维能力雷达图示例
              </div>
            </div>
          )}

          {status === 'running' && (
            <div style={{ padding: '20px 24px' }}>
              <div style={{ height: 4, background: '#f1f5f9', borderRadius: 2, marginBottom: 20, overflow: 'hidden' }}>
                <motion.div animate={{ width: `${Math.min(((step + 1) / EVAL_STEPS_DEMO.length) * 100, 98)}%` }} transition={{ duration: 0.5 }}
                  style={{ height: '100%', background: 'linear-gradient(90deg,#6366f1,#8b5cf6)', borderRadius: 2 }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
                {EVAL_STEPS_DEMO.map((s, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, opacity: i <= step ? 1 : 0.3 }}>
                    <div style={{ width: 16, height: 16, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: i < step ? 'rgba(16,185,129,0.1)' : i === step ? 'rgba(99,102,241,0.1)' : '#f1f5f9', border: `1px solid ${i < step ? 'rgba(16,185,129,0.4)' : i === step ? 'rgba(99,102,241,0.4)' : '#e2e8f0'}` }}>
                      {i < step && <CheckCircle size={9} style={{ color: '#10b981' }} />}
                    </div>
                    <span style={{ fontSize: 12, color: i === step ? '#0f172a' : '#94a3b8', fontFamily: 'monospace' }}>{s}</span>
                  </div>
                ))}
              </div>
              <div style={{ height: 200 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="#e2e8f0" />
                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: '#64748b' }} />
                    <Radar name={model} dataKey="A" stroke="#6366f1" fill="#6366f1" fillOpacity={0.15} strokeWidth={2} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {status === 'done' && (
            <div style={{ padding: '20px 24px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 20 }}>
                {[
                  { label: model, color: '#6366f1' },
                  { label: 'Qwen-Max', color: '#10b981' },
                  { label: 'GPT-4o', color: '#f59e0b' },
                ].map((m, i) => (
                  <div key={i} style={{ padding: '10px 12px', background: '#f8fafc', borderRadius: 10, border: `1px solid ${m.color}25`, textAlign: 'center' }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: m.color, margin: '0 auto 6px' }} />
                    <div style={{ fontSize: 11, color: '#374151', fontWeight: 600 }}>{m.label}</div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: m.color }}>
                      {i === 0 ? '79.8' : i === 1 ? '76.3' : '81.2'}
                    </div>
                    <div style={{ fontSize: 9, color: '#94a3b8' }}>综合评分</div>
                  </div>
                ))}
              </div>
              <div style={{ height: 220 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="#e2e8f0" />
                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: '#64748b' }} />
                    <Radar name={model} dataKey="A" stroke="#6366f1" fill="#6366f1" fillOpacity={0.15} strokeWidth={2} />
                    <Radar name="Qwen-Max" dataKey="B" stroke="#10b981" fill="#10b981" fillOpacity={0.1} strokeWidth={2} />
                    <Radar name="GPT-4o" dataKey="C" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.1} strokeWidth={2} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Scenario mocks ────────────────────────────────────────────────

function SelectionMock() {
  const models = [
    { name: 'Qwen-Max', scores: { gen: 88, understand: 82, reason: 79, code: 71 }, overall: 81.2 },
    { name: 'GLM-4-Plus', scores: { gen: 79, understand: 85, reason: 72, code: 65 }, overall: 76.0 },
    { name: 'DeepSeek-V3', scores: { gen: 82, understand: 80, reason: 88, code: 83 }, overall: 83.4 },
  ];
  return (
    <div style={{ background: 'linear-gradient(150deg,#f0f4ff,#eff6ff)', borderRadius: 16, padding: '18px 20px', border: '1px solid rgba(99,102,241,0.18)' }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: '#374151', marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.08em' }}>横向能力对比报告</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {models.map((m, i) => (
          <div key={i} style={{ padding: '10px 12px', background: '#fff', borderRadius: 10, border: i === 2 ? '1.5px solid rgba(99,102,241,0.4)' : '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: i === 2 ? '#4f46e5' : '#374151' }}>{m.name}</span>
              <span style={{ fontSize: 14, fontWeight: 900, color: i === 2 ? '#4f46e5' : '#64748b' }}>{m.overall}</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 4 }}>
              {[['生成', m.scores.gen, '#6366f1'], ['理解', m.scores.understand, '#10b981'], ['推理', m.scores.reason, '#8b5cf6'], ['代码', m.scores.code, '#f59e0b']].map(([l, v, c]) => (
                <div key={String(l)}>
                  <div style={{ height: 3, background: '#f1f5f9', borderRadius: 2, overflow: 'hidden', marginBottom: 2 }}>
                    <div style={{ height: '100%', width: `${v}%`, background: String(c), borderRadius: 2 }} />
                  </div>
                  <div style={{ fontSize: 8, color: '#94a3b8', textAlign: 'center' }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 10, padding: '7px 10px', background: 'rgba(99,102,241,0.07)', borderRadius: 8, fontSize: 9, color: '#4f46e5', fontWeight: 600 }}>
        推荐：DeepSeek-V3 综合表现最优，代码能力突出
      </div>
    </div>
  );
}

function TrackingMock() {
  const versions = ['v2.0', 'v2.1', 'v2.2', 'v2.3', 'v2.4'];
  const scores = [72, 74, 71, 78, 83];
  const max = 100, min = 60;
  const h = 60;
  const pts = versions.map((_, i) => ({ x: 16 + i * 40, y: h - ((scores[i] - min) / (max - min)) * h }));
  const path = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
  return (
    <div style={{ background: 'linear-gradient(150deg,#f0fdf8,#e8fdf4)', borderRadius: 16, padding: '18px 20px', border: '1px solid rgba(16,185,129,0.18)' }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: '#374151', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.08em' }}>版本能力追踪曲线</div>
      <svg viewBox={`0 0 ${16 + 4 * 40 + 16} ${h + 16}`} style={{ width: '100%', height: 80 }}>
        <defs><linearGradient id="trackGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#10b981" stopOpacity={0.3} /><stop offset="100%" stopColor="#10b981" stopOpacity={0} /></linearGradient></defs>
        <path d={path + ` L${pts[pts.length-1].x},${h} L${pts[0].x},${h} Z`} fill="url(#trackGrad)" />
        <path d={path} fill="none" stroke="#10b981" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        {pts.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r={4} fill="#10b981" stroke="#fff" strokeWidth={1.5} />)}
        {versions.map((v, i) => <text key={i} x={pts[i].x} y={h + 14} textAnchor="middle" style={{ fontSize: 8, fill: '#94a3b8' }}>{v}</text>)}
      </svg>
      <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
        <div style={{ flex: 1, padding: '6px', background: '#fff', borderRadius: 8, border: '1px solid rgba(239,68,68,0.2)', textAlign: 'center' }}>
          <div style={{ fontSize: 8, color: '#ef4444', fontWeight: 700 }}>⬇ v2.2</div>
          <div style={{ fontSize: 8, color: '#94a3b8' }}>代码能力回退</div>
        </div>
        <div style={{ flex: 1, padding: '6px', background: '#fff', borderRadius: 8, border: '1px solid rgba(16,185,129,0.2)', textAlign: 'center' }}>
          <div style={{ fontSize: 8, color: '#10b981', fontWeight: 700 }}>⬆ v2.4</div>
          <div style={{ fontSize: 8, color: '#94a3b8' }}>推理大幅提升</div>
        </div>
      </div>
    </div>
  );
}

function IndustryMock() {
  const dims = [
    { label: '医疗知识', score: 91, color: '#ef4444' },
    { label: '法规理解', score: 84, color: '#f59e0b' },
    { label: '专业推理', score: 78, color: '#8b5cf6' },
    { label: '行业术语', score: 88, color: '#10b981' },
  ];
  return (
    <div style={{ background: 'linear-gradient(150deg,#fff7ed,#fef3c7)', borderRadius: 16, padding: '18px 20px', border: '1px solid rgba(245,158,11,0.18)' }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: '#374151', marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.08em' }}>医疗行业专项评测</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {dims.map((d, i) => (
          <div key={i}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontSize: 10, color: '#374151' }}>{d.label}</span>
              <span style={{ fontSize: 10, fontWeight: 700, color: d.color }}>{d.score}</span>
            </div>
            <div style={{ height: 5, background: 'rgba(0,0,0,0.06)', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${d.score}%`, background: d.color, borderRadius: 3 }} />
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 12, padding: '7px 10px', background: '#fff', borderRadius: 8, border: '1px solid rgba(245,158,11,0.15)', fontSize: 9, color: '#d97706' }}>
        专属医疗数据集 · 超越通用基准 · 可出具合规证明
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────

export function LLMEvaluation() {
  const navigate = useNavigate();
  const { isGuest } = useUser();
  const [showGuestGuard, setShowGuestGuard] = useState(false);
  const [guardAction, setGuardAction] = useState('新建测评任务');
  const [showModal, setShowModal] = useState(false);

  function handleCreate() {
    if (isGuest) {
      setGuardAction('新建测评任务');
      setShowGuestGuard(true);
    }
    else setShowModal(true);
  }

  function allowOnlineDemo() {
    if (isGuest) {
      setGuardAction('使用在线体验');
      setShowGuestGuard(true);
      return false;
    }
    return true;
  }

  return (
    <div>
      {/* Hero */}
      <section className="product-detail-hero product-detail-hero--reference-height-context" style={{ position: 'relative', minHeight: 520, display: 'flex', alignItems: 'center', overflow: 'hidden', background: 'linear-gradient(135deg,#0f172a 0%,#1e1b4b 60%,#0f172a 100%)' }}>
        <ProductHeroBackground side="model" concept="llm-performance" />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 1200, margin: '0 auto', padding: '0 48px', width: '100%' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 48, alignItems: 'center' }}>
            <div>
              <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
                <Badge style={{ background: 'rgba(16,185,129,0.15)', color: '#6ee7b7', border: '1px solid rgba(16,185,129,0.3)', fontSize: 12 }}>大模型性能评测</Badge>
              </div>
              <h1 style={{ fontSize: 'clamp(28px,4vw,52px)', fontWeight: 800, color: '#fff', margin: '0 0 20px', lineHeight: 1.15, maxWidth: 600 }}>
                大模型综合能力<br />
                <span style={{ background: 'linear-gradient(135deg,#818cf8,#34d399)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>系统性评测平台</span>
              </h1>
              <p style={{ fontSize: 18, color: '#94a3b8', maxWidth: 520, lineHeight: 1.7, margin: '0 0 36px' }}>
                覆盖生成、理解、推理、代码四大能力维度，600+ 评测数据集，支持 30+ 主流模型横向对比与能力追踪。
              </p>
              <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                <Button onClick={handleCreate}
                  style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff', border: 'none', padding: '13px 28px', borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Plus size={18} /> 新建测评任务
                </Button>
                <Button variant="outline"
                  style={{ background: 'rgba(255,255,255,0.07)', color: '#e2e8f0', border: '1.5px solid rgba(255,255,255,0.15)', padding: '13px 28px', borderRadius: 10, fontSize: 15, cursor: 'pointer' }}
                  onClick={() => navigate('/developer')}>
                  查看技术文档
                </Button>
              </div>
            </div>
            <LLMHeroIllustration />
          </div>
        </div>
      </section>

      <StickySubNav items={[
        { id: 'llme-dimensions', label: '评测维度' },
        { id: 'llme-demo', label: '结果预览' },
        { id: 'llme-solutions', label: '应用场景' },
        { id: 'llme-quickstart', label: '快速接入' },
      ]} />

      {/* Eval Dimensions */}
      <section id="llme-dimensions" style={{ background: '#fff', padding: '80px 0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 48px' }}>
          <ScrollReveal>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <h2 style={{ fontSize: 32, fontWeight: 800, color: '#0f172a', margin: '0 0 12px' }}>评测维度体系</h2>
              <p style={{ fontSize: 16, color: '#64748b' }}>四大能力维度，20+ 细分评测指标，全面量化模型表现</p>
            </div>
          </ScrollReveal>
          <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 32, alignItems: 'start' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {EVAL_DIMS.map(d => (
                <div key={d.title} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', borderLeft: `3px solid ${d.color}`, background: `${d.color}08`, borderRadius: '0 10px 10px 0' }}>
                  <span style={{ color: d.color }}>{d.icon}</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>{d.title}</span>
                </div>
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 20 }}>
              {EVAL_DIMS.map(d => (
                <div key={d.title} style={{ padding: '20px 22px', background: '#f8fafc', borderRadius: 14, border: `1px solid ${d.color}20` }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: d.color, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>{d.title}</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                    {d.items.map(item => (
                      <span key={item} style={{ padding: '4px 12px', background: '#fff', border: `1px solid ${d.color}30`, borderRadius: 20, fontSize: 12, color: '#374151', fontWeight: 500 }}>{item}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Demo */}
      <section id="llme-demo" style={{ background: 'linear-gradient(180deg,#f8fafc 0%,#fff 100%)', padding: '80px 0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 48px' }}>
          <ScrollReveal>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <Badge style={{ background: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe', marginBottom: 12, fontSize: 12 }}>效果预览</Badge>
              <h2 style={{ fontSize: 32, fontWeight: 800, color: '#0f172a', margin: '0 0 12px' }}>基准评测结果预览</h2>
              <p style={{ fontSize: 16, color: '#64748b' }}>使用内置模型与数据集展示多维能力雷达图；正式评测请创建任务</p>
            </div>
          </ScrollReveal>
          <EvalDemo onStart={allowOnlineDemo} />
        </div>
      </section>

      {/* Industry Solutions — CodeVulnerabilityAudit layout style */}
      <section id="llme-solutions" style={{ background: '#f8fafc', padding: '80px 0', borderTop: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 48px' }}>
          <ScrollReveal>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: '#6366f1', textTransform: 'uppercase', letterSpacing: '0.12em', margin: '0 0 10px' }}>应用场景</p>
              <h2 style={{ fontSize: 32, fontWeight: 800, color: '#0f172a', margin: '0 0 12px' }}>场景化落地方案</h2>
              <p style={{ fontSize: 16, color: '#64748b' }}>从模型选型到能力追踪，覆盖大模型全生命周期评测需求</p>
            </div>
          </ScrollReveal>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            {[
              {
                id: 'selection', icon: '🔍', accentColor: '#6366f1', tag: '企业 IT / 采购团队',
                title: '模型选型横向对比评测', subtitle: '客观量化评分，告别"口碑选型"，用数据驱动采购决策',
                desc: '企业引入大模型时面临数十款产品的选择困境。平台支持多模型并行评测，在生成、理解、推理、代码四大维度给出可比较的量化评分，结合延迟、成本分析，输出采购决策报告，帮助技术团队与管理层达成共识。',
                metrics: [{ value: '30+', label: '可比较模型' }, { value: '4', label: '核心评测维度' }, { value: '<1h', label: '完整对比报告' }],
                tags: ['多模型并行', '横向对比', '采购决策报告'],
                mock: <SelectionMock />,
              },
              {
                id: 'tracking', icon: '📈', accentColor: '#10b981', tag: 'AI 研发团队',
                title: '模型迭代能力追踪', subtitle: '自动化回归测试，精准发现版本更新中的能力退化',
                desc: '模型每次微调或训练后，旧有能力是否退化难以量化评估。平台提供版本追踪看板，自动对比各迭代版本在关键评测集上的表现变化，高亮显示能力退化区间，为研发决策提供数据基础。',
                metrics: [{ value: '自动', label: '版本对比触发' }, { value: '精准', label: '退化位置定位' }, { value: 'CI/CD', label: '流水线集成' }],
                tags: ['版本管理', '退化检测', '持续评测'],
                mock: <TrackingMock />,
              },
              {
                id: 'industry', icon: '🏥', accentColor: '#f59e0b', tag: '垂直行业企业',
                title: '行业专项能力评测', subtitle: '自定义行业数据集，量化模型在真实业务场景中的实际能力',
                desc: '通用评测集无法反映金融、医疗、法律等行业的专业需求。平台支持上传企业私有评测数据集和自定义评分标准，生成行业专属能力报告，为模型落地与合规证明提供可信依据。',
                metrics: [{ value: '自定义', label: '行业数据集' }, { value: '私有', label: '数据安全隔离' }, { value: '合规', label: '行业证明报告' }],
                tags: ['金融医疗法律', '私有数据集', '合规背书'],
                mock: <IndustryMock />,
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

      {/* Quick Start */}
      <section id="llme-quickstart" style={{ background: '#fff', padding: '80px 0', borderTop: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 48px' }}>
          <ScrollReveal>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <h2 style={{ fontSize: 32, fontWeight: 800, color: '#0f172a', margin: '0 0 12px' }}>快速开始</h2>
              <p style={{ fontSize: 16, color: '#64748b' }}>四步完成大模型评测，最快 1 小时获得完整报告</p>
            </div>
          </ScrollReveal>
          <div style={{ position: 'relative', display: 'flex', gap: 0 }}>
            <div style={{ position: 'absolute', top: 28, left: '12.5%', right: '12.5%', height: 2, background: 'linear-gradient(90deg,#6366f1,#8b5cf6,#10b981)', zIndex: 0 }} />
            {QUICK_START.map(step => (
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
              <Plus size={18} /> 立即创建评测任务
            </button>
          </div>
        </div>
      </section>

      <GuestGuard open={showGuestGuard} onClose={() => setShowGuestGuard(false)} action={guardAction} />
      <TaskCreationModal open={showModal} onClose={() => setShowModal(false)} pageType="llm" />
    </div>
  );
}
