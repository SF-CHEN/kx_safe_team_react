import React from 'react';
import { useNavigate } from 'react-router';
import { Database, ArrowRight, User, Shield, Film, ChevronRight, Tags } from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { ScrollReveal } from './ScrollReveal';

const CAPS = [
  {
    icon: User,
    title: '个人隐私合规',
    desc: '自动识别数据集中个人信息与业务敏感字段',
    tags: ['数据脱敏', '隐私合规', '敏感识别'],
    color: '#8b5cf6',
    bg: 'rgba(139,92,246,0.05)',
    border: 'rgba(139,92,246,0.18)',
    grad: 'from-violet-500 to-purple-600',
    path: '/privacy-data-audit',
  },
  {
    icon: Shield,
    title: '训练数据安全',
    desc: '检测训练集中数据污染、投毒与低质内容风险',
    tags: ['污染检测', '质量评测', '投毒识别'],
    color: '#7c3aed',
    bg: 'rgba(124,58,237,0.05)',
    border: 'rgba(124,58,237,0.18)',
    grad: 'from-purple-500 to-indigo-600',
    path: '/model-safety-eval',
  },
  {
    icon: Film,
    title: 'AIGC 内容安全',
    desc: '审核 AI 生成内容违规风险，精准识别深度伪造',
    tags: ['AIGC鉴伪', '违规审核', '内容安全'],
    color: '#6d28d9',
    bg: 'rgba(109,40,217,0.05)',
    border: 'rgba(109,40,217,0.18)',
    grad: 'from-indigo-500 to-violet-600',
    path: '/aigc-content',
  },
  {
    icon: Tags,
    title: 'AIGC 内容标识',
    desc: '为生成合成内容添加显式与隐式标识，并验证标准字段与元数据结构',
    tags: ['显式标识', '隐式元数据', '标准检测'],
    color: '#2563eb',
    bg: 'rgba(37,99,235,0.05)',
    border: 'rgba(37,99,235,0.18)',
    grad: 'from-blue-500 to-cyan-500',
    path: '/aigc-content-marking',
  },
];

const OUTCOMES = ['合规风险↓', '训练质量↑', '内容安全↑', '上线提速'];

export function TianyuanArch() {
  const navigate = useNavigate();

  return (
    <ScrollReveal>
      <section
        className="py-20 px-4"
        style={{ background: 'linear-gradient(180deg,#faf5ff 0%,#fff 55%)' }}
      >
        <div className="max-w-7xl mx-auto">

          {/* ── Unified Header ── */}
          <div className="flex items-start justify-between mb-10 gap-6 flex-wrap">
            <div className="max-w-xl">
              <Badge className="mb-3 bg-violet-50 text-violet-700 border-violet-200 text-xs">数据智能</Badge>
              <h2
                className="text-gray-900 mb-1"
                style={{ fontSize: '2rem', fontWeight: 900, lineHeight: 1.2 }}
              >
                AI 全链路
              </h2>
              <h2
                className="mb-3"
                style={{
                  fontSize: '2rem', fontWeight: 900, lineHeight: 1.2,
                  background: 'linear-gradient(90deg,#8b5cf6,#6d28d9)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                }}
              >
                数据治理与合规
              </h2>
              <div className="h-1 w-10 rounded-full mb-3" style={{ background: 'linear-gradient(90deg,#8b5cf6,#6d28d9)' }} />
              <p className="text-gray-500 text-sm leading-relaxed">
                从原始数据生产到训练就绪，守护数据安全、隐私合规与内容可信的全链路基础设施
              </p>
            </div>
            <div className="flex flex-col items-end gap-2.5 shrink-0">
              <Button
                style={{ background: 'linear-gradient(135deg,#8b5cf6,#6d28d9)', color: '#fff', boxShadow: '0 4px 20px rgba(139,92,246,0.3)' }}
                onClick={() => navigate('/products-overview')}
              >
                了解数据智能 <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
              <span
                className="text-xs px-3 py-1.5 rounded-full font-medium"
                style={{ background: 'rgba(139,92,246,0.1)', color: '#7c3aed', border: '1px solid rgba(139,92,246,0.2)' }}
              >
                4项产品能力
              </span>
            </div>
          </div>

          {/* ── Data-side capability cards ── */}
          <div className="grid gap-5 mb-6 md:grid-cols-2 xl:grid-cols-4">
            {CAPS.map((cap) => {
              const Icon = cap.icon;
              return (
                <div
                  key={cap.title}
                  className="rounded-2xl p-6 flex flex-col hover:-translate-y-1 transition-transform duration-300 cursor-pointer"
                  onClick={() => navigate(cap.path)}
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

          {/* ── Outcome strip ── */}
          <div
            className="rounded-2xl px-6 py-4 flex items-center gap-4 flex-wrap"
            style={{
              background: 'linear-gradient(90deg,rgba(139,92,246,0.04),rgba(109,40,217,0.04))',
              border: '1px solid rgba(139,92,246,0.15)',
            }}
          >
            <span className="text-xs font-bold text-violet-400 uppercase tracking-widest shrink-0">交付价值</span>
            <div className="flex items-center gap-2 flex-wrap">
              {OUTCOMES.map((o) => (
                <span
                  key={o}
                  className="text-[11px] px-3 py-1 rounded-full font-semibold"
                  style={{ background: '#fff', color: '#7c3aed', border: '1px solid rgba(139,92,246,0.22)' }}
                >
                  ✓ {o}
                </span>
              ))}
            </div>
          </div>

        </div>
      </section>
    </ScrollReveal>
  );
}
