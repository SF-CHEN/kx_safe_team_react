import React, { useState } from 'react';
import { Link } from 'react-router';
import { X, Copy, Check, Code2, Key, Globe, Zap, Bell, RefreshCw, ChevronDown } from 'lucide-react';

interface ApiDrawerProps {
  open: boolean;
  onClose: () => void;
  modality: 'text' | 'image' | 'audio' | 'video';
  func: 'audit' | 'detect';
}

const MODALITY_ENDPOINT: Record<string, string> = {
  text: 'text',
  image: 'image',
  audio: 'audio',
  video: 'video',
};

const FUNC_ENDPOINT: Record<string, string> = {
  audit: 'moderation',
  detect: 'detection',
};

const SAMPLE_KEYS = {
  apiKey: 'sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
  secretKey: 'sk-secret-xxxxxxxxxxxxxxxxxxxxxxxx',
};

type Lang = 'curl' | 'python' | 'javascript';

function getCode(lang: Lang, modality: string, func: string, apiKey: string, callbackUrl: string, asyncMode: boolean): string {
  const endpoint = `https://api.example.com/v1/${FUNC_ENDPOINT[func]}/${MODALITY_ENDPOINT[modality]}`;
  const body = JSON.stringify({
    content: modality === 'text' ? '待审核文本内容...' : undefined,
    url: modality !== 'text' ? `https://example.com/sample.${modality === 'image' ? 'jpg' : modality === 'audio' ? 'mp3' : 'mp4'}` : undefined,
    ...(asyncMode && callbackUrl ? { callback_url: callbackUrl } : {}),
    async: asyncMode,
  }, null, 2).replace(/"undefined": undefined/g, '').replace(/,\n  "url": undefined/g, '').replace(/,\n  "content": undefined/g, '');

  if (lang === 'curl') {
    return `curl -X POST "${endpoint}" \\
  -H "Authorization: Bearer ${apiKey}" \\
  -H "Content-Type: application/json" \\
  -d '${body.replace(/\n/g, '\n  ')}'`;
  }
  if (lang === 'python') {
    return `import requests

url = "${endpoint}"
headers = {
    "Authorization": f"Bearer ${apiKey}",
    "Content-Type": "application/json"
}
payload = ${body}

response = requests.post(url, json=payload, headers=headers)
result = response.json()
print(result)`;
  }
  return `const response = await fetch("${endpoint}", {
  method: "POST",
  headers: {
    "Authorization": "Bearer ${apiKey}",
    "Content-Type": "application/json",
  },
  body: JSON.stringify(${body}),
});

const result = await response.json();
console.log(result);`;
}

