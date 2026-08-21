import React, { useEffect, useRef, useState } from 'react';
import { CheckCircle2, FileArchive, FileText, Upload, X } from 'lucide-react';
import { toast } from 'sonner';
import { useUser, type EvalTask } from '../context/UserContext';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from './ui/dialog';
import { Label } from './ui/label';
import { fileToStoredAttachment } from '../data/workflowStore';

type Variant = 'model-data' | 'deep-model' | 'agent-safety';

interface Props {
  open: boolean;
  onClose: () => void;
  variant: Variant;
}

const COPY = {
  'model-data': {
    title: '创建数据集安全评测任务',
    subtitle: '上传数据工程文件，并说明本次希望重点评测的问题',
    uploadTitle: '上传数据工程文件',
    uploadHint: '支持压缩包、CSV、TSV、JSON、JSONL、TXT、NPZ、NPY、XML 等材料',
    accept: '.zip,.rar,.7z,.tar,.gz,.csv,.tsv,.json,.jsonl,.txt,.npz,.npy,.xml,.yaml,.yml',
    placeholder: '请描述数据任务类型、数据格式、数据划分及评测重点。例如：图像分类任务，ImageFolder 格式，包含 train / val，希望重点检查异常样本、标注质量和类别分布。',
    evalType: '数据集安全评测' as const,
    model: '用户上传的数据工程',
  },
  'deep-model': {
    title: '创建深度模型可信评测任务',
    subtitle: '上传模型或工程文件，并说明希望执行的评测算法与重点问题',
    uploadTitle: '上传模型或工程文件',
    uploadHint: '支持工程压缩包及 PyTorch、TensorFlow、Keras、MindSpore 相关模型文件',
    accept: '.zip,.rar,.7z,.tar,.gz,.pt,.pth,.pb,.h5,.keras,.ckpt,.mindir',
    placeholder: '请说明模型框架、接入方式和评测诉求。例如：PyTorch 本地模型，希望执行对抗攻击、性能和量化评估，重点比较攻击前后输出及量化前后的精度变化。',
    evalType: '深度模型可信测评' as const,
    model: '用户上传的模型工程',
  },
  'agent-safety': {
    title: '创建智能体安全评测任务',
    subtitle: '上传智能体工程文件，并说明希望检测的安全问题与业务场景',
    uploadTitle: '上传智能体工程文件',
    uploadHint: '支持 ZIP、RAR、7Z、TAR、GZ 等工程压缩包，以及 JSON、YAML、YML、TXT 等配置材料',
    accept: '.zip,.rar,.7z,.tar,.gz,.json,.yaml,.yml,.txt,.md',
    placeholder: '请描述智能体用途、主要功能、工具或知识库接入情况，以及希望重点检测的安全问题。例如：企业知识库问答智能体，包含 RAG 与文件读取能力，希望重点检查提示词泄露、RAG 泄露和工具恶意调用风险。',
    evalType: '智能体安全评测' as const,
    model: '用户上传的智能体工程',
  },
};

