import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { ScrollReveal } from '../components/ScrollReveal';
import { StickySubNav } from '../components/StickySubNav';
import { Badge } from '../components/ui/badge';
import { ProductHeroBackground } from '../components/ProductHeroBackground';
import { GuestGuard } from '../components/GuestGuard';
import { LightweightUploadTaskModal } from '../components/LightweightUploadTaskModal';
import { useUser } from '../context/UserContext';
import {
  Shield, Database, CheckCircle, ArrowRight,
  Upload, X, FileText,
  Lock, Zap, Search, Tag,
} from 'lucide-react';
import { AutonomousDrivingMock, FinancialRiskMock, LLMFinetuneMock } from '../components/ModelSafetyMocks';

// ── Types ─────────────────────────────────────────────────────────

type ModalStep = 'config' | 'metrics' | 'submit';
type BoxMode = 'whitebox' | 'blackbox';
type SubmitState = 'confirm' | 'success';

// ── Metric data ───────────────────────────────────────────────────

const DATA_WB_GROUPS = [
  { id: 'ann_cor',  label: '标注正确性',   color: '#3b82f6', bg: '#eff6ff', items: ['Box_Correctness', 'docker_MAE'] },
  { id: 'ann_com',  label: '标注完整性',   color: '#7c3aed', bg: '#f5f3ff', items: ['docker_ratio_high_sum1', 'docker_ratio_low_sum1'] },
  { id: 'scale',    label: '数据规模',     color: '#0891b2', bg: '#ecfeff', items: ['Instance_Scale'] },
  { id: 'fair',     label: '数据均衡性',   color: '#059669', bg: '#f0fdf4', items: ['Data_Fair'] },
  { id: 'anomaly',  label: '异常样本检测', color: '#f59e0b', bg: '#fffbeb', items: ['Anomalous_SampleDetection'] },
  { id: 'accuracy', label: '数据准确性',   color: '#ef4444', bg: '#fef2f2', items: ['Data_Accuracy'] },
];

const DATA_BB_GROUPS = [
  { id: 'bb_qual',  label: '黑盒数据质量评估', color: '#3b82f6', bg: '#eff6ff', items: ['blackbox_data_accuracy'] },
  { id: 'bb_priv',  label: '黑盒数据隐私评估', color: '#7c3aed', bg: '#f5f3ff', items: ['blackbox_privacy_protection'] },
  { id: 'bb_sec2',  label: '黑盒数据安全评估', color: '#ef4444', bg: '#fef2f2', items: ['blackbox_data_encryption'] },
];

const DATASET_OPTIONS = ['COCO', 'ImageNet-1K', 'VOC2012', 'Custom-NLP-v2', 'ARR_test1', 'Security-Bench'];

// ── Form field helper ─────────────────────────────────────────────

