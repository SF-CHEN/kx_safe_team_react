import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { ProductHeroBackground } from '../components/ProductHeroBackground';
import { ScrollReveal } from '../components/ScrollReveal';
import { StickySubNav } from '../components/StickySubNav';
import {
  Shield, Cpu, Radio, Eye, AlertTriangle, CheckCircle,
  Play, FileText, ChevronRight, Zap, Target, Activity,
  Navigation, Home, Factory, Lock, User, Plus,
} from 'lucide-react';

// ── Types ────────────────────────────────────────────────────────────
type AttackType = 'laser' | 'noise' | 'gps' | 'patch';
type SceneTab = 'industrial' | 'patrol' | 'home';

// ── Data ─────────────────────────────────────────────────────────────
const HERO_STATS = [
  { value: '98', label: '安全评分', unit: '' },
  { value: '95', label: '任务成功率', unit: '%' },
  { value: '<2s', label: '响应延迟阈值', unit: '' },
  { value: '3层', label: '全链路覆盖', unit: '' },
];

const CAPABILITY_ITEMS = [
  {
    id: '01', color: '#3b82f6', panelBg: 'linear-gradient(145deg,#f0f7ff,#e8f1fd)',
    badge: '功能性评测',
    title: '全链路功能性评测',
    subtitle: 'Functional Benchmarking',
    tags: ['机械臂应用', '机器狗应用'],
    desc: '覆盖从基础移动导航、物体识别到复杂任务拆解的全流程。支持多场景（家庭、工厂、户外）下的泛化能力测试，量化具身智能在真实工况下的综合表现。',
    metrics: ['任务成功率', '操作精度', '响应延迟', '长尾场景适应性'],
    visual: (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {[
          { icon: <Navigation size={20} />, label: '移动导航', val: '97.3%', color: '#3b82f6' },
          { icon: <Target size={20} />, label: '物体识别', val: '99.1%', color: '#6366f1' },
          { icon: <Activity size={20} />, label: '任务完成', val: '94.8%', color: '#0ea5e9' },
          { icon: <Zap size={20} />, label: '响应速度', val: '1.2s', color: '#8b5cf6' },
        ].map((m, i) => (
          <div key={i} style={{ background: 'rgba(59,130,246,0.06)', borderRadius: 14, padding: '16px', border: '1px solid rgba(59,130,246,0.12)', textAlign: 'center' }}>
            <div style={{ color: m.color, marginBottom: 6 }}>{m.icon}</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: m.color, lineHeight: 1 }}>{m.val}</div>
            <div style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>{m.label}</div>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: '02', color: '#ef4444', panelBg: 'linear-gradient(145deg,#fff5f5,#fee2e2)',
    badge: '安全评测',
    title: '原生安全与对抗测试',
    subtitle: 'Safety & Adversarial Testing',
    tags: ['机械臂安全', '机器狗安全'],
    desc: '独家"红队测试"能力。模拟超声波攻击、激光投影干扰、GPS信号劫持等物理世界攻击，验证系统的鲁棒性与故障恢复能力。真实攻击场景 100% 还原。',
    metrics: ['抗干扰阈值', '故障恢复时间', '安全合规性', '红队对抗得分'],
    visual: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {[
          { attack: '激光投影干扰', resist: 78, color: '#ef4444' },
          { attack: '超声波攻击', resist: 91, color: '#f97316' },
          { attack: 'GPS信号劫持', resist: 65, color: '#eab308' },
          { attack: '对抗补丁', resist: 84, color: '#8b5cf6' },
        ].map((row, i) => (
          <div key={i}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4, color: '#374151' }}>
              <span>{row.attack}</span>
              <span style={{ fontWeight: 700, color: row.color }}>{row.resist}%</span>
            </div>
            <div style={{ height: 6, borderRadius: 99, background: '#f1f5f9', overflow: 'hidden' }}>
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${row.resist}%` }}
                transition={{ duration: 0.8, delay: i * 0.1 }}
                style={{ height: '100%', borderRadius: 99, background: `linear-gradient(90deg,${row.color},${row.color}99)` }}
              />
            </div>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: '03', color: '#10b981', panelBg: 'linear-gradient(145deg,#f0fdf6,#e8f8f0)',
    badge: '传感器诊断',
    title: '多维传感器健康度诊断',
    subtitle: 'Sensor Health Diagnosis',
    tags: ['视觉', '听觉/距离', '触觉', 'GPS/惯性单元'],
    desc: '针对具身智能的"五官"进行专项体检。检测传感器漂移、噪声敏感度及多模态数据一致性，提前发现潜在失效点，确保在复杂工况下的感知可靠性。',
    metrics: ['信噪比容忍度', '多源数据融合一致性', '传感器漂移率', '响应延迟波动'],
    visual: (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
        {[
          { label: '视觉', icon: <Eye size={16} />, status: 'normal', score: 96 },
          { label: '听觉', icon: <Radio size={16} />, status: 'normal', score: 88 },
          { label: '距离', icon: <Target size={16} />, status: 'warn', score: 72 },
          { label: '触觉', icon: <Activity size={16} />, status: 'normal', score: 94 },
          { label: 'GPS', icon: <Navigation size={16} />, status: 'warn', score: 61 },
          { label: '惯性', icon: <Zap size={16} />, status: 'normal', score: 98 },
        ].map((s, i) => {
          const isWarn = s.status === 'warn';
          return (
            <div key={i} style={{ background: isWarn ? 'rgba(245,158,11,0.08)' : 'rgba(16,185,129,0.06)', borderRadius: 12, padding: '12px 8px', border: `1px solid ${isWarn ? 'rgba(245,158,11,0.25)' : 'rgba(16,185,129,0.15)'}`, textAlign: 'center' }}>
              <div style={{ color: isWarn ? '#f59e0b' : '#10b981', marginBottom: 4 }}>{s.icon}</div>
              <div style={{ fontSize: 11, color: '#374151', fontWeight: 600 }}>{s.label}</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: isWarn ? '#f59e0b' : '#10b981', marginTop: 2 }}>{s.score}</div>
            </div>
          );
        })}
      </div>
    ),
  },
];

const PROCESS_STEPS = [
  { n: '01', title: '需求对齐', desc: '明确评测对象（机械臂/机器狗/人形机器人）及关注维度（功能/安全）', icon: <Target size={20} /> },
  { n: '02', title: '环境部署', desc: '仿真轨：高精度物理引擎注入随机扰动；真机轨：标准化测试场或远程真机接入', icon: <Cpu size={20} /> },
  { n: '03', title: '自动化执行', desc: '运行全链路测试脚本 + 专家级红队对抗测试', icon: <Play size={20} /> },
  { n: '04', title: '数据分析', desc: '基于"智能度、安全度、匹配度、一致性"四维模型计算综合得分', icon: <Activity size={20} /> },
  { n: '05', title: '报告交付', desc: '输出包含"能力得分 + 短板分析 + 优化建议"的三位一体报告', icon: <FileText size={20} /> },
];

const SCENES: Record<SceneTab, { icon: React.ReactNode; title: string; en: string; color: string; painPoint: string; solution: string; tags: string[] }> = {
  industrial: {
    icon: <Factory size={28} />, title: '工业制造', en: 'Industrial Manufacturing',
    color: '#3b82f6',
    painPoint: '杂乱环境下的抓取失败率高，生产线良率受损',
    solution: '针对机械臂的"姿态调整抓取"与"任务拆解"进行压力测试，确保生产线良率',
    tags: ['机械臂评测', '抓取精度', '任务拆解', '压力测试'],
  },
  patrol: {
    icon: <Shield size={28} />, title: '安防巡检', en: 'Security Patrol',
    color: '#8b5cf6',
    painPoint: '机器狗易受环境干扰导致迷路或被恶意诱导失控',
    solution: '针对机器狗的"多场景导航建图"与"GPS/视觉抗干扰"进行测试，防止被恶意诱导',
    tags: ['机器狗评测', '导航建图', 'GPS抗干扰', '视觉鲁棒性'],
  },
  home: {
    icon: <Home size={28} />, title: '家庭服务', en: 'Home Service',
    color: '#10b981',
    painPoint: '人机协作安全性未验证，存在误伤风险',
    solution: '重点测试"触觉反馈灵敏度"与"紧急避障能力"，确保不伤人、不损物',
    tags: ['人机协作', '触觉评测', '紧急避障', '安全距离'],
  },
};

const ATTACK_OPTIONS: { key: AttackType; label: string; icon: React.ReactNode; color: string; desc: string }[] = [
  { key: 'laser', label: '激光视觉干扰', icon: <Eye size={16} />, color: '#f59e0b', desc: '致盲摄像头，降低识别置信度' },
  { key: 'noise', label: '超声波噪声注入', icon: <Radio size={16} />, color: '#f97316', desc: '干扰声学传感器和语音指令' },
  { key: 'gps', label: 'GPS信号屏蔽', icon: <Navigation size={16} />, color: '#8b5cf6', desc: '造成惯性导航漂移，路径失效' },
  { key: 'patch', label: '对抗补丁投放', icon: <Shield size={16} />, color: '#ef4444', desc: '欺骗视觉模型，触发误分类' },
];

// ── Component ─────────────────────────────────────────────────────────
export function EmbodiedIntelligence() {
  const [activeScene, setActiveScene] = useState<SceneTab>('industrial');
  const [attacks, setAttacks] = useState<Set<AttackType>>(new Set());
  const [showReport, setShowReport] = useState(false);
  const [formData, setFormData] = useState({ name: '', company: '', robot: 'arm', contact: '' });

  const toggleAttack = (key: AttackType) => {
    const next = new Set(attacks);
    if (next.has(key)) { next.delete(key); } else { next.add(key); }
    setAttacks(next);
    setShowReport(next.size > 0);
  };

  const isAttacked = attacks.size > 0;
  const scene = SCENES[activeScene];
  const bookingReady = Boolean(formData.name.trim() && formData.company.trim() && formData.contact.trim());
  const sendBooking = () => {
    if (!bookingReady) return;
    const robotLabels: Record<string, string> = { arm: '机械臂', quadruped: '四足机器人', wheeled: '轮式机器人', humanoid: '人形机器人' };
    const subject = encodeURIComponent('具身智能可信评测预约');
    const body = encodeURIComponent(`姓名：${formData.name}\n公司：${formData.company}\n机器人类型：${robotLabels[formData.robot] || formData.robot}\n联系方式：${formData.contact}`);
    window.location.href = `mailto:contact@hzrongshu.cn?subject=${subject}&body=${body}`;
  };

  return (
    <div style={{ minHeight: '100vh', background: '#fff' }}>

      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section className="product-detail-hero product-detail-hero--reference-height relative overflow-hidden" style={{ background: '#060e1d', minHeight: 600, display: 'flex', alignItems: 'center' }}>
        <ProductHeroBackground side="model" concept="embodied" />
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 48px', position: 'relative', zIndex: 10, width: '100%' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 420px', gap: 48, alignItems: 'center' }}>
            <motion.div initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 14px', borderRadius: 99, background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)', marginBottom: 16 }}>
                <Cpu size={13} style={{ color: '#34d399' }} />
                <span style={{ color: '#34d399', fontSize: 12, fontWeight: 700, letterSpacing: '0.06em' }}>具身智能 · 可信评测</span>
              </div>
              <h1 style={{ color: '#fff', fontSize: 'clamp(1.75rem,3.5vw,2.7rem)', fontWeight: 900, lineHeight: 1.25, letterSpacing: '-0.02em', marginBottom: 14 }}>
                具身智能全链路<br />
                <span style={{ background: 'linear-gradient(90deg,#34d399,#60a5fa,#a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  可信评测与安全验证
                </span>平台
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.72)', fontSize: 15, lineHeight: 1.8, maxWidth: 560, marginBottom: 20 }}>
                聚焦物理交互中的感知欺骗与控制漏洞，提供覆盖"感知-决策-执行"闭环的标准化测评服务，确保智能体在复杂环境下的作业可靠性与人机安全性。
              </p>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 20 }}>
                <Button size="lg" onClick={() => document.getElementById('ei-cta')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                  style={{ background: 'linear-gradient(135deg,#10b981,#059669)', border: 'none', color: '#fff', fontWeight: 700, boxShadow: '0 0 24px rgba(16,185,129,0.4)' }}>
                  <Plus size={16} style={{ marginRight: 6 }} />预约实机评测
                </Button>
              </div>
              <div style={{ display: 'flex', gap: 24, paddingTop: 16, borderTop: '1px solid rgba(71,104,139,0.18)' }}>
                {HERO_STATS.map((s, i) => (
                  <div key={i} style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 24, fontWeight: 900, color: '#1e293b', lineHeight: 1 }}>{s.value}{s.unit}</div>
                    <div style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Hero right — Robot silhouette + live data overlay */}
            <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
              <div style={{ position: 'relative', borderRadius: 24, overflow: 'hidden', background: 'linear-gradient(135deg,rgba(25,101,116,0.48),rgba(39,91,145,0.42))', border: '1px solid rgba(255,255,255,0.36)', padding: '32px 24px', boxShadow: '0 20px 48px rgba(35,86,128,0.18)' }}>
                {/* Animated grid bg */}
                <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.08 }}>
                  <defs><pattern id="grid-ei" width="32" height="32" patternUnits="userSpaceOnUse"><path d="M 32 0 L 0 0 0 32" fill="none" stroke="#34d399" strokeWidth="0.5"/></pattern></defs>
                  <rect width="100%" height="100%" fill="url(#grid-ei)" />
                </svg>
                {/* Robot visualization */}
                <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
                  <div style={{ width: 140, height: 140, borderRadius: '50%', background: 'linear-gradient(135deg,rgba(16,185,129,0.2),rgba(96,165,250,0.15))', border: '2px solid rgba(16,185,129,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', boxShadow: '0 0 40px rgba(16,185,129,0.2)' }}>
                    <Cpu size={64} style={{ color: '#34d399' }} />
                  </div>
                  <div style={{ fontSize: 13, color: '#34d399', fontWeight: 700, marginBottom: 16 }}>实时评测监控</div>
                  {/* Sensor readouts */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {[
                      { label: '视觉传感器', value: 'NORMAL', color: '#34d399' },
                      { label: '运动控制器', value: 'ACTIVE', color: '#60a5fa' },
                      { label: '安全模块', value: 'ARMED', color: '#a78bfa' },
                    ].map((row, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', borderRadius: 8, background: 'rgba(8,41,77,0.20)', border: '1px solid rgba(255,255,255,0.14)' }}>
                        <span style={{ color: 'rgba(255,255,255,0.86)', fontSize: 12 }}>{row.label}</span>
                        <span style={{ color: row.color, fontSize: 12, fontWeight: 700 }}>● {row.value}</span>
                      </div>
                    ))}
                  </div>
                  {/* Score badge */}
                  <div style={{ marginTop: 16, padding: '10px 20px', borderRadius: 12, background: 'linear-gradient(135deg,rgba(16,185,129,0.2),rgba(16,185,129,0.08))', border: '1px solid rgba(16,185,129,0.3)', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                    <CheckCircle size={16} style={{ color: '#34d399' }} />
                    <span style={{ color: '#34d399', fontWeight: 700, fontSize: 13 }}>综合安全评分 98 / 100</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Sticky SubNav ─────────────────────────────────────────── */}
      <StickySubNav items={[
        { id: 'ei-capability', label: '核心能力矩阵' },
        { id: 'ei-demo', label: '虚拟攻防沙盘' },
        { id: 'ei-process', label: '服务流程' },
        { id: 'ei-scenarios', label: '应用场景' },
        { id: 'ei-cta', label: '预约评测' },
      ]} />

      {/* ── 核心能力矩阵 ───────────────────────────────────────────── */}
      <section id="ei-capability" style={{ background: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: 1160, margin: '0 auto', padding: '80px 40px 100px' }}>
          <ScrollReveal>
            <div style={{ textAlign: 'center', marginBottom: 64 }}>
              <div style={{ display: 'inline-block', fontSize: 13, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 700, marginBottom: 12, padding: '4px 16px', background: '#ecfdf5', borderRadius: 20 }}>
                核心能力矩阵
              </div>
              <h2 style={{ fontSize: 'clamp(28px,3.5vw,44px)', fontWeight: 900, color: '#0f172a', margin: '0 0 12px' }}>
                全面覆盖具身智能安全威胁
              </h2>
              <p style={{ fontSize: 15, color: '#64748b', margin: 0 }}>
                从功能性基准到红队对抗，构建覆盖"感知-决策-执行"的完整评测防线
              </p>
            </div>
          </ScrollReveal>

          {CAPABILITY_ITEMS.map((cap, idx) => {
            const isLeft = idx % 2 === 0;
            return (
              <ScrollReveal key={cap.id}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: isLeft ? '3fr 2fr' : '2fr 3fr',
                  gap: 52, alignItems: 'center',
                  marginTop: idx === 0 ? 0 : 64,
                }}>
                  {/* Text side */}
                  <div style={{ order: isLeft ? 1 : 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                      <span style={{ fontSize: 11, fontWeight: 800, color: cap.color, textTransform: 'uppercase', letterSpacing: '0.12em', padding: '3px 10px', background: `${cap.color}12`, borderRadius: 99, border: `1px solid ${cap.color}30` }}>
                        功能 {cap.id}
                      </span>
                      <span style={{ fontSize: 11, color: '#94a3b8' }}>{cap.subtitle}</span>
                    </div>
                    <h3 style={{ fontSize: 26, fontWeight: 900, color: '#0f172a', margin: '0 0 8px' }}>{cap.title}</h3>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
                      {cap.tags.map(t => (
                        <span key={t} style={{ fontSize: 11, padding: '3px 10px', borderRadius: 99, background: `${cap.color}10`, border: `1px solid ${cap.color}25`, color: cap.color, fontWeight: 600 }}>{t}</span>
                      ))}
                    </div>
                    <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.8, margin: '0 0 20px' }}>{cap.desc}</p>
                    <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: 16 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>关键指标</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                        {cap.metrics.map(m => (
                          <span key={m} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#374151', padding: '4px 10px', borderRadius: 8, background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                            <CheckCircle size={12} style={{ color: cap.color }} />{m}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  {/* Visual panel */}
                  <div style={{ order: isLeft ? 0 : 1 }}>
                    <div style={{
                      background: cap.panelBg, borderRadius: 22, padding: '32px',
                      boxShadow: `0 16px 56px ${cap.color}12, 0 4px 16px rgba(0,0,0,0.05)`,
                      border: `1.5px solid ${cap.color}22`, overflow: 'hidden', position: 'relative',
                    }}>
                      <div style={{ position: 'absolute', top: -8, left: 12, fontSize: 100, fontWeight: 900, color: `${cap.color}10`, lineHeight: 1, userSelect: 'none', fontFamily: 'monospace' }}>{cap.id}</div>
                      <div style={{ position: 'relative', zIndex: 1 }}>{cap.visual}</div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </section>

      {/* ── 虚拟攻防沙盘 ───────────────────────────────────────────── */}
      <section id="ei-demo" style={{ background: '#F2F5F9', padding: '80px 0' }}>
        <div style={{ maxWidth: 1160, margin: '0 auto', padding: '0 40px' }}>
          <ScrollReveal>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <div style={{ display: 'inline-block', fontSize: 13, color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 700, marginBottom: 12, padding: '4px 16px', background: '#eff6ff', borderRadius: 20 }}>
                效果预览
              </div>
              <h2 style={{ fontSize: 'clamp(26px,3vw,38px)', fontWeight: 900, color: '#0f172a', margin: '0 0 10px' }}>虚拟攻防沙盘</h2>
              <p style={{ fontSize: 14, color: '#64748b' }}>选择攻击手段，实时观察具身智能系统的失效模式</p>
            </div>
          </ScrollReveal>

          <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: 24, alignItems: 'start' }}>

            {/* ── Left: Attack Console ── */}
            <div style={{ background: '#fff', borderRadius: 20, padding: '24px', boxShadow: '0 4px 24px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04)', border: '1px solid #eef1f6' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid #f1f5f9' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#3b82f6' }} />
                <span style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>攻击模拟控制台</span>
                <div style={{ marginLeft: 'auto', display: 'flex', gap: 5 }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#FE5F57' }} />
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#FEBC2E' }} />
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#27C840' }} />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
                {ATTACK_OPTIONS.map(opt => {
                  const active = attacks.has(opt.key);
                  return (
                    <button key={opt.key} onClick={() => toggleAttack(opt.key)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px',
                        borderRadius: 12, background: active ? `${opt.color}0A` : '#F8FAFC',
                        border: `1.5px solid ${active ? opt.color + '55' : '#E8EDF2'}`,
                        cursor: 'pointer', transition: 'all 0.2s', textAlign: 'left', width: '100%',
                      }}>
                      <div style={{
                        width: 34, height: 34, borderRadius: 9, flexShrink: 0, transition: 'all 0.2s',
                        background: active ? `${opt.color}18` : '#F1F5F9',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: active ? opt.color : '#94a3b8',
                      }}>
                        {opt.icon}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: active ? opt.color : '#334155', transition: 'color 0.2s' }}>{opt.label}</div>
                        <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{opt.desc}</div>
                      </div>
                      {/* Toggle switch */}
                      <div style={{ width: 38, height: 20, borderRadius: 10, position: 'relative', flexShrink: 0, background: active ? opt.color : '#CBD5E1', transition: 'background 0.25s' }}>
                        <div style={{ position: 'absolute', top: 2, left: active ? 20 : 2, width: 16, height: 16, borderRadius: '50%', background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.18)', transition: 'left 0.25s' }} />
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* System status */}
              <div style={{ background: '#F8FAFC', borderRadius: 12, padding: '14px 16px', border: '1px solid #E8EDF2' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>系统状态</div>
                {[
                  { label: '视觉传感器', ok: !attacks.has('laser') && !attacks.has('patch'), icon: <Eye size={12} /> },
                  { label: 'GPS 模块', ok: !attacks.has('gps'), icon: <Navigation size={12} /> },
                  { label: '声学系统', ok: !attacks.has('noise'), icon: <Radio size={12} /> },
                ].map((s, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: i < 2 ? 8 : 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#64748b' }}>
                      {s.icon}
                      <span style={{ fontSize: 12 }}>{s.label}</span>
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 9px', borderRadius: 99, color: s.ok ? '#10b981' : '#ef4444', background: s.ok ? '#ecfdf5' : '#fef2f2', border: `1px solid ${s.ok ? '#bbf7d0' : '#fecaca'}` }}>
                      {s.ok ? '正常' : '受攻击'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Right: Monitoring Stage ── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Main visualization card */}
              <div style={{ background: '#fff', borderRadius: 20, boxShadow: '0 4px 24px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04)', border: '1px solid #eef1f6', overflow: 'hidden' }}>
                {/* Titlebar */}
                <div style={{ padding: '12px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: 8, background: '#fafbfc' }}>
                  <div style={{ display: 'flex', gap: 5 }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#FE5F57' }} />
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#FEBC2E' }} />
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#27C840' }} />
                  </div>
                  <span style={{ fontSize: 12, color: '#94a3b8', marginLeft: 6 }}>实时作业监控  ·  虚拟仿真环境</span>
                  <motion.div
                    key={isAttacked ? 'alert' : 'ok'}
                    initial={{ scale: 0.85, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    style={{ marginLeft: 'auto', fontSize: 11, padding: '3px 11px', borderRadius: 99, fontWeight: 700, background: isAttacked ? '#fef2f2' : '#ecfdf5', color: isAttacked ? '#ef4444' : '#10b981', border: `1px solid ${isAttacked ? '#fecaca' : '#bbf7d0'}` }}>
                    {isAttacked ? '⚠ 检测到攻击' : '● 正常运行'}
                  </motion.div>
                </div>

                {/* Scene stage */}
                <div style={{ padding: '36px 40px 32px', position: 'relative', minHeight: 300 }}>
                  {/* Subtle grid bg */}
                  <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.04 }} aria-hidden="true">
                    <defs>
                      <pattern id="grid-lab" width="32" height="32" patternUnits="userSpaceOnUse">
                        <path d="M 32 0 L 0 0 0 32" fill="none" stroke="#3b82f6" strokeWidth="0.8"/>
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid-lab)" />
                  </svg>

                  <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 60 }}>

                    {/* Arm scene */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
                      {/* GPS drift badge */}
                      {attacks.has('gps') && (
                        <motion.div
                          animate={{ x: [-3, 5, -2, 4, -3], y: [0, -3, 2, -1, 0] }}
                          transition={{ duration: 1.3, repeat: Infinity }}
                          style={{ position: 'absolute', top: -34, right: -10, background: '#fef2f2', borderRadius: 8, padding: '4px 10px', border: '1.5px solid #fecaca', zIndex: 10, whiteSpace: 'nowrap' }}>
                          <span style={{ fontSize: 11, color: '#ef4444', fontWeight: 700 }}>📡 GPS 信号丢失</span>
                        </motion.div>
                      )}
                      {/* Laser glow halo */}
                      {attacks.has('laser') && (
                        <motion.div
                          animate={{ opacity: [0.45, 1, 0.4], scale: [0.9, 1.1, 0.9] }}
                          transition={{ duration: 0.28, repeat: Infinity }}
                          style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 72, height: 72, borderRadius: '50%', background: 'radial-gradient(circle, rgba(251,191,36,0.6) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 10 }} />
                      )}

                      {/* Mechanical arm SVG */}
                      <motion.div
                        animate={isAttacked ? { rotate: [0, -4, 4, -2, 2, 0] } : { rotate: 0 }}
                        transition={{ duration: 0.7, repeat: isAttacked ? Infinity : 0, repeatDelay: 2 }}>
                        <svg width="120" height="200" viewBox="0 0 120 200" fill="none">
                          {/* Base platform */}
                          <rect x="22" y="182" width="76" height="14" rx="7" fill={isAttacked ? '#fee2e2' : '#dbeafe'} stroke={isAttacked ? '#fca5a5' : '#93c5fd'} strokeWidth="1.5"/>
                          {/* Column */}
                          <rect x="50" y="134" width="20" height="52" rx="6" fill={isAttacked ? '#fca5a5' : '#93c5fd'}/>
                          {/* Elbow joint */}
                          <circle cx="60" cy="132" r="13" fill={isAttacked ? '#ef4444' : '#2563eb'} stroke="#fff" strokeWidth="2.5"/>
                          <circle cx="60" cy="132" r="5" fill="rgba(255,255,255,0.28)"/>
                          {/* Lower arm */}
                          <rect x="54" y="82" width="12" height="54" rx="6" fill={isAttacked ? '#f87171' : '#60a5fa'}/>
                          {/* Shoulder joint */}
                          <circle cx="60" cy="80" r="13" fill={isAttacked ? '#ef4444' : '#2563eb'} stroke="#fff" strokeWidth="2.5"/>
                          <circle cx="60" cy="80" r="5" fill="rgba(255,255,255,0.28)"/>
                          {/* Upper arm + gripper + camera (grouped with rotation) */}
                          <g transform={`rotate(${isAttacked ? -14 : -6} 60 80)`}>
                            <rect x="54" y="28" width="12" height="56" rx="6" fill={isAttacked ? '#f87171' : '#60a5fa'}/>
                            {/* Wrist */}
                            <circle cx="60" cy="26" r="10" fill={isAttacked ? '#dc2626' : '#1d4ed8'} stroke="#fff" strokeWidth="2"/>
                            {/* Gripper left */}
                            <rect x="40" y="6" width="9" height="24" rx="4.5" fill={isAttacked ? '#b91c1c' : '#1e40af'}/>
                            {/* Gripper right */}
                            <rect x="56" y="6" width="9" height="24" rx="4.5" fill={isAttacked ? '#b91c1c' : '#1e40af'}/>
                            {/* Camera lens */}
                            <circle cx="53" cy="5" r="7" fill={attacks.has('laser') ? '#fef08a' : '#eff6ff'} stroke={isAttacked ? '#ef4444' : '#3b82f6'} strokeWidth="2"/>
                            <circle cx="53" cy="5" r="3.5" fill={attacks.has('laser') ? '#f59e0b' : '#2563eb'}/>
                          </g>
                          {/* Sound wave rings (noise attack) */}
                          {attacks.has('noise') && (
                            <>
                              <motion.circle cx="60" cy="110" r="20" stroke="#f97316" strokeWidth="1.5" fill="none" strokeDasharray="5 4"
                                animate={{ r: [18, 36], opacity: [0.8, 0] }} transition={{ duration: 1.1, repeat: Infinity }}/>
                              <motion.circle cx="60" cy="110" r="36" stroke="#f97316" strokeWidth="1" fill="none" strokeDasharray="4 5"
                                animate={{ r: [32, 55], opacity: [0.6, 0] }} transition={{ duration: 1.1, repeat: Infinity, delay: 0.35 }}/>
                            </>
                          )}
                        </svg>
                      </motion.div>

                      {/* Ground shadow */}
                      <div style={{ width: 72, height: 8, borderRadius: '50%', background: 'rgba(0,0,0,0.07)', marginTop: -4 }}/>

                      {/* Status bubble */}
                      <motion.div
                        key={isAttacked ? 'attacked' : 'normal'}
                        initial={{ opacity: 0, scale: 0.85, y: 6 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.25 }}
                        style={{ marginTop: 14, padding: '7px 16px', borderRadius: 20, background: isAttacked ? '#fef2f2' : '#f0fdf4', border: `1.5px solid ${isAttacked ? '#fecaca' : '#86efac'}`, boxShadow: isAttacked ? '0 2px 12px rgba(239,68,68,0.14)' : '0 2px 12px rgba(16,185,129,0.10)' }}>
                        <span style={{ fontSize: 12, fontWeight: 700, color: isAttacked ? '#dc2626' : '#16a34a' }}>
                          {isAttacked ? '⚠️ 抓取失败 — 任务中断' : '✅ 识别成功：红色方块'}
                        </span>
                      </motion.div>
                    </div>

                    {/* Target workbench */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 10, paddingBottom: 32 }}>
                      <div style={{ fontSize: 11, fontWeight: 600, color: '#94a3b8', marginBottom: 2 }}>目标物体</div>
                      {[
                        { color: '#ef4444', label: '红色方块', round: false, targeted: true },
                        { color: '#3b82f6', label: '蓝色圆柱', round: true, targeted: false },
                        { color: '#10b981', label: '绿色方块', round: false, targeted: false },
                      ].map((obj, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, opacity: isAttacked && obj.targeted ? 0.28 : 1, transition: 'opacity 0.5s' }}>
                          <div style={{ position: 'relative', width: 30, height: 30 }}>
                            <div style={{ width: 30, height: 30, borderRadius: obj.round ? '50%' : 7, background: obj.color, boxShadow: `0 4px 12px ${obj.color}55` }}/>
                            {obj.targeted && !isAttacked && (
                              <motion.div
                                animate={{ scale: [1, 1.3, 1], opacity: [0.6, 0, 0.6] }}
                                transition={{ duration: 1.6, repeat: Infinity }}
                                style={{ position: 'absolute', inset: -4, borderRadius: obj.round ? '50%' : 11, border: `2px solid ${obj.color}` }} />
                            )}
                          </div>
                          <span style={{ fontSize: 12, color: '#64748b' }}>{obj.label}</span>
                        </div>
                      ))}
                      {/* Workbench surface */}
                      <div style={{ width: 110, height: 6, borderRadius: 3, background: 'linear-gradient(90deg,#e2e8f0,#cbd5e1,#e2e8f0)', marginTop: 6 }}/>
                    </div>
                  </div>

                  {/* Adversarial patch sticker */}
                  {attacks.has('patch') && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8, rotate: -8 }}
                      animate={{ opacity: 1, scale: 1, rotate: -4 }}
                      style={{ position: 'absolute', top: 48, right: 60, width: 54, height: 54, borderRadius: 10, background: 'repeating-linear-gradient(45deg,#f97316,#f97316 4px,#fff7ed 4px,#fff7ed 9px)', border: '2px solid #f97316', boxShadow: '0 4px 20px rgba(249,115,22,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontSize: 22 }}>⚡</span>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Failure analysis report */}
              {showReport && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{ background: '#fff', borderRadius: 16, padding: '20px 24px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', border: '1px solid #fecaca' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                    <div style={{ width: 28, height: 28, borderRadius: 8, background: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <AlertTriangle size={14} style={{ color: '#ef4444' }} />
                    </div>
                    <span style={{ color: '#0f172a', fontWeight: 700, fontSize: 14 }}>失效分析报告</span>
                    <span style={{ marginLeft: 'auto', fontSize: 11, color: '#94a3b8', padding: '2px 8px', borderRadius: 99, background: '#f8fafc', border: '1px solid #e2e8f0' }}>实时生成</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {(attacks.has('laser') || attacks.has('patch')) && (
                      <div style={{ fontSize: 13, color: '#374151', lineHeight: 1.65, padding: '10px 14px', borderRadius: 8, background: '#fef2f2', border: '1px solid #fecaca' }}>
                        🔴 <strong>视觉传感器异常</strong>：检测到{attacks.has('laser') ? '激光投射致盲攻击' : '对抗补丁干扰'}，置信度下降至 <strong style={{ color: '#ef4444' }}>12%</strong>，决策模块输出错误指令，分拣任务中断。
                      </div>
                    )}
                    {attacks.has('gps') && (
                      <div style={{ fontSize: 13, color: '#374151', lineHeight: 1.65, padding: '10px 14px', borderRadius: 8, background: '#fffbeb', border: '1px solid #fde68a' }}>
                        🟡 <strong>GPS信号丢失</strong>：卫星信号被屏蔽，惯性导航偏移量超过阈值 <strong style={{ color: '#d97706' }}>3.2m</strong>，路径规划失效。
                      </div>
                    )}
                    {attacks.has('noise') && (
                      <div style={{ fontSize: 13, color: '#374151', lineHeight: 1.65, padding: '10px 14px', borderRadius: 8, background: '#fff7ed', border: '1px solid #fed7aa' }}>
                        🟠 <strong>声学干扰检测</strong>：环境噪声注入导致音频传感器 SNR 下降至 <strong style={{ color: '#ea580c' }}>-8dB</strong>，语音识别率跌至 34%。
                      </div>
                    )}
                  </div>
                  <div style={{ marginTop: 12, fontSize: 11, color: '#94a3b8', paddingTop: 10, borderTop: '1px solid #f1f5f9' }}>
                    💡 建议：加固传感器融合策略，增加多模态交叉验证，提升系统鲁棒性
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── 服务流程 ───────────────────────────────────────────────── */}
      <section id="ei-process" style={{ background: '#f8fafc', padding: '80px 0' }}>
        <div style={{ maxWidth: 1160, margin: '0 auto', padding: '0 40px' }}>
          <ScrollReveal>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <h2 style={{ fontSize: 'clamp(26px,3vw,38px)', fontWeight: 900, color: '#0f172a', margin: '0 0 10px' }}>标准化评测服务流程</h2>
              <p style={{ fontSize: 14, color: '#64748b' }}>双轨验证机制（仿真轨 + 真机轨），从接入到报告全流程闭环</p>
            </div>
          </ScrollReveal>

          <div style={{ position: 'relative' }}>
            {/* Connecting line */}
            <div style={{ position: 'absolute', top: 36, left: '10%', right: '10%', height: 2, background: 'linear-gradient(90deg,#10b981,#60a5fa,#a78bfa,#ef4444,#f59e0b)', zIndex: 0, borderRadius: 99 }} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 16, position: 'relative', zIndex: 1 }}>
              {PROCESS_STEPS.map((step, i) => {
                const colors = ['#10b981', '#60a5fa', '#a78bfa', '#ef4444', '#f59e0b'];
                const c = colors[i];
                return (
                  <ScrollReveal key={step.n}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                      <div style={{ width: 72, height: 72, borderRadius: '50%', background: `${c}15`, border: `2.5px solid ${c}`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16, boxShadow: `0 4px 20px ${c}25`, color: c, flexShrink: 0 }}>
                        {step.icon}
                      </div>
                      <div style={{ fontSize: 11, fontWeight: 800, color: c, letterSpacing: '0.08em', marginBottom: 6 }}>步骤 {step.n}</div>
                      <div style={{ fontSize: 14, fontWeight: 800, color: '#0f172a', marginBottom: 8 }}>{step.title}</div>
                      <div style={{ fontSize: 12, color: '#64748b', lineHeight: 1.65 }}>{step.desc}</div>
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>
          </div>

          {/* Dual-track callout */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginTop: 48 }}>
            {[
              { icon: <Cpu size={20} />, title: '仿真轨', color: '#6366f1', desc: '高精度物理引擎（MuJoCo / Isaac Sim）还原真实场景，自动注入随机扰动，快速迭代验证，无需真实硬件', tags: ['无硬件限制', '批量并行', '随机扰动注入'] },
              { icon: <Activity size={20} />, title: '真机轨', color: '#10b981', desc: '标准化测试场地部署或远程真实机器接入，专家级红队实施物理攻击，出具有效性认证报告', tags: ['物理攻击', '专家红队', '合规认证'] },
            ].map((track, i) => (
              <div key={i} style={{ background: `${track.color}06`, borderRadius: 16, padding: '24px', border: `1px solid ${track.color}20` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, color: track.color }}>
                  {track.icon}
                  <span style={{ fontWeight: 800, fontSize: 16, color: '#0f172a' }}>{track.title}</span>
                </div>
                <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.7, margin: '0 0 14px' }}>{track.desc}</p>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {track.tags.map(t => (
                    <span key={t} style={{ fontSize: 11, padding: '2px 10px', borderRadius: 99, background: `${track.color}12`, border: `1px solid ${track.color}25`, color: track.color, fontWeight: 600 }}>{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 应用场景 ───────────────────────────────────────────────── */}
      <section id="ei-scenarios" style={{ background: '#fff', padding: '80px 0' }}>
        <div style={{ maxWidth: 1160, margin: '0 auto', padding: '0 40px' }}>
          <ScrollReveal>
            <div style={{ textAlign: 'center', marginBottom: 40 }}>
              <h2 style={{ fontSize: 'clamp(26px,3vw,38px)', fontWeight: 900, color: '#0f172a', margin: '0 0 10px' }}>应用场景</h2>
              <p style={{ fontSize: 14, color: '#64748b' }}>不同行业，精准评测，让您的机器人真正可信</p>
            </div>
          </ScrollReveal>

          {/* Scene tabs */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 32 }}>
            {(Object.keys(SCENES) as SceneTab[]).map(key => {
              const s = SCENES[key];
              const active = key === activeScene;
              return (
                <button key={key} onClick={() => setActiveScene(key)}
                  style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 22px', borderRadius: 12, border: `1.5px solid ${active ? s.color : '#e2e8f0'}`, background: active ? `${s.color}10` : '#fff', color: active ? s.color : '#64748b', fontWeight: active ? 700 : 500, fontSize: 14, cursor: 'pointer', transition: 'all 0.2s' }}>
                  <span style={{ color: active ? s.color : '#94a3b8' }}>{s.icon}</span>
                  {s.title}
                </button>
              );
            })}
          </div>

          {/* Scene detail */}
          <motion.div key={activeScene} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28, alignItems: 'stretch' }}>
              <div style={{ background: `${scene.color}06`, borderRadius: 20, padding: '32px', border: `1px solid ${scene.color}20` }}>
                <div style={{ color: scene.color, marginBottom: 16 }}>{scene.icon}</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: scene.color, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>{scene.en}</div>
                <h3 style={{ fontSize: 22, fontWeight: 900, color: '#0f172a', margin: '0 0 16px' }}>{scene.title}</h3>
                <div style={{ background: 'rgba(239,68,68,0.06)', borderRadius: 10, padding: '14px 16px', marginBottom: 16, border: '1px solid rgba(239,68,68,0.15)' }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#ef4444', marginBottom: 6 }}>⚠ 行业痛点</div>
                  <p style={{ fontSize: 13, color: '#374151', margin: 0, lineHeight: 1.6 }}>{scene.painPoint}</p>
                </div>
                <div style={{ background: `${scene.color}06`, borderRadius: 10, padding: '14px 16px', border: `1px solid ${scene.color}18` }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: scene.color, marginBottom: 6 }}>✓ 评测方案</div>
                  <p style={{ fontSize: 13, color: '#374151', margin: 0, lineHeight: 1.6 }}>{scene.solution}</p>
                </div>
              </div>
              <div style={{ borderRadius: 20, padding: '32px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>评测标签</div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 28 }}>
                  {scene.tags.map(t => (
                    <span key={t} style={{ padding: '6px 14px', borderRadius: 10, background: `${scene.color}10`, border: `1px solid ${scene.color}25`, color: scene.color, fontWeight: 600, fontSize: 13 }}>{t}</span>
                  ))}
                </div>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>典型指标表现</div>
                {[
                  { label: '任务成功率', val: activeScene === 'industrial' ? 96 : activeScene === 'patrol' ? 91 : 98, color: scene.color },
                  { label: '安全合规得分', val: activeScene === 'industrial' ? 88 : activeScene === 'patrol' ? 94 : 97, color: scene.color },
                  { label: '抗干扰能力', val: activeScene === 'industrial' ? 82 : activeScene === 'patrol' ? 89 : 85, color: scene.color },
                ].map((m, i) => (
                  <div key={i} style={{ marginBottom: 14 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6, color: '#374151' }}>
                      <span>{m.label}</span><span style={{ fontWeight: 700, color: m.color }}>{m.val}%</span>
                    </div>
                    <div style={{ height: 6, borderRadius: 99, background: '#e2e8f0', overflow: 'hidden' }}>
                      <motion.div initial={{ width: 0 }} animate={{ width: `${m.val}%` }} transition={{ duration: 0.6, delay: i * 0.1 }}
                        style={{ height: '100%', borderRadius: 99, background: `linear-gradient(90deg,${m.color},${m.color}88)` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── CTA / 预约演示 ─────────────────────────────────────────── */}
      <section id="ei-cta" style={{ background: 'linear-gradient(135deg,#EBF5FF 0%,#F0F4FF 50%,#EEF7FF 100%)', padding: '80px 0' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 48px' }}>
          <ScrollReveal>
            <div style={{ textAlign: 'center', marginBottom: 40 }}>
              <h2 style={{ fontSize: 'clamp(24px,3vw,36px)', fontWeight: 900, color: '#0f172a', margin: '0 0 12px' }}>
                您的具身智能体真的安全吗？
              </h2>
              <p style={{ fontSize: 15, color: '#475569' }}>立即预约专家进行免费初步诊断，获得专属评测方案</p>
            </div>
          </ScrollReveal>

          <div style={{ background: '#fff', borderRadius: 24, padding: '40px 48px', boxShadow: '0 8px 40px rgba(0,0,0,0.08)', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>姓名</label>
                <input value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                  placeholder="请输入您的姓名"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1.5px solid #e2e8f0', fontSize: 14, color: '#0f172a', outline: 'none', boxSizing: 'border-box', background: '#f8fafc' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>公司</label>
                <input value={formData.company} onChange={e => setFormData(p => ({ ...p, company: e.target.value }))}
                  placeholder="请输入公司名称"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1.5px solid #e2e8f0', fontSize: 14, color: '#0f172a', outline: 'none', boxSizing: 'border-box', background: '#f8fafc' }} />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>机器人类型</label>
                <select value={formData.robot} onChange={e => setFormData(p => ({ ...p, robot: e.target.value }))}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1.5px solid #e2e8f0', fontSize: 14, color: '#0f172a', outline: 'none', background: '#f8fafc', cursor: 'pointer' }}>
                  <option value="arm">机械臂</option>
                  <option value="quadruped">四足机器人（机器狗）</option>
                  <option value="wheeled">轮式机器人</option>
                  <option value="humanoid">人形机器人</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>联系方式</label>
                <input value={formData.contact} onChange={e => setFormData(p => ({ ...p, contact: e.target.value }))}
                  placeholder="手机号或邮箱"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1.5px solid #e2e8f0', fontSize: 14, color: '#0f172a', outline: 'none', boxSizing: 'border-box', background: '#f8fafc' }} />
              </div>
            </div>
            <Button disabled={!bookingReady} onClick={sendBooking} style={{ width: '100%', height: 48, background: 'linear-gradient(135deg,#10b981,#059669)', border: 'none', color: '#fff', fontWeight: 700, fontSize: 15, borderRadius: 12, boxShadow: bookingReady ? '0 4px 20px rgba(16,185,129,0.35)' : 'none', cursor: bookingReady ? 'pointer' : 'not-allowed', opacity: bookingReady ? 1 : 0.55 }}>
              <ChevronRight size={18} style={{ marginRight: 6 }} />提交预约，获取免费诊断报告
            </Button>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginTop: 20 }}>
              {[<><Lock size={12} /> 数据安全加密</>, <><User size={12} /> 专家1对1响应</>, <><CheckCircle size={12} /> 24小时内回复</>].map((item, i) => (
                <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#94a3b8' }}>{item}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
