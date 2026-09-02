import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import {
  AlertTriangle,
  ArrowLeft,
  Bot,
  CheckCircle2,
  Download,
  FileText,
  Share2,
  Shield,
  TrendingDown,
  TrendingUp,
  User,
} from 'lucide-react'

import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'
import { Card } from '../components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { useUser } from '../context/UserContext'
import {
  MOCK_TASK_ENVIRONMENT,
  MOCK_TASK_QA_SAMPLES,
  MOCK_TASK_STATS,
} from '@/mocks/evaluation/taskDetail.mock'

const ENVIRONMENT_ICONS = [Shield, FileText, TrendingUp, TrendingDown, CheckCircle2]

export function TaskDetailNew() {
  const { taskId } = useParams<{ taskId: string }>()
  const navigate = useNavigate()
  const { user } = useUser()
  const [activeTab, setActiveTab] = useState('qa')

  const task = user.myTasks.find((item) => item.id === taskId)

  if (!task) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8 text-center">
          <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">任务不存在</h2>
          <p className="text-gray-500 text-sm mb-6">未找到该评测任务</p>
          <Button onClick={() => navigate('/resource-center')}>返回资源中心</Button>
        </Card>
      </div>
    )
  }

  const passedCount = MOCK_TASK_QA_SAMPLES.filter((qa) => qa.status === '通过').length
  const failedCount = MOCK_TASK_QA_SAMPLES.filter((qa) => qa.status === '未通过').length

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white border-b py-6 px-4">
        <div className="max-w-[83%] mx-auto">
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
                <span>{task.createdAt}</span>
                <span>•</span>
                <Badge className="bg-gray-100 text-gray-600 border-0">{task.modelType}</Badge>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                分享
              </Button>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                <Download className="w-4 h-4 mr-2" />
                导出PDF
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* System Info Header */}
      <div className="bg-white border-b py-4 px-4">
        <div className="max-w-[83%] mx-auto grid grid-cols-6 gap-4">
          {MOCK_TASK_ENVIRONMENT.map((info, index) => {
            const Icon = ENVIRONMENT_ICONS[index] ?? Shield
            return (
              <div key={info.label} className="flex items-center gap-2">
                <Icon className="w-4 h-4 text-gray-400" />
                <div>
                  <div className="text-xs text-gray-400">{info.label}</div>
                  <div className="text-sm font-medium text-gray-700 truncate">{info.value}</div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Main Tabs */}
      <div className="max-w-[83%] mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="qa">会话性评估模块</TabsTrigger>
            <TabsTrigger value="manual">人工复审</TabsTrigger>
            <TabsTrigger value="stats">测试结果累计</TabsTrigger>
          </TabsList>

          <TabsContent value="qa" className="space-y-6">
            <div className="grid grid-cols-3 gap-6">
              {/* Left: Q&A List */}
              <div className="col-span-2 space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold text-gray-800">问答结果</h2>
                  <div className="flex items-center gap-2 text-sm">
                    <Badge className="bg-green-100 text-green-700">通过 {passedCount}</Badge>
                    <Badge className="bg-red-100 text-red-700">未通过 {failedCount}</Badge>
                  </div>
                </div>

                {MOCK_TASK_QA_SAMPLES.map((qa) => (
                  <Card
                    key={qa.id}
                    className={`p-6 ${qa.status === '未通过' ? 'border-2 border-red-200' : ''}`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-gray-100 text-gray-600 text-xs">{qa.category}</Badge>
                        <Badge
                          className={`text-xs ${
                            qa.status === '通过'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {qa.status}
                        </Badge>
                      </div>
                    </div>

                    {/* Question */}
                    <div className="mb-4">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                          <User className="w-4 h-4 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-700 mb-1">用户提问</div>
                          <div className="text-sm text-gray-600 leading-relaxed">{qa.question}</div>
                        </div>
                      </div>
                    </div>

                    {/* Answer */}
                    <div className="mb-4">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
                          <Bot className="w-4 h-4 text-purple-600" />
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-700 mb-1">模型回答</div>
                          <div className="text-sm text-gray-600 leading-relaxed">{qa.answer}</div>
                        </div>
                      </div>
                    </div>

                    {/* Risk Info */}
                    {qa.risk && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertTriangle className="w-4 h-4 text-red-600" />
                          <span className="font-semibold text-red-700 text-sm">风险描述</span>
                        </div>
                        <p className="text-sm text-gray-700 mb-3">{qa.risk.reason}</p>

                        <div className="bg-white rounded-lg p-3 border border-red-100">
                          <div className="flex items-center gap-2 mb-2">
                            <FileText className="w-4 h-4 text-blue-600" />
                            <span className="font-semibold text-gray-700 text-sm">法规依据</span>
                          </div>
                          <p className="text-sm text-gray-600 leading-relaxed">
                            {qa.risk.regulation}
                          </p>
                        </div>
                      </div>
                    )}
                  </Card>
                ))}
              </div>

              {/* Right: Analysis */}
              <div className="space-y-4">
                <Card className="p-6">
                  <h3 className="font-bold text-gray-800 mb-4">结果分析</h3>

                  <div className="space-y-4">
                    <div>
                      <div className="text-sm text-gray-500 mb-1">总体通过率</div>
                      <div className="text-3xl font-bold text-blue-600">
                        {((passedCount / MOCK_TASK_QA_SAMPLES.length) * 100).toFixed(1)}%
                      </div>
                    </div>

                    <div className="h-px bg-gray-200" />

                    <div>
                      <div className="text-sm text-gray-500 mb-2">分类统计</div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">通过</span>
                          <span className="font-medium text-green-600">{passedCount} 条</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">未通过</span>
                          <span className="font-medium text-red-600">{failedCount} 条</span>
                        </div>
                      </div>
                    </div>

                    <div className="h-px bg-gray-200" />

                    <div>
                      <div className="text-sm text-gray-500 mb-2">风险分布</div>
                      <div className="space-y-2">
                        {(['高风险', '中风险', '低风险'] as const).map((level) => {
                          const count = MOCK_TASK_QA_SAMPLES.filter(
                            (qa) => qa.risk?.level === level,
                          ).length
                          return (
                            <div key={level} className="flex items-center justify-between text-sm">
                              <span className="text-gray-600">{level}</span>
                              <span className="font-medium">{count} 条</span>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 bg-amber-50 border-amber-200">
                  <h3 className="font-semibold text-amber-800 mb-2 flex items-center">
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    合规建议
                  </h3>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    检测到{failedCount}
                    条高风险回复，建议针对性加强内容过滤和安全审核机制，确保符合相关法律法规要求。
                  </p>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="manual">
            <Card className="p-8 text-center">
              <Shield className="w-12 h-12 text-blue-500 mx-auto mb-4" />
              <h3 className="font-bold text-gray-800 mb-2">人工复审</h3>
              <p className="text-gray-500 text-sm">人工复审功能开发中...</p>
            </Card>
          </TabsContent>

          <TabsContent value="stats">
            <Card className="p-6">
              <h3 className="font-bold text-gray-800 mb-4">测试结果统计</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="px-4 py-3 text-left text-xs text-gray-500">评测维度</th>
                      <th className="px-4 py-3 text-left text-xs text-gray-500">方法</th>
                      <th className="px-4 py-3 text-left text-xs text-gray-500">数据集</th>
                      <th className="px-4 py-3 text-left text-xs text-gray-500">样本总数</th>
                      <th className="px-4 py-3 text-left text-xs text-gray-500">不通过数</th>
                      <th className="px-4 py-3 text-left text-xs text-gray-500">攻击成功率</th>
                      <th className="px-4 py-3 text-left text-xs text-gray-500">通过率</th>
                      <th className="px-4 py-3 text-left text-xs text-gray-500">误报率</th>
                    </tr>
                  </thead>
                  <tbody>
                    {MOCK_TASK_STATS.map((row) => (
                      <tr key={`${row.dimension}-${row.method}`} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-3 text-gray-700">{row.dimension}</td>
                        <td className="px-4 py-3 text-gray-600">{row.method}</td>
                        <td className="px-4 py-3 text-gray-600">{row.dataset}</td>
                        <td className="px-4 py-3 text-gray-600">{row.total}</td>
                        <td className="px-4 py-3 text-gray-600">{row.failed}</td>
                        <td className="px-4 py-3 text-gray-600">{row.attackSuccessRate}</td>
                        <td className="px-4 py-3 text-green-600 font-medium">{row.passRate}</td>
                        <td className="px-4 py-3 text-gray-600">{row.falsePositiveRate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
