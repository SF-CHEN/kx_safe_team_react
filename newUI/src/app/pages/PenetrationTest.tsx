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
    const subject = encodeURIComponent('网络渗透测试预约咨询');
    const body = encodeURIComponent(`姓名：${form.name}\n公司：${form.company}\n邮箱：${form.email}\n电话：${form.phone}\n关注问题：${form.pain || '未填写'}`);
    window.location.href = `mailto:contact@hzrongshu.cn?subject=${subject}&body=${body}`;
    setLoading(false);
    setSubmitted(true);
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
            <h3 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', margin: '0 0 10px' }}>请在邮件客户端确认发送</h3>
            <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.75, margin: '0 0 24px' }}>
              预约信息已整理至邮件正文，发送后我们的安全专家将在工作时间内联系您。<br />
              如未唤起邮件客户端，请直接联系 contact@hzrongshu.cn。
            </p>
            <a href="mailto:contact@hzrongshu.cn?subject=网络渗透测试预约咨询" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '11px 24px', background: 'linear-gradient(135deg,#ef4444,#f97316)', color: '#fff', borderRadius: 12, fontSize: 14, fontWeight: 700, textDecoration: 'none', boxShadow: '0 4px 16px rgba(239,68,68,0.3)' }}>
              <Mail size={15} /> 重新打开邮件
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

// ── Asset / Service / Risk Relations ───────────────────────────────
const RELATION_STAGES = [
  {
    id: 'scope', step: '01', label: '授权目标', color: '#6366f1', icon: FileText,
    desc: '记录测试对象、范围与授权边界',
    techniques: [
      { name: '目标清单', detail: '确认域名、IP 与指定 API 等授权测试对象' },
      { name: '端口范围', detail: '明确允许探测的 TCP/UDP 端口范围' },
      { name: '时间窗口', detail: '记录测试开始、结束时间及业务避让时段' },
      { name: '授权边界', detail: '标记禁止操作、紧急联系人与停止条件' },
    ],
    findings: ['域名 / IP / 指定 API', '授权端口范围', '测试时间窗口'],
  },
  {
    id: 'asset', step: '02', label: '资产发现', color: '#3b82f6', icon: Search,
    desc: '汇总授权范围内发现的资产信息',
    techniques: [
      { name: '子域名记录', detail: '关联已发现的子域名与所属授权目标' },
      { name: 'IP 记录', detail: '记录解析地址及其与域名的关联关系' },
      { name: '端口记录', detail: '展示授权范围内探测到的开放端口' },
      { name: '资产状态', detail: '保留发现时间、响应状态与证据索引' },
    ],
    findings: ['子域名与 IP', '开放端口', '发现时间'],
  },
  {
    id: 'service', step: '03', label: '服务识别', color: '#f59e0b', icon: Database,
    desc: '将端口与服务、组件信息关联展示',
    techniques: [
      { name: '服务类型', detail: '展示 HTTP、数据库及中间件等服务识别结果' },
      { name: '组件候选', detail: '记录 CMS、框架及服务器组件的识别候选' },
      { name: '版本信息', detail: '展示探测到的版本信息并保留证据来源' },
      { name: 'Web 指纹', detail: '关联站点使用的 Web 技术与防护组件候选' },
    ],
    findings: ['服务类型', '组件与版本候选', 'Web 技术指纹'],
  },
  {
    id: 'risk', step: '04', label: '风险记录', color: '#ef4444', icon: AlertTriangle,
    desc: '关联已发现风险、证据与复核状态',
    techniques: [
      { name: '风险位置', detail: '将候选问题关联至对应资产、端口与服务' },
      { name: '证据留存', detail: '保留请求响应、截图及复现步骤等证据索引' },
      { name: '风险评级', detail: '记录候选风险等级与判断依据' },
      { name: '复核状态', detail: '区分待复核、已验证与未确认等处理状态' },
    ],
    findings: ['风险位置', '证据索引', '人工复核状态'],
  },
];

