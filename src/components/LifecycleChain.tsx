import React, { useState } from 'react';
import { Database, BarChart2, Shield, FileText } from 'lucide-react';

interface ChainNode {
  id: string;
  icon: React.ElementType;
  name: string;
  subtitle: string;
  annotation: string;
  color: string;
  glow: string;
  grad: string;
  desc: string;
}

const NODES: ChainNode[] = [
  {
    id: 'tianyuan',
    icon: Database,
    name: '数据智能',
    subtitle: '数据智能',
    annotation: '训练 / 知识库安全',
    color: '#a78bfa',
    glow: 'rgba(167,139,250,0.55)',
    grad: 'from-violet-500 to-purple-600',
    desc: '构建高质量、安全合规的数据基础，从源头保障 AI 模型的训练数据质量与隐私安全',
  },
  {
    id: 'tianheng',
    icon: BarChart2,
    name: '模型评测',
    subtitle: '模型评测',
    annotation: '能力 / 效果 / 可信度',
    color: '#60a5fa',
    glow: 'rgba(96,165,250,0.55)',
    grad: 'from-blue-500 to-indigo-600',
    desc: '提供大模型全维度评测，确保模型能力与安全性达标，助力 AI 模型可信、稳定地上线',
  },
  {
    id: 'tianjian',
    icon: Shield,
    name: '系统安全',
    subtitle: '系统安全',
    annotation: '上线前 / 运行时检测',
    color: '#38bdf8',
    glow: 'rgba(56,189,248,0.55)',
    grad: 'from-cyan-500 to-blue-600',
    desc: '全面检测 AI 应用代码漏洞与系统安全风险，确保 AI 产品安全可靠地完成上线交付',
  },
  {
    id: 'tianche',
    icon: FileText,
    name: '合规治理',
    subtitle: '合规治理',
    annotation: '备案 / 标准 / 教学',
    color: '#34d399',
    glow: 'rgba(52,211,153,0.55)',
    grad: 'from-emerald-500 to-teal-600',
    desc: '解读 AI 法规政策、支持大模型备案、推动标准建设，构建可持续发展的 AI 合规治理体系',
  },
];

const DEFAULT_DESC =
  '覆盖数据侧、模型侧、系统侧、服务侧四大领域，为 AI 产业提供科学、系统的全生命周期安全保障';

export function LifecycleChain() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const activeNode = NODES.find((n) => n.id === activeId);
  const displayDesc = activeNode?.desc ?? DEFAULT_DESC;

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* ── Chain row ──────────────────────────────────── */}
      <div className="flex items-stretch justify-center">
        {NODES.map((node, idx) => {
          const Icon = node.icon;
          const isActive = activeId === node.id;
          return (
            <React.Fragment key={node.id}>
              {/* Node card */}
              <div
                className="flex flex-col items-center gap-2 px-5 py-3.5 rounded-2xl cursor-default select-none transition-all duration-250"
                style={{
                  minWidth: 130,
                  background: isActive
                    ? `${node.color}28`
                    : 'rgba(255,255,255,0.06)',
                  border: `1px solid ${isActive ? node.color + '60' : 'rgba(255,255,255,0.12)'}`,
                  transform: isActive ? 'scale(1.05) translateY(-2px)' : 'scale(1)',
                  boxShadow: isActive ? `0 0 28px ${node.glow}` : 'none',
                  transition: 'all 0.22s ease',
                }}
                onMouseEnter={() => setActiveId(node.id)}
                onMouseLeave={() => setActiveId(null)}
              >
                {/* Icon */}
                <div
                  className={`w-11 h-11 rounded-xl bg-gradient-to-br ${node.grad} flex items-center justify-center`}
                  style={{
                    boxShadow: isActive ? `0 4px 20px ${node.glow}` : '0 2px 8px rgba(0,0,0,0.3)',
                  }}
                >
                  <Icon className="w-5 h-5 text-white" />
                </div>

                {/* Label */}
                <div className="text-center">
                  <div className="text-white font-bold text-sm leading-tight">{node.name}</div>
                  <div className="text-blue-200 text-xs mt-0.5">{node.subtitle}</div>
                </div>

                {/* Annotation tag */}
                <span
                  className="text-[10px] px-2.5 py-0.5 rounded-full font-medium whitespace-nowrap transition-all duration-200"
                  style={{
                    background: isActive ? `${node.color}30` : 'rgba(255,255,255,0.08)',
                    color: isActive ? node.color : 'rgba(255,255,255,0.45)',
                    border: `1px solid ${isActive ? node.color + '50' : 'rgba(255,255,255,0.1)'}`,
                  }}
                >
                  {node.annotation}
                </span>
              </div>

              {/* Arrow connector */}
              {idx < NODES.length - 1 && (
                <div className="flex items-center justify-center" style={{ width: 32, minWidth: 32 }}>
                  <div className="flex items-center w-full">
                    <div
                      className="flex-1 h-px"
                      style={{
                        background: `linear-gradient(90deg,${NODES[idx].color}90,${NODES[idx + 1].color}90)`,
                        boxShadow: `0 0 6px ${NODES[idx].color}50`,
                      }}
                    />
                    {/* Arrowhead */}
                    <svg
                      width="8"
                      height="10"
                      viewBox="0 0 8 10"
                      style={{ flexShrink: 0, marginLeft: -1 }}
                    >
                      <path
                        d="M0,1 L7,5 L0,9 Z"
                        fill={NODES[idx + 1].color}
                        opacity={0.8}
                      />
                    </svg>
                  </div>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* ── Dynamic description ─────────────────────────── */}
      <div className="mt-5 min-h-[2.5rem] flex items-center justify-center">
        <p
          key={displayDesc}
          className="text-blue-100 text-base text-center leading-relaxed transition-all duration-300 max-w-xl"
          style={{ opacity: 1, animation: 'fadeIn 0.25s ease' }}
        >
          {displayDesc}
        </p>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}
