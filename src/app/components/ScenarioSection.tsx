import React, { useState } from 'react';
import { Badge } from './ui/badge';
import { ScrollReveal } from './ScrollReveal';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { ChevronRight } from 'lucide-react';

const SCENARIOS = [
  {
    title: '网络内容安全检测',
    tagline: 'AI 生成内容实时鉴别与违规内容自动审核',
    tag: '内容安全',
    color: '#6366f1',
    imgUrl: '/scenarios-v2/content-safety.png',
    overlay: 'linear-gradient(135deg,rgba(99,102,241,0.45) 0%,rgba(67,56,202,0.6) 100%)',
    context: '适用于社交平台、内容社区、短视频平台等需要大规模内容合规治理的场景',
  },
  {
    title: '政务问答系统评测',
    tagline: '政务 AI 准确性、安全性与合规全面评估认证',
    tag: '智能政务',
    color: '#2563eb',
    imgUrl: '/scenarios-v2/government-ai.png',
    overlay: 'linear-gradient(135deg,rgba(37,99,235,0.45) 0%,rgba(29,78,216,0.6) 100%)',
    context: '覆盖智慧政务、数字政府、行政服务大厅等公共服务领域的 AI 系统认证',
  },
  {
    title: '企业知识库问答测评',
    tagline: 'RAG 系统答案质量与幻觉风险全面检测',
    tag: '企业 AI',
    color: '#0ea5e9',
    imgUrl: '/scenarios-v2/enterprise-ai.png',
    overlay: 'linear-gradient(135deg,rgba(14,165,233,0.45) 0%,rgba(2,132,199,0.6) 100%)',
    context: '适合需要落地知识库、内部助手、文档问答等场景的企业 AI 团队',
  },
  {
    title: '智能体任务测评',
    tagline: 'Agent 规划能力与工具调用全维度评估',
    tag: '智能体评测',
    color: '#8b5cf6',
    imgUrl: '/scenarios-v2/agent-evaluation.png',
    overlay: 'linear-gradient(135deg,rgba(139,92,246,0.45) 0%,rgba(109,40,217,0.6) 100%)',
    context: '面向自动化工作流、RPA 增强、多模态 Agent 系统的可信度量与能力认证',
  },
  {
    title: 'AI 应用安全测试',
    tagline: '提示词注入与越狱攻击专项安全防护检测',
    tag: '系统安全',
    color: '#06b6d4',
    imgUrl: '/scenarios-v2/system-security.png',
    overlay: 'linear-gradient(135deg,rgba(6,182,212,0.45) 0%,rgba(8,145,178,0.6) 100%)',
    context: '为面向终端用户的聊天机器人、客服 AI、代码助手等产品提供上线前安全认证',
  },
  {
    title: '大模型备案与合规评测',
    tagline: '备案全流程辅导，助力产品通过监管审查',
    tag: '合规备案',
    color: '#10b981',
    imgUrl: '/scenarios-v2/compliance-filing.png',
    overlay: 'linear-gradient(135deg,rgba(16,185,129,0.45) 0%,rgba(5,150,105,0.6) 100%)',
    context: '为生成式 AI 产品提供从材料准备、技术核验到监管申报的一站式合规服务',
  },
];

export function ScenarioSection() {
  const [activeIdx, setActiveIdx] = useState(0);
  const active = SCENARIOS[activeIdx];

  return (
    <ScrollReveal>
      <section className="py-20 px-4" style={{ background: 'linear-gradient(180deg,#f8fafc,#fff)' }}>
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <div className="text-center mb-12">
            <Badge className="mb-3 bg-amber-50 text-amber-700 border-amber-200 text-xs">典型应用场景</Badge>
            <h2 className="text-gray-900 mb-3" style={{ fontSize: '1.85rem', fontWeight: 900, lineHeight: 1.2 }}>
              覆盖 AI 安全评测全场景需求
            </h2>
            <div
              className="h-1 w-14 rounded-full mx-auto mb-3"
              style={{ background: 'linear-gradient(90deg,#f59e0b,#ef4444)' }}
            />
            <p className="text-gray-400 text-sm max-w-xl mx-auto leading-relaxed">
              从政务到企业，从内容安全到合规备案，广泛适用于多元化 AI 安全需求
            </p>
          </div>

          {/* Two-column layout */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 3fr', gap: 32, alignItems: 'stretch' }}>

            {/* Left: Scenario list */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {SCENARIOS.map((sc, idx) => {
                const isActive = activeIdx === idx;
                return (
                  <button
                    key={sc.title}
                    onMouseEnter={() => setActiveIdx(idx)}
                    onClick={() => setActiveIdx(idx)}
                    className="w-full text-left transition-all duration-200"
                    style={{
                      padding: '14px 20px',
                      borderLeft: `3px solid ${isActive ? sc.color : 'transparent'}`,
                      background: isActive ? `${sc.color}09` : 'transparent',
                      borderRadius: isActive ? '0 12px 12px 0' : '0',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      {/* Index */}
                      <span
                        style={{
                          fontSize: '0.6rem',
                          fontWeight: 900,
                          color: isActive ? sc.color : '#d1d5db',
                          letterSpacing: '0.05em',
                          minWidth: 20,
                        }}
                      >
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      {/* Tag chip */}
                      <span
                        style={{
                          fontSize: '0.62rem',
                          fontWeight: 600,
                          padding: '2px 8px',
                          borderRadius: 999,
                          background: isActive ? `${sc.color}18` : '#f1f5f9',
                          color: isActive ? sc.color : '#94a3b8',
                          border: `1px solid ${isActive ? sc.color + '30' : 'transparent'}`,
                          transition: 'all 0.2s',
                        }}
                      >
                        {sc.tag}
                      </span>
                    </div>

                    {/* Title */}
                    <div
                      style={{
                        fontSize: '0.92rem',
                        fontWeight: isActive ? 800 : 600,
                        color: isActive ? '#1e293b' : '#64748b',
                        transition: 'color 0.2s',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      {sc.title}
                      {isActive && (
                        <ChevronRight
                          style={{ width: 15, height: 15, color: sc.color, flexShrink: 0 }}
                        />
                      )}
                    </div>

                    {/* Expanded tagline */}
                    {isActive && (
                      <p
                        style={{
                          fontSize: '0.72rem',
                          color: '#94a3b8',
                          marginTop: 4,
                          lineHeight: 1.55,
                        }}
                      >
                        {sc.tagline}
                      </p>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Right: Large preview */}
            <div
              style={{
                position: 'relative',
                borderRadius: 20,
                overflow: 'hidden',
                alignSelf: 'center',
                width: '100%',
                aspectRatio: '1268 / 714',
                background: '#eef5fb',
                border: '1px solid #e2e8f0',
              }}
            >
              {/* Image */}
              <ImageWithFallback
                key={activeIdx}
                src={active.imgUrl}
                alt={active.title}
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  objectPosition: 'center',
                }}
              />
            </div>

          </div>
        </div>
      </section>
    </ScrollReveal>
  );
}
