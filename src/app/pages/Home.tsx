import React from 'react';
import { Link, useNavigate } from 'react-router';
import { useUser } from '../context/UserContext';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { TechHeroBg } from '../components/TechHeroBg';
import { ScrollReveal } from '../components/ScrollReveal';
import {
  Shield, Zap, BarChart2, ArrowRight, ChevronRight,
  Globe, FileText, Upload, Settings, Play, Download, Database,
  Layers, CheckCircle2, ArrowUpRight,
  Mail, Phone, MapPin, Github, Twitter, Linkedin, Sparkles, Lock, Brain
} from 'lucide-react';
import {
  RadarChart, PolarGrid, PolarAngleAxis,
  Radar, ResponsiveContainer, Legend, Tooltip
} from 'recharts';

interface Partner {
  abbr: string;
  fullName: string;
  enName: string;
  color: string;
  fontClass: string;
  isRect?: boolean;
}

const STATS = [
  { value: '20+', label: '测评方法' },
  { value: '600+', label: '测评数据集' },
  { value: '100万+', label: '累计测评次数' },
  { value: '400+', label: '测评基准' },
  { value: '4,000+', label: '累计查看人数' },
];

const LEADERBOARD_PREVIEW = [
  { rank: 1, name: 'ChatGLM4-9B', org: '智谱AI', score: 65.46 },
  { rank: 2, name: 'LLaMA-2-13B-Chat', org: 'Meta', score: 64.29 },
  { rank: 3, name: 'Qwen2.5-7B-Instruct', org: '阿里巴巴', score: 64.14 },
  { rank: 4, name: 'ChatGPT-3.5-turbo', org: 'OpenAI', score: 63.66 },
  { rank: 5, name: 'DeepSeek V3', org: '深度求索', score: 62.49 },
];

const RADAR_DATA = [
  { subject: '安全性', ChatGLM4: 60, LLaMA2: 57, Qwen25: 63, fullMark: 100 },
  { subject: '隐私保护', ChatGLM4: 71, LLaMA2: 52, Qwen25: 65, fullMark: 100 },
  { subject: '鲁棒性', ChatGLM4: 64, LLaMA2: 67, Qwen25: 69, fullMark: 100 },
  { subject: '偏见检测', ChatGLM4: 88, LLaMA2: 85, Qwen25: 90, fullMark: 100 },
  { subject: '内容合规', ChatGLM4: 70, LLaMA2: 80, Qwen25: 66, fullMark: 100 },
];

const FEATURES = [
  { icon: Shield, title: '多维安全评测', desc: '覆盖有害内容、虚构引用、隐私安全、偏见歧视等10+安全维度', grad: 'from-blue-500 to-indigo-600', glow: 'icon-glow-blue' },
  { icon: Zap, title: '高效评测引擎', desc: '基于分布式计算架构，分钟级完成千条数据评测', grad: 'from-cyan-500 to-blue-600', glow: 'icon-glow-cyan' },
  { icon: BarChart2, title: '深度报告分析', desc: '提供错误归因分析、改进建议和可视化评测报告', grad: 'from-violet-500 to-purple-600', glow: 'icon-glow-purple' },
  { icon: Globe, title: '备案合规支持', desc: '专业备案指导，提供政策解读、材料清单', grad: 'from-emerald-500 to-cyan-600', glow: 'icon-glow-emerald' },
];

const PLATFORMS = ['OpenAI', 'Anthropic', '智谱AI', '百度文心', '阿里通义', '深度求索', 'Meta', 'Google'];

const EVAL_STEPS = [
  { icon: FileText, title: '选择模型', desc: '选择评测模型', grad: 'from-blue-500 to-indigo-600', glow: 'icon-glow-blue' },
  { icon: Upload, title: '上传数据', desc: '上传测试数据集', grad: 'from-indigo-500 to-violet-600', glow: 'icon-glow-violet' },
  { icon: Settings, title: '配置参数', desc: '设置评测维度', grad: 'from-violet-500 to-purple-600', glow: 'icon-glow-purple' },
  { icon: Play, title: '启动评测', desc: '开始评测任务', grad: 'from-purple-500 to-fuchsia-500', glow: 'icon-glow-purple' },
  { icon: BarChart2, title: '查看报告', desc: '分析评测结果', grad: 'from-cyan-500 to-blue-600', glow: 'icon-glow-cyan' },
  { icon: Download, title: '导出结果', desc: '下载评测报告', grad: 'from-blue-500 to-cyan-500', glow: 'icon-glow-cyan' },
];

