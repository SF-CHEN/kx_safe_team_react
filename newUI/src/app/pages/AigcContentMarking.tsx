import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  ArrowDown, ArrowRight, AudioWaveform, BadgeCheck, BookOpen, CheckCircle2,
  Download, Eye, FileCheck2, FileJson, FileText, Image, Info,
  Layers3, ScanSearch, ShieldCheck, Tags, Video, Workflow,
} from 'lucide-react';
import { ProductHeroBackground } from '../components/ProductHeroBackground';
import { ScrollReveal } from '../components/ScrollReveal';
import { StickySubNav } from '../components/StickySubNav';
import { Badge } from '../components/ui/badge';

type PreviewMode = 'embed' | 'detect';
type Modality = 'text' | 'image' | 'audio' | 'video';

const ASSET_ROOT = '/aigc-marking-demo';
const STANDARD_PDF = '/standards/GB-45438-2025-AIGC-labeling-method.pdf';
const SAMPLE_TEXT = '可信数据连接业务与创新，让人工智能内容清晰可辨，让每一次流转都有据可查。';

const MODALITIES = [
  { id: 'image' as const, label: '图像', icon: Image, format: 'PNG / JPEG / WebP' },
  { id: 'text' as const, label: '文本', icon: FileText, format: 'UTF-8 / JSON' },
  { id: 'audio' as const, label: '音频', icon: AudioWaveform, format: 'WAV / ID3 / M4A' },
  { id: 'video' as const, label: '视频', icon: Video, format: 'MP4' },
];

const FLOW = [
  { n: '01', title: '识别内容类型', desc: '确认内容模态和文件格式', color: '#2563eb', bg: 'linear-gradient(145deg,#eff6ff,#dbeafe)' },
  { n: '02', title: '配置标识规则', desc: '设置显隐标识、形式与位置', color: '#7c3aed', bg: 'linear-gradient(145deg,#f5f3ff,#ede9fe)' },
  { n: '03', title: '嵌入标准标识', desc: '生成可感知和机器可读标识', color: '#0891b2', bg: 'linear-gradient(145deg,#ecfeff,#cffafe)' },
  { n: '04', title: '检测结构完整性', desc: '核验标识、元数据和关键字段', color: '#059669', bg: 'linear-gradient(145deg,#ecfdf5,#d1fae5)' },
  { n: '05', title: '导出与归档', desc: '保留内容、结论和审计信息', color: '#4f46e5', bg: 'linear-gradient(145deg,#eef2ff,#e0e7ff)' },
];

