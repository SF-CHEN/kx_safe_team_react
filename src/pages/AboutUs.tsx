import React from 'react';
import { Badge } from '../components/ui/badge';
import { ScrollReveal } from '../components/ScrollReveal';
import {
  Award, CheckCircle2, Users, Layers, Building2,
  FlaskConical, Heart, Cpu, ShieldCheck, Code2,
  BarChart2, Database, Globe,
  Star, Trophy, Sparkles,
} from 'lucide-react';
import rongShuLogo from '../../imports/____-_.png';
import yjyLogo from '../../imports/yjy.png';

// ── Awards / Milestones ───────────────────────────────────────────
const AWARDS = [
  {
    year: '2025',
    color: '#6366f1',
    items: [
      { org: '榕数科技', title: '"金灵光杯"中国互联网创新大赛 — 生成式人工智能安全方向优秀奖', tag: '竞赛奖项' },
      { org: '榕数科技', title: '数字中国创新大赛·信创赛道华东赛区三等奖', tag: '竞赛奖项' },
      { org: '榕数科技', title: '职业健康安全管理体系认证（ISO 45001:2018）', tag: '资质认证' },
      { org: '联合团队', title: '"慧眼行动"第二届全国智能算法对抗挑战赛三等奖', tag: '竞赛奖项' },
    ],
  },
  {
    year: '2024',
    color: '#3b82f6',
    items: [
      { org: '榕数科技', title: '数字中国创新大赛杭州城市赛二等奖', tag: '竞赛奖项' },
    ],
  },
  {
    year: '长期荣誉',
    color: '#f59e0b',
    items: [
      { org: '榕数科技', title: '国家高新技术企业', tag: '资质认证' },
      { org: '榕数科技', title: '高新区（滨江）5050计划重点支持企业', tag: '政策扶持' },
      { org: '榕数科技', title: '浙江省高新技术企业研究开发中心', tag: '资质认证' },
    ],
  },
];

// ── Rongshu products ──────────────────────────────────────────────
const RONGSHU_PRODUCTS = [
  {
    icon: Database, color: '#8b5cf6',
    title: '面向领域的算法服务操作系统',
    desc: '集数据标注、模型训练和应用监管于一体的一站式平台。',
  },
  {
    icon: Cpu, color: '#3b82f6',
    title: '一站式算法实训系统',
    desc: '以低代码方式支撑模型全流程训练与实践，降低 AI 研发门槛。',
  },
  {
    icon: ShieldCheck, color: '#10b981',
    title: '算法质量评估评测系统',
    desc: '提供算法性能、安全性、可解释性等多维度评估，确保 AI 系统可信。',
  },
];

// ── ZJU centers ───────────────────────────────────────────────────
const ZJU_CENTERS = [
  { icon: Cpu,         title: '国产信创技术研究中心', color: '#3b82f6' },
  { icon: Heart,       title: '生命与大健康研究中心', color: '#ef4444' },
  { icon: Users,       title: '儿童健康创新研究中心', color: '#f59e0b' },
  { icon: FlaskConical,title: '智能医疗技术与装备研究中心', color: '#10b981' },
  { icon: Globe,       title: '医工信协同创新孵化器', color: '#8b5cf6' },
];