function FormField({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <div style={{ fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
        {required && <span style={{ color: '#ef4444', marginRight: 3 }}>*</span>}{label}
      </div>
      {children}
    </div>
  );
}

// ── Modal ─────────────────────────────────────────────────────────

interface ModalProps {
  open: boolean;
  onClose: () => void;
}

function ModelSafetyTaskModal({ open, onClose }: ModalProps) {
  const navigate = useNavigate();
  const { addTask } = useUser();
  const [step, setStep]               = useState<ModalStep>('config');
  const [dataset, setDataset]         = useState('');
  const [boxMode, setBoxMode]         = useState<BoxMode>('whitebox');
  const [metrics, setMetrics]         = useState<Record<string, string[]>>({});
  const [submitState, setSubmitState] = useState<SubmitState>('confirm');
  const [email, setEmail]             = useState('');

  React.useEffect(() => {
    if (open) {
      setStep('config');
      setDataset(''); setBoxMode('whitebox');
      setMetrics({}); setSubmitState('confirm'); setEmail('');
    }
  }, [open]);

  const reset = () => {
    setStep('config'); setDataset('');
    setBoxMode('whitebox'); setMetrics({}); setSubmitState('confirm'); setEmail('');
  };
  const handleClose = () => { reset(); onClose(); };

  const toggleMetric = (gid: string, item: string) => {
    setMetrics(prev => {
      const cur = prev[gid] || [];
      return { ...prev, [gid]: cur.includes(item) ? cur.filter(x => x !== item) : [...cur, item] };
    });
  };

  const totalSelected = Object.values(metrics).reduce((s, a) => s + a.length, 0);

  const getActiveGroups = () => boxMode === 'whitebox' ? DATA_WB_GROUPS : DATA_BB_GROUPS;
  const submitTask = () => {
    addTask({
      id: `model-data-${Date.now()}`,
      name: `${dataset || '自定义数据集'}安全评测`,
      model: '模型数据安全评测引擎',
      modelType: boxMode === 'whitebox' ? '白盒数据评测' : '黑盒数据评测',
      evalSet: dataset || '自定义数据集',
      evalType: '模型数据安全评测',
      status: '评测中',
      score: null,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
      plan: 'free',
    });
    setSubmitState('success');
  };

  if (!open) return null;

  const STEP_LABELS = ['配置参数', '选择指标', '提交任务'];
  const STEP_IDX: Record<ModalStep, number> = { config: 0, metrics: 1, submit: 2 };
  const curIdx = STEP_IDX[step];

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(15,23,42,0.55)', backdropFilter: 'blur(6px)' }}
      onClick={handleClose}>
      <div style={{ background: '#fff', borderRadius: 16, width: 760, maxWidth: '96vw', maxHeight: '90vh', display: 'flex', flexDirection: 'column', boxShadow: '0 28px 90px rgba(0,0,0,0.22)', overflow: 'hidden' }}
        onClick={e => e.stopPropagation()}>

        {/* ── Deep-blue header ── */}
        <div style={{ background: 'linear-gradient(135deg,#0f172a 0%,#1e3a8a 55%,#1e40af 100%)', padding: '16px 24px', display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
            <div style={{ width: 34, height: 34, borderRadius: 9, background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Database size={17} color="#60a5fa" />
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', lineHeight: 1.2 }}>创建数据安全评测任务</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)', marginTop: 1 }}>数据集质量与安全评测平台</div>
            </div>
          </div>

          {/* Progress steps */}
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
            {STEP_LABELS.map((label, i) => (
              <React.Fragment key={i}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                  <div style={{
                    width: 22, height: 22, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 800,
                    background: i < curIdx ? '#10b981' : i === curIdx ? '#3b82f6' : 'rgba(255,255,255,0.1)',
                    color: i <= curIdx ? '#fff' : 'rgba(255,255,255,0.35)',
                    border: i === curIdx ? '2px solid #60a5fa' : 'none',
                    transition: 'all 0.25s',
                  }}>
                    {i < curIdx ? '✓' : i + 1}
                  </div>
                  <span style={{ fontSize: 9, color: i === curIdx ? '#93c5fd' : i < curIdx ? '#6ee7b7' : 'rgba(255,255,255,0.3)', whiteSpace: 'nowrap' }}>
                    {label}
                  </span>
                </div>
                {i < STEP_LABELS.length - 1 && (
                  <div style={{ width: 36, height: 1, background: i < curIdx ? '#10b981' : 'rgba(255,255,255,0.12)', marginBottom: 14, flexShrink: 0 }} />
                )}
              </React.Fragment>
            ))}
          </div>

          <button onClick={handleClose} style={{ width: 28, height: 28, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.18)', background: 'rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
            <X size={12} color="rgba(255,255,255,0.65)" />
          </button>
        </div>

        {/* ── Body ── */}
        <div style={{ flex: 1, overflow: 'auto', padding: '28px 28px 20px' }}>

          {/* Step 1: Config */}
          {step === 'config' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '6px 14px', borderRadius: 8, background: '#f5f3ff', border: '1px solid #c4b5fd' }}>
                <Database size={13} color="#7c3aed" />
                <span style={{ fontSize: 12, fontWeight: 600, color: '#7c3aed' }}>数据集质量与安全评测</span>
              </div>

              <div style={{ background: '#f8fafc', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>任务配置</div>

                <FormField label="数据文件" required>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <select value={dataset} onChange={e => setDataset(e.target.value)}
                      style={{ flex: 1, padding: '8px 12px', borderRadius: 8, border: `1.5px solid ${dataset ? '#7c3aed' : '#e2e8f0'}`, fontSize: 13, background: '#fff', color: dataset ? '#0f172a' : '#94a3b8' }}>
                      <option value="">请选择数据集（支持 CSV、JSON、图像集等）</option>
                      {DATASET_OPTIONS.map(d => <option key={d}>{d}</option>)}
                    </select>
                    <button style={{ padding: '8px 14px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', fontSize: 12, color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, whiteSpace: 'nowrap' }}>
                      <Upload size={12} /> 本地上传
                    </button>
                  </div>
                </FormField>

                <FormField label="评测配置文件">
                  <div style={{ display: 'flex', gap: 8 }}>
                    <select style={{ flex: 1, padding: '8px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 13, background: '#fff', color: '#94a3b8' }}>
                      <option value="">请选择配置文件（可选）</option>
                    </select>
                    <button style={{ padding: '8px 14px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', fontSize: 12, color: '#64748b', cursor: 'pointer', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 5 }}>
                      <Upload size={12} /> 自定义上传
                    </button>
                    <button style={{ padding: '8px 14px', borderRadius: 8, border: '1px solid #7c3aed', background: '#f5f3ff', fontSize: 12, color: '#7c3aed', cursor: 'pointer', whiteSpace: 'nowrap', fontWeight: 600 }}>
                      查看示例
                    </button>
                  </div>
                </FormField>

                <div style={{ padding: '12px 14px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8, display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                  <CheckCircle size={14} color="#059669" style={{ marginTop: 1, flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: '#065f46', lineHeight: 1.65 }}>
                    支持 CSV、JSON、图像集（ZIP）、JSONL 等主流格式，也可直接选择平台内置的基准数据集。
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Metrics */}
          {step === 'metrics' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 22 }}>
                {([['whitebox', '🔬 白盒模式'], ['blackbox', '⬛ 黑盒模式']] as const).map(([m, label]) => (
                  <button key={m} onClick={() => { setBoxMode(m); setMetrics({}); }}
                    style={{ padding: '7px 18px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', border: 'none', background: boxMode === m ? '#1d4ed8' : '#f1f5f9', color: boxMode === m ? '#fff' : '#64748b' }}>
                    {label}
                  </button>
                ))}
                <div style={{ marginLeft: 'auto', fontSize: 12, color: '#94a3b8' }}>
                  已选 <strong style={{ color: '#1d4ed8', margin: '0 3px' }}>{totalSelected}</strong> 项指标
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {getActiveGroups().map(grp => (
                  <div key={grp.id}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: grp.color, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{ width: 6, height: 6, borderRadius: 3, background: grp.color }} />
                      {grp.label}
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {grp.items.map(item => {
                        const sel = (metrics[grp.id] || []).includes(item);
                        return (
                          <div key={item} onClick={() => toggleMetric(grp.id, item)}
                            style={{ padding: '7px 14px', borderRadius: 8, cursor: 'pointer', border: `1.5px solid ${sel ? grp.color : '#e2e8f0'}`, background: sel ? grp.bg : '#fafbfc', display: 'flex', alignItems: 'center', gap: 6, transition: 'all 0.15s' }}>
                            {sel && <CheckCircle size={11} style={{ color: grp.color, flexShrink: 0 }} />}
                            <span style={{ fontSize: 13, fontWeight: 600, color: sel ? grp.color : '#374151' }}>{item}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Confirm */}
          {step === 'submit' && submitState === 'confirm' && (
            <div style={{ maxWidth: 500, margin: '0 auto' }}>
              <div style={{ textAlign: 'center', marginBottom: 28 }}>
                <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'linear-gradient(135deg,#4c1d95,#7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <Database size={26} color="#fff" />
                </div>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>确认提交数据安全评测任务</div>
                <div style={{ fontSize: 13, color: '#64748b', lineHeight: 1.65 }}>
                  预计耗时 <strong style={{ color: '#0f172a' }}>15 分钟</strong>，完成后将发送邮件通知。
                </div>
              </div>
              <div style={{ background: '#f8fafc', borderRadius: 12, padding: 18, border: '1px solid #e2e8f0', marginBottom: 20, display: 'flex', flexDirection: 'column', gap: 9 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#374151', marginBottom: 4 }}>任务概览</div>
                {[
                  { label: '评测类型', val: '数据集质量与安全评测' },
                  { label: '评测模式', val: boxMode === 'whitebox' ? '白盒模式' : '黑盒模式' },
                  { label: '数据文件', val: dataset || '未选择' },
                  { label: '评测指标', val: `${totalSelected} 项` },
                ].map(({ label, val }) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                    <span style={{ color: '#94a3b8' }}>{label}</span>
                    <span style={{ color: '#0f172a', fontWeight: 600 }}>{val}</span>
                  </div>
                ))}
              </div>
              <FormField label="接收报告的邮箱地址" required>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="请输入邮箱地址"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 9, border: `1.5px solid ${email ? '#7c3aed' : '#e2e8f0'}`, fontSize: 13, color: '#0f172a', background: '#fff', outline: 'none', boxSizing: 'border-box' }} />
              </FormField>
            </div>
          )}

          {/* Step 3: Success */}
          {step === 'submit' && submitState === 'success' && (
            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(135deg,#10b981,#059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                <CheckCircle size={32} color="#fff" />
              </div>
              <div style={{ fontSize: 19, fontWeight: 800, color: '#0f172a', marginBottom: 10 }}>任务创建成功</div>
              <div style={{ fontSize: 13, color: '#64748b', marginBottom: 32, lineHeight: 1.7 }}>
                正在后台运行中...<br />
                评测结果将发送至 <strong style={{ color: '#0f172a' }}>{email || '您的邮箱'}</strong>
              </div>
              <button onClick={() => { handleClose(); navigate('/resource-center'); }}
                style={{ padding: '13px 32px', borderRadius: 10, background: 'linear-gradient(135deg,#4c1d95,#7c3aed)', border: 'none', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8, boxShadow: '0 4px 18px rgba(124,58,237,0.35)' }}>
                前往任务列表查看进度 <ArrowRight size={14} />
              </button>
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        {!(step === 'submit' && submitState === 'success') && (
          <div style={{ padding: '14px 28px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', background: '#fafbfc' }}>
            <button
              onClick={() => {
                if (step === 'config') handleClose();
                else if (step === 'metrics') setStep('config');
                else setStep('metrics');
              }}
              style={{ padding: '9px 22px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', color: '#64748b', fontSize: 13, cursor: 'pointer' }}>
              {step === 'config' ? '取消' : '上一步'}
            </button>
            <button
              onClick={() => {
                if (step === 'config') setStep('metrics');
                else if (step === 'metrics') setStep('submit');
                else if (step === 'submit' && submitState === 'confirm') submitTask();
              }}
              style={{
                padding: '9px 24px', borderRadius: 8, border: 'none', fontSize: 13, fontWeight: 700, cursor: 'pointer',
                background: 'linear-gradient(135deg,#4c1d95,#7c3aed)',
                color: '#fff',
                display: 'flex', alignItems: 'center', gap: 6,
                boxShadow: '0 2px 10px rgba(124,58,237,0.3)',
              }}>
              {step === 'submit' ? '确认提交' : '下一步'} <ArrowRight size={13} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Hero Dashboard: Data Security Visualization ───────────────────

function HeroDataDashboard() {
  return (
    <div style={{ position: 'relative', width: 460, height: 400, flexShrink: 0 }}>
      {/* Glowing rings */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }} aria-hidden="true">
        <defs>
          <style>{`
            @keyframes heroRing{0%{transform:scale(0.82);opacity:0.45}100%{transform:scale(1.55);opacity:0}}
            @keyframes heroPulse{0%,100%{opacity:0.25}50%{opacity:0.65}}
            @keyframes scanBar{0%{top:40px;opacity:0.9}48%{top:200px;opacity:0.9}50%{opacity:0}51%{top:40px;opacity:0}100%{top:40px;opacity:0}}
          `}</style>
        </defs>
        {[0, 0.9, 1.8].map((delay, i) => (
          <ellipse key={i} cx="230" cy="200" rx="165" ry="142"
            fill="none"
            stroke={['#7c3aed','#a78bfa','#c4b5fd'][i]}
            strokeWidth="1.2"
            style={{ animation: `heroRing 3.2s ease-out infinite ${delay}s`, transformOrigin: '230px 200px' }} />
        ))}
        <ellipse cx="230" cy="200" rx="155" ry="133" fill="none" stroke="#7c3aed" strokeWidth="1.8"
          style={{ animation: 'heroPulse 4s ease-in-out infinite', opacity: 0.2 }} />
      </svg>

      {/* Main dashboard card */}
      <div style={{
        position: 'absolute',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%) perspective(900px) rotateX(6deg) rotateY(-5deg)',
        width: 330, height: 230,
        background: 'linear-gradient(145deg, #0c1524 0%, #1e293b 100%)',
        borderRadius: 18,
        border: '1px solid rgba(124,58,237,0.45)',
        boxShadow: '0 0 50px rgba(124,58,237,0.22), 0 24px 70px rgba(0,0,0,0.55)',
        overflow: 'hidden',
      }}>
        {/* Title bar */}
        <div style={{ padding: '9px 14px', background: 'rgba(124,58,237,0.1)', borderBottom: '1px solid rgba(124,58,237,0.22)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ display: 'flex', gap: 5 }}>
            {['#ef4444','#f59e0b','#10b981'].map((c, i) => (
              <div key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: c, opacity: 0.75 }} />
            ))}
          </div>
          <span style={{ flex: 1, textAlign: 'center', fontSize: 9.5, color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace' }}>data_security_eval.py</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 6px #10b981' }} />
            <span style={{ fontSize: 8.5, color: '#34d399', fontWeight: 700 }}>LIVE</span>
          </div>
        </div>

        {/* Code area */}
        <div style={{ padding: '12px 14px', position: 'relative', overflow: 'hidden', height: 'calc(100% - 52px)' }}>
          {[
            { t: '>>> dataset.load("train_data.csv")', c: '#a78bfa' },
            { t: '>>> scanner.run(checks=["PII","quality","bias"])', c: '#c4b5fd' },
            { t: '[✓] 正在扫描敏感信息字段...', c: '#34d399' },
            { t: '[HIGH] 发现身份证号字段 ×87', c: '#fbbf24' },
            { t: '[HIGH] 发现手机号字段 ×1,240', c: '#fbbf24' },
            { t: '[SCAN] 数据质量分: 78.4 / 100', c: '#e2e8f0' },
            { t: '[DONE] 报告 → report_2026060301.pdf', c: '#a78bfa' },
          ].map((line, i) => (
            <div key={i} style={{ fontSize: 8.5, fontFamily: 'monospace', color: line.c, marginBottom: 5, opacity: 0.95, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {line.t}
            </div>
          ))}
          {/* Scanning bar */}
          <div style={{
            position: 'absolute', left: 0, right: 0, height: 2,
            background: 'linear-gradient(90deg, transparent 0%, rgba(124,58,237,0.9) 50%, transparent 100%)',
            boxShadow: '0 0 10px rgba(124,58,237,0.6)',
            animation: 'scanBar 3.5s linear infinite',
          }} />
          {/* Status row */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '5px 14px', background: 'rgba(0,0,0,0.45)', display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: 10 }}>
              <span style={{ fontSize: 8, color: '#a78bfa', fontFamily: 'monospace' }}>PII ✓</span>
              <span style={{ fontSize: 8, color: '#a78bfa', fontFamily: 'monospace' }}>质量 ✓</span>
              <span style={{ fontSize: 8, color: '#fbbf24', fontFamily: 'monospace' }}>水印…</span>
            </div>
            <span style={{ fontSize: 8, color: '#94a3b8', fontFamily: 'monospace' }}>92%</span>
          </div>
        </div>
      </div>

      {/* Stat cards */}
      {[
        { v: '15+', sub: '检测维度', top: '6%',  left: '0%',  color: '#a78bfa', glow: 'rgba(167,139,250,0.35)' },
        { v: '100%', sub: 'PII 检出率', top: '6%', right: '0%', color: '#4ade80', glow: 'rgba(74,222,128,0.35)' },
        { v: '<1h', sub: '全量耗时', bottom: '6%', right: '0%', color: '#fb923c', glow: 'rgba(251,146,60,0.35)' },
      ].map((s, i) => (
        <div key={i} style={{
          position: 'absolute',
          top: (s as any).top,
          bottom: (s as any).bottom,
          left: (s as any).left,
          right: (s as any).right,
          background: 'rgba(10,18,35,0.82)',
          backdropFilter: 'blur(14px)',
          border: `1px solid ${s.color}50`,
          borderRadius: 12,
          padding: '12px 18px',
          textAlign: 'center',
          boxShadow: `0 0 24px ${s.glow}, 0 6px 20px rgba(0,0,0,0.5)`,
          minWidth: 88,
        }}>
          <div style={{ fontSize: 26, fontWeight: 900, color: s.color, lineHeight: 1, textShadow: `0 0 16px ${s.color}, 0 0 32px ${s.color}88` }}>
            {s.v}
          </div>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)', marginTop: 5, fontWeight: 500 }}>{s.sub}</div>
        </div>
      ))}
    </div>
  );
}

// ── Panel: Data Provenance & Watermarking ─────────────────────────

function ProvenanceDashboard() {
  const waveY = (i: number) => 14 + Math.sin(i * 0.55) * 6 + Math.sin(i * 0.23) * 3;

  return (
    <div style={{ width: '100%', background: 'linear-gradient(150deg,#0c1524,#1a2540,#1e293b)', borderRadius: 20, padding: '18px', overflow: 'hidden', position: 'relative' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ display: 'flex', gap: 4 }}>
            {['#ef4444','#f59e0b','#10b981'].map((c,i) => <div key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: c, opacity: 0.7 }} />)}
          </div>
          <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace' }}>provenance_watermark.py</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 6px #10b981' }} />
          <span style={{ fontSize: 9, color: '#34d399', fontWeight: 700 }}>ACTIVE</span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
        {/* Watermark embed visualization */}
        <div style={{ flexShrink: 0 }}>
          <svg width="220" height="212" viewBox="0 0 220 212">
            <defs>
              <linearGradient id="wFill" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#059669" stopOpacity="0.4" />
              </linearGradient>
              <style>{`@keyframes wPulse{0%,100%{opacity:0.75}50%{opacity:1}}`}</style>
            </defs>

            {/* Dataset block grid */}
            {[0,1,2,3].map(row => [0,1,2,3].map(col => (
              <rect key={`${row}-${col}`}
                x={18 + col * 44} y={12 + row * 36}
                width={38} height={30}
                rx={4}
                fill={row === 1 && col === 2 ? 'rgba(124,58,237,0.45)' : 'rgba(255,255,255,0.05)'}
                stroke={row === 1 && col === 2 ? '#a78bfa' : 'rgba(255,255,255,0.1)'}
                strokeWidth="0.8"
                style={{ animation: row === 1 && col === 2 ? 'wPulse 2.4s ease-in-out infinite' : 'none' }}
              />
            )))}

            {/* Watermark icon overlay */}
            <text x="110" y="68" textAnchor="middle" dominantBaseline="middle" fill="#a78bfa" style={{ fontSize: 14 }}>🔏</text>

            {/* Arrow down */}
            <line x1="110" y1="158" x2="110" y2="175" stroke="#34d399" strokeWidth="1.5" />
            <polygon points="105,172 110,180 115,172" fill="#34d399" />

            {/* Waveform (signature) */}
            <polyline points={Array.from({length:36},(_,i)=>`${i*5.8+8},${185+waveY(i)}`).join(' ')}
              fill="none" stroke="#7c3aed" strokeWidth="1.6" opacity="0.85" />
            <text x="110" y="210" textAnchor="middle" fill="rgba(255,255,255,0.28)" style={{ fontSize: 8.5 }}>数字水印签名波形</text>
          </svg>
        </div>

        {/* Right: metrics */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 7 }}>
          {[
            { label: '水印嵌入率',  value: '100%', color: '#a78bfa' },
            { label: '溯源成功率',  value: '99.3%', color: '#34d399' },
            { label: '误报率',      value: '0.02%', color: '#60a5fa' },
            { label: '完整性校验',  value: 'SHA-256', color: '#fb923c' },
          ].map((m, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${m.color}28`, borderRadius: 8, padding: '8px 11px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.48)' }}>{m.label}</span>
              <span style={{ fontSize: 16, fontWeight: 800, color: m.color, fontFamily: 'monospace' }}>{m.value}</span>
            </div>
          ))}
          <div style={{ background: 'rgba(124,58,237,0.07)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 8, padding: '8px 11px' }}>
            <div style={{ fontSize: 9.5, color: 'rgba(255,255,255,0.35)', marginBottom: 5 }}>溯源链路扫描</div>
            <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 3, height: 4, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: '88%', background: 'linear-gradient(90deg,#7c3aed,#a78bfa)', borderRadius: 3 }} />
            </div>
            <div style={{ fontSize: 8.5, color: '#a78bfa', marginTop: 4, textAlign: 'right' }}>88% complete</div>
          </div>
          <div style={{ background: 'rgba(5,150,105,0.06)', border: '1px solid rgba(5,150,105,0.18)', borderRadius: 8, padding: '7px 11px', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {['DCT水印','LSB隐写','哈希校验','区块链存证'].map((t, i) => (
              <span key={t} style={{ fontSize: 8.5, padding: '2px 7px', borderRadius: 4, background: i<2?'rgba(124,58,237,0.2)':'rgba(255,255,255,0.06)', color: i<2?'#c4b5fd':'rgba(255,255,255,0.4)', fontFamily: 'monospace' }}>{t}{i<2?' ✓':''}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Panel: Data Compliance Scanner ───────────────────────────────

function ComplianceScannerUI() {
  const files = [
    { name: 'train_data.csv',    risk: 'HIGH',   icon: '📄' },
    { name: 'labels_v2.json',    risk: 'LOW',    icon: '📋' },
    { name: 'user_records.txt',  risk: 'HIGH',   icon: '📝' },
    { name: 'images_meta.csv',   risk: 'MEDIUM', icon: '📄' },
    { name: 'annotations.xml',   risk: 'LOW',    icon: '📋' },
    { name: 'raw_captures.zip',  risk: 'MEDIUM', icon: '📦' },
  ];
  const riskColor: Record<string,string> = { HIGH: '#ef4444', MEDIUM: '#f59e0b', LOW: '#10b981' };
  const logs = [
    { t: '09:14:02', msg: '开始扫描 train_data.csv...', c: '#94a3b8' },
    { t: '09:14:03', msg: '[HIGH] 发现手机号码字段 ×1,240', c: '#ef4444' },
    { t: '09:14:03', msg: '[HIGH] 发现身份证号 ×87', c: '#ef4444' },
    { t: '09:14:04', msg: '[DONE] 已脱敏 1,327 条敏感记录', c: '#34d399' },
    { t: '09:14:05', msg: '开始扫描 user_records.txt...', c: '#94a3b8' },
    { t: '09:14:06', msg: '[HIGH] 发现 PII 邮箱地址 ×432', c: '#ef4444' },
    { t: '09:14:06', msg: '[HIGH] 发现真实姓名字段 ×890', c: '#ef4444' },
    { t: '09:14:07', msg: '[DONE] 已脱敏并替换为匿名标识符', c: '#34d399' },
    { t: '09:14:08', msg: '开始扫描 images_meta.csv...', c: '#94a3b8' },
    { t: '09:14:08', msg: '[MEDIUM] 发现 GPS 坐标数据 ×203', c: '#f59e0b' },
    { t: '09:14:09', msg: '[DONE] 坐标数据已模糊化（±500m）', c: '#34d399' },
    { t: '09:14:10', msg: '✅ 全量扫描完成，合规风险已处理', c: '#4ade80' },
  ];

  return (
    <div style={{ width: '100%', background: 'linear-gradient(150deg,#0c1524,#1a2540,#1e293b)', borderRadius: 20, overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '10px 14px', background: 'rgba(124,58,237,0.12)', borderBottom: '1px solid rgba(124,58,237,0.22)', display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ display: 'flex', gap: 4 }}>
          {['#ef4444','#f59e0b','#10b981'].map((c,i)=><div key={i} style={{width:7,height:7,borderRadius:'50%',background:c,opacity:0.7}}/>)}
        </div>
        <span style={{ flex: 1, textAlign: 'center', fontSize: 9.5, color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace' }}>data_compliance_scan.py</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#f59e0b', boxShadow: '0 0 6px #f59e0b' }} />
          <span style={{ fontSize: 8.5, color: '#fbbf24', fontWeight: 700 }}>SCANNING</span>
        </div>
      </div>

      <div style={{ display: 'flex', height: 260 }}>
        {/* File tree */}
        <div style={{ width: 140, borderRight: '1px solid rgba(255,255,255,0.08)', padding: '10px 0', overflowY: 'auto', flexShrink: 0 }}>
          <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.28)', padding: '0 10px 6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>文件列表</div>
          {files.map((f, i) => (
            <div key={i} style={{ padding: '6px 10px', display: 'flex', alignItems: 'center', gap: 6, background: i === 0 ? 'rgba(124,58,237,0.12)' : 'transparent', borderLeft: `2px solid ${i === 0 ? '#7c3aed' : 'transparent'}` }}>
              <span style={{ fontSize: 11 }}>{f.icon}</span>
              <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.55)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1, fontFamily: 'monospace' }}>{f.name}</span>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: riskColor[f.risk], flexShrink: 0 }} />
            </div>
          ))}
        </div>

        {/* Risk legend */}
        <div style={{ width: 88, borderRight: '1px solid rgba(255,255,255,0.08)', padding: '10px 8px', display: 'flex', flexDirection: 'column', gap: 6, flexShrink: 0 }}>
          <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.28)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>风险等级</div>
          {[{k:'HIGH',c:'#ef4444',n:2},{k:'MEDIUM',c:'#f59e0b',n:2},{k:'LOW',c:'#10b981',n:2}].map(r => (
            <div key={r.k} style={{ background: `${r.c}12`, border: `1px solid ${r.c}30`, borderRadius: 6, padding: '5px 7px' }}>
              <div style={{ fontSize: 8.5, fontWeight: 700, color: r.c }}>{r.k}</div>
              <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>{r.n} 文件</div>
            </div>
          ))}
          <div style={{ marginTop: 4, fontSize: 8.5, color: 'rgba(255,255,255,0.28)', lineHeight: 1.5 }}>
            已脱敏<br /><span style={{ color: '#34d399', fontWeight: 700 }}>1,759</span><br />条记录
          </div>
        </div>

        {/* Log window */}
        <div style={{ flex: 1, padding: '10px 12px', overflowY: 'auto', fontFamily: 'monospace' }}>
          <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.28)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>扫描日志</div>
          {logs.map((log, i) => (
            <div key={i} style={{ fontSize: 9, marginBottom: 4, display: 'flex', gap: 6 }}>
              <span style={{ color: 'rgba(255,255,255,0.25)', flexShrink: 0 }}>{log.t}</span>
              <span style={{ color: log.c }}>{log.msg}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Panel: Data Quality Auto-Fix ──────────────────────────────────

function AutoFixCompare() {
  const beforeLines = [
    { text: 'dataset_config:', c: '#e2e8f0' },
    { text: '  dedup: false         # ⚠ 未去重', c: '#ef4444', warn: true },
    { text: '  pii_filter: false    # ⚠ 未过滤敏感信息', c: '#ef4444', warn: true },
    { text: '  label_check: false', c: '#94a3b8' },
    { text: '  privacy_mask: null   # ⚠ 无隐私脱敏', c: '#ef4444', warn: true },
    { text: '  balance_ratio: null', c: '#94a3b8' },
    { text: '  watermark: false     # ⚠ 无数据水印', c: '#ef4444', warn: true },
  ];
  const afterLines = [
    { text: 'dataset_config:', c: '#e2e8f0' },
    { text: '  dedup: true          # ✓ 自动去重', c: '#34d399' },
    { text: '  pii_filter: true     # ✓ 敏感信息过滤', c: '#34d399' },
    { text: '  label_check: true    # ✓ 标注质量核查', c: '#34d399' },
    { text: '  privacy_mask: dp_1.0 # ✓ 差分隐私保护', c: '#34d399' },
    { text: '  balance_ratio: auto  # ✓ 自动均衡采样', c: '#34d399' },
    { text: '  watermark: dct_v2    # ✓ 数字水印嵌入', c: '#34d399' },
  ];

  return (
    <div style={{ width: '100%', background: 'linear-gradient(150deg,#0c1524,#1a2540,#1e293b)', borderRadius: 20, overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '10px 14px', background: 'rgba(5,150,105,0.1)', borderBottom: '1px solid rgba(5,150,105,0.2)', display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ display: 'flex', gap: 4 }}>
          {['#ef4444','#f59e0b','#10b981'].map((c,i)=><div key={i} style={{width:7,height:7,borderRadius:'50%',background:c,opacity:0.7}}/>)}
        </div>
        <span style={{ flex:1, textAlign:'center', fontSize:9.5, color:'rgba(255,255,255,0.4)', fontFamily:'monospace' }}>data_quality_fix.diff</span>
        <div style={{ display:'flex', alignItems:'center', gap:4 }}>
          <div style={{ width:6, height:6, borderRadius:'50%', background:'#10b981', boxShadow:'0 0 6px #10b981' }} />
          <span style={{ fontSize:8.5, color:'#34d399', fontWeight:700 }}>AUTO-FIX</span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'stretch', height: 244 }}>
        {/* Before */}
        <div style={{ flex: 1, padding: '10px 12px', borderRight: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden' }}>
          <div style={{ fontSize: 8.5, fontWeight: 700, color: '#ef4444', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ fontSize: 9 }}>⚠</span> 原始数据配置
          </div>
          {beforeLines.map((line, i) => (
            <div key={i} style={{ display: 'flex', gap: 6, marginBottom: 4, padding: '2px 6px', borderRadius: 4, background: line.warn ? 'rgba(239,68,68,0.08)' : 'transparent', borderLeft: line.warn ? '2px solid rgba(239,68,68,0.5)' : '2px solid transparent' }}>
              <span style={{ fontSize: 8, color: 'rgba(255,255,255,0.18)', width: 12, flexShrink: 0, textAlign: 'right', fontFamily: 'monospace' }}>{i+1}</span>
              <span style={{ fontSize: 8.5, color: line.c, fontFamily: 'monospace', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{line.text}</span>
            </div>
          ))}
        </div>

        {/* Arrow */}
        <div style={{ width: 58, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, flexShrink: 0 }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#059669,#10b981)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 16px rgba(16,185,129,0.5)' }}>
            <span style={{ fontSize: 14, color: '#fff' }}>→</span>
          </div>
          <div style={{ fontSize: 7.5, color: '#34d399', fontWeight: 700, textAlign: 'center', lineHeight: 1.4 }}>Auto<br />Fix</div>
        </div>

        {/* After */}
        <div style={{ flex: 1, padding: '10px 12px', overflow: 'hidden' }}>
          <div style={{ fontSize: 8.5, fontWeight: 700, color: '#10b981', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ fontSize: 9 }}>✓</span> 优化后数据配置
          </div>
          {afterLines.map((line, i) => (
            <div key={i} style={{ display: 'flex', gap: 6, marginBottom: 4, padding: '2px 6px', borderRadius: 4, background: i > 0 ? 'rgba(16,185,129,0.07)' : 'transparent', borderLeft: i > 0 ? '2px solid rgba(16,185,129,0.45)' : '2px solid transparent' }}>
              <span style={{ fontSize: 8, color: 'rgba(255,255,255,0.18)', width: 12, flexShrink: 0, textAlign: 'right', fontFamily: 'monospace' }}>{i+1}</span>
              <span style={{ fontSize: 8.5, color: line.c, fontFamily: 'monospace', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{line.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Score bar */}
      <div style={{ padding: '10px 14px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 14 }}>
        <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)' }}>数据质量分提升</span>
        <div style={{ flex: 1, height: 5, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: '92%', background: 'linear-gradient(90deg,#7c3aed,#10b981)', borderRadius: 3 }} />
        </div>
        <span style={{ fontSize: 11, fontWeight: 800, color: '#34d399', fontFamily: 'monospace' }}>54 → 94</span>
      </div>
    </div>
  );
}

// ── Interactive Dataset Evaluation Lab ────────────────────────────

type EvalStage = 'idle' | 'running' | 'done';
type DemoMetric = {
  id: string;
  label: string;
  code: string;
  score: number;
  result: string;
  description: string;
  color: string;
};

const WHITEBOX_DEMO_METRICS: DemoMetric[] = [
  { id: 'ann_cor', label: '标注正确性', code: 'Box_Correctness', score: 96.8, result: '抽检 12,000 条，发现 384 条疑似错标', description: '检测标签与样本语义是否一致', color: '#2563eb' },
  { id: 'ann_com', label: '标注完整性', code: 'docker_ratio_high_sum1', score: 92.4, result: '缺失标注率 1.7%，弱标注率 3.2%', description: '核查漏标、缺标与弱标注样本', color: '#7c3aed' },
  { id: 'scale', label: '数据规模', code: 'Instance_Scale', score: 88.6, result: '有效样本 118,420 条，满足训练基线', description: '判断样本规模是否满足训练目标', color: '#0891b2' },
  { id: 'fair', label: '数据均衡性', code: 'Data_Fair', score: 73.5, result: 'person 类占比 41.2%，存在长尾类别', description: '分析类别、属性与场景分布偏差', color: '#059669' },
  { id: 'anomaly', label: '异常样本检测', code: 'Anomalous_SampleDetection', score: 89.1, result: '检出重复、模糊及损坏样本 1,286 条', description: '识别重复、离群、损坏和低质样本', color: '#f59e0b' },
  { id: 'accuracy', label: '数据准确性', code: 'Data_Accuracy', score: 94.2, result: '字段一致率 97.9%，格式错误率 0.8%', description: '核验数据内容、格式与规则一致性', color: '#ef4444' },
];

const BLACKBOX_DEMO_METRICS: DemoMetric[] = [
  { id: 'bb_qual', label: '黑盒数据质量评估', code: 'blackbox_data_accuracy', score: 91.7, result: '模型输出稳定性良好，低置信样本占 4.6%', description: '根据模型输出反推训练数据质量', color: '#2563eb' },
  { id: 'bb_priv', label: '黑盒数据隐私评估', code: 'blackbox_privacy_protection', score: 86.3, result: '成员推断攻击风险中等，建议增强防护', description: '评估成员推断和训练数据泄露风险', color: '#7c3aed' },
  { id: 'bb_sec2', label: '黑盒数据安全评估', code: 'blackbox_data_encryption', score: 93.1, result: '接口传输与访问控制符合安全基线', description: '核验数据链路和访问过程安全性', color: '#ef4444' },
];

const DISTRIBUTION_ROWS = [
  { label: 'person', value: 41, count: '48,796', color: '#2563eb' },
  { label: 'vehicle', value: 27, count: '31,974', color: '#7c3aed' },
  { label: 'animal', value: 16, count: '18,947', color: '#0891b2' },
  { label: 'indoor', value: 10, count: '11,842', color: '#10b981' },
  { label: 'long-tail', value: 6, count: '6,861', color: '#f59e0b' },
];

function DatasetEvaluationLab() {
  const [boxMode, setBoxMode] = useState<BoxMode>('whitebox');
  const [dataset, setDataset] = useState('COCO');
  const [stage, setStage] = useState<EvalStage>('idle');
  const [progress, setProgress] = useState(0);
  const [activeMetric, setActiveMetric] = useState(0);
  const activeMetrics = boxMode === 'whitebox' ? WHITEBOX_DEMO_METRICS : BLACKBOX_DEMO_METRICS;
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(WHITEBOX_DEMO_METRICS.map(metric => metric.id));

  const changeMode = (mode: BoxMode) => {
    const metrics = mode === 'whitebox' ? WHITEBOX_DEMO_METRICS : BLACKBOX_DEMO_METRICS;
    setBoxMode(mode);
    setSelectedMetrics(metrics.map(metric => metric.id));
    setStage('idle');
    setProgress(0);
    setActiveMetric(0);
  };

  const toggleMetric = (id: string) => {
    if (stage === 'running') return;
    setSelectedMetrics(current => current.includes(id)
      ? current.length === 1 ? current : current.filter(item => item !== id)
      : [...current, id]);
    setStage('idle');
    setProgress(0);
  };

  const runEvaluation = () => {
    if (stage === 'done') {
      setStage('idle');
      setProgress(0);
      setActiveMetric(0);
      return;
    }

    setStage('running');
    setProgress(0);
    setActiveMetric(0);
    let nextProgress = 0;
    const timer = window.setInterval(() => {
      nextProgress += 2;
      setProgress(Math.min(nextProgress, 100));
      setActiveMetric(Math.min(
        Math.floor((nextProgress / 100) * selectedMetrics.length),
        Math.max(selectedMetrics.length - 1, 0),
      ));
      if (nextProgress >= 100) {
        window.clearInterval(timer);
        window.setTimeout(() => setStage('done'), 250);
      }
    }, 45);
  };

  const selectedMetricDetails = activeMetrics.filter(metric => selectedMetrics.includes(metric.id));
  const overallScore = selectedMetricDetails.length
    ? (selectedMetricDetails.reduce((total, metric) => total + metric.score, 0) / selectedMetricDetails.length).toFixed(1)
    : '—';

  return (
    <section style={{ background: 'linear-gradient(180deg,#f8fbff 0%,#f5f3ff 100%)', padding: '88px 0 96px', borderTop: '1px solid #e2e8f0' }}>
      <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 40px' }}>
        <ScrollReveal>
          <div style={{ textAlign: 'center', marginBottom: 44 }}>
            <div style={{ display: 'inline-block', fontSize: 11, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.14em', fontWeight: 800, marginBottom: 12 }}>
              INTERACTIVE EVALUATION LAB
            </div>
            <h2 style={{ fontSize: 'clamp(28px,3.5vw,42px)', fontWeight: 900, color: '#0f172a', margin: '0 0 12px' }}>模拟一次模型训练数据集评测</h2>
            <p style={{ fontSize: 15, color: '#64748b', maxWidth: 720, margin: '0 auto', lineHeight: 1.8 }}>
              选择白盒或黑盒模式及评测指标，直观看到数据质量、分布偏差、异常样本与安全风险如何形成可执行的评测结论。
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <div style={{ background: '#fff', borderRadius: 22, border: '1px solid #dbe5f1', boxShadow: '0 20px 60px rgba(30,64,175,0.10)', overflow: 'hidden' }}>
            <div style={{ padding: '18px 24px', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: 'linear-gradient(135deg,#2563eb,#7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Database size={18} color="#fff" />
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: '#fff' }}>玄鉴模型数据评测工作台</div>
                  <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 3 }}>MODEL DATA EVALUATION WORKBENCH</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <select value={dataset} onChange={event => { setDataset(event.target.value); setStage('idle'); setProgress(0); }}
                  style={{ minWidth: 180, padding: '9px 34px 9px 12px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.16)', background: '#1e293b', color: '#e2e8f0', fontSize: 12 }}>
                  {DATASET_OPTIONS.map(option => <option key={option}>{option}</option>)}
                </select>
                <button style={{ padding: '9px 14px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.16)', background: 'rgba(255,255,255,0.06)', color: '#cbd5e1', fontSize: 12, display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                  <Upload size={13} /> 上传数据集
                </button>
              </div>
            </div>

            <div style={{ padding: '22px 24px 0', borderBottom: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', marginBottom: 18 }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 800, color: '#0f172a' }}>01 选择评测模式</div>
                  <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 3 }}>与创建任务中的评测模式和指标体系保持一致</div>
                </div>
                <div style={{ background: '#f1f5f9', padding: 4, borderRadius: 10, display: 'flex' }}>
                  {([['whitebox', '白盒数据评测'], ['blackbox', '黑盒数据评测']] as const).map(([mode, label]) => (
                    <button key={mode} onClick={() => changeMode(mode)}
                      style={{ padding: '8px 18px', borderRadius: 7, border: 'none', background: boxMode === mode ? '#fff' : 'transparent', color: boxMode === mode ? '#1d4ed8' : '#64748b', boxShadow: boxMode === mode ? '0 2px 8px rgba(15,23,42,0.10)' : 'none', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: `repeat(${boxMode === 'whitebox' ? 6 : 3}, minmax(130px,1fr))`, gap: 10, overflowX: 'auto', paddingBottom: 22 }}>
                {activeMetrics.map(metric => {
                  const selected = selectedMetrics.includes(metric.id);
                  return (
                    <button key={metric.id} onClick={() => toggleMetric(metric.id)}
                      style={{ minWidth: 130, padding: '13px 12px', borderRadius: 10, textAlign: 'left', cursor: stage === 'running' ? 'wait' : 'pointer', border: `1px solid ${selected ? metric.color : '#e2e8f0'}`, background: selected ? `${metric.color}0b` : '#fff', transition: 'all 0.2s' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
                        <span style={{ width: 20, height: 20, borderRadius: 6, background: selected ? metric.color : '#e2e8f0', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 900 }}>
                          {selected ? '✓' : ''}
                        </span>
                        <span style={{ fontSize: 9, color: '#94a3b8', fontFamily: 'monospace' }}>{metric.code}</span>
                      </div>
                      <div style={{ fontSize: 12, color: '#0f172a', fontWeight: 800, marginTop: 10 }}>{metric.label}</div>
                      <div style={{ fontSize: 10, color: '#64748b', marginTop: 4, lineHeight: 1.5 }}>{metric.description}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(340px,0.9fr) minmax(440px,1.25fr)', minHeight: 430 }}>
              <div style={{ padding: 26, borderRight: '1px solid #e2e8f0', background: '#fbfdff' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }}>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 800, color: '#0f172a' }}>02 数据集概览</div>
                    <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 3 }}>{dataset} · 118,420 个有效样本</div>
                  </div>
                  <span style={{ padding: '4px 9px', borderRadius: 20, fontSize: 10, color: '#047857', background: '#ecfdf5', border: '1px solid #a7f3d0', fontWeight: 700 }}>数据已就绪</span>
                </div>

                <div style={{ padding: 18, borderRadius: 14, background: '#fff', border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
                    <span style={{ fontSize: 12, color: '#334155', fontWeight: 700 }}>类别分布与长尾样本</span>
                    <span style={{ fontSize: 10, color: '#f59e0b', fontWeight: 700 }}>发现 1 项分布偏差</span>
                  </div>
                  {DISTRIBUTION_ROWS.map(row => (
                    <div key={row.label} style={{ display: 'grid', gridTemplateColumns: '72px 1fr 54px', gap: 10, alignItems: 'center', marginBottom: 13 }}>
                      <span style={{ fontSize: 11, color: '#64748b', fontFamily: 'monospace' }}>{row.label}</span>
                      <div style={{ height: 8, borderRadius: 5, background: '#eef2f7', overflow: 'hidden' }}>
                        <div style={{ width: `${Math.min(row.value * 2, 100)}%`, height: '100%', borderRadius: 5, background: row.color }} />
                      </div>
                      <span style={{ fontSize: 10, color: '#475569', textAlign: 'right', fontFamily: 'monospace' }}>{row.count}</span>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginTop: 14 }}>
                  {[
                    { label: '类别数', value: '80' },
                    { label: '标注字段', value: '6' },
                    { label: '数据体积', value: '18.7 GB' },
                  ].map(item => (
                    <div key={item.label} style={{ padding: '12px 8px', borderRadius: 10, background: '#fff', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                      <div style={{ fontSize: 15, fontWeight: 900, color: '#0f172a' }}>{item.value}</div>
                      <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 3 }}>{item.label}</div>
                    </div>
                  ))}
                </div>

                <button onClick={runEvaluation} disabled={stage === 'running'}
                  style={{ width: '100%', marginTop: 18, padding: '12px 18px', borderRadius: 9, border: 'none', background: stage === 'done' ? '#0f172a' : stage === 'running' ? '#94a3b8' : 'linear-gradient(135deg,#2563eb,#7c3aed)', color: '#fff', fontSize: 13, fontWeight: 800, cursor: stage === 'running' ? 'wait' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}>
                  {stage === 'done' ? '↺ 重新评测' : stage === 'running' ? <><Zap size={14} /> 正在执行指标评测 {progress}%</> : <><Search size={14} /> 开始评测已选 {selectedMetrics.length} 项指标</>}
                </button>
              </div>

              <div style={{ padding: 26, position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 20, alignItems: 'flex-start', marginBottom: 22 }}>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 800, color: '#0f172a' }}>03 指标评测结果</div>
                    <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 3 }}>
                      {stage === 'idle' ? '点击“开始评测”生成指标结论与优化建议' : stage === 'running' ? `正在分析：${selectedMetricDetails[activeMetric]?.label || '数据集结构'}` : '评测已完成，可据此制定数据优化方案'}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 10, color: '#94a3b8' }}>综合得分</div>
                    <div style={{ fontSize: 30, lineHeight: 1, marginTop: 5, fontWeight: 900, color: stage === 'done' ? '#2563eb' : '#cbd5e1' }}>
                      {stage === 'done' ? overallScore : '—'}
                    </div>
                  </div>
                </div>

                {stage === 'running' && (
                  <div style={{ marginBottom: 18 }}>
                    <div style={{ height: 7, background: '#eef2f7', borderRadius: 5, overflow: 'hidden' }}>
                      <div style={{ width: `${progress}%`, height: '100%', borderRadius: 5, background: 'linear-gradient(90deg,#2563eb,#7c3aed,#10b981)', transition: 'width 0.1s linear' }} />
                    </div>
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {selectedMetricDetails.map((metric, index) => {
                    const revealed = stage === 'done' || (stage === 'running' && index <= activeMetric);
                    return (
                      <div key={metric.id} style={{ padding: '13px 14px', borderRadius: 11, border: `1px solid ${revealed ? `${metric.color}33` : '#e2e8f0'}`, background: revealed ? `${metric.color}07` : '#fafafa', display: 'grid', gridTemplateColumns: 'minmax(128px,0.75fr) minmax(190px,1.45fr) 66px', gap: 14, alignItems: 'center', opacity: revealed ? 1 : 0.58, transition: 'all 0.25s' }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                            <span style={{ width: 7, height: 7, borderRadius: '50%', background: revealed ? metric.color : '#cbd5e1' }} />
                            <span style={{ fontSize: 12, color: '#0f172a', fontWeight: 800 }}>{metric.label}</span>
                          </div>
                          <div style={{ fontSize: 9, color: '#94a3b8', marginTop: 4, marginLeft: 14, fontFamily: 'monospace' }}>{metric.code}</div>
                        </div>
                        <div style={{ fontSize: 11, color: revealed ? '#475569' : '#94a3b8', lineHeight: 1.55 }}>
                          {revealed ? metric.result : '等待评测引擎分析'}
                        </div>
                        <div style={{ textAlign: 'right', fontSize: 16, fontWeight: 900, color: revealed ? metric.color : '#cbd5e1' }}>
                          {revealed ? metric.score : '—'}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {stage === 'done' && (
                  <div style={{ marginTop: 14, padding: '12px 14px', borderRadius: 10, background: '#fffbeb', border: '1px solid #fde68a', display: 'flex', alignItems: 'flex-start', gap: 9 }}>
                    <CheckCircle size={15} color="#d97706" style={{ marginTop: 1, flexShrink: 0 }} />
                    <div style={{ fontSize: 11, color: '#92400e', lineHeight: 1.65 }}>
                      <strong>优化建议：</strong>优先补充长尾类别样本，复核 384 条疑似错标数据，并清理重复及损坏样本后再进入模型训练流程。
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div style={{ padding: '12px 24px', borderTop: '1px solid #e2e8f0', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', fontSize: 10, color: '#94a3b8' }}>
              <span>演示数据为平台内置样例 · 指标名称与“创建数据安全评测任务”保持一致</span>
              <span style={{ color: '#2563eb', fontWeight: 700 }}>评测结论可输出 HTML / PDF / JSON 报告</span>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

// ── Main Page ─────────────────────────────────────────────────────

export function ModelSafetyEval() {
  const navigate = useNavigate();
  const { isGuest } = useUser();
  const [modalOpen, setModalOpen] = useState(false);
  const [showGuestGuard, setShowGuestGuard] = useState(false);

  const openModal = () => {
    if (isGuest) setShowGuestGuard(true);
    else setModalOpen(true);
  };

  const Z_PANELS = [
    {
      id: '01', side: 'left' as const, color: '#7c3aed',
      title: '数据溯源与水印',
      heading: '为每份数据打上不可伪造的"数字指纹"',
      desc: '采用 DCT 频域水印与区块链存证技术，在数据集发布前自动嵌入不可见水印。一旦数据被非法使用或泄露，可实现毫秒级溯源定位，守护数据产权。',
      tags: ['DCT 数字水印', 'LSB 隐写', '区块链存证', '溯源报告'],
      svg: <ProvenanceDashboard />,
      onExperience: openModal,
    },
    {
      id: '02', side: 'right' as const, color: '#7c3aed',
      title: '数据隐私与合规扫描',
      heading: '数据入库前的"安检门"',
      desc: '在模型训练前，自动识别并脱敏人脸、身份证等敏感信息；检测标注质量与长尾分布，从源头规避法律风险与训练偏差。',
      tags: ['敏感信息识别', '标注质量核查', '隐私合规扫描', '长尾分布检测'],
      svg: <ComplianceScannerUI />,
      onExperience: openModal,
    },
    {
      id: '03', side: 'left' as const, color: '#059669',
      title: '数据质量优化建议',
      heading: '自动化数据质量加固策略',
      desc: '基于评测得分，智能推荐去重、均衡采样、差分隐私脱敏或标注修复方案。一键生成优化配置，将数据质量分从基线提升至合规标准以上。',
      tags: ['自动去重', '差分隐私', '标注修复', '一键 Auto-Fix'],
      svg: <AutoFixCompare />,
      onExperience: openModal,
    },
  ];

  return (
    <div style={{ background: '#fff', minHeight: '100vh', color: '#0f172a' }}>

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="product-detail-hero" style={{ position: 'relative', overflow: 'hidden', background: 'linear-gradient(135deg,#0f172a 0%,#2e1065 55%,#1e293b 100%)', padding: '88px 0 76px' }}>
        <ProductHeroBackground side="data" concept="model-data" />
        <div style={{ maxWidth: 1160, margin: '0 auto', padding: '0 40px', position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', gap: 48, flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 400px', minWidth: 300 }}>
            <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
              <Badge style={{ background: 'rgba(37,99,235,0.08)', color: '#35638e', border: '1px solid rgba(37,99,235,0.22)', fontSize: 11 }}>
                <Database size={10} style={{ marginRight: 4 }} /> 数据安全
              </Badge>
            </div>
            <h1 style={{ margin: '0 0 16px', fontSize: 'clamp(24px,3.4vw,42px)', color: '#fff', lineHeight: 1.2 }}>
              AI数据资产的
              <br />
              <span style={{ background: 'linear-gradient(90deg,#a78bfa,#34d399)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                安全评测与质量保障
              </span>
            </h1>
            <p style={{ margin: '0 0 32px', fontSize: 15, color: 'rgba(255,255,255,0.62)', maxWidth: 500, lineHeight: 1.8 }}>
              在模型训练前，全面检测数据集的隐私合规性、标注质量与安全风险，提供从扫描到加固的一站式数据安全评测方案。
            </p>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              <button onClick={openModal}
                style={{ padding: '13px 32px', borderRadius: 10, background: 'linear-gradient(135deg,#7c3aed,#059669)', border: 'none', color: '#fff', fontSize: 14, fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 4px 22px rgba(124,58,237,0.45)' }}>
                <Search size={16} /> 开始数据评测
              </button>
              <button onClick={() => navigate('/developer')}
                style={{ padding: '13px 26px', borderRadius: 10, background: 'rgba(255,255,255,0.07)', border: '1.5px solid rgba(255,255,255,0.18)', color: 'rgba(255,255,255,0.8)', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
                查看技术文档
              </button>
            </div>
            {/* API link */}
            <div style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={() => navigate('/developer')}
                style={{ background: 'none', border: 'none', color: '#64748b', fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, padding: 0 }}>
                <Shield size={12} /> 今天就试用我们的 API →
              </button>
            </div>
          </div>
          <div style={{ flex: '0 0 auto', display: 'flex', justifyContent: 'center' }}>
            <HeroDataDashboard />
          </div>
        </div>
      </section>

      <StickySubNav items={[
        { id: 'mse-features', label: '核心功能' },
        { id: 'mse-lab', label: '交互式演示' },
        { id: 'mse-scenarios', label: '应用场景' },
        { id: 'mse-compat', label: '技术兼容性' },
        { id: 'mse-process', label: '评测流程' },
        { id: 'mse-cta', label: '开始评测' },
      ]} />

      {/* ── Core Features Z-layout ───────────────────────────── */}
      <section id="mse-features" style={{ background: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: 1160, margin: '0 auto', padding: '80px 40px 100px' }}>
          <ScrollReveal>
            <div style={{ textAlign: 'center', marginBottom: 64 }}>
              <div style={{ display: 'inline-block', fontSize: 13, color: '#7c3aed', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 700, marginBottom: 12, padding: '4px 16px', background: '#f5f3ff', borderRadius: 20 }}>
                核心能力矩阵
              </div>
              <h2 style={{ fontSize: 'clamp(28px,3.5vw,44px)', fontWeight: 900, color: '#0f172a', margin: '0 0 12px' }}>全面覆盖数据安全威胁</h2>
              <p style={{ fontSize: 15, color: '#64748b', margin: 0 }}>从数据溯源到隐私合规，构建完整的数据安全防护体系</p>
            </div>
          </ScrollReveal>

          {Z_PANELS.map((panel, idx) => {
            const isLeft = panel.side === 'left';
            return (
              <ScrollReveal key={panel.id}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0, alignItems: 'center', marginTop: idx === 0 ? 0 : 32 }}>
                  <div style={{ order: isLeft ? 0 : 1, padding: isLeft ? '48px 44px 48px 0' : '48px 0 48px 44px' }}>
                    <div style={{ background: 'linear-gradient(135deg,#0f172a,#1e293b)', borderRadius: 20, padding: '28px 28px 20px', position: 'relative', overflow: 'hidden', minHeight: 280, display: 'flex', flexDirection: 'column', boxShadow: '0 12px 48px rgba(0,0,0,0.18)' }}>
                      <div style={{ position: 'absolute', top: -8, left: 14, fontSize: 100, fontWeight: 900, color: panel.color+'14', lineHeight: 1, userSelect: 'none', fontFamily: 'monospace' }}>{panel.id}</div>
                      <div style={{ position: 'relative', zIndex: 1, flex: 1 }}>{panel.svg}</div>
                    </div>
                  </div>
                  <div style={{ order: isLeft ? 1 : 0, paddingTop: 40, paddingLeft: isLeft ? 52 : 0, paddingRight: isLeft ? 0 : 52, paddingBottom: 20 }}>
                    <div style={{ fontSize: 18, color: panel.color, letterSpacing: '0.04em', fontWeight: 800, marginBottom: 14 }}>功能 {panel.id} &nbsp;·&nbsp; {panel.title}</div>
                    <h3 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', margin: '0 0 16px', lineHeight: 1.35 }}>{panel.heading}</h3>
                    <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.8, margin: '0 0 22px' }}>{panel.desc}</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 28 }}>
                      {panel.tags.map(t => (
                        <span key={t} style={{ fontSize: 11, padding: '5px 12px', borderRadius: 20, background: panel.color+'10', color: panel.color, border: `1px solid ${panel.color}22`, fontWeight: 600 }}>{t}</span>
                      ))}
                    </div>
                    <button onClick={panel.onExperience}
                      style={{ padding: '10px 22px', borderRadius: 9, background: panel.color, border: 'none', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, boxShadow: `0 4px 16px ${panel.color}33` }}>
                      创建评测任务 <ArrowRight size={13} />
                    </button>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </section>

      <div id="mse-lab"><DatasetEvaluationLab /></div>

      {/* ── Industry Scenarios ────────────────────────────────── */}
      <section id="mse-scenarios" style={{ background: '#f8fafc', padding: '80px 0', borderTop: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 40px' }}>
          <ScrollReveal>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: '#7c3aed', textTransform: 'uppercase', letterSpacing: '0.12em', margin: '0 0 10px' }}>行业解决方案</p>
              <h2 style={{ fontSize: 32, fontWeight: 800, color: '#0f172a', margin: '0 0 12px' }}>场景化落地方案</h2>
              <p style={{ fontSize: 16, color: '#64748b' }}>不只是功能清单 — 给出完整架构路径，直面行业核心痛点</p>
            </div>
          </ScrollReveal>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            {[
              {
                id: 'autonomous',
                icon: '🚗',
                accentColor: '#3b82f6',
                tag: '自动驾驶研发',
                title: '交通识别算法鲁棒性验证',
                subtitle: '极端天气下的对抗样本防御，确保驾驶安全',
                desc: '交通标志识别算法易受对抗样本干扰，导致极端天气下识别错误引发事故。提供对抗鲁棒性测试，模拟 FGSM/PGD 等各类攻击手段，确保模型在雨雾、强光复杂环境下的识别稳定性。',
                metrics: [
                  { value: '12+', label: '攻击算法覆盖' },
                  { value: '98.2%', label: '加固后识别稳定性' },
                  { value: '<2h', label: '全量测试耗时' },
                ],
                tags: ['智能驾驶', '目标检测', 'ADAS系统', '激光雷达'],
                mock: <AutonomousDrivingMock />,
              },
              {
                id: 'financial',
                icon: '🏦',
                accentColor: '#7c3aed',
                tag: '金融风控模型',
                title: '训练数据 PII 隐私合规扫描',
                subtitle: '自动化去标识化，从源头阻断数据泄露',
                desc: '训练数据包含大量用户敏感信息（PII），直接训练面临严重的合规与泄露风险。自动化隐私扫描与去标识化检测，从源头阻断数据泄露，满足 GDPR / 个保法合规要求。',
                metrics: [
                  { value: 'GDPR', label: '合规标准满足' },
                  { value: '1,327+', label: '敏感字段识别' },
                  { value: '100%', label: 'PII 检出率' },
                ],
                tags: ['征信建模', '反欺诈', '量化投研', '信贷风控'],
                mock: <FinancialRiskMock />,
              },
              {
                id: 'llm',
                icon: '🤖',
                accentColor: '#059669',
                tag: '企业级大模型微调',
                title: '微调数据集深度隐私风险排查',
                subtitle: '防止模型"记忆"商业机密，保障核心资产安全',
                desc: '企业内部知识库包含商业机密，直接用于微调开源大模型可能导致模型"记忆"并泄露机密。针对微调数据集进行深度隐私风险排查，防止模型过拟合敏感数据，保障企业核心资产安全。',
                metrics: [
                  { value: '0', label: '机密泄露风险' },
                  { value: '深度', label: '隐私排查级别' },
                  { value: '一键', label: '风险报告生成' },
                ],
                tags: ['知识库微调', 'LoRA训练', '垂直领域模型', '内部数据集'],
                mock: <LLMFinetuneMock />,
              },
            ].map(sol => (
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

      {/* ── Tech Compatibility ────────────────────────────────── */}
      <section id="mse-compat" style={{ background: '#fff', padding: '80px 0', borderTop: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 40px' }}>
          <ScrollReveal>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <div style={{ display: 'inline-block', fontSize: 11, color: '#7c3aed', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 700, marginBottom: 12, padding: '4px 16px', background: '#f5f3ff', borderRadius: 20 }}>
                技术优势
              </div>
              <h2 style={{ fontSize: 32, fontWeight: 800, color: '#0f172a', margin: '0 0 12px' }}>企业级架构，无缝集成</h2>
              <p style={{ fontSize: 15, color: '#64748b' }}>兼容主流 AI 框架与云平台，多种部署方式灵活选择</p>
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'stretch' }}>

              {/* 左侧：兼容生态 Logo 墙 */}
              <div style={{ background: '#f8fafc', borderRadius: 20, border: '1px solid #e2e8f0', padding: '36px 32px' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', marginBottom: 6 }}>兼容主流框架与云平台</div>
                <div style={{ fontSize: 13, color: '#64748b', marginBottom: 28, lineHeight: 1.65 }}>无需改变现有技术栈，原生支持您已在使用的框架和云服务。</div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
                  {[
                    { name: 'PyTorch',     icon: '🔥', color: '#ee4c2c' },
                    { name: 'TensorFlow', icon: '🧮', color: '#ff6f00' },
                    { name: 'ONNX',        icon: '🔗', color: '#717171' },
                    { name: 'AWS',         icon: '☁️', color: '#ff9900' },
                    { name: 'Azure',       icon: '🌐', color: '#0078d4' },
                    { name: '阿里云',      icon: '🌟', color: '#ff6a00' },
                    { name: 'Hugging Face',icon: '🤗', color: '#ffcc00' },
                    { name: 'scikit-learn',icon: '📊', color: '#f89939' },
                    { name: 'Kubernetes',  icon: '⚙️', color: '#326ce5' },
                  ].map((item) => (
                    <div key={item.name} style={{ padding: '14px 10px', background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, boxShadow: '0 1px 4px rgba(0,0,0,0.04)', transition: 'all 0.18s' }}>
                      <span style={{ fontSize: 20 }}>{item.icon}</span>
                      <span style={{ fontSize: 10, color: '#64748b', fontWeight: 600, textAlign: 'center', lineHeight: 1.3 }}>{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 右侧：部署方式 */}
              <div style={{ background: 'linear-gradient(135deg,#0f172a 0%,#2e1065 60%,#1e293b 100%)', borderRadius: 20, border: '1px solid rgba(124,58,237,0.2)', padding: '36px 32px', display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 6 }}>灵活部署，随需而变</div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 32, lineHeight: 1.65 }}>无论您的安全策略如何，都能找到匹配的部署方案。</div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 20, flex: 1 }}>
                  {[
                    {
                      icon: '🔒', color: '#a78bfa', borderColor: 'rgba(167,139,250,0.3)', bg: 'rgba(167,139,250,0.07)',
                      title: '私有化部署',
                      desc: '数据不出域，物理隔离。完全掌控数据全生命周期，满足最高安全等级要求。',
                      tags: ['离线运行', '等保三级', '数据零上传'],
                    },
                    {
                      icon: '⚡', color: '#10b981', borderColor: 'rgba(16,185,129,0.3)', bg: 'rgba(16,185,129,0.07)',
                      title: 'SaaS 云端版',
                      desc: '开箱即用，弹性扩容。无需运维，分钟级接入，按量计费。',
                      tags: ['即开即用', '自动扩容', 'API接入'],
                    },
                    {
                      icon: '🌐', color: '#60a5fa', borderColor: 'rgba(96,165,250,0.3)', bg: 'rgba(96,165,250,0.07)',
                      title: '混合云架构',
                      desc: '核心数据本地化，算力云端化。兼顾安全合规与弹性算力，最优成本结构。',
                      tags: ['数据本地', '云端算力', '成本最优'],
                    },
                  ].map((item) => (
                    <div key={item.title} style={{ padding: '18px 20px', borderRadius: 14, background: item.bg, border: `1px solid ${item.borderColor}`, display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                      <div style={{ width: 38, height: 38, borderRadius: 10, background: `${item.color}22`, border: `1px solid ${item.borderColor}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>
                        {item.icon}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                          <div style={{ width: 16, height: 16, borderRadius: '50%', background: item.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <span style={{ fontSize: 9, color: '#fff', fontWeight: 800 }}>✓</span>
                          </div>
                          <span style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>{item.title}</span>
                        </div>
                        <p style={{ margin: '0 0 10px', fontSize: 12, color: 'rgba(255,255,255,0.55)', lineHeight: 1.65 }}>{item.desc}</p>
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                          {item.tags.map(t => (
                            <span key={t} style={{ fontSize: 10, padding: '2px 8px', borderRadius: 6, background: `${item.color}15`, color: item.color, border: `1px solid ${item.borderColor}`, fontWeight: 600 }}>{t}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── 简单四步 ──────────────────────────────────────────── */}
      <section id="mse-process" style={{ background: 'linear-gradient(180deg,#f8fafc 0%,#f0f4f8 100%)', borderTop: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '72px 40px' }}>
          <ScrollReveal>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <div style={{ display: 'inline-block', fontSize: 11, color: '#7c3aed', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 700, marginBottom: 12, padding: '4px 16px', background: '#f5f3ff', borderRadius: 20 }}>
                简单四步
              </div>
              <h2 style={{ fontSize: 28, fontWeight: 800, color: '#0f172a', margin: '0 0 12px' }}>快速启动您的数据安全评测</h2>
              <p style={{ fontSize: 14, color: '#64748b', margin: 0 }}>从上传到报告，全程自动化，最快1小时出结果</p>
            </div>
          </ScrollReveal>
          <ScrollReveal>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0, position: 'relative' }}>
              {[
                { num: 1, color: '#7c3aed', bg: '#f5f3ff', icon: <Upload size={22} />, title: '上传数据集', desc: '支持 CSV、JSON、图像等主流格式，或选择平台内置数据集' },
                { num: 2, color: '#3b82f6', bg: '#eff6ff', icon: <Tag size={22} />, title: '选择评测指标', desc: '从数据质量、隐私合规、标注准确性等维度选择' },
                { num: 3, color: '#059669', bg: '#f0fdf4', icon: <Search size={22} />, title: '自动扫描', desc: '平台自动化扫描，识别敏感信息与质量问题' },
                { num: 4, color: '#f59e0b', bg: '#fffbeb', icon: <FileText size={22} />, title: '查看评测结果', desc: '获取详细的合规报告与数据质量优化建议' },
              ].map((step, i, arr) => (
                <React.Fragment key={step.num}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: '0 0 200px', padding: '0 12px' }}>
                    <div style={{ width: 68, height: 68, borderRadius: '50%', background: step.bg, border: `2px solid ${step.color}28`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: step.color, marginBottom: 16, position: 'relative', boxShadow: `0 6px 24px ${step.color}1e` }}>
                      {step.icon}
                      <div style={{ position: 'absolute', top: -6, right: -6, width: 22, height: 22, borderRadius: '50%', background: step.color, color: '#fff', fontSize: 11, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 2px 8px ${step.color}50` }}>
                        {step.num}
                      </div>
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', marginBottom: 8, textAlign: 'center' }}>{step.title}</div>
                    <div style={{ fontSize: 12, color: '#64748b', textAlign: 'center', lineHeight: 1.65 }}>{step.desc}</div>
                  </div>
                  {i < arr.length - 1 && (
                    <div style={{ flex: '1 0 24px', height: 2, background: `linear-gradient(90deg,${arr[i].color}50,${arr[i+1].color}50)`, maxWidth: 72, marginBottom: 60 }} />
                  )}
                </React.Fragment>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section id="mse-cta" style={{ position: 'relative', overflow: 'hidden', background: 'linear-gradient(135deg,#f0fdf4 0%,#dcfce7 50%,#d1fae5 100%)', padding: '70px 40px', borderTop: '1px solid #bbf7d0' }}>
        <div style={{ maxWidth: 660, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: '#064e3b', marginBottom: 14 }}>开始您的数据安全评测之旅</h2>
          <p style={{ fontSize: 14, color: '#374151', marginBottom: 32, lineHeight: 1.8 }}>
            全面检测您的数据集，在训练前发现并修复隐私风险与质量问题
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={openModal}
              style={{ padding: '14px 40px', borderRadius: 10, background: 'linear-gradient(135deg,#059669,#10b981)', border: 'none', color: '#fff', fontSize: 15, fontWeight: 800, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8, boxShadow: '0 4px 22px rgba(16,185,129,0.35)' }}>
              <Search size={16} /> 开始数据评测
            </button>
            <button onClick={() => navigate('/developer')}
              style={{ padding: '14px 32px', borderRadius: 10, background: '#fff', border: '1.5px solid #6ee7b7', color: '#065f46', fontSize: 15, fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <Lock size={15} /> 查看技术文档
            </button>
          </div>
        </div>
      </section>

      <LightweightUploadTaskModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        variant="model-data"
      />
      <GuestGuard open={showGuestGuard} onClose={() => setShowGuestGuard(false)} action="创建模型数据安全评测任务" />
    </div>
  );
}
