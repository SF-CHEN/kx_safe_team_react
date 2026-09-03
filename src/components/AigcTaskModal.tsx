import React, { useState } from 'react';
import { X, Upload, ChevronDown, CheckCircle } from 'lucide-react';
import { useUser } from '../context/UserContext';

interface AigcTaskModalProps {
  open: boolean;
  onClose: () => void;
  defaultModality?: 'text' | 'image' | 'audio' | 'video';
  defaultFunc?: 'audit' | 'detect';
}

const MODALITY_CONFIG: Record<string, {
  label: string;
  icon: string;
  builtinFiles: string[];
  auditDims: string[];
  detectDims: string[];
}> = {
  text: {
    label: '文本',
    icon: '📝',
    builtinFiles: ['通用文本审核集-v2.1', '社交平台内容集-v1.3', '新闻资讯审核集-v1.0', '违禁词汇数据集-v3.0'],
    auditDims: ['违禁内容', '色情低俗', '暴力血腥', '政治敏感', '谣言虚假', '广告诈骗', '侮辱歧视', '隐私泄露'],
    detectDims: ['AI生成文本检测', 'GPT系列鉴伪', '文风一致性分析', '语义异常检测', '复制粘贴识别'],
  },
  image: {
    label: '图像',
    icon: '🖼️',
    builtinFiles: ['通用图像审核集-v2.0', '色情违规图像集-v1.5', '暴恐图像数据集-v1.2', '广告图像集-v1.0'],
    auditDims: ['色情低俗', '暴力血腥', '违禁物品', '政治敏感', '广告牛皮癣', '未成年保护', '版权侵权'],
    detectDims: ['AI生成图像检测', 'GAN伪造鉴别', 'Deepfake人脸检测', '图像篡改定位', '隐写信息检测'],
  },
  audio: {
    label: '音频',
    icon: '🎵',
    builtinFiles: ['语音内容审核集-v1.2', '音乐版权数据集-v1.0', '违规语音样本集-v2.0'],
    auditDims: ['违禁语音', '淫秽内容', '政治敏感', '版权侵权', '噪音骚扰', '语音钓鱼'],
    detectDims: ['AI合成语音检测', 'TTS鉴伪', '声纹篡改识别', '语音克隆检测'],
  },
  video: {
    label: '视频',
    icon: '🎬',
    builtinFiles: ['短视频审核集-v2.0', '直播内容数据集-v1.1', '影视内容违规集-v1.0'],
    auditDims: ['色情低俗', '暴力血腥', '违禁内容', '政治敏感', '未成年保护', '版权侵权', '广告插入'],
    detectDims: ['AI生成视频检测', 'Deepfake视频鉴别', '视频篡改检测', '换脸识别', '语音画面不同步'],
  },
};

