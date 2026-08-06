import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Checkbox } from './ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import {
  Plus, Minus, CheckCircle2, AlertTriangle, Lock, Clock,
  FileText, Eye, Crown, Bot, Network, Shield, Wrench, Users
} from 'lucide-react';
import { useUser, EvalTask, MyModel } from '../context/UserContext';
import { toast } from 'sonner';

type PricingPlan = 'free' | 'paid';
type AgentType = 'single' | 'multi';
type ModelSource = 'builtin' | 'custom_new' | 'my_models';

const BUILTIN_MODELS = [
  'Qwen2.5-7B-Instruct', 'Qwen2.5-14B-Instruct', 'ChatGLM4-9B',
  'LLaMA-2-13B-Chat', 'ChatGPT-3.5-turbo', 'DeepSeek-V3', 'Claude-3.5-Sonnet',
];

const EVAL_MODULES = [
  {
    id: 'intrinsic',
    icon: Shield,
    name: '内生安全评估模块',
    desc: '评测智能体自身的内在安全性与鲁棒性',
    subs: ['对抗样本鲁棒性', '越狱攻击防护', '角色扮演滥用检测', '系统提示泄露'],
  },
  {
    id: 'content',
    icon: FileText,
    name: '内容生成评估模块',
    desc: '评测智能体生成内容的安全合规性',
    subs: ['有害内容生成检测', '虚假信息传播', '违规内容识别', '合规性自检'],
  },
  {
    id: 'privacy',
    icon: Lock,
    name: '隐私安全评估模块',
    desc: '评测智能体对用户隐私数据的处理安全性',
    subs: ['个人信息泄露检测', '敏感数据处理合规', '数据最小化原则验证', '隐私攻击抵御'],
  },
  {
    id: 'tool',
    icon: Wrench,
    name: '工具安全评估模块',
    desc: '评测智能体在工具调用过程中的安全行为',
    subs: ['工具恶意调用检测', 'MCP偏好测试', '第三方插件安全审计', '权限越界检测'],
  },
  {
    id: 'collab',
    icon: Users,
    name: '协同安全评估模块',
    desc: '评测多智能体协同场景下的系统性安全风险',
    subs: ['渗透测试', '传播测试', '级联攻击防护', '多体一致性验证'],
  },
];

interface Props {
  open: boolean;
  onClose: () => void;
}

