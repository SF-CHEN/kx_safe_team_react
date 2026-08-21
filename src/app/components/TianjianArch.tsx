import React from 'react';
import { useNavigate } from 'react-router';
import { Shield, ArrowRight, Code2, Globe, Cpu, ChevronRight } from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { ScrollReveal } from './ScrollReveal';

const CAPS = [
  {
    icon: Code2,
    title: '代码与漏洞审查',
    desc: 'AI 应用源代码、依赖组件与配置文件深度扫描，上线前发现安全隐患',
    tags: ['代码缺陷', '依赖风险', '漏洞扫描'],
    color: '#0ea5e9',
    bg: 'rgba(14,165,233,0.05)',
    border: 'rgba(14,165,233,0.2)',
    grad: 'from-sky-500 to-cyan-600',
    step: '01',
  },
  {
    icon: Globe,
    title: '网络与应用安全',
    desc: 'AI 平台网络基础设施、Web 应用与 API 接口全面漏洞扫描与渗透测试',
    tags: ['渗透测试', '接口安全', '边界防护'],
    color: '#2563eb',
    bg: 'rgba(37,99,235,0.05)',
    border: 'rgba(37,99,235,0.2)',
    grad: 'from-blue-500 to-indigo-600',
    step: '02',
  },
  {
    icon: Cpu,
    title: 'AI 系统上线测试',
    desc: '大模型应用、RAG 系统与智能体上线前功能验收、效果测试与异常评估',
    tags: ['功能验收', '效果评估', '异常场景'],
    color: '#7c3aed',
    bg: 'rgba(124,58,237,0.05)',
    border: 'rgba(124,58,237,0.2)',
    grad: 'from-violet-500 to-purple-600',
    step: '03',
  },
];

const OUTCOMES = [
  { label: '系统可上线', color: '#10b981' },
  { label: '系统可验收', color: '#3b82f6' },
  { label: '质量可控', color: '#f59e0b' },
  { label: '风险可见', color: '#8b5cf6' },
];

export function TianjianArch() {
  const navigate = useNavigate();

  return (
    <ScrollReveal>
      <section className="py-20 px-4" style={{ background: '#fff' }}>
        <div className="max-w-[83%] mx-auto">

          {/* ── Unified Header ── */}
          <div className="flex items-start justify-between mb-10 gap-6 flex-wrap">
            <div className="max-w-xl">
              <Badge className="mb-3 bg-cyan-50 text-cyan-700 border-cyan-200 text-xs">系统安全</Badge>
              <h2
                className="text-gray-900 mb-1"
                style={{ fontSize: '2rem', fontWeight: 900, lineHeight: 1.2 }}
              >
                AI 应用上线的
              </h2>
              <h2
                className="mb-3"
                style={{
                  fontSize: '2rem', fontWeight: 900, lineHeight: 1.2,
                  background: 'linear-gradient(90deg,#0ea5e9,#7c3aed)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                }}
              >
                三道安全防线
              </h2>
              <div className="h-1 w-10 rounded-full mb-3" style={{ background: 'linear-gradient(90deg,#0ea5e9,#7c3aed)' }} />
              <p className="text-gray-500 text-sm leading-relaxed">
                从代码交付到系统验收，三个关键节点构建全面安全防护，确保每个 AI 系统安全可靠地上线运行
              </p>
            </div>
            <div className="flex flex-col items-end gap-2.5 shrink-0">
              <Button
                style={{ background: 'linear-gradient(135deg,#0ea5e9,#7c3aed)', color: '#fff', boxShadow: '0 4px 20px rgba(14,165,233,0.3)' }}
                onClick={() => navigate('/products/tianjian')}
              >
                了解系统安全 <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
              <span
                className="text-xs px-3 py-1.5 rounded-full font-medium"
                style={{ background: 'rgba(6,182,212,0.1)', color: '#0891b2', border: '1px solid rgba(6,182,212,0.2)' }}
              >
                即将上线
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
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${cap.grad} flex items-center justify-center`}
                      style={{ boxShadow: `0 4px 14px ${cap.color}35` }}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <span
                      className="text-3xl font-black"
                      style={{ color: `${cap.color}20`, lineHeight: 1 }}
                    >
                      {cap.step}
                    </span>
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

          {/* ── Outcome strip ── */}
          <div
            className="rounded-2xl px-6 py-4 flex items-center gap-4 flex-wrap"
            style={{
              background: 'linear-gradient(90deg,#f8fafc,#f1f5f9)',
              border: '1px solid #e2e8f0',
            }}
          >
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest shrink-0">交付效果</span>
            <div className="flex items-center gap-2 flex-wrap">
              {OUTCOMES.map((o) => (
                <span
                  key={o.label}
                  className="text-[11px] px-3 py-1 rounded-full font-semibold"
                  style={{ background: '#fff', color: o.color, border: `1px solid ${o.color}28` }}
                >
                  ✓ {o.label}
                </span>
              ))}
            </div>
          </div>

        </div>
      </section>
    </ScrollReveal>
  );
}
