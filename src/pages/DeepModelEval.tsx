import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { ScrollReveal } from '../components/ScrollReveal';
import { StickySubNav } from '../components/StickySubNav';
import { Badge } from '../components/ui/badge';
import { ProductHeroBackground } from '../components/ProductHeroBackground';
import { GuestGuard } from '../components/GuestGuard';
import { LightweightUploadTaskModal } from '../components/LightweightUploadTaskModal';
import { useUser } from '../context/UserContext';
import {
  BarChart2, Shield, CheckCircle, ArrowRight,
  Upload, X, FileText, Lock, Zap, Eye, Cpu,
} from 'lucide-react';

// ── Hero Dashboard: Model Analysis Visualization ───────────────────

function HeroModelDashboard() {
  return (
    <div style={{ position: 'relative', width: 460, height: 400, flexShrink: 0 }}>
      {/* Glowing rings */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }} aria-hidden="true">
        <defs>
          <style>{`
            @keyframes heroRingB{0%{transform:scale(0.82);opacity:0.45}100%{transform:scale(1.55);opacity:0}}
            @keyframes heroPulseB{0%,100%{opacity:0.25}50%{opacity:0.65}}
            @keyframes scanBarB{0%{top:40px;opacity:0.9}48%{top:200px;opacity:0.9}50%{opacity:0}51%{top:40px;opacity:0}100%{top:40px;opacity:0}}
          `}</style>
        </defs>
        {[0, 0.9, 1.8].map((delay, i) => (
          <ellipse key={i} cx="230" cy="200" rx="165" ry="142"
            fill="none"
            stroke={['#1d4ed8','#3b82f6','#93c5fd'][i]}
            strokeWidth="1.2"
            style={{ animation: `heroRingB 3.2s ease-out infinite ${delay}s`, transformOrigin: '230px 200px' }} />
        ))}
        <ellipse cx="230" cy="200" rx="155" ry="133" fill="none" stroke="#1d4ed8" strokeWidth="1.8"
          style={{ animation: 'heroPulseB 4s ease-in-out infinite', opacity: 0.2 }} />
      </svg>

      {/* Main dashboard card */}
      <div style={{
        position: 'absolute',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%) perspective(900px) rotateX(6deg) rotateY(-5deg)',
        width: 330, height: 230,
        background: 'linear-gradient(145deg, #0c1524 0%, #1e293b 100%)',
        borderRadius: 18,
        border: '1px solid rgba(29,78,216,0.45)',
        boxShadow: '0 0 50px rgba(29,78,216,0.22), 0 24px 70px rgba(0,0,0,0.55)',
        overflow: 'hidden',
      }}>
        {/* Title bar */}
        <div style={{ padding: '9px 14px', background: 'rgba(29,78,216,0.12)', borderBottom: '1px solid rgba(29,78,216,0.22)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ display: 'flex', gap: 5 }}>
            {['#ef4444','#f59e0b','#10b981'].map((c, i) => (
              <div key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: c, opacity: 0.75 }} />
            ))}
          </div>
          <span style={{ flex: 1, textAlign: 'center', fontSize: 9.5, color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace' }}>deep_model_eval.py</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 6px #10b981' }} />
            <span style={{ fontSize: 8.5, color: '#34d399', fontWeight: 700 }}>LIVE</span>
          </div>
        </div>

        {/* Code area */}
        <div style={{ padding: '12px 14px', position: 'relative', overflow: 'hidden', height: 'calc(100% - 52px)' }}>
          {[
            { t: '>>> model.load("resnet50_v2.pth")', c: '#93c5fd' },
            { t: '>>> eval.run(checks=["adversarial","backdoor","performance"])', c: '#bfdbfe' },
            { t: '[✓] 正在执行对抗攻击与性能评估...', c: '#34d399' },
            { t: '[WARN] FGSM 攻击成功率 → 12.4%', c: '#fbbf24' },
            { t: '[WARN] 检测到后门触发器嫌疑特征', c: '#f87171' },
            { t: '[SCAN] 正在进行量化与逆向窃取评测', c: '#e2e8f0' },
            { t: '[DONE] 报告 → model_eval_report.pdf', c: '#93c5fd' },
          ].map((line, i) => (
            <div key={i} style={{ fontSize: 8.5, fontFamily: 'monospace', color: line.c, marginBottom: 5, opacity: 0.95, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {line.t}
            </div>
          ))}
          {/* Scanning bar */}
          <div style={{
            position: 'absolute', left: 0, right: 0, height: 2,
            background: 'linear-gradient(90deg, transparent 0%, rgba(29,78,216,0.9) 50%, transparent 100%)',
            boxShadow: '0 0 10px rgba(29,78,216,0.6)',
            animation: 'scanBarB 3.5s linear infinite',
          }} />
          {/* Status row */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '5px 14px', background: 'rgba(0,0,0,0.45)', display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: 10 }}>
              <span style={{ fontSize: 8, color: '#93c5fd', fontFamily: 'monospace' }}>对抗 ✓</span>
              <span style={{ fontSize: 8, color: '#93c5fd', fontFamily: 'monospace' }}>性能 ✓</span>
              <span style={{ fontSize: 8, color: '#fbbf24', fontFamily: 'monospace' }}>后门…</span>
            </div>
            <span style={{ fontSize: 8, color: '#94a3b8', fontFamily: 'monospace' }}>87%</span>
          </div>
        </div>
      </div>

      {/* Stat cards */}
      {[
        { v: '5', sub: '评测算法维度', top: '6%',  left: '0%',  color: '#60a5fa', glow: 'rgba(96,165,250,0.35)' },
        { v: '2', sub: '模型接入方式', top: '6%', right: '0%', color: '#4ade80', glow: 'rgba(74,222,128,0.35)' },
        { v: '报告', sub: '结果统一输出', bottom: '6%', right: '0%', color: '#fb923c', glow: 'rgba(251,146,60,0.35)' },
      ].map((s, i) => (
        <div key={i} style={{
          position: 'absolute',
          top: 'top' in s ? s.top : undefined,
          bottom: 'bottom' in s ? s.bottom : undefined,
          left: 'left' in s ? s.left : undefined,
          right: 'right' in s ? s.right : undefined,
          background: 'rgba(10,18,35,0.82)',
          backdropFilter: 'blur(14px)',
          border: `1px solid ${s.color}50`,
          borderRadius: 12,
          padding: '12px 18px',
          textAlign: 'center',
          boxShadow: `0 0 24px ${s.glow}, 0 6px 20px rgba(0,0,0,0.5)`,
          minWidth: 88,
        }}>
          <div style={{ fontSize: 26, fontWeight: 900, color: s.color, lineHeight: 1, textShadow: `0 0 16px ${s.color}, 0 0 32px ${s.color}88` }}>
            {s.v}
          </div>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)', marginTop: 5, fontWeight: 500 }}>{s.sub}</div>
        </div>
      ))}
    </div>
  );
}

// ── Panel: Robustness Radar ────────────────────────────────────────

