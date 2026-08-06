import React, { useState, useEffect } from 'react';

interface NavItem {
  id: string;
  num: string;
  label: string;
  color: string;
  grad: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'section-scenarios', num: '01', label: '需求场景', color: '#f59e0b', grad: 'linear-gradient(135deg,#f59e0b,#f97316)' },
  { id: 'section-tianyuan',  num: '02', label: '数据治理', color: '#8b5cf6', grad: 'linear-gradient(135deg,#8b5cf6,#7c3aed)' },
  { id: 'section-tianheng',  num: '03', label: '模型评测', color: '#3b82f6', grad: 'linear-gradient(135deg,#3b82f6,#4f46e5)' },
  { id: 'section-tianjian',  num: '04', label: '系统安全', color: '#06b6d4', grad: 'linear-gradient(135deg,#06b6d4,#3b82f6)' },
  { id: 'section-tianche',   num: '05', label: '合规治理', color: '#10b981', grad: 'linear-gradient(135deg,#10b981,#059669)' },
];

export function VerticalNavProgress() {
  const [activeId, setActiveId] = useState<string>(NAV_ITEMS[0].id);
  const [visitedSet, setVisitedSet] = useState<Set<string>>(new Set());

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY + window.innerHeight * 0.38;
      let current = NAV_ITEMS[0].id;
      for (const item of NAV_ITEMS) {
        const el = document.getElementById(item.id);
        if (el && el.getBoundingClientRect().top + window.scrollY <= scrollY) {
          current = item.id;
        }
      }
      setActiveId(current);
      setVisitedSet(prev => {
        const next = new Set(prev);
        const idx = NAV_ITEMS.findIndex(n => n.id === current);
        for (let i = 0; i < idx; i++) next.add(NAV_ITEMS[i].id);
        return next;
      });
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const activeIdx = NAV_ITEMS.findIndex(n => n.id === activeId);

  return (
    <div
      className="fixed left-5 z-40 hidden xl:block"
      style={{ top: '50%', transform: 'translateY(-50%)' }}
    >
      {/* Glass capsule container */}
      <div
        style={{
          background: 'rgba(255,255,255,0.93)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.06)',
          border: '1px solid rgba(226,232,240,0.9)',
          borderRadius: 18,
          padding: '10px 8px',
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
          minWidth: 148,
        }}
      >
        {/* Product lifecycle label */}
        <div
          style={{
            fontSize: 9,
            fontWeight: 700,
            color: '#94a3b8',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            textAlign: 'center',
            paddingBottom: 6,
            borderBottom: '1px solid rgba(226,232,240,0.8)',
            marginBottom: 2,
          }}
        >
          AI 生命周期
        </div>

        {NAV_ITEMS.map((item, idx) => {
          const isActive = activeId === item.id;
          const isPast = idx < activeIdx;

          return (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className="group relative flex items-center gap-2.5 rounded-xl transition-all duration-300"
              style={{
                padding: '8px 10px',
                background: isActive ? item.grad : isPast ? `${item.color}0e` : 'transparent',
                border: `1px solid ${isActive ? `${item.color}40` : isPast ? `${item.color}22` : 'transparent'}`,
                cursor: 'pointer',
              }}
            >
              {/* Number badge */}
              <div
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: 7,
                  background: isActive ? 'rgba(255,255,255,0.22)' : isPast ? `${item.color}18` : '#f1f5f9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  fontSize: 10,
                  fontWeight: 800,
                  color: isActive ? '#fff' : isPast ? item.color : '#94a3b8',
                  transition: 'all 0.3s',
                }}
              >
                {isPast && !isActive ? '✓' : item.num}
              </div>

              {/* Label */}
              <span
                style={{
                  fontSize: 12,
                  fontWeight: isActive ? 700 : 600,
                  color: isActive ? '#fff' : isPast ? '#475569' : '#94a3b8',
                  transition: 'all 0.3s',
                  whiteSpace: 'nowrap',
                }}
              >
                {item.label}
              </span>

              {/* Active indicator dot */}
              {isActive && (
                <div
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.7)',
                    marginLeft: 'auto',
                    flexShrink: 0,
                    animation: 'navPulse 2s ease-in-out infinite',
                  }}
                />
              )}
            </button>
          );
        })}

        {/* Progress bar at bottom */}
        <div
          style={{
            marginTop: 6,
            paddingTop: 8,
            borderTop: '1px solid rgba(226,232,240,0.8)',
          }}
        >
          <div
            style={{
              height: 3,
              borderRadius: 4,
              background: '#e2e8f0',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '100%',
                borderRadius: 4,
                background: 'linear-gradient(90deg,#f59e0b,#8b5cf6,#3b82f6,#06b6d4,#10b981)',
                width: `${((activeIdx + 1) / NAV_ITEMS.length) * 100}%`,
                transition: 'width 0.5s cubic-bezier(0.4,0,0.2,1)',
              }}
            />
          </div>
          <div
            style={{
              fontSize: 9,
              color: '#94a3b8',
              textAlign: 'center',
              marginTop: 4,
            }}
          >
            {activeIdx + 1} / {NAV_ITEMS.length}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes navPulse {
          0%, 100% { opacity: 0.7; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.3); }
        }
      `}</style>
    </div>
  );
}
