import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router';
import { openHashRoute } from '@/utils/hashRoute';
import {
  ShieldCheck, CheckCircle2, AlertTriangle, Clock, XCircle,
  ArrowRight, FileText, Lock, Briefcase, Send, QrCode, Phone,
  Search, MapPin, ChevronRight, Globe, Server, HelpCircle,
  ChevronDown, Users, Zap, BarChart3, Award, Building2,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { ProductHeroBackground } from '../components/ProductHeroBackground';
import { StickySubNav } from '../components/StickySubNav';
import { GuestGuard } from '../components/GuestGuard';
import { ExpertConsultModal } from '../components/ExpertConsultModal';
import { useUser } from '../context/UserContext';

// ── 1. Hero Glassmorphism Card ─────────────────────────────────────
const TechCard = () => {
  return (
    <div
      className="relative w-full max-w-sm mx-auto"
      style={{ transform: 'perspective(1200px) rotateY(-8deg) rotateX(3deg)', transformOrigin: 'center center' }}
    >
      {/* Outer glow ring */}
      <div className="absolute inset-0 rounded-2xl pointer-events-none" style={{ boxShadow: '0 0 60px rgba(16,185,129,0.18), 0 0 120px rgba(59,130,246,0.12)' }} />

      {/* Gradient border wrapper */}
      <div className="p-px rounded-2xl" style={{ background: 'linear-gradient(135deg, rgba(147,197,253,0.6), rgba(110,231,183,0.5), rgba(255,255,255,0.3))' }}>
        {/* Glassmorphism card body */}
        <div
          className="rounded-2xl p-6 overflow-hidden relative"
          style={{
            background: 'rgba(255,255,255,0.87)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: '1px solid rgba(255,255,255,0.65)',
            boxShadow: '0 20px 60px rgba(15,23,42,0.18), 0 4px 16px rgba(15,23,42,0.08), inset 0 1px 0 rgba(255,255,255,0.9)',
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6 pb-4" style={{ borderBottom: '1px solid rgba(226,232,240,0.6)' }}>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
              <span className="text-gray-900 text-sm font-semibold tracking-wide">合规评估状态</span>
            </div>
            <motion.div
              animate={{ opacity: [1, 0.7, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="px-3 py-1 rounded-full text-emerald-600 text-xs font-bold flex items-center gap-1.5"
              style={{ background: 'rgba(236,253,245,0.9)', border: '1px solid rgba(167,243,208,0.8)' }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
              通过 (PASS)
            </motion.div>
          </div>

          <div className="mb-6 relative">
            <div className="absolute right-0 top-0" style={{ opacity: 0.04 }}>
              <Award className="w-24 h-24 text-emerald-600" />
            </div>
            <h3 className="text-gray-900 font-bold text-lg mb-6">大模型备案电子凭证</h3>

            <div className="space-y-4 relative z-10">
              {['材料提交', '内部审查', '官方评测', '公示完成'].map((step, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${i === 3 ? 'bg-emerald-500 text-white' : 'bg-emerald-100 text-emerald-600'}`}
                    style={i === 3 ? { boxShadow: '0 0 14px rgba(16,185,129,0.4)' } : {}}>
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div className={`flex-1 h-1.5 rounded-full overflow-hidden ${i === 3 ? 'bg-emerald-100' : 'bg-gray-100'}`}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 1, delay: i * 0.5 }}
                      className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500"
                    />
                  </div>
                  <span className={`text-xs font-bold w-16 text-right ${i === 3 ? 'text-emerald-600' : 'text-gray-500'}`}>{step}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center mt-8 pb-2">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 2.2 }}
              className="w-16 h-16 rounded-full flex items-center justify-center relative"
              style={{ background: 'rgba(236,253,245,0.9)', border: '4px solid rgba(255,255,255,0.9)', boxShadow: '0 8px 24px rgba(16,185,129,0.2)' }}
            >
              <CheckCircle2 className="w-10 h-10 text-emerald-500" />
              <motion.div
                animate={{ opacity: [0, 0.4, 0], scale: [1, 1.5, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 bg-emerald-400 rounded-full blur-md -z-10"
              />
            </motion.div>
          </div>

          {/* Decorative blurs inside card */}
          <div className="absolute top-0 right-0 w-32 h-32 pointer-events-none" style={{ background: 'rgba(16,185,129,0.07)', filter: 'blur(40px)' }} />
          <div className="absolute bottom-0 left-0 w-32 h-32 pointer-events-none" style={{ background: 'rgba(59,130,246,0.07)', filter: 'blur(40px)' }} />
        </div>
      </div>

      {/* Bottom shadow for floating 2.5D effect */}
      <div className="absolute -bottom-6 left-4 right-4 h-8 rounded-2xl pointer-events-none" style={{ background: 'rgba(15,23,42,0.12)', filter: 'blur(16px)', transform: 'perspective(1200px) rotateY(-8deg)' }} />
    </div>
  );
};

// ── FAQ Item ──────────────────────────────────────────────────────
const FaqItem = ({ q, a, index }: { q: string; a: string; index: number }) => {
  const [open, setOpen] = useState(index === 0);
  return (
    <motion.div layout className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      <button className="w-full flex items-center gap-4 p-5 text-left hover:bg-gray-50 transition-colors" onClick={() => setOpen(v => !v)}>
        <div className="shrink-0 w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
          <HelpCircle className="w-4 h-4 text-blue-600" />
        </div>
        <span className="flex-1 text-gray-900 font-bold text-sm sm:text-base">{q}</span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="w-5 h-5 text-gray-400 shrink-0" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div key="content" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}>
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

// ── Lead Counter ──────────────────────────────────────────────────
const LeadCounter = () => {
  const [count] = useState(2847);
  return (
    <motion.div
      animate={{ scale: [1, 1.02, 1] }}
      transition={{ duration: 3, repeat: Infinity }}
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-gray-600 text-xs font-medium"
    >
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
      已有 <span className="text-emerald-600 font-bold">{count.toLocaleString()}</span> 家企业领取
    </motion.div>
  );
};

// ── 2. Pain Point Card ────────────────────────────────────────────
interface PainCardProps {
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  accentColor: string;
  shadowColor: string;
  title: string;
  bigNumber: string;
  bigNumberLabel: string;
  desc: string;
  tags: { label: string; cls: string }[];
  delay?: number;
}

function PainCard({ icon: Icon, iconBg, iconColor, accentColor, shadowColor, title, bigNumber, bigNumberLabel, desc, tags, delay = 0 }: PainCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      className="bg-white rounded-2xl p-7 flex flex-col gap-4 transition-all duration-300"
      style={{
        border: `1.5px solid ${accentColor}22`,
        boxShadow: `0 6px 32px ${shadowColor}, 0 1px 4px rgba(0,0,0,0.06)`,
      }}
    >
      {/* Icon + title */}
      <div className="flex items-center gap-3">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${iconBg}`}
          style={{ boxShadow: `0 4px 14px ${shadowColor}` }}>
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
        <h3 className="text-xl font-black text-gray-900">{title}</h3>
      </div>

      {/* Big number highlight */}
      <div className="flex items-end gap-2 px-4 py-3 rounded-xl" style={{ background: `${accentColor}0d`, border: `1px solid ${accentColor}20` }}>
        <span className="font-black leading-none" style={{ fontSize: '2.6rem', color: accentColor }}>{bigNumber}</span>
        <span className="text-sm text-gray-500 mb-1 leading-tight">{bigNumberLabel}</span>
      </div>

      {/* Description */}
      <p className="text-gray-600 text-sm leading-relaxed">{desc}</p>

      {/* Risk tags */}
      <div className="flex flex-wrap gap-2 mt-auto pt-1">
        {tags.map(t => (
          <span key={t.label} className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${t.cls}`}>
            {t.label}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

// ── 4. Process Flow Step ──────────────────────────────────────────
function HexIcon({ children, gradient }: { children: React.ReactNode; gradient: string }) {
  return (
    <div className="relative flex items-center justify-center" style={{ width: 64, height: 64 }}>
      <svg viewBox="0 0 64 64" className="absolute inset-0 w-full h-full">
        <defs>
          <linearGradient id={`hex-grad-${gradient}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={gradient.split(',')[0]} />
            <stop offset="100%" stopColor={gradient.split(',')[1]} />
          </linearGradient>
        </defs>
        <polygon
          points="32,4 60,18 60,46 32,60 4,46 4,18"
          fill={`url(#hex-grad-${gradient})`}
          opacity="0.15"
        />
        <polygon
          points="32,4 60,18 60,46 32,60 4,46 4,18"
          fill="none"
          stroke={gradient.split(',')[0]}
          strokeWidth="1.5"
          opacity="0.5"
        />
      </svg>
      <div className="relative z-10">{children}</div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────
export function ModelFilingService() {
  const navigate = useNavigate();
  const { isGuest } = useUser();
  const [phone, setPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [showGuestGuard, setShowGuestGuard] = useState(false);
  const [consultOpen, setConsultOpen] = useState(false);

  const handleSubmit = () => {
    openHashRoute('/online-experience?tab=filing');
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 font-sans">

      {/* 1. Hero ──────────────────────────────────────────────── */}
      <section className="product-detail-hero order-[0] relative overflow-hidden pt-24 pb-20 sm:pt-32 sm:pb-28 min-h-[600px] flex items-center bg-[#060e1d]">
        <ProductHeroBackground side="service" concept="filing" />
        <div className="max-w-[83%] mx-auto px-6 relative z-10 w-full">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-600 border border-blue-300 text-white text-xs font-medium mb-6">
                <ShieldCheck className="w-4 h-4" />
                生成式人工智能服务合规支持
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight mb-6">
                算法备案与大模型<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">登记备案服务方案</span>
              </h1>
              <p className="text-blue-100/80 text-lg mb-8 leading-relaxed max-w-xl">
                围绕算法备案、大模型登记和大模型备案等路径，提供适用性判断、安全评估、材料编制与审核沟通支持。
              </p>
              <div className="flex flex-col sm:flex-row gap-3 mb-8">
                <div className="flex items-center gap-2 text-sm text-emerald-400">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>依据业务形态、模型来源和服务对象判断申报路径</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-emerald-400">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>材料内容与实际技术、制度和测试结果保持一致</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-4">
                {false && <Button size="lg" className="bg-emerald-500 hover:bg-emerald-600 text-white border-0 shadow-[0_0_20px_rgba(16,185,129,0.4)]">
                  <FileText className="w-4 h-4 mr-2" />
                  获取备案材料准备清单
                </Button>}
                {false && <Button size="lg" variant="outline" onClick={() => setConsultOpen(true)} className="text-blue-300 border-blue-400/30 hover:bg-blue-400/10 bg-transparent">
                  预约专家免费咨询
                </Button>}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="lg:pl-10">
              <TechCard />
            </motion.div>
          </div>
        </div>
      </section>
      <ExpertConsultModal
        open={consultOpen}
        onClose={() => setConsultOpen(false)}
        serviceName="大模型备案服务"
        accent="#059669"
        topics={['备案适用范围判断', '安全评估材料准备', '算法备案申报流程', '现有材料专家预审']}
      />
      <GuestGuard open={showGuestGuard} onClose={() => setShowGuestGuard(false)} action="使用备案自测" />

      <StickySubNav items={[
        { id: 'mfs-painpoints', label: '备案痛点' },
        { id: 'mfs-scope', label: '服务内容' },
        { id: 'mfs-process', label: '服务流程' },
        { id: 'mfs-advantages', label: '核心优势' },
        { id: 'mfs-comparison', label: '政策依据' },
        { id: 'mfs-faq', label: 'FAQ' },
      ]} />

      {/* 2. Pain Points — 2×2 grid ───────────────────────────── */}
      <section id="mfs-painpoints" className="order-[2] py-24 relative overflow-hidden" style={{ background: '#F4F6FA' }}>
        {/* Subtle grid */}
        <div className="absolute inset-0 pointer-events-none opacity-40">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="pgrid-light" width="48" height="48" patternUnits="userSpaceOnUse">
                <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#dde3ee" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#pgrid-light)" />
          </svg>
        </div>

        <div className="max-w-[83%] mx-auto px-6 relative z-10">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-black text-gray-900 mb-4">别让合规风险成为业务落地的"拦路虎"</h2>
            <p className="text-gray-500 text-lg">AI 狂飙时代，合规先行才能行稳致远</p>
          </div>

          {/* 2×2 Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
            <PainCard
              icon={AlertTriangle}
              iconBg="bg-red-50"
              iconColor="text-red-500"
              accentColor="#ef4444"
              shadowColor="rgba(239,68,68,0.12)"
              title="路径判断复杂"
              bigNumber="3类"
              bigNumberLabel="常见申报路径需要区分"
              desc="算法备案、大模型登记和大模型备案适用条件、审核方式与所需材料不同，需要结合实际服务形态判断。"
              tags={[
                { label: '算法备案', cls: 'bg-red-50 text-red-600 border-red-200' },
                { label: '模型登记', cls: 'bg-orange-50 text-orange-600 border-orange-200' },
                { label: '模型备案', cls: 'bg-rose-50 text-rose-600 border-rose-200' },
              ]}
              delay={0}
            />
            <PainCard
              icon={XCircle}
              iconBg="bg-blue-50"
              iconColor="text-blue-500"
              accentColor="#3b82f6"
              shadowColor="rgba(59,130,246,0.12)"
              title="材料体系复杂"
              bigNumber="多类"
              bigNumberLabel="主体、算法、制度与评估材料"
              desc="材料需要相互印证，主体信息、算法说明、安全评估报告、服务协议、关键字库与测试资料不能彼此矛盾。"
              tags={[
                { label: '主体材料', cls: 'bg-blue-50 text-blue-600 border-blue-200' },
                { label: '算法材料', cls: 'bg-indigo-50 text-indigo-600 border-indigo-200' },
                { label: '评估材料', cls: 'bg-sky-50 text-sky-600 border-sky-200' },
              ]}
              delay={0.08}
            />
            <PainCard
              icon={Clock}
              iconBg="bg-orange-50"
              iconColor="text-orange-500"
              accentColor="#f97316"
              shadowColor="rgba(249,115,22,0.12)"
              title="审核往返协同"
              bigNumber="多轮"
              bigNumberLabel="材料审核与反馈修订"
              desc="申报通常涉及企业、技术、法务和属地审核部门多方协作，需要按反馈持续补充或修订材料。"
              tags={[
                { label: '审核反馈', cls: 'bg-orange-50 text-orange-600 border-orange-200' },
                { label: '版本修订', cls: 'bg-amber-50 text-amber-600 border-amber-200' },
                { label: '跨团队协同', cls: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
              ]}
              delay={0.16}
            />
            <PainCard
              icon={Lock}
              iconBg="bg-purple-50"
              iconColor="text-purple-500"
              accentColor="#a855f7"
              shadowColor="rgba(168,85,247,0.12)"
              title="技术事实一致性"
              bigNumber="一致"
              bigNumberLabel="材料需与实际系统能力对应"
              desc="模型来源、训练数据、内容安全机制、接口能力和制度文件均应按实际情况描述，避免夸大或使用模板化虚构内容。"
              tags={[
                { label: '模型来源', cls: 'bg-purple-50 text-purple-600 border-purple-200' },
                { label: '安全机制', cls: 'bg-violet-50 text-violet-600 border-violet-200' },
                { label: '材料口径', cls: 'bg-fuchsia-50 text-fuchsia-600 border-fuchsia-200' },
              ]}
              delay={0.24}
            />
          </div>
        </div>
      </section>

      {/* Service scope and concrete deliverables */}
      <section id="mfs-scope" className="order-[3] border-y border-slate-200 bg-white py-24">
        <div className="mx-auto max-w-[83%] px-6">
          <div className="mb-14 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
              <FileText className="h-3.5 w-3.5" /> 服务内容与交付物
            </div>
            <h2 className="mb-4 text-3xl font-black text-slate-900">按申报路径组织材料与评估工作</h2>
            <p className="text-slate-500">结合算法备案、大模型登记或大模型备案的具体要求，形成可核对、可补正的申报材料体系。</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {[
              { icon: Search, color: '#2563eb', title: '申报路径判断', desc: '结合服务形态、模型来源、是否面向公众等信息，判断算法备案、大模型登记或大模型备案路径。', items: ['业务形态梳理', '模型调用方式确认', '申报路径建议'] },
              { icon: ShieldCheck, color: '#0891b2', title: '安全评估支持', desc: '根据选定路径准备测试集、关键字库、测试账号与安全评估材料，并记录评估结果。', items: ['测试资源准备', '内容安全评估', '问题修订建议'] },
              { icon: FileText, color: '#7c3aed', title: '申报材料编制', desc: '依据企业、算法和模型实际情况编写申报文件，避免材料之间出现口径冲突。', items: ['自评估报告', '主体与算法材料', '制度及服务协议'] },
              { icon: Send, color: '#059669', title: '审核沟通配合', desc: '协助企业按主管部门反馈补充、修订和版本化管理材料，最终结果以主管部门审核为准。', items: ['材料提交协助', '审核意见响应', '版本记录留存'] },
            ].map((service) => {
              const Icon = service.icon;
              return (
                <article key={service.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl" style={{ background: `${service.color}12`, color: service.color }}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-black text-slate-900">{service.title}</h3>
                  <p className="mt-3 min-h-[72px] text-sm leading-6 text-slate-600">{service.desc}</p>
                  <ul className="mt-5 space-y-2 border-t border-slate-100 pt-4">
                    {service.items.map((item) => (
                      <li key={item} className="flex items-center gap-2 text-xs font-medium text-slate-600">
                        <CheckCircle2 className="h-3.5 w-3.5 shrink-0" style={{ color: service.color }} />{item}
                      </li>
                    ))}
                  </ul>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. 2026 Regulations — redesigned ───────────────────── */}
      <section id="mfs-comparison" className="order-[6] py-24 border-y border-gray-200" style={{ background: '#F0F4FA' }}>
        <div className="max-w-[83%] mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-12 items-start">

            {/* Left: old vs new comparison */}
            <div className="lg:w-[52%] w-full">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-semibold mb-5">
                <Search className="w-3.5 h-3.5" /> 政策前沿
              </div>
              <h2 className="text-3xl font-black text-gray-900 mb-5">
                备案与登记路径：<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">按业务实际选择申报方式</span>
              </h2>
              <p className="text-gray-600 mb-7 leading-relaxed text-sm">
                生成式人工智能服务的申报要求与服务对象、模型来源和技术实现相关，页面仅作服务能力说明，实际执行以主管部门要求为准。
              </p>

              <div className="flex flex-col gap-3">
                {[
                  { old: '自研或自有算法服务', new: '算法备案路径判断' },
                  { old: '调用第三方模型 API', new: '模型来源证明与登记判断' },
                  { old: '自行训练或微调模型', new: '备案材料与安全评估准备' },
                  { old: '业务或模型发生变化', new: '材料版本与变更事项维护' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex-1 text-sm text-gray-500 bg-gray-50 p-3 rounded-lg border border-gray-100 text-center">
                      <div className="text-[10px] text-gray-400 mb-1">传统模式/旧规</div>
                      {item.old}
                    </div>
                    <ArrowRight className="w-4 h-4 text-blue-400 shrink-0" />
                    <div className="flex-1 text-sm text-blue-700 bg-blue-50 p-3 rounded-lg border border-blue-200 text-center relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-16 h-16 bg-blue-400/10 blur-xl rounded-full" />
                      <div className="text-[10px] text-blue-500 mb-1">申报工作重点</div>
                      <span className="font-bold relative z-10">{item.new}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: summary + how we help */}
            <div className="lg:w-[48%] w-full flex flex-col gap-5">

              {/* Top: new-rule characteristics */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
                    <BarChart3 className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="font-black text-gray-900">申报材料关注重点</h3>
                </div>
                <div className="flex flex-col gap-3">
                  {[
                    { label: '主体与路径', color: '#3b82f6', desc: '明确服务主体、产品形态、模型来源和对应申报路径。' },
                    { label: '安全评估', color: '#ef4444', desc: '准备测试集、关键字库、测试账号或接口以及评估记录。' },
                    { label: '材料一致', color: '#10b981', desc: '确保模型、数据、制度、协议和技术能力描述相互一致。' },
                  ].map((item) => (
                    <div key={item.label} className="flex items-start gap-3 p-3 rounded-xl" style={{ background: `${item.color}08`, border: `1px solid ${item.color}20` }}>
                      <div className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ background: item.color }} />
                      <div>
                        <span className="font-bold text-sm" style={{ color: item.color }}>{item.label}　</span>
                        <span className="text-gray-600 text-sm">{item.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom: how we solve it */}
              <div className="bg-white rounded-2xl p-6 border border-emerald-200 shadow-sm" style={{ boxShadow: '0 4px 20px rgba(16,185,129,0.08)' }}>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="font-black text-gray-900">我们如何帮您突破难点</h3>
                </div>
                <div className="flex flex-col gap-2.5">
                  {[
                    { icon: '📚', text: '根据申报路径整理主体、算法、模型及制度材料清单' },
                    { icon: '🛡️', text: '结合实际测试结果协助形成安全评估相关材料' },
                    { icon: '🔗', text: '核对模型来源、数据来源、调用关系与授权证明' },
                    { icon: '👨‍💼', text: '协助响应审核反馈并维护材料版本，结果以主管部门审核为准' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 py-2 px-3 rounded-lg bg-emerald-50/60">
                      <span className="text-base">{item.icon}</span>
                      <span className="text-sm text-gray-700 leading-relaxed">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA mini card */}
              <div
                className="rounded-2xl p-5 flex items-center justify-between gap-4"
                style={{ background: 'linear-gradient(135deg,#1e40af,#1d4ed8)', boxShadow: '0 8px 28px rgba(30,64,175,0.25)' }}
              >
                <div>
                <div className="text-white font-bold text-sm mb-1">咨询申报路径与材料准备</div>
                  <div className="text-blue-200 text-xs">结合业务实际梳理申报事项</div>
                </div>
                <Button size="sm" className="bg-white text-blue-700 hover:bg-blue-50 font-bold shrink-0 border-0">
                  免费咨询 <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* 4. Core Services — horizontal process flow ──────────── */}
      <section id="mfs-process" className="order-[4] py-24 bg-slate-50 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none opacity-30">
          <svg className="w-full h-full"><defs><pattern id="dots-flow" width="24" height="24" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="1" fill="#bfdbfe" /></pattern></defs><rect width="100%" height="100%" fill="url(#dots-flow)" /></svg>
        </div>
        <div className="absolute top-0 left-1/4 w-64 h-64 rounded-full pointer-events-none" style={{ background: 'rgba(59,130,246,0.06)', filter: 'blur(80px)' }} />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full pointer-events-none" style={{ background: 'rgba(16,185,129,0.06)', filter: 'blur(80px)' }} />

        <div className="max-w-[83%] mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-semibold mb-4">
              <ShieldCheck className="w-3.5 h-3.5" /> 服务流程
            </div>
            <h2 className="text-3xl font-black text-gray-900 mb-4">从路径确认到审核反馈的协同流程</h2>
            <p className="text-gray-500">具体环节、周期和结果以申报路径、材料完整度及主管部门审核为准</p>
          </div>

          {/* Horizontal 4-step flow */}
          <div className="relative">
            <div
              className="absolute hidden lg:block"
              aria-hidden="true"
              style={{
                top: 31,
                left: '12.5%',
                right: '12.5%',
                height: 2,
                background: 'linear-gradient(90deg,rgba(59,130,246,.35),rgba(14,165,233,.35),rgba(16,185,129,.35),rgba(139,92,246,.35))',
                borderRadius: 999,
                zIndex: 0,
              }}
            />
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {[
                {
                  step: '01',
                  title: '路径与差距确认',
                  icon: Search,
                  hexGrad: '#3b82f6,#6366f1',
                  accentColor: '#3b82f6',
                  items: ['梳理业务与模型来源', '确认申报路径及缺口'],
                  desc: '判断算法备案、大模型登记或大模型备案，并形成材料准备清单。',
                },
                {
                  step: '02',
                  title: '材料与评估准备',
                  icon: ShieldCheck,
                  hexGrad: '#0ea5e9,#3b82f6',
                  accentColor: '#0ea5e9',
                  items: ['准备测试集与关键字库', '形成安全评估材料'],
                  desc: '按对应路径准备测试资源、制度文件、服务协议及安全评估报告。',
                  highlight: true,
                },
                {
                  step: '03',
                  title: '属地审核配合',
                  icon: FileText,
                  hexGrad: '#10b981,#06b6d4',
                  accentColor: '#10b981',
                  items: ['提交材料与版本留存', '按反馈补充修订'],
                  desc: '配合属地网信部门多轮材料审核；登记与备案路径可能包含安全评估接口测试。',
                },
                {
                  step: '04',
                  title: '结果与持续维护',
                  icon: Send,
                  hexGrad: '#8b5cf6,#06b6d4',
                  accentColor: '#8b5cf6',
                  items: ['跟进审核结果', '留存材料与变更记录'],
                  desc: '协助跟踪审核进展与后续变更；最终审核与公开结果由主管部门决定。',
                },
              ].map((s, i) => {
                const Icon = s.icon;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 28 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.12 }}
                    className="relative flex flex-col"
                    style={{ zIndex: 10 }}
                  >
                    {/* Step number badge + hex icon row */}
                    <div className="relative z-10 flex items-center justify-center gap-4 mb-5">
                      <div className="relative shrink-0">
                        <HexIcon gradient={s.hexGrad}>
                          <Icon className="w-6 h-6" style={{ color: s.accentColor }} />
                        </HexIcon>
                        {/* Step number badge */}
                        <div
                          className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center text-white font-black"
                          style={{ fontSize: 9, background: s.accentColor, boxShadow: `0 2px 8px ${s.accentColor}60` }}
                        >
                          {s.step}
                        </div>
                      </div>

                    </div>

                    {/* Card */}
                    <div
                      className="flex-1 bg-white rounded-2xl p-5 transition-all duration-300"
                      style={{
                        border: s.highlight ? `2px solid ${s.accentColor}50` : '1.5px solid #e2e8f0',
                        boxShadow: s.highlight
                          ? `0 8px 32px ${s.accentColor}18, 0 2px 8px rgba(0,0,0,0.06)`
                          : '0 2px 12px rgba(0,0,0,0.05)',
                      }}
                    >
                      {s.highlight && (
                        <div
                          className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold mb-3"
                          style={{ background: `${s.accentColor}15`, color: s.accentColor, border: `1px solid ${s.accentColor}30` }}
                        >
                          ★ 核心优势
                        </div>
                      )}

                      <h3 className="font-black text-gray-900 text-lg mb-2">{s.title}</h3>
                      <p className="text-gray-500 text-xs leading-relaxed mb-4">{s.desc}</p>

                      {/* Sub-items */}
                      <ul className="space-y-2">
                        {s.items.map((item) => (
                          <li key={item} className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: s.accentColor }} />
                            <span className="text-sm text-gray-700">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 5. Why Us ───────────────────────────────────────────── */}
      <section id="mfs-advantages" className="order-[5] py-24 bg-white relative overflow-hidden border-y border-gray-200">
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <svg className="w-full h-full"><defs><pattern id="dots-light" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="1" fill="#cbd5e1" /></pattern></defs><rect width="100%" height="100%" fill="url(#dots-light)" /></svg>
        </div>

        <div className="max-w-[83%] mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-gray-900 mb-4">技术、材料与项目协同支持</h2>
            <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-emerald-500 mx-auto rounded-full" />
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="p-8 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all">
              <Server className="w-10 h-10 text-blue-500 mb-5" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">基于实际系统形成材料</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-6">结合真实模型、接口、测试数据和内容安全机制编制材料，避免模板化描述与实际能力不一致。</p>
              <div className="flex items-center gap-4">
                <div className="flex-1 bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <div className="text-xl font-black text-emerald-500 mb-1">一致性</div>
                  <div className="text-xs text-gray-500">技术与材料核对</div>
                </div>
                <div className="flex-1 bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <div className="text-xl font-black text-blue-500 mb-1">可追溯</div>
                  <div className="text-xs text-gray-500">版本与证据留存</div>
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="p-8 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all">
              <Briefcase className="w-10 h-10 text-blue-500 mb-5" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">跨专业协作</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-6">由产品、算法、安全与材料人员协同核对技术事实、评估结果和申报表述，减少信息遗漏与口径偏差。</p>
              <div className="flex gap-3">
                <div className="flex-1 flex flex-col items-center gap-2 bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center shadow-sm">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xs text-center text-gray-600">材料编制</span>
                </div>
                <div className="flex items-center">
                  <span className="text-blue-400 font-bold">+</span>
                </div>
                <div className="flex-1 flex flex-col items-center gap-2 bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center shadow-sm">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xs text-center text-gray-600">技术评估</span>
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="p-8 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all">
              <MapPin className="w-10 h-10 text-blue-500 mb-5" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">过程化项目管理</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-6">围绕材料清单、审查反馈和文档版本持续管理项目过程，使补充修改的依据和责任边界清晰可查。</p>
              <div className="grid grid-cols-3 gap-2">
                {['路径确认', '材料清单', '版本管理', '反馈跟踪', '证据留存', '结果归档'].map(item => (
                  <div key={item} className="text-center py-2 rounded-lg bg-gray-50 border border-gray-100 text-xs text-gray-600">{item}</div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 6. Lead Magnet ──────────────────────────────────────── */}
      <section className="hidden order-[7] py-20 bg-blue-50 relative overflow-hidden" aria-hidden="true">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-400/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-400/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-3xl mx-auto px-6 relative z-10 text-center">
          <div className="mb-4"><LeadCounter /></div>
          <h2 className="text-3xl font-black text-gray-900 mb-4">不确定您的产品是否需要备案？</h2>
          <p className="text-gray-600 text-lg mb-3">只需 3 分钟，通过 5 个关键问题，判断您的业务是否触及监管红线。</p>

          <div className="mb-8 p-6 rounded-2xl bg-white border border-gray-200 shadow-sm text-left">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-sm text-gray-600 font-mono">合规自测工具 · 快速诊断</span>
            </div>
            <div className="space-y-3">
              {['您的模型是否对外提供 API 接口？', '服务是否面向中国大陆用户？', '是否生成文字、图片或语音内容？'].map((q, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
                  <div className="w-5 h-5 rounded-full border border-emerald-200 bg-emerald-50 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                  </div>
                  <span className="text-sm text-gray-700">{q}</span>
                </div>
              ))}
              <div className="text-center py-2 text-xs text-emerald-600">▼ 还有 2 个问题 · 输入手机号获取完整诊断报告</div>
            </div>
          </div>

          {submitted ? (
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center gap-3 py-8">
              <div className="w-16 h-16 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-emerald-500" />
              </div>
              <p className="text-gray-900 font-bold text-xl">提交成功！</p>
              <p className="text-gray-600 text-sm">顾问将在1小时内与您联系，并发送专属诊断报告。</p>
            </motion.div>
          ) : (
            <>
              <div className="bg-white p-2 rounded-full flex flex-col sm:flex-row shadow-lg max-w-lg mx-auto border border-gray-200">
                <input
                  type="text"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="请输入您的手机号"
                  className="flex-1 bg-transparent border-0 focus:ring-0 px-6 py-3 text-gray-900 placeholder-gray-400 outline-none text-sm"
                />
                <Button onClick={handleSubmit} className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-full px-8 py-3 h-auto sm:ml-2 mt-2 sm:mt-0 shadow-[0_4px_15px_rgba(16,185,129,0.3)] border-0">
                  立即开始自测 →
                </Button>
              </div>
              <p className="text-gray-400 text-xs mt-4">承诺严格保密您的联系方式与业务信息</p>
            </>
          )}
        </div>
      </section>

      {/* 7. Case Studies ─────────────────────────────────────── */}
      <section className="hidden order-[8] py-24 bg-slate-50">
        <div className="max-w-[83%] mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-gray-900 mb-4">他们已成功拿证，开启商业化</h2>
            <p className="text-gray-600 text-lg">跨行业大模型合规备案的成功实践</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                logo: Building2, logoColor: 'text-orange-500', logoBg: 'bg-orange-50',
                tag: '电商大厂', tagColor: 'text-orange-700 bg-orange-100 border-orange-200',
                metric: '22', metricUnit: '天', metricLabel: '完成备案全流程',
                result: '一次性通过',
                title: '某电商头部企业智能客服',
                desc: '强化多轮对话引导策略与风险阻断机制，材料一次性通过属地网信办审核。',
              },
              {
                logo: Award, logoColor: 'text-blue-500', logoBg: 'bg-blue-50',
                tag: '政务服务', tagColor: 'text-blue-700 bg-blue-100 border-blue-200',
                metric: '0', metricUnit: '次', metricLabel: '补正驳回次数',
                result: '极速公示',
                title: '某省政务公文辅助写作模型',
                desc: '本地化断网评测与数据不出域合规论证，满足政务数据隐私最高等级要求。',
              },
              {
                logo: Zap, logoColor: 'text-purple-500', logoBg: 'bg-purple-50',
                tag: 'AIGC创业', tagColor: 'text-purple-700 bg-purple-100 border-purple-200',
                metric: '18', metricUnit: '天', metricLabel: '完成备案全流程',
                result: '零驳回',
                title: '某文生图初创平台',
                desc: '评测中发现"名人恶搞生成"漏洞，修复后申报全程零驳回，创行业最快记录。',
              }
            ].map((c, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative p-7 rounded-2xl border border-gray-200 bg-white hover:border-blue-300 hover:shadow-lg transition-all overflow-hidden group"
              >
                <div className="absolute top-0 right-0 w-32 h-32 opacity-[0.03] pointer-events-none">
                  <Award className="w-full h-full text-blue-500" />
                </div>
                <div className="flex items-start justify-between mb-5">
                  <div className={`w-12 h-12 rounded-xl ${c.logoBg} border border-white/50 flex items-center justify-center`}>
                    <c.logo className={`w-6 h-6 ${c.logoColor}`} />
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${c.tagColor}`}>{c.tag}</span>
                </div>
                <div className="flex items-end gap-2 mb-1">
                  <span className="text-5xl font-black text-emerald-500 leading-none">{c.metric}</span>
                  <span className="text-2xl font-black text-emerald-400 leading-none mb-1">{c.metricUnit}</span>
                  <span className="ml-auto px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-bold">{c.result}</span>
                </div>
                <div className="text-xs text-gray-500 mb-4">{c.metricLabel}</div>
                <h3 className="text-base font-bold text-gray-900 mb-2">{c.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{c.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. FAQ ──────────────────────────────────────────────── */}
      <section id="mfs-faq" className="order-[9] py-24 bg-white border-t border-gray-200">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl font-black text-gray-900 text-center mb-12">常见问题解答</h2>
          <div className="space-y-3">
            {[
              { q: '如何判断应走算法备案、模型登记还是大模型备案？', a: '需要结合服务是否面向境内公众、模型是自研还是调用第三方 API、是否涉及训练或微调、服务形态和属地要求综合判断。我们会先完成业务与模型来源梳理，再给出申报路径建议。' },
              { q: '不同申报路径通常需要准备哪些材料？', a: '算法备案通常涉及主体责任信息、算法安全自评估报告和拟公示内容；大模型登记或备案通常还涉及申请材料、模型来源证明、服务协议、内容安全制度、关键字库、评估测试集及测试账号或接口说明。最终清单以主管部门要求为准。' },
              { q: '整个办理周期是固定的吗？', a: '不是。方案材料中的 3—6 个月、3—4 个月以上或 3—8 个月仅可作为项目规划参考，不是监管部门承诺时限。实际周期取决于申报路径、属地审核、材料完整度、反馈轮次和安全评估测试安排。' },
              { q: '提交后收到补充或修订意见怎么办？', a: '我们会协助定位反馈对应的材料、技术或制度问题，统一修订相关文件并维护版本记录。是否通过以及何时完成，仍以主管部门审核结论为准。' },
              { q: '调用第三方大模型 API 也需要评估吗？', a: '调用第三方模型且不自行训练或微调时，通常需要重点核对模型来源证明、调用关系、服务协议和面向公众的产品责任；具体是否适用大模型登记或其他路径，应结合属地要求和实际业务确认。' },
            ].map((faq, i) => (
              <FaqItem key={i} q={faq.q} a={faq.a} index={i} />
            ))}
          </div>
        </div>
      </section>

      <section id="mfs-cta" className="hidden order-[10] border-t border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-blue-50 py-20" aria-hidden="true">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-3 py-1.5 text-xs font-bold text-emerald-700">
            <Users className="h-3.5 w-3.5" /> 专家一对一服务
          </span>
          <h2 className="mt-5 text-3xl font-black text-slate-900">让备案要求变成可执行的上线计划</h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-600">提交您的业务形态和当前准备情况，玄鉴顾问将协助判断备案路径、材料缺口与预计周期。</p>
          <Button onClick={() => setConsultOpen(true)} size="lg" className="mt-8 border-0 bg-emerald-600 px-9 text-white shadow-lg hover:bg-emerald-700">
            预约专家免费咨询 <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>

    </div>
  );
}
