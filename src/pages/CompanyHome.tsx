import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { openHashRoute } from '@/utils/hashRoute';
import { useUser } from '../context/UserContext';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { ScrollReveal } from '../components/ScrollReveal';
import { PlatformFlow } from '../components/PlatformFlow';
import { ScenarioSection } from '../components/ScenarioSection';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import ucImg3 from '../imports/image-9.png';
import {
  HOME_KNOWLEDGE_TABS,
  KNOWLEDGE_RESOURCES,
} from '../data/knowledgeResources';
import {
  Shield, ArrowRight, ChevronRight,
  Globe, FileText, Database,
  Brain, Cpu, Award, Layers,
  ExternalLink, Download, FileSearch, GraduationCap, Sparkles,
  MessageCircle, X,
} from 'lucide-react';

/* ─── Partner Data ─────────────────────────────────────────── */
interface Partner {
  abbr: string; fullName: string; enName: string;
  color: string; fontClass: string; isRect?: boolean; logo?: string;
}
const PARTNERS_ROW1: Partner[] = [
  { abbr: '服制院', fullName: '服务型制造研究院',             enName: 'SERVICE MFG. RESEARCH INST.',  color: '#1B6B3A', fontClass: 'font-art-mashan', logo: '/partners/isom.png' },
  { abbr: '儿院',   fullName: '浙大附属儿童医院',            enName: 'ZDUMC CHILDREN\'S HOSPITAL',   color: '#1565C0', fontClass: 'font-art-zhimang', logo: '/partners/zju-children.png' },
  { abbr: '启真',   fullName: '浙大启真未来城市科技',         enName: 'ZJU QIZHEN CITY TECH',        color: '#003087', fontClass: 'font-art-xiaowei', logo: '/partners/zju-qizhen.png' },
  { abbr: 'CAICT', fullName: '中国信息通信研究院',            enName: 'CAICT',                       color: '#0068B7', fontClass: 'font-art-xiaowei', isRect: true, logo: '/partners/caict.png' },
  { abbr: '浙工大', fullName: '浙江工业大学',                enName: 'ZJUT',                        color: '#1B3C6E', fontClass: 'font-art-zhimang', logo: '/partners/zjut.jpg' },
  { abbr: '工信院', fullName: '浙江省工业和信息化研究院',     enName: 'ZJIIRI',                      color: '#145DA0', fontClass: 'font-art-huangyou', isRect: true, logo: '/partners/zjiiri.png' },
  { abbr: '老年院', fullName: '杭州市老年病医院',             enName: 'HANGZHOU GERIATRIC HOSP.',    color: '#2B7A78', fontClass: 'font-art-xiaowei', logo: '/partners/hangzhou-geriatric.png' },
  { abbr: '加迹',   fullName: '浙江加迹科技有限公司',         enName: 'ZHEJIANG JIAJI TECH',         color: '#5B34A2', fontClass: 'font-art-mashan', logo: '/partners/jiaji-tech.png' },
];
const PARTNERS_ROW2: Partner[] = [];

function PartnerCard({ partner }: { partner: Partner }) {
  return (
    <div className="partner-item glass-glow rounded-2xl px-5 py-6 flex min-h-[184px] flex-col items-center justify-center gap-4 cursor-default">
      {partner.logo ? (
        <div className="flex h-24 w-full shrink-0 items-center justify-center">
          <img
            src={partner.logo}
            alt={`${partner.fullName} Logo`}
            className="max-h-[92px] max-w-[196px] object-contain object-center"
            loading="lazy"
          />
        </div>
      ) : (
        <div
          className={`${partner.isRect ? 'rounded-xl w-14 h-10' : 'rounded-full w-12 h-12'} flex items-center justify-center shrink-0 shadow-md`}
          style={{ backgroundColor: partner.color }}
        >
          <span className="text-white font-bold text-base leading-none">{partner.abbr}</span>
        </div>
      )}
      <div className="min-h-5 text-center text-[15px] font-black leading-5 text-slate-800" style={{ fontFamily: '"Noto Sans SC","Source Han Sans SC","PingFang SC","Microsoft YaHei",sans-serif', letterSpacing: '-0.01em' }}>{partner.fullName}</div>
    </div>
  );
}

/* ─── Product Matrix Data ──────────────────────────────────── */
const PORTAL_PRODUCTS = [
  {
    id: 'data',
    name: '数据侧',
    tagline: '数据审查、评测、审核与标识治理',
    desc: '覆盖敏感信息、模型数据、AIGC审核与内容标识追溯',
    icon: Database,
    grad: 'from-violet-500 to-purple-600',
    accentColor: '#8b5cf6',
    subProducts: [
      { name: '个人敏感信息审查', path: '/privacy-data-audit' },
      { name: '数据集安全评测', path: '/model-safety-eval' },
      { name: 'AIGC内容审核与鉴伪', path: '/aigc-content' },
      { name: 'AIGC内容标识与检测', path: '/aigc-content-marking' },
    ],
    helpSection: 'section-data',
    primaryPath: '/products-overview',
    statusLabel: '正式发布',
    statusBg: 'rgba(34,197,94,0.12)',
    statusTextColor: '#16a34a',
  },
  {
    id: 'model',
    name: '模型侧',
    tagline: '大模型全栈可信度综合评估',
    desc: '依托于国内外标准，提供权威可信的全层次模型评测认证',
    icon: Brain,
    grad: 'from-blue-500 to-indigo-600',
    accentColor: '#3b82f6',
    subProducts: [
      { name: '深度模型可信测评', path: '/deep-model-eval' },
      { name: '具身智能可信评测', path: '/embodied-intelligence' },
      { name: '智能体安全评测', path: '/agent-safety' },
      { name: '大模型性能评测', path: '/llm-evaluation' },
      { name: '大模型安全评测', path: '/safety-evaluation' },
    ],
    helpSection: 'section-model',
    primaryPath: '/llm-evaluation',
    statusLabel: '正式发布',
    statusBg: 'rgba(34,197,94,0.12)',
    statusTextColor: '#16a34a',
  },
  {
    id: 'app',
    name: '系统侧',
    tagline: 'AI系统层风险检测与防控',
    desc: '三道安全防线，让每个 AI 应用以最佳状态安全上线',
    icon: Shield,
    grad: 'from-cyan-500 to-blue-600',
    accentColor: '#06b6d4',
    subProducts: [
      { name: '代码漏洞审查', path: '/code-vulnerability-audit' },
      { name: '网络渗透测试', path: '/penetration-test' },
    ],
    helpSection: 'section-app',
    primaryPath: '/products-overview',
    statusLabel: '正式发布',
    statusBg: 'rgba(34,197,94,0.12)',
    statusTextColor: '#16a34a',
  },
  {
    id: 'compliance',
    name: '服务侧',
    tagline: 'AI合规政策解读与备案服务',
    desc: '从备案辅导到标准建设，构建可审计的 AI 服务支持闭环',
    icon: FileText,
    grad: 'from-emerald-500 to-teal-600',
    accentColor: '#10b981',
    subProducts: [
      { name: '人工智能安全教学平台', path: '/ai-safety-edu' },
      { name: '大模型备案服务', path: '/model-filing-service' },
      { name: '可信安全标准制定服务', path: '/tianche-standard-service' },
    ],
    helpSection: 'section-service',
    primaryPath: '/products-overview',
    statusLabel: '正式发布',
    statusBg: 'rgba(34,197,94,0.12)',
    statusTextColor: '#16a34a',
  },
];

