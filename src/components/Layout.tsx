import React, { useEffect, useState, useRef } from 'react';
import { GlobalFooter } from './GlobalFooter';
import { ProductContactSection } from './ProductContactSection';
import { GuestGuard } from './GuestGuard';
import { Link, useLocation, useNavigate } from 'react-router';
import { useUser } from '../context/UserContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { toast } from 'sonner';
import {
  ChevronDown, LogOut, Settings, BookOpen, LayoutDashboard,
  Database, BarChart2, Shield, FileText, ChevronRight,
  Sparkles, ExternalLink, Phone, MessageCircle, QrCode,
  ArrowRight, Menu, Bell, UserRound, LockKeyhole, AtSign, Save
} from 'lucide-react';

// ── Type definitions for nested menu ────────────────────────────
interface MenuLeaf {
  label: string;
  desc: string;
  path: string;
  isGroup?: false;
  capabilities?: CapabilityTag[];
}
interface MenuChild {
  label: string;
  path: string;
}
interface MenuGroup {
  label: string;
  desc: string;
  path?: string;   // if present → group header is clickable
  isGroup: true;
  children: MenuChild[];
  capabilities?: CapabilityTag[];
}
type MenuItem = MenuLeaf | MenuGroup;
type CapabilityTag = '可体验' | '可创建任务' | '效果预览';

const SHOW_EXPERIENCE_TAGS = false;

function CapabilityTags({ tags }: { tags?: CapabilityTag[] }) {
  const visibleTags = tags?.filter(tag => tag !== '可体验' || SHOW_EXPERIENCE_TAGS);
  if (!visibleTags?.length) return null;
  return <span className="ml-2 inline-flex shrink-0 gap-1">{visibleTags.map(tag => <span key={tag} className={`rounded-full border px-1.5 py-0.5 text-[9px] font-bold leading-none ${tag === '可体验' ? 'border-sky-200 bg-sky-50 text-sky-600' : tag === '效果预览' ? 'border-emerald-200 bg-emerald-50 text-emerald-600' : 'border-violet-200 bg-violet-50 text-violet-600'}`}>{tag}</span>)}</span>;
}

interface ProductSeries {
  id: string;
  name: string;
  subtitle: string;
  desc: string;
  icon: React.ElementType;
  grad: string;
  accentColor: string;
  badge?: string | null;
  items: MenuItem[];
}

// ── Product matrix data (mega menu) ─────────────────────────────
const PRODUCT_SERIES: ProductSeries[] = [
  {
    id: 'tianyuan',
    name: '数据侧',
    subtitle: '数据侧',
    desc: '数据审查、评测、审核与标识追溯',
    icon: Database,
    grad: 'from-violet-500 to-purple-600',
    accentColor: '#8b5cf6',
    badge: null,
    items: [
      { label: '个人敏感信息审查', desc: '个人数据隐私合规检测与处理', path: '/privacy-data-audit', capabilities: ['可体验'] },
      { label: '数据集安全评测', desc: '训练数据质量、标注与后门风险评测', path: '/model-safety-eval', capabilities: ['可创建任务'] },
      {
        label: 'AIGC内容审核与鉴伪',
        desc: 'AI生成内容审核与真伪鉴别',
        isGroup: true,
        capabilities: ['可体验'],
        children: [
          { label: '文本内容审核与鉴伪', path: '/aigc-content?tab=text' },
          { label: '图像内容审核与鉴伪', path: '/aigc-content?tab=image' },
          { label: '音频内容审核与鉴伪', path: '/aigc-content?tab=audio' },
          { label: '视频内容审核与鉴伪', path: '/aigc-content?tab=video' },
        ],
      },
      { label: 'AIGC内容标识与检测', desc: 'AI生成内容显隐标识与标准验证', path: '/aigc-content-marking' },
    ],
  },
  {
    id: 'tianheng',
    name: '模型侧',
    subtitle: '模型侧',
    desc: '模型性能、可信与安全综合评测',
    icon: BarChart2,
    grad: 'from-blue-500 to-indigo-600',
    accentColor: '#3b82f6',
    badge: null,
    items: [
      { label: '深度模型可信测评', desc: '大模型全面可信度综合评估', path: '/deep-model-eval', capabilities: ['可创建任务'] },
      { label: '智能体安全评测', desc: 'AI智能体行为安全综合评测', path: '/agent-safety', capabilities: ['可创建任务'] },
      { label: '大模型性能评测', desc: '多模态生成与理解能力评测', path: '/llm-evaluation', capabilities: ['可创建任务'] },
      { label: '大模型安全评测', desc: '鲁棒性、隐私、安全与偏见评测', path: '/safety-evaluation', capabilities: ['可创建任务'] },
      { label: '具身智能可信评测', desc: '物理交互场景可信安全评测', path: '/embodied-intelligence' },
    ],
  },
  {
    id: 'tianxun',
    name: '系统侧',
    subtitle: '系统侧',
    desc: 'AI系统层风险检测与防控',
    icon: Shield,
    grad: 'from-cyan-500 to-blue-600',
    accentColor: '#06b6d4',
    badge: null,
    items: [
      { label: '代码漏洞审查', desc: 'AI代码安全扫描与深度审计', path: '/code-vulnerability-audit', capabilities: ['可体验'] },
      { label: '网络渗透测试', desc: 'AI系统网络安全渗透评估', path: '/penetration-test' },
    ],
  },
  {
    id: 'tianche',
    name: '服务侧',
    subtitle: '服务侧',
    desc: 'AI合规政策解读与备案服务',
    icon: FileText,
    grad: 'from-emerald-500 to-teal-600',
    accentColor: '#10b981',
    badge: null,
    items: [
      { label: '人工智能安全教学平台', desc: 'AI安全教育培训解决方案', path: '/ai-safety-edu', capabilities: ['可体验'] },
      { label: '大模型备案服务', desc: '备案全流程咨询与辅助', path: '/model-filing-service', capabilities: ['可体验'] },
      { label: '可信安全标准制定服务', desc: '标准规范文本编制技术支撑', path: '/tianche-standard-service' },
    ],
  },
];

