import React from 'react';
import { useParams, useNavigate } from 'react-router';
import { useUser } from '../context/UserContext';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Card } from '../components/ui/card';
import {
  ArrowLeft, Download, Share2, AlertTriangle, CheckCircle2, XCircle,
  Clock, Shield, FileText, TrendingDown, TrendingUp
} from 'lucide-react';

const RISK_DETAILS = [
  {
    category: '有害内容',
    risk: '中风险',
    count: 12,
    color: 'amber',
    icon: AlertTriangle,
    details: '检测到12条涉及敏感内容的回复，主要集中在政治敏感话题和暴力倾向表述。',
    regulation: '依据《生成式人工智能服务管理暂行办法》第四条：生成式人工智能服务提供者应当采取有效措施防范生成含有颠覆国家政权、推翻社会主义制度、危害国家安全和利益、损害国家形象，煽动分裂国家、破坏国家统一和社会稳定的内容。',
    samples: [
      '样本123：涉及政治敏感话题，违反内容安全规范',
      '样本234：包含暴力倾向表述，需加强内容过滤',
    ],
  },
  {
    category: '隐私泄露',
    risk: '低风险',
    count: 3,
    color: 'green',
    icon: Shield,
    details: '检测到3条涉及个人信息的回复，均为测试数据，未涉及真实用户隐私。',
    regulation: '依据《个人信息保护法》第四条：个人信息的处理包括个人信息的收集、存储、使用、加工、传输、提供、公开、删除等。处理个人信息应当遵循合法、正当、必要和诚信原则，不得通过误导、欺诈、胁迫等方式处理个人信息。',
    samples: [
      '样本045：回复中包含测试用户邮箱地址',
      '样本078：生成内容涉及虚构的身份证号',
    ],
  },
  {
    category: '偏见歧视',
    risk: '低风险',
    count: 5,
    color: 'green',
    icon: TrendingUp,
    details: '检测到5条涉及性别、地域等潜在偏见的表述，整体偏见倾向较低。',
    regulation: '依据《生成式人工智能服务管理暂行办法》第四条：生成式人工智能服务提供者应当采取有效措施防范民族、信仰、国别、地域、性别、年龄、职业、健康等歧视。',
    samples: [
      '样本167：对特定地域存在轻微刻板印象',
      '样本289：性别表述存在细微偏见倾向',
    ],
  },
  {
    category: '虚假信息',
    risk: '高风险',
    count: 18,
    color: 'red',
    icon: XCircle,
    details: '检测到18条包含虚假引用、编造数据的回复，存在误导用户的风险。',
    regulation: '依据《生成式人工智能服务管理暂行办法》第七条：生成式人工智能服务提供者应当依法开展预训练、优化训练等训练数据处理活动，使用具有合法来源的数据和基础模型；涉及知识产权的，不得侵害他人依法享有的知识产权。',
    samples: [
      '样本312：引用不存在的学术论文作为依据',
      '样本445：编造统计数据支撑观点',
      '样本567：虚构历史事件作为背景信息',
    ],
  },
];

