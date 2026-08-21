import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Checkbox } from './ui/checkbox';
import {
  ChevronRight, ChevronLeft, X, CheckCircle2,
  Shield, Zap, Lock, Clock, FileText, Eye, Star, Globe,
  Bot, Image as ImageIcon, AlertTriangle, Info, Crown, Sparkles
} from 'lucide-react';
import { useUser, EvalTask, MyModel } from '../context/UserContext';
import { toast } from 'sonner';

type TaskType = 'llm' | 'multimodal';
type PageType = 'safety' | 'llm';
type ModelSource = 'custom_new' | 'my_models';
type PricingPlan = 'free' | 'paid';
type PerformanceGroup = '单模态' | '多模态';
type PerformanceCapability = '生成能力' | '理解能力';
type SafetyModule = '鲁棒性评估' | '隐私性评估' | '安全性评估' | '偏见性评估';

interface SafetyConfig {
  module: SafetyModule;
  test: string;
  datasets: string[];
  methods: string[];
}

const SAFETY_CONFIGS: SafetyConfig[] = [
  {
    module: '鲁棒性评估',
    test: '越狱测试',
    datasets: ['有害内容', '成人内容', '非法活动', '欺诈活动', '侵犯隐私', '政府决策'],
    methods: ['组合越狱攻击', '迭代式提示优化', '树搜索引导攻击', '模糊测试攻击', '可解释优化攻击', '黑盒扰动搜索', '病毒式传播', '学术研究伪装', '语言学伪装', '哲学思辨伪装', '角色扮演攻击', '多轮诱导', '代码混淆', 'XML封装', 'ASCII隐藏嵌入', 'URL隐藏嵌入'],
  },
  {
    module: '鲁棒性评估',
    test: '幻觉测试',
    datasets: ['虚构引用', '事实性错误', '虚假因果', '逻辑矛盾', '数值偏差', '过度生成', '语义漂移', '时序混乱'],
    methods: ['基准测试'],
  },
  {
    module: '鲁棒性评估',
    test: '后门测试',
    datasets: ['法律', '数学', '逻辑', '军事'],
    methods: ['隐藏后门注入攻击'],
  },
  {
    module: '隐私性评估',
    test: '训练数据泄露',
    datasets: ['训练数据泄露数据集'],
    methods: ['上下文注入攻击'],
  },
  {
    module: '隐私性评估',
    test: 'RAG泄露测试',
    datasets: ['RAG隐私数据泄露数据集'],
    methods: ['指令劫持攻击'],
  },
  {
    module: '隐私性评估',
    test: '提示词泄露测试',
    datasets: ['提示词泄露测试数据集'],
    methods: ['提示词逆向攻击'],
  },
  {
    module: '安全性评估',
    test: '敏感性内容测试',
    datasets: ['电话信息'],
    methods: ['角色扮演攻击'],
  },
  ...['侵权内容测试', '毒性内容测试', '违反社会主义核心价值观内容测试', '歧视性内容测试', '商业违法违规内容测试', '侵犯他人合法权益内容测试', '无法满足特定服务类型的安全需求测试'].map(test => ({
    module: '安全性评估' as SafetyModule,
    test,
    datasets: ['平台按测试项匹配内置数据集'],
    methods: ['平台按测试项匹配测试方法'],
  })),
  {
    module: '偏见性评估',
    test: '偏见性评估测试',
    datasets: ['性别偏见', '种族偏见', '身材偏见', '职业偏见', '年龄偏见', '宗教偏见', '身体能力偏见'],
    methods: ['基准测试'],
  },
];

interface PerformanceConfig {
  id: string;
  group: PerformanceGroup;
  label: string;
  capability: PerformanceCapability;
  tests: string[];
  datasets: string[];
  methods: string[];
}

const PERFORMANCE_CONFIGS: PerformanceConfig[] = [
  { id: 'image', group: '单模态', label: '图像', capability: '理解能力', tests: ['静态图像分类', '静态图像分割', '目标检测', '动态图像分类', '行为识别'], datasets: ['ImageNet'], methods: ['静态图像分类'] },
  { id: 'text', group: '单模态', label: '文本', capability: '生成能力', tests: ['半结构化数据测试', '摘要总结测试', '代码生成测试', '文本翻译测试', '文本续写测试', '文本扩写测试', '文本改写测试'], datasets: ['表格类数据测试'], methods: ['基准测试'] },
  { id: 'text', group: '单模态', label: '文本', capability: '理解能力', tests: ['文本分类', '信息抽取能力', '数学推理能力', '因果推理能力', '行为识别', '任务分解测试', '文本问答测试', '多轮对话测试', '代码理解测试', '长文本对话测试'], datasets: ['文本分类测试'], methods: ['基准测试'] },
  { id: 'audio', group: '单模态', label: '音频', capability: '理解能力', tests: ['声纹识别', '音频问答', '环境音分类'], datasets: ['CN-Celeb'], methods: ['声纹识别'] },
  { id: 'image-text', group: '多模态', label: '图文', capability: '生成能力', tests: ['文本生成图片', '图片生成文本描述', '文本生成视频', '视频生成文本描述'], datasets: ['GenEval2'], methods: ['文本生成图片'] },
  { id: 'image-text', group: '多模态', label: '图文', capability: '理解能力', tests: ['图文检索', '静态图像问答', '视觉空间关系', '视觉语言推理', '视觉蕴含', '视频检索', '视频问答', '图表推理'], datasets: ['Winoground'], methods: ['图文检索'] },
  { id: 'text-audio', group: '多模态', label: '文音', capability: '生成能力', tests: ['语音合成', '语音识别', '语音翻译'], datasets: ['Emilia'], methods: ['F5-TTS'] },
  { id: 'text-audio', group: '多模态', label: '文音', capability: '理解能力', tests: ['文音检索'], datasets: ['Clotho'], methods: ['文音检索'] },
  { id: 'image-audio', group: '多模态', label: '图音', capability: '理解能力', tests: ['视频异常检测'], datasets: ['UCF-Crime'], methods: ['视频异常检测'] },
  { id: 'image-text-audio', group: '多模态', label: '图文音', capability: '生成能力', tests: ['文本生成有声视频', '有声视频生成文本描述'], datasets: ['AVGen-Bench'], methods: ['有声视频生成'] },
  { id: 'image-text-audio', group: '多模态', label: '图文音', capability: '理解能力', tests: ['有声视频检索', '有声视频问答'], datasets: ['VALOR-32K'], methods: ['有声视频检索'] },
];

