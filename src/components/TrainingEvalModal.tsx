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
import {
  ChevronRight, X, Plus, Minus, CheckCircle2,
  Database, Upload, AlertTriangle, Lock, Clock,
  FileText, Eye, Crown, Sparkles, Tag, BarChart2, Filter, Search
} from 'lucide-react';
import { useUser, EvalTask } from '../context/UserContext';
import { toast } from 'sonner';

type PricingPlan = 'free' | 'paid';
type DataSource = 'upload' | 'platform';

const PLATFORM_DATASETS = [
  { id: 'general', name: '通用训练集测试数据集', size: '5,000条', tags: ['分类', '问答', '对话'] },
  { id: 'nlp', name: 'NLP标注质量检测集', size: '3,200条', tags: ['标注', '文本', '标签'] },
  { id: 'safety', name: '安全敏感数据检测集', size: '2,800条', tags: ['安全', '敏感', '偏见'] },
];

const EVAL_MODULES = [
  {
    id: 'annotation',
    icon: Tag,
    name: '标注错误检测模块',
    desc: '检测标签噪声、标注不一致与边界样本',
    subs: ['标签一致性验证', '跨标注员差异分析', '边界样本识别'],
  },
  {
    id: 'balance',
    icon: BarChart2,
    name: '均衡性评估模块',
    desc: '分析数据集类别分布与样本均衡性',
    subs: ['类别分布分析', '少数类识别', '过采样建议'],
  },
  {
    id: 'sensitivity',
    icon: Filter,
    name: '敏感性评估模块',
    desc: '检测有害内容、偏见信息和违规数据',
    subs: ['有害内容过滤', '偏见词汇检测', '隐私数据扫描'],
  },
  {
    id: 'quality',
    icon: Search,
    name: '数据质量分析模块',
    desc: '评估数据完整性、格式规范性和多样性',
    subs: ['完整性检查', '重复样本检测', '多样性指标'],
  },
];

interface Props {
  open: boolean;
  onClose: () => void;
}