/* ─── Platform Advantages (metrics strip) ─────────────────── */
const METRICS = [
  {
    value: '30+',
    label: '专利与软著',
    desc: '拥有数十项AI安全检测算法专利及核心软件著作权，实现技术硬实力与产品落地力的双重保障。',
    grad: 'linear-gradient(135deg,#3b82f6,#6366f1)',
    barColor: '#3b82f6',
  },
  {
    value: '10年+',
    label: '学术研究积累',
    desc: '依托浙江大学滨江研究院及浙江工业大学深厚科研底蕴，汇聚顶尖学术资源，持续引领AI安全技术前沿。',
    grad: 'linear-gradient(135deg,#8b5cf6,#c084fc)',
    barColor: '#8b5cf6',
  },
  {
    value: '20+',
    label: '合作机构',
    desc: '联合顶尖高校与科研机构，构建开放共享的 AI 安全评测生态',
    grad: 'linear-gradient(135deg,#06b6d4,#3b82f6)',
    barColor: '#06b6d4',
  },
  {
    value: '4大',
    label: '产品系列',
    desc: '全栈覆盖数据、模型、系统、服务全生命周期安全保障',
    grad: 'linear-gradient(135deg,#10b981,#06b6d4)',
    barColor: '#10b981',
  },
];

/* ─── Use Cases ───────────────────────────────────────────── */
const USE_CASES = [
  {
    icon: Shield,
    title: '第三方测评机构',
    enTitle: 'Third-Party Evaluation Agencies',
    desc: '提供标准化的 AI 安全评测技术能力与工具支持，协助第三方机构开展合规检测与认证服务。共建权威、公正的 AI 安全测评生态体系。',
    tags: ['技术赋能', '标准共建', '生态合作'],
    color: '#8b5cf6',
    imgUrl: '/company-home/usecase-agency.png',
  },
  {
    icon: Cpu,
    title: '企业 AI 团队',
    enTitle: 'Enterprise AI Teams',
    desc: '覆盖从模型训练到应用上线的全流程安全合规检测，支持企业 AI 产品快速备案与认证。一站式服务帮助企业建立可信 AI 安全体系，加速产品合规落地。',
    tags: ['安全合规', '备案支持', '商业落地'],
    color: '#3b82f6',
    imgUrl: '/company-home/usecase-enterprise.jpg',
  },
  {
    icon: Globe,
    title: '政府监管机构',
    enTitle: 'Government Regulators',
    desc: '提供符合国家标准的权威第三方评测报告，支持政府对 AI 产品进行规范监管与合规审查。深度对标国内安全规范与行业标准，为政策制定和监管执行提供科学依据。',
    tags: ['权威认证', '监管支撑', '标准合规'],
    color: '#06b6d4',
    imgUrl: ucImg3,
  },
];

/* ─── Resource Hub ──────────────────────────────────────────── */
type HomeKnowledgeTab = typeof HOME_KNOWLEDGE_TABS[number];

const RESOURCE_ICONS: Record<HomeKnowledgeTab, React.ElementType> = {
  实践指南: GraduationCap,
  合规报告: FileSearch,
  研究文章: FileSearch,
};


/* ─── Homepage Hero Carousel ───────────────────────────────── */
const HERO_SLIDES = [
  {
    eyebrow: 'XUANJIAN · AI SECURITY PLATFORM',
    title: 'AI 安全与评测',
    highlight: '全栈服务平台',
    desc: '覆盖数据治理、模型评测、系统安全、合规治理四大领域，为 AI 产品全生命周期提供一站式科学评测与安全治理服务。',
    background: '/rongsu-ai-security-hero.png',
    accent: '#1677ff',
    glow: 'rgba(22,119,255,0.22)',
  },
  {
    eyebrow: 'XUANJIAN · DATA SECURITY',
    title: '数据侧',
    highlight: '让数据可信、合规、可用',
    desc: '覆盖个人敏感信息审查、数据集安全评测、AIGC内容审核与标识追溯，从数据识别、风险检测到合规处置，为模型训练和业务应用筑牢可信数据基础。',
    background: '/hero-data-side.png',
    accent: '#2563eb',
    glow: 'rgba(37,99,235,0.22)',
  },
  {
    eyebrow: 'XUANJIAN · MODEL EVALUATION',
    title: '模型侧',
    highlight: '度量能力，验证可信',
    desc: '面向大模型和智能体开展安全、性能、鲁棒性与任务能力评测，通过标准化指标、自动化测试和可视化报告，系统识别模型风险与能力边界。',
    background: '/hero-model-side.png',
    accent: '#4f46e5',
    glow: 'rgba(79,70,229,0.20)',
  },
  {
    eyebrow: 'XUANJIAN · SYSTEM SECURITY',
    title: '系统侧',
    highlight: '守住上线与运行安全',
    desc: '覆盖代码漏洞审查、网络渗透测试和 AI 系统上线验证，以攻击者视角发现系统薄弱环节，形成从风险定位到防御加固的安全闭环。',
    background: '/hero-system-side.png',
    accent: '#0891b2',
    glow: 'rgba(8,145,178,0.20)',
  },
  {
    eyebrow: 'XUANJIAN · PROFESSIONAL SERVICES',
    title: '服务侧',
    highlight: '陪伴 AI 项目合规落地',
    desc: '提供大模型备案、安全标准咨询、人工智能安全教学与全流程专业支持，将评测能力、行业经验和合规要求转化为可执行的落地方案。',
    background: '/hero-service-side.png',
    accent: '#0f9f7f',
    glow: 'rgba(15,159,127,0.20)',
  },
] as const;

