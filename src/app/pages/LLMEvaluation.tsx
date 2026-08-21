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
import { ModelStandardSection } from '../components/ModelStandardSection';
import { useUser } from '../context/UserContext';
import {
  Plus, BarChart2, Brain, Code2, BookOpen,
  Zap, Shield, Target, TrendingUp, ChevronDown, Play, CheckCircle, CheckCircle2,
  ExternalLink, ArrowRight, FileText, Image, AudioLines, Images, MessageSquareText, ScanSearch, Layers3,
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
    items: ['文本生成', '图文生成', '语音生成', '有声视频生成'],
  },
  {
    title: '理解能力',
    color: '#10b981',
    icon: <BookOpen size={18} />,
    items: ['图像理解', '文本理解', '音频理解', '跨模态理解'],
  },
];

type CapabilityType = '生成能力' | '理解能力';
type ModalityGroup = '单模态' | '多模态';
type PerformanceModality = {
  id: string;
  group: ModalityGroup;
  label: string;
  capabilities: Partial<Record<CapabilityType, { tests: string[]; dataset?: string; method?: string }>>;
};

const PERFORMANCE_MODALITIES: PerformanceModality[] = [
  { id: 'image', group: '单模态', label: '图像', capabilities: { '理解能力': { tests: ['静态图像分类', '静态图像分割', '目标检测', '动态图像分类', '行为识别'], dataset: 'ImageNet', method: '静态图像分类' } } },
  { id: 'text', group: '单模态', label: '文本', capabilities: {
    '生成能力': { tests: ['半结构化数据测试', '摘要总结测试', '代码生成测试', '文本翻译测试', '文本续写测试', '文本扩写测试', '文本改写测试'], dataset: '表格类数据测试', method: '基准测试' },
    '理解能力': { tests: ['文本分类', '信息抽取能力', '数学推理能力', '因果推理能力', '行为识别', '任务分解测试', '文本问答测试', '多轮对话测试', '代码理解测试', '长文本对话测试'], dataset: '文本分类测试', method: '基准测试' },
  } },
  { id: 'audio', group: '单模态', label: '音频', capabilities: { '理解能力': { tests: ['声纹识别', '音频问答', '环境音分类'], dataset: 'CN-Celeb', method: '声纹识别' } } },
  { id: 'image-text', group: '多模态', label: '图文', capabilities: {
    '生成能力': { tests: ['文本生成图片', '图片生成文本描述', '文本生成视频', '视频生成文本描述'], dataset: 'GenEval2', method: '文本生成图片' },
    '理解能力': { tests: ['图文检索', '静态图像问答', '视觉空间关系', '视觉语言推理', '视觉蕴含', '视频检索', '视频问答', '图表推理'], dataset: 'Winoground', method: '图文检索' },
  } },
  { id: 'text-audio', group: '多模态', label: '文音', capabilities: {
    '生成能力': { tests: ['语音合成', '语音识别', '语音翻译'], dataset: 'Emilia', method: 'F5-TTS' },
    '理解能力': { tests: ['文音检索'], dataset: 'Clotho', method: '文音检索' },
  } },
  { id: 'image-audio', group: '多模态', label: '图音', capabilities: { '理解能力': { tests: ['视频异常检测'], dataset: 'UCF-Crime', method: '视频异常检测' } } },
  { id: 'image-text-audio', group: '多模态', label: '图文音', capabilities: {
    '生成能力': { tests: ['文本生成有声视频', '有声视频生成文本描述'], dataset: 'AVGen-Bench', method: '有声视频生成' },
    '理解能力': { tests: ['有声视频检索', '有声视频问答'], dataset: 'VALOR-32K', method: '有声视频检索' },
  } },
];

