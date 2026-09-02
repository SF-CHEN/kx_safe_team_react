import React, { useState } from 'react';
import { ArrowRight, Building2, ContactRound, MessageSquareText, Phone, ShieldCheck, UserRound } from 'lucide-react';
import { toast } from 'sonner';
import { submitUserContact } from '@/api/contact';

export function ProductContactSection({ productName }: { productName: string }) {
  const [form, setForm] = useState({ name: '', company: '', contact: '', demand: '' });
  const [submitting, setSubmitting] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.name.trim() || !form.company.trim() || !form.contact.trim() || !form.demand.trim()) {
      toast.error('请完整填写姓名、公司、联系方式和需求描述');
      return;
    }
    try {
      setSubmitting(true);
      await submitUserContact({
        userName: form.name.trim(),
        companyName: form.company.trim(),
        contactInformation: form.contact.trim(),
        requirementDescription: `【${productName}】${form.demand.trim()}`,
      });
      setForm({ name: '', company: '', contact: '', demand: '' });
      toast.success('提交成功，我们将尽快与您联系');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : '提交失败，请稍后重试');
    } finally {
      setSubmitting(false);
    }
  };

  const fields = [
    { key: 'name' as const, label: '姓名', placeholder: '请输入您的姓名', icon: UserRound },
    { key: 'company' as const, label: '公司', placeholder: '请输入公司名称', icon: Building2 },
    { key: 'contact' as const, label: '联系方式', placeholder: '手机号或邮箱', icon: Phone },
  ];

  return <section id="product-contact" aria-labelledby="product-contact-title" className="scroll-mt-28 border-t border-slate-200 bg-[#f5f7fa] px-5 py-16 sm:px-6 lg:py-20">
    <div className="mx-auto max-w-5xl">
      <div className="text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700"><ContactRound className="h-3.5 w-3.5" />联系我们</span>
        <h2 id="product-contact-title" className="mt-5 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">需要更贴合业务的解决方案？</h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-slate-500">留下您的需求，我们将围绕“{productName}”提供产品说明与实施建议。</p>
      </div>
      <form onSubmit={submit} className="mx-auto mt-10 rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,.08)] sm:p-9">
        <div className="grid gap-5 md:grid-cols-3">
          {fields.map(item => {
            const Icon = item.icon;
            return <label key={item.key} className="block text-sm font-bold text-slate-800">{item.label}<span className="relative mt-2 block"><Icon className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input value={form[item.key]} onChange={event => setForm(current => ({ ...current, [item.key]: event.target.value }))} placeholder={item.placeholder} className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm font-normal text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50" /></span></label>;
          })}
        </div>
        <label className="mt-5 block text-sm font-bold text-slate-800">需求描述<span className="relative mt-2 block"><MessageSquareText className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" /><textarea value={form.demand} onChange={event => setForm(current => ({ ...current, demand: event.target.value }))} placeholder="请简要描述您的业务场景、关注问题和期望交付内容" className="min-h-28 w-full resize-y rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm font-normal leading-6 text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50" /></span></label>
        <button type="submit" disabled={submitting} className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-sm font-black text-white shadow-lg shadow-blue-200 transition hover:-translate-y-0.5 hover:shadow-xl">{submitting ? '提交中…' : '提交咨询'} <ArrowRight className="h-4 w-4" /></button>
        <div className="mt-5 flex flex-wrap justify-center gap-x-7 gap-y-2 text-xs text-slate-400"><span className="inline-flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5" />信息仅用于本次业务联系</span><span>专家一对一沟通</span><span>工作日内回复</span></div>
      </form>
    </div>
  </section>;
}
