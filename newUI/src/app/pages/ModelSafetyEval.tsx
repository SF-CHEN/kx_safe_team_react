import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import type { LucideIcon } from 'lucide-react';
import {
  AlertTriangle, ArrowRight, BarChart3, CheckCircle2, ClipboardCheck,
  Database, FileJson, FileSearch, FolderTree, History,
  Image as ImageIcon, MessageSquareText,
  ScanSearch, ShieldAlert, Upload, Workflow,
} from 'lucide-react';
import { ProductHeroBackground } from '../components/ProductHeroBackground';
import { ScrollReveal } from '../components/ScrollReveal';
import { StickySubNav } from '../components/StickySubNav';
import { LightweightUploadTaskModal } from '../components/LightweightUploadTaskModal';
import { GuestGuard } from '../components/GuestGuard';
import { useUser } from '../context/UserContext';

const CLASSIFICATION_IMAGE = '/model-data-eval/classification-samples.png';
const DETECTION_IMAGE = '/model-data-eval/detection-street.png';
const IMAGENET_IMAGE = '/datasets/imagenet-samoyed.jpg';

type SupportItem = {
  key: 'classification' | 'detection' | 'text';
  title: string; subtitle: string; icon: LucideIcon;
  color: string; gradient: string; formats: string[];
};

const SUPPORT_ITEMS: SupportItem[] = [
  {
    key: 'classification', title: '图像分类数据', subtitle: '识别图片、类别及 train / val / test 数据划分',
    icon: ImageIcon, color: '#2563eb', gradient: 'linear-gradient(145deg,#eef6ff 0%,#f8fbff 55%,#e8f0ff 100%)',
    formats: ['ImageFolder', 'ImageNet', 'CIFAR', 'MNIST', 'NPZ / NPY', 'CSV / JSONL'],
  },
  {
    key: 'detection', title: '目标检测数据', subtitle: '联合解析图片、类别、边界框与图片元数据',
    icon: ScanSearch, color: '#7c3aed', gradient: 'linear-gradient(145deg,#f7f2ff 0%,#fcfaff 55%,#eee8ff 100%)',
    formats: ['COCO', 'Pascal VOC', 'YOLO', 'LabelMe'],
  },
  {
    key: 'text', title: '大模型文本数据', subtitle: '覆盖指令微调语料、问答数据和多轮对话结构',
    icon: MessageSquareText, color: '#059669', gradient: 'linear-gradient(145deg,#effcf7 0%,#f9fdfb 55%,#e5f8f0 100%)',
    formats: ['CSV / TSV', 'JSON / JSONL', 'TXT', 'Alpaca', 'OpenAI Messages', 'ShareGPT'],
  },
];

const CAPABILITIES = [
  { title: '数据均衡性评测', short: '均衡性', icon: BarChart3, color: '#2563eb', desc: '分析类别、样本数量、文本长度、角色和轮次分布，识别训练数据中的分布倾斜。', points: ['类别比例、香农熵与基尼系数', '目标实例数量与类别覆盖范围', '文本长度、领域、角色及轮次分布'], visual: 'balance' as const },
  { title: '恶意及异常样本评测', short: '异常样本', icon: AlertTriangle, color: '#ea580c', desc: '筛查损坏、重复、近重复、离群、无效标注以及可能影响训练安全的攻击候选样本。', points: ['图片损坏、分辨率异常与特征离群', '非法类别、无效 BBox 与目标区域扰动', '提示注入、隐藏载荷及字符级对抗风险'], visual: 'anomaly' as const },
  { title: '标注正确性评测', short: '标注正确性', icon: ScanSearch, color: '#7c3aed', desc: '检测错标、冲突标注以及标签、文本和目标语义不一致问题。', points: ['KNN 近邻投票与类别特征原型校验', '外部模型预测及 IoU 匹配辅助检查', '冲突答案、占位回答与答非所问'], visual: 'correctness' as const },
  { title: '标注完整性评测', short: '标注完整性', icon: ClipboardCheck, color: '#0891b2', desc: '检查样本、标注和任务必需字段是否完整，定位采集、转换和标注环节中的缺失。', points: ['图片、标签、类别与标注清单', '图片 ID、尺寸、BBox 与 Annotation ID', '文本字段、对话角色与轮次结构'], visual: 'completeness' as const },
  { title: '后门样本安全评测', short: '后门筛查', icon: ShieldAlert, color: '#dc2626', desc: '在模型训练前对疑似投毒及后门样本进行初步筛查，为人工复核提供候选依据。', points: ['角落补丁、频谱异常与异常特征簇', '稀有触发词与固定前后缀', '触发短语与固定标签或回答的异常关联'], visual: 'backdoor' as const },
];

