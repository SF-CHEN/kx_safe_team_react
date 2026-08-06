export const KNOWLEDGE_CATEGORIES = ['白皮书', '实践指南', '合规报告', '研究文章'] as const;
export const HOME_KNOWLEDGE_TABS = ['实践指南', '合规报告', '研究文章'] as const;

export type KnowledgeCategory = typeof KNOWLEDGE_CATEGORIES[number];

export interface KnowledgeResource {
  id: string;
  title: string;
  desc: string;
  date: string;
  color: string;
}

export const KNOWLEDGE_RESOURCES: Record<KnowledgeCategory, KnowledgeResource[]> = {
  白皮书: [
    { id: 'model-security-2025', title: '《AI大模型安全评测白皮书 2025》', desc: '系统梳理大模型安全风险分类与全维度评测方法体系', date: '2025年3月', color: '#2563eb' },
    { id: 'application-security', title: '《AI应用安全风险防控白皮书》', desc: 'AI系统安全测试与漏洞防护最佳实践，全链路安全指引', date: '2024年12月', color: '#7c3aed' },
    { id: 'model-compliance', title: '《大模型合规治理白皮书》', desc: '国内外AI法规解读与企业合规路径规划指南', date: '2024年9月', color: '#059669' },
  ],
  实践指南: [
    { id: 'filing-practice', title: '《大模型备案合规实践手册》', desc: '备案全流程详解及材料准备指引，助力企业合规落地', date: '2025年1月', color: '#059669' },
    { id: 'evaluation-dataset', title: '《AI安全评测数据集构建指南》', desc: '评测数据集设计、标注规范与质量管控最佳实践', date: '2024年10月', color: '#0891b2' },
    { id: 'enterprise-governance', title: '《企业AI治理框架落地指引》', desc: '适用于大型企业的AI治理体系建设与运营指南', date: '2024年8月', color: '#b45309' },
  ],
  合规报告: [
    { id: 'policy-2025', title: '《2025年中国AI监管政策解读报告》', desc: '梳理最新AI相关法规政策，解析合规要点与企业应对策略', date: '2025年2月', color: '#dc2626' },
    { id: 'filing-review-standard', title: '《大模型备案审查标准解析》', desc: '深度解读大模型备案要求与审核重点', date: '2024年11月', color: '#d97706' },
    { id: 'ai-ethics', title: '《AI伦理与社会责任评估框架》', desc: '结合 IEEE 与国家标准的 AI 伦理评估方法与实践案例', date: '2024年7月', color: '#7c3aed' },
  ],
  研究文章: [
    { id: 'hallucination-review', title: '《大模型幻觉检测方法综述》', desc: '系统梳理大语言模型幻觉现象的检测方法与评测基准', date: '2025年4月', color: '#8b5cf6' },
    { id: 'multimodal-progress', title: '《多模态大模型安全评测进展》', desc: '图文音视频多模态模型的安全风险与评测挑战分析', date: '2025年1月', color: '#0284c7' },
    { id: 'agent-trust', title: '《智能体任务可信度量化评估》', desc: 'Agent 系统任务执行可信性的评测指标与方法框架', date: '2024年11月', color: '#10b981' },
  ],
};

export function buildKnowledgeUrl(category: KnowledgeCategory, resourceId: string) {
  return `/resource-center?view=knowledge&category=${encodeURIComponent(category)}&resource=${encodeURIComponent(resourceId)}#knowledge-library`;
}