export function TrainingEvalModal({ open, onClose }: Props) {
  const { user, addTask } = useUser();
  const [taskName, setTaskName] = useState('');
  const [dataSource, setDataSource] = useState<DataSource>('platform');
  const [selectedDataset, setSelectedDataset] = useState('');
  const [uploadFileName, setUploadFileName] = useState('');
  const [sampleCount, setSampleCount] = useState(200);
  const [selectedModules, setSelectedModules] = useState<string[]>(['annotation', 'balance']);
  const [pricingPlan, setPricingPlan] = useState<PricingPlan>('free');
  const [notifyEmail] = useState(user.email || '');

  const toggleModule = (id: string) => {
    setSelectedModules(prev =>
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
  };

  const resetForm = () => {
    setTaskName('');
    setDataSource('platform');
    setSelectedDataset('');
    setUploadFileName('');
    setSampleCount(200);
    setSelectedModules(['annotation', 'balance']);
    setPricingPlan('free');
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
    if (dataSource === 'platform' && !selectedDataset) {
      toast.error('请选择评测数据集');
      return;
    }
    if (dataSource === 'upload' && !uploadFileName) {
      toast.error('请上传数据集文件');
      return;
    }
    if (selectedModules.length === 0) {
      toast.error('请至少选择一个评测模块');
      return;
    }

    const datasetName = dataSource === 'platform'
      ? PLATFORM_DATASETS.find(d => d.id === selectedDataset)?.name || '平台数据集'
      : uploadFileName;

    const moduleNames = selectedModules
      .map(id => EVAL_MODULES.find(m => m.id === id)?.name || id)
      .join('、');

    const newTask: EvalTask = {
      id: `t_${Date.now()}`,
      name: taskName,
      model: '训练集检测引擎 v2.0',
      modelType: '平台',
      evalSet: datasetName,
      evalType: '训练集评测',
      status: '处理中',
      score: null,
      createdAt: new Date().toLocaleString('zh-CN'),
      plan: pricingPlan,
    };

    addTask(newTask);
    toast.success('训练集评测任务创建成功！', {
      description: pricingPlan === 'free'
        ? '任务已加入队列，免费任务优先级较低，请耐心等待。'
        : `已选择模块：${moduleNames}，任务正在处理中。`,
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
              <Database className="w-4 h-4 text-teal-600" />
              新建训练集评测任务
            </DialogTitle>
          </DialogHeader>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Badge className="bg-teal-50 text-teal-700 border-teal-200 text-xs">训练集评测</Badge>
          </div>
        </div>

        <div className="px-6 py-5 space-y-6">
          {/* Task Name */}
          <div className="space-y-1.5">
            <Label className="text-sm font-medium">
              <span className="text-red-500">*</span> 任务名称
            </Label>
            <Input
              placeholder="请输入任务名称，如：数据集质量检测-20260508"
              value={taskName}
              onChange={e => setTaskName(e.target.value)}
            />
          </div>

          {/* Dataset Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">
              <span className="text-red-500">*</span> 被检测数据集
            </Label>
            <RadioGroup
              value={dataSource}
              onValueChange={(v: DataSource) => setDataSource(v)}
              className="flex gap-6"
            >
              <div className="flex items-center gap-1.5">
                <RadioGroupItem value="platform" id="platform" />
                <Label htmlFor="platform" className="text-sm cursor-pointer">使用平台数据集</Label>
              </div>
              <div className="flex items-center gap-1.5">
                <RadioGroupItem value="upload" id="upload" />
                <Label htmlFor="upload" className="text-sm cursor-pointer">上传本地数据集</Label>
              </div>
            </RadioGroup>

            {dataSource === 'platform' && (
              <div className="space-y-2">
                {PLATFORM_DATASETS.map(ds => (
                  <button
                    key={ds.id}
                    onClick={() => setSelectedDataset(ds.id)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                      selectedDataset === ds.id
                        ? 'border-teal-400 bg-teal-50'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm text-gray-800">{ds.name}</span>
                      <div className="flex items-center gap-2">
                        {selectedDataset === ds.id && <CheckCircle2 className="w-4 h-4 text-teal-500" />}
                        <span className="text-xs text-gray-400">{ds.size}</span>
                      </div>
                    </div>
                    <div className="flex gap-1 flex-wrap">
                      {ds.tags.map(t => (
                        <span key={t} className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded">{t}</span>
                      ))}
                    </div>
                  </button>
                ))}
              </div>
            )}

            {dataSource === 'upload' && (
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-teal-400 transition-colors cursor-pointer"
                onClick={() => setUploadFileName('训练集测试用数据集.jsonl')}>
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                {uploadFileName ? (
                  <div>
                    <div className="text-sm font-medium text-teal-700">{uploadFileName}</div>
                    <div className="text-xs text-gray-400 mt-1">点击重新选择</div>
                  </div>
                ) : (
                  <div>
                    <div className="text-sm text-gray-600">点击上传或拖拽文件到此区域</div>
                    <div className="text-xs text-gray-400 mt-1">支持 JSON、JSONL、CSV、Parquet，最大 5GB</div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sample Count */}
          <div className="space-y-1.5">
            <Label className="text-sm font-medium">
              <span className="text-red-500">*</span> 样本数量
              {pricingPlan === 'free' && (
                <span className="ml-2 text-xs text-orange-500">(免费限100条)</span>
              )}
            </Label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSampleCount(Math.max(10, sampleCount - 50))}
                className="w-8 h-8 rounded border flex items-center justify-center hover:bg-gray-50"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <Input
                type="number"
                value={pricingPlan === 'free' ? Math.min(sampleCount, 100) : sampleCount}
                onChange={e => setSampleCount(Number(e.target.value))}
                className="w-28 text-center"
                max={pricingPlan === 'free' ? 100 : 50000}
                min={10}
              />
              <button
                onClick={() => setSampleCount(Math.min(pricingPlan === 'free' ? 100 : 50000, sampleCount + 50))}
                className="w-8 h-8 rounded border flex items-center justify-center hover:bg-gray-50"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
              <span className="text-xs text-gray-400">条数据</span>
            </div>
          </div>

          {/* Evaluation Modules */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">
              <span className="text-red-500">*</span> 评测维度（可多选）
            </Label>
            <div className="grid grid-cols-2 gap-3">
              {EVAL_MODULES.map(mod => {
                const Icon = mod.icon;
                const isSelected = selectedModules.includes(mod.id);
                return (
                  <label
                    key={mod.id}
                    className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-teal-400 bg-teal-50'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => toggleModule(mod.id)}
                      className="mt-0.5"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Icon className={`w-4 h-4 ${isSelected ? 'text-teal-600' : 'text-gray-500'}`} />
                        <span className="text-sm font-medium text-gray-800">{mod.name}</span>
                      </div>
                      <div className="text-xs text-gray-500">{mod.desc}</div>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Pricing Plan */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">
              <span className="text-red-500">*</span> 评测方案
            </Label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setPricingPlan('free')}
                className={`text-left border-2 rounded-xl p-4 transition-all ${
                  pricingPlan === 'free' ? 'border-teal-400 bg-teal-50' : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm">免费试用</span>
                  {pricingPlan === 'free' && <CheckCircle2 className="w-4 h-4 text-teal-500" />}
                </div>
                <div className="text-2xl font-bold text-gray-800 mb-3">¥0</div>
                <ul className="space-y-1.5">
                  {[
                    { icon: AlertTriangle, text: '仅限1次/账号', warn: true },
                    { icon: Lock, text: '最多100条数据', warn: true },
                    { icon: Clock, text: '低优先级排队', warn: true },
                    { icon: FileText, text: '基础报告', warn: true },
                  ].map(({ icon: Icon, text, warn }) => (
                    <li key={text} className="flex items-center gap-1.5 text-xs">
                      <Icon className={`w-3 h-3 ${warn ? 'text-orange-400' : 'text-gray-400'}`} />
                      <span className={warn ? 'text-orange-600' : 'text-gray-500'}>{text}</span>
                    </li>
                  ))}
                </ul>
              </button>

              <button
                onClick={() => setPricingPlan('paid')}
                className={`text-left border-2 rounded-xl p-4 transition-all relative ${
                  pricingPlan === 'paid' ? 'border-teal-400 bg-teal-50' : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="absolute top-0 right-0 bg-gradient-to-r from-teal-500 to-cyan-500 text-white text-[10px] px-2 py-0.5 rounded-bl-lg rounded-tr-xl">
                  推荐
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm flex items-center gap-1">
                    <Crown className="w-3.5 h-3.5 text-amber-500" />
                    专业版
                  </span>
                  {pricingPlan === 'paid' && <CheckCircle2 className="w-4 h-4 text-teal-500" />}
                </div>
                <div className="text-2xl font-bold text-gray-800 mb-3">¥9.9<span className="text-sm font-normal text-gray-500">/次</span></div>
                <ul className="space-y-1.5">
                  {[
                    '无次数限制',
                    '最多50,000条数据',
                    '优先处理，高速算力',
                    '完整深度分析报告',
                    '数据完全私密',
                  ].map(text => (
                    <li key={text} className="flex items-center gap-1.5 text-xs">
                      <CheckCircle2 className="w-3 h-3 text-teal-500" />
                      <span className="text-gray-600">{text}</span>
                    </li>
                  ))}
                </ul>
              </button>
            </div>
          </div>

          {/* Email notification hint */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 flex items-start gap-2.5">
            <Eye className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
            <div className="text-xs text-blue-700">
              任务完成后将发送邮件通知至：<span className="font-medium">{notifyEmail || '（未设置邮箱）'}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t px-6 py-4 flex items-center justify-between">
          <Button variant="outline" onClick={handleClose}>取消</Button>
          <Button
            className="bg-teal-600 hover:bg-teal-700 text-white"
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