const SCENARIOS = [
  {
    key: 'classification', label: '图像分类', color: '#2563eb', icon: ImageIcon,
    title: '图像分类训练集治理', problem: '类别分布不均、图片损坏、跨类别重复和错标样本会影响训练数据的稳定性。',
    path: ['解析图片与类别目录', '分析分布、重复及离群样本', '定位标注冲突与后门候选'],
    output: '输出可定位到样本路径的问题记录及 JSONL 结果。',
  },
  {
    key: 'detection', label: '目标检测', color: '#7c3aed', icon: ScanSearch,
    title: '目标检测标注质量核查', problem: '边界框越界、类别非法、图片尺寸缺失及标注不完整会降低数据可用性。',
    path: ['识别 COCO / VOC / YOLO / LabelMe', '核查类别、BBox 与图片元数据', '通过 IoU 及外部预测辅助校验'],
    output: '输出标注问题、异常目标与对应图片位置。',
  },
  {
    key: 'text', label: '大模型文本', color: '#059669', icon: MessageSquareText,
    title: '大模型训练语料检查', problem: '字段缺失、答案冲突、提示注入、凭据泄露和隐藏字符可能进入训练语料。',
    path: ['映射文本、问答与对话字段', '检查结构、长度及角色分布', '识别攻击载荷与触发词候选'],
    output: '输出命中字段、上下文、异常原因与风险程度。',
  },
];

function SectionHeading({ eyebrow, title, desc }: { eyebrow: string; title: string; desc: string }) {
  return <div className="mx-auto mb-14 max-w-3xl text-center">
    <span className="inline-flex rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-xs font-black tracking-[.14em] text-blue-700">{eyebrow}</span>
    <h2 className="mt-5 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">{title}</h2>
    <p className="mt-4 text-sm leading-7 text-slate-500 sm:text-base">{desc}</p>
  </div>;
}

function ClassificationVisual({ compact = false }: { compact?: boolean }) {
  const labels = ['金毛犬', '自行车', '向日葵', '茶壶'];
  return <div className={`relative overflow-hidden rounded-2xl border border-white/80 bg-white shadow-sm ${compact ? 'mx-auto w-full max-w-[340px]' : ''}`}>
    <img src={CLASSIFICATION_IMAGE} alt="原创图像分类数据样本：犬、自行车、向日葵和茶壶" className="aspect-square w-full object-cover" />
    <div className="pointer-events-none absolute inset-0 grid grid-cols-2 grid-rows-2">
      {labels.map((label, index) => <div key={label} className="relative border border-white/60"><span className="absolute bottom-2 left-2 rounded-md bg-slate-950/75 px-2 py-1 text-[11px] font-bold text-white backdrop-blur">class_{index + 1} · {label}</span></div>)}
    </div>
  </div>;
}

function DetectionVisual({ compact = false }: { compact?: boolean }) {
  const boxes = [
    { label: 'car', left: '6.5%', top: '49%', width: '25%', height: '17%', color: '#38bdf8' },
    { label: 'cyclist', left: '36.5%', top: '43%', width: '10.5%', height: '25%', color: '#a78bfa' },
    { label: 'person', left: '55.5%', top: '49%', width: '8.5%', height: '24%', color: '#34d399' },
    { label: 'traffic light', left: '4.2%', top: '15%', width: '5.4%', height: '25%', color: '#f59e0b' },
  ];
  return <div className={`relative overflow-hidden rounded-2xl border border-white/80 bg-slate-900 shadow-sm ${compact ? 'mx-auto w-full max-w-[500px]' : ''}`}>
    <img src={DETECTION_IMAGE} alt="原创城市道路目标检测数据样本" className="aspect-[4/3] w-full object-cover" />
    {boxes.map(box => <div key={box.label} className="absolute border-2" style={{ left: box.left, top: box.top, width: box.width, height: box.height, borderColor: box.color }}><span className="absolute -top-6 left-[-2px] rounded-t px-1.5 py-1 text-[10px] font-black text-white" style={{ background: box.color }}>{box.label}</span></div>)}
  </div>;
}

function TextDatasetVisual({ compact = false }: { compact?: boolean }) {
  return <div className={`overflow-hidden rounded-2xl border border-emerald-100 bg-[#071b19] text-white shadow-sm ${compact ? 'p-3' : 'p-4'}`}>
    <div className="mb-3 flex items-center justify-between border-b border-white/10 pb-3"><span className="font-mono text-xs text-emerald-300">train_messages.jsonl</span><span className="rounded bg-emerald-400/10 px-2 py-1 text-[11px] text-emerald-300">对话结构</span></div>
    <div className="space-y-2 font-mono text-xs leading-5">
      <div className="rounded-lg border border-blue-400/15 bg-blue-400/10 px-3 py-2"><span className="mr-2 text-blue-300">system</span><span className="text-slate-300">你是企业知识助手</span></div>
      <div className="rounded-lg border border-violet-400/15 bg-violet-400/10 px-3 py-2"><span className="mr-2 text-violet-300">user</span><span className="text-slate-300">请总结这份制度文件</span></div>
      <div className="rounded-lg border border-emerald-400/15 bg-emerald-400/10 px-3 py-2"><span className="mr-2 text-emerald-300">assistant</span><span className="text-slate-300">文件主要包括三项要求…</span></div>
      <div className="flex items-center gap-2 rounded-lg border border-amber-300/25 bg-amber-300/10 px-3 py-2 text-amber-200"><AlertTriangle className="h-3 w-3 shrink-0" />隐藏字符 / 字段缺失候选</div>
    </div>
  </div>;
}

