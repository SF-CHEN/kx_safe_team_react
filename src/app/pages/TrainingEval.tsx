import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { GuestGuard } from '../components/GuestGuard';
import { ScrollReveal } from '../components/ScrollReveal';
import { TechHeroBg } from '../components/TechHeroBg';
import { TrainingEvalModal } from '../components/TrainingEvalModal';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router';
import {
  Plus, Database, BarChart2, Filter, ArrowRight, CheckCircle2,
  AlertTriangle, Layers, Search, ShieldCheck, Tag, Activity,
  FileText, TrendingUp, Zap, Eye, RefreshCw, DownloadCloud,
  ChevronRight, Clock, Award, Target
} from 'lucide-react';

const OVERVIEW_STATS = [
  { label: '支持数据格式', value: '12+', icon: Database },
  { label: '评测维度', value: '8', icon: BarChart2 },
  { label: '检测规则库', value: '500+', icon: ShieldCheck },
  { label: '已处理数据集', value: '1,200+', icon: Activity },
];

const EVAL_MODULES = [
  {
    icon: Tag,
    title: '标注错误检测',
    color: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-100',
    desc: '检测训练数据集中的标注错误、标签噪声和不一致标注，提升数据标注质量。',
    items: ['标签一致性验证', '跨标注员差异分析', '边界样本识别', '模糊标注检测'],
    badge: '核心模块',
  },
  {
    icon: BarChart2,
    title: '均衡性评估',
    color: 'from-emerald-500 to-emerald-600',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-100',
    desc: '分析数据集各类别的样本分布情况，识别类别不均衡问题，提供数据增强建议。',
    items: ['类别分布分析', '样本数量统计', '少数类识别', '过采样建议'],
    badge: '核心模块',
  },
  {
    icon: Filter,
    title: '敏感性评估',
    color: 'from-orange-500 to-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-100',
    desc: '检测训练数据中的有害内容、偏见信息和违规数据，确保训练数据安全合规。',
    items: ['有害内容过滤', '偏见词汇检测', '违规信息识别', '隐私数据扫描'],
    badge: '安全模块',
  },
  {
    icon: Search,
    title: '数据质量分析',
    color: 'from-purple-500 to-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-100',
    desc: '全面评估数据集的整体质量，包括数据完整性、格式规范性和内容多样性。',
    items: ['完整性检查', '格式规范验证', '重复样本检测', '多样性指标'],
    badge: '质量模块',
  },
];

const SUPPORTED_FORMATS = [
  { format: 'JSON / JSONL', icon: '{ }', color: 'text-yellow-600 bg-yellow-50' },
  { format: 'CSV / TSV', icon: '≡', color: 'text-green-600 bg-green-50' },
  { format: 'Parquet', icon: '⊟', color: 'text-blue-600 bg-blue-50' },
  { format: 'TXT 文本', icon: 'T', color: 'text-gray-600 bg-gray-50' },
  { format: 'Arrow', icon: '→', color: 'text-indigo-600 bg-indigo-50' },
  { format: 'HuggingFace', icon: '🤗', color: 'text-orange-600 bg-orange-50' },
];

const EVAL_PROCESS = [
  { step: '1', title: '上传数据集', desc: '支持本地上传或填写云存储地址，支持多种数据格式' },
  { step: '2', title: '选择评测维度', desc: '按需选择标注检测、均衡性、安全性等模块' },
  { step: '3', title: '配置采样参数', desc: '设置样本数量、置信阈值等评测参数' },
  { step: '4', title: '启动评测任务', desc: '系统自动执行评测，实时展示进度' },
  { step: '5', title: '查看评测报告', desc: '获取详细的评测结果和改进建议' },
];

