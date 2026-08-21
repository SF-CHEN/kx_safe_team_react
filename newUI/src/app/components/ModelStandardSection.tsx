import React from 'react';
import { Download, Eye, FileCheck2, FileText, Info, ShieldCheck } from 'lucide-react';

type StandardPoint = {
  eyebrow: string;
  title: string;
  description: string;
};

type ModelStandardSectionProps = {
  id: string;
  code: string;
  title: string;
  meta: string;
  pdfHref: string;
  points: StandardPoint[];
  note: string;
  coverImage?: string;
};

const pointIcons = [Eye, FileText, FileCheck2];

export function ModelStandardSection({ id, code, title, meta, pdfHref, points, note, coverImage }: ModelStandardSectionProps) {
  return (
    <section id={id} style={{ background: '#f5f7fa', padding: '80px 0', borderTop: '1px solid #e2e8f0' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 clamp(20px, 4vw, 48px)' }}>
        <div style={{ textAlign: 'center', marginBottom: 44 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '5px 12px', borderRadius: 999, background: '#eff6ff', border: '1px solid #bfdbfe', color: '#2563eb', fontSize: 12, fontWeight: 800, marginBottom: 12 }}>
            <ShieldCheck size={14} /> 标准依据
          </div>
          <h2 style={{ margin: '0 0 12px', fontSize: 32, fontWeight: 900, color: '#0f172a' }}>评测设计有据可循</h2>
          <p style={{ margin: 0, color: '#64748b', fontSize: 15 }}>展示与产品能力直接相关的标准原文及页面能力映射</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(300px,0.85fr)_minmax(0,1.15fr)]" style={{ gap: 28, alignItems: 'stretch' }}>
          <div style={{ background: '#fff', border: '1px solid #dbe5f1', borderRadius: 20, padding: 28, boxShadow: '0 12px 32px rgba(15,23,42,0.06)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ color: '#3b82f6', fontSize: 13, fontWeight: 900, letterSpacing: '0.03em', marginBottom: 16 }}>{code}</div>
            <h3 style={{ margin: '0 0 18px', fontSize: 24, lineHeight: 1.45, fontWeight: 900, color: '#0f172a' }}>{title}</h3>
            <p style={{ margin: '0 0 16px', fontSize: 13, color: '#64748b', lineHeight: 1.7 }}>{meta}</p>
            {coverImage && <div style={{ height: 250, margin: '0 -2px 18px', borderRadius: 12, overflow: 'hidden', background: '#fff', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><img src={coverImage} alt={`${title}封面`} style={{ display: 'block', width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'center' }} /></div>}
            <a href={pdfHref} download style={{ marginTop: 'auto', height: 46, borderRadius: 11, background: 'linear-gradient(135deg,#1677ff,#2563eb)', color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontSize: 14, fontWeight: 800, textDecoration: 'none', boxShadow: '0 8px 18px rgba(37,99,235,0.2)' }}>
              <Download size={16} /> 下载标准原文 PDF
            </a>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {points.map((point, index) => {
              const Icon = pointIcons[index % pointIcons.length];
              return (
                <div key={point.title} style={{ flex: 1, display: 'flex', gap: 16, alignItems: 'flex-start', background: '#fff', border: '1px solid #dbe5f1', borderRadius: 18, padding: '20px 22px', boxShadow: '0 8px 22px rgba(15,23,42,0.04)' }}>
                  <div style={{ width: 44, height: 44, borderRadius: 13, background: '#eaf4ff', color: '#1684ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Icon size={20} /></div>
                  <div>
                    <div style={{ color: '#1684ff', fontSize: 12, fontWeight: 900, marginBottom: 5 }}>{point.eyebrow}</div>
                    <div style={{ color: '#0f172a', fontSize: 17, fontWeight: 900, marginBottom: 6 }}>{point.title}</div>
                    <div style={{ color: '#64748b', fontSize: 13, lineHeight: 1.7 }}>{point.description}</div>
                  </div>
                </div>
              );
            })}
            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '15px 18px', borderRadius: 14, background: '#fff8e8', border: '1px solid #fde0a6', color: '#8a5a00', fontSize: 12.5, lineHeight: 1.65 }}>
              <Info size={17} style={{ flexShrink: 0, marginTop: 2 }} /> {note}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