function HeroWorkbench() {
  return <div className="relative mx-auto w-full max-w-[540px]">
    <div className="absolute -inset-8 rounded-full bg-blue-500/20 blur-3xl" />
    <div className="relative overflow-hidden rounded-3xl border border-white/20 bg-slate-950/90 shadow-2xl shadow-blue-950/40 backdrop-blur-xl">
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
        <div className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-xl bg-blue-500"><Database className="h-4 w-4 text-white" /></span><div><div className="text-sm font-black text-white">数据评测控制台</div><div className="mt-0.5 text-[10px] tracking-widest text-slate-500">DATA EVALUATION CONSOLE</div></div></div>
        <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2.5 py-1 text-[10px] font-bold text-emerald-300">结构示意</span>
      </div>
      <div className="grid gap-3 p-4 sm:grid-cols-[1.05fr_.95fr]">
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[.04] p-3"><div className="mb-3 flex items-center justify-between text-[10px]"><span className="font-bold text-slate-300">样本视图</span><span className="text-slate-500">COCO</span></div><DetectionVisual compact /></div>
        <div className="space-y-2">{[
          ['数据均衡性', '类别与样本分布', '#60a5fa'], ['异常样本', '重复 / 离群 / 损坏', '#fb923c'],
          ['标注质量', '正确性与完整性', '#a78bfa'], ['后门筛查', '候选模式与关联', '#f87171'],
        ].map(([title, desc, color]) => <div key={title} className="rounded-xl border border-white/10 bg-white/[.04] px-3 py-2.5"><div className="flex items-center justify-between"><span className="text-[11px] font-bold text-white">{title}</span><CheckCircle2 className="h-3.5 w-3.5" style={{ color }} /></div><div className="mt-1 text-[9px] text-slate-500">{desc}</div></div>)}</div>
      </div>
      <div className="flex items-center justify-between border-t border-white/10 bg-white/[.03] px-5 py-3 text-[10px]"><span className="text-slate-500">evaluation_result.jsonl</span><span className="font-bold text-emerald-300">可定位 · 可留存</span></div>
    </div>
  </div>;
}

function SupportVisual({ item }: { item: SupportItem }) {
  if (item.key === 'classification') return <div className="relative overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm"><img src={IMAGENET_IMAGE} alt="ImageNet 图像分类数据示例" className="aspect-[4/3] w-full object-cover" /><span className="absolute bottom-3 left-3 rounded-lg bg-slate-950/75 px-3 py-1.5 text-xs font-bold text-white">ImageNet · 分类样本</span></div>;
  if (item.key === 'detection') return <div className="rounded-2xl border border-violet-100 bg-white p-5 shadow-sm"><div className="grid grid-cols-2 gap-3">{[['images/','图像文件'],['labels/','标注文件'],['classes','类别映射'],['bbox','边界框']].map(([key,value])=><div key={key} className="rounded-xl bg-violet-50 p-4"><code className="text-xs font-black text-violet-700">{key}</code><div className="mt-2 text-xs text-slate-500">{value}</div></div>)}</div><div className="mt-3 rounded-xl border border-dashed border-violet-200 px-4 py-3 text-center text-xs font-bold text-violet-600">COCO · VOC · YOLO · LabelMe</div></div>;
  return <div className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm"><div className="mb-4 text-xs font-black tracking-widest text-emerald-700">文本结构映射</div><div className="space-y-3">{[['prompt','用户输入'],['response','模型回答'],['role','对话角色'],['metadata','来源与批次']].map(([key,value])=><div key={key} className="flex items-center justify-between rounded-xl bg-emerald-50 px-4 py-3"><code className="text-xs font-black text-emerald-700">{key}</code><span className="text-xs text-slate-500">{value}</span></div>)}</div></div>;
}

