import React, { useState, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import {
  GraduationCap, BookOpen, Shield, Zap, Target, Users,
  ChevronDown, ArrowRight, CheckCircle2, BarChart2, Layers,
  Brain, Code2, HelpCircle,
  Play, Building2, Cpu, FlaskConical,
  Trophy, RefreshCw, MessageSquare,
  Server, Cloud, AlertTriangle,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { GuestGuard } from '../components/GuestGuard';
import { useUser } from '../context/UserContext';

import { StickySubNav } from '../components/StickySubNav';
import IMG_LOGIN from '../../imports/image.png';
import IMG_MOD1 from '../../imports/image-1.png';
import IMG_MOD2 from '../../imports/image-2.png';
import IMG_MOD3 from '../../imports/image-3.png';
import IMG_MOD4 from '../../imports/image-4.png';

// ─── MOD 1: Light-theme compact hero card ─────────────────────────
function SplitHeroCard() {
  const [activeTab, setActiveTab] = useState(0);
  const tabs = [
    { label: '登录页面', color: '#3b82f6', img: IMG_LOGIN },
    { label: '课程教学', color: '#6366f1', img: IMG_MOD1 },
    { label: '实战演练', color: '#0ea5e9', img: IMG_MOD3 },
  ];

  return (
    <div className="max-w-full overflow-x-clip">
    <div
      style={{
        position: 'relative',
        zIndex: 2,
        padding: 10,
        borderRadius: 24,
        background: 'rgba(255,255,255,0.48)',
        border: '1px solid rgba(255,255,255,0.78)',
        boxShadow: '0 30px 80px rgba(44,97,153,0.18)',
        backdropFilter: 'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)',
        transform: 'perspective(1200px) rotateY(-3deg) rotateX(1deg)',
        transformOrigin: 'center center',
      }}
    >
      <div className="rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: 'white', border: '1.5px solid rgba(59,130,246,0.2)', boxShadow: '0 20px 60px rgba(59,130,246,0.15), 0 4px 16px rgba(0,0,0,0.08)' }}>
        {/* Window chrome */}
        <div className="flex items-center gap-2 px-4 py-2.5"
          style={{ background: 'linear-gradient(135deg,#dbeafe,#eff6ff)', borderBottom: '1px solid rgba(59,130,246,0.15)' }}>
          <div className="flex gap-1.5">
            {['#ef4444','#eab308','#22c55e'].map(c => <div key={c} className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />)}
          </div>
          <div className="flex-1 mx-3 h-5 rounded-full bg-white/70 flex items-center px-3 border border-blue-100">
            <span className="text-[9px] text-blue-400">edu.aisafepro.com</span>
          </div>
          <div className="text-[9px] text-blue-400 font-medium">AI安全教学平台</div>
        </div>

        {/* Tab bar */}
        <div className="flex border-b border-blue-50" style={{ background: '#f8fbff' }}>
          {tabs.map((t, i) => (
            <button key={t.label} onClick={() => setActiveTab(i)}
              className="flex-1 py-2 text-[11px] font-bold transition-all"
              style={{
                color: activeTab === i ? t.color : '#94a3b8',
                borderBottom: activeTab === i ? `2px solid ${t.color}` : '2px solid transparent',
                background: 'transparent',
              }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Screenshot display — clear, no dark overlay */}
        <div className="relative" style={{ height: 240, overflow: 'hidden', background: '#f0f7ff' }}>
          <AnimatePresence mode="wait">
            <motion.img
              key={activeTab}
              src={tabs[activeTab].img}
              alt={tabs[activeTab].label}
              initial={{ opacity: 0, scale: 1.03 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top left', display: 'block' }}
            />
          </AnimatePresence>
        </div>

        {/* Status bar */}
        <div className="flex items-center justify-between px-4 py-2"
          style={{ background: '#f8fbff', borderTop: '1px solid rgba(59,130,246,0.1)' }}>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="text-[9px] text-blue-400">平台在线 · 教练战评一体化</span>
          </div>
          <div className="flex gap-2">
            {['课程教学','理论闯关','实战演练','讨论社区'].map((m, i) => (
              <span key={m} className="text-[8px] px-1.5 py-0.5 rounded"
                style={{ background: i === activeTab ? tabs[Math.min(i,2)]?.color + '18' : '#f1f5f9', color: i === activeTab ? tabs[Math.min(i,2)]?.color : '#94a3b8' }}>
                {m}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}

// ─── FAQ Item ──────────────────────────────────────────────────────
function FaqItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(index === 0);
  return (
    <motion.div layout className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      <button className="w-full flex items-center gap-4 p-5 text-left hover:bg-gray-50 transition-colors" onClick={() => setOpen(v => !v)}>
        <div className="shrink-0 w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center">
          <HelpCircle className="w-4 h-4 text-indigo-500" />
        </div>
        <span className="flex-1 text-gray-900 font-bold text-sm">{q}</span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="w-5 h-5 text-gray-400" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div key="c" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}>
            <div className="px-5 pb-5 flex items-start gap-4">
              <div className="shrink-0 w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">{a}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Three-group staircase curriculum ─────────────────────────────
function CurriculumRoadmap() {
  const [hovered, setHovered] = useState<number | null>(null);
  const [tooltipInfo, setTooltipInfo] = useState<{ idx: number; x: number; y: number } | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const chapters = [
    { n: '01', color: '#22c55e', difficulty: '基础', icon: BookOpen, hours: 4, labs: 1, title: '背景与概述',
      topics: ['AI安全挑战总览', '人脸识别安全事件', 'AI换脸深伪技术', '安全研究发展脉络'] },
    { n: '02', color: '#16a34a', difficulty: '基础', icon: Brain, hours: 6, labs: 2, title: '深度学习可信理论',
      topics: ['可信AI基本框架', '鲁棒性理论基础', '公平性与可解释性', '隐私保护基础理论'] },
    { n: '03', color: '#3b82f6', difficulty: '进阶', icon: Zap, hours: 8, labs: 3, title: '深度学习攻击方法',
      topics: ['对抗样本生成 FGSM', '中毒攻击方法', '隐私窃取攻击', '偏见操控攻击'] },
    { n: '04', color: '#2563eb', difficulty: '进阶', icon: Shield, hours: 8, labs: 3, title: '面向深度学习的防御',
      topics: ['对抗训练策略', '防御蒸馏技术', '输入预处理防御', '认证鲁棒性方法'] },
    { n: '05', color: '#8b5cf6', difficulty: '高阶', icon: BarChart2, hours: 6, labs: 2, title: '测试与评估方法',
      topics: ['模型安全评测框架', '对抗鲁棒性评估', '公平性测试方法', '可解释性评测'] },
    { n: '06', color: '#7c3aed', difficulty: '高阶', icon: Code2, hours: 8, labs: 4, title: '数据与算法安全应用',
      topics: ['联邦学习安全', '强化学习安全', '自动驾驶安全', '医疗AI安全'] },
    { n: '07', color: '#a855f7', difficulty: '实战', icon: Trophy, hours: 6, labs: 4, title: '实践案例',
      topics: ['对抗样本实战复现', '真实场景漏洞案例', '防御系统搭建实践', '综合攻防演练'] },
  ];

  const difficultyColor: Record<string,string> = { 基础:'#22c55e', 进阶:'#3b82f6', 高阶:'#8b5cf6', 实战:'#a855f7' };

  // — Card & layout dimensions —
  const CW = 158;
  const CH = 248;
  const CARD_GAP = 14;
  const GROUP_GAP = 86;
  const STEP_H = 148;

  const G1W = 2 * CW + CARD_GAP;
  const G2W = 2 * CW + CARD_GAP;
  const G3W = 3 * CW + 2 * CARD_GAP;

  const G1_LEFT = 0;
  const G2_LEFT = G1W + GROUP_GAP;
  const G3_LEFT = G2_LEFT + G2W + GROUP_GAP;

  const CONT_W = G3_LEFT + G3W;
  const CONT_H = CH + 2 * STEP_H + 32;

  const groups = [
    { indices: [0, 1], bottom: 0,          left: G1_LEFT },
    { indices: [2, 3], bottom: STEP_H,      left: G2_LEFT },
    { indices: [4, 5, 6], bottom: 2*STEP_H, left: G3_LEFT },
  ];

  const connectors = [
    {
      id: 'cc0', c2: '#3b82f6',
      from: { x: G1W,           y: CONT_H - 0        - CH / 2 },
      to:   { x: G2_LEFT,       y: CONT_H - STEP_H   - CH / 2 },
    },
    {
      id: 'cc1', c2: '#8b5cf6',
      from: { x: G2_LEFT + G2W, y: CONT_H - STEP_H   - CH / 2 },
      to:   { x: G3_LEFT,       y: CONT_H - 2*STEP_H - CH / 2 },
    },
  ];

  const handleEnter = useCallback((idx: number) => {
    setHovered(idx);
    const el = cardRefs.current[idx];
    if (el) {
      const rect = el.getBoundingClientRect();
      setTooltipInfo({ idx, x: rect.left + rect.width / 2, y: rect.top });
    }
  }, []);

  const handleLeave = useCallback(() => {
    setHovered(null);
    setTooltipInfo(null);
  }, []);

  const renderCard = (idx: number) => {
    const ch = chapters[idx];
    const isHov = hovered === idx;
    const ChIcon = ch.icon;
    return (
      <div key={idx}
        ref={el => { cardRefs.current[idx] = el; }}
        style={{ position: 'relative', width: CW, zIndex: isHov ? 9999 : 1, overflow: 'visible', flexShrink: 0 }}
        onMouseEnter={() => handleEnter(idx)}
        onMouseLeave={handleLeave}>

        {/* Card body */}
        <motion.div
          animate={{
            y: isHov ? -10 : 0,
            boxShadow: isHov
              ? `0 20px 48px ${ch.color}40, 0 0 0 2.5px ${ch.color}`
              : `0 4px 16px ${ch.color}20, 0 0 0 1.5px ${ch.color}35`,
          }}
          transition={{ type: 'spring', stiffness: 380, damping: 26 }}
          style={{
            width: CW, minHeight: CH,
            background: `linear-gradient(155deg, white 0%, ${ch.color}0d 100%)`,
            borderRadius: 18,
            cursor: 'pointer',
            display: 'flex', flexDirection: 'column',
          }}>
          <div style={{ height: 6, borderRadius: '18px 18px 0 0', background: `linear-gradient(90deg, ${ch.color}, ${ch.color}80)`, flexShrink: 0 }} />
          <div style={{ padding: '14px 13px 13px', display: 'flex', flexDirection: 'column', flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <div style={{ width: 42, height: 42, borderRadius: 12, background: `${ch.color}18`, border: `1.5px solid ${ch.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <ChIcon style={{ width: 21, height: 21, color: ch.color }} />
              </div>
              <span style={{ fontSize: 11, fontWeight: 900, color: ch.color, background: ch.color + '14', padding: '3px 8px', borderRadius: 20, letterSpacing: '0.02em' }}>
                {ch.difficulty}
              </span>
            </div>
            <div style={{ fontSize: 12, fontWeight: 700, color: ch.color + 'bb', marginBottom: 4, letterSpacing: '0.1em' }}>
              CH.{ch.n}
            </div>
            <div style={{ fontSize: 17, fontWeight: 800, color: '#1e293b', lineHeight: 1.4, marginBottom: 12, wordBreak: 'break-word' }}>
              {ch.title}
            </div>
            <div style={{ display: 'flex', gap: 7, marginTop: 'auto' }}>
              <div style={{ flex: 1, textAlign: 'center', background: ch.color + '12', borderRadius: 10, padding: '7px 4px' }}>
                <div style={{ fontSize: 22, fontWeight: 900, color: ch.color, lineHeight: 1 }}>{ch.hours}</div>
                <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 3 }}>课时</div>
              </div>
              <div style={{ flex: 1, textAlign: 'center', background: ch.color + '12', borderRadius: 10, padding: '7px 4px' }}>
                <div style={{ fontSize: 22, fontWeight: 900, color: ch.color, lineHeight: 1 }}>{ch.labs}</div>
                <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 3 }}>实验</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  };

  // Portal tooltip — rendered directly on document.body to escape any scroll container clipping
  const portalTooltip = tooltipInfo !== null && hovered === tooltipInfo.idx
    ? createPortal(
        <AnimatePresence>
          <motion.div
            key={tooltipInfo.idx}
            initial={{ opacity: 0, y: 8, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.94 }}
            transition={{ duration: 0.14 }}
            style={{
              position: 'fixed',
              left: tooltipInfo.x,
              top: tooltipInfo.y - 12,
              transform: 'translateX(-50%) translateY(-100%)',
              width: 220,
              background: 'white',
              borderRadius: 16,
              border: `2px solid ${chapters[tooltipInfo.idx].color}45`,
              boxShadow: `0 20px 60px ${chapters[tooltipInfo.idx].color}30, 0 6px 20px rgba(0,0,0,0.12)`,
              zIndex: 999999,
              pointerEvents: 'none',
              overflow: 'hidden',
            }}>
            <div style={{ padding: '10px 14px', background: chapters[tooltipInfo.idx].color + '12', borderBottom: `1px solid ${chapters[tooltipInfo.idx].color}20` }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: chapters[tooltipInfo.idx].color }}>第{chapters[tooltipInfo.idx].n}章知识点</div>
              <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>{chapters[tooltipInfo.idx].title}</div>
            </div>
            <div style={{ padding: '10px 14px' }}>
              {chapters[tooltipInfo.idx].topics.map(t => (
                <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 6, fontSize: 13, color: '#374151' }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: chapters[tooltipInfo.idx].color, flexShrink: 0 }} />
                  {t}
                </div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>,
        document.body
      )
    : null;

  return (
    <div className="relative" style={{ overflow: 'visible' }}>
      <style>{`
        @keyframes _flow { from { stroke-dashoffset: 0; } to { stroke-dashoffset: -24; } }
        .curr-flow { animation: _flow 1.6s linear infinite; }
      `}</style>

      {/* Legend */}
      <div className="flex items-center justify-center gap-8 mb-12">
        {Object.entries(difficultyColor).map(([d, c]) => (
          <div key={d} className="flex items-center gap-2 text-sm text-gray-600">
            <div className="w-3.5 h-3.5 rounded-full" style={{ background: c }} />{d}级
          </div>
        ))}
      </div>

      {/* Horizontally scrollable wrapper */}
      <div style={{ overflowX: 'auto', paddingBottom: 12, paddingTop: 4 }}>
        <div style={{ position: 'relative', width: CONT_W, height: CONT_H, margin: '0 auto', overflow: 'visible' }}>
          {/* SVG connectors */}
          <svg
            style={{ position: 'absolute', inset: 0, overflow: 'visible', pointerEvents: 'none' }}
            width={CONT_W} height={CONT_H}
            viewBox={`0 0 ${CONT_W} ${CONT_H}`}
          >
            <defs>
              {connectors.map(cn => (
                <marker key={cn.id} id={cn.id} markerWidth="12" markerHeight="12" refX="11" refY="6" orient="auto">
                  <path d="M0,0 L12,6 L0,12 Z" fill={cn.c2} opacity="0.75" />
                </marker>
              ))}
            </defs>
            {connectors.map(cn => {
              const midX = (cn.from.x + cn.to.x) / 2;
              const d = `M ${cn.from.x} ${cn.from.y} L ${midX} ${cn.from.y} L ${midX} ${cn.to.y} L ${cn.to.x - 3} ${cn.to.y}`;
              return (
                <g key={cn.id}>
                  <path d={d} fill="none" stroke={cn.c2} strokeOpacity="0.12" strokeWidth="3" />
                  <path d={d} fill="none" stroke={cn.c2} strokeOpacity="0.65"
                    strokeWidth="2.5" strokeDasharray="14 10"
                    markerEnd={`url(#${cn.id})`}
                    className="curr-flow"
                  />
                </g>
              );
            })}
          </svg>

          {/* Card groups */}
          {groups.map((g, gi) => (
            <div key={gi} style={{ position: 'absolute', bottom: g.bottom, left: g.left, display: 'flex', alignItems: 'flex-end', gap: CARD_GAP }}>
              {g.indices.map(idx => renderCard(idx))}
            </div>
          ))}
        </div>
      </div>

      <div className="text-center mt-6 text-sm text-gray-400">
        悬停任意章节查看详细知识点 · 底层基础 → 中层进阶 → 高层实战
      </div>

      {/* Portal tooltip rendered at document.body level — never clipped by scroll containers */}
      {portalTooltip}
    </div>
  );
}

// ─── MOD 5: Advantages Tab Layout ─────────────────────────────────
function AdvantagesSection() {
  const [active, setActive] = useState(0);

  const items = [
    {
      icon: BookOpen, color: '#6366f1',
      title: '前沿课程与实战内容',
      summary: '80余篇权威论文 · 90余项发明专利',
      desc: '时刻紧贴AI安全研究前沿，实训课程涵盖7大课程体系，100+ AI安全实战内容。发表国内外权威期刊论文80余篇，完成授权发明专利90余项，确保课程内容与最新研究成果同步更新，学术深度与实用性兼顾。学员可在平台内直接接触来自一线科研的真实案例与方法论。',
      stats: [{ v: '80余篇', l: '国内外权威期刊' }, { v: '90余项', l: '授权发明专利' }, { v: '100+', l: 'AI安全实战内容' }],
      imgUrl: 'https://images.unsplash.com/photo-1531496730074-83b638c0a7ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=900',
    },
    {
      icon: Layers, color: '#0ea5e9',
      title: '高度可扩展与定制',
      summary: '垂直领域定制 · 灵活增删模块',
      desc: '课程与实验模块支持灵活增删，可根据学校专业特色和教学重点进行垂直领域定制化开发，满足不同院校、企业的差异化培养需求。支持将机构内部培训材料、真实安全案例整合进平台，形成独家的校本化知识体系，定制内容数据完全隔离，不与其他客户共享。',
      stats: [{ v: '灵活', l: '课程模块增删' }, { v: '定制', l: '垂直领域开发' }, { v: '隔离', l: '数据安全存储' }],
      imgUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=900',
    },
    {
      icon: Cpu, color: '#10b981',
      title: '全面支持国产信创',
      summary: '华为昇腾适配 · 自主可控',
      desc: '与华为昇腾框架进行深度适配，系统全面适配国产信创软硬件环境，实现核心技术自主可控，保障国家信息安全与产业安全。平台可运行于统信UOS、银河麒麟等国产操作系统，支持鲲鹏、飞腾等国产CPU，是国内AI安全教学领域率先完成信创全栈适配的平台之一。',
      stats: [{ v: '昇腾', l: '华为框架深度适配' }, { v: '全栈', l: '信创环境覆盖' }, { v: '自主', l: '核心技术可控' }],
      imgUrl: 'https://images.unsplash.com/photo-1759661881353-5b9cc55e1cf4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=900',
    },
    {
      icon: BarChart2, color: '#8b5cf6',
      title: 'AI赋能教师，成果可视',
      summary: '实时学情监控 · 能力成长可见',
      desc: '不仅为学员提供优质资源，更为教师提供全套教学工具与学情分析数据，助力教师科研与教学改革。实时可视化的学习进度与项目看板，帮助教师精准掌握每位学员的课程完成率、知识薄弱点分布和技能成长曲线。学员能力成长清晰可见，让教学决策有数据依据。',
      stats: [{ v: '实时', l: '学情监控大盘' }, { v: '精准', l: '知识薄弱点定位' }, { v: '可视', l: '能力成长曲线' }],
      imgUrl: 'https://images.unsplash.com/photo-1779258998575-9ada827d45ad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=900',
    },
    {
      icon: RefreshCw, color: '#ef4444',
      title: '「学-练-战」闭环设计',
      summary: '独创融合设计 · 高效技能内化',
      desc: '独创性地将课程教学、理论闯关、实战演练三大模块深度融合，构建「学-练-战」完整闭环，实现从知识掌握到技能内化的高效转化。学员在闯关中巩固理论，在实战演练中验证技能，在讨论社区中沉淀经验，三个环节相互支撑、螺旋上升，显著提升学习效果和保留率。',
      stats: [{ v: '独创', l: '三环融合设计' }, { v: '闭环', l: '知识技能转化' }, { v: '螺旋', l: '能力持续提升' }],
      imgUrl: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=900',
    },
  ];

  const cur = items[active];

  return (
    <section className="py-24 bg-slate-50 border-y border-gray-200">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-black text-gray-900 mb-4">平台核心优势</h2>
          <div className="w-16 h-1 bg-gradient-to-r from-indigo-500 to-cyan-500 mx-auto rounded-full" />
        </div>

        <div className="grid lg:grid-cols-5 gap-0 rounded-3xl shadow-2xl border border-gray-200" style={{ overflow: 'visible' }}>
          {/* Left: Tab list */}
          <div className="lg:col-span-2 bg-white border-r border-gray-100" style={{ borderRadius: '24px 0 0 24px', overflow: 'hidden' }}>
            <div className="p-2">
              {items.map((item, i) => {
                const Icon = item.icon;
                const isAct = i === active;
                return (
                  <button key={i} onClick={() => setActive(i)} className="w-full text-left p-4 rounded-2xl transition-all duration-200 flex items-start gap-3 mb-1"
                    style={{ background: isAct ? `${item.color}0f` : 'transparent', border: isAct ? `1.5px solid ${item.color}30` : '1.5px solid transparent' }}>
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                      style={{ background: isAct ? item.color + '18' : '#f1f5f9', border: isAct ? `1.5px solid ${item.color}35` : '1.5px solid #e2e8f0' }}>
                      <Icon className="w-4.5 h-4.5" style={{ color: isAct ? item.color : '#94a3b8' }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-sm mb-0.5" style={{ color: isAct ? '#0f172a' : '#64748b' }}>{item.title}</div>
                      <div className="text-[11px] truncate" style={{ color: isAct ? item.color : '#94a3b8' }}>{item.summary}</div>
                    </div>
                    {isAct && (
                      <ArrowRight className="w-4 h-4 shrink-0 mt-1" style={{ color: item.color }} />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: Content panel — flex-col */}
          <div className="lg:col-span-3" style={{ display: 'flex', flexDirection: 'column', borderRadius: '0 24px 24px 0', overflow: 'hidden' }}>
            <AnimatePresence mode="wait">
              <motion.div key={active} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}
                style={{ display: 'flex', flexDirection: 'column' }}>
                {/* Image — fixed height, overflow-hidden only here */}
                <div className="relative" style={{ height: 260, overflow: 'hidden', flexShrink: 0 }}>
                  <img src={cur.imgUrl} alt={cur.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom,${cur.color}10 0%,rgba(0,0,0,0.25) 100%)` }} />
                  {/* Stat chips */}
                  <div className="absolute top-4 left-4 flex gap-2 flex-wrap">
                    {cur.stats.map((s, idx) => (
                      <div key={idx} className="rounded-xl px-3 py-2" style={{ background: 'rgba(255,255,255,0.93)', backdropFilter: 'blur(12px)' }}>
                        <div className="font-black text-sm" style={{ color: cur.color }}>{s.v}</div>
                        <div className="text-[10px] text-gray-500">{s.l}</div>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Text panel — always fully visible below image */}
                <div style={{ padding: '24px 28px', background: 'white', borderTop: '1px solid #f1f5f9', flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                    <div style={{ width: 28, height: 28, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', background: cur.color + '15', flexShrink: 0 }}>
                      {React.createElement(cur.icon, { style: { width: 14, height: 14, color: cur.color } })}
                    </div>
                    <h3 style={{ fontWeight: 900, color: '#0f172a', fontSize: 17, margin: 0 }}>{cur.title}</h3>
                  </div>
                  <p style={{ color: '#475569', fontSize: 14, lineHeight: 1.75, margin: 0 }}>{cur.desc}</p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────
export function AiSafetyEdu() {
  const navigate = useNavigate();
  const { isGuest } = useUser();
  const [showGuestGuard, setShowGuestGuard] = useState(false);
  const openCourseExperience = () => {
    window.open('/online-experience?tab=course', '_blank', 'noopener,noreferrer');
  };
  const [activeModule, setActiveModule] = useState(0);

  const moduleDetails = [
    {
      key: '课程教学', color: '#6366f1', icon: BookOpen,
      tagline: '基础到前沿的完整AI安全课程体系',
      desc: '基于《深度学习数据与算法安全及其应用》教材构建课程体系，涵盖AI安全理论、攻击、防御等7大维度。支持课程发布、任务管理、学习跟踪的全流程数字化管理。',
      points: ['闭环设计：背景理论→对抗攻防→测试评估→领域应用→实践案例', '覆盖对抗攻击、中毒攻击、隐私窃取、偏见操控等核心威胁', '涵盖联邦学习、强化学习等前沿场景', '支持课程发布、任务管理与学习进度追踪'],
      img: IMG_MOD1,
    },
    {
      key: '理论闯关', color: '#f59e0b', icon: Trophy,
      tagline: '递进式趣味关卡，激发学习动力',
      desc: '平台将AI安全知识点设计成层层递进的趣味闯关任务，学生答题后立即获得正误反馈与详细知识点解析，强化记忆。难度层层递进，必须掌握当前知识点方可解锁后续。',
      points: ['量身定制的进阶式学习路径', '即时反馈，答案立现；解析紧随，记忆强化', '错题纠错溯源，直击根源', '积分、勋章与排名，营造良性竞争氛围'],
      img: IMG_MOD2,
    },
    {
      key: '实战演练', color: '#0ea5e9', icon: FlaskConical,
      tagline: 'JupyterLab云端开箱即用，无需本地配置',
      desc: '提供基于JupyterLab、预集成全套工具的在线开发环境，一键进入，无需本地配置。统一管理中心集中管理所有开发项目和数据集，支持无缝的数据探索、模型开发与调试。',
      points: ['统一管理中心：集中管理所有开发项目和数据集', '开箱即用的云端环境：预集成全套工具，一键进入', '自动评测攻防效果并生成可视化报告', '为成熟项目模型提供稳定的RESTful API接口'],
      img: IMG_MOD3,
    },
    {
      key: '讨论社区', color: '#10b981', icon: MessageSquare,
      tagline: '构建"学者共同体"，动态生长知识库',
      desc: '围绕课程内容、实验难题、前沿动态设立讨论区，促进师生、生生间深度交流。支持学生提问、教师或同学解答，形成知识共享的活跃社区，构建校本化知识库。',
      points: ['围绕课程与实验设立主题讨论区', '促进师生、生生深度交流与协同学习', '数据赋能，实现精准教学与科学管理', '构建动态生长、持续更新的校本化知识库'],
      img: IMG_MOD4,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ── 1. Hero ──────────────────────────────────────────── */}
      <section className="product-detail-hero product-detail-hero--light relative overflow-hidden pt-20 pb-16 sm:pt-28 sm:pb-20 flex items-center" style={{ minHeight: 590, background: '#edf5ff' }}>
        <div
          className="absolute inset-0"
          aria-hidden="true"
          style={{
            backgroundImage: "url('/hero-service-side.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'center center',
            transform: 'scale(1.015)',
          }}
        />
        <div
          className="absolute inset-0"
          aria-hidden="true"
          style={{
            background: 'linear-gradient(90deg,rgba(248,251,255,0.98) 0%,rgba(245,250,255,0.92) 34%,rgba(239,247,255,0.62) 57%,rgba(235,245,255,0.22) 100%)',
          }}
        />
        <div
          className="absolute pointer-events-none"
          aria-hidden="true"
          style={{
            right: '2%',
            top: '9%',
            width: '52%',
            height: '82%',
            borderRadius: '48%',
            background: 'rgba(255,255,255,0.62)',
            filter: 'blur(42px)',
          }}
        />
        <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-600 border border-indigo-300 text-white text-xs font-semibold mb-5">
                <GraduationCap className="w-4 h-4" /> 教育赋能
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-[2.7rem] font-black text-slate-900 leading-tight mb-4">
                人工智能安全<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500">
                  教学与实训平台
                </span>
              </h1>
              <p className="text-slate-600 text-base mb-6 leading-relaxed max-w-xl">
                集<strong className="text-slate-900">教、学、练、评</strong>于一体的沉浸式AI安全教学平台。面向高校与中大型企业，系统化解决AI安全人才培养的核心痛点。
              </p>
              <div className="grid grid-cols-2 gap-2.5 mb-7">
                {['7大课程维度 · 100+ 实战内容', '课程教学 · 理论闯关 · 实战演练', '支持高校/企业私有化部署', '华为昇腾信创适配认证'].map(item => (
                  <div key={item} className="flex items-center gap-2 text-sm text-slate-700">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-500" /><span>{item}</span>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-3">
                {false && <Button size="lg" className="text-white border-0 shadow-[0_0_24px_rgba(99,102,241,0.4)]"
                  style={{ background: 'linear-gradient(135deg,#6366f1,#4f46e5)' }}
                  onClick={openCourseExperience}>
                  <Play className="w-4 h-4 mr-2" />免费体验课程
                </Button>}
                {false && <Button size="lg" variant="outline" className="text-blue-700 border-blue-300/60 hover:bg-white bg-white/60 backdrop-blur-md">
                  申请院校合作 <ArrowRight className="w-4 h-4 ml-2" />
                </Button>}
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
              <SplitHeroCard />
            </motion.div>
          </div>
        </div>
      </section>

      <StickySubNav items={[
        { id: 'ase-painpoints', label: '行业紧迫性' },
        { id: 'ase-modules', label: '平台模块' },
        { id: 'ase-curriculum', label: '课程体系' },
        { id: 'ase-deployment', label: '部署方式' },
        { id: 'ase-scenarios', label: '应用场景' },
      ]} />

      {/* ── 2. Stats Bar ────────────────────────────────────── */}
      <div style={{ background: 'linear-gradient(135deg,#1e1b4b,#1e3a5f)' }}>
        <div className="max-w-6xl mx-auto px-6 py-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[{ value:'80余篇', label:'国内外权威期刊论文', icon:'📄' }, { value:'90余项', label:'授权发明专利', icon:'🏅' }, { value:'7大', label:'课程维度体系', icon:'📚' }, { value:'100+', label:'AI安全实战内容', icon:'⚗️' }].map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="flex items-center gap-3">
                <div className="text-2xl">{s.icon}</div>
                <div>
                  <div className="text-2xl font-black text-white">{s.value}</div>
                  <div className="text-blue-300/70 text-xs">{s.label}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ── 3. MOD 2: Pain Points — Radial layout, light bg ──── */}
      <section id="ase-painpoints" className="py-20 relative overflow-hidden" style={{ background: 'linear-gradient(135deg,#EBF5FF 0%,#F0F4FF 50%,#EEF7FF 100%)' }}>
        {/* Subtle dot pattern */}
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <svg className="w-full h-full"><defs><pattern id="light-dots" width="24" height="24" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="1" fill="#93c5fd" /></pattern></defs><rect width="100%" height="100%" fill="url(#light-dots)" /></svg>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold mb-4"
              style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', color: '#ef4444' }}>
              <AlertTriangle className="w-3.5 h-3.5" /> 行业紧迫性
            </div>
            <h2 className="text-3xl font-black text-gray-900 mb-2">AI安全人才培养，面临六大核心困境</h2>
            <p className="text-gray-500">传统教学模式已无法应对 AI 安全领域的系统化人才培养需求</p>
          </div>

          {/* ── Radial 3×3 grid layout ── */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px 1fr', gridTemplateRows: 'auto auto auto', gap: '16px 20px', alignItems: 'center' }}>
            {/* Row 1: pain-1, empty, pain-2 */}
            {[
              { icon: Layers, color: '#ef4444', title: '教学资源体系化不足',
                desc: '缺乏系统化的AI安全专项课程与配套资源，现有内容零散，难以支撑完整培养路径。' },
              null,
              { icon: FlaskConical, color: '#f97316', title: '实践环节严重缺失',
                desc: '极度缺乏安全、可控的AI攻防演练环境，学员无法将理论转化为实战能力。' },
            ].map((card, ci) => card ? <RadialCard key={ci} card={card} /> : <div key={ci} />)}

            {/* Row 2: pain-3, center, pain-4 */}
            {[
              { icon: Users, color: '#f59e0b', title: '教学模式互动性不强',
                desc: '教学过程单向灌输，学生参与度低，缺乏有效互动机制和即时反馈。' },
              'center' as const,
              { icon: RefreshCw, color: '#8b5cf6', title: '课程内容与前沿脱节',
                desc: '课程内容更新滞后于技术发展，学员所学与实际AI安全威胁严重脱节。' },
            ].map((card, ci) =>
              card === 'center' ? (
                <div key={ci} className="flex flex-col items-center justify-center py-6 px-4 rounded-3xl"
                  style={{ background: 'linear-gradient(135deg,rgba(59,130,246,0.12),rgba(99,102,241,0.1))', border: '2px solid rgba(99,102,241,0.2)', boxShadow: '0 8px 40px rgba(99,102,241,0.12)' }}>
                  {/* Center AI shield icon */}
                  <div className="w-20 h-20 rounded-full flex items-center justify-center mb-4"
                    style={{ background: 'linear-gradient(135deg,#3b82f6,#6366f1)', boxShadow: '0 8px 32px rgba(99,102,241,0.35)' }}>
                    <Shield className="w-10 h-10 text-white" />
                  </div>
                  <div className="text-[3rem] font-black leading-none mb-1" style={{ color: '#ef4444', textShadow: '0 2px 16px rgba(239,68,68,0.25)' }}>
                    30万+
                  </div>
                  <div className="text-sm font-bold text-gray-700 text-center mb-1">全球AI安全人才缺口</div>
                  <div className="text-xs text-gray-500 text-center">IDC·华为预测至2030年</div>
                  {/* Radiating lines */}
                  <div className="mt-3 flex items-center gap-2">
                    <div className="h-px w-10" style={{ background: 'linear-gradient(90deg,transparent,rgba(239,68,68,0.4))' }} />
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                    <div className="h-px w-10" style={{ background: 'linear-gradient(90deg,rgba(239,68,68,0.4),transparent)' }} />
                  </div>
                </div>
              ) : card ? <RadialCard key={ci} card={card} /> : <div key={ci} />
            )}

            {/* Row 3: pain-5, empty, pain-6 */}
            {[
              { icon: Brain, color: '#06b6d4', title: '协同学习与知识沉淀缺失',
                desc: '讨论中产生的解决方案无法转化为可复用的知识资产，优质经验随学期消散。' },
              null,
              { icon: Building2, color: '#6366f1', title: '产学研协同机制缺失',
                desc: '高校与企业、研究机构缺乏稳定合作机制，导致人才培养与产业实际需求脱节。' },
            ].map((card, ci) => card ? <RadialCard key={ci} card={card} /> : <div key={ci} />)}
          </div>
        </div>
      </section>

      {/* ── 4. MOD 3: Platform Modules with real screenshots ─── */}
      <section id="ase-modules" className="py-20 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-semibold mb-4">
              <Layers className="w-3.5 h-3.5" /> 整体功能
            </div>
            <h2 className="text-3xl font-black text-gray-900 mb-3">集「教、学、练、评」于一体</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">课程教学、理论闯关、实战演练、讨论社区四大核心模块，覆盖从知识传授到实战内化的完整闭环</p>
          </div>

          {/* Module Tabs */}
          <div className="flex justify-center mb-8">
            <div className="flex gap-2 bg-gray-100 rounded-xl p-1.5 flex-wrap justify-center">
              {moduleDetails.map((m, i) => (
                <button key={m.key} onClick={() => setActiveModule(i)}
                  className="px-5 py-2.5 rounded-lg text-sm font-bold transition-all duration-200"
                  style={activeModule === i ? { background: m.color, color: '#fff', boxShadow: `0 4px 14px ${m.color}40` } : { background: 'transparent', color: '#64748b' }}>
                  {m.key}
                </button>
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={activeModule} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
              {(() => {
                const mod = moduleDetails[activeModule];
                const Icon = mod.icon;
                return (
                  <div className="grid lg:grid-cols-2 rounded-3xl overflow-hidden"
                    style={{ border: `1.5px solid ${mod.color}20`, boxShadow: `0 8px 40px ${mod.color}10` }}>
                    {/* Left: text */}
                    <div className="p-10 flex flex-col justify-center bg-white">
                      <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
                        style={{ background: `${mod.color}12`, border: `1.5px solid ${mod.color}30` }}>
                        <Icon className="w-7 h-7" style={{ color: mod.color }} />
                      </div>
                      <h3 className="text-2xl font-black text-gray-900 mb-2">{mod.key}</h3>
                      <p className="text-sm font-semibold mb-4" style={{ color: mod.color }}>{mod.tagline}</p>
                      <p className="text-gray-600 text-base leading-relaxed mb-6">{mod.desc}</p>
                      <div className="space-y-3">
                        {mod.points.map((p, i) => (
                          <div key={i} className="flex items-start gap-3 text-sm text-gray-700">
                            <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" style={{ color: mod.color }} />
                            <span>{p}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    {/* Right: real screenshot — light background, no dark overlay */}
                    <div className="relative" style={{ minHeight: 420, background: '#f0f7ff' }}>
                      <img src={mod.img} alt={mod.key}
                        className="absolute inset-0 w-full h-full object-cover object-top"
                        style={{ borderLeft: `1px solid ${mod.color}15` }} />
                      {/* Very light color accent only at bottom */}
                      <div className="absolute bottom-0 left-0 right-0 h-16"
                        style={{ background: `linear-gradient(to top,${mod.color}18,transparent)` }} />
                    </div>
                  </div>
                );
              })()}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ── 5. MOD 4: Curriculum Staircase Roadmap ───────────── */}
      <section id="ase-curriculum" className="py-20 relative" style={{ background: 'linear-gradient(160deg,#f8faff 0%,#ffffff 60%,#f4f8ff 100%)' }}>
        <div className="max-w-full px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-semibold mb-4">
              <BookOpen className="w-3.5 h-3.5" /> 课程体系
            </div>
            <h2 className="text-3xl font-black text-gray-900 mb-3">七章阶梯进阶，从入门到精通</h2>
            <p className="text-gray-500">基于《深度学习数据与算法安全及其应用》 · 悬停关卡查看详细知识点</p>
          </div>
          <CurriculumRoadmap />
        </div>
      </section>

      {/* ── 6. MOD 5: Advantages Tab Layout ──────────────────── */}
      <AdvantagesSection />

      {/* ── 7. Service Deployment ──────────────────────────── */}
      <section id="ase-deployment" className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-semibold mb-4">
              <Server className="w-3.5 h-3.5" /> 服务部署
            </div>
            <h2 className="text-3xl font-black text-gray-900 mb-4">两种部署模式，灵活适配需求</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              { icon: Server, color: '#6366f1', title: '本地部署', badge: '数据不出校',
                desc: '将平台完整部署于校园网或数据中心内，满足数据不出校、更高安全管控级别的需求。',
                points: ['数据完全存储于本地', '更高安全管控级别', '完整的部署与培训支持', '专属后期技术支持服务'], cta: '申请私有化部署' },
              { icon: Cloud, color: '#0ea5e9', title: '云服务', badge: '开箱即用',
                desc: '开箱即用，由我们负责全部运维与更新，学校按需订阅服务，快速上线，支持200+学生同时在线。',
                points: ['无需自建基础设施', '200+ 学生同时在线', '全部运维与版本更新', '按需订阅，快速上线'], cta: '立即开始试用' },
            ].map((dep, i) => {
              const Icon = dep.icon;
              return (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -4 }} className="rounded-2xl p-8 flex flex-col transition-all duration-300"
                  style={{ border: `2px solid ${dep.color}20`, boxShadow: `0 6px 32px ${dep.color}0c` }}>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
                      style={{ background: `${dep.color}10`, border: `1.5px solid ${dep.color}30` }}>
                      <Icon className="w-7 h-7" style={{ color: dep.color }} />
                    </div>
                    <span className="text-xs font-black px-3 py-1 rounded-full"
                      style={{ background: `${dep.color}12`, color: dep.color, border: `1px solid ${dep.color}25` }}>{dep.badge}</span>
                  </div>
                  <h3 className="text-xl font-black text-gray-900 mb-3">{dep.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-6 flex-1">{dep.desc}</p>
                  <div className="space-y-2 mb-7">
                    {dep.points.map(p => (
                      <div key={p} className="flex items-center gap-2 text-sm text-gray-700">
                        <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: dep.color }} />{p}
                      </div>
                    ))}
                  </div>
                  {false && <button className="w-full py-3 rounded-xl text-sm font-bold transition-all"
                    style={{ background: `linear-gradient(135deg,${dep.color},${dep.color}cc)`, color: '#fff', border: 'none', boxShadow: `0 4px 16px ${dep.color}30` }}>
                    {dep.cta} <ArrowRight className="w-4 h-4 inline ml-1" />
                  </button>}
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 8. Application Scenarios ─────────────────────────── */}
      <section id="ase-scenarios" className="py-20" style={{ background: 'linear-gradient(180deg,#F4F6FA,#ffffff)' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-semibold mb-4">
              <Target className="w-3.5 h-3.5" /> 应用场景
            </div>
            <h2 className="text-3xl font-black text-gray-900 mb-4">主要面向客户</h2>
            <p className="text-gray-500">面向高校、教育机构与中大型企业，提供针对性解决方案</p>
          </div>
          <div className="grid lg:grid-cols-2 gap-10">
            {[
              { emoji: '🎓', color: '#6366f1', title: '高校与教育机构', sub: '「理论+实践」结合教学模式', bg: 'linear-gradient(135deg,#f0f0ff,#e8f1fd)',
                desc: '提供人工智能安全领域的理论教学与实训工具，有效解决课程资源不完整、专业实训平台缺失的难题。从AI安全核心理论学起，参与前沿科研项目，在多任务、多场景的攻防实战演练中锤炼硬技能。',
                points: ['开箱即用的AI安全实验教学体系', '降低专业实训平台建设成本', '与产业前沿实际需求紧密对接', '支持私有化部署，数据不出校'],
                cta: '申请校园版' },
              { emoji: '🏢', color: '#0ea5e9', title: '中大型企业', sub: '「学+练+评」闭环赋能体系', bg: 'linear-gradient(135deg,#f0f8ff,#e8f4ff)',
                desc: '帮助企业系统化应对日益复杂的安全挑战，弥补体系化培训资源的不足。通过定制化AI安全课程夯实理论基础，结合真实产业案例深化实战认知，依托沉浸式攻防实训环境提升实操能力。',
                points: ['系统化应对日益复杂的AI安全挑战', '真实产业案例解析深化实战认知', '沉浸式攻防实训环境提升实操能力', '定制化课程与私有化部署支持'],
                cta: '申请企业版' },
            ].map((aud, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: i === 0 ? -20 : 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                className="rounded-2xl overflow-hidden" style={{ border: `1.5px solid ${aud.color}18`, boxShadow: `0 6px 32px ${aud.color}07` }}>
                <div className="p-8 pb-6" style={{ background: aud.bg }}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="text-3xl">{aud.emoji}</div>
                    <div>
                      <h3 className="text-xl font-black text-gray-900">{aud.title}</h3>
                      <p className="text-sm font-semibold" style={{ color: aud.color }}>{aud.sub}</p>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">{aud.desc}</p>
                </div>
                <div className="p-8 bg-white">
                  <div className="space-y-2">
                    {aud.points.map(p => (
                      <div key={p} className="flex items-center gap-2 text-sm text-gray-700">
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" style={{ color: aud.color }} />{p}
                      </div>
                    ))}
                  </div>
                  {false && <button className="mt-6 w-full py-2.5 rounded-xl text-sm font-bold"
                    style={{ background: aud.color + '12', color: aud.color, border: `1.5px solid ${aud.color}25` }}>
                    {aud.cta} <ArrowRight className="w-3.5 h-3.5 inline ml-1" />
                  </button>}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 9. FAQ ──────────────────────────────────────────── */}
      <section className="hidden py-20 bg-slate-50 border-t border-gray-200" aria-hidden="true">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-gray-900 mb-3">常见问题</h2>
            <p className="text-gray-500">关于人工智能安全教学平台的常见疑问</p>
          </div>
          <div className="space-y-4">
            {[
              { q:'平台课程是基于什么教材设计的？', a:'平台课程体系基于《深度学习数据与算法安全及其应用》进行设计，涵盖AI安全基础、可信理论、攻击方法、防御方法、测试评估、领域应用、实践案例七大维度，形成从背景理论出发到实践案例收尾的完整闭环。' },
              { q:'实战演练模块需要自备GPU或本地环境吗？', a:'完全不需要。实战演练模块提供基于JupyterLab、预集成全套工具的在线云端开发环境，一键进入，无需本地配置。系统自动分配所需算力资源，环境启动时间通常小于60秒。' },
              { q:'理论闯关和传统题库有什么不同？', a:'理论闯关将AI安全知识点设计成层层递进的趣味关卡，难度层层递进，必须掌握当前知识点才可解锁后续关卡；学生答题后立即获得正误反馈与详细知识点解析；系统还提供错题纠错溯源功能，并通过积分、勋章与排名营造良性学习竞争氛围。' },
              { q:'平台是否支持国产化信创适配？', a:'是的。平台已与华为昇腾框架进行适配，系统全面适配国产信创，实现核心技术自主可控，保障国家信息安全与产业安全。如有具体信创适配需求，欢迎联系我们的技术团队进行评估。' },
              { q:'高校或企业客户如何定制课程内容？', a:'院校版和企业版均支持定制化内容。课程与实验模块支持灵活增删，可根据学校专业特色和教学重点进行垂直领域定制化开发。私有化部署方案中，定制内容数据完全在本地隔离运行，充分保护您的内部资产安全。' },
            ].map((item, i) => <FaqItem key={i} q={item.q} a={item.a} index={i} />)}
          </div>
        </div>
      </section>

      {/* ── 10. CTA ──────────────────────────────────────────── */}
      <section id="ase-cta" className="hidden py-20" aria-hidden="true" style={{ background: 'linear-gradient(135deg,#fffbeb,#fef3c7,#fde68a)', borderTop: '1px solid #fcd34d' }}>
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center" style={{ background: 'rgba(245,158,11,0.12)', border: '1.5px solid rgba(245,158,11,0.35)' }}>
              <GraduationCap className="w-8 h-8" style={{ color: '#b45309' }} />
            </div>
            <h2 className="text-3xl font-black mb-4" style={{ color: '#78350f' }}>构建真正的 AI 安全人才培养体系</h2>
            <p className="text-lg mb-10 max-w-2xl mx-auto leading-relaxed" style={{ color: '#57534e' }}>
              「教、学、练、评」一体化平台，80余篇权威论文支撑，7大课程维度，华为昇腾信创认证，帮助高校与企业系统化解决AI安全人才培养核心痛点。
            </p>
            <div className="flex flex-wrap gap-4 justify-center mb-10">
              <Button size="lg" className="font-bold px-8 border-0" style={{ background: 'linear-gradient(135deg,#f59e0b,#d97706)', color: '#fff', boxShadow: '0 4px 20px rgba(245,158,11,0.35)' }} onClick={openCourseExperience}>
                <Play className="w-4 h-4 mr-2" />免费体验课程
              </Button>
              <Button size="lg" className="font-bold px-8" style={{ background: '#fff', border: '1.5px solid #fbbf24', color: '#92400e' }}>
                申请机构合作 <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
            <div className="flex items-center justify-center gap-8 text-sm flex-wrap" style={{ color: '#78350f' }}>
              {['支持本地部署与云服务', '高校与企业定制化方案', '华为昇腾全栈信创适配'].map(item => (
                <div key={item} className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: '#d97706' }} />{item}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
      <GuestGuard open={showGuestGuard} onClose={() => setShowGuestGuard(false)} action="体验AI安全课程" />
    </div>
  );
}

// ─── Helper: Radial pain point card (borderless) ──────────────────
function RadialCard({ card }: { card: { icon: React.ElementType; color: string; title: string; desc: string } }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
      whileHover={{ scale: 1.02, y: -2 }}
      className="rounded-2xl px-4 py-3 transition-all duration-200"
      style={{ background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(6px)' }}>
      <div className="flex items-center gap-2.5 mb-2">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: card.color + '15' }}>
          <AlertTriangle className="w-4 h-4" style={{ color: card.color }} />
        </div>
        <h3 style={{ fontWeight: 800, color: '#1e293b', fontSize: 15, lineHeight: 1.3 }}>{card.title}</h3>
      </div>
      <p style={{ color: '#475569', fontSize: 14, lineHeight: 1.65, margin: 0 }}>{card.desc}</p>
    </motion.div>
  );
}
