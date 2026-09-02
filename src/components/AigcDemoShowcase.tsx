import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Download, ArrowUpDown, Play, Pause, ChevronDown, ChevronUp, BarChart2 } from 'lucide-react';

type TabKey = 'text' | 'image' | 'audio' | 'video';

// ─── Types ────────────────────────────────────────────────────────────
interface RiskItem   { label: string; score: number; tag?: string }
interface BoxOverlay { x: number; y: number; w: number; h: number; label: string; score: number; color: string }
interface TimelineTrack { name: string; color: string; data: number[] }
interface RiskSegment { start: number; end: number; level: 'high' | 'moderate' }

interface Demo {
  id: string;
  name: string;
  type: 'image' | 'video' | 'text' | 'audio';
  label: string;
  accentColor: string;
  bgGradient: string;
  // video/image
  videoUrl?: string;
  imageUrl?: string;
  riskSegments?: RiskSegment[];
  timeline?: TimelineTrack[];
  // text
  textContent?: string;
  textRisks?: { word: string; color: string; riskLabel: string }[];
  // audio
  audioWaveData?: number[];
  audioTranscript?: string;
  // common
  high: RiskItem[];
  low:  RiskItem[];
  fingerprint: string;
  hideAiTag?: boolean;
  boxes?: BoxOverlay[];
  jsonResponse: string;
}

// ─── Timeline data generator ──────────────────────────────────────────
function wave(n: number, freq: number, phase: number, base: number, amp: number): number[] {
  return Array.from({ length: n }, (_, i) => {
    const t = i / n;
    const v = base + amp * Math.sin(2 * Math.PI * freq * t + phase) + (Math.random() * 0.06 - 0.03);
    return Math.max(0, Math.min(1, v));
  });
}

// ─── Video/Image Demo data ────────────────────────────────────────────
const DEEPFAKE_VIDEO: Demo = {
  id: 'deepfake1',
  name: 'Deepfake_FaceSwap.mp4',
  type: 'video',
  label: 'AI换脸视频',
  accentColor: '#ef4444',
  bgGradient: 'linear-gradient(135deg,#1e293b,#0f172a)',
  videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
  riskSegments: [
    { start: 0.06, end: 0.28, level: 'high' }, { start: 0.28, end: 0.43, level: 'moderate' },
    { start: 0.43, end: 0.67, level: 'high' }, { start: 0.67, end: 0.74, level: 'moderate' },
    { start: 0.74, end: 0.92, level: 'high' },
  ],
  timeline: [
    { name: 'Deepfake概率', color: '#ef4444', data: wave(60, 1.2, 0,   0.75, 0.22) },
    { name: 'AI生成概率',   color: '#8b5cf6', data: wave(60, 0.8, 1.1, 0.82, 0.16) },
    { name: '人脸篡改指数', color: '#f97316', data: wave(60, 1.5, 2.2, 0.60, 0.30) },
  ],
  high: [
    { label: 'AI换脸检测',   score: 0.97, tag: 'DEEPFAKE' },
    { label: '真实人脸替换', score: 0.95, tag: 'FACE_SWAP' },
    { label: '视频时序异常', score: 0.89, tag: 'TEMPORAL' },
  ],
  low: [
    { label: '唇音同步率', score: 0.89 }, { label: '频域伪影分析', score: 0.83 },
    { label: '微表情异常', score: 0.76 }, { label: '光影物理一致性', score: 0.21 },
    { label: '画质模糊度', score: 0.18 }, { label: '编码异常', score: 0.22 },
  ],
  fingerprint: 'FaceSwap v3.1 · Wav2Lip',
  jsonResponse: `{
  "task_id": "task_d8f2a1c9",
  "status": "completed",
  "media_type": "video",
  "verdict": "block",
  "risk_score": 0.97,
  "results": [
    { "dimension": "deepfake_detection", "verdict": "block", "score": 0.97,
      "details": { "face_swap_probability": 0.95, "temporal_inconsistency": 0.89, "gan_fingerprint": "FaceSwap v3.1" }
    },
    { "dimension": "violence", "verdict": "pass", "score": 0.01 }
  ],
  "latency_ms": 1840
}`,
};

const AI_PORTRAIT: Demo = {
  id: 'ai_portrait',
  name: 'AI_Portrait.jpg',
  type: 'image',
  label: 'AI生成肖像',
  accentColor: '#8b5cf6',
  bgGradient: 'linear-gradient(135deg,#1e1b4b,#0f172a)',
  imageUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=480&q=80',
  high: [
    { label: 'AI生成图像',  score: 0.97, tag: 'AI_GEN' },
    { label: 'GAN指纹检测', score: 0.94, tag: 'GAN' },
    { label: '人脸真实性',  score: 0.91, tag: 'FACE' },
  ],
  low: [
    { label: '生物信号一致性', score: 0.04 }, { label: '唇音同步率', score: 0.07 },
    { label: '频域伪影分析', score: 0.91 }, { label: '微表情异常', score: 0.88 },
    { label: '光影物理一致性', score: 0.15 }, { label: '水印检测', score: 0.14 },
  ],
  fingerprint: 'StyleGAN3 · MidJourney v6',
  boxes: [
    { x: 22, y: 8,  w: 56, h: 62, label: '人脸区域 AI生成',  score: 0.97, color: '#ef4444' },
    { x: 30, y: 72, w: 40, h: 14, label: '领口纹理异常',     score: 0.82, color: '#f97316' },
  ],
  jsonResponse: `{
  "task_id": "task_a3e7c820",
  "status": "completed",
  "media_type": "image",
  "verdict": "block",
  "risk_score": 0.97,
  "results": [
    { "dimension": "ai_generated", "verdict": "block", "score": 0.97,
      "details": { "model_fingerprint": "StyleGAN3", "gan_probability": 0.94, "face_authenticity": 0.09 }
    },
    { "dimension": "pornography", "verdict": "pass", "score": 0.00 }
  ],
  "latency_ms": 112
}`,
};

