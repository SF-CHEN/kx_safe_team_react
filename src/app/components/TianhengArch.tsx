import React from 'react';
import { useNavigate } from 'react-router';
import { BarChart2, ArrowRight, Brain, Bot, Cpu, ChevronRight } from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { ScrollReveal } from './ScrollReveal';

const CAPS = [
  {
    icon: Cpu,
    title: '深度模型评测',
    desc: 'CV · NLP · Audio 等各类深度模型的性能、鲁棒性与可解释性评估',
    tags: ['性能评测', '鲁棒性分析', '可解释性'],
    color: '#06b6d4',
    bg: 'rgba(6,182,212,0.05)',
    border: 'rgba(6,182,212,0.2)',
    grad: 'from-cyan-500 to-blue-600',
  },
  {
    icon: Brain,
    title: '大模型能力评测',
    desc: '覆盖文本、多模态大模型的能力、幻觉与安全对齐全维度评测认证',
    tags: ['能力评测', '幻觉检测', '安全对齐'],
    color: '#3b82f6',
    bg: 'rgba(59,130,246,0.05)',
    border: 'rgba(59,130,246,0.2)',
    grad: 'from-blue-500 to-indigo-600',
  },
  {
    icon: Bot,
    title: '智能体 & 具身评测',
    desc: '对 Agent 的任务规划、工具调用与操作安全进行全面可信度量化评估',
    tags: ['规划评测', '工具验证', '操作安全'],
    color: '#8b5cf6',
    bg: 'rgba(139,92,246,0.05)',
    border: 'rgba(139,92,246,0.2)',
    grad: 'from-violet-500 to-purple-600',
  },
];

const METRICS = [
  { value: '20+', label: '评测方法' },
  { value: '600+', label: '标准数据集' },
  { value: '4 大', label: '模型层次' },
  { value: 'IEEE', label: '国际标准' },
];

export function TianhengArch() {
  const navigate = useNavigate();

  return (
    <ScrollReveal>
      <section
        className="py-20 px-4"
        style={{ background: 'linear-gradient(180deg,#eff6ff 0%,#fff 55%)' }}
      >
        <div className="max-w-7xl mx-auto">

          {/* ── Unified Header ── */}
          <div className="flex items-start justify-between mb-10 gap-6 flex-wrap">
            <div className="max-w-xl">
              <Badge className="mb-3 bg-blue-50 text-blue-700 border-blue-200 text-xs">模型评测</Badge>
              <h2
                className="text-gray-900 mb-1"
                style={{ fontSize: '2rem', fontWeight: 900, lineHeight: 1.2 }}
              >
                从基础模型到智能体
              </h2>
              <h2
                className="mb-3"
                style={{
                  fontSize: '2rem', fontWeight: 900, lineHeight: 1.2,
                  background: 'linear-gradient(90deg,#2563eb,#6366f1)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                }}
              >
                全层次可信评测认证
              </h2>
              <div className="h-1 w-10 rounded-full mb-3" style={{ background: 'linear-gradient(90deg,#3b82f6,#6366f1)' }} />
              <p className="text-gray-500 text-sm leading-relaxed">
                依托 IEEE 国际标准，为 AI 模型提供从能力验证到安全审查的权威评测，助力模型可信上线
              </p>
            </div>
            <div className="flex flex-col items-end gap-2.5 shrink-0">
              <Button
                style={{ background: 'linear-gradient(135deg,#2563eb,#4f46e5)', color: '#fff', boxShadow: '0 4px 20px rgba(59,130,246,0.32)' }}
                onClick={() => navigate('/llm-evaluation')}
              >
                立即体验模型评测 <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
              <span
                className="text-xs px-3 py-1.5 rounded-full font-bold"
                style={{ background: 'rgba(34,197,94,0.12)', color: '#16a34a', border: '1px solid rgba(34,197,94,0.25)' }}
              >
                ● 正式发布
              </span>
            </div>
          </div>

          {/* ── 3-column capability cards ── */}
          <div className="grid grid-cols-3 gap-5 mb-6">
            {CAPS.map((cap) => {
              const Icon = cap.icon;
              return (
                <div
                  key={cap.title}
                  className="rounded-2xl p-6 flex flex-col hover:-translate-y-1 transition-transform duration-300"
                  style={{
                    background: cap.bg,
                    border: `1.5px solid ${cap.border}`,
                    boxShadow: `0 4px 24px ${cap.color}10`,
                  }}
                >
                  <div
                    className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${cap.grad} flex items-center justify-center mb-4`}
                    style={{ boxShadow: `0 4px 14px ${cap.color}35` }}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>

                  <h3
                    className="text-gray-900 mb-2"
                    style={{ fontSize: '1rem', fontWeight: 800 }}
                  >
                    {cap.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-4 flex-1">{cap.desc}</p>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {cap.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[11px] px-2.5 py-0.5 rounded-full font-medium"
                        style={{ background: `${cap.color}12`, color: cap.color, border: `1px solid ${cap.color}25` }}
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

          {/* ── Key metrics + outcome strip ── */}
          <div
            className="rounded-2xl px-6 py-4 flex items-center justify-between gap-4 flex-wrap"
            style={{
              background: 'linear-gradient(90deg,rgba(59,130,246,0.04),rgba(99,102,241,0.04))',
              border: '1px solid rgba(59,130,246,0.15)',
            }}
          >
            <span className="text-xs font-bold text-blue-400 uppercase tracking-widest shrink-0">核心指标</span>
            <div className="flex items-center gap-6 flex-wrap">
              {METRICS.map((m) => (
                <div key={m.label} className="text-center">
                  <div
                    className="font-black text-blue-600 leading-none"
                    style={{ fontSize: '1.3rem' }}
                  >
                    {m.value}
                  </div>
                  <div className="text-gray-500 mt-0.5" style={{ fontSize: '0.65rem' }}>{m.label}</div>
                </div>
              ))}
            </div>
            <span
              className="text-xs px-3 py-1.5 rounded-full font-semibold shrink-0"
              style={{ background: 'rgba(59,130,246,0.1)', color: '#2563eb', border: '1px solid rgba(59,130,246,0.2)' }}
            >
              统一标准 · 横向对比 · 持续追踪
            </span>
          </div>

        </div>
      </section>
    </ScrollReveal>
  );
}
