import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Building2, Calendar, CheckCircle2, ChevronDown, Mail, Phone, User, X } from 'lucide-react';

type ExpertConsultModalProps = {
  open: boolean;
  onClose: () => void;
  serviceName: string;
  accent?: string;
  topics: string[];
};

export function ExpertConsultModal({
  open,
  onClose,
  serviceName,
  accent = '#2563eb',
  topics,
}: ExpertConsultModalProps) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', topic: '' });

  if (!open) return null;

  const set = (key: keyof typeof form) => (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(current => ({ ...current, [key]: event.target.value }));

  const close = () => {
    onClose();
    window.setTimeout(() => {
      setSubmitted(false);
      setLoading(false);
      setForm({ name: '', email: '', phone: '', company: '', topic: '' });
    }, 220);
  };

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    const subject = encodeURIComponent(`${serviceName}专家咨询预约`);
    const body = encodeURIComponent(`姓名：${form.name}\n企业邮箱：${form.email}\n手机号：${form.phone}\n公司：${form.company}\n咨询主题：${form.topic || '未选择'}`);
    window.location.href = `mailto:contact@hzrongshu.cn?subject=${subject}&body=${body}`;
    setLoading(false);
    setSubmitted(true);
  };

  const inputClass = 'w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100';

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/65 p-5 backdrop-blur-md" onClick={close}>
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="relative max-h-[92vh] w-full max-w-[520px] overflow-y-auto rounded-3xl bg-white shadow-[0_32px_90px_rgba(15,23,42,0.32)]"
        onClick={event => event.stopPropagation()}
      >
        <button onClick={close} className="absolute right-5 top-5 z-10 flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-200" aria-label="关闭咨询弹窗">
          <X className="h-4 w-4" />
        </button>

        {submitted ? (
          <div className="px-9 py-14 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-emerald-200 bg-emerald-50">
              <CheckCircle2 className="h-8 w-8 text-emerald-500" />
            </div>
            <h3 className="mt-6 text-2xl font-black text-slate-950">请在邮件客户端确认发送</h3>
            <p className="mt-3 text-sm leading-7 text-slate-500">
              咨询信息已整理至邮件正文；发送后专家会结合您的业务情况准备针对性的{serviceName}建议。
            </p>
            <button onClick={close} className="mt-7 rounded-xl px-7 py-3 text-sm font-bold text-white" style={{ background: accent }}>
              完成
            </button>
          </div>
        ) : (
          <div className="p-8">
            <div className="mb-6 pr-10">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl text-white" style={{ background: `linear-gradient(135deg,${accent},#2563eb)` }}>
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-950">预约 1 对 1 专家咨询</h3>
                  <p className="mt-1 text-xs text-slate-500">{serviceName} · 免费初步需求评估</p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {['24h 内响应', '专家一对一', '信息严格保密'].map(item => (
                  <span key={item} className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-[11px] font-semibold text-blue-700">{item}</span>
                ))}
              </div>
            </div>

            <form onSubmit={submit} className="space-y-4">
              {[
                { key: 'name' as const, label: '姓名', placeholder: '请输入您的姓名', type: 'text', icon: User },
                { key: 'email' as const, label: '企业邮箱', placeholder: 'your@company.com', type: 'email', icon: Mail },
                { key: 'phone' as const, label: '手机号', placeholder: '便于专家快速联系', type: 'tel', icon: Phone },
                { key: 'company' as const, label: '公司名称', placeholder: '请输入公司名称', type: 'text', icon: Building2 },
              ].map(item => {
                const Icon = item.icon;
                return (
                  <label key={item.key} className="block">
                    <span className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-slate-700"><Icon className="h-3.5 w-3.5" />{item.label}<i className="not-italic text-red-500">*</i></span>
                    <input required type={item.type} value={form[item.key]} onChange={set(item.key)} placeholder={item.placeholder} className={inputClass} />
                  </label>
                );
              })}
              <label className="block">
                <span className="mb-1.5 block text-xs font-bold text-slate-700">希望重点咨询的内容</span>
                <div className="relative">
                  <select value={form.topic} onChange={set('topic')} className={`${inputClass} appearance-none pr-10`}>
                    <option value="">请选择（可选）</option>
                    {topics.map(topic => <option key={topic}>{topic}</option>)}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                </div>
              </label>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={loading} className="flex-1 rounded-xl py-3 text-sm font-bold text-white disabled:bg-slate-400" style={{ background: loading ? undefined : accent }}>
                  {loading ? '提交中…' : '提交预约'}
                </button>
                <button type="button" onClick={close} className="rounded-xl border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-500 hover:bg-slate-50">取消</button>
              </div>
              <p className="text-center text-[11px] text-slate-400">提交即表示同意信息仅用于本次服务咨询与后续联系</p>
            </form>
          </div>
        )}
      </motion.div>
    </div>
  );
}
