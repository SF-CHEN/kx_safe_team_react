import React from 'react';
import { Server, AlertTriangle, BarChart2, ShieldCheck, FileText, RefreshCw } from 'lucide-react';
import { Badge } from './ui/badge';
import { ScrollReveal } from './ScrollReveal';

type FlowNode = {
  num: string;
  title: string;
  desc: string;
  chips: string[];
  icon: React.ElementType;
  color: string;
  grad: string;
};

const NODES: FlowNode[] = [
  {
    num: '01',
    title: '数据接入',
    desc: '多源数据聚合，统一接入与格式化处理',
    chips: ['多源接入', '格式标准化', '数据映射'],
    icon: Server,
    color: '#94a3b8',
    grad: 'from-slate-400 to-gray-500',
  },
  {
    num: '02',
    title: '风险识别',
    desc: 'AI内容扫描，隐私与安全风险多维评估',
    chips: ['内容鉴伪', '安全扫描', '风险标注'],
    icon: AlertTriangle,
    color: '#8b5cf6',
    grad: 'from-violet-500 to-purple-600',
  },
  {
    num: '03',
    title: '模型评测',
    desc: '全层次能力验证与 IEEE 安全认证评测',
    chips: ['能力评测', '安全评测', 'IEEE认证'],
    icon: BarChart2,
    color: '#3b82f6',
    grad: 'from-blue-500 to-indigo-600',
  },
  {
    num: '04',
    title: '应用验证',
    desc: '代码审查、渗透测试与上线前安全验收',
    chips: ['漏洞扫描', '渗透测试', '上线验收'],
    icon: ShieldCheck,
    color: '#06b6d4',
    grad: 'from-cyan-500 to-blue-600',
  },
  {
    num: '05',
    title: '合规交付',
    desc: '备案辅导与合规认证报告生成输出',
    chips: ['备案辅导', '合规报告', '标准认证'],
    icon: FileText,
    color: '#10b981',
    grad: 'from-emerald-500 to-teal-600',
  },
  {
    num: '06',
    title: '持续优化',
    desc: '周期复测追踪，驱动平台安全闭环改善',
    chips: ['周期复测', '效果监控', '闭环反馈'],
    icon: RefreshCw,
    color: '#94a3b8',
    grad: 'from-slate-400 to-gray-500',
  },
];

/* Background color that the white halo matches */
const BG = '#f4f7ff';

export function PlatformFlow() {
  return (
    <ScrollReveal>
      <section style={{ background: `linear-gradient(180deg, ${BG} 0%, #f8faff 60%, #fff 100%)`, padding: '80px 24px 96px' }}>
        <div className="max-w-6xl mx-auto">

          {/* Header */}
          <div className="text-center mb-16">
            <Badge className="mb-3 bg-blue-50 text-blue-700 border-blue-200 text-xs">平台工作链路</Badge>
            <h2 className="text-gray-900 mb-3" style={{ fontSize: '1.85rem', fontWeight: 900, lineHeight: 1.2 }}>
              从数据到合规的全链路工作流程
            </h2>
            <div
              className="h-1 w-14 rounded-full mx-auto mb-3"
              style={{ background: 'linear-gradient(90deg,#8b5cf6,#3b82f6,#06b6d4,#10b981)' }}
            />
            <p className="text-gray-400 text-sm max-w-lg mx-auto">
              六个环节环环相扣，覆盖 AI 系统安全从接入评测到合规落地的完整闭环
            </p>
          </div>

          {/* Stepper flow */}
          <div style={{ position: 'relative' }}>

            {/* Gradient connecting line — runs behind the circles */}
            <div
              style={{
                position: 'absolute',
                top: 50,
                left: '8.33%',
                right: '8.33%',
                height: 2,
                borderRadius: 2,
                background:
                  'linear-gradient(90deg,rgba(148,163,184,0.5),rgba(139,92,246,0.6),rgba(59,130,246,0.6),rgba(6,182,212,0.6),rgba(16,185,129,0.6),rgba(148,163,184,0.5))',
              }}
            />

            {/* Nodes */}
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              {NODES.map((node) => {
                const Icon = node.icon;
                return (
                  <div
                    key={node.num}
                    style={{
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                    }}
                  >
                    {/* Step number */}
                    <div
                      style={{
                        fontSize: '0.6rem',
                        fontWeight: 900,
                        color: '#cbd5e1',
                        letterSpacing: '0.06em',
                        marginBottom: 6,
                      }}
                    >
                      {node.num}
                    </div>

                    {/* Circle icon — sits on the line */}
                    <div
                      className={`w-14 h-14 rounded-full bg-gradient-to-br ${node.grad} flex items-center justify-center`}
                      style={{
                        position: 'relative',
                        zIndex: 10,
                        /* White halo to "cut" the line, colored glow beneath */
                        boxShadow: `0 6px 22px ${node.color}45, 0 0 0 5px ${BG}`,
                        flexShrink: 0,
                      }}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </div>

                    {/* Title */}
                    <div
                      style={{
                        fontSize: '0.9rem',
                        fontWeight: 800,
                        color: '#1e293b',
                        marginTop: 14,
                        marginBottom: 6,
                        textAlign: 'center',
                      }}
                    >
                      {node.title}
                    </div>

                    {/* Description */}
                    <p
                      style={{
                        fontSize: '0.67rem',
                        color: '#94a3b8',
                        lineHeight: 1.6,
                        textAlign: 'center',
                        margin: '0 6px 10px',
                      }}
                    >
                      {node.desc}
                    </p>

                    {/* Chips */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, justifyContent: 'center' }}>
                      {node.chips.map((chip) => (
                        <span
                          key={chip}
                          style={{
                            fontSize: '0.57rem',
                            padding: '2px 7px',
                            borderRadius: 999,
                            background: `${node.color}0d`,
                            color: node.color,
                            border: `1px solid ${node.color}28`,
                          }}
                        >
                          {chip}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Closed-loop return line */}
            <div style={{ position: 'relative', height: 60, marginTop: 20 }}>
              <div
                style={{
                  position: 'absolute',
                  left: '8.33%',
                  right: '8.33%',
                  top: 0,
                  bottom: 18,
                  border: '1.5px dashed rgba(99,102,241,0.22)',
                  borderTop: 'none',
                  borderRadius: '0 0 20px 20px',
                }}
              />
              {/* Up-arrow on the left — shows the return direction */}
              <svg
                style={{ position: 'absolute', left: 'calc(8.33% - 7px)', top: -10 }}
                width="14" height="18" viewBox="0 0 14 18" fill="none"
              >
                <path
                  d="M 2 16 L 7 2 L 12 16"
                  stroke="rgba(99,102,241,0.35)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {/* Center label */}
              <div
                style={{
                  position: 'absolute',
                  left: '50%',
                  bottom: 0,
                  transform: 'translate(-50%, 40%)',
                  zIndex: 2,
                }}
              >
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '5px 16px',
                    borderRadius: 999,
                    background: '#fff',
                    border: '1px solid rgba(99,102,241,0.2)',
                    boxShadow: '0 2px 12px rgba(99,102,241,0.08)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <RefreshCw size={11} style={{ color: '#6366f1' }} />
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#4f46e5' }}>
                    数据驱动闭环优化 · 全程持续改善
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </ScrollReveal>
  );
}
