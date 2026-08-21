import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { useUser } from '../context/UserContext';
import {
  Zap, Key, Book, Package, BarChart2, HelpCircle, MessageSquare,
  ArrowLeft, Terminal, Copy, Check, Globe, ChevronRight, ExternalLink,
  AlertCircle, Plus, Trash2, Eye, EyeOff, Search, ChevronDown,
} from 'lucide-react';

// ─── Design tokens ────────────────────────────────────────────────
const T = {
  bg: '#1c1c1e',
  sidebar: '#161618',
  card: '#252528',
  code: '#161b22',           // GitHub Dark code bg
  border: 'rgba(255,255,255,0.08)',
  borderStrong: 'rgba(255,255,255,0.15)',
  text: '#f0f0f2',           // primary — near-white
  textSub: '#b8bcc8',        // secondary — clearly visible
  textDim: '#5e6272',        // tertiary
  navInactive: '#9499a8',    // nav items — bright enough
  accent: '#6366f1',
  accentSoft: 'rgba(99,102,241,0.15)',
  accentBorder: 'rgba(99,102,241,0.3)',
  green: '#3fb950',
  orange: '#f0883e',
  red: '#f85149',
};

// ─── Inline syntax tokenizer (no external deps) ──────────────────
const KEYWORDS = new Set([
  'import','export','from','as','default',
  'const','let','var','function','class','return','new','this','typeof','instanceof','void','delete','throw','catch','finally','try','switch','case','break','continue','in','of','for','while','if','else','do','async','await','yield','static','extends','super','interface','type','enum','implements','abstract','namespace','module','declare','public','private','protected','readonly',
  'true','false','null','undefined','null',
  'def','lambda','pass','with','nonlocal','global','raise','except','elif','print','None','True','False','and','or','not',
  'func','var','type','struct','interface','map','chan','go','defer','select','range','make','nil','panic','recover','append','len','cap','package',
  'System','String','int','boolean','double','float','long','char','byte','short','void','throws','final',
  'curl',
]);

type TokType = 'keyword'|'string'|'comment'|'number'|'fn'|'key'|'plain';

interface Tok { type: TokType; value: string }

function tokenize(src: string): Tok[] {
  const out: Tok[] = [];
  let i = 0;
  while (i < src.length) {
    const rest = src.slice(i);
    // single-line comment
    if (rest.startsWith('//') || rest.startsWith('#')) {
      const end = src.indexOf('\n', i);
      const v = end < 0 ? rest : src.slice(i, end);
      out.push({ type: 'comment', value: v }); i += v.length; continue;
    }
    // multi-line comment
    if (rest.startsWith('/*')) {
      const end = src.indexOf('*/', i + 2);
      const v = end < 0 ? rest : src.slice(i, end + 2);
      out.push({ type: 'comment', value: v }); i += v.length; continue;
    }
    const ch = src[i];
    // strings
    if (ch === '"' || ch === "'" || ch === '`') {
      let j = i + 1;
      while (j < src.length) {
        if (src[j] === '\\') { j += 2; continue; }
        if (src[j] === ch) { j++; break; }
        if (ch !== '`' && src[j] === '\n') break;
        j++;
      }
      out.push({ type: 'string', value: src.slice(i, j) }); i = j; continue;
    }
    // JSON keys: "word":
    if (ch === '"') {
      const m = rest.match(/^"([^"\\]*)"\s*:/);
      if (m) { out.push({ type: 'key', value: m[0] }); i += m[0].length; continue; }
    }
    // numbers
    if (/[0-9]/.test(ch) && (i === 0 || /\W/.test(src[i - 1]))) {
      let j = i;
      while (j < src.length && /[0-9._xXa-fA-F]/.test(src[j])) j++;
      out.push({ type: 'number', value: src.slice(i, j) }); i = j; continue;
    }
    // words
    if (/[a-zA-Z_$]/.test(ch)) {
      let j = i;
      while (j < src.length && /[a-zA-Z0-9_$]/.test(src[j])) j++;
      const w = src.slice(i, j);
      const isCall = src[j] === '(';
      const type: TokType = KEYWORDS.has(w) ? 'keyword' : isCall ? 'fn' : 'plain';
      out.push({ type, value: w }); i = j; continue;
    }
    // plain char — merge with prev if also plain
    if (out.length && out[out.length - 1].type === 'plain') {
      out[out.length - 1].value += ch;
    } else {
      out.push({ type: 'plain', value: ch });
    }
    i++;
  }
  return out;
}

const TOK_COLOR: Record<TokType, string> = {
  keyword: '#ff7b72',
  string:  '#a5d6ff',
  comment: '#8b949e',
  number:  '#79c0ff',
  fn:      '#d2a8ff',
  key:     '#79c0ff',
  plain:   '#e6edf3',
};

// ─── Shared: CopyBtn ─────────────────────────────────────────────
function CopyBtn({ text, label = 'Copy' }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); }); }}
      style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '5px 12px', background: copied ? 'rgba(63,185,80,0.12)' : 'rgba(255,255,255,0.06)', border: `1px solid ${copied ? 'rgba(63,185,80,0.3)' : T.border}`, borderRadius: 6, color: copied ? T.green : T.textSub, fontSize: 12.5, cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap' }}>
      {copied ? <Check size={12} /> : <Copy size={12} />}
      {copied ? 'Copied!' : label}
    </button>
  );
}

// ─── Shared: CodeBlock ───────────────────────────────────────────
function CodeBlock({ code, label }: { code: string; lang?: string; label?: string }) {
  const trimmed = code.trim();
  const tokens = tokenize(trimmed);
  const lineCount = (trimmed.match(/\n/g) ?? []).length + 1;
  return (
    <div style={{ background: T.code, borderRadius: 10, overflow: 'hidden', border: `1px solid ${T.border}`, fontSize: 14, lineHeight: 1.8 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 18px', borderBottom: `1px solid ${T.border}`, background: 'rgba(255,255,255,0.02)' }}>
        <span style={{ fontSize: 12.5, color: T.textDim, fontFamily: 'monospace' }}>{label ?? ''}</span>
        <CopyBtn text={trimmed} />
      </div>
      <div style={{ display: 'flex', overflow: 'auto' }}>
        <div aria-hidden style={{ padding: '16px 12px 16px 18px', textAlign: 'right', color: T.textDim, fontFamily: 'monospace', userSelect: 'none', flexShrink: 0, minWidth: 44, lineHeight: 1.8, fontSize: 13 }}>
          {Array.from({ length: lineCount }, (_, i) => <div key={i}>{i + 1}</div>)}
        </div>
        <div style={{ flex: 1, padding: '16px 22px 16px 6px', overflow: 'auto' }}>
          <pre style={{ margin: 0, fontFamily: '"JetBrains Mono","Fira Code",Consolas,monospace', whiteSpace: 'pre', fontSize: 14 }}>
            {tokens.map((tok, idx) => (
              <span key={idx} style={{ color: TOK_COLOR[tok.type], fontStyle: tok.type === 'comment' ? 'italic' : 'normal' }}>
                {tok.value}
              </span>
            ))}
          </pre>
        </div>
      </div>
    </div>
  );
}

// ─── Shared: SectionLabel ────────────────────────────────────────
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 11.5, fontWeight: 600, color: T.textDim, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>
      {children}
    </div>
  );
}