const PERFORMANCE_MODALITIES: Record<PerformanceGroup, Array<{ id: string; label: string }>> = {
  单模态: [
    { id: 'image', label: '图像' },
    { id: 'text', label: '文本' },
    { id: 'audio', label: '音频' },
  ],
  多模态: [
    { id: 'image-text', label: '图文' },
    { id: 'text-audio', label: '文音' },
    { id: 'image-audio', label: '图音' },
    { id: 'image-text-audio', label: '图文音' },
  ],
};

const PRESET_SCENES_SAFETY = [
  {
    id: 'general',
    name: '通用安全合规评测',
    desc: '覆盖有害内容、虚构引用、性别偏见等通用安全维度',
    tags: ['有害内容', '虚构引用', '隐私安全', '偏见歧视'],
    datasets: ['通用安全数据集 (2000条)', '偏见评测集 (800条)'],
    icon: Shield,
    color: 'blue',
  },
  {
    id: 'gov',
    name: '政务舆情安全评测',
    desc: '专为政府、党政机构场景设计，检测政治敏感、舆论引导等风险',
    tags: ['政治敏感', '舆论引导', '违规信息', '涉密风险'],
    datasets: ['政务安全数据集 (1500条)', '舆情风险集 (600条)'],
    icon: Globe,
    color: 'green',
  },
  {
    id: 'finance',
    name: '金融风控专项评测',
    desc: '面向银行、保险、证券等金融场景，重点评测合规与风险',
    tags: ['金融欺诈', '误导销售', '违规建议', '数据合规'],
    datasets: ['金融风控数据集 (1800条)', '合规检测集 (900条)'],
    icon: Zap,
    color: 'orange',
  },
];

const PRESET_SCENES_LLM = [
  {
    id: 'general_perf',
    name: '通用能力测评',
    desc: '评测模型生成、理解、推理等核心通用能力',
    tags: ['文本生成', '信息抽取', '逻辑推理', '知识问答'],
    datasets: ['综合能力数据集 (3000条)', '推理测试集 (1200条)'],
    icon: Star,
    color: 'blue',
  },
  {
    id: 'code',
    name: '代码能力专项',
    desc: '评测模型在代码生成、补全、调试等方面的专业能力',
    tags: ['代码生成', '代码补全', '代码调试', '算法能力'],
    datasets: ['代码能力数据集 (2000条)', '算法题库 (800条)'],
    icon: Zap,
    color: 'purple',
  },
  {
    id: 'domain',
    name: '垂直领域知识',
    desc: '针对医疗、法律、教育等垂直领域的专业知识评测',
    tags: ['医疗知识', '法律理解', '教育辅导', '专业问答'],
    datasets: ['垂直领域数据集 (2500条)', '专业知识集 (1000条)'],
    icon: Globe,
    color: 'green',
  },
];

const SAFETY_DIMENSIONS = [
  { id: 'harmful', name: '有害内容', desc: '检测有害、违法违规内容生成' },
  { id: 'fiction', name: '虚构引用', desc: '评估幻觉与虚假信息生成' },
  { id: 'privacy', name: '隐私安全', desc: '检测隐私泄露与数据安全' },
  { id: 'bias', name: '偏见歧视', desc: '评估性别、种族等偏见' },
  { id: 'adversarial', name: '对抗攻击', desc: '测试对抗样本鲁棒性' },
  { id: 'logic', name: '逻辑谬误', desc: '检测逻辑错误与推理缺陷' },
];

const LLM_DIMENSIONS = [
  { id: 'generation', name: '生成能力', subs: ['半结构化数据测试', '摘要总结测试', '文本翻译测试', '文本续写测试', '文本扩写测试', '文本改写测试'] },
  { id: 'understanding', name: '理解能力', subs: ['语义理解', '情感分析', '文本分类', '信息抽取'] },
  { id: 'reasoning', name: '推理能力', subs: ['数学推理', '逻辑推理', '常识推理'] },
  { id: 'coding', name: '代码能力', subs: ['代码生成测试', '代码理解测试'] },
];

const colorMap: Record<string, string> = {
  blue: 'bg-blue-50 border-blue-200 text-blue-700',
  green: 'bg-emerald-50 border-emerald-200 text-emerald-700',
  orange: 'bg-orange-50 border-orange-200 text-orange-700',
  purple: 'bg-purple-50 border-purple-200 text-purple-700',
};

const iconBgMap: Record<string, string> = {
  blue: 'bg-blue-100 text-blue-600',
  green: 'bg-emerald-100 text-emerald-600',
  orange: 'bg-orange-100 text-orange-600',
  purple: 'bg-purple-100 text-purple-600',
};

interface Props {
  open: boolean;
  onClose: () => void;
  pageType: PageType;
}

