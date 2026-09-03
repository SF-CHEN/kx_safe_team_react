import React, { useEffect, useMemo, useState } from 'react';
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
  ChevronRight, ChevronLeft, CheckCircle2,
  Shield, Zap, Lock, FileText, Eye, Star, Globe,
  Bot, Image as ImageIcon,
} from 'lucide-react';
import { addEvaluationTask, type CreateEvaluationTaskInput } from '@/api/evaluation';
import { addDepthModel, fetchDepthModelDropdown } from '@/api/model';
import { fetchPresetScenes } from '@/api/presetScene';
import type { EvaluationTaskKind } from '@/api/evaluation/evaluationTask';
import type { BaseDropDepthModel } from '@/api/generated/types/depth-model';
import type { PresetSceneVo } from '@/api/generated/types/preset-scene';
import { useUser } from '../context/UserContext';
import { toast } from 'sonner';

type TaskType = 'llm' | 'multimodal';
type PageType = 'safety' | 'llm';
type ModelSource = 'custom_new' | 'my_models';
type PricingPlan = 'free' | 'paid';

const SCENE_COLORS = ['blue', 'green', 'orange', 'purple'] as const;
const SCENE_ICONS = [Shield, Star, Zap, Globe];

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

function resolveDropModel(item: BaseDropDepthModel) {
  const data = item.data;
  const id = data?.id ?? item.id;
  const name = data?.name || item.name || (id != null ? `模型 #${id}` : '');
  const type = data?.type || 'USER';
  const baseUrl = data?.baseUrl || '';
  return { id, name, type, baseUrl };
}

interface Props {
  open: boolean;
  onClose: () => void;
  pageType: PageType;
}