const QUICK_START = [
  { step: '01', title: '配置模型', desc: '选择已保存模型或填写模型接口配置' },
  { step: '02', title: '选择模态', desc: '选择单模态或多模态及具体数据模态' },
  { step: '03', title: '配置评测', desc: '选择生成或理解能力、数据集与测试方法' },
  { step: '04', title: '查看结果', desc: '任务完成后在资源中心查看评测结果' },
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
    { label: '单模态', detail: '图像 · 文本 · 音频', color: '#818cf8' },
    { label: '多模态', detail: '图文 · 文音 · 图音 · 图文音', color: '#34d399' },
    { label: '生成能力', detail: '内容生成与跨模态生成', color: '#f59e0b' },
    { label: '理解能力', detail: '识别 · 问答 · 检索 · 推理', color: '#38bdf8' },
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

      {/* Summary row: keep badges in normal flow so they never cover metric rows */}
      <div style={{ position: 'relative', zIndex: 10, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', padding: '20px 32px', background: 'rgba(15,23,42,0.75)', backdropFilter: 'blur(16px)', border: '1.5px solid rgba(99,102,241,0.4)', borderRadius: 20, boxShadow: '0 8px 40px rgba(99,102,241,0.25)' }}>
          <Brain style={{ width: 40, height: 40, color: '#818cf8', marginBottom: 8 }} />
          <div style={{ fontSize: 26, fontWeight: 900, color: '#fff', lineHeight: 1 }}>玄鉴</div>
          <div style={{ fontSize: 11, color: '#818cf8', marginTop: 4 }}>大模型综合评测</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ background: 'rgba(15,23,42,0.82)', backdropFilter: 'blur(12px)', border: '1px solid rgba(99,102,241,0.4)', borderRadius: 12, padding: '9px 13px', boxShadow: '0 4px 20px rgba(99,102,241,0.2)' }}>
            <div style={{ fontSize: 14, fontWeight: 900, color: '#818cf8', lineHeight: 1 }}>7类模态</div>
            <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.55)', marginTop: 3 }}>以当前平台为准</div>
          </div>
          <div style={{ background: 'rgba(15,23,42,0.82)', backdropFilter: 'blur(12px)', border: '1px solid rgba(52,211,153,0.4)', borderRadius: 12, padding: '9px 13px', boxShadow: '0 4px 20px rgba(52,211,153,0.18)' }}>
            <div style={{ fontSize: 14, fontWeight: 900, color: '#34d399', lineHeight: 1 }}>双能力</div>
            <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.55)', marginTop: 3 }}>生成 · 理解</div>
          </div>
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
              <span style={{ fontSize: 11, fontWeight: 700, color: m.color }}>{m.detail}</span>
            </div>
          </motion.div>
        ))}
      </div>

    </div>
  );
}

function CapabilityTags({ type, tests }: { type: CapabilityType; tests: string[] }) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? tests : tests.slice(0, 4);
  const color = type === '生成能力' ? '#6366f1' : '#059669';
  const Icon = type === '生成能力' ? Brain : BookOpen;

  return <div style={{ marginTop: 16, padding: 15, borderRadius: 14, background: '#fff', border: `1px solid ${color}20` }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, color, fontWeight: 900, fontSize: 13 }}>
        <span style={{ width: 28, height: 28, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', borderRadius: 9, background: `${color}12` }}><Icon size={15} /></span>
        {type}
      </div>
      <span style={{ fontSize: 10, color: '#94a3b8', fontWeight: 700 }}>{tests.length} 项测试</span>
    </div>
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      {visible.map(test => <span key={test} style={{ padding: '6px 10px', borderRadius: 20, border: `1px solid ${color}25`, background: `${color}08`, color: '#475569', fontSize: 11, fontWeight: 700, lineHeight: 1.2 }}>{test}</span>)}
      {tests.length > 4 && <button onClick={() => setExpanded(value => !value)} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '6px 10px', borderRadius: 20, border: '1px dashed #94a3b8', background: '#f8fafc', color: '#475569', fontSize: 11, fontWeight: 800, cursor: 'pointer' }}>
        {expanded ? '收起' : `+${tests.length - 4} 更多`}<ChevronDown size={12} style={{ transform: expanded ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }} />
      </button>}
    </div>
  </div>;
}

const PERFORMANCE_FRAMEWORK = [
  { side: 'single', title: '文本', color: '#2563eb', tasks: [
    ['文本分类','将文本划分为不同类别或标签'], ['信息抽取','抽取内容、实体、事件、属性与关系'], ['数学推理','理解数学概念并完成运算与公式推导'], ['因果推理','识别并计算文本中的因果关系'], ['常识推理','结合日常常识推断隐含信息'], ['任务分解','拆解复杂任务并规划执行顺序'], ['文本问答','针对问题生成合理、准确的答案'], ['多轮对话','理解连续上下文并完成多轮问答'], ['代码理解','解释给定编程代码'], ['长文本理解','分析长文本并提取关键信息'],
  ] },
  { side: 'single', title: '图像', color: '#7c3aed', tasks: [
    ['静态图像分类','理解图像语义并输出类别标签'], ['静态图像分割','分割区域并提取目标'], ['目标检测','检测和定位特定目标物'], ['动态图像分类','将动态图像划分到指定类别'], ['行为识别','识别视频中的动作或行为'],
  ] },
  { side: 'single', title: '音频', color: '#0891b2', tasks: [
    ['声纹识别','完成说话人辨识与验证'], ['音频问答','理解音频问题并给出答案'], ['环境音分类','识别环境音中的语义信息'],
  ] },
  { side: 'multi', title: '图文', color: '#059669', tasks: [
    ['图文检索','匹配图片与文本'], ['静态图像问答','回答图像相关问题'], ['视觉空间关系','判断对象间位置关系'], ['视觉语言推理','判断图片与描述是否一致'], ['视觉蕴含','推理图片与文本关系'], ['视频检索','匹配视频与文本'], ['视频问答','回答视频相关问题'], ['图表推理','理解图表并作出推断'],
  ] },
  { side: 'multi', title: '文音', color: '#0d9488', tasks: [['文音检索','匹配音频与文本']] },
  { side: 'multi', title: '图音', color: '#ea580c', tasks: [['视频异常检测','结合画面与声音识别异常模式']] },
  { side: 'multi', title: '图文音', color: '#dc2626', tasks: [['有声视频检索','匹配有声视频与文本'],['有声视频问答','回答有声视频相关问题']] },
] as const;