function BalancePanel() {
  const bars = [72, 46, 58, 31, 64];
  return <div className="rounded-[24px] border border-blue-200 bg-white p-6 shadow-[0_18px_50px_rgba(37,99,235,.1)]">
    <div className="flex items-center justify-between"><div><div className="text-base font-black text-slate-900">类别与样本分布</div><div className="mt-1 text-xs text-slate-500">示例界面，不代表真实数据结果</div></div><BarChart3 className="h-6 w-6 text-blue-600" /></div>
    <div className="mt-6 grid gap-5 sm:grid-cols-[1.25fr_.75fr]">
      <div className="rounded-2xl bg-slate-50 p-5"><div className="flex items-center justify-between text-xs font-bold text-slate-600"><span>类别样本量</span><span className="font-normal text-slate-400">单位：样本</span></div><div className="mt-5 grid h-48 grid-cols-5 items-end gap-3 border-b border-slate-200 px-2">{bars.map((height, i) => <div key={i} className="flex h-full min-w-0 flex-col justify-end"><div className="mb-2 text-center text-xs font-black text-blue-700">{height * 10}</div><div className="w-full rounded-t-lg bg-gradient-to-t from-blue-600 to-cyan-300 shadow-sm" style={{ height: `${height}%` }} /><span className="py-2 text-center text-[11px] text-slate-500">类别 {i + 1}</span></div>)}</div></div>
      <div className="space-y-3">{[['类别覆盖','检查各类别样本范围'],['分布差异','比较数据划分差异'],['文本结构','分析长度与对话轮次']].map(([title, desc]) => <div key={title} className="rounded-xl border border-slate-200 bg-white p-4"><div className="text-sm font-black text-slate-800">{title}</div><div className="mt-1 text-xs leading-5 text-slate-500">{desc}</div></div>)}</div>
    </div>
  </div>;
}

function AnomalyPanel() {
  return <div className="rounded-[24px] border border-orange-200 bg-white p-5 shadow-[0_18px_50px_rgba(234,88,12,.1)]"><div className="grid gap-5 sm:grid-cols-[1.08fr_.92fr]"><ClassificationVisual compact /><div><div className="mb-4 text-base font-black text-slate-900">异常样本候选</div><div className="space-y-3">{['图片损坏或无法读取','跨类别近重复样本','特征离群样本','提示注入或隐藏载荷'].map((item, index) => <div key={item} className="flex items-center gap-3 rounded-xl bg-orange-50 px-4 py-3"><span className="grid h-7 w-7 place-items-center rounded-full bg-white text-xs font-black text-orange-600">{index + 1}</span><span className="text-sm font-semibold text-slate-700">{item}</span></div>)}</div></div></div></div>;
}

function CorrectnessPanel() {
  return <div className="overflow-hidden rounded-[24px] border border-violet-200 bg-white p-5 shadow-[0_18px_50px_rgba(124,58,237,.1)]"><div className="grid gap-5 sm:grid-cols-[1.15fr_.85fr]"><DetectionVisual compact /><div className="rounded-2xl bg-violet-50 p-4"><div className="mb-4 text-base font-black text-slate-900">标注一致性核查</div>{[['类别标签','待复核'],['边界框匹配','候选异常'],['预测与标注','存在差异']].map(([field, state]) => <div key={field} className="mb-3 rounded-xl bg-white px-4 py-3"><div className="text-xs text-slate-500">{field}</div><div className="mt-1 text-sm font-black text-violet-700">{state}</div></div>)}</div></div></div>;
}