export function AgentEvalModal({ open, onClose }: Props) {
  const { user, addTask, addModel } = useUser();
  const [taskName, setTaskName] = useState('');
  const [agentType, setAgentType] = useState<AgentType>('single');
  const [modelSource, setModelSource] = useState<ModelSource>('builtin');
  const [selectedBuiltinModel, setSelectedBuiltinModel] = useState('');
  const [selectedMyModel, setSelectedMyModel] = useState('');
  const [customModelName, setCustomModelName] = useState('');
  const [customApiBase, setCustomApiBase] = useState('');
  const [customApiKey, setCustomApiKey] = useState('');
  const [sampleCount, setSampleCount] = useState(50);
  const [selectedModules, setSelectedModules] = useState<string[]>(['intrinsic', 'tool']);
  const [pricingPlan, setPricingPlan] = useState<PricingPlan>('paid');

  const toggleModule = (id: string) => {
    setSelectedModules(prev =>
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
  };

  const resetForm = () => {
    setTaskName('');
    setAgentType('single');
    setModelSource('builtin');
    setSelectedBuiltinModel('');
    setSelectedMyModel('');
    setCustomModelName('');
    setCustomApiBase('');
    setCustomApiKey('');
    setSampleCount(50);
    setSelectedModules(['intrinsic', 'tool']);
    setPricingPlan('paid');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = () => {
    if (!taskName.trim()) {
      toast.error('请填写任务名称');
      return;
    }

    const modelName = modelSource === 'builtin'
      ? selectedBuiltinModel
      : modelSource === 'my_models'
        ? user.myModels.find(m => m.id === selectedMyModel)?.name || ''
        : customModelName;

    if (!modelName) {
      toast.error('请选择或填写被测 Agent 模型');
      return;
    }

    if (selectedModules.length === 0) {
      toast.error('请至少选择一个评测模块');
      return;
    }

    if (modelSource === 'custom_new' && customModelName && customApiBase) {
      const newModel: MyModel = {
        id: `m_${Date.now()}`,
        name: customModelName,
        type: '自定义',
        apiBase: customApiBase,
        modelId: customModelName,
        createdAt: new Date().toISOString().split('T')[0],
      };
      addModel(newModel);
    }

    const moduleNames = selectedModules
      .map(id => EVAL_MODULES.find(m => m.id === id)?.name || id)
      .join('、');

    const newTask: EvalTask = {
      id: `t_${Date.now()}`,
      name: taskName,
      model: modelName,
      modelType: modelSource === 'builtin' ? '开源' : '自定义',
      evalSet: `智能体安全评测 · ${agentType === 'single' ? '单智能体' : '多智能体'}`,
      evalType: '智能体安全评测',
      status: pricingPlan === 'free' ? '排队中' : '评测中',
      score: null,
      createdAt: new Date().toLocaleString('zh-CN'),
      plan: pricingPlan,
    };

    addTask(newTask);
    toast.success('智能体安全评测任务创建成功！', {
      description: `评测模块：${moduleNames}。${pricingPlan === 'free' ? '免费任务优先级较低，请耐心等待。' : '任务正在处理中，预计30分钟内完成。'}`,
    });
    handleClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between z-10">
          <DialogHeader className="space-y-0">
            <DialogTitle className="text-base flex items-center gap-2">
              <Bot className="w-4 h-4 text-violet-600" />
              新建智能体安全评测任务
            </DialogTitle>
          </DialogHeader>
          <Badge className="bg-violet-50 text-violet-700 border-violet-200 text-xs">智能体安全评测</Badge>
        </div>

        <div className="px-6 py-5 space-y-6">
          {/* Task Name */}
          <div className="space-y-1.5">
            <Label className="text-sm font-medium">
              <span className="text-red-500">*</span> 任务名称
            </Label>
            <Input
              placeholder="请输入任务名称，如：Agent安全测试-20260508"
              value={taskName}
              onChange={e => setTaskName(e.target.value)}
            />
          </div>

          {/* Agent Type */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">
              <span className="text-red-500">*</span> 智能体类型
            </Label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setAgentType('single')}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  agentType === 'single'
                    ? 'border-violet-400 bg-violet-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Bot className={`w-5 h-5 ${agentType === 'single' ? 'text-violet-600' : 'text-gray-500'}`} />
                  <span className="font-medium text-sm">单智能体</span>
                  {agentType === 'single' && <CheckCircle2 className="w-4 h-4 text-violet-500 ml-auto" />}
                </div>
                <p className="text-xs text-gray-500">评测单个 Agent 的安全行为与风险</p>
              </button>
              <button
                onClick={() => setAgentType('multi')}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  agentType === 'multi'
                    ? 'border-violet-400 bg-violet-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Network className={`w-5 h-5 ${agentType === 'multi' ? 'text-violet-600' : 'text-gray-500'}`} />
                  <span className="font-medium text-sm">多智能体</span>
                  {agentType === 'multi' && <CheckCircle2 className="w-4 h-4 text-violet-500 ml-auto" />}
                </div>
                <p className="text-xs text-gray-500">评测多 Agent 协同的系统级安全</p>
              </button>
            </div>
          </div>

          {/* Model Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">
              <span className="text-red-500">*</span> 被测 Agent 模型
            </Label>
            <RadioGroup
              value={modelSource}
              onValueChange={(v: ModelSource) => setModelSource(v)}
              className="flex gap-6"
            >
              <div className="flex items-center gap-1.5">
                <RadioGroupItem value="builtin" id="a-builtin" />
                <Label htmlFor="a-builtin" className="text-sm cursor-pointer">内置模型</Label>
              </div>
              <div className="flex items-center gap-1.5">
                <RadioGroupItem value="custom_new" id="a-custom" />
                <Label htmlFor="a-custom" className="text-sm cursor-pointer">自定义 API</Label>
              </div>
              <div className="flex items-center gap-1.5">
                <RadioGroupItem value="my_models" id="a-mymodels" />
                <Label htmlFor="a-mymodels" className="text-sm cursor-pointer">我的模型</Label>
              </div>
            </RadioGroup>

            {modelSource === 'builtin' && (
              <Select value={selectedBuiltinModel} onValueChange={setSelectedBuiltinModel}>
                <SelectTrigger>
                  <SelectValue placeholder="请选择内置大模型" />
                </SelectTrigger>
                <SelectContent>
                  {BUILTIN_MODELS.map(m => (
                    <SelectItem key={m} value={m}>{m}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {modelSource === 'custom_new' && (
              <div className="border rounded-lg p-4 space-y-3 bg-gray-50">
                <div>
                  <Label className="text-xs text-gray-600 mb-1 block">Agent 名称</Label>
                  <Input placeholder="如：My-Agent-API" value={customModelName} onChange={e => setCustomModelName(e.target.value)} />
                </div>
                <div>
                  <Label className="text-xs text-gray-600 mb-1 block">API Base URL</Label>
                  <Input placeholder="如：https://api.example.com/v1" value={customApiBase} onChange={e => setCustomApiBase(e.target.value)} />
                </div>
                <div>
                  <Label className="text-xs text-gray-600 mb-1 block">API Key</Label>
                  <Input type="password" placeholder="请输入 API Key" value={customApiKey} onChange={e => setCustomApiKey(e.target.value)} />
                </div>
              </div>
            )}

            {modelSource === 'my_models' && (
              <div className="border rounded-lg bg-gray-50 p-2 space-y-1.5 max-h-40 overflow-y-auto">
                {user.myModels.length === 0 ? (
                  <div className="py-6 text-center text-gray-400 text-sm">
                    <Bot className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                    <p className="text-xs">暂无模型，请先添加自定义模型</p>
                  </div>
                ) : user.myModels.map(m => (
                  <button
                    key={m.id}
                    onClick={() => setSelectedMyModel(m.id)}
                    className={`w-full text-left p-3 rounded-lg border transition-all ${
                      selectedMyModel === m.id
                        ? 'border-violet-400 bg-violet-50'
                        : 'border-transparent bg-white hover:border-gray-200'
                    }`}
                  >
                    <div className="text-sm font-medium">{m.name}</div>
                    <div className="text-xs text-gray-400">{m.apiBase}</div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Sample Count */}
          <div className="space-y-1.5">
            <Label className="text-sm font-medium">
              <span className="text-red-500">*</span> 测试用例数量
              {pricingPlan === 'free' && (
                <span className="ml-2 text-xs text-orange-500">(免费限50条)</span>
              )}
            </Label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSampleCount(Math.max(10, sampleCount - 10))}
                className="w-8 h-8 rounded border flex items-center justify-center hover:bg-gray-50"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <Input
                type="number"
                value={pricingPlan === 'free' ? Math.min(sampleCount, 50) : sampleCount}
                onChange={e => setSampleCount(Number(e.target.value))}
                className="w-24 text-center"
                max={pricingPlan === 'free' ? 50 : 5000}
                min={10}
              />
              <button
                onClick={() => setSampleCount(Math.min(pricingPlan === 'free' ? 50 : 5000, sampleCount + 10))}
                className="w-8 h-8 rounded border flex items-center justify-center hover:bg-gray-50"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
              <span className="text-xs text-gray-400">条用例</span>
            </div>
          </div>

          {/* Evaluation Modules */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">
              <span className="text-red-500">*</span> 评测维度（可多选）
            </Label>
            <div className="space-y-2">
              {EVAL_MODULES.map(mod => {
                const Icon = mod.icon;
                const isSelected = selectedModules.includes(mod.id);
                return (
                  <label
                    key={mod.id}
                    className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-violet-400 bg-violet-50'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => toggleModule(mod.id)}
                      className="mt-0.5"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <Icon className={`w-4 h-4 ${isSelected ? 'text-violet-600' : 'text-gray-500'}`} />
                        <span className="text-sm font-medium text-gray-800">{mod.name}</span>
                      </div>
                      <p className="text-xs text-gray-500 mb-2">{mod.desc}</p>
                      <div className="flex flex-wrap gap-1">
                        {mod.subs.map(sub => (
                          <span key={sub} className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded">
                            {sub}
                          </span>
                        ))}
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t px-6 py-4 flex items-center justify-between">
          <Button variant="outline" onClick={handleClose}>取消</Button>
          <Button
            className="bg-violet-600 hover:bg-violet-700 text-white"
            onClick={handleSubmit}
          >
            <CheckCircle2 className="w-4 h-4 mr-1.5" />
            创建评测任务
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
