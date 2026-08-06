import React from 'react';
import { Database, FileText, Image, Mic, Video } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router';

const MODALITIES = [
  { label: '文本', tab: 'text', icon: FileText },
  { label: '图像', tab: 'image', icon: Image },
  { label: '音频', tab: 'audio', icon: Mic },
  { label: '视频', tab: 'video', icon: Video },
];

/**
 * AIGC 产品上下文导航。
 * 正常状态位于 Banner 下方；滚动后吸附在全局导航和面包屑下方。
 */
export function AigcFeatureNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const activeTab = new URLSearchParams(location.search).get('tab') || 'text';

  return (
    <div
      data-layout-subnav
      className="sticky"
      style={{
        top: 120,
        zIndex: 41,
        background: 'rgba(255,255,255,0.97)',
        backdropFilter: 'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)',
        borderBottom: '1px solid rgba(226,232,240,0.9)',
        boxShadow: '0 5px 18px rgba(15,23,42,0.07)',
      }}
    >
      <div
        className="max-w-[1400px] mx-auto flex items-center overflow-x-auto"
        style={{ minHeight: 64, padding: '8px clamp(24px,4vw,56px)', gap: 24 }}
      >
        <div className="flex items-center shrink-0" style={{ gap: 10 }}>
          <div
            className="flex items-center justify-center shrink-0"
            style={{
              width: 30,
              height: 30,
              borderRadius: 9,
              background: 'linear-gradient(135deg,#7c3aed,#a855f7)',
              boxShadow: '0 5px 14px rgba(124,58,237,0.25)',
            }}
          >
            <Database size={16} color="#fff" />
          </div>
          <span style={{ fontSize: 15, color: '#64748b', fontWeight: 600 }}>玄鉴</span>
          <span style={{ fontSize: 15, color: '#cbd5e1' }}>/</span>
          <span style={{ fontSize: 16, color: '#7c3aed', fontWeight: 800 }}>数据智能</span>
        </div>

        <div className="shrink-0" style={{ width: 1, height: 26, background: '#e2e8f0' }} />

        <div className="flex items-center shrink-0" style={{ gap: 6 }}>
          {MODALITIES.map(({ label, tab, icon: Icon }) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => navigate(`/aigc-content?tab=${tab}`)}
                className="flex items-center whitespace-nowrap transition-all"
                style={{
                  gap: 7,
                  padding: '9px 17px',
                  borderRadius: 10,
                  border: `1px solid ${isActive ? 'rgba(124,58,237,0.25)' : 'transparent'}`,
                  background: isActive ? 'linear-gradient(135deg,#7c3aed,#8b5cf6)' : 'transparent',
                  color: isActive ? '#fff' : '#475569',
                  fontSize: 16,
                  fontWeight: isActive ? 750 : 600,
                  cursor: 'pointer',
                  boxShadow: isActive ? '0 6px 16px rgba(124,58,237,0.22)' : 'none',
                }}
              >
                <Icon size={16} />
                {label}
              </button>
            );
          })}
        </div>

        <div className="shrink-0" style={{ width: 1, height: 26, background: '#e2e8f0' }} />

        <div className="flex items-center shrink-0" style={{ gap: 10 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, color: '#334155', fontSize: 15, fontWeight: 700 }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#0ea5e9' }} />
            内容审核
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, color: '#64748b', fontSize: 15, fontWeight: 650 }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#a78bfa' }} />
            鉴伪检测
          </span>
        </div>
      </div>
    </div>
  );
}