function CompletenessPanel() {
  return <div className="rounded-[24px] border border-cyan-200 bg-white p-6 shadow-[0_18px_50px_rgba(8,145,178,.1)]"><div className="flex items-center justify-between"><div><div className="text-base font-black text-slate-900">任务必需字段检查</div><div className="mt-1 text-xs text-slate-500">针对不同任务类型核验数据与标注结构</div></div><ClipboardCheck className="h-6 w-6 text-cyan-600" /></div><div className="mt-6 grid gap-3 sm:grid-cols-2">{[['image_id','完整',true],['category_id','缺失候选',false],['bbox','完整',true],['annotation_id','缺失候选',false],['conversation.role','完整',true],['response','空值候选',false]].map(([field, state, ok]) => <div key={field as string} className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3"><code className="text-xs text-slate-600">{field}</code><span className={`text-xs font-black ${ok ? 'text-emerald-600' : 'text-amber-600'}`}>{state}</span></div>)}</div></div>;
}

function BackdoorPanel() {
  return <div className="overflow-hidden rounded-[24px] border border-rose-200 bg-rose-50 p-6 shadow-[0_18px_50px_rgba(220,38,38,.1)]">
    <div className="flex items-center justify-between"><div><div className="text-base font-black text-slate-900">候选模式关联分析</div><div className="mt-1 text-xs text-slate-500">初步筛查结果需要结合业务进行人工复核</div></div><ShieldAlert className="h-6 w-6 text-rose-600" /></div>
    <div className="mt-5 grid items-center gap-5 sm:grid-cols-[.95fr_1.05fr]"><div className="relative mx-auto aspect-square w-full max-w-[320px] overflow-hidden rounded-2xl border border-rose-100 bg-white"><img src={CLASSIFICATION_IMAGE} alt="后门候选图像筛查示意" className="h-full w-full object-cover" /><div className="absolute bottom-[4%] right-[4%] h-[9%] w-[9%] border-2 border-rose-500 bg-rose-400/20"><span className="absolute bottom-full right-[-2px] whitespace-nowrap rounded-t bg-rose-500 px-2 py-1 text-[10px] font-bold text-white">补丁候选</span></div></div><div className="space-y-3">{[
      ['图像模式', '角落补丁候选'], ['文本触发', '稀有固定前缀'], ['标签关联', '固定标签异常关联'], ['复核状态', '需要人工复核'],
    ].map(([key, value], i) => <div key={key} className="rounded-xl border border-rose-100 bg-white px-4 py-3"><div className="text-xs text-slate-500">{key}</div><div className={`mt-1 text-sm font-black ${i === 3 ? 'text-amber-600' : 'text-rose-700'}`}>{value}</div></div>)}</div></div>
  </div>;
}

function CapabilityVisual({ type }: { type: typeof CAPABILITIES[number]['visual'] }) {
  if (type === 'balance') return <BalancePanel />;
  if (type === 'anomaly') return <AnomalyPanel />;
  if (type === 'correctness') return <CorrectnessPanel />;
  if (type === 'completeness') return <CompletenessPanel />;
  return <BackdoorPanel />;
}

function CapabilityShowcase() {
  const [active, setActive] = useState(0);
  const item = CAPABILITIES[active];
  const Icon = item.icon;
  return <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-2">{CAPABILITIES.map((capability, index) => { const ItemIcon = capability.icon; const selected = active === index; return <button key={capability.title} onClick={() => setActive(index)} className={`mb-1 flex w-full items-center gap-3 rounded-xl px-4 py-4 text-left transition last:mb-0 ${selected ? 'bg-white shadow-sm' : 'hover:bg-white/70'}`}><span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl" style={{ color: capability.color, background: `${capability.color}12` }}><ItemIcon className="h-5 w-5" /></span><div className="min-w-0"><div className="text-base font-black text-slate-900">{capability.title}</div><div className="mt-1 text-xs text-slate-500">{capability.short}</div></div>{selected && <ArrowRight className="ml-auto h-4 w-4 shrink-0" style={{ color: capability.color }} />}</button>; })}</div>
    <div><div className="mb-6 flex items-start gap-4"><span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl" style={{ color: item.color, background: `${item.color}12` }}><Icon className="h-6 w-6" /></span><div><h3 className="text-2xl font-black text-slate-950">{item.title}</h3><p className="mt-2 text-base leading-7 text-slate-600">{item.desc}</p></div></div><CapabilityVisual type={item.visual} /><div className="mt-5 grid gap-3 sm:grid-cols-3">{item.points.map(point => <div key={point} className="flex items-start gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-600"><span className="mt-2 h-2 w-2 shrink-0 rounded-full" style={{ background: item.color }} />{point}</div>)}</div></div>
  </div>;
}

function ResultWorkbench() {
  const [mode, setMode] = useState<'classification' | 'detection' | 'text'>('classification');
  const modes = [
    { key: 'classification' as const, label: '图像分类', icon: ImageIcon, color: '#2563eb' },
    { key: 'detection' as const, label: '目标检测', icon: ScanSearch, color: '#7c3aed' },
    { key: 'text' as const, label: '大模型文本', icon: MessageSquareText, color: '#059669' },
  ];
  const details = {
    classification: {
      title: '图像异常样本候选', summary: '识别损坏、近重复、特征离群及可疑扰动样本。',
      issues: [['跨类别近重复', '2 组候选'], ['特征离群样本', '3 个候选'], ['损坏或无法读取', '1 个候选']],
      path: 'images/sample_0187.jpg', reason: '与其他类别样本特征相似度异常', risk: '建议复核',
    },
    detection: {
      title: '目标检测异常样本候选', summary: '识别无效边界框、异常目标区域与可疑扰动。',
      issues: [['无效或越界 BBox', '2 个候选'], ['异常目标区域', '1 个候选'], ['重复标注记录', '3 个候选']],
      path: 'images/street_0042.jpg', reason: '目标框坐标与图像范围存在异常', risk: '建议复核',
    },
    text: {
      title: '文本异常样本候选', summary: '识别提示注入、隐藏载荷及字符级对抗风险。',
      issues: [['提示注入片段', '2 个候选'], ['隐藏字符载荷', '1 个候选'], ['异常固定前缀', '4 个候选']],
      path: 'train_messages.jsonl · line 328', reason: '检测到可疑指令覆盖及不可见字符', risk: '较高风险',
    },
  };
  const current = details[mode];
  return <div className="overflow-hidden rounded-[26px] border border-slate-200 bg-white shadow-[0_22px_70px_rgba(15,23,42,.1)]">
    <div className="border-b border-slate-200 bg-slate-50 p-3"><div className="grid gap-2 sm:grid-cols-3">{modes.map(item => { const Icon = item.icon; const active = mode === item.key; return <button key={item.key} onClick={() => setMode(item.key)} className={`flex items-center justify-center gap-3 rounded-xl border px-5 py-4 text-sm font-black transition ${active ? 'border-blue-300 bg-white text-slate-950 shadow-sm' : 'border-transparent text-slate-500 hover:bg-white/70'}`}><span className="grid h-9 w-9 place-items-center rounded-lg" style={{ color: item.color, background: `${item.color}12` }}><Icon className="h-5 w-5" /></span>{item.label}</button>; })}</div></div>
    <div className="p-5 sm:p-7">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4"><div><div className="flex items-center gap-2 text-xs font-black tracking-widest text-orange-600"><AlertTriangle className="h-4 w-4" />恶意及异常样本评测</div><h3 className="mt-2 text-xl font-black text-slate-950">{current.title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{current.summary}</p></div><span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-700">示例结果 · 需人工复核</span></div>
      <div className="grid items-start gap-6 lg:grid-cols-[1.25fr_.75fr]">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">{mode === 'classification' ? <ClassificationVisual /> : mode === 'detection' ? <DetectionVisual /> : <TextDatasetVisual />}</div>
        <div className="space-y-3">{current.issues.map(([title, value], index) => <div key={title} className={`rounded-2xl border p-4 ${index === 0 ? 'border-orange-200 bg-orange-50' : 'border-slate-200 bg-white'}`}><div className="flex items-center justify-between gap-3"><span className="text-sm font-black text-slate-800">{title}</span><span className="shrink-0 text-xs font-black text-orange-600">{value}</span></div></div>)}<div className="rounded-2xl bg-slate-950 p-5 text-white"><div className="mb-3 flex items-center gap-2 text-xs font-bold text-slate-300"><FileSearch className="h-4 w-4 text-blue-400" />候选样本定位</div><div className="font-mono text-xs leading-6 text-slate-400">{current.path}</div><div className="mt-3 text-sm leading-6 text-slate-200">{current.reason}</div><div className="mt-3 inline-flex rounded-lg bg-orange-400/15 px-3 py-1.5 text-xs font-black text-orange-300">{current.risk}</div></div></div>
      </div>
    </div>
  </div>;
}