function SectionTitle({ icon: Icon, eyebrow, title, desc, tone = 'blue' }: { icon: React.ComponentType<{ className?: string }>; eyebrow: string; title: string; desc?: string; tone?: 'blue' | 'teal' | 'amber' }) {
  const tones = {
    blue: { pill: 'border-blue-200 bg-blue-50 text-blue-700', line: 'from-blue-600 to-cyan-400' },
    teal: { pill: 'border-emerald-200 bg-emerald-50 text-emerald-700', line: 'from-emerald-500 to-cyan-400' },
    amber: { pill: 'border-amber-200 bg-amber-50 text-amber-700', line: 'from-amber-500 to-orange-400' },
  }[tone];
  return <div className="mb-12 text-center">
    <div className={`mx-auto mb-4 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-black tracking-[.12em] ${tones.pill}`}><Icon className="h-4 w-4" />{eyebrow}</div>
    <h2 className="text-3xl font-black text-slate-900">{title}</h2>
    <div className={`mx-auto mt-4 h-1 w-16 rounded-full bg-gradient-to-r ${tones.line}`} />
    {desc && <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-500">{desc}</p>}
  </div>;
}

function LabelingVisual() {
  return <div className="rounded-3xl border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-6 shadow-[0_20px_60px_rgba(37,99,235,.12)]">
    <div className="mb-5 flex items-center justify-between"><span className="font-black text-slate-900">多模态标识配置</span><span className="rounded-full bg-blue-600 px-3 py-1 text-[10px] font-black text-white">显隐双标识</span></div>
    <div className="grid grid-cols-2 gap-3">{MODALITIES.map(({ id, label, icon: Icon }) => <div key={id} className="rounded-2xl border border-white bg-white/85 p-4 shadow-sm"><Icon className="h-5 w-5 text-blue-600" /><div className="mt-3 text-sm font-black text-slate-800">{label}标识</div><div className="mt-1 text-xs text-slate-400">显式提示 + 元数据</div></div>)}</div>
    <div className="mt-4 rounded-2xl bg-slate-900 p-4 text-xs text-slate-300"><div className="mb-2 text-blue-300">AIGC metadata</div><code>{'{ "Label": "AI生成", "Producer": "demo-platform", "ProduceID": "demo-2026-001" }'}</code></div>
  </div>;
}

function DetectionVisual() {
  return <div className="rounded-3xl border border-cyan-200 bg-gradient-to-br from-cyan-50 to-blue-50 p-6 shadow-[0_20px_60px_rgba(8,145,178,.12)]">
    <div className="mb-5 flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm"><FileCheck2 className="h-9 w-9 text-cyan-600" /><div><div className="text-sm font-black text-slate-900">标准标识检测</div><div className="text-xs text-slate-400">technology-after.png</div></div><Badge className="ml-auto border-emerald-200 bg-emerald-50 text-emerald-700">通过</Badge></div>
    <div className="space-y-3">{['内容类型识别', '显式标识检测', '隐式元数据解析', '关键字段与结构校验'].map((item, i) => <div key={item} className="flex items-center gap-3 rounded-xl border border-white bg-white/85 px-4 py-3"><span className="grid h-7 w-7 place-items-center rounded-full bg-cyan-50 text-xs font-black text-cyan-700">{i + 1}</span><span className="text-sm font-bold text-slate-700">{item}</span><CheckCircle2 className="ml-auto h-4 w-4 text-emerald-500" /></div>)}</div>
  </div>;
}

function CapabilitySection() {
  const bullets = [
    { icon: Tags, kicker: 'EMBEDDING', title: '内容标识', desc: '覆盖文本、图像、音频和视频，以可见文字、图像角标、提示音和画面标识向用户清晰披露，同时写入机器可读元数据。', points: ['四种内容模态统一配置', '显式标识位置与形式可配置', '隐式元数据记录来源与编号', '处理文件与审计信息导出'], visual: <LabelingVisual /> },
    { icon: ScanSearch, kicker: 'VERIFICATION', title: '标识检测', desc: '读取内容中的显式标识与文件元数据，校验关键字段和结构完整性，为发布审核、流转复核与内容追溯提供证据。', points: ['自动识别内容类型与格式', '检查可感知标识是否存在', '解析Label、Producer、ProduceID', '输出通过、警告与缺失项结论'], visual: <DetectionVisual /> },
  ];
  return <section id="acm-capability" className="scroll-mt-32 bg-[#f8fafc] px-6 py-20 lg:px-12"><div className="mx-auto max-w-6xl"><SectionTitle icon={Layers3} eyebrow="核心能力" title="标识嵌入与标准检测双能力" desc="标识工具负责披露与验证，和内容风险审核、AI鉴伪形成互补能力。" /><div className="space-y-20">{bullets.map((item, index) => { const Icon = item.icon; return <ScrollReveal key={item.title}><div className={`grid items-center gap-12 lg:grid-cols-2 ${index % 2 ? 'lg:[&>*:first-child]:order-2' : ''}`}><div>{item.visual}</div><div className="relative"><span className="pointer-events-none absolute -top-14 right-3 text-8xl font-black text-slate-100">0{index + 1}</span><div className={`relative mb-5 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-black tracking-[.12em] ${index ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-blue-200 bg-blue-50 text-blue-700'}`}><Icon className="h-4 w-4" />{item.kicker}</div><h3 className="relative text-3xl font-black text-slate-900">{item.title}</h3><p className="relative mt-4 text-sm leading-8 text-slate-600">{item.desc}</p><div className="relative mt-6 grid gap-3 sm:grid-cols-2">{item.points.map(point => <div key={point} className="flex gap-2 rounded-xl border border-slate-200 bg-white p-3 text-sm font-bold text-slate-700"><CheckCircle2 className={`mt-0.5 h-4 w-4 shrink-0 ${index ? 'text-emerald-500' : 'text-blue-500'}`} />{point}</div>)}</div></div></div></ScrollReveal>; })}</div></div></section>;
}

function TextSample({ marked }: { marked: boolean }) {
  return <div className="flex min-h-48 flex-col rounded-2xl border border-slate-200 bg-white p-5"><div className="mb-3 text-xs font-black text-slate-400">产品说明.txt</div><p className="text-sm leading-8 text-slate-700">{marked && <span className="mr-2 rounded-md bg-blue-600 px-2 py-1 text-xs font-black text-white">AI生成</span>}{SAMPLE_TEXT}</p>{marked && <div className="mt-auto rounded-lg bg-slate-50 px-3 py-2 font-mono text-[10px] text-slate-500">Label: AI生成 · Producer: demo-platform</div>}</div>;
}

function MediaSample({ modality, marked }: { modality: Modality; marked: boolean }) {
  if (modality === 'text') return <TextSample marked={marked} />;
  if (modality === 'image') return <img src={`${ASSET_ROOT}/real-image-${marked ? 'after' : 'before'}.png`} alt={marked ? '带人工智能生成合成标识的城市街景样例' : '未添加标识的城市街景样例'} className="aspect-[4/3] w-full rounded-2xl border border-slate-200 bg-slate-100 object-contain" />;
  if (modality === 'audio') return <div className="flex min-h-48 flex-col justify-center rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-blue-50 p-6 text-slate-900"><div className="flex items-center gap-3"><div className="grid h-11 w-11 place-items-center rounded-xl bg-blue-600 text-white"><AudioWaveform className="h-6 w-6" /></div><div><div className="font-black">{marked ? '已添加提示音标识的真人口播' : '真人口播音频片段'}</div><div className="mt-1 text-xs text-slate-500">新闻播报风格 · WAV</div></div></div><div className="my-5 flex h-12 items-end gap-1 overflow-hidden rounded-xl bg-blue-50 px-4 py-2">{[45,72,38,88,56,92,48,78,34,66,86,52,74,44,82,60,94,50,70,40,84,58,76,46].map((height, index) => <span key={index} className={`w-full rounded-full ${marked ? 'bg-emerald-400' : 'bg-blue-400'}`} style={{ height: `${height}%` }} />)}</div><div className="text-xs text-slate-500">{marked ? '开头加入三段式可感知提示音，并写入演示元数据' : '从现实人物口播视频提取，未添加内容标识'}</div><audio className="mt-4 w-full" controls preload="metadata" src={`${ASSET_ROOT}/real-audio-${marked ? 'after' : 'before'}.wav`} /></div>;
  return <video className="aspect-square w-full rounded-2xl border border-slate-200 bg-slate-950 object-contain" controls muted loop playsInline src={`${ASSET_ROOT}/real-video-${marked ? 'after' : 'before'}.mp4`} />;
}

function DetectionResult({ modality }: { modality: Modality }) {
  const label = MODALITIES.find(item => item.id === modality)!;
  const producer = modality === 'video' ? 'ExampleAIGCService' : modality === 'audio' ? 'XuanjianDemo' : 'demo-platform';
  const produceId = modality === 'video' ? 'e4249938…199fba72' : modality === 'audio' ? 'audio-demo-2026-001' : 'demo-2026-001';
  return <div className="flex h-full min-h-64 flex-col rounded-2xl border border-emerald-200 bg-emerald-50/70 p-6"><div className="flex items-center gap-3"><BadgeCheck className="h-10 w-10 text-emerald-600" /><div><div className="font-black text-emerald-900">标准标识验证通过</div><div className="mt-1 text-xs text-emerald-700">{label.label} · {label.format}</div></div></div><div className="mt-5 space-y-2">{[['显式标识', modality === 'audio' ? '提示音已识别' : '人工智能生成合成'], ['隐式元数据', '结构完整'], ['Label', '1（生成合成）'], ['ContentProducer', producer], ['ProduceID', produceId]].map(([key, value]) => <div key={key} className="flex items-center justify-between rounded-xl bg-white px-4 py-3 text-xs shadow-sm"><span className="font-bold text-slate-500">{key}</span><span className="max-w-[60%] truncate font-black text-emerald-700">{value}</span></div>)}</div><p className="mt-4 text-[11px] leading-6 text-emerald-700">检测结论依据当前演示样本中的显式标识与文件元数据生成，不等同于对无标识内容进行AI真伪鉴定。</p></div>;
}

function PreviewPanel() {
  const [mode, setMode] = useState<PreviewMode>('embed');
  const [modality, setModality] = useState<Modality>('image');
  const current = MODALITIES.find(item => item.id === modality)!;
  const embedConfig = [['标识模态', current.label], ['显式标识', '已开启'], ['隐式标识', '已开启'], ['标识形式', modality === 'audio' ? '提示音' : 'AI生成']];
  return <div className="overflow-hidden rounded-3xl border border-slate-200 bg-[#f8fafc] shadow-[0_24px_70px_rgba(37,99,235,.10)]">
    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 bg-white px-6 py-5"><div><div className="font-black text-slate-900">AIGC标识工作台</div><div className="mt-1 text-xs text-slate-500">使用项目内置真实素材展示前后效果</div></div><div className="flex rounded-xl border border-slate-200 bg-slate-100 p-1">{([{ id: 'embed', label: '标识嵌入', icon: Tags }, { id: 'detect', label: '标识检测', icon: ScanSearch }] as const).map(item => { const Icon = item.icon; return <button key={item.id} onClick={() => setMode(item.id)} className={`inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-bold transition ${mode === item.id ? item.id === 'embed' ? 'bg-blue-600 text-white shadow-sm' : 'bg-emerald-600 text-white shadow-sm' : 'text-slate-500'}`}><Icon className="h-4 w-4" />{item.label}</button>; })}</div></div>
    <div className="p-6"><div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">{MODALITIES.map(item => { const Icon = item.icon; const active = modality === item.id; return <button key={item.id} onClick={() => setModality(item.id)} className={`group relative flex items-center gap-3 overflow-hidden rounded-2xl border bg-white p-4 text-left transition ${active ? mode === 'detect' ? 'border-emerald-300 shadow-[0_8px_24px_rgba(5,150,105,.12)]' : 'border-blue-300 shadow-[0_8px_24px_rgba(37,99,235,.12)]' : 'border-slate-200 hover:border-slate-300'}`}><span className={`grid h-10 w-10 shrink-0 place-items-center rounded-full ${active ? mode === 'detect' ? 'bg-emerald-600 text-white' : 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'}`}><Icon className="h-5 w-5" /></span><span><span className={`block text-sm font-black ${active ? 'text-slate-900' : 'text-slate-600'}`}>{item.label}</span><span className="mt-1 block text-[10px] text-slate-400">{item.format}</span></span>{active && <span className={`absolute inset-x-0 bottom-0 h-1 ${mode === 'detect' ? 'bg-emerald-500' : 'bg-blue-500'}`} />}</button>; })}</div>
      {mode === 'embed' ? <><div className="mb-5 flex flex-wrap items-center gap-3 rounded-2xl border border-blue-100 bg-white p-4"><div className="mr-2 inline-flex items-center gap-2 text-sm font-black text-slate-800"><Tags className="h-4 w-4 text-blue-600" />本次标识配置</div>{embedConfig.map(([key, value]) => <div key={key} className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs"><span className="text-slate-400">{key}</span><span className="ml-2 font-black text-blue-700">{value}</span></div>)}</div><div className="grid gap-6 lg:grid-cols-2"><div className="rounded-2xl border border-slate-200 bg-white p-4"><div className="mb-3 text-xs font-black text-slate-400">处理前样本</div><MediaSample modality={modality} marked={false} /></div><div className="rounded-2xl border border-blue-200 bg-white p-4"><div className="mb-3 text-xs font-black text-blue-600">处理后样本</div><MediaSample modality={modality} marked /></div></div></> : <div className="grid gap-6 lg:grid-cols-2"><div className="rounded-2xl border border-slate-200 bg-white p-4"><div className="mb-3 text-xs font-black text-slate-400">待检测样本</div><MediaSample modality={modality} marked /></div><div><div className="mb-3 text-xs font-black text-emerald-600">检测结论</div><DetectionResult modality={modality} /></div></div>}
    </div>
  </div>;
}

const SCENARIOS = [
  { tag: '生产环节', title: 'AI内容生成平台', subtitle: '生成即标识，下载可追溯', desc: '在文本、图像、音频和视频生成完成后统一添加显式标识，并将生产者与内容编号写入元数据。', metrics: [['4类', '内容模态'], ['2层', '标识方式'], ['1套', '统一规则']], tags: ['生成平台', '创作工具', '数字人'], icon: Layers3, color: '#2563eb' },
  { tag: '传播环节', title: '内容发布与传播平台', subtitle: '发布前检测，转码后复核', desc: '在内容发布、转载和平台转码前后检测标识完整性，及时发现漏标、错标和元数据丢失。', metrics: [['发布前', '首次检测'], ['转码后', '二次复核'], ['字段级', '缺失提示']], tags: ['媒体平台', '内容社区', '短视频'], icon: Workflow, color: '#7c3aed' },
  { tag: '治理环节', title: '安全合规与审计', subtitle: '字段可核验，记录可归档', desc: '统一核验Label、Producer、ProduceID等字段，将检测结论与审计信息留存，支持后续追溯。', metrics: [['5项', '关键校验'], ['全链路', '审计记录'], ['可下载', '标准依据']], tags: ['安全合规', '内容治理', '审计归档'], icon: ShieldCheck, color: '#059669' },
];

function ScenarioMock({ index, color }: { index: number; color: string }) {
  const rows = index === 0 ? ['内容生成完成', '添加显式标识', '写入隐式元数据', '导出标识文件'] : index === 1 ? ['接收待发布内容', '识别显式标识', '解析文件元数据', '发布 / 转人工复核'] : ['读取审计文件', '核验关键字段', '关联内容编号', '形成归档记录'];
  return <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-blue-50 p-5"><div className="mb-5 flex items-center justify-between"><span className="text-xs font-black tracking-wider text-slate-500">流程控制台</span><span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-black text-emerald-600"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />运行正常</span></div><div className="space-y-3">{rows.map((row, i) => <div key={row} className="flex items-center gap-3 rounded-xl border border-white bg-white p-3 shadow-sm"><span className="grid h-7 w-7 place-items-center rounded-lg text-xs font-black" style={{ background: `${color}15`, color }}>{i + 1}</span><span className="text-sm font-bold text-slate-700">{row}</span><CheckCircle2 className="ml-auto h-4 w-4 text-emerald-500" /></div>)}</div></div>;
}

function HeroDualCapabilityVisual() {
  return <div className="rounded-3xl border border-white/80 bg-white/78 p-5 shadow-[0_28px_80px_rgba(30,64,175,.18)] backdrop-blur-xl">
    <div className="mb-5 flex items-center justify-between">
      <div className="flex items-center gap-2 font-black text-slate-800"><ShieldCheck className="h-5 w-5 text-blue-600" />AIGC Content Marker</div>
      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-black text-slate-500">双能力工作流</span>
    </div>
    <div className="grid gap-3 sm:grid-cols-[1fr_34px_1fr]">
      <div className="rounded-2xl border border-blue-200 bg-blue-50/90 p-4">
        <div className="flex items-center gap-2 font-black text-blue-800"><Tags className="h-5 w-5" />内容标识</div>
        <div className="mt-4 grid grid-cols-2 gap-2">{MODALITIES.map(item => { const Icon = item.icon; return <div key={item.id} className="flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-[11px] font-bold text-slate-600"><Icon className="h-4 w-4 text-blue-600" />{item.label}标识</div>; })}</div>
        <div className="mt-3 rounded-xl bg-white px-3 py-2 text-[10px] font-bold leading-5 text-blue-700">显式提示 + 隐式元数据同步写入</div>
      </div>
      <div className="flex items-center justify-center"><ArrowRight className="h-5 w-5 text-slate-400" /></div>
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50/90 p-4">
        <div className="flex items-center gap-2 font-black text-emerald-800"><ScanSearch className="h-5 w-5" />标识检测</div>
        <div className="mt-4 space-y-2">{['显式标识识别', '隐式元数据解析', '关键字段校验', '检测结论输出'].map(item => <div key={item} className="flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-[11px] font-bold text-slate-600"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />{item}</div>)}</div>
      </div>
    </div>
    <div className="mt-3 flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
      <FileCheck2 className="h-5 w-5 text-emerald-600" />
      <div><div className="text-xs font-black text-slate-800">完整闭环：嵌入标识 → 标准检测</div><div className="mt-1 text-[10px] text-slate-400">检测结果可复核、导出并用于审计追溯</div></div>
      <span className="ml-auto rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-black text-emerald-700">验证通过</span>
    </div>
  </div>;
}

export function AigcContentMarking() {
  const navigate = useNavigate();
  return <div className="min-h-screen bg-white">
    <section className="product-detail-hero relative overflow-hidden px-6 py-20 lg:px-12 lg:py-24">
      <ProductHeroBackground side="data" concept="aigc" />
      <div className="relative z-10 mx-auto grid max-w-[1160px] items-center gap-14 lg:grid-cols-[1.05fr_.95fr]">
        <div>
          <Badge className="mb-5 border-blue-500 bg-blue-600 text-white"><Tags className="mr-1.5 h-3.5 w-3.5" />数据侧</Badge>
          <h1 className="text-4xl font-black leading-tight tracking-tight text-slate-950 sm:text-5xl">AIGC内容<br /><span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">标识与检测</span></h1>
          <p className="mt-6 max-w-xl text-base leading-8 text-slate-600">面向文本、图像、音频和视频，为AI生成合成内容提供显式标识、隐式元数据写入、标准检测与审计追溯能力。</p>
          <div className="mt-8 flex flex-wrap gap-3"><button onClick={() => document.getElementById('acm-preview')?.scrollIntoView({ behavior: 'smooth' })} className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-200"><Eye className="h-4 w-4" />查看效果预览</button><button onClick={() => navigate('/help-docs/aigc-marking-overview')} className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white/80 px-6 py-3 text-sm font-bold text-slate-700"><BookOpen className="h-4 w-4" />查看帮助文档</button></div>
          <div className="mt-9 flex flex-wrap gap-x-7 gap-y-3 border-t border-slate-200 pt-6 text-sm font-semibold text-slate-600">{['四类内容模态', '显隐双重标识', '标准结构检测', '审计归档追溯'].map(item => <span key={item} className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-blue-500" />{item}</span>)}</div>
        </div>
        <HeroDualCapabilityVisual />
      </div>
    </section>

    <StickySubNav items={[{ id: 'acm-capability', label: '核心能力' }, { id: 'acm-preview', label: '效果预览' }, { id: 'acm-flow', label: '处理流程' }, { id: 'acm-scenarios', label: '应用场景' }, { id: 'acm-compliance', label: '合规依据' }]} />
    <CapabilitySection />

    <section id="acm-preview" className="scroll-mt-32 bg-[#f5f7fa] px-6 py-20 lg:px-12"><div className="mx-auto max-w-6xl"><SectionTitle icon={Eye} eyebrow="真实效果" title="四种内容模态的标识前后对比" desc="嵌入模式采用“顶部配置、下方前后对比”；检测模式采用“左侧样本、右侧结论”。" /><PreviewPanel /></div></section>

    <section id="acm-flow" className="scroll-mt-32 px-6 py-20 lg:px-12"><div className="mx-auto max-w-6xl"><SectionTitle icon={Workflow} eyebrow="处理流程" title="从内容识别到检测归档" desc="前三步完成标识嵌入，后两步完成标准检测与结果留存。" /><div className="mb-5 flex flex-wrap items-center justify-center gap-3 text-xs font-black"><span className="rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-blue-700">标识嵌入阶段 · STEP 01—03</span><span className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-emerald-700">检测归档阶段 · STEP 04—05</span></div><div className="grid items-stretch gap-3 md:grid-cols-[1fr_32px_1fr_32px_1fr_32px_1fr_32px_1fr]">{FLOW.map((item, index) => <React.Fragment key={item.n}><div className={`rounded-2xl border p-5 shadow-sm ${index > 2 ? 'ring-1 ring-emerald-100' : ''}`} style={{ background: item.bg, borderColor: `${item.color}28` }}><div className="text-xs font-black tracking-widest" style={{ color: item.color }}>STEP {item.n}</div><div className="mt-3 font-black text-slate-900">{item.title}</div><p className="mt-2 text-xs leading-6 text-slate-500">{item.desc}</p></div>{index < FLOW.length - 1 && <div className="flex items-center justify-center"><ArrowRight className="hidden h-5 w-5 text-slate-300 md:block" /><ArrowDown className="h-5 w-5 text-slate-300 md:hidden" /></div>}</React.Fragment>)}</div></div></section>

    <section id="acm-scenarios" className="scroll-mt-32 bg-[#f8fafc] px-6 py-20 lg:px-12"><div className="mx-auto max-w-6xl"><SectionTitle icon={Layers3} eyebrow="应用场景" title="覆盖内容生产、传播与治理" desc="围绕实际业务角色展示完整应用路径，而不只罗列场景名称。" /><div className="space-y-8">{SCENARIOS.map((item, index) => { const Icon = item.icon; return <ScrollReveal key={item.title}><div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"><div className="h-1" style={{ background: `linear-gradient(90deg,${item.color},${item.color}66)` }} /><div className={`grid items-center gap-10 p-7 lg:grid-cols-2 ${index % 2 ? 'lg:[&>*:first-child]:order-2' : ''}`}><div><div className="flex items-center gap-3"><div className="grid h-12 w-12 place-items-center rounded-2xl" style={{ background: `${item.color}15`, color: item.color }}><Icon className="h-6 w-6" /></div><Badge style={{ background: `${item.color}12`, color: item.color, borderColor: `${item.color}30` }}>{item.tag}</Badge></div><h3 className="mt-5 text-2xl font-black text-slate-900">{item.title}</h3><p className="mt-2 text-sm font-bold" style={{ color: item.color }}>{item.subtitle}</p><p className="mt-4 text-sm leading-8 text-slate-600">{item.desc}</p><div className="mt-6 flex gap-3">{item.metrics.map(([value, label]) => <div key={label} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-center"><div className="font-black" style={{ color: item.color }}>{value}</div><div className="mt-1 text-[10px] text-slate-400">{label}</div></div>)}</div><div className="mt-5 flex flex-wrap gap-2">{item.tags.map(tag => <span key={tag} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-500">{tag}</span>)}</div></div><ScenarioMock index={index} color={item.color} /></div></div></ScrollReveal>; })}</div></div></section>

    <section id="acm-compliance" className="scroll-mt-32 bg-[#f5f7fa] px-6 py-20 lg:px-12"><div className="mx-auto max-w-6xl"><SectionTitle icon={ShieldCheck} eyebrow="标准依据" title="对照国家标准落实标识要求" desc="提炼与产品能力直接相关的标识要求，并提供标准文件下载。" tone="amber" /><div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"><div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center"><div><div className="text-xs font-black tracking-widest text-blue-600">GB 45438-2025</div><h3 className="mt-2 text-2xl font-black text-slate-900">网络安全技术 人工智能生成合成内容标识方法</h3><p className="mt-3 text-sm text-slate-500">2025-02-28 发布 · 2025-09-01 实施 · 19页</p></div><a href={STANDARD_PDF} download className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-100 hover:bg-blue-700"><Download className="h-4 w-4" />下载标准文件</a></div></div><div className="my-6 grid gap-4 md:grid-cols-3">{[{ chapter: '第5章', title: '显式标识', desc: '规定文本、图片、音频、视频及虚拟场景的可感知标识形式、位置和可见性要求。', capability: '产品支持四模态可感知标识配置', icon: Eye }, { chapter: '第6章', title: '隐式标识', desc: '规定文件元数据应记录生成合成标签、服务提供者和内容编号等信息。', capability: '产品写入并解析关键元数据字段', icon: FileJson }, { chapter: '附录E、F', title: '格式与示例', desc: '给出文件元数据隐式标识格式与示例，为字段结构设计和结果说明提供依据。', capability: '产品提供结构校验与检测结论', icon: FileCheck2 }].map(item => { const Icon = item.icon; return <div key={item.title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-center gap-3"><div className="grid h-11 w-11 place-items-center rounded-xl bg-blue-50"><Icon className="h-5 w-5 text-blue-600" /></div><div><div className="text-xs font-black text-blue-600">{item.chapter}</div><div className="font-black text-slate-900">{item.title}</div></div></div><p className="mt-4 text-xs leading-6 text-slate-500">{item.desc}</p><div className="mt-4 rounded-xl bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700">能力映射：{item.capability}</div></div>; })}</div><div className="flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-5"><Info className="h-5 w-5 shrink-0 text-amber-600" /><p className="text-xs leading-6 text-amber-800">页面摘要用于帮助理解产品能力；实际合规实施仍应以标准原文、《人工智能生成合成内容标识办法》及适用要求为准。</p></div></div></section>

  </div>;
}
