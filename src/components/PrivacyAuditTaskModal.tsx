import React, { useState } from 'react';
import { X, Upload, ChevronDown, CheckCircle } from 'lucide-react';
import { useUser } from '../context/UserContext';

interface PrivacyAuditTaskModalProps {
  open: boolean;
  onClose: () => void;
}

type DataType = 'text' | 'structured' | 'code';

const DATA_TYPE_CONFIG: Record<DataType, {
  label: string;
  icon: string;
  desc: string;
  builtinFiles: string[];
  scanDims: string[];
}> = {
  text: {
    label: '非结构化文本',
    icon: '📄',
    desc: '客服记录、合同文档、邮件等',
    builtinFiles: [
      '客服对话记录集-v2.1',
      '合同文档样本集-v1.3',
      '企业邮件存档集-v1.0',
      '运营日志文本集-v1.5',
    ],
    scanDims: ['身份证号', '手机号码', '银行卡号', '姓名', '住址', '电子邮箱', '护照号', '社保账号'],
  },
  structured: {
    label: '结构化表格',
    icon: '📊',
    desc: 'Excel 员工名单、数据库导出、CSV 文件等',
    builtinFiles: [
      '员工档案表样本-v1.2',
      '用户注册信息集-v2.0',
      '客户资料数据库导出-v1.1',
      '运营报表样本集-v1.0',
    ],
    scanDims: ['身份证号', '手机号码', '银行卡号', '姓名', '住址', '电子邮箱', '出生日期', '薪资信息'],
  },
  code: {
    label: '代码/日志',
    icon: '💻',
    desc: '硬编码密钥、API Log、配置文件等',
    builtinFiles: [
      '应用日志样本集-v1.3',
      'API请求日志集-v2.0',
      '配置文件扫描集-v1.1',
      '代码仓库扫描集-v1.0',
    ],
    scanDims: ['硬编码密钥', 'API Token', '数据库连接串', '手机号码', '身份证号', '电子邮箱', 'IP地址', '内网域名'],
  },
};

const REPORT_FORMATS = ['HTML 交互报告', 'PDF 可导出报告', 'JSON 机器可读', 'CSV 汇总表'];

