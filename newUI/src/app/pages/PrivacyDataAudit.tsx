import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Shield, Search, Brain, RefreshCw, ArrowRight, CheckCircle2,
  FileText, Database, Code2, BarChart2, AlertTriangle, Eye, EyeOff,
  Play, ToggleLeft, ToggleRight, Calendar, Phone, Building,
  User,
} from 'lucide-react';
import { ScrollReveal } from '../components/ScrollReveal';
import { ProductHeroBackground } from '../components/ProductHeroBackground';
import { StickySubNav } from '../components/StickySubNav';

// ── Color theme ───────────────────────────────────────────────────
const C = {
  primary: '#8b5cf6',
  primaryDark: '#7c3aed',
  primaryLight: '#a78bfa',
  bg: '#f5f3ff',
  bgCard: 'rgba(255,255,255,0.95)',
};

// ── Law badge data ────────────────────────────────────────────────
const LAWS = [
  { abbr: '个保法', name: '《个人信息保护法》', year: '2021年11月施行', color: '#8b5cf6', desc: '界定敏感个人信息并明确特定处理规则、风险评估及个人信息保护合规审计义务。' },
  { abbr: '行政法规', name: '《网络数据安全管理条例》', year: '2025年1月施行', color: '#6366f1', desc: '细化网络数据处理者的安全保护、个人信息合规审计和风险管理要求，体现最新行政法规口径。' },
  { abbr: 'GB/T', name: 'GB/T 45574-2025', year: '2025年11月实施', color: '#7c3aed', desc: '规定敏感个人信息识别与处理安全要求，为智能识别和后续处置提供技术依据。' },
  { abbr: 'GB/T', name: 'GB/T 46903-2025', year: '2026年7月实施', color: '#4f46e5', desc: '规定个人信息保护合规审计流程与方法，为证据整理和审计报告生成提供依据。' },
];

// ── Capability panels ─────────────────────────────────────────────

function MultiModalPanel() {
  const types = [
    { icon: '📄', label: '非结构化文本', sub: '客服记录、合同', color: '#8b5cf6', items: ['PDF 全文解析', 'Word/TXT 文档', '邮件正文提取'] },
    { icon: '🖼️', label: 'OCR 图片识别', sub: '扫描件、截图', color: '#6366f1', items: ['身份证照片', '银行卡截图', '手写表单'] },
    { icon: '📊', label: '结构化数据', sub: 'Excel、CSV', color: '#7c3aed', items: ['字段名语义匹配', '跨列关联分析', 'NULL值推断'] },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {types.map((t, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: '14px 16px', background: 'rgba(255,255,255,0.9)', borderRadius: 12, border: `1.5px solid ${t.color}18`, boxShadow: `0 2px 10px ${t.color}08` }}>
          <span style={{ fontSize: 22, flexShrink: 0 }}>{t.icon}</span>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>{t.label}</span>
              <span style={{ fontSize: 11, color: t.color, padding: '2px 8px', background: `${t.color}10`, borderRadius: 12 }}>{t.sub}</span>
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {t.items.map(item => (
                <span key={item} style={{ fontSize: 11, color: '#64748b', padding: '3px 8px', background: '#f1f5f9', borderRadius: 6 }}>{item}</span>
              ))}
            </div>
          </div>
        </div>
      ))}
      <div style={{ padding: '10px 14px', background: 'linear-gradient(135deg,rgba(139,92,246,0.08),rgba(99,102,241,0.06))', borderRadius: 10, border: '1px solid rgba(139,92,246,0.18)', textAlign: 'center', fontSize: 12, color: '#7c3aed', fontWeight: 600 }}>
        多格式内容解析 · 识别结果可定位
      </div>
    </div>
  );
}

function RuleLibraryPanel() {
  const categories = [
    { name: '基础身份', count: 8, color: '#8b5cf6', items: ['身份证号', '护照号', '军官证', '港澳通行证'] },
    { name: '联系方式', count: 6, color: '#6366f1', items: ['手机号', '固话', '邮箱', '微信号'] },
    { name: '金融信息', count: 7, color: '#7c3aed', items: ['银行卡号', '账户密码', '信用卡', '支付宝'] },
    { name: '位置住址', count: 5, color: '#4f46e5', items: ['详细地址', '邮编', 'IP地址', 'GPS坐标'] },
  ];
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
      {categories.map((cat, i) => (
        <div key={i} style={{ padding: '16px 14px', background: 'rgba(255,255,255,0.9)', borderRadius: 12, border: `1.5px solid ${cat.color}18`, boxShadow: `0 2px 10px ${cat.color}08` }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>{cat.name}</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: cat.color, background: `${cat.color}12`, padding: '2px 8px', borderRadius: 12 }}>预置规则</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {cat.items.map(item => (
              <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11.5, color: '#475569' }}>
                <div style={{ width: 4, height: 4, borderRadius: '50%', background: cat.color, flexShrink: 0 }} />
                {item}
              </div>
            ))}
          </div>
        </div>
      ))}
      <div style={{ gridColumn: '1 / -1', padding: '10px 14px', background: 'linear-gradient(135deg,rgba(139,92,246,0.06),rgba(99,102,241,0.04))', borderRadius: 10, border: '1px solid rgba(139,92,246,0.15)', fontSize: 12, color: '#7c3aed', fontWeight: 600, textAlign: 'center' }}>
        开箱即用 · 支持自定义正则规则扩展
      </div>
    </div>
  );
}

function LowFalsePositivePanel() {
  const examples = [
    { text: '合同编号：110101-2026-001', type: '合同编号（非身份证）', isTP: false, conf: 0.03 },
    { text: '用户 ID：13800138000', type: '系统ID（非手机号）', isTP: false, conf: 0.07 },
    { text: '联系方式：139-0013-9001', type: '手机号码', isTP: true, conf: 0.98 },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ padding: '12px 14px', background: 'rgba(255,255,255,0.9)', borderRadius: 10, border: '1px solid rgba(0,0,0,0.06)', fontSize: 12, color: '#64748b', lineHeight: 1.7 }}>
        <span style={{ fontWeight: 700, color: '#7c3aed' }}>上下文语境分析</span>：将敏感信息候选词还原到原始上下文中，结合前后语境、字段标签、数据类型等综合判断，大幅降低误报率。
      </div>
      {examples.map((ex, i) => (
        <div key={i} style={{ padding: '12px 14px', background: 'rgba(255,255,255,0.9)', borderRadius: 10, border: `1px solid ${ex.isTP ? 'rgba(239,68,68,0.18)' : 'rgba(22,163,74,0.15)'}` }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
            <code style={{ fontSize: 12, color: '#334155', fontFamily: 'monospace' }}>{ex.text}</code>
            <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 8, background: ex.isTP ? 'rgba(239,68,68,0.1)' : 'rgba(22,163,74,0.1)', color: ex.isTP ? '#dc2626' : '#16a34a', fontWeight: 700, flexShrink: 0, marginLeft: 8 }}>
              {ex.isTP ? '✓ 命中' : '✗ 过滤'}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 11, color: '#64748b' }}>{ex.type}</span>
            <span style={{ fontSize: 11, color: ex.isTP ? '#dc2626' : '#16a34a', fontWeight: 600 }}>{ex.isTP ? '高相关候选' : '低相关候选'}</span>
          </div>
        </div>
      ))}
      <div style={{ padding: '10px 14px', background: 'linear-gradient(135deg,rgba(139,92,246,0.08),rgba(99,102,241,0.06))', borderRadius: 10, border: '1px solid rgba(139,92,246,0.18)', fontSize: 12, color: '#7c3aed', fontWeight: 600, textAlign: 'center' }}>
        结合上下文复核候选字段，降低易混淆信息误判
      </div>
    </div>
  );
}

