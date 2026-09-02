import React, { useState } from 'react';
import { Badge } from '../components/ui/badge';
import {
  RadarChart, PolarGrid, PolarAngleAxis,
  Radar, ResponsiveContainer, Tooltip, Legend
} from 'recharts';

const LLM_DATA = [
  { rank: 1, name: 'ChatGLM4-9B', org: '智谱AI', type: '开源', total: 65.46, safety: 29.94, content: 74.31, privacy: 60.73, bias: 96.84 },
  { rank: 2, name: 'LLaMA-2-13B-Chat', org: 'Meta', type: '开源', total: 64.29, safety: 30.85, content: 84.62, privacy: 45.43, bias: 96.25 },
  { rank: 3, name: 'Qwen2.5-7B-Instruct', org: '阿里巴巴', type: '开源', total: 64.14, safety: 33.79, content: 69.07, privacy: 56.49, bias: 97.19 },
  { rank: 4, name: 'ChatGPT-3.5-turbo', org: 'OpenAI', type: '闭源', total: 63.66, safety: 30.47, content: 69.18, privacy: 58.01, bias: 96.99 },
  { rank: 5, name: 'DeepSeek V3', org: '深度求索', type: '闭源', total: 62.49, safety: 40.84, content: 77.48, privacy: 49.43, bias: 82.22 },
  { rank: 6, name: 'Baichuan2-13B', org: '百川智能', type: '开源', total: 61.83, safety: 28.21, content: 72.14, privacy: 55.32, bias: 91.65 },
  { rank: 7, name: 'Yi-34B-Chat', org: '零一万物', type: '开源', total: 60.97, safety: 27.56, content: 71.23, privacy: 53.88, bias: 91.21 },
];

const MULTI_DATA = [
  { rank: 1, name: 'Qwen2.5-VL-72B', org: '阿里巴巴', type: '开源', total: 72.34, safety: 68.21, content: 78.45, privacy: 71.22, bias: 71.48 },
  { rank: 2, name: 'InternVL2-26B', org: '上海AI实验室', type: '开源', total: 70.18, safety: 65.44, content: 76.32, privacy: 69.11, bias: 69.85 },
  { rank: 3, name: 'GPT-4V', org: 'OpenAI', type: '闭源', total: 69.87, safety: 64.92, content: 75.11, privacy: 68.43, bias: 71.02 },
  { rank: 4, name: 'LLaVA-1.6-34B', org: 'LLaVA', type: '开源', total: 67.21, safety: 62.11, content: 73.44, privacy: 65.28, bias: 68.01 },
  { rank: 5, name: 'CogVLM2-19B', org: '清华大学', type: '开源', total: 65.44, safety: 60.32, content: 71.22, privacy: 63.15, bias: 67.07 },
];

const TOP3_COLORS = [
  'from-purple-400 to-blue-500',
  'from-amber-400 to-orange-500',
  'from-emerald-400 to-teal-500',
];
const TOP3_BG = [
  'bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200',
  'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200',
  'bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200',
];

