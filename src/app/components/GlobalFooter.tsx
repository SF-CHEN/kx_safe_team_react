import React from 'react';
import { Link } from 'react-router';
import { BarChart2, Mail, Phone, MapPin, BookOpen } from 'lucide-react';
import rongShuLogo from '../../imports/____-_____3x.png';
import yjyBjLogo from '../../imports/yjy.png';
import qrCodeImg from '../../imports/image-8.png';

const FOOTER_SERVICE_COLS = [
  {
    label: '数据侧', color: '#a78bfa',
    items: [
      { name: '个人敏感信息审查', path: '/privacy-data-audit' },
      { name: '模型数据安全评测', path: '/model-safety-eval' },
      { name: 'AIGC内容审核与鉴伪', path: '/aigc-content' },
    ],
  },
  {
    label: '模型侧', color: '#60a5fa',
    items: [
      { name: '深度模型可信测评', path: '/deep-model-eval' },
      { name: '具身智能可信评测', path: '/embodied-intelligence' },
      { name: '智能体安全评测', path: '/agent-safety' },
      { name: '大语言模型可信评测', path: '/llm-evaluation' },
    ],
  },
  {
    label: '系统侧', color: '#38bdf8',
    items: [
      { name: '代码漏洞审查', path: '/code-vulnerability-audit' },
      { name: '网络渗透测试', path: '/penetration-test' },
    ],
  },
  {
    label: '合规治理侧', color: '#34d399',
    items: [
      { name: '人工智能安全教学平台', path: '/ai-safety-edu' },
      { name: '大模型备案服务', path: '/model-filing-service' },
      { name: '可信安全标准制定服务', path: '/tianche-standard-service' },
    ],
  },
];

const FOOTER_RESOURCES = [
  { label: '在线体验', path: '/online-experience' },
  { label: '资源中心', path: '/resource-center' },
  { label: '帮助文档', path: '/help-docs' },
  { label: '开发者中心', path: '/developer' },
  { label: '关于我们', path: '/about' },
];

export function GlobalFooter() {
  return (
    <footer style={{ background: 'linear-gradient(135deg,#1e3a8a,#2251c2)', color: '#bfdbfe' }}>
      <div className="mx-auto max-w-[1600px] px-6 pb-8 pt-14 lg:px-16">
        <div className="mb-10 grid gap-10 md:grid-cols-2 xl:grid-cols-[200px_1fr_160px_240px] xl:items-start">
          <div>
            <div className="mb-4 flex items-center gap-2">
              <img
                src={rongShuLogo}
                alt="杭州榕数科技"
                className="h-11 w-auto shrink-0 object-contain brightness-0 invert"
                loading="lazy"
                decoding="async"
              />
              <span className="whitespace-nowrap text-base font-black leading-none text-white">
                杭州榕数科技有限公司
              </span>
            </div>
            <div className="mb-3">
              <div className="mb-1 flex items-center gap-2">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/95 shadow-md ring-1 ring-white/50">
                  <img src={yjyBjLogo} alt="浙大滨江研究院" className="h-[30px] w-[30px] rounded-full object-contain" loading="lazy" decoding="async" />
                </div>
                <div className="text-base font-black leading-tight text-white">智能计算联合实验室</div>
              </div>
              <div className="whitespace-nowrap text-[11px] text-white/55">
                <span className="text-blue-300">浙大滨江研究院</span>
                <span className="text-white/30"> × </span>
                <span className="text-violet-300">杭州榕数科技</span>
              </div>
              <div className="mt-0.5 text-[10px] text-white/30">提供技术支持</div>
            </div>
            <p className="mb-4 text-xs leading-relaxed text-blue-300">
              专注 AI 安全与评测领域，依托顶尖学术资源，构建科学可信的评测生态。
            </p>
          </div>

          <div>
            <h4 className="mb-5 flex items-center gap-2 text-[1.05rem] font-bold text-white">
              <BarChart2 className="h-4 w-4 text-blue-400" />玄鉴·推荐服务
            </h4>
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
              {FOOTER_SERVICE_COLS.map((column) => (
                <div key={column.label}>
                  <div className="mb-4 text-sm font-bold tracking-wider" style={{ color: column.color }}>{column.label}</div>
                  <ul className="space-y-3">
                    {column.items.map((item) => (
                      <li key={item.name}>
                        <Link to={item.path} className="block text-sm leading-relaxed text-blue-300 transition-colors hover:text-white">
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="mb-5 flex items-center gap-2 text-sm font-semibold text-white">
              <BookOpen className="h-4 w-4 text-blue-400" />资源与支持
            </h4>
            <ul className="space-y-3">
              {FOOTER_RESOURCES.map((item) => (
                <li key={item.label}>
                  <Link to={item.path} className="group flex items-center gap-1.5 text-sm text-blue-300 transition-colors hover:text-white">
                    <span className="h-1 w-1 rounded-full bg-blue-600 transition-colors group-hover:bg-blue-400" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-5 flex items-center gap-2 text-sm font-semibold text-white">
              <Mail className="h-4 w-4 text-blue-400" />联系我们
            </h4>
            <ul className="mb-4 space-y-3">
              <li className="flex items-center gap-2 text-sm text-blue-300">
                <Phone className="h-3.5 w-3.5 shrink-0 text-blue-500" />
                <span>13940451397</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-blue-300">
                <Mail className="h-3.5 w-3.5 shrink-0 text-blue-500" />
                <span>contact@hzrongshu.cn</span>
              </li>
              <li className="flex items-start gap-2 text-xs leading-relaxed text-blue-300">
                <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-blue-500" />
                <span>杭州市滨江区长河街道聚才路239号火炬创新中心2号楼1314室</span>
              </li>
            </ul>
            <div className="inline-flex flex-col items-center gap-1.5 rounded-xl border border-white/10 bg-white/[.07] p-2">
              <div className="overflow-hidden rounded-lg bg-white p-1">
                <img src={qrCodeImg} alt="榕数科技微信" className="block h-[88px] w-[88px] object-contain" loading="lazy" decoding="async" />
              </div>
              <span className="text-[10px] text-white/45">扫码联系我们</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/[.08] pt-5">
          <div className="text-xs text-blue-400">
            Copyright © 2022–2026 玄鉴 AI安全平台（浙江大学滨江研究院 × 杭州榕数科技）. All Rights Reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