function RobustnessDashboard() {
  const axes = [
    { label: '旋转鲁棒', value: 0.82 },
    { label: '噪声抗性', value: 0.91 },
    { label: '遮挡容忍', value: 0.74 },
    { label: '亮度适应', value: 0.88 },
    { label: '对比度', value: 0.79 },
    { label: '模糊抵抗', value: 0.95 },
  ];
  const N = axes.length;
  const R = 78;
  const cx = 120, cy = 120;
  const angle = (i: number) => (i * 2 * Math.PI) / N - Math.PI / 2;
  const pt = (i: number, r: number) => ({
    x: cx + r * Math.cos(angle(i)),
    y: cy + r * Math.sin(angle(i)),
  });

  const gridLevels = [0.25, 0.5, 0.75, 1.0];
  const dataPoints = axes.map((a, i) => pt(i, a.value * R));
  const dataPath = dataPoints.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ') + 'Z';

  return (
    <div style={{ width: '100%', background: 'linear-gradient(150deg,#0c1524,#1a2540,#1e293b)', borderRadius: 20, padding: '20px', overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ display: 'flex', gap: 4 }}>
            {['#ef4444','#f59e0b','#10b981'].map((c,i) => <div key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: c, opacity: 0.7 }} />)}
          </div>
          <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace' }}>robustness_radar.py</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#3b82f6', boxShadow: '0 0 6px #3b82f6' }} />
          <span style={{ fontSize: 9, color: '#93c5fd', fontWeight: 700 }}>ANALYSIS</span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
        {/* Radar SVG */}
        <svg width="240" height="240" viewBox="0 0 240 240" style={{ flexShrink: 0 }}>
          <defs>
            <radialGradient id="radarFill" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#1d4ed8" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.15" />
            </radialGradient>
          </defs>
          {/* Grid */}
          {gridLevels.map((level, li) => {
            const points = axes.map((_, i) => pt(i, level * R));
            const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ') + 'Z';
            return (
              <path key={li} d={path} fill="none"
                stroke="rgba(255,255,255,0.1)" strokeWidth="0.8" />
            );
          })}
          {/* Axis lines */}
          {axes.map((_, i) => {
            const end = pt(i, R);
            return <line key={i} x1={cx} y1={cy} x2={end.x} y2={end.y} stroke="rgba(255,255,255,0.15)" strokeWidth="0.8" />;
          })}
          {/* Data polygon */}
          <path d={dataPath} fill="url(#radarFill)" stroke="#3b82f6" strokeWidth="2" opacity="0.9" />
          {/* Data dots */}
          {dataPoints.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r="4" fill="#60a5fa" stroke="#1d4ed8" strokeWidth="1.5" />
          ))}
          {/* Labels */}
          {axes.map((a, i) => {
            const labelPt = pt(i, R + 20);
            return (
              <text key={i} x={labelPt.x} y={labelPt.y}
                textAnchor="middle" dominantBaseline="middle"
                fill="rgba(255,255,255,0.6)" style={{ fontSize: 9 }}>
                {a.label}
              </text>
            );
          })}
        </svg>

        {/* Right: metrics */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6, paddingTop: 8 }}>
          {axes.map((a, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(59,130,246,0.15)', borderRadius: 8, padding: '7px 10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)' }}>{a.label}</span>
                <span style={{ fontSize: 12, fontWeight: 800, color: '#60a5fa', fontFamily: 'monospace' }}>{Math.round(a.value * 100)}%</span>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 3, height: 3, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${a.value * 100}%`, background: `linear-gradient(90deg,#1d4ed8,#60a5fa)`, borderRadius: 3 }} />
              </div>
            </div>
          ))}
          <div style={{ marginTop: 4, background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 8, padding: '8px 10px', textAlign: 'center' }}>
            <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)', marginBottom: 2 }}>综合鲁棒性评分</div>
            <div style={{ fontSize: 22, fontWeight: 900, color: '#34d399', fontFamily: 'monospace' }}>85.2</div>
            <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)' }}>/ 100</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Panel: Adversarial Attack Simulation ──────────────────────────