function ScenarioVisual({ type }: { type: string }) {
  if (type === 'classification') return <div className="rounded-[22px] bg-blue-50 p-6"><div className="mb-5 flex items-center justify-between"><b className="text-sm text-slate-800">训练集治理视图</b><span className="text-xs text-blue-600">类别分布</span></div><div className="grid h-52 grid-cols-6 items-end gap-3">{[78,55,92,38,70,62].map((h,i)=><div key={i} className="flex h-full items-end"><div className="w-full rounded-t-xl bg-gradient-to-t from-blue-600 to-cyan-300" style={{height:`${h}%`}} /></div>)}</div><div className="mt-4 grid grid-cols-3 gap-3">{['分布偏斜','重复候选','标签冲突'].map(item=><span key={item} className="rounded-xl bg-white p-3 text-center text-xs font-bold text-blue-700">{item}</span>)}</div></div>;
  if (type === 'detection') return <div className="rounded-[22px] bg-violet-50 p-6"><div className="mb-4 text-sm font-black text-slate-800">标注结构核查</div><div className="space-y-3">{[['image_id','完整'],['category_id','待核查'],['bbox','越界候选'],['annotation_id','完整']].map(([field,state],i)=><div key={field} className="flex items-center justify-between rounded-xl bg-white px-4 py-4"><code className="text-xs text-slate-600">{field}</code><span className={`text-xs font-black ${i===1||i===2?'text-amber-600':'text-emerald-600'}`}>{state}</span></div>)}</div></div>;
  return <div className="rounded-[22px] bg-emerald-50 p-6"><div className="mb-5 text-sm font-black text-slate-800">语料检查链路</div><div className="space-y-4">{['字段与角色映射','上下文结构检查','提示注入与隐藏载荷筛查','异常位置与原因留存'].map((item,i)=><div key={item} className="flex items-center gap-4 rounded-xl bg-white px-4 py-4"><span className="grid h-8 w-8 place-items-center rounded-full bg-emerald-100 text-xs font-black text-emerald-700">{i+1}</span><span className="text-sm font-bold text-slate-700">{item}</span></div>)}</div></div>;
}