const VIOLENCE_VIDEO: Demo = {
  id: 'violence_video',
  name: 'Violence_Scene.mp4',
  type: 'video',
  label: '暴力场景视频',
  accentColor: '#f97316',
  bgGradient: 'linear-gradient(135deg,#431407,#1c1917)',
  videoUrl: 'https://www.w3schools.com/html/movie.mp4',
  riskSegments: [
    { start: 0.03, end: 0.14, level: 'moderate' }, { start: 0.14, end: 0.38, level: 'high' },
    { start: 0.38, end: 0.56, level: 'moderate' }, { start: 0.56, end: 0.72, level: 'high' },
    { start: 0.72, end: 0.88, level: 'moderate' },
  ],
  timeline: [
    { name: '暴力血腥',  color: '#ef4444', data: wave(60, 1.0, 0,   0.65, 0.32) },
    { name: '武器检测',  color: '#f97316', data: wave(60, 1.4, 0.5, 0.55, 0.38) },
    { name: 'AI生成概率', color: '#8b5cf6', data: wave(60, 0.6, 1.8, 0.12, 0.10) },
  ],
  high: [
    { label: '暴力血腥场景', score: 0.96, tag: 'VIOLENCE' },
    { label: '武器/刀具展示', score: 0.88, tag: 'WEAPON' },
    { label: '人身攻击',     score: 0.83, tag: 'ASSAULT' },
  ],
  low: [
    { label: '色情内容', score: 0.03 }, { label: '低俗着装', score: 0.12 },
    { label: '政治敏感', score: 0.01 }, { label: '版权侵权', score: 0.09 },
    { label: '未成年人', score: 0.04 }, { label: '广告诈骗', score: 0.00 },
  ],
  fingerprint: '审核结果：内容不合规，存在高风险违规项',
  hideAiTag: true,
  jsonResponse: `{
  "task_id": "task_b5f9d311",
  "status": "completed",
  "media_type": "video",
  "verdict": "block",
  "risk_score": 0.96,
  "results": [
    { "dimension": "violence", "verdict": "block", "score": 0.96,
      "details": { "weapon_probability": 0.88, "assault_probability": 0.83, "peak_timestamp_ms": 18400 }
    },
    { "dimension": "ai_generated", "verdict": "pass", "score": 0.12 }
  ],
  "latency_ms": 2210
}`,
};

const SENSITIVE_IMG: Demo = {
  id: 'sensitive_img',
  name: 'Sensitive_Content.jpg',
  type: 'image',
  label: '敏感人物图像',
  accentColor: '#f59e0b',
  bgGradient: 'linear-gradient(135deg,#1c1400,#0f172a)',
  imageUrl: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=480&q=80',
  high: [
    { label: '政治敏感人物', score: 0.93, tag: 'POLITICAL' },
    { label: '违禁内容',     score: 0.87, tag: 'BANNED' },
    { label: '舆情风险',     score: 0.79, tag: 'OPINION' },
  ],
  low: [
    { label: '色情内容', score: 0.00 }, { label: '暴力血腥', score: 0.01 },
    { label: '低俗着装', score: 0.22 }, { label: '版权侵权', score: 0.31 },
    { label: '水印检测', score: 0.08 }, { label: '广告内容', score: 0.00 },
  ],
  fingerprint: '审核结果：内容不合规，存在高风险违规项',
  hideAiTag: true,
  boxes: [{ x: 28, y: 8, w: 44, h: 56, label: '敏感人物', score: 0.93, color: '#ef4444' }],
  jsonResponse: `{
  "task_id": "task_c7a4e982",
  "status": "completed",
  "media_type": "image",
  "verdict": "block",
  "risk_score": 0.93,
  "results": [
    { "dimension": "political_sensitivity", "verdict": "block", "score": 0.93,
      "details": { "sensitive_entity": "detected", "opinion_risk": 0.79 }
    },
    { "dimension": "pornography", "verdict": "pass", "score": 0.00 }
  ],
  "latency_ms": 98
}`,
};

// ─── Text Demo data ────────────────────────────────────────────────────
const TEXT_AUDIT_DEMO: Demo = {
  id: 'text_illegal_promo',
  name: 'Illegal_Promo.txt',
  type: 'text',
  label: '违规广告文本',
  accentColor: '#6366f1',
  bgGradient: 'linear-gradient(135deg,#1e1b4b,#0f172a)',
  textContent: '本店独家配方，科学验证！产品效果100%保证痊愈，无效全额退款。月收益率高达50%，稳赚不赔，零风险暴利！现在下单月销突破10000单。添加微信领取专属价，限时48小时，诱导分享享超低折扣，错过不再！',
  textRisks: [
    { word: '100%保证痊愈', color: '#ef4444', riskLabel: '虚假宣传' },
    { word: '月收益率高达50%', color: '#ef4444', riskLabel: '金融违规' },
    { word: '稳赚不赔', color: '#f97316', riskLabel: '虚假承诺' },
    { word: '诱导分享', color: '#f97316', riskLabel: '诱导行为' },
    { word: '零风险暴利', color: '#ef4444', riskLabel: '违规宣传' },
  ],
  high: [
    { label: '虚假宣传', score: 0.96, tag: 'MISLEAD' },
    { label: '违禁金融承诺', score: 0.92, tag: 'FINANCE' },
    { label: '诱导消费行为', score: 0.87, tag: 'INDUCE' },
  ],
  low: [
    { label: '政治敏感内容', score: 0.01 }, { label: '色情低俗内容', score: 0.00 },
    { label: '谣言虚假信息', score: 0.45 }, { label: '违禁词汇', score: 0.38 },
    { label: '侵权内容', score: 0.06 }, { label: '广告骚扰', score: 0.72 },
  ],
  fingerprint: '内容审核引擎 v3.2 · 多分类规则模型',
  hideAiTag: true,
  jsonResponse: `{
  "task_id": "task_e2f1b847",
  "status": "completed",
  "media_type": "text",
  "verdict": "block",
  "risk_score": 0.96,
  "results": [
    { "dimension": "misleading_advertising", "verdict": "block", "score": 0.96,
      "details": { "false_claims": ["100%保证痊愈", "稳赚不赔"], "illegal_finance_promise": true }
    },
    { "dimension": "inducement", "verdict": "review", "score": 0.87 }
  ],
  "latency_ms": 28
}`,
};

