import React from 'react';
import { CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';

export function AuthBrandPanel({ mode }: { mode: 'login' | 'register' }) {
  return (
    <div className="relative hidden min-h-[620px] overflow-hidden lg:block">
      <img
        src="/rongsu-ai-security-hero.webp"
        alt="榕数科技玄鉴 AI 安全平台"
        className="absolute inset-0 h-full w-full object-cover object-[62%_center]"
        fetchPriority="high"
        decoding="async"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#eef6ff]/98 via-[#eef6ff]/82 to-[#eef6ff]/20" />
      <div className="relative flex h-full max-w-[620px] flex-col justify-between p-12 xl:p-16">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200/80 bg-white/70 px-3 py-1.5 text-xs font-bold tracking-wider text-blue-700 backdrop-blur">
            <Sparkles className="h-3.5 w-3.5" />RONGSHU · XUANJIAN
          </div>
          <h2 className="mt-8 max-w-lg text-4xl font-black leading-[1.25] text-slate-950">
            {mode === 'login' ? '让每一次 AI 创新，都建立在可信安全之上' : '加入玄鉴，开启可信 AI 安全实践'}
          </h2>
          <p className="mt-5 max-w-md text-sm leading-7 text-slate-600">
            榕数科技玄鉴平台覆盖数据、模型、系统与合规治理，为企业提供从在线验证到专业评测交付的全生命周期 AI 安全服务。
          </p>
        </div>

        <div className="grid max-w-lg grid-cols-3 gap-3">
          {[
            { icon: ShieldCheck, title: '全栈安全能力', desc: '四大产品体系' },
            { icon: CheckCircle2, title: '可信评测流程', desc: '任务与报告闭环' },
            { icon: Sparkles, title: '快速在线验证', desc: '内置体验样例' },
          ].map(item => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="rounded-2xl border border-white/80 bg-white/72 p-4 shadow-sm backdrop-blur">
                <Icon className="h-5 w-5 text-blue-600" />
                <b className="mt-3 block text-xs text-slate-900">{item.title}</b>
                <span className="mt-1 block text-[10px] text-slate-500">{item.desc}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

