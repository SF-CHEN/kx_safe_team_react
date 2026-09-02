import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router';
import { ChevronDown, ChevronRight, ArrowLeft } from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { TianyuanArch } from '../components/TianyuanArch';
import { TianhengArch } from '../components/TianhengArch';
import { TianjianArch } from '../components/TianjianArch';
import { TianceArch } from '../components/TianceArch';

interface SubProduct {
  name: string;
  path: string;
}

const PRODUCT_META: {
  id: string;
  name: string;
  subtitle: string;
  color: string;
  sectionId: string;
  subProducts: SubProduct[];
}[] = [
  {
    id: 'tianyuan',
    name: '数据侧',
    subtitle: '数据侧',
    color: '#8b5cf6',
    sectionId: 'po-tianyuan',
    subProducts: [
      { name: '个人敏感信息审查', path: '/privacy-data-audit' },
      { name: '数据集安全评测', path: '/model-safety-eval' },
      { name: 'AIGC内容审核与鉴伪', path: '/aigc-content' },
      { name: 'AIGC内容标识与检测', path: '/aigc-content-marking' },
    ],
  },
  {
    id: 'tianheng',
    name: '模型侧',
    subtitle: '模型侧',
    color: '#3b82f6',
    sectionId: 'po-tianheng',
    subProducts: [
      { name: '深度模型可信测评', path: '/deep-model-eval' },
      { name: '具身智能可信评测', path: '/embodied-intelligence' },
      { name: '智能体安全评测', path: '/agent-safety' },
      { name: '大模型性能评测', path: '/llm-evaluation' },
      { name: '大模型安全评测', path: '/safety-evaluation' },
    ],
  },
  {
    id: 'tianjian',
    name: '系统侧',
    subtitle: '系统侧',
    color: '#06b6d4',
    sectionId: 'po-tianjian',
    subProducts: [
      { name: '代码漏洞审查', path: '/code-vulnerability-audit' },
      { name: '网络渗透测试', path: '/penetration-test' },
    ],
  },
  {
    id: 'tianche',
    name: '合规治理侧',
    subtitle: '合规治理侧',
    color: '#10b981',
    sectionId: 'po-tianche',
    subProducts: [
      { name: '人工智能安全教学平台', path: '/ai-safety-edu' },
      { name: '大模型备案服务', path: '/model-filing-service' },
      { name: '可信安全标准制定服务', path: '/tianche-standard-service' },
    ],
  },
];

function ProductDropdown({ meta }: { meta: typeof PRODUCT_META[0] }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpen(true);
  };
  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setOpen(false), 150);
  };

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all"
        style={{
          background: `${meta.color}12`,
          color: meta.color,
          border: `1px solid ${meta.color}30`,
        }}
      >
        了解{meta.name}系列
        <ChevronDown
          className="w-3.5 h-3.5 transition-transform duration-200"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
        />
      </button>

      {open && (
        <div
          className="absolute right-0 top-full mt-1.5 rounded-xl overflow-hidden z-50"
          style={{
            background: '#fff',
            border: '1px solid rgba(226,232,240,0.9)',
            boxShadow: '0 12px 36px rgba(0,0,0,0.12)',
            minWidth: 220,
          }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="px-3 py-2" style={{ borderBottom: '1px solid #f1f5f9' }}>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              {meta.name} · {meta.subtitle}
            </span>
          </div>
          {meta.subProducts.map((sub) => (
            <button
              key={sub.name}
              className="w-full flex items-center gap-2 px-3 py-2.5 text-left group transition-colors hover:bg-gray-50"
              onClick={() => navigate(sub.path)}
            >
              <ChevronRight
                className="w-3.5 h-3.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ color: meta.color }}
              />
              <span
                className="text-sm text-gray-600 group-hover:font-medium transition-all"
                style={{ '--accent': meta.color } as React.CSSProperties}
              >
                {sub.name}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function ProductsOverview() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* Page header */}
      <section
        className="py-14 px-4 text-center"
        style={{ background: 'linear-gradient(135deg,#f8faff,#eef2ff,#f0fdf4)' }}
      >
        <div className="max-w-4xl mx-auto">
          <button
            className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 mb-6 transition-colors"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="w-4 h-4" />
            返回首页
          </button>
          <Badge className="mb-4 bg-indigo-50 text-indigo-700 border-indigo-200 text-xs">产品体系</Badge>
          <h1
            className="text-gray-900 mb-3"
            style={{ fontSize: '2.25rem', fontWeight: 900, lineHeight: 1.2 }}
          >
            四大产品系列
          </h1>
          <div
            className="h-1 w-14 rounded-full mx-auto mb-4"
            style={{ background: 'linear-gradient(90deg,#8b5cf6,#3b82f6,#06b6d4,#10b981)' }}
          />
          <p className="text-gray-500 text-sm max-w-xl mx-auto">
            数据侧 · 模型侧 · 系统侧 · 合规治理侧，覆盖 AI 安全全生命周期
          </p>

          {/* Quick nav pills */}
          <div className="flex items-center justify-center gap-3 mt-6 flex-wrap">
            {PRODUCT_META.map((m) => (
              <button
                key={m.id}
                className="text-xs px-4 py-1.5 rounded-full font-semibold transition-all hover:-translate-y-0.5"
                style={{
                  background: `${m.color}12`,
                  color: m.color,
                  border: `1px solid ${m.color}30`,
                }}
                onClick={() => {
                  const el = document.getElementById(m.sectionId);
                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
              >
                {m.name} · {m.subtitle}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Product detail sections */}
      {PRODUCT_META.map((meta) => {
        const sections: Record<string, React.ReactNode> = {
          'po-tianyuan': <TianyuanArch />,
          'po-tianheng': <TianhengArch />,
          'po-tianjian': <TianjianArch />,
          'po-tianche': <TianceArch />,
        };
        return (
          <div key={meta.id} id={meta.sectionId} className="relative">
            {/* Floating dropdown badge — top right */}
            <div
              className="absolute z-20"
              style={{ top: 28, right: 28 }}
            >
              <ProductDropdown meta={meta} />
            </div>
            {sections[meta.sectionId]}
          </div>
        );
      })}
    </div>
  );
}
