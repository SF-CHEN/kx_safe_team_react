import React from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Home, Search } from 'lucide-react';

export function NotFound() {
  const navigate = useNavigate();
  return (
    <main className="min-h-[70vh] bg-gradient-to-b from-blue-50 to-white px-6 py-24 text-center">
      <div className="mx-auto max-w-xl">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-200"><Search className="h-7 w-7" /></div>
        <p className="mt-8 text-sm font-bold tracking-[0.2em] text-blue-600">404 · PAGE NOT FOUND</p>
        <h1 className="mt-3 text-4xl font-black text-slate-950">没有找到您访问的页面</h1>
        <p className="mt-4 text-base leading-7 text-slate-500">页面可能已调整或链接输入有误，您可以返回首页或回到上一页继续浏览。</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button onClick={() => navigate('/')} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-700"><Home className="h-4 w-4" />返回首页</button>
          <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 hover:border-blue-200 hover:text-blue-600"><ArrowLeft className="h-4 w-4" />返回上一页</button>
        </div>
      </div>
    </main>
  );
}
