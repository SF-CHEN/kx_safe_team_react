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
  BarChart2, Shield, CheckCircle, ArrowRight,
  Upload, X, FileText, Lock, Zap, Eye, Cpu,
} from 'lucide-react';

// ── Types ─────────────────────────────────────────────────────────

type ModalStep = 'config' | 'metrics' | 'submit';
type BoxMode = 'whitebox' | 'blackbox';
type SubmitState = 'confirm' | 'success';

// ── Metric data ───────────────────────────────────────────────────

const MODEL_WB_GROUPS = [
  { id: 'robust',   label: '鲁棒性评测',     color: '#3b82f6', bg: '#eff6ff', items: ['FGSM_resistance', 'PGD_resistance', 'CW_resistance', 'AutoAttack'] },
  { id: 'privacy',  label: '隐私与记忆性',   color: '#7c3aed', bg: '#f5f3ff', items: ['MIA_risk', 'model_inversion', 'memorization_score'] },
  { id: 'fairness', label: '公平性评测',     color: '#059669', bg: '#f0fdf4', items: ['demographic_parity', 'equal_opportunity', 'calibration'] },
  { id: 'explain',  label: '可解释性',       color: '#0891b2', bg: '#ecfeff', items: ['SHAP_score', 'LIME_score', 'gradient_saliency'] },
  { id: 'backdoor', label: '后门检测',       color: '#f59e0b', bg: '#fffbeb', items: ['trigger_detection', 'activation_clustering'] },
  { id: 'ood',      label: '分布外检测',     color: '#ef4444', bg: '#fef2f2', items: ['OOD_AUROC', 'uncertainty_calibration'] },
];

const MODEL_BB_GROUPS = [
  { id: 'bb_rob',  label: '黑盒鲁棒性评测', color: '#3b82f6', bg: '#eff6ff', items: ['transfer_attack', 'query_attack', 'decision_boundary'] },
  { id: 'bb_priv', label: '黑盒隐私推断',   color: '#7c3aed', bg: '#f5f3ff', items: ['shadow_model_attack', 'attribute_inference'] },
  { id: 'bb_bias', label: '黑盒偏见检测',   color: '#059669', bg: '#f0fdf4', items: ['disparate_impact', 'proxy_discrimination'] },
];

const MODEL_OPTIONS = ['ResNet-50', 'ViT-B/16', 'GPT-4o-mini', 'Llama-3-8B', 'Qwen2.5-7B', 'Custom-Model'];

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

