import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import {
  ArrowLeft, ArrowRight, BookOpen, Bot, Check, ChevronDown,
  ChevronRight, Clock3, Code2, Database, ExternalLink, FileQuestion,
  FileText, GraduationCap, LifeBuoy, ListTree,
  Search, ShieldCheck,
} from 'lucide-react';
import { ProductHeroBackground } from '../components/ProductHeroBackground';

type DocKind = '产品概述' | '使用指南' | '常见问题';

interface ProductDocMeta {
  id: string;
  name: string;
  path: string;
  summary: string;
  audience: string;
  prepare: string[];
  workflow: string[];
  outputs: string[];
  supportsApi?: boolean;
  previewOnly?: boolean;
}

interface ProductGroup {
  id: string;
  name: string;
  tagline: string;
  color: string;
  soft: string;
  icon: React.ElementType;
  products: ProductDocMeta[];
}

interface DocSection {
  id: string;
  title: string;
  paragraphs?: string[];
  bullets?: string[];
  steps?: string[];
  note?: string;
}

interface DocArticle {
  id: string;
  productId: string;
  productName: string;
  productPath: string;
  groupId: string;
  groupName: string;
  kind: DocKind;
  title: string;
  summary: string;
  readTime: string;
  updated: string;
  sections: DocSection[];
}