// ── Service Steps ──────────────────────────────────────────────────
const SERVICE_STEPS = [
  { step: 1, title: '授权与调研',     icon: FileText,    color: '#6366f1', desc: '明确测试范围与边界，签署授权协议。双方确认资产清单、测试时间窗口与紧急联系机制，确保测试合法合规、风险可控。' },
  { step: 2, title: '信息收集',       icon: Search,      color: '#3b82f6', desc: '在授权范围内开展资产指纹识别：子域名枚举、端口探测、服务识别、CMS 与框架版本探测，形成攻击面视图。' },
  { step: 3, title: '测试重点梳理',   icon: Radar,       color: '#f59e0b', desc: '基于授权目标、服务指纹和业务边界梳理测试重点，并针对目标技术栈制定测试方案。' },
  { step: 4, title: '自动化检测与专家复核', icon: Target, color: '#ef4444', desc: '对网络、Web 及指定 API 的常见风险开展自动化检测，并由专家复核高危告警；已验证问题形成复现步骤和相关证据。覆盖类型、复核量与证据数量以经确认的统计口径为准。' },
  { step: 5, title: '报告与复测',     icon: CheckCircle2,color: '#10b981', desc: '交付包含复现步骤、风险评级与修复建议的测试报告。报告交付后 30 日内，针对本次报告所列问题提供 1 次免费复测；新增目标、新增接口及重大版本变更不在免费范围内。' },
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
    title: '资产自动发现 · 授权范围探测演示',
    phases: [
      { time: '00:00–00:05', label: '痛点呈现', desc: '传统扫描工具报告杂乱，资产指纹缺失，遗漏隐蔽服务' },
      { time: '00:05–00:25', label: '产品演示', desc: '输入目标域名 → 一键启动 → 自动枚举子域名、端口、服务指纹' },
      { time: '00:25–00:40', label: '结果呈现', desc: '形成资产拓扑，并展示已识别的 Redis 端口与 Shiro 指纹' },
      { time: '00:40–00:45', label: '条件说明', desc: '探测耗时受授权端口范围、带宽、并发、硬件与目标响应影响' },
    ],
  },
  '02': {
    title: '漏洞深度验证 · 人工复核演示',
    phases: [
      { time: '00:00–00:05', label: '痛点呈现', desc: '普通扫描器产生大量误报，安全团队疲于奔命排查噪音' },
      { time: '00:05–00:25', label: '产品演示', desc: '专家人工验证流程：SQL 注入 PoC 执行 → 数据回显 → 确认可利用' },
      { time: '00:25–00:40', label: '高光时刻', desc: '漏洞详情页展示：截图、PoC 代码、复现证据与修复建议一体呈现' },
      { time: '00:40–00:45', label: '结尾号召', desc: '"每个漏洞真实可利用，专家负责任交付" · 立即预约' },
    ],
  },
  '03': {
    title: '授权 API 业务逻辑测试演示',
    phases: [
      { time: '00:00–00:05', label: '范围确认', desc: '确认授权接口清单、测试角色、业务流程与测试边界' },
      { time: '00:05–00:25', label: '产品演示', desc: '以 crAPI 授权场景演示对象级越权、参数篡改等测试过程' },
      { time: '00:25–00:40', label: '结果呈现', desc: '展示请求与响应记录、复现步骤及人工复核结论' },
      { time: '00:40–00:45', label: '范围说明', desc: '定制化测试范围按接口清单、角色和业务流程确认' },
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
        <div style={{ fontSize: 11, fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>金融系统测试报告示例</div>
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
          示例界面 · 风险等级、整改建议与修复周期以人工复核结论和项目约定为准
        </div>
      </div>
    );
  }

  function GovMock() {
    const phases = [
      { label: '授权目标', done: true, color: '#6366f1' },
      { label: '资产发现', done: true, color: '#3b82f6' },
      { label: '服务识别', done: true, color: '#f59e0b' },
      { label: '风险记录', done: false, color: '#94a3b8' },
    ];
    return (
      <div style={{ background: 'linear-gradient(150deg,#f5f3ff,#ede9fe)', borderRadius: 16, padding: '18px 20px', border: '1px solid rgba(99,102,241,0.18)' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>授权测试 · 信息关联示例</div>
        <div style={{ display: 'flex', gap: 4, alignItems: 'center', marginBottom: 16 }}>
          {phases.map((p, i) => (
            <React.Fragment key={p.label}>
              <div style={{ flex: 1, textAlign: 'center', padding: '8px 6px', background: p.done ? `${p.color}14` : '#f8fafc', borderRadius: 8, border: `1px solid ${p.done ? p.color + '30' : '#e2e8f0'}` }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: p.done ? p.color : '#94a3b8' }}>{p.label}</div>
                <div style={{ fontSize: 9, color: p.done ? p.color : '#94a3b8', marginTop: 2 }}>{p.done ? '✓ 已记录' : '待复核'}</div>
              </div>
              {i < phases.length - 1 && <ChevronRight size={12} style={{ color: '#d1d5db', flexShrink: 0 }} />}
            </React.Fragment>
          ))}
        </div>
        <div style={{ padding: '8px 12px', background: 'rgba(99,102,241,0.07)', borderRadius: 9, border: '1px solid rgba(99,102,241,0.15)', fontSize: 11, color: '#4f46e5' }}>
          示例界面 · 关联结果以实际授权范围和人工复核结论为准
        </div>
      </div>
    );
  }

  function EcomMock() {
    const bugs = [
      { label: '对象级授权校验', severity: '候选', color: '#ef4444' },
      { label: '请求参数边界测试', severity: '候选', color: '#d97706' },
      { label: '接口访问控制', severity: '候选', color: '#d97706' },
    ];
    return (
      <div style={{ background: 'linear-gradient(150deg,#f0fdf4,#dcfce7)', borderRadius: 16, padding: '18px 20px', border: '1px solid rgba(16,185,129,0.18)' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>授权 API 测试候选项</div>
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
          示例界面 · 候选项需结合请求响应证据与人工复核确认
        </div>
      </div>
    );
  }

  const INDUSTRY_SOLUTIONS = [
    {
      id: 'finance', icon: '🏦', accentColor: '#3b82f6', tag: '金融 / 证券 / 保险',
      title: '金融系统授权安全测试，辅助监管检查',
      subtitle: '高危告警人工确认，报告周期边界清晰',
      desc: '面向银行、证券、保险等机构，在授权范围内对核心交易系统、移动端 App 与 API 网关开展安全测试。标准范围项目从测试结束起 3 个工作日内交付报告；复杂项目根据资产数量和测试范围确认周期。报告可为监管检查提供依据，指定报送模板按项目约定。',
      metrics: [{ value: '人工复核', label: '高危有效性确认' }, { value: '测试集', label: '检出率统计依据' }, { value: '3个工作日', label: '标准项目报告' }],
      tags: ['监管检查支持', 'API 安全', 'JWT 验证', '核心系统测试'],
      mock: <FinanceMock />,
    },
    {
      id: 'gov', icon: '🏛️', accentColor: '#6366f1', tag: '政务 / 关键基础设施',
      title: '政务与关键基础设施授权安全测试支撑',
      subtitle: '按授权范围开展测试、证据留存与风险复核',
      desc: '面向政府机构、能源、交通等单位，可按项目约定提供授权安全测试与演练支撑。具体资产范围、测试边界、项目周期和交付方式以双方确认的授权文件与合同为准；团队服务年限与项目数量仅在正式台账核实后披露。',
      metrics: [{ value: '授权', label: '测试范围确认' }, { value: '证据', label: '过程记录留存' }, { value: '复核', label: '风险有效性确认' }],
      tags: ['授权安全测试', '范围与边界', '证据留存', '人工复核'],
      mock: <GovMock />,
    },
    {
      id: 'ecom', icon: '🛍️', accentColor: '#10b981', tag: '电商 / 零售 / O2O',
      title: '电商与零售授权 API 安全测试',
      subtitle: '按授权接口与业务流程开展专项测试',
      desc: '针对电商平台的授权 API 与业务流程，按双方确认的接口清单、测试角色和业务边界开展逻辑测试；具体覆盖范围根据项目实际情况确定。',
      metrics: [{ value: '接口', label: '清单确认' }, { value: '角色', label: '权限确认' }, { value: '流程', label: '边界确认' }],
      tags: ['crAPI 场景', '授权 API 测试', '角色权限确认', '业务流程确认'],
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
      <section className="product-detail-hero product-detail-hero--reference-height" style={{ position: 'relative', minHeight: 560, display: 'flex', alignItems: 'center', overflow: 'hidden', background: 'linear-gradient(135deg,#0f172a 0%,#1e1b4b 60%,#1e293b 100%)' }}>
        <ProductHeroBackground side="system" concept="penetration" />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 1200, margin: '0 auto', padding: '0 48px', width: '100%' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
            <div>
              <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
                <Badge style={{ background: 'rgba(220,38,38,0.94)', color: '#ffffff', border: '1px solid rgba(252,165,165,0.9)', fontSize: 12 }}>系统安全</Badge>
                <Badge style={{ background: 'rgba(217,119,6,0.94)', color: '#ffffff', border: '1px solid rgba(251,191,36,0.9)', fontSize: 12 }}>专业渗透测试服务</Badge>
              </div>
              <h1 style={{ fontSize: 'clamp(26px,3.2vw,46px)', fontWeight: 900, color: '#fff', margin: '0 0 18px', lineHeight: 1.15 }}>
                智能化网络<br />
                <span style={{ background: 'linear-gradient(135deg,#f87171,#fb923c)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  渗透测试服务
                </span>
              </h1>
              <p style={{ fontSize: 15, color: '#94a3b8', lineHeight: 1.8, margin: '0 0 32px', maxWidth: 420 }}>
                模拟攻击者视角，人机协同验证系统防御边界。支持网络、Web 及指定 API 安全测试；结合结构化证据和人工复核降低误报。
              </p>
            </div>

            {/* Right: animated stats */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                style={{ background: 'rgba(15,23,42,0.7)', backdropFilter: 'blur(20px)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 16, padding: '18px 22px', boxShadow: '0 16px 40px rgba(239,68,68,0.15)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#ef4444', boxShadow: '0 0 8px #ef4444' }} />
                  <span style={{ fontSize: 11, color: '#94a3b8', fontFamily: 'monospace' }}>授权测试结果快照</span>
                  <span style={{ marginLeft: 'auto', padding: '2px 8px', background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(96,165,250,0.3)', borderRadius: 8, fontSize: 10, color: '#93c5fd', fontWeight: 700 }}>演示项目数据</span>
                </div>
                <div style={{ marginBottom: 12, fontSize: 9.5, color: '#64748b', fontFamily: 'monospace' }}>测试目标数：1 个授权演示目标 · 统计时间：2026-08-01 14:30</div>
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
                  <span style={{ fontSize: 11, color: '#94a3b8', fontFamily: 'monospace' }}>演示问题 · 已人工复核 · SQL 注入</span>
                </div>
                <div style={{ background: '#0f172a', borderRadius: 7, padding: '8px 12px', fontSize: 11, fontFamily: 'monospace', color: '#fca5a5', marginBottom: 9, lineHeight: 1.6 }}>
                  <span style={{ color: '#64748b' }}>payload: </span>admin' OR '1'='1'--
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  {[{ label: 'CRITICAL', color: '#ef4444' }, { label: 'CWE-89', color: '#f97316' }].map(t => (
                    <span key={t.label} style={{ padding: '2px 8px', background: `${t.color}14`, border: `1px solid ${t.color}30`, borderRadius: 6, fontSize: 10, color: t.color, fontFamily: 'monospace', fontWeight: 700 }}>{t.label}</span>
                  ))}
                </div>
                <div style={{ marginTop: 9, fontSize: 9.5, color: '#64748b' }}>复现说明、请求/响应记录及相关证据已留存</div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <StickySubNav items={[
        { id: 'pt-capabilities', label: '核心能力' },
        { id: 'pt-relations', label: '测试信息关联展示' },
        { id: 'pt-scenarios', label: '应用场景' },
        { id: 'pt-process', label: '测试流程' },
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
              <p style={{ fontSize: 15, color: '#64748b', margin: 0 }}>支持网络、Web 及指定 API 安全测试；发现项结合结构化证据、PoC 复现说明和人工复核，持续降低误报</p>
            </div>
          </ScrollReveal>

          {[
            {
              id: '01', side: 'left' as const, color: '#6366f1',
              panelBg: 'linear-gradient(145deg,#f0f4ff,#e8edfd)',
              title: '资产自动发现',
              heading: '在授权范围内完成资产发现与指纹识别',
              desc: '支持识别域名、IP、授权端口范围和服务，并探测 CMS 类型、框架版本、WAF 类型等指纹信息。实际探测耗时受带宽、并发、端口范围、硬件条件及目标响应影响。',
              tags: ['子域名枚举', '授权端口探测', '服务指纹识别', 'WAF 识别'],
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
                    演示项目数据：312 个开放端口 · 18 个子域名 · 3 个高危指纹
                  </div>
                  <div style={{ marginTop: 7, fontSize: 10, color: '#64748b', lineHeight: 1.55 }}>
                    指纹库有效记录数、版本与更新时间以经确认的版本清单为准。
                  </div>
                </div>
              ),
            },
            {
              id: '02', side: 'right' as const, color: '#ef4444',
              panelBg: 'linear-gradient(145deg,#fff1f2,#fde8e8)',
              title: '漏洞深度验证',
              heading: '专家人工复核，降低误报',
              desc: '在自动化发现基础上，对候选问题进行人工复核与 PoC 验证。支持 SQL 注入、XSS、RCE、SSRF、越权访问等常见高风险问题测试，并为已验证问题提供复现说明和相关证据。',
              tags: ['SQL 注入', 'XSS / RCE', 'SSRF', '越权访问', '人工复核'],
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
                    演示项目中标记为“已验证”的发现附有人工复核结论、PoC 复现说明与相关证据
                  </div>
                </div>
              ),
            },
            {
              id: '03', side: 'left' as const, color: '#f59e0b',
              panelBg: 'linear-gradient(145deg,#fffbf0,#fef3c7)',
              title: '业务逻辑测试',
              heading: '支持 crAPI 等已验证授权 API 测试场景',
              desc: '当前以 crAPI 等已验证授权 API 场景开展测试；定制化业务逻辑测试的覆盖范围，需根据接口清单、测试角色和业务流程与客户共同确认。',
              tags: ['crAPI 场景', '接口清单确认', '角色权限确认', '业务流程确认'],
              panel: (
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>crAPI 授权场景验证示例</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {[
                      { scenario: '对象级授权校验', step: '切换测试角色并访问非本人资源标识', impact: '越权风险候选', color: '#ef4444' },
                      { scenario: '请求参数边界测试', step: '按授权清单修改可控字段并记录响应差异', impact: '参数校验候选', color: '#d97706' },
                      { scenario: '接口访问控制', step: '对比不同角色访问指定 API 的响应结果', impact: '访问控制候选', color: '#d97706' },
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
                    <div style={{ display: 'flex', flexWrap: 'nowrap', gap: 8, marginBottom: 30, overflowX: 'auto', paddingBottom: 4 }}>
                      {item.tags.map(t => (
                        <span key={t} style={{ fontSize: 12, padding: '6px 14px', borderRadius: 20, background: item.color + '10', color: item.color, border: `1px solid ${item.color}25`, fontWeight: 600, whiteSpace: 'nowrap', flexShrink: 0 }}>{t}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </section>

      {/* ══ 3. ASSET / SERVICE / RISK RELATIONS ════════════════════ */}
      <ScrollReveal>
        <section id="pt-relations" style={{ background: 'linear-gradient(135deg,#f1f5f9,#e2e8f0)', padding: '88px 0', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 48px' }}>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: '#ef4444', textTransform: 'uppercase', letterSpacing: '0.12em', margin: '0 0 10px' }}>测试信息关联展示</p>
              <h2 style={{ fontSize: 'clamp(26px,3.2vw,40px)', fontWeight: 900, color: '#0f172a', margin: '0 0 12px', lineHeight: 1.15 }}>
                关联展示资产、服务和已发现风险
              </h2>
              <p style={{ fontSize: 15, color: '#64748b', maxWidth: 520, margin: '0 auto' }}>
                从授权目标出发，关联资产发现、服务识别和风险记录，辅助查看测试对象与发现项之间的关系
              </p>
            </div>

            {/* Chain */}
            <div style={{ display: 'flex', alignItems: 'stretch', gap: 4, marginBottom: 24 }}>
              {RELATION_STAGES.map((phase, i) => {
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
                    {i < RELATION_STAGES.length - 1 && (
                      <div style={{ display: 'flex', alignItems: 'center', paddingBottom: 8 }}>
                        <motion.div animate={{ x: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity }}
                          style={{ color: RELATION_STAGES[i + 1].color, opacity: 0.5 }}>
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
                    const phase = RELATION_STAGES.find(p => p.id === hoveredPhase)!;
                    return (
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 700, color: phase.color, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>
                          {phase.label} · 关联信息详情
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
                    将鼠标悬停在任意卡片上，查看对应的关联信息
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
            <div style={{ marginTop: 10, padding: '11px 16px', borderRadius: 10, background: 'rgba(255,255,255,0.72)', border: '1px solid #cbd5e1', color: '#64748b', fontSize: 12.5, lineHeight: 1.65, textAlign: 'center' }}>
              当前为信息关联结构示意，不代表具体项目结果。授权案例的路径数量、影响范围与项目时间仅在完成客户授权、脱敏并可核验后展示，且案例结果不代表所有项目。
            </div>
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
                五步服务流程，明确授权与交付边界
              </h2>
            </div>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: 28, top: 28, bottom: 28, width: 4, transform: 'translateX(-50%)', background: 'linear-gradient(to bottom,#6366f1,#3b82f6,#f59e0b,#ef4444,#10b981)', borderRadius: 4, boxShadow: '0 0 0 5px rgba(99,102,241,0.06)' }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {SERVICE_STEPS.map(s => {
                  const Icon = s.icon;
                  return (
                    <div key={s.step} style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
                      <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#fff', border: `3px solid ${s.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, position: 'relative', zIndex: 1, boxShadow: `0 6px 18px ${s.color}26` }}>
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

    </div>
  );
}