function SyntaxHighlight({ code }: { code: string }) {
  const lines = code.split('\n');
  return (
    <code style={{ display: 'block', fontSize: 12.5, lineHeight: 1.75, fontFamily: '"JetBrains Mono", "Fira Code", monospace' }}>
      {lines.map((line, i) => {
        const colored = line
          .replace(/(".*?")/g, '<span style="color:#a5f3fc">$1</span>')
          .replace(/(curl|POST|GET|-X|-H|-d|import|from|const|let|var|await|async|def|return|print)/g, '<span style="color:#f9a8d4">$1</span>')
          .replace(/(https?:\/\/[^\s"']+)/g, '<span style="color:#86efac">$1</span>')
          .replace(/(\/\/.*$)/g, '<span style="color:#475569">$1</span>');
        return (
          <div key={i} style={{ display: 'flex', minHeight: 21 }}>
            <span style={{ width: 36, flexShrink: 0, color: '#334155', fontSize: 11, textAlign: 'right', paddingRight: 16, userSelect: 'none' }}>{i + 1}</span>
            <span dangerouslySetInnerHTML={{ __html: colored || '&nbsp;' }} />
          </div>
        );
      })}
    </code>
  );
}

const RESPONSE_EXAMPLE = `{
  "task_id": "task_8f3a9c2d",
  "status": "processing",
  "created_at": 1716000000,
  "estimated_ms": 800
}`;

const CALLBACK_EXAMPLE = `// Webhook 回调 (异步完成后推送)
{
  "task_id": "task_8f3a9c2d",
  "status": "completed",
  "result": {
    "risk_level": "high",
    "categories": ["violence", "hate_speech"],
    "confidence": 0.94,
    "review_required": true
  }
}`;

export function ApiDrawer({ open, onClose, modality, func }: ApiDrawerProps) {
  const [lang, setLang] = useState<Lang>('curl');
  const [apiKey, setApiKey] = useState(SAMPLE_KEYS.apiKey);
  const [callbackUrl, setCallbackUrl] = useState('https://your-app.com/webhook');
  const [asyncMode, setAsyncMode] = useState(true);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  const [webhookEvents, setWebhookEvents] = useState<string[]>(['task.completed', 'task.failed']);

  const EVENTS = ['task.completed', 'task.failed', 'task.review_required', 'task.cancelled'];

  const code = getCode(lang, modality, func, apiKey, callbackUrl, asyncMode);

  function copyCode() {
    navigator.clipboard.writeText(code).then(() => { setCopiedCode(true); setTimeout(() => setCopiedCode(false), 2000); });
  }
  function copyKey() {
    navigator.clipboard.writeText(apiKey).then(() => { setCopiedKey(true); setTimeout(() => setCopiedKey(false), 2000); });
  }
  function toggleEvent(ev: string) {
    setWebhookEvents(prev => prev.includes(ev) ? prev.filter(e => e !== ev) : [...prev, ev]);
  }

  if (!open) return null;

  const endpoint = `https://api.example.com/v1/${FUNC_ENDPOINT[func]}/${MODALITY_ENDPOINT[modality]}`;
  const funcLabel = func === 'audit' ? '内容审核' : 'AI鉴伪';
  const funcColor = func === 'audit' ? '#f59e0b' : '#8b5cf6';

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1100, display: 'flex', alignItems: 'stretch' }}>
      {/* Backdrop */}
      <div onClick={onClose} style={{ flex: 1, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }} />

      {/* Drawer panel */}
      <div style={{ width: '100%', maxWidth: 1060, background: '#0f172a', display: 'flex', flexDirection: 'column', overflowY: 'auto', boxShadow: '-24px 0 80px rgba(0,0,0,0.5)' }}>

        {/* Header */}
        <div style={{ padding: '20px 28px', borderBottom: '1px solid #1e293b', display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0 }}>
          <div style={{ width: 36, height: 36, borderRadius: 9, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Code2 size={18} style={{ color: '#fff' }} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <h2 style={{ margin: 0, fontSize: 17, fontWeight: 800, color: '#f8fafc' }}>开发者接入面板</h2>
              <span style={{ padding: '2px 10px', background: `${funcColor}20`, border: `1px solid ${funcColor}40`, borderRadius: 20, fontSize: 11, color: funcColor, fontWeight: 700 }}>{funcLabel} API</span>
            </div>
            <p style={{ margin: '2px 0 0', fontSize: 12, color: '#475569' }}>OpenAPI · RESTful · Webhook · SDK</p>
          </div>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 8, background: '#1e293b', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b' }}>
            <X size={16} />
          </button>
        </div>

        {/* Body — two columns */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', flex: 1, overflow: 'hidden' }}>

          {/* Left: Code area */}
          <div style={{ borderRight: '1px solid #1e293b', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {/* Lang tabs */}
            <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid #1e293b', padding: '0 16px', flexShrink: 0 }}>
              {(['curl', 'python', 'javascript'] as Lang[]).map(l => (
                <button key={l} onClick={() => setLang(l)}
                  style={{ padding: '12px 18px', border: 'none', borderBottom: `2px solid ${lang === l ? '#6366f1' : 'transparent'}`, background: 'transparent', color: lang === l ? '#a5b4fc' : '#475569', fontSize: 12, fontWeight: 700, cursor: 'pointer', transition: 'all 0.15s', fontFamily: 'monospace', letterSpacing: '0.04em' }}>
                  {l === 'javascript' ? 'Node.js' : l.charAt(0).toUpperCase() + l.slice(1)}
                </button>
              ))}
              <div style={{ flex: 1 }} />
              <button onClick={copyCode}
                style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 14px', background: 'transparent', border: 'none', color: copiedCode ? '#4ade80' : '#475569', fontSize: 11, cursor: 'pointer', fontFamily: 'monospace' }}>
                {copiedCode ? <Check size={13} /> : <Copy size={13} />}
                {copiedCode ? 'Copied!' : 'Copy'}
              </button>
            </div>

            {/* Request code */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px 20px 20px 8px', background: '#090f1a' }}>
              <div style={{ fontSize: 10, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12, paddingLeft: 36 }}>REQUEST</div>
              <SyntaxHighlight code={code} />

              <div style={{ height: 1, background: '#1e293b', margin: '24px 0 24px 36px' }} />

              <div style={{ fontSize: 10, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12, paddingLeft: 36 }}>RESPONSE (async)</div>
              <SyntaxHighlight code={RESPONSE_EXAMPLE} />

              <div style={{ height: 1, background: '#1e293b', margin: '24px 0 24px 36px' }} />

              <div style={{ fontSize: 10, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12, paddingLeft: 36 }}>WEBHOOK CALLBACK</div>
              <SyntaxHighlight code={CALLBACK_EXAMPLE} />
            </div>
          </div>

          {/* Right: Config panel */}
          <div style={{ overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Endpoint */}
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
                <Globe size={11} style={{ verticalAlign: 'middle', marginRight: 4 }} />API Endpoint
              </label>
              <div style={{ padding: '10px 14px', background: '#1e293b', border: '1px solid #334155', borderRadius: 8, fontSize: 11, color: '#86efac', fontFamily: 'monospace', wordBreak: 'break-all', lineHeight: 1.6 }}>
                {endpoint}
              </div>
              <div style={{ marginTop: 6, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                <span style={{ padding: '2px 8px', background: 'rgba(99,102,241,0.15)', borderRadius: 6, fontSize: 10, color: '#a5b4fc', fontFamily: 'monospace' }}>POST</span>
                <span style={{ padding: '2px 8px', background: 'rgba(16,185,129,0.1)', borderRadius: 6, fontSize: 10, color: '#6ee7b7' }}>REST / JSON</span>
                <span style={{ padding: '2px 8px', background: 'rgba(245,158,11,0.1)', borderRadius: 6, fontSize: 10, color: '#fcd34d' }}>v1</span>
              </div>
            </div>

            {/* API Key */}
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
                <Key size={11} style={{ verticalAlign: 'middle', marginRight: 4 }} />API Key
              </label>
              <div style={{ display: 'flex', gap: 8 }}>
                <input value={apiKey} onChange={e => setApiKey(e.target.value)}
                  style={{ flex: 1, padding: '9px 12px', background: '#1e293b', border: '1px solid #334155', borderRadius: 8, fontSize: 11, color: '#e2e8f0', fontFamily: 'monospace', outline: 'none' }} />
                <button onClick={copyKey}
                  style={{ padding: '9px 12px', background: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: copiedKey ? '#4ade80' : '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                  {copiedKey ? <Check size={13} /> : <Copy size={13} />}
                </button>
              </div>
              <p style={{ margin: '5px 0 0', fontSize: 10, color: '#334155' }}>在控制台 → API Keys 页面生成</p>
            </div>

            {/* Callback URL */}
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
                <Bell size={11} style={{ verticalAlign: 'middle', marginRight: 4 }} />Callback URL
              </label>
              <input value={callbackUrl} onChange={e => setCallbackUrl(e.target.value)}
                style={{ width: '100%', padding: '9px 12px', background: '#1e293b', border: '1px solid #334155', borderRadius: 8, fontSize: 11, color: '#e2e8f0', fontFamily: 'monospace', outline: 'none', boxSizing: 'border-box' }} />
            </div>

            {/* Async Mode */}
            <div style={{ padding: '14px 16px', background: '#1e293b', borderRadius: 10, border: '1px solid #334155' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#e2e8f0', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Zap size={12} style={{ color: '#fbbf24' }} /> Async Mode
                  </div>
                  <div style={{ fontSize: 10, color: '#475569', marginTop: 2 }}>异步任务队列，Webhook 回调结果</div>
                </div>
                <button onClick={() => setAsyncMode(!asyncMode)}
                  style={{ width: 40, height: 22, borderRadius: 11, border: 'none', background: asyncMode ? '#6366f1' : '#334155', cursor: 'pointer', position: 'relative', transition: 'background 0.2s', flexShrink: 0 }}>
                  <div style={{ width: 16, height: 16, borderRadius: '50%', background: '#fff', position: 'absolute', top: 3, left: asyncMode ? 21 : 3, transition: 'left 0.2s' }} />
                </button>
              </div>
            </div>

            {/* Webhook Events */}
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
                <RefreshCw size={11} style={{ verticalAlign: 'middle', marginRight: 4 }} />Webhook Events
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {EVENTS.map(ev => (
                  <label key={ev} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', background: '#1e293b', borderRadius: 8, border: `1px solid ${webhookEvents.includes(ev) ? '#6366f1' : '#334155'}`, cursor: 'pointer', transition: 'border 0.15s' }}>
                    <input type="checkbox" checked={webhookEvents.includes(ev)} onChange={() => toggleEvent(ev)}
                      style={{ accentColor: '#6366f1', width: 14, height: 14, cursor: 'pointer' }} />
                    <span style={{ fontSize: 11, color: webhookEvents.includes(ev) ? '#a5b4fc' : '#64748b', fontFamily: 'monospace' }}>{ev}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Generate code CTA */}
            <div style={{ padding: '14px', background: 'linear-gradient(135deg,rgba(99,102,241,0.15),rgba(139,92,246,0.1))', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 10 }}>
              <p style={{ margin: '0 0 10px', fontSize: 12, color: '#a5b4fc', fontWeight: 600 }}>根据右侧配置自动生成代码</p>
              <button onClick={() => setLang(lang)}
                style={{ width: '100%', padding: '10px', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', border: 'none', borderRadius: 8, color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <Code2 size={14} /> 生成示例代码
              </button>
            </div>

            {/* Docs link */}
            <div style={{ paddingTop: 4 }}>
              <Link to="/developer" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#6366f1', textDecoration: 'none', fontWeight: 600 }}>
                查看完整 API 接口文档 →
              </Link>
              <div style={{ marginTop: 6, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {['Python SDK', 'Node.js SDK', 'Java SDK', 'Go SDK'].map(s => (
                  <Link key={s} to="/developer" style={{ padding: '3px 10px', background: '#1e293b', border: '1px solid #334155', borderRadius: 6, fontSize: 10, color: '#64748b', textDecoration: 'none', fontFamily: 'monospace' }}>{s}</Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