export function PrivacyAuditTaskModal({ open, onClose }: PrivacyAuditTaskModalProps) {
  const { addTask, user } = useUser();
  const [dataType, setDataType] = useState<DataType>('text');
  const [taskName, setTaskName] = useState('');
  const [fileMode, setFileMode] = useState<'builtin' | 'upload' | 'path'>('builtin');
  const [builtinFile, setBuiltinFile] = useState(DATA_TYPE_CONFIG.text.builtinFiles[0]);
  const [filePath, setFilePath] = useState('');
  const [selectedDims, setSelectedDims] = useState<string[]>([]);
  const [reportFormat, setReportFormat] = useState('HTML 交互报告');
  const [enableDesensitize, setEnableDesensitize] = useState(true);
  const [emailNotify, setEmailNotify] = useState(false);
  const [notifyEmail, setNotifyEmail] = useState(user?.email ?? '');
  const [submitted, setSubmitted] = useState(false);

  const cfg = DATA_TYPE_CONFIG[dataType];

  const toggleDim = (d: string) => {
    setSelectedDims(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d]);
  };

  const handleDataTypeChange = (t: DataType) => {
    setDataType(t);
    setSelectedDims([]);
    setBuiltinFile(DATA_TYPE_CONFIG[t].builtinFiles[0]);
  };

  const handleSubmit = () => {
    if (!taskName.trim()) return;
    addTask({
      id: `privacy-${Date.now()}`,
      name: taskName.trim(),
      model: `个人敏感信息审查引擎`,
      modelType: `${cfg.label}扫描`,
      evalSet: fileMode === 'builtin' ? builtinFile : fileMode === 'path' ? filePath : '自定义文件',
      evalType: '个人敏感信息审查',
      status: '排队中',
      score: null,
      createdAt: new Date().toISOString().split('T')[0],
      plan: 'free',
    });
    setSubmitted(true);
    setTimeout(() => { setSubmitted(false); onClose(); }, 1200);
  };

  if (!open) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }}>
      <div style={{ background: '#fff', borderRadius: 16, width: '100%', maxWidth: 720, maxHeight: '92vh', overflowY: 'auto', boxShadow: '0 24px 80px rgba(0,0,0,0.18)', position: 'relative' }}>

        {/* Header */}
        <div style={{ padding: '24px 32px 20px', borderBottom: '1px solid #f0f0f0', background: 'linear-gradient(135deg,#faf5ff,#f5f0ff)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '3px 10px', background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.25)', borderRadius: 20, fontSize: 11, color: '#7c3aed', fontWeight: 700, marginBottom: 8 }}>
                🛡️ 个人敏感信息审查
              </div>
              <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: '#0f172a' }}>新建敏感信息审查任务</h2>
              <p style={{ margin: '4px 0 0', fontSize: 13, color: '#64748b' }}>配置数据类型、识别范围与报告格式，开始自动化隐私合规检测</p>
            </div>
            <button onClick={onClose} style={{ background: '#f1f5f9', border: 'none', borderRadius: 8, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <X size={16} />
            </button>
          </div>
        </div>

        <div style={{ padding: '24px 32px' }}>

          {/* Task Name */}
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 8 }}>
              任务名称 <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <input
              value={taskName}
              onChange={e => setTaskName(e.target.value)}
              placeholder="例如：2026Q2 员工档案隐私合规审查…"
              style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 14, outline: 'none', boxSizing: 'border-box', transition: 'border 0.2s' }}
              onFocus={e => (e.target.style.borderColor = '#8b5cf6')}
              onBlur={e => (e.target.style.borderColor = '#e2e8f0')}
            />
          </div>

          {/* Data Type */}
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 8 }}>数据类型</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
              {(Object.entries(DATA_TYPE_CONFIG) as [DataType, typeof DATA_TYPE_CONFIG[DataType]][]).map(([key, c]) => {
                const active = dataType === key;
                return (
                  <button key={key} onClick={() => handleDataTypeChange(key)}
                    style={{ padding: '14px 10px', border: `2px solid ${active ? '#8b5cf6' : '#e2e8f0'}`, borderRadius: 10, background: active ? '#faf5ff' : '#fafafa', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, transition: 'all 0.2s', textAlign: 'center' }}>
                    <span style={{ fontSize: 24 }}>{c.icon}</span>
                    <span style={{ fontSize: 13, fontWeight: active ? 700 : 500, color: active ? '#7c3aed' : '#374151' }}>{c.label}</span>
                    <span style={{ fontSize: 11, color: '#94a3b8', lineHeight: 1.4 }}>{c.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* File Source */}
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 8 }}>数据来源</label>
            <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
              {[{ key: 'builtin', label: '内置演示集' }, { key: 'upload', label: '本地上传' }, { key: 'path', label: '文件路径' }].map(m => (
                <button key={m.key} onClick={() => setFileMode(m.key as any)}
                  style={{ padding: '6px 14px', border: `1.5px solid ${fileMode === m.key ? '#8b5cf6' : '#e2e8f0'}`, borderRadius: 20, background: fileMode === m.key ? '#faf5ff' : '#fff', color: fileMode === m.key ? '#7c3aed' : '#64748b', fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}>
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
              <div style={{ border: '2px dashed #d8b4fe', borderRadius: 10, padding: '24px', textAlign: 'center', background: '#faf5ff', cursor: 'pointer' }}>
                <Upload size={24} style={{ color: '#8b5cf6', marginBottom: 8 }} />
                <div style={{ fontSize: 13, color: '#374151', fontWeight: 500 }}>拖放文件到此处，或<span style={{ color: '#7c3aed' }}>点击上传</span></div>
                <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>支持 TXT / DOCX / PDF / CSV / XLSX / JSON / LOG，最大 100MB</div>
              </div>
            )}
            {fileMode === 'path' && (
              <input value={filePath} onChange={e => setFilePath(e.target.value)}
                placeholder="/data/employee_records.xlsx"
                style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 14, outline: 'none', boxSizing: 'border-box', fontFamily: 'monospace' }} />
            )}
          </div>

          {/* Scan Dimensions */}
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 8 }}>识别范围</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {cfg.scanDims.map(d => {
                const sel = selectedDims.includes(d);
                return (
                  <button key={d} onClick={() => toggleDim(d)}
                    style={{ padding: '6px 14px', border: `1.5px solid ${sel ? '#8b5cf6' : '#e2e8f0'}`, borderRadius: 20, background: sel ? '#faf5ff' : '#fff', color: sel ? '#7c3aed' : '#374151', fontSize: 12, fontWeight: sel ? 700 : 500, cursor: 'pointer', transition: 'all 0.2s' }}>
                    {d}
                  </button>
                );
              })}
            </div>
            {selectedDims.length === 0 && <p style={{ fontSize: 12, color: '#94a3b8', margin: '6px 0 0' }}>未选择则默认启用全部识别维度</p>}
          </div>

          {/* Report Format */}
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 8 }}>报告格式</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
              {REPORT_FORMATS.map(f => (
                <button key={f} onClick={() => setReportFormat(f)}
                  style={{ padding: '9px 8px', border: `1.5px solid ${reportFormat === f ? '#8b5cf6' : '#e2e8f0'}`, borderRadius: 8, background: reportFormat === f ? '#faf5ff' : '#fafafa', color: reportFormat === f ? '#7c3aed' : '#374151', fontSize: 12, fontWeight: reportFormat === f ? 700 : 500, cursor: 'pointer', transition: 'all 0.2s', textAlign: 'center' }}>
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Desensitize option */}
          <div style={{ marginBottom: 24, padding: '14px 16px', background: '#f8f5ff', borderRadius: 10, border: '1px solid rgba(139,92,246,0.15)' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
              <input type="checkbox" checked={enableDesensitize} onChange={e => setEnableDesensitize(e.target.checked)}
                style={{ width: 16, height: 16, accentColor: '#8b5cf6', cursor: 'pointer' }} />
              <div>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>同时输出脱敏建议版本</span>
                <span style={{ display: 'block', fontSize: 12, color: '#94a3b8', marginTop: 2 }}>审查完成后，报告附带已脱敏处理的数据预览（如 110101****1234）</span>
              </div>
            </label>
          </div>

          {/* Email Notification */}
          <div style={{ marginBottom: 28 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
              <input type="checkbox" checked={emailNotify} onChange={e => setEmailNotify(e.target.checked)}
                style={{ width: 16, height: 16, accentColor: '#8b5cf6', cursor: 'pointer' }} />
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
            style={{ width: '100%', padding: '14px', border: 'none', borderRadius: 10, background: submitted ? '#10b981' : (!taskName.trim() ? '#e2e8f0' : 'linear-gradient(135deg,#8b5cf6,#7c3aed)'), color: submitted ? '#fff' : (!taskName.trim() ? '#94a3b8' : '#fff'), fontSize: 15, fontWeight: 700, cursor: taskName.trim() && !submitted ? 'pointer' : 'not-allowed', transition: 'all 0.3s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            {submitted ? <><CheckCircle size={18} /> 任务已创建！</> : '创建审查任务'}
          </button>
        </div>
      </div>
    </div>
  );
}