const PARTNERS_ROW1: Partner[] = [
  { abbr: '南', fullName: '南开大学', enName: 'NANKAI UNIVERSITY', color: '#5E1D1D', fontClass: 'font-art-xiaowei' },
  { abbr: '传', fullName: '中国传媒大学', enName: 'COMMUNICATION UNIV. OF CHINA', color: '#003087', fontClass: 'font-art-mashan' },
  { abbr: '北', fullName: '北京大学', enName: 'PEKING UNIVERSITY', color: '#8B0000', fontClass: 'font-art-zhimang' },
  { abbr: '师', fullName: '北京师范大学', enName: 'BEIJING NORMAL UNIVERSITY', color: '#1F3C88', fontClass: 'font-art-xiaowei' },
  { abbr: '邮', fullName: '北京邮电大学', enName: 'BUPT', color: '#1060A8', fontClass: 'font-art-huangyou' },
  { abbr: '航', fullName: '北京航空航天大学', enName: 'BEIHANG UNIVERSITY', color: '#1A3A6B', fontClass: 'font-art-mashan' },
  { abbr: '工', fullName: '哈尔滨工业大学', enName: 'HARBIN INST. OF TECH.', color: '#8B6914', fontClass: 'font-art-xiaowei' },
  { abbr: '复', fullName: '复旦大学', enName: 'FUDAN UNIVERSITY', color: '#003366', fontClass: 'font-art-zhimang' },
  { abbr: '交', fullName: '上海交通大学', enName: 'SJTU', color: '#8B0000', fontClass: 'font-art-huangyou' },
];

const PARTNERS_ROW2: Partner[] = [
  { abbr: 'CT', fullName: '中国信通院', enName: 'CAICT', color: '#0068B7', fontClass: 'font-art-xiaowei', isRect: true },
  { abbr: '闽', fullName: '闽江学院', enName: 'MINJIANG UNIVERSITY', color: '#2E6BBF', fontClass: 'font-art-mashan' },
  { abbr: '海', fullName: '海淀教育', enName: 'HAIDIAN EDUCATION', color: '#00785A', fontClass: 'font-art-zhimang' },
  { abbr: '中', fullName: '中国科学院', enName: 'CHINESE ACAD. OF SCIENCES', color: '#C0392B', fontClass: 'font-art-xiaowei', isRect: true },
  { abbr: '浙', fullName: '浙江大学', enName: 'ZHEJIANG UNIVERSITY', color: '#003087', fontClass: 'font-art-huangyou' },
  { abbr: '东', fullName: '东北大学', enName: 'NORTHEASTERN UNIVERSITY', color: '#003594', fontClass: 'font-art-mashan' },
  { abbr: '电', fullName: '中国电子技术标准化研究院', enName: 'CESI', color: '#004B8D', fontClass: 'font-art-xiaowei', isRect: true },
  { abbr: '教', fullName: '海淀教师进修学校', enName: 'HAIDIAN TEACHERS TRAINING', color: '#5D6D00', fontClass: 'font-art-zhimang' },
  { abbr: '清', fullName: '清华大学', enName: 'TSINGHUA UNIVERSITY', color: '#660000', fontClass: 'font-art-huangyou' },
];

const STANDARDS = [
  { code: 'IEEE 3376', title: 'Recommended Practice for Evaluating Artificial Intelligence Generated Content', type: 'IEEE 国际标准', typeColor: 'blue', year: '2024' },
  { code: 'IEEE 3378', title: 'Standard for Framework and Process for Large-Scale Deep Learning Model Evaluation', type: 'IEEE 国际标准', typeColor: 'blue', year: '2024' },
  { code: 'GB/T 45288.1-2025', title: '《人工智能 大模型 第1部分：通用要求》', type: '国家标准', typeColor: 'red', year: '2025' },
  { code: 'GB/T 45288.2-2025', title: '《人工智能 大模型 第2部分：评测指标与方法》', type: '国家标准', typeColor: 'red', year: '2025' },
  { code: '', title: '《大模型交互体验评测方法》', type: '上海市人工智能行业协会团体标准', typeColor: 'orange', year: '2024' },
  { code: '', title: '《视频大模型评测指标与方法》', type: '上海市人工智能行业协会团体标准', typeColor: 'orange', year: '2024' },
];