function ScheduledScanPanel() {
  const schedules = [
    { label: '数据库日增量', freq: '每日 02:00', status: 'active', next: '12h 后' },
    { label: '文档存储全量', freq: '每周一', status: 'active', next: '3天后' },
    { label: 'API 日志审计', freq: '每小时', status: 'paused', next: '已暂停' },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {schedules.map((s, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', background: 'rgba(255,255,255,0.9)', borderRadius: 10, border: `1px solid ${s.status === 'active' ? 'rgba(22,163,74,0.2)' : 'rgba(0,0,0,0.07)'}` }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', flexShrink: 0, background: s.status === 'active' ? '#16a34a' : '#94a3b8', boxShadow: s.status === 'active' ? '0 0 6px #16a34a' : 'none' }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{s.label}</div>
            <div style={{ fontSize: 11, color: '#64748b' }}>{s.freq}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: 11, color: s.status === 'active' ? '#16a34a' : '#94a3b8', fontWeight: 600 }}>下次：{s.next}</span>
          </div>
        </div>
      ))}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        {[
          { label: '支持数据源', value: '数据库/文档/API' },
          { label: '巡检频率', value: '按需配置' },
          { label: '变化量感知', value: '增量扫描' },
          { label: '告警通知', value: '邮件/Webhook' },
        ].map((m, i) => (
          <div key={i} style={{ padding: '10px 12px', background: 'rgba(255,255,255,0.9)', borderRadius: 8, border: '1px solid rgba(0,0,0,0.06)', textAlign: 'center' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#7c3aed' }}>{m.value}</div>
            <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>{m.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Interactive Demo ───────────────────────────────────────────────
type DemoTab = 'text' | 'structured' | 'code';

const DEMO_PRESETS: Record<DemoTab, {
  label: string;
  icon: string;
  samples: { name: string; raw: string; desensitized: string; findings: { type: string; value: string; level: 'high' | 'medium'; masked: string }[] }[];
}> = {
  text: {
    label: '非结构化文本',
    icon: 'FileText',
    samples: [
      {
        name: '客服记录示例',
        raw: '用户张三（身份证：110101199001011234）反馈手机号 13800138000 无法接收验证码，请核实其银行卡 6222021234567890 是否绑定该号码，联系邮箱 zhangsan@example.com，住址北京市朝阳区建国路88号。',
        desensitized: '用户**（身份证：110101**********34）反馈手机号 138****8000 无法接收验证码，请核实其银行卡 6222**********90 是否绑定该号码，联系邮箱 zh*****n@example.com，住址北京市朝阳区****。',
        findings: [
          { type: '身份证号', value: '110101199001011234', level: 'high', masked: '110101**********34' },
          { type: '手机号码', value: '13800138000', level: 'high', masked: '138****8000' },
          { type: '银行卡号', value: '6222021234567890', level: 'high', masked: '6222**********90' },
          { type: '电子邮箱', value: 'zhangsan@example.com', level: 'medium', masked: 'zh*****n@example.com' },
        ],
      },
      {
        name: '合同文档示例',
        raw: '甲方：李明，身份证号码 310115198506152345，联系电话 18912345678，通讯地址：上海市浦东新区陆家嘴环路 1000 号，开户行：招商银行卡号 6214850226789012。',
        desensitized: '甲方：**，身份证号码 310115**********45，联系电话 189****5678，通讯地址：上海市浦东新区****，开户行：招商银行卡号 6214**********12。',
        findings: [
          { type: '姓名', value: '李明', level: 'medium', masked: '**' },
          { type: '身份证号', value: '310115198506152345', level: 'high', masked: '310115**********45' },
          { type: '手机号码', value: '18912345678', level: 'high', masked: '189****5678' },
          { type: '银行卡号', value: '6214850226789012', level: 'high', masked: '6214**********12' },
        ],
      },
    ],
  },
  structured: {
    label: '结构化表格',
    icon: 'BarChart2',
    samples: [
      {
        name: '员工档案表示例',
        raw: '姓名: 王芳 | 工号: EMP00218 | 手机: 13611112222 | 身份证: 440301198803036789 | 月薪: ¥18,500 | 银行卡: 6228480226789999 | 邮箱: wangfang@company.com',
        desensitized: '姓名: ** | 工号: EMP00218 | 手机: 136****2222 | 身份证: 440301**********89 | 月薪: ¥**,*** | 银行卡: 6228**********99 | 邮箱: wa***ng@company.com',
        findings: [
          { type: '姓名', value: '王芳', level: 'medium', masked: '**' },
          { type: '手机号码', value: '13611112222', level: 'high', masked: '136****2222' },
          { type: '身份证号', value: '440301198803036789', level: 'high', masked: '440301**********89' },
          { type: '银行卡号', value: '6228480226789999', level: 'high', masked: '6228**********99' },
        ],
      },
      {
        name: '用户注册信息示例',
        raw: 'user_id: 10082 | username: li_xiaoming | email: li.xm@qq.com | phone: 15900001234 | reg_ip: 192.168.1.105 | id_card: 320106199902175511',
        desensitized: 'user_id: 10082 | username: li_xiaoming | email: li.**@qq.com | phone: 159****1234 | reg_ip: 192.168.*.*** | id_card: 320106**********11',
        findings: [
          { type: '电子邮箱', value: 'li.xm@qq.com', level: 'medium', masked: 'li.**@qq.com' },
          { type: '手机号码', value: '15900001234', level: 'high', masked: '159****1234' },
          { type: '身份证号', value: '320106199902175511', level: 'high', masked: '320106**********11' },
        ],
      },
    ],
  },
  code: {
    label: '代码/日志',
    icon: 'Code2',
    samples: [
      {
        name: 'API 日志示例',
        raw: `[2026-07-01 09:12:34] POST /api/user/login | user_phone=13700007654 | id_card=110108198901231234 | token=sk-prod-a1b2c3d4e5f6g7h8 | response=200 | ip=203.0.113.50`,
        desensitized: `[2026-07-01 09:12:34] POST /api/user/login | user_phone=137****7654 | id_card=110108**********34 | token=sk-prod-****hidden**** | response=200 | ip=203.0.113.**`,
        findings: [
          { type: '手机号码', value: '13700007654', level: 'high', masked: '137****7654' },
          { type: '身份证号', value: '110108198901231234', level: 'high', masked: '110108**********34' },
          { type: 'API Token', value: 'sk-prod-a1b2c3d4e5f6g7h8', level: 'high', masked: 'sk-prod-****hidden****' },
        ],
      },
      {
        name: '配置文件示例',
        raw: `DB_HOST=prod-mysql.internal\nDB_USER=admin\nDB_PASS=S3cur3P@ssword123\nSMS_API_KEY=ak-1234567890abcdef\nADMIN_PHONE=13912345678\nBACKUP_EMAIL=admin@company.com`,
        desensitized: `DB_HOST=prod-mysql.internal\nDB_USER=admin\nDB_PASS=****redacted****\nSMS_API_KEY=ak-****redacted****\nADMIN_PHONE=139****5678\nBACKUP_EMAIL=ad***n@company.com`,
        findings: [
          { type: '数据库密码', value: 'S3cur3P@ssword123', level: 'high', masked: '****redacted****' },
          { type: 'API 密钥', value: 'ak-1234567890abcdef', level: 'high', masked: 'ak-****redacted****' },
          { type: '手机号码', value: '13912345678', level: 'high', masked: '139****5678' },
        ],
      },
    ],
  },
};

function InteractiveDemoSection() {
  const [tab, setTab] = useState<DemoTab>('text');
  const [sampleIdx, setSampleIdx] = useState(0);
  const scanning = false;
  const [scanned, setScanned] = useState(true);
  const [desensitized, setDesensitized] = useState(false);
  const [progress, setProgress] = useState(100);

  const demo = DEMO_PRESETS[tab];
  const sample = demo.samples[sampleIdx] ?? demo.samples[0];

  const handleTabChange = (t: DemoTab) => {
    setTab(t);
    setSampleIdx(0);
    setScanned(true);
    setDesensitized(false);
    setProgress(100);
  };

  const handleSampleChange = (idx: number) => {
    setSampleIdx(idx);
    setScanned(true);
    setDesensitized(false);
    setProgress(100);
  };

  return (
    <section style={{ background: 'linear-gradient(180deg,#f8f5ff 0%,#ffffff 60%)', padding: '80px 0', borderTop: '1px solid #ede9fe' }}>
      <div style={{ maxWidth: 1160, margin: '0 auto', padding: '0 40px' }}>
        <ScrollReveal>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ display: 'inline-block', fontSize: 13, color: C.primary, textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 700, marginBottom: 12, padding: '4px 16px', background: '#ede9fe', borderRadius: 20 }}>
              效果预览
            </div>
            <h2 style={{ fontSize: 32, fontWeight: 900, color: '#0f172a', margin: '0 0 12px' }}>敏感信息识别效果预览</h2>
            <p style={{ fontSize: 15, color: '#64748b', maxWidth: 540, margin: '0 auto' }}>
              查看典型业务场景中的字段识别、风险分级与脱敏结果；实际执行请前往在线体验专区
            </p>
          </div>
        </ScrollReveal>

        {/* Tab selector */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 36 }}>
          {(Object.entries(DEMO_PRESETS) as [DemoTab, typeof DEMO_PRESETS[DemoTab]][]).map(([key, d]) => {
            const DemoIcon = { FileText, BarChart2, Code2 }[d.icon as 'FileText' | 'BarChart2' | 'Code2'];
            return (
            <button key={key} onClick={() => handleTabChange(key)}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '9px 20px', border: `1.5px solid ${tab === key ? C.primary : '#e2e8f0'}`, borderRadius: 24, background: tab === key ? '#ede9fe' : '#fff', color: tab === key ? C.primaryDark : '#64748b', fontWeight: tab === key ? 700 : 500, fontSize: 13.5, cursor: 'pointer', transition: 'all 0.2s' }}>
              {DemoIcon && <DemoIcon size={15} />} {d.label}
            </button>
            );
          })}
        </div>

        {/* Demo grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'stretch' }}>
          {/* Left: Input */}
          <div style={{ background: '#fff', borderRadius: 18, border: '1.5px solid #ede9fe', boxShadow: '0 4px 24px rgba(139,92,246,0.07)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            {/* Header */}
            <div style={{ padding: '14px 20px', borderBottom: '1px solid #ede9fe', background: '#faf8ff', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ display: 'flex', gap: 5 }}>
                  {['#ff5f57', '#febc2e', '#28c840'].map(c => <div key={c} style={{ width: 9, height: 9, borderRadius: '50%', background: c }} />)}
                </div>
                <span style={{ fontSize: 12, color: '#94a3b8', fontFamily: 'monospace' }}>raw_data_input</span>
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                {demo.samples.map((s, i) => (
                  <button key={i} onClick={() => handleSampleChange(i)}
                    style={{ padding: '4px 10px', borderRadius: 14, border: `1px solid ${sampleIdx === i ? C.primary : '#e2e8f0'}`, background: sampleIdx === i ? '#ede9fe' : '#fff', color: sampleIdx === i ? C.primaryDark : '#94a3b8', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>
                    样本 {i + 1}
                  </button>
                ))}
              </div>
            </div>

            {/* Sample name */}
            <div style={{ padding: '10px 20px', borderBottom: '1px solid #f1f5f9', background: '#fdfcff' }}>
              <span style={{ fontSize: 12, color: '#64748b' }}>📁 {sample.name}</span>
            </div>

            {/* Raw content */}
            <div style={{ flex: 1, padding: '20px', position: 'relative', overflow: 'hidden' }}>
              <pre style={{ margin: 0, fontSize: 13, color: '#334155', fontFamily: 'monospace', lineHeight: 1.8, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                {sample.raw}
              </pre>

              {/* Scanning overlay */}
              {scanning && (
                <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
                  <motion.div
                    animate={{ top: ['0%', '100%'] }}
                    transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                    style={{ position: 'absolute', left: 0, right: 0, height: 3, background: 'linear-gradient(90deg,transparent,rgba(139,92,246,0.5),transparent)' }}
                  />
                </div>
              )}
            </div>

            {/* Preview status */}
            <div style={{ padding: '14px 20px', borderTop: '1px solid #ede9fe', background: '#faf8ff' }}>
              {(scanning || scanned) && (
                <div style={{ height: 4, background: '#ede9fe', borderRadius: 2, overflow: 'hidden', marginBottom: 10 }}>
                  <motion.div animate={{ width: `${progress}%` }} transition={{ duration: 0.3 }}
                    style={{ height: '100%', background: 'linear-gradient(90deg,#8b5cf6,#7c3aed)', borderRadius: 2 }} />
                </div>
              )}
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'center', color: '#059669', fontSize: 13, fontWeight: 700 }}>
                <CheckCircle2 size={14} /> 内置样例结果预览
              </div>
            </div>
          </div>

          {/* Right: Results */}
          <div style={{ background: '#fff', borderRadius: 18, border: '1.5px solid #ede9fe', boxShadow: '0 4px 24px rgba(139,92,246,0.07)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            {/* Header */}
            <div style={{ padding: '14px 20px', borderBottom: '1px solid #ede9fe', background: '#faf8ff', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: scanned ? '#10b981' : '#d1d5db', transition: 'all 0.3s', boxShadow: scanned ? '0 0 6px #10b981' : 'none' }} />
                <span style={{ fontSize: 12, color: '#94a3b8', fontFamily: 'monospace' }}>scan_result · audit_report</span>
              </div>
              {/* Desensitize toggle */}
              {scanned && (
                <button onClick={() => setDesensitized(d => !d)}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 12px', border: `1.5px solid ${desensitized ? C.primary : '#e2e8f0'}`, borderRadius: 20, background: desensitized ? '#ede9fe' : '#fff', color: desensitized ? C.primaryDark : '#64748b', fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}>
                  {desensitized ? <ToggleRight size={14} /> : <ToggleLeft size={14} />}
                  脱敏效果{desensitized ? '开' : '关'}
                </button>
              )}
            </div>

            <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
              {!scanned && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 12, color: '#d1d5db' }}>
                  <Shield size={40} style={{ opacity: 0.3 }} />
                  <p style={{ fontSize: 13, textAlign: 'center', color: '#94a3b8' }}>点击「开始识别」查看审查结果</p>
                </div>
              )}

              {scanned && (
                <AnimatePresence mode="wait">
                  <motion.div key={desensitized ? 'desensitized' : 'raw'} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>

                    {desensitized ? (
                      /* Desensitized view */
                      <div>
                        <div style={{ padding: '10px 14px', background: '#ede9fe', borderRadius: 10, marginBottom: 16, fontSize: 12, color: '#7c3aed', fontWeight: 600 }}>
                          ✅ 脱敏后数据预览（可安全共享）
                        </div>
                        <pre style={{ margin: 0, fontSize: 12.5, color: '#334155', fontFamily: 'monospace', lineHeight: 1.9, whiteSpace: 'pre-wrap', wordBreak: 'break-word', background: '#f8f5ff', padding: 16, borderRadius: 10, border: '1px solid #ede9fe' }}>
                          {sample.desensitized}
                        </pre>
                      </div>
                    ) : (
                      /* Risk findings */
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14, padding: '10px 14px', background: 'rgba(239,68,68,0.06)', borderRadius: 10, border: '1px solid rgba(239,68,68,0.15)' }}>
                          <AlertTriangle size={14} style={{ color: '#ef4444', flexShrink: 0 }} />
                          <span style={{ fontSize: 12.5, color: '#b91c1c', fontWeight: 700 }}>发现 {sample.findings.length} 处敏感信息，风险等级：{sample.findings.some(f => f.level === 'high') ? '高' : '中'}</span>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                          {sample.findings.map((f, i) => (
                            <motion.div key={i} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                              style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: '#fff', borderRadius: 10, border: `1.5px solid ${f.level === 'high' ? 'rgba(239,68,68,0.18)' : 'rgba(217,119,6,0.18)'}`, borderLeft: `4px solid ${f.level === 'high' ? '#ef4444' : '#d97706'}` }}>
                              <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 6, background: f.level === 'high' ? 'rgba(239,68,68,0.1)' : 'rgba(217,119,6,0.1)', color: f.level === 'high' ? '#ef4444' : '#d97706', fontWeight: 700, flexShrink: 0 }}>{f.level === 'high' ? '高危' : '中危'}</span>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontSize: 12, fontWeight: 700, color: '#374151', marginBottom: 2 }}>{f.type}</div>
                                <code style={{ fontSize: 11.5, color: '#dc2626', fontFamily: 'monospace', background: 'rgba(239,68,68,0.05)', padding: '1px 5px', borderRadius: 4 }}>{f.value}</code>
                              </div>
                              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                                <div style={{ fontSize: 10, color: '#94a3b8', marginBottom: 2 }}>脱敏后</div>
                                <code style={{ fontSize: 11, color: '#16a34a', fontFamily: 'monospace' }}>{f.masked}</code>
                              </div>
                            </motion.div>
                          ))}
                        </div>

                        <div style={{ marginTop: 14, padding: '10px 14px', background: '#f0fdf4', borderRadius: 10, border: '1px solid rgba(22,163,74,0.2)', fontSize: 12, color: '#15803d', lineHeight: 1.6 }}>
                          💡 <strong>操作建议</strong>：开启上方"脱敏效果"查看处理后版本；如需处理自有数据，请前往在线体验专区或预约专家咨询
                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Service Flow ───────────────────────────────────────────────────
function ServiceFlowSection() {
  const steps = [
    { icon: Database, color: '#8b5cf6', title: '全域数据采集', desc: '支持数据库直连、文档批量导入、API 流量镜像采集，统一接入各类数据源' },
    { icon: Brain, color: '#6366f1', title: '智能敏感识别', desc: 'AI 模型 + 正则双引擎协同，多模态识别，覆盖结构化与非结构化数据' },
    { icon: Shield, color: '#7c3aed', title: '风险合规判定', desc: '自动匹配《个保法》《网安法》等法律条款，标记高风险项并关联整改依据' },
    { icon: FileText, color: '#4f46e5', title: '审计报表输出', desc: '提供整改建议与优先级排序，一键导出 PDF/HTML 审计报告，支持留存备查' },
  ];

  return (
    <section style={{ background: '#fff', padding: '80px 0', borderTop: '1px solid #ede9fe' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 40px' }}>
        <ScrollReveal>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div style={{ display: 'inline-block', fontSize: 13, color: C.primary, textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 700, marginBottom: 12, padding: '4px 16px', background: '#ede9fe', borderRadius: 20 }}>
              核心服务流程
            </div>
            <h2 style={{ fontSize: 32, fontWeight: 900, color: '#0f172a', margin: '0 0 12px' }}>四步完成合规审查</h2>
            <p style={{ fontSize: 15, color: '#64748b' }}>从数据接入到报告输出，全程自动化，降低合规运营人力成本</p>
          </div>
        </ScrollReveal>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr auto 1fr auto 1fr', gap: 16, alignItems: 'center' }}>
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <React.Fragment key={i}>
                <ScrollReveal>
                  <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}
                    style={{ background: '#faf8ff', border: `1.5px solid ${step.color}22`, borderRadius: 18, padding: '28px 20px', textAlign: 'center', boxShadow: `0 4px 20px ${step.color}0a` }}>
                    <div style={{ width: 56, height: 56, borderRadius: 16, background: `${step.color}12`, border: `2px solid ${step.color}28`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                      <Icon style={{ width: 26, height: 26, color: step.color }} />
                    </div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: step.color, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>步骤 {String(i + 1).padStart(2, '0')}</div>
                    <div style={{ fontSize: 15, fontWeight: 800, color: '#0f172a', marginBottom: 10 }}>{step.title}</div>
                    <p style={{ fontSize: 12.5, color: '#64748b', lineHeight: 1.7, margin: 0 }}>{step.desc}</p>
                  </motion.div>
                </ScrollReveal>
                {i < steps.length - 1 && (
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <ArrowRight style={{ width: 22, height: 22, color: '#cbd5e1' }} />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ── Application Scenarios ──────────────────────────────────────────
type ScenarioTab = 'app' | 'internal' | 'thirdparty';

const SCENARIOS: Record<ScenarioTab, {
  icon: string; color: string; title: string; subtitle: string; desc: string;
  metrics: { v: string; l: string }[];
  tags: string[];
  mockRows: { col: string; val: string; flagged?: boolean }[];
}> = {
  app: {
    icon: '📱', color: '#8b5cf6',
    title: 'APP / 小程序上架前自查',
    subtitle: '避免被工信部通报下架，守住合规底线',
    desc: 'APP 在上架前必须通过工信部与各应用商店的隐私合规审查。本服务自动扫描 APP 收集的用户数据、日志文件及接口传输内容，识别过度采集、未申报字段等风险，出具符合《个人信息保护法》的自查报告，帮助研发团队在提交审核前消除隐患。',
    metrics: [{ v: '24h', l: '出具自查报告' }, { v: '100%', l: '法规条款覆盖' }, { v: '0成本', l: '无需专业合规顾问' }],
    tags: ['工信部合规', '应用商店审核', 'SDK 隐私检测', '接口数据核查'],
    mockRows: [
      { col: '地理位置', val: '后台持续采集', flagged: true },
      { col: '通讯录', val: '未申报但存在权限', flagged: true },
      { col: '设备ID', val: '已申报，合规采集', flagged: false },
      { col: '手机号', val: '用户主动提供', flagged: false },
    ],
  },
  internal: {
    icon: '🏢', color: '#6366f1',
    title: '企业内部数据资产盘点',
    subtitle: '摸清敏感数据家底，防止内部泄露',
    desc: '大量企业不清楚自身数据库、文件服务器、内部系统中存储了哪些敏感信息及其分布位置。本服务通过定期自动巡检，对全域数据资产进行分类分级标记，建立数据地图，帮助企业落实《数据安全法》"分类分级保护"要求，同时提升内部数据安全治理水平。',
    metrics: [{ v: '全域', l: '数据资产覆盖' }, { v: '自动', l: '定期巡检更新' }, { v: '数据地图', l: '可视化分布图' }],
    tags: ['数据分类分级', '内部审计', '数据地图构建', '等保三级'],
    mockRows: [
      { col: 'HR系统 · 员工档案', val: '18,240条含身份证', flagged: true },
      { col: 'CRM · 客户联系', val: '132,500条含手机号', flagged: true },
      { col: '财务 · 银行流水', val: '受控存储，已加密', flagged: false },
      { col: '营销 · 广告数据', val: '匿名化处理，合规', flagged: false },
    ],
  },
  thirdparty: {
    icon: '🤝', color: '#7c3aed',
    title: '第三方数据共享审计',
    subtitle: '确保合作方不滥用您的数据资产',
    desc: '与合作伙伴进行数据共享或购买第三方数据集时，必须确保共享数据不包含超范围的个人敏感信息。本服务在数据交换前对共享文件进行自动审查，识别超出约定共享范围的字段，出具合规审计报告，为双方建立数据共享的信任基础，规避违规处罚风险。',
    metrics: [{ v: '交换前', l: '主动拦截风险' }, { v: '字段级', l: '精细化核查粒度' }, { v: '双方存档', l: '合规凭证留存' }],
    tags: ['数据共享协议审查', '字段范围核验', '第三方合规尽调', '数据合同配套'],
    mockRows: [
      { col: '用户手机号', val: '超出共享协议范围', flagged: true },
      { col: '订单金额', val: '在约定共享范围内', flagged: false },
      { col: '购物行为标签', val: '已脱敏，符合要求', flagged: false },
      { col: '设备IMEI', val: '协议未授权字段', flagged: true },
    ],
  },
};

function ApplicationScenariosSection({ onStartTask }: { onStartTask: () => void }) {
  const [activeTab, setActiveTab] = useState<ScenarioTab>('app');
  const scenario = SCENARIOS[activeTab];

  return (
    <section style={{ background: '#f8fafc', padding: '80px 0', borderTop: '1px solid #e2e8f0' }}>
      <div style={{ maxWidth: 1160, margin: '0 auto', padding: '0 40px' }}>
        <ScrollReveal>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: C.primary, textTransform: 'uppercase', letterSpacing: '0.12em', margin: '0 0 10px' }}>应用场景</p>
            <h2 style={{ fontSize: 32, fontWeight: 800, color: '#0f172a', margin: '0 0 12px' }}>三大核心应用场景</h2>
            <p style={{ fontSize: 16, color: '#64748b' }}>从产品研发到数据治理，覆盖企业隐私合规全生命周期</p>
          </div>
        </ScrollReveal>

        {/* Tab buttons */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 4, marginBottom: 36, background: '#eef2f7', borderRadius: 12, padding: 4, width: 'fit-content', margin: '0 auto 36px' }}>
          {(Object.entries(SCENARIOS) as [ScenarioTab, typeof SCENARIOS[ScenarioTab]][]).map(([key, s]) => (
            <button key={key} onClick={() => setActiveTab(key)}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '10px 22px', borderRadius: 9, border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 700, transition: 'all 0.2s', background: activeTab === key ? s.color : 'transparent', color: activeTab === key ? '#fff' : '#64748b', boxShadow: activeTab === key ? `0 4px 14px ${s.color}45` : 'none' }}>
              {s.icon} {s.title.split('／')[0].substring(0, 10)}…
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.22 }}>
            <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 20, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
              <div style={{ height: 4, background: `linear-gradient(90deg,${scenario.color},${scenario.color}88)` }} />
              <div style={{ padding: '36px 40px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'start' }}>
                {/* Left */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                    <span style={{ fontSize: 28 }}>{scenario.icon}</span>
                    <span style={{ padding: '3px 10px', background: `${scenario.color}15`, border: `1px solid ${scenario.color}40`, borderRadius: 20, fontSize: 11, color: scenario.color, fontWeight: 700 }}>典型场景</span>
                  </div>
                  <h3 style={{ margin: '0 0 6px', fontSize: 22, fontWeight: 800, color: '#0f172a' }}>{scenario.title}</h3>
                  <p style={{ margin: '0 0 16px', fontSize: 13, color: scenario.color, fontWeight: 600 }}>{scenario.subtitle}</p>
                  <p style={{ margin: '0 0 24px', fontSize: 14, color: '#475569', lineHeight: 1.8 }}>{scenario.desc}</p>
                  <div style={{ display: 'flex', gap: 14, marginBottom: 22 }}>
                    {scenario.metrics.map(m => (
                      <div key={m.l} style={{ padding: '12px 14px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12, textAlign: 'center', flex: 1 }}>
                        <div style={{ fontSize: 16, fontWeight: 900, color: scenario.color }}>{m.v}</div>
                        <div style={{ fontSize: 11, color: '#64748b', marginTop: 3 }}>{m.l}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 24 }}>
                    {scenario.tags.map(t => (
                      <span key={t} style={{ padding: '4px 12px', background: '#f1f5f9', borderRadius: 20, fontSize: 12, color: '#475569', fontWeight: 500 }}>{t}</span>
                    ))}
                  </div>
                  {false && <button onClick={onStartTask}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '11px 22px', background: `linear-gradient(135deg,${scenario.color},${scenario.color}cc)`, color: '#fff', border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: 'pointer', boxShadow: `0 4px 16px ${scenario.color}35` }}>
                    <Play size={14} /> 立即在线体验
                  </button>}
                </div>

                {/* Right: mock preview */}
                <div>
                  <p style={{ margin: '0 0 14px', fontSize: 12, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>扫描结果预览</p>
                  <div style={{ background: '#f8fafc', borderRadius: 14, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                    <div style={{ padding: '12px 16px', borderBottom: '1px solid #e2e8f0', background: '#fff', display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Search size={13} style={{ color: '#94a3b8' }} />
                      <span style={{ fontSize: 12, color: '#64748b', fontFamily: 'monospace' }}>audit_scan_result.json</span>
                    </div>
                    {scenario.mockRows.map((row, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 16px', borderBottom: i < scenario.mockRows.length - 1 ? '1px solid #f1f5f9' : 'none', background: row.flagged ? 'rgba(239,68,68,0.03)' : 'transparent' }}>
                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: row.flagged ? '#ef4444' : '#22c55e', flexShrink: 0 }} />
                        <span style={{ flex: 1, fontSize: 13, color: '#0f172a', fontWeight: 500 }}>{row.col}</span>
                        <span style={{ fontSize: 12, color: row.flagged ? '#dc2626' : '#16a34a', background: row.flagged ? 'rgba(239,68,68,0.07)' : 'rgba(22,163,74,0.07)', padding: '3px 10px', borderRadius: 8 }}>{row.val}</span>
                      </div>
                    ))}
                    <div style={{ padding: '12px 16px', background: '#fff', borderTop: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: 12, color: '#94a3b8' }}>共 {scenario.mockRows.length} 个字段扫描完毕</span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: '#ef4444' }}>⚠ {scenario.mockRows.filter(r => r.flagged).length} 项需关注</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

// ── Lead Gen Form ──────────────────────────────────────────────────
function LeadFormSection() {
  const [form, setForm] = useState({ name: '', phone: '', company: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.company) return;
    const subject = encodeURIComponent('个人敏感信息审查专家咨询');
    const body = encodeURIComponent(`姓名：${form.name}\n电话：${form.phone}\n公司：${form.company}`);
    window.location.href = `mailto:contact@hzrongshu.cn?subject=${subject}&body=${body}`;
    setSubmitted(true);
  };

  return (
    <section style={{ background: 'linear-gradient(135deg,#EBF5FF 0%,#F0F4FF 50%,#EEF7FF 100%)', padding: '80px 0', borderTop: '1px solid #e2e8f0' }}>
      <div style={{ maxWidth: 640, margin: '0 auto', padding: '0 40px' }}>
        <ScrollReveal>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <h2 style={{ fontSize: 32, fontWeight: 900, color: '#0f172a', margin: '0 0 12px' }}>
              预约专家演示<br />
              <span style={{ background: 'linear-gradient(135deg,#8b5cf6,#7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>领取免费合规自查清单</span>
            </h2>
            <p style={{ fontSize: 15, color: '#64748b', lineHeight: 1.7 }}>
              留下联系方式，我们的专家团队将在 24 小时内联系您，提供定制化的个人信息合规评估方案。
            </p>
          </div>
        </ScrollReveal>

        {submitted ? (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            style={{ background: '#fff', border: '2px solid rgba(139,92,246,0.25)', borderRadius: 20, padding: '48px 32px', textAlign: 'center', boxShadow: '0 8px 40px rgba(139,92,246,0.12)' }}>
            <CheckCircle2 size={48} style={{ color: '#8b5cf6', margin: '0 auto 16px' }} />
            <h3 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', margin: '0 0 10px' }}>请在邮件客户端确认发送</h3>
            <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.7, margin: 0 }}>
              咨询信息已整理至邮件正文；发送后合规顾问会与您联系，并提供相应的合规自查资料。
            </p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit}
            style={{ background: '#fff', border: '1.5px solid rgba(139,92,246,0.18)', borderRadius: 20, padding: '40px 36px', boxShadow: '0 8px 40px rgba(139,92,246,0.1)' }}>
            {[
              { key: 'name', label: '您的姓名', placeholder: '请输入姓名', icon: User },
              { key: 'phone', label: '联系电话', placeholder: '请输入手机号', icon: Phone },
              { key: 'company', label: '所在公司', placeholder: '请输入公司名称', icon: Building },
            ].map(field => {
              const Icon = field.icon;
              return (
                <div key={field.key} style={{ marginBottom: 20 }}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 8 }}>
                    {field.label} <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Icon size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input
                      value={form[field.key as keyof typeof form]}
                      onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))}
                      placeholder={field.placeholder}
                      style={{ width: '100%', padding: '11px 14px 11px 40px', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: 14, outline: 'none', boxSizing: 'border-box', transition: 'border 0.2s' }}
                      onFocus={e => (e.target.style.borderColor = '#8b5cf6')}
                      onBlur={e => (e.target.style.borderColor = '#e2e8f0')}
                    />
                  </div>
                </div>
              );
            })}

            <button type="submit"
              style={{ width: '100%', padding: '14px', border: 'none', borderRadius: 12, background: 'linear-gradient(135deg,#8b5cf6,#7c3aed)', color: '#fff', fontSize: 15, fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 20px rgba(139,92,246,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <Calendar size={17} /> 预约专家演示
            </button>
            <p style={{ margin: '14px 0 0', fontSize: 12, color: '#94a3b8', textAlign: 'center' }}>
              您的信息将受到严格保护，不会用于其他用途 · 符合《个人信息保护法》要求
            </p>
          </form>
        )}
      </div>
    </section>
  );
}

// ── Main Page Export ───────────────────────────────────────────────
export function PrivacyDataAudit() {
  const openExperience = () => {
    window.open('/online-experience?tab=privacy', '_blank', 'noopener,noreferrer');
  };

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const CAPABILITY_PANELS = [
    {
      id: '01', side: 'left' as const, color: '#8b5cf6',
      panelBg: 'linear-gradient(145deg,#faf5ff,#f3e8ff)',
      title: '多模态识别能力',
      icon: Search,
      heading: '不止于文字，图片与表格中的隐私同样无处遁形',
      desc: '不仅识别结构化数据库字段，还能借助 OCR 技术从扫描件、截图中提取敏感信息，同时深度解析 Word、PDF、Excel 等非结构化文档，实现全格式无死角覆盖。',
      tags: ['OCR 图片识别', 'PDF 全文解析', 'Excel 字段感知', '非结构化文本'],
      panel: <MultiModalPanel />,
    },
    {
      id: '02', side: 'right' as const, color: '#6366f1',
      panelBg: 'linear-gradient(145deg,#eef2ff,#e0e7ff)',
      title: '内置丰富规则库',
      icon: Database,
      heading: '预置常见敏感信息规则，支持按业务扩展',
      desc: '覆盖身份证号、手机号、银行卡、邮箱、住址等常见敏感信息类型，并支持自定义正则与行业规则扩展，便于结合实际审查范围进行配置。',
      tags: ['常见信息规则', '自定义正则', '行业模板', '按需启用'],
      panel: <RuleLibraryPanel />,
    },
    {
      id: '03', side: 'left' as const, color: '#7c3aed',
      panelBg: 'linear-gradient(145deg,#fdf4ff,#f0e8ff)',
      title: '低误报率算法',
      icon: Brain,
      heading: '上下文语境分析，不再被假阳性所困扰',
      desc: '结合语义理解，将敏感信息候选词还原至原始上下文中综合判断，辅助区分合同编号与身份证号、系统 ID 与手机号等易混淆场景，并保留候选依据供人工复核。',
      tags: ['语义上下文理解', '误报智能过滤', '置信度评估', '人工规则豁免'],
      panel: <LowFalsePositivePanel />,
    },
    {
      id: '04', side: 'right' as const, color: '#4f46e5',
      panelBg: 'linear-gradient(145deg,#eff6ff,#e0e7ff)',
      title: '自动化定期巡检',
      icon: RefreshCw,
      heading: '定时任务持续监控，数据变化第一时间感知',
      desc: '支持对接数据库、文档存储、API 日志等多类数据源，配置定时巡检任务后自动按增量模式扫描，新增或修改的数据优先检测，发现风险立即告警通知，从被动合规转向主动防御。',
      tags: ['定时任务配置', '增量扫描模式', '多数据源接入', '告警通知'],
      panel: <ScheduledScanPanel />,
    },
  ];

  return (
    <div className="min-h-screen bg-white">

      {/* ── 1. Hero ────────────────────────────────────────────── */}
      <section className="product-detail-hero relative overflow-hidden bg-[#060e1d]" style={{ padding: '80px 48px 72px' }}>
        <ProductHeroBackground side="data" concept="privacy" />

        <div style={{ maxWidth: 1160, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
            <motion.div initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '5px 14px', background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.35)', borderRadius: 20, fontSize: 12, color: '#c4b5fd', fontWeight: 700, marginBottom: 20 }}>
                <Shield size={13} /> 数据智能
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-[2.7rem] font-black" style={{ color: '#fff', margin: '0 0 18px', lineHeight: 1.15, letterSpacing: '-0.02em' }}>
                个人敏感信息<br />
                <span style={{ background: 'linear-gradient(135deg,#a78bfa,#818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>自动化审查服务</span>
              </h1>
              <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.65)', lineHeight: 1.8, margin: '0 0 32px', maxWidth: 480 }}>
                基于 AI 语义分析技术，精准识别身份证、手机号、银行卡等敏感数据，一键生成合规审计报告，助力企业满足《个人信息保护法》合规要求。
              </p>
              <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 40 }}>
                {false && <button onClick={openExperience}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 9, padding: '13px 28px', background: 'linear-gradient(135deg,#8b5cf6,#7c3aed)', color: '#fff', border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: 'pointer', boxShadow: '0 6px 24px rgba(139,92,246,0.4)' }}>
                  <Play size={16} /> 立即在线体验
                </button>}
              </div>
              <div style={{ display: 'flex', gap: 24, paddingTop: 20, borderTop: '1px solid rgba(71,104,139,0.18)' }}>
                {[{ v: '多类型', l: '敏感信息识别' }, { v: '语义级', l: '上下文判断' }, { v: '可配置', l: '规则与范围' }, { v: '可追溯', l: '审计结果' }].map(s => (
                  <div key={s.l} style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 18, fontWeight: 900, color: '#a78bfa' }}>{s.v}</div>
                    <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>{s.l}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Hero right: glassmorphism card preview */}
            <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.15 }}
              style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {/* Main preview card */}
              <div style={{ background: 'rgba(33,86,135,0.78)', backdropFilter: 'blur(20px)', borderRadius: 20, padding: '22px 24px', border: '1.5px solid rgba(255,255,255,0.42)', boxShadow: '0 24px 56px rgba(31,78,121,0.22)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }} />
                  <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.78)', fontFamily: 'monospace' }}>privacy_scan · 实时识别中</span>
                  <span style={{ marginLeft: 'auto', padding: '2px 8px', background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.4)', borderRadius: 8, fontSize: 10, color: '#f87171', fontWeight: 700 }}>发现 4 处风险</span>
                </div>
                <div style={{ background: 'rgba(8,41,77,0.38)', borderRadius: 10, padding: '12px 14px', marginBottom: 14, fontSize: 12, lineHeight: 1.8, color: 'rgba(255,255,255,0.94)', fontFamily: 'monospace' }}>
                  用户<span style={{ background: 'rgba(139,92,246,0.25)', color: '#c4b5fd', padding: '1px 4px', borderRadius: 3, fontWeight: 700 }}>张三</span>（身份证：<span style={{ background: 'rgba(239,68,68,0.15)', color: '#f87171', padding: '1px 4px', borderRadius: 3, fontWeight: 700 }}>110101199001011234</span>）手机 <span style={{ background: 'rgba(239,68,68,0.15)', color: '#f87171', padding: '1px 4px', borderRadius: 3, fontWeight: 700 }}>13800138000</span>…
                </div>
                {[
                  { type: '身份证号', risk: '高危', color: '#ef4444' },
                  { type: '手机号码', risk: '高危', color: '#ef4444' },
                  { type: '姓名', risk: '中危', color: '#d97706' },
                  { type: '电子邮箱', risk: '中危', color: '#d97706' },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 0', borderBottom: i < 3 ? '1px solid rgba(255,255,255,0.07)' : 'none' }}>
                    <div style={{ width: 5, height: 5, borderRadius: '50%', background: item.color, flexShrink: 0 }} />
                    <span style={{ flex: 1, fontSize: 12, color: 'rgba(255,255,255,0.75)' }}>{item.type}</span>
                    <span style={{ fontSize: 11, padding: '2px 8px', background: `${item.color}20`, borderRadius: 8, color: item.color, fontWeight: 700 }}>{item.risk}</span>
                  </div>
                ))}
              </div>
              {/* Small law tags */}
              <div style={{ display: 'flex', gap: 8 }}>
                {['个保法·第10条', '网安法·第42条', '数安法·第27条'].map(tag => (
                  <span key={tag} style={{ flex: 1, textAlign: 'center', padding: '8px 10px', background: 'rgba(33,86,135,0.68)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.30)', fontSize: 11, color: '#fff', fontWeight: 600 }}>{tag}</span>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <StickySubNav items={[
        { id: 'pda-compliance', label: '合规依据' },
        { id: 'pda-capability', label: '核心能力矩阵' },
        { id: 'pda-demo', label: '效果预览' },
        { id: 'pda-flow', label: '服务流程' },
        { id: 'pda-scenarios', label: '应用场景' },
      ]} />

      {/* ── 2. Compliance Basis ────────────────────────────────── */}
      <section id="pda-compliance" style={{ background: '#fff', padding: '72px 48px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <ScrollReveal>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <div style={{ display: 'inline-block', fontSize: 13, color: C.primary, textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 700, marginBottom: 12, padding: '4px 16px', background: '#ede9fe', borderRadius: 20 }}>合规依据</div>
              <h2 style={{ fontSize: 32, fontWeight: 900, color: '#0f172a', margin: '0 0 12px' }}>为什么您需要这项服务？</h2>
              <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 28 }}>
                {['面临监管处罚风险？', '担心敏感数据泄露？', '不清楚数据资产边界？'].map(pain => (
                  <span key={pain} style={{ padding: '7px 18px', background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 20, fontSize: 13, color: '#ef4444', fontWeight: 600 }}>⚠ {pain}</span>
                ))}
              </div>
            </div>
          </ScrollReveal>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
            {LAWS.map((law, i) => (
              <ScrollReveal key={i}>
                <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}
                  style={{ padding: '24px 20px', background: '#faf8ff', border: `1.5px solid ${law.color}20`, borderRadius: 16, borderTop: `4px solid ${law.color}`, textAlign: 'center' }}>
                  <div style={{ width: 52, height: 52, borderRadius: 16, background: `${law.color}10`, border: `2px solid ${law.color}28`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
                    <span style={{ fontSize: 14, fontWeight: 900, color: law.color }}>{law.abbr}</span>
                  </div>
                  <div style={{ fontSize: 13.5, fontWeight: 800, color: '#0f172a', marginBottom: 4, lineHeight: 1.4 }}>{law.name}</div>
                  <div style={{ fontSize: 11, color: law.color, fontWeight: 700, marginBottom: 10 }}>{law.year}</div>
                  <p style={{ fontSize: 12, color: '#64748b', lineHeight: 1.7, margin: 0 }}>{law.desc}</p>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>

          <div style={{ marginTop: 32, padding: '20px 28px', background: 'linear-gradient(135deg,rgba(139,92,246,0.07),rgba(99,102,241,0.05))', borderRadius: 16, border: '1px solid rgba(139,92,246,0.15)', display: 'flex', alignItems: 'center', gap: 16 }}>
            <AlertTriangle size={22} style={{ color: '#d97706', flexShrink: 0 }} />
            <p style={{ margin: 0, fontSize: 14, color: '#475569', lineHeight: 1.7 }}>
              违规处罚可达 <strong style={{ color: '#ef4444' }}>5,000 万元人民币或前一年度营业额 5%</strong>（取较高者）。专项整改经历将被公开通报，严重影响企业声誉与市场信用。主动合规审查，远比被动整改成本低。
            </p>
          </div>
        </div>
      </section>

      {/* ── 3. Core Capability Matrix ────────────────────────── */}
      <section id="pda-capability" style={{ background: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: 1160, margin: '0 auto', padding: '80px 40px 100px' }}>
          <ScrollReveal>
            <div style={{ textAlign: 'center', marginBottom: 64 }}>
              <div style={{ display: 'inline-block', fontSize: 13, color: C.primary, textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 700, marginBottom: 12, padding: '4px 16px', background: 'rgba(139,92,246,0.08)', borderRadius: 20 }}>
                核心能力矩阵
              </div>
              <h2 style={{ fontSize: 'clamp(28px,3.5vw,44px)', fontWeight: 900, color: '#0f172a', margin: '0 0 12px' }}>全方位敏感信息识别引擎</h2>
              <p style={{ fontSize: 15, color: '#64748b', margin: 0 }}>从多模态识别到自动化巡检，构建企业隐私合规防护体系</p>
            </div>
          </ScrollReveal>

          {CAPABILITY_PANELS.map((panel, idx) => {
            const isLeft = panel.side === 'left';
            const Icon = panel.icon;
            return (
              <ScrollReveal key={panel.id}>
                <div style={{ display: 'grid', gridTemplateColumns: isLeft ? '3fr 2fr' : '2fr 3fr', gap: 52, alignItems: 'center', marginTop: idx === 0 ? 0 : 56 }}>
                  {/* Panel visual */}
                  <div style={{ order: isLeft ? 0 : 1 }}>
                    <div style={{ background: panel.panelBg, borderRadius: 22, padding: '36px 32px', position: 'relative', overflow: 'hidden', boxShadow: `0 16px 56px ${panel.color}12, 0 4px 16px rgba(0,0,0,0.05)`, border: `1.5px solid ${panel.color}22` }}>
                      <div style={{ position: 'absolute', top: -12, left: 16, fontSize: 120, fontWeight: 900, color: `${panel.color}15`, lineHeight: 1, userSelect: 'none', fontFamily: 'monospace' }}>{panel.id}</div>
                      <div style={{ position: 'relative', zIndex: 1 }}>{panel.panel}</div>
                    </div>
                  </div>
                  {/* Text content */}
                  <div style={{ order: isLeft ? 1 : 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                      <div style={{ width: 36, height: 36, borderRadius: 10, background: `${panel.color}12`, border: `1.5px solid ${panel.color}28`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Icon style={{ width: 18, height: 18, color: panel.color }} />
                      </div>
                      <div style={{ fontSize: 15, color: panel.color, letterSpacing: '0.04em', fontWeight: 800 }}>功能 {panel.id} · {panel.title}</div>
                    </div>
                    <h3 style={{ fontSize: 23, fontWeight: 800, color: '#0f172a', margin: '0 0 16px', lineHeight: 1.35 }}>{panel.heading}</h3>
                    <p style={{ fontSize: 14.5, color: '#64748b', lineHeight: 1.8, margin: '0 0 24px' }}>{panel.desc}</p>
                    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(panel.tags.length, 4)}, minmax(0, 1fr))`, gap: 8 }}>
                      {panel.tags.map(t => (
                        <span key={t} style={{ fontSize: 11, padding: '6px 8px', borderRadius: 20, background: `${panel.color}10`, color: panel.color, border: `1px solid ${panel.color}25`, fontWeight: 600, textAlign: 'center', whiteSpace: 'nowrap' }}>{t}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </section>

      {/* ── 4. Interactive Demo ──────────────────────────────── */}
      <div id="pda-demo"><InteractiveDemoSection /></div>

      {/* ── 5. Service Flow ──────────────────────────────────── */}
      <div id="pda-flow"><ServiceFlowSection /></div>

      {/* ── 6. Application Scenarios ─────────────────────────── */}
      <div id="pda-scenarios"><ApplicationScenariosSection onStartTask={openExperience} /></div>

      {/* ── 7. Lead Gen Form ─────────────────────────────────── */}

    </div>
  );
}