function ProcessBoard({ onStart }: { onStart: () => void }) {
  const steps = [
    { num: '01', icon: Upload, title: '提交工程与诉求', desc: '上传数据工程文件，并说明任务类型与评测重点' },
    { num: '02', icon: FolderTree, title: '识别数据结构', desc: '解析图片、标注、字段与对话结构' },
    { num: '03', icon: Workflow, title: '执行评测方法', desc: '按目标调用独立的数据评测算法' },
    { num: '04', icon: FileJson, title: '留存任务结果', desc: 'JSONL结果、样本位置与历史记录' },
  ];
  return <div className="relative overflow-hidden rounded-[28px] border border-blue-200 bg-gradient-to-br from-white via-blue-50/60 to-cyan-50 p-6 shadow-[0_20px_60px_rgba(37,99,235,.1)] sm:p-9">
    <div className="relative flex flex-wrap items-center justify-between gap-4 border-b border-blue-100 pb-6"><div><div className="text-lg font-black text-slate-900">数据集安全评测流程</div><div className="mt-2 text-sm text-slate-600">处理时长取决于数据规模、任务类型及所选评测方法</div></div><div className="rounded-xl border border-blue-200 bg-white px-4 py-2 font-mono text-xs font-bold text-blue-700">数据提交 → 结果留存</div></div>
    <div className="relative mt-10 grid gap-10 md:grid-cols-4 md:gap-4"><div className="absolute left-[12.5%] right-[12.5%] top-7 hidden h-1 rounded-full bg-gradient-to-r from-blue-500 via-violet-500 to-emerald-500 md:block" />{steps.map((step, index) => { const Icon = step.icon; const colors = ['#2563eb','#0284c7','#7c3aed','#059669']; return <div key={step.num} className="relative text-center"><div className="relative z-10 mx-auto grid h-14 w-14 place-items-center rounded-full border-4 border-white bg-white shadow-lg" style={{ color: colors[index], boxShadow: `0 8px 24px ${colors[index]}25` }}><Icon className="h-6 w-6" /></div><div className="mt-5 text-xs font-black tracking-widest" style={{ color: colors[index] }}>步骤 {step.num}</div><h3 className="mt-2 text-base font-black text-slate-900">{step.title}</h3><p className="mx-auto mt-2 max-w-[210px] text-sm leading-6 text-slate-600">{step.desc}</p>{index < steps.length - 1 && <ArrowRight className="absolute -bottom-7 left-1/2 h-5 w-5 -translate-x-1/2 rotate-90 text-blue-400 md:hidden" />}</div>; })}</div>
    <div className="relative mt-10 flex flex-col items-center justify-between gap-4 rounded-2xl border border-emerald-200 bg-white px-5 py-5 sm:flex-row"><div className="flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-xl bg-emerald-50"><History className="h-5 w-5 text-emerald-600" /></span><div><div className="text-sm font-black text-slate-900">评测结果可定位、可对比、可追溯</div><div className="mt-1 font-mono text-xs text-slate-500">&lt;task_id&gt;/evaluation_result.jsonl</div></div></div><button onClick={onStart} className="inline-flex h-11 items-center gap-2 rounded-xl bg-blue-600 px-6 text-sm font-black text-white hover:bg-blue-500">提交评测任务 <ArrowRight className="h-4 w-4" /></button></div>
  </div>;
}