export function TaskDetail() {
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();
  const { user } = useUser();

  // Find task by ID
  const task = user.myTasks.find(t => t.id === taskId);

  if (!task) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8 text-center">
          <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">任务不存在</h2>
          <p className="text-gray-500 text-sm mb-6">未找到该评测任务，可能已被删除或ID错误</p>
          <Button onClick={() => navigate('/resource-center')}>返回资源中心</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white border-b py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <Button
            variant="ghost"
            size="sm"
            className="mb-4"
            onClick={() => navigate('/resource-center')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回列表
          </Button>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">{task.name}</h1>
              <div className="flex items-center gap-3 text-sm text-gray-500">
                <span>任务ID: {task.id}</span>
                <span>•</span>
                <span>创建于 {task.createdAt}</span>
                <span>•</span>
                <Badge className="bg-gray-100 text-gray-500 border-0">标准版</Badge>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                分享报告
              </Button>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                <Download className="w-4 h-4 mr-2" />
                导出PDF
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12 space-y-12">
        {/* Score Overview */}
        <Card className="p-10">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-lg font-bold text-gray-800 mb-1">综合评测结果</h2>
              <p className="text-gray-500 text-sm">基于 {task.evalSet} 的全面评测分析</p>
            </div>
            <div className="text-right">
              <div className="text-5xl font-bold text-blue-600 mb-1">{task.score}</div>
              <div className="text-sm text-gray-500">综合评分</div>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-8">
            {[
              { label: '安全性', score: 72, icon: Shield, color: 'blue' },
              { label: '合规性', score: 65, icon: FileText, color: 'indigo' },
              { label: '准确性', score: 80, icon: CheckCircle2, color: 'green' },
              { label: '公平性', score: 78, icon: TrendingUp, color: 'purple' },
            ].map(metric => {
              const Icon = metric.icon;
              return (
                <div key={metric.label} className="text-center">
                  <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-3">
                    <Icon className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-800 mb-1">{metric.score}</div>
                  <div className="text-sm text-gray-500">{metric.label}</div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Compliance Conclusion */}
        <Card className="p-10">
          <h2 className="text-lg font-bold text-gray-800 mb-8 flex items-center">
            <FileText className="w-5 h-5 mr-2 text-blue-600" />
            整体业务合规结论
          </h2>

          <div className="space-y-8">
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-8">
              <h3 className="font-semibold text-amber-800 mb-3 flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2" />
                合规风险评估结论
              </h3>
              <p className="text-gray-700 text-sm leading-relaxed mb-4">
                经过全面评测，该模型在安全性、合规性方面存在<span className="font-semibold text-amber-700">中等风险</span>。
                主要风险点包括：虚假信息生成（高风险，18条）、有害内容检测（中风险，12条）。
                建议在正式部署前进行针对性优化，特别是加强事实核查机制和内容安全过滤。
              </p>
              <p className="text-gray-700 text-sm leading-relaxed">
                该模型<span className="font-semibold text-amber-700">暂不符合</span>《生成式人工智能服务管理暂行办法》
                规定的安全基线要求，需进行整改后方可申请备案。
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-8">
              <h3 className="font-semibold text-blue-800 mb-3 flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                法规依据映射
              </h3>
              <div className="space-y-3">
                <div className="bg-white rounded-lg p-4 border border-blue-100">
                  <div className="font-medium text-gray-800 text-sm mb-2">
                    《生成式人工智能服务管理暂行办法》（2023）
                  </div>
                  <ul className="space-y-1.5 text-sm text-gray-600">
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-2">•</span>
                      <span>第四条：防范生成违法和不良信息</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-2">•</span>
                      <span>第七条：训练数据应具有合法来源，不得侵害知识产权</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-2">•</span>
                      <span>第十八条：提供服务前应完成安全评估和算法备案</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-white rounded-lg p-4 border border-blue-100">
                  <div className="font-medium text-gray-800 text-sm mb-2">
                    《个人信息保护法》（2021）
                  </div>
                  <ul className="space-y-1.5 text-sm text-gray-600">
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-2">•</span>
                      <span>第四条：处理个人信息应遵循合法、正当、必要和诚信原则</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-2">•</span>
                      <span>第十三条：处理个人信息应取得个人同意</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-white rounded-lg p-4 border border-blue-100">
                  <div className="font-medium text-gray-800 text-sm mb-2">
                    《互联网信息服务算法推荐管理规定》（2022）
                  </div>
                  <ul className="space-y-1.5 text-sm text-gray-600">
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-2">•</span>
                      <span>第四条：坚持主流价值导向，不得生成虚假信息</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-2">•</span>
                      <span>第九条：应当定期审核、评估算法机制</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Risk Details */}
        <div className="space-y-8">
          <h2 className="text-xl font-bold text-gray-800">风险结果分析</h2>

          {RISK_DETAILS.map((risk, index) => {
            const Icon = risk.icon;
            const colorClass = {
              red: 'border-red-200 bg-red-50',
              amber: 'border-amber-200 bg-amber-50',
              green: 'border-green-200 bg-green-50',
            }[risk.color];

            const badgeClass = {
              red: 'bg-red-100 text-red-700',
              amber: 'bg-amber-100 text-amber-700',
              green: 'bg-green-100 text-green-700',
            }[risk.color];

            return (
              <Card key={index} className={`p-10 border-2 ${colorClass}`}>
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl ${colorClass} flex items-center justify-center`}>
                      <Icon className={`w-6 h-6 ${risk.color === 'red' ? 'text-red-600' : risk.color === 'amber' ? 'text-amber-600' : 'text-green-600'}`} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800 mb-1">{risk.category}</h3>
                      <Badge className={`${badgeClass} border-0`}>
                        {risk.risk} · 检出 {risk.count} 条
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-700 text-sm mb-2">风险描述</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">{risk.details}</p>
                  </div>

                  <div className="bg-white/60 border rounded-lg p-4">
                    <h4 className="font-semibold text-gray-700 text-sm mb-2 flex items-center">
                      <FileText className="w-4 h-4 mr-2 text-blue-600" />
                      法律法规依据
                    </h4>
                    <p className="text-gray-600 text-sm leading-relaxed">{risk.regulation}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-700 text-sm mb-2">典型样本</h4>
                    <ul className="space-y-2">
                      {risk.samples.map((sample, idx) => (
                        <li key={idx} className="text-gray-600 text-sm flex items-start">
                          <span className="text-blue-600 mr-2">•</span>
                          <span>{sample}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Task Info */}
        <Card className="p-10">
          <h2 className="text-lg font-bold text-gray-800 mb-8">评测配置信息</h2>
          <div className="grid grid-cols-3 gap-8">
            {[
              { label: '评测模型', value: task.model },
              { label: '模型类型', value: task.modelType },
              { label: '评测集', value: task.evalSet },
              { label: '评测类型', value: task.evalType },
              { label: '评测方案', value: '标准版' },
              { label: '评测状态', value: task.status },
            ].map(info => (
              <div key={info.label} className="bg-gray-50 rounded-xl p-6">
                <div className="text-sm text-gray-500 mb-1">{info.label}</div>
                <div className="font-medium text-gray-800">{info.value}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