const typeColorMap: Record<string, string> = {
  blue: 'bg-blue-50 text-blue-700 border-blue-200',
  red: 'bg-red-50 text-red-700 border-red-200',
  orange: 'bg-orange-50 text-orange-700 border-orange-200',
};

function PartnerCard({ partner }: { partner: Partner }) {
  return (
    <div className="partner-item glass-glow rounded-2xl p-5 flex flex-col items-center gap-3 cursor-default min-h-[130px] justify-center">
      <div
        className={`${partner.isRect ? 'rounded-xl w-14 h-10' : 'rounded-full w-12 h-12'} flex items-center justify-center shrink-0 shadow-md`}
        style={{ backgroundColor: partner.color }}
      >
        <span className="text-white font-bold text-base leading-none">{partner.abbr}</span>
      </div>
      <div className="text-center">
        <div className={`text-sm text-gray-800 leading-tight ${partner.fontClass}`}>{partner.fullName}</div>
        <div className="text-[9px] text-gray-400 mt-0.5 tracking-wider uppercase">{partner.enName}</div>
      </div>
    </div>
  );
}

function SectionTitle({ title, subtitle, align = 'center' }: { title: string; subtitle?: string; align?: 'center' | 'left' }) {
  const isCenter = align === 'center';
  return (
    <div className={`mb-10 ${isCenter ? 'text-center' : ''}`}>
      <h2 style={{ fontSize: '2rem', fontWeight: 800, lineHeight: 1.2 }} className="text-gray-800 mb-3">{title}</h2>
      <div className={`h-1 w-14 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 ${isCenter ? 'mx-auto' : ''}`} />
      {subtitle && <p className={`text-gray-500 text-sm mt-4 leading-relaxed ${isCenter ? 'max-w-2xl mx-auto' : 'max-w-lg'}`}>{subtitle}</p>}
    </div>
  );
}