const PERFORMANCE_NODE_ICONS: Record<string, React.ElementType> = {
  '文本': FileText, '图像': Image, '音频': AudioLines, '图文': Images,
  '文音': MessageSquareText, '图音': ScanSearch, '图文音': Layers3,
};

function CapabilityOrbitCard({ group, active, onActive, contact, visibleCount }: { group: typeof PERFORMANCE_FRAMEWORK[number]; active: boolean; onActive: (title: string | null) => void; contact: React.CSSProperties; visibleCount: number }) {
  const visibleTasks = group.tasks.slice(0, visibleCount);
  const capability = PERFORMANCE_MODALITIES.find(item => item.label === group.title)?.capabilities;
  const hasGeneration = Boolean(capability?.['生成能力']);
  const hasUnderstanding = Boolean(capability?.['理解能力']);
  const Icon = PERFORMANCE_NODE_ICONS[group.title];

  return <motion.article
    onMouseEnter={() => onActive(group.title)}
    onMouseLeave={() => onActive(null)}
    whileHover={{ y: -7, scale: 1.035 }}
    transition={{ duration: .22 }}
    style={{ position: 'relative', height: '100%', padding: 13, borderRadius: group.side === 'single' ? 18 : 15, border: group.side === 'single' ? `1px solid ${active ? group.color : `${group.color}48`}` : `1px dashed ${active ? group.color : `${group.color}58`}`, background: group.side === 'single' ? `linear-gradient(145deg,rgba(255,255,255,.98),${group.color}10)` : `linear-gradient(145deg,rgba(255,255,255,.94),${group.color}08)`, backdropFilter: 'blur(14px)', boxShadow: active ? `0 20px 46px ${group.color}25,0 0 0 3px ${group.color}0d` : (group.side === 'single' ? '0 10px 28px rgba(37,99,235,.10)' : '0 7px 20px rgba(76,29,149,.07)'), overflow: 'visible' }}>
    <div style={{ position: 'absolute', inset: '0 auto 0 0', width: 4, background: `linear-gradient(180deg,${group.color},${group.color}55)` }} />
    <span style={{ position: 'absolute', zIndex: 3, width: active ? 13 : 10, height: active ? 13 : 10, borderRadius: '50%', background: group.side === 'single' ? '#38bdf8' : '#a78bfa', border: '2px solid #fff', boxShadow: `0 0 0 4px ${group.side === 'single' ? '#38bdf8' : '#a78bfa'}25,0 0 16px ${group.side === 'single' ? '#38bdf8' : '#a78bfa'}`, transform: 'translate(-50%,-50%)', transition: 'all .2s', ...contact }} />
    <div style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ width: 42, height: 42, borderRadius: 13, display: 'grid', placeItems: 'center', background: `${group.color}12`, border: `1px solid ${group.color}25`, color: group.color, boxShadow: `inset 0 0 18px ${group.color}0b` }}>
          <Icon size={22} strokeWidth={1.8} />
        </span>
        <div>
          <strong style={{ display: 'block', fontSize: 18, lineHeight: 1.15, color: '#0f172a' }}>{group.title}</strong>
          <span style={{ display: 'block', marginTop: 4, fontSize: 9.5, color: group.side === 'single' ? '#2563eb' : '#7c3aed', fontWeight: 900, letterSpacing: '.08em' }}>{group.side === 'single' ? '基础模态' : '融合模态'} · {group.tasks.length}项</span>
        </div>
      </div>
      <div title={`${hasGeneration ? '生成能力 ' : ''}${hasUnderstanding ? '理解能力' : ''}`} style={{ display: 'flex', gap: 5 }}>
        {hasGeneration && <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#6366f1', boxShadow: '0 0 0 3px #6366f118' }} />}
        {hasUnderstanding && <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#06b6d4', boxShadow: '0 0 0 3px #06b6d418' }} />}
      </div>
    </div>

    <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexWrap: 'nowrap', alignItems: 'center', gap: 6, marginTop: 12 }}>
      {visibleTasks.map(([name, description]) => <span key={name} title={description} style={{ padding: '5px 8px', borderRadius: 999, background: '#fff', border: `1px solid ${group.color}22`, color: '#334155', fontSize: 9.5, fontWeight: 750, lineHeight: 1.2, whiteSpace: 'nowrap' }}>{name}</span>)}
      {group.tasks.length > visibleCount && <span title={group.tasks.slice(visibleCount).map(([name, description]) => `${name}：${description}`).join('\n')} style={{ flex: '0 0 auto', padding: '5px 8px', borderRadius: 999, background: `${group.color}0d`, border: `1px dashed ${group.color}50`, color: group.color, fontSize: 9.5, fontWeight: 900 }}>+{group.tasks.length - visibleCount}</span>}
    </div>
  </motion.article>;
}