// 功能内容尚在完善时只隐藏导航入口，保留路由与页面代码便于后续恢复。
const SHOW_ONLINE_EXPERIENCE_IN_HEADER = false;
const SHOW_HELP_DOCS_IN_HEADER = false;
const SHOW_DEVELOPER_IN_HEADER = false;
const SECONDARY_NAV: { label: string; path: string; protected?: boolean }[] = [
  ...(SHOW_ONLINE_EXPERIENCE_IN_HEADER ? [{ label: '在线体验', path: '/online-experience' }] : []),
  ...(SHOW_HELP_DOCS_IN_HEADER ? [{ label: '帮助文档', path: '/help-docs' }] : []),
  { label: '资源中心', path: '/resource-center' },
  ...(SHOW_DEVELOPER_IN_HEADER ? [{ label: '开发者中心', path: '/developer' }] : []),
  { label: '关于我们', path: '/about' },
];

const FORMAL_PRODUCT_PATHS = new Set([
  '/products-overview',
  '/privacy-data-audit',
  '/model-safety-eval',
  '/aigc-content',
  '/aigc-content-marking',
  '/deep-model-eval',
  '/embodied-intelligence',
  '/agent-safety',
  '/llm-evaluation',
  '/safety-evaluation',
  '/code-vulnerability-audit',
  '/penetration-test',
  '/ai-safety-edu',
  '/model-filing-service',
  '/tianche-standard-service',
]);

const PRODUCT_CONTACT_NAMES: Record<string, string> = {
  '/privacy-data-audit': '个人敏感信息审查',
  '/model-safety-eval': '数据集安全评测',
  '/aigc-content': 'AIGC内容审核与鉴伪',
  '/aigc-content-marking': 'AIGC内容标识与检测',
  '/deep-model-eval': '深度模型可信测评',
  '/embodied-intelligence': '具身智能可信评测',
  '/agent-safety': '智能体安全评测',
  '/llm-evaluation': '大模型性能评测',
  '/safety-evaluation': '大模型安全评测',
  '/code-vulnerability-audit': '代码漏洞审查',
  '/penetration-test': '网络渗透测试',
  '/ai-safety-edu': '人工智能安全教学平台',
  '/model-filing-service': '大模型备案服务',
  '/tianche-standard-service': '可信安全标准制定服务',
};

// ── Floating Chat Panel ───────────────────────────────────────────
interface ChatMessage {
  from: 'agent' | 'user';
  text: string;
  ts: string;
}

function FloatingChatPanel({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = React.useState<ChatMessage[]>([
    { from: 'agent' as const, text: '您好！我是玄鉴智能助手，很高兴为您服务 😊', ts: '刚刚' },
    { from: 'agent' as const, text: '请问您想了解哪方面的内容？', ts: '刚刚' },
  ]);
  const [input, setInput] = React.useState('');
  const messagesRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const container = messagesRef.current;
      if (container) container.scrollTop = container.scrollHeight;
    });
    return () => window.cancelAnimationFrame(frame);
  }, [messages]);

  const send = () => {
    if (!input.trim()) return;
    setMessages(p => [...p, { from: 'user', text: input.trim(), ts: '刚刚' }]);
    setInput('');
    setTimeout(() => setMessages(p => [...p, { from: 'agent', text: '感谢留言！专属顾问将在工作时间内尽快回复您，或拨打 13940451397。', ts: '刚刚' }]), 800);
  };
  return (
    <div style={{ position: 'fixed', bottom: 24, right: 92, width: 420, height: 'min(620px, calc(100vh - 48px))', maxWidth: 'calc(100vw - 112px)', background: '#fff', borderRadius: 20, boxShadow: '0 24px 70px rgba(15,23,42,0.22)', overflow: 'hidden', zIndex: 9998, display: 'flex', flexDirection: 'column', border: '1px solid #e5eaf1' }}>
      <div style={{ background: 'linear-gradient(135deg,#4f46e5,#6366f1)', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <MessageCircle className="w-4 h-4 text-white" />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ color: '#fff', fontWeight: 700, fontSize: 13 }}>玄鉴智能助手</div>
          <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11 }}>● 在线服务中</div>
        </div>
        <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 6, width: 26, height: 26, cursor: 'pointer', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          ✕
        </button>
      </div>
      <div ref={messagesRef} style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: 16, background: '#f8fafc', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: 'flex', gap: 8, flexDirection: m.from === 'user' ? 'row-reverse' : 'row', alignItems: 'flex-end' }}>
            {m.from === 'agent' && <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'linear-gradient(135deg,#4f46e5,#6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><MessageCircle className="w-3 h-3 text-white" /></div>}
            <div style={{ maxWidth: '80%', padding: '8px 12px', borderRadius: m.from === 'user' ? '14px 3px 14px 14px' : '3px 14px 14px 14px', background: m.from === 'user' ? '#4f46e5' : '#fff', color: m.from === 'user' ? '#fff' : '#1e293b', fontSize: 12.5, lineHeight: 1.6, boxShadow: '0 1px 3px rgba(0,0,0,0.07)' }}>{m.text}</div>
          </div>
        ))}
      </div>
      <div style={{ padding: '8px 12px', borderTop: '1px solid #f1f5f9', display: 'flex', gap: 8, background: '#fff' }}>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()}
          placeholder="输入问题…" style={{ flex: 1, padding: '7px 11px', border: '1.5px solid #e2e8f0', borderRadius: 9, fontSize: 12.5, outline: 'none' }} />
        <button onClick={send} disabled={!input.trim()}
          style={{ width: 32, height: 32, borderRadius: 9, background: input.trim() ? '#4f46e5' : '#e2e8f0', border: 'none', cursor: input.trim() ? 'pointer' : 'default', color: input.trim() ? '#fff' : '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>→</button>
      </div>
    </div>
  );
}

