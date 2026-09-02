import React from 'react';
import { useNavigate } from 'react-router';
import { FileText, ArrowRight, GraduationCap, ClipboardCheck, BookOpen, RefreshCw, ChevronRight } from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { ScrollReveal } from './ScrollReveal';

const CAPS = [
  {
    icon: GraduationCap,
    title: 'AI 安全能力建设',
    desc: '攻防实训、课程支撑与评测演练环境，快速构建企业与院校 AI 安全实战能力',
    tags: ['课程实训', '攻击演示', '能力认证'],
    color: '#10b981',
    bg: 'rgba(16,185,129,0.05)',
    border: 'rgba(16,185,129,0.2)',
    grad: 'from-emerald-500 to-teal-600',
    num: '01',
  },
  {
    icon: ClipboardCheck,
    title: '大模型备案落地',
    desc: '覆盖备案全流程，从合规自查到材料整备与上报支持，顺利通过监管审查',
    tags: ['合规自查', '材料整理', '全流程辅导'],
    color: '#0ea5e9',
    bg: 'rgba(14,165,233,0.05)',
    border: 'rgba(14,165,233,0.2)',
    grad: 'from-sky-500 to-blue-600',
    num: '02',
  },
  {
    icon: BookOpen,
    title: '可信标准体系建设',
    desc: '协助企业制定 AI 应用评测规范、数据管理制度与模型交付标准，建立 AI 治理体系',
    tags: ['评测规范', '数据标准', '治理指南'],
    color: '#8b5cf6',
    bg: 'rgba(139,92,246,0.05)',
    border: 'rgba(139,92,246,0.2)',
    grad: 'from-violet-500 to-purple-600',
    num: '03',
  },
  {
    icon: RefreshCw,
    title: '持续运营与复测',
    desc: '周期性复测、整改追踪与年度合规报告，构建"评测→整改→再评测"持续优化闭环',
    tags: ['周期复测', '整改追踪', '年度报告'],
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.05)',
    border: 'rgba(245,158,11,0.2)',
    grad: 'from-amber-500 to-orange-600',
    num: '04',
  },
];

const JOURNEY = [
  { step: '需求诊断' },
  { step: '评测认证' },
  { step: '备案辅导' },
  { step: '能力建设' },
  { step: '持续运营' },
];

export function TianceArch() {
  const navigate = useNavigate();

  return (
    <ScrollReveal>
      <section
        className="py-20 px-4"
        style={{ background: 'linear-gradient(180deg,#f0fdf4 0%,#fff 50%)' }}
      >
        <div className="max-w-[83%] mx-auto">

          {/* ── Unified Header ── */}
          <div className="flex items-start justify-between mb-10 gap-6 flex-wrap">
            <div className="max-w-xl">
              <Badge className="mb-3 bg-emerald-50 text-emerald-700 border-emerald-200 text-xs">合规治理</Badge>
              <h2
                className="text-gray-900 mb-1"
                style={{ fontSize: '2rem', fontWeight: 900, lineHeight: 1.2 }}
              >
                AI 合规的
              </h2>
              <h2
                className="mb-3"
                style={{
                  fontSize: '2rem', fontWeight: 900, lineHeight: 1.2,
                  background: 'linear-gradient(90deg,#10b981,#0ea5e9)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                }}
              >
                四大能力支柱
              </h2>
              <div className="h-1 w-10 rounded-full mb-3" style={{ background: 'linear-gradient(90deg,#10b981,#0ea5e9)' }} />
              <p className="text-gray-500 text-sm leading-relaxed">
                教学赋能、备案落地、标准建设、持续运营——构建企业可复用、可审计、可持续的 AI 合规治理体系
              </p>
            </div>
            <div className="flex flex-col items-end gap-2.5 shrink-0">
              <Button
                style={{ background: 'linear-gradient(135deg,#10b981,#059669)', color: '#fff', boxShadow: '0 4px 20px rgba(16,185,129,0.3)' }}
                onClick={() => navigate('/products/tianche')}
              >
                了解合规治理 <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
              <span
                className="text-xs px-3 py-1.5 rounded-full font-medium"
                style={{ background: 'rgba(16,185,129,0.1)', color: '#059669', border: '1px solid rgba(16,185,129,0.2)' }}
              >
                即将上线
              </span>
            </div>
          </div>

          {/* ── 4-column capability cards ── */}
          <div className="grid grid-cols-4 gap-5 mb-6">
            {CAPS.map((cap) => {
              const Icon = cap.icon;
              return (
                <div
                  key={cap.title}
                  className="rounded-2xl p-5 flex flex-col hover:-translate-y-1 transition-transform duration-300"
                  style={{
                    background: cap.bg,
                    border: `1.5px solid ${cap.border}`,
                    boxShadow: `0 4px 24px ${cap.color}10`,
                  }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${cap.grad} flex items-center justify-center`}
                      style={{ boxShadow: `0 4px 12px ${cap.color}35` }}
                    >
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <span
                      className="text-3xl font-black"
                      style={{ color: `${cap.color}20`, lineHeight: 1 }}
                    >
                      {cap.num}
                    </span>
                  </div>

                  <h3
                    className="text-gray-900 mb-2"
                    style={{ fontSize: '0.9rem', fontWeight: 800, lineHeight: 1.3 }}
                  >
                    {cap.title}
                  </h3>
                  <p className="text-gray-500 leading-relaxed mb-4 flex-1" style={{ fontSize: '0.78rem' }}>{cap.desc}</p>

                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {cap.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full font-medium"
                        style={{
                          fontSize: '0.65rem',
                          padding: '2px 8px',
                          background: `${cap.color}12`,
                          color: cap.color,
                          border: `1px solid ${cap.color}25`,
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div
                    className="flex items-center gap-1 cursor-pointer group"
                    style={{ color: cap.color }}
                  >
                    <span className="text-xs font-semibold group-hover:underline">了解详情</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── Journey timeline strip ── */}
          <div
            className="rounded-2xl px-6 py-4"
            style={{ background: 'linear-gradient(135deg,#0f2040,#1a3a6e)', border: '1px solid rgba(16,185,129,0.2)' }}
          >
            <div className="flex items-center justify-between flex-wrap gap-4">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest shrink-0">合规服务全旅程</span>
              <div className="flex items-center gap-0 flex-1 justify-center">
                {JOURNEY.map((j, idx) => (
                  <div key={j.step} className="flex items-center">
                    <div
                      className="flex items-center gap-2 px-4 py-1.5 rounded-full"
                      style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)' }}
                    >
                      <span
                        className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0"
                        style={{ background: 'rgba(16,185,129,0.3)', color: '#34d399' }}
                      >
                        {idx + 1}
                      </span>
                      <span className="text-white text-xs font-semibold whitespace-nowrap">{j.step}</span>
                    </div>
                    {idx < JOURNEY.length - 1 && (
                      <div className="w-4 h-px mx-1" style={{ background: 'rgba(16,185,129,0.4)' }} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </section>
    </ScrollReveal>
  );
}
