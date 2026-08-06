import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router';
import {
  FileText, Image, Mic, Video, ShieldCheck, Zap, BarChart2,
  CheckCircle, Eye, Fingerprint, Lock, Film, Code2, ArrowRight, Play,
} from 'lucide-react';
import { ProductHeroBackground } from '../components/ProductHeroBackground';
import { ScrollReveal } from '../components/ScrollReveal';
import { StickySubNav } from '../components/StickySubNav';
import { Badge } from '../components/ui/badge';
import { ApiDrawer } from '../components/ApiDrawer';
import { AigcDemoShowcase } from '../components/AigcDemoShowcase';
import { LivestreamMonitorMock, CommentDashboardMock, ComplianceReportMock } from '../components/IndustrySolutionMocks';
import { openHashRoute } from '@/utils/hashRoute';

type TabKey = 'text' | 'image' | 'audio' | 'video';
type FuncKey = 'audit' | 'detect';

// ── Mock UIs ─────────────────────────────────────────────────────

function TextAuditMockUI() {
  const risks = [
    { label: '暴力内容', level: 0.92, color: '#ef4444' },
    { label: '违禁词汇', level: 0.78, color: '#f97316' },
    { label: '情感煽动', level: 0.65, color: '#eab308' },
    { label: '广告诈骗', level: 0.31, color: '#22c55e' },
  ];
  return (
    <div style={{ background: '#0f172a', borderRadius: 12, padding: 20, fontFamily: 'monospace', fontSize: 12, color: '#94a3b8' }}>
      <div style={{ marginBottom: 10, color: '#64748b', fontSize: 11 }}>// 文本内容审核结果</div>
      <div style={{ background: '#1e293b', borderRadius: 8, padding: 12, marginBottom: 12, fontSize: 11, lineHeight: 1.7, color: '#cbd5e1' }}>
        "今天我们分享一个关于{' '}
        <span style={{ color: '#fbbf24', background: 'rgba(251,191,36,0.15)', padding: '0 3px', borderRadius: 2 }}>人工智能生成内容</span>
        {' '}的案例分析，其中涉及..."
      </div>
      {risks.map(r => (
        <div key={r.label} style={{ marginBottom: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
            <span style={{ color: '#94a3b8', fontSize: 11 }}>{r.label}</span>
            <span style={{ color: r.color, fontSize: 11, fontWeight: 600 }}>{(r.level * 100).toFixed(0)}%</span>
          </div>
          <div style={{ height: 4, background: '#1e293b', borderRadius: 2, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${r.level * 100}%`, background: r.color, borderRadius: 2 }} />
          </div>
        </div>
      ))}
      <div style={{ marginTop: 12, padding: '8px 12px', background: 'rgba(239,68,68,0.12)', borderRadius: 6, border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5', fontSize: 11 }}>
        ⚠ 综合风险评分：HIGH · 建议拦截
      </div>
    </div>
  );
}

function TextDetectMockUI() {
  const features = [
    { label: '词汇熵', value: 2.31, norm: 3.8, color: '#8b5cf6' },
    { label: '句式多样性', value: 0.41, norm: 0.85, color: '#6366f1' },
    { label: '语义密度', value: 0.88, norm: 0.65, color: '#3b82f6' },
  ];
  return (
    <div style={{ background: '#0f172a', borderRadius: 12, padding: 20, fontFamily: 'monospace', fontSize: 12, color: '#94a3b8' }}>
      <div style={{ marginBottom: 10, color: '#64748b', fontSize: 11 }}>// AI文本鉴伪 · 特征分析</div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
        {['GPT-4', 'Claude', 'Gemini', '人类'].map((m, i) => (
          <div key={m} style={{ flex: 1, textAlign: 'center', padding: '8px 4px', background: i === 0 ? 'rgba(139,92,246,0.2)' : '#1e293b', border: `1px solid ${i === 0 ? '#8b5cf6' : '#334155'}`, borderRadius: 6 }}>
            <div style={{ fontSize: 10, color: i === 0 ? '#c4b5fd' : '#64748b' }}>{m}</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: i === 0 ? '#a78bfa' : '#475569', marginTop: 2 }}>{['87%','5%','4%','4%'][i]}</div>
          </div>
        ))}
      </div>
      {features.map(f => (
        <div key={f.label} style={{ marginBottom: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3, fontSize: 11 }}>
            <span style={{ color: '#94a3b8' }}>{f.label}</span>
            <span style={{ color: f.color }}>{f.value} <span style={{ color: '#475569' }}>/ 正常:{f.norm}</span></span>
          </div>
          <div style={{ height: 4, background: '#1e293b', borderRadius: 2, overflow: 'hidden', position: 'relative' }}>
            <div style={{ height: '100%', width: `${(f.value / Math.max(f.value, f.norm)) * 100}%`, background: f.color, borderRadius: 2 }} />
            <div style={{ position: 'absolute', top: 0, height: '100%', left: `${(f.norm / Math.max(f.value, f.norm)) * 100}%`, width: 1, background: '#64748b' }} />
          </div>
        </div>
      ))}
      <div style={{ marginTop: 12, padding: '7px 12px', background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.3)', borderRadius: 6, color: '#c4b5fd', fontSize: 11 }}>
        🤖 AI生成概率：87.3% · 模型：GPT-4系列
      </div>
    </div>
  );
}

function ImageAuditMockUI() {
  const regions = ['色情内容区域', '暴力元素', '违禁符号'];
  return (
    <div style={{ background: '#0f172a', borderRadius: 12, padding: 20 }}>
      <div style={{ color: '#64748b', fontSize: 11, marginBottom: 10, fontFamily: 'monospace' }}>// 图像内容审核 · 区域标注</div>
      <div style={{ position: 'relative', background: '#1e293b', borderRadius: 8, height: 130, marginBottom: 12, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 70, height: 70, borderRadius: '50%', background: 'linear-gradient(135deg,#334155,#475569)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Image style={{ width: 28, height: 28, color: '#64748b' }} />
        </div>
        <div style={{ position: 'absolute', top: 18, left: 55, width: 68, height: 78, border: '2px solid #ef4444', borderRadius: 4 }} />
        <div style={{ position: 'absolute', top: 10, right: 18, width: 48, height: 48, border: '2px solid #f97316', borderRadius: 4 }} />
        <div style={{ position: 'absolute', bottom: 8, left: 8, padding: '2px 6px', background: 'rgba(239,68,68,0.9)', borderRadius: 3, fontSize: 10, color: '#fff', fontFamily: 'monospace' }}>违规</div>
      </div>
      {regions.map((r, i) => (
        <div key={r} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, fontSize: 11, color: '#94a3b8', fontFamily: 'monospace' }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', flexShrink: 0, background: ['#ef4444','#f97316','#eab308'][i] }} />
          {r}
          <span style={{ marginLeft: 'auto', color: ['#ef4444','#f97316','#eab308'][i], fontWeight: 600 }}>{['HIGH','MED','LOW'][i]}</span>
        </div>
      ))}
      <div style={{ marginTop: 10, padding: '7px 10px', background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 6, fontSize: 11, color: '#fca5a5', fontFamily: 'monospace' }}>
        ⚠ 违规类别：色情低俗 · 建议屏蔽
      </div>
    </div>
  );
}

function ImageDetectMockUI() {
  return (
    <div style={{ background: '#0f172a', borderRadius: 12, padding: 20 }}>
      <div style={{ color: '#64748b', fontSize: 11, marginBottom: 10, fontFamily: 'monospace' }}>// Deepfake 检测 · GAN指纹分析</div>
      <div style={{ position: 'relative', background: '#1e293b', borderRadius: 8, height: 110, marginBottom: 12, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg,#1e293b,#334155)', border: '2px dashed #475569', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Fingerprint style={{ width: 28, height: 28, color: '#8b5cf6' }} />
        </div>
        <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(45deg,transparent,transparent 8px,rgba(99,102,241,0.03) 8px,rgba(99,102,241,0.03) 9px)' }} />
        <div style={{ position: 'absolute', top: 8, right: 8, padding: '2px 8px', background: 'rgba(139,92,246,0.9)', borderRadius: 4, fontSize: 10, color: '#fff', fontFamily: 'monospace', fontWeight: 700 }}>FAKE</div>
      </div>
      {[
        { label: 'GAN伪造指纹', value: '检测到', color: '#ef4444', conf: '94.2%' },
        { label: '面部边缘一致性', value: '异常', color: '#f97316', conf: '89.7%' },
        { label: '光影合理性', value: '不一致', color: '#f97316', conf: '76.3%' },
        { label: '噪点分布', value: '规律性噪点', color: '#eab308', conf: '68.1%' },
      ].map(item => (
        <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 0', borderBottom: '1px solid #1e293b', fontSize: 11, fontFamily: 'monospace' }}>
          <span style={{ color: '#94a3b8' }}>{item.label}</span>
          <span style={{ color: item.color, fontWeight: 600 }}>{item.value} <span style={{ color: '#475569' }}>({item.conf})</span></span>
        </div>
      ))}
    </div>
  );
}

function AudioAuditMockUI() {
  const bars = [0.4,0.7,0.5,0.9,0.6,0.8,0.3,0.75,0.55,0.85,0.4,0.6,0.95,0.5,0.7,0.45,0.8,0.6];
  return (
    <div style={{ background: '#0f172a', borderRadius: 12, padding: 20 }}>
      <div style={{ color: '#64748b', fontSize: 11, marginBottom: 10, fontFamily: 'monospace' }}>// 音频内容审核 · 语义扫描</div>
      <div style={{ display: 'flex', gap: 3, alignItems: 'flex-end', height: 56, marginBottom: 12, padding: '0 4px' }}>
        {bars.map((h, i) => (
          <div key={i} style={{ flex: 1, height: `${h * 100}%`, borderRadius: 2, background: h > 0.8 ? '#ef4444' : h > 0.6 ? '#f97316' : '#3b82f6', transition: 'height 0.3s' }} />
        ))}
      </div>
      {[
        { label: '违禁语音内容', value: '检测到', color: '#ef4444', conf: '87%' },
        { label: '语义风险等级', value: 'HIGH', color: '#ef4444', conf: null },
        { label: '情绪倾向', value: '激进/煽动性', color: '#f97316', conf: '65%' },
      ].map(item => (
        <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: '1px solid #1e293b', fontSize: 11, fontFamily: 'monospace' }}>
          <span style={{ color: '#94a3b8' }}>{item.label}</span>
          <span style={{ color: item.color, fontWeight: 600 }}>{item.value}{item.conf ? <span style={{ color: '#475569' }}> ({item.conf})</span> : null}</span>
        </div>
      ))}
      <div style={{ marginTop: 10, padding: '7px 10px', background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 6, fontSize: 11, color: '#fca5a5', fontFamily: 'monospace' }}>
        ⚠ 违规片段：00:23–00:47 · 建议屏蔽
      </div>
    </div>
  );
}

function AudioDetectMockUI() {
  const bars = [0.3,0.5,0.4,0.6,0.5,0.7,0.4,0.6,0.5,0.8,0.6,0.7,0.5,0.6,0.7,0.5,0.6,0.4];
  return (
    <div style={{ background: '#0f172a', borderRadius: 12, padding: 20 }}>
      <div style={{ color: '#64748b', fontSize: 11, marginBottom: 10, fontFamily: 'monospace' }}>// AI合成语音检测 · 声纹分析</div>
      <div style={{ display: 'flex', gap: 3, alignItems: 'flex-end', height: 56, marginBottom: 12, padding: '0 4px' }}>
        {bars.map((h, i) => (
          <div key={i} style={{ flex: 1, height: `${h * 100}%`, borderRadius: 2, background: `rgba(139,92,246,${h})`, transition: 'height 0.3s' }} />
        ))}
      </div>
      {[
        { label: '声纹真实性', value: '合成音频', color: '#ef4444', conf: '91%' },
        { label: 'TTS模型匹配', value: 'ElevenLabs', color: '#8b5cf6', conf: '83%' },
        { label: '声纹克隆特征', value: '检测到', color: '#f97316', conf: '79%' },
      ].map(item => (
        <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: '1px solid #1e293b', fontSize: 11, fontFamily: 'monospace' }}>
          <span style={{ color: '#94a3b8' }}>{item.label}</span>
          <span style={{ color: item.color, fontWeight: 600 }}>{item.value} <span style={{ color: '#475569' }}>({item.conf})</span></span>
        </div>
      ))}
      <div style={{ marginTop: 10, padding: '7px 10px', background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.3)', borderRadius: 6, fontSize: 11, color: '#c4b5fd', fontFamily: 'monospace' }}>
        🤖 AI合成概率：91.4% · 非真实人声
      </div>
    </div>
  );
}

function VideoAuditMockUI() {
  return (
    <div style={{ background: '#0f172a', borderRadius: 12, padding: 20 }}>
      <div style={{ color: '#64748b', fontSize: 11, marginBottom: 10, fontFamily: 'monospace' }}>// 视频内容审核 · 帧级扫描</div>
      <div style={{ position: 'relative', background: '#1e293b', borderRadius: 8, height: 110, marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        <Film style={{ width: 36, height: 36, color: '#334155' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 4, background: '#0f172a' }}>
          <div style={{ height: '100%', width: '60%', background: 'linear-gradient(90deg,#22c55e,#f97316,#ef4444)' }} />
        </div>
        <div style={{ position: 'absolute', top: 6, left: 6, padding: '2px 6px', background: 'rgba(0,0,0,0.7)', borderRadius: 3, fontSize: 10, color: '#94a3b8', fontFamily: 'monospace' }}>F:0058 / 120fps</div>
        <div style={{ position: 'absolute', top: 6, right: 6, padding: '2px 8px', background: 'rgba(239,68,68,0.9)', borderRadius: 4, fontSize: 10, color: '#fff', fontWeight: 700 }}>违规</div>
      </div>
      {[
        { label: '违规帧数', value: '23/120帧', color: '#ef4444' },
        { label: '违规类别', value: '色情低俗内容', color: '#ef4444' },
        { label: '出现时段', value: '00:12–00:34', color: '#f97316' },
      ].map(item => (
        <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 0', borderBottom: '1px solid #1e293b', fontSize: 11, fontFamily: 'monospace' }}>
          <span style={{ color: '#94a3b8' }}>{item.label}</span>
          <span style={{ color: item.color, fontWeight: 600 }}>{item.value}</span>
        </div>
      ))}
      <div style={{ marginTop: 10, padding: '7px 10px', background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 6, fontSize: 11, color: '#fca5a5', fontFamily: 'monospace' }}>
        ⚠ 风险等级：HIGH · 建议下架处理
      </div>
    </div>
  );
}

function VideoDetectMockUI() {
  return (
    <div style={{ background: '#0f172a', borderRadius: 12, padding: 20 }}>
      <div style={{ color: '#64748b', fontSize: 11, marginBottom: 10, fontFamily: 'monospace' }}>// Deepfake视频检测 · 时序分析</div>
      <div style={{ position: 'relative', background: '#1e293b', borderRadius: 8, height: 110, marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        <div style={{ position: 'relative', width: 60, height: 60, borderRadius: '50%', background: 'linear-gradient(135deg,#1e293b,#334155)', border: '2px dashed #8b5cf6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Eye style={{ width: 24, height: 24, color: '#8b5cf6' }} />
        </div>
        <div style={{ position: 'absolute', top: 6, right: 6, padding: '2px 8px', background: 'rgba(139,92,246,0.9)', borderRadius: 4, fontSize: 10, color: '#fff', fontFamily: 'monospace', fontWeight: 700 }}>DEEPFAKE</div>
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, background: '#0f172a' }}>
          <div style={{ height: '100%', width: '45%', background: 'linear-gradient(90deg,#6366f1,#8b5cf6)' }} />
        </div>
      </div>
      {[
        { label: '人脸换脸', value: '检测到 (98%)', color: '#ef4444' },
        { label: '帧间一致性', value: '43帧异常', color: '#f97316' },
        { label: '声画同步性', value: '不一致', color: '#f97316' },
        { label: 'AI生成视频', value: '概率 76.2%', color: '#8b5cf6' },
      ].map(item => (
        <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 0', borderBottom: '1px solid #1e293b', fontSize: 11, fontFamily: 'monospace' }}>
          <span style={{ color: '#94a3b8' }}>{item.label}</span>
          <span style={{ color: item.color, fontWeight: 600 }}>{item.value}</span>
        </div>
      ))}
    </div>
  );
}

// ── Tab Config ────────────────────────────────────────────────────

const AUDIT_MOCK: Record<TabKey, React.ReactNode> = {
  text: <TextAuditMockUI />,
  image: <ImageAuditMockUI />,
  audio: <AudioAuditMockUI />,
  video: <VideoAuditMockUI />,
};

const DETECT_MOCK: Record<TabKey, React.ReactNode> = {
  text: <TextDetectMockUI />,
  image: <ImageDetectMockUI />,
  audio: <AudioDetectMockUI />,
  video: <VideoDetectMockUI />,
};

interface TabData {
  key: TabKey;
  label: string;
  icon: React.ReactNode;
  color: string;
  gradient: string;
  audit: { title: string; desc: string; bullets: string[] };
  detect: { title: string; desc: string; bullets: string[] };
}

const TABS: TabData[] = [
  {
    key: 'text',
    label: '文本',
    icon: <FileText size={18} />,
    color: '#6366f1',
    gradient: 'linear-gradient(135deg,#4f46e5,#7c3aed)',
    audit: {
      title: '文本内容审核',
      desc: '基于大模型语义理解，对文本内容进行多维度违规检测，覆盖色情低俗、暴力违禁、谣言虚假等核心风险类别。',
      bullets: ['多语言违规内容识别', '上下文语义风险分析', '自定义关键词策略', '毫秒级实时审核响应'],
    },
    detect: {
      title: 'AI文本鉴伪',
      desc: '通过语言模型特征分析、词汇熵检测、写作风格建模等技术，准确识别 GPT、Claude 等主流 AI 模型生成的文本内容。',
      bullets: ['支持 10+ 主流 AI 模型识别', '写作风格一致性分析', '语义密度异常检测', '人机混写片段定位'],
    },
  },
  {
    key: 'image',
    label: '图像',
    icon: <Image size={18} />,
    color: '#f59e0b',
    gradient: 'linear-gradient(135deg,#d97706,#f59e0b)',
    audit: {
      title: '图像内容审核',
      desc: '结合目标检测与场景理解，对图像进行区域级违规内容标注，精准定位色情、暴力、违禁物品等风险元素。',
      bullets: ['像素级违规区域标注', '人体暴露度精准分析', '违禁物品目标检测', '多标签并行分类'],
    },
    detect: {
      title: 'AI图像鉴伪',
      desc: '融合 GAN 指纹分析、频域特征检测、面部一致性验证等多种技术路线，全面检测 Deepfake、AI 绘画等伪造图像。',
      bullets: ['Deepfake 人脸换脸检测', 'GAN 生成器指纹追踪', 'AIGC 图像识别', '篡改区域精准定位'],
    },
  },
  {
    key: 'audio',
    label: '音频',
    icon: <Mic size={18} />,
    color: '#10b981',
    gradient: 'linear-gradient(135deg,#059669,#10b981)',
    audit: {
      title: '音频内容审核',
      desc: '结合 ASR 语音转文字与声学特征分析，实现语音内容的多维度违规检测，支持实时流式处理场景。',
      bullets: ['多语种 ASR 语音识别', '实时流式语音审核', '音乐版权侵权检测', '多维情绪风险分析'],
    },
    detect: {
      title: 'AI音频鉴伪',
      desc: '通过声纹特征提取、TTS 模型溯源、声学流形分析等技术，有效识别 AI 合成语音、声纹克隆等新型欺诈手段。',
      bullets: ['TTS 合成语音识别', '声纹克隆欺诈检测', '主流 TTS 模型溯源', '声学特征异常分析'],
    },
  },
  {
    key: 'video',
    label: '视频',
    icon: <Video size={18} />,
    color: '#ef4444',
    gradient: 'linear-gradient(135deg,#dc2626,#f97316)',
    audit: {
      title: '视频内容审核',
      desc: '基于帧级抽样与时序理解，对视频进行全流程违规扫描，精准定位违规片段时间戳，支持直播实时检测。',
      bullets: ['关键帧智能抽样检测', '违规时间段精准定位', '直播流实时风险监控', '跨帧时序一致性分析'],
    },
    detect: {
      title: 'AI视频鉴伪',
      desc: '综合面部换脸、声画不同步、时域伪影、生成器水印等多维特征，全面鉴别 Deepfake 视频与 AI 生成内容。',
      bullets: ['Deepfake 换脸视频检测', '帧间一致性时序分析', '声画同步异常识别', 'AI 生成视频识别'],
    },
  },
];

const ADVANTAGES = [
  { icon: <ShieldCheck size={22} />, title: '合规保障', desc: '满足网信办、广电总局等监管要求，内置政策更新同步机制', color: '#6366f1' },
  { icon: <Zap size={22} />, title: '毫秒响应', desc: '分布式推理引擎，文本 <30ms，图像 <120ms，视频实时流处理', color: '#f59e0b' },
  { icon: <BarChart2 size={22} />, title: '高精准度', desc: '文本审核准确率 99.1%，图像鉴伪 AUC 0.97，持续自迭代', color: '#10b981' },
  { icon: <Lock size={22} />, title: '数据安全', desc: '本地私有化部署方案，数据不出域，符合等保三级认证要求', color: '#ef4444' },
];

type IndustrySolution = {
  id: string; icon: string; accentColor: string; tag: string;
  title: string; subtitle: string; desc: string;
  metrics: { value: string; label: string }[];
  tags: string[];
  mock: 'livestream' | 'comment' | 'compliance';
};

const INDUSTRY_SOLUTIONS_BY_TAB: Record<TabKey, IndustrySolution[]> = {
  text: [
    {
      id: 'text-comment', icon: '💬', accentColor: '#6366f1', tag: '社交评论场景',
      title: '评论区 UGC 异步审核方案', subtitle: '海量文本批量处理，降低 80% 人工成本',
      desc: '适用于评论、弹幕、社区帖子等高频文本 UGC 场景。消息队列削峰，AI 初审 + 置信度分级路由，低风险自动放行，高风险转人工复核，大幅压缩审核成本。',
      metrics: [{ value: '10w+/min', label: '峰值处理量' }, { value: '<2s', label: '平均审核时延' }, { value: '80%', label: '人工成本降低' }],
      tags: ['社区论坛', '短视频评论', '直播弹幕', '电商评价'],
      mock: 'comment',
    },
    {
      id: 'text-compliance', icon: '🧾', accentColor: '#10b981', tag: '合规存档场景',
      title: '客服聊天记录合规方案', subtitle: '定时扫描存档，满足监管留存要求',
      desc: '面向金融、医疗、政务等强合规行业的历史会话记录审查需求。支持定时批量扫描、敏感信息脱敏、合规报告生成与长期加密存档，满足等保三级与行业监管要求。',
      metrics: [{ value: '7×24h', label: '持续监控覆盖' }, { value: '3年+', label: '合规存档周期' }, { value: '等保三级', label: '安全认证' }],
      tags: ['金融客服', '医疗咨询', '政务热线', '法律服务'],
      mock: 'compliance',
    },
    {
      id: 'text-detect', icon: '🤖', accentColor: '#8b5cf6', tag: 'AI溯源场景',
      title: '新闻资讯 AI 文本溯源方案', subtitle: '识别 AI 生成内容，保障信息真实性',
      desc: '面向新闻媒体与内容平台，快速鉴别 GPT、Claude 等大模型生成的文章与资讯内容，支持批量接口接入，为平台内容真实性背书，防止 AI 生成虚假信息大量传播。',
      metrics: [{ value: '87%+', label: 'AI生成识别率' }, { value: '10+', label: '支持模型数量' }, { value: '<50ms', label: '单次检测时延' }],
      tags: ['新闻媒体', '内容平台', '学术机构', '政务信息'],
      mock: 'livestream',
    },
  ],
  image: [
    {
      id: 'image-ecom', icon: '🛍️', accentColor: '#f59e0b', tag: '电商场景',
      title: '电商商品图像合规审核方案', subtitle: '上架前全量检测，杜绝违规商品图',
      desc: '覆盖商品主图、详情页、促销 Banner 等所有电商图像资产。支持上架前批量审核与增量实时审核两种模式，精准识别违禁商品图、仿冒品标识、违规宣传文字等风险。',
      metrics: [{ value: '120ms', label: '单图审核时延' }, { value: '99.2%', label: '识别准确率' }, { value: '24h', label: '7×24小时运行' }],
      tags: ['电商平台', '二手交易', '跨境电商', '社区团购'],
      mock: 'livestream',
    },
    {
      id: 'image-ugc', icon: '📸', accentColor: '#6366f1', tag: 'UGC 图片场景',
      title: '社区 UGC 图片多维审核方案', subtitle: '全量图片审核，打造安全社区生态',
      desc: '用于社交、内容社区的用户上传图片审核。基于区域级违规标注技术，精准定位违禁区域，支持用户头像、动态配图、聊天图片等多场景统一接入，大幅降低运营风险。',
      metrics: [{ value: '5w+/min', label: '并发处理峰值' }, { value: '98.8%', label: '综合检出率' }, { value: '自动', label: '违规归档处理' }],
      tags: ['社交平台', '内容社区', '短视频平台', '图片分享'],
      mock: 'comment',
    },
    {
      id: 'image-deepfake', icon: '🔍', accentColor: '#ef4444', tag: 'Deepfake 防控',
      title: '证件与人脸 Deepfake 鉴伪方案', subtitle: '金融级人脸核验 + 证件真实性鉴别',
      desc: '面向金融开户、身份认证、证件核验等高风险场景，融合 GAN 指纹分析与面部一致性验证，精准鉴别 AI 换脸、证件篡改、照片替换等新型欺诈手段，守护身份认证安全。',
      metrics: [{ value: '96%+', label: 'Deepfake 检出率' }, { value: '<200ms', label: '鉴伪响应时延' }, { value: '金融级', label: '安全等级' }],
      tags: ['金融开户', '身份核验', '电商实名', '政务认证'],
      mock: 'compliance',
    },
  ],
  audio: [
    {
      id: 'audio-voice-chat', icon: '🎙️', accentColor: '#10b981', tag: '语音聊天场景',
      title: '语音聊天室实时内容监控', subtitle: '流式 ASR + 语义审核，秒级预警响应',
      desc: '面向游戏语音、社交语音聊天室等实时语音场景。通过流式 ASR 实时转写 + 语义审核引擎，在语音产生的同时即刻检测违禁内容，实现秒级预警与自动静音处理。',
      metrics: [{ value: '<3s', label: '检测响应时延' }, { value: '95%+', label: '语音识别准确率' }, { value: '自动静音', label: '违规处置' }],
      tags: ['游戏语音', '社交语聊', '在线教育', '直播互动'],
      mock: 'livestream',
    },
    {
      id: 'audio-podcast', icon: '🎧', accentColor: '#6366f1', tag: '播客与音频场景',
      title: '播客与长音频批量合规审核', subtitle: '异步批量处理，支持时间戳精准定位',
      desc: '面向播客、有声读物、音频媒体等长音频内容的合规审核需求。支持文件上传、URL 批量输入，自动转写后进行多维度违规扫描，精准返回违规片段时间戳，便于编辑修正。',
      metrics: [{ value: '10x', label: '实时速比处理' }, { value: '时间戳', label: '违规精准定位' }, { value: '多语种', label: 'ASR 语言支持' }],
      tags: ['播客平台', '有声书', '音频媒体', '网络电台'],
      mock: 'compliance',
    },
    {
      id: 'audio-clone', icon: '🛡️', accentColor: '#ef4444', tag: '声纹欺诈防控',
      title: 'AI 合成语音欺诈实时拦截', subtitle: '声纹克隆识别，保护用户资产安全',
      desc: '针对 AI 克隆声音实施诈骗的新型攻击手段，在金融电话核验、客服验证等关键业务环节嵌入声纹真实性检测，精准拦截 TTS 合成语音与声纹克隆欺诈，防止财产损失。',
      metrics: [{ value: '91%+', label: 'AI合成语音检出率' }, { value: '主流TTS', label: '模型溯源覆盖' }, { value: '实时', label: '通话检测模式' }],
      tags: ['金融理财', '银行电话', '证券业务', '保险核验'],
      mock: 'comment',
    },
  ],
  video: [
    {
      id: 'video-livestream', icon: '📡', accentColor: '#ef4444', tag: '直播场景',
      title: '直播间视频智能巡检方案', subtitle: '关键帧抽检巡检，准实时风险预警',
      desc: '通过高频截帧策略，将直播流转化为图片审核任务，配合音频流实时语义分析，实现视听联动的全面违规检测。适合短视频、游戏直播、电商带货、秀场直播等高风险场景。',
      metrics: [{ value: '<5s', label: '预警响应时间' }, { value: '1-5fps', label: '巡检频率可调' }, { value: '98.5%', label: '检出率' }],
      tags: ['短视频直播', '游戏直播', '电商直播', '教育直播'],
      mock: 'livestream',
    },
    {
      id: 'video-shortfilm', icon: '🎬', accentColor: '#6366f1', tag: '短视频场景',
      title: '短视频平台内容合规审核', subtitle: '帧级扫描 + 时间戳定位，高效批量处理',
      desc: '覆盖短视频上传、发布、推荐全链路的内容合规检测。帧级抽样分析 + 音频流联合审核，精准检测违规片段，支持自动下架、标注复核与人工回捞队列闭环管理。',
      metrics: [{ value: '20w+/天', label: '视频处理能力' }, { value: '秒级', label: '违规片段定位' }, { value: '闭环', label: '处置流程管理' }],
      tags: ['短视频平台', '内容社区', 'UGC平台', '娱乐媒体'],
      mock: 'comment',
    },
    {
      id: 'video-deepfake', icon: '🔬', accentColor: '#8b5cf6', tag: 'Deepfake 防控',
      title: '视频 Deepfake 与 AI 生成内容鉴伪', subtitle: '时序分析 + 多维指纹，全面防伪溯源',
      desc: '面向金融、政务、舆情监控等对内容真实性要求极高的场景，综合人脸换脸检测、声画同步异常分析、GAN 水印提取等多维技术，精准鉴别 Deepfake 视频与 AI 生成内容。',
      metrics: [{ value: '98%+', label: 'Deepfake 检出率' }, { value: '声画', label: '联合分析能力' }, { value: '帧级', label: '异常定位精度' }],
      tags: ['金融风控', '政务监管', '舆情监控', '新闻核实'],
      mock: 'compliance',
    },
  ],
};


const DELIVER_VALUES = [
  { value: '80%', label: '人工审核成本降低', color: '#6366f1' },
  { value: '99.1%', label: '文本审核准确率', color: '#10b981' },
  { value: '<30ms', label: '文本审核响应时延', color: '#f59e0b' },
  { value: '0.97', label: '鉴伪模型 AUC 均值', color: '#ef4444' },
  { value: '7×24h', label: '全天候监控覆盖', color: '#8b5cf6' },
];

// ── Main Component ────────────────────────────────────────────────

export function AigcContent() {
  const [searchParams, setSearchParams] = useSearchParams();
  const rawTab = searchParams.get('tab') as TabKey | null;
  const activeTab: TabKey = ['text','image','audio','video'].includes(rawTab ?? '') ? (rawTab as TabKey) : 'text';

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerModality, setDrawerModality] = useState<TabKey>('text');
  const [drawerFunc, setDrawerFunc] = useState<FuncKey>('audit');

  const navigate = useNavigate();
  const currentTab = TABS.find(t => t.key === activeTab) ?? TABS[0];
  const currentSolutions = INDUSTRY_SOLUTIONS_BY_TAB[activeTab];

  function handleOnlineExperience(modality: TabKey = activeTab, func: FuncKey = 'audit') {
    openHashRoute(`/online-experience?tab=aigc&modality=${modality}&function=${func === 'detect' ? 'authenticity' : 'audit'}`);
  }

  function handleApiClick(modality: TabKey, func: FuncKey) {
    setDrawerModality(modality);
    setDrawerFunc(func);
    setDrawerOpen(true);
  }

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="product-detail-hero order-[0]" style={{ position: 'relative', minHeight: 560, display: 'flex', alignItems: 'center', overflow: 'hidden', background: 'linear-gradient(135deg,#0f172a 0%,#1e1b4b 60%,#1e293b 100%)' }}>
        <ProductHeroBackground side="data" concept="aigc" />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 1200, margin: '0 auto', padding: '72px 48px', width: '100%' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 56, alignItems: 'center' }}>

            {/* Left: copy + 2 buttons */}
            <div>
              <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
                <Badge style={{ background: 'rgba(16,185,129,0.15)', color: '#6ee7b7', border: '1px solid rgba(16,185,130,0.3)', fontSize: 12 }}>AIGC 内容安全平台</Badge>
              </div>
              <h1 style={{ fontSize: 'clamp(26px,3.2vw,46px)', fontWeight: 800, color: '#fff', margin: '0 0 18px', lineHeight: 1.15 }}>
                AIGC 内容审核<br />
                <span style={{ background: 'linear-gradient(135deg,#818cf8,#c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>与鉴伪平台</span>
              </h1>
              <p style={{ fontSize: 15, color: '#94a3b8', lineHeight: 1.8, margin: '0 0 32px', maxWidth: 420 }}>
                覆盖文本、图像、音频、视频四大模态，融合内容审核与 AI 鉴伪双引擎，为平台内容安全与 AIGC 治理提供一站式解决方案。
              </p>
              <div style={{ display: 'flex', gap: 12 }}>
                <button onClick={handleOnlineExperience}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 24px', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 20px rgba(99,102,241,0.45)' }}>
                  <Play size={16} /> 立即在线体验
                </button>
              </div>
            </div>

            {/* Right: floating glassmorphism preview cards */}
            <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 14 }}>
              {/* Card 1 — video deepfake detection */}
              <div style={{ background: 'rgba(15,23,42,0.65)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 18, padding: '18px 20px', boxShadow: '0 32px 72px rgba(0,0,0,0.5)', transform: 'rotate(-1.5deg)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                  <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 8px #22c55e' }} />
                  <span style={{ fontSize: 10, color: '#64748b', fontFamily: 'monospace' }}>实时检测中 · Deepfake视频鉴伪</span>
                  <span style={{ marginLeft: 'auto', padding: '2px 7px', background: 'rgba(239,68,68,0.18)', border: '1px solid rgba(239,68,68,0.35)', borderRadius: 8, fontSize: 9, color: '#fca5a5', fontWeight: 700 }}>DEEPFAKE</span>
                </div>
                <div style={{ background: '#1e293b', borderRadius: 10, height: 88, position: 'relative', overflow: 'hidden', marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(0deg,transparent,transparent 22px,rgba(99,102,241,0.04) 22px,rgba(99,102,241,0.04) 23px)' }} />
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg,#334155,#475569)', position: 'relative' }}>
                    <div style={{ position: 'absolute', inset: -3, borderRadius: '50%', border: '1.5px solid #ef4444' }} />
                  </div>
                  <div style={{ position: 'absolute', top: 7, left: 9, fontSize: 9, color: '#475569', fontFamily: 'monospace' }}>F:0043 · 30fps</div>
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, background: '#0f172a' }}>
                    <div style={{ height: '100%', width: '45%', background: 'linear-gradient(90deg,#6366f1,#8b5cf6)' }} />
                  </div>
                  <div style={{ position: 'absolute', top: 7, right: 9, padding: '1px 7px', background: 'rgba(139,92,246,0.85)', borderRadius: 3, fontSize: 9, color: '#fff', fontFamily: 'monospace', fontWeight: 700 }}>AI DETECT</div>
                </div>
                {[{ label: '人脸换脸检测', val: 0.96, color: '#ef4444' }, { label: 'GAN生成器指纹', val: 0.89, color: '#f97316' }, { label: '帧间一致性异常', val: 0.74, color: '#eab308' }].map(r => (
                  <div key={r.label} style={{ marginBottom: 6 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3, fontSize: 10, fontFamily: 'monospace' }}>
                      <span style={{ color: '#94a3b8' }}>{r.label}</span>
                      <span style={{ color: r.color, fontWeight: 700 }}>{(r.val * 100).toFixed(0)}%</span>
                    </div>
                    <div style={{ height: 2.5, background: '#1e293b', borderRadius: 2, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${r.val * 100}%`, background: r.color, borderRadius: 2 }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Card 2 — text audit */}
              <div style={{ background: 'rgba(30,41,59,0.7)', backdropFilter: 'blur(14px)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '14px 16px', boxShadow: '0 16px 40px rgba(0,0,0,0.4)', transform: 'rotate(0.8deg)', marginLeft: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 9 }}>
                  <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#f59e0b', boxShadow: '0 0 6px #f59e0b' }} />
                  <span style={{ fontSize: 10, color: '#64748b', fontFamily: 'monospace' }}>文本内容审核 · 实时分析</span>
                </div>
                <div style={{ background: '#0f172a', borderRadius: 7, padding: '8px 10px', fontSize: 10, fontFamily: 'monospace', color: '#94a3b8', marginBottom: 9, lineHeight: 1.6 }}>
                  <span style={{ color: '#a5f3fc' }}>"content"</span>: <span style={{ color: '#86efac' }}>"今天分享一个关于..."</span>
                </div>
                <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                  {['违禁内容 92%', '谣言 78%'].map(t => (
                    <span key={t} style={{ padding: '2px 7px', background: 'rgba(239,68,68,0.13)', border: '1px solid rgba(239,68,68,0.28)', borderRadius: 6, fontSize: 9, color: '#fca5a5', fontFamily: 'monospace' }}>{t}</span>
                  ))}
                  <span style={{ marginLeft: 'auto', fontSize: 9, color: '#22c55e', fontFamily: 'monospace', display: 'flex', alignItems: 'center', gap: 3 }}>
                    <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} /> 已拦截
                  </span>
                </div>
              </div>

              {/* API try — bottom right of card column */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 2 }}>
                <button onClick={() => navigate('/developer')}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: 'rgba(99,102,241,0.1)', color: '#a5b4fc', border: '1px solid rgba(99,102,241,0.22)', borderRadius: 18, fontSize: 12, fontWeight: 600, cursor: 'pointer', backdropFilter: 'blur(8px)' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(99,102,241,0.2)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(99,102,241,0.4)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(99,102,241,0.1)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(99,102,241,0.22)'; }}>
                  <Code2 size={11} /> 今天就试用我们的 API <ArrowRight size={10} />
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      <StickySubNav items={[
        { id: 'aigc-capability', label: '核心能力' },
        { id: 'aigc-industry', label: '行业方案' },
        { id: 'aigc-api', label: 'API接入' },
        { id: 'aigc-cta', label: '在线体验' },
      ]} />

      {/* Tab Switch */}
      <section id="aigc-tabs" className="order-[2]" style={{ background: '#fff', borderBottom: '1px solid #f1f5f9' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 48px', display: 'flex', gap: 0, justifyContent: 'center' }}>
          {TABS.map(tab => (
            <button key={tab.key}
              onClick={() => setSearchParams({ tab: tab.key })}
              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '18px 28px', border: 'none', borderBottom: `3px solid ${activeTab === tab.key ? tab.color : 'transparent'}`, background: 'transparent', color: activeTab === tab.key ? tab.color : '#64748b', fontWeight: activeTab === tab.key ? 700 : 500, fontSize: 14, cursor: 'pointer', transition: 'all 0.2s' }}>
              {tab.icon} {tab.label}内容
            </button>
          ))}
        </div>
      </section>

      {/* Capability Matrix — magazine layout */}
      <section id="aigc-capability" className="order-[3]" style={{ background: '#f8fafc', padding: '80px 0 120px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 48px' }}>
          <ScrollReveal>
            <div style={{ marginBottom: 64 }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: currentTab.color, textTransform: 'uppercase', letterSpacing: '0.12em', margin: '0 0 10px' }}>核心能力矩阵</p>
              <h2 style={{ fontSize: 'clamp(28px,3.5vw,44px)', fontWeight: 900, color: '#0f172a', margin: 0, lineHeight: 1.1 }}>
                {currentTab.label}内容安全<br />
                <span style={{ color: currentTab.color }}>双引擎</span>
                <span style={{ color: '#94a3b8', fontSize: '60%', fontWeight: 400, marginLeft: 12 }}>内容审核 · AI鉴伪</span>
              </h2>
            </div>
          </ScrollReveal>

          {/* Magazine layout — two staggered modules */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>

            {/* Module 01 — 内容审核 */}
            <ScrollReveal>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0, alignItems: 'flex-start' }}>
                {/* Left: dark preview card */}
                <div style={{ padding: '48px 44px 48px 0', position: 'relative' }}>
                  <div style={{ background: 'linear-gradient(135deg,#0f172a,#1e293b)', borderRadius: 28, padding: '36px 32px', boxShadow: '0 24px 64px rgba(15,23,42,0.22)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 22 }}>
                      <div style={{ padding: '5px 13px', background: 'rgba(251,191,36,0.15)', border: '1px solid rgba(251,191,36,0.3)', borderRadius: 20, fontSize: 11, color: '#fbbf24', fontWeight: 700, letterSpacing: '0.04em' }}>
                        实时预览
                      </div>
                    </div>
                    {AUDIT_MOCK[activeTab]}
                  </div>
                </div>

                {/* Right: description — pulled down slightly for offset */}
                <div style={{ paddingTop: 80, paddingLeft: 56, paddingBottom: 48 }}>
                  <div style={{ fontSize: 96, fontWeight: 900, color: `${currentTab.color}18`, lineHeight: 1, marginBottom: -16, userSelect: 'none' }}>01</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: `${currentTab.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: currentTab.color }}>
                      <ShieldCheck size={18} />
                    </div>
                    <h3 style={{ margin: 0, fontSize: 26, fontWeight: 900, color: '#0f172a' }}>{currentTab.audit.title}</h3>
                  </div>
                  <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.9, margin: '0 0 24px', maxWidth: 400 }}>{currentTab.audit.desc}</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 9, marginBottom: 32 }}>
                    {currentTab.audit.bullets.map(b => (
                      <div key={b} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: '#374151' }}>
                        <CheckCircle size={14} style={{ color: currentTab.color, flexShrink: 0 }} />
                        {b}
                      </div>
                    ))}
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
                    <button onClick={() => handleOnlineExperience(activeTab, 'audit')}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '11px 22px', background: `linear-gradient(135deg,${currentTab.color},${currentTab.color}cc)`, color: '#fff', border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: 'pointer', boxShadow: `0 6px 20px ${currentTab.color}40` }}>
                      <Play size={15} /> 在线体验内容审核
                    </button>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Module 02 — AI鉴伪 — offset upward, columns swapped */}
            <ScrollReveal>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0, alignItems: 'flex-start', marginTop: -40 }}>
                {/* Left: description */}
                <div style={{ paddingTop: 48, paddingRight: 56, paddingBottom: 48 }}>
                  <div style={{ fontSize: 96, fontWeight: 900, color: 'rgba(139,92,246,0.1)', lineHeight: 1, marginBottom: -16, userSelect: 'none' }}>02</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(139,92,246,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8b5cf6' }}>
                      <Fingerprint size={18} />
                    </div>
                    <h3 style={{ margin: 0, fontSize: 26, fontWeight: 900, color: '#0f172a' }}>{currentTab.detect.title}</h3>
                  </div>
                  <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.9, margin: '0 0 24px', maxWidth: 400 }}>{currentTab.detect.desc}</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 9, marginBottom: 32 }}>
                    {currentTab.detect.bullets.map(b => (
                      <div key={b} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: '#374151' }}>
                        <CheckCircle size={14} style={{ color: '#8b5cf6', flexShrink: 0 }} />
                        {b}
                      </div>
                    ))}
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
                    <button onClick={() => handleOnlineExperience(activeTab, 'detect')}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '11px 22px', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff', border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: 'pointer', boxShadow: '0 6px 20px rgba(99,102,241,0.35)' }}>
                      <Play size={15} /> 在线体验 AI 鉴伪
                    </button>
                  </div>
                </div>

                {/* Right: dark preview card */}
                <div style={{ padding: '0 0 48px 44px' }}>
                  <div style={{ background: 'linear-gradient(135deg,#1e1b4b,#0f172a)', borderRadius: 28, padding: '36px 32px', boxShadow: '0 24px 64px rgba(99,102,241,0.18)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 22 }}>
                      <div style={{ padding: '5px 13px', background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.3)', borderRadius: 20, fontSize: 11, color: '#c4b5fd', fontWeight: 700, letterSpacing: '0.04em' }}>
                        实时预览
                      </div>
                    </div>
                    {DETECT_MOCK[activeTab]}
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Demo Showcase — synced to active tab */}
      <AigcDemoShowcase activeTab={activeTab} />

      {/* OpenAPI 接入能力展示 */}
      <section id="aigc-api" className="order-[5]" style={{ background: 'linear-gradient(135deg,#f0f4ff 0%,#faf5ff 50%,#f0fdf4 100%)', padding: '88px 0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 48px' }}>
          <ScrollReveal>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>

              {/* Left: Code example */}
              <div>
                <p style={{ fontSize: 12, fontWeight: 700, color: '#6366f1', textTransform: 'uppercase', letterSpacing: '0.12em', margin: '0 0 12px' }}>OpenAPI 接入能力</p>
                <h2 style={{ fontSize: 32, fontWeight: 900, color: '#0f172a', margin: '0 0 16px', lineHeight: 1.2 }}>
                  API 驱动的<br />
                  <span style={{ background: 'linear-gradient(135deg,#6366f1,#a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>企业级接入</span>
                </h2>
                <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.8, margin: '0 0 28px' }}>
                  通过 RESTful API / SDK / Webhook，将内容审核与鉴伪能力无缝集成至您的业务系统，支持同步与异步双模式，满足毫秒级实时与海量批量处理需求。
                </p>
                {/* SDK badges */}
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 28 }}>
                  {['Python SDK', 'Node.js SDK', 'Java SDK', 'Go SDK', 'REST API'].map(s => (
                    <span key={s} style={{ padding: '4px 12px', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.25)', borderRadius: 20, fontSize: 11, color: '#4f46e5', fontFamily: 'monospace', fontWeight: 600 }}>{s}</span>
                  ))}
                </div>
                {/* Code block */}
                <div style={{ background: '#090f1a', borderRadius: 16, overflow: 'hidden', border: '1px solid #1e293b' }}>
                  <div style={{ padding: '10px 16px', borderBottom: '1px solid #1e293b', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444' }} />
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#f59e0b' }} />
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#22c55e' }} />
                    <span style={{ marginLeft: 8, fontSize: 11, color: '#334155', fontFamily: 'monospace' }}>POST /v1/moderation/text</span>
                  </div>
                  <div style={{ padding: '20px 20px', fontSize: 12, fontFamily: 'monospace', lineHeight: 1.8, color: '#94a3b8' }}>
                    <div><span style={{ color: '#f9a8d4' }}>curl</span> <span style={{ color: '#86efac' }}>-X POST</span> \</div>
                    <div style={{ paddingLeft: 16 }}><span style={{ color: '#a5f3fc' }}>"https://api.aisc.zjulab.com/v1/moderation/text"</span> \</div>
                    <div style={{ paddingLeft: 16 }}><span style={{ color: '#86efac' }}>-H</span> <span style={{ color: '#a5f3fc' }}>"Authorization: Bearer sk-proj-xxx"</span> \</div>
                    <div style={{ paddingLeft: 16 }}><span style={{ color: '#86efac' }}>-d</span> <span style={{ color: '#fbbf24' }}>&#39;&#123;</span></div>
                    <div style={{ paddingLeft: 32 }}><span style={{ color: '#a5f3fc' }}>"content"</span><span style={{ color: '#fbbf24' }}>:</span> <span style={{ color: '#86efac' }}>"待审核文本..."</span><span style={{ color: '#fbbf24' }}>,</span></div>
                    <div style={{ paddingLeft: 32 }}><span style={{ color: '#a5f3fc' }}>"callback_url"</span><span style={{ color: '#fbbf24' }}>:</span> <span style={{ color: '#86efac' }}>"https://your-app.com/hook"</span><span style={{ color: '#fbbf24' }}>,</span></div>
                    <div style={{ paddingLeft: 32 }}><span style={{ color: '#a5f3fc' }}>"async"</span><span style={{ color: '#fbbf24' }}>:</span> <span style={{ color: '#c084fc' }}>true</span></div>
                    <div style={{ paddingLeft: 16 }}><span style={{ color: '#fbbf24' }}>&#125;&#39;</span></div>
                    <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid #1e293b', color: '#334155' }}>{'// Response'}</div>
                    <div><span style={{ color: '#fbbf24' }}>&#123;</span></div>
                    <div style={{ paddingLeft: 16 }}><span style={{ color: '#a5f3fc' }}>"task_id"</span><span style={{ color: '#fbbf24' }}>:</span> <span style={{ color: '#86efac' }}>"task_8f3a9c2d"</span><span style={{ color: '#fbbf24' }}>,</span></div>
                    <div style={{ paddingLeft: 16 }}><span style={{ color: '#a5f3fc' }}>"status"</span><span style={{ color: '#fbbf24' }}>:</span> <span style={{ color: '#86efac' }}>"processing"</span></div>
                    <div><span style={{ color: '#fbbf24' }}>&#125;</span></div>
                  </div>
                </div>
                <button onClick={() => navigate('/developer')}
                  style={{ marginTop: 20, display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 24px', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 20px rgba(99,102,241,0.35)' }}>
                  <Code2 size={15} /> 打开开发者接入面板
                </button>
              </div>

              {/* Right: Async flow diagram */}
              <div>
                <p style={{ fontSize: 12, fontWeight: 700, color: '#6366f1', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 28px' }}>异步审核流程</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                  {[
                    { icon: '🏢', label: '客户业务系统', desc: '您的 App / 平台', color: '#6366f1' },
                    { icon: '🔌', label: '调用审核 API', desc: 'POST /v1/moderation', color: '#8b5cf6', isArrow: true },
                    { icon: '🤖', label: 'AI 审核引擎', desc: '多模型并行推理', color: '#10b981' },
                    { icon: '📋', label: '异步任务队列', desc: '优先级调度 · 弹性扩容', color: '#f59e0b', isArrow: true },
                    { icon: '✅', label: '审核完成', desc: '结果聚合 · 风险评分', color: '#22c55e' },
                    { icon: '🔔', label: 'Webhook 回调', desc: '主动推送至您的服务', color: '#ef4444', isArrow: true },
                  ].map((node, i) => (
                    <div key={node.label}>
                      {node.isArrow && (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', paddingLeft: 28, margin: '0 0' }}>
                          <div style={{ width: 2, height: 20, background: `linear-gradient(to bottom,${node.color}60,${node.color})`, marginLeft: 17 }} />
                          <div style={{ width: 0, height: 0, borderLeft: '8px solid transparent', borderRight: '8px solid transparent', borderTop: `10px solid ${node.color}`, marginLeft: 13 }} />
                        </div>
                      )}
                      {!node.isArrow && i > 0 && (
                        <div style={{ width: 2, height: 16, background: '#cbd5e1', marginLeft: 45 }} />
                      )}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 18px', background: `${node.color}12`, border: `1px solid ${node.color}30`, borderRadius: 12, position: 'relative' }}>
                        <div style={{ width: 36, height: 36, borderRadius: 10, background: `${node.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>
                          {node.icon}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>{node.label}</div>
                          <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>{node.desc}</div>
                        </div>
                        {/* Glow dot */}
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: node.color, boxShadow: `0 0 8px ${node.color}` }} />
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 24, padding: '14px 18px', background: 'rgba(99,102,241,0.07)', border: '1px solid rgba(99,102,241,0.18)', borderRadius: 10 }}>
                  <div style={{ fontSize: 12, color: '#4f46e5', fontWeight: 600 }}>⚡ 平均响应延迟</div>
                  <div style={{ display: 'flex', gap: 20, marginTop: 8 }}>
                    {[['文本', '<30ms'], ['图像', '<120ms'], ['视频', '异步']].map(([label, val]) => (
                      <div key={label} style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 18, fontWeight: 800, color: '#6366f1' }}>{val}</div>
                        <div style={{ fontSize: 11, color: '#64748b' }}>{label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Industry Solutions */}
      <section id="aigc-industry" className="order-[4]" style={{ background: '#f8fafc', padding: '80px 0', borderTop: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 48px' }}>
          <ScrollReveal>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: '#6366f1', textTransform: 'uppercase', letterSpacing: '0.12em', margin: '0 0 10px' }}>行业解决方案</p>
              <h2 style={{ fontSize: 32, fontWeight: 800, color: '#0f172a', margin: '0 0 12px' }}>场景化落地方案</h2>
              <p style={{ fontSize: 16, color: '#64748b' }}>不只是功能清单 — 给出完整架构路径，开箱即用</p>
            </div>
          </ScrollReveal>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            {currentSolutions.map((sol) => (
              <ScrollReveal key={sol.id}>
                <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 20, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                  {/* Top accent bar */}
                  <div style={{ height: 4, background: `linear-gradient(90deg,${sol.accentColor},${sol.accentColor}88)` }} />

                  <div style={{ padding: '32px 36px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'start' }}>
                    {/* Left: title + desc + tags */}
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                        <div style={{ fontSize: 28 }}>{sol.icon}</div>
                        <span style={{ padding: '3px 10px', background: `${sol.accentColor}15`, border: `1px solid ${sol.accentColor}40`, borderRadius: 20, fontSize: 11, color: sol.accentColor, fontWeight: 700 }}>{sol.tag}</span>
                      </div>
                      <h3 style={{ margin: '0 0 6px', fontSize: 22, fontWeight: 800, color: '#0f172a' }}>{sol.title}</h3>
                      <p style={{ margin: '0 0 16px', fontSize: 13, color: sol.accentColor, fontWeight: 600 }}>{sol.subtitle}</p>
                      <p style={{ margin: '0 0 24px', fontSize: 14, color: '#475569', lineHeight: 1.8 }}>{sol.desc}</p>

                      {/* Metrics */}
                      <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
                        {sol.metrics.map(m => (
                          <div key={m.label} style={{ padding: '12px 16px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12, textAlign: 'center', minWidth: 80 }}>
                            <div style={{ fontSize: 18, fontWeight: 900, color: sol.accentColor }}>{m.value}</div>
                            <div style={{ fontSize: 11, color: '#64748b', marginTop: 3 }}>{m.label}</div>
                          </div>
                        ))}
                      </div>

                      {/* Tags */}
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        {sol.tags.map(t => (
                          <span key={t} style={{ padding: '4px 12px', background: '#f1f5f9', borderRadius: 20, fontSize: 12, color: '#475569', fontWeight: 500 }}>{t}</span>
                        ))}
                      </div>
                    </div>

                    {/* Right: product preview mock */}
                    <div>
                      <p style={{ margin: '0 0 16px', fontSize: 12, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>实际效果预览</p>
                      {sol.mock === 'livestream' && <LivestreamMonitorMock />}
                      {sol.mock === 'comment' && <CommentDashboardMock />}
                      {sol.mock === 'compliance' && <ComplianceReportMock />}
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Advantages */}
      <section style={{ background: '#fff', padding: '72px 0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 48px' }}>
          <ScrollReveal>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <h2 style={{ fontSize: 32, fontWeight: 800, color: '#0f172a', margin: '0 0 12px' }}>核心优势</h2>
              <p style={{ fontSize: 16, color: '#64748b' }}>企业级内容安全基础设施，生产环境验证</p>
            </div>
          </ScrollReveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 20 }}>
            {ADVANTAGES.map(a => (
              <ScrollReveal key={a.title}>
                <div style={{ padding: '28px 24px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 16, borderTop: `3px solid ${a.color ?? '#6366f1'}` }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', marginBottom: 16 }}>
                    {a.icon}
                  </div>
                  <h3 style={{ margin: '0 0 8px', fontSize: 16, fontWeight: 700, color: '#0f172a' }}>{a.title}</h3>
                  <p style={{ margin: 0, fontSize: 13, color: '#64748b', lineHeight: 1.7 }}>{a.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Deliver Values */}
      <section id="aigc-cta" className="order-[6]" style={{ background: 'linear-gradient(135deg,#eef2ff,#f0fdf4)', padding: '60px 0', borderTop: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 48px' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: '#6366f1', textTransform: 'uppercase', letterSpacing: '0.12em', margin: '0 0 6px' }}>交付价值</p>
            <h2 style={{ fontSize: 26, fontWeight: 800, color: '#0f172a', margin: 0 }}>数据说话</h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'stretch', justifyContent: 'center', gap: 0, background: '#fff', borderRadius: 20, overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.06)', border: '1px solid #e2e8f0' }}>
            {DELIVER_VALUES.map((v, i) => (
              <div key={v.label} style={{ flex: 1, padding: '32px 20px', textAlign: 'center', borderRight: i < DELIVER_VALUES.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                <div style={{ fontSize: 38, fontWeight: 900, color: v.color, lineHeight: 1, marginBottom: 8 }}>{v.value}</div>
                <div style={{ fontSize: 12, color: '#64748b', lineHeight: 1.5, maxWidth: 100, margin: '0 auto' }}>{v.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* API Developer Drawer */}
      <ApiDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        modality={drawerModality}
        func={drawerFunc}
      />
    </div>
  );
}
