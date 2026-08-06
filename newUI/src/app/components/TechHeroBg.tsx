import React from 'react';

/**
 * TechHeroBg – decorative layered SVG background for hero/banner sections.
 * Renders holographic wave bands, grid lines, light orbs and floating particles
 * entirely via inline SVG + CSS keyframe animations (no external dependencies).
 */
export function TechHeroBg({ className = '' }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`absolute inset-0 overflow-hidden pointer-events-none select-none ${className}`}
    >
      {/* ── Base gradient mesh ── */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1e3a8a] via-[#1e40af] to-[#1e3880] opacity-95" />

      {/* ── Perspective grid ── */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.10]" preserveAspectRatio="none">
        <defs>
          <pattern id="grid" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#60a5fa" strokeWidth="0.6" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* ── Wave bands (animated) ── */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="wave1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0" />
            <stop offset="30%" stopColor="#60a5fa" stopOpacity="0.35" />
            <stop offset="70%" stopColor="#818cf8" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="wave2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0" />
            <stop offset="40%" stopColor="#38bdf8" stopOpacity="0.20" />
            <stop offset="80%" stopColor="#60a5fa" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="wave3" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0" />
            <stop offset="50%" stopColor="#a78bfa" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
          </linearGradient>

          <style>{`
            @keyframes waveFlow1 {
              0%   { d: path("M0,160 C240,100 480,220 720,140 C960,60 1200,180 1440,120 L1440,320 L0,320 Z"); }
              50%  { d: path("M0,140 C200,220 480,80  720,160 C960,220 1200,80  1440,160 L1440,320 L0,320 Z"); }
              100% { d: path("M0,160 C240,100 480,220 720,140 C960,60 1200,180 1440,120 L1440,320 L0,320 Z"); }
            }
            @keyframes waveFlow2 {
              0%   { d: path("M0,200 C300,120 600,260 900,180 C1100,120 1300,200 1440,150 L1440,320 L0,320 Z"); }
              50%  { d: path("M0,170 C280,260 560,100 840,200 C1080,280 1260,140 1440,200 L1440,320 L0,320 Z"); }
              100% { d: path("M0,200 C300,120 600,260 900,180 C1100,120 1300,200 1440,150 L1440,320 L0,320 Z"); }
            }
            @keyframes waveFlow3 {
              0%   { d: path("M0,240 C360,160 720,300 1080,200 C1240,160 1360,230 1440,190 L1440,320 L0,320 Z"); }
              50%  { d: path("M0,210 C320,300 660,160 1000,240 C1180,290 1340,190 1440,240 L1440,320 L0,320 Z"); }
              100% { d: path("M0,240 C360,160 720,300 1080,200 C1240,160 1360,230 1440,190 L1440,320 L0,320 Z"); }
            }
            @keyframes floatOrb {
              0%, 100% { transform: translateY(0px) scale(1); opacity: 0.5; }
              50%       { transform: translateY(-18px) scale(1.06); opacity: 0.8; }
            }
            @keyframes pulseGlow {
              0%, 100% { opacity: 0.3; }
              50%       { opacity: 0.7; }
            }
            @keyframes drift {
              0%   { transform: translate(0px, 0px); }
              33%  { transform: translate(8px, -5px); }
              66%  { transform: translate(-5px, 8px); }
              100% { transform: translate(0px, 0px); }
            }
          `}</style>
        </defs>

        {/* Wave 1 – primary blue */}
        <path
          d="M0,160 C240,100 480,220 720,140 C960,60 1200,180 1440,120 L1440,320 L0,320 Z"
          fill="url(#wave1)"
          style={{ animation: 'waveFlow1 9s ease-in-out infinite' }}
        />
        {/* Wave 2 – cyan */}
        <path
          d="M0,200 C300,120 600,260 900,180 C1100,120 1300,200 1440,150 L1440,320 L0,320 Z"
          fill="url(#wave2)"
          style={{ animation: 'waveFlow2 12s ease-in-out infinite' }}
        />
        {/* Wave 3 – violet */}
        <path
          d="M0,240 C360,160 720,300 1080,200 C1240,160 1360,230 1440,190 L1440,320 L0,320 Z"
          fill="url(#wave3)"
          style={{ animation: 'waveFlow3 15s ease-in-out infinite' }}
        />
      </svg>

      {/* ── Light orbs ── */}
      <div
        className="absolute top-[10%] left-[8%] w-72 h-72 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(96,165,250,0.22) 0%, transparent 70%)',
          animation: 'floatOrb 7s ease-in-out infinite',
          filter: 'blur(2px)',
        }}
      />
      <div
        className="absolute top-[20%] right-[10%] w-96 h-96 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(129,140,248,0.18) 0%, transparent 70%)',
          animation: 'floatOrb 10s ease-in-out infinite 2s',
          filter: 'blur(3px)',
        }}
      />
      <div
        className="absolute bottom-[5%] left-[30%] w-64 h-64 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(34,211,238,0.14) 0%, transparent 70%)',
          animation: 'floatOrb 8s ease-in-out infinite 4s',
          filter: 'blur(2px)',
        }}
      />

      {/* ── Holographic light band (horizontal streak) ── */}
      <div
        className="absolute left-0 right-0"
        style={{
          top: '38%',
          height: '1px',
          background: 'linear-gradient(90deg, transparent 0%, rgba(147,197,253,0.6) 30%, rgba(199,210,254,0.8) 50%, rgba(147,197,253,0.6) 70%, transparent 100%)',
          animation: 'pulseGlow 4s ease-in-out infinite',
          boxShadow: '0 0 16px 4px rgba(147,197,253,0.3)',
        }}
      />
      <div
        className="absolute left-0 right-0"
        style={{
          top: '62%',
          height: '1px',
          background: 'linear-gradient(90deg, transparent 0%, rgba(99,102,241,0.4) 40%, rgba(167,139,250,0.6) 55%, rgba(99,102,241,0.4) 70%, transparent 100%)',
          animation: 'pulseGlow 6s ease-in-out infinite 1.5s',
          boxShadow: '0 0 12px 3px rgba(99,102,241,0.2)',
        }}
      />

      {/* ── Floating particles ── */}
      {[
        { x: '15%', y: '25%', size: 3, delay: '0s', dur: '6s' },
        { x: '78%', y: '18%', size: 2, delay: '1s', dur: '8s' },
        { x: '45%', y: '55%', size: 2, delay: '2s', dur: '7s' },
        { x: '65%', y: '70%', size: 3, delay: '0.5s', dur: '9s' },
        { x: '28%', y: '80%', size: 2, delay: '3s', dur: '6.5s' },
        { x: '88%', y: '50%', size: 2, delay: '1.5s', dur: '7.5s' },
        { x: '55%', y: '30%', size: 2, delay: '2.5s', dur: '8.5s' },
        { x: '10%', y: '65%', size: 3, delay: '4s', dur: '6s' },
        { x: '92%', y: '82%', size: 2, delay: '0.8s', dur: '10s' },
      ].map((p, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-blue-300"
          style={{
            left: p.x,
            top: p.y,
            width: p.size,
            height: p.size,
            animation: `drift ${p.dur} ease-in-out infinite ${p.delay}, pulseGlow ${p.dur} ease-in-out infinite ${p.delay}`,
            boxShadow: `0 0 ${p.size * 3}px ${p.size}px rgba(147,197,253,0.6)`,
          }}
        />
      ))}

      {/* ── Glass panel glints ── */}
      <div
        className="absolute top-0 left-[20%] w-px h-full"
        style={{
          background: 'linear-gradient(180deg, transparent 0%, rgba(147,197,253,0.15) 40%, rgba(199,210,254,0.25) 60%, transparent 100%)',
        }}
      />
      <div
        className="absolute top-0 left-[75%] w-px h-full"
        style={{
          background: 'linear-gradient(180deg, transparent 0%, rgba(99,102,241,0.12) 35%, rgba(167,139,250,0.2) 65%, transparent 100%)',
        }}
      />

      {/* ── Subtle vignette overlay for readability ── */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-black/20" />
    </div>
  );
}