function PerformanceCapabilityMap() {
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const totalTasks = PERFORMANCE_FRAMEWORK.reduce((sum, item) => sum + item.tasks.length, 0);
  const nodes = [
    { title: '文本', x: 560, y: 150, ring: 'inner', width: '23%', height: '16.8%', visibleCount: 3, trackAngle: 90, contact: { left: '50%', top: '100%' } },
    { title: '图像', x: 300, y: 500, ring: 'inner', width: '22%', height: '16.8%', visibleCount: 2, trackAngle: -20, contact: { left: '100%', top: '32%' } },
    { title: '音频', x: 820, y: 500, ring: 'inner', width: '22%', height: '16.8%', visibleCount: 3, trackAngle: 20, contact: { left: '0%', top: '32%' } },
    { title: '图文', x: 925, y: 210, ring: 'outer', width: '21%', height: '15.8%', visibleCount: 2, trackAngle: -28, contact: { left: '0%', top: '72%' } },
    { title: '文音', x: 900, y: 660, ring: 'outer', width: '15.8%', height: '15.8%', visibleCount: 1, trackAngle: 52, contact: { left: '16%', top: '0%' } },
    { title: '图音', x: 220, y: 660, ring: 'outer', width: '15.8%', height: '15.8%', visibleCount: 1, trackAngle: -52, contact: { left: '84%', top: '0%' } },
    { title: '图文音', x: 195, y: 210, ring: 'outer', width: '20%', height: '15.8%', visibleCount: 2, trackAngle: 28, contact: { left: '100%', top: '72%' } },
  ] as const;

  return <div className="performance-capability-map" style={{ position: 'relative', borderRadius: 30, border: 0, padding: 28, overflow: 'hidden', background: 'radial-gradient(circle at 50% 48%,#ffffff 0%,#f9fbfd 58%,#f5f7fa 100%)', boxShadow: 'none' }}>
    <style>{`
      .performance-orbit-stage{position:relative;width:100%;max-width:1120px;aspect-ratio:1120/820;margin:8px auto 0}
      .performance-orbit-card{position:absolute;transform:translate(-50%,-50%);z-index:4}
      .performance-orbit-hub{position:absolute;left:50%;top:50%;width:18%;aspect-ratio:1;transform:translate(-50%,-50%);z-index:5}
      .performance-orbit-svg{position:absolute;inset:0;width:100%;height:100%;z-index:1;overflow:visible;pointer-events:none}
      .performance-orbit-svg--tracks{z-index:6}
      @media(max-width:900px){.performance-orbit-stage{aspect-ratio:auto;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}.performance-orbit-card,.performance-orbit-card.inner,.performance-orbit-card.outer,.performance-orbit-hub{position:relative;left:auto!important;top:auto!important;width:auto;height:auto;min-height:145px;transform:none}.performance-orbit-hub{grid-column:1/-1;width:190px;justify-self:center}.performance-orbit-svg{display:none}}
      @media(max-width:620px){.performance-capability-map{padding:16px!important}.performance-orbit-stage{grid-template-columns:1fr}.performance-orbit-hub{grid-column:auto}}
    `}</style>

    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 20, flexWrap: 'wrap', marginBottom: 10 }}>
      <div>
        <span style={{ color: '#2563eb', fontSize: 11, fontWeight: 900, letterSpacing: '.14em' }}>CAPABILITY TOPOLOGY</span>
        <h3 style={{ margin: '7px 0 0', color: '#0f172a', fontSize: 24, fontWeight: 900 }}>大模型性能评测能力拓扑</h3>
        <p style={{ margin: '7px 0 0', color: '#64748b', fontSize: 12 }}>三类基础模态构成内圈，四类融合模态沿外圈扩展，形成双层能力体系</p>
      </div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {[['#2563eb','单模态'],['#059669','多模态'],['#4f46e5','生成能力'],['#0891b2','理解能力']].map(([color,label]) => <span key={label} style={{ padding: '6px 10px', borderRadius: 999, background: `${color}0c`, border: `1px solid ${color}30`, color, fontSize: 10, fontWeight: 900 }}>{label}</span>)}
      </div>
    </div>

    <div className="performance-orbit-stage">
        <svg className="performance-orbit-svg" viewBox="0 0 1120 820" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
          <defs>
            <radialGradient id="orbitGlow"><stop offset="0" stopColor="#3b82f6" stopOpacity=".18"/><stop offset="1" stopColor="#3b82f6" stopOpacity="0"/></radialGradient>
            <radialGradient id="innerEnergyZone">
              <stop offset="0" stopColor="#60a5fa" stopOpacity=".16"/>
              <stop offset=".7" stopColor="#93c5fd" stopOpacity=".07"/>
              <stop offset="1" stopColor="#dbeafe" stopOpacity="0"/>
            </radialGradient>
            <filter id="lineGlow"><feGaussianBlur stdDeviation="2" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
          </defs>
          <ellipse cx="560" cy="410" rx="348" ry="282" fill="url(#innerEnergyZone)"/>
          <motion.ellipse cx="560" cy="410" rx="335" ry="275" fill="none" stroke="#3b82f6" strokeWidth="2" strokeDasharray="9 10" opacity=".58" animate={{ strokeDashoffset: [0, -114] }} transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}/>
          <motion.ellipse cx="560" cy="410" rx="480" ry="355" fill="none" stroke="#7c3aed" strokeWidth="1.8" strokeDasharray="5 12" opacity=".42" animate={{ strokeDashoffset: [0, 136] }} transition={{ duration: 38, repeat: Infinity, ease: 'linear' }}/>
          <circle r="4.5" fill="#38bdf8" filter="url(#lineGlow)"><animateMotion dur="18s" repeatCount="indefinite" path="M560 135 A335 275 0 1 1 560 685 A335 275 0 1 1 560 135"/></circle>
          <circle r="3.8" fill="#a78bfa" filter="url(#lineGlow)"><animateMotion dur="26s" repeatCount="indefinite" path="M560 55 A480 355 0 1 1 560 765 A480 355 0 1 1 560 55"/></circle>
          <circle cx="560" cy="410" r="210" fill="url(#orbitGlow)"/>
        </svg>
        <svg className="performance-orbit-svg performance-orbit-svg--tracks" viewBox="0 0 1120 820" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
          <defs>
            <clipPath id="orbitCardClip">
              {nodes.map(node => {
                const width = parseFloat(node.width) * 11.2;
                const height = parseFloat(node.height) * 8.2;
                return <rect key={node.title} x={node.x - width / 2} y={node.y - height / 2} width={width} height={height} rx="16"/>;
              })}
            </clipPath>
          </defs>
          <g clipPath="url(#orbitCardClip)">
            <motion.ellipse cx="560" cy="410" rx="335" ry="275" fill="none" stroke="#38bdf8" strokeWidth="2.2" strokeDasharray="9 11" opacity=".22" animate={{ strokeDashoffset: [0, -120] }} transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}/>
            <motion.ellipse cx="560" cy="410" rx="480" ry="355" fill="none" stroke="#8b5cf6" strokeWidth="2" strokeDasharray="6 13" opacity=".18" animate={{ strokeDashoffset: [0, 152] }} transition={{ duration: 38, repeat: Infinity, ease: 'linear' }}/>
          </g>
        </svg>

        <section className="performance-orbit-hub" aria-label="中心能力枢纽">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 42, repeat: Infinity, ease: 'linear' }} style={{ position: 'absolute', inset: -12, borderRadius: '50%', border: '1px dashed rgba(37,99,235,.36)' }} />
        <motion.div whileHover={{ scale: 1.035 }} style={{ position: 'absolute', inset: 0, borderRadius: '50%', padding: 13, background: 'radial-gradient(circle at 34% 24%,#3288ff,#0754b8 48%,#062e67)', boxShadow: '0 25px 58px rgba(37,99,235,.32),inset -12px -16px 34px rgba(2,24,67,.35),inset 7px 7px 22px rgba(255,255,255,.14)', color: '#fff', display: 'grid', placeItems: 'center', textAlign: 'center' }}>
          <div>
            <span style={{ width: 38, height: 38, margin: '0 auto 8px', borderRadius: 13, display: 'grid', placeItems: 'center', background: 'rgba(255,255,255,.14)', border: '1px solid rgba(255,255,255,.18)' }}><Brain size={22}/></span>
            <strong style={{ display: 'block', fontSize: 18, lineHeight: 1.25 }}>大模型性能<br/>评测能力体系</strong>
            <span style={{ display: 'block', marginTop: 7, fontSize: 10, color: '#bfdbfe' }}>生成能力 × 理解能力</span>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 9 }}><span style={{ padding: '4px 7px', borderRadius: 999, background: 'rgba(255,255,255,.12)', fontSize: 9, fontWeight: 800 }}>7 类模态</span><span style={{ padding: '4px 7px', borderRadius: 999, background: 'rgba(255,255,255,.12)', fontSize: 9, fontWeight: 800 }}>{totalTasks} 项任务</span></div>
          </div>
        </motion.div>
      </section>

      {nodes.map(node => {
        const group = PERFORMANCE_FRAMEWORK.find(item => item.title === node.title)!;
        return <div key={node.title} className={`performance-orbit-card ${node.ring}`} style={{ left: `${node.x / 11.2}%`, top: `${node.y / 8.2}%`, width: node.width, height: node.height, opacity: activeNode && activeNode !== node.title ? .46 : 1, transition: 'opacity .2s' }}>
          <CapabilityOrbitCard group={group} active={activeNode === node.title} onActive={setActiveNode} contact={node.contact} visibleCount={node.visibleCount}/>
        </div>;
      })}
    </div>
  </div>;
}

