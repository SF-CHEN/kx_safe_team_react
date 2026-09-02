export const KNOWLEDGE_CATEGORIES = ['白皮书', '实践指南', '合规报告', '研究文章'] as const;
export const HOME_KNOWLEDGE_TABS = ['实践指南', '合规报告', '研究文章'] as const;

export type KnowledgeCategory = typeof KNOWLEDGE_CATEGORIES[number];

export interface KnowledgeResource {
  id: string;
  title: string;
  desc: string;
  date: string;
  color: string;
  fileUrl?: string;
  downloadName?: string;
}

export const KNOWLEDGE_RESOURCES: Record<KnowledgeCategory, KnowledgeResource[]> = {
  白皮书: [
    {
      id: 'ai-security-risk-assessment',
      title: '《人工智能安全风险测评》',
      desc: '聚焦人工智能系统安全风险识别、分析与测评方法',
      date: '公开资料',
      color: '#2563eb',
      fileUrl: '/whitepapers/ai-security-risk-assessment.pdf',
      downloadName: '人工智能安全风险测评.pdf',
    },
    {
      id: 'ai-security-governance',
      title: '《人工智能安全治理白皮书》',
      desc: '梳理人工智能安全治理框架、关键议题与实践路径',
      date: '公开资料',
      color: '#7c3aed',
      fileUrl: '/whitepapers/ai-security-governance-whitepaper.pdf',
      downloadName: '人工智能安全治理白皮书.pdf',
    },
    {
      id: 'generative-ai-training-data-security',
      title: '《网络安全技术 生成式人工智能预训练和优化训练数据安全规范》',
      desc: '明确生成式人工智能预训练与优化训练数据的安全要求',
      date: '公开资料',
      color: '#059669',
      fileUrl: '/whitepapers/generative-ai-training-data-security-specification.pdf',
      downloadName: '网络安全技术 生成式人工智能预训练和优化训练数据安全规范.pdf',
    },
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