function AdversarialDemo() {
  const [attackType, setAttackType] = useState<'fgsm' | 'pgd' | 'cw'>('fgsm');
  const [epsilon, setEpsilon] = useState(0.03);

  const attacks = [
    { id: 'fgsm' as const, label: 'FGSM', color: '#ef4444', successRate: 0.124 },
    { id: 'pgd' as const, label: 'PGD', color: '#f59e0b', successRate: 0.183 },
    { id: 'cw' as const, label: 'C&W', color: '#8b5cf6', successRate: 0.071 },
  ];
  const current = attacks.find(a => a.id === attackType)!;
  const effectiveRate = Math.min(current.successRate * (1 + epsilon * 10), 0.95);

  return (
    <div style={{ width: '100%', background: 'linear-gradient(150deg,#0c1524,#1a2540,#1e293b)', borderRadius: 20, overflow: 'hidden' }}>
      <div style={{ padding: '10px 14px', background: 'rgba(239,68,68,0.08)', borderBottom: '1px solid rgba(239,68,68,0.18)', display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ display: 'flex', gap: 4 }}>
          {['#ef4444','#f59e0b','#10b981'].map((c,i) => <div key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: c, opacity: 0.7 }} />)}
        </div>
        <span style={{ flex: 1, textAlign: 'center', fontSize: 9.5, color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace' }}>adversarial_lab.py</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#ef4444', boxShadow: '0 0 6px #ef4444' }} />
          <span style={{ fontSize: 8.5, color: '#f87171', fontWeight: 700 }}>ATTACK LAB</span>
        </div>
      </div>

      <div style={{ padding: '16px' }}>
        {/* Attack type selector */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
          {attacks.map(a => (
            <button key={a.id} onClick={() => setAttackType(a.id)}
              style={{ flex: 1, padding: '6px 8px', borderRadius: 7, fontSize: 11, fontWeight: 700, cursor: 'pointer', border: `1.5px solid ${attackType === a.id ? a.color : 'rgba(255,255,255,0.1)'}`, background: attackType === a.id ? `${a.color}20` : 'transparent', color: attackType === a.id ? a.color : 'rgba(255,255,255,0.45)', transition: 'all 0.15s' }}>
              {a.label}
            </button>
          ))}
        </div>

        {/* Epsilon slider */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: 9.5, color: 'rgba(255,255,255,0.4)' }}>扰动强度 ε</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: current.color, fontFamily: 'monospace' }}>{epsilon.toFixed(2)}</span>
          </div>
          <input type="range" min="0.01" max="0.3" step="0.01" value={epsilon}
            onChange={e => setEpsilon(parseFloat(e.target.value))}
            style={{ width: '100%', accentColor: current.color, cursor: 'pointer' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
            <span style={{ fontSize: 8, color: 'rgba(255,255,255,0.25)' }}>弱 (0.01)</span>
            <span style={{ fontSize: 8, color: 'rgba(255,255,255,0.25)' }}>强 (0.30)</span>
          </div>
        </div>

        {/* Visual: before/after */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
          {/* Original */}
          <div style={{ flex: 1, background: 'rgba(255,255,255,0.04)', borderRadius: 8, padding: '8px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ fontSize: 8.5, color: 'rgba(255,255,255,0.35)', marginBottom: 6 }}>原始图像</div>
            <svg viewBox="0 0 60 60" style={{ width: '100%', height: 60 }}>
              <rect width="60" height="60" fill="#1e3a5f" rx="4" />
              <rect x="15" y="10" width="30" height="40" rx="2" fill="#2563eb" opacity="0.6" />
              <circle cx="30" cy="25" r="10" fill="#3b82f6" opacity="0.7" />
              <text x="30" y="46" textAnchor="middle" fill="rgba(255,255,255,0.5)" style={{ fontSize: 7 }}>STOP</text>
              <text x="4" y="56" fill="#10b981" style={{ fontSize: 6 }}>✓ 识别: STOP</text>
            </svg>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
            <div style={{ fontSize: 16, color: current.color }}>→</div>
            <span style={{ fontSize: 7.5, color: current.color, fontWeight: 700, textAlign: 'center', lineHeight: 1.3 }}>{current.label}<br />Attack</span>
          </div>

          {/* Adversarial */}
          <div style={{ flex: 1, background: 'rgba(255,255,255,0.04)', borderRadius: 8, padding: '8px', border: `1px solid ${current.color}30` }}>
            <div style={{ fontSize: 8.5, color: current.color, marginBottom: 6 }}>对抗样本</div>
            <svg viewBox="0 0 60 60" style={{ width: '100%', height: 60 }}>
              <rect width="60" height="60" fill="#1e3a5f" rx="4" />
              {Array.from({ length: 200 }, (_, i) => (
                <rect key={i}
                  x={Math.random() * 60} y={Math.random() * 60}
                  width="1" height="1"
                  fill={`rgba(${Math.random() > 0.5 ? '239,68,68' : '255,255,255'},${Math.min(epsilon * 2, 0.6)})`}
                />
              ))}
              <rect x="15" y="10" width="30" height="40" rx="2" fill="#2563eb" opacity="0.5" />
              <circle cx="30" cy="25" r="10" fill="#3b82f6" opacity="0.5" />
              <text x="30" y="46" textAnchor="middle" fill="rgba(255,255,255,0.4)" style={{ fontSize: 7 }}>STOP</text>
              <text x="4" y="56" fill="#ef4444" style={{ fontSize: 6 }}>✗ 误判: SPEED</text>
            </svg>
          </div>
        </div>

        {/* Metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
          <div style={{ background: `${current.color}0e`, border: `1px solid ${current.color}28`, borderRadius: 7, padding: '7px 9px' }}>
            <div style={{ fontSize: 8.5, color: 'rgba(255,255,255,0.4)', marginBottom: 2 }}>攻击成功率</div>
            <div style={{ fontSize: 16, fontWeight: 900, color: current.color, fontFamily: 'monospace' }}>
              {(effectiveRate * 100).toFixed(1)}%
            </div>
          </div>
          <div style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 7, padding: '7px 9px' }}>
            <div style={{ fontSize: 8.5, color: 'rgba(255,255,255,0.4)', marginBottom: 2 }}>加固后成功率</div>
            <div style={{ fontSize: 16, fontWeight: 900, color: '#34d399', fontFamily: 'monospace' }}>
              {(effectiveRate * 0.15 * 100).toFixed(1)}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Panel: Model Hardening Suggestions ───────────────────────────

function HardenPanel() {
  const suggestions = [
    { icon: '🛡️', color: '#3b82f6', title: '对抗训练加固', desc: '注入 FGSM/PGD 对抗样本进行混合训练，显著提升对已知攻击类型的抵御能力', gain: '+23.4%' },
    { icon: '🔒', color: '#7c3aed', title: '差分隐私保护', desc: '添加 DP-SGD 噪声防止成员推断攻击，保护训练数据隐私，MIA 风险降低至近零', gain: '-98%' },
    { icon: '🧹', color: '#10b981', title: '后门样本清洗', desc: '使用谱特征分析识别并移除触发器样本，在不损害正常准确率的前提下消除后门', gain: '100%清除' },
    { icon: '📦', color: '#f59e0b', title: '模型量化压缩', desc: 'INT8 量化结合随机剪枝，在保持鲁棒性的同时将模型体积减少 75%', gain: '-75%体积' },
  ];

  return (
    <div style={{ width: '100%', background: 'linear-gradient(150deg,#0c1524,#1a2540,#1e293b)', borderRadius: 20, overflow: 'hidden' }}>
      <div style={{ padding: '10px 14px', background: 'rgba(59,130,246,0.1)', borderBottom: '1px solid rgba(59,130,246,0.2)', display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ display: 'flex', gap: 4 }}>
          {['#ef4444','#f59e0b','#10b981'].map((c,i) => <div key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: c, opacity: 0.7 }} />)}
        </div>
        <span style={{ flex: 1, textAlign: 'center', fontSize: 9.5, color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace' }}>model_hardening.py</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#3b82f6', boxShadow: '0 0 6px #3b82f6' }} />
          <span style={{ fontSize: 8.5, color: '#93c5fd', fontWeight: 700 }}>SUGGESTIONS</span>
        </div>
      </div>

      <div style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {suggestions.map((s, i) => (
          <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', background: `${s.color}08`, border: `1px solid ${s.color}22`, borderRadius: 10, padding: '10px 12px' }}>
            <span style={{ fontSize: 18, flexShrink: 0 }}>{s.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: s.color }}>{s.title}</span>
                <span style={{ fontSize: 10, fontWeight: 800, color: '#34d399', fontFamily: 'monospace' }}>{s.gain}</span>
              </div>
              <p style={{ margin: 0, fontSize: 9.5, color: 'rgba(255,255,255,0.45)', lineHeight: 1.6 }}>{s.desc}</p>
            </div>
          </div>
        ))}
        <div style={{ marginTop: 4, padding: '10px 12px', background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.18)', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', flexShrink: 0 }} />
          <span style={{ fontSize: 9.5, color: '#34d399', fontWeight: 600 }}>按推荐方案加固后，预计综合可信评分 82.7 → 96.4</span>
        </div>
      </div>
    </div>
  );
}

// ── Scenario Mocks ────────────────────────────────────────────────

function AutonomousVisionMock() {
  return (
    <div style={{ background: 'linear-gradient(150deg,#0c1524,#1a2540)', borderRadius: 14, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)' }}>
      <div style={{ padding: '8px 12px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 6 }}>
        <div style={{ display: 'flex', gap: 3 }}>
          {['#ef4444','#f59e0b','#10b981'].map((c,i) => <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: c, opacity: 0.7 }} />)}
        </div>
        <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)', fontFamily: 'monospace' }}>lidar_vision_eval.py</span>
      </div>
      <div style={{ padding: '14px 12px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', marginBottom: 5 }}>清晴天气识别准确率</div>
            <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 5, height: 5, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: '98%', background: 'linear-gradient(90deg,#10b981,#34d399)', borderRadius: 5 }} />
            </div>
            <div style={{ fontSize: 10, color: '#34d399', fontWeight: 700, marginTop: 2 }}>98.2%</div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', marginBottom: 5 }}>大雾/暴雨后识别准确率</div>
            <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 5, height: 5, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: '71%', background: 'linear-gradient(90deg,#ef4444,#f87171)', borderRadius: 5 }} />
            </div>
            <div style={{ fontSize: 10, color: '#f87171', fontWeight: 700, marginTop: 2 }}>71.0% ⚠</div>
          </div>
        </div>
        {[
          { attack: 'FGSM (ε=0.03)', before: '89.1%', after: '98.6%', c: '#3b82f6' },
          { attack: 'PGD (ε=0.05)',  before: '76.8%', after: '95.3%', c: '#7c3aed' },
          { attack: '物理贴片攻击',  before: '54.2%', after: '91.7%', c: '#f59e0b' },
        ].map((r, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: 10, alignItems: 'center', background: 'rgba(255,255,255,0.03)', borderRadius: 7, padding: '7px 9px' }}>
            <span style={{ fontSize: 9.5, color: 'rgba(255,255,255,0.5)', fontFamily: 'monospace' }}>{r.attack}</span>
            <span style={{ fontSize: 10, fontWeight: 700, color: '#ef4444', fontFamily: 'monospace' }}>{r.before}</span>
            <span style={{ fontSize: 10, fontWeight: 700, color: '#34d399', fontFamily: 'monospace' }}>→ {r.after}</span>
          </div>
        ))}
        <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.25)', textAlign: 'right' }}>对抗训练加固后数值</div>
      </div>
    </div>
  );
}

function MedicalAIMock() {
  const findings = [
    { type: '成员推断攻击', risk: 'HIGH', rate: '23.1%', fixed: '1.4%' },
    { type: '模型逆向攻击', risk: 'HIGH', rate: '14.8%', fixed: '0.7%' },
    { type: '属性推断',     risk: 'MED',  rate: '8.2%',  fixed: '2.1%' },
  ];
  const riskColor: Record<string, string> = { HIGH: '#ef4444', MED: '#f59e0b', LOW: '#10b981' };
  return (
    <div style={{ background: 'linear-gradient(150deg,#0c1524,#1a2540)', borderRadius: 14, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)' }}>
      <div style={{ padding: '8px 12px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 6 }}>
        <div style={{ display: 'flex', gap: 3 }}>
          {['#ef4444','#f59e0b','#10b981'].map((c,i) => <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: c, opacity: 0.7 }} />)}
        </div>
        <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)', fontFamily: 'monospace' }}>privacy_mia_audit.py</span>
      </div>
      <div style={{ padding: '14px 12px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.28)', marginBottom: 2 }}>隐私泄露风险审计报告</div>
        {findings.map((f, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto auto', gap: 8, alignItems: 'center', background: 'rgba(255,255,255,0.03)', borderRadius: 7, padding: '8px 10px' }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: riskColor[f.risk], flexShrink: 0 }} />
            <span style={{ fontSize: 9.5, color: 'rgba(255,255,255,0.5)' }}>{f.type}</span>
            <span style={{ fontSize: 10, fontWeight: 700, color: riskColor[f.risk], fontFamily: 'monospace' }}>{f.rate}</span>
            <span style={{ fontSize: 10, fontWeight: 700, color: '#34d399', fontFamily: 'monospace' }}>→ {f.fixed}</span>
          </div>
        ))}
        <div style={{ padding: '8px 10px', background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.18)', borderRadius: 8, display: 'flex', gap: 8, alignItems: 'center' }}>
          <span style={{ fontSize: 10, color: '#34d399' }}>✓</span>
          <span style={{ fontSize: 9.5, color: '#34d399' }}>DP-SGD 差分隐私加固已应用，患者隐私合规 HIPAA/个保法</span>
        </div>
      </div>
    </div>
  );
}

function FinancialModelMock() {
  const dims = [
    { label: '性别公平性', before: 0.61, after: 0.94, color: '#3b82f6' },
    { label: '地域平等机会', before: 0.73, after: 0.91, color: '#7c3aed' },
    { label: '校准置信度',  before: 0.78, after: 0.96, color: '#10b981' },
  ];
  return (
    <div style={{ background: 'linear-gradient(150deg,#0c1524,#1a2540)', borderRadius: 14, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)' }}>
      <div style={{ padding: '8px 12px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 6 }}>
        <div style={{ display: 'flex', gap: 3 }}>
          {['#ef4444','#f59e0b','#10b981'].map((c,i) => <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: c, opacity: 0.7 }} />)}
        </div>
        <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)', fontFamily: 'monospace' }}>fairness_audit.py</span>
      </div>
      <div style={{ padding: '14px 12px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.28)', marginBottom: 2 }}>信贷模型公平性评测报告</div>
        {dims.map((d, i) => (
          <div key={i}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontSize: 9.5, color: 'rgba(255,255,255,0.5)' }}>{d.label}</span>
              <div style={{ display: 'flex', gap: 8 }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: '#ef4444', fontFamily: 'monospace' }}>{Math.round(d.before * 100)}%</span>
                <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>→</span>
                <span style={{ fontSize: 10, fontWeight: 700, color: '#34d399', fontFamily: 'monospace' }}>{Math.round(d.after * 100)}%</span>
              </div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 4, height: 6, overflow: 'hidden', position: 'relative' }}>
              <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${d.before * 100}%`, background: 'rgba(239,68,68,0.4)', borderRadius: 4 }} />
              <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${d.after * 100}%`, background: `linear-gradient(90deg,${d.color},${d.color}cc)`, borderRadius: 4, opacity: 0.7 }} />
            </div>
          </div>
        ))}
        <div style={{ display: 'flex', gap: 6 }}>
          {['去偏重采样','校准后处理','约束优化训练'].map(t => (
            <span key={t} style={{ fontSize: 8.5, padding: '3px 8px', borderRadius: 5, background: 'rgba(59,130,246,0.12)', color: '#93c5fd', border: '1px solid rgba(59,130,246,0.2)' }}>{t} ✓</span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Interactive Adversarial Attack Lab (full section) ─────────────

function AdversarialAttackLab() {
  type AttackType = 'FGSM' | 'PGD' | 'GaussianBlur';
  const [attackType, setAttackType] = useState<AttackType>('FGSM');
  const [epsilon, setEpsilon] = useState(0.007);
  const isAttacking = false;
  const [attacked, setAttacked] = useState(true);

  const attacks: { id: AttackType; label: string; color: string; wrongLabel: string; wrongConf: number }[] = [
    { id: 'FGSM',        label: 'FGSM',        color: '#ef4444', wrongLabel: '北极狐',  wrongConf: 34 },
    { id: 'PGD',         label: 'PGD',         color: '#f59e0b', wrongLabel: '白狼',  wrongConf: 27 },
    { id: 'GaussianBlur',label: 'GaussianBlur', color: '#8b5cf6', wrongLabel: '大白熊犬',  wrongConf: 61 },
  ];
  const current = attacks.find(a => a.id === attackType)!;

  const handleAttackTypeChange = (t: AttackType) => { setAttackType(t); setAttacked(true); };

  const noiseOpacity = Math.min(epsilon * 6, 0.82);
  const blurPx = attackType === 'GaussianBlur' ? epsilon * 60 : 0;

  return (
    <section style={{ background: 'linear-gradient(135deg,#f0f4ff 0%,#f8fafc 100%)', padding: '80px 0', borderTop: '1px solid #e2e8f0' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 40px' }}>
        <ScrollReveal>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ display: 'inline-block', fontSize: 11, color: '#7c3aed', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 700, marginBottom: 12, padding: '4px 16px', background: '#f5f3ff', border: '1px solid #ddd6fe', borderRadius: 20 }}>
              效果预览
            </div>
            <h2 style={{ fontSize: 'clamp(28px,3.5vw,42px)', fontWeight: 900, color: '#0f172a', margin: '0 0 12px' }}>深度模型可信评测结果预览</h2>
            <p style={{ fontSize: 15, color: '#64748b', maxWidth: 560, margin: '0 auto', lineHeight: 1.8 }}>
              通过内置攻击样例查看对抗扰动如何影响模型判断，以及正式报告如何呈现风险与加固建议
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <div style={{ background: '#fff', borderRadius: 24, border: '1px solid #e2e8f0', boxShadow: '0 8px 40px rgba(0,0,0,0.08)', overflow: 'hidden' }}>

            {/* ── Lab header bar ── */}
            <div style={{ padding: '14px 24px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444' }} />
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#f59e0b' }} />
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981' }} />
                <span style={{ marginLeft: 8, fontSize: 13, fontWeight: 700, color: '#0f172a' }}>对抗攻击实验室</span>
                <span style={{ fontSize: 12, color: '#94a3b8' }}>内置样例展示不同攻击方式下的模型误判与可信度变化</span>
              </div>
              <div style={{ padding: '7px 14px', borderRadius: 8, background: '#ecfdf5', color: '#047857', fontSize: 12, fontWeight: 700 }}>内置报告样例</div>
            </div>

            <div style={{ padding: '24px' }}>
              {/* ── Info note ── */}
              <div style={{ padding: '10px 16px', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 10, marginBottom: 20, fontSize: 12, color: '#1e40af', lineHeight: 1.65 }}>
                本演示使用预训练的 <strong>ResNet-50</strong> 图像分类模型作为目标，系统将模拟该模型在面对对抗样本时的识别效果过程。
              </div>

              {/* ── Controls row ── */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 28, flexWrap: 'wrap' }}>
                {/* Attack type selector */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#374151', whiteSpace: 'nowrap' }}>攻击算法</span>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {attacks.map(a => (
                      <button key={a.id} onClick={() => handleAttackTypeChange(a.id)}
                        style={{ padding: '5px 14px', borderRadius: 7, border: `1.5px solid ${attackType === a.id ? a.color : '#e2e8f0'}`, background: attackType === a.id ? `${a.color}12` : '#fff', color: attackType === a.id ? a.color : '#64748b', fontSize: 12, fontWeight: 700, cursor: 'pointer', transition: 'all 0.15s' }}>
                        {a.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Epsilon slider */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 220 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#374151', whiteSpace: 'nowrap' }}>扰动强度 ε</span>
                  <input type="range" min="0.001" max="0.3" step="0.001" value={epsilon}
                    onChange={e => { setEpsilon(parseFloat(e.target.value)); setAttacked(true); }}
                    style={{ flex: 1, accentColor: current.color, cursor: 'pointer', height: 4 }} />
                  <span style={{ fontSize: 13, fontWeight: 800, color: current.color, fontFamily: 'monospace', width: 42, textAlign: 'right' }}>{epsilon.toFixed(3)}</span>
                </div>
              </div>

              {/* ── Image comparison ── */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 20, alignItems: 'center' }}>

                {/* Original */}
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
                    原始图片
                  </div>
                  <div style={{ position: 'relative', borderRadius: 14, overflow: 'hidden', border: '2px solid #e2e8f0', background: '#f1f5f9', aspectRatio: '16/10' }}>
                    <img src="/datasets/imagenet-samoyed.jpg" alt="ImageNet-1K 萨摩耶犬真实分类样例" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />

                    {/* Classification label */}
                    <div style={{ position: 'absolute', bottom: 10, left: 10, background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(8px)', borderRadius: 10, padding: '8px 12px', boxShadow: '0 4px 16px rgba(0,0,0,0.12)', border: '1.5px solid #bbf7d0' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 3 }}>
                        <span style={{ fontSize: 11, color: '#059669', fontWeight: 700 }}>✓ 正确识别</span>
                      </div>
                      <div style={{ fontSize: 10, color: '#374151' }}>ResNet-50 识别结果</div>
                      <div style={{ fontSize: 13, fontWeight: 800, color: '#0f172a', marginTop: 2 }}>萨摩耶犬</div>
                      <div style={{ fontSize: 10, color: '#64748b' }}>置信度 <strong style={{ color: '#059669' }}>97%</strong></div>
                    </div>
                  </div>
                </div>

                {/* Arrow middle */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: `${current.color}15`, border: `2px solid ${current.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: 18, color: current.color }}>{isAttacking ? '⚡' : attacked ? '✓' : '→'}</span>
                  </div>
                  <span style={{ fontSize: 10, fontWeight: 700, color: current.color, textAlign: 'center', lineHeight: 1.3 }}>
                    {attackType}<br />Attack
                  </span>
                  <span style={{ fontSize: 9, color: '#94a3b8', textAlign: 'center' }}>ε={epsilon.toFixed(3)}</span>
                </div>

                {/* Adversarial */}
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: attacked ? '#ef4444' : '#d1d5db', display: 'inline-block', transition: 'background 0.3s' }} />
                    添加扰动后
                  </div>
                  <div style={{ position: 'relative', borderRadius: 14, overflow: 'hidden', border: `2px solid ${attacked ? '#fca5a5' : '#e2e8f0'}`, background: '#f1f5f9', aspectRatio: '16/10', transition: 'border-color 0.3s' }}>
                    <img src="/datasets/imagenet-samoyed.jpg" alt="加入扰动后的 ImageNet-1K 萨摩耶犬样例" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', filter: attacked && attackType === 'GaussianBlur' ? `blur(${Math.min(blurPx, 4)}px)` : 'none', transition: 'filter 0.4s' }} />
                    {attacked && attackType !== 'GaussianBlur' && <div aria-hidden="true" style={{ position: 'absolute', inset: 0, opacity: Math.min(noiseOpacity * 1.8, 0.5), mixBlendMode: 'hard-light', backgroundImage: `repeating-linear-gradient(135deg, transparent 0 2px, ${attackType === 'FGSM' ? '#ef4444' : '#f59e0b'} 2px 3px)`, pointerEvents: 'none' }} />}
                    {isAttacking && <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'rgba(239,68,68,.12)', pointerEvents: 'none' }} />}

                    {/* Classification label */}
                    <div style={{
                      position: 'absolute', bottom: 10, left: 10,
                      background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(8px)',
                      borderRadius: 10, padding: '8px 12px',
                      boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                      border: `1.5px solid ${attacked ? '#fca5a5' : '#e2e8f0'}`,
                      transition: 'border-color 0.3s',
                      opacity: attacked ? 1 : 0.5,
                    }}>
                      {attacked ? (
                        <>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 3 }}>
                            <span style={{ fontSize: 11, color: '#ef4444', fontWeight: 700 }}>✗ 识别错误</span>
                          </div>
                          <div style={{ fontSize: 10, color: '#374151' }}>ResNet-50 识别结果</div>
                          <div style={{ fontSize: 13, fontWeight: 800, color: '#0f172a', marginTop: 2 }}>
                            {current.wrongLabel}
                          </div>
                          <div style={{ fontSize: 10, color: '#64748b' }}>置信度 <strong style={{ color: '#ef4444' }}>{current.wrongConf}%</strong></div>
                        </>
                      ) : (
                        <>
                          <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>原始样本识别结果</div>
                          <div style={{ fontSize: 10, color: '#d1d5db', marginTop: 2 }}>ResNet-50</div>
                        </>
                      )}
                    </div>

                    {/* Noise badge */}
                    {attacked && (
                      <div style={{ position: 'absolute', top: 10, right: 10, background: `${current.color}ee`, borderRadius: 7, padding: '4px 9px' }}>
                        <span style={{ fontSize: 10, fontWeight: 700, color: '#fff' }}>+噪声 ε={epsilon.toFixed(3)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* ── Bottom notes ── */}
              <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 11, color: '#94a3b8', flexWrap: 'wrap', gap: 8 }}>
                <span>✓ 支持 JPG / PNG / WebP 格式 &nbsp;·&nbsp; 本演示仅在浏览器本地运行，不上传至服务器</span>
                <button style={{ background: 'none', border: 'none', color: '#3b82f6', fontSize: 11, cursor: 'pointer', padding: 0 }}>
                  查看攻击原理技术说明 →
                </button>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

function CapabilityMetricBoard({ title, rows, color }: { title: string; rows: { label: string; value: string; progress: number }[]; color: string }) {
  return <div style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
      <div><div style={{ color: '#fff', fontSize: 13, fontWeight: 800 }}>{title}</div><div style={{ marginTop: 4, color: 'rgba(255,255,255,.35)', fontSize: 9, fontFamily: 'monospace' }}>MODEL EVALUATION RESULT</div></div>
      <span style={{ padding: '5px 9px', borderRadius: 20, color, background: `${color}18`, border: `1px solid ${color}55`, fontSize: 9, fontWeight: 800 }}>评测示例</span>
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>{rows.map(row => <div key={row.label} style={{ padding: '12px 14px', borderRadius: 12, border: '1px solid rgba(255,255,255,.08)', background: 'rgba(255,255,255,.04)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginBottom: 8 }}><span style={{ color: 'rgba(255,255,255,.72)', fontSize: 11, fontWeight: 700 }}>{row.label}</span><span style={{ color, fontSize: 11, fontWeight: 900 }}>{row.value}</span></div>
      <div style={{ height: 5, borderRadius: 5, background: 'rgba(255,255,255,.08)', overflow: 'hidden' }}><div style={{ width: `${row.progress}%`, height: '100%', borderRadius: 5, background: `linear-gradient(90deg,${color},${color}88)` }} /></div>
    </div>)}</div>
  </div>;
}

function EvaluationImage({ src, alt }: { src: string; alt: string }) {
  return <div style={{ height: '100%', minHeight: 370, display: 'grid', placeItems: 'center', padding: 8 }}>
    <img src={src} alt={alt} style={{ width: '100%', maxHeight: 470, objectFit: 'contain', borderRadius: 14, border: '1px solid #dbeafe', background: '#f8fafc' }} />
  </div>;
}

function EvaluationImageFlow({ steps }: { steps: { src: string; label: string; caption: string }[] }) {
  return <div style={{ height: '100%', display: 'flex', alignItems: 'stretch', gap: 0 }}>
    {steps.map((step, index) => <div key={step.label} style={{ display: 'contents' }}>
      <div style={{ minWidth: 0, flex: 1, display: 'flex', flexDirection: 'column', border: '1px solid #dbeafe', borderRadius: 14, overflow: 'hidden', background: '#fff' }}>
        <div style={{ height: 236, display: 'grid', placeItems: 'center', background: '#f8fafc' }}>
          <img src={step.src} alt={step.label} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        </div>
        <div style={{ padding: '13px 14px 15px' }}>
          <div style={{ color: '#0f172a', fontSize: 14, fontWeight: 900 }}>{step.label}</div>
          <div style={{ color: '#64748b', fontSize: 12, lineHeight: 1.6, marginTop: 5 }}>{step.caption}</div>
        </div>
      </div>
      {index < steps.length - 1 && <div style={{ width: 34, flexShrink: 0, display: 'grid', placeItems: 'center', position: 'relative', zIndex: 3 }}>
        <div style={{ width: 26, height: 26, borderRadius: 13, background: '#2563eb', color: '#fff', display: 'grid', placeItems: 'center', fontSize: 18, fontWeight: 900, boxShadow: '0 5px 14px rgba(37,99,235,.3)' }}>›</div>
      </div>}
    </div>)}
  </div>;
}

// ── Main Page ─────────────────────────────────────────────────────

export function DeepModelEval() {
  const navigate = useNavigate();
  const { isGuest } = useUser();
  const [modalOpen, setModalOpen] = useState(false);
  const [showGuestGuard, setShowGuestGuard] = useState(false);

  const openModal = () => {
    if (isGuest) setShowGuestGuard(true);
    else setModalOpen(true);
  };

  const Z_PANELS = [
    {
      id: '01', side: 'left' as const, color: '#1d4ed8',
      title: '对抗攻击评测',
      heading: '验证模型面对对抗样本时的安全表现',
      desc: '通过 FGSM、PGD、C&W 等对抗攻击算法构造测试样本，记录攻击前后的模型输出、攻击成功情况和性能变化，定位模型在对抗扰动下的薄弱环节。',
      tags: ['FGSM', 'PGD', 'C&W', '攻击成功率', '结果对比'],
      svg: <EvaluationImageFlow steps={[
        { src: '/deep-model-eval/adversarial-before.png', label: '原始预测', caption: '模型检出 teddy bear，置信度 0.92' },
        { src: '/deep-model-eval/adversarial-perturbation.png', label: '对抗扰动', caption: '构造像素级扰动并叠加至输入样本' },
        { src: '/deep-model-eval/adversarial-after.png', label: '攻击后结果', caption: '目标框消失，模型预测失败' },
      ]} />,
      onExperience: openModal,
    },
    {
      id: '02', side: 'right' as const, color: '#dc2626',
      title: '后门攻击评测',
      heading: '检查触发模式下的异常行为与攻击风险',
      desc: '向模型输入带有触发模式的测试样本，比较正常输入与触发输入下的输出差异，记录后门攻击成功情况和异常行为，为后续风险处置提供依据。',
      tags: ['触发模式', '攻击成功率', '输出差异', '异常行为', '结果留存'],
      svg: <EvaluationImageFlow steps={[
        { src: '/deep-model-eval/backdoor-before.png', label: '正常样本', caption: '原始目标识别为 elephant，置信度 0.99' },
        { src: '/deep-model-eval/backdoor-trigger.png', label: '后门触发器', caption: '向指定位置叠加触发模式' },
        { src: '/deep-model-eval/backdoor-after.png', label: '触发后输出', caption: '目标被误识别为 sheep，置信度 0.99' },
      ]} />,
      onExperience: openModal,
    },
    {
      id: '03', side: 'left' as const, color: '#059669',
      title: '性能评估',
      heading: '量化模型在目标任务上的基础性能',
      desc: '围绕模型任务输出准确率、精确率、召回率和 F1 分数等结果，形成统一的性能评估记录，为安全评测和后续模型优化提供基准。',
      tags: ['准确率', '精确率', '召回率', 'F1分数', '性能基准'],
      svg: <EvaluationImage src="/deep-model-eval/performance-chart.png" alt="准确率、精确率、召回率与 F1 分数性能评估结果" />,
      onExperience: openModal,
    },
    {
      id: '04', side: 'right' as const, color: '#d97706',
      title: '量化评估',
      heading: '从检测输出特征形成多维量化记录',
      desc: '围绕模型检测输出的置信度分布特征和检测模式特征等维度，从置信度质量、跨图片一致性、类别均衡性、空间分布均匀性、尺寸多样性等维度进行量化分析，形成统一的定量评估记录，为模型质量诊断、检测能力评估和后续模型优化提供基准。',
      tags: ['置信度质量', '跨图片一致性', '类别均衡性', '空间分布均匀性', '尺寸多样性'],
      svg: <EvaluationImage src="/deep-model-eval/quantization-radar.png" alt="模型检测输出多维量化评估雷达图" />,
      onExperience: openModal,
    },
    {
      id: '05', side: 'left' as const, color: '#7c3aed',
      title: '逆向窃取评测',
      heading: '评估模型接口面对查询窃取时的风险',
      desc: '通过模拟模型查询与替代模型构建过程，记录查询效率、提取结果和替代模型相似程度，帮助识别模型 API 可能存在的逆向窃取风险。',
      tags: ['查询行为', '模型提取', '替代模型', '相似度', '风险记录'],
      svg: <EvaluationImage src="/deep-model-eval/extraction-gauges.png" alt="逆向窃取风险多仪表盘评估结果" />,
      onExperience: openModal,
    },
  ];

  return (
    <div style={{ background: '#fff', minHeight: '100vh', color: '#0f172a' }}>

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="product-detail-hero" style={{ position: 'relative', overflow: 'hidden', background: 'linear-gradient(135deg,#0f172a 0%,#1e3a8a 55%,#1e293b 100%)', padding: '88px 0 76px' }}>
        <ProductHeroBackground side="model" concept="deep-model" />
        <div style={{ maxWidth: 1160, margin: '0 auto', padding: '0 40px', position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', gap: 48, flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 400px', minWidth: 300 }}>
            <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
              <Badge style={{ background: 'rgba(29,78,216,0.94)', color: '#ffffff', border: '1px solid rgba(147,197,253,0.9)', fontSize: 11 }}>
                <BarChart2 size={10} style={{ marginRight: 4 }} /> 模型评测
              </Badge>
              <Badge style={{ background: 'rgba(67,56,202,0.94)', color: '#ffffff', border: '1px solid rgba(165,180,252,0.9)', fontSize: 11 }}>
                深度模型可信测评
              </Badge>
            </div>
            <h1 style={{ margin: '0 0 16px', fontSize: 'clamp(24px,3.4vw,42px)', color: '#fff', lineHeight: 1.2 }}>
              AI模型可信度的
              <br />
              <span style={{ background: 'linear-gradient(90deg,#93c5fd,#34d399)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                全维度深度评测
              </span>
            </h1>
            <p style={{ margin: '0 0 32px', fontSize: 15, color: 'rgba(255,255,255,0.62)', maxWidth: 500, lineHeight: 1.8 }}>
              覆盖对抗攻击、后门攻击、性能评估、量化评估和逆向窃取五个评测算法维度，为大模型与视觉模型提供从评测到加固的一体化深度可信保障服务。
            </p>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              <button onClick={openModal}
                style={{ padding: '13px 32px', borderRadius: 10, background: 'linear-gradient(135deg,#1d4ed8,#059669)', border: 'none', color: '#fff', fontSize: 14, fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 4px 22px rgba(29,78,216,0.45)' }}>
                <Zap size={16} /> 开始模型评测
              </button>
              <button onClick={() => navigate('/developer')}
                style={{ padding: '13px 26px', borderRadius: 10, background: 'rgba(255,255,255,0.07)', border: '1.5px solid rgba(255,255,255,0.18)', color: 'rgba(255,255,255,0.8)', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
                查看技术文档
              </button>
            </div>
            {/* API link */}
            <div style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={() => navigate('/developer')}
                style={{ background: 'none', border: 'none', color: '#64748b', fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, padding: 0 }}>
                <Shield size={12} /> 今天就试用我们的 API →
              </button>
            </div>
          </div>
          <div style={{ flex: '0 0 auto', display: 'flex', justifyContent: 'center' }}>
            <HeroModelDashboard />
          </div>
        </div>
      </section>

      <StickySubNav items={[
        { id: 'dme-features', label: '核心功能' },
        { id: 'dme-lab', label: '结果预览' },
        { id: 'dme-scenarios', label: '应用场景' },
        { id: 'dme-compat', label: '技术兼容性' },
        { id: 'dme-process', label: '评测流程' },
      ]} />

      {/* ── Core Features Z-layout ───────────────────────────── */}
      <section id="dme-features" style={{ background: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: 1160, margin: '0 auto', padding: '80px 40px 100px' }}>
          <ScrollReveal>
            <div style={{ textAlign: 'center', marginBottom: 64 }}>
              <div style={{ display: 'inline-block', fontSize: 13, color: '#1d4ed8', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 700, marginBottom: 12, padding: '4px 16px', background: '#eff6ff', borderRadius: 20 }}>
                核心能力矩阵
              </div>
              <h2 style={{ fontSize: 'clamp(28px,3.5vw,44px)', fontWeight: 900, color: '#0f172a', margin: '0 0 12px' }}>五项核心评测能力</h2>
              <p style={{ fontSize: 15, color: '#64748b', margin: 0 }}>围绕攻击安全、模型性能、量化效果与模型资产风险形成专项评测结果</p>
            </div>
          </ScrollReveal>

          {Z_PANELS.map((panel, idx) => {
            const isLeft = panel.side === 'left';
            return (
              <ScrollReveal key={panel.id}>
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.12fr) minmax(0,.88fr)', gap: 0, alignItems: 'center', marginTop: idx === 0 ? 0 : 32 }}>
                  <div style={{ order: isLeft ? 0 : 1, padding: isLeft ? '36px 28px 36px 0' : '36px 0 36px 28px' }}>
                    <div style={{ background: 'linear-gradient(145deg,#ffffff,#f8fbff)', border: '1px solid #dbeafe', borderRadius: 20, padding: 14, position: 'relative', overflow: 'visible', minHeight: 400, display: 'flex', flexDirection: 'column', boxShadow: '0 12px 38px rgba(30,64,175,0.10)' }}>
                      <div style={{ position: 'relative', zIndex: 1, flex: 1 }}>{panel.svg}</div>
                    </div>
                  </div>
                  <div style={{ order: isLeft ? 1 : 0, paddingTop: 40, paddingLeft: isLeft ? 42 : 0, paddingRight: isLeft ? 0 : 42, paddingBottom: 20 }}>
                    <div style={{ fontSize: 18, color: panel.color, letterSpacing: '0.04em', fontWeight: 800, marginBottom: 14 }}>功能 {panel.id} &nbsp;·&nbsp; {panel.title}</div>
                    <h3 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', margin: '0 0 16px', lineHeight: 1.35 }}>{panel.heading}</h3>
                    <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.8, margin: '0 0 22px' }}>{panel.desc}</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 28 }}>
                      {panel.tags.map(t => (
                        <span key={t} style={{ fontSize: 11, padding: '5px 12px', borderRadius: 20, background: panel.color+'10', color: panel.color, border: `1px solid ${panel.color}22`, fontWeight: 600 }}>{t}</span>
                      ))}
                    </div>
                    <button onClick={panel.onExperience}
                      style={{ padding: '10px 22px', borderRadius: 9, background: panel.color, border: 'none', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, boxShadow: `0 4px 16px ${panel.color}33` }}>
                      创建评测任务 <ArrowRight size={13} />
                    </button>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </section>

      <div id="dme-lab"><AdversarialAttackLab /></div>

      {/* ── Industry Scenarios ────────────────────────────────── */}
      <section id="dme-scenarios" style={{ background: '#f8fafc', padding: '80px 0', borderTop: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 40px' }}>
          <ScrollReveal>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: '#1d4ed8', textTransform: 'uppercase', letterSpacing: '0.12em', margin: '0 0 10px' }}>行业解决方案</p>
              <h2 style={{ fontSize: 32, fontWeight: 800, color: '#0f172a', margin: '0 0 12px' }}>场景化落地方案</h2>
              <p style={{ fontSize: 16, color: '#64748b' }}>覆盖视觉模型、模型上线验证与模型 API 资产安全场景</p>
            </div>
          </ScrollReveal>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            {[
              {
                id: 'autonomous',
                icon: '🚗',
                accentColor: '#3b82f6',
                tag: '视觉模型安全',
                title: '视觉模型攻防安全验证',
                subtitle: '验证对抗样本与后门触发模式下的模型表现',
                desc: '面向图像分类、目标检测等视觉模型，通过对抗攻击和后门攻击测试，比较正常样本、对抗样本及触发样本下的模型输出，记录攻击成功情况和异常行为。',
                metrics: [
                  { value: '对抗', label: '攻击评测' },
                  { value: '后门', label: '触发测试' },
                  { value: '样本级', label: '结果定位' },
                ],
                tags: ['图像分类', '目标检测', 'FGSM', 'PGD', '后门触发'],
                mock: <div style={{ minHeight: 250 }}><EvaluationImageFlow steps={[
                  { src: '/deep-model-eval/adversarial-before.png', label: '正常输入', caption: '基准预测结果与目标框' },
                  { src: '/deep-model-eval/adversarial-after.png', label: '对抗输入', caption: '扰动后目标框消失' },
                ]} /></div>,
              },
              {
                id: 'deployment',
                icon: '📦',
                accentColor: '#059669',
                tag: '模型上线验证',
                title: '模型质量与检测能力量化评估',
                subtitle: '从检测输出特征形成统一的多维定量记录',
                desc: '面向模型质量诊断与检测能力评估，分析置信度质量、跨图片一致性、类别均衡性、空间分布均匀性与尺寸多样性，形成可用于版本比较和后续优化的量化基准。',
                metrics: [
                  { value: '置信度', label: '质量分析' },
                  { value: '一致性', label: '跨图评估' },
                  { value: '均衡性', label: '分布记录' },
                ],
                tags: ['置信度质量', '跨图片一致性', '类别均衡性', '空间分布', '尺寸多样性'],
                mock: <EvaluationImage src="/deep-model-eval/quantization-radar.png" alt="模型质量多维量化评估结果" />,
              },
              {
                id: 'api-protection',
                icon: '🔗',
                accentColor: '#7c3aed',
                tag: '模型API保护',
                title: '模型API逆向窃取风险评测',
                subtitle: '模拟查询与替代模型构建过程，识别模型资产风险',
                desc: '面向通过 API 提供能力的模型服务，模拟查询和替代模型构建过程，记录查询行为、提取结果与替代模型相似程度，评估接口可能面临的逆向窃取风险。',
                metrics: [
                  { value: '查询', label: '行为记录' },
                  { value: '提取', label: '风险评测' },
                  { value: '相似度', label: '结果指标' },
                ],
                tags: ['API模型', '查询行为', '模型提取', '替代模型', '相似度'],
                mock: <EvaluationImage src="/deep-model-eval/extraction-gauges.png" alt="模型 API 逆向窃取风险评估结果" />,
              },
            ].map(sol => (
              <ScrollReveal key={sol.id}>
                <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 20, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                  <div style={{ height: 4, background: `linear-gradient(90deg,${sol.accentColor},${sol.accentColor}88)` }} />
                  <div style={{ padding: '32px 36px', display: 'grid', gridTemplateColumns: 'minmax(0,.88fr) minmax(0,1.12fr)', gap: 34, alignItems: 'center' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                        <div style={{ fontSize: 28 }}>{sol.icon}</div>
                        <span style={{ padding: '3px 10px', background: `${sol.accentColor}15`, border: `1px solid ${sol.accentColor}40`, borderRadius: 20, fontSize: 11, color: sol.accentColor, fontWeight: 700 }}>{sol.tag}</span>
                      </div>
                      <h3 style={{ margin: '0 0 6px', fontSize: 22, fontWeight: 800, color: '#0f172a' }}>{sol.title}</h3>
                      <p style={{ margin: '0 0 16px', fontSize: 13, color: sol.accentColor, fontWeight: 600 }}>{sol.subtitle}</p>
                      <p style={{ margin: '0 0 24px', fontSize: 14, color: '#475569', lineHeight: 1.8 }}>{sol.desc}</p>
                      <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
                        {sol.metrics.map(m => (
                          <div key={m.label} style={{ padding: '12px 16px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12, textAlign: 'center', minWidth: 80 }}>
                            <div style={{ fontSize: 18, fontWeight: 900, color: sol.accentColor }}>{m.value}</div>
                            <div style={{ fontSize: 11, color: '#64748b', marginTop: 3 }}>{m.label}</div>
                          </div>
                        ))}
                      </div>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        {sol.tags.map(t => (
                          <span key={t} style={{ padding: '4px 12px', background: '#f1f5f9', borderRadius: 20, fontSize: 12, color: '#475569', fontWeight: 500 }}>{t}</span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p style={{ margin: '0 0 16px', fontSize: 12, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>实际效果预览</p>
                      {sol.mock}
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Tech Compatibility ────────────────────────────────── */}
      <section id="dme-compat" style={{ position: 'relative', overflow: 'hidden', backgroundColor: '#f4f8fd', backgroundImage: 'linear-gradient(rgba(37,99,235,.035) 1px,transparent 1px),linear-gradient(90deg,rgba(37,99,235,.035) 1px,transparent 1px),radial-gradient(circle at 18% 62%,rgba(37,99,235,.1),transparent 30%),radial-gradient(circle at 82% 42%,rgba(13,148,136,.09),transparent 28%)', backgroundSize: '32px 32px,32px 32px,auto,auto', padding: '88px 0 96px', borderTop: '1px solid #dbe7f5' }}>
        <div aria-hidden="true" style={{ position: 'absolute', left: '50%', top: 250, width: 520, height: 1, background: 'linear-gradient(90deg,transparent,rgba(37,99,235,.2),rgba(13,148,136,.2),transparent)', transform: 'translateX(-50%)' }} />
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 40px', position: 'relative', zIndex: 1 }}>
          <ScrollReveal>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <div style={{ display: 'inline-block', fontSize: 11, color: '#1d4ed8', textTransform: 'uppercase', letterSpacing: '0.14em', fontWeight: 800, marginBottom: 14, padding: '6px 16px', background: 'rgba(255,255,255,.78)', border: '1px solid #bfdbfe', borderRadius: 20, boxShadow: '0 6px 20px rgba(37,99,235,.08)' }}>
                技术优势
              </div>
              <h2 style={{ fontSize: 'clamp(30px,3vw,40px)', fontWeight: 900, letterSpacing: '-.03em', color: '#0f172a', margin: '0 0 14px' }}>框架适配与模型接入</h2>
              <p style={{ fontSize: 15, color: '#64748b', lineHeight: 1.8, margin: 0 }}>适配四类已验证框架，支持本地模型和 API 接入模型两种方式</p>
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(340px,1fr))', gap: 24, alignItems: 'stretch' }}>
              <article style={{ minHeight: 430, background: 'rgba(255,255,255,.9)', borderRadius: 24, border: '1px solid rgba(148,163,184,.25)', padding: '30px', boxShadow: '0 18px 50px rgba(30,64,175,.08)', backdropFilter: 'blur(12px)', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 18, marginBottom: 26 }}>
                  <div><div style={{ fontSize: 19, fontWeight: 900, color: '#0f172a', marginBottom: 8 }}>已适配的模型框架</div><div style={{ fontSize: 13, color: '#64748b', lineHeight: 1.7 }}>四类框架均已完成模型评测适配验证</div></div>
                  <div style={{ width: 44, height: 44, borderRadius: 14, background: 'linear-gradient(145deg,#eff6ff,#e0ecff)', color: '#2563eb', display: 'grid', placeItems: 'center', border: '1px solid #dbeafe', flexShrink: 0 }}><Cpu size={21} /></div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,minmax(0,1fr))', gap: 14, flex: 1 }}>
                  {[
                    { name: 'PyTorch', mark: 'P', color: '#ee4c2c', soft: '#fff3ef' },
                    { name: 'TensorFlow', mark: 'TF', color: '#f59e0b', soft: '#fff8e7' },
                    { name: 'Keras', mark: 'K', color: '#d00000', soft: '#fff1f2' },
                    { name: 'MindSpore', mark: 'M', color: '#2563eb', soft: '#eff6ff' },
                  ].map((item) => (
                    <div key={item.name} className="transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg" style={{ padding: '20px 16px', background: '#fff', borderRadius: 16, border: '1px solid #e4ebf5', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, boxShadow: '0 6px 20px rgba(15,23,42,.045)', minHeight: 132 }}>
                      <span style={{ width: 48, height: 48, display: 'grid', placeItems: 'center', borderRadius: 15, background: item.soft, color: item.color, fontSize: item.mark.length > 1 ? 15 : 22, fontWeight: 950, letterSpacing: '-.03em', border: `1px solid ${item.color}18` }}>{item.mark}</span>
                      <span style={{ fontSize: 13, color: '#1e293b', fontWeight: 800, textAlign: 'center' }}>{item.name}</span>
                      <span style={{ fontSize: 10, color: '#94a3b8', fontWeight: 600 }}>框架适配</span>
                    </div>
                  ))}
                </div>
              </article>

              <article style={{ minHeight: 430, background: 'rgba(255,255,255,.9)', borderRadius: 24, border: '1px solid rgba(148,163,184,.25)', padding: '30px', boxShadow: '0 18px 50px rgba(30,64,175,.08)', backdropFilter: 'blur(12px)', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 18, marginBottom: 22 }}>
                  <div><div style={{ fontSize: 19, fontWeight: 900, color: '#0f172a', marginBottom: 8 }}>两种模型接入方式</div><div style={{ fontSize: 13, color: '#64748b', lineHeight: 1.7 }}>根据模型交付形态选择匹配的评测入口</div></div>
                  <div style={{ width: 44, height: 44, borderRadius: 14, background: 'linear-gradient(145deg,#ecfeff,#dcfce7)', color: '#0f9f8f', display: 'grid', placeItems: 'center', border: '1px solid #ccfbf1', flexShrink: 0 }}><Zap size={21} /></div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 14, flex: 1 }}>
                  {[
                    {
                      icon: <Lock size={24} />, color: '#2563eb', borderColor: '#cfe0ff', bg: 'linear-gradient(135deg,#f8fbff,#eef5ff)',
                      title: '本地模型',
                      desc: '提交本地模型及必要的运行配置，由评测流程加载模型并执行所选评测算法。',
                      tags: ['模型文件', '运行配置', '算法评测'],
                    },
                    {
                      icon: <Zap size={24} />, color: '#0f9f8f', borderColor: '#bceee7', bg: 'linear-gradient(135deg,#f6fffd,#ebfbf8)',
                      title: 'API接入模型',
                      desc: '通过模型接口地址及必要的调用配置接入，以接口调用方式执行相应评测。',
                      tags: ['接口地址', '调用配置', 'API评测'],
                    },
                  ].map((item) => (
                    <div key={item.title} className="transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md" style={{ padding: '20px', borderRadius: 17, background: item.bg, border: `1px solid ${item.borderColor}`, display: 'flex', gap: 17, alignItems: 'flex-start', flex: 1 }}>
                      <div style={{ width: 52, height: 52, borderRadius: 16, background: '#fff', color: item.color, border: `1px solid ${item.borderColor}`, display: 'grid', placeItems: 'center', boxShadow: `0 8px 22px ${item.color}14`, flexShrink: 0 }}>
                        {item.icon}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 16, fontWeight: 900, color: '#0f172a', marginBottom: 7 }}>{item.title}</div>
                        <p style={{ margin: '0 0 13px', fontSize: 12, color: '#64748b', lineHeight: 1.7 }}>{item.desc}</p>
                        <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
                          {item.tags.map(t => (
                            <span key={t} style={{ fontSize: 10, padding: '4px 9px', borderRadius: 999, background: 'rgba(255,255,255,.5)', color: item.color, border: `1px solid ${item.borderColor}`, fontWeight: 700 }}>{t}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </article>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── 简单四步 ──────────────────────────────────────────── */}
      <section id="dme-process" style={{ background: 'linear-gradient(180deg,#f8fafc 0%,#f0f4f8 100%)', borderTop: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '72px 40px' }}>
          <ScrollReveal>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <div style={{ display: 'inline-block', fontSize: 11, color: '#1d4ed8', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 700, marginBottom: 12, padding: '4px 16px', background: '#eff6ff', borderRadius: 20 }}>
                简单四步
              </div>
              <h2 style={{ fontSize: 28, fontWeight: 800, color: '#0f172a', margin: '0 0 12px' }}>快速启动您的深度模型可信评测</h2>
              <p style={{ fontSize: 14, color: '#64748b', margin: 0 }}>提交模型并选择评测算法后，执行专项评测并输出结果报告</p>
            </div>
          </ScrollReveal>
          <ScrollReveal>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0, position: 'relative' }}>
              {[
                { num: 1, color: '#1d4ed8', bg: '#eff6ff', icon: <Upload size={22} />, title: '接入目标模型', desc: '选择本地模型或 API 接入模型，并补充必要的运行或调用配置' },
                { num: 2, color: '#7c3aed', bg: '#f5f3ff', icon: <Eye size={22} />, title: '选择评测算法', desc: '从对抗攻击、后门攻击、性能、量化和逆向窃取五项能力中按需选择' },
                { num: 3, color: '#059669', bg: '#f0fdf4', icon: <Cpu size={22} />, title: '执行专项评测', desc: '按模型接入方式和所选算法执行测试，记录过程与样本级结果' },
                { num: 4, color: '#f59e0b', bg: '#fffbeb', icon: <FileText size={22} />, title: '获取评测报告', desc: '查看评测指标、异常记录、结果对比与风险说明' },
              ].map((step, i, arr) => (
                <React.Fragment key={step.num}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: '0 0 200px', padding: '0 12px' }}>
                    <div style={{ width: 68, height: 68, borderRadius: '50%', background: step.bg, border: `2px solid ${step.color}28`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: step.color, marginBottom: 16, position: 'relative', boxShadow: `0 6px 24px ${step.color}1e` }}>
                      {step.icon}
                      <div style={{ position: 'absolute', top: -6, right: -6, width: 22, height: 22, borderRadius: '50%', background: step.color, color: '#fff', fontSize: 11, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 2px 8px ${step.color}50` }}>
                        {step.num}
                      </div>
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', marginBottom: 8, textAlign: 'center' }}>{step.title}</div>
                    <div style={{ fontSize: 12, color: '#64748b', textAlign: 'center', lineHeight: 1.65 }}>{step.desc}</div>
                  </div>
                  {i < arr.length - 1 && (
                    <div style={{ flex: '1 0 24px', height: 2, background: `linear-gradient(90deg,${arr[i].color}50,${arr[i+1].color}50)`, maxWidth: 72, marginBottom: 60 }} />
                  )}
                </React.Fragment>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      <LightweightUploadTaskModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        variant="deep-model"
      />
      <GuestGuard open={showGuestGuard} onClose={() => setShowGuestGuard(false)} action="创建深度模型评测任务" />
    </div>
  );
}