const HERO_FEATURED_LINKS = [
  ...KNOWLEDGE_RESOURCES.白皮书.map((resource) => ({
    kind: 'resource' as const,
    title: resource.title,
    desc: resource.desc,
    date: resource.date,
    color: resource.color,
    fileUrl: resource.fileUrl,
    downloadName: resource.downloadName,
  })),
  {
    kind: 'about' as const,
    title: '关于榕数',
    desc: '专注人工智能安全与可信评测，服务 AI 产品全生命周期',
    path: '/about',
    color: '#2563eb',
  },
] as const;

function downloadKnowledgeResource(
  title: string,
  desc: string,
  date: string,
  fileUrl?: string,
  downloadName?: string,
) {
  if (fileUrl) {
    const anchor = document.createElement('a');
    anchor.href = fileUrl;
    anchor.download = downloadName || `${title.replace(/[《》]/g, '')}.pdf`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    return;
  }

  const content = `${title}\n\n${desc}\n\n发布日期：${date}\n\n杭州榕数科技有限公司 · 玄鉴 AI安全与评测平台`;
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `${title.replace(/[《》]/g, '')}.txt`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

const SHOW_HOME_TRIAL_ACTIONS = false;

/* ─── Product Card Component (数美 style) ────────────────── */
function ProductCard({ product }: { product: typeof PORTAL_PRODUCTS[0] }) {
  const navigate = useNavigate();
  const Icon = product.icon;
  const [hoveredSub, setHoveredSub] = useState<string | null>(null);

  return (
    <div
      className="rounded-2xl overflow-hidden flex flex-col bg-white transition-all duration-300 hover:shadow-lg relative"
      style={{
        border: '1px solid #e8edf5',
        boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
      }}
    >
      {/* Top accent glow strip */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 72, background: `linear-gradient(180deg, ${product.accentColor}18 0%, transparent 100%)`, borderRadius: '16px 16px 0 0', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${product.accentColor}90, ${product.accentColor}30)`, borderRadius: '16px 16px 0 0', pointerEvents: 'none', zIndex: 1 }} />
      {/* Card top */}
      <div className="p-5 pb-4 relative z-10">
        {/* Icon + title inline row (no status badge) */}
        <div className="flex items-center gap-3 mb-3">
          <div
            className={`w-11 h-11 rounded-xl bg-gradient-to-br ${product.grad} flex items-center justify-center shrink-0`}
            style={{ boxShadow: `0 4px 12px ${product.accentColor}38` }}
          >
            <Icon className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-gray-900" style={{ fontSize: '1.15rem', fontWeight: 900, margin: 0 }}>
            {product.name}
          </h3>
        </div>

        <p className="text-gray-400 text-xs mb-2">{product.tagline}</p>
        <p className="text-gray-500 text-sm leading-relaxed mb-4">{product.desc}</p>

        {/* CTA button */}
        {SHOW_HOME_TRIAL_ACTIONS && <button
          className="w-full rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
          style={{
            background: 'linear-gradient(135deg,#2563eb,#3b82f6)',
            color: '#fff',
            border: 'none',
            boxShadow: '0 4px 14px rgba(37,99,235,0.28)',
          }}
          onClick={() => navigate('/help-docs', { state: { scrollTo: product.helpSection } })}
        >
          查看详情
        </button>}
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: '#f1f5f9', margin: '0 20px' }} />

      {/* Sub-products list */}
      <div className="p-4 flex-1 relative z-10">
        <ul className="space-y-0.5">
          {product.subProducts.map((sub) => {
            const isHov = hoveredSub === sub.name;
            return (
              <li key={sub.name}>
                <button
                  className="w-full flex items-center gap-2.5 rounded-lg transition-all duration-150 text-left"
                  style={{
                    padding: '7px 8px',
                    background: isHov ? `${product.accentColor}0d` : 'transparent',
                  }}
                  onMouseEnter={() => setHoveredSub(sub.name)}
                  onMouseLeave={() => setHoveredSub(null)}
                  onClick={() => { window.scrollTo(0, 0); navigate(sub.path); }}
                >
                  <div
                    className="w-1.5 h-1.5 rounded-full shrink-0 transition-all"
                    style={{
                      background: product.accentColor,
                      transform: isHov ? 'scale(1.35)' : 'scale(1)',
                      opacity: isHov ? 1 : 0.55,
                    }}
                  />
                  <span
                    className="text-sm flex-1 transition-colors"
                    style={{ color: isHov ? product.accentColor : '#374151', fontWeight: isHov ? 600 : 500 }}
                  >
                    {sub.name}
                  </span>
                  {/* Circular arrow badge */}
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-all duration-150"
                    style={{
                      background: isHov ? product.accentColor : `${product.accentColor}18`,
                      transform: isHov ? 'translateX(2px)' : 'translateX(0)',
                    }}
                  >
                    <ChevronRight
                      className="w-3 h-3 transition-colors"
                      style={{ color: isHov ? '#ffffff' : product.accentColor }}
                    />
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

/* ─── Main Component ──────────────────────────────────────── */
export function CompanyHome() {
  const SHOW_XUANJIAN_ASSISTANT = false;
  const navigate = useNavigate();
  const { isGuest } = useUser();
  const [activeResourceTab, setActiveResourceTab] = useState<HomeKnowledgeTab>('实践指南');
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<{from:'agent'|'user';text:string;ts:string}[]>([
    { from: 'agent', text: '您好！我是玄鉴智能助手，很高兴为您服务 😊', ts: '刚刚' },
    { from: 'agent', text: '请问您想了解哪方面的内容？例如：大模型评测、AIGC内容审核、AIGC内容标识、大模型备案服务，或其他问题？', ts: '刚刚' },
  ]);
  const [chatInput, setChatInput] = useState('');
  const chatMessagesRef = useRef<HTMLDivElement>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [activeHeroSlide, setActiveHeroSlide] = useState(0);
  const [heroTransitionKey, setHeroTransitionKey] = useState(0);
  const [isHeroPaused, setIsHeroPaused] = useState(false);

  useEffect(() => {
    if (isHeroPaused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timer = window.setInterval(() => {
      setActiveHeroSlide(current => (current + 1) % HERO_SLIDES.length);
      setHeroTransitionKey(current => current + 1);
    }, 5600);
    return () => window.clearInterval(timer);
  }, [isHeroPaused]);

  useEffect(() => {
    if (!showChat) return;
    const frame = window.requestAnimationFrame(() => {
      const container = chatMessagesRef.current;
      if (container) container.scrollTop = container.scrollHeight;
    });
    return () => window.cancelAnimationFrame(frame);
  }, [chatMessages, showChat]);

  const selectHeroSlide = (index: number) => {
    const nextIndex = (index + HERO_SLIDES.length) % HERO_SLIDES.length;
    if (nextIndex === activeHeroSlide) return;
    setActiveHeroSlide(nextIndex);
    setHeroTransitionKey(current => current + 1);
  };

  const sendChatMessage = () => {
    if (!chatInput.trim()) return;
    const userMsg = { from: 'user' as const, text: chatInput.trim(), ts: '刚刚' };
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setTimeout(() => {
      setChatMessages(prev => [...prev, { from: 'agent', text: '感谢您的留言！我们的专属顾问将在工作时间（9:00–18:00）内尽快回复您，或拨打 13940451397 获取即时支持。', ts: '刚刚' }]);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-white">

      {/* ══════════════════════════════════════════════════════════
          1. HERO — bright 3D carousel
      ══════════════════════════════════════════════════════════ */}
      <section
        className="rongsu-hero"
        aria-label="榕数科技核心产品与服务"
        aria-roledescription="轮播图"
        tabIndex={0}
        onMouseEnter={() => setIsHeroPaused(true)}
        onMouseLeave={() => setIsHeroPaused(false)}
        onFocusCapture={() => setIsHeroPaused(true)}
        onBlurCapture={() => setIsHeroPaused(false)}
        onKeyDown={(event) => {
          if (event.key === 'ArrowLeft') selectHeroSlide(activeHeroSlide - 1);
          if (event.key === 'ArrowRight') selectHeroSlide(activeHeroSlide + 1);
        }}
      >
        <div className="rongsu-hero__visual">
          <div
            key={`${activeHeroSlide}-${heroTransitionKey}`}
            className="rongsu-hero__stage"
            style={{ '--hero-accent-glow': HERO_SLIDES[activeHeroSlide].glow } as React.CSSProperties}
          >
            <div
              className="rongsu-hero__image"
              aria-hidden="true"
              style={{ backgroundImage: `url('${HERO_SLIDES[activeHeroSlide].background}')` }}
            />
            <div className="rongsu-hero__wash" aria-hidden="true" />

            <div className="rongsu-hero__main">
              <article className="rongsu-hero__copy" aria-live="polite">
                <div className="rongsu-hero__platform-mark">
                  <img src="/xuanjian-brand-logo.png" alt="玄鉴" />
                  <span className="rongsu-hero__brand-copy">
                    <span className="rongsu-hero__brand-line">
                      <strong>玄鉴</strong>
                      <span className="rongsu-hero__brand-divider" aria-hidden="true" />
                      <span className="rongsu-hero__brand-title">AI 安全与评测平台</span>
                    </span>
                    <small>XUANJIAN · TRUSTED AI SECURITY</small>
                  </span>
                </div>
                <div className="rongsu-hero__eyebrow" style={{ color: HERO_SLIDES[activeHeroSlide].accent }}>
                  <span style={{ background: HERO_SLIDES[activeHeroSlide].accent }} />
                  {HERO_SLIDES[activeHeroSlide].eyebrow}
                </div>
                <h1>
                  {HERO_SLIDES[activeHeroSlide].title}<br />
                  <strong style={{ color: HERO_SLIDES[activeHeroSlide].accent }}>
                    {HERO_SLIDES[activeHeroSlide].highlight}
                  </strong>
                </h1>
                <p>{HERO_SLIDES[activeHeroSlide].desc}</p>
                {(SHOW_HOME_TRIAL_ACTIONS || SHOW_XUANJIAN_ASSISTANT) && (
                <div className="rongsu-hero__actions">
                  {SHOW_HOME_TRIAL_ACTIONS && (
                  <Button
                    size="lg"
                    className="text-white font-semibold px-8 border-0"
                    style={{ background: HERO_SLIDES[activeHeroSlide].accent, boxShadow: `0 10px 28px ${HERO_SLIDES[activeHeroSlide].glow}` }}
                    onClick={() => {
                      if (isGuest) setShowLoginModal(true);
                      else openHashRoute('/online-experience');
                    }}
                  >
                    免费试用
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                  )}
                  {SHOW_XUANJIAN_ASSISTANT && (
                    <Button
                      size="lg"
                      variant="outline"
                      className="rongsu-hero__secondary font-semibold px-8"
                      onClick={() => setShowChat(true)}
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />联系我们
                    </Button>
                  )}
                </div>
                )}
              </article>

              {activeHeroSlide === 0 && (
                <aside className="rongsu-hero__overview" aria-label="玄鉴平台四大产品体系">
                  {[
                    { name: '数据侧', count: 4, note: '审查 · 评测 · 审核 · 标识', icon: Database, color: '#7c3aed' },
                    { name: '模型侧', count: 5, note: '性能 · 安全 · 可信', icon: Brain, color: '#2563eb' },
                    { name: '系统侧', count: 2, note: '代码 · 渗透 · 防护', icon: Shield, color: '#0891b2' },
                    { name: '服务侧', count: 3, note: '备案 · 标准 · 教学', icon: FileText, color: '#059669' },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <div className="rongsu-hero__overview-card" key={item.name}>
                        <span className="rongsu-hero__overview-icon" style={{ color: item.color, background: `${item.color}14` }}>
                          <Icon aria-hidden="true" />
                        </span>
                        <div className="rongsu-hero__overview-heading">
                          <strong>{item.name}</strong>
                          <span><b style={{ color: item.color }}>{item.count}</b> 项服务</span>
                        </div>
                        <small style={{ color: item.color, background: `${item.color}0d`, borderColor: `${item.color}22` }}>
                          {item.note}
                        </small>
                      </div>
                    );
                  })}
                </aside>
              )}
            </div>
          </div>

          <div className="rongsu-hero__controls">
            <div className="rongsu-hero__dots" role="tablist" aria-label="选择轮播内容">
              {HERO_SLIDES.map((slide, index) => (
                <button
                  key={slide.title}
                  type="button"
                  role="tab"
                  aria-selected={activeHeroSlide === index}
                  aria-label={`第${index + 1}张：${slide.title}${slide.highlight}`}
                  className={activeHeroSlide === index ? 'is-active' : ''}
                  style={activeHeroSlide === index ? { background: slide.accent } : undefined}
                  onClick={() => selectHeroSlide(index)}
                />
              ))}
            </div>
          </div>

          <nav className="rongsu-hero__quick" aria-label="精选白皮书与品牌入口">
            <div className="rongsu-hero__quick-inner">
              {HERO_FEATURED_LINKS.map((item) => (
                <button
                  type="button"
                  key={item.title}
                  className={`rongsu-hero__quick-item rongsu-hero__quick-item--${item.kind}`}
                  style={{ '--quick-accent': item.color } as React.CSSProperties}
                  onClick={() => {
                    if (item.kind === 'resource') {
                      downloadKnowledgeResource(item.title, item.desc, item.date, item.fileUrl, item.downloadName);
                    } else {
                      window.scrollTo(0, 0);
                      navigate(item.path);
                    }
                  }}
                >
                  <strong className="rongsu-hero__quick-title">{item.title}</strong>
                  <span className="rongsu-hero__quick-bottom">
                    <span className="rongsu-hero__quick-tag">{item.kind === 'resource' ? '白皮书' : '企业介绍'}</span>
                    <small>{item.desc}</small>
                  </span>
                  <span className="rongsu-hero__quick-cta">
                    {item.kind === 'resource' ? '立即下载' : '了解更多'}
                  </span>
                </button>
              ))}
            </div>
          </nav>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          2. PLATFORM CAPABILITY FLOW (修改点2 — replaces vertical nav)
      ══════════════════════════════════════════════════════════ */}
      {/* PlatformFlow hidden */}

      {/* ══════════════════════════════════════════════════════════
          3. PRODUCT MATRIX — 数美 style (修改点1)
      ══════════════════════════════════════════════════════════ */}
      <ScrollReveal>
        <section id="product-matrix" className="scroll-mt-24 py-20 px-4" style={{ background: 'linear-gradient(180deg,#f8faff,#fff)' }}>
          <div className="max-w-[83%] mx-auto">
            <div className="text-center mb-12">
              <div className="rongsu-product-matrix__heading">
                <img src="/xuanjian-brand-logo.png" alt="" aria-hidden="true" />
                <span>
                  <Badge className="mb-2 bg-blue-50 text-blue-700 border-blue-200 text-xs">玄鉴 · 产品矩阵</Badge>
                  <h2 className="text-gray-900" style={{ fontSize: '2rem', fontWeight: 900, lineHeight: 1.2 }}>
                    玄鉴平台四大核心能力侧
                  </h2>
                </span>
              </div>
              <div className="h-1 w-14 rounded-full mx-auto mb-4" style={{ background: 'linear-gradient(90deg,#6366f1,#06b6d4)' }} />
              <p className="text-gray-500 text-sm max-w-2xl mx-auto">
                涵盖数据、模型、系统、服务四大维度，提供全生命周期 AI 安全服务
              </p>
            </div>

            <div className="grid grid-cols-4 gap-5 mb-8">
              {PORTAL_PRODUCTS.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

          </div>
        </section>
      </ScrollReveal>

      {/* ══════════════════════════════════════════════════════════
          4. SCENARIO SECTION (典型应用场景)
      ══════════════════════════════════════════════════════════ */}
      <ScenarioSection />

      {/* ══════════════════════════════════════════════════════════
          5. PLATFORM ADVANTAGES — horizontal value strip
      ══════════════════════════════════════════════════════════ */}
      <ScrollReveal>
        <section
          className="relative py-16 px-4 overflow-hidden"
          style={{ background: 'linear-gradient(135deg,#f0f4ff,#eef2ff,#f5f3ff)' }}
        >
          <div className="absolute inset-0 bg-dot-grid" />
          <div className="relative max-w-[83%] mx-auto">

            <div className="text-center mb-10">
              <Badge className="mb-3 bg-indigo-50 text-indigo-700 border-indigo-200 text-xs">平台优势</Badge>
              <h2 className="text-gray-900 mb-2" style={{ fontSize: '1.85rem', fontWeight: 900, lineHeight: 1.2 }}>
                为什么选择我们
              </h2>
              <div
                className="h-1 w-12 rounded-full mx-auto"
                style={{ background: 'linear-gradient(90deg,#6366f1,#8b5cf6)' }}
              />
            </div>

            {/* Metrics strip */}
            <div
              className="rounded-3xl overflow-hidden"
              style={{
                background: 'rgba(255,255,255,0.82)',
                border: '1px solid rgba(99,102,241,0.12)',
                backdropFilter: 'blur(16px)',
                boxShadow: '0 8px 48px rgba(99,102,241,0.08)',
              }}
            >
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)' }}>
                {METRICS.map((m, idx) => (
                  <div
                    key={m.label}
                    style={{
                      padding: '36px 28px',
                      borderRight: idx < 3 ? '1px solid rgba(99,102,241,0.08)' : 'none',
                      textAlign: 'center',
                    }}
                  >
                    {/* Big value */}
                    <div
                      style={{
                        fontSize: '2.6rem',
                        fontWeight: 900,
                        background: m.grad,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        lineHeight: 1.1,
                        marginBottom: 6,
                      }}
                    >
                      {m.value}
                    </div>
                    {/* Label */}
                    <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#1e293b', marginBottom: 10 }}>
                      {m.label}
                    </div>
                    {/* Short accent bar */}
                    <div
                      style={{
                        width: 32,
                        height: 3,
                        borderRadius: 2,
                        background: m.barColor,
                        margin: '0 auto 12px',
                      }}
                    />
                    {/* Description */}
                    <p style={{ fontSize: '0.75rem', color: '#94a3b8', lineHeight: 1.65 }}>
                      {m.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>
      </ScrollReveal>

      {/* ══════════════════════════════════════════════════════════
          6. USE CASES — alternating image + text rows
      ══════════════════════════════════════════════════════════ */}
      <ScrollReveal>
        <section className="py-20 px-4 bg-white">
          <div className="max-w-[83%] mx-auto">

            <div className="text-center mb-16">
              <Badge className="mb-3 bg-cyan-50 text-cyan-700 border-cyan-200 text-xs">服务对象</Badge>
              <h2 className="text-gray-900 mb-2" style={{ fontSize: '1.85rem', fontWeight: 900, lineHeight: 1.2 }}>
                服务多元化用户群体
              </h2>
              <div
                className="h-1 w-12 rounded-full mx-auto"
                style={{ background: 'linear-gradient(90deg,#06b6d4,#3b82f6)' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 72 }}>
              {USE_CASES.map((uc, idx) => {
                const Icon = uc.icon;
                const isEven = idx % 2 === 0;
                return (
                  <div
                    key={uc.title}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: 56,
                      alignItems: 'center',
                      direction: isEven ? 'ltr' : 'rtl',
                    }}
                  >
                    {/* Image side */}
                    <div
                      style={{
                        direction: 'ltr',
                        position: 'relative',
                        height: 360,
                        borderRadius: 20,
                        overflow: 'hidden',
                        boxShadow: `0 20px 60px ${uc.color}22`,
                      }}
                    >
                      <ImageWithFallback
                        src={uc.imgUrl}
                        alt={uc.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <div
                        style={{
                          position: 'absolute',
                          inset: 0,
                          background: `linear-gradient(135deg,${uc.color}18,${uc.color}38)`,
                        }}
                      />
                      {/* Icon badge */}
                      <div
                        style={{
                          position: 'absolute',
                          top: 24,
                          left: 24,
                          width: 52,
                          height: 52,
                          borderRadius: 16,
                          background: `${uc.color}dd`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backdropFilter: 'blur(12px)',
                          boxShadow: `0 6px 20px ${uc.color}50`,
                        }}
                      >
                        <Icon style={{ width: 24, height: 24, color: '#fff' }} />
                      </div>
                    </div>

                    {/* Text side */}
                    <div style={{ direction: 'ltr' }}>
                      <div
                        style={{
                          fontSize: '0.62rem',
                          fontWeight: 700,
                          color: uc.color,
                          letterSpacing: '0.1em',
                          textTransform: 'uppercase',
                          marginBottom: 12,
                        }}
                      >
                        {uc.enTitle}
                      </div>
                      <h3
                        style={{
                          fontSize: '1.65rem',
                          fontWeight: 900,
                          color: '#1e293b',
                          marginBottom: 12,
                          lineHeight: 1.2,
                        }}
                      >
                        {uc.title}
                      </h3>
                      <div
                        style={{
                          width: 40,
                          height: 3,
                          borderRadius: 2,
                          background: uc.color,
                          marginBottom: 18,
                        }}
                      />
                      <p
                        style={{
                          fontSize: '0.9rem',
                          color: '#64748b',
                          lineHeight: 1.85,
                          marginBottom: 24,
                        }}
                      >
                        {uc.desc}
                      </p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                        {uc.tags.map((tag) => (
                          <span
                            key={tag}
                            style={{
                              fontSize: '0.78rem',
                              fontWeight: 600,
                              padding: '6px 14px',
                              borderRadius: 999,
                              background: `${uc.color}0f`,
                              color: uc.color,
                              border: `1px solid ${uc.color}28`,
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </section>
      </ScrollReveal>

      {/* ══════════════════════════════════════════════════════════
          6. PARTNERS CAROUSEL
      ══════════════════════════════════════════════════════════ */}
      <ScrollReveal>
        <section className="bg-white py-16 px-4">
          <div className="max-w-[83%] mx-auto">
            <div className="text-center mb-10">
              <Badge className="mb-4 bg-blue-50 text-blue-700 border-blue-200 text-xs">合作生态</Badge>
              <h2 className="text-gray-800 mb-3" style={{ fontSize: '2rem', fontWeight: 900, lineHeight: 1.2 }}>
                汇聚 核心 产学研合作伙伴
              </h2>
              <div className="h-1 w-14 rounded-full mx-auto mb-4" style={{ background: 'linear-gradient(90deg,#3b82f6,#06b6d4)' }} />
              <p className="text-gray-500 text-sm max-w-xl mx-auto">联动高校、科研机构与创新企业，打造 AI 安全共同体</p>
            </div>
            <div className="relative overflow-hidden">
              <div className="partner-carousel">
                <div className="partner-track">
                  {[...PARTNERS_ROW1, ...PARTNERS_ROW1].map((partner, index) => (
                    <PartnerCard key={`r1-${index}`} partner={partner} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* ══════════════════════════════════════════════════════════
          8. RESOURCE HUB — optimized layout
      ══════════════════════════════════════════════════════════ */}
      <ScrollReveal>
        <section
          className="hidden py-12 px-4"
          style={{ background: 'linear-gradient(180deg,#f8faff,#fff)' }}
        >
          <div className="max-w-[83%] mx-auto">
            {/* Compact header */}
            <div className="text-center mb-5">
              <Badge className="mb-2 bg-slate-100 text-slate-600 border-slate-200 text-xs">知识库</Badge>
              <h2 className="text-gray-900 mb-2" style={{ fontSize: '1.75rem', fontWeight: 900, lineHeight: 1.2 }}>
                知识库
              </h2>
              <div className="h-1 w-12 rounded-full mx-auto mb-2" style={{ background: 'linear-gradient(90deg,#6366f1,#06b6d4)' }} />
              <p className="text-gray-400 text-sm max-w-xl mx-auto">
                汇聚 AI 安全评测领域的实践指南、合规报告与前沿研究
              </p>
            </div>

            {/* Tabs — close to header */}
            <div className="flex items-center justify-center gap-2 mb-6">
              {HOME_KNOWLEDGE_TABS.map((tab) => (
                <button
                  key={tab}
                  className="px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200"
                  style={{
                    background: activeResourceTab === tab
                      ? 'linear-gradient(135deg,#6366f1,#4f46e5)'
                      : '#f1f5f9',
                    color: activeResourceTab === tab ? '#fff' : '#64748b',
                    boxShadow: activeResourceTab === tab ? '0 4px 14px rgba(99,102,241,0.3)' : 'none',
                  }}
                  onClick={() => setActiveResourceTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Resource cards — vertical layout with cover thumbnail */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {KNOWLEDGE_RESOURCES[activeResourceTab].map((res) => {
                const Icon = RESOURCE_ICONS[activeResourceTab];
                return (
                  <button
                    type="button"
                    key={res.title}
                    className="bg-white rounded-2xl overflow-hidden cursor-pointer group transition-all duration-300 text-left"
                    style={{
                      border: '1px solid #e8edf5',
                      boxShadow: '0 2px 14px rgba(0,0,0,0.06)',
                    }}
                    onClick={() => downloadKnowledgeResource(res.title, res.desc, res.date)}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget;
                      el.style.transform = 'translateY(-8px)';
                      el.style.boxShadow = `0 20px 40px ${res.color}18, 0 4px 16px rgba(0,0,0,0.08)`;
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget;
                      el.style.transform = 'none';
                      el.style.boxShadow = '0 2px 14px rgba(0,0,0,0.06)';
                    }}
                  >
                    {/* Cover thumbnail */}
                    <div
                      className="relative flex flex-col items-center justify-center"
                      style={{
                        height: 136,
                        background: `linear-gradient(135deg, ${res.color}14 0%, ${res.color}28 100%)`,
                        overflow: 'hidden',
                      }}
                    >
                      {/* Decorative circles */}
                      <div
                        style={{
                          position: 'absolute',
                          right: -24,
                          top: -24,
                          width: 96,
                          height: 96,
                          borderRadius: '50%',
                          background: `${res.color}15`,
                        }}
                      />
                      <div
                        style={{
                          position: 'absolute',
                          left: -16,
                          bottom: -20,
                          width: 72,
                          height: 72,
                          borderRadius: '50%',
                          background: `${res.color}10`,
                        }}
                      />

                      {/* Icon */}
                      <div
                        className="relative z-10 flex items-center justify-center rounded-2xl mb-2"
                        style={{
                          width: 56,
                          height: 56,
                          background: `${res.color}20`,
                          border: `1.5px solid ${res.color}35`,
                          backdropFilter: 'blur(8px)',
                        }}
                      >
                        <Icon className="w-7 h-7" style={{ color: res.color }} />
                      </div>

                      {/* Category badge on cover */}
                      <span
                        className="relative z-10 text-[10px] px-2.5 py-0.5 rounded-full font-semibold"
                        style={{
                          background: `${res.color}22`,
                          color: res.color,
                          border: `1px solid ${res.color}35`,
                        }}
                      >
                        {activeResourceTab}
                      </span>
                    </div>

                    {/* Card body */}
                    <div className="p-5">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] text-gray-400">{res.date}</span>
                      </div>
                      <h4
                        className="text-gray-800 leading-snug mb-2 group-hover:text-indigo-600 transition-colors"
                        style={{ fontSize: '0.92rem', fontWeight: 800 }}
                      >
                        {res.title}
                      </h4>
                      <p className="text-gray-400 leading-relaxed mb-3" style={{ fontSize: '0.76rem' }}>
                        {res.desc}
                      </p>
                      <div
                        className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        style={{ color: res.color }}
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span style={{ fontSize: '0.73rem', fontWeight: 600 }}>下载阅读</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

          </div>
        </section>
      </ScrollReveal>

      {/* ══════════════════════════════════════════════════════════
          8. CTA — simplified (修改点4)
      ══════════════════════════════════════════════════════════ */}
      <ScrollReveal>
        <section
          className="relative py-24 px-4 text-center overflow-hidden"
          style={{ background: 'linear-gradient(135deg,#f0f9ff,#eef2ff,#f5f3ff)' }}
        >
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(rgba(99,102,241,0.05) 1px,transparent 1px)', backgroundSize: '28px 28px' }} />
          <div className="absolute top-1/3 left-1/4 w-64 h-64 rounded-full pointer-events-none" style={{ background: 'rgba(99,102,241,0.08)', filter: 'blur(60px)' }} />
          <div className="absolute bottom-1/3 right-1/4 w-56 h-56 rounded-full pointer-events-none" style={{ background: 'rgba(6,182,212,0.07)', filter: 'blur(50px)' }} />

          <div className="relative max-w-3xl mx-auto">
            <h2
              className="text-gray-900 mb-4"
              style={{ fontSize: '2.5rem', fontWeight: 900, lineHeight: 1.2 }}
            >
              准备好构建可信 AI 平台了吗？
            </h2>
            <div className="h-1 w-16 rounded-full mx-auto mb-6" style={{ background: 'linear-gradient(90deg,#6366f1,#06b6d4)' }} />
            <p className="text-gray-500 text-sm mb-10 max-w-md mx-auto leading-relaxed">
              从数据到模型，从系统到服务，玄鉴平台四大能力侧为您提供全生命周期 AI 安全保障
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              {SHOW_HOME_TRIAL_ACTIONS && <Button
                size="lg"
                className="text-white font-semibold px-10 shadow-xl"
                style={{ background: 'linear-gradient(135deg,#6366f1,#4f46e5)', boxShadow: '0 8px 28px rgba(99,102,241,0.32)' }}
                onClick={() => { window.scrollTo(0, 0); navigate('/online-experience'); }}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                试用体验
              </Button>}
              <Button
                size="lg"
                className="font-medium px-10"
                style={{
                  background: 'rgba(255,255,255,0.9)',
                  border: '1.5px solid rgba(99,102,241,0.3)',
                  color: '#4f46e5',
                  backdropFilter: 'blur(8px)',
                }}
                onClick={() => navigate('/about')}
              >
                联系我们
              </Button>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* ── Chat Dialog ── */}
      {SHOW_XUANJIAN_ASSISTANT && showChat && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end', padding: '24px', pointerEvents: 'none' }}>
          <div style={{ width: 420, height: 'min(620px, calc(100vh - 48px))', maxWidth: 'calc(100vw - 48px)', background: '#fff', borderRadius: 20, boxShadow: '0 24px 64px rgba(0,0,0,0.2), 0 4px 16px rgba(0,0,0,0.08)', display: 'flex', flexDirection: 'column', overflow: 'hidden', pointerEvents: 'auto' }}>
            {/* Header */}
            <div style={{ background: 'linear-gradient(135deg,#4f46e5,#6366f1)', padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ color: '#fff', fontWeight: 700, fontSize: 14 }}>玄鉴智能助手</div>
                <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: 11, display: 'flex', alignItems: 'center', gap: 5 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ade80', display: 'inline-block' }} />
                  在线服务中
                </div>
              </div>
              <button onClick={() => setShowChat(false)} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 8, width: 28, height: 28, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <div ref={chatMessagesRef} style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '18px', display: 'flex', flexDirection: 'column', gap: 14, background: '#f8fafc' }}>
              {chatMessages.map((msg, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-end', flexDirection: msg.from === 'user' ? 'row-reverse' : 'row' }}>
                  {msg.from === 'agent' && (
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg,#4f46e5,#6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <MessageCircle style={{ width: 14, height: 14, color: '#fff' }} />
                    </div>
                  )}
                  <div style={{ maxWidth: '78%', padding: '9px 13px', borderRadius: msg.from === 'user' ? '16px 4px 16px 16px' : '4px 16px 16px 16px', background: msg.from === 'user' ? 'linear-gradient(135deg,#4f46e5,#6366f1)' : '#fff', color: msg.from === 'user' ? '#fff' : '#1e293b', fontSize: 13, lineHeight: 1.6, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
                    {msg.text}
                    <div style={{ fontSize: 10, color: msg.from === 'user' ? 'rgba(255,255,255,0.6)' : '#94a3b8', marginTop: 3, textAlign: 'right' }}>{msg.ts}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick replies */}
            <div style={{ padding: '8px 14px', borderTop: '1px solid #f1f5f9', display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {['大模型评测', 'AIGC审核', '大模型备案', '技术接入'].map(q => (
                <button key={q} onClick={() => { setChatInput(q); }}
                  style={{ padding: '4px 10px', border: '1px solid #e2e8f0', borderRadius: 20, background: '#f8fafc', color: '#475569', fontSize: 11, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                  {q}
                </button>
              ))}
            </div>

            {/* Input */}
            <div style={{ padding: '10px 14px', borderTop: '1px solid #f1f5f9', display: 'flex', gap: 8, background: '#fff' }}>
              <input
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendChatMessage()}
                placeholder="输入您的问题…"
                style={{ flex: 1, padding: '8px 12px', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: 13, outline: 'none' }}
              />
              <button
                onClick={sendChatMessage}
                disabled={!chatInput.trim()}
                style={{ width: 36, height: 36, borderRadius: 10, background: chatInput.trim() ? 'linear-gradient(135deg,#4f46e5,#6366f1)' : '#e2e8f0', border: 'none', cursor: chatInput.trim() ? 'pointer' : 'default', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
              >
                <ArrowRight style={{ width: 16, height: 16, color: chatInput.trim() ? '#fff' : '#94a3b8' }} />
              </button>
            </div>

            <div style={{ padding: '8px 14px', background: '#fff', textAlign: 'center', fontSize: 10, color: '#94a3b8', borderTop: '1px solid #f8fafc' }}>
              工作日 9:00–18:00 · 电话 13940451397
            </div>
          </div>
        </div>
      )}

      {/* ── Login / Register Modal (guest trial) ── */}
      {showLoginModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.55)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}
          onClick={() => setShowLoginModal(false)}>
          <div style={{ background: '#fff', borderRadius: 20, padding: '32px 36px', width: 400, boxShadow: '0 24px 64px rgba(0,0,0,0.18)' }} onClick={e => e.stopPropagation()}>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <div style={{ width: 52, height: 52, borderRadius: 16, background: 'linear-gradient(135deg,#4f46e5,#6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', marginBottom: 6 }}>登录后开始试用体验</div>
              <div style={{ fontSize: 13.5, color: '#64748b' }}>创建或登录账号，即可免费体验玄鉴平台全部服务</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <button onClick={() => { setShowLoginModal(false); window.scrollTo(0, 0); navigate('/login', { state: { from: '/online-experience' } }); }}
                style={{ width: '100%', padding: '12px', background: 'linear-gradient(135deg,#4f46e5,#6366f1)', color: '#fff', border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 16px rgba(99,102,241,0.35)' }}>
                登录账号
              </button>
              <button onClick={() => { setShowLoginModal(false); window.scrollTo(0, 0); navigate('/register', { state: { from: '/online-experience' } }); }}
                style={{ width: '100%', padding: '12px', background: '#f8fafc', color: '#374151', border: '1.5px solid #e2e8f0', borderRadius: 12, fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>
                免费注册
              </button>
              <button onClick={() => setShowLoginModal(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: 13, cursor: 'pointer', marginTop: 4 }}>
                稍后再说
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
