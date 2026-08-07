import type { LucideIcon } from 'lucide-react';
import {
  Activity,
  AlertTriangle,
  Ban,
  BarChart2,
  Bot,
  Brain,
  CheckCircle2,
  Code2,
  Database,
  Eye,
  FileText,
  Fingerprint,
  Flame,
  Globe,
  HeartPulse,
  KeyRound,
  Layers,
  Lock,
  MessageSquare,
  Radar,
  Scale,
  ScanSearch,
  Search,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  Users,
  Zap,
} from 'lucide-react';

/** 字典 / 场景可选图标：存 Lucide 组件名到 `SysDict.icon` */
export const LUCIDE_ICON_OPTIONS: { name: string; label: string; Icon: LucideIcon }[] = [
  { name: 'Shield', label: '盾牌', Icon: Shield },
  { name: 'ShieldCheck', label: '盾牌勾选', Icon: ShieldCheck },
  { name: 'ShieldAlert', label: '盾牌警示', Icon: ShieldAlert },
  { name: 'Lock', label: '锁', Icon: Lock },
  { name: 'KeyRound', label: '钥匙', Icon: KeyRound },
  { name: 'Eye', label: '眼睛', Icon: Eye },
  { name: 'ScanSearch', label: '扫描搜索', Icon: ScanSearch },
  { name: 'Fingerprint', label: '指纹', Icon: Fingerprint },
  { name: 'Ban', label: '禁止', Icon: Ban },
  { name: 'AlertTriangle', label: '警告', Icon: AlertTriangle },
  { name: 'Zap', label: '闪电', Icon: Zap },
  { name: 'Star', label: '星星', Icon: Star },
  { name: 'Sparkles', label: '闪光', Icon: Sparkles },
  { name: 'Globe', label: '地球', Icon: Globe },
  { name: 'Bot', label: '机器人', Icon: Bot },
  { name: 'Brain', label: '大脑', Icon: Brain },
  { name: 'MessageSquare', label: '消息', Icon: MessageSquare },
  { name: 'FileText', label: '文档', Icon: FileText },
  { name: 'Code2', label: '代码', Icon: Code2 },
  { name: 'Database', label: '数据库', Icon: Database },
  { name: 'Layers', label: '层级', Icon: Layers },
  { name: 'BarChart2', label: '柱状图', Icon: BarChart2 },
  { name: 'Activity', label: '活动', Icon: Activity },
  { name: 'Radar', label: '雷达', Icon: Radar },
  { name: 'Target', label: '靶心', Icon: Target },
  { name: 'Scale', label: '天平', Icon: Scale },
  { name: 'Users', label: '用户群', Icon: Users },
  { name: 'HeartPulse', label: '心跳', Icon: HeartPulse },
  { name: 'Flame', label: '火焰', Icon: Flame },
  { name: 'Search', label: '搜索', Icon: Search },
  { name: 'CheckCircle2', label: '完成', Icon: CheckCircle2 },
];

const ICON_MAP = Object.fromEntries(
  LUCIDE_ICON_OPTIONS.map((item) => [item.name, item.Icon]),
) as Record<string, LucideIcon>;

export function resolveLucideIcon(name?: string | null): LucideIcon | null {
  if (!name?.trim()) return null;
  return ICON_MAP[name.trim()] ?? null;
}