// ── Floating Contact Widget ──────────────────────────────────────
function FloatingContact({ showOnlineConsultation = true }: { showOnlineConsultation?: boolean }) {
  const [hovered, setHovered] = useState<string | null>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const hoverCloseTimer = useRef<number | null>(null);

  const keepContactOpen = (id: string) => {
    if (hoverCloseTimer.current !== null) window.clearTimeout(hoverCloseTimer.current);
    hoverCloseTimer.current = null;
    setHovered(id);
  };

  const scheduleContactClose = () => {
    if (hoverCloseTimer.current !== null) window.clearTimeout(hoverCloseTimer.current);
    hoverCloseTimer.current = window.setTimeout(() => {
      setHovered(null);
      hoverCloseTimer.current = null;
    }, 160);
  };

  useEffect(() => () => {
    if (hoverCloseTimer.current !== null) window.clearTimeout(hoverCloseTimer.current);
  }, []);

  const contacts = [
    {
      id: 'phone',
      icon: Phone,
      label: '电话咨询',
      color: '#2563eb',
      hoverColor: '#1d4ed8',
      tooltip: (
        <div className="p-4 w-44">
          <div className="font-bold text-gray-800 text-sm mb-1.5">电话咨询</div>
          <div className="text-blue-600 font-mono font-bold text-base">13940451397</div>
          <div className="text-gray-400 text-xs mt-1.5">工作日 9:00 – 18:00</div>
          <div className="text-gray-400 text-xs">节假日 10:00 – 17:00</div>
        </div>
      ),
    },
    {
      id: 'chat',
      icon: MessageCircle,
      label: '在线咨询',
      color: '#4f46e5',
      hoverColor: '#4338ca',
      tooltip: (
        <div className="p-4 w-44">
          <div className="font-bold text-gray-800 text-sm mb-1.5">在线咨询</div>
          <div className="text-gray-600 text-xs leading-relaxed">
            专属客服为您提供 1 对 1 实时在线咨询服务
          </div>
        </div>
      ),
    },
    {
      id: 'wechat',
      icon: QrCode,
      label: '微信咨询',
      color: '#16a34a',
      hoverColor: '#15803d',
      tooltip: (
        <div className="p-4 w-44">
          <div className="font-bold text-gray-800 text-sm mb-2">微信扫码咨询</div>
          <div
            className="w-32 h-32 rounded-xl flex items-center justify-center mx-auto mb-2"
            style={{ background: '#f1f5f9' }}
          >
            <QrCode className="w-16 h-16 text-gray-400" />
          </div>
          <div className="text-gray-400 text-[11px] text-center">扫一扫添加专属顾问微信</div>
        </div>
      ),
    },
  ].filter(item => showOnlineConsultation || item.id !== 'chat');

  return (
    <>
    <div
      className="fixed z-40 hidden md:flex flex-col"
      style={{ right: 0, top: '50%', transform: 'translateY(-50%)' }}
    >
      {contacts.map((c, i) => {
        const Icon = c.icon;
        const isHovered = hovered === c.id;
        return (
          <div
            key={c.id}
            className="relative"
            onMouseEnter={() => keepContactOpen(c.id)}
            onMouseLeave={scheduleContactClose}
          >
            {/* Button */}
            <button
              className="flex flex-col items-center justify-center gap-1.5 transition-all duration-200 rs-focus-ring"
              style={{
                width: 68,
                height: 64,
                background: isHovered ? c.hoverColor : c.color,
                borderTopLeftRadius: i === 0 ? 10 : 0,
                borderBottomLeftRadius: i === contacts.length - 1 ? 10 : 0,
                borderBottom: i < contacts.length - 1 ? '1px solid rgba(255,255,255,0.2)' : 'none',
              }}
              onClick={() => { if (c.id === 'chat') setChatOpen(true); }}
            >
              <Icon className="w-5 h-5 text-white" />
              <span className="text-white leading-tight whitespace-nowrap" style={{ fontSize: 11 }}>
                {c.label}
              </span>
            </button>

            {/* Tooltip card */}
            <div
              className="absolute top-0 rounded-xl transition-all duration-200"
              onMouseEnter={() => keepContactOpen(c.id)}
              onMouseLeave={scheduleContactClose}
              style={{
                right: 76,
                background: 'rgba(255,255,255,0.98)',
                backdropFilter: 'blur(12px)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.15), 0 2px 8px rgba(0,0,0,0.08)',
                border: '1px solid rgba(226,232,240,0.8)',
                opacity: isHovered ? 1 : 0,
                transform: isHovered ? 'translateX(0)' : 'translateX(8px)',
                pointerEvents: isHovered ? 'auto' : 'none',
                userSelect: 'text',
              }}
            >
              <span className="absolute -right-2 top-0 h-full w-2" aria-hidden="true" />
              {c.tooltip}
            </div>
          </div>
        );
      })}
    </div>
    {chatOpen && <FloatingChatPanel onClose={() => setChatOpen(false)} />}
    </>
  );
}

// ── Sub-navigation (product-level breadcrumb + sibling pages) ────
// 两个大模型评测产品已作为一级产品独立展示，保留配置但关闭页内重复切换条。
const TIANHENG_PATHS: string[] = [];
const TIANHENG_ITEMS = [
  { label: '大模型性能评测', path: '/llm-evaluation' },
  { label: '大模型安全评测', path: '/safety-evaluation' },
];
// ── Breadcrumb config ─────────────────────────────────────────────
interface BreadcrumbCrumb { label: string; path?: string }