export function TaskCreationModal({ open, onClose, pageType }: Props) {
  const { user, isLoggedIn, addTask, addModel } = useUser();
  const [step, setStep] = useState<'type' | 'config' | 'preview'>('config');
  const [taskType, setTaskType] = useState<TaskType>('llm');
  const [taskName, setTaskName] = useState('');
  const [modelSource, setModelSource] = useState<ModelSource>('custom_new');
  const [selectedMyModel, setSelectedMyModel] = useState('');
  const [customModelName, setCustomModelName] = useState('');
  const [customApiBase, setCustomApiBase] = useState('');
  const [customApiKey, setCustomApiKey] = useState('');
  const [selectedScene, setSelectedScene] = useState('');
  const [customScenario, setCustomScenario] = useState('');
  const [pricingPlan, setPricingPlan] = useState<PricingPlan>('paid');
  const [notifyEmail, setNotifyEmail] = useState(user.email || '');
  const [enableEmail, setEnableEmail] = useState(true);
  const [performanceGroup, setPerformanceGroup] = useState<PerformanceGroup>('单模态');
  const [performanceModality, setPerformanceModality] = useState('text');
  const [performanceCapability, setPerformanceCapability] = useState<PerformanceCapability>('生成能力');
  const [performanceTest, setPerformanceTest] = useState('半结构化数据测试');
  const [performanceDataset, setPerformanceDataset] = useState('表格类数据测试');
  const [performanceMethod, setPerformanceMethod] = useState('基准测试');
  const [safetyModule, setSafetyModule] = useState<SafetyModule>('鲁棒性评估');
  const [safetyTest, setSafetyTest] = useState('越狱测试');
  const [safetyDataset, setSafetyDataset] = useState('有害内容');
  const [safetyMethod, setSafetyMethod] = useState('组合越狱攻击');
  const [sampleCount, setSampleCount] = useState(1);
  const [smartSelection, setSmartSelection] = useState(false);
  const [electronicFence, setElectronicFence] = useState(false);

  const presetScenes = pageType === 'safety' ? PRESET_SCENES_SAFETY : PRESET_SCENES_LLM;
  const resetForm = () => {
    setStep('config');
    setTaskType('llm');
    setTaskName('');
    setModelSource('custom_new');
    setSelectedMyModel('');
    setCustomModelName('');
    setCustomApiBase('');
    setCustomApiKey('');
    setSelectedScene('');
    setCustomScenario('');
    setPricingPlan('paid');
    setPerformanceGroup('单模态');
    setPerformanceModality('text');
    setPerformanceCapability('生成能力');
    setPerformanceTest('半结构化数据测试');
    setPerformanceDataset('表格类数据测试');
    setPerformanceMethod('基准测试');
    setSafetyModule('鲁棒性评估');
    setSafetyTest('越狱测试');
    setSafetyDataset('有害内容');
    setSafetyMethod('组合越狱攻击');
    setSampleCount(1);
    setSmartSelection(false);
    setElectronicFence(false);
  };

  const applyPerformanceConfig = (config: PerformanceConfig) => {
    setPerformanceModality(config.id);
    setPerformanceCapability(config.capability);
    setPerformanceTest(config.tests[0]);
    setPerformanceDataset(config.datasets[0]);
    setPerformanceMethod(config.methods[0]);
  };

  const changePerformanceGroup = (group: PerformanceGroup) => {
    setPerformanceGroup(group);
    const firstModality = PERFORMANCE_MODALITIES[group][0];
    const config = PERFORMANCE_CONFIGS.find(item => item.group === group && item.id === firstModality.id);
    if (config) applyPerformanceConfig(config);
  };

  const changePerformanceModality = (id: string) => {
    const configs = PERFORMANCE_CONFIGS.filter(item => item.group === performanceGroup && item.id === id);
    const preferred = configs.find(item => item.capability === performanceCapability) || configs[0];
    if (preferred) applyPerformanceConfig(preferred);
  };

  const changePerformanceCapability = (capability: PerformanceCapability) => {
    const config = PERFORMANCE_CONFIGS.find(item => item.group === performanceGroup && item.id === performanceModality && item.capability === capability);
    if (config) applyPerformanceConfig(config);
  };

  const activePerformanceConfig = PERFORMANCE_CONFIGS.find(
    item => item.group === performanceGroup && item.id === performanceModality && item.capability === performanceCapability
  );
  const activeSafetyConfig = SAFETY_CONFIGS.find(item => item.module === safetyModule && item.test === safetyTest);

  const changeSafetyModule = (module: SafetyModule) => {
    setSafetyModule(module);
    const config = SAFETY_CONFIGS.find(item => item.module === module);
    if (config) {
      setSafetyTest(config.test);
      setSafetyDataset(config.datasets[0]);
      setSafetyMethod(config.methods[0]);
    }
  };

  const changeSafetyTest = (test: string) => {
    const config = SAFETY_CONFIGS.find(item => item.module === safetyModule && item.test === test);
    if (!config) return;
    setSafetyTest(test);
    setSafetyDataset(config.datasets[0]);
    setSafetyMethod(config.methods[0]);
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
    const modelName = modelSource === 'my_models'
        ? user.myModels.find(m => m.id === selectedMyModel)?.name || selectedMyModel
        : customModelName;

    if (!modelName) {
      toast.error('请选择或填写测试大模型');
      return;
    }

    // If adding a new custom model, save it to my models
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

    const evalTypeName: EvalTask['evalType'] = pageType === 'llm'
      ? '大模型评测'
      : taskType === 'multimodal' ? '多模态大模型安全评测' : '大模型安全评测';

    const scenarioDescription = customScenario.trim();
    const presetSceneName = presetScenes.find(s => s.id === selectedScene)?.name || '';
    if (!selectedScene && !scenarioDescription) {
      toast.error('请选择评测场景或填写评测诉求');
      return;
    }
    const sceneName = [presetSceneName, scenarioDescription ? `补充需求：${scenarioDescription}` : '']
      .filter(Boolean)
      .join('；');

    const newTask: EvalTask = {
      id: `t_${Date.now()}`,
      name: taskName,
      model: modelName,
      modelType: '自定义',
      evalSet: sceneName,
      evalType: evalTypeName,
      status: '处理中',
      score: null,
      createdAt: new Date().toLocaleString('zh-CN'),
      plan: pricingPlan,
      requirement: scenarioDescription || presetSceneName,
      configSummary: `评测场景：${presetSceneName || '自定义需求'}；服务方案：${pricingPlan === 'paid' ? '专业版' : '基础版'}`,
    };

    addTask(newTask);
    toast.success('任务已提交，等待平台受理', {
      description: '技术团队将根据您填写的场景和模型配置开展正式评测，完成后推送报告至资源中心。',
    });
    handleClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-0">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between z-10">
          <DialogHeader className="space-y-0">
            <DialogTitle className="text-base">新建测评任务</DialogTitle>
            <DialogDescription className="sr-only">填写测试模型、评测场景与具体诉求后创建评测任务。</DialogDescription>
          </DialogHeader>
          <span className="text-xs font-medium text-blue-600">填写任务信息</span>
        </div>

        <div className="px-6 py-5">
          {/* Step 1: Type Selection (safety only) */}
          {step === 'type' && pageType === 'safety' && (
            <div>
              <p className="text-sm text-gray-500 mb-6 text-center">请选择本次测评任务的类型</p>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => { setTaskType('llm'); setStep('config'); }}
                  className="border-2 border-gray-200 hover:border-blue-400 rounded-xl p-8 flex flex-col items-center gap-4 transition-all hover:bg-blue-50 group"
                >
                  <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                    <Bot className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-gray-800">大语言模型评测</div>
                    <div className="text-xs text-gray-500 mt-1">评测文本模型安全性与合规性</div>
                  </div>
                </button>
                <button
                  onClick={() => { setTaskType('multimodal'); setStep('config'); }}
                  className="border-2 border-gray-200 hover:border-blue-400 rounded-xl p-8 flex flex-col items-center gap-4 transition-all hover:bg-blue-50 group"
                >
                  <div className="w-16 h-16 rounded-2xl bg-indigo-100 flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
                    <ImageIcon className="w-8 h-8 text-indigo-600" />
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-gray-800">多模态模型评测</div>
                    <div className="text-xs text-gray-500 mt-1">评测图文多模态模型安全性</div>
                  </div>
                </button>
              </div>
              <div className="mt-6 flex justify-end">
                <Button variant="outline" onClick={handleClose}>取消</Button>
              </div>
            </div>
          )}

          {/* Step 2: Task Configuration */}
          {step === 'config' && (
            <div className="space-y-6">
              {/* Task Name */}
              <div className="space-y-1.5">
                <Label className="text-sm font-medium">
                  <span className="text-red-500">*</span> 任务名称
                </Label>
                <Input
                  placeholder="请输入任务名称"
                  value={taskName}
                  onChange={e => setTaskName(e.target.value)}
                />
              </div>

              {/* Model Selection */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">
                  <span className="text-red-500">*</span> 测试大模型
                </Label>
                <RadioGroup
                  value={modelSource}
                  onValueChange={(v: ModelSource) => setModelSource(v)}
                  className="flex gap-6"
                >
                  <div className="flex items-center gap-1.5">
                    <RadioGroupItem value="custom_new" id="custom_new" />
                    <Label htmlFor="custom_new" className="text-sm cursor-pointer">自定义模型（API）</Label>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <RadioGroupItem value="my_models" id="my_models" />
                    <Label htmlFor="my_models" className="text-sm cursor-pointer">我的模型</Label>
                  </div>
                </RadioGroup>

                {modelSource === 'custom_new' && (
                  <div className="border rounded-lg p-4 space-y-3 bg-gray-50">
                    <div>
                      <Label className="text-xs text-gray-600 mb-1 block">模型名称</Label>
                      <Input placeholder="如：My-GPT-4-API" value={customModelName} onChange={e => setCustomModelName(e.target.value)} />
                    </div>
                    <div>
                      <Label className="text-xs text-gray-600 mb-1 block">API Base URL</Label>
                      <Input placeholder="如：https://api.openai.com/v1" value={customApiBase} onChange={e => setCustomApiBase(e.target.value)} />
                    </div>
                    <div>
                      <Label className="text-xs text-gray-600 mb-1 block">API Key</Label>
                      <Input type="password" placeholder="请输入API Key" value={customApiKey} onChange={e => setCustomApiKey(e.target.value)} />
                    </div>
                    <p className="text-xs text-gray-400">创建后将自动保存至"我的模型"</p>
                  </div>
                )}

                {modelSource === 'my_models' && (
                  <div className="border rounded-lg bg-gray-50">
                    {user.myModels.length === 0 ? (
                      <div className="py-8 text-center text-gray-400 text-sm">
                        <Bot className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                        <p>暂无模型</p>
                        <p className="text-xs mt-1">请先通过"自定义 (新建API)"创建模型</p>
                      </div>
                    ) : (
                      <div className="p-2 space-y-1.5">
                        {user.myModels.map(m => (
                          <button
                            key={m.id}
                            onClick={() => setSelectedMyModel(m.id)}
                            className={`w-full text-left p-3 rounded-lg border transition-all ${
                              selectedMyModel === m.id
                                ? 'border-blue-400 bg-blue-50'
                                : 'border-transparent bg-white hover:border-gray-200'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="text-sm font-medium">{m.name}</div>
                                <div className="text-xs text-gray-400 mt-0.5">{m.apiBase}</div>
                              </div>
                              <Badge variant="outline" className="text-xs">{m.type}</Badge>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Previous-version scenario-based task form */}
              <div className="space-y-3">
                <div>
                  <Label className="text-sm font-medium"><span className="text-red-500">*</span> 评测场景</Label>
                  <p className="mt-1 text-xs text-gray-500">选择最接近本次业务目标的场景，技术团队将据此确认正式评测方案。</p>
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  {presetScenes.map(scene => {
                    const SceneIcon = scene.icon;
                    const selected = selectedScene === scene.id;
                    return (
                      <button
                        key={scene.id}
                        type="button"
                        onClick={() => setSelectedScene(scene.id)}
                        className={`rounded-xl border p-4 text-left transition-all ${selected ? `${colorMap[scene.color]} shadow-sm` : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-sm'}`}
                      >
                        <div className="flex items-center gap-3">
                          <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${iconBgMap[scene.color]}`}><SceneIcon className="h-4 w-4" /></span>
                          <span className="text-sm font-semibold text-gray-800">{scene.name}</span>
                        </div>
                        <p className="mt-3 min-h-9 text-xs leading-5 text-gray-500">{scene.desc}</p>
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {scene.tags.slice(0, 3).map(tag => <span key={tag} className="rounded-full bg-gray-100 px-2 py-1 text-[11px] text-gray-500">{tag}</span>)}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <Label htmlFor="customScenario" className="text-sm font-medium text-gray-800">评测诉求 <span className="text-xs font-normal text-gray-400">（可补充具体业务、关注方向与交付要求）</span></Label>
                <textarea
                  id="customScenario"
                  value={customScenario}
                  onChange={e => setCustomScenario(e.target.value)}
                  maxLength={500}
                  rows={4}
                  placeholder={pageType === 'llm' ? '例如：重点关注中文长文本理解与多轮问答表现，并在报告中标注典型问题样本。' : '例如：重点检查中文业务问答中的提示词攻击、隐私泄露与偏见风险，并提供问题样本说明。'}
                  className="mt-2 w-full resize-y rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm leading-6 text-gray-700 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                />
                <div className="mt-1 text-right text-xs text-gray-400">{customScenario.length}/500</div>
              </div>

              {false ? (<div className="space-y-3">
                <Label className="text-sm font-medium">服务方案</Label>
                <RadioGroup value={pricingPlan} onValueChange={(value: 'free' | 'paid') => setPricingPlan(value)} className="grid gap-3 sm:grid-cols-2">
                  <label className={`cursor-pointer rounded-xl border p-4 transition ${pricingPlan === 'free' ? 'border-blue-400 bg-blue-50' : 'border-gray-200 bg-white hover:border-blue-200'}`}>
                    <div className="flex items-center gap-2"><RadioGroupItem value="free" /><span className="text-sm font-semibold text-gray-800">基础版</span></div>
                    <p className="ml-6 mt-1 text-xs leading-5 text-gray-500">适合初步了解模型表现，提交后由平台确认评测范围。</p>
                  </label>
                  <label className={`cursor-pointer rounded-xl border p-4 transition ${pricingPlan === 'paid' ? 'border-blue-400 bg-blue-50' : 'border-gray-200 bg-white hover:border-blue-200'}`}>
                    <div className="flex items-center gap-2"><RadioGroupItem value="paid" /><span className="text-sm font-semibold text-gray-800">专业版</span><Badge className="bg-blue-600 text-[10px]">推荐</Badge></div>
                    <p className="ml-6 mt-1 text-xs leading-5 text-gray-500">由技术团队结合模型、业务场景与诉求制定正式评测方案。</p>
                  </label>
                </RadioGroup>
              </div>) : null}

              {/* Retained platform configuration data; previous-version dialog keeps it hidden. */}
              {false ? ((pageType === 'llm' && activePerformanceConfig) && (
                <div className="space-y-5 rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50/70 to-white p-5">
                  <div>
                    <Label className="text-sm font-medium">
                      <span className="text-red-500">*</span> 数据模态
                    </Label>
                    <p className="mt-1 text-xs text-gray-500">先选择单模态或多模态，再选择本次评测的数据组合。</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 rounded-xl bg-white p-1.5 shadow-sm ring-1 ring-blue-100">
                    {(['单模态', '多模态'] as PerformanceGroup[]).map(group => (
                      <button
                        key={group}
                        type="button"
                        onClick={() => changePerformanceGroup(group)}
                        className={`rounded-lg px-4 py-2.5 text-sm font-medium transition ${performanceGroup === group ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 hover:bg-blue-50'}`}
                      >
                        {group}
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {PERFORMANCE_MODALITIES[performanceGroup].map(modality => (
                      <button
                        key={modality.id}
                        type="button"
                        onClick={() => changePerformanceModality(modality.id)}
                        className={`rounded-xl border px-3 py-3 text-sm font-medium transition ${performanceModality === modality.id ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-sm' : 'border-gray-200 bg-white text-gray-600 hover:border-blue-300'}`}
                      >
                        {modality.label}
                      </button>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      <span className="text-red-500">*</span> 能力类型
                    </Label>
                    <div className="grid grid-cols-2 gap-3">
                      {(['生成能力', '理解能力'] as PerformanceCapability[]).map(capability => {
                        const supported = PERFORMANCE_CONFIGS.some(item => item.group === performanceGroup && item.id === performanceModality && item.capability === capability);
                        return (
                          <button
                            key={capability}
                            type="button"
                            disabled={!supported}
                            onClick={() => changePerformanceCapability(capability)}
                            className={`rounded-xl border px-4 py-3 text-left transition ${performanceCapability === capability ? 'border-blue-500 bg-white text-blue-700 shadow-sm' : supported ? 'border-gray-200 bg-white text-gray-600 hover:border-blue-300' : 'cursor-not-allowed border-gray-100 bg-gray-100/70 text-gray-300'}`}
                          >
                            <span className="block text-sm font-semibold">{capability}</span>
                            <span className="mt-0.5 block text-xs">{supported ? '可选择对应测试项' : '当前模态暂无测试项'}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      <span className="text-red-500">*</span> 测试项
                    </Label>
                    <div className="flex flex-wrap gap-2">
                      {activePerformanceConfig.tests.map(test => (
                        <button
                          key={test}
                          type="button"
                          onClick={() => setPerformanceTest(test)}
                          className={`rounded-full border px-3 py-1.5 text-xs transition ${performanceTest === test ? 'border-blue-500 bg-blue-600 text-white' : 'border-blue-100 bg-white text-gray-600 hover:border-blue-300'}`}
                        >
                          {test}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="performanceDataset" className="text-sm font-medium">
                        <span className="text-red-500">*</span> 数据集
                      </Label>
                      <select
                        id="performanceDataset"
                        value={performanceDataset}
                        onChange={event => setPerformanceDataset(event.target.value)}
                        className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                      >
                        {activePerformanceConfig.datasets.map(dataset => <option key={dataset} value={dataset}>{dataset}</option>)}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="performanceMethod" className="text-sm font-medium">
                        <span className="text-red-500">*</span> 测试方法
                      </Label>
                      <select
                        id="performanceMethod"
                        value={performanceMethod}
                        onChange={event => setPerformanceMethod(event.target.value)}
                        className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                      >
                        {activePerformanceConfig.methods.map(method => <option key={method} value={method}>{method}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="rounded-xl border border-blue-100 bg-white px-4 py-3 text-xs leading-5 text-gray-500">
                    当前配置：<span className="font-medium text-blue-700">{performanceGroup} / {activePerformanceConfig.label} / {performanceCapability}</span>，使用 {performanceDataset} 数据集执行 {performanceMethod}。
                  </div>

                  <div>
                    <Label htmlFor="customScenario" className="text-sm font-medium text-gray-800">
                      补充评测需求 <span className="text-xs font-normal text-gray-400">（选填）</span>
                    </Label>
                    <textarea
                      id="customScenario"
                      value={customScenario}
                      onChange={e => setCustomScenario(e.target.value)}
                      maxLength={500}
                      rows={3}
                      placeholder="例如：请重点关注中文长文本场景，并在报告中说明主要问题样本。"
                      className="mt-2 w-full resize-y rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm leading-6 text-gray-700 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                    />
                    <div className="mt-1 text-right text-xs text-gray-400">{customScenario.length}/500</div>
                  </div>
                </div>
              )) : null}

              {/* Safety evaluation configuration */}
              {false ? ((pageType === 'safety' && activeSafetyConfig) && (
                <div className="space-y-5 rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50/70 to-white p-5">
                  <div>
                    <Label className="text-sm font-medium"><span className="text-red-500">*</span> 评估模块</Label>
                    <p className="mt-1 text-xs text-gray-500">配置项依据当前大模型安全评测系统整理。</p>
                  </div>

                  <div className="grid gap-2 sm:grid-cols-4">
                    {(['鲁棒性评估', '隐私性评估', '安全性评估', '偏见性评估'] as SafetyModule[]).map(module => (
                      <button
                        key={module}
                        type="button"
                        onClick={() => changeSafetyModule(module)}
                        className={`rounded-xl border px-3 py-3 text-sm font-semibold transition ${safetyModule === module ? 'border-indigo-500 bg-indigo-600 text-white shadow-sm' : 'border-gray-200 bg-white text-gray-600 hover:border-indigo-300'}`}
                      >
                        {module}
                      </button>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium"><span className="text-red-500">*</span> 测试类型</Label>
                    <div className="flex flex-wrap gap-2">
                      {SAFETY_CONFIGS.filter(item => item.module === safetyModule).map(config => (
                        <button
                          key={config.test}
                          type="button"
                          onClick={() => changeSafetyTest(config.test)}
                          className={`rounded-full border px-3 py-1.5 text-xs transition ${safetyTest === config.test ? 'border-indigo-500 bg-indigo-600 text-white' : 'border-indigo-100 bg-white text-gray-600 hover:border-indigo-300'}`}
                        >
                          {config.test}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="safetyDataset" className="text-sm font-medium"><span className="text-red-500">*</span> 数据集</Label>
                      <select id="safetyDataset" value={safetyDataset} onChange={event => setSafetyDataset(event.target.value)} className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100">
                        {activeSafetyConfig.datasets.map(dataset => <option key={dataset} value={dataset}>{dataset}</option>)}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="safetyMethod" className="text-sm font-medium"><span className="text-red-500">*</span> 测试方法</Label>
                      <select id="safetyMethod" value={safetyMethod} onChange={event => setSafetyMethod(event.target.value)} className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100">
                        {activeSafetyConfig.methods.map(method => <option key={method} value={method}>{method}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="sampleCount" className="text-sm font-medium">样本数量</Label>
                      <Input id="sampleCount" type="number" min={1} max={1000} value={sampleCount} onChange={event => setSampleCount(Math.max(1, Number(event.target.value) || 1))} />
                    </div>
                    <label className="flex cursor-pointer items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm">
                      <span><span className="block font-medium text-gray-700">智能选择</span><span className="text-xs text-gray-400">辅助匹配配置</span></span>
                      <Checkbox checked={smartSelection} onCheckedChange={value => setSmartSelection(Boolean(value))} />
                    </label>
                    <label className="flex cursor-pointer items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm">
                      <span><span className="block font-medium text-gray-700">电子围栏</span><span className="text-xs text-gray-400">按需开启</span></span>
                      <Checkbox checked={electronicFence} onCheckedChange={value => setElectronicFence(Boolean(value))} />
                    </label>
                  </div>

                  <div className="rounded-xl border border-indigo-100 bg-white px-4 py-3 text-xs leading-5 text-gray-500">
                    当前配置：<span className="font-medium text-indigo-700">{safetyModule} / {safetyTest}</span>，使用“{safetyDataset}”并执行“{safetyMethod}”。
                  </div>

                  <div>
                    <Label htmlFor="customScenario" className="text-sm font-medium text-gray-800">补充评测需求 <span className="text-xs font-normal text-gray-400">（选填）</span></Label>
                    <textarea id="customScenario" value={customScenario} onChange={e => setCustomScenario(e.target.value)} maxLength={500} rows={3} placeholder="例如：请重点检查中文业务问答中的提示词泄露风险，并在结果中标注问题样本。" className="mt-2 w-full resize-y rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm leading-6 text-gray-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100" />
                    <div className="mt-1 text-right text-xs text-gray-400">{customScenario.length}/500</div>
                  </div>
                </div>
              )) : null}

              {/* Email Notification */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="enableEmail"
                    checked={enableEmail}
                    onCheckedChange={(v) => setEnableEmail(Boolean(v))}
                  />
                  <Label htmlFor="enableEmail" className="text-sm cursor-pointer">
                    任务完成或失败时发送邮件通知
                  </Label>
                </div>
                {enableEmail && (
                  <Input
                    placeholder="请输入接收通知的邮箱"
                    value={notifyEmail}
                    onChange={e => setNotifyEmail(e.target.value)}
                    className="max-w-sm"
                  />
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-2 border-t">
                <div />
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleClose}>取消</Button>
                  <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleSubmit}>
                    创建评测任务
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Report Preview */}
          {step === 'preview' && (
            <div>
              <p className="text-sm text-gray-500 mb-4 text-center">以下是评测完成后将生成的报告样式（示例）</p>
              <ReportPreview planType={pricingPlan} />
              <div className="flex justify-between mt-5 pt-4 border-t">
                <Button variant="outline" onClick={() => setStep('config')}>
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  返回配置
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleSubmit}>
                  确认并提交
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ReportPreview({ planType }: { planType: PricingPlan }) {
  const isHigh = planType === 'paid';

  const RISK_ITEMS = [
    {
      dim: '有害内容生成',
      score: 61.3,
      level: 'high' as const,
      desc: '模型在对抗性提示下产生了煽动性、极端主义相关内容，触发率达 38.7%。',
      law: '《生成式人工智能服务管理暂行办法》第四条',
      lawDetail: '提供者应当依法承担网络信息内容生产者责任，不得生成煽动颠覆国家政权、散布谣言等违法内容。',
      suggestion: '建议增强内容过滤模块，针对对抗性提示进行专项红队测试并加固防御。',
    },
    {
      dim: '隐私数据泄露',
      score: 78.5,
      level: 'medium' as const,
      desc: '在特定场景中模型存在复述训练数据中个人信息的风险，概率约 12.4%。',
      law: '《生成式人工智能服务管理暂行办法》第十一条',
      lawDetail: '提供者应当采取有效措施防止训练数据中的个人信息泄露，保障用户数据安全。',
      suggestion: '建议对训练数据进行差分隐私处理，并加强模型记忆抑制机制。',
    },
    {
      dim: '偏见与歧视',
      score: 83.0,
      level: 'medium' as const,
      desc: '性别偏见测试中，模型在职业描述方面存在系统性偏差，偏差率约 17.2%。',
      law: '《生成式人工智能服务管理暂行办法》第八条',
      lawDetail: '提供者应当采取措施防止生成歧视性、偏见性内容，促进社会公平与包容。',
      suggestion: '建议引入去偏见对齐训练，并定期在多元化测试集上进行偏见基准评估。',
    },
    {
      dim: '越狱攻击防护',
      score: 74.2,
      level: 'medium' as const,
      desc: '在角色扮演越狱场景下，模型安全指令被绕过的成功率约 25.8%。',
      law: '《生成式人工智能服务管理暂行办法》第十五条',
      lawDetail: '提供者应具备识别和抵御恶意使用、滥用其服务的技术能力，防止安全机制被绕过。',
      suggestion: '建议强化系统提示词注入防护，增加越狱攻击特征检测层。',
    },
  ];

  const overallRisk = planType === 'free' ? 'high' : 'medium';
  const riskLabel = planType === 'free' ? '高风险（建议整改）' : '中风险（需关注改进）';
  const riskColor = planType === 'free'
    ? { bg: 'bg-red-50', border: 'border-red-200', badge: 'bg-red-100 text-red-700', dot: 'bg-red-500' }
    : { bg: 'bg-amber-50', border: 'border-amber-200', badge: 'bg-amber-100 text-amber-700', dot: 'bg-amber-500' };

  const levelConfig = {
    high: { label: '高风险', color: 'bg-red-100 text-red-700', bar: 'bg-red-400', scoreColor: 'text-red-600' },
    medium: { label: '中风险', color: 'bg-amber-100 text-amber-700', bar: 'bg-amber-400', scoreColor: 'text-amber-600' },
    low: { label: '低风险', color: 'bg-green-100 text-green-700', bar: 'bg-green-400', scoreColor: 'text-green-600' },
  };

  return (
    <div className="border rounded-xl overflow-hidden shadow-sm text-sm">
      {/* Report Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-5 text-white">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-xs opacity-80 mb-1">AISafePro-LM 评测报告 · 示例预览</div>
            <div className="font-bold text-lg leading-tight">大模型安全性评测报告</div>
            <div className="text-xs opacity-70 mt-1">生成时间：2026-05-06 10:30:00 | 模型：Qwen2.5-7B-Instruct</div>
          </div>
          <div className={`px-3 py-1.5 rounded-full text-xs font-bold border ${
            overallRisk === 'high'
              ? 'bg-red-500/20 border-red-300/50 text-red-100'
              : 'bg-amber-400/20 border-amber-300/50 text-amber-100'
          }`}>
            {riskLabel}
          </div>
        </div>
      </div>

      {/* Score Overview */}
      <div className="p-4 bg-gray-50 border-b">
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: '综合安全分', value: '74.8', color: 'text-amber-600' },
            { label: '有害内容', value: '61.3', color: 'text-red-600' },
            { label: '隐私安全', value: '78.5', color: 'text-amber-500' },
            { label: '偏见歧视', value: '83.0', color: 'text-blue-600' },
          ].map(item => (
            <div key={item.label} className="bg-white rounded-lg p-3 text-center border">
              <div className={`text-xl font-bold ${item.color}`}>{item.value}</div>
              <div className="text-[10px] text-gray-500 mt-0.5">{item.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Chart Area */}
      <div className="p-4 border-b">
        <div className="text-sm font-medium mb-3">评测维度分布图</div>
        <div className="h-28 bg-blue-50 rounded-lg flex items-center justify-center relative overflow-hidden">
          <svg viewBox="0 0 220 130" className="w-full h-full opacity-70">
            <polygon points="110,12 178,45 178,88 110,118 42,88 42,45" fill="none" stroke="#93c5fd" strokeWidth="1" />
            <polygon points="110,32 154,55 154,80 110,98 66,80 66,55" fill="none" stroke="#93c5fd" strokeWidth="1" />
            <polygon points="110,52 138,65 138,74 110,82 82,74 82,65" fill="none" stroke="#bfdbfe" strokeWidth="1" />
            <polygon points="110,20 170,52 162,85 110,110 58,85 50,52" fill="rgba(251,146,60,0.25)" stroke="#f97316" strokeWidth="1.5" />
            <circle cx="110" cy="20" r="3" fill="#f97316" />
            <circle cx="170" cy="52" r="3" fill="#f97316" />
            <circle cx="162" cy="85" r="3" fill="#f97316" />
            <circle cx="110" cy="110" r="3" fill="#f97316" />
            <circle cx="58" cy="85" r="3" fill="#f97316" />
            <circle cx="50" cy="52" r="3" fill="#f97316" />
            <text x="110" y="8" textAnchor="middle" fontSize="7" fill="#6b7280">有害内容</text>
            <text x="185" y="52" textAnchor="start" fontSize="7" fill="#6b7280">越狱</text>
            <text x="175" y="95" textAnchor="start" fontSize="7" fill="#6b7280">隐私</text>
            <text x="110" y="126" textAnchor="middle" fontSize="7" fill="#6b7280">偏见</text>
            <text x="28" y="95" textAnchor="end" fontSize="7" fill="#6b7280">对抗</text>
            <text x="32" y="52" textAnchor="end" fontSize="7" fill="#6b7280">逻辑</text>
          </svg>
        </div>
      </div>

      {/* ══ Overall Business Conclusion ══ */}
      <div className={`p-4 border-b ${riskColor.bg} ${riskColor.border} border-l-4`}>
        <div className="flex items-center gap-2 mb-3">
          <div className={`w-2 h-2 rounded-full ${riskColor.dot}`}></div>
          <span className="font-bold text-gray-800">整体业务合规结论</span>
          <span className={`ml-auto text-xs px-2 py-0.5 rounded-full font-medium ${riskColor.badge}`}>
            {riskLabel}
          </span>
        </div>
        <p className="text-xs text-gray-700 leading-relaxed">
          根据本次评测结果，当前模型综合安全得分为 <strong>74.8 / 100</strong>，低于平台合规基准线（80分）。
          {overallRisk === 'high'
            ? '模型在有害内容生成和越狱防护两个核心维度存在显著缺陷，不建议直接上线对外服务，需完成整改后重新评测方可申请备案。'
            : '模型整体安全性处于中等水平，在有害内容和越狱防护方面存在一定风险，建议在上线前进行针对性优化，并在运营期间持续监控。'}
        </p>
        <div className="mt-2 pt-2 border-t border-current/10 text-[10px] text-gray-500 flex items-start gap-1">
          <span className="shrink-0 font-medium">合规建议：</span>
          <span>建议参照《生成式人工智能服务管理暂行办法》第四条、第八条、第十一条进行自查与整改，并在完成整改后申请重新评测以获取备案支撑材料。</span>
        </div>
      </div>

      {/* ══ Risk Detail with Legal Basis ══ */}
      <div className="p-4 border-b">
        <div className="flex items-center gap-2 mb-3">
          <span className="font-bold text-gray-800">风险明细与法规依据</span>
          <span className="text-[10px] text-gray-400 ml-auto">共 {RISK_ITEMS.length} 项风险</span>
        </div>
        <div className="space-y-3">
          {RISK_ITEMS.map((risk, idx) => {
            const cfg = levelConfig[risk.level];
            const barWidth = `${risk.score}%`;
            const isLocked = planType === 'free' && idx >= 1;
            return (
              <div
                key={risk.dim}
                className={`border rounded-lg overflow-hidden transition-all ${isLocked ? 'opacity-50' : ''}`}
              >
                {/* Row header */}
                <div className="flex items-center gap-2 px-3 py-2 bg-gray-50">
                  <span className="text-xs font-medium text-gray-700 flex-1">{risk.dim}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${cfg.color}`}>{cfg.label}</span>
                  <span className={`text-sm font-bold ${cfg.scoreColor}`}>{risk.score}</span>
                  {isLocked && <Lock className="w-3 h-3 text-gray-300 shrink-0" />}
                </div>
                {!isLocked && (
                  <div className="px-3 py-2 space-y-2">
                    {/* Score bar */}
                    <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
                      <div className={`h-full rounded-full ${cfg.bar}`} style={{ width: barWidth }} />
                    </div>
                    {/* Description */}
                    <p className="text-[11px] text-gray-600 leading-relaxed">{risk.desc}</p>
                    {/* Legal reference */}
                    <div className="bg-blue-50 border border-blue-100 rounded p-2 space-y-0.5">
                      <div className="flex items-center gap-1">
                        <FileText className="w-3 h-3 text-blue-500 shrink-0" />
                        <span className="text-[10px] font-medium text-blue-700">{risk.law}</span>
                      </div>
                      <p className="text-[10px] text-blue-600 leading-relaxed pl-4">{risk.lawDetail}</p>
                    </div>
                    {/* Suggestion */}
                    <div className="flex items-start gap-1">
                      <span className="text-[10px] font-medium text-amber-600 shrink-0">整改建议：</span>
                      <span className="text-[10px] text-gray-500">{risk.suggestion}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        {planType === 'free' && (
          <div className="mt-3 flex items-center gap-2 p-2.5 bg-gray-50 rounded-lg border border-dashed border-gray-200">
            <Lock className="w-3.5 h-3.5 text-gray-300 shrink-0" />
            <span className="text-[11px] text-gray-400">升级至专业版可查看全部风险明细与法规依据</span>
          </div>
        )}
      </div>

      {/* Detailed sections */}
      <div className={`p-4 relative ${planType === 'free' ? 'overflow-hidden' : ''}`}>
        <div className="font-bold text-gray-800 mb-2">深度报告模块</div>
        <div className="space-y-2">
          {['错误归因与案例溯源', '改进建议优先级排序', '对标行业模型横向比较', '备案支撑材料生成'].map(item => (
            <div key={item} className="flex items-center gap-2 p-2 bg-gray-50 rounded border">
              <div className="w-2 h-2 rounded-full bg-blue-400"></div>
              <span className="text-xs text-gray-600">{item}</span>
              {planType === 'free' && <Lock className="w-3 h-3 text-gray-300 ml-auto" />}
            </div>
          ))}
        </div>
        {planType === 'free' && (
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white flex items-end pb-3 justify-center">
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <Lock className="w-3.5 h-3.5" />
              <span>升级专业版后解锁完整深度报告</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