const TEXT_DETECT_DEMO: Demo = {
  id: 'text_ai_news',
  name: 'AI_Article.txt',
  type: 'text',
  label: 'AI生成文章',
  accentColor: '#8b5cf6',
  bgGradient: 'linear-gradient(135deg,#2e1065,#0f172a)',
  textContent: '人工智能领域最新进展显示，当前主流大型语言模型在多项基准测试中取得了显著的性能提升。研究人员表示，这一突破性进展将对社会各个层面产生深远影响。专家指出，企业需要及时调整战略布局，以应对技术变革带来的新挑战。',
  textRisks: [
    { word: '最新进展显示', color: '#8b5cf6', riskLabel: 'AI生成模式' },
    { word: '研究人员表示', color: '#8b5cf6', riskLabel: 'AI模板词汇' },
    { word: '专家指出', color: '#6366f1', riskLabel: 'AI生成模式' },
    { word: '产生深远影响', color: '#8b5cf6', riskLabel: '高频AI短语' },
  ],
  high: [
    { label: 'AI生成文本', score: 0.94, tag: 'AI_GEN' },
    { label: 'GPT系列模型特征', score: 0.91, tag: 'GPT' },
    { label: '语义规律性异常', score: 0.86, tag: 'PATTERN' },
  ],
  low: [
    { label: '人类写作风格', score: 0.06 }, { label: '个人情感特征', score: 0.08 },
    { label: '拼写语法错误', score: 0.02 }, { label: '口语化表达', score: 0.04 },
    { label: '创意独特性', score: 0.11 }, { label: '文化背景知识', score: 0.19 },
  ],
  fingerprint: 'GPT-4系列 · 置信度 91.4%',
  jsonResponse: `{
  "task_id": "task_f3g8c912",
  "status": "completed",
  "media_type": "text",
  "verdict": "review",
  "risk_score": 0.94,
  "results": [
    { "dimension": "ai_generated_text", "verdict": "review", "score": 0.94,
      "details": { "model_fingerprint": "GPT-4", "perplexity": 12.3, "burstiness": 0.21 }
    },
    { "dimension": "misleading_content", "verdict": "pass", "score": 0.03 }
  ],
  "latency_ms": 34
}`,
};

// ─── Audio Demo data ───────────────────────────────────────────────────
const audioWave1 = [0.3,0.45,0.5,0.65,0.8,0.9,0.85,0.92,0.88,0.95,0.9,0.87,0.82,0.78,0.93,0.96,0.88,0.84,0.91,0.89,0.75,0.7,0.65,0.55,0.48,0.4,0.52,0.6,0.7,0.8,0.85,0.9,0.88,0.84,0.78,0.65,0.5,0.4,0.35,0.3];
const audioWave2 = [0.35,0.42,0.48,0.52,0.58,0.55,0.62,0.65,0.7,0.68,0.72,0.7,0.65,0.68,0.72,0.75,0.7,0.68,0.65,0.62,0.58,0.6,0.62,0.65,0.7,0.68,0.65,0.6,0.55,0.52,0.48,0.5,0.55,0.58,0.62,0.6,0.55,0.5,0.45,0.38];

const AUDIO_AUDIT_DEMO: Demo = {
  id: 'audio_fraud_speech',
  name: 'Fraud_Voice.mp3',
  type: 'audio',
  label: '诈骗语音片段',
  accentColor: '#10b981',
  bgGradient: 'linear-gradient(135deg,#052e16,#0f172a)',
  audioWaveData: audioWave1,
  audioTranscript: '您好，我是某银行客服，您账户涉嫌违规，需立即转账验证，否则账户将被冻结处理...',
  high: [
    { label: '电信诈骗内容', score: 0.96, tag: 'FRAUD' },
    { label: '违禁金融诱导', score: 0.91, tag: 'FINANCE' },
    { label: '情绪威胁恐吓', score: 0.84, tag: 'THREAT' },
  ],
  low: [
    { label: '色情低俗内容', score: 0.00 }, { label: '政治敏感', score: 0.01 },
    { label: '版权音乐', score: 0.03 }, { label: '噪音干扰', score: 0.18 },
    { label: '背景音乐', score: 0.05 }, { label: '未成年人相关', score: 0.00 },
  ],
  fingerprint: '语音审核引擎 v2.4 · ASR+NLP双路检测',
  hideAiTag: true,
  jsonResponse: `{
  "task_id": "task_h4i9d023",
  "status": "completed",
  "media_type": "audio",
  "verdict": "block",
  "risk_score": 0.96,
  "results": [
    { "dimension": "telecom_fraud", "verdict": "block", "score": 0.96,
      "details": { "risk_segments": [{"start": 8.2, "end": 23.6, "score": 0.96}] }
    },
    { "dimension": "violence_threat", "verdict": "review", "score": 0.84 }
  ],
  "latency_ms": 1240
}`,
};

const AUDIO_DETECT_DEMO: Demo = {
  id: 'audio_tts_clone',
  name: 'TTS_Clone.wav',
  type: 'audio',
  label: 'TTS声纹克隆',
  accentColor: '#8b5cf6',
  bgGradient: 'linear-gradient(135deg,#2e1065,#0f172a)',
  audioWaveData: audioWave2,
  audioTranscript: '这是一段由 AI 合成的语音样本，声纹特征高度规律，缺乏自然人声的情感波动与微小变化...',
  high: [
    { label: 'AI合成语音', score: 0.94, tag: 'TTS' },
    { label: '声纹克隆特征', score: 0.88, tag: 'CLONE' },
    { label: 'ElevenLabs模型', score: 0.83, tag: 'MODEL' },
  ],
  low: [
    { label: '人类声纹特征', score: 0.06 }, { label: '情绪自然波动', score: 0.11 },
    { label: '呼吸节律', score: 0.08 }, { label: '微颤特征', score: 0.04 },
    { label: '真实环境噪声', score: 0.02 }, { label: '声带摩擦', score: 0.05 },
  ],
  fingerprint: 'ElevenLabs · AI合成概率 94.2%',
  jsonResponse: `{
  "task_id": "task_j5k0e134",
  "status": "completed",
  "media_type": "audio",
  "verdict": "block",
  "risk_score": 0.94,
  "results": [
    { "dimension": "ai_synthesized_voice", "verdict": "block", "score": 0.94,
      "details": { "tts_model": "ElevenLabs", "clone_probability": 0.88, "naturalness_score": 0.11 }
    },
    { "dimension": "voice_fraud", "verdict": "review", "score": 0.72 }
  ],
  "latency_ms": 860
}`,
};

