import React from 'react';

// ─── Livestream Monitor Mock ──────────────────────────────────────────
export function LivestreamMonitorMock() {
  const cells = [
    { id: 1, channel: '频道01 · 游戏直播', ok: true },
    { id: 2, channel: '频道02 · 电商带货', ok: true },
    { id: 3, channel: '频道03 · 户外直播', ok: false, reason: '违禁品展示' },
    { id: 4, channel: '频道04 · 教育直播', ok: true },
    { id: 5, channel: '频道05 · 才艺直播', ok: false, reason: '低俗内容' },
    { id: 6, channel: '频道06 · 体育直播', ok: true },
  ];
  const gradients = [
    'linear-gradient(135deg,#1a3a5c,#0d2137)',
    'linear-gradient(135deg,#1c2a1a,#0d1a0d)',
    'linear-gradient(135deg,#3a1a1a,#1f0d0d)',
    'linear-gradient(135deg,#1a1c3a,#0d1020)',
    'linear-gradient(135deg,#2a1a3a,#160d20)',
    'linear-gradient(135deg,#1a2a3a,#0d1720)',
  ];
  const logs = [
    { time: '12:04:31', msg: '频道03 · 违禁品展示 · 已拦截', type: 'bad' },
    { time: '12:04:29', msg: '频道05 · 低俗内容 · 待人工复核', type: 'bad' },
    { time: '12:04:22', msg: '频道01,02,04,06 巡检正常', type: 'ok' },
    { time: '12:04:18', msg: '批量截帧任务完成 · 3fps', type: 'info' },
    { time: '12:04:10', msg: '频道05 AI置信度 0.91', type: 'info' },
  ];

  return (
    <div style={{ background: '#0d1117', borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)' }}>
      {/* Header */}
      <div style={{ padding: '9px 14px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 6px #22c55e', flexShrink: 0 }} />
        <span style={{ color: '#e2e8f0', fontSize: 12, fontWeight: 700 }}>直播安全监控中心</span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
          <span style={{ padding: '1px 7px', background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: 4, color: '#4ade80', fontSize: 10 }}>监控 8 频道</span>
          <span style={{ padding: '1px 7px', background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 4, color: '#f87171', fontSize: 10 }}>异常 2</span>
        </div>
      </div>

      {/* Grid + log */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 170px' }}>
        {/* Video wall */}
        <div style={{ padding: '10px', display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 5 }}>
          {cells.map((cell, i) => (
            <div key={cell.id} style={{ borderRadius: 5, overflow: 'hidden', border: `1.5px solid ${cell.ok ? 'rgba(255,255,255,0.05)' : '#ef4444'}`, position: 'relative', aspectRatio: '16/9', background: gradients[i], boxShadow: cell.ok ? 'none' : '0 0 8px rgba(239,68,68,0.35)' }}>
              {/* Scan lines */}
              <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(255,255,255,0.015) 2px,rgba(255,255,255,0.015) 3px)', pointerEvents: 'none' }} />
              {/* Light spot */}
              <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 35% 40%,rgba(255,255,255,0.06) 0%,transparent 55%)', pointerEvents: 'none' }} />
              {/* Bottom label */}
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '2px 4px', background: 'linear-gradient(to top,rgba(0,0,0,0.75),transparent)', fontSize: 7.5, color: '#94a3b8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {cell.channel}
              </div>
              {/* LIVE badge */}
              {cell.ok && (
                <div style={{ position: 'absolute', top: 3, left: 3, padding: '1px 4px', background: 'rgba(239,68,68,0.8)', borderRadius: 2, fontSize: 7, fontWeight: 700, color: '#fff', letterSpacing: '0.05em' }}>LIVE</div>
              )}
              {/* Violation badge */}
              {!cell.ok && (
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, display: 'flex', justifyContent: 'center', paddingTop: 3 }}>
                  <div style={{ padding: '1px 5px', background: '#ef4444', borderRadius: 3, fontSize: 7.5, fontWeight: 700, color: '#fff' }}>
                    🚨 {(cell as any).reason}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Log panel */}
        <div style={{ borderLeft: '1px solid rgba(255,255,255,0.06)', padding: '10px' }}>
          <div style={{ fontSize: 9, color: '#475569', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 7 }}>实时巡检日志</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {logs.map((log, i) => (
              <div key={i}>
                <div style={{ fontSize: 8.5, color: '#334155', fontFamily: 'monospace' }}>{log.time}</div>
                <div style={{ fontSize: 9, lineHeight: 1.4, marginTop: 1, color: log.type === 'bad' ? '#f87171' : log.type === 'ok' ? '#4ade80' : '#64748b' }}>{log.msg}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div style={{ padding: '7px 14px', borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)', display: 'flex', gap: 20 }}>
        {[
          { label: '今日巡检', value: '8,342 张' },
          { label: '风险告警', value: '23 次', accent: '#ef4444' },
          { label: '平均预警', value: '~4.2s' },
          { label: '检出率', value: '98.5%', accent: '#22c55e' },
        ].map(s => (
          <div key={s.label}>
            <div style={{ fontSize: 11, fontWeight: 700, color: (s as any).accent ?? '#e2e8f0' }}>{s.value}</div>
            <div style={{ fontSize: 8.5, color: '#475569' }}>{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Comment Dashboard Mock ───────────────────────────────────────────
function DonutChart({ slices }: { slices: { pct: number; color: string }[] }) {
  const cx = 40; const cy = 40; const R = 30; const ri = 18;
  let cum = 0;
  const paths = slices.map(({ pct, color }) => {
    const s = (cum / 100) * 2 * Math.PI - Math.PI / 2;
    cum += pct;
    const e = (cum / 100) * 2 * Math.PI - Math.PI / 2;
    const lg = pct > 50 ? 1 : 0;
    const x1 = cx + R * Math.cos(s); const y1 = cy + R * Math.sin(s);
    const x2 = cx + R * Math.cos(e); const y2 = cy + R * Math.sin(e);
    const xi1 = cx + ri * Math.cos(s); const yi1 = cy + ri * Math.sin(s);
    const xi2 = cx + ri * Math.cos(e); const yi2 = cy + ri * Math.sin(e);
    const d = `M ${x1.toFixed(1)} ${y1.toFixed(1)} A ${R} ${R} 0 ${lg} 1 ${x2.toFixed(1)} ${y2.toFixed(1)} L ${xi2.toFixed(1)} ${yi2.toFixed(1)} A ${ri} ${ri} 0 ${lg} 0 ${xi1.toFixed(1)} ${yi1.toFixed(1)} Z`;
    return { d, color };
  });
  return (
    <svg viewBox="0 0 80 80" style={{ width: 72, height: 72 }}>
      {paths.map((p, i) => <path key={i} d={p.d} fill={p.color} />)}
    </svg>
  );
}

export function CommentDashboardMock() {
  const sparkRaw = [12, 18, 24, 19, 32, 45, 38, 52, 41, 38, 29, 24, 31, 42, 55, 49, 38, 34, 28, 22];
  const maxV = Math.max(...sparkRaw);
  const W = 160; const H = 48;
  const sparkPts = sparkRaw.map((v, i) => ({ x: (i / (sparkRaw.length - 1)) * W, y: H - (v / maxV) * H * 0.82 - 4 }));
  const sparkLine = sparkPts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');
  const sparkFill = `${sparkLine} L ${W} ${H} L 0 ${H} Z`;

  const pieSlices = [
    { pct: 42, color: '#f97316', label: '广告营销', val: '42%' },
    { pct: 28, color: '#ef4444', label: '谩骂攻击', val: '28%' },
    { pct: 15, color: '#8b5cf6', label: '色情内容', val: '15%' },
    { pct: 15, color: '#64748b', label: '其他违规', val: '15%' },
  ];

  return (
    <div style={{ background: '#fff', borderRadius: 12, overflow: 'hidden', border: '1px solid #e2e8f0' }}>
      {/* Header */}
      <div style={{ padding: '9px 14px', borderBottom: '1px solid #f1f5f9', background: '#f8fafc', display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: '#0f172a' }}>📊 内容审核数据看板</span>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 4 }}>
          <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 5px #22c55e' }} />
          <span style={{ fontSize: 9, color: '#64748b' }}>实时更新</span>
        </div>
      </div>

      {/* KPI row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', borderBottom: '1px solid #f1f5f9' }}>
        {[
          { label: '今日处理', value: '12.4万', color: '#6366f1' },
          { label: '违规率', value: '2.3%', color: '#ef4444' },
          { label: '拦截量', value: '2,852', color: '#f97316' },
          { label: '人工复核', value: '143', color: '#10b981' },
        ].map((s, i) => (
          <div key={s.label} style={{ padding: '8px 10px', textAlign: 'center', borderRight: i < 3 ? '1px solid #f1f5f9' : 'none' }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 9, color: '#94a3b8', marginTop: 1 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 144px' }}>
        {/* Line chart */}
        <div style={{ padding: '10px 12px', borderRight: '1px solid #f1f5f9' }}>
          <div style={{ fontSize: 9, color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>每分钟处理评论量</div>
          <svg viewBox={`0 0 ${W} ${H + 4}`} style={{ width: '100%', height: 52, display: 'block' }}>
            <line x1="0" x2={W} y1={H * 0.25} y2={H * 0.25} stroke="#f1f5f9" strokeWidth="0.6" />
            <line x1="0" x2={W} y1={H * 0.55} y2={H * 0.55} stroke="#f1f5f9" strokeWidth="0.6" />
            <path d={sparkFill} fill="rgba(99,102,241,0.08)" />
            <path d={sparkLine} fill="none" stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 8, color: '#cbd5e1', marginTop: 2 }}>
            <span>00:00</span><span>06:00</span><span>12:00</span><span>18:00</span><span>23:59</span>
          </div>
        </div>

        {/* Pie chart */}
        <div style={{ padding: '10px' }}>
          <div style={{ fontSize: 9, color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>违规分类</div>
          <DonutChart slices={pieSlices} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 3, marginTop: 4 }}>
            {pieSlices.map(p => (
              <div key={p.label} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <div style={{ width: 7, height: 7, borderRadius: 2, background: p.color, flexShrink: 0 }} />
                <span style={{ fontSize: 8.5, color: '#64748b', flex: 1 }}>{p.label}</span>
                <span style={{ fontSize: 8.5, fontWeight: 700, color: '#374151' }}>{p.val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Compliance Report Mock ───────────────────────────────────────────
export function ComplianceReportMock() {
  const excerpts = [
    { id: 1, role: '客服', text: '我们的产品保证年化收益率12%以上，完全不会亏损！', violation: '承诺保本保收益 · 违反金融广告法', color: '#ef4444' },
    { id: 2, role: '客户', text: '那我需要先了解一下风险说明...', violation: null, color: '' },
    { id: 3, role: '客服', text: '这个产品绝对安全，零投诉！已有10000名客户购买。', violation: '夸大宣传 · 使用绝对化用语', color: '#f97316' },
    { id: 4, role: '客户', text: '好的，我考虑一下。', violation: null, color: '' },
  ];

  return (
    <div style={{ background: '#fff', borderRadius: 12, overflow: 'hidden', border: '1px solid #e2e8f0' }}>
      {/* Header */}
      <div style={{ padding: '9px 14px', borderBottom: '1px solid #f1f5f9', background: 'linear-gradient(135deg,#f8fafc,#f0f4ff)', display: 'flex', alignItems: 'flex-start', gap: 10 }}>
        <span style={{ fontSize: 16, lineHeight: 1 }}>📄</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#0f172a' }}>客服对话合规检测报告</div>
          <div style={{ fontSize: 9, color: '#64748b', marginTop: 2 }}>2024年第一季度 · 金融业务组 · 生成于 2024-03-31</div>
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div style={{ fontSize: 9, color: '#64748b' }}>合规评分</div>
          <div style={{ fontSize: 20, fontWeight: 900, color: '#ef4444', lineHeight: 1 }}>63<span style={{ fontSize: 9, color: '#94a3b8', fontWeight: 400 }}>/100</span></div>
        </div>
      </div>

      {/* Score bar */}
      <div style={{ padding: '7px 14px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 9, color: '#64748b', whiteSpace: 'nowrap', width: 48 }}>合规评分</span>
        <div style={{ flex: 1, height: 5, background: '#f1f5f9', borderRadius: 3, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: '63%', background: 'linear-gradient(90deg,#ef4444,#f97316)', borderRadius: 3 }} />
        </div>
        <span style={{ fontSize: 9, color: '#ef4444', fontWeight: 700, whiteSpace: 'nowrap' }}>不合规</span>
      </div>

      {/* Conversation excerpts */}
      <div style={{ padding: '8px 12px', display: 'flex', flexDirection: 'column', gap: 5 }}>
        {excerpts.map(ex => (
          <div key={ex.id} style={{ padding: '6px 9px', borderRadius: 6, background: ex.violation ? `${ex.color}08` : '#f8fafc', border: ex.violation ? `1px solid ${ex.color}35` : '1px solid transparent' }}>
            <div style={{ fontSize: 9, color: ex.role === '客服' ? '#6366f1' : '#94a3b8', fontWeight: 700, marginBottom: 2 }}>{ex.role}</div>
            <div style={{ fontSize: 10.5, lineHeight: 1.5, color: ex.violation ? '#1e293b' : '#64748b' }}>
              {ex.violation
                ? <span style={{ background: `${ex.color}20`, borderBottom: `1.5px solid ${ex.color}`, padding: '0 1px' }}>{ex.text}</span>
                : ex.text}
            </div>
            {ex.violation && (
              <div style={{ marginTop: 3, fontSize: 8.5, color: ex.color, fontWeight: 700 }}>⚠ {ex.violation}</div>
            )}
          </div>
        ))}
      </div>

      {/* Summary */}
      <div style={{ padding: '7px 14px', borderTop: '1px solid #f1f5f9', background: '#f8fafc', display: 'flex', gap: 16, alignItems: 'center' }}>
        {[
          { label: '违规条数', value: '3', color: '#ef4444' },
          { label: '高风险', value: '2 处', color: '#f97316' },
          { label: '建议处理', value: '人工复核', color: '#6366f1' },
        ].map(s => (
          <div key={s.label} style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
            <span style={{ fontSize: 9, color: '#94a3b8' }}>{s.label}:</span>
            <span style={{ fontSize: 10, fontWeight: 700, color: s.color }}>{s.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
