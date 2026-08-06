import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShieldCheck, CheckCircle2, AlertTriangle, Clock, XCircle,
  ArrowRight, FileText, Lock, Search, ChevronDown,
  Users, Zap, BarChart3, Award, Globe, BookOpen,
  Layers, ClipboardCheck, Target, Briefcase, Star,
  Building2, GraduationCap, RefreshCw, HelpCircle,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { ProductHeroBackground } from '../components/ProductHeroBackground';
import { ScrollReveal } from '../components/ScrollReveal';
import { StickySubNav } from '../components/StickySubNav';
import { ExpertConsultModal } from '../components/ExpertConsultModal';

// ── Hero right card: Standards Framework Visualization ───────────
const StandardsCard = () => (
  <div className="relative w-full max-w-sm mx-auto" style={{ transform: 'perspective(1200px) rotateY(-6deg) rotateX(2deg)', transformOrigin: 'center center' }}>
    <div className="absolute inset-0 rounded-2xl pointer-events-none" style={{ boxShadow: '0 0 60px rgba(139,92,246,0.2), 0 0 120px rgba(59,130,246,0.12)' }} />
    <div className="p-px rounded-2xl" style={{ background: 'linear-gradient(135deg, rgba(167,139,250,0.6), rgba(147,197,253,0.5), rgba(255,255,255,0.3))' }}>
      <div className="rounded-2xl p-6 overflow-hidden relative" style={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,0.7)', boxShadow: '0 20px 60px rgba(15,23,42,0.16), inset 0 1px 0 rgba(255,255,255,0.9)' }}>
        <div className="flex items-center justify-between mb-5 pb-4" style={{ borderBottom: '1px solid rgba(226,232,240,0.6)' }}>
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-violet-500" />
            <span className="text-gray-900 text-sm font-semibold">可信标准认证体系</span>
          </div>
          <motion.div animate={{ opacity: [1, 0.7, 1] }} transition={{ duration: 2.5, repeat: Infinity }}
            className="px-2.5 py-1 rounded-full text-violet-600 text-xs font-bold flex items-center gap-1.5"
            style={{ background: 'rgba(237,233,254,0.9)', border: '1px solid rgba(196,181,253,0.8)' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-violet-500 inline-block" />已发布
          </motion.div>
        </div>

        {/* 3-level pyramid */}
        <div className="space-y-2 mb-5">
          {[
            { level: '国家级', icon: '🏛️', color: '#8b5cf6', bg: 'rgba(139,92,246,0.08)', border: 'rgba(139,92,246,0.25)', items: ['GB/T 42118', '生成式AI管理办法', 'AI伦理规范'] },
            { level: '行业级', icon: '🏢', color: '#3b82f6', bg: 'rgba(59,130,246,0.07)', border: 'rgba(59,130,246,0.22)', items: ['金融AI标准', '医疗AI标准', '自动驾驶标准'] },
            { level: '企业级', icon: '⚙️', color: '#10b981', bg: 'rgba(16,185,129,0.07)', border: 'rgba(16,185,129,0.22)', items: ['评测规范', '数据治理标准', '模型交付标准'] },
          ].map((row, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.3 + 0.5 }}
              className="rounded-xl p-3" style={{ background: row.bg, border: `1px solid ${row.border}` }}>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-sm">{row.icon}</span>
                <span className="text-xs font-bold" style={{ color: row.color }}>{row.level}标准</span>
              </div>
              <div className="flex gap-1.5 flex-wrap">
                {row.items.map(item => (
                  <span key={item} className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ background: 'rgba(255,255,255,0.8)', color: '#475569', border: '1px solid rgba(0,0,0,0.08)' }}>{item}</span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="flex justify-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 1.5 }}
            className="w-14 h-14 rounded-full flex items-center justify-center relative"
            style={{ background: 'rgba(237,233,254,0.9)', border: '4px solid rgba(255,255,255,0.9)', boxShadow: '0 8px 24px rgba(139,92,246,0.22)' }}>
            <Award className="w-8 h-8 text-violet-500" />
            <motion.div animate={{ opacity: [0, 0.35, 0], scale: [1, 1.5, 1] }} transition={{ duration: 2.5, repeat: Infinity }}
              className="absolute inset-0 bg-violet-400 rounded-full blur-md -z-10" />
          </motion.div>
        </div>
        <div className="absolute top-0 right-0 w-32 h-32 pointer-events-none" style={{ background: 'rgba(139,92,246,0.07)', filter: 'blur(40px)' }} />
        <div className="absolute bottom-0 left-0 w-32 h-32 pointer-events-none" style={{ background: 'rgba(59,130,246,0.07)', filter: 'blur(40px)' }} />
      </div>
    </div>
    <div className="absolute -bottom-6 left-4 right-4 h-8 rounded-2xl pointer-events-none" style={{ background: 'rgba(15,23,42,0.1)', filter: 'blur(16px)', transform: 'perspective(1200px) rotateY(-6deg)' }} />
  </div>
);

// ── FAQ Item ─────────────────────────────────────────────────────
const FaqItem = ({ q, a, index }: { q: string; a: string; index: number }) => {
  const [open, setOpen] = useState(index === 0);
  return (
    <motion.div layout className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      <button className="w-full flex items-center gap-4 p-5 text-left hover:bg-gray-50 transition-colors" onClick={() => setOpen(v => !v)}>
        <div className="shrink-0 w-8 h-8 rounded-full bg-violet-50 flex items-center justify-center">
          <HelpCircle className="w-4 h-4 text-violet-600" />
        </div>
        <span className="flex-1 text-gray-900 font-bold text-sm">{q}</span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="w-5 h-5 text-gray-400 shrink-0" />
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
};

// ── Main Page ─────────────────────────────────────────────────────
export function TiancheStandardService() {
  const [consultOpen, setConsultOpen] = useState(false);
  const [activeStdTab, setActiveStdTab] = useState<'domestic' | 'international' | 'industry'>('domestic');

  return (
    <div className="min-h-screen bg-slate-50 font-sans">

      {/* ── 1. Hero ────────────────────────────────────────────── */}
      <section className="product-detail-hero relative overflow-hidden pt-24 pb-20 sm:pt-32 sm:pb-28 min-h-[600px] flex items-center bg-[#060e1d]">
        <ProductHeroBackground side="service" concept="standards" />
        <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-400/20 text-violet-300 text-xs font-medium mb-6">
                <BookOpen className="w-4 h-4" />
                合规治理
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight mb-6">
                可信 AI 安全标准<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-blue-400">制定与落地服务</span>
              </h1>
              <p className="text-blue-100/80 text-lg mb-8 leading-relaxed max-w-xl">
                依托浙江大学学术资源与行业专家团队，帮助企业系统性构建 AI 应用评测规范、数据治理标准与模型交付体系，助力参与行业及国家 AI 标准制定。
              </p>
              <div className="flex flex-col sm:flex-row gap-3 mb-8">
                <div className="flex items-center gap-2 text-sm text-emerald-400">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>对接 ISO/IEC 42001 · GB/T · NIST AI RMF 全球主流框架</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-emerald-400">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>学术 + 实践双轨标准制定，可交付完整规范文本</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" className="text-white border-0 shadow-[0_0_20px_rgba(139,92,246,0.4)]"
                  style={{ background: 'linear-gradient(135deg,#8b5cf6,#6366f1)' }}>
                  <FileText className="w-4 h-4 mr-2" />
                  免费领取 AI 标准建设白皮书
                </Button>
                <Button size="lg" variant="outline" onClick={() => setConsultOpen(true)} className="text-blue-300 border-blue-400/30 hover:bg-blue-400/10 bg-transparent">
                  预约专家免费咨询
                </Button>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="lg:pl-10">
              <StandardsCard />
            </motion.div>
          </div>
        </div>
      </section>

      <StickySubNav items={[
        { id: 'tss-why', label: '标准的重要性' },
        { id: 'tss-landscape', label: '标准格局' },
        { id: 'tss-scope', label: '服务范围' },
        { id: 'tss-process', label: '服务流程' },
        { id: 'tss-faq', label: 'FAQ' },
        { id: 'tss-cta', label: '立即咨询' },
      ]} />

      {/* ── 2. Why Standards Matter ───────────────────────────── */}
      <section id="tss-why" className="py-24 relative overflow-hidden" style={{ background: '#F4F6FA' }}>
        <div className="absolute inset-0 pointer-events-none opacity-40">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg"><defs><pattern id="std-grid" width="48" height="48" patternUnits="userSpaceOnUse"><path d="M 48 0 L 0 0 0 48" fill="none" stroke="#dde3ee" strokeWidth="1" /></pattern></defs><rect width="100%" height="100%" fill="url(#std-grid)" /></svg>
        </div>
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-black text-gray-900 mb-4">缺乏标准体系，AI 落地举步维艰</h2>
            <p className="text-gray-500 text-lg">四大痛点制约企业 AI 规模化应用与合规交付</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
            {[
              {
                icon: AlertTriangle, iconBg: 'bg-red-50', iconColor: 'text-red-500', accentColor: '#ef4444', shadow: 'rgba(239,68,68,0.12)',
                title: '合规风险敞口大', bigNum: '73%', bigLabel: '的企业无正式 AI 治理标准',
                desc: '生成式 AI 爆发式落地，但大多数企业仍缺乏完整的 AI 应用评测规范，一旦出现事故即面临监管追责与品牌危机。',
                tags: [{ label: '监管追责', cls: 'bg-red-50 text-red-600 border-red-200' }, { label: '数据泄露风险', cls: 'bg-orange-50 text-orange-600 border-orange-200' }],
              },
              {
                icon: Layers, iconBg: 'bg-blue-50', iconColor: 'text-blue-500', accentColor: '#3b82f6', shadow: 'rgba(59,130,246,0.12)',
                title: '行业标准碎片化', bigNum: '200+', bigLabel: '个 AI 相关标准，难以适配',
                desc: '国内外 AI 标准数量众多但相互重叠，企业难以判断应采用哪套框架，导致重复投入或关键要点遗漏。',
                tags: [{ label: '标准选型困难', cls: 'bg-blue-50 text-blue-600 border-blue-200' }, { label: '重复建设', cls: 'bg-indigo-50 text-indigo-600 border-indigo-200' }],
              },
              {
                icon: Clock, iconBg: 'bg-orange-50', iconColor: 'text-orange-500', accentColor: '#f97316', shadow: 'rgba(249,115,22,0.12)',
                title: '专业人才极度匮乏', bigNum: '6–12', bigLabel: '个月 · 自建标准体系周期',
                desc: 'AI 标准制定需兼具法律合规、安全工程与业务理解，复合型人才稀缺，自建团队成本高、周期长，严重拖慢业务落地。',
                tags: [{ label: '人才缺口大', cls: 'bg-orange-50 text-orange-600 border-orange-200' }, { label: '周期长', cls: 'bg-amber-50 text-amber-600 border-amber-200' }],
              },
              {
                icon: Lock, iconBg: 'bg-purple-50', iconColor: 'text-purple-500', accentColor: '#a855f7', shadow: 'rgba(168,85,247,0.12)',
                title: '无法参与行业话语权', bigNum: '0', bigLabel: '参与国家标准 = 失去先发优势',
                desc: '标准制定方掌握行业规则制定权，未能参与的企业只能被动接受，在市场准入、客户信任和政策红利上处于不利地位。',
                tags: [{ label: '话语权缺失', cls: 'bg-purple-50 text-purple-600 border-purple-200' }, { label: '竞争劣势', cls: 'bg-violet-50 text-violet-600 border-violet-200' }],
              },
            ].map((card, i) => {
              const Icon = card.icon;
              return (
                <motion.div key={i} initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                  whileHover={{ y: -6, transition: { duration: 0.2 } }}
                  className="bg-white rounded-2xl p-7 flex flex-col gap-4 transition-all duration-300"
                  style={{ border: `1.5px solid ${card.accentColor}22`, boxShadow: `0 6px 32px ${card.shadow}, 0 1px 4px rgba(0,0,0,0.06)` }}>
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${card.iconBg}`}
                      style={{ boxShadow: `0 4px 14px ${card.shadow}` }}>
                      <Icon className={`w-6 h-6 ${card.iconColor}`} />
                    </div>
                    <h3 className="text-xl font-black text-gray-900">{card.title}</h3>
                  </div>
                  <div className="flex items-end gap-2 px-4 py-3 rounded-xl" style={{ background: `${card.accentColor}0d`, border: `1px solid ${card.accentColor}20` }}>
                    <span className="font-black leading-none" style={{ fontSize: '2.4rem', color: card.accentColor }}>{card.bigNum}</span>
                    <span className="text-sm text-gray-500 mb-1 leading-tight">{card.bigLabel}</span>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">{card.desc}</p>
                  <div className="flex flex-wrap gap-2 mt-auto pt-1">
                    {card.tags.map(t => <span key={t.label} className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${t.cls}`}>{t.label}</span>)}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 3. Standards Landscape ────────────────────────────── */}
      <section id="tss-landscape" className="py-24 border-y border-gray-200" style={{ background: '#F0F4FA' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-50 border border-violet-100 text-violet-600 text-xs font-semibold mb-4">
              <Globe className="w-3.5 h-3.5" /> 标准图谱
            </div>
            <h2 className="text-3xl font-black text-gray-900 mb-4">全球 AI 安全标准全景图</h2>
            <p className="text-gray-500">我们深度对接国内外主流框架，确保您的标准体系具备国际视野</p>
          </div>

          {/* Tab selector */}
          <div className="flex justify-center mb-8">
            <div className="flex gap-0 bg-gray-100 rounded-xl p-1.5 shadow-sm">
              {[
                { key: 'domestic', label: '国内标准', color: '#8b5cf6' },
                { key: 'international', label: '国际标准', color: '#3b82f6' },
                { key: 'industry', label: '行业标准', color: '#10b981' },
              ].map(tab => (
                <button key={tab.key} onClick={() => setActiveStdTab(tab.key as typeof activeStdTab)}
                  className="px-6 py-2.5 rounded-lg text-sm font-bold transition-all duration-200"
                  style={activeStdTab === tab.key ? { background: tab.color, color: '#fff', boxShadow: `0 4px 14px ${tab.color}35` } : { background: 'transparent', color: '#64748b' }}>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={activeStdTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
              {activeStdTab === 'domestic' && (
                <div className="grid md:grid-cols-3 gap-6">
                  {[
                    { icon: '📜', title: '生成式AI服务管理暂行办法', org: '国家互联网信息办公室', year: '2023', color: '#8b5cf6', desc: '规定了生成式AI服务的提供条件、安全评估、数据合规及备案要求，是最核心的国内监管文件。' },
                    { icon: '🔐', title: 'GB/T 42118-2023', org: '国家标准化管理委员会', year: '2023', color: '#3b82f6', desc: '信息安全技术-人工智能计算系统通用安全要求，规定了AI系统的安全能力要求与测试方法。' },
                    { icon: '⚖️', title: '新一代人工智能伦理规范', org: '科学技术部', year: '2021', color: '#10b981', desc: '从算法设计、数据处理、平台运营等维度提出AI伦理原则，是企业AI伦理体系建设的重要依据。' },
                    { icon: '🤖', title: '互联网信息服务算法推荐管理规定', org: '国家互联网信息办公室', year: '2022', color: '#f59e0b', desc: '针对算法推荐服务的透明度、用户权益保护与安全评估提出具体要求，适用于推荐系统AI治理。' },
                    { icon: '🏥', title: '医疗器械软件注册审查指导原则', org: '国家药监局', year: '2022', color: '#ef4444', desc: '适用于医疗AI软件的注册审查，明确了算法性能、数据集、安全性的评测标准。' },
                    { icon: '🏗️', title: '人工智能标准化白皮书（2023版）', org: '中国电子技术标准化研究院', year: '2023', color: '#06b6d4', desc: '梳理国内AI标准化现状与规划，是企业建立标准体系的重要参考蓝图。' },
                  ].map((item, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                      className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-md transition-all" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0" style={{ background: `${item.color}12`, border: `1.5px solid ${item.color}25` }}>{item.icon}</div>
                        <div>
                          <div className="font-bold text-gray-900 text-sm leading-tight">{item.title}</div>
                          <div className="text-xs text-gray-400 mt-1">{item.org} · {item.year}</div>
                        </div>
                      </div>
                      <p className="text-gray-600 text-xs leading-relaxed">{item.desc}</p>
                    </motion.div>
                  ))}
                </div>
              )}
              {activeStdTab === 'international' && (
                <div className="grid md:grid-cols-3 gap-6">
                  {[
                    { icon: '🌐', title: 'ISO/IEC 42001:2023', org: '国际标准化组织', color: '#3b82f6', desc: 'AI管理系统标准，规定了建立、实施、维护和持续改进AI管理系统的要求，是目前最权威的AI治理国际标准。' },
                    { icon: '🛡️', title: 'NIST AI RMF 1.0', org: '美国国家标准与技术研究院', color: '#6366f1', desc: 'AI风险管理框架，提供可信、可解释、公平、可靠、安全等核心维度的AI风险管理指南。' },
                    { icon: '🤝', title: 'IEEE P2089', org: '电气电子工程师学会', color: '#8b5cf6', desc: '年龄适当的数字服务标准，专注于AI产品对未成年人的影响评估与保护措施制定。' },
                    { icon: '🇪🇺', title: 'EU AI Act', org: '欧盟委员会', color: '#f59e0b', desc: '全球首部综合性AI法规，将AI系统按风险分级（不可接受/高/有限/最小），规定了各级的合规义务。' },
                    { icon: '📋', title: 'ISO/IEC 23053', org: '国际标准化组织', color: '#10b981', desc: '机器学习系统的框架标准，描述了ML系统的通用概念、术语与架构，是AI系统分类与评估的基础语言。' },
                    { icon: '🔬', title: 'OECD AI Principles', org: '经济合作与发展组织', color: '#06b6d4', desc: '首个政府间AI原则协议，从包容增长、以人为本、透明度、鲁棒性和安全等维度建立AI伦理基准。' },
                  ].map((item, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                      className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-md transition-all" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0" style={{ background: `${item.color}12`, border: `1.5px solid ${item.color}25` }}>{item.icon}</div>
                        <div>
                          <div className="font-bold text-gray-900 text-sm leading-tight">{item.title}</div>
                          <div className="text-xs text-gray-400 mt-1">{item.org}</div>
                        </div>
                      </div>
                      <p className="text-gray-600 text-xs leading-relaxed">{item.desc}</p>
                    </motion.div>
                  ))}
                </div>
              )}
              {activeStdTab === 'industry' && (
                <div className="grid md:grid-cols-3 gap-6">
                  {[
                    { icon: '🏦', title: '金融行业 AI 应用规范', org: '中国银行保险监督管理委员会', color: '#3b82f6', desc: '针对金融AI算法的可解释性、公平性与风险管理提出专项要求，适用于信贷评分、反欺诈等场景。' },
                    { icon: '🏥', title: '医疗 AI 临床应用标准', org: '国家卫生健康委员会', color: '#10b981', desc: '规范医疗AI辅助诊断系统的准确率要求、数据标注规范、临床测试方案与上市后监测机制。' },
                    { icon: '🚗', title: '自动驾驶 AI 安全评测规范', org: '工业和信息化部', color: '#f59e0b', desc: '明确了L2-L4级自动驾驶AI的功能安全、网络安全与数据安全的评测要求与测试场景库。' },
                    { icon: '📱', title: '互联网 AI 内容安全标准', org: '中国互联网协会', color: '#8b5cf6', desc: '针对社交平台、短视频、搜索引擎的AI内容审核机制提出基线要求与效果验证方法。' },
                    { icon: '🏭', title: '智能制造 AI 质量标准', org: '国家市场监督管理总局', color: '#ef4444', desc: '工业AI视觉检测、预测性维护场景的可靠性评测框架，与ISO 9001质量管理体系对接。' },
                    { icon: '🎓', title: '教育 AI 伦理应用指南', org: '教育部', color: '#06b6d4', desc: '规范教育场景中AI辅助教学、智能评测的数据收集限制、算法透明度与学生隐私保护。' },
                  ].map((item, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                      className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-md transition-all" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0" style={{ background: `${item.color}12`, border: `1.5px solid ${item.color}25` }}>{item.icon}</div>
                        <div>
                          <div className="font-bold text-gray-900 text-sm leading-tight">{item.title}</div>
                          <div className="text-xs text-gray-400 mt-1">{item.org}</div>
                        </div>
                      </div>
                      <p className="text-gray-600 text-xs leading-relaxed">{item.desc}</p>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ── 4. Service Scope ──────────────────────────────────── */}
      <section id="tss-scope" className="py-24 bg-white relative overflow-hidden border-b border-gray-200">
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <svg className="w-full h-full"><defs><pattern id="dots-std" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="1" fill="#cbd5e1" /></pattern></defs><rect width="100%" height="100%" fill="url(#dots-std)" /></svg>
        </div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-50 border border-violet-100 text-violet-600 text-xs font-semibold mb-4">
              <ClipboardCheck className="w-3.5 h-3.5" /> 服务范围
            </div>
            <h2 className="text-3xl font-black text-gray-900 mb-4">五大核心服务能力</h2>
            <p className="text-gray-500">从现状评估到持续运营，覆盖标准建设全生命周期</p>
          </div>
          <div className="grid md:grid-cols-5 gap-5">
            {[
              { num: '01', icon: Search, color: '#3b82f6', title: '现状评估', desc: '审查企业现有AI应用评测机制与数据治理实践，识别与主流标准的差距与风险敞口', tags: ['差距分析', '合规诊断'] },
              { num: '02', icon: Target, color: '#8b5cf6', title: '标准设计', desc: '参照国内外标准框架，结合企业业务场景，量身定制AI评测规范与数据管理制度', tags: ['定制规范', '框架设计'] },
              { num: '03', icon: FileText, color: '#06b6d4', title: '文本起草', desc: '由行业专家团队执笔，出具符合监管要求与国际视野的标准文本、白皮书及实施指南', tags: ['标准文本', '可交付成果'] },
              { num: '04', icon: GraduationCap, color: '#f59e0b', title: '培训落地', desc: '开展内部宣贯培训，辅导技术与业务团队理解并执行新制定的标准体系', tags: ['培训赋能', '执行支撑'] },
              { num: '05', icon: RefreshCw, color: '#10b981', title: '持续维护', desc: '跟踪监管动态，定期更新标准内容，提供年度复审与整改闭环追踪服务', tags: ['动态更新', '闭环管理'] },
            ].map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className="bg-white rounded-2xl p-5 flex flex-col" style={{ border: `1.5px solid ${s.color}20`, boxShadow: `0 4px 24px ${s.color}0a` }}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: `${s.color}12`, border: `1.5px solid ${s.color}30` }}>
                      <Icon className="w-5 h-5" style={{ color: s.color }} />
                    </div>
                    <span className="text-3xl font-black" style={{ color: `${s.color}18`, lineHeight: 1 }}>{s.num}</span>
                  </div>
                  <div className="font-black text-gray-900 mb-2" style={{ fontSize: '0.95rem' }}>{s.title}</div>
                  <p className="text-gray-500 text-xs leading-relaxed mb-4 flex-1">{s.desc}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {s.tags.map(tag => <span key={tag} className="rounded-full text-xs px-2.5 py-0.5 font-medium" style={{ background: `${s.color}10`, color: s.color, border: `1px solid ${s.color}22` }}>{tag}</span>)}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 5. Process Flow ───────────────────────────────────── */}
      <section id="tss-process" className="py-24 bg-slate-50 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-30">
          <svg className="w-full h-full"><defs><pattern id="dots-flow2" width="24" height="24" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="1" fill="#bfdbfe" /></pattern></defs><rect width="100%" height="100%" fill="url(#dots-flow2)" /></svg>
        </div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-50 border border-violet-100 text-violet-600 text-xs font-semibold mb-4">
              <Zap className="w-3.5 h-3.5" /> 服务流程
            </div>
            <h2 className="text-3xl font-black text-gray-900 mb-4">六步交付，标准落地有据可查</h2>
            <p className="text-gray-500">从需求调研到发布运营，每个里程碑均有可交付成果</p>
          </div>
          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-5">
            {[
              { step: '01', icon: Search, color: '#3b82f6', title: '需求调研', deliverable: '调研报告', desc: '深入理解企业AI应用场景、现有制度与合规目标' },
              { step: '02', icon: BarChart3, color: '#8b5cf6', title: '差距分析', deliverable: '差距报告', desc: '对标主流框架，量化现状与目标间的差距' },
              { step: '03', icon: FileText, color: '#06b6d4', title: '标准起草', deliverable: '标准草案', desc: '专家团队执笔，形成完整规范文本初稿' },
              { step: '04', icon: Users, color: '#f59e0b', title: '评审确认', deliverable: '正式版本', desc: '多方专家评审，修订完善并确认最终版本' },
              { step: '05', icon: Target, color: '#ef4444', title: '试点验证', deliverable: '验证报告', desc: '在典型业务场景中试点执行，收集问题反馈' },
              { step: '06', icon: RefreshCw, color: '#10b981', title: '发布运营', deliverable: '运营手册', desc: '正式发布，培训赋能，建立持续更新机制' },
            ].map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div key={i} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                  className="bg-white rounded-2xl p-5 text-center flex flex-col items-center" style={{ border: `1.5px solid ${s.color}22`, boxShadow: `0 4px 20px ${s.color}0a` }}>
                  <div className="relative mb-4">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: `${s.color}12`, border: `1.5px solid ${s.color}30` }}>
                      <Icon className="w-6 h-6" style={{ color: s.color }} />
                    </div>
                    <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center text-white font-black text-[9px]" style={{ background: s.color }}>
                      {s.step}
                    </div>
                  </div>
                  <div className="font-black text-gray-900 mb-2 text-sm">{s.title}</div>
                  <p className="text-gray-500 text-xs leading-relaxed mb-3 flex-1">{s.desc}</p>
                  <div className="px-2.5 py-1 rounded-lg text-xs font-bold" style={{ background: `${s.color}10`, color: s.color, border: `1px solid ${s.color}22` }}>
                    📄 {s.deliverable}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 6. Why Us ─────────────────────────────────────────── */}
      <section className="py-24 bg-white border-y border-gray-200">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-black text-gray-900 mb-4">学术背景 + 实战经验，双重保障标准质量</h2>
            <div className="w-16 h-1 bg-gradient-to-r from-violet-500 to-blue-500 mx-auto rounded-full" />
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: GraduationCap, color: '#8b5cf6', title: '浙大学术背书', stat1: { v: '50+', l: '专职研究员' }, stat2: { v: '200+', l: '学术论文' }, desc: '依托浙江大学滨江研究院，团队在AI安全、数据治理及标准制定领域具有深厚的学术积累与研究实力。' },
              { icon: Briefcase, color: '#3b82f6', title: '丰富实践经验', stat1: { v: '80+', l: '标准项目经验' }, stat2: { v: '30+', l: '行业覆盖' }, desc: '已为金融、医疗、政务等行业头部企业完成超过 80 个 AI 标准建设项目，积累了丰富的可复用方法论与行业实践。' },
              { icon: Star, color: '#10b981', title: '参与国家标准', stat1: { v: '10+', l: '国家/行业标准' }, stat2: { v: '3', l: '国际标准委员' }, desc: '核心专家深度参与多项 GB/T 国家标准起草，并担任 ISO/IEC 技术委员会委员，具备直接连接监管层的独特资源。' },
            ].map((card, i) => {
              const Icon = card.icon;
              return (
                <motion.div key={i} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className="p-8 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all">
                  <Icon className="w-10 h-10 mb-5" style={{ color: card.color }} />
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{card.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-6">{card.desc}</p>
                  <div className="flex items-center gap-4">
                    <div className="flex-1 bg-gray-50 rounded-xl p-4 border border-gray-100">
                      <div className="text-2xl font-black mb-1" style={{ color: card.color }}>{card.stat1.v}</div>
                      <div className="text-xs text-gray-500">{card.stat1.l}</div>
                    </div>
                    <div className="flex-1 bg-gray-50 rounded-xl p-4 border border-gray-100">
                      <div className="text-2xl font-black mb-1" style={{ color: card.color }}>{card.stat2.v}</div>
                      <div className="text-xs text-gray-500">{card.stat2.l}</div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 7. Deliverables ───────────────────────────────────── */}
      <ScrollReveal>
        <section className="py-24" style={{ background: 'linear-gradient(135deg, #f5f3ff, #eff6ff)' }}>
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-black text-gray-900 mb-4">交付物清单，有形成果可落地</h2>
              <p className="text-gray-500">每个服务周期结束均提供完整的书面交付物，可直接用于监管审查与内部执行</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
              {[
                { icon: '📋', color: '#8b5cf6', title: 'AI 评测规范文本', desc: '符合监管要求的完整评测标准文本，可作为企业内部制度文件' },
                { icon: '🗂️', color: '#3b82f6', title: '数据治理制度', desc: '数据采集、标注、存储与销毁的完整管理规范，对齐 GDPR 与国内个保法' },
                { icon: '🔍', color: '#06b6d4', title: '合规差距分析报告', desc: '量化现状与目标标准的差距，明确优先整改项与整改路径' },
                { icon: '🏅', color: '#10b981', title: '标准符合性声明', desc: '由专家团队出具的标准符合性声明书，可用于客户审计与政府监管申报' },
              ].map((item, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                  className="bg-white rounded-2xl p-6 flex flex-col gap-4" style={{ border: `1.5px solid ${item.color}20`, boxShadow: `0 4px 20px ${item.color}0a` }}>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ background: `${item.color}10`, border: `1.5px solid ${item.color}25` }}>{item.icon}</div>
                  <div className="font-black text-gray-900 text-sm">{item.title}</div>
                  <div className="text-gray-500 text-xs leading-relaxed">{item.desc}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* ── 8. FAQ ────────────────────────────────────────────── */}
      <section id="tss-faq" className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-gray-900 mb-3">常见问题</h2>
            <p className="text-gray-500">快速了解可信安全标准制定服务</p>
          </div>
          <div className="space-y-4">
            {[
              { q: '我们公司规模不大，也需要标准制定服务吗？', a: '是的。无论企业规模，使用 AI 就涉及合规责任。对于中小企业，我们提供轻量版服务，以行业通用模板为基础快速落地，成本更低、周期更短，同样能满足基本监管要求。' },
              { q: '制定标准需要多长时间？', a: '轻量版（采用现有框架适配）通常 4–8 周；全定制版（从零构建）通常 3–6 个月。具体取决于企业 AI 应用的复杂程度和涉及的监管场景数量。' },
              { q: '标准制定完成后，我们如何确保员工真正执行？', a: '我们在交付阶段提供分层培训：高管层战略宣讲、技术层操作培训、业务层合规意识培育。同时提供在线学习材料和季度合规复核服务，确保标准真正落地而非"束之高阁"。' },
              { q: '你们能帮助我们参与国家或行业标准制定吗？', a: '可以。我们与全国信息安全标准化技术委员会（TC260）、中国通信标准化协会（CCSA）等机构保持密切合作关系，可协助有意愿的企业以成员单位身份参与工作组，贡献行业经验，提升标准话语权。' },
              { q: '如果监管政策发生变化，标准需要更新吗？如何收费？', a: '签约后首年内的政策变化引起的标准更新免费；第二年起提供年度维护订阅服务，按协议收取维护费用。我们会主动跟踪监管动态并提前通知客户，确保您始终处于合规状态。' },
            ].map((item, i) => <FaqItem key={i} q={item.q} a={item.a} index={i} />)}
          </div>
        </div>
      </section>

      {/* ── 9. CTA ────────────────────────────────────────────── */}
      <section id="tss-cta" className="py-24" style={{ background: 'linear-gradient(135deg,#f5f3ff,#ede9fe,#ddd6fe)', borderTop: '1px solid #c4b5fd' }}>
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center" style={{ background: 'rgba(139,92,246,0.1)', border: '1.5px solid rgba(139,92,246,0.3)' }}>
              <Award className="w-8 h-8" style={{ color: '#7c3aed' }} />
            </div>
            <h2 className="text-3xl font-black mb-4" style={{ color: '#3b0764' }}>开启 AI 标准建设之旅</h2>
            <p className="text-lg mb-10 max-w-2xl mx-auto leading-relaxed" style={{ color: '#4c1d95' }}>
              在 AI 全面落地的时代，标准不是成本，而是竞争壁垒。让我们帮您比同行早一步建立可信 AI 治理体系。
            </p>
            <div className="flex flex-wrap gap-4 justify-center mb-10">
              <Button size="lg" className="font-bold px-8 border-0" style={{ background: 'linear-gradient(135deg,#7c3aed,#6d28d9)', color: '#fff', boxShadow: '0 4px 20px rgba(124,58,237,0.35)' }}>
                <FileText className="w-4 h-4 mr-2" />
                免费领取 AI 标准建设白皮书
              </Button>
              <Button size="lg" onClick={() => setConsultOpen(true)} className="font-bold px-8" style={{ background: '#fff', border: '1.5px solid #a78bfa', color: '#5b21b6' }}>
                预约专家免费咨询 <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
            <div className="flex items-center justify-center gap-8 text-sm" style={{ color: '#4c1d95' }}>
              {['专家 15 分钟响应', '免费初步合规诊断', '标准不通过不结项'].map(item => (
                <div key={item} className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: '#7c3aed' }} />
                  {item}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
      <ExpertConsultModal
        open={consultOpen}
        onClose={() => setConsultOpen(false)}
        serviceName="可信安全标准制定服务"
        accent="#7c3aed"
        topics={['企业 AI 治理标准建设', '数据与模型评测规范', '行业标准或团体标准制定', '现有标准体系差距分析']}
      />
    </div>
  );
}