// ─── Demos by tab ─────────────────────────────────────────────────────
const DEMOS_BY_TAB: Record<TabKey, Demo[]> = {
  text:  [TEXT_AUDIT_DEMO,  TEXT_DETECT_DEMO],
  image: [SENSITIVE_IMG,    AI_PORTRAIT],
  audio: [AUDIO_AUDIT_DEMO, AUDIO_DETECT_DEMO],
  video: [DEEPFAKE_VIDEO,   VIOLENCE_VIDEO],
};

// ─── Gantt Risk Chart ─────────────────────────────────────────────────
function GanttChart({ segments, progress, onSeek }: { segments: RiskSegment[]; progress: number; onSeek: (p: number) => void }) {
  const highSegs = segments.filter(s => s.level === 'high');
  const modSegs  = segments.filter(s => s.level === 'moderate');
  const cursorPct = `${progress * 100}%`;
  const handleBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    onSeek(Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)));
  };
  const BarRow = ({ segs, color }: { segs: RiskSegment[]; color: string }) => (
    <div onClick={handleBarClick} style={{ flex: 1, height: 24, background: 'rgba(255,255,255,0.05)', borderRadius: 5, position: 'relative', overflow: 'visible', cursor: 'crosshair' }}>
      {segs.map((s, i) => (<div key={i} style={{ position: 'absolute', top: 0, height: '100%', left: `${s.start * 100}%`, width: `${(s.end - s.start) * 100}%`, background: color, borderRadius: 4, opacity: 0.82 }} />))}
      <div style={{ position: 'absolute', top: -3, bottom: -3, left: cursorPct, width: 2, background: 'rgba(255,255,255,0.9)', transform: 'translateX(-50%)', borderRadius: 1, pointerEvents: 'none' }} />
    </div>
  );
  return (
    <div style={{ background: '#111827', borderRadius: 10, padding: '12px 14px', border: '1px solid rgba(255,255,255,0.07)' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ width: 64, textAlign: 'right', fontSize: 11, fontWeight: 700, color: '#ef4444', fontFamily: 'monospace', flexShrink: 0 }}>High</span>
          <BarRow segs={highSegs} color="#ef4444" />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ width: 64, textAlign: 'right', fontSize: 11, fontWeight: 700, color: '#f97316', fontFamily: 'monospace', flexShrink: 0 }}>Moderate</span>
          <BarRow segs={modSegs} color="#f97316" />
        </div>
      </div>
      <div style={{ marginTop: 6, paddingLeft: 74, display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#475569', fontFamily: 'monospace' }}>
        <span>0:00</span><span>0:15</span><span>0:30</span><span>0:45</span><span>1:00</span>
      </div>
    </div>
  );
}