export function TaskCreationModal({ open, onClose, pageType }: Props) {
  const { user } = useUser();
  const [step, setStep] = useState<'type' | 'config' | 'preview'>(
    pageType === 'safety' ? 'type' : 'config'
  );
  const [taskType, setTaskType] = useState<TaskType>('llm');
  const [taskName, setTaskName] = useState('');
  const [modelSource, setModelSource] = useState<ModelSource>('custom_new');
  const [selectedMyModel, setSelectedMyModel] = useState('');
  const [customModelName, setCustomModelName] = useState('');
  const [customApiBase, setCustomApiBase] = useState('');
  const [customApiKey, setCustomApiKey] = useState('');
  const [selectedSceneId, setSelectedSceneId] = useState<number | null>(null);
  const [customScenario, setCustomScenario] = useState('');
  const [pricingPlan, setPricingPlan] = useState<PricingPlan>('paid');
  const [notifyEmail, setNotifyEmail] = useState(user.email || '');
  const [enableEmail, setEnableEmail] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [metaLoading, setMetaLoading] = useState(false);
  const [presetScenes, setPresetScenes] = useState<PresetSceneVo[]>([]);
  const [dropModels, setDropModels] = useState<BaseDropDepthModel[]>([]);

  const resetForm = () => {
    setStep(pageType === 'safety' ? 'type' : 'config');
    setTaskType('llm');
    setTaskName('');
    setModelSource('custom_new');
    setSelectedMyModel('');
    setCustomModelName('');
    setCustomApiBase('');
    setCustomApiKey('');
    setSelectedSceneId(null);
    setCustomScenario('');
    setPricingPlan('paid');
    setSubmitting(false);
  };

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    setMetaLoading(true);
    void (async () => {
      try {
        const evaluationTaskType =
          pageType === 'llm' ? ('PERFORMANCE' as const) : ('SAFETY' as const);
        const [scenes, models] = await Promise.all([
          fetchPresetScenes(evaluationTaskType),
          fetchDepthModelDropdown(),
        ]);
        if (cancelled) return;
        setPresetScenes(scenes);
        setDropModels(models);
      } catch (err) {
        if (!cancelled) {
          toast.error(err instanceof Error ? err.message : '加载评测配置失败');
        }
      } finally {
        if (!cancelled) setMetaLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [open, pageType]);

  const resolvedModels = useMemo(
    () =>
      dropModels
        .map(resolveDropModel)
        .filter((m): m is { id: number; name: string; type: 'BUILT_IN' | 'USER'; baseUrl: string } =>
          m.id != null && !!m.name,
        ),
    [dropModels],
  );

  const handleClose = () => {
    if (submitting) return;
    resetForm();
    onClose();
  };

  /** OpenAPI：PERFORMANCE | SAFETY；多模态安全暂归 SAFETY，见对接纪要 */
  const resolveApiType = (): EvaluationTaskKind =>
    pageType === 'llm' ? 'PERFORMANCE' : 'SAFETY';

  const buildCustomModelConfig = (opts: {
    name: string;
    baseUrl?: string;
    apiKey?: string;
  }) =>
    JSON.stringify({
      name: opts.name,
      baseUrl: opts.baseUrl || '',
      apiKey: opts.apiKey || '',
    });

  const handleSubmit = async () => {
    if (submitting) return;
    if (!taskName.trim()) {
      toast.error('请填写任务名称');
      return;
    }

    const selectedDrop =
      modelSource === 'my_models'
        ? resolvedModels.find((m) => String(m.id) === selectedMyModel)
        : undefined;
    const modelName =
      modelSource === 'my_models' ? selectedDrop?.name || '' : customModelName;

    if (!modelName) {
      toast.error('请选择或填写测试大模型');
      return;
    }
    if (modelSource === 'custom_new' && !customApiBase.trim()) {
      toast.error('请填写 API Base URL');
      return;
    }
    if (modelSource === 'my_models' && selectedDrop?.id == null) {
      toast.error('请选择测试大模型');
      return;
    }

    const selectedScene = presetScenes.find((s) => s.sceneId === selectedSceneId);
    const scenarioDescription = customScenario.trim();
    if (!selectedScene && !scenarioDescription) {
      toast.error('请选择预设场景或填写测试场景描述');
      return;
    }
    if (enableEmail && !notifyEmail.trim()) {
      toast.error('请填写接收通知的邮箱');
      return;
    }

    const sceneName = [
      selectedScene?.sceneName || '',
      scenarioDescription ? `用户补充需求：${scenarioDescription}` : '',
    ]
      .filter(Boolean)
      .join('；');

    const userId = Number(user.id);
    const basePayload: Omit<CreateEvaluationTaskInput, 'useModelType'> = {
      type: resolveApiType(),
      name: taskName.trim(),
      needSendEmail: enableEmail,
      ...(enableEmail ? { email: notifyEmail.trim() } : {}),
      ...(Number.isFinite(userId) ? { userId } : {}),
      ...(scenarioDescription ? { demandSupplement: scenarioDescription } : {}),
    };

    const payload: CreateEvaluationTaskInput =
      modelSource === 'my_models' && selectedDrop
        ? {
            ...basePayload,
            useModelType: selectedDrop.type === 'BUILT_IN' ? 'BUILT_IN' : 'USER_MODEL',
            modelId: selectedDrop.id,
          }
        : {
            ...basePayload,
            useModelType: 'CUSTOM',
            customModelConfig: buildCustomModelConfig({
              name: customModelName,
              baseUrl: customApiBase.trim(),
              apiKey: customApiKey,
            }),
          };

    // 原型仅有预设场景 + 补充需求；自定义维度 UI 已去掉。有场景则写 PRESET_SCENE
    if (selectedScene?.sceneId != null) {
      payload.evaluationDimensionType = 'PRESET_SCENE';
      payload.presumedSceneDimensionId = selectedScene.sceneId;
    }

    setSubmitting(true);
    try {
      if (modelSource === 'custom_new' && customModelName && customApiBase) {
        try {
          const saved = await addDepthModel({
            name: customModelName.trim(),
            baseUrl: customApiBase.trim(),
            apiKey: customApiKey || undefined,
            type: 'USER',
            ...(Number.isFinite(userId) ? { userId } : {}),
          });
          if (saved.id != null) {
            payload.useModelType = 'USER_MODEL';
            payload.modelId = saved.id;
            delete payload.customModelConfig;
          }
          const refreshed = await fetchDepthModelDropdown();
          setDropModels(refreshed);
        } catch {
          // 保存到 depth-model 失败时仍用 CUSTOM 提交任务
        }

      }

      await addEvaluationTask(payload);
      toast.success('任务已提交，等待平台受理', {
        description:
          '技术团队将根据您填写的场景和模型配置开展正式评测，完成后推送报告至资源中心。',
      });
      resetForm();
      onClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : '任务提交失败');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-0">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between z-10">
          <DialogHeader className="space-y-0">
            <DialogTitle className="text-base">新建测评任务</DialogTitle>
          </DialogHeader>
          {/* Steps indicator */}
          {pageType === 'safety' && (
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <span className={step === 'type' ? 'text-blue-600 font-medium' : 'text-gray-400'}>① 选择类型</span>
              <ChevronRight className="w-3 h-3" />
              <span className={step === 'config' ? 'text-blue-600 font-medium' : 'text-gray-400'}>② 任务配置</span>
              <ChevronRight className="w-3 h-3" />
              <span className={step === 'preview' ? 'text-blue-600 font-medium' : 'text-gray-400'}>③ 报告预览</span>
            </div>
          )}
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
                    <p className="text-xs text-gray-400">创建后将尝试保存至模型库，供「我的模型」复用</p>
                  </div>
                )}

                {modelSource === 'my_models' && (
                  <div className="border rounded-lg bg-gray-50">
                    {metaLoading ? (
                      <div className="py-8 text-center text-gray-400 text-sm">加载模型列表…</div>
                    ) : resolvedModels.length === 0 ? (
                      <div className="py-8 text-center text-gray-400 text-sm">
                        <Bot className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                        <p>暂无模型</p>
                        <p className="text-xs mt-1">请先通过「自定义模型（API）」创建，或联系管理员配置内置模型</p>
                      </div>
                    ) : (
                      <div className="p-2 space-y-1.5">
                        {resolvedModels.map(m => (
                          <button
                            key={m.id}
                            type="button"
                            onClick={() => setSelectedMyModel(String(m.id))}
                            className={`w-full text-left p-3 rounded-lg border transition-all ${
                              selectedMyModel === String(m.id)
                                ? 'border-blue-400 bg-blue-50'
                                : 'border-transparent bg-white hover:border-gray-200'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="text-sm font-medium">{m.name}</div>
                                <div className="text-xs text-gray-400 mt-0.5">{m.baseUrl || '—'}</div>
                              </div>
                              <Badge variant="outline" className="text-xs">
                                {m.type === 'BUILT_IN' ? '内置' : '用户'}
                              </Badge>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Evaluation scenarios */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">
                  <span className="text-red-500">*</span> 评测场景
                </Label>
                {metaLoading ? (
                  <div className="rounded-xl border border-dashed py-10 text-center text-sm text-gray-400">
                    加载预置场景…
                  </div>
                ) : presetScenes.length === 0 ? (
                  <div className="rounded-xl border border-dashed py-10 text-center text-sm text-gray-400">
                    暂无预置场景，请改用下方自定义维度
                  </div>
                ) : (
                  <div className="grid gap-3">
                    {presetScenes.map((scene, index) => {
                      if (scene.sceneId == null) return null;
                      const color = SCENE_COLORS[index % SCENE_COLORS.length];
                      const Icon = SCENE_ICONS[index % SCENE_ICONS.length];
                      const isSelected = selectedSceneId === scene.sceneId;
                      const tags = scene.dimensionNames || [];
                      return (
                        <button
                          key={scene.sceneId}
                          type="button"
                          onClick={() => {
                            setSelectedSceneId(isSelected ? null : scene.sceneId!);
                          }}
                          className={`text-left border-2 rounded-xl p-4 transition-all ${
                            isSelected
                              ? `border-blue-400 ${colorMap[color]}`
                              : 'border-gray-200 bg-white hover:border-gray-300'
                          }`}
                        >
                          <div className="flex gap-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${iconBgMap[color]}`}>
                              <Icon className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-sm">{scene.sceneName || `场景 #${scene.sceneId}`}</span>
                                {isSelected && <CheckCircle2 className="w-4 h-4 text-blue-500" />}
                              </div>
                              <p className="text-xs text-gray-500 mt-0.5">
                                {tags.length ? `含 ${tags.length} 个评测维度` : '预置评测场景'}
                              </p>
                              {tags.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {tags.map((tag) => (
                                    <span key={tag} className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded">
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}

                <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-4">
                  <Label htmlFor="customScenario" className="text-sm font-medium text-gray-800">
                    补充测试需求
                    <span className="ml-2 text-xs font-normal text-gray-400">可与预设场景同时填写</span>
                  </Label>
                  <textarea
                    id="customScenario"
                    value={customScenario}
                    onChange={e => setCustomScenario(e.target.value)}
                    maxLength={500}
                    rows={4}
                    placeholder={pageType === 'safety'
                      ? '例如：希望重点测试模型在金融客服场景中的越狱攻击防护、隐私泄露和不当建议风险。'
                      : '例如：希望重点测试模型在中文金融问答场景中的推理准确性、专业知识和长文本理解能力。'}
                    className="mt-3 w-full resize-y rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm leading-6 text-gray-700 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                  />
                  <div className="mt-1.5 text-right text-xs text-gray-400">{customScenario.length}/500</div>
                </div>
              </div>

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
                <div className="flex gap-2">
                  {pageType === 'safety' && (
                    <Button variant="outline" size="sm" onClick={() => setStep('type')}>
                      <ChevronLeft className="w-4 h-4 mr-1" />
                      上一步
                    </Button>
                  )}
                  <Button variant="outline" size="sm" onClick={() => setStep('preview')}>
                    <Eye className="w-4 h-4 mr-1" />
                    预览报告样式
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleClose} disabled={submitting}>取消</Button>
                  <Button
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={() => void handleSubmit()}
                    disabled={submitting}
                  >
                    {submitting ? '提交中…' : '创建评测任务'}
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
                <Button variant="outline" onClick={() => setStep('config')} disabled={submitting}>
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  返回配置
                </Button>
                <Button
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={() => void handleSubmit()}
                  disabled={submitting}
                >
                  {submitting ? '提交中…' : '确认并提交'}
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