function PerformanceResultPreview() {
  const card: React.CSSProperties = { border: '1.5px solid #93c5fd', borderRadius: 18, padding: 24, background: 'linear-gradient(180deg,#fff,#f8fbff)', minHeight: 300 };
  return <div style={{ display: 'grid', gap: 28 }}>
    <div style={{ border: '1px solid #bfdbfe', borderRadius: 22, background: '#fff', overflow: 'hidden', boxShadow: '0 14px 44px rgba(37,99,235,0.09)' }}>
      <div style={{ padding: '18px 24px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <div><div style={{ fontSize: 12, fontWeight: 900, color: '#64748b' }}>文本模态 · 理解能力</div><div style={{ fontSize: 17, fontWeight: 900, color: '#0f172a', marginTop: 4 }}>文本分类评测样例</div></div>
        <div style={{ display: 'flex', gap: 8 }}>{['基准测试','文本分类测试'].map(t=><span key={t} style={{ padding:'6px 11px',borderRadius:20,background:'#eff6ff',border:'1px solid #bfdbfe',color:'#1d4ed8',fontSize:11,fontWeight:800 }}>{t}</span>)}</div>
      </div>
      <div className="grid gap-5 p-5 lg:grid-cols-2 lg:p-7">
        <div style={card}><div style={{ color:'#2563eb',fontSize:19,fontWeight:900,marginBottom:18 }}>原始风险</div><div style={{ padding:18,borderRadius:14,background:'#eaf4ff',fontSize:13,lineHeight:1.9,color:'#1e293b' }}>
          乌镇中国孕婴童产业链峰会 坚守使命、奋力前行<br/>请判断上述内容属于什么新闻？<br/><br/>A. 农业新闻　B. 旅游新闻　C. 游戏新闻　D. 科技类别公司新闻<br/>E. 体育类别新闻　F. 初升高教育新闻　G. 娱乐圈新闻　H. 投资资讯<br/>I. 军事类别常识　J. 车辆新闻　K. 楼市新闻　L. 环球不含中国类别新闻<br/>M. 书籍文化历史类别新闻　N. 故事类别新闻　O. 股票市场类别新闻
        </div></div>
        <div style={card}><div style={{ color:'#2563eb',fontSize:19,fontWeight:900,marginBottom:18 }}>结果分析</div><div style={{ display:'grid',gap:12,fontSize:14 }}>
          <div style={{padding:14,borderRadius:12,background:'#f8fafc'}}>问题参考答案：<b>D</b></div>
          <div style={{padding:14,borderRadius:12,background:'#fff7ed'}}>模型预测答案：<b>H</b></div>
          <div style={{padding:14,borderRadius:12,background:'#fef2f2',color:'#b91c1c',fontWeight:900}}>该题预测结果：错误</div>
        </div></div>
      </div>
    </div>
    <div style={{ border: '1px solid #bfdbfe', borderRadius: 22, background: '#fff', overflow: 'hidden', boxShadow: '0 14px 44px rgba(37,99,235,0.09)' }}>
      <div style={{ padding:'18px 24px',background:'#f8fafc',borderBottom:'1px solid #e2e8f0' }}><div style={{fontSize:12,fontWeight:900,color:'#64748b'}}>视频模态 · 理解能力</div><div style={{fontSize:17,fontWeight:900,color:'#0f172a',marginTop:4}}>行为识别评测样例</div></div>
      <div className="grid gap-5 p-5 lg:grid-cols-2 lg:p-7">
        <div style={card}><div style={{color:'#2563eb',fontSize:19,fontWeight:900,marginBottom:18}}>原始视频</div><video controls preload="metadata" src="/llm-performance/SB8G0.mp4" style={{width:'100%',maxHeight:330,borderRadius:14,background:'#0f172a'}}/><div style={{marginTop:14,padding:12,borderRadius:10,background:'#eaf4ff',fontWeight:800,color:'#1e3a8a'}}>行为描述：Tidying up a closet/cabinet</div></div>
        <div style={card}><div style={{color:'#2563eb',fontSize:19,fontWeight:900,marginBottom:18}}>结果分析</div><div style={{display:'grid',gap:11,lineHeight:1.7,color:'#334155'}}>
          <div>预测时间段：15.00s–23.00s；24.00s–26.00s；27.00s–28.00s；12.00s–13.00s</div><div>标准时间段：19.10s–23.30s</div><div>最佳 IoU：<b>0.47</b></div><div style={{padding:14,borderRadius:12,background:'#fef2f2',color:'#b91c1c',fontWeight:900}}>是否命中（IoU≥0.5）：否</div>
        </div></div>
      </div>
    </div>
  </div>;
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

function PerformanceScenarioMock({ mode }: { mode: 'single' | 'generation' | 'understanding' }) {
  const accent = mode === 'single' ? '#6366f1' : mode === 'generation' ? '#10b981' : '#f59e0b';
  const data = mode === 'single'
    ? { title:'模型发布前能力核验', nodes:['图像样本','文本样本','音频样本'], result:'三类输入分别完成基准评测', score:'READY 86' }
    : mode === 'generation'
      ? { title:'跨模态内容生成链路', nodes:['文本提示','图像 / 音频','有声视频'], result:'生成结果与参考样本对齐分析', score:'MATCH 82' }
      : { title:'多模态证据融合分析', nodes:['图片 / 视频','文本问题','音频线索'], result:'检索、问答与推理结果联合复核', score:'FUSION 79' };
  return (
    <div style={{ minHeight: 300, position:'relative', overflow:'hidden', background:'linear-gradient(145deg,#ffffff,#f8fbff)',borderRadius:18,padding:22,border:`1px solid ${accent}40`,color:'#0f172a',boxShadow:'0 14px 36px rgba(15,23,42,.08)' }}>
      <div style={{position:'absolute',inset:0,opacity:.38,backgroundImage:'linear-gradient(rgba(59,130,246,.09) 1px,transparent 1px),linear-gradient(90deg,rgba(59,130,246,.09) 1px,transparent 1px)',backgroundSize:'24px 24px'}}/>
      <div style={{position:'relative',display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:24}}><div><div style={{fontSize:10,color:'#64748b',letterSpacing:'.12em'}}>SCENARIO EVIDENCE BOARD</div><strong style={{fontSize:17}}>{data.title}</strong></div><span style={{padding:'7px 10px',borderRadius:9,background:`${accent}12`,border:`1px solid ${accent}35`,color:accent,fontSize:11,fontWeight:900}}>{data.score}</span></div>
      <div style={{position:'relative',display:'grid',gridTemplateColumns:'1fr 54px 1fr',gap:10,alignItems:'center'}}>
        <div style={{display:'grid',gap:9}}>{data.nodes.map((node,i)=><motion.div key={node} animate={{x:[0,4,0]}} transition={{repeat:Infinity,duration:2.4,delay:i*.25}} style={{padding:'12px 13px',borderRadius:11,border:`1px solid ${accent}25`,background:'#fff',boxShadow:'0 5px 14px rgba(15,23,42,.05)',fontSize:12,fontWeight:700}}><span style={{display:'inline-block',width:7,height:7,borderRadius:7,background:accent,marginRight:8}}/>{node}</motion.div>)}</div>
        <div style={{height:2,background:`linear-gradient(90deg,${accent},#38bdf8)`,position:'relative'}}><motion.span animate={{left:['0%','88%']}} transition={{repeat:Infinity,duration:1.8,ease:'linear'}} style={{position:'absolute',top:-4,width:10,height:10,borderRadius:'50%',background:accent,boxShadow:`0 0 12px ${accent}`}}/></div>
        <div style={{padding:18,borderRadius:14,border:`1px solid ${accent}45`,background:`${accent}0b`}}><BarChart2 size={25} color={accent}/><div style={{fontWeight:900,fontSize:13,margin:'10px 0 7px'}}>评测证据与结论</div><div style={{fontSize:11,lineHeight:1.7,color:'#475569'}}>{data.result}</div><div style={{display:'flex',gap:6,marginTop:12,flexWrap:'wrap'}}>{['样本记录','指标结果','复核依据'].map(t=><span key={t} style={{padding:'4px 7px',borderRadius:7,background:'#fff',border:'1px solid #e2e8f0',fontSize:9,color:'#64748b'}}>{t}</span>)}</div></div>
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
                <Badge style={{ background: 'rgba(5,150,105,0.94)', color: '#ffffff', border: '1px solid rgba(110,231,183,0.9)', fontSize: 12 }}>大模型性能评测</Badge>
              </div>
              <h1 style={{ fontSize: 'clamp(28px,4vw,52px)', fontWeight: 800, color: '#fff', margin: '0 0 20px', lineHeight: 1.15, maxWidth: 600 }}>
                大模型综合能力<br />
                <span style={{ background: 'linear-gradient(135deg,#818cf8,#34d399)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>系统性评测平台</span>
              </h1>
              <p style={{ fontSize: 18, color: '#94a3b8', maxWidth: 520, lineHeight: 1.7, margin: '0 0 36px' }}>
                面向图像、文本、音频以及图文、文音、图音、图文音等数据模态，从生成能力与理解能力两个方向开展大模型性能评测。
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
        { id: 'llme-dimensions', label: '能力范围' },
        { id: 'llme-demo', label: '效果预览' },
        { id: 'llme-solutions', label: '应用场景' },
        { id: 'llme-quickstart', label: '快速接入' },
        { id: 'llme-standard', label: '标准依据' },
      ]} />

      {/* Eval Dimensions */}
      <section id="llme-dimensions" style={{ background: '#fff', padding: '80px 0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 48px' }}>
          <ScrollReveal>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <h2 style={{ fontSize: 32, fontWeight: 800, color: '#0f172a', margin: '0 0 12px' }}>数据模态与能力范围</h2>
              <p style={{ fontSize: 16, color: '#64748b' }}>以数据模态为主线，展示当前平台已配置的生成能力与理解能力测试项</p>
            </div>
          </ScrollReveal>
          <PerformanceCapabilityMap />
        </div>
      </section>

      {/* Interactive Demo */}
      <section id="llme-demo" style={{ background: 'linear-gradient(180deg,#f8fafc 0%,#fff 100%)', padding: '80px 0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 48px' }}>
          <ScrollReveal>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <Badge style={{ background: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe', marginBottom: 12, fontSize: 12 }}>效果预览</Badge>
              <h2 style={{ fontSize: 32, fontWeight: 800, color: '#0f172a', margin: '0 0 12px' }}>性能评测结果预览</h2>
              <p style={{ fontSize: 16, color: '#64748b' }}>从原始测试样本到模型输出与判定结论，直观展示结果分析结构</p>
            </div>
          </ScrollReveal>
          <PerformanceResultPreview />
        </div>
      </section>

      {/* Industry Solutions — CodeVulnerabilityAudit layout style */}
      <section id="llme-solutions" style={{ background: '#f8fafc', padding: '80px 0', borderTop: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 48px' }}>
          <ScrollReveal>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: '#6366f1', textTransform: 'uppercase', letterSpacing: '0.12em', margin: '0 0 10px' }}>应用场景</p>
              <h2 style={{ fontSize: 32, fontWeight: 800, color: '#0f172a', margin: '0 0 12px' }}>场景化落地方案</h2>
              <p style={{ fontSize: 16, color: '#64748b' }}>围绕当前已配置的单模态与多模态能力组织评测任务</p>
            </div>
          </ScrollReveal>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            {[
              {
                id: 'selection', icon: '🔍', accentColor: '#6366f1', tag: '企业 IT / 采购团队',
                title: '单模态基础能力评测', subtitle: '覆盖图像、文本和音频的生成与理解测试',
                desc: '根据模型输入输出类型选择图像、文本或音频模态，并在平台当前提供的测试项中配置相应数据集和测试方法。',
                metrics: [{ value: '图像', label: '单模态' }, { value: '文本', label: '单模态' }, { value: '音频', label: '单模态' }],
                tags: ['图像理解', '文本生成', '文本理解', '音频理解'],
                mock: <PerformanceScenarioMock mode="single" />,
              },
              {
                id: 'tracking', icon: '📈', accentColor: '#10b981', tag: 'AI 研发团队',
                title: '多模态生成能力评测', subtitle: '评测不同模态之间的内容生成能力',
                desc: '面向图文、文音和图文音模型，配置文本生成图片、图像描述、语音合成以及有声视频生成等当前已接入的测试任务。',
                metrics: [{ value: '图文', label: '多模态' }, { value: '文音', label: '多模态' }, { value: '图文音', label: '多模态' }],
                tags: ['文本生成图片', '图像描述', '语音合成', '有声视频生成'],
                mock: <PerformanceScenarioMock mode="generation" />,
              },
              {
                id: 'industry', icon: '🏥', accentColor: '#f59e0b', tag: '垂直行业企业',
                title: '多模态理解能力评测', subtitle: '评测跨模态检索、问答、推理与异常检测能力',
                desc: '面向图文、文音、图音和图文音模型，开展图文检索、视觉问答、文音检索、视频异常检测和有声视频问答等测试。',
                metrics: [{ value: '检索', label: '理解任务' }, { value: '问答', label: '理解任务' }, { value: '检测', label: '理解任务' }],
                tags: ['图文检索', '视觉问答', '文音检索', '视频异常检测'],
                mock: <PerformanceScenarioMock mode="understanding" />,
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
                        {sol.metrics.map((m, metricIndex) => (
                          <div key={`${m.value}-${m.label}-${metricIndex}`} style={{ padding: '12px 16px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12, textAlign: 'center', minWidth: 80 }}>
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
              <p style={{ fontSize: 16, color: '#64748b' }}>按照模型、模态、能力类型、数据集与测试方法完成任务配置</p>
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

      <ModelStandardSection
        id="llme-standard"
        code="GB/T 45288.2-2025"
        title="人工智能 大模型 第2部分：评测指标与方法"
        meta="2025-02-28 发布 · 2025-02-28 实施 · 26页"
        pdfHref="/standards/大模型性能对应标准.pdf"
        coverImage="/standards/covers/llm-performance-cover.png"
        points={[
          { eyebrow: '评测指标', title: '性能评测指标与方法框架', description: '为生成能力、理解能力等性能评测维度的测试设计和指标组织提供参考。' },
          { eyebrow: '评测过程', title: '测试数据与结果分析', description: '围绕测试数据、评测方法和结果计算组织可复核的评测过程。' },
          { eyebrow: '结果说明', title: '评测记录与报告', description: '结合评测配置、样本输出和分析结论，帮助复核不同任务的评测结果。' },
        ]}
        note="本页面仅概括与产品相关的标准要求，不替代标准原文；实际评测应结合标准全文、模型类型和项目范围确定。"
      />

      <GuestGuard open={showGuestGuard} onClose={() => setShowGuestGuard(false)} action={guardAction} />
      <TaskCreationModal open={showModal} onClose={() => setShowModal(false)} pageType="llm" />
    </div>
  );
}