// ─── Area Chart ───────────────────────────────────────────────────────
function AreaChart({ tracks, progress, onSeek }: { tracks: TimelineTrack[]; progress: number; onSeek: (p: number) => void }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const W = 100; const H = 80;
  const N = tracks[0]?.data.length ?? 60;
  const toSmooth = (data: number[]): string => {
    const pts = data.map((v, i) => ({ x: (i / (N - 1)) * W, y: H - v * H }));
    if (pts.length < 2) return '';
    let d = `M ${pts[0].x.toFixed(2)} ${pts[0].y.toFixed(2)}`;
    for (let i = 1; i < pts.length; i++) {
      const prev = pts[i - 1]; const curr = pts[i];
      const cpx = (curr.x - prev.x) * 0.38;
      d += ` C ${(prev.x + cpx).toFixed(2)} ${prev.y.toFixed(2)}, ${(curr.x - cpx).toFixed(2)} ${curr.y.toFixed(2)}, ${curr.x.toFixed(2)} ${curr.y.toFixed(2)}`;
    }
    return d;
  };
  const handleClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;
    onSeek(Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)));
  };
  const cursorX = progress * W;
  return (
    <div>
      <div style={{ display: 'flex', gap: 14, marginBottom: 8, flexWrap: 'wrap' }}>
        {tracks.map(t => (<div key={t.name} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: '#64748b' }}><div style={{ width: 18, height: 3, background: t.color, borderRadius: 2 }} />{t.name}</div>))}
      </div>
      <div style={{ background: '#f8fafc', borderRadius: 10, border: '1px solid #e2e8f0', padding: '10px 14px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', left: 5, top: 12, fontSize: 9, color: '#cbd5e1', fontFamily: 'monospace' }}>100%</div>
        <div style={{ position: 'absolute', left: 5, bottom: 12, fontSize: 9, color: '#cbd5e1', fontFamily: 'monospace' }}>0%</div>
        <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ width: '100%', height: 90, cursor: 'crosshair', display: 'block' }} onClick={handleClick}>
          <defs>{tracks.map((t, i) => (<linearGradient key={i} id={`ag-${i}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={t.color} stopOpacity="0.38" /><stop offset="100%" stopColor={t.color} stopOpacity="0.03" /></linearGradient>))}</defs>
          {[0.25, 0.5, 0.75, 1].map(v => (<line key={v} x1="0" x2={W} y1={H - v * H} y2={H - v * H} stroke="#e2e8f0" strokeWidth="0.4" />))}
          {tracks.map((t, idx) => { const s = toSmooth(t.data); return s ? <path key={t.name + '_f'} d={`${s} L ${W} ${H} L 0 ${H} Z`} fill={`url(#ag-${idx})`} /> : null; })}
          {tracks.map(t => { const s = toSmooth(t.data); return s ? <path key={t.name} d={s} fill="none" stroke={t.color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /> : null; })}
          <line x1={cursorX} x2={cursorX} y1="0" y2={H} stroke="#94a3b8" strokeWidth="0.7" strokeDasharray="2 2" />
        </svg>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 14px 0', fontSize: 10, color: '#94a3b8', fontFamily: 'monospace' }}>
        <span>0:00</span><span>0:15</span><span>0:30</span><span>0:45</span><span>1:00</span>
      </div>
    </div>
  );
}

// ─── Image display ────────────────────────────────────────────────────
function ImageDisplay({ demo }: { demo: Demo }) {
  const [hoveredBox, setHoveredBox] = useState<number | null>(null);
  const ac = demo.accentColor;
  return (
    <div style={{ position: 'relative', width: '100%', height: 320, borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(0,0,0,0.1)', background: '#000' }}>
      {demo.imageUrl && (<img src={demo.imageUrl} alt={demo.label} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.88 }} />)}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom,rgba(0,0,0,0.08),rgba(0,0,0,0.28))', pointerEvents: 'none' }} />
      {(demo.boxes ?? []).map((box, idx) => (
        <div key={idx} onMouseEnter={() => setHoveredBox(idx)} onMouseLeave={() => setHoveredBox(null)}
          style={{ position: 'absolute', left: `${box.x}%`, top: `${box.y}%`, width: `${box.w}%`, height: `${box.h}%`, border: `1.5px solid ${box.color}`, borderRadius: 4, cursor: 'pointer', boxShadow: `0 0 14px ${box.color}50` }}>
          <div style={{ position: 'absolute', top: -22, left: 0, background: box.color, color: '#fff', fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 4, whiteSpace: 'nowrap' }}>{box.label}</div>
          {hoveredBox === idx && (<div style={{ position: 'absolute', bottom: -24, right: 0, background: 'rgba(0,0,0,0.85)', color: box.color, fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 4, whiteSpace: 'nowrap' }}>置信度 {(box.score * 100).toFixed(0)}%</div>)}
        </div>
      ))}
      {([['top','left'],['top','right'],['bottom','left'],['bottom','right']] as const).map(([v, h]) => (
        <div key={v+h} style={{ position: 'absolute', [v]: 10, [h]: 10, width: 16, height: 16, [v === 'top' ? 'borderTop' : 'borderBottom']: `2px solid ${ac}`, [h === 'left' ? 'borderLeft' : 'borderRight']: `2px solid ${ac}`, borderRadius: 2 }} />
      ))}
      {!demo.hideAiTag && (
        <div style={{ position: 'absolute', top: 10, right: 10, display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(0,0,0,0.55)', border: `1px solid ${ac}55`, borderRadius: 6, padding: '3px 8px', backdropFilter: 'blur(4px)' }}>
          <div style={{ width: 5, height: 5, borderRadius: '50%', background: ac, boxShadow: `0 0 6px ${ac}` }} />
          <span style={{ fontSize: 9, fontWeight: 700, color: '#fff', letterSpacing: '0.06em' }}>AI DETECT</span>
        </div>
      )}
    </div>
  );
}

// ─── Video display ────────────────────────────────────────────────────
function VideoDisplay({ demo, videoRef, isPlaying, onToggle, progress, onProgress, onDurationLoad, onSeek, onEnded }: {
  demo: Demo; videoRef: React.MutableRefObject<HTMLVideoElement | null>; isPlaying: boolean;
  onToggle: () => void; progress: number; onProgress: (p: number) => void;
  onDurationLoad: (d: number) => void; onSeek: (p: number) => void; onEnded: () => void;
}) {
  const barRef = useRef<HTMLDivElement>(null);
  const [localDuration, setLocalDuration] = useState(0);
  const handleBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = barRef.current?.getBoundingClientRect();
    if (!rect) return;
    onSeek((e.clientX - rect.left) / rect.width);
  };
  const handleTimeUpdate = () => { const v = videoRef.current; if (!v || !v.duration) return; onProgress(v.currentTime / v.duration); };
  const handleLoadedMetadata = () => { const v = videoRef.current; if (!v) return; setLocalDuration(v.duration); onDurationLoad(v.duration); };
  const duration = localDuration || 60;
  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
  return (
    <div style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(0,0,0,0.1)', background: '#000' }}>
      <div style={{ position: 'relative', height: 260 }}>
        <video ref={videoRef} src={demo.videoUrl} muted preload="metadata" onTimeUpdate={handleTimeUpdate} onLoadedMetadata={handleLoadedMetadata} onEnded={onEnded} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        <div style={{ position: 'absolute', inset: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={onToggle}>
          <div style={{ width: 58, height: 58, borderRadius: '50%', background: 'rgba(0,0,0,0.42)', border: '2px solid rgba(255,255,255,0.28)', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
            {isPlaying ? <Pause size={22} color="#fff" /> : <Play size={22} color="#fff" style={{ marginLeft: 3 }} />}
          </div>
        </div>
        <div style={{ position: 'absolute', top: 10, left: 12, fontSize: 10, color: '#e2e8f0', fontFamily: 'monospace', background: 'rgba(0,0,0,0.55)', padding: '2px 7px', borderRadius: 4 }}>F:{String(Math.floor(progress * duration * 30)).padStart(4, '0')} · 30fps</div>
        {!demo.hideAiTag && (
          <div style={{ position: 'absolute', top: 10, right: 12, display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(239,68,68,0.18)', border: '1px solid rgba(239,68,68,0.4)', borderRadius: 6, padding: '2px 8px' }}>
            <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#ef4444', boxShadow: '0 0 6px #ef4444' }} />
            <span style={{ fontSize: 9, fontWeight: 700, color: '#fca5a5', letterSpacing: '0.06em' }}>AI DETECT</span>
          </div>
        )}
      </div>
      <div style={{ padding: '10px 14px', background: '#111' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button onClick={onToggle} style={{ width: 30, height: 30, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.14)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
            {isPlaying ? <Pause size={12} /> : <Play size={12} style={{ marginLeft: 1 }} />}
          </button>
          <span style={{ fontSize: 11, color: '#64748b', fontFamily: 'monospace', flexShrink: 0 }}>{fmt(progress * duration)}</span>
          <div ref={barRef} onClick={handleBarClick} style={{ flex: 1, height: 4, background: 'rgba(255,255,255,0.12)', borderRadius: 2, cursor: 'pointer', position: 'relative' }}>
            <div style={{ height: '100%', width: `${progress * 100}%`, background: demo.accentColor, borderRadius: 2 }} />
            <div style={{ position: 'absolute', top: -4, left: `${progress * 100}%`, transform: 'translateX(-50%)', width: 12, height: 12, borderRadius: '50%', background: '#fff', boxShadow: `0 0 6px ${demo.accentColor}` }} />
          </div>
          <span style={{ fontSize: 11, color: '#64748b', fontFamily: 'monospace', flexShrink: 0 }}>{fmt(duration)}</span>
        </div>
      </div>
    </div>
  );
}

// ─── Text display ─────────────────────────────────────────────────────
function TextDisplay({ demo }: { demo: Demo }) {
  const renderText = () => {
    const text = demo.textContent ?? '';
    const risks = demo.textRisks ?? [];
    if (!risks.length) return <span>{text}</span>;
    const matches: { idx: number; len: number; r: typeof risks[0] }[] = [];
    for (const r of risks) {
      let idx = 0;
      while ((idx = text.indexOf(r.word, idx)) !== -1) { matches.push({ idx, len: r.word.length, r }); idx += r.word.length; }
    }
    matches.sort((a, b) => a.idx - b.idx);
    const nodes: React.ReactNode[] = [];
    let last = 0;
    for (const m of matches) {
      if (m.idx > last) nodes.push(<span key={last}>{text.slice(last, m.idx)}</span>);
      nodes.push(
        <span key={m.idx} title={m.r.riskLabel}
          style={{ background: `${m.r.color}20`, color: m.r.color, borderBottom: `1.5px solid ${m.r.color}`, padding: '0 2px', borderRadius: 2, fontWeight: 700 }}>
          {m.r.word}
        </span>
      );
      last = m.idx + m.len;
    }
    if (last < text.length) nodes.push(<span key={last}>{text.slice(last)}</span>);
    return nodes;
  };
  return (
    <div style={{ background: '#0f172a', borderRadius: 12, padding: 20, minHeight: 300, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 10, color: '#64748b', fontFamily: 'monospace' }}>// 文本内容分析 · {demo.name}</span>
        <div style={{ marginLeft: 'auto', padding: '2px 8px', background: `${demo.accentColor}25`, border: `1px solid ${demo.accentColor}50`, borderRadius: 4, fontSize: 10, color: demo.accentColor, fontWeight: 700, fontFamily: 'monospace' }}>SCANNING</div>
      </div>
      <div style={{ background: '#1e293b', borderRadius: 8, padding: '14px 16px', fontSize: 13.5, lineHeight: 2.1, color: '#cbd5e1', flex: 1 }}>
        {renderText()}
      </div>
      {(demo.textRisks ?? []).length > 0 && (
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {demo.textRisks!.map(r => (
            <span key={r.riskLabel} style={{ padding: '2px 8px', background: `${r.color}18`, border: `1px solid ${r.color}40`, borderRadius: 6, fontSize: 10, color: r.color, fontFamily: 'monospace', fontWeight: 600 }}>■ {r.riskLabel}</span>
          ))}
        </div>
      )}
      <div style={{ padding: '7px 12px', background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 6, fontSize: 11, color: '#fca5a5', fontFamily: 'monospace' }}>
        ⚠ 综合风险评分：HIGH · 建议拦截
      </div>
    </div>
  );
}

// ─── Audio display ────────────────────────────────────────────────────
function AudioDisplay({ demo }: { demo: Demo }) {
  const [playProgress, setPlayProgress] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isAnimating) {
      intervalRef.current = setInterval(() => {
        setPlayProgress(p => {
          if (p >= 1) { setIsAnimating(false); return 1; }
          return p + 0.008;
        });
      }, 80);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isAnimating]);

  useEffect(() => { setIsAnimating(false); setPlayProgress(0); }, [demo.id]);

  const bars = demo.audioWaveData ?? Array.from({ length: 40 }, (_, i) => 0.3 + Math.sin(i * 0.7) * 0.35 + 0.15);
  const totalSecs = 47;
  const currentSec = Math.floor(playProgress * totalSecs);
  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  return (
    <div style={{ background: '#0f172a', borderRadius: 12, padding: 20, minHeight: 300, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 10, color: '#64748b', fontFamily: 'monospace' }}>// 音频流分析 · {demo.name}</span>
        <div style={{ marginLeft: 'auto', padding: '2px 8px', background: `${demo.accentColor}25`, border: `1px solid ${demo.accentColor}50`, borderRadius: 4, fontSize: 10, color: demo.accentColor, fontWeight: 700, fontFamily: 'monospace' }}>AI DETECT</div>
      </div>

      {/* Waveform */}
      <div style={{ display: 'flex', gap: 2, alignItems: 'center', height: 80, padding: '0 4px', background: '#1e293b', borderRadius: 8 }}>
        {bars.map((h, i) => {
          const isPast = i / bars.length < playProgress;
          const isRisk = h > 0.72;
          return (
            <div key={i} style={{ flex: 1, height: `${Math.max(h, 0.08) * 100}%`, borderRadius: 2, transition: 'background 0.12s',
              background: isPast
                ? (isRisk ? '#ef4444' : demo.accentColor)
                : (isRisk ? 'rgba(239,68,68,0.38)' : 'rgba(255,255,255,0.14)') }} />
          );
        })}
      </div>

      {/* Progress bar */}
      <div style={{ height: 4, background: '#1e293b', borderRadius: 2, position: 'relative', cursor: 'pointer' }}
        onClick={e => { const r = e.currentTarget.getBoundingClientRect(); setPlayProgress((e.clientX - r.left) / r.width); }}>
        <div style={{ height: '100%', width: `${playProgress * 100}%`, background: demo.accentColor, borderRadius: 2, transition: 'width 0.08s' }} />
        <div style={{ position: 'absolute', top: -4, left: `${playProgress * 100}%`, transform: 'translateX(-50%)', width: 12, height: 12, borderRadius: '50%', background: '#fff', boxShadow: `0 0 6px ${demo.accentColor}`, transition: 'left 0.08s' }} />
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={() => { if (isAnimating) { setIsAnimating(false); } else { if (playProgress >= 1) setPlayProgress(0); setIsAnimating(true); } }}
          style={{ width: 36, height: 36, borderRadius: '50%', background: demo.accentColor, border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
          {isAnimating ? <Pause size={14} color="#fff" /> : <Play size={14} color="#fff" style={{ marginLeft: 2 }} />}
        </button>
        <span style={{ fontSize: 11, color: '#64748b', fontFamily: 'monospace' }}>{fmt(currentSec)} / {fmt(totalSecs)}</span>
        {/* Risk marker */}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 5, padding: '2px 8px', background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 6 }}>
          <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#ef4444', boxShadow: '0 0 4px #ef4444' }} />
          <span style={{ fontSize: 10, color: '#fca5a5', fontFamily: 'monospace', fontWeight: 700 }}>违规片段 00:08–00:23</span>
        </div>
      </div>

      {/* Transcript */}
      {demo.audioTranscript && (
        <div style={{ background: '#1e293b', borderRadius: 8, padding: '10px 14px', fontSize: 12, color: '#94a3b8', lineHeight: 1.7, fontFamily: 'monospace' }}>
          <div style={{ fontSize: 10, color: '#475569', marginBottom: 5 }}>// ASR 转写文本</div>
          <span style={{ color: '#cbd5e1' }}>"{demo.audioTranscript}"</span>
        </div>
      )}
    </div>
  );
}

// ─── JSON syntax highlighter ──────────────────────────────────────────
function JsonCode({ code }: { code: string }) {
  const tokens = code.split(/("(?:[^"\\]|\\.)*"(?:\s*:)?|[\[\]{},]|\b(?:true|false|null)\b|\b\d+(?:\.\d+)?\b)/g);
  return (
    <pre style={{ margin: 0, fontFamily: '"JetBrains Mono",Consolas,monospace', fontSize: 12.5, lineHeight: 1.75, whiteSpace: 'pre', overflowX: 'auto' }}>
      {tokens.map((tok, i) => {
        if (!tok) return null;
        if (/^"[^"]*":/.test(tok)) return <span key={i} style={{ color: '#79c0ff' }}>{tok}</span>;
        if (/^"/.test(tok))         return <span key={i} style={{ color: '#a5d6ff' }}>{tok}</span>;
        if (/^(true|false|null)$/.test(tok)) return <span key={i} style={{ color: '#ff7b72' }}>{tok}</span>;
        if (/^\d/.test(tok))        return <span key={i} style={{ color: '#b5cea8' }}>{tok}</span>;
        return <span key={i} style={{ color: '#8b949e' }}>{tok}</span>;
      })}
    </pre>
  );
}

// ─── Main component ───────────────────────────────────────────────────
export function AigcDemoShowcase({ activeTab = 'video' }: { activeTab?: TabKey }) {
  const tabDemos = DEMOS_BY_TAB[activeTab];
  const [activeDemo, setActiveDemo] = useState<Demo>(tabDemos[0]);
  const [tab, setTab] = useState<'simple' | 'json'>('simple');
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const [rankedView, setRankedView] = useState(false);
  const [showAllLow, setShowAllLow] = useState(false);
  const [sortDesc, setSortDesc] = useState(true);

  const videoRef = useRef<HTMLVideoElement | null>(null) as React.MutableRefObject<HTMLVideoElement | null>;

  // Reset when the active tab changes
  useEffect(() => {
    const demos = DEMOS_BY_TAB[activeTab];
    setActiveDemo(demos[0]);
  }, [activeTab]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v || activeDemo.type !== 'video') return;
    if (isPlaying) { v.play().catch(() => {}); } else { v.pause(); }
  }, [isPlaying, activeDemo.type]);

  useEffect(() => {
    setIsPlaying(false);
    setProgress(0);
    setVideoDuration(0);
    setRankedView(false);
    setTab('simple');
    setShowAllLow(false);
    const v = videoRef.current;
    if (v) { v.pause(); v.currentTime = 0; }
  }, [activeDemo.id]);

  const handleSeek = useCallback((p: number) => {
    const clamped = Math.max(0, Math.min(1, p));
    setProgress(clamped);
    const v = videoRef.current;
    if (v && videoDuration > 0) { v.currentTime = clamped * videoDuration; }
  }, [videoDuration]);

  const isVideo = activeDemo.type === 'video';
  const currentTabDemos = DEMOS_BY_TAB[activeTab];

  const lowItems = sortDesc
    ? [...activeDemo.low].sort((a, b) => b.score - a.score)
    : [...activeDemo.low].sort((a, b) => a.score - b.score);
  const visibleLow = showAllLow ? lowItems : lowItems.slice(0, 4);
  const scoreColor = (s: number) => s >= 0.7 ? '#ef4444' : s >= 0.4 ? '#f97316' : '#22c55e';

  const typeEmoji = (type: Demo['type']) =>
    type === 'video' ? '🎬' : type === 'image' ? '🖼️' : type === 'text' ? '📝' : '🎵';

  return (
    <section style={{ background: '#f8fafc', padding: '80px 0', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 48px' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: '#6366f1', textTransform: 'uppercase', letterSpacing: '0.12em', margin: '0 0 10px' }}>效果预览</p>
          <h2 style={{ fontSize: 'clamp(26px,3.2vw,40px)', fontWeight: 900, color: '#0f172a', margin: '0 0 14px', lineHeight: 1.1 }}>
            内容审核与 AI 鉴伪效果预览
          </h2>
          <p style={{ fontSize: 16, color: '#64748b', maxWidth: 560, margin: '0 auto' }}>
            切换预设样本，查看不同模态下的内容审核与 AI 鉴伪结果示例
          </p>
        </div>

        <div style={{ background: '#fff', borderRadius: 20, border: '1px solid #e2e8f0', boxShadow: '0 4px 32px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
          {/* Thumbnail strip — shows only demos for current tab */}
          <div style={{ background: '#f1f5f9', borderBottom: '1px solid #e2e8f0', padding: '14px 24px' }}>
            <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 2 }}>
              {currentTabDemos.map(demo => (
                <button key={demo.id} onClick={() => setActiveDemo(demo)}
                  style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 10, padding: '8px 14px', background: activeDemo.id === demo.id ? '#fff' : 'transparent', border: `1.5px solid ${activeDemo.id === demo.id ? demo.accentColor : '#e2e8f0'}`, borderRadius: 10, cursor: 'pointer', transition: 'all 0.2s', boxShadow: activeDemo.id === demo.id ? `0 2px 12px ${demo.accentColor}25` : 'none' }}>
                  <div style={{ width: 44, height: 32, borderRadius: 6, background: demo.bgGradient, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${demo.accentColor}40` }}>
                    <span style={{ fontSize: 14 }}>{typeEmoji(demo.type)}</span>
                  </div>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: activeDemo.id === demo.id ? '#0f172a' : '#475569', whiteSpace: 'nowrap' }}>{demo.name}</div>
                    <div style={{ fontSize: 11, color: demo.accentColor, fontWeight: 500 }}>{demo.label}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Main area */}
          <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', minHeight: 520 }}>
            {/* Left: media + chart */}
            <div style={{ padding: '24px', borderRight: '1px solid #f1f5f9' }}>
              {activeDemo.type === 'video' ? (
                <VideoDisplay demo={activeDemo} videoRef={videoRef} isPlaying={isPlaying} onToggle={() => setIsPlaying(p => !p)}
                  progress={progress} onProgress={setProgress} onDurationLoad={setVideoDuration} onSeek={handleSeek} onEnded={() => setIsPlaying(false)} />
              ) : activeDemo.type === 'image' ? (
                <ImageDisplay demo={activeDemo} />
              ) : activeDemo.type === 'text' ? (
                <TextDisplay demo={activeDemo} />
              ) : (
                <AudioDisplay demo={activeDemo} />
              )}

              {/* Timeline — video only */}
              {isVideo && activeDemo.riskSegments && (
                <div style={{ marginTop: 16 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
                    {rankedView ? 'Detailed Trend Chart — 点击跳转' : 'Risk Heatmap — 点击跳转'}
                  </div>
                  {rankedView && activeDemo.timeline
                    ? <AreaChart tracks={activeDemo.timeline} progress={progress} onSeek={handleSeek} />
                    : <GanttChart segments={activeDemo.riskSegments} progress={progress} onSeek={handleSeek} />}
                </div>
              )}

              {/* Fingerprint */}
              <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8 }}>
                <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', flexShrink: 0 }}>检测信息</span>
                <span style={{ fontSize: 12, color: '#374151', fontFamily: 'monospace', fontWeight: 600 }}>{activeDemo.fingerprint}</span>
              </div>
            </div>

            {/* Right: results */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ padding: '14px 18px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', flex: 1 }}>检测结果</span>
                <button onClick={isVideo ? () => setRankedView(v => !v) : undefined}
                  style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 9px', borderRadius: 6,
                    border: `1px solid ${rankedView && isVideo ? '#6366f1' : '#e2e8f0'}`,
                    background: rankedView && isVideo ? 'rgba(99,102,241,0.08)' : '#fff',
                    color: rankedView && isVideo ? '#6366f1' : '#94a3b8',
                    fontSize: 11, fontWeight: 600, cursor: isVideo ? 'pointer' : 'default',
                    opacity: isVideo ? 1 : 0.45, transition: 'all 0.2s', whiteSpace: 'nowrap' }}>
                  <BarChart2 size={11} />{rankedView ? 'Trend Chart ✓' : 'Ranked View'}
                </button>
                <div style={{ display: 'flex', background: '#f1f5f9', borderRadius: 8, padding: 3 }}>
                  {(['简明', 'JSON'] as const).map(t => {
                    const active = t === 'JSON' ? tab === 'json' : tab === 'simple';
                    return (
                      <button key={t} onClick={() => setTab(t === 'JSON' ? 'json' : 'simple')}
                        style={{ padding: '4px 10px', borderRadius: 6, border: 'none', background: active ? '#fff' : 'transparent', color: active ? '#0f172a' : '#64748b', fontSize: 12, fontWeight: 600, cursor: 'pointer', boxShadow: active ? '0 1px 4px rgba(0,0,0,0.08)' : 'none', transition: 'all 0.15s' }}>
                        {t}
                      </button>
                    );
                  })}
                </div>
                <button onClick={() => setSortDesc(d => !d)}
                  style={{ width: 28, height: 28, borderRadius: 7, border: '1px solid #e2e8f0', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  <ArrowUpDown size={12} color="#64748b" />
                </button>
              </div>

              <div style={{ flex: 1, overflowY: 'auto', padding: '16px 18px' }}>
                {tab === 'simple' ? (
                  <>
                    <div style={{ marginBottom: 20 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444' }} />
                        <span style={{ fontSize: 12, fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.08em' }}>高风险</span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {activeDemo.high.map(item => (
                          <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: 'rgba(239,68,68,0.04)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: 10 }}>
                            {item.tag && (<span style={{ padding: '2px 7px', background: '#ef4444', color: '#fff', fontSize: 10, fontWeight: 700, borderRadius: 4, fontFamily: 'monospace', flexShrink: 0 }}>{item.tag}</span>)}
                            <span style={{ flex: 1, fontSize: 13.5, fontWeight: 600, color: '#1e293b' }}>{item.label}</span>
                            <span style={{ fontSize: 14, fontWeight: 800, color: '#ef4444', fontFamily: 'monospace' }}>{item.score.toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#94a3b8' }} />
                        <span style={{ fontSize: 12, fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.08em' }}>低风险 / 通过</span>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                        {visibleLow.map(item => (
                          <div key={item.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '7px 10px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8 }}>
                            <span style={{ fontSize: 12, color: '#64748b' }}>{item.label}</span>
                            <span style={{ fontSize: 12, fontWeight: 700, color: scoreColor(item.score), fontFamily: 'monospace' }}>{item.score.toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                      {activeDemo.low.length > 4 && (
                        <button onClick={() => setShowAllLow(s => !s)}
                          style={{ display: 'flex', alignItems: 'center', gap: 4, margin: '10px auto 0', padding: '5px 14px', background: 'transparent', border: '1px solid #e2e8f0', borderRadius: 20, fontSize: 12, color: '#64748b', cursor: 'pointer' }}>
                          {showAllLow ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                          {showAllLow ? '收起' : `展开全部 ${activeDemo.low.length} 项`}
                        </button>
                      )}
                    </div>
                    <div style={{ marginTop: 20, padding: '12px 16px', background: 'linear-gradient(135deg,rgba(239,68,68,0.08),rgba(239,68,68,0.04))', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: '#dc2626' }}>⚠ 综合研判：建议拦截</span>
                      <span style={{ fontSize: 18, fontWeight: 900, color: '#ef4444', fontFamily: 'monospace' }}>
                        {Math.max(...activeDemo.high.map(h => h.score)).toFixed(2)}
                      </span>
                    </div>
                  </>
                ) : (
                  <div style={{ background: '#0f172a', borderRadius: 12, padding: '16px', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12, paddingBottom: 10, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                      <div style={{ display: 'flex', gap: 5 }}>
                        {['#ef4444','#f59e0b','#22c55e'].map(c => <div key={c} style={{ width: 8, height: 8, borderRadius: '50%', background: c }} />)}
                      </div>
                      <span style={{ fontSize: 11, color: '#475569', fontFamily: 'monospace' }}>API Response · 200 OK</span>
                    </div>
                    <JsonCode code={activeDemo.jsonResponse} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