// ─────────────────────────────────────────────────────────────────
export function AboutUs() {
  return (
    <div className="min-h-screen bg-white">

      {/* ══ 1. HERO BANNER ════════════════════════════════════════ */}
      <section className="relative text-white overflow-hidden" style={{ minHeight: 480, display: 'flex', alignItems: 'center' }}>
        <div
          className="absolute inset-0"
          aria-hidden="true"
          style={{
            backgroundImage: "url('/about-rongsu-city-hero.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'center 46%',
            transform: 'scale(1.015)',
          }}
        />
        <div
          className="absolute inset-0"
          aria-hidden="true"
          style={{
            background:
              'linear-gradient(90deg,rgba(3,13,29,0.78) 0%,rgba(5,23,45,0.66) 50%,rgba(3,15,33,0.80) 100%)',
          }}
        />
        <div
          className="absolute inset-x-0 bottom-0 h-40"
          aria-hidden="true"
          style={{ background: 'linear-gradient(180deg,rgba(2,11,25,0) 0%,rgba(2,11,25,0.58) 100%)' }}
        />
        <div className="max-w-5xl mx-auto px-6 relative z-10 text-center py-24 w-full">
          {/* Dual-logo badge */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <Badge className="bg-white/12 text-white border-white/20 text-xs backdrop-blur">联合实验室</Badge>
          </div>

          <h1 className="text-white mb-5 leading-tight"
            style={{ fontSize: 'clamp(2rem,5vw,3.4rem)', fontWeight: 900, letterSpacing: '-0.02em' }}>
            智能计算联合实验室
          </h1>

          <p className="text-blue-200 text-base mb-3 font-medium">
            由 <span className="text-white font-bold">杭州榕数科技有限公司</span>
            &nbsp;&amp;&nbsp;
            <span className="text-white font-bold">浙江大学滨江研究院</span> 联合创立
          </p>

          <p className="text-blue-200/80 text-sm max-w-2xl mx-auto leading-relaxed">
            聚焦人工智能技术赋能企业数智化转型升级，打造可信人工智能新质生产力
          </p>

          {/* Two founding partner logos — large, centered */}
          <div className="flex items-center justify-center mt-12" style={{ gap: 56 }}>
            {/* Rongshu — invert to white on dark bg */}
            <div className="flex flex-col items-center gap-3">
              <img
                src={rongShuLogo}
                alt="杭州榕数科技有限公司"
                style={{ height: 72, width: 'auto', objectFit: 'contain', filter: 'brightness(0) invert(1) drop-shadow(0 0 16px rgba(255,255,255,0.2))', opacity: 0.92 }}
              />
            </div>
            {/* Divider */}
            <div style={{ width: 1, height: 56, background: 'rgba(255,255,255,0.18)', borderRadius: 99 }} />
            {/* ZJU Binjiang — logo inverted to white */}
            <div className="flex flex-col items-center gap-3">
              <img
                src={yjyLogo}
                alt="浙江大学滨江研究院"
                style={{ height: 72, width: 'auto', objectFit: 'contain', filter: 'brightness(0) invert(1)', opacity: 0.92 }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ══ 2. PARTNERS — two-column ═════════════════════════════ */}
      <ScrollReveal>
        <section className="py-20 px-4" style={{ background: 'linear-gradient(135deg,#f8faff,#f0f4ff)' }}>
          <div className="max-w-[83%] mx-auto">
            <div className="text-center mb-14">
              <Badge className="mb-4 bg-indigo-50 text-indigo-700 border-indigo-200 text-xs">合作方介绍</Badge>
              <h2 className="text-gray-900 mb-3" style={{ fontSize: '2rem', fontWeight: 900 }}>
                强强联合，共筑 AI 安全新生态
              </h2>
              <div className="h-1 w-14 rounded-full mx-auto" style={{ background: 'linear-gradient(90deg,#6366f1,#06b6d4)' }} />
            </div>

            <div className="grid grid-cols-2 gap-8">

              {/* ── Card A: Rongshu ── */}
              <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-purple-100">
                {/* Header */}
                <div className="p-7 pb-5" style={{ background: 'linear-gradient(135deg,rgba(139,92,246,0.08),rgba(99,102,241,0.04))' }}>
                  <div className="mb-4">
                    <img src={rongShuLogo} alt="杭州榕数科技有限公司" style={{ height: 56, width: 'auto', objectFit: 'contain', display: 'block' }} />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {['国家高新技术企业', '5050计划重点支持企业'].map(t => (
                      <span key={t} className="text-[11px] px-2.5 py-0.5 rounded-full font-semibold"
                        style={{ background: 'rgba(139,92,246,0.12)', color: '#7c3aed', border: '1px solid rgba(139,92,246,0.25)' }}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-7 pt-5 flex flex-col gap-5">
                  {/* 核心理念 */}
                  <div>
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">核心理念</div>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      秉承 <strong className="text-purple-600">"AI 赋能产业"</strong> 理念，致力于为客户提供先进适用的智能化解决方案，助力企业数智化转型升级。
                    </p>
                  </div>

                  {/* 业务方向 */}
                  <div>
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">业务方向</div>
                    <div className="flex flex-col gap-2">
                      {[
                        { icon: Database,   color: '#8b5cf6', label: '数据与内容安全', desc: '个人敏感信息排查、AIGC内容审核、生成内容标识与追溯' },
                        { icon: BarChart2,  color: '#3b82f6', label: '模型评测',       desc: '深度模型可信测评、大模型性能评测' },
                        { icon: Code2,      color: '#06b6d4', label: '系统安全',       desc: '代码漏洞审查、网络渗透测试' },
                      ].map(b => {
                        const Icon = b.icon;
                        return (
                          <div key={b.label} className="flex items-start gap-3 p-3 rounded-xl"
                            style={{ background: `${b.color}08`, border: `1px solid ${b.color}18` }}>
                            <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                              style={{ background: `${b.color}18` }}>
                              <Icon className="w-3.5 h-3.5" style={{ color: b.color }} />
                            </div>
                            <div>
                              <div className="text-gray-800 font-semibold text-sm">{b.label}</div>
                              <div className="text-gray-500 text-xs mt-0.5">{b.desc}</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* 核心产品 */}
                  <div>
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">核心产品与成果</div>
                    <div className="flex flex-col gap-3">
                      {RONGSHU_PRODUCTS.map(p => {
                        const Icon = p.icon;
                        return (
                          <div key={p.title} className="flex gap-3">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                              style={{ background: `${p.color}15` }}>
                              <Icon className="w-4 h-4" style={{ color: p.color }} />
                            </div>
                            <div className="flex-1">
                              <div className="text-gray-800 font-semibold text-sm leading-snug">{p.title}</div>
                              <div className="text-gray-500 text-xs mt-0.5 leading-snug">{p.desc}</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Card B: ZJU Binjiang ── */}
              <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-blue-100">
                {/* Header */}
                <div className="p-7 pb-5" style={{ background: 'linear-gradient(135deg,rgba(59,130,246,0.08),rgba(6,182,212,0.04))' }}>
                  <div className="mb-4">
                    <img src={yjyLogo} alt="浙江大学滨江研究院" style={{ height: 56, width: 'auto', objectFit: 'contain', display: 'block' }} />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {['省级新型研发机构', '浙大与滨江区共建'].map(t => (
                      <span key={t} className="text-[11px] px-2.5 py-0.5 rounded-full font-semibold"
                        style={{ background: 'rgba(59,130,246,0.12)', color: '#2563eb', border: '1px solid rgba(59,130,246,0.25)' }}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-7 pt-5 flex flex-col gap-5">
                  {/* 核心理念 */}
                  <div>
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">核心理念</div>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      <strong className="text-blue-600">启真厚德，赋能创新，引才聚滨，行稳致远。</strong>
                      <br />
                      聚焦信息创新、生命健康等领域，开展信息技术研发、高端医疗器械和智慧医疗等前沿研究。
                    </p>
                  </div>

                  {/* 核心实力 */}
                  <div>
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">核心实力</div>
                    <div className="flex flex-col gap-3">
                      {[
                        { icon: Users, color: '#6366f1', label: '顶尖人才团队', desc: '拥有含中国工程院院士在内的顶尖顾问委员会与领导团队' },
                        { icon: FlaskConical, color: '#3b82f6', label: '五大科研中心', desc: '国产信创、生命健康、儿童健康、智能医疗、医工信孵化器' },
                        { icon: Layers, color: '#10b981', label: '产业孵化能力', desc: '累计孵化企业 58 家，融资超 3 亿元' },
                      ].map(s => {
                        const Icon = s.icon;
                        return (
                          <div key={s.label} className="flex gap-3">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                              style={{ background: `${s.color}15` }}>
                              <Icon className="w-4 h-4" style={{ color: s.color }} />
                            </div>
                            <div>
                              <div className="text-gray-800 font-semibold text-sm">{s.label}</div>
                              <div className="text-gray-500 text-xs mt-0.5 leading-snug">{s.desc}</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* 五大中心 */}
                  <div>
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">科研平台</div>
                    <div className="grid grid-cols-1 gap-2">
                      {ZJU_CENTERS.map(c => {
                        const Icon = c.icon;
                        return (
                          <div key={c.title} className="flex items-center gap-2.5 p-2.5 rounded-xl"
                            style={{ background: `${c.color}08`, border: `1px solid ${c.color}18` }}>
                            <Icon className="w-4 h-4 shrink-0" style={{ color: c.color }} />
                            <span className="text-gray-700 text-xs font-medium">{c.title}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* ══ 3. AWARDS & MILESTONES ═══════════════════════════════ */}
      <ScrollReveal>
        <section className="py-20 px-4 bg-white">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <Badge className="mb-4 bg-amber-50 text-amber-700 border-amber-200 text-xs">核心成果与荣誉</Badge>
              <h2 className="text-gray-900 mb-3" style={{ fontSize: '2rem', fontWeight: 900 }}>
                用成绩说话，用实力赢信赖
              </h2>
              <div className="h-1 w-14 rounded-full mx-auto" style={{ background: 'linear-gradient(90deg,#f59e0b,#f97316)' }} />
            </div>

            {/* Timeline */}
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-[88px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-indigo-200 via-blue-200 to-amber-200" />

              {AWARDS.map((group, gi) => (
                <div key={gi} className="flex gap-6 mb-10 last:mb-0">
                  {/* Year pill */}
                  <div className="w-[88px] shrink-0 flex flex-col items-center pt-1">
                    <div className="px-3 py-1.5 rounded-full text-sm font-black text-white shrink-0 relative z-10"
                      style={{ background: `linear-gradient(135deg,${group.color},${group.color}cc)`, boxShadow: `0 3px 12px ${group.color}45` }}>
                      {group.year}
                    </div>
                  </div>

                  {/* Award cards */}
                  <div className="flex-1 flex flex-col gap-3 pt-0.5">
                    {group.items.map((award, ai) => (
                      <div key={ai} className="flex items-start gap-3 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                          style={{ background: `${group.color}14` }}>
                          <Trophy className="w-4 h-4" style={{ color: group.color }} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start gap-2 flex-wrap">
                            <span className="text-gray-800 font-semibold text-sm leading-snug">{award.title}</span>
                          </div>
                          <div className="flex items-center gap-2 mt-1.5">
                            <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
                              style={{ background: `${group.color}12`, color: group.color, border: `1px solid ${group.color}28` }}>
                              {award.tag}
                            </span>
                            <span className="text-[11px] text-gray-400">{award.org}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* ══ 4. STATS STRIP ════════════════════════════════════════ */}
      <ScrollReveal>
        <section className="py-14 px-4" style={{ background: 'linear-gradient(135deg,#f0f4ff,#ede9fe)' }}>
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-4 gap-6">
              {[
                { value: '58+',  label: '孵化企业', sub: '滨江研究院累计', color: '#3b82f6' },
                { value: '3亿+', label: '融资规模', sub: '孵化企业累计融资', color: '#8b5cf6' },
                { value: '30+',  label: '专利与软著', sub: '核心技术自主可控', color: '#10b981' },
                { value: '10+',  label: '行业奖项', sub: '权威机构认可', color: '#f59e0b' },
              ].map(s => (
                <div key={s.label} className="bg-white rounded-2xl p-6 text-center border shadow-sm"
                  style={{ borderColor: `${s.color}20` }}>
                  <div className="font-black mb-1" style={{ fontSize: '2.4rem', color: s.color, lineHeight: 1 }}>{s.value}</div>
                  <div className="text-gray-800 font-bold text-sm">{s.label}</div>
                  <div className="text-gray-400 text-[11px] mt-0.5">{s.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

    </div>
  );
}