export function ModelSafetyEval() {
  const navigate = useNavigate();
  const { isGuest } = useUser();
  const [modalOpen, setModalOpen] = useState(false);
  const [showGuestGuard, setShowGuestGuard] = useState(false);
  const openTask = () => isGuest ? setShowGuestGuard(true) : setModalOpen(true);

  return <div className="min-h-screen overflow-x-clip bg-white text-slate-900">
    <section className="product-detail-hero relative overflow-hidden bg-slate-950 px-6 py-20 lg:px-12 lg:py-24">
      <ProductHeroBackground side="data" concept="model-data" />
      <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-[1.02fr_.98fr]">
        <div><span className="inline-flex items-center gap-2 rounded-full border border-blue-300/20 bg-blue-400/10 px-3 py-1.5 text-xs font-bold text-blue-200"><Database className="h-3.5 w-3.5" />数据侧 · 训练数据评测</span><h1 className="mt-6 text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl">数据集<br /><span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-emerald-300 bg-clip-text text-transparent">安全评测</span></h1><p className="mt-6 max-w-xl text-base leading-8 text-slate-300">面向人工智能模型训练、测试及应用过程中的数据治理需求，检查数据质量、异常样本、标注问题与后门风险，在数据进入训练前提供可定位、可追溯的量化依据。</p><div className="mt-8 flex flex-wrap gap-3"><button onClick={openTask} className="inline-flex h-12 items-center gap-2 rounded-xl bg-blue-600 px-6 text-sm font-black text-white shadow-lg shadow-blue-950/30 hover:bg-blue-500"><Upload className="h-4 w-4" />提交评测任务</button><button onClick={() => navigate('/help-docs')} className="inline-flex h-12 items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-6 text-sm font-bold text-white hover:bg-white/10">查看使用说明 <ArrowRight className="h-4 w-4" /></button></div><div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-xs text-slate-400">{['图像分类','目标检测','大模型文本'].map(item => <span key={item} className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />{item}</span>)}</div></div>
        <HeroWorkbench />
      </div>
    </section>

    <StickySubNav items={[{ id: 'mse-support', label: '支持数据类型' }, { id: 'mse-capabilities', label: '核心能力' }, { id: 'mse-result', label: '效果预览' }, { id: 'mse-scenarios', label: '应用场景' }, { id: 'mse-process', label: '执行流程' }]} />

    <section id="mse-support" className="scroll-mt-28 bg-[#f5f7fa] px-6 py-20 lg:px-12"><div className="mx-auto max-w-6xl"><SectionHeading eyebrow="DATA TYPES · 支持数据类型" title="多类型训练数据评测" desc="支持图像分类、目标检测和大模型文本数据，并根据不同数据结构匹配相应的解析与评测方法。" /><div className="grid gap-5 lg:grid-cols-3">{SUPPORT_ITEMS.map(item => { const Icon = item.icon; return <ScrollReveal key={item.key}><article className="group h-full overflow-hidden rounded-[26px] border p-4 shadow-[0_12px_36px_rgba(15,23,42,.07)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(15,23,42,.12)]" style={{ background: item.gradient, borderColor: `${item.color}22` }}><div className="flex items-start gap-3 p-2"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white shadow-sm"><Icon className="h-5 w-5" style={{ color: item.color }} /></span><div><h3 className="text-lg font-black text-slate-900">{item.title}</h3><p className="mt-1 text-sm leading-6 text-slate-600">{item.subtitle}</p></div></div><div className="my-4"><SupportVisual item={item} /></div><div className="flex flex-wrap gap-2 px-1 pb-1">{item.formats.map(format => <span key={format} className="rounded-lg border border-white/80 bg-white/70 px-3 py-1.5 text-xs font-bold text-slate-600 shadow-sm backdrop-blur">{format}</span>)}</div></article></ScrollReveal>; })}</div></div></section>

    <section id="mse-capabilities" className="scroll-mt-28 bg-white px-6 py-20 lg:px-12"><div className="mx-auto max-w-6xl"><SectionHeading eyebrow="EVALUATION · 核心能力" title="五项核心评测能力" desc="覆盖数据分布、异常样本、标注质量与后门风险，为训练前数据检查提供专项评测结果。" /><CapabilityShowcase /></div></section>

    <section id="mse-result" className="scroll-mt-28 bg-[#f5f7fa] px-6 py-20 lg:px-12"><div className="mx-auto max-w-6xl"><SectionHeading eyebrow="RESULT · 效果预览" title="恶意及异常样本评测效果" desc="切换图像分类、目标检测和大模型文本数据，查看异常候选、问题类型与样本定位结果。以下为界面示例。" /><ResultWorkbench /></div></section>

    <section id="mse-scenarios" className="scroll-mt-28 bg-white px-6 py-20 lg:px-12"><div className="mx-auto max-w-6xl"><SectionHeading eyebrow="SCENARIOS · 应用场景" title="典型应用场景" desc="面向图像分类、目标检测和大模型文本训练数据，提供与任务结构相匹配的数据质量与安全评测。" /><div className="space-y-8">{SCENARIOS.map((item, index) => { const Icon = item.icon; const visualRight = index % 2 === 0; return <ScrollReveal key={item.key}><article className="overflow-hidden rounded-[26px] border border-slate-200 bg-white shadow-[0_12px_38px_rgba(15,23,42,.07)]"><div className="h-1" style={{ background: `linear-gradient(90deg,${item.color},${item.color}55)` }} /><div className="grid items-center gap-10 p-7 lg:grid-cols-2 lg:p-10"><div className={visualRight ? '' : 'lg:order-2'}><div className="flex items-center gap-3"><span className="grid h-12 w-12 place-items-center rounded-2xl" style={{ background: `${item.color}12` }}><Icon className="h-6 w-6" style={{ color: item.color }} /></span><span className="rounded-full px-3 py-1.5 text-xs font-black" style={{ color: item.color, background: `${item.color}0d` }}>{item.label}</span></div><h3 className="mt-5 text-2xl font-black text-slate-950">{item.title}</h3><p className="mt-4 text-base leading-8 text-slate-600">{item.problem}</p><div className="mt-6"><div className="mb-3 text-xs font-black tracking-widest text-slate-400">主要评测内容</div><div className="space-y-3">{item.path.map((step, stepIndex) => <div key={step} className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3"><span className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-black text-white" style={{ background: item.color }}>{stepIndex + 1}</span><span className="text-sm font-semibold text-slate-700">{step}</span></div>)}</div></div><div className="mt-5 flex items-start gap-3 rounded-xl border px-4 py-4 text-sm leading-6" style={{ borderColor: `${item.color}25`, background: `${item.color}08`, color: item.color }}><FileJson className="mt-0.5 h-5 w-5 shrink-0" />{item.output}</div></div><div className={visualRight ? 'lg:order-2' : 'lg:order-1'}><ScenarioVisual type={item.key} /></div></div></article></ScrollReveal>; })}</div></div></section>

    <section id="mse-process" className="scroll-mt-28 border-t border-slate-200 bg-[#f5f7fa] px-6 py-20 lg:px-12"><div className="mx-auto max-w-6xl"><SectionHeading eyebrow="WORKFLOW · 执行流程" title="评测执行流程" desc="提交数据工程与评测诉求后，平台依次完成数据结构识别、评测方法执行和结果留存。" /><ProcessBoard onStart={openTask} /></div></section>

    <LightweightUploadTaskModal open={modalOpen} onClose={() => setModalOpen(false)} variant="model-data" />
    <GuestGuard open={showGuestGuard} onClose={() => setShowGuestGuard(false)} action="创建数据集安全评测任务" />
  </div>;
}
