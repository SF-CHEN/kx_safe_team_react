import React from 'react';
import { useParams, useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { TechHeroBg } from '../components/TechHeroBg';
import { ScrollReveal } from '../components/ScrollReveal';
import {
  ArrowRight, Database, Shield, FileText, BarChart2,
  CheckCircle2, Bell, Sparkles, Clock, ChevronRight, Mail
} from 'lucide-react';

const SERIES_DATA: Record<string, {
  name: string; subtitle: string; enName: string;
  desc: string; longDesc: string; icon: React.ElementType;
  grad: string; glow: string; color: string;
  features: string[]; roadmap: { q: string; items: string[] }[];
}> = {
  tianyuan: {
    name: '数据侧',
    subtitle: '数据安全与内容治理',
    enName: 'Data Intelligence',
    desc: '覆盖个人信息审查、模型数据评测、AIGC审核与标识追溯',
    longDesc: '数据侧产品覆盖个人敏感信息审查、模型数据安全评测、文本图像音视频内容审核与鉴伪，以及AIGC内容显隐标识、标准检测与审计追溯，为AI数据使用和内容运营提供全流程安全保障。',
    icon: Database,
    grad: 'from-violet-500 to-purple-600',
    glow: 'icon-glow-purple',
    color: '#8b5cf6',
    features: [
      '多模态智能数据标注工具，支持文本、图像、音频等多种数据类型',
      '自动化数据质量评估引擎，快速识别标注错误与数据异常',
      '基于扩散模型的合成数据生成，扩充小样本场景数据',
      'AIGC内容显式与隐式标识、标准检测及审计追溯',
      '数据分布均衡性分析，检测并修正训练数据中的偏差问题',
      '数据血缘追踪与版本管理，保障数据全链路可溯源',
    ],
    roadmap: [
      { q: '2025 Q3', items: ['基础数据标注平台上线', '文本数据质量检测功能'] },
      { q: '2025 Q4', items: ['多模态数据标注支持', '自动化质量评估引擎'] },
      { q: '2026 Q1', items: ['合成数据生成模块', '数据血缘管理系统'] },
    ],
  },
  tianheng: {
    name: '模型侧',
    subtitle: '模型可信与安全评测',
    enName: 'Model Evaluation',
    desc: '深度模型可信测评与全维度评测体系',
    longDesc: '模型评测系列产品覆盖AI大模型能力评测、安全评测与可信度综合评估，包括已正式发布的大模型评测平台，以及深度模型可信测评、具身智能可信评测等前沿方向。',
    icon: BarChart2,
    grad: 'from-blue-500 to-indigo-600',
    glow: 'icon-glow-blue',
    color: '#3b82f6',
    features: [
      '大模型综合能力评测，覆盖生成、理解、推理、知识等六大维度（已上线）',
      '大模型安全风险评测，涵盖有害内容、隐私、偏见、鲁棒性等10+安全维度（已上线）',
      '智能体（Agent）行为安全分析与多轮对话安全评测（已上线）',
      '深度模型可信测评，对模型全面可信度进行综合量化评估（研发中）',
      '具身智能可信评测，针对物理世界交互场景的安全性评测（研发中）',
    ],
    roadmap: [
      { q: '已正式上线', items: ['大模型评测平台', '大模型安全评测', '智能体安全评测', '训练集/测试集评测'] },
      { q: '2025 Q4', items: ['深度模型可信测评系统', '多模态模型评测扩展'] },
      { q: '2026 Q2', items: ['具身智能可信评测平台', '跨场景自适应评测引擎'] },
    ],
  },
  tianjian: {
    name: '系统侧',
    subtitle: '代码与网络安全',
    enName: 'System Security',
    desc: 'AI 应用上线与交付质量服务，保障系统可上线、可验收、质量可控',
    longDesc: '系统安全系列聚焦 AI 应用代码审查、网络安全测试与系统上线验证，为 AI 产品上线提供代码质量、漏洞防控、系统安全的全链路检测服务。',
    icon: Shield,
    grad: 'from-cyan-500 to-blue-600',
    glow: 'icon-glow-cyan',
    color: '#06b6d4',
    features: [
      '代码与漏洞审查系统，识别代码缺陷、依赖风险与配置问题（研发中）',
      '网络与应用安全测试，覆盖漏洞扫描、渗透测试与接口安全（研发中）',
      'AI 系统上线测试，功能/效果/权限/异常场景全覆盖（研发中）',
    ],
    roadmap: [
      { q: '2025 Q4', items: ['代码与漏洞审查系统', '网络安全测试平台'] },
      { q: '2026 Q2', items: ['AI 系统上线测试套件', '持续安全监测能力'] },
      { q: '2026 Q4', items: ['智能化安全修复建议', '全链路安全运营平台'] },
    ],
  },
  tianxun: {
    name: '系统侧',
    subtitle: '代码与网络安全',
    enName: 'System Security',
    desc: '面向 AI 应用全链路的安全检测、风险监控与漏洞响应平台',
    longDesc: '系统安全系列产品聚焦 AI 系统层安全，提供从上线前的安全扫描到运行时的实时监控、攻击响应的全链路安全防护能力，帮助企业快速发现和修复 AI 系统安全漏洞。',
    icon: Shield,
    grad: 'from-cyan-500 to-blue-600',
    glow: 'icon-glow-cyan',
    color: '#06b6d4',
    features: [
      'AI 应用深度漏洞扫描，覆盖提示注入、数据泄露、模型反转等主要攻击类型',
      '实时风险感知与预警，毫秒级异常行为检测与告警推送',
      '攻击溯源与取证分析，帮助安全团队快速定位攻击路径',
      '智能安全加固建议，结合漏洞类型提供针对性修复方案',
      '多云与本地混合部署支持，灵活适配企业安全架构',
    ],
    roadmap: [
      { q: '2025 Q4', items: ['系统安全扫描引擎发布', '基础漏洞检测能力'] },
      { q: '2026 Q1', items: ['实时风险监控面板', '异常行为告警系统'] },
      { q: '2026 Q2', items: ['攻击溯源分析工具', '安全加固建议引擎'] },
    ],
  },
  tianche: {
    name: '合规治理侧',
    subtitle: '备案、标准与安全教育',
    enName: 'Compliance Governance',
    desc: '深度解读 AI 法规政策，提供大模型备案合规全流程咨询服务',
    longDesc: '合规治理系列产品面向 AI 合规治理场景，整合国内外 AI 法律法规资源，提供大模型备案全流程辅助、政策解读、合规差距分析等服务，帮助企业高效完成 AI 产品的合规落地。',
    icon: FileText,
    grad: 'from-emerald-500 to-teal-600',
    glow: 'icon-glow-emerald',
    color: '#10b981',
    features: [
      '大模型备案全流程数字化辅助，自动生成所需材料清单与模板',
      '国内外 AI 法规实时追踪，政策变化自动推送',
      '合规差距智能分析，识别产品与监管要求之间的差距',
      '定制化合规解决方案，结合企业实际情况提供具体建议',
      '合规报告自动生成，支持监管机构所需报告格式',
    ],
    roadmap: [
      { q: '2026 Q1', items: ['备案材料辅助系统', '政策法规数据库'] },
      { q: '2026 Q2', items: ['合规差距分析引擎', '自动化报告生成'] },
      { q: '2026 Q3', items: ['定制化合规方案服务', '监管对接集成'] },
    ],
  },
};

export function ProductSeries() {
  const { seriesId } = useParams<{ seriesId: string }>();
  const navigate = useNavigate();
  const series = SERIES_DATA[seriesId || ''];

  if (!series) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800">产品系列不存在</h2>
        <Button onClick={() => navigate('/')}>返回首页</Button>
      </div>
    );
  }

  const Icon = series.icon;

  return (
    <div className="min-h-screen bg-white">

      {/* Hero */}
      <section className="relative text-white overflow-hidden" style={{ paddingTop: '5rem', paddingBottom: '4rem' }}>
        <TechHeroBg />
        <div className="max-w-5xl mx-auto px-4 relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${series.grad} flex items-center justify-center ${series.glow}`}>
              <Icon className="w-7 h-7 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-white font-black text-2xl">{series.name}</span>
                <span className="text-blue-300 text-sm">·</span>
                <span className="text-blue-300 text-sm">{series.subtitle}</span>
              </div>
              <p className="text-blue-300 text-xs font-mono tracking-wide">{series.enName}</p>
            </div>
          </div>

          <div
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs mb-5"
            style={{ background: `${series.color}20`, border: `1px solid ${series.color}40`, color: series.color }}
          >
            <Clock className="w-3 h-3" />
            即将上线 · 敬请期待
          </div>

          <h1 className="text-white mb-4" style={{ fontSize: '3rem', fontWeight: 900, lineHeight: 1.15 }}>
            {series.desc}
          </h1>
          <p className="text-blue-100 text-base max-w-2xl leading-relaxed">
            {series.longDesc}
          </p>
        </div>
      </section>

      {/* Features */}
      <ScrollReveal>
        <section className="py-20 px-4" style={{ background: 'linear-gradient(135deg,#f8fafc,#f0f9ff)' }}>
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <Badge className="mb-4 text-xs" style={{ background: `${series.color}15`, color: series.color, border: `1px solid ${series.color}30` }}>
                核心能力
              </Badge>
              <h2 className="text-gray-900 mb-3" style={{ fontSize: '2rem', fontWeight: 900 }}>产品核心功能</h2>
              <div className="h-1 w-14 rounded-full mx-auto" style={{ background: `linear-gradient(90deg,${series.color},${series.color}aa)` }} />
            </div>
            <div className="space-y-4">
              {series.features.map((f, i) => (
                <div
                  key={i}
                  className="glass-glow rounded-2xl p-5 flex items-start gap-4"
                >
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: `${series.color}15` }}
                  >
                    <CheckCircle2 className="w-4 h-4" style={{ color: series.color }} />
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed pt-1">{f}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Roadmap */}
      <ScrollReveal>
        <section className="bg-white py-20 px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-slate-50 text-slate-600 border-slate-200 text-xs">产品路线图</Badge>
              <h2 className="text-gray-900 mb-3" style={{ fontSize: '2rem', fontWeight: 900 }}>上线计划</h2>
              <div className="h-1 w-14 rounded-full mx-auto" style={{ background: 'linear-gradient(90deg,#64748b,#94a3b8)' }} />
            </div>

            <div className="grid grid-cols-3 gap-6">
              {series.roadmap.map((phase, i) => (
                <div
                  key={phase.q}
                  className="glass-glow rounded-2xl p-6"
                  style={{
                    opacity: i === 0 ? 1 : i === 1 ? 0.7 : 0.5,
                  }}
                >
                  <div
                    className="inline-block text-xs font-bold px-3 py-1 rounded-full mb-4"
                    style={{ background: `${series.color}15`, color: series.color }}
                  >
                    {phase.q}
                  </div>
                  <ul className="space-y-2.5">
                    {phase.items.map((item) => (
                      <li key={item} className="flex items-center gap-2 text-sm text-gray-600">
                        <ChevronRight className="w-3.5 h-3.5 shrink-0" style={{ color: series.color }} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Notify CTA */}
      <ScrollReveal>
        <section
          className="py-20 px-4 text-center"
          style={{ background: 'linear-gradient(135deg,#0a1628,#0f2240)' }}
        >
          <div className="max-w-2xl mx-auto">
            <div
              className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-6"
              style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-cyan-300 text-xs font-medium">{series.name} · {series.subtitle}</span>
            </div>
            <h2 className="text-white mb-3" style={{ fontSize: '2rem', fontWeight: 900 }}>
              产品即将发布
            </h2>
            <p className="text-blue-300 text-sm mb-8 leading-relaxed">
              目前我们的<strong className="text-white">大模型评测平台</strong>已正式上线，
              您可以立即体验大模型评测全系列功能
            </p>
            <div className="flex gap-3 justify-center flex-wrap">
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-500 text-white px-8"
                onClick={() => navigate('/llm-evaluation')}
              >
                <BarChart2 className="w-4 h-4 mr-2" />体验模型评测平台
              </Button>
              <Button
                size="lg"
                className="text-white px-8"
                style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.3)' }}
                onClick={() => navigate('/')}
              >
                返回首页
              </Button>
            </div>
          </div>
        </section>
      </ScrollReveal>
    </div>
  );
}