const RECENT_TASKS = [
  { id: 143, name: '均衡性展示', dataset: '训练集测试用数据集', score: 100, status: '评测完成', time: '2026-02-03 12:03' },
  { id: 142, name: '数据标注精误展示', dataset: '训练集测试用数据集', score: 0, status: '评测完成', time: '2026-02-03 09:58' },
  { id: 141, name: '数据分类分类任务', dataset: '训练集测试用数据集', score: 100, status: '评测完成', time: '2026-02-03 10:47' },
  { id: 140, name: '数据分类分类任务', dataset: '训练集测试用数据集', score: 0, status: '评测失败', time: '2026-02-03 10:05' },
  { id: 139, name: '数据标注精误展示', dataset: '训练集测试用数据集', score: 50, status: '评测完成', time: '2026-02-03 09:21' },
];

const ADVANTAGES = [
  {
    icon: Zap,
    title: '高效处理',
    desc: '分布式计算架构，支持亿级规模数据集快速扫描，分钟级输出评测报告',
  },
  {
    icon: ShieldCheck,
    title: '合规安全',
    desc: '符合国家数据安全法和个人信息保护法，数据不出境，隐私全程保护',
  },
  {
    icon: TrendingUp,
    title: '持续优化',
    desc: '检测规则库持续更新，覆盖最新偏见类型和安全威胁，保持检测精度领先',
  },
  {
    icon: Award,
    title: '权威报告',
    desc: '评测报告基于国家标准和行业规范，可用于监管申报和合规证明',
  },
];