const PRODUCT_GROUPS: ProductGroup[] = [
  {
    id: 'data',
    name: '数据侧',
    tagline: '数据合规审查、训练数据评测、多模态内容治理与标识追溯',
    color: '#7c3aed',
    soft: '#f5f3ff',
    icon: Database,
    products: [
      {
        id: 'privacy-review',
        name: '个人敏感信息审查',
        path: '/privacy-data-audit',
        summary: '识别文本、表格和图像中的个人敏感信息，辅助完成风险判断与脱敏处理。',
        audience: '需要开展隐私合规检查、数据出境前审查或业务文本脱敏的产品、法务与数据治理团队。',
        prepare: ['使用经过授权并完成必要脱敏的测试样本', '确认需要识别的敏感信息类型与业务规则', '明确检测结果的复核人与处置流程'],
        workflow: ['在产品页查看典型业务场景的效果预览', '进入在线体验并选择场景样例或输入自有文本', '登录后执行审查并查看命中字段、上下文与风险等级', '复核结果并按建议完成遮蔽、替换或删除'],
        outputs: ['敏感信息类型与命中位置', '风险等级和上下文说明', '脱敏预览与处置建议'],
        supportsApi: true,
      },
      {
        id: 'dataset-evaluation',
        name: '数据集安全评测',
        path: '/model-safety-eval',
        summary: '面向图像分类、目标检测和大模型文本数据，评测数据均衡性、异常样本、标注质量与后门风险。',
        audience: '需要在模型训练、测试或应用前检查数据质量与安全风险的算法、数据和模型治理团队。',
        prepare: ['确认数据来源、授权范围与使用目的', '明确图像分类、目标检测或大模型文本任务类型', '准备数据格式、字段映射、标签定义及train/val/test等数据划分说明', '按评测目标选择均衡性、异常样本、标注正确性、标注完整性或后门筛查方法'],
        workflow: ['提交数据集路径或已获授权的数据材料', '填写任务类型、数据格式、数据划分和评测方法', '系统自动解析数据并调用相应评测算法', '查看JSONL结果、异常样本信息和历史任务对比'],
        outputs: ['任务编号与评测方法', '详细检测结果与综合得分', '异常样本位置、原因和风险程度', 'JSONL结果及历史对比记录'],
      },
      {
        id: 'aigc-moderation',
        name: 'AIGC内容审核与鉴伪',
        path: '/aigc-content',
        summary: '覆盖文本、图像、音频和视频，对内容风险与AI生成特征进行统一检测。',
        audience: '需要治理生成式内容、审核用户上传内容或识别AI生成内容的平台运营与安全团队。',
        prepare: ['选择文本、图像、音频或视频模态', '确认使用内容审核还是AI鉴伪能力', '准备不包含真实敏感生产数据的体验样本'],
        workflow: ['在产品页查看四模态内容安全效果预览', '进入在线体验专区并选择内容安全', '选择模态、内容审核或AI鉴伪，并选用样本或上传文件', '登录后执行检测并查看标签、置信度和处置建议'],
        outputs: ['风险标签与置信度', 'AI生成概率与特征说明', '违规片段或关键帧定位', '审核与复核建议'],
        supportsApi: true,
      },
      {
        id: 'aigc-marking',
        name: 'AIGC内容标识与检测',
        path: '/aigc-content-marking',
        summary: '为文本、图像、音频和视频添加显式、隐式标识，并验证标准元数据结构与关键字段。',
        audience: '需要在AI内容生成、发布、流转和归档过程中落实标识责任的平台运营、安全合规与内容治理团队。',
        prepare: ['确认内容属于文本、图像、音频或视频中的哪一种模态', '了解显式标识和隐式元数据的作用与差异', '确认标识检测用于验证标识结构，而不是对无标识内容进行AI鉴伪'],
        workflow: ['进入产品介绍页并定位到“效果预览”', '切换“标识嵌入”或“标识检测”演示模式', '选择文本、图像、音频或视频内置样例', '查看标识配置、处理后示例、字段校验和检测结论'],
        outputs: ['显式标识效果示例', '隐式元数据字段示例', '标识结构完整性结论', '内容流转与审计归档流程说明'],
        previewOnly: true,
      },
    ],
  },
  {
    id: 'model',
    name: '模型侧',
    tagline: '覆盖可信、性能、安全及智能体行为的综合评测',
    color: '#2563eb',
    soft: '#eff6ff',
    icon: Bot,
    products: [
      {
        id: 'deep-model',
        name: '深度模型可信测评',
        path: '/deep-model-eval',
        summary: '从对抗攻击、后门攻击、性能、量化和逆向窃取五个算法维度评测深度模型。',
        audience: '需要验证视觉模型或大模型攻击安全、任务性能、量化效果及模型资产风险的研发和测试团队。',
        prepare: ['确认使用 PyTorch、TensorFlow、Keras 或 MindSpore 框架', '确定采用本地模型或 API 接入模型', '准备必要的模型文件、接口配置与代表性测试样本'],
        workflow: ['在产品页查看对抗攻击评测效果示例', '登录后创建任务并上传模型工程或说明 API 接入方式', '填写希望执行的评测算法与重点问题后提交', '在资源中心查看评测指标、异常记录和结果报告'],
        outputs: ['对抗与后门攻击结果', '模型性能指标', '量化前后对比结果', '逆向窃取风险记录'],
      },
      {
        id: 'embodied-intelligence',
        name: '具身智能可信评测',
        path: '/embodied-intelligence',
        summary: '面向真实物理交互，对感知、决策和执行链路进行安全与可靠性验证。',
        audience: '机器人、无人机、无人车等具身智能系统的研发、测试和安全管理团队。',
        prepare: ['明确设备形态、任务目标和运行环境', '梳理感知、决策、执行接口及安全边界', '准备典型场景、边界场景和故障注入方案'],
        workflow: ['预约评测并确认测试范围', '部署设备或接入仿真环境', '执行分层测试与真实场景验证', '汇总问题、复测结果与整改建议'],
        outputs: ['感知准确性与稳定性结果', '决策安全边界分析', '执行可靠性及故障恢复记录', '场景化评测报告'],
      },
      {
        id: 'agent-safety',
        name: '智能体安全评测',
        path: '/agent-safety',
        summary: '评估目标劫持、工具滥用、权限越界与多步任务执行风险。',
        audience: '正在建设或上线AI Agent、工作流智能体和自动化助手的产品及安全团队。',
        prepare: ['列出智能体可调用工具与权限', '定义允许和禁止的任务边界', '准备正常、越权及对抗性任务样本'],
        workflow: ['在产品页查看智能体攻击链效果预览', '登录后创建智能体评测任务并接入智能体', '填写业务场景与重点关注风险后提交', '在资源中心查看风险链路并收敛权限边界'],
        outputs: ['目标劫持与提示注入结果', '工具调用和越权记录', '长链任务稳定性评分', '权限治理建议'],
      },
      {
        id: 'llm-performance',
        name: '大模型性能评测',
        path: '/llm-evaluation',
        summary: '基于多类任务与基准数据，对大模型能力、效率和稳定性进行横向评估。',
        audience: '需要选型、验收或持续跟踪大语言模型综合能力的算法、采购与业务团队。',
        prepare: ['确定候选模型及接入方式', '选择与业务场景匹配的基准与测试集', '确认评分口径、成本和时延要求'],
        workflow: ['在产品页查看基准评测结果预览', '登录后创建性能评测任务并上传模型或填写接口', '填写评测需求并提交任务', '在资源中心查看能力对比与正式报告'],
        outputs: ['分维度能力评分', '模型横向对比', '时延与成本统计', '选型和优化建议'],
      },
      {
        id: 'llm-safety',
        name: '大模型安全评测',
        path: '/safety-evaluation',
        summary: '围绕内容安全、价值观、隐私泄露和提示攻击验证模型安全边界。',
        audience: '需要在大模型上线、备案或版本迭代前验证安全风险的模型研发与合规团队。',
        prepare: ['明确模型版本、服务范围和用户群体', '选择安全维度与测试强度', '准备业务特有风险词表和处置规则'],
        workflow: ['在产品页查看模型攻防效果预览', '登录后创建安全评测任务并接入模型', '填写重点风险与业务场景后提交任务', '在资源中心查看问题样本、风险等级及整改建议'],
        outputs: ['安全维度评分', '高风险问答样本', '攻击成功率与风险分布', '安全加固建议'],
      },
    ],
  },
  {
    id: 'system',
    name: '系统侧',
    tagline: '面向代码与网络边界的攻击验证和安全加固',
    color: '#0891b2',
    soft: '#ecfeff',
    icon: ShieldCheck,
    products: [
      {
        id: 'code-review',
        name: '代码漏洞审查',
        path: '/code-vulnerability-audit',
        summary: '结合静态分析与AI审计，定位漏洞代码、风险链路并提供修复建议。',
        audience: '需要在开发、测试或交付阶段开展代码安全审查的研发、安全和质量团队。',
        prepare: ['确认代码语言和扫描范围', '移除密钥、生产配置及无关敏感信息', '准备可复现的构建或依赖说明'],
        workflow: ['选择编程语言和示例代码', '粘贴代码或上传受支持文件', '运行扫描并查看漏洞等级与位置', '按修复建议修改并重新验证'],
        outputs: ['漏洞类型与风险等级', '问题代码行与调用链', '修复代码建议', '复测结果'],
        supportsApi: true,
      },
      {
        id: 'penetration-test',
        name: '网络渗透测试',
        path: '/penetration-test',
        summary: '通过授权测试验证网络、应用与接口的真实攻击面，并形成整改闭环。',
        audience: '需要验证互联网暴露面、业务系统与API安全性的企业安全和系统运维团队。',
        prepare: ['取得系统所有者的明确测试授权', '确认目标、时间窗口和禁止测试范围', '准备联系人与应急停止机制'],
        workflow: ['预约专家并完成范围确认', '开展信息收集、风险验证与人工复核', '交付漏洞清单和复现证据', '整改后进行复测并关闭风险'],
        outputs: ['攻击面与漏洞清单', '复现步骤和风险证据', '修复优先级建议', '复测与关闭说明'],
      },
    ],
  },
  {
    id: 'governance',
    name: '合规治理侧',
    tagline: '安全教育、备案辅助和可信标准建设服务',
    color: '#059669',
    soft: '#ecfdf5',
    icon: GraduationCap,
    products: [
      {
        id: 'ai-education',
        name: '人工智能安全教学平台',
        path: '/ai-safety-edu',
        summary: '以课程、实验和考核构成AI安全教学与组织能力建设闭环。',
        audience: '高校、科研机构以及需要开展AI安全培训和岗位能力建设的企业。',
        prepare: ['确认学习对象、培养目标与实施周期', '选择课程、实验和考核组合', '准备组织架构与学员信息'],
        workflow: ['申请试用或预约方案沟通', '配置课程和实验环境', '组织学习、实训与考核', '查看学习数据并持续优化培养方案'],
        outputs: ['课程与实验学习记录', '考核成绩及能力画像', '组织学习统计', '培训实施报告'],
      },
      {
        id: 'filing-service',
        name: '大模型备案服务',
        path: '/model-filing-service',
        summary: '围绕需求诊断、材料准备、安全评测和申报辅助提供全过程支持。',
        audience: '计划向公众提供生成式人工智能服务，并需要开展备案准备的企业与项目团队。',
        prepare: ['明确模型来源、服务范围和计划上线时间', '整理主体、模型、数据与安全管理材料', '指定业务、技术、法务和合规对接人'],
        workflow: ['预约专家完成差距诊断', '形成材料清单与推进计划', '开展安全评测和材料一致性复核', '配合申报、补正及后续维护'],
        outputs: ['差距分析与材料清单', '安全评测相关交付物', '申报材料辅助与复核记录', '持续合规建议'],
      },
      {
        id: 'standard-service',
        name: '可信安全标准制定服务',
        path: '/tianche-standard-service',
        summary: '为组织提供标准研究、对标分析、框架设计与规范文本编制技术支撑。',
        audience: '希望建设AI可信安全规范体系、沉淀标准文本或完善内部制度的组织。',
        prepare: ['明确标准对象、适用范围与建设目标', '梳理已有制度、技术能力和参考标准', '确定专家、业务和技术协同机制'],
        workflow: ['开展需求访谈和现状调研', '完成国内外标准对标与差距分析', '设计框架、起草条文并组织评审', '交付定稿文档，支持内部宣贯与后续修订'],
        outputs: ['标准对标研究', '标准框架及条款建议', '评审与修订记录', '实施与宣贯材料'],
      },
    ],
  },
];