export function AigcTaskModal({ open, onClose, defaultModality = 'text', defaultFunc = 'audit' }: AigcTaskModalProps) {
  const { addTask, user } = useUser();
  const [modality, setModality] = useState<'text' | 'image' | 'audio' | 'video'>(defaultModality);
  const [func, setFunc] = useState<'audit' | 'detect'>(defaultFunc);
  const [taskName, setTaskName] = useState('');
  const [fileMode, setFileMode] = useState<'builtin' | 'upload' | 'path'>('builtin');
  const [builtinFile, setBuiltinFile] = useState(MODALITY_CONFIG[defaultModality].builtinFiles[0]);
  const [filePath, setFilePath] = useState('');
  const [sampleCount, setSampleCount] = useState(100);
  const [selectedDims, setSelectedDims] = useState<string[]>([]);
  const [plan, setPlan] = useState<'free' | 'paid'>('free');
  const [emailNotify, setEmailNotify] = useState(false);
  const [notifyEmail, setNotifyEmail] = useState(user?.email ?? '');
  const [submitted, setSubmitted] = useState(false);

  const cfg = MODALITY_CONFIG[modality];
  const dims = func === 'audit' ? cfg.auditDims : cfg.detectDims;

  const toggleDim = (d: string) => {
    setSelectedDims(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d]);
  };

  const handleModalityChange = (m: 'text' | 'image' | 'audio' | 'video') => {
    setModality(m);
    setSelectedDims([]);
    setBuiltinFile(MODALITY_CONFIG[m].builtinFiles[0]);
  };

  const handleSubmit = () => {
    if (!taskName.trim()) return;
    addTask({
      id: `aigc-${Date.now()}`,
      name: taskName.trim(),
      model: `${cfg.label}${func === 'audit' ? '审核' : '鉴伪'}模型`,
      modelType: '专用模型',
      evalSet: fileMode === 'builtin' ? builtinFile : fileMode === 'path' ? filePath : '自定义文件',
      evalType: 'AIGC内容审核',
      status: '处理中',
      score: null,
      createdAt: new Date().toISOString().split('T')[0],
      plan,
    });
    setSubmitted(true);
    setTimeout(() => { setSubmitted(false); onClose(); }, 1200);
  };

  if (!open) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }}>
      <div style={{ background: '#fff', borderRadius: 16, width: '100%', maxWidth: 700, maxHeight: '92vh', overflowY: 'auto', boxShadow: '0 24px 80px rgba(0,0,0,0.18)', position: 'relative' }}>
        {/* Header */}
        <div style={{ padding: '24px 32px 20px', borderBottom: '1px solid #f0f0f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: '#0f172a' }}>新建内容审核任务</h2>
              <p style={{ margin: '4px 0 0', fontSize: 13, color: '#64748b' }}>配置 AIGC 内容审核与鉴伪评测参数</p>
            </div>
            <button onClick={onClose} style={{ background: '#f1f5f9', border: 'none', borderRadius: 8, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <X size={16} />
            </button>
          </div>
        </div>

        <div style={{ padding: '24px 32px' }}>
          {/* Task Name */}
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 8 }}>任务名称 <span style={{ color: '#ef4444' }}>*</span></label>
            <input
              value={taskName}
              onChange={e => setTaskName(e.target.value)}
              placeholder="为本次评测任务起一个名称…"
              style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 14, outline: 'none', boxSizing: 'border-box', transition: 'border 0.2s' }}
              onFocus={e => (e.target.style.borderColor = '#6366f1')}
              onBlur={e => (e.target.style.borderColor = '#e2e8f0')}
            />
          </div>

          {/* Modality */}
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 8 }}>内容类型</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
              {(['text', 'image', 'audio', 'video'] as const).map(m => {
                const c = MODALITY_CONFIG[m];
                const active = modality === m;
                return (
                  <button key={m} onClick={() => handleModalityChange(m)}
                    style={{ padding: '12px 8px', border: `2px solid ${active ? '#6366f1' : '#e2e8f0'}`, borderRadius: 10, background: active ? '#eef2ff' : '#fafafa', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, transition: 'all 0.2s' }}>
                    <span style={{ fontSize: 22 }}>{c.icon}</span>
                    <span style={{ fontSize: 13, fontWeight: active ? 700 : 500, color: active ? '#4f46e5' : '#374151' }}>{c.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Function Type */}
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 8 }}>功能类型</label>
            <div style={{ display: 'flex', gap: 10 }}>
              {[
                { key: 'audit', label: '内容审核', desc: '检测违规内容', color: '#f59e0b', bg: '#fffbeb' },
                { key: 'detect', label: 'AI鉴伪', desc: '识别AI生成内容', color: '#6366f1', bg: '#eef2ff' },
              ].map(f => {
                const active = func === f.key;
                return (
                  <button key={f.key} onClick={() => { setFunc(f.key as 'audit' | 'detect'); setSelectedDims([]); }}
                    style={{ flex: 1, padding: '12px 16px', border: `2px solid ${active ? f.color : '#e2e8f0'}`, borderRadius: 10, background: active ? f.bg : '#fafafa', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s' }}>
                    <div style={{ fontWeight: 700, color: active ? f.color : '#374151', fontSize: 14 }}>{f.label}</div>
                    <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{f.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* File Source */}
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 8 }}>数据来源</label>
            <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
              {[{ key: 'builtin', label: '内置数据集' }, { key: 'upload', label: '本地上传' }, { key: 'path', label: '文件路径' }].map(m => (
                <button key={m.key} onClick={() => setFileMode(m.key as any)}
                  style={{ padding: '6px 14px', border: `1.5px solid ${fileMode === m.key ? '#6366f1' : '#e2e8f0'}`, borderRadius: 20, background: fileMode === m.key ? '#eef2ff' : '#fff', color: fileMode === m.key ? '#4f46e5' : '#64748b', fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}>
                  {m.label}
                </button>
              ))}
            </div>
            {fileMode === 'builtin' && (
              <div style={{ position: 'relative' }}>
                <select value={builtinFile} onChange={e => setBuiltinFile(e.target.value)}
                  style={{ width: '100%', padding: '10px 36px 10px 14px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 14, appearance: 'none', background: '#fff', cursor: 'pointer' }}>
                  {cfg.builtinFiles.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
                <ChevronDown size={16} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: '#64748b', pointerEvents: 'none' }} />
              </div>
            )}
            {fileMode === 'upload' && (
              <div style={{ border: '2px dashed #c7d2fe', borderRadius: 10, padding: '24px', textAlign: 'center', background: '#f8f9ff', cursor: 'pointer' }}>
                <Upload size={24} style={{ color: '#6366f1', marginBottom: 8 }} />
                <div style={{ fontSize: 13, color: '#374151', fontWeight: 500 }}>拖放文件到此处，或<span style={{ color: '#4f46e5' }}>点击上传</span></div>
                <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>支持 JSON / CSV / TXT，最大 50MB</div>
              </div>
            )}
            {fileMode === 'path' && (
              <input value={filePath} onChange={e => setFilePath(e.target.value)}
                placeholder="/data/my-dataset.jsonl"
                style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 14, outline: 'none', boxSizing: 'border-box', fontFamily: 'monospace' }} />
            )}
          </div>

          {/* Sample Count — hidden: trial only supports 1 sample */}

          {/* Eval Dimensions */}
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 8 }}>评测维度</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {dims.map(d => {
                const sel = selectedDims.includes(d);
                return (
                  <button key={d} onClick={() => toggleDim(d)}
                    style={{ padding: '6px 14px', border: `1.5px solid ${sel ? '#6366f1' : '#e2e8f0'}`, borderRadius: 20, background: sel ? '#eef2ff' : '#fff', color: sel ? '#4f46e5' : '#374151', fontSize: 12, fontWeight: sel ? 700 : 500, cursor: 'pointer', transition: 'all 0.2s' }}>
                    {d}
                  </button>
                );
              })}
            </div>
            {selectedDims.length === 0 && <p style={{ fontSize: 12, color: '#94a3b8', margin: '6px 0 0' }}>未选择则默认启用全部维度</p>}
          </div>

          {/* Pricing Plan — hidden: managed via API Key, not here */}

          {/* Email Notification */}
          <div style={{ marginBottom: 28 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
              <input type="checkbox" checked={emailNotify} onChange={e => setEmailNotify(e.target.checked)}
                style={{ width: 16, height: 16, accentColor: '#6366f1', cursor: 'pointer' }} />
              <span style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>任务完成后发送邮件通知</span>
            </label>
            {emailNotify && (
              <input value={notifyEmail} onChange={e => setNotifyEmail(e.target.value)}
                placeholder="your@email.com"
                style={{ marginTop: 10, width: '100%', padding: '10px 14px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
            )}
          </div>

          {/* Submit */}
          <button onClick={handleSubmit} disabled={!taskName.trim() || !!submitted}
            style={{ width: '100%', padding: '14px', border: 'none', borderRadius: 10, background: submitted ? '#10b981' : (!taskName.trim() ? '#e2e8f0' : 'linear-gradient(135deg,#6366f1,#8b5cf6)'), color: submitted ? '#fff' : (!taskName.trim() ? '#94a3b8' : '#fff'), fontSize: 15, fontWeight: 700, cursor: taskName.trim() && !submitted ? 'pointer' : 'not-allowed', transition: 'all 0.3s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            {submitted ? <><CheckCircle size={18} /> 任务已创建！</> : '创建评测任务'}
          </button>
        </div>
      </div>
    </div>
  );
}