export function Leaderboard() {
  const [activeTab, setActiveTab] = useState<'llm' | 'multi'>('llm');
  const [showRadar, setShowRadar] = useState(false);
  const data = activeTab === 'llm' ? LLM_DATA : MULTI_DATA;
  const top3 = data.slice(0, 3);
  const rest = data.slice(3);

  const radarData = [
    { subject: '内生安全', A: data[0]?.safety ?? 60, B: data[1]?.safety ?? 55, C: data[2]?.safety ?? 58, fullMark: 100 },
    { subject: '内容合规', A: data[0]?.content ?? 75, B: data[1]?.content ?? 80, C: data[2]?.content ?? 70, fullMark: 100 },
    { subject: '隐私保护', A: data[0]?.privacy ?? 65, B: data[1]?.privacy ?? 52, C: data[2]?.privacy ?? 60, fullMark: 100 },
    { subject: '偏见检测', A: data[0]?.bias ?? 88, B: data[1]?.bias ?? 85, C: data[2]?.bias ?? 90, fullMark: 100 },
    { subject: '综合得分', A: data[0]?.total ?? 65, B: data[1]?.total ?? 64, C: data[2]?.total ?? 63, fullMark: 100 },
  ];

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 overflow-hidden">
      <div className="absolute inset-0 bg-dot-grid opacity-60" />
      <div className="relative max-w-5xl mx-auto px-4 py-8">

        {/* Title */}
        <div className="text-center mb-8">
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }} className="text-gray-800 mb-2">模型安全评测排行榜</h1>
          <div className="h-1 w-14 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 mx-auto" />
        </div>

        {/* Tab Toggle */}
        <div className="flex justify-center mb-6">
          <div className="bg-white rounded-full p-1 flex gap-1 shadow-sm border border-gray-100">
            <button
              onClick={() => setActiveTab('llm')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                activeTab === 'llm' ? 'bg-blue-600 text-white shadow' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              大语言模型总榜
            </button>
            <button
              onClick={() => setActiveTab('multi')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                activeTab === 'multi' ? 'bg-blue-600 text-white shadow' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              多模态模型总榜
            </button>
          </div>
        </div>

        {/* Top 3 Podium */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {top3.map((item, i) => (
            <div key={item.name} className={`glass-glow border-2 rounded-2xl p-5 text-center ${TOP3_BG[i]}`}>
              <div className={`inline-flex w-10 h-10 rounded-full bg-gradient-to-br ${TOP3_COLORS[i]} text-white font-bold text-lg items-center justify-center mx-auto mb-3`}>
                {i + 1}
              </div>
              <div className="w-12 h-12 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center mx-auto mb-2 text-lg font-bold text-blue-600">
                {item.name.charAt(0)}
              </div>
              <div className="font-bold text-gray-800 text-sm">{item.name}</div>
              <div className="text-xs text-gray-500 mt-0.5">{item.org}</div>
              <div className="mt-3">
                <span className="text-2xl font-bold text-gray-800">{item.total}</span>
                <span className="text-xs text-gray-400 ml-1">分</span>
              </div>
              <Badge className={`mt-2 text-[10px] ${item.type === '开源' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                {item.type}
              </Badge>
            </div>
          ))}
        </div>

        {/* Radar Chart toggle button */}
        <div className="flex justify-end mb-3">
          <button
            onClick={() => setShowRadar(!showRadar)}
            className="flex items-center gap-1.5 text-sm text-blue-600 font-medium hover:underline"
          >
            {showRadar ? '▲ 收起' : '▼ 查看'} Top3 能力雷达图
          </button>
        </div>

        {/* Radar Chart */}
        {showRadar && (
          <div className="glass-glow rounded-2xl p-6 mb-6">
            <div className="text-center mb-3">
              <span className="text-sm font-semibold text-gray-700">Top 3 模型安全能力雷达对比</span>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <RadarChart data={radarData} margin={{ top: 8, right: 24, bottom: 8, left: 24 }}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: '#64748b' }} />
                <Radar name={data[0]?.name} dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} strokeWidth={2} />
                <Radar name={data[1]?.name} dataKey="B" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.15} strokeWidth={2} />
                <Radar name={data[2]?.name} dataKey="C" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.15} strokeWidth={2} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e2e8f0' }} />
                <Legend iconSize={8} wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Rankings 4-5 Preview */}
        {rest.slice(0, 2).map(item => (
          <div key={item.name} className="glass-glow rounded-xl p-4 mb-3 flex items-center gap-4">
            <span className="text-gray-400 font-bold w-6">{item.rank}</span>
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center font-bold text-blue-600">
              {item.name.charAt(0)}
            </div>
            <div>
              <div className="font-semibold text-sm text-gray-800">{item.name}</div>
              <div className="text-xs text-gray-500">{item.org}</div>
            </div>
            <Badge className={`ml-2 text-[10px] ${item.type === '开源' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-gray-100 text-gray-600 border-gray-200'}`}>
              {item.type}
            </Badge>
            <div className="ml-auto font-bold text-xl text-blue-600">{item.total}</div>
          </div>
        ))}

        {/* Full Table */}
        <div className="glass-glow rounded-2xl overflow-hidden mt-6">
          <div className="grid grid-cols-8 px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-b text-xs font-semibold text-gray-600">
            <span>排名</span>
            <span className="col-span-2">模型名称</span>
            <span>来源</span>
            <span className="text-center">总分</span>
            <span className="text-center">内生安全</span>
            <span className="text-center">生成内容</span>
            <span className="text-center">隐私安全</span>
          </div>
          {data.map(item => (
            <div
              key={item.rank}
              className={`grid grid-cols-8 px-4 py-3 border-b border-gray-50 last:border-0 text-sm items-center hover:bg-blue-50/40 cursor-pointer transition-colors ${item.rank % 2 === 0 ? 'bg-gray-50/40' : 'bg-white'}`}
            >
              <span className={`font-bold ${item.rank <= 3 ? 'text-blue-600' : 'text-gray-500'}`}>{item.rank}</span>
              <span className="col-span-2 text-blue-700 font-semibold">{item.name}</span>
              <span className="text-gray-500 text-xs">{item.org}</span>
              <span className="text-center font-bold text-blue-600">{item.total}</span>
              <span className="text-center text-gray-600 text-xs">{item.safety}</span>
              <span className="text-center text-gray-600 text-xs">{item.content}</span>
              <span className="text-center text-gray-600 text-xs">{item.privacy}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