export function LightweightUploadTaskModal({ open, onClose, variant }: Props) {
  const { addTask } = useUser();
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [request, setRequest] = useState('');
  const [success, setSuccess] = useState(false);
  const copy = COPY[variant];

  useEffect(() => {
    if (!open) {
      setFile(null);
      setRequest('');
      setSuccess(false);
    }
  }, [open]);

  const submit = async () => {
    if (!file) {
      toast.error('请先上传工程文件');
      return;
    }
    if (!request.trim()) {
      toast.error('请填写本次评测诉求');
      return;
    }

    const attachment = await fileToStoredAttachment(file, 'input');
    const task: EvalTask = {
      id: `${variant}-${Date.now()}`,
      name: `${file.name}评测任务`,
      model: copy.model,
      modelType: '本地工程文件',
      evalSet: request.trim(),
      evalType: copy.evalType,
      status: '处理中',
      score: null,
      createdAt: new Date().toLocaleString('zh-CN', { hour12: false }),
      plan: 'paid',
      requirement: request.trim(),
      attachments: [attachment],
    };
    addTask(task);
    setSuccess(true);
    toast.success('任务已提交，等待平台受理');
  };

  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent className="max-w-[680px] overflow-hidden p-0">
        <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-blue-600 px-7 py-5 text-white">
          <div className="flex items-start justify-between gap-4">
            <div>
              <DialogTitle className="text-xl font-bold text-white">{copy.title}</DialogTitle>
              <DialogDescription className="mt-1.5 text-sm leading-6 text-blue-100">{copy.subtitle}</DialogDescription>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-white/20 p-1.5 text-white/80 transition hover:bg-white/10 hover:text-white"
              aria-label="关闭"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {success ? (
          <div className="px-8 py-12 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50">
              <CheckCircle2 className="h-8 w-8 text-emerald-500" />
            </div>
            <h3 className="mt-5 text-xl font-bold text-slate-900">任务提交成功</h3>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              已收到您上传的文件和评测诉求。技术团队受理后会下载材料开展正式评测，报告完成后将推送至资源中心。
            </p>
            <Button className="mt-7 bg-blue-600 hover:bg-blue-700" onClick={onClose}>完成</Button>
          </div>
        ) : (
          <>
            <div className="space-y-6 px-7 py-6">
              <div className="space-y-2.5">
                <Label className="text-sm font-semibold text-slate-800">
                  <span className="mr-1 text-red-500">*</span>{copy.uploadTitle}
                </Label>
                <input
                  ref={inputRef}
                  type="file"
                  accept={copy.accept}
                  className="hidden"
                  onChange={(event) => setFile(event.target.files?.[0] ?? null)}
                />
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  className="flex min-h-32 w-full items-center justify-center rounded-xl border border-dashed border-blue-300 bg-blue-50/50 px-5 text-left transition hover:border-blue-500 hover:bg-blue-50"
                >
                  {file ? (
                    <span className="flex items-center gap-3">
                      <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-white text-blue-600 shadow-sm">
                        <FileArchive className="h-5 w-5" />
                      </span>
                      <span>
                        <span className="block max-w-[480px] truncate text-sm font-semibold text-slate-800">{file.name}</span>
                        <span className="mt-1 block text-xs text-slate-500">点击可重新选择文件</span>
                      </span>
                    </span>
                  ) : (
                    <span className="text-center">
                      <Upload className="mx-auto h-7 w-7 text-blue-600" />
                      <span className="mt-2 block text-sm font-semibold text-slate-800">点击选择本地文件</span>
                      <span className="mt-1 block text-xs text-slate-500">{copy.uploadHint}</span>
                    </span>
                  )}
                </button>
              </div>

              <div className="space-y-2.5">
                <Label htmlFor={`${variant}-request`} className="text-sm font-semibold text-slate-800">
                  <span className="mr-1 text-red-500">*</span>评测诉求
                </Label>
                <textarea
                  id={`${variant}-request`}
                  value={request}
                  onChange={(event) => setRequest(event.target.value)}
                  placeholder={copy.placeholder}
                  maxLength={500}
                  className="min-h-32 w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
                <div className="flex items-start justify-between gap-3">
                  <p className="flex items-start gap-1.5 text-xs leading-5 text-slate-500">
                    <FileText className="mt-0.5 h-3.5 w-3.5 shrink-0 text-blue-500" />
                    技术团队将结合文件与您的诉求确定评测重点，无需在门户中配置专业指标。
                  </p>
                  <span className="shrink-0 text-xs text-slate-400">{request.length}/500</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 border-t bg-slate-50 px-7 py-4">
              <Button variant="outline" onClick={onClose}>取消</Button>
              <Button className="bg-blue-600 px-6 hover:bg-blue-700" onClick={submit}>创建评测任务</Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
