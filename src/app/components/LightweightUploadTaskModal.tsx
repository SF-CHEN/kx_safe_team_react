import React, { useEffect, useRef, useState } from 'react';
import { CheckCircle2, FileArchive, FileText, Upload, X } from 'lucide-react';
import { toast } from 'sonner';
import {
  addModelDataSafetyEvaluationTask,
  addModelTrustEvaluationTask,
} from '@/api/evaluation';
import { uploadSysFile } from '@/api/file';
import { useUser, type EvalTask } from '../context/UserContext';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogTitle } from './ui/dialog';
import { Label } from './ui/label';
import { fileToStoredAttachment } from '../data/workflowStore';

type Variant = 'model-data' | 'deep-model';

interface Props {
  open: boolean;
  onClose: () => void;
  variant: Variant;
}

const COPY = {
  'model-data': {
    title: '创建模型数据安全评测任务',
    subtitle: '上传数据工程文件，并说明本次评测希望重点关注的问题',
    uploadTitle: '上传数据或工程文件',
    uploadHint: '支持 ZIP、RAR、7Z、TAR、CSV、JSON、JSONL 等格式',
    accept: '.zip,.rar,.7z,.tar,.gz,.csv,.json,.jsonl,.docx',
    placeholder: '例如：希望重点检查训练数据的异常样本、标注质量和数据分布是否均衡。',
    evalType: '模型数据安全评测' as const,
    model: '用户上传的数据工程',
  },
  'deep-model': {
    title: '创建深度模型可信评测任务',
    subtitle: '上传模型或工程文件，并说明本次评测希望重点验证的可信能力',
    uploadTitle: '上传模型或工程文件',
    uploadHint: '支持 ZIP、RAR、7Z、TAR、PT、PTH、PB、ONNX、H5 等格式',
    accept: '.zip,.rar,.7z,.tar,.gz,.pt,.pth,.pb,.onnx,.h5',
    placeholder: '例如：我想重点测试模型的鲁棒性，以及在对抗扰动下的表现。',
    evalType: '深度模型可信测评' as const,
    model: '用户上传的模型工程',
  },
};

export function LightweightUploadTaskModal({ open, onClose, variant }: Props) {
  const { user, addTask } = useUser();
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [request, setRequest] = useState('');
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const copy = COPY[variant];

  useEffect(() => {
    if (!open) {
      setFile(null);
      setRequest('');
      setSuccess(false);
      setSubmitting(false);
    }
  }, [open]);

  const submit = async () => {
    if (!file) {
      toast.error('请先上传本地模型或工程文件');
      return;
    }
    if (!request.trim()) {
      toast.error('请填写本次评测诉求');
      return;
    }
    if (submitting) return;

    const requirement = request.trim();
    const userId = Number(user.id);

    setSubmitting(true);
    try {
      const uploaded = await uploadSysFile(file);
      if (uploaded.id == null) {
        throw new Error('文件上传成功但未返回文件 ID');
      }

      const payload = {
        ...(Number.isFinite(userId) ? { userId } : {}),
        evaluationRequirement: requirement,
        fileId: uploaded.id,
      };

      const created =
        variant === 'deep-model'
          ? await addModelTrustEvaluationTask(payload)
          : await addModelDataSafetyEvaluationTask(payload);

      const attachment = await fileToStoredAttachment(file, 'input');
      const createdAt =
        created.createdAt ||
        new Date().toLocaleString('zh-CN', { hour12: false });
      const task: EvalTask = {
        id: created.id != null ? String(created.id) : `${variant}-${Date.now()}`,
        name: `${file.name}评测任务`,
        model: copy.model,
        modelType: '本地工程文件',
        evalSet: requirement,
        evalType: copy.evalType,
        status: '待受理',
        score: null,
        createdAt,
        plan: 'paid',
        requirement,
        attachments: [attachment],
      };
      addTask(task);
      setSuccess(true);
      toast.success('任务已提交，等待平台受理');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : '任务提交失败');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent className="max-w-[680px] overflow-hidden p-0" showCloseButton={false}>
        <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-blue-600 px-7 py-5 text-white">
          <div className="flex items-start justify-between gap-4">
            <div>
              <DialogTitle className="text-xl font-bold text-white">{copy.title}</DialogTitle>
              <p className="mt-1.5 text-sm leading-6 text-blue-100">{copy.subtitle}</p>
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
              <Button variant="outline" onClick={onClose} disabled={submitting}>取消</Button>
              <Button
                className="bg-blue-600 px-6 hover:bg-blue-700"
                onClick={() => void submit()}
                disabled={submitting}
              >
                {submitting ? '提交中…' : '创建评测任务'}
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