function buildArticles(): DocArticle[] {
  return PRODUCT_GROUPS.flatMap(group =>
    group.products.flatMap(product => {
      const overview: DocArticle = {
        id: `${product.id}-overview`,
        productId: product.id,
        productName: product.name,
        productPath: product.path,
        groupId: group.id,
        groupName: group.name,
        kind: '产品概述',
        title: `${product.name}产品概述`,
        summary: product.summary,
        readTime: '4 分钟',
        updated: '2026-07-31',
        sections: [
          {
            id: 'positioning',
            title: '产品定位',
            paragraphs: [product.summary, `本能力主要面向${product.audience}`],
          },
          {
            id: 'scope',
            title: '能力与交付范围',
            bullets: product.outputs,
            note: '具体检测范围、指标口径和交付内容以实际版本及项目确认结果为准。',
          },
          {
            id: 'before-use',
            title: '使用前准备',
            bullets: product.prepare,
          },
          {
            id: 'next-step',
            title: '下一步',
            paragraphs: [product.previewOnly
              ? '本产品当前在玄鉴网站仅提供内置样例效果预览，不提供自有文件上传、在线处理、正式任务创建或产品专属专家预约。'
              : '首次了解建议先阅读使用指南；需要正式评测、批量数据处理或专家服务时，请前往产品页面确认服务方式。'],
          },
        ],
      };
      const guide: DocArticle = {
        id: `${product.id}-guide`,
        productId: product.id,
        productName: product.name,
        productPath: product.path,
        groupId: group.id,
        groupName: group.name,
        kind: '使用指南',
        title: `${product.name}使用指南`,
        summary: `了解${product.name}的准备工作、操作流程和结果查看方式。`,
        readTime: '6 分钟',
        updated: '2026-07-31',
        sections: [
          { id: 'preparation', title: '一、使用前准备', bullets: product.prepare },
          { id: 'workflow', title: '二、操作流程', steps: product.workflow },
          { id: 'results', title: '三、结果与交付物', bullets: product.outputs },
          {
            id: 'data-safety',
            title: '四、数据与安全注意事项',
            bullets: product.previewOnly ? [
              '效果预览仅使用页面内置固定样例，不接收、不上传也不保存用户自有内容。',
              '标识检测验证的是显式标识、隐式元数据与标准字段结构，不等同于AI内容真伪鉴定。',
              '文件编辑、压缩或平台转码可能移除元数据，内容流转环节应保留检测与复核机制。',
            ] : [
              '仅上传已获得合法授权且与测试目标相关的数据或模型。',
              '体验环境用于能力验证，不应上传生产密钥、真实个人信息或未脱敏核心数据。',
              '正式项目中的数据保存、删除、权限和交付方式应在开始前完成确认。',
            ],
          },
        ],
      };
      const faq: DocArticle = {
        id: `${product.id}-faq`,
        productId: product.id,
        productName: product.name,
        productPath: product.path,
        groupId: group.id,
        groupName: group.name,
        kind: '常见问题',
        title: `${product.name}常见问题`,
        summary: `汇总${product.name}在选择、准备、执行和结果解读中的常见问题。`,
        readTime: '5 分钟',
        updated: '2026-07-31',
        sections: [
          {
            id: 'experience-or-project',
            title: product.previewOnly ? '产品页是否可以处理自有文件？' : '在线体验可以替代正式任务或专业服务吗？',
            paragraphs: [product.previewOnly
              ? '不可以。本产品在玄鉴网站仅提供固定样例效果预览，不提供上传、在线执行、创建任务或产品专属专家预约入口。'
              : '不能。产品页效果预览用于理解能力，在线体验用于少量样本即时验证；需要批量数据、模型或工程文件上传、正式报告时应创建评测任务，需要实机、渗透、备案或标准服务时应预约专家。'],
          },
          {
            id: 'prepare',
            title: '开始前需要准备什么？',
            bullets: product.prepare,
          },
          {
            id: 'result',
            title: '结果应该如何使用？',
            paragraphs: [`建议结合业务规则和人工复核理解结果。主要输出包括：${product.outputs.join('、')}。`],
          },
          {
            id: 'support',
            title: '遇到问题如何获得支持？',
            paragraphs: ['请记录产品名称、操作步骤、发生时间与界面提示，通过页面右侧的在线咨询联系玄鉴顾问。请勿在咨询消息中直接发送生产密钥或未脱敏敏感数据。'],
          },
        ],
      };
      return [overview, guide, faq];
    }),
  );
}