function DeepModelTaskModal({ open, onClose }: ModalProps) {
  const navigate = useNavigate();
  const { addTask } = useUser();
  const [step, setStep]               = useState<ModalStep>('config');
  const [model, setModel]             = useState('');
  const [boxMode, setBoxMode]         = useState<BoxMode>('whitebox');
  const [metrics, setMetrics]         = useState<Record<string, string[]>>({});
  const [submitState, setSubmitState] = useState<SubmitState>('confirm');
  const [email, setEmail]             = useState('');

  React.useEffect(() => {
    if (open) {
      setStep('config');
      setModel(''); setBoxMode('whitebox');
      setMetrics({}); setSubmitState('confirm'); setEmail('');
    }
  }, [open]);

  const reset = () => {
    setStep('config'); setModel('');
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
  const getActiveGroups = () => boxMode === 'whitebox' ? MODEL_WB_GROUPS : MODEL_BB_GROUPS;
  const submitTask = () => {
    addTask({
      id: `deep-model-${Date.now()}`,
      name: `${model || '自定义模型'}可信评测`,
      model: model || '自定义模型',
      modelType: boxMode === 'whitebox' ? '白盒模型' : '黑盒模型',
      evalSet: `${totalSelected || '默认'}项可信指标`,
      evalType: '深度模型可信测评',
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

        {/* ── Header ── */}
        <div style={{ background: 'linear-gradient(135deg,#0f172a 0%,#1e3a8a 55%,#1d4ed8 100%)', padding: '16px 24px', display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
            <div style={{ width: 34, height: 34, borderRadius: 9, background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BarChart2 size={17} color="#93c5fd" />
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', lineHeight: 1.2 }}>创建深度模型可信评测任务</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)', marginTop: 1 }}>深度模型可信测评平台</div>
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
                    border: i === curIdx ? '2px solid #93c5fd' : 'none',
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
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '6px 14px', borderRadius: 8, background: '#eff6ff', border: '1px solid #bfdbfe' }}>
                <BarChart2 size={13} color="#1d4ed8" />
                <span style={{ fontSize: 12, fontWeight: 600, color: '#1d4ed8' }}>深度模型可信评测</span>
              </div>

              <div style={{ background: '#f8fafc', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>任务配置</div>

                <FormField label="目标模型" required>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <select value={model} onChange={e => setModel(e.target.value)}
                      style={{ flex: 1, padding: '8px 12px', borderRadius: 8, border: `1.5px solid ${model ? '#1d4ed8' : '#e2e8f0'}`, fontSize: 13, background: '#fff', color: model ? '#0f172a' : '#94a3b8' }}>
                      <option value="">请选择目标模型（支持主流框架格式）</option>
                      {MODEL_OPTIONS.map(m => <option key={m}>{m}</option>)}
                    </select>
                    <button style={{ padding: '8px 14px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', fontSize: 12, color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, whiteSpace: 'nowrap' }}>
                      <Upload size={12} /> 本地上传
                    </button>
                  </div>
                </FormField>

                <FormField label="评测配置文件">
                  <div style={{ display: 'flex', gap: 8 }}>
                    <select style={{ flex: 1, padding: '8px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 13, background: '#fff', color: '#94a3b8' }}>
                      <option value="">请选择配置文件（可选，默认使用标准评测配置）</option>
                    </select>
                    <button style={{ padding: '8px 14px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', fontSize: 12, color: '#64748b', cursor: 'pointer', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 5 }}>
                      <Upload size={12} /> 自定义上传
                    </button>
                    <button style={{ padding: '8px 14px', borderRadius: 8, border: '1px solid #1d4ed8', background: '#eff6ff', fontSize: 12, color: '#1d4ed8', cursor: 'pointer', whiteSpace: 'nowrap', fontWeight: 600 }}>
                      查看示例
                    </button>
                  </div>
                </FormField>

                <div style={{ padding: '12px 14px', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 8, display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                  <CheckCircle size={14} color="#1d4ed8" style={{ marginTop: 1, flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: '#1e40af', lineHeight: 1.65 }}>
                    支持 PyTorch (.pt/.pth)、TensorFlow (.pb)、ONNX (.onnx) 等主流格式，也可直接选择平台内置的标准测试模型。
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
                <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'linear-gradient(135deg,#1e3a8a,#1d4ed8)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <BarChart2 size={26} color="#fff" />
                </div>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>确认提交深度模型可信评测任务</div>
                <div style={{ fontSize: 13, color: '#64748b', lineHeight: 1.65 }}>
                  预计耗时 <strong style={{ color: '#0f172a' }}>30 分钟</strong>，完成后将发送邮件通知。
                </div>
              </div>
              <div style={{ background: '#f8fafc', borderRadius: 12, padding: 18, border: '1px solid #e2e8f0', marginBottom: 20, display: 'flex', flexDirection: 'column', gap: 9 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#374151', marginBottom: 4 }}>任务概览</div>
                {[
                  { label: '评测类型', val: '深度模型可信评测' },
                  { label: '评测模式', val: boxMode === 'whitebox' ? '白盒模式' : '黑盒模式' },
                  { label: '目标模型', val: model || '未选择' },
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
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 9, border: `1.5px solid ${email ? '#1d4ed8' : '#e2e8f0'}`, fontSize: 13, color: '#0f172a', background: '#fff', outline: 'none', boxSizing: 'border-box' }} />
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
                style={{ padding: '13px 32px', borderRadius: 10, background: 'linear-gradient(135deg,#1e3a8a,#1d4ed8)', border: 'none', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8, boxShadow: '0 4px 18px rgba(29,78,216,0.35)' }}>
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
                background: 'linear-gradient(135deg,#1e3a8a,#1d4ed8)',
                color: '#fff',
                display: 'flex', alignItems: 'center', gap: 6,
                boxShadow: '0 2px 10px rgba(29,78,216,0.3)',
              }}>
              {step === 'submit' ? '确认提交' : '下一步'} <ArrowRight size={13} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Hero Dashboard: Model Analysis Visualization ───────────────────

function HeroModelDashboard() {
  return (
    <div style={{ position: 'relative', width: 460, height: 400, flexShrink: 0 }}>
      {/* Glowing rings */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }} aria-hidden="true">
        <defs>
          <style>{`
            @keyframes heroRingB{0%{transform:scale(0.82);opacity:0.45}100%{transform:scale(1.55);opacity:0}}
            @keyframes heroPulseB{0%,100%{opacity:0.25}50%{opacity:0.65}}
            @keyframes scanBarB{0%{top:40px;opacity:0.9}48%{top:200px;opacity:0.9}50%{opacity:0}51%{top:40px;opacity:0}100%{top:40px;opacity:0}}
          `}</style>
        </defs>
        {[0, 0.9, 1.8].map((delay, i) => (
          <ellipse key={i} cx="230" cy="200" rx="165" ry="142"
            fill="none"
            stroke={['#1d4ed8','#3b82f6','#93c5fd'][i]}
            strokeWidth="1.2"
            style={{ animation: `heroRingB 3.2s ease-out infinite ${delay}s`, transformOrigin: '230px 200px' }} />
        ))}
        <ellipse cx="230" cy="200" rx="155" ry="133" fill="none" stroke="#1d4ed8" strokeWidth="1.8"
          style={{ animation: 'heroPulseB 4s ease-in-out infinite', opacity: 0.2 }} />
      </svg>

      {/* Main dashboard card */}
      <div style={{
        position: 'absolute',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%) perspective(900px) rotateX(6deg) rotateY(-5deg)',
        width: 330, height: 230,
        background: 'linear-gradient(145deg, #0c1524 0%, #1e293b 100%)',
        borderRadius: 18,
        border: '1px solid rgba(29,78,216,0.45)',
        boxShadow: '0 0 50px rgba(29,78,216,0.22), 0 24px 70px rgba(0,0,0,0.55)',
        overflow: 'hidden',
      }}>
        {/* Title bar */}
        <div style={{ padding: '9px 14px', background: 'rgba(29,78,216,0.12)', borderBottom: '1px solid rgba(29,78,216,0.22)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ display: 'flex', gap: 5 }}>
            {['#ef4444','#f59e0b','#10b981'].map((c, i) => (
              <div key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: c, opacity: 0.75 }} />
            ))}
          </div>
          <span style={{ flex: 1, textAlign: 'center', fontSize: 9.5, color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace' }}>deep_model_eval.py</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 6px #10b981' }} />
            <span style={{ fontSize: 8.5, color: '#34d399', fontWeight: 700 }}>LIVE</span>
          </div>
        </div>

        {/* Code area */}
        <div style={{ padding: '12px 14px', position: 'relative', overflow: 'hidden', height: 'calc(100% - 52px)' }}>
          {[
            { t: '>>> model.load("resnet50_v2.pth")', c: '#93c5fd' },
            { t: '>>> eval.run(checks=["robust","privacy","fairness"])', c: '#bfdbfe' },
            { t: '[✓] 正在分析鲁棒性抗攻击能力...', c: '#34d399' },
            { t: '[WARN] FGSM 攻击成功率 → 12.4%', c: '#fbbf24' },
            { t: '[WARN] 检测到后门触发器嫌疑特征', c: '#f87171' },
            { t: '[SCAN] 可信综合评分: 82.7 / 100', c: '#e2e8f0' },
            { t: '[DONE] 报告 → trust_report_2026.pdf', c: '#93c5fd' },
          ].map((line, i) => (
            <div key={i} style={{ fontSize: 8.5, fontFamily: 'monospace', color: line.c, marginBottom: 5, opacity: 0.95, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {line.t}
            </div>
          ))}
          {/* Scanning bar */}
          <div style={{
            position: 'absolute', left: 0, right: 0, height: 2,
            background: 'linear-gradient(90deg, transparent 0%, rgba(29,78,216,0.9) 50%, transparent 100%)',
            boxShadow: '0 0 10px rgba(29,78,216,0.6)',
            animation: 'scanBarB 3.5s linear infinite',
          }} />
          {/* Status row */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '5px 14px', background: 'rgba(0,0,0,0.45)', display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: 10 }}>
              <span style={{ fontSize: 8, color: '#93c5fd', fontFamily: 'monospace' }}>鲁棒 ✓</span>
              <span style={{ fontSize: 8, color: '#93c5fd', fontFamily: 'monospace' }}>隐私 ✓</span>
              <span style={{ fontSize: 8, color: '#fbbf24', fontFamily: 'monospace' }}>后门…</span>
            </div>
            <span style={{ fontSize: 8, color: '#94a3b8', fontFamily: 'monospace' }}>87%</span>
          </div>
        </div>
      </div>

      {/* Stat cards */}
      {[
        { v: '20+', sub: '可信维度', top: '6%',  left: '0%',  color: '#60a5fa', glow: 'rgba(96,165,250,0.35)' },
        { v: '98.1%', sub: '加固后鲁棒性', top: '6%', right: '0%', color: '#4ade80', glow: 'rgba(74,222,128,0.35)' },
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

// ── Panel: Robustness Radar ────────────────────────────────────────

function RobustnessDashboard() {
  const axes = [
    { label: '旋转鲁棒', value: 0.82 },
    { label: '噪声抗性', value: 0.91 },
    { label: '遮挡容忍', value: 0.74 },
    { label: '亮度适应', value: 0.88 },
    { label: '对比度', value: 0.79 },
    { label: '模糊抵抗', value: 0.95 },
  ];
  const N = axes.length;
  const R = 78;
  const cx = 120, cy = 120;
  const angle = (i: number) => (i * 2 * Math.PI) / N - Math.PI / 2;
  const pt = (i: number, r: number) => ({
    x: cx + r * Math.cos(angle(i)),
    y: cy + r * Math.sin(angle(i)),
  });

  const gridLevels = [0.25, 0.5, 0.75, 1.0];
  const dataPoints = axes.map((a, i) => pt(i, a.value * R));
  const dataPath = dataPoints.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ') + 'Z';

  return (
    <div style={{ width: '100%', background: 'linear-gradient(150deg,#0c1524,#1a2540,#1e293b)', borderRadius: 20, padding: '20px', overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ display: 'flex', gap: 4 }}>
            {['#ef4444','#f59e0b','#10b981'].map((c,i) => <div key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: c, opacity: 0.7 }} />)}
          </div>
          <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace' }}>robustness_radar.py</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#3b82f6', boxShadow: '0 0 6px #3b82f6' }} />
          <span style={{ fontSize: 9, color: '#93c5fd', fontWeight: 700 }}>ANALYSIS</span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
        {/* Radar SVG */}
        <svg width="240" height="240" viewBox="0 0 240 240" style={{ flexShrink: 0 }}>
          <defs>
            <radialGradient id="radarFill" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#1d4ed8" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.15" />
            </radialGradient>
          </defs>
          {/* Grid */}
          {gridLevels.map((level, li) => {
            const points = axes.map((_, i) => pt(i, level * R));
            const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ') + 'Z';
            return (
              <path key={li} d={path} fill="none"
                stroke="rgba(255,255,255,0.1)" strokeWidth="0.8" />
            );
          })}
          {/* Axis lines */}
          {axes.map((_, i) => {
            const end = pt(i, R);
            return <line key={i} x1={cx} y1={cy} x2={end.x} y2={end.y} stroke="rgba(255,255,255,0.15)" strokeWidth="0.8" />;
          })}
          {/* Data polygon */}
          <path d={dataPath} fill="url(#radarFill)" stroke="#3b82f6" strokeWidth="2" opacity="0.9" />
          {/* Data dots */}
          {dataPoints.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r="4" fill="#60a5fa" stroke="#1d4ed8" strokeWidth="1.5" />
          ))}
          {/* Labels */}
          {axes.map((a, i) => {
            const labelPt = pt(i, R + 20);
            return (
              <text key={i} x={labelPt.x} y={labelPt.y}
                textAnchor="middle" dominantBaseline="middle"
                fill="rgba(255,255,255,0.6)" style={{ fontSize: 9 }}>
                {a.label}
              </text>
            );
          })}
        </svg>

        {/* Right: metrics */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6, paddingTop: 8 }}>
          {axes.map((a, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(59,130,246,0.15)', borderRadius: 8, padding: '7px 10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)' }}>{a.label}</span>
                <span style={{ fontSize: 12, fontWeight: 800, color: '#60a5fa', fontFamily: 'monospace' }}>{Math.round(a.value * 100)}%</span>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 3, height: 3, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${a.value * 100}%`, background: `linear-gradient(90deg,#1d4ed8,#60a5fa)`, borderRadius: 3 }} />
              </div>
            </div>
          ))}
          <div style={{ marginTop: 4, background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 8, padding: '8px 10px', textAlign: 'center' }}>
            <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)', marginBottom: 2 }}>综合鲁棒性评分</div>
            <div style={{ fontSize: 22, fontWeight: 900, color: '#34d399', fontFamily: 'monospace' }}>85.2</div>
            <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)' }}>/ 100</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Panel: Adversarial Attack Simulation ──────────────────────────

function AdversarialDemo() {
  const [attackType, setAttackType] = useState<'fgsm' | 'pgd' | 'cw'>('fgsm');
  const [epsilon, setEpsilon] = useState(0.03);

  const attacks = [
    { id: 'fgsm' as const, label: 'FGSM', color: '#ef4444', successRate: 0.124 },
    { id: 'pgd' as const, label: 'PGD', color: '#f59e0b', successRate: 0.183 },
    { id: 'cw' as const, label: 'C&W', color: '#8b5cf6', successRate: 0.071 },
  ];
  const current = attacks.find(a => a.id === attackType)!;
  const effectiveRate = Math.min(current.successRate * (1 + epsilon * 10), 0.95);

  return (
    <div style={{ width: '100%', background: 'linear-gradient(150deg,#0c1524,#1a2540,#1e293b)', borderRadius: 20, overflow: 'hidden' }}>
      <div style={{ padding: '10px 14px', background: 'rgba(239,68,68,0.08)', borderBottom: '1px solid rgba(239,68,68,0.18)', display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ display: 'flex', gap: 4 }}>
          {['#ef4444','#f59e0b','#10b981'].map((c,i) => <div key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: c, opacity: 0.7 }} />)}
        </div>
        <span style={{ flex: 1, textAlign: 'center', fontSize: 9.5, color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace' }}>adversarial_lab.py</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#ef4444', boxShadow: '0 0 6px #ef4444' }} />
          <span style={{ fontSize: 8.5, color: '#f87171', fontWeight: 700 }}>ATTACK LAB</span>
        </div>
      </div>

      <div style={{ padding: '16px' }}>
        {/* Attack type selector */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
          {attacks.map(a => (
            <button key={a.id} onClick={() => setAttackType(a.id)}
              style={{ flex: 1, padding: '6px 8px', borderRadius: 7, fontSize: 11, fontWeight: 700, cursor: 'pointer', border: `1.5px solid ${attackType === a.id ? a.color : 'rgba(255,255,255,0.1)'}`, background: attackType === a.id ? `${a.color}20` : 'transparent', color: attackType === a.id ? a.color : 'rgba(255,255,255,0.45)', transition: 'all 0.15s' }}>
              {a.label}
            </button>
          ))}
        </div>

        {/* Epsilon slider */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: 9.5, color: 'rgba(255,255,255,0.4)' }}>扰动强度 ε</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: current.color, fontFamily: 'monospace' }}>{epsilon.toFixed(2)}</span>
          </div>
          <input type="range" min="0.01" max="0.3" step="0.01" value={epsilon}
            onChange={e => setEpsilon(parseFloat(e.target.value))}
            style={{ width: '100%', accentColor: current.color, cursor: 'pointer' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
            <span style={{ fontSize: 8, color: 'rgba(255,255,255,0.25)' }}>弱 (0.01)</span>
            <span style={{ fontSize: 8, color: 'rgba(255,255,255,0.25)' }}>强 (0.30)</span>
          </div>
        </div>

        {/* Visual: before/after */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
          {/* Original */}
          <div style={{ flex: 1, background: 'rgba(255,255,255,0.04)', borderRadius: 8, padding: '8px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ fontSize: 8.5, color: 'rgba(255,255,255,0.35)', marginBottom: 6 }}>原始图像</div>
            <svg viewBox="0 0 60 60" style={{ width: '100%', height: 60 }}>
              <rect width="60" height="60" fill="#1e3a5f" rx="4" />
              <rect x="15" y="10" width="30" height="40" rx="2" fill="#2563eb" opacity="0.6" />
              <circle cx="30" cy="25" r="10" fill="#3b82f6" opacity="0.7" />
              <text x="30" y="46" textAnchor="middle" fill="rgba(255,255,255,0.5)" style={{ fontSize: 7 }}>STOP</text>
              <text x="4" y="56" fill="#10b981" style={{ fontSize: 6 }}>✓ 识别: STOP</text>
            </svg>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
            <div style={{ fontSize: 16, color: current.color }}>→</div>
            <span style={{ fontSize: 7.5, color: current.color, fontWeight: 700, textAlign: 'center', lineHeight: 1.3 }}>{current.label}<br />Attack</span>
          </div>

          {/* Adversarial */}
          <div style={{ flex: 1, background: 'rgba(255,255,255,0.04)', borderRadius: 8, padding: '8px', border: `1px solid ${current.color}30` }}>
            <div style={{ fontSize: 8.5, color: current.color, marginBottom: 6 }}>对抗样本</div>
            <svg viewBox="0 0 60 60" style={{ width: '100%', height: 60 }}>
              <rect width="60" height="60" fill="#1e3a5f" rx="4" />
              {Array.from({ length: 200 }, (_, i) => (
                <rect key={i}
                  x={Math.random() * 60} y={Math.random() * 60}
                  width="1" height="1"
                  fill={`rgba(${Math.random() > 0.5 ? '239,68,68' : '255,255,255'},${Math.min(epsilon * 2, 0.6)})`}
                />
              ))}
              <rect x="15" y="10" width="30" height="40" rx="2" fill="#2563eb" opacity="0.5" />
              <circle cx="30" cy="25" r="10" fill="#3b82f6" opacity="0.5" />
              <text x="30" y="46" textAnchor="middle" fill="rgba(255,255,255,0.4)" style={{ fontSize: 7 }}>STOP</text>
              <text x="4" y="56" fill="#ef4444" style={{ fontSize: 6 }}>✗ 误判: SPEED</text>
            </svg>
          </div>
        </div>

        {/* Metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
          <div style={{ background: `${current.color}0e`, border: `1px solid ${current.color}28`, borderRadius: 7, padding: '7px 9px' }}>
            <div style={{ fontSize: 8.5, color: 'rgba(255,255,255,0.4)', marginBottom: 2 }}>攻击成功率</div>
            <div style={{ fontSize: 16, fontWeight: 900, color: current.color, fontFamily: 'monospace' }}>
              {(effectiveRate * 100).toFixed(1)}%
            </div>
          </div>
          <div style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 7, padding: '7px 9px' }}>
            <div style={{ fontSize: 8.5, color: 'rgba(255,255,255,0.4)', marginBottom: 2 }}>加固后成功率</div>
            <div style={{ fontSize: 16, fontWeight: 900, color: '#34d399', fontFamily: 'monospace' }}>
              {(effectiveRate * 0.15 * 100).toFixed(1)}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Panel: Model Hardening Suggestions ───────────────────────────

function HardenPanel() {
  const suggestions = [
    { icon: '🛡️', color: '#3b82f6', title: '对抗训练加固', desc: '注入 FGSM/PGD 对抗样本进行混合训练，显著提升对已知攻击类型的抵御能力', gain: '+23.4%' },
    { icon: '🔒', color: '#7c3aed', title: '差分隐私保护', desc: '添加 DP-SGD 噪声防止成员推断攻击，保护训练数据隐私，MIA 风险降低至近零', gain: '-98%' },
    { icon: '🧹', color: '#10b981', title: '后门样本清洗', desc: '使用谱特征分析识别并移除触发器样本，在不损害正常准确率的前提下消除后门', gain: '100%清除' },
    { icon: '📦', color: '#f59e0b', title: '模型量化压缩', desc: 'INT8 量化结合随机剪枝，在保持鲁棒性的同时将模型体积减少 75%', gain: '-75%体积' },
  ];

  return (
    <div style={{ width: '100%', background: 'linear-gradient(150deg,#0c1524,#1a2540,#1e293b)', borderRadius: 20, overflow: 'hidden' }}>
      <div style={{ padding: '10px 14px', background: 'rgba(59,130,246,0.1)', borderBottom: '1px solid rgba(59,130,246,0.2)', display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ display: 'flex', gap: 4 }}>
          {['#ef4444','#f59e0b','#10b981'].map((c,i) => <div key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: c, opacity: 0.7 }} />)}
        </div>
        <span style={{ flex: 1, textAlign: 'center', fontSize: 9.5, color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace' }}>model_hardening.py</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#3b82f6', boxShadow: '0 0 6px #3b82f6' }} />
          <span style={{ fontSize: 8.5, color: '#93c5fd', fontWeight: 700 }}>SUGGESTIONS</span>
        </div>
      </div>

      <div style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {suggestions.map((s, i) => (
          <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', background: `${s.color}08`, border: `1px solid ${s.color}22`, borderRadius: 10, padding: '10px 12px' }}>
            <span style={{ fontSize: 18, flexShrink: 0 }}>{s.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: s.color }}>{s.title}</span>
                <span style={{ fontSize: 10, fontWeight: 800, color: '#34d399', fontFamily: 'monospace' }}>{s.gain}</span>
              </div>
              <p style={{ margin: 0, fontSize: 9.5, color: 'rgba(255,255,255,0.45)', lineHeight: 1.6 }}>{s.desc}</p>
            </div>
          </div>
        ))}
        <div style={{ marginTop: 4, padding: '10px 12px', background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.18)', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', flexShrink: 0 }} />
          <span style={{ fontSize: 9.5, color: '#34d399', fontWeight: 600 }}>按推荐方案加固后，预计综合可信评分 82.7 → 96.4</span>
        </div>
      </div>
    </div>
  );
}

// ── Scenario Mocks ────────────────────────────────────────────────

function AutonomousVisionMock() {
  return (
    <div style={{ background: 'linear-gradient(150deg,#0c1524,#1a2540)', borderRadius: 14, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)' }}>
      <div style={{ padding: '8px 12px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 6 }}>
        <div style={{ display: 'flex', gap: 3 }}>
          {['#ef4444','#f59e0b','#10b981'].map((c,i) => <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: c, opacity: 0.7 }} />)}
        </div>
        <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)', fontFamily: 'monospace' }}>lidar_vision_eval.py</span>
      </div>
      <div style={{ padding: '14px 12px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', marginBottom: 5 }}>清晴天气识别准确率</div>
            <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 5, height: 5, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: '98%', background: 'linear-gradient(90deg,#10b981,#34d399)', borderRadius: 5 }} />
            </div>
            <div style={{ fontSize: 10, color: '#34d399', fontWeight: 700, marginTop: 2 }}>98.2%</div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', marginBottom: 5 }}>大雾/暴雨后识别准确率</div>
            <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 5, height: 5, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: '71%', background: 'linear-gradient(90deg,#ef4444,#f87171)', borderRadius: 5 }} />
            </div>
            <div style={{ fontSize: 10, color: '#f87171', fontWeight: 700, marginTop: 2 }}>71.0% ⚠</div>
          </div>
        </div>
        {[
          { attack: 'FGSM (ε=0.03)', before: '89.1%', after: '98.6%', c: '#3b82f6' },
          { attack: 'PGD (ε=0.05)',  before: '76.8%', after: '95.3%', c: '#7c3aed' },
          { attack: '物理贴片攻击',  before: '54.2%', after: '91.7%', c: '#f59e0b' },
        ].map((r, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: 10, alignItems: 'center', background: 'rgba(255,255,255,0.03)', borderRadius: 7, padding: '7px 9px' }}>
            <span style={{ fontSize: 9.5, color: 'rgba(255,255,255,0.5)', fontFamily: 'monospace' }}>{r.attack}</span>
            <span style={{ fontSize: 10, fontWeight: 700, color: '#ef4444', fontFamily: 'monospace' }}>{r.before}</span>
            <span style={{ fontSize: 10, fontWeight: 700, color: '#34d399', fontFamily: 'monospace' }}>→ {r.after}</span>
          </div>
        ))}
        <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.25)', textAlign: 'right' }}>对抗训练加固后数值</div>
      </div>
    </div>
  );
}

function MedicalAIMock() {
  const findings = [
    { type: '成员推断攻击', risk: 'HIGH', rate: '23.1%', fixed: '1.4%' },
    { type: '模型逆向攻击', risk: 'HIGH', rate: '14.8%', fixed: '0.7%' },
    { type: '属性推断',     risk: 'MED',  rate: '8.2%',  fixed: '2.1%' },
  ];
  const riskColor: Record<string, string> = { HIGH: '#ef4444', MED: '#f59e0b', LOW: '#10b981' };
  return (
    <div style={{ background: 'linear-gradient(150deg,#0c1524,#1a2540)', borderRadius: 14, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)' }}>
      <div style={{ padding: '8px 12px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 6 }}>
        <div style={{ display: 'flex', gap: 3 }}>
          {['#ef4444','#f59e0b','#10b981'].map((c,i) => <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: c, opacity: 0.7 }} />)}
        </div>
        <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)', fontFamily: 'monospace' }}>privacy_mia_audit.py</span>
      </div>
      <div style={{ padding: '14px 12px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.28)', marginBottom: 2 }}>隐私泄露风险审计报告</div>
        {findings.map((f, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto auto', gap: 8, alignItems: 'center', background: 'rgba(255,255,255,0.03)', borderRadius: 7, padding: '8px 10px' }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: riskColor[f.risk], flexShrink: 0 }} />
            <span style={{ fontSize: 9.5, color: 'rgba(255,255,255,0.5)' }}>{f.type}</span>
            <span style={{ fontSize: 10, fontWeight: 700, color: riskColor[f.risk], fontFamily: 'monospace' }}>{f.rate}</span>
            <span style={{ fontSize: 10, fontWeight: 700, color: '#34d399', fontFamily: 'monospace' }}>→ {f.fixed}</span>
          </div>
        ))}
        <div style={{ padding: '8px 10px', background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.18)', borderRadius: 8, display: 'flex', gap: 8, alignItems: 'center' }}>
          <span style={{ fontSize: 10, color: '#34d399' }}>✓</span>
          <span style={{ fontSize: 9.5, color: '#34d399' }}>DP-SGD 差分隐私加固已应用，患者隐私合规 HIPAA/个保法</span>
        </div>
      </div>
    </div>
  );
}

function FinancialModelMock() {
  const dims = [
    { label: '性别公平性', before: 0.61, after: 0.94, color: '#3b82f6' },
    { label: '地域平等机会', before: 0.73, after: 0.91, color: '#7c3aed' },
    { label: '校准置信度',  before: 0.78, after: 0.96, color: '#10b981' },
  ];
  return (
    <div style={{ background: 'linear-gradient(150deg,#0c1524,#1a2540)', borderRadius: 14, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)' }}>
      <div style={{ padding: '8px 12px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 6 }}>
        <div style={{ display: 'flex', gap: 3 }}>
          {['#ef4444','#f59e0b','#10b981'].map((c,i) => <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: c, opacity: 0.7 }} />)}
        </div>
        <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)', fontFamily: 'monospace' }}>fairness_audit.py</span>
      </div>
      <div style={{ padding: '14px 12px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.28)', marginBottom: 2 }}>信贷模型公平性评测报告</div>
        {dims.map((d, i) => (
          <div key={i}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontSize: 9.5, color: 'rgba(255,255,255,0.5)' }}>{d.label}</span>
              <div style={{ display: 'flex', gap: 8 }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: '#ef4444', fontFamily: 'monospace' }}>{Math.round(d.before * 100)}%</span>
                <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>→</span>
                <span style={{ fontSize: 10, fontWeight: 700, color: '#34d399', fontFamily: 'monospace' }}>{Math.round(d.after * 100)}%</span>
              </div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 4, height: 6, overflow: 'hidden', position: 'relative' }}>
              <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${d.before * 100}%`, background: 'rgba(239,68,68,0.4)', borderRadius: 4 }} />
              <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${d.after * 100}%`, background: `linear-gradient(90deg,${d.color},${d.color}cc)`, borderRadius: 4, opacity: 0.7 }} />
            </div>
          </div>
        ))}
        <div style={{ display: 'flex', gap: 6 }}>
          {['去偏重采样','校准后处理','约束优化训练'].map(t => (
            <span key={t} style={{ fontSize: 8.5, padding: '3px 8px', borderRadius: 5, background: 'rgba(59,130,246,0.12)', color: '#93c5fd', border: '1px solid rgba(59,130,246,0.2)' }}>{t} ✓</span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Interactive Adversarial Attack Lab (full section) ─────────────

function AdversarialAttackLab() {
  type AttackType = 'FGSM' | 'PGD' | 'GaussianBlur';
  const [attackType, setAttackType] = useState<AttackType>('FGSM');
  const [epsilon, setEpsilon] = useState(0.007);
  const isAttacking = false;
  const [attacked, setAttacked] = useState(true);

  const attacks: { id: AttackType; label: string; color: string; wrongLabel: string; wrongConf: number }[] = [
    { id: 'FGSM',        label: 'FGSM',        color: '#ef4444', wrongLabel: '汽车',  wrongConf: 34 },
    { id: 'PGD',         label: 'PGD',         color: '#f59e0b', wrongLabel: '飞机',  wrongConf: 27 },
    { id: 'GaussianBlur',label: 'GaussianBlur', color: '#8b5cf6', wrongLabel: '建筑',  wrongConf: 61 },
  ];
  const current = attacks.find(a => a.id === attackType)!;

  const handleAttackTypeChange = (t: AttackType) => { setAttackType(t); setAttacked(true); };

  const noiseSeed = Math.round(epsilon * 1000);
  const noiseOpacity = Math.min(epsilon * 6, 0.82);
  const blurPx = attackType === 'GaussianBlur' ? epsilon * 60 : 0;

  return (
    <section style={{ background: 'linear-gradient(135deg,#f0f4ff 0%,#f8fafc 100%)', padding: '80px 0', borderTop: '1px solid #e2e8f0' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 40px' }}>
        <ScrollReveal>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ display: 'inline-block', fontSize: 11, color: '#7c3aed', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 700, marginBottom: 12, padding: '4px 16px', background: '#f5f3ff', border: '1px solid #ddd6fe', borderRadius: 20 }}>
              效果预览
            </div>
            <h2 style={{ fontSize: 'clamp(28px,3.5vw,42px)', fontWeight: 900, color: '#0f172a', margin: '0 0 12px' }}>深度模型可信评测结果预览</h2>
            <p style={{ fontSize: 15, color: '#64748b', maxWidth: 560, margin: '0 auto', lineHeight: 1.8 }}>
              通过内置攻击样例查看对抗扰动如何影响模型判断，以及正式报告如何呈现风险与加固建议
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <div style={{ background: '#fff', borderRadius: 24, border: '1px solid #e2e8f0', boxShadow: '0 8px 40px rgba(0,0,0,0.08)', overflow: 'hidden' }}>

            {/* ── Lab header bar ── */}
            <div style={{ padding: '14px 24px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444' }} />
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#f59e0b' }} />
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981' }} />
                <span style={{ marginLeft: 8, fontSize: 13, fontWeight: 700, color: '#0f172a' }}>对抗攻击实验室</span>
                <span style={{ fontSize: 12, color: '#94a3b8' }}>内置样例展示不同攻击方式下的模型误判与可信度变化</span>
              </div>
              <div style={{ padding: '7px 14px', borderRadius: 8, background: '#ecfdf5', color: '#047857', fontSize: 12, fontWeight: 700 }}>内置报告样例</div>
            </div>

            <div style={{ padding: '24px' }}>
              {/* ── Info note ── */}
              <div style={{ padding: '10px 16px', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 10, marginBottom: 20, fontSize: 12, color: '#1e40af', lineHeight: 1.65 }}>
                本演示使用预训练的 <strong>ResNet-50</strong> 图像分类模型作为目标，系统将模拟该模型在面对对抗样本时的识别效果过程。
              </div>

              {/* ── Controls row ── */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 28, flexWrap: 'wrap' }}>
                {/* Attack type selector */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#374151', whiteSpace: 'nowrap' }}>攻击算法</span>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {attacks.map(a => (
                      <button key={a.id} onClick={() => handleAttackTypeChange(a.id)}
                        style={{ padding: '5px 14px', borderRadius: 7, border: `1.5px solid ${attackType === a.id ? a.color : '#e2e8f0'}`, background: attackType === a.id ? `${a.color}12` : '#fff', color: attackType === a.id ? a.color : '#64748b', fontSize: 12, fontWeight: 700, cursor: 'pointer', transition: 'all 0.15s' }}>
                        {a.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Epsilon slider */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 220 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#374151', whiteSpace: 'nowrap' }}>扰动强度 ε</span>
                  <input type="range" min="0.001" max="0.3" step="0.001" value={epsilon}
                    onChange={e => { setEpsilon(parseFloat(e.target.value)); setAttacked(true); }}
                    style={{ flex: 1, accentColor: current.color, cursor: 'pointer', height: 4 }} />
                  <span style={{ fontSize: 13, fontWeight: 800, color: current.color, fontFamily: 'monospace', width: 42, textAlign: 'right' }}>{epsilon.toFixed(3)}</span>
                </div>
              </div>

              {/* ── Image comparison ── */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 20, alignItems: 'center' }}>

                {/* Original */}
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
                    原始图片
                  </div>
                  <div style={{ position: 'relative', borderRadius: 14, overflow: 'hidden', border: '2px solid #e2e8f0', background: '#f1f5f9', aspectRatio: '16/10' }}>
                    {/* House SVG scene */}
                    <svg viewBox="0 0 400 250" style={{ width: '100%', height: '100%', display: 'block' }}>
                      {/* Sky gradient */}
                      <defs>
                        <linearGradient id="skyG" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#93c5fd" />
                          <stop offset="100%" stopColor="#dbeafe" />
                        </linearGradient>
                        <linearGradient id="grassG" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#4ade80" />
                          <stop offset="100%" stopColor="#16a34a" />
                        </linearGradient>
                      </defs>
                      <rect width="400" height="250" fill="url(#skyG)" />
                      <rect y="170" width="400" height="80" fill="url(#grassG)" />
                      {/* House body */}
                      <rect x="110" y="100" width="180" height="90" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
                      {/* Roof */}
                      <polygon points="100,100 200,45 300,100" fill="#dc2626" />
                      {/* Door */}
                      <rect x="180" y="145" width="40" height="45" rx="4" fill="#92400e" />
                      <circle cx="215" cy="168" r="3" fill="#fbbf24" />
                      {/* Windows */}
                      <rect x="125" y="115" width="42" height="32" rx="3" fill="#bfdbfe" stroke="#93c5fd" strokeWidth="1" />
                      <line x1="146" y1="115" x2="146" y2="147" stroke="#93c5fd" strokeWidth="0.8" />
                      <line x1="125" y1="131" x2="167" y2="131" stroke="#93c5fd" strokeWidth="0.8" />
                      <rect x="233" y="115" width="42" height="32" rx="3" fill="#bfdbfe" stroke="#93c5fd" strokeWidth="1" />
                      <line x1="254" y1="115" x2="254" y2="147" stroke="#93c5fd" strokeWidth="0.8" />
                      <line x1="233" y1="131" x2="275" y2="131" stroke="#93c5fd" strokeWidth="0.8" />
                      {/* Chimney */}
                      <rect x="240" y="52" width="20" height="38" fill="#9ca3af" />
                      {/* Tree */}
                      <rect x="58" y="150" width="8" height="30" fill="#92400e" />
                      <ellipse cx="62" cy="140" rx="24" ry="28" fill="#16a34a" />
                      <rect x="325" y="155" width="8" height="25" fill="#92400e" />
                      <ellipse cx="329" cy="146" rx="20" ry="24" fill="#15803d" />
                      {/* Path */}
                      <path d="M170 190 Q200 185 230 190 L240 250 L160 250 Z" fill="#d4b483" />
                      {/* Sun */}
                      <circle cx="350" cy="35" r="22" fill="#fbbf24" opacity="0.85" />
                    </svg>

                    {/* Classification label */}
                    <div style={{ position: 'absolute', bottom: 10, left: 10, background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(8px)', borderRadius: 10, padding: '8px 12px', boxShadow: '0 4px 16px rgba(0,0,0,0.12)', border: '1.5px solid #bbf7d0' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 3 }}>
                        <span style={{ fontSize: 11, color: '#059669', fontWeight: 700 }}>✓ 正确识别</span>
                      </div>
                      <div style={{ fontSize: 10, color: '#374151' }}>ResNet-50 识别结果</div>
                      <div style={{ fontSize: 13, fontWeight: 800, color: '#0f172a', marginTop: 2 }}>🏠 房屋</div>
                      <div style={{ fontSize: 10, color: '#64748b' }}>置信度 <strong style={{ color: '#059669' }}>99%</strong></div>
                    </div>
                  </div>
                </div>

                {/* Arrow middle */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: `${current.color}15`, border: `2px solid ${current.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: 18, color: current.color }}>{isAttacking ? '⚡' : attacked ? '✓' : '→'}</span>
                  </div>
                  <span style={{ fontSize: 10, fontWeight: 700, color: current.color, textAlign: 'center', lineHeight: 1.3 }}>
                    {attackType}<br />Attack
                  </span>
                  <span style={{ fontSize: 9, color: '#94a3b8', textAlign: 'center' }}>ε={epsilon.toFixed(3)}</span>
                </div>

                {/* Adversarial */}
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: attacked ? '#ef4444' : '#d1d5db', display: 'inline-block', transition: 'background 0.3s' }} />
                    添加扰动后
                  </div>
                  <div style={{ position: 'relative', borderRadius: 14, overflow: 'hidden', border: `2px solid ${attacked ? '#fca5a5' : '#e2e8f0'}`, background: '#f1f5f9', aspectRatio: '16/10', transition: 'border-color 0.3s' }}>
                    <svg viewBox="0 0 400 250" style={{ width: '100%', height: '100%', display: 'block', filter: attacked && attackType === 'GaussianBlur' ? `blur(${Math.min(blurPx, 4)}px)` : 'none', transition: 'filter 0.4s' }}>
                      <defs>
                        <linearGradient id="skyG2" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#93c5fd" />
                          <stop offset="100%" stopColor="#dbeafe" />
                        </linearGradient>
                        <linearGradient id="grassG2" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#4ade80" />
                          <stop offset="100%" stopColor="#16a34a" />
                        </linearGradient>
                        <filter id="noiseFilter">
                          <feTurbulence type="fractalNoise" baseFrequency={attacked ? 0.65 + epsilon * 2 : 0} numOctaves="4" seed={noiseSeed} result="noise" />
                          <feColorMatrix type="saturate" values="0" in="noise" result="grayNoise" />
                          <feBlend in="SourceGraphic" in2="grayNoise" mode="hard-light" result="blended" />
                          <feComponentTransfer in="blended">
                            <feFuncA type="linear" slope="1" />
                          </feComponentTransfer>
                        </filter>
                      </defs>
                      <g filter={attacked && attackType !== 'GaussianBlur' ? 'url(#noiseFilter)' : ''} opacity={attacked ? 1 : 0.9}>
                        <rect width="400" height="250" fill="url(#skyG2)" />
                        <rect y="170" width="400" height="80" fill="url(#grassG2)" />
                        <rect x="110" y="100" width="180" height="90" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
                        <polygon points="100,100 200,45 300,100" fill="#dc2626" />
                        <rect x="180" y="145" width="40" height="45" rx="4" fill="#92400e" />
                        <circle cx="215" cy="168" r="3" fill="#fbbf24" />
                        <rect x="125" y="115" width="42" height="32" rx="3" fill="#bfdbfe" stroke="#93c5fd" strokeWidth="1" />
                        <line x1="146" y1="115" x2="146" y2="147" stroke="#93c5fd" strokeWidth="0.8" />
                        <line x1="125" y1="131" x2="167" y2="131" stroke="#93c5fd" strokeWidth="0.8" />
                        <rect x="233" y="115" width="42" height="32" rx="3" fill="#bfdbfe" stroke="#93c5fd" strokeWidth="1" />
                        <line x1="254" y1="115" x2="254" y2="147" stroke="#93c5fd" strokeWidth="0.8" />
                        <line x1="233" y1="131" x2="275" y2="131" stroke="#93c5fd" strokeWidth="0.8" />
                        <rect x="240" y="52" width="20" height="38" fill="#9ca3af" />
                        <rect x="58" y="150" width="8" height="30" fill="#92400e" />
                        <ellipse cx="62" cy="140" rx="24" ry="28" fill="#16a34a" />
                        <rect x="325" y="155" width="8" height="25" fill="#92400e" />
                        <ellipse cx="329" cy="146" rx="20" ry="24" fill="#15803d" />
                        <path d="M170 190 Q200 185 230 190 L240 250 L160 250 Z" fill="#d4b483" />
                        <circle cx="350" cy="35" r="22" fill="#fbbf24" opacity="0.85" />
                      </g>
                      {/* Extra noise overlay for FGSM/PGD */}
                      {attacked && attackType !== 'GaussianBlur' && (
                        <rect width="400" height="250" fill="none"
                          style={{
                            backgroundImage: `url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='4' height='4'><rect width='4' height='4' fill='%23000' opacity='0'/><circle cx='1' cy='1' r='0.5' fill='%23${attackType === 'FGSM' ? 'ef4444' : 'f59e0b'}' opacity='${Math.min(noiseOpacity * 0.4, 0.5)}'/></svg>")`,
                          }}
                        />
                      )}
                      {/* Loading shimmer */}
                      {isAttacking && (
                        <rect width="400" height="250" fill="rgba(239,68,68,0.08)">
                          <animate attributeName="opacity" values="0;0.5;0" dur="0.6s" repeatCount="2" />
                        </rect>
                      )}
                    </svg>

                    {/* Classification label */}
                    <div style={{
                      position: 'absolute', bottom: 10, left: 10,
                      background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(8px)',
                      borderRadius: 10, padding: '8px 12px',
                      boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                      border: `1.5px solid ${attacked ? '#fca5a5' : '#e2e8f0'}`,
                      transition: 'border-color 0.3s',
                      opacity: attacked ? 1 : 0.5,
                    }}>
                      {attacked ? (
                        <>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 3 }}>
                            <span style={{ fontSize: 11, color: '#ef4444', fontWeight: 700 }}>✗ 识别错误</span>
                          </div>
                          <div style={{ fontSize: 10, color: '#374151' }}>ResNet-50 识别结果</div>
                          <div style={{ fontSize: 13, fontWeight: 800, color: '#0f172a', marginTop: 2 }}>
                            {current.wrongLabel === '汽车' ? '🚗' : current.wrongLabel === '飞机' ? '✈️' : '🏢'} {current.wrongLabel}
                          </div>
                          <div style={{ fontSize: 10, color: '#64748b' }}>置信度 <strong style={{ color: '#ef4444' }}>{current.wrongConf}%</strong></div>
                        </>
                      ) : (
                        <>
                          <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>原始样本识别结果</div>
                          <div style={{ fontSize: 10, color: '#d1d5db', marginTop: 2 }}>ResNet-50</div>
                        </>
                      )}
                    </div>

                    {/* Noise badge */}
                    {attacked && (
                      <div style={{ position: 'absolute', top: 10, right: 10, background: `${current.color}ee`, borderRadius: 7, padding: '4px 9px' }}>
                        <span style={{ fontSize: 10, fontWeight: 700, color: '#fff' }}>+噪声 ε={epsilon.toFixed(3)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* ── Bottom notes ── */}
              <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 11, color: '#94a3b8', flexWrap: 'wrap', gap: 8 }}>
                <span>✓ 支持 JPG / PNG / WebP 格式 &nbsp;·&nbsp; 本演示仅在浏览器本地运行，不上传至服务器</span>
                <button style={{ background: 'none', border: 'none', color: '#3b82f6', fontSize: 11, cursor: 'pointer', padding: 0 }}>
                  查看攻击原理技术说明 →
                </button>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

// ── Main Page ─────────────────────────────────────────────────────

export function DeepModelEval() {
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
      id: '01', side: 'left' as const, color: '#1d4ed8',
      title: '鲁棒性深度评测',
      heading: '从六个维度量化模型的抗干扰能力',
      desc: '通过旋转、噪声、遮挡、亮度变化、对比度调整、模糊等六类扰动，全面评估视觉模型对自然变换的鲁棒性。支持 FGSM、PGD、C&W 等主流对抗攻击方法，给出可解释的量化评分和加固建议。',
      tags: ['FGSM攻击', 'PGD攻击', 'C&W攻击', '六维鲁棒雷达图', '自适应评测'],
      svg: <RobustnessDashboard />,
      onExperience: openModal,
    },
    {
      id: '02', side: 'right' as const, color: '#7c3aed',
      title: '对抗样本模拟实验室',
      heading: '对抗攻击与防御效果可视化',
      desc: '通过内置报告样例展示不同扰动强度与攻击类型下的原始样本、对抗样本、攻击成功率及防御效果，帮助用户直观理解攻击机理与模型脆弱性边界。',
      tags: ['结果预览', '样本对比', '扰动强度', '误分析可视化'],
      svg: <AdversarialDemo />,
      onExperience: openModal,
    },
    {
      id: '03', side: 'left' as const, color: '#059669',
      title: '智能加固建议引擎',
      heading: '一键生成针对性模型可信加固方案',
      desc: '基于评测结果，智能推荐对抗训练、差分隐私保护、后门样本清洗、模型量化压缩等加固策略。每条建议附带预期效果与实施成本评估，帮助团队制定最优加固优先级。',
      tags: ['对抗训练', 'DP-SGD保护', '后门清洗', '量化压缩', '优先级排序'],
      svg: <HardenPanel />,
      onExperience: openModal,
    },
  ];

  return (
    <div style={{ background: '#fff', minHeight: '100vh', color: '#0f172a' }}>

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="product-detail-hero" style={{ position: 'relative', overflow: 'hidden', background: 'linear-gradient(135deg,#0f172a 0%,#1e3a8a 55%,#1e293b 100%)', padding: '88px 0 76px' }}>
        <ProductHeroBackground side="model" concept="deep-model" />
        <div style={{ maxWidth: 1160, margin: '0 auto', padding: '0 40px', position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', gap: 48, flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 400px', minWidth: 300 }}>
            <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
              <Badge style={{ background: 'rgba(37,99,235,0.08)', color: '#35638e', border: '1px solid rgba(37,99,235,0.22)', fontSize: 11 }}>
                <BarChart2 size={10} style={{ marginRight: 4 }} /> 模型评测
              </Badge>
              <Badge style={{ background: 'rgba(29,78,216,0.2)', color: '#93c5fd', border: '1px solid rgba(29,78,216,0.35)', fontSize: 11 }}>
                深度模型可信测评
              </Badge>
            </div>
            <h1 style={{ margin: '0 0 16px', fontSize: 'clamp(24px,3.4vw,42px)', color: '#fff', lineHeight: 1.2 }}>
              AI模型可信度的
              <br />
              <span style={{ background: 'linear-gradient(90deg,#93c5fd,#34d399)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                全维度深度评测
              </span>
            </h1>
            <p style={{ margin: '0 0 32px', fontSize: 15, color: 'rgba(255,255,255,0.62)', maxWidth: 500, lineHeight: 1.8 }}>
              覆盖鲁棒性、隐私性、公平性、可解释性、后门安全、分布外检测六大可信维度，为大模型与视觉模型提供从评测到加固的一体化深度可信保障服务。
            </p>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              <button onClick={openModal}
                style={{ padding: '13px 32px', borderRadius: 10, background: 'linear-gradient(135deg,#1d4ed8,#059669)', border: 'none', color: '#fff', fontSize: 14, fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 4px 22px rgba(29,78,216,0.45)' }}>
                <Zap size={16} /> 开始模型评测
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
            <HeroModelDashboard />
          </div>
        </div>
      </section>

      <StickySubNav items={[
        { id: 'dme-features', label: '核心功能' },
        { id: 'dme-lab', label: '结果预览' },
        { id: 'dme-scenarios', label: '应用场景' },
        { id: 'dme-compat', label: '技术兼容性' },
        { id: 'dme-process', label: '评测流程' },
        { id: 'dme-cta', label: '创建正式任务' },
      ]} />

      {/* ── Core Features Z-layout ───────────────────────────── */}
      <section id="dme-features" style={{ background: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: 1160, margin: '0 auto', padding: '80px 40px 100px' }}>
          <ScrollReveal>
            <div style={{ textAlign: 'center', marginBottom: 64 }}>
              <div style={{ display: 'inline-block', fontSize: 13, color: '#1d4ed8', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 700, marginBottom: 12, padding: '4px 16px', background: '#eff6ff', borderRadius: 20 }}>
                核心能力矩阵
              </div>
              <h2 style={{ fontSize: 'clamp(28px,3.5vw,44px)', fontWeight: 900, color: '#0f172a', margin: '0 0 12px' }}>六大维度，全面覆盖模型可信风险</h2>
              <p style={{ fontSize: 15, color: '#64748b', margin: 0 }}>从鲁棒性到隐私保护，构建完整的模型可信评测与加固体系</p>
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

      <div id="dme-lab"><AdversarialAttackLab /></div>

      {/* ── Industry Scenarios ────────────────────────────────── */}
      <section id="dme-scenarios" style={{ background: '#f8fafc', padding: '80px 0', borderTop: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 40px' }}>
          <ScrollReveal>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: '#1d4ed8', textTransform: 'uppercase', letterSpacing: '0.12em', margin: '0 0 10px' }}>行业解决方案</p>
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
                tag: '自动驾驶感知',
                title: '视觉识别算法鲁棒性深度验证',
                subtitle: '极端天气与对抗样本下的感知稳定性保障',
                desc: '自动驾驶视觉感知算法在雨雾、强光及对抗贴片等场景下易出现识别失效，引发安全事故。提供六维鲁棒性深度评测，覆盖 FGSM/PGD 等主流攻击，并给出对抗训练加固方案，确保极端场景下的感知稳定性。',
                metrics: [
                  { value: '12+', label: '攻击算法' },
                  { value: '98.2%', label: '加固后稳定性' },
                  { value: '六维', label: '鲁棒评测' },
                ],
                tags: ['自动驾驶', '目标检测', 'ADAS系统', '对抗训练'],
                mock: <AutonomousVisionMock />,
              },
              {
                id: 'medical',
                icon: '🏥',
                accentColor: '#7c3aed',
                tag: '医疗AI诊断',
                title: '医疗模型隐私泄露风险深度审计',
                subtitle: '防止患者数据被成员推断攻击泄露，HIPAA合规',
                desc: '医疗 AI 模型训练于大量患者敏感数据，极易遭受成员推断、模型逆向等隐私攻击，导致患者隐私泄露。针对医疗模型进行隐私风险深度审计，应用差分隐私保护，将攻击成功率从 23% 降至 1% 以下。',
                metrics: [
                  { value: 'HIPAA', label: '合规标准' },
                  { value: '-98%', label: '隐私攻击风险' },
                  { value: '深度', label: '隐私审计' },
                ],
                tags: ['医学影像', '电子病历', '辅助诊断', 'DP-SGD'],
                mock: <MedicalAIMock />,
              },
              {
                id: 'financial',
                icon: '🏦',
                accentColor: '#059669',
                tag: '金融信贷风控',
                title: '信贷评分模型公平性与歧视性检测',
                subtitle: '发现并消除算法偏见，满足监管公平贷款要求',
                desc: '信贷评分模型可能因训练数据中的历史偏见，对不同性别、地域群体产生歧视性决策，面临监管处罚与声誉风险。通过 Demographic Parity、Equal Opportunity 等指标深度量化公平性缺口，提供去偏重采样与校准后处理方案。',
                metrics: [
                  { value: '0', label: '歧视性决策' },
                  { value: '3+', label: '公平性指标' },
                  { value: '一键', label: '去偏修复' },
                ],
                tags: ['信贷风控', '反歧视', '监管合规', '公平ML'],
                mock: <FinancialModelMock />,
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
      <section id="dme-compat" style={{ background: '#fff', padding: '80px 0', borderTop: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 40px' }}>
          <ScrollReveal>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <div style={{ display: 'inline-block', fontSize: 11, color: '#1d4ed8', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 700, marginBottom: 12, padding: '4px 16px', background: '#eff6ff', borderRadius: 20 }}>
                技术优势
              </div>
              <h2 style={{ fontSize: 32, fontWeight: 800, color: '#0f172a', margin: '0 0 12px' }}>企业级架构，无缝集成</h2>
              <p style={{ fontSize: 15, color: '#64748b' }}>兼容主流 AI 框架与云平台，支持私有化部署与 API 接入</p>
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'stretch' }}>
              <div style={{ background: '#f8fafc', borderRadius: 20, border: '1px solid #e2e8f0', padding: '36px 32px' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', marginBottom: 6 }}>兼容主流框架与模型格式</div>
                <div style={{ fontSize: 13, color: '#64748b', marginBottom: 28, lineHeight: 1.65 }}>无需修改现有代码，直接对接您使用的训练框架和模型格式。</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
                  {[
                    { name: 'PyTorch',     icon: '🔥', color: '#ee4c2c' },
                    { name: 'TensorFlow', icon: '🧮', color: '#ff6f00' },
                    { name: 'ONNX',        icon: '🔗', color: '#717171' },
                    { name: 'Hugging Face',icon: '🤗', color: '#ffcc00' },
                    { name: 'JAX',         icon: '🚀', color: '#6366f1' },
                    { name: 'OpenVINO',    icon: '⚡', color: '#0071c5' },
                    { name: 'AWS',         icon: '☁️', color: '#ff9900' },
                    { name: 'Azure',       icon: '🌐', color: '#0078d4' },
                    { name: 'Kubernetes',  icon: '⚙️', color: '#326ce5' },
                  ].map((item) => (
                    <div key={item.name} style={{ padding: '14px 10px', background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                      <span style={{ fontSize: 20 }}>{item.icon}</span>
                      <span style={{ fontSize: 10, color: '#64748b', fontWeight: 600, textAlign: 'center', lineHeight: 1.3 }}>{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ background: 'linear-gradient(135deg,#0f172a 0%,#1e3a8a 60%,#1e293b 100%)', borderRadius: 20, border: '1px solid rgba(29,78,216,0.2)', padding: '36px 32px', display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 6 }}>灵活部署，随需而变</div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 32, lineHeight: 1.65 }}>无论您的安全策略如何，都能找到匹配的部署方案。</div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 20, flex: 1 }}>
                  {[
                    {
                      icon: '🔒', color: '#93c5fd', borderColor: 'rgba(147,197,253,0.3)', bg: 'rgba(147,197,253,0.07)',
                      title: '私有化部署',
                      desc: '数据不出域，物理隔离。完全掌控模型与数据全生命周期，满足最高安全等级要求。',
                      tags: ['离线运行', '等保三级', '数据零上传'],
                    },
                    {
                      icon: '⚡', color: '#10b981', borderColor: 'rgba(16,185,129,0.3)', bg: 'rgba(16,185,129,0.07)',
                      title: 'SaaS 云端版',
                      desc: '开箱即用，弹性扩容。无需运维，分钟级接入，按量计费，快速验证模型可信度。',
                      tags: ['即开即用', '自动扩容', 'API接入'],
                    },
                    {
                      icon: '🌐', color: '#a78bfa', borderColor: 'rgba(167,139,250,0.3)', bg: 'rgba(167,139,250,0.07)',
                      title: '混合云架构',
                      desc: '模型与敏感数据本地化，评测算力云端化。兼顾安全合规与弹性算力，最优成本结构。',
                      tags: ['模型本地', '云端算力', '成本最优'],
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
      <section id="dme-process" style={{ background: 'linear-gradient(180deg,#f8fafc 0%,#f0f4f8 100%)', borderTop: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '72px 40px' }}>
          <ScrollReveal>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <div style={{ display: 'inline-block', fontSize: 11, color: '#1d4ed8', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 700, marginBottom: 12, padding: '4px 16px', background: '#eff6ff', borderRadius: 20 }}>
                简单四步
              </div>
              <h2 style={{ fontSize: 28, fontWeight: 800, color: '#0f172a', margin: '0 0 12px' }}>快速启动您的深度模型可信评测</h2>
              <p style={{ fontSize: 14, color: '#64748b', margin: 0 }}>从上传模型到完整可信报告，全程自动化，最快1小时出结果</p>
            </div>
          </ScrollReveal>
          <ScrollReveal>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0, position: 'relative' }}>
              {[
                { num: 1, color: '#1d4ed8', bg: '#eff6ff', icon: <Upload size={22} />, title: '上传目标模型', desc: '支持 PyTorch、TensorFlow、ONNX 等主流格式，或选择平台内置基准模型' },
                { num: 2, color: '#7c3aed', bg: '#f5f3ff', icon: <Eye size={22} />, title: '选择评测指标', desc: '从鲁棒性、隐私、公平性、可解释性、后门、OOD六大维度按需选择' },
                { num: 3, color: '#059669', bg: '#f0fdf4', icon: <Cpu size={22} />, title: '自动深度评测', desc: '平台自动执行攻击模拟与可信度评估，过程实时可视化' },
                { num: 4, color: '#f59e0b', bg: '#fffbeb', icon: <FileText size={22} />, title: '获取可信报告', desc: '收到详细的可信评分、风险项列表与针对性加固建议' },
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
      <section id="dme-cta" style={{ position: 'relative', overflow: 'hidden', background: 'linear-gradient(135deg,#fdf4ff 0%,#f5f3ff 50%,#ede9fe 100%)', padding: '70px 40px', borderTop: '1px solid #ddd6fe' }}>
        <div style={{ maxWidth: 660, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: '#3b0764', marginBottom: 14 }}>开始您的深度模型可信评测之旅</h2>
          <p style={{ fontSize: 14, color: '#374151', marginBottom: 32, lineHeight: 1.8 }}>
            全面评测您的 AI 模型可信度，在上线前发现并修复鲁棒性、隐私与公平性风险
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={openModal}
              style={{ padding: '14px 40px', borderRadius: 10, background: 'linear-gradient(135deg,#7c3aed,#6d28d9)', border: 'none', color: '#fff', fontSize: 15, fontWeight: 800, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8, boxShadow: '0 4px 22px rgba(124,58,237,0.35)' }}>
              <Zap size={16} /> 开始模型评测
            </button>
            <button onClick={() => navigate('/developer')}
              style={{ padding: '14px 32px', borderRadius: 10, background: '#fff', border: '1.5px solid #c4b5fd', color: '#5b21b6', fontSize: 15, fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <Lock size={15} /> 查看技术文档
            </button>
          </div>
        </div>
      </section>

      <LightweightUploadTaskModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        variant="deep-model"
      />
      <GuestGuard open={showGuestGuard} onClose={() => setShowGuestGuard(false)} action="创建深度模型评测任务" />
    </div>
  );
}
