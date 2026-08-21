/**
 * PlatformEcosystem – 整体平台架构图（image-8 二次创作）
 * 展示四大产品系列的分层关系与工作流
 */
import React from 'react';
import { useNavigate } from 'react-router';
import { Database, BarChart2, Shield, FileText, ArrowRight, Server, Lock, BookOpen, BarChart } from 'lucide-react';
import { Badge } from './ui/badge';
import { ScrollReveal } from './ScrollReveal';

const FLOW_STEPS = [
  { label: '需求输入', icon: '📋' },
  { label: '数据治理', icon: '🗄️' },
  { label: '模型评测', icon: '📊' },
  { label: '应用测试', icon: '🔍' },
  { label: '合规治理', icon: '🛡️' },
  { label: '方案交付', icon: '📦' },
  { label: '持续优化', icon: '🔄' },
];

const FOUNDATIONS = [
  { label: '数据底座', sub: '采集 · 存储 · 服务 · 知识库', icon: Server, color: '#60a5fa' },
  { label: '评测与环境底座', sub: '容器环境 · 评测工具 · 仿真环境', icon: BarChart, color: '#818cf8' },
  { label: '安全与治理底座', sub: '身份权限 · 数据安全 · 合规治理', icon: Lock, color: '#34d399' },
  { label: '标准与规则底座', sub: '评测标准 · 行业规范 · 备案规则', icon: BookOpen, color: '#fb923c' },
];