// ─── Shared: ParamTable ──────────────────────────────────────────
function ParamTable({ params }: { params: { name: string; type: string; required: boolean; desc: string }[] }) {
  return (
    <div style={{ border: `1px solid ${T.border}`, borderRadius: 10, overflow: 'hidden', marginTop: 16 }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13.5 }}>
        <thead>
          <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: `1px solid ${T.border}` }}>
            {['参数', '类型', '必填', '说明'].map(h => (
              <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 600, color: T.textSub, fontSize: 12 }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {params.map((p, i) => (
            <tr key={p.name} style={{ borderBottom: i < params.length - 1 ? `1px solid ${T.border}` : 'none', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)' }}>
              <td style={{ padding: '10px 16px' }}><code style={{ color: '#cae8ff', fontFamily: 'monospace', fontSize: 13 }}>{p.name}</code></td>
              <td style={{ padding: '10px 16px' }}><span style={{ color: T.orange, fontFamily: 'monospace', fontSize: 13 }}>{p.type}</span></td>
              <td style={{ padding: '10px 16px' }}>
                <span style={{ padding: '2px 8px', background: p.required ? 'rgba(255,123,114,0.12)' : 'rgba(255,255,255,0.05)', border: `1px solid ${p.required ? 'rgba(255,123,114,0.25)' : T.border}`, borderRadius: 4, fontSize: 12, color: p.required ? '#ff7b72' : T.textDim, fontWeight: 600 }}>
                  {p.required ? '必填' : '可选'}
                </span>
              </td>
              <td style={{ padding: '10px 16px', color: T.textSub }}>{p.desc}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Shared: StepCard ────────────────────────────────────────────
function StepCard({ num, title, desc, children }: { num: number; title: string; desc: string; children?: React.ReactNode }) {
  return (
    <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 14, overflow: 'hidden', marginBottom: 20 }}>
      <div style={{ padding: '22px 28px', borderBottom: children ? `1px solid ${T.border}` : 'none', display: 'flex', alignItems: 'flex-start', gap: 16 }}>
        <div style={{ width: 34, height: 34, borderRadius: '50%', background: T.accentSoft, border: `1.5px solid ${T.accentBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: T.accent, flexShrink: 0, marginTop: 1 }}>
          {num}
        </div>
        <div>
          <div style={{ fontSize: 18, fontWeight: 600, color: T.text, marginBottom: 5 }}>{title}</div>
          <div style={{ fontSize: 14.5, color: T.textSub, lineHeight: 1.6 }}>{desc}</div>
        </div>
      </div>
      {children && <div style={{ padding: '22px 28px' }}>{children}</div>}
    </div>
  );
}

// ─── NavItem ─────────────────────────────────────────────────────
function NavItem({ icon: Icon, label, active, onClick }: { icon: any; label: string; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick}
      style={{ display: 'flex', alignItems: 'center', gap: 11, width: '100%', padding: '10px 18px', background: active ? 'rgba(255,255,255,0.06)' : 'transparent', border: 'none', borderLeft: `2px solid ${active ? T.accent : 'transparent'}`, color: active ? T.text : T.navInactive, fontSize: 14.5, fontWeight: active ? 600 : 400, cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s' }}>
      <Icon size={16} strokeWidth={1.6} />
      <span>{label}</span>
    </button>
  );
}

// ─── Quick Start ─────────────────────────────────────────────────
function QuickStart({ env, product }: { env: string; product: string }) {
  const isAigc = product === 'aigc';
  const isCodeAudit = product === 'codeaudit';
  const isPrivacy = product === 'privacy';
  const baseUrl = env === '生产'
    ? 'api.example.com'
    : 'sandbox-api.example.com';

  const AIGC_INIT_CODE = `import aisc

client = aisc.Client(api_key="sk-proj-your-key-here")

# 文本内容审核
result = client.moderation.text(
    content="待审核的文本内容...",
    dimensions=["违禁内容", "色情低俗", "政治敏感"],
    async_mode=False,
)

print(result.verdict)     # "block" | "pass" | "review"
print(result.risk_score)  # 0.92
print(result.details)     # [{"dimension": "违禁内容", "score": 0.92}]`;

  const SEC_INIT_CODE = `import aisc_sec

client = aisc_sec.Client(api_key="sk-proj-your-key-here")

# 创建数据集安全评测任务
task = client.eval.dataset(
    dataset_path="./training_data",
    task_type="object_detection",
    data_format="COCO",
    data_splits=["train", "val", "test"],
    methods=[
        "balance", "anomaly", "annotation_correctness",
        "annotation_completeness", "backdoor_screening"
    ],
)

print(task.task_id)
print(task.status)

# 任务完成后获取可追溯的 JSONL 结果
result = client.eval.result(task.task_id, format="jsonl")
print(result.path)`;

  const CODEAUDIT_INIT_CODE = `import aisc_codeaudit

client = aisc_codeaudit.Client(api_key="sk-proj-your-key-here")

# 提交代码片段进行漏洞扫描（SAST + AI 引擎）
task = client.audit.scan(
    code=open("./src/app.py").read(),
    language="python",
    rules=["sql_injection", "xss", "path_traversal"],
)

print(task.task_id)          # "audit_7c4d1f9a"
print(task.status)           # "pending" | "scanning" | "completed"
# 轮询或等待 Webhook 回调后获取完整报告
report = client.audit.report(task.task_id)
print(report.total_issues)   # 3
print(report.critical_count) # 1
print(report.issues[0].line) # 42`;

  const AIGC_WEBHOOK = `{
  "task_id":    "task_8f3a9c2d",
  "event":      "task.completed",
  "verdict":    "block",
  "risk_score": 0.92,
  "details": [
    { "dimension": "违禁内容", "score": 0.92 },
    { "dimension": "色情低俗", "score": 0.31 }
  ],
  "latency_ms": 28,
  "timestamp":  "2026-05-14T08:23:11Z"
}`;

  const SEC_WEBHOOK = `{
  "task_id": "<task_id>",
  "event": "eval.completed",
  "task_type": "object_detection",
  "data_format": "COCO",
  "data_splits": ["train", "val", "test"],
  "methods": [
    "balance",
    "anomaly",
    "annotation_correctness",
    "annotation_completeness",
    "backdoor_screening"
  ],
  "result_format": "jsonl",
  "result_url": "<result_url>",
  "timestamp": "<completed_at>"
}`;

  const CODEAUDIT_WEBHOOK = `{
  "task_id":       "audit_7c4d1f9a",
  "event":         "audit.completed",
  "language":      "python",
  "total_issues":  3,
  "critical_count": 1,
  "high_count":    1,
  "medium_count":  1,
  "report_url":    "https://api.example.com/v1/audit/report/audit_demo",
  "issues": [
    { "id": "SQL_INJ_001", "severity": "CRITICAL", "line": 42, "rule": "sql_injection" },
    { "id": "XSS_002",     "severity": "HIGH",     "line": 87, "rule": "reflected_xss" }
  ],
  "timestamp":     "2026-05-14T09:44:22Z"
}`;

  const PRIVACY_INIT_CODE = `import aisc_privacy

client = aisc_privacy.Client(api_key="sk-proj-your-key-here")

# 创建文本敏感信息扫描任务
task = client.privacy.scan(
    content=open("./customer_records.txt").read(),
    data_type="text",
    dimensions=["身份证号", "手机号码", "银行卡号", "姓名", "住址"],
    desensitize=True,
)

print(task.task_id)          # "priv_3e7a2b9c"
print(task.status)           # "pending" | "scanning" | "completed"
# 获取扫描结果
report = client.privacy.report(task.task_id)
print(report.total_findings)  # 12
print(report.findings[0].type)  # "身份证号"
print(report.desensitized_content)  # "110101**********34..."`;

  const PRIVACY_WEBHOOK = `{
  "task_id":          "priv_3e7a2b9c",
  "event":            "privacy.completed",
  "data_type":        "text",
  "total_findings":   12,
  "finding_types": {
    "身份证号":  3,
    "手机号码":  5,
    "银行卡号":  2,
    "姓名":      2
  },
  "risk_level":       "HIGH",
  "desensitized":     true,
  "report_url":       "https://api.example.com/v1/privacy/report/priv_demo",
  "timestamp":        "2026-05-14T11:30:22Z"
}`;

  const INIT_CODE    = isAigc ? AIGC_INIT_CODE : isCodeAudit ? CODEAUDIT_INIT_CODE : isPrivacy ? PRIVACY_INIT_CODE : SEC_INIT_CODE;
  const WEBHOOK_CODE = isAigc ? AIGC_WEBHOOK   : isCodeAudit ? CODEAUDIT_WEBHOOK   : isPrivacy ? PRIVACY_WEBHOOK   : SEC_WEBHOOK;

  const SDK_INSTALL = isAigc
    ? [
        { label: 'pip  (Python)', cmd: 'pip install aisc-sdk' },
        { label: 'npm  (Node.js)', cmd: 'npm install @aisc/node' },
        { label: 'go get  (Go)',   cmd: 'go get github.com/aisc/go-sdk' },
      ]
    : isCodeAudit
    ? [
        { label: 'pip  (Python)', cmd: 'pip install aisc-codeaudit' },
        { label: 'npm  (Node.js)', cmd: 'npm install @aisc/codeaudit-node' },
        { label: 'go get  (Go)',   cmd: 'go get github.com/aisc/codeaudit-go' },
      ]
    : isPrivacy
    ? [
        { label: 'pip  (Python)', cmd: 'pip install aisc-privacy' },
        { label: 'npm  (Node.js)', cmd: 'npm install @aisc/privacy-node' },
        { label: 'go get  (Go)',   cmd: 'go get github.com/aisc/privacy-go' },
      ]
    : [
        { label: 'pip  (Python)', cmd: 'pip install aisc-sec-sdk' },
        { label: 'npm  (Node.js)', cmd: 'npm install @aisc/sec-node' },
        { label: 'go get  (Go)',   cmd: 'go get github.com/aisc/sec-go-sdk' },
      ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 32, alignItems: 'flex-start' }}>
      {/* Left: step cards */}
      <div>
        <h1 style={{ fontSize: 34, fontWeight: 700, color: T.text, margin: '0 0 10px', letterSpacing: '-0.02em' }}>API 快速开始</h1>
        <p style={{ fontSize: 15.5, color: T.textSub, margin: '0 0 32px', lineHeight: 1.7 }}>
          {isAigc
            ? '跟随本指南，5 分钟内完成 AIGC 内容审核与鉴伪 API 接入，您将在第一次调用成功后看到实时控制台数据。'
            : isCodeAudit
            ? '跟随本指南，快速完成代码漏洞审查 API 接入，提交您的第一个 SAST 扫描任务，并通过 Webhook 接收 AI 修复建议。'
            : isPrivacy
            ? '跟随本指南，快速完成个人敏感信息审查 API 接入，提交您的第一个数据扫描任务，自动识别身份证号、手机号等敏感信息并输出脱敏结果。'
            : '跟随本指南，了解数据集安全评测的任务参数、执行方式与 JSONL 结果结构。'}
        </p>

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '14px 18px', background: 'rgba(240,136,62,0.08)', border: '1px solid rgba(240,136,62,.28)', borderRadius: 10, marginBottom: 28 }}>
          <AlertCircle size={17} style={{ color: T.orange, flexShrink: 0, marginTop: 2 }} />
          <span style={{ fontSize: 14, color: T.textSub, lineHeight: 1.5 }}>
            <strong style={{ color: '#f6c177' }}>演示文档：</strong>
            当前接口域名、SDK 包名、额度与返回数据用于展示接入流程，正式项目请以技术团队提供的接口清单和交付文档为准。
          </span>
        </div>

        <StepCard num={1} title="安装 SDK" desc={`选择您的语言，安装官方 SDK。支持 Python、Node.js、Go。`}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {SDK_INSTALL.map(item => (
              <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 14, background: T.code, border: `1px solid ${T.border}`, borderRadius: 8, padding: '11px 16px' }}>
                <span style={{ fontSize: 12.5, color: T.textDim, fontFamily: 'monospace', width: 120, flexShrink: 0 }}>{item.label}</span>
                <code style={{ flex: 1, fontSize: 14, fontFamily: 'monospace', color: '#a5d6ff' }}>{item.cmd}</code>
                <CopyBtn text={item.cmd} />
              </div>
            ))}
          </div>
        </StepCard>

        <StepCard num={2}
          title={isAigc ? '初始化客户端' : isCodeAudit ? '初始化客户端并提交扫描任务' : isPrivacy ? '初始化客户端并提交扫描任务' : '初始化客户端并提交任务'}
          desc={isAigc ? '用您的 API Key 初始化客户端，完成第一次文本审核调用。' : isCodeAudit ? '用您的 API Key 初始化客户端，提交代码片段完成第一次 SAST + AI 混合扫描。' : isPrivacy ? '用您的 API Key 初始化客户端，提交数据文件完成第一次敏感信息扫描，并获取脱敏处理结果。' : '按数据任务类型、格式、划分和评测方法提交数据集评测任务。'}>
          <CodeBlock code={INIT_CODE} lang="python" label={isAigc ? 'Python — 文本审核示例' : isCodeAudit ? 'Python — 代码漏洞扫描示例' : isPrivacy ? 'Python — 敏感信息扫描示例' : 'Python — 数据质量与安全评测示例'} />
        </StepCard>

        <StepCard num={3} title="创建 API Key" desc="前往「API Keys 与 Webhook」页面，获取您的专属 API 密钥。">
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <div style={{ flex: 1, padding: '12px 16px', background: T.code, border: `1px solid ${T.border}`, borderRadius: 8, fontSize: 14, fontFamily: 'monospace', color: '#a5d6ff' }}>
              sk-proj-<span style={{ color: T.textDim }}>{'•'.repeat(22)}</span>
            </div>
            <button style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '11px 20px', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>
              <Key size={14} /> 创建 API Key
            </button>
          </div>
        </StepCard>

        <StepCard num={4}
          title={isAigc ? '配置 Webhook（异步任务）' : isCodeAudit ? '接收扫描结果（Webhook）' : isPrivacy ? '接收扫描结果（Webhook）' : '接收评测结果（Webhook）'}
          desc={isAigc ? '音视频审核为异步模式。配置 Webhook 地址，任务完成后平台主动推送结果。' : isCodeAudit ? '代码扫描任务为异步模式，配置 Webhook 后，扫描完成时平台推送漏洞列表与 AI 修复建议链接。' : isPrivacy ? '敏感信息扫描任务为异步模式，配置 Webhook 后，扫描完成时平台推送发现清单、风险等级与脱敏报告链接。' : '任务完成后可接收结果地址，并通过 JSONL 留存方法明细和异常样本信息。'}>
          <CodeBlock code={WEBHOOK_CODE} lang="json" label="回调 Payload 示例" />
        </StepCard>
      </div>

      {/* Right: sticky quick-ref panel */}
      <div style={{ position: 'sticky', top: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: '20px' }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: T.textDim, textTransform: 'uppercase', letterSpacing: '0.09em', marginBottom: 14 }}>当前环境</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: env === '生产' ? T.green : T.orange, flexShrink: 0 }} />
            <span style={{ fontSize: 15, fontWeight: 600, color: T.text }}>{env}环境</span>
          </div>
          <div style={{ fontSize: 12.5, color: T.textDim, marginBottom: 6 }}>示例 Base URL</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: T.code, border: `1px solid ${T.border}`, borderRadius: 8, padding: '9px 12px' }}>
            <code style={{ flex: 1, fontSize: 12.5, fontFamily: 'monospace', color: '#cae8ff', wordBreak: 'break-all' }}>{baseUrl}</code>
            <CopyBtn text={`https://${baseUrl}`} />
          </div>
        </div>

        <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: '20px' }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: T.textDim, textTransform: 'uppercase', letterSpacing: '0.09em', marginBottom: 14 }}>速率限制（免费版）</div>
          {(isAigc
            ? [['RPM', '60', '每分钟请求数'], ['TPM', '100K', '每月 Token 量']]
            : isCodeAudit
            ? [['TPH', '10', '每小时扫描任务数'], ['月配额', '50', '每月任务总量']]
            : isPrivacy
            ? [['TPH', '20', '每小时扫描任务数'], ['月配额', '200', '每月任务总量']]
            : [['接口额度', '按项目配置', '正式接入时确认'], ['结果格式', 'JSONL', '任务结果留存']]
          ).map(([key, val, desc]) => (
            <div key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <span style={{ fontSize: 13.5, color: T.textSub }}>{desc}</span>
              <span style={{ fontSize: 16, fontWeight: 700, color: T.accent }}>{val}</span>
            </div>
          ))}
              <a href="/about" style={{ display: 'block', marginTop: 8, fontSize: 13, color: T.accent, textDecoration: 'none' }}>联系顾问申请正式接入 →</a>
        </div>

        <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: '20px' }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: T.textDim, textTransform: 'uppercase', letterSpacing: '0.09em', marginBottom: 14 }}>快速链接</div>
          {['API 接口文档', 'SDK 与代码示例', 'Webhook 配置', '错误码说明'].map(link => (
            <div key={link} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: `1px solid ${T.border}` }}>
              <span style={{ fontSize: 14, color: T.textSub }}>{link}</span>
              <ChevronRight size={14} style={{ color: T.textDim }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── API Keys ────────────────────────────────────────────────────
const PRODUCT_SCOPES: Record<string, string[]> = {
  aigc:      ['AIGC 内容审核', 'AI 鉴伪检测', '任务管理', 'Webhook'],
  sec:       ['数据集评测', '任务状态查询', 'JSONL 结果读取', '历史任务管理'],
  codeaudit: ['SAST 代码扫描', 'SCA 依赖分析', '扫描报告读取', 'AI 修复建议'],
  privacy:   ['敏感信息扫描', '脱敏处理', '定时巡检', '审查报告读取'],
};

interface ApiKey {
  id: string; name: string; env: '生产' | '测试'; key: string;
  created: string; lastUsed: string; requests: string;
  scopes: string[]; expiry: string;
}

function ApiKeysSection({ product, isGuest }: { product: string; isGuest: boolean }) {
  const navTo = useNavigate();
  const [tab, setTab] = useState<'keys' | 'webhooks'>('keys');
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const [justCreated, setJustCreated] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', env: '测试' as '生产' | '测试', expiry: '' });
  const productLabel = product === 'aigc' ? 'AIGC 内容审核与鉴伪' : product === 'sec' ? '数据集安全评测' : product === 'privacy' ? '个人敏感信息审查' : '代码漏洞审查';

  const handleCreate = () => {
    if (!form.name.trim()) return;
    const pfx = form.env === '生产' ? 'prod' : 'test';
    const raw = 'sk-' + pfx + '-' + Array.from({ length: 38 }, () => 'abcdefghijklmnopqrstuvwxyz0123456789'[Math.floor(Math.random() * 36)]).join('');
    const k: ApiKey = {
      id: 'key_' + Date.now(), name: form.name, env: form.env, key: raw,
      created: new Date().toISOString().slice(0, 10), lastUsed: '刚刚', requests: '0',
      scopes: PRODUCT_SCOPES[product] ?? PRODUCT_SCOPES.aigc,
      expiry: form.expiry || '永久有效',
    };
    setKeys(prev => [...prev, k]);
    setJustCreated(raw);
    setShowCreate(false);
    setForm({ name: '', env: '测试', expiry: '' });
  };

  // ── Guest gate ──────────────────────────────────────────────────
  if (isGuest) {
    return (
      <div style={{ maxWidth: 560, margin: '0 auto', textAlign: 'center', padding: '80px 24px' }}>
        <div style={{ width: 72, height: 72, borderRadius: '50%', background: T.accentSoft, border: `1.5px solid ${T.accentBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
          <Key size={32} style={{ color: T.accent }} />
        </div>
        <div style={{ fontSize: 22, fontWeight: 700, color: T.text, marginBottom: 10 }}>登录后方可管理 API Key</div>
        <div style={{ fontSize: 15, color: T.textSub, lineHeight: 1.7, marginBottom: 32 }}>
          API Key 是调用玄鉴服务的凭证，需要注册账号并登录后才能创建和管理。<br />
          <strong style={{ color: T.accent }}>{productLabel}</strong> 的 API 接入功能需登录方可使用。
        </div>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <button onClick={() => { window.scrollTo(0, 0); navTo('/login'); }}
            style={{ padding: '12px 32px', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 20px rgba(99,102,241,0.35)' }}>
            立即登录
          </button>
          <button onClick={() => { window.scrollTo(0, 0); navTo('/register'); }}
            style={{ padding: '12px 28px', background: 'transparent', color: T.textSub, border: `1px solid ${T.border}`, borderRadius: 10, fontSize: 15, cursor: 'pointer' }}>
            免费注册
          </button>
        </div>
        <div style={{ marginTop: 28, fontSize: 13, color: T.textDim }}>
          游客模式可浏览 API 文档、快速开始指南和 SDK 示例，无需登录。
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 32, alignItems: 'flex-start' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
          <div>
            <h1 style={{ fontSize: 34, fontWeight: 700, color: T.text, margin: '0 0 6px', letterSpacing: '-0.02em' }}>API Keys 与 Webhook</h1>
            <p style={{ fontSize: 15, color: T.textSub, margin: 0, lineHeight: 1.6 }}>
              当前服务：<span style={{ color: T.accent, fontWeight: 600 }}>{productLabel}</span>
            </p>
          </div>
          {keys.length > 0 && (
            <button onClick={() => setShowCreate(true)}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '9px 18px', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', border: 'none', borderRadius: 8, color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer', marginTop: 4, whiteSpace: 'nowrap' }}>
              <Plus size={14} /> 新建 API Key
            </button>
          )}
        </div>

        {/* Security warning banner — only when keys exist */}
        {keys.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: 'rgba(240,136,62,0.08)', border: '1px solid rgba(240,136,62,0.25)', borderRadius: 10, marginBottom: 20 }}>
            <AlertCircle size={15} style={{ color: T.orange, flexShrink: 0 }} />
            <span style={{ fontSize: 13.5, color: T.textSub }}>
              请妥善保管您的 Key，<strong style={{ color: T.orange }}>泄露可能导致额度被盗用</strong>，建议使用环境变量存储，切勿提交到代码仓库。
            </span>
          </div>
        )}

        <div style={{ display: 'flex', gap: 0, borderBottom: `1px solid ${T.border}`, marginBottom: 24 }}>
          {[{ key: 'keys', label: 'API Keys' }, { key: 'webhooks', label: 'Webhooks' }].map(t => (
            <button key={t.key} onClick={() => setTab(t.key as any)}
              style={{ padding: '10px 22px', background: 'transparent', border: 'none', borderBottom: `2px solid ${tab === t.key ? T.accent : 'transparent'}`, color: tab === t.key ? T.text : T.navInactive, fontSize: 15, fontWeight: tab === t.key ? 600 : 400, cursor: 'pointer', marginBottom: -1 }}>
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'keys' && (
          <>
            {/* Empty state */}
            {keys.length === 0 && !showCreate && (
              <div style={{ textAlign: 'center', padding: '56px 24px', background: T.card, border: `2px dashed ${T.border}`, borderRadius: 16 }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: T.accentSoft, border: `1.5px solid ${T.accentBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                  <Key size={28} style={{ color: T.accent }} />
                </div>
                <div style={{ fontSize: 20, fontWeight: 700, color: T.text, marginBottom: 8 }}>创建您的第一个 API Key</div>
                <div style={{ fontSize: 14.5, color: T.textSub, lineHeight: 1.7, maxWidth: 400, margin: '0 auto 28px' }}>
                  为 <strong style={{ color: T.accent }}>{productLabel}</strong> 创建一个 API Key，即可通过 SDK 或 REST API 调用服务。每个 Key 可绑定指定权限范围，安全可控。
                </div>
                <button onClick={() => setShowCreate(true)}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 28px', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 20px rgba(99,102,241,0.4)' }}>
                  <Plus size={16} /> 创建 API Key
                </button>
              </div>
            )}

            {/* Creation form */}
            {showCreate && (
              <div style={{ background: T.card, border: `1px solid ${T.accentBorder}`, borderRadius: 14, padding: '24px 28px', marginBottom: 20 }}>
                <div style={{ fontSize: 17, fontWeight: 700, color: T.text, marginBottom: 20 }}>配置新的 API Key</div>
                {/* Name */}
                <div style={{ marginBottom: 18 }}>
                  <label style={{ display: 'block', fontSize: 13.5, fontWeight: 600, color: T.textSub, marginBottom: 8 }}>名称 <span style={{ color: T.red }}>*</span></label>
                  <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="例如：生产环境-后端服务"
                    style={{ width: '100%', boxSizing: 'border-box', padding: '10px 14px', background: T.code, border: `1px solid ${form.name ? T.accentBorder : T.border}`, borderRadius: 8, color: T.text, fontSize: 14, outline: 'none', fontFamily: 'inherit' }} />
                  <div style={{ fontSize: 12, color: T.textDim, marginTop: 5 }}>为密钥起一个清晰的名称，便于后续管理，如"生产服务器-01"</div>
                </div>
                {/* Environment */}
                <div style={{ marginBottom: 18 }}>
                  <label style={{ display: 'block', fontSize: 13.5, fontWeight: 600, color: T.textSub, marginBottom: 8 }}>环境</label>
                  <div style={{ display: 'flex', gap: 10 }}>
                    {(['测试', '生产'] as const).map(e => (
                      <button key={e} onClick={() => setForm(f => ({ ...f, env: e }))}
                        style={{ flex: 1, padding: '10px', border: `1.5px solid ${form.env === e ? (e === '生产' ? T.green : T.orange) : T.border}`, borderRadius: 8, background: form.env === e ? (e === '生产' ? 'rgba(63,185,80,0.1)' : 'rgba(240,136,62,0.1)') : 'transparent', color: form.env === e ? (e === '生产' ? T.green : T.orange) : T.textSub, fontSize: 14, fontWeight: form.env === e ? 700 : 400, cursor: 'pointer' }}>
                        <div style={{ marginBottom: 3 }}>{e}环境</div>
                        <div style={{ fontSize: 11, opacity: 0.7 }}>{e === '测试' ? '免费额度，数据隔离' : '正式服务，计费消耗'}</div>
                      </button>
                    ))}
                  </div>
                </div>
                {/* Expiry */}
                <div style={{ marginBottom: 24 }}>
                  <label style={{ display: 'block', fontSize: 13.5, fontWeight: 600, color: T.textSub, marginBottom: 8 }}>有效期 <span style={{ fontSize: 12, color: T.textDim, fontWeight: 400 }}>（可选）</span></label>
                  <select value={form.expiry} onChange={e => setForm(f => ({ ...f, expiry: e.target.value }))}
                    style={{ width: 220, padding: '10px 14px', background: T.code, border: `1px solid ${T.border}`, borderRadius: 8, color: T.text, fontSize: 14, outline: 'none', cursor: 'pointer' }}>
                    <option value="">永久有效</option>
                    <option value="30天">30 天后过期</option>
                    <option value="90天">90 天后过期</option>
                    <option value="1年">1 年后过期</option>
                  </select>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button onClick={handleCreate} disabled={!form.name.trim()}
                    style={{ padding: '11px 24px', background: form.name.trim() ? 'linear-gradient(135deg,#6366f1,#8b5cf6)' : 'rgba(255,255,255,0.08)', color: form.name.trim() ? '#fff' : T.textDim, border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: form.name.trim() ? 'pointer' : 'not-allowed' }}>
                    生成 API Key
                  </button>
                  <button onClick={() => setShowCreate(false)}
                    style={{ padding: '11px 18px', background: 'transparent', color: T.textSub, border: `1px solid ${T.border}`, borderRadius: 8, fontSize: 14, cursor: 'pointer' }}>取消</button>
                </div>
              </div>
            )}

            {/* Key list */}
            {keys.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {keys.map(k => {
                  const show = revealed[k.id];
                  const display = show ? k.key : k.key.slice(0, 14) + '•'.repeat(18) + k.key.slice(-4);
                  return (
                    <div key={k.id} style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: '18px 22px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                        <div>
                          <span style={{ fontSize: 16, fontWeight: 600, color: T.text }}>{k.name}</span>
                          <span style={{ marginLeft: 10, padding: '2px 8px', background: k.env === '生产' ? 'rgba(63,185,80,0.1)' : 'rgba(240,136,62,0.1)', border: `1px solid ${k.env === '生产' ? 'rgba(63,185,80,0.25)' : 'rgba(240,136,62,0.25)'}`, borderRadius: 20, fontSize: 11.5, fontWeight: 600, color: k.env === '生产' ? T.green : T.orange }}>{k.env}环境</span>
                        </div>
                        <div style={{ display: 'flex', gap: 7 }}>
                          <button onClick={() => setRevealed(r => ({ ...r, [k.id]: !r[k.id] }))}
                            style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '5px 10px', background: 'rgba(255,255,255,0.05)', border: `1px solid ${T.border}`, borderRadius: 6, color: T.textSub, fontSize: 12.5, cursor: 'pointer' }}>
                            {show ? <EyeOff size={12} /> : <Eye size={12} />} {show ? '隐藏' : '显示'}
                          </button>
                          <CopyBtn text={k.key} />
                          <button onClick={() => setKeys(prev => prev.filter(x => x.id !== k.id))}
                            style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '5px 10px', background: 'rgba(248,81,73,0.07)', border: '1px solid rgba(248,81,73,0.2)', borderRadius: 6, color: T.red, fontSize: 12.5, cursor: 'pointer' }}>
                            <Trash2 size={12} /> 删除
                          </button>
                        </div>
                      </div>
                      <div style={{ fontSize: 13, fontFamily: 'monospace', color: '#8b949e', marginBottom: 10, wordBreak: 'break-all' }}>{display}</div>
                      <div style={{ display: 'flex', gap: 20, fontSize: 12.5, color: T.textDim }}>
                        <span>创建 {k.created}</span>
                        <span>最近使用 {k.lastUsed}</span>
                        <span>累计请求 <span style={{ color: T.accent, fontWeight: 600 }}>{k.requests}</span></span>
                        <span>有效期 {k.expiry}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {tab === 'webhooks' && (
          <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: '24px 26px' }}>
            {[{ label: 'Webhook URL', val: 'https://your-app.com/webhooks/aisc', type: 'text' },
              { label: 'Webhook Secret', val: 'whsec-xxxxxxxxxxxxxxxxxxxxxxxx', type: 'password' }].map(f => (
              <div key={f.label} style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: T.textSub, marginBottom: 8 }}>{f.label}</label>
                <input defaultValue={f.val} type={f.type}
                  style={{ width: '100%', padding: '11px 14px', background: T.code, border: `1px solid ${T.border}`, borderRadius: 8, color: T.text, fontSize: 14, outline: 'none', boxSizing: 'border-box', fontFamily: 'monospace' }} />
              </div>
            ))}
            <div style={{ marginBottom: 22 }}>
              <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: T.textSub, marginBottom: 10 }}>回调事件</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {['task.completed', 'task.failed', 'task.review_required', 'task.cancelled'].map(ev => (
                  <label key={ev} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', background: T.code, border: `1px solid ${T.border}`, borderRadius: 8, cursor: 'pointer', fontSize: 13.5, fontFamily: 'monospace', color: T.textSub }}>
                    <input type="checkbox" defaultChecked={ev.includes('completed') || ev.includes('failed')} style={{ accentColor: T.accent }} />
                    {ev}
                  </label>
                ))}
              </div>
            </div>
            <button style={{ padding: '11px 24px', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>保存配置</button>
          </div>
        )}
      </div>

      {/* Right: security tips */}
      <div style={{ position: 'sticky', top: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: '20px' }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: T.textDim, textTransform: 'uppercase', letterSpacing: '0.09em', marginBottom: 14 }}>安全建议</div>
          {['不要将 API Key 写入代码仓库', '使用环境变量存储密钥', '为不同服务创建独立密钥', '定期轮换密钥以降低风险', '通过 IP 白名单限制访问'].map((tip, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
              <span style={{ color: T.green, fontSize: 14, flexShrink: 0 }}>✓</span>
              <span style={{ fontSize: 13.5, color: T.textSub, lineHeight: 1.5 }}>{tip}</span>
            </div>
          ))}
        </div>
      </div>

      {/* One-time Key reveal modal */}
      {justCreated && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div style={{ background: T.card, border: `1px solid ${T.borderStrong}`, borderRadius: 16, padding: '32px 36px', width: 520, maxWidth: '100%', boxShadow: '0 32px 80px rgba(0,0,0,0.5)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <div style={{ width: 42, height: 42, borderRadius: '50%', background: 'rgba(63,185,80,0.12)', border: '1.5px solid rgba(63,185,80,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Key size={20} style={{ color: T.green }} />
              </div>
              <div>
                <div style={{ fontSize: 18, fontWeight: 700, color: T.text }}>API Key 已生成</div>
                <div style={{ fontSize: 13.5, color: T.textSub, marginTop: 2 }}>请立即复制并妥善保存</div>
              </div>
            </div>

            <div style={{ background: 'rgba(248,81,73,0.08)', border: '1px solid rgba(248,81,73,0.25)', borderRadius: 10, padding: '12px 16px', marginBottom: 20, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <AlertCircle size={15} style={{ color: T.red, flexShrink: 0, marginTop: 1 }} />
              <span style={{ fontSize: 13.5, color: T.textSub, lineHeight: 1.6 }}>
                <strong style={{ color: T.red }}>关闭后将无法再次查看完整 Key。</strong>请立即复制并存储到安全的地方（如密码管理器或环境变量）。
              </span>
            </div>

            <div style={{ background: T.code, border: `1px solid ${T.border}`, borderRadius: 10, padding: '14px 16px', marginBottom: 20 }}>
              <div style={{ fontSize: 11.5, color: T.textDim, marginBottom: 8 }}>您的 API Key</div>
              <div style={{ fontFamily: 'monospace', fontSize: 13.5, color: '#a5d6ff', wordBreak: 'break-all', lineHeight: 1.7 }}>{justCreated}</div>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => { navigator.clipboard.writeText(justCreated).catch(() => {}); }}
                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '11px', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
                <Copy size={14} /> 复制 API Key
              </button>
              <button onClick={() => setJustCreated(null)}
                style={{ padding: '11px 22px', background: 'rgba(255,255,255,0.05)', color: T.textSub, border: `1px solid ${T.border}`, borderRadius: 8, fontSize: 14, cursor: 'pointer' }}>
                已复制，关闭
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── API Docs ────────────────────────────────────────────────────
const AIGC_ENDPOINTS = [
  { method: 'POST', path: '/v1/moderation/text', desc: '文本内容审核', tag: '内容审核' },
  { method: 'POST', path: '/v1/moderation/image', desc: '图像内容审核', tag: '内容审核' },
  { method: 'POST', path: '/v1/moderation/audio', desc: '音频内容审核', tag: '内容审核' },
  { method: 'POST', path: '/v1/moderation/video', desc: '视频内容审核（异步）', tag: '内容审核' },
  { method: 'POST', path: '/v1/detect/text', desc: 'AI 文本鉴伪', tag: 'AI 鉴伪' },
  { method: 'POST', path: '/v1/detect/image', desc: 'AI 图像鉴伪', tag: 'AI 鉴伪' },
  { method: 'POST', path: '/v1/detect/audio', desc: 'AI 语音克隆检测', tag: 'AI 鉴伪' },
  { method: 'POST', path: '/v1/detect/video', desc: 'Deepfake 视频鉴伪', tag: 'AI 鉴伪' },
  { method: 'GET', path: '/v1/tasks/{task_id}', desc: '查询任务状态', tag: '任务管理' },
  { method: 'GET', path: '/v1/tasks', desc: '任务列表', tag: '任务管理' },
  { method: 'DELETE', path: '/v1/tasks/{task_id}', desc: '取消任务', tag: '任务管理' },
];

const SEC_ENDPOINTS = [
  { method: 'POST', path: '/v1/eval/dataset', desc: '创建数据集质量与安全评测任务', tag: '数据评测' },
  { method: 'GET',  path: '/v1/eval/tasks/{task_id}', desc: '查询评测任务状态与进度', tag: '任务管理' },
  { method: 'GET',  path: '/v1/eval/tasks', desc: '获取历史评测任务列表', tag: '任务管理' },
  { method: 'DELETE', path: '/v1/eval/tasks/{task_id}', desc: '取消评测任务', tag: '任务管理' },
  { method: 'GET',  path: '/v1/eval/result/{task_id}', desc: '获取评测结果与异常样本信息（JSONL）', tag: '结果管理' },
];

const CODEAUDIT_ENDPOINTS = [
  { method: 'POST', path: '/v1/audit/scan', desc: '提交代码片段或文件进行漏洞扫描（SAST + AI）', tag: 'SAST 扫描' },
  { method: 'POST', path: '/v1/audit/scan/file', desc: '上传代码文件（.py/.java/.js 等）进行全文件扫描', tag: 'SAST 扫描' },
  { method: 'POST', path: '/v1/sca/analyze', desc: '提交依赖清单（package.json/pom.xml等）进行 SCA 分析', tag: 'SCA 分析' },
  { method: 'GET',  path: '/v1/sca/sbom/{task_id}', desc: '导出 SBOM 软件物料清单（SPDX 或 CycloneDX 格式）', tag: 'SCA 分析' },
  { method: 'GET',  path: '/v1/audit/tasks/{task_id}', desc: '查询扫描任务进度与状态', tag: '任务管理' },
  { method: 'GET',  path: '/v1/audit/tasks', desc: '获取历史扫描任务列表', tag: '任务管理' },
  { method: 'DELETE', path: '/v1/audit/tasks/{task_id}', desc: '取消扫描任务', tag: '任务管理' },
  { method: 'GET',  path: '/v1/audit/report/{task_id}', desc: '获取完整安全扫描报告（PDF/JSON）', tag: '扫描报告' },
  { method: 'POST', path: '/v1/audit/fix', desc: 'AI 生成指定漏洞的代码修复建议', tag: 'AI 修复' },
  { method: 'POST', path: '/v1/audit/fix/apply', desc: '应用 AI 修复建议（返回修复后代码 diff）', tag: 'AI 修复' },
];

const PRIVACY_ENDPOINTS = [
  { method: 'POST', path: '/v1/privacy/scan', desc: '创建文本敏感信息扫描任务', tag: '敏感扫描' },
  { method: 'POST', path: '/v1/privacy/scan/file', desc: '上传文件（txt/csv/xlsx/log）进行敏感信息扫描', tag: '敏感扫描' },
  { method: 'POST', path: '/v1/privacy/desensitize', desc: '对指定文本进行脱敏处理，返回脱敏后内容', tag: '脱敏处理' },
  { method: 'GET',  path: '/v1/privacy/tasks/{task_id}', desc: '查询扫描任务状态与进度', tag: '任务管理' },
  { method: 'GET',  path: '/v1/privacy/tasks', desc: '获取历史扫描任务列表', tag: '任务管理' },
  { method: 'DELETE', path: '/v1/privacy/tasks/{task_id}', desc: '取消扫描任务', tag: '任务管理' },
  { method: 'GET',  path: '/v1/privacy/report/{task_id}', desc: '获取完整审查报告（PDF/JSON）', tag: '审查报告' },
  { method: 'POST', path: '/v1/privacy/schedule', desc: '创建定时自动巡检任务', tag: '定时巡检' },
  { method: 'GET',  path: '/v1/privacy/schedule', desc: '获取定时巡检任务列表', tag: '定时巡检' },
  { method: 'DELETE', path: '/v1/privacy/schedule/{schedule_id}', desc: '删除定时巡检任务', tag: '定时巡检' },
];

const METHOD_COLORS: Record<string, { bg: string; color: string }> = {
  GET:    { bg: 'rgba(63,185,80,0.15)',  color: '#3fb950' },
  POST:   { bg: 'rgba(99,102,241,0.15)', color: '#818cf8' },
  DELETE: { bg: 'rgba(248,81,73,0.15)',  color: '#f85149' },
};

function MethodBadge({ method }: { method: string }) {
  const c = METHOD_COLORS[method] ?? { bg: T.accentSoft, color: T.accent };
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', padding: '2px 9px', background: c.bg, borderRadius: 4, fontSize: 11, fontWeight: 700, color: c.color, fontFamily: 'monospace', letterSpacing: '0.06em', flexShrink: 0 }}>
      {method}
    </span>
  );
}

const TEXT_PARAMS = [
  { name: 'content', type: 'string', required: true, desc: '待审核的文本内容，最大 10,000 字符' },
  { name: 'dimensions', type: 'string[]', required: false, desc: '审核维度列表，为空则启用所有维度' },
  { name: 'async', type: 'boolean', required: false, desc: '是否异步处理，默认 false（同步）' },
  { name: 'callback_url', type: 'string', required: false, desc: '异步回调地址，async=true 时生效' },
  { name: 'request_id', type: 'string', required: false, desc: '自定义请求 ID，用于对账与追踪' },
];

function ApiDocsSection({ product }: { product: string }) {
  const isCodeAudit = product === 'codeaudit';
  const isPrivacy = product === 'privacy';
  const isSec = product === 'sec';
  const ENDPOINTS = product === 'aigc' ? AIGC_ENDPOINTS : isCodeAudit ? CODEAUDIT_ENDPOINTS : isPrivacy ? PRIVACY_ENDPOINTS : SEC_ENDPOINTS;
  const baseApiUrl = 'api.example.com';
  const [active, setActive] = useState(ENDPOINTS[0]);
  React.useEffect(() => { setActive(ENDPOINTS[0]); }, [product]);
  const tags = [...new Set(ENDPOINTS.map(e => e.tag))];

  const postBody = isCodeAudit
    ? `  -d '{
    "code": "import sqlite3\\ndef get_user(uid):\\n    query = \\"SELECT * FROM users WHERE id=\\" + uid\\n    ...",
    "language": "python",
    "rules": ["sql_injection", "xss"]
  }'`
    : isPrivacy
    ? `  -d '{
    "content": "客户姓名：张三，手机号：13812345678，身份证：110101199001011234...",
    "data_type": "text",
    "dimensions": ["身份证号", "手机号码", "银行卡号"],
    "desensitize": true
  }'`
    : isSec
    ? `  -d '{
    "dataset_path": "./training_data",
    "task_type": "object_detection",
    "data_format": "COCO",
    "data_splits": ["train", "val", "test"],
    "methods": ["balance", "anomaly", "annotation_correctness", "annotation_completeness", "backdoor_screening"]
  }'`
    : `  -d '{
    "content": "待检测内容...",
    "dimensions": ["违禁内容", "色情低俗"],
    "async": false
  }'`;

  const CURL = `curl -X ${active.method} \\
  "https://${baseApiUrl}${active.path}" \\
  -H "Authorization: Bearer sk-proj-your-key-here" \\
  -H "Content-Type: application/json"${active.method === 'POST' ? ` \\
${postBody}` : ''}`;

  const RESPONSE = isCodeAudit ? `{
  "task_id":       "audit_7c4d1f9a",
  "status":        "completed",
  "language":      "python",
  "total_issues":  2,
  "critical_count": 1,
  "high_count":    1,
  "issues": [
    {
      "id":       "SQL_INJ_001",
      "severity": "CRITICAL",
      "rule":     "sql_injection",
      "line":     42,
      "message":  "用户输入直接拼接到 SQL 查询中，存在注入风险",
      "fix_hint": "使用参数化查询替代字符串拼接"
    }
  ],
  "latency_ms":  1240,
  "request_id":  "req_k9m3n7"
}` : isPrivacy ? `{
  "task_id":        "priv_3e7a2b9c",
  "status":         "completed",
  "data_type":      "text",
  "total_findings": 3,
  "risk_level":     "HIGH",
  "finding_types": {
    "身份证号": 1,
    "手机号码": 1,
    "银行卡号": 1
  },
  "desensitized_content": "客户姓名：张三，手机号：138****5678，身份证：110101**********34...",
  "latency_ms":     180,
  "request_id":     "req_p4q8r2"
}` : isSec ? `{
  "task_id": "<task_id>",
  "status": "<task_status>",
  "task_type": "object_detection",
  "data_format": "COCO",
  "data_splits": ["train", "val", "test"],
  "methods": [
    "balance",
    "anomaly",
    "annotation_correctness",
    "annotation_completeness",
    "backdoor_screening"
  ],
  "result_format": "jsonl",
  "result_url": "<result_url>"
}` : `{
  "task_id":    "task_8f3a9c2d",
  "status":     "completed",
  "verdict":    "block",
  "risk_score": 0.92,
  "details": [
    { "dimension": "违禁内容", "score": 0.92 },
    { "dimension": "色情低俗", "score": 0.31 }
  ],
  "latency_ms": 28,
  "request_id": "req_x7k2p9"
}`;

  return (
    <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
      {/* Endpoint list */}
      <div style={{ width: 264, flexShrink: 0, background: T.card, borderRight: `1px solid ${T.border}`, padding: '28px 0', overflowY: 'auto', overflowX: 'hidden' }}>
        <div style={{ padding: '0 18px 14px', fontSize: 11, fontWeight: 600, color: T.textDim, textTransform: 'uppercase', letterSpacing: '0.1em' }}>接口列表</div>
        {tags.map(tag => (
          <div key={tag}>
            <div style={{ padding: '10px 18px 6px', fontSize: 11, fontWeight: 600, color: T.textDim, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{tag}</div>
            {ENDPOINTS.filter(e => e.tag === tag).map(ep => (
              <button key={ep.path} onClick={() => setActive(ep)}
                style={{ display: 'flex', alignItems: 'center', gap: 9, width: '100%', padding: '9px 18px', background: active.path === ep.path ? 'rgba(99,102,241,0.1)' : 'transparent', border: 'none', borderLeft: `2px solid ${active.path === ep.path ? T.accent : 'transparent'}`, textAlign: 'left', cursor: 'pointer', transition: 'all 0.12s' }}>
                <MethodBadge method={ep.method} />
                <span style={{ fontSize: 12.5, fontFamily: 'monospace', color: active.path === ep.path ? T.text : T.navInactive, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ep.path}</span>
              </button>
            ))}
          </div>
        ))}
      </div>

      {/* Detail panel */}
      <div style={{ flex: 1, padding: '36px 48px', overflowY: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <MethodBadge method={active.method} />
          <code style={{ fontSize: 20, fontWeight: 600, color: T.text, fontFamily: 'monospace' }}>{active.path}</code>
        </div>
        <p style={{ fontSize: 15, color: T.textSub, margin: '0 0 32px', lineHeight: 1.6 }}>{active.desc}</p>

        {/* Request */}
        <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: '22px 24px', marginBottom: 20 }}>
          <SectionLabel>请求示例</SectionLabel>
          <CodeBlock code={CURL} lang="bash" label="cURL" />
          {active.method === 'POST' && (
            <>
              <div style={{ marginTop: 20 }}>
                <SectionLabel>请求参数</SectionLabel>
                {isCodeAudit ? (
                  <ParamTable params={[
                    { name: 'code', type: 'string', required: true, desc: '待扫描的代码字符串（与 file_url 二选一）' },
                    { name: 'language', type: 'string', required: true, desc: '代码语言，如 "python"、"java"、"javascript"' },
                    { name: 'rules', type: 'string[]', required: false, desc: '指定规则集，为空则启用全部规则' },
                    { name: 'async_mode', type: 'boolean', required: false, desc: '是否异步执行，默认 false（同步等待结果）' },
                    { name: 'callback_url', type: 'string', required: false, desc: '异步回调地址，async_mode=true 时生效' },
                    { name: 'request_id', type: 'string', required: false, desc: '自定义请求 ID，用于对账与追踪' },
                  ]} />
                ) : isPrivacy ? (
                  <ParamTable params={[
                    { name: 'content', type: 'string', required: true, desc: '待扫描的文本内容，最大 50,000 字符' },
                    { name: 'data_type', type: 'string', required: true, desc: '"text" | "structured" | "code"，数据类型' },
                    { name: 'dimensions', type: 'string[]', required: false, desc: '扫描维度列表，为空则启用全部维度' },
                    { name: 'desensitize', type: 'boolean', required: false, desc: '是否同时返回脱敏处理结果，默认 false' },
                    { name: 'async_mode', type: 'boolean', required: false, desc: '是否异步执行，大文本推荐 true' },
                    { name: 'callback_url', type: 'string', required: false, desc: '异步回调地址，async_mode=true 时生效' },
                  ]} />
                ) : isSec ? (
                  <ParamTable params={[
                    { name: 'dataset_path', type: 'string', required: true, desc: '待评测数据集路径或已上传数据集标识' },
                    { name: 'task_type', type: 'string', required: true, desc: 'image_classification | object_detection | llm_text' },
                    { name: 'data_format', type: 'string', required: true, desc: '与任务类型匹配的数据格式，如 ImageFolder、COCO、JSONL' },
                    { name: 'data_splits', type: 'string[]', required: false, desc: '需要分析的数据划分，如 train、val、test' },
                    { name: 'methods', type: 'string[]', required: false, desc: '评测方法：均衡性、异常、标注正确性、标注完整性、后门筛查' },
                  ]} />
                ) : (
                  <ParamTable params={TEXT_PARAMS} />
                )}
              </div>
            </>
          )}
        </div>

        {/* Response */}
        <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: '22px 24px' }}>
          <SectionLabel>响应示例</SectionLabel>
          <CodeBlock code={RESPONSE} lang="json" label="Response 200" />
          <div style={{ marginTop: 20 }}>
            <SectionLabel>响应字段说明</SectionLabel>
            {isCodeAudit ? (
              <ParamTable params={[
                { name: 'task_id', type: 'string', required: true, desc: '扫描任务唯一 ID' },
                { name: 'status', type: 'string', required: true, desc: '"pending" | "scanning" | "completed" | "failed"' },
                { name: 'total_issues', type: 'integer', required: true, desc: '发现漏洞总数' },
                { name: 'critical_count', type: 'integer', required: true, desc: 'CRITICAL 级漏洞数量' },
                { name: 'issues', type: 'object[]', required: true, desc: '漏洞详情列表，包含行号、规则、修复建议' },
                { name: 'latency_ms', type: 'integer', required: true, desc: '实际扫描耗时（毫秒）' },
              ]} />
            ) : isPrivacy ? (
              <ParamTable params={[
                { name: 'task_id', type: 'string', required: true, desc: '扫描任务唯一 ID' },
                { name: 'status', type: 'string', required: true, desc: '"pending" | "scanning" | "completed" | "failed"' },
                { name: 'total_findings', type: 'integer', required: true, desc: '发现的敏感信息条目总数' },
                { name: 'risk_level', type: 'string', required: true, desc: '"LOW" | "MEDIUM" | "HIGH" | "CRITICAL"' },
                { name: 'finding_types', type: 'object', required: true, desc: '各类型敏感信息的发现数量统计' },
                { name: 'desensitized_content', type: 'string', required: false, desc: '脱敏后文本，desensitize=true 时返回' },
                { name: 'latency_ms', type: 'integer', required: true, desc: '实际处理耗时（毫秒）' },
              ]} />
            ) : isSec ? (
              <ParamTable params={[
                { name: 'task_id', type: 'string', required: true, desc: '评测任务唯一标识' },
                { name: 'status', type: 'string', required: true, desc: '任务当前状态；具体枚举以正式接口文档为准' },
                { name: 'task_type', type: 'string', required: true, desc: '本次评测的数据任务类型' },
                { name: 'data_format', type: 'string', required: true, desc: '系统识别或提交的数据格式' },
                { name: 'methods', type: 'string[]', required: true, desc: '本次执行的评测方法列表' },
                { name: 'result_url', type: 'string', required: false, desc: '任务完成后的 JSONL 结果地址' },
              ]} />
            ) : (
              <ParamTable params={[
                { name: 'task_id', type: 'string', required: true, desc: '任务唯一 ID' },
                { name: 'verdict', type: 'string', required: true, desc: '"block" | "pass" | "review"' },
                { name: 'risk_score', type: 'float', required: true, desc: '综合风险分，0.0～1.0' },
                { name: 'details', type: 'object[]', required: true, desc: '各维度检测结果明细' },
                { name: 'latency_ms', type: 'integer', required: true, desc: '实际处理耗时（毫秒）' },
              ]} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── SDK Examples ────────────────────────────────────────────────
const SDK_LANGS: Record<string, { lang: string; code: string }> = {
  Python: {
    lang: 'python',
    code: `import aisc

client = aisc.Client(api_key="sk-proj-your-key-here")

# 同步文本审核
result = client.moderation.text(
    content="待审核的文本内容...",
    dimensions=["违禁内容", "色情低俗"],
)
print(result.verdict)     # "block"
print(result.risk_score)  # 0.92

# 异步视频鉴伪（返回 task_id）
task = client.detect.video(
    url="https://example.com/video.mp4",
    async_mode=True,
)
print(task.task_id)  # "task_8f3a9c2d"`,
  },
  'Node.js': {
    lang: 'javascript',
    code: `import AISafe from '@aisc/node';

const client = new AISafe({ apiKey: 'sk-proj-your-key-here' });

// 图像审核
const result = await client.moderation.image({
  url: 'https://example.com/image.jpg',
  dimensions: ['色情低俗', '暴力血腥'],
});
console.log(result.verdict);    // "pass"
console.log(result.riskScore);  // 0.03

// 异步 Deepfake 检测
const task = await client.detect.video({
  url: 'https://example.com/video.mp4',
  asyncMode: true,
});
console.log(task.taskId);`,
  },
  Go: {
    lang: 'go',
    code: `package main

import (
	"fmt"
	aisc "github.com/aisc/go-sdk"
)

func main() {
	client := aisc.NewClient("sk-proj-your-key-here")

	result, err := client.Moderation.Text(aisc.TextRequest{
		Content:    "待审核的文本内容...",
		Dimensions: []string{"违禁内容", "政治敏感"},
	})
	if err != nil {
		panic(err)
	}

	fmt.Println(result.Verdict)    // "block"
	fmt.Println(result.RiskScore)  // 0.92
}`,
  },
  Java: {
    lang: 'java',
    code: `import com.aisc.AISafeClient;
import com.aisc.models.*;

public class Main {
    public static void main(String[] args) {
        AISafeClient client = new AISafeClient("sk-proj-your-key-here");

        ModerationResult result = client.detect()
            .image()
            .url("https://example.com/image.jpg")
            .execute();

        System.out.println(result.getVerdict());    // "block"
        System.out.println(result.getRiskScore());  // 0.91
    }
}`,
  },
  cURL: {
    lang: 'bash',
    code: `# 文本审核（同步）
curl -X POST "https://api.example.com/v1/moderation/text" \\
  -H "Authorization: Bearer sk-proj-your-key-here" \\
  -H "Content-Type: application/json" \\
  -d '{
    "content": "待审核的文本内容...",
    "dimensions": ["违禁内容", "色情低俗"],
    "async": false
  }'

# 视频鉴伪（异步）
curl -X POST "https://api.example.com/v1/detect/video" \\
  -H "Authorization: Bearer sk-proj-your-key-here" \\
  -d '{"url": "https://example.com/video.mp4", "async": true}'`,
  },
};

function SdkSection({ product }: { product: string }) {
  const isCodeAudit  = product === 'codeaudit';
  const isSec        = product === 'sec';
  const isPrivacy    = product === 'privacy';
  const isLlmEval    = product === 'llmeval';
  const isSafetyEval = product === 'safetyeval';
  const isAgentEval  = product === 'agenteval';
  const productLabel = isCodeAudit ? '代码漏洞审查'
    : isSec        ? '数据集安全评测'
    : isPrivacy    ? '个人敏感信息审查'
    : isLlmEval    ? '大模型性能评测'
    : isSafetyEval ? '大模型安全评测'
    : isAgentEval  ? '智能体安全评测'
    : 'AIGC 内容审核与鉴伪';

  // Build product-specific SDK code per language
  const buildCode = (lang: string): string => {
    if (isCodeAudit) {
      if (lang === 'Python') return `import aisc_codeaudit\n\nclient = aisc_codeaudit.Client(api_key="sk-test-your-key-here")\n\n# 提交代码片段进行漏洞扫描\ntask = client.audit.scan(\n    code=open("./src/app.py").read(),\n    language="python",\n    rules=["sql_injection", "xss", "path_traversal"],\n)\nprint(task.task_id)   # "audit_7c4d1f9a"\nprint(task.status)    # "scanning"\n\n# 获取扫描报告\nreport = client.audit.report(task.task_id)\nprint(report.total_issues)    # 3\nprint(report.critical_count)  # 1`;
      if (lang === 'Node.js') return `import AuditClient from '@aisc/codeaudit-node';\n\nconst client = new AuditClient({ apiKey: 'sk-test-your-key-here' });\n\n// 扫描代码文件\nconst task = await client.audit.scan({\n  code: fs.readFileSync('./src/app.js', 'utf8'),\n  language: 'javascript',\n  rules: ['xss', 'path_traversal'],\n});\nconsole.log(task.taskId);  // "audit_7c4d1f9a"\n\n// 获取 AI 修复建议\nconst fix = await client.audit.fix(task.issues[0].id);\nconsole.log(fix.suggestedCode);`;
      if (lang === 'cURL') return `# 提交代码扫描任务\ncurl -X POST "https://api.example.com/v1/audit/scan" \\\n  -H "Authorization: Bearer sk-test-your-key-here" \\\n  -H "Content-Type: application/json" \\\n  -d '{\n    "code": "import sqlite3\\ndef get(uid): query = \\"SELECT * FROM users WHERE id=\\" + uid",\n    "language": "python",\n    "rules": ["sql_injection"]\n  }'`;
    }
    if (isSec) {
      if (lang === 'Python') return `import aisc_sec\n\nclient = aisc_sec.Client(api_key="sk-test-your-key-here")\n\n# 创建模型数据质量与安全评测任务\ntask = client.eval.dataset(\n    dataset_path="./training_data",\n    task_type="object_detection",\n    data_format="COCO",\n    data_splits=["train", "val", "test"],\n    methods=[\n        "balance", "anomaly", "annotation_correctness",\n        "annotation_completeness", "backdoor_screening"\n    ],\n)\nprint(task.task_id)\nprint(task.status)\n\n# 获取 JSONL 结果\nresult = client.eval.result(task.task_id, format="jsonl")\nprint(result.path)`;
      if (lang === 'Node.js') return `import SecClient from '@aisc/sec-node';\n\nconst client = new SecClient({ apiKey: 'sk-test-your-key-here' });\n\n// 提交大模型文本数据集评测\nconst task = await client.eval.dataset({\n  datasetPath: './training_data',\n  taskType: 'llm_text',\n  dataFormat: 'JSONL',\n  dataSplits: ['train'],\n  methods: [\n    'balance', 'anomaly', 'annotation_correctness',\n    'annotation_completeness', 'backdoor_screening'\n  ],\n});\nconsole.log(task.taskId);\n\n// 获取 JSONL 结果\nconst result = await client.eval.result(task.taskId, { format: 'jsonl' });\nconsole.log(result.path);`;
      if (lang === 'cURL') return `# 创建模型数据质量与安全评测任务\ncurl -X POST "https://api.example.com/v1/eval/dataset" \\\n  -H "Authorization: Bearer sk-test-your-key-here" \\\n  -H "Content-Type: application/json" \\\n  -d '{\n    "dataset_path": "./training_data",\n    "task_type": "image_classification",\n    "data_format": "ImageFolder",\n    "data_splits": ["train", "val"],\n    "methods": ["balance", "anomaly", "annotation_correctness", "annotation_completeness", "backdoor_screening"]\n  }'`;
    }
    if (isPrivacy) {
      if (lang === 'Python') return `import aisc_privacy\n\nclient = aisc_privacy.Client(api_key="sk-test-your-key-here")\n\n# 扫描文本中的敏感信息\ntask = client.privacy.scan(\n    content=open("./customer_records.txt").read(),\n    data_type="text",\n    dimensions=["身份证号", "手机号码", "银行卡号"],\n    desensitize=True,\n)\nprint(task.task_id)    # "priv_3e7a2b9c"\nprint(task.status)     # "scanning"\n\n# 获取审查报告\nreport = client.privacy.report(task.task_id)\nprint(report.total_findings)        # 12\nprint(report.risk_level)            # "HIGH"\nprint(report.desensitized_content)  # 脱敏后文本`;
      if (lang === 'Node.js') return `import PrivacyClient from '@aisc/privacy-node';\n\nconst client = new PrivacyClient({ apiKey: 'sk-test-your-key-here' });\n\n// 扫描文本敏感信息\nconst task = await client.privacy.scan({\n  content: fs.readFileSync('./records.txt', 'utf8'),\n  dataType: 'text',\n  dimensions: ['身份证号', '手机号码'],\n  desensitize: true,\n});\nconsole.log(task.taskId);  // "priv_3e7a2b9c"\n\n// 获取脱敏结果\nconst report = await client.privacy.report(task.taskId);\nconsole.log(report.totalFindings);  // 12\nconsole.log(report.riskLevel);      // "HIGH"`;
      if (lang === 'cURL') return `# 创建敏感信息扫描任务\ncurl -X POST "https://api.example.com/v1/privacy/scan" \\\n  -H "Authorization: Bearer sk-test-your-key-here" \\\n  -H "Content-Type: application/json" \\\n  -d '{\n    "content": "张三，手机：13812345678，身份证：110101199001011234",\n    "data_type": "text",\n    "dimensions": ["身份证号", "手机号码"],\n    "desensitize": true\n  }'`;
    }
    if (isLlmEval) {
      if (lang === 'Python') return `import aisc_llmeval\n\nclient = aisc_llmeval.Client(api_key="sk-test-your-key-here")\n\n# 创建大模型性能评测任务\ntask = client.eval.create(\n    model="your-model-api-endpoint",\n    datasets=["MMLU", "HumanEval", "GSM8K"],\n    dimensions=["generation", "understanding", "reasoning", "code"],\n)\nprint(task.task_id)   # "llm_4a8b2f9e"\nprint(task.status)    # "running"\n\n# 获取评测报告\nreport = client.eval.report(task.task_id)\nprint(report.overall_score)   # 79.8\nprint(report.radar_scores)    # {'generation': 82, 'reasoning': 71, ...}`;
      if (lang === 'Node.js') return `import LlmEvalClient from '@aisc/llmeval-node';\n\nconst client = new LlmEvalClient({ apiKey: 'sk-test-your-key-here' });\n\n// 创建评测任务\nconst task = await client.eval.create({\n  model: 'your-model-api-endpoint',\n  datasets: ['MMLU', 'HumanEval'],\n  dimensions: ['generation', 'reasoning'],\n});\nconsole.log(task.taskId);  // "llm_4a8b2f9e"\n\n// 获取报告\nconst report = await client.eval.report(task.taskId);\nconsole.log(report.overallScore);   // 79.8\nconsole.log(report.radarScores);`;
      if (lang === 'cURL') return `# 创建大模型评测任务\ncurl -X POST "https://api.example.com/v1/eval/create" \\\n  -H "Authorization: Bearer sk-test-your-key-here" \\\n  -H "Content-Type: application/json" \\\n  -d '{"model": "your-model-api-endpoint", "datasets": ["MMLU","GSM8K"], "dimensions": ["generation","reasoning"]}'`;
    }
    if (isSafetyEval) {
      if (lang === 'Python') return `import aisc_safetyeval\n\nclient = aisc_safetyeval.Client(api_key="sk-test-your-key-here")\n\n# 创建大模型安全评测任务\ntask = client.safety.evaluate(\n    model="your-model-api-endpoint",\n    attack_types=["jailbreak", "prompt_injection", "hallucination"],\n    dimensions=["refusal_rate", "safety_score", "robustness"],\n)\nprint(task.task_id)      # "safe_6b3c8a1d"\nprint(task.status)       # "running"\n\n# 获取安全评测报告\nreport = client.safety.report(task.task_id)\nprint(report.safety_score)    # 84.2\nprint(report.risk_level)      # "MEDIUM"`;
      if (lang === 'Node.js') return `import SafetyEvalClient from '@aisc/safetyeval-node';\n\nconst client = new SafetyEvalClient({ apiKey: 'sk-test-your-key-here' });\n\n// 提交安全评测任务\nconst task = await client.safety.evaluate({\n  model: 'your-model-api-endpoint',\n  attackTypes: ['jailbreak', 'prompt_injection'],\n  dimensions: ['refusal_rate', 'safety_score'],\n});\nconsole.log(task.taskId);  // "safe_6b3c8a1d"\n\n// 获取安全报告\nconst report = await client.safety.report(task.taskId);\nconsole.log(report.safetyScore);  // 84.2\nconsole.log(report.riskLevel);    // "MEDIUM"`;
      if (lang === 'cURL') return `# 创建大模型安全评测任务\ncurl -X POST "https://api.example.com/v1/safety/evaluate" \\\n  -H "Authorization: Bearer sk-test-your-key-here" \\\n  -H "Content-Type: application/json" \\\n  -d '{"model": "your-model-api-endpoint", "attack_types": ["jailbreak","prompt_injection"], "dimensions": ["safety_score"]}'`;
    }
    if (isAgentEval) {
      if (lang === 'Python') return `import aisc_agenteval\n\nclient = aisc_agenteval.Client(api_key="sk-test-your-key-here")\n\n# 创建智能体安全评测任务\ntask = client.agent.evaluate(\n    agent_endpoint="your-agent-api-endpoint",\n    attack_vectors=["prompt_injection", "memory_attack", "tool_abuse"],\n    scenarios=["finance", "hr", "code_execution"],\n)\nprint(task.task_id)    # "agent_2d9f1c7b"\nprint(task.status)     # "running"\n\n# 获取评测报告\nreport = client.agent.report(task.task_id)\nprint(report.security_score)  # 61.5\nprint(report.high_risk_count) # 3`;
      if (lang === 'Node.js') return `import AgentEvalClient from '@aisc/agenteval-node';\n\nconst client = new AgentEvalClient({ apiKey: 'sk-test-your-key-here' });\n\n// 提交智能体安全评测\nconst task = await client.agent.evaluate({\n  agentEndpoint: 'your-agent-api-endpoint',\n  attackVectors: ['prompt_injection', 'tool_abuse'],\n  scenarios: ['finance', 'hr'],\n});\nconsole.log(task.taskId);  // "agent_2d9f1c7b"\n\nconst report = await client.agent.report(task.taskId);\nconsole.log(report.securityScore);  // 61.5\nconsole.log(report.highRiskCount);  // 3`;
      if (lang === 'cURL') return `# 创建智能体安全评测任务\ncurl -X POST "https://api.example.com/v1/agent/evaluate" \\\n  -H "Authorization: Bearer sk-test-your-key-here" \\\n  -H "Content-Type: application/json" \\\n  -d '{"agent_endpoint": "your-agent-api-endpoint", "attack_vectors": ["prompt_injection","tool_abuse"], "scenarios": ["finance"]}'`;
    }
    // Default: AIGC
    if (lang === 'Python') return SDK_LANGS['Python'].code;
    if (lang === 'Node.js') return SDK_LANGS['Node.js'].code;
    if (lang === 'cURL') return SDK_LANGS['cURL'].code;
    return SDK_LANGS[lang]?.code ?? '';
  };

  const langs = Object.keys(SDK_LANGS);
  const [active, setActive] = useState(langs[0]);
  const code = buildCode(active);
  const { lang } = SDK_LANGS[active];

  return (
    <div>
      <h1 style={{ fontSize: 34, fontWeight: 700, color: T.text, margin: '0 0 6px', letterSpacing: '-0.02em' }}>SDK 与代码示例</h1>
      <p style={{ fontSize: 15.5, color: T.textSub, margin: '0 0 28px', lineHeight: 1.7 }}>
        多语言官方 SDK，集成 <span style={{ color: T.accent, fontWeight: 600 }}>{productLabel}</span> 能力到您的业务系统。
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
        <div>
          <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
            {langs.map(l => (
              <button key={l} onClick={() => setActive(l)}
                style={{ padding: '7px 16px', background: active === l ? T.accentSoft : 'rgba(255,255,255,0.04)', border: `1px solid ${active === l ? T.accentBorder : T.border}`, borderRadius: 7, color: active === l ? T.accent : T.navInactive, fontSize: 14, fontWeight: active === l ? 600 : 400, cursor: 'pointer', transition: 'all 0.15s' }}>
                {l}
              </button>
            ))}
          </div>
          <CodeBlock code={code} lang={lang} label={`${active} 示例`} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Install table */}
          <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, overflow: 'hidden' }}>
            <div style={{ padding: '14px 20px', borderBottom: `1px solid ${T.border}`, fontSize: 14, fontWeight: 600, color: T.text }}>安装命令</div>
            {(isPrivacy
              ? [
                  { lang: 'Python', cmd: 'pip install aisc-privacy' },
                  { lang: 'Node.js', cmd: 'npm install @aisc/privacy-node' },
                  { lang: 'Java', cmd: 'implementation "com.aisc:privacy-sdk:1.0.0"' },
                  { lang: 'Go', cmd: 'go get github.com/aisc/privacy-go' },
                ]
              : isCodeAudit
              ? [
                  { lang: 'Python', cmd: 'pip install aisc-codeaudit' },
                  { lang: 'Node.js', cmd: 'npm install @aisc/codeaudit-node' },
                  { lang: 'Java', cmd: 'implementation "com.aisc:codeaudit-sdk:1.1.0"' },
                  { lang: 'Go', cmd: 'go get github.com/aisc/codeaudit-go' },
                ]
              : isSec
              ? [
                  { lang: 'Python', cmd: 'pip install aisc-sec-sdk' },
                  { lang: 'Node.js', cmd: 'npm install @aisc/sec-node' },
                  { lang: 'Java', cmd: 'implementation "com.aisc:sec-sdk:1.0.0"' },
                  { lang: 'Go', cmd: 'go get github.com/aisc/sec-go-sdk' },
                ]
              : isLlmEval
              ? [
                  { lang: 'Python', cmd: 'pip install aisc-llmeval' },
                  { lang: 'Node.js', cmd: 'npm install @aisc/llmeval-node' },
                  { lang: 'Java', cmd: 'implementation "com.aisc:llmeval-sdk:1.0.0"' },
                  { lang: 'Go', cmd: 'go get github.com/aisc/llmeval-go' },
                ]
              : isSafetyEval
              ? [
                  { lang: 'Python', cmd: 'pip install aisc-safetyeval' },
                  { lang: 'Node.js', cmd: 'npm install @aisc/safetyeval-node' },
                  { lang: 'Java', cmd: 'implementation "com.aisc:safetyeval-sdk:1.0.0"' },
                  { lang: 'Go', cmd: 'go get github.com/aisc/safetyeval-go' },
                ]
              : isAgentEval
              ? [
                  { lang: 'Python', cmd: 'pip install aisc-agenteval' },
                  { lang: 'Node.js', cmd: 'npm install @aisc/agenteval-node' },
                  { lang: 'Java', cmd: 'implementation "com.aisc:agenteval-sdk:1.0.0"' },
                  { lang: 'Go', cmd: 'go get github.com/aisc/agenteval-go' },
                ]
              : [
                  { lang: 'Python', cmd: 'pip install aisc-sdk' },
                  { lang: 'Node.js', cmd: 'npm install @aisc/node' },
                  { lang: 'Java', cmd: 'implementation "com.aisc:sdk:1.2.0"' },
                  { lang: 'Go', cmd: 'go get github.com/aisc/go-sdk' },
                ]
            ).map((item, i, arr) => (
              <div key={item.lang} style={{ display: 'flex', alignItems: 'center', padding: '12px 20px', borderBottom: i < arr.length - 1 ? `1px solid ${T.border}` : 'none' }}>
                <span style={{ fontSize: 13, color: T.textDim, width: 80, flexShrink: 0 }}>{item.lang}</span>
                <code style={{ flex: 1, fontSize: 13.5, fontFamily: 'monospace', color: '#a5d6ff' }}>{item.cmd}</code>
                <CopyBtn text={item.cmd} />
              </div>
            ))}
          </div>

          {/* SDK features */}
          <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: '20px' }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: T.text, marginBottom: 14 }}>SDK 特性</div>
            {['自动重试与指数退避', '流式响应支持', '类型安全（TypeScript/Typed）', '内置速率限制处理', '同步/异步双模式', '请求超时与取消'].map(f => (
              <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 10, fontSize: 14, color: T.textSub }}>
                <span style={{ color: T.green, fontSize: 15 }}>✓</span> {f}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Usage ───────────────────────────────────────────────────────
function UsageSection() {
  return (
    <div>
      <h1 style={{ fontSize: 34, fontWeight: 700, color: T.text, margin: '0 0 10px', letterSpacing: '-0.02em' }}>用量与计费</h1>
      <p style={{ fontSize: 15.5, color: T.textSub, margin: '0 0 28px', lineHeight: 1.7 }}>实时监控 API 调用量与账单信息。</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 32 }}>
        {[
          { label: '本月调用', value: '2.4M', unit: '次', color: T.accent, trend: '+18%', up: true },
          { label: '成功率', value: '99.97', unit: '%', color: T.green, trend: '+0.02%', up: true },
          { label: '平均延迟', value: '28', unit: 'ms', color: T.orange, trend: '-3ms', up: false },
          { label: '本月费用', value: '¥1,240', unit: '', color: '#c084fc', trend: '+¥142', up: true },
        ].map(s => (
          <div key={s.label} style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: '20px' }}>
            <div style={{ fontSize: 13, color: T.textDim, marginBottom: 10 }}>{s.label}</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: s.color, lineHeight: 1 }}>
              {s.value}<span style={{ fontSize: 14, fontWeight: 400, color: T.textDim, marginLeft: 3 }}>{s.unit}</span>
            </div>
            <div style={{ fontSize: 13, color: s.up ? T.green : T.orange, marginTop: 8 }}>{s.trend} vs 上月</div>
          </div>
        ))}
      </div>

      <div style={{ fontSize: 17, fontWeight: 600, color: T.text, marginBottom: 16 }}>升级套餐</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
        {[
          { name: '免费版', price: '¥0', unit: '/月', color: T.textSub, features: ['每月 10,000 次调用', '文本/图像审核', '基础维度', '72h 支持响应'], cta: '当前套餐', disabled: true, highlight: false },
          { name: '专业版', price: '¥299', unit: '/月', color: T.accent, features: ['每月 2,000,000 次调用', '全模态审核+鉴伪', '全部维度', '优先队列', '4h 响应'], cta: '立即升级', disabled: false, highlight: true },
          { name: '企业版', price: '定制', unit: '', color: '#c084fc', features: ['无限次调用', '私有化部署', '专属 SLA', '定制维度', '1h 响应 + 专属 TAM'], cta: '联系销售', disabled: false, highlight: false },
        ].map(p => (
          <div key={p.name} style={{ background: T.card, border: `1px solid ${p.highlight ? T.accentBorder : T.border}`, borderRadius: 12, padding: '24px 22px', position: 'relative' }}>
            {p.highlight && <div style={{ position: 'absolute', top: -1, right: 16, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff', fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: '0 0 8px 8px' }}>推荐</div>}
            <div style={{ fontSize: 14, color: T.textSub, marginBottom: 6 }}>{p.name}</div>
            <div style={{ fontSize: 30, fontWeight: 700, color: p.color, marginBottom: 2, letterSpacing: '-0.02em' }}>
              {p.price}<span style={{ fontSize: 14, fontWeight: 400, color: T.textDim }}>{p.unit}</span>
            </div>
            <div style={{ height: 1, background: T.border, margin: '16px 0' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 9, marginBottom: 20 }}>
              {p.features.map(f => (
                <div key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 9, fontSize: 14, color: T.textSub }}>
                  <span style={{ color: p.color, flexShrink: 0 }}>✓</span> {f}
                </div>
              ))}
            </div>
            <button disabled={p.disabled}
              style={{ width: '100%', padding: '11px', background: p.disabled ? 'rgba(255,255,255,0.04)' : p.highlight ? 'linear-gradient(135deg,#6366f1,#8b5cf6)' : T.accentSoft, color: p.disabled ? T.textDim : '#fff', border: p.disabled ? `1px solid ${T.border}` : 'none', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: p.disabled ? 'default' : 'pointer' }}>
              {p.cta}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main layout ──────────────────────────────────────────────────
const NAV_ITEMS = [
  { key: 'quickstart', label: '快速开始',       icon: Zap },
  { key: 'apikeys',    label: 'API Keys 与 Webhook', icon: Key },
  { key: 'apidocs',    label: 'API 接口文档',    icon: Book },
  { key: 'sdk',        label: 'SDK 与代码示例',  icon: Package },
  { key: 'usage',      label: '用量与计费',      icon: BarChart2 },
];

const ENV_OPTIONS = ['生产', '测试'];

const PRODUCTS = [
  { key: 'aigc',      label: 'AIGC 内容审核与鉴伪', color: '#6366f1' },
  { key: 'sec',       label: '数据集安全评测',     color: '#3b82f6' },
  { key: 'codeaudit', label: '代码漏洞审查',         color: '#06b6d4' },
  { key: 'privacy',   label: '个人敏感信息审查',     color: '#8b5cf6' },
  { key: 'llmeval',   label: '大模型性能评测',       color: '#10b981' },
  { key: 'safetyeval',label: '大模型安全评测',       color: '#f59e0b' },
  { key: 'agenteval', label: '智能体安全评测',       color: '#ef4444' },
];

export function DeveloperCenter() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isGuest } = useUser();
  useEffect(() => { window.scrollTo(0, 0); }, []);
  const [active, setActive]     = useState('quickstart');
  const [env, setEnv]           = useState('生产');
  const [showEnv, setShowEnv]   = useState(false);
  const [search, setSearch]     = useState('');
  const initialProduct = PRODUCTS.find(p => p.key === searchParams.get('product'))?.key ?? 'aigc';
  const [product, setProduct]   = useState(initialProduct);

  const isFullPage = active === 'apidocs';
  const activeLabel = NAV_ITEMS.find(n => n.key === active)?.label ?? '';
  useEffect(() => {
    document.title = '开发者中心｜玄鉴 AI安全与评测平台';
  }, []);
  return (
      <div style={{ minHeight: '100vh', width: '100%', maxWidth: '100vw', overflowX: 'hidden', background: T.bg, display: 'flex', flexDirection: 'column', fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",system-ui,sans-serif' }}>

        {/* Top bar */}
        <header style={{ background: T.sidebar, borderBottom: `1px solid ${T.border}`, flexShrink: 0, position: 'sticky', top: 0, zIndex: 100 }}>
          <div style={{ minHeight: 64, display: 'flex', alignItems: 'center', padding: '10px 20px', gap: 14 }}>
            <button onClick={() => navigate(-1)}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 11px', background: 'rgba(255,255,255,0.05)', border: `1px solid ${T.border}`, borderRadius: 8, color: T.textSub, fontSize: 13.5, cursor: 'pointer', whiteSpace: 'nowrap' }}>
              <ArrowLeft size={13} /> 返回官网
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: 9, minWidth: 160 }}>
              <div style={{ width: 32, height: 32, borderRadius: 9, background: 'linear-gradient(135deg,#2563eb,#7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Terminal size={16} color="#fff" />
              </div>
              <div>
                <div style={{ fontSize: 15.5, fontWeight: 700, color: T.text }}>玄鉴开发者中心</div>
                <div style={{ marginTop: 2, fontSize: 10.5, color: T.textDim }}>API · SDK · WEBHOOK</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13.5, color: T.textDim }}>
              <ChevronRight size={13} />
              <span style={{ color: T.textSub }}>{activeLabel}</span>
            </div>

            <div style={{ flex: 1, maxWidth: 380, minWidth: 180, marginLeft: 'auto', position: 'relative' }}>
              <Search size={14} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: T.textDim, pointerEvents: 'none' }} />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="搜索接口、参数、错误码"
                style={{ width: '100%', padding: '8px 12px 8px 34px', background: 'rgba(255,255,255,0.05)', border: `1px solid ${T.border}`, borderRadius: 8, color: T.text, fontSize: 13.5, outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }} />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {/* Environment switcher */}
            <div style={{ position: 'relative' }}>
              <button onClick={() => setShowEnv(!showEnv)}
                style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '6px 12px', background: 'rgba(255,255,255,0.05)', border: `1px solid ${T.border}`, borderRadius: 7, color: T.textSub, fontSize: 13.5, cursor: 'pointer' }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: env === '生产' ? T.green : T.orange, flexShrink: 0 }} />
                {env}环境
                <ChevronDown size={12} />
              </button>
              {showEnv && (
                <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: 6, background: T.card, border: `1px solid ${T.borderStrong}`, borderRadius: 9, overflow: 'hidden', zIndex: 200, minWidth: 140, boxShadow: '0 8px 24px rgba(0,0,0,0.4)' }}>
                  {ENV_OPTIONS.map(e => (
                    <button key={e} onClick={() => { setEnv(e); setShowEnv(false); }}
                      style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', padding: '10px 16px', background: env === e ? T.accentSoft : 'transparent', border: 'none', color: env === e ? T.text : T.textSub, fontSize: 14, cursor: 'pointer', textAlign: 'left' }}>
                      <span style={{ width: 7, height: 7, borderRadius: '50%', background: e === '生产' ? T.green : T.orange }} />
                      {e}环境
                      {env === e && <Check size={13} style={{ marginLeft: 'auto', color: T.accent }} />}
                    </button>
                  ))}
                </div>
              )}
            </div>

              <div style={{ width: 1, height: 18, background: T.border }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#f5b74f', whiteSpace: 'nowrap' }}>
                <AlertCircle size={13} />
                演示配置
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, overflowX: 'auto', padding: '0 20px 11px', scrollbarWidth: 'thin' }}>
            <span style={{ flexShrink: 0, color: T.textDim, fontSize: 11, fontWeight: 700, letterSpacing: '.08em' }}>产品能力</span>
            {PRODUCTS.map(p => (
              <button key={p.key} onClick={() => setProduct(p.key)}
                style={{ flexShrink: 0, padding: '7px 13px', borderRadius: 8, fontSize: 12.5, fontWeight: product === p.key ? 700 : 500, border: product === p.key ? `1px solid ${p.color}` : `1px solid ${T.border}`, cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.15s', background: product === p.key ? `${p.color}24` : 'rgba(255,255,255,0.03)', color: product === p.key ? '#fff' : T.navInactive }}>
                {p.label}
              </button>
            ))}
          </div>
        </header>

        <div style={{ flex: 1, minWidth: 0, display: 'flex', overflow: 'hidden' }}>
          {/* Sidebar */}
          <aside style={{ width: 232, background: T.sidebar, borderRight: `1px solid ${T.border}`, display: 'flex', flexDirection: 'column', flexShrink: 0, overflowY: 'auto' }}>
            <div style={{ padding: '22px 0 10px' }}>
              <div style={{ padding: '0 18px 12px', fontSize: 11, fontWeight: 600, color: T.textDim, textTransform: 'uppercase', letterSpacing: '0.1em' }}>开发文档</div>
              {NAV_ITEMS.map(item => (
                <NavItem key={item.key} icon={item.icon} label={item.label} active={active === item.key} onClick={() => setActive(item.key)} />
              ))}
            </div>
            <div style={{ height: 1, background: T.border, margin: '8px 18px' }} />
            <div style={{ padding: '10px 0' }}>
              {[{ icon: HelpCircle, label: '帮助中心' }, { icon: Book, label: 'API 文档' }, { icon: MessageSquare, label: '联系技术支持' }].map(link => {
                const Icon = link.icon;
                return (
                  <button key={link.label}
                    style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '9px 18px', background: 'transparent', border: 'none', color: T.navInactive, fontSize: 14.5, cursor: 'pointer', textAlign: 'left' }}>
                    <Icon size={15} strokeWidth={1.6} />
                    <span style={{ flex: 1 }}>{link.label}</span>
                    <ExternalLink size={12} style={{ opacity: 0.4 }} />
                  </button>
                );
              })}
            </div>
          </aside>

          {/* Main */}
          <main style={{ flex: 1, minWidth: 0, overflow: isFullPage ? 'hidden' : 'auto', background: T.bg, display: isFullPage ? 'flex' : 'block', ...(isFullPage ? {} : { padding: '44px clamp(24px,4vw,60px)' }) }}
            onClick={() => showEnv && setShowEnv(false)}>
            {active === 'quickstart' && <QuickStart env={env} product={product} />}
            {active === 'apikeys'    && <ApiKeysSection product={product} isGuest={isGuest} />}
            {active === 'apidocs'   && <ApiDocsSection product={product} />}
            {active === 'sdk'       && <SdkSection product={product} />}
            {active === 'usage'     && <UsageSection />}
          </main>
        </div>
      </div>
  );
}