const ARTICLES = buildArticles();

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function HelpLanding() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const keyword = query.trim().toLowerCase();

  const searchResults = useMemo(() => {
    if (!keyword) return [];
    return ARTICLES.filter(article =>
      `${article.title}${article.summary}${article.productName}${article.groupName}${article.kind}`
        .toLowerCase()
        .includes(keyword),
    );
  }, [keyword]);

  const openDoc = (id: string) => {
    window.scrollTo(0, 0);
    navigate(`/help-docs/${id}`);
  };

  return (
    <div className="min-h-screen bg-white">
      <section className="relative overflow-hidden border-b border-blue-100 bg-[#edf6fd]">
        <ProductHeroBackground side="data" concept="help" />
        <div className="relative z-10 mx-auto max-w-[83%] px-6 py-12 text-center md:py-14">
          <div className="mb-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[.18em] text-blue-600">
            <BookOpen className="h-4 w-4" /> Xuanjian Help Center
          </div>
          <h1 className="text-4xl font-black tracking-[-.035em] text-slate-950 md:text-5xl">帮助文档</h1>
          <p className="mx-auto mt-3 max-w-2xl text-base leading-8 text-slate-600">
            从产品体验、专业评测到开发接入，快速找到所需说明
          </p>
          <label className="mx-auto mt-6 flex h-13 max-w-2xl items-center gap-3 rounded-lg border border-blue-100 bg-white/95 px-5 text-left shadow-[0_10px_30px_rgba(47,111,160,.12)]">
            <Search className="h-5 w-5 shrink-0 text-blue-600" />
            <input
              value={query}
              onChange={event => setQuery(event.target.value)}
              placeholder="搜索产品、操作指南、常见问题……"
              className="h-full min-w-0 flex-1 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
              aria-label="搜索帮助文档"
            />
            {query && (
              <button onClick={() => setQuery('')} className="text-xs font-semibold text-slate-400 hover:text-slate-700">
                清除
              </button>
            )}
          </label>
          {!keyword && (
            <div className="mt-5 flex flex-wrap justify-center gap-5">
              {PRODUCT_GROUPS.map(group => (
                <button
                  key={group.id}
                  onClick={() => scrollToId(`help-group-${group.id}`)}
                  className="border-b-2 border-transparent px-1 py-1 text-sm font-semibold text-slate-600 transition hover:border-blue-600 hover:text-blue-700"
                >
                  {group.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {keyword ? (
        <section className="mx-auto max-w-[83%] px-6 py-12">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <div className="text-sm font-semibold text-blue-600">搜索结果</div>
              <h2 className="mt-1 text-2xl font-black text-slate-950">“{query}”相关文档</h2>
            </div>
            <span className="text-sm text-slate-400">{searchResults.length} 篇</span>
          </div>
          {searchResults.length ? (
            <div className="grid gap-4 md:grid-cols-2">
              {searchResults.map(article => (
                <button
                  key={article.id}
                  onClick={() => openDoc(article.id)}
                  className="group rounded-2xl border border-slate-200 bg-white p-5 text-left transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-lg"
                >
                  <div className="text-xs font-bold text-blue-600">{article.groupName} · {article.productName} · {article.kind}</div>
                  <div className="mt-2 flex items-start justify-between gap-3">
                    <h3 className="font-bold text-slate-900 group-hover:text-blue-700">{article.title}</h3>
                    <ChevronRight className="h-5 w-5 shrink-0 text-slate-300 group-hover:text-blue-500" />
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-500">{article.summary}</p>
                </button>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 py-16 text-center">
              <FileQuestion className="mx-auto h-9 w-9 text-slate-300" />
              <div className="mt-3 font-semibold text-slate-700">暂未找到相关文档</div>
              <button onClick={() => setQuery('')} className="mt-3 text-sm font-bold text-blue-600">返回文档目录</button>
            </div>
          )}
        </section>
      ) : (
        <>
          <main className="mx-auto max-w-[83%] px-6 py-11">
            <div className="space-y-12">
              {PRODUCT_GROUPS.map(group => {
                return (
                  <section key={group.id} id={`help-group-${group.id}`} className="scroll-mt-32">
                    <div className="mb-5 flex items-center gap-3">
                      <span className="h-7 w-1" style={{ background: group.color }} />
                      <h2 className="text-2xl font-medium text-slate-900">{group.name}</h2>
                    </div>
                    <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(250px,1fr))' }}>
                      {group.products.map(product => (
                        <article
                          key={product.id}
                          className="group flex min-h-[142px] items-start gap-5 border border-slate-200 bg-white px-7 py-6 transition hover:border-blue-300"
                        >
                          <span className="grid h-12 w-12 shrink-0 place-items-center text-blue-200 transition group-hover:text-blue-400">
                            <FileText className="h-10 w-10" strokeWidth={1.35} />
                          </span>
                          <div className="min-w-0 flex-1">
                            <button
                              onClick={() => navigate(product.path)}
                              className="text-left text-base font-medium text-slate-900 hover:text-blue-700"
                            >
                              {product.name}
                            </button>
                            <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2">
                              {(['产品概述', '使用指南', '常见问题'] as DocKind[]).map(kind => {
                                const suffix = kind === '产品概述' ? 'overview' : kind === '使用指南' ? 'guide' : 'faq';
                                return (
                                  <button
                                    key={kind}
                                    onClick={() => openDoc(`${product.id}-${suffix}`)}
                                    className="flex items-center gap-1.5 whitespace-nowrap text-left text-xs text-slate-600 hover:text-blue-600"
                                  >
                                    <span className="text-[9px] text-slate-400">•</span>{kind}
                                  </button>
                                );
                              })}
                              {product.supportsApi && (
                                <button onClick={() => navigate('/developer')} className="flex items-center gap-1.5 whitespace-nowrap text-left text-xs text-slate-600 hover:text-blue-600">
                                  <span className="text-[9px] text-slate-400">•</span>开发接入
                                </button>
                              )}
                            </div>
                          </div>
                        </article>
                      ))}
                    </div>
                  </section>
                );
              })}
            </div>
          </main>
        </>
      )}
    </div>
  );
}

function ArticleReader({ article }: { article: DocArticle }) {
  const navigate = useNavigate();
  const group = PRODUCT_GROUPS.find(item => item.id === article.groupId)!;
  const currentIndex = ARTICLES.findIndex(item => item.id === article.id);
  const previous = currentIndex > 0 ? ARTICLES[currentIndex - 1] : undefined;
  const next = currentIndex < ARTICLES.length - 1 ? ARTICLES[currentIndex + 1] : undefined;
  const [helpful, setHelpful] = useState<'yes' | 'no' | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [article.id]);

  const productArticles = (productId: string) => ARTICLES.filter(item => item.productId === productId);

  return (
    <div className="min-h-screen bg-white">
      <div className="border-b border-slate-200 bg-slate-50/80">
        <div className="mx-auto flex max-w-[1480px] items-center gap-2 px-6 py-3 text-sm text-slate-500">
          <button onClick={() => navigate('/help-docs')} className="font-semibold text-blue-600 hover:text-blue-800">帮助文档</button>
          <ChevronRight className="h-4 w-4 text-slate-300" />
          <span>{article.groupName}</span>
          <ChevronRight className="h-4 w-4 text-slate-300" />
          <span>{article.productName}</span>
          <ChevronRight className="hidden h-4 w-4 text-slate-300 sm:block" />
          <span className="hidden truncate font-medium text-slate-800 sm:block">{article.kind}</span>
        </div>
      </div>

      <div className="mx-auto grid max-w-[1480px] xl:grid-cols-[270px_minmax(0,820px)_230px]">
        <aside className="hidden border-r border-slate-200 bg-slate-50/45 px-5 py-8 xl:block">
          <div className="sticky top-[140px] max-h-[calc(100vh-164px)] overflow-y-auto pr-1">
            <div className="mb-4 flex items-center gap-2 px-2 text-xs font-black uppercase tracking-[.15em] text-slate-400">
              <ListTree className="h-4 w-4" /> 文档目录
            </div>
            <nav className="space-y-2">
              {PRODUCT_GROUPS.map(productGroup => (
                <details key={productGroup.id} open={productGroup.id === article.groupId} className="group">
                  <summary className="flex cursor-pointer list-none items-center justify-between rounded-lg px-2 py-2 text-sm font-bold text-slate-800 hover:bg-white">
                    <span>{productGroup.name}</span>
                    <ChevronDown className="h-4 w-4 text-slate-400 transition group-open:rotate-180" />
                  </summary>
                  <div className="ml-2 border-l border-slate-200 pl-2">
                    {productGroup.products.map(product => (
                      <details key={product.id} open={product.id === article.productId} className="group/product">
                        <summary className="flex cursor-pointer list-none items-center justify-between rounded-lg px-2 py-2 text-[13px] font-semibold text-slate-600 hover:bg-white hover:text-slate-950">
                          <span>{product.name}</span>
                          <ChevronRight className="h-3.5 w-3.5 text-slate-300 transition group-open/product:rotate-90" />
                        </summary>
                        <div className="space-y-0.5 pb-2 pl-2">
                          {productArticles(product.id).map(doc => (
                            <button
                              key={doc.id}
                              onClick={() => navigate(`/help-docs/${doc.id}`)}
                              className={`block w-full rounded-lg px-3 py-2 text-left text-xs transition ${
                                doc.id === article.id
                                  ? 'bg-blue-50 font-bold text-blue-700'
                                  : 'text-slate-500 hover:bg-white hover:text-slate-900'
                              }`}
                            >
                              {doc.kind}
                            </button>
                          ))}
                        </div>
                      </details>
                    ))}
                  </div>
                </details>
              ))}
            </nav>
            <button
              onClick={() => navigate('/developer')}
              className="mt-5 flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 hover:border-blue-300 hover:text-blue-700"
            >
              开发者中心<ExternalLink className="h-4 w-4" />
            </button>
          </div>
        </aside>

        <main className="min-w-0 px-6 py-10 md:px-10 xl:px-12">
          <button onClick={() => navigate('/help-docs')} className="mb-7 inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-800">
            <ArrowLeft className="h-4 w-4" />返回文档首页
          </button>

          <header className="border-b border-slate-200 pb-8">
            <span
              className="inline-flex rounded-full px-3 py-1 text-xs font-bold"
              style={{ background: group.soft, color: group.color }}
            >
              {article.groupName} · {article.productName} · {article.kind}
            </span>
            <h1 className="mt-5 text-3xl font-black tracking-[-.035em] text-slate-950 md:text-4xl">{article.title}</h1>
            <p className="mt-4 text-base leading-8 text-slate-600">{article.summary}</p>
            <div className="mt-5 flex flex-wrap items-center gap-5 text-xs text-slate-400">
              <span className="flex items-center gap-1.5"><Clock3 className="h-3.5 w-3.5" />阅读约 {article.readTime}</span>
              <span>更新于 {article.updated}</span>
            </div>
          </header>

          <article className="py-3">
            {article.sections.map(section => (
              <section key={section.id} id={section.id} className="scroll-mt-36 border-b border-slate-100 py-9 last:border-0">
                <h2 className="text-xl font-black text-slate-950 md:text-2xl">{section.title}</h2>
                {section.paragraphs?.map(paragraph => (
                  <p key={paragraph} className="mt-4 text-[15px] leading-8 text-slate-600">{paragraph}</p>
                ))}
                {section.bullets && (
                  <ul className="mt-5 space-y-3">
                    {section.bullets.map(item => (
                      <li key={item} className="flex gap-3 text-[15px] leading-7 text-slate-600">
                        <span className="mt-1.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-blue-50 text-blue-600">
                          <Check className="h-3 w-3" />
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {section.steps && (
                  <ol className="mt-6 space-y-4">
                    {section.steps.map((item, index) => (
                      <li key={item} className="flex gap-4 rounded-xl border border-slate-200 bg-slate-50/60 p-4 text-[15px] leading-7 text-slate-600">
                        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-blue-600 text-sm font-black text-white">{index + 1}</span>
                        <span className="pt-0.5">{item}</span>
                      </li>
                    ))}
                  </ol>
                )}
                {section.note && (
                  <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900">
                    <strong>说明：</strong>{section.note}
                  </div>
                )}
              </section>
            ))}
          </article>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:flex sm:items-center sm:justify-between">
            <div>
              <div className="font-bold text-slate-900">需要进入产品继续操作？</div>
              <div className="mt-1 text-sm text-slate-500">前往{article.productName}页面查看能力详情和可用操作。</div>
            </div>
            <button
              onClick={() => navigate(article.productPath)}
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-700 sm:mt-0"
            >
              前往产品页面<ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-10 grid gap-3 sm:grid-cols-2">
            {previous ? (
              <button onClick={() => navigate(`/help-docs/${previous.id}`)} className="rounded-xl border border-slate-200 p-4 text-left hover:border-blue-300 hover:bg-blue-50/40">
                <span className="text-xs text-slate-400">上一篇</span>
                <span className="mt-1 block text-sm font-bold text-slate-800">{previous.title}</span>
              </button>
            ) : <div />}
            {next && (
              <button onClick={() => navigate(`/help-docs/${next.id}`)} className="rounded-xl border border-slate-200 p-4 text-right hover:border-blue-300 hover:bg-blue-50/40">
                <span className="text-xs text-slate-400">下一篇</span>
                <span className="mt-1 block text-sm font-bold text-slate-800">{next.title}</span>
              </button>
            )}
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3 border-t border-slate-100 pt-8 text-sm text-slate-500">
            <span>这篇文档是否解决了您的问题？</span>
            <button
              onClick={() => setHelpful('yes')}
              className={`rounded-full border px-4 py-2 font-semibold ${helpful === 'yes' ? 'border-emerald-300 bg-emerald-50 text-emerald-700' : 'border-slate-200 bg-white text-slate-600'}`}
            >
              已解决
            </button>
            <button
              onClick={() => setHelpful('no')}
              className={`rounded-full border px-4 py-2 font-semibold ${helpful === 'no' ? 'border-amber-300 bg-amber-50 text-amber-700' : 'border-slate-200 bg-white text-slate-600'}`}
            >
              仍需帮助
            </button>
          </div>
        </main>

        <aside className="hidden border-l border-slate-100 px-6 py-10 xl:block">
          <div className="sticky top-[140px]">
            <div className="mb-4 text-xs font-black uppercase tracking-[.14em] text-slate-400">本文目录</div>
            <nav className="space-y-1 border-l border-slate-200 pl-3">
              {article.sections.map(section => (
                <button
                  key={section.id}
                  onClick={() => scrollToId(section.id)}
                  className="block w-full rounded-lg px-2 py-2 text-left text-[13px] leading-5 text-slate-500 hover:bg-blue-50 hover:text-blue-700"
                >
                  {section.title}
                </button>
              ))}
            </nav>
            <div className="mt-7 rounded-2xl bg-[#0d2344] p-5 text-white">
              <LifeBuoy className="h-5 w-5 text-cyan-300" />
              <h3 className="mt-3 font-bold">没有找到答案？</h3>
              <p className="mt-2 text-xs leading-5 text-slate-300">使用页面右侧的在线咨询，联系玄鉴顾问获得支持。</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

export function HelpDocs() {
  const { articleId } = useParams<{ articleId?: string }>();
  const navigate = useNavigate();
  const article = articleId ? ARTICLES.find(item => item.id === articleId) : undefined;

  useEffect(() => {
    if (articleId && !article) navigate('/help-docs', { replace: true });
  }, [article, articleId, navigate]);

  if (articleId && article) return <ArticleReader article={article} />;
  return <HelpLanding />;
}