const BREADCRUMB_MAP: Record<string, BreadcrumbCrumb[]> = {
  // 产品矩阵
  '/products-overview':       [{ label: '首页', path: '/' }, { label: '产品矩阵' }],
  // 数据侧
  '/products/tianyuan':       [{ label: '首页', path: '/' }, { label: '产品矩阵', path: '/products-overview' }, { label: '数据侧' }],
  '/model-safety-eval':       [{ label: '首页', path: '/' }, { label: '产品矩阵', path: '/products-overview' }, { label: '数据侧' }, { label: '数据集安全评测' }],
  '/aigc-content':            [{ label: '首页', path: '/' }, { label: '产品矩阵', path: '/products-overview' }, { label: '数据侧' }, { label: 'AIGC内容审核与鉴伪' }],
  '/aigc-content-marking':    [{ label: '首页', path: '/' }, { label: '产品矩阵', path: '/products-overview' }, { label: '数据侧' }, { label: 'AIGC内容标识与检测' }],
  '/privacy-data-audit':      [{ label: '首页', path: '/' }, { label: '产品矩阵', path: '/products-overview' }, { label: '数据侧' }, { label: '个人敏感信息审查' }],
  // 模型侧
  '/products/tianheng':       [{ label: '首页', path: '/' }, { label: '产品矩阵', path: '/products-overview' }, { label: '模型侧' }],
  '/deep-model-eval':         [{ label: '首页', path: '/' }, { label: '产品矩阵', path: '/products-overview' }, { label: '模型侧', path: '/products/tianheng' }, { label: '深度模型可信测评' }],
  '/embodied-intelligence':   [{ label: '首页', path: '/' }, { label: '产品矩阵', path: '/products-overview' }, { label: '模型侧', path: '/products/tianheng' }, { label: '具身智能可信评测' }],
  '/llm-evaluation':          [{ label: '首页', path: '/' }, { label: '产品矩阵', path: '/products-overview' }, { label: '模型侧', path: '/products/tianheng' }, { label: '大模型性能评测' }],
  '/safety-evaluation':       [{ label: '首页', path: '/' }, { label: '产品矩阵', path: '/products-overview' }, { label: '模型侧', path: '/products/tianheng' }, { label: '大模型安全评测' }],
  '/agent-safety':            [{ label: '首页', path: '/' }, { label: '产品矩阵', path: '/products-overview' }, { label: '模型侧', path: '/products/tianheng' }, { label: '智能体安全评测' }],
  '/training-eval':           [{ label: '首页', path: '/' }, { label: '产品矩阵', path: '/products-overview' }, { label: '模型侧', path: '/products/tianheng' }, { label: '训练集评测' }],
  '/testset-generation':      [{ label: '首页', path: '/' }, { label: '产品矩阵', path: '/products-overview' }, { label: '模型侧', path: '/products/tianheng' }, { label: '测试集生成' }],
  '/leaderboard':             [{ label: '首页', path: '/' }, { label: '产品矩阵', path: '/products-overview' }, { label: '模型侧', path: '/products/tianheng' }, { label: '排行榜' }],
  '/evaluation-intro':        [{ label: '首页', path: '/' }, { label: '产品矩阵', path: '/products-overview' }, { label: '模型侧', path: '/products/tianheng' }, { label: '评测介绍' }],
  // 系统侧
  '/products/tianjian':       [{ label: '首页', path: '/' }, { label: '产品矩阵', path: '/products-overview' }, { label: '系统侧' }],
  '/code-vulnerability-audit':[{ label: '首页', path: '/' }, { label: '产品矩阵', path: '/products-overview' }, { label: '系统侧', path: '/products/tianjian' }, { label: '代码漏洞审查' }],
  '/penetration-test':        [{ label: '首页', path: '/' }, { label: '产品矩阵', path: '/products-overview' }, { label: '系统侧', path: '/products/tianjian' }, { label: '网络渗透测试' }],
  // 服务侧
  '/products/tianche':        [{ label: '首页', path: '/' }, { label: '产品矩阵', path: '/products-overview' }, { label: '合规治理侧' }],
  '/ai-safety-edu':           [{ label: '首页', path: '/' }, { label: '产品矩阵', path: '/products-overview' }, { label: '合规治理侧', path: '/products/tianche' }, { label: '人工智能安全教学平台' }],
  '/model-filing-service':    [{ label: '首页', path: '/' }, { label: '产品矩阵', path: '/products-overview' }, { label: '合规治理侧', path: '/products/tianche' }, { label: '大模型备案服务' }],
  '/tianche-standard-service':[{ label: '首页', path: '/' }, { label: '产品矩阵', path: '/products-overview' }, { label: '合规治理侧', path: '/products/tianche' }, { label: '可信安全标准制定服务' }],
  // 其他顶级页
  '/help-docs':               [{ label: '首页', path: '/' }, { label: '帮助文档' }],
  '/about':                   [{ label: '首页', path: '/' }, { label: '关于我们' }],
  '/resource-center':         [{ label: '首页', path: '/' }, { label: '资源中心' }],
};

