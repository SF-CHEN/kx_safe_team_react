import React, { useState } from 'react';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { useNavigate } from 'react-router';
import { FileText, Shield, Zap, BarChart2, Globe, CheckCircle } from 'lucide-react';

const SECTIONS = [
  { id: 'quick-start', label: '快速开始', icon: Zap },
  { id: 'free-trial', label: '免费试用', icon: CheckCircle },
  { id: 'paid-service', label: '付费服务', icon: BarChart2 },
  { id: 'safety-eval', label: '安全评测', icon: Shield },
  { id: 'compliance', label: '备案合规', icon: Globe },
  { id: 'faq', label: '常见问题', icon: FileText },
];

export function EvaluationIntro() {
  const [activeSection, setActiveSection] = useState('quick-start');
  const navigate = useNavigate();

  const renderContent = () => {
    switch (activeSection) {
      case 'quick-start':
        return (
          <div className="space-y-10">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">快速开始</h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                用户可在【登录/注册】实名后，在根据业务需求，在任一评测场景页面中点击"创建任务"按钮，填写必填信息后即可开始评测。
                注册认证后将获得1次试用资格，可免费进行全流程评测，更多次数请按需购买。
              </p>

              <h3 className="text-lg font-semibold text-gray-800 mb-4">财检说明方式如下：</h3>

              <div className="mb-8">
                <h4 className="font-medium text-gray-700 mb-3">注册</h4>
                <p className="text-gray-600 text-sm">
                  用户点击【登录/注册】实体后，唯一通过实名认证的企业或个人可注册为平台用户。
                  唯一通过实名认证的企业或个人才能注册为平台正式用户（真实姓名+邮箱）。
                  实名认证是获得评测权限的前提，需经运营团队审核通过后方可进行评测任务。平台将保护个人隐私，实名信息仅用于审核及正常的必要业务通信。
                </p>
              </div>

              {/* Preview Image Placeholder */}
              <Card className="bg-blue-50 border-blue-200 p-8 mb-6">
                <div className="flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-64 h-48 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg mx-auto mb-4 flex items-center justify-center">
                      <FileText className="w-16 h-16 text-blue-400" />
                    </div>
                    <p className="text-sm text-gray-600">评测流程示意图</p>
                  </div>
                </div>
              </Card>

              <p className="text-gray-600 text-sm">
                同时也为每次，前端页面提供报告，托口、邮箱推送等方式。手机、平台也能实现方便流程化应该。
              </p>
            </div>
          </div>
        );

      case 'free-trial':
        return (
          <div className="space-y-10">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">免费试用</h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                为了让用户充分了解平台功能与评测流程，我们为每位实名认证用户提供1次免费试用机会。
              </p>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-8 mb-8">
                <h3 className="font-semibold text-blue-800 mb-3 flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  免费试用包含内容
                </h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <span>完整的评测流程体验（模型选择、数据上传、参数配置、结果查看）</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <span>标准评测维度检测（安全性、合规性、偏见性等）</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <span>可视化评测报告生成与导出</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <span>技术支持与使用指导</span>
                  </li>
                </ul>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-8 mb-8">
                <h3 className="font-semibold text-amber-800 mb-3">使用限制</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start">
                    <span className="text-amber-600 mr-2">•</span>
                    <span>每个账号仅可使用1次免费试用机会</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-amber-600 mr-2">•</span>
                    <span>测试数据集规模限制在1000条以内</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-amber-600 mr-2">•</span>
                    <span>试用结果仅供参考，正式业务请使用付费服务</span>
                  </li>
                </ul>
              </div>

              <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => navigate('/register')}>
                立即注册试用
              </Button>
            </div>
          </div>
        );

      case 'paid-service':
        return (
          <div className="space-y-10">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">付费服务</h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                我们提供灵活的按次付费服务，用户可根据实际需求购买评测次数。
              </p>

              <div className="grid grid-cols-3 gap-8 mb-10">
                {[
                  { name: '基础套餐', price: '¥199', times: 5, desc: '适合个人开发者与小型团队' },
                  { name: '标准套餐', price: '¥899', times: 30, desc: '适合中型企业与研发团队', popular: true },
                  { name: '企业套餐', price: '¥2999', times: 100, desc: '适合大型企业与专业机构' },
                ].map(plan => (
                  <Card key={plan.name} className={`p-8 relative ${plan.popular ? 'border-blue-500 border-2' : ''}`}>
                    {plan.popular && (
                      <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white">
                        推荐
                      </Badge>
                    )}
                    <h3 className="font-bold text-lg text-gray-800 mb-2">{plan.name}</h3>
                    <div className="mb-4">
                      <span className="text-3xl font-bold text-blue-600">{plan.price}</span>
                      <span className="text-gray-500 text-sm ml-1">/ {plan.times}次</span>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">{plan.desc}</p>
                    <Button className="w-full" variant={plan.popular ? 'default' : 'outline'}>
                      立即购买
                    </Button>
                  </Card>
                ))}
              </div>

              <div className="bg-gray-50 border rounded-xl p-8">
                <h3 className="font-semibold text-gray-800 mb-3">服务说明</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">✓</span>
                    <span>评测次数永久有效，无时间限制</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">✓</span>
                    <span>支持多种评测场景（安全、性能、合规等）</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">✓</span>
                    <span>提供详细的评测报告与改进建议</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">✓</span>
                    <span>支持批量评测与API调用</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        );

      case 'safety-eval':
        return (
          <div className="space-y-10">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">安全评测</h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                我们提供全面的大模型安全评测服务，覆盖多个关键安全维度，确保您的AI系统符合安全标准。
              </p>

              <div className="grid grid-cols-2 gap-8">
                {[
                  { title: '有害内容检测', desc: '检测模型是否生成暴力、色情、歧视等有害内容，确保输出内容的安全性与合规性。' },
                  { title: '虚构引用检测', desc: '识别模型生成内容中的虚假引用和编造信息，保障信息的真实性与可靠性。' },
                  { title: '隐私安全评估', desc: '评估模型在处理敏感信息时的隐私保护能力，防止个人信息泄露风险。' },
                  { title: '偏见歧视检测', desc: '检测模型输出中的性别、种族、地域等偏见，确保公平性与包容性。' },
                  { title: '提示词注入防御', desc: '测试模型对恶意提示词的抵抗能力，防止通过特殊输入绕过安全机制。' },
                  { title: '合规性检测', desc: '依据国内外相关法律法规与行业标准，评估模型的合规性水平。' },
                ].map(item => (
                  <Card key={item.title} className="p-8 hover:shadow-lg transition-shadow">
                    <h3 className="font-semibold text-gray-800 mb-2 flex items-center">
                      <Shield className="w-5 h-5 text-blue-600 mr-2" />
                      {item.title}
                    </h3>
                    <p className="text-gray-600 text-sm">{item.desc}</p>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        );

      case 'compliance':
        return (
          <div className="space-y-10">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">备案合规</h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                依据《生成式人工智能服务管理暂行办法》等相关法规，我们为企业提供专业的备案合规服务。
              </p>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-8 mb-8">
                <h3 className="font-semibold text-blue-800 mb-3">备案专区服务</h3>
                <p className="text-gray-700 text-sm mb-4">
                  我们的备案专区为企业提供一站式备案服务，帮助您快速完成大模型备案流程。
                </p>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <span>政策法规解读与咨询服务</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <span>备案材料清单与模板提供</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <span>备案流程指导与技术支持</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <span>安全评估报告生成与提交</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gray-50 border rounded-xl p-8">
                <h3 className="font-semibold text-gray-800 mb-3">相关法规</h3>
                <ul className="space-y-3 text-sm text-gray-700">
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <span>《生成式人工智能服务管理暂行办法》（2023年）</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <span>《互联网信息服务算法推荐管理规定》（2022年）</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <span>《网络安全法》《数据安全法》《个人信息保护法》</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        );

      case 'faq':
        return (
          <div className="space-y-10">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">常见问题</h2>

              <div className="space-y-6">
                {[
                  {
                    q: '如何开始评测？',
                    a: '完成实名认证后，在评测页面点击"创建任务"，选择模型、上传数据集、配置参数，即可启动评测。',
                  },
                  {
                    q: '评测需要多长时间？',
                    a: '根据数据集规模和评测维度，通常在5-30分钟内完成。大规模数据集可能需要更长时间。',
                  },
                  {
                    q: '支持哪些模型？',
                    a: '支持OpenAI、Anthropic、智谱AI、百度文心、阿里通义等30+种主流大模型，也支持自定义模型接入。',
                  },
                  {
                    q: '评测报告包含哪些内容？',
                    a: '包含安全性评分、风险明细、法规依据、改进建议等内容，支持PDF导出和分享。',
                  },
                  {
                    q: '如何获取技术支持？',
                    a: '您可以通过平台工单系统、邮件或在线客服获取技术支持，我们将在24小时内响应。',
                  },
                ].map((faq, index) => (
                  <Card key={index} className="p-8">
                    <h3 className="font-semibold text-gray-800 mb-2">{faq.q}</h3>
                    <p className="text-gray-600 text-sm">{faq.a}</p>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-[83%] mx-auto px-4 py-12">
        <div className="flex gap-10">
          {/* Left Sidebar */}
          <div className="w-64 shrink-0">
            <Card className="sticky top-20 p-6">
              <h3 className="font-bold text-gray-800 mb-4 px-2">评测介绍</h3>
              <nav className="space-y-1">
                {SECTIONS.map(section => {
                  const Icon = section.icon;
                  const isActive = activeSection === section.id;
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                        isActive
                          ? 'bg-blue-50 text-blue-600 font-medium'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {section.label}
                    </button>
                  );
                })}
              </nav>
            </Card>
          </div>

          {/* Right Content */}
          <div className="flex-1">
            <Card className="p-10">
              {renderContent()}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