export function PlatformEcosystem() {
  const navigate = useNavigate();

  return (
    <ScrollReveal>
      <section className="py-20 px-4" style={{ background: 'linear-gradient(180deg,#f8fafc,#fff)' }}>
        <div className="max-w-[83%] mx-auto">

          {/* Header */}
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-slate-100 text-slate-600 border-slate-200 text-xs">平台全景</Badge>
            <h2
              className="text-gray-900 mb-3"
              style={{ fontSize: '2rem', fontWeight: 900, lineHeight: 1.2 }}
            >
              AI 安全全栈平台生态
            </h2>
            <div className="h-1 w-14 rounded-full mx-auto mb-4" style={{ background: 'linear-gradient(90deg,#6366f1,#06b6d4)' }} />
            <p className="text-gray-500 text-sm max-w-2xl mx-auto">
              数据侧夯实数据基础，模型侧度量模型能力，系统侧把关系统交付，服务侧支撑合规落地——四大能力侧共同构成 AI 安全全生命周期服务体系
            </p>
          </div>

          {/* Architecture diagram */}
          <div className="space-y-3 mb-10">

            {/* ── 合规治理 — full-width compliance umbrella ── */}
            <div
              className="rounded-2xl p-5 flex items-center gap-6 cursor-pointer hover:shadow-md transition-all duration-200"
              style={{
                background: 'linear-gradient(135deg,#ecfdf5,#d1fae5)',
                border: '1.5px solid rgba(16,185,129,0.25)',
              }}
              onClick={() => navigate('/products/tianche')}
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="font-bold text-gray-900">合规治理</span>
                  <span className="text-emerald-700 text-xs font-medium">合规咨询与能力建设</span>
                  <span
                    className="text-[9px] px-1.5 py-0.5 rounded font-medium"
                    style={{ background: 'rgba(16,185,129,0.15)', color: '#059669', border: '1px solid rgba(16,185,129,0.3)' }}
                  >
                    合规治理层
                  </span>
                </div>
                <div className="flex flex-wrap gap-x-6 gap-y-0.5">
                  {['人工智能安全教学平台', '大模型备案合规服务', '可信安全标准制定', '运营与复测支撑'].map((item) => (
                    <span key={item} className="text-sm text-emerald-800 flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-emerald-500 shrink-0" />{item}
                    </span>
                  ))}
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-emerald-500 shrink-0" />
            </div>

            {/* ── Three product columns (数据侧 / 模型侧 / 系统侧) ── */}
            <div className="grid grid-cols-3 gap-3">
              {[
                {
                  icon: Database,
                  name: '数据智能',
                  badge: '数据侧',
                  tagline: '数据治理与合规',
                  grad: 'from-violet-500 to-purple-600',
                  bg: 'linear-gradient(135deg,#f5f3ff,#ede9fe)',
                  border: 'rgba(139,92,246,0.25)',
                  badgeStyle: { background: 'rgba(139,92,246,0.12)', color: '#7c3aed', border: '1px solid rgba(139,92,246,0.25)' },
                  result: '数据可用、合规、可靠',
                  resultColor: '#7c3aed',
                  items: ['个人数据风险审查', '训练/知识库数据质检', 'AIGC 内容审核与鉴伪', 'AIGC 内容标识与检测'],
                  path: '/products-overview',
                },
                {
                  icon: BarChart2,
                  name: '模型评测',
                  badge: '模型侧',
                  tagline: '模型能力与性能评测',
                  grad: 'from-blue-500 to-indigo-600',
                  bg: 'linear-gradient(135deg,#eff6ff,#e0e7ff)',
                  border: 'rgba(59,130,246,0.25)',
                  badgeStyle: { background: 'rgba(59,130,246,0.12)', color: '#1d4ed8', border: '1px solid rgba(59,130,246,0.25)' },
                  result: '模型可用、稳定、可控',
                  resultColor: '#1d4ed8',
                  items: ['深度模型可信评测', '大模型综合评测', '智能体可信评测', '具身智能可信评测'],
                  path: '/aisafepro',
                  activeBadge: '',
                },
                {
                  icon: Shield,
                  name: '系统安全',
                  badge: '系统侧',
                  tagline: '应用上线与交付质量',
                  grad: 'from-cyan-500 to-blue-600',
                  bg: 'linear-gradient(135deg,#ecfeff,#e0f2fe)',
                  border: 'rgba(6,182,212,0.25)',
                  badgeStyle: { background: 'rgba(6,182,212,0.12)', color: '#0e7490', border: '1px solid rgba(6,182,212,0.25)' },
                  result: '系统可上线、可验收、质量可控',
                  resultColor: '#0e7490',
                  items: ['代码与漏洞审查', '网络与应用安全测试', 'AI 系统上线测试'],
                  path: '/products/tianjian',
                },
              ].map((col) => {
                const Icon = col.icon;
                return (
                  <div
                    key={col.name}
                    className="rounded-2xl p-5 cursor-pointer hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 flex flex-col"
                    style={{ background: col.bg, border: `1.5px solid ${col.border}` }}
                    onClick={() => navigate(col.path)}
                  >
                    <div className="flex items-center gap-2.5 mb-3">
                      <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${col.grad} flex items-center justify-center`}>
                        <Icon className="w-4.5 h-4.5 text-white" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-gray-900 text-sm">{col.name}</span>
                          {col.activeBadge && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded font-medium" style={col.badgeStyle}>{col.activeBadge}</span>
                          )}
                        </div>
                        <div className="text-xs text-gray-500">{col.tagline}</div>
                      </div>
                      <span className="ml-auto text-[9px] px-1.5 py-0.5 rounded font-bold" style={col.badgeStyle}>{col.badge}</span>
                    </div>

                    <ul className="space-y-1.5 flex-1 mb-3">
                      {col.items.map((item) => (
                        <li key={item} className="flex items-center gap-2 text-xs text-gray-700">
                          <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: col.border }} />
                          {item}
                        </li>
                      ))}
                    </ul>

                    <div className="flex items-center justify-between pt-2" style={{ borderTop: `1px solid ${col.border}` }}>
                      <span className="text-[11px] font-semibold" style={{ color: col.result.startsWith('模') ? '#1d4ed8' : col.resultColor }}>
                        ✓ {col.result}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ── Foundation layer ── */}
            <div
              className="rounded-2xl p-4"
              style={{ background: 'linear-gradient(135deg,#f1f5f9,#e2e8f0)', border: '1.5px solid rgba(148,163,184,0.35)' }}
            >
              <div className="text-center mb-3">
                <span className="text-xs font-bold text-slate-500 tracking-widest uppercase">底座能力</span>
              </div>
              <div className="grid grid-cols-4 gap-3">
                {FOUNDATIONS.map((f) => {
                  const Icon = f.icon;
                  return (
                    <div key={f.label} className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-white/70">
                      <Icon className="w-4 h-4 shrink-0" style={{ color: f.color }} />
                      <div>
                        <div className="text-xs font-semibold text-gray-700">{f.label}</div>
                        <div className="text-[10px] text-gray-400 mt-0.5">{f.sub}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Process flow */}
          <div
            className="rounded-2xl p-4"
            style={{ background: 'linear-gradient(135deg,#0f2040,#1e3a8a)', border: '1px solid rgba(59,130,246,0.25)' }}
          >
            <div className="flex items-center gap-1.5 justify-center flex-wrap">
              {FLOW_STEPS.map((step, idx) => (
                <React.Fragment key={step.label}>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg" style={{ background: 'rgba(255,255,255,0.08)' }}>
                    <span className="text-sm">{step.icon}</span>
                    <span className="text-white text-xs font-medium whitespace-nowrap">{step.label}</span>
                  </div>
                  {idx < FLOW_STEPS.length - 1 && (
                    <ArrowRight className="w-3 h-3 text-blue-400 shrink-0" />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </section>
    </ScrollReveal>
  );
}