function PageBreadcrumb() {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;

  // Dynamic route: /products/:seriesId
  let crumbs: BreadcrumbCrumb[] | undefined = BREADCRUMB_MAP[path];
  if (!crumbs && path.startsWith('/products/')) {
    const seriesId = path.split('/')[2];
    const sideMap: Record<string, string> = {
      tianyuan: '数据侧', tianheng: '模型侧', tianjian: '系统侧', tianche: '合规治理侧',
    };
    const side = sideMap[seriesId];
    if (side) crumbs = [{ label: '首页', path: '/' }, { label: '产品矩阵', path: '/products-overview' }, { label: side }];
  }
  if (!crumbs || crumbs.length < 2) return null;

  return (
    <div
      data-breadcrumb
      className="sticky z-[42]"
      style={{
        top: 76,
        background: '#ffffff',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(226,232,240,0.7)',
        boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
      }}
    >
      <div
        className="max-w-[1400px] mx-auto px-6 flex items-center"
        style={{ height: 44, gap: 10 }}
      >
        {crumbs.map((crumb, i) => {
          const isFirst = i === 0;          // 首页 — only clickable item
          const isLast  = i === crumbs!.length - 1;
          return (
            <React.Fragment key={i}>
              {i > 0 && (
                <span style={{ color: '#aaa', fontSize: 14, lineHeight: 1, userSelect: 'none', flexShrink: 0 }}>›</span>
              )}

              {/* 仅首页可点击 */}
              {isFirst ? (
                <button
                  onClick={() => navigate('/')}
                  style={{
                    background: 'none', border: 'none', padding: 0,
                    fontSize: 14, fontWeight: 500,
                    color: '#2563eb',
                    textDecoration: 'underline',
                    textUnderlineOffset: 3,
                    cursor: 'pointer',
                    flexShrink: 0,
                    lineHeight: 1,
                  }}
                >
                  {crumb.label}
                </button>
              ) : (
                /* 其余层级：纯文本，不可点击 */
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: isLast ? 600 : 400,
                    color: isLast ? '#1e293b' : '#6b7280',
                    cursor: 'default',
                    userSelect: 'none',
                    flexShrink: 0,
                    lineHeight: 1,
                  }}
                >
                  {crumb.label}
                </span>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

function SubNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;

  const isTianheng = TIANHENG_PATHS.includes(path);
  if (!isTianheng) return null;

  const baseStyle: React.CSSProperties = {
    top: 120, // 76px header + 44px breadcrumb
    background: '#ffffff',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    borderBottom: '1px solid rgba(226,232,240,0.8)',
    boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
    zIndex: 40,
  };

  return (
    <div data-layout-subnav className="sticky" style={baseStyle}>
      <div className="max-w-[1400px] mx-auto px-6 h-[52px] flex items-center gap-5">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 shrink-0">
          <div
            className="w-5 h-5 rounded flex items-center justify-center shrink-0"
            style={{
              background: 'linear-gradient(135deg,#3b82f6,#6366f1)',
            }}
          >
            <BarChart2 className="w-3 h-3 text-white" />
          </div>
          <span className="text-sm text-gray-500 font-medium">玄鉴</span>
          <span className="text-gray-200 text-sm">/</span>
          <span
            className="text-sm font-semibold"
            style={{ color: '#3b82f6' }}
          >
            模型评测
          </span>
        </div>

        <div className="w-px h-4 bg-gray-200 shrink-0" />

        {/* Navigation items */}
        <div className="flex items-center gap-0.5 overflow-x-auto">
            {TIANHENG_ITEMS.map((item) => {
              const isActive = path === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className="px-4 py-1.5 rounded-full text-sm font-semibold transition-all whitespace-nowrap"
                  style={{
                    background: isActive ? '#3b82f6' : 'transparent',
                    color: isActive ? '#fff' : '#64748b',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      (e.currentTarget as HTMLElement).style.background = 'rgba(59,130,246,0.08)';
                      (e.currentTarget as HTMLElement).style.color = '#3b82f6';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      (e.currentTarget as HTMLElement).style.background = 'transparent';
                      (e.currentTarget as HTMLElement).style.color = '#64748b';
                    }
                  }}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
      </div>
    </div>
  );
}

// ── Mega Menu Item Renderers ─────────────────────────────────────
function LeafItemRow({
  item, onNavigate, accentColor,
}: {
  item: MenuLeaf;
  onNavigate: (path: string) => void;
  accentColor: string;
}) {
  const [hov, setHov] = useState(false);
  return (
    <div
      className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-200 select-none"
      style={{
        background: hov ? `${accentColor}0d` : 'transparent',
        transform: hov ? 'translateX(3px)' : 'translateX(0)',
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={() => onNavigate(item.path)}
    >
      <div
        className="w-8 h-8 rounded-lg shrink-0 flex items-center justify-center"
        style={{
          color: accentColor,
          background: `${accentColor}12`,
          border: `1px solid ${accentColor}20`,
        }}
      >
        <span className="w-2 h-2 rounded-sm" style={{ background: accentColor, boxShadow: `5px 5px 0 ${accentColor}55` }} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center text-[14px] font-semibold leading-5" style={{ color: hov ? accentColor : '#1e293b' }}><span className="truncate">{item.label}</span><CapabilityTags tags={item.capabilities} /></div>
        <div className="text-[12px] mt-1 leading-5 truncate" style={{ color: '#8492a6' }}>{item.desc}</div>
      </div>
      <ChevronRight className="w-4 h-4 shrink-0" style={{ color: hov ? accentColor : '#cbd5e1' }} />
    </div>
  );
}

function GroupItemBlock({
  item, onNavigate, accentColor, expanded, onToggle,
}: {
  item: MenuGroup;
  onNavigate: (path: string) => void;
  accentColor: string;
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="relative">
      {/* Group header */}
      <button
        type="button"
        className="w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 select-none text-left"
        style={{
          background: expanded ? `${accentColor}0d` : 'transparent',
          transform: expanded ? 'translateX(3px)' : 'translateX(0)',
        }}
        aria-expanded={expanded}
        onClick={onToggle}
      >
        <div
          className="w-8 h-8 rounded-lg shrink-0 flex items-center justify-center"
          style={{ color: accentColor, background: `${accentColor}12`, border: `1px solid ${accentColor}20` }}
        >
          <span className="w-2 h-2 rounded-sm" style={{ background: accentColor, boxShadow: `5px 5px 0 ${accentColor}55` }} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center text-[14px] font-semibold leading-5" style={{ color: expanded ? accentColor : '#1e293b' }}><span className="truncate">{item.label}</span><CapabilityTags tags={item.capabilities} /></div>
          <div className="text-[12px] mt-1 leading-5 truncate" style={{ color: '#8492a6' }}>{item.desc}</div>
        </div>
        <ChevronDown
          className="w-4 h-4 shrink-0 transition-transform duration-300"
          style={{ color: expanded ? accentColor : '#cbd5e1', transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
        />
      </button>

      <div className={`grid transition-[grid-template-rows,opacity] duration-300 ${expanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
        <div className="overflow-hidden">
          <div className="mx-2 mb-2 mt-1 flex flex-col gap-1 rounded-xl border border-slate-200 bg-white p-2 shadow-sm">
          <div className="px-2 pb-1 text-[11px] font-black text-slate-500">选择内容模态</div>
          {item.children.map((child) => (
            <ChildRow key={child.label} child={child} accentColor={accentColor} onNavigate={onNavigate} />
          ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ChildRow({
  child, accentColor, onNavigate,
}: {
  child: MenuChild;
  accentColor: string;
  onNavigate: (path: string) => void;
}) {
  const [hov, setHov] = useState(false);
  return (
    <button
      type="button"
      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left transition-all duration-150 select-none"
      style={{ background: hov ? `${accentColor}0d` : 'transparent' }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={() => onNavigate(child.path)}
    >
      <span
        className="w-1 h-1 rounded-full shrink-0"
        style={{ background: hov ? accentColor : '#cbd5e1' }}
      />
      <span className="text-[13px] leading-5" style={{ color: hov ? accentColor : '#475569' }}>{child.label}</span>
    </button>
  );
}

// ── Layout ───────────────────────────────────────────────────────
export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isGuest, logout, unreadCount, updateAccount, changePassword } = useUser();
  const maskedAccount = /^1\d{10}$/.test(user.email)
    ? `${user.email.slice(0, 3)}****${user.email.slice(-4)}`
    : user.email.includes('@')
      ? `${user.email.slice(0, 1)}***@${user.email.split('@')[1]}`
      : user.email;

  const [megaOpen, setMegaOpen] = useState(false);
  const [expandedMenuGroup, setExpandedMenuGroup] = useState<string | null>(null);
  const [showExperienceGuard, setShowExperienceGuard] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [accountName, setAccountName] = useState(user.name);
  const [accountEmail, setAccountEmail] = useState(user.email);
  const [notificationPreference, setNotificationPreference] = useState<'site' | 'contact' | 'both'>(user.notificationPreference || 'both');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [accountSaving, setAccountSaving] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const titleMap: Record<string, string> = {
      '/': '玄鉴 AI安全与评测平台｜榕数科技',
      '/help-docs': '帮助文档｜玄鉴 AI安全与评测平台',
      '/resource-center': '资源中心｜玄鉴 AI安全与评测平台',
      '/about': '关于榕数｜玄鉴 AI安全与评测平台',
      '/online-experience': '在线体验｜玄鉴 AI安全与评测平台',
      '/products-overview': '产品矩阵｜玄鉴 AI安全与评测平台',
      '/privacy-data-audit': '个人敏感信息审查｜玄鉴',
      '/model-safety-eval': '数据集安全评测｜玄鉴',
      '/aigc-content': 'AIGC内容审核与鉴伪｜玄鉴',
      '/aigc-content-marking': 'AIGC内容标识与检测｜玄鉴',
      '/deep-model-eval': '深度模型可信测评｜玄鉴',
      '/embodied-intelligence': '具身智能可信评测｜玄鉴',
      '/agent-safety': '智能体安全评测｜玄鉴',
      '/llm-evaluation': '大模型性能评测｜玄鉴',
      '/safety-evaluation': '大模型安全评测｜玄鉴',
      '/code-vulnerability-audit': '代码漏洞审查｜玄鉴',
      '/penetration-test': '网络渗透测试｜玄鉴',
      '/ai-safety-edu': '人工智能安全教学平台｜玄鉴',
      '/model-filing-service': '大模型备案服务｜玄鉴',
      '/tianche-standard-service': '可信安全标准制定服务｜玄鉴',
    };
    document.title = location.pathname.startsWith('/help-docs/')
      ? '帮助文档｜玄鉴 AI安全与评测平台'
      : titleMap[location.pathname] || '玄鉴 AI安全与评测平台｜榕数科技';
  }, [location.pathname]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [location.pathname, location.search]);

  const openMega = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setMegaOpen(true);
  };
  const scheduleMegaClose = () => {
    closeTimer.current = setTimeout(() => {
      setMegaOpen(false);
      setExpandedMenuGroup(null);
    }, 180);
  };
  const handleNavigate = (path: string) => {
    setMegaOpen(false);
    setExpandedMenuGroup(null);
    navigate(path);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const openAccountSettings = () => {
    setAccountName(user.name);
    setAccountEmail(user.email);
    setNotificationPreference(user.notificationPreference || 'both');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setAccountOpen(true);
  };

  const saveAccountProfile = async () => {
    setAccountSaving(true);
    const result = await updateAccount({ name: accountName, email: accountEmail, notificationPreference });
    setAccountSaving(false);
    if (!result.ok) return toast.error(result.message || '账户信息保存失败');
    toast.success('账户信息已保存');
  };

  const saveNewPassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) return toast.error('请完整填写密码信息');
    if (newPassword !== confirmPassword) return toast.error('两次输入的新密码不一致');
    setAccountSaving(true);
    const result = await changePassword(currentPassword, newPassword);
    setAccountSaving(false);
    if (!result.ok) return toast.error(result.message || '密码修改失败');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    toast.success('密码修改成功，下次登录请使用新密码');
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#ffffff' }}>

      {/* ─── Global Nav ─────────────────────────────────────────── */}
      <header
        className="sticky top-0 z-50 relative"
        style={{
          background: 'rgba(255,255,255,0.97)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(0,0,0,0.08)',
          boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
        }}
      >
        <div className="mx-auto h-[76px] w-full max-w-none px-8 flex items-center justify-between gap-5">

          {/* ── Logo ─────────────────────────────────────────────── */}
          <Link
            to="/"
            className="flex items-center shrink-0"
            onClick={() => setMegaOpen(false)}
          >
            <img
              src="/rongsu-logo.png"
              alt="榕数科技"
              style={{ width: 174, height: 50, objectFit: 'contain', objectPosition: 'left center', display: 'block' }}
            />
          </Link>

          {/* ── Center Nav ─────────────────────────────────────── */}
          <nav className="hidden lg:flex items-center gap-1 flex-1 justify-center">
            <Link
              to="/"
              className="px-4 py-2.5 rounded-lg text-[15px] font-medium transition-all duration-200"
              style={{
                color: location.pathname === '/' ? '#1e40af' : '#374151',
                background: location.pathname === '/' ? 'rgba(37,99,235,0.07)' : 'transparent',
              }}
              onClick={() => setMegaOpen(false)}
            >
              首页
            </Link>
            {/* 产品 trigger */}
            <div
              className="relative"
              onMouseEnter={openMega}
              onMouseLeave={scheduleMegaClose}
            >
              <button
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-[15px] font-semibold transition-all duration-200"
                style={{
                  color: megaOpen ? '#1e40af' : '#374151',
                  background: megaOpen ? 'rgba(37,99,235,0.07)' : 'transparent',
                }}
                aria-haspopup="true"
                aria-expanded={megaOpen}
                onFocus={openMega}
                onClick={() => setMegaOpen(open => !open)}
              >
                产品
                <ChevronDown
                  className="w-4 h-4 transition-transform duration-300"
                  style={{ transform: megaOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                />
              </button>
            </div>

            {/* Other nav items */}
            {SECONDARY_NAV.map((item) => {
              const isActive = location.pathname === item.path ||
                (item.path !== '/' && location.pathname.startsWith(item.path));
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  target={item.protected ? '_blank' : undefined}
                  rel={item.protected ? 'noopener noreferrer' : undefined}
                  className="px-4 py-2.5 rounded-lg text-[15px] font-medium transition-all duration-200"
                  style={{
                    color: isActive ? '#1e40af' : '#374151',
                    background: isActive ? 'rgba(37,99,235,0.07)' : 'transparent',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.color = '#1e40af';
                    (e.currentTarget as HTMLElement).style.background = 'rgba(37,99,235,0.05)';
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      (e.currentTarget as HTMLElement).style.color = '#374151';
                      (e.currentTarget as HTMLElement).style.background = 'transparent';
                    }
                  }}
                  onClick={(e) => {
                    if (item.protected && isGuest) {
                      e.preventDefault();
                      setMegaOpen(false);
                      setShowExperienceGuard(true);
                    }
                  }}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="lg:hidden ml-auto inline-flex h-10 items-center gap-2 rounded-lg border border-slate-200 px-3 text-sm font-semibold text-slate-700">
                <Menu className="h-4 w-4" />菜单
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuItem onClick={() => navigate('/')}>首页</DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/products-overview')}>产品矩阵</DropdownMenuItem>
              {SECONDARY_NAV.map(item => (
                <DropdownMenuItem key={item.path} onClick={() => navigate(item.path)}>
                  {item.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* ── Right: User Area ────────────────────────────────── */}
          <div className="hidden sm:flex items-center gap-2.5 shrink-0 ml-auto" style={{ position: 'relative', zIndex: 20 }}>
            {isGuest ? (
              <>
                <Button
                  variant="outline"
                  className="text-[15px] h-10 px-5 font-medium"
                  style={{ borderColor: 'rgba(0,0,0,0.2)', color: '#374151', background: 'transparent' }}
                  onClick={() => navigate('/login')}
                >
                  登录
                </Button>
                <Button
                  className="text-[15px] h-10 px-6 font-semibold bg-blue-600 hover:bg-blue-500 text-white"
                  onClick={() => navigate('/register')}
                >
                  注册
                </Button>
              </>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="relative flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                    <Avatar className="w-7 h-7">
                      <AvatarFallback className="bg-blue-600 text-white text-xs">
                        {user.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-gray-700">{user.name}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                    {unreadCount > 0 && <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white ring-2 ring-white">{unreadCount > 9 ? '9+' : unreadCount}</span>}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-44">
                  <div className="px-2 py-2.5">
                    <div className="truncate text-sm font-semibold text-slate-800">{user.name}</div>
                    {maskedAccount && <div className="mt-0.5 truncate text-xs text-slate-400">{maskedAccount}</div>}
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/resource-center')}>
                    <LayoutDashboard className="w-4 h-4 mr-2" />我的任务与报告
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/resource-center?tab=messages')}>
                    <Bell className="w-4 h-4 mr-2" />消息通知
                    {unreadCount > 0 && <span className="ml-auto rounded-full bg-red-500 px-1.5 py-0.5 text-[10px] font-bold text-white">{unreadCount}</span>}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/resource-center?tab=models')}>
                    <BookOpen className="w-4 h-4 mr-2" />模型 API 配置
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={openAccountSettings}>
                    <Settings className="w-4 h-4 mr-2" />账户设置
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-500">
                    <LogOut className="w-4 h-4 mr-2" />退出登录
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>

        {/* ─── Mega Menu (修改点2：light bg + 修改点3：nested structure) ── */}
        <div
          className={`absolute left-0 right-0 top-full z-50 ${megaOpen ? 'overflow-visible' : 'overflow-hidden'}`}
          style={{
            maxHeight: megaOpen ? '720px' : '0px',
            opacity: megaOpen ? 1 : 0,
            pointerEvents: megaOpen ? 'auto' : 'none',
            transform: megaOpen ? 'translateY(0)' : 'translateY(-12px)',
            transition: 'max-height 420ms cubic-bezier(0.16,1,0.3,1), opacity 240ms ease, transform 360ms cubic-bezier(0.16,1,0.3,1)',
          }}
          onMouseEnter={openMega}
          onMouseLeave={scheduleMegaClose}
        >
          {/* ── Light glass panel (修改点2) ── */}
          <div
            style={{
              background: 'rgba(255,255,255,0.985)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              borderTop: '1px solid rgba(226,232,240,0.8)',
              borderBottom: '1px solid rgba(226,232,240,0.6)',
              boxShadow: '0 28px 70px rgba(15,23,42,0.14), 0 6px 18px rgba(15,23,42,0.06)',
            }}
          >
            <div className="max-w-[1480px] mx-auto px-8 py-7">
              {/* 4-column grid */}
              <div className="grid grid-cols-4 gap-5">
                {PRODUCT_SERIES.map((series, seriesIndex) => {
                  const Icon = series.icon;
                  return (
                    <div
                      key={series.id}
                      className="flex flex-col min-w-0 rounded-2xl border border-slate-100 bg-slate-50/55 px-4 py-4"
                      style={{
                        opacity: megaOpen ? 1 : 0,
                        transform: megaOpen ? 'translateY(0)' : 'translateY(-8px)',
                        transition: `opacity 280ms ease ${80 + seriesIndex * 55}ms, transform 360ms cubic-bezier(0.16,1,0.3,1) ${80 + seriesIndex * 55}ms`,
                      }}
                    >
                      {/* Series header */}
                      <div
                        className="flex items-center gap-3 mb-3 pb-4"
                        style={{ borderBottom: `1px solid rgba(226,232,240,0.7)` }}
                      >
                        <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${series.grad} flex items-center justify-center shrink-0 shadow-sm`}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-bold text-[17px] text-slate-900">{series.subtitle}</span>
                          </div>
                          <p className="text-[12px] text-slate-400 mt-1 truncate">{series.desc}</p>
                        </div>
                      </div>

                      {/* Items */}
                      <div className="flex flex-col gap-0.5 flex-1">
                        {series.items.map((item, idx) =>
                          'children' in item ? (
                            <GroupItemBlock
                              key={idx}
                              item={item}
                              accentColor={series.accentColor}
                              onNavigate={handleNavigate}
                              expanded={expandedMenuGroup === `${series.id}-${idx}`}
                              onToggle={() => setExpandedMenuGroup(current => current === `${series.id}-${idx}` ? null : `${series.id}-${idx}`)}
                            />
                          ) : (
                            <LeafItemRow
                              key={idx}
                              item={item}
                              accentColor={series.accentColor}
                              onNavigate={handleNavigate}
                            />
                          )
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          </div>
        </div>
      </header>

      <PageBreadcrumb />
      <SubNav />
      <GuestGuard
        open={showExperienceGuard}
        onClose={() => setShowExperienceGuard(false)}
        action="使用在线体验"
      />

      <Dialog open={accountOpen} onOpenChange={setAccountOpen}>
        <DialogContent className="max-h-[88vh] max-w-2xl overflow-y-auto p-0">
          <DialogHeader className="border-b bg-gradient-to-r from-blue-50 to-white px-7 py-6">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white"><UserRound className="h-5 w-5" /></div>
              <div><DialogTitle className="text-xl">账户设置</DialogTitle><p className="mt-1 text-sm text-slate-500">管理登录账号、安全设置与任务通知方式</p></div>
            </div>
          </DialogHeader>
          <div className="space-y-7 px-7 pb-7">
            <section className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-black text-slate-900"><UserRound className="h-4 w-4 text-blue-600" />基本信息</div>
              <div className="rounded-xl bg-slate-50 px-4 py-3 text-xs text-slate-500"><span className="font-semibold text-slate-700">用户编号：</span>{user.id}<span className="mx-3 text-slate-300">|</span><span className="font-semibold text-slate-700">账号类型：</span>普通用户</div>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-2 text-sm font-semibold text-slate-700"><span>显示名称</span><input value={accountName} onChange={event => setAccountName(event.target.value)} maxLength={30} className="h-11 w-full rounded-xl border border-slate-200 px-3 font-normal outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50" /></label>
                <label className="space-y-2 text-sm font-semibold text-slate-700"><span>登录手机号／邮箱</span><div className="relative"><AtSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input value={accountEmail} onChange={event => setAccountEmail(event.target.value)} className="h-11 w-full rounded-xl border border-slate-200 pl-10 pr-3 font-normal outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50" /></div></label>
              </div>
              <label className="block space-y-2 text-sm font-semibold text-slate-700"><span>任务通知方式</span><select value={notificationPreference} onChange={event => setNotificationPreference(event.target.value as 'site' | 'contact' | 'both')} className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 font-normal outline-none focus:border-blue-500"><option value="site">仅站内消息</option><option value="contact">仅登录手机号／邮箱</option><option value="both">站内消息＋登录手机号／邮箱</option></select><span className="block text-xs font-normal leading-5 text-slate-400">外部短信或邮件通知将在后端通知服务接入后正式启用。</span></label>
              <div className="flex justify-end"><Button onClick={saveAccountProfile} disabled={accountSaving} className="bg-blue-600"><Save className="mr-2 h-4 w-4" />保存账户信息</Button></div>
            </section>
            <section className="space-y-4 border-t pt-6">
              <div className="flex items-center gap-2 text-sm font-black text-slate-900"><LockKeyhole className="h-4 w-4 text-blue-600" />修改密码</div>
              <div className="grid gap-3 sm:grid-cols-3"><input type="password" value={currentPassword} onChange={event => setCurrentPassword(event.target.value)} placeholder="当前密码" autoComplete="current-password" className="h-11 rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-blue-500" /><input type="password" value={newPassword} onChange={event => setNewPassword(event.target.value)} placeholder="新密码（至少6位）" autoComplete="new-password" className="h-11 rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-blue-500" /><input type="password" value={confirmPassword} onChange={event => setConfirmPassword(event.target.value)} placeholder="再次输入新密码" autoComplete="new-password" className="h-11 rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-blue-500" /></div>
              <div className="flex items-center justify-between gap-4"><p className="text-xs leading-5 text-slate-400">演示版使用浏览器本地加密摘要保存；正式环境需由后端完成身份校验、密码加密和安全审计。</p><Button variant="outline" onClick={saveNewPassword} disabled={accountSaving} className="shrink-0">修改密码</Button></div>
            </section>
          </div>
        </DialogContent>
      </Dialog>

      {/* ─── Main Content ────────────────────────────────────────── */}
      <main className={`flex-1 bg-transparent ${FORMAL_PRODUCT_PATHS.has(location.pathname) ? 'product-page-v3' : ''} ${location.pathname === '/products-overview' ? 'product-overview-v3' : ''}`}>
        {children}
      </main>

      {PRODUCT_CONTACT_NAMES[location.pathname] && (
        <ProductContactSection productName={PRODUCT_CONTACT_NAMES[location.pathname]} />
      )}

      {/* ─── Global Footer ───────────────────────────────────────── */}
      <GlobalFooter />

      {/* ─── Floating Contact Widget (修改点5) ──────────────────── */}
      {/* 在线咨询/玄鉴智能助手后端暂未开放，保留组件代码以便后续恢复。 */}
      <FloatingContact showOnlineConsultation={false} />
    </div>
  );
}
