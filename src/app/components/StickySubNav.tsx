import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface SubNavItem {
  id: string;
  label: string;
}

interface StickySubNavProps {
  items: SubNavItem[];
}

const NAV_HEIGHT = 60;

export function StickySubNav({ items }: StickySubNavProps) {
  const [isFixed, setIsFixed] = useState(false);
  const [fixedTop, setFixedTop] = useState(0);
  const [activeId, setActiveId] = useState<string>(items[0]?.id ?? '');
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const placeholderRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Measure the actual visible bottom of the global header
    const getHeaderBottom = (): number => {
      const header = document.querySelector('header');
      if (!header) return 0;
      const rect = header.getBoundingClientRect();
      // If header has scrolled away (rect.bottom <= 0), treat as 0
      return Math.max(0, rect.bottom);
    };

    const getStickyStackBottom = () => {
      const headerBottom = getHeaderBottom();
      const breadcrumbEl = document.querySelector('[data-breadcrumb]');
      const breadcrumbBottom = breadcrumbEl ? Math.max(0, breadcrumbEl.getBoundingClientRect().bottom) : 0;
      const subNavEl = document.querySelector('[data-layout-subnav]');
      const subNavBottom = subNavEl ? Math.max(0, subNavEl.getBoundingClientRect().bottom) : 0;
      return Math.max(headerBottom, breadcrumbBottom, subNavBottom);
    };

    const handleScroll = () => {
      const placeholder = placeholderRef.current;
      if (!placeholder) return;

      // Use the actual visual bottom of the sticky stack instead of adding
      // heights. This avoids double-counting and fractional-pixel gaps.
      const stickyTop = getStickyStackBottom();

      const placeholderTop = placeholder.getBoundingClientRect().top;

      // Switch to fixed when the placeholder's top reaches below header + breadcrumb + subnav
      if (placeholderTop <= stickyTop) {
        setIsFixed(true);
        // Overlap the preceding sticky layer by one pixel so page content can
        // never show through between the two navigation bars.
        setFixedTop(Math.max(0, Math.floor(stickyTop) - 1));
      } else {
        setIsFixed(false);
        setFixedTop(0);
      }

      // Scroll spy
      const offset = stickyTop + NAV_HEIGHT;
      let current = items[0]?.id ?? '';
      for (const item of items) {
        const el = document.getElementById(item.id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= offset + 8) current = item.id;
      }
      setActiveId(current);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Also re-measure on resize (header height can change)
    window.addEventListener('resize', handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [items]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const header = document.querySelector('header');
    const headerBottom = header ? Math.max(0, header.getBoundingClientRect().bottom) : 0;
    const breadcrumbEl = document.querySelector('[data-breadcrumb]');
    const breadcrumbBottom = breadcrumbEl ? Math.max(0, breadcrumbEl.getBoundingClientRect().bottom) : 0;
    const subNavEl = document.querySelector('[data-layout-subnav]');
    const subNavBottom = subNavEl ? Math.max(0, subNavEl.getBoundingClientRect().bottom) : 0;
    const stickyStackBottom = Math.max(headerBottom, breadcrumbBottom, subNavBottom);
    const offset = stickyStackBottom + NAV_HEIGHT;
    const top = el.getBoundingClientRect().top + window.scrollY - offset - 8;
    window.scrollTo({ top, behavior: 'smooth' });
  };

  const nudgeNav = (dir: 'left' | 'right') => {
    scrollRef.current?.scrollBy({ left: dir === 'left' ? -240 : 240, behavior: 'smooth' });
  };

  const navBar = (
    <div
      style={{
        width: '100%',
        background: '#6b7f96',
        boxShadow: '0 2px 12px rgba(0,0,0,0.2)',
        zIndex: 41,
        ...(isFixed
          ? { position: 'fixed', top: fixedTop, left: 0, right: 0 }
          : { position: 'relative' }),
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          height: NAV_HEIGHT,
          padding: '0 4px',
        }}
      >
        <button
          aria-label="向左滚动"
          onClick={() => nudgeNav('left')}
          style={{
            flexShrink: 0,
            width: 40,
            height: NAV_HEIGHT,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: 'rgba(255,255,255,0.5)',
          }}
        >
          <ChevronLeft size={20} />
        </button>

        <div
          ref={scrollRef}
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflowX: 'auto',
            scrollbarWidth: 'none',
            gap: 0,
          }}
        >
          {items.map((item) => {
            const highlighted = activeId === item.id || hoveredId === item.id;
            return (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                onMouseEnter={() => setHoveredId(item.id)}
                onMouseLeave={() => setHoveredId(null)}
                style={{
                  flexShrink: 0,
                  padding: '0 22px',
                  height: NAV_HEIGHT,
                  fontSize: 15,
                  fontWeight: 600,
                  color: highlighted ? '#f43f5e' : '#ffffff',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: highlighted ? '2px solid #f43f5e' : '2px solid transparent',
                  cursor: 'pointer',
                  transition: 'color 0.15s, border-color 0.15s',
                  whiteSpace: 'nowrap',
                  letterSpacing: '0.02em',
                }}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        <button
          aria-label="向右滚动"
          onClick={() => nudgeNav('right')}
          style={{
            flexShrink: 0,
            width: 40,
            height: NAV_HEIGHT,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: 'rgba(255,255,255,0.5)',
          }}
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Placeholder: always occupies NAV_HEIGHT so layout doesn't jump when nav goes fixed */}
      <div ref={placeholderRef} style={{ height: NAV_HEIGHT, flexShrink: 0 }}>
        {!isFixed && navBar}
      </div>
      {isFixed && navBar}
    </>
  );
}
