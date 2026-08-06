import React from 'react';
import {
  Activity,
  AudioWaveform,
  BadgeCheck,
  BarChart3,
  BookOpenCheck,
  Bot,
  BrainCircuit,
  Bug,
  ClipboardCheck,
  Code2,
  Crosshair,
  Database,
  FileCheck2,
  FileSearch,
  FileText,
  Fingerprint,
  Gauge,
  Image,
  Landmark,
  Network,
  Radar,
  Scale,
  ScanSearch,
  ShieldAlert,
  ShieldCheck,
  Video,
  Workflow,
  Zap,
  type LucideIcon,
} from 'lucide-react';

type ProductSide = 'data' | 'model' | 'system' | 'service';
type ProductConcept =
  | 'privacy'
  | 'model-data'
  | 'aigc'
  | 'deep-model'
  | 'embodied'
  | 'agent'
  | 'llm-performance'
  | 'llm-safety'
  | 'code-audit'
  | 'penetration'
  | 'filing'
  | 'standards'
  | 'help';

const SIDE_THEME: Record<ProductSide, { image: string; tint: string }> = {
  data: { image: '/hero-data-side.webp', tint: 'rgba(37,99,235,0.18)' },
  model: { image: '/hero-model-side.webp', tint: 'rgba(79,70,229,0.18)' },
  system: { image: '/hero-system-side.webp', tint: 'rgba(8,145,178,0.17)' },
  service: { image: '/hero-service-side.webp', tint: 'rgba(15,159,127,0.16)' },
};

const CONCEPT_ICONS: Record<ProductConcept, LucideIcon[]> = {
  privacy: [Fingerprint, FileSearch, ShieldCheck],
  'model-data': [Database, ScanSearch, BadgeCheck],
  aigc: [FileText, Image, AudioWaveform, Video],
  'deep-model': [BrainCircuit, Activity, ShieldCheck],
  embodied: [Bot, Radar, Zap],
  agent: [Workflow, Network, ShieldAlert],
  'llm-performance': [Gauge, BarChart3, Zap],
  'llm-safety': [BrainCircuit, ShieldAlert, ShieldCheck],
  'code-audit': [Code2, Bug, FileSearch],
  penetration: [Crosshair, Network, ShieldAlert],
  filing: [FileCheck2, Landmark, BadgeCheck],
  standards: [Scale, BookOpenCheck, ClipboardCheck],
  help: [BookOpenCheck, FileSearch, ClipboardCheck],
};

/**
 * Bright product-detail background aligned with the homepage visual system.
 * Product-specific icon constellations distinguish each product concept.
 */
export function ProductHeroBackground({
  side,
  concept,
  className = '',
}: {
  side: ProductSide;
  concept?: ProductConcept;
  className?: string;
}) {
  const theme = SIDE_THEME[side];
  const icons = concept ? CONCEPT_ICONS[concept] : [];

  return (
    <div
      className={`absolute inset-0 overflow-hidden pointer-events-none select-none ${className}`}
      aria-hidden="true"
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url('${theme.image}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          transform: 'scale(1.015)',
          filter: 'brightness(.91) saturate(.93)',
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(90deg,rgba(249,252,255,0.97) 0%,rgba(245,250,255,0.92) 34%,rgba(235,246,255,0.52) 57%,rgba(226,242,253,0.08) 100%)',
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg,rgba(255,255,255,0.14) 0%,rgba(235,247,255,0.04) 58%,rgba(147,198,229,0.10) 100%)',
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(90deg,rgba(255,255,255,0) 43%,rgba(62,127,176,0.12) 68%,rgba(28,91,142,0.30) 100%)',
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at 78% 42%, ${theme.tint} 0%, rgba(255,255,255,0) 48%)`,
        }}
      />
      {icons.length > 0 && (
        <div
          className="absolute"
          style={{
            right: '4%',
            top: '11%',
            width: '43%',
            height: '76%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 18,
            opacity: 0.24,
          }}
        >
          {icons.map((Icon, index) => (
            <div
              key={`${concept}-${index}`}
              style={{
                width: index === 0 ? 112 : 76,
                height: index === 0 ? 112 : 76,
                display: 'grid',
                placeItems: 'center',
                borderRadius: index === 0 ? 32 : 24,
                color: index === 0 ? '#1677d2' : '#2097c6',
                background: 'rgba(255,255,255,0.38)',
                border: '1px solid rgba(255,255,255,0.62)',
                boxShadow: '0 18px 52px rgba(43,108,161,0.16), inset 0 1px 0 rgba(255,255,255,0.9)',
                backdropFilter: 'blur(10px)',
                transform: `translateY(${index % 2 === 0 ? -20 : 24}px) rotate(${index === 0 ? -4 : 4}deg)`,
              }}
            >
              <Icon size={index === 0 ? 48 : 31} strokeWidth={1.55} />
            </div>
          ))}
        </div>
      )}
      <div
        className="absolute inset-x-0 bottom-0 h-32"
        style={{
          background: 'linear-gradient(180deg,rgba(224,241,253,0) 0%,rgba(205,232,249,0.20) 100%)',
        }}
      />
    </div>
  );
}