export function Home() {
  const navigate = useNavigate();
  const { isGuest } = useUser();

  const FOOTER_PRODUCTS = [
    { label: '大模型评测', path: '/llm-evaluation' },
    { label: '大模型安全评测', path: '/safety-evaluation' },
    { label: '智能体安全评测', path: '/agent-safety' },
    { label: '训练集评测', path: '/training-eval' },
    { label: '测试集生成', path: '/testset-generation' },
    { label: '排行榜', path: '/leaderboard' },
  ];

  const FOOTER_RESOURCES = [
    { label: '评测介绍', path: '/evaluation-intro' },
    { label: '资源中心', path: '/resource-center' },
    { label: 'API 文档', path: '#' },
    { label: '使用指南', path: '#' },
    { label: '常见问题', path: '#' },
  ];

  return (
    <div className="min-h-screen bg-white">

      {/* ═══ 1. Hero ═══ */}
      <section className="relative text-white py-20 px-4 overflow-hidden">
        <TechHeroBg />
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <Badge className="mb-5 bg-white/20 text-white border-white/30 text-xs px-4 py-1.5">
            算法为尺 · 安全为绳 · 引领智能安全新时代
          </Badge>
          <h1 className="text-5xl font-bold mb-5 leading-tight">AISafePro-LM AI测评</h1>
          <p className="text-blue-100 text-base mb-8 max-w-2xl mx-auto leading-relaxed">
            国内领先的大模型安全评测平台，依托顶级实验室与高校技术资源，为AI安全保驾护航
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50 font-medium shadow-xl shadow-white/20" onClick={() => navigate('/safety-evaluation')}>
              <Shield className="w-4 h-4 mr-2" />开始安全评测
            </Button>
            <Button size="lg" variant="outline" className="border-white/40 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 flex items-center relative z-10" onClick={() => navigate('/leaderboard')}>
              <span className="font-medium">查看排行榜</span>
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
          {isGuest && (
            <p className="mt-4 text-blue-200 text-sm">
              您正在以游客身份浏览 ·{' '}
              <button className="underline" onClick={() => navigate('/login')}>登录</button>
              {' '}或{' '}
              <button className="underline" onClick={() => navigate('/register')}>注册</button>
              {' '}以使用完整功能
            </p>
          )}
        </div>
        <div className="max-w-5xl mx-auto mt-12 grid grid-cols-5 gap-4 relative z-10">
          {STATS.map(stat => (
            <div key={stat.label} className="text-center glass-dark rounded-xl p-4">
              <div className="text-2xl font-bold mb-1">{stat.value}</div>
              <div className="text-blue-200 text-[11px]">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ 2. Leaderboard + Radar Chart ═══ */}
      <ScrollReveal>
        <section className="bg-white py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-3 gap-10">
              <div className="col-span-2">
                <div className="flex items-end justify-between mb-6">
                  <div>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }} className="text-gray-800 mb-2">模型排行榜</h2>
                    <div className="h-1 w-12 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400" />
                  </div>
                  <button className="text-sm text-blue-600 font-medium flex items-center gap-1 hover:underline" onClick={() => navigate('/leaderboard')}>
                    查看完整榜单 <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
                <div className="glass-glow rounded-2xl overflow-hidden">
                  <div className="grid grid-cols-5 px-6 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100 text-xs font-medium text-gray-600">
                    <span>排名</span><span className="col-span-2">模型名称</span><span>来源</span><span className="text-right">总分</span>
                  </div>
                  {LEADERBOARD_PREVIEW.map(item => (
                    <div key={item.rank} className="grid grid-cols-5 px-6 py-4 items-center border-b border-gray-100 last:border-0 hover:bg-blue-50/40 cursor-pointer transition-colors">
                      <span className={`font-bold text-base ${item.rank <= 3 ? 'text-blue-600' : 'text-gray-500'}`}>{item.rank}</span>
                      <span className="col-span-2 text-sm font-semibold text-gray-800">{item.name}</span>
                      <span className="text-xs text-gray-500">{item.org}</span>
                      <span className="text-right font-bold text-blue-600">{item.score}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-5 flex gap-3">
                  <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => navigate('/leaderboard')}>查看完整排行榜</Button>
                  <Button variant="outline" onClick={() => navigate('/safety-evaluation')}>参与评测</Button>
                </div>
              </div>

              <div className="flex flex-col">
                <div className="mb-4">
                  <div className="text-sm font-semibold text-gray-700 mb-1">多维能力对比</div>
                  <div className="h-0.5 w-8 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400" />
                </div>
                <div className="glass-glow rounded-2xl p-4 flex-1 flex flex-col">
                  <div className="flex-1 min-h-[240px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={RADAR_DATA} margin={{ top: 8, right: 16, bottom: 8, left: 16 }}>
                        <PolarGrid stroke="#e2e8f0" />
                        <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: '#64748b' }} />
                        <Radar name="ChatGLM4" dataKey="ChatGLM4" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.18} strokeWidth={2} />
                        <Radar name="LLaMA-2" dataKey="LLaMA2" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.14} strokeWidth={2} />
                        <Radar name="Qwen2.5" dataKey="Qwen25" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.14} strokeWidth={2} />
                        <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e2e8f0' }} />
                        <Legend iconSize={8} wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                  <p className="text-[11px] text-gray-400 text-center mt-2">Top 3 模型安全能力雷达对比</p>
                </div>
                <div className="mt-4 space-y-2">
                  {FEATURES.slice(0, 3).map(f => {
                    const Icon = f.icon;
                    return (
                      <div key={f.title} className="glass-glow rounded-xl p-3 flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${f.grad} flex items-center justify-center shrink-0 ${f.glow}`}>
                          <Icon className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-gray-800">{f.title}</div>
                          <div className="text-[10px] text-gray-500 leading-snug">{f.desc}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* ═══ 3. Platform Integration ═══ */}
      <ScrollReveal>
        <section className="relative bg-gradient-to-br from-blue-50 to-indigo-50 py-16 px-4 overflow-hidden">
          <div className="absolute inset-0 bg-dot-grid" />
          <div className="relative max-w-7xl mx-auto text-center">
            <SectionTitle title="平台集成 30+ 种模型，同场竞技" subtitle="支持主流开源与闭源大模型，一键接入即可开始评测" />
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {PLATFORMS.map(p => (
                <span key={p} className="px-5 py-2 glass-glow rounded-full text-sm text-gray-700 cursor-default">{p}</span>
              ))}
            </div>
            <div className="flex gap-3 justify-center">
              <Button className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200" onClick={() => navigate('/llm-evaluation')}>
                <BarChart2 className="w-4 h-4 mr-2" />开始评测
              </Button>
              <Button variant="outline" className="border-blue-200 hover:border-blue-400 bg-white" onClick={() => navigate('/safety-evaluation')}>
                了解安全评测
              </Button>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* ═══ 4. Evaluation Process — Frameless ═══ */}
      <ScrollReveal>
        <section className="bg-slate-50 py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <SectionTitle title="评测流程" subtitle="六步完成专业评测，全程自动化处理，分钟级产出报告" />
            <div className="grid grid-cols-6 gap-4 relative">
              {EVAL_STEPS.map((step, index) => {
                const Icon = step.icon;
                return (
                  <div key={step.title} className="relative flex flex-col items-center text-center">
                    {index < EVAL_STEPS.length - 1 && (
                      <div className="absolute left-[62%] top-10 w-[76%] flex items-center z-0 pointer-events-none">
                        <div className="flex-1 h-px bg-gradient-to-r from-blue-300 to-indigo-300" />
                        <div className="w-0 h-0 border-t-[3px] border-t-transparent border-b-[3px] border-b-transparent border-l-[5px] border-l-indigo-300" />
                      </div>
                    )}
                    <div className="text-[10px] font-semibold text-indigo-400 tracking-widest mb-2 uppercase">Step {index + 1}</div>
                    <div className={`relative w-20 h-20 rounded-2xl bg-gradient-to-br ${step.grad} flex items-center justify-center ${step.glow} z-10 mb-4 transition-transform duration-200 hover:-translate-y-1`}>
                      <Icon className="w-9 h-9 text-white" />
                    </div>
                    <div className="font-semibold text-gray-800 text-sm mb-1">{step.title}</div>
                    <div className="text-xs text-gray-500 leading-snug">{step.desc}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* ═══ 5. Training & TestSet ═══ */}
      <ScrollReveal>
        <section className="relative bg-gradient-to-br from-indigo-50 to-blue-50 py-16 px-4 overflow-hidden">
          <div className="absolute inset-0 bg-dot-grid" />
          <div className="relative max-w-7xl mx-auto">
            <SectionTitle title="数据集评测与生成" subtitle="从训练数据质控到测试集智能构造，打通数据全链路评测能力" />
            <div className="grid grid-cols-2 gap-8">
              <div className="glass-glow rounded-2xl p-8">
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center icon-glow-violet">
                    <Database className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 text-xl">训练集评测</h3>
                    <span className="text-xs text-violet-600 font-medium">Data Quality Audit</span>
                  </div>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-5">
                  针对模型训练数据集进行全面质量评估，检测数据偏差、标注错误和分布问题，确保训练数据的质量和代表性。
                </p>
                <div className="space-y-2 mb-6">
                  {['数据质量分析', '标注一致性检测', '分布均衡性评估', '异常样本识别'].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />{item}
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full border-violet-200 text-violet-600 hover:bg-violet-50 hover:border-violet-300" onClick={() => navigate('/training-eval')}>
                  了解训练集评测 <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>

              <div className="glass-glow rounded-2xl p-8">
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center icon-glow-cyan">
                    <Layers className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 text-xl">测试集生成</h3>
                    <span className="text-xs text-cyan-600 font-medium">Testset Generation</span>
                  </div>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-5">
                  智能生成高质量测试数据集，覆盖多种场景和边界情况，帮助您全面评估模型性能和鲁棒性。
                </p>
                <div className="space-y-2 mb-6">
                  {['多场景覆盖', '边界用例生成', '对抗样本构造', '自动化数据增强'].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />{item}
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full border-cyan-200 text-cyan-600 hover:bg-cyan-50 hover:border-cyan-300" onClick={() => navigate('/testset-generation')}>
                  了解测试集生成 <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* ═══ 6. Standards ═══ */}
      <ScrollReveal>
        <section className="relative bg-gradient-to-br from-blue-50 to-indigo-50 py-20 px-4 overflow-hidden">
          <div className="absolute inset-0 bg-dot-grid" />
          <div className="relative max-w-7xl mx-auto">
            <div className="grid grid-cols-5 gap-12 items-start">
              <div className="col-span-2">
                <Badge className="mb-4 bg-blue-100 text-blue-700 border-blue-200 text-xs">标准参与制定</Badge>
                <h2 style={{ fontSize: '2.25rem', fontWeight: 800, lineHeight: 1.2 }} className="text-gray-900 mb-3">评测标准</h2>
                <div className="h-1 w-14 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 mb-6" />
                <p className="text-gray-600 text-sm leading-relaxed mb-8">
                  AISafePro-LM 积极参与国际国内大模型评测标准的制定工作，依托权威标准体系，为评测结果提供科学可信的依据。
                </p>
                <div className="flex flex-col gap-3 mb-10">
                  <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-blue-500" /><span className="text-sm text-gray-700">IEEE 国际标准</span></div>
                  <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-red-500" /><span className="text-sm text-gray-700">国家标准</span></div>
                  <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-orange-500" /><span className="text-sm text-gray-700">行业团体标准</span></div>
                </div>
                <div className="grid grid-cols-3 gap-3 mb-8">
                  {[
                    { n: '2', label: 'IEEE 标准', color: 'text-blue-600', border: 'border-blue-100' },
                    { n: '2', label: '国家标准', color: 'text-red-500', border: 'border-red-100' },
                    { n: '2', label: '团体标准', color: 'text-orange-500', border: 'border-orange-100' },
                  ].map(s => (
                    <div key={s.label} className={`glass-glow rounded-xl p-4 border ${s.border} text-center`}>
                      <div className={`text-2xl font-bold ${s.color}`}>{s.n}</div>
                      <div className="text-xs text-gray-500 mt-1">{s.label}</div>
                    </div>
                  ))}
                </div>
                <div className="flex flex-col gap-2.5">
                  <Button className="bg-blue-600 hover:bg-blue-700 w-full justify-center shadow-lg shadow-blue-200" onClick={() => navigate('/safety-evaluation')}>
                    <Shield className="w-4 h-4 mr-1.5" />了解合规评测
                  </Button>
                  <Button variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50 w-full justify-center" onClick={() => navigate('/evaluation-intro')}>
                    <FileText className="w-4 h-4 mr-1.5" />查看备案中心
                  </Button>
                </div>
              </div>

              <div className="col-span-3">
                <div className="space-y-0">
                  {STANDARDS.map((std, index) => (
                    <div key={index} className="group flex items-start justify-between py-6 border-b border-blue-100 last:border-0 hover:bg-white/70 hover:-mx-4 hover:px-4 rounded-xl transition-all cursor-pointer">
                      <div className="flex-1 pr-8">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          {std.code && <span className="text-gray-500 text-xs font-mono bg-gray-100 px-2 py-0.5 rounded">{std.code}</span>}
                          <span className={`text-xs px-2.5 py-0.5 rounded-full border font-medium ${typeColorMap[std.typeColor]}`}>{std.type}</span>
                        </div>
                        <div className="text-gray-800 font-bold leading-snug group-hover:text-blue-700 transition-colors">{std.title}</div>
                        <div className="text-xs text-gray-400 mt-1">{std.year}年</div>
                      </div>
                      <div className="shrink-0 pt-1"><ArrowUpRight className="w-5 h-5 text-gray-300 group-hover:text-blue-500 transition-colors" /></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* ═══ 7. CTA — Dark Glass (simplified: 2 buttons only) ═══ */}
      <ScrollReveal>
        <section className="relative bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900 py-24 px-4 text-center overflow-hidden">
          <div className="absolute inset-0 bg-dot-grid-dark" />
          <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-blue-600/15 blur-3xl pointer-events-none" />
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full bg-indigo-600/15 blur-3xl pointer-events-none" />
          <div className="relative max-w-5xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-6">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-cyan-300 text-xs font-medium">全流程风险管控</span>
            </div>
            <h2 style={{ fontSize: '2.75rem', fontWeight: 800, lineHeight: 1.2 }} className="text-white mb-4">一站式测评大模型风险</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full mx-auto mb-6" />
            <p className="text-blue-300 mb-10 max-w-xl mx-auto leading-relaxed text-sm">
              从安全评测到备案合规，AISafePro-LM 为您提供全流程的大模型安全保障服务
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg" className="bg-blue-500 hover:bg-blue-400 text-white shadow-xl shadow-blue-500/30 border border-blue-400/30" onClick={() => navigate(isGuest ? '/register' : '/safety-evaluation')}>
                {isGuest ? '免费注册开始' : '立即开始评测'}
              </Button>
              <Button size="lg" className="bg-white/15 hover:bg-white/25 text-white border border-white/60 hover:border-white/80 shadow-lg backdrop-blur-sm" onClick={() => navigate('/leaderboard')}>
                查看排行榜
              </Button>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* ═══ 8. Partners — 位于 CTA 下方、页脚上方 ═══ */}
      <ScrollReveal>
        <section className="bg-white py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <SectionTitle title="合作团队" subtitle="携手顶尖高校与科研机构，共筑 AI 安全生态" />
            <div className="relative overflow-hidden">
              <div className="partner-carousel mb-0">
                <div className="partner-track">
                  {[...PARTNERS_ROW1, ...PARTNERS_ROW1].map((partner, index) => (
                    <PartnerCard key={`r1-${index}`} partner={partner} />
                  ))}
                </div>
              </div>
              <div className="partner-carousel">
                <div className="partner-track-reverse">
                  {[...PARTNERS_ROW2, ...PARTNERS_ROW2].map((partner, index) => (
                    <PartnerCard key={`r2-${index}`} partner={partner} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* ═══ 9. Rich Footer ═══ */}
      <footer className="bg-gradient-to-br from-slate-700 to-blue-800 text-blue-100">
        <div className="max-w-[1400px] mx-auto px-6 pt-14 pb-8">
          <div className="grid grid-cols-4 gap-10 mb-12">
            <div className="col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-9 h-9 rounded-lg bg-blue-400/30 border border-blue-400/30 flex items-center justify-center">
                  <span className="text-white text-sm font-bold">AI</span>
                </div>
                <span className="text-white font-bold text-lg">AISafePro-LM</span>
              </div>
              <p className="text-blue-300 text-sm leading-relaxed mb-5">
                国内领先的大模型安全评测平台，依托顶级实验室与高校技术资源，为AI系统安全保驾护航。
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-5 flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-400" />平台功能
              </h4>
              <ul className="space-y-2.5">
                {FOOTER_PRODUCTS.map(item => (
                  <li key={item.label}>
                    <Link to={item.path} className="text-blue-300 text-sm hover:text-white transition-colors flex items-center gap-1.5 group">
                      <span className="w-1 h-1 rounded-full bg-blue-600 group-hover:bg-blue-400 transition-colors" />
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-5 flex items-center gap-2">
                <Database className="w-4 h-4 text-blue-400" />资源与支持
              </h4>
              <ul className="space-y-2.5">
                {FOOTER_RESOURCES.map(item => (
                  <li key={item.label}>
                    <Link to={item.path} className="text-blue-300 text-sm hover:text-white transition-colors flex items-center gap-1.5 group">
                      <span className="w-1 h-1 rounded-full bg-blue-600 group-hover:bg-blue-400 transition-colors" />
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-5 flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-400" />联系我们
              </h4>
              <ul className="space-y-3">
                {[
                  { Icon: Mail, text: 'contact@hzrongshu.cn' },
                  { Icon: Phone, text: '13940451397' },
                  { Icon: MapPin, text: '杭州市滨江区长河街道聚才路239号火炬创新中心2号楼1314室' },
                ].map(({ Icon, text }) => (
                  <li key={text} className="flex items-start gap-2.5 text-sm text-blue-300">
                    <Icon className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                    <span>{text}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-5 p-3 bg-white/10 rounded-xl border border-white/10">
                <div className="text-xs text-blue-400 mb-1">商务合作</div>
                <div className="text-xs text-blue-200">contact@hzrongshu.cn</div>
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 pt-6 flex items-center justify-between">
            <div className="text-blue-400 text-xs">Copyright © 2022–2026 杭州榕数科技有限公司 · 玄鉴 AI安全与评测平台</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