export function TrainingEval() {
  const { isGuest } = useUser();
  const navigate = useNavigate();
  const [showGuestGuard, setShowGuestGuard] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [activeModule, setActiveModule] = useState(0);

  const handleNewTask = () => {
    if (isGuest) {
      setShowGuestGuard(true);
    } else {
      setShowModal(true);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-red-500';
  };

  const getStatusColor = (status: string) => {
    if (status === '评测完成') return 'bg-green-50 text-green-700 border-green-200';
    if (status === '评测失败') return 'bg-red-50 text-red-700 border-red-200';
    return 'bg-blue-50 text-blue-700 border-blue-200';
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative text-white overflow-hidden">
        <TechHeroBg />
        <div className="max-w-[83%] mx-auto px-4 py-12 relative z-10">
          <div className="flex items-start justify-between">
            <div>
              <Badge className="mb-3 bg-white/20 text-white border-white/30 text-xs">训练集评测</Badge>
              <h1 className="text-4xl font-bold mb-2">训练集数据质量评测</h1>
              <p className="text-blue-100 text-sm max-w-xl leading-relaxed">
                全面评测训练数据集的质量、均衡性、安全性和标注准确性，从源头保障大模型训练质量，
                消除数据偏差与安全风险。
              </p>
            </div>
            <div className="flex gap-3 shrink-0">
              <button
                className="px-4 py-2 rounded-lg border border-white/50 bg-white/15 text-white hover:bg-white/25 text-sm font-medium transition-all backdrop-blur-sm relative z-10"
                onClick={() => navigate('/resource-center')}
              >
                查看任务列表
              </button>
              <Button
                className="bg-white text-blue-700 hover:bg-blue-50 font-medium relative z-10"
                onClick={handleNewTask}
              >
                <Plus className="w-4 h-4 mr-1.5" />
                新建评测任务
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mt-10">
            {OVERVIEW_STATS.map(stat => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="glass-dark rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className="w-5 h-5 text-blue-200" />
                    <span className="text-blue-200 text-xs">{stat.label}</span>
                  </div>
                  <div className="text-2xl font-bold">{stat.value}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Why Training Eval - White */}
      <ScrollReveal>
        <section className="bg-white py-16 px-4">
          <div className="max-w-[83%] mx-auto">
            <div className="text-center mb-12">
              <h2 style={{ fontSize: '2rem', fontWeight: 800 }} className="text-gray-800 mb-3">为什么训练数据质量至关重要</h2>
              <div className="h-1 w-14 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 mx-auto mb-4" />
              <p className="text-gray-500 text-sm max-w-2xl mx-auto leading-relaxed">
                "垃圾进，垃圾出"——训练数据的质量直接决定了大模型的能力天花板。数据问题不解决，再强的算法和算力也无济于事。
              </p>
            </div>
            <div className="grid grid-cols-3 gap-8">
              <div className="glass-glow rounded-2xl p-8">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center mx-auto mb-5 icon-glow-orange">
                  <AlertTriangle className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-bold text-gray-800 text-center mb-3">劣质数据导致模型偏差</h3>
                <p className="text-gray-600 text-sm text-center leading-relaxed">
                  训练数据中的标注错误、类别不均衡会直接导致模型学习到错误的决策边界，使模型在关键任务上产生系统性偏差。
                </p>
              </div>
              <div className="glass-glow rounded-2xl p-8">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500 to-rose-500 flex items-center justify-center mx-auto mb-5 icon-glow-red">
                  <ShieldCheck className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-bold text-gray-800 text-center mb-3">数据中潜藏的安全隐患</h3>
                <p className="text-gray-600 text-sm text-center leading-relaxed">
                  训练集中潜藏的有害内容、偏见词汇和隐私数据会被模型学习并强化，最终导致模型部署后产生严重安全风险与法律责任。
                </p>
              </div>
              <div className="glass-glow rounded-2xl p-8">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center mx-auto mb-5 icon-glow-cyan">
                  <TrendingUp className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-bold text-gray-800 text-center mb-3">高昂的训练成本浪费</h3>
                <p className="text-gray-600 text-sm text-center leading-relaxed">
                  模型训练耗资巨大，发现数据问题后需要重新采集、清洗和标注，再次训练的成本往往数倍于预先进行数据质量检测的费用。
                </p>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Evaluation Modules - White */}
      <ScrollReveal>
        <section className="relative bg-gradient-to-br from-blue-50 to-indigo-50 py-16 px-4 overflow-hidden">
          <div className="absolute inset-0 bg-dot-grid" />
          <div className="relative max-w-[83%] mx-auto">
            <div className="text-center mb-10">
              <h2 style={{ fontSize: '2rem', fontWeight: 800 }} className="text-gray-800 mb-3">评测维度模块</h2>
              <div className="h-1 w-12 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 mx-auto mb-4" />
              <p className="text-gray-500 text-sm">覆盖训练集质量评测全链路，精准定位数据问题</p>
            </div>

            {/* Module Tabs */}
            <div className="flex gap-3 mb-8 justify-center flex-wrap">
              {EVAL_MODULES.map((mod, i) => {
                const Icon = mod.icon;
                return (
                  <button
                    key={mod.title}
                    onClick={() => setActiveModule(i)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                      activeModule === i
                        ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:text-blue-600'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {mod.title}
                  </button>
                );
              })}
            </div>

            {/* Active Module Detail */}
            <div className={`rounded-2xl p-8 border ${EVAL_MODULES[activeModule].bgColor} ${EVAL_MODULES[activeModule].borderColor} mb-8`}>
              <div className="grid grid-cols-2 gap-8 items-center">
                <div>
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${EVAL_MODULES[activeModule].color} flex items-center justify-center mb-4 shadow-lg`}>
                    {React.createElement(EVAL_MODULES[activeModule].icon, { className: 'w-7 h-7 text-white' })}
                  </div>
                  <Badge className="mb-3 bg-white/80 text-gray-600 border-gray-300 text-xs">
                    {EVAL_MODULES[activeModule].badge}
                  </Badge>
                  <h3 className="font-bold text-gray-800 text-xl mb-3">{EVAL_MODULES[activeModule].title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{EVAL_MODULES[activeModule].desc}</p>
                  <Button
                    className="mt-6 bg-blue-600 hover:bg-blue-700"
                    onClick={handleNewTask}
                  >
                    <Plus className="w-4 h-4 mr-1.5" />
                    创建评测任务
                  </Button>
                </div>
                <div>
                  <div className="font-semibold text-gray-800 mb-4 text-sm">检测能力列表</div>
                  <div className="space-y-3">
                    {EVAL_MODULES[activeModule].items.map((item, i) => (
                      <div key={i} className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 border border-white shadow-sm">
                        <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                        <span className="text-sm text-gray-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* All Modules Grid */}
            <div className="grid grid-cols-4 gap-5">
              {EVAL_MODULES.map((mod, i) => {
                const Icon = mod.icon;
                return (
                  <div
                    key={mod.title}
                    onClick={() => setActiveModule(i)}
                    className={`bg-white rounded-2xl p-6 border cursor-pointer transition-all hover:shadow-md ${
                      activeModule === i ? 'border-blue-300 shadow-md' : 'border-gray-200 hover:border-blue-200'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${mod.color} flex items-center justify-center mb-3`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="font-semibold text-gray-800 text-sm mb-1">{mod.title}</div>
                    <div className="text-xs text-gray-500 leading-relaxed">{mod.desc.slice(0, 35)}...</div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Recent Tasks - Blue Tinted */}
      <ScrollReveal>
        <section className="bg-gradient-to-br from-blue-50 to-indigo-50 py-16 px-4">
          <div className="max-w-[83%] mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="font-bold text-gray-800 text-2xl mb-1">近期评测任务</h2>
                <p className="text-gray-500 text-sm">展示最近的训练集评测记录</p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => navigate('/resource-center')} className="bg-white">
                  查看全部任务
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleNewTask}>
                  <Plus className="w-4 h-4 mr-1.5" />
                  新建评测
                </Button>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
              {/* Table Header */}
              <div className="grid grid-cols-6 px-6 py-3 bg-gray-50 border-b text-xs font-medium text-gray-500 uppercase tracking-wide">
                <span>序号</span>
                <span className="col-span-2">任务名称</span>
                <span>被检测数据集</span>
                <span className="text-center">得分</span>
                <span className="text-right">操作</span>
              </div>
              {RECENT_TASKS.map(task => (
                <div key={task.id} className="grid grid-cols-6 px-6 py-4 items-center border-b last:border-0 hover:bg-gray-50 transition-colors">
                  <span className="text-gray-500 text-sm">#{task.id}</span>
                  <div className="col-span-2">
                    <div className="text-sm font-medium text-gray-800">{task.name}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-400">{task.time}</span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 truncate pr-2">{task.dataset}</div>
                  <div className="text-center">
                    <span className={`font-bold text-base ${getScoreColor(task.score)}`}>{task.score}</span>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <span className={`text-xs px-2.5 py-1 rounded-full border ${getStatusColor(task.status)}`}>
                      {task.status}
                    </span>
                    <button className="text-xs text-blue-600 hover:underline">查看</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Supported Formats - White */}
      <ScrollReveal>
        <section className="bg-white py-16 px-4">
          <div className="max-w-[83%] mx-auto">
            <div className="grid grid-cols-2 gap-12 items-center">
              <div>
                <Badge className="mb-4 bg-blue-50 text-blue-700 border-blue-200 text-xs">多格式支持</Badge>
                <h2 className="font-bold text-gray-800 text-2xl mb-4">支持主流数据格式</h2>
                <p className="text-gray-600 text-sm leading-relaxed mb-6">
                  无论您的训练数据以何种格式存储，都可以直接接入本平台进行评测。
                  支持从本地文件上传、云存储链接导入，以及 HuggingFace 数据集直连。
                </p>
                <div className="space-y-3">
                  {['直接上传本地文件（最大 5GB）', '填写云存储地址自动拉取', 'HuggingFace 数据集 ID 直接载入', '支持 ZIP 压缩包解压评测'].map((item, i) => (
                    <div key={i} className="flex items-center gap-2.5 text-sm text-gray-700">
                      <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {SUPPORTED_FORMATS.map(fmt => (
                  <div
                    key={fmt.format}
                    className={`rounded-xl p-5 text-center border border-gray-200 hover:shadow-md transition-all ${fmt.color.split(' ')[1]}`}
                  >
                    <div className={`text-2xl mb-2 font-mono font-bold ${fmt.color.split(' ')[0]}`}>
                      {fmt.icon}
                    </div>
                    <div className="text-xs font-medium text-gray-700">{fmt.format}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Evaluation Process - Blue Tinted */}
      <ScrollReveal>
        <section className="bg-gradient-to-br from-blue-50 to-indigo-50 py-16 px-4">
          <div className="max-w-[83%] mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-bold text-gray-800 text-2xl mb-2">评测流程</h2>
              <p className="text-gray-500 text-sm">五步完成训练集质量全面评测</p>
            </div>
            <div className="bg-white rounded-2xl p-10 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-10">
                {EVAL_PROCESS.map((proc, i) => (
                  <React.Fragment key={proc.step}>
                    <div className="flex-1 text-center relative">
                      {i < EVAL_PROCESS.length - 1 && (
                        <div className="absolute left-[60%] top-5 w-[80%] flex items-center z-0">
                          <div className="flex-1 h-0.5 bg-gradient-to-r from-blue-400 to-blue-300"></div>
                          <div className="w-0 h-0 border-t-[3px] border-t-transparent border-b-[3px] border-b-transparent border-l-[6px] border-l-blue-300"></div>
                        </div>
                      )}
                      <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white font-bold flex items-center justify-center mx-auto mb-3 shadow-lg z-10">
                        {proc.step}
                      </div>
                      <div className="text-sm font-semibold text-gray-800 mb-1">{proc.title}</div>
                      <div className="text-xs text-gray-500 max-w-[100px] mx-auto leading-relaxed">{proc.desc}</div>
                    </div>
                  </React.Fragment>
                ))}
              </div>
              <div className="flex gap-3 justify-center">
                <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleNewTask}>
                  <Plus className="w-4 h-4 mr-1.5" />
                  新建评测任务
                </Button>
                <Button variant="outline" onClick={() => navigate('/resource-center')}>
                  <Eye className="w-4 h-4 mr-1.5" />
                  查看已有任务
                </Button>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Advantages - White */}
      <ScrollReveal>
        <section className="bg-white py-16 px-4">
          <div className="max-w-[83%] mx-auto">
            <div className="text-center mb-10">
              <h2 className="font-bold text-gray-800 text-2xl mb-2">平台核心优势</h2>
              <p className="text-gray-500 text-sm">为什么选择 AISafePro-LM 训练集评测</p>
            </div>
            <div className="grid grid-cols-4 gap-6">
              {ADVANTAGES.map(adv => {
                const Icon = adv.icon;
                return (
                  <div key={adv.title} className="text-center p-6 rounded-2xl border border-gray-200 hover:border-blue-200 hover:shadow-md transition-all">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-7 h-7 text-blue-600" />
                    </div>
                    <div className="font-bold text-gray-800 mb-2">{adv.title}</div>
                    <div className="text-xs text-gray-500 leading-relaxed">{adv.desc}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* CTA */}
      <section className="bg-gradient-to-r from-teal-600 to-cyan-700 py-16 px-4 text-white text-center">
        <h2 className="text-2xl font-bold mb-3">从训练数据开始，保障模型质量</h2>
        <p className="text-teal-100 mb-8 max-w-xl mx-auto text-sm leading-relaxed">
          上传您的训练数据集，立即获取全面的质量评测报告，发现并修复数据问题。
        </p>
        <div className="flex gap-3 justify-center">
          <Button
            size="lg"
            className="bg-white text-teal-700 hover:bg-teal-50"
            onClick={handleNewTask}
          >
            <Plus className="w-4 h-4 mr-2" />
            立即新建评测
          </Button>
          <button
            className="px-6 py-2.5 rounded-lg border border-white/50 bg-white/15 text-white hover:bg-white/25 text-sm font-medium transition-all"
            onClick={() => navigate('/evaluation-intro')}
          >
            了解更多
            <ChevronRight className="w-4 h-4 ml-1 inline" />
          </button>
        </div>
      </section>

      <GuestGuard open={showGuestGuard} onClose={() => setShowGuestGuard(false)} action="新建评测" />
      <TrainingEvalModal open={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
}