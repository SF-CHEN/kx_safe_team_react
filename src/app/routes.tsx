import React, { Suspense, lazy, type ComponentType } from 'react';
import { createHashRouter, Outlet } from 'react-router';
import { Layout } from './components/Layout';
import { ScrollToTop } from './components/ScrollToTop';

function lazyPage(
  loader: () => Promise<{ [key: string]: ComponentType }>,
  exportName: string,
) {
  return lazy(async () => {
    const mod = await loader();
    return { default: mod[exportName] as ComponentType };
  });
}

const CompanyHome = lazyPage(() => import('./pages/CompanyHome'), 'CompanyHome');
const Home = lazyPage(() => import('./pages/Home'), 'Home');
const Leaderboard = lazyPage(() => import('./pages/Leaderboard'), 'Leaderboard');
const EvaluationIntro = lazyPage(() => import('./pages/EvaluationIntro'), 'EvaluationIntro');
const LLMEvaluation = lazyPage(() => import('./pages/LLMEvaluation'), 'LLMEvaluation');
const SafetyEvaluation = lazyPage(() => import('./pages/SafetyEvaluation'), 'SafetyEvaluation');
const ResourceCenter = lazyPage(() => import('./pages/ResourceCenter'), 'ResourceCenter');
const TaskDetailNew = lazyPage(() => import('./pages/TaskDetailNew'), 'TaskDetailNew');
const AgentSafety = lazyPage(() => import('./pages/AgentSafety'), 'AgentSafety');
const TrainingEval = lazyPage(() => import('./pages/TrainingEval'), 'TrainingEval');
const TestSetGeneration = lazyPage(() => import('./pages/TestSetGeneration'), 'TestSetGeneration');
const Login = lazyPage(() => import('./pages/Login'), 'Login');
const Register = lazyPage(() => import('./pages/Register'), 'Register');
const AboutUs = lazyPage(() => import('./pages/AboutUs'), 'AboutUs');
const HelpDocs = lazyPage(() => import('./pages/HelpDocs'), 'HelpDocs');
const ProductSeries = lazyPage(() => import('./pages/ProductSeries'), 'ProductSeries');
const ProductsOverview = lazyPage(() => import('./pages/ProductsOverview'), 'ProductsOverview');
const AigcContent = lazyPage(() => import('./pages/AigcContent'), 'AigcContent');
const DeveloperCenter = lazyPage(() => import('./pages/DeveloperCenter'), 'DeveloperCenter');
const ModelSafetyEval = lazyPage(() => import('./pages/ModelSafetyEval'), 'ModelSafetyEval');
const ModelFilingService = lazyPage(() => import('./pages/ModelFilingService'), 'ModelFilingService');
const CodeVulnerabilityAudit = lazyPage(() => import('./pages/CodeVulnerabilityAudit'), 'CodeVulnerabilityAudit');
const AiSafetyEdu = lazyPage(() => import('./pages/AiSafetyEdu'), 'AiSafetyEdu');
const TiancheStandardService = lazyPage(() => import('./pages/TiancheStandardService'), 'TiancheStandardService');
const DeepModelEval = lazyPage(() => import('./pages/DeepModelEval'), 'DeepModelEval');
const PenetrationTest = lazyPage(() => import('./pages/PenetrationTest'), 'PenetrationTest');
const PrivacyDataAudit = lazyPage(() => import('./pages/PrivacyDataAudit'), 'PrivacyDataAudit');
const AdminDashboard = lazyPage(() => import('./pages/AdminDashboard'), 'AdminDashboard');
const EmbodiedIntelligence = lazyPage(() => import('./pages/EmbodiedIntelligence'), 'EmbodiedIntelligence');
const OnlineExperience = lazyPage(() => import('./pages/OnlineExperience'), 'OnlineExperience');

function PageFallback() {
  return (
    <div
      style={{
        minHeight: '40vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#64748b',
        fontSize: 14,
      }}
      aria-busy="true"
      aria-live="polite"
    >
      加载中…
    </div>
  );
}

function withSuspense(Component: ComponentType) {
  return function SuspendedPage() {
    return (
      <Suspense fallback={<PageFallback />}>
        <Component />
      </Suspense>
    );
  };
}

function Root() {
  return (
    <Layout>
      <ScrollToTop />
      <Outlet />
    </Layout>
  );
}

function AuthLayout() {
  return (
    <>
      <ScrollToTop />
      <Outlet />
    </>
  );
}

function StandaloneLayout() {
  return (
    <>
      <ScrollToTop />
      <Outlet />
    </>
  );
}

export const router = createHashRouter([
  {
    path: '/',
    Component: Root,
    children: [
      { index: true, Component: withSuspense(CompanyHome) },
      { path: 'about', Component: withSuspense(AboutUs) },
      { path: 'help-docs', Component: withSuspense(HelpDocs) },
      { path: 'help-docs/:articleId', Component: withSuspense(HelpDocs) },
      { path: 'online-experience', Component: withSuspense(OnlineExperience) },
      { path: 'products-overview', Component: withSuspense(ProductsOverview) },
      { path: 'products/:seriesId', Component: withSuspense(ProductSeries) },
      { path: 'model-filing-service', Component: withSuspense(ModelFilingService) },
      { path: 'tianche-standard-service', Component: withSuspense(TiancheStandardService) },
      { path: 'ai-safety-edu', Component: withSuspense(AiSafetyEdu) },
      { path: 'deep-model-eval', Component: withSuspense(DeepModelEval) },
      { path: 'aigc-content', Component: withSuspense(AigcContent) },
      { path: 'code-vulnerability-audit', Component: withSuspense(CodeVulnerabilityAudit) },
      { path: 'penetration-test', Component: withSuspense(PenetrationTest) },
      { path: 'privacy-data-audit', Component: withSuspense(PrivacyDataAudit) },
      { path: 'model-safety-eval', Component: withSuspense(ModelSafetyEval) },
      { path: 'leaderboard', Component: withSuspense(Leaderboard) },
      { path: 'evaluation-intro', Component: withSuspense(EvaluationIntro) },
      { path: 'llm-evaluation', Component: withSuspense(LLMEvaluation) },
      { path: 'safety-evaluation', Component: withSuspense(SafetyEvaluation) },
      { path: 'resource-center', Component: withSuspense(ResourceCenter) },
      { path: 'task-detail/:taskId', Component: withSuspense(TaskDetailNew) },
      { path: 'agent-safety', Component: withSuspense(AgentSafety) },
      { path: 'embodied-intelligence', Component: withSuspense(EmbodiedIntelligence) },
      { path: 'training-eval', Component: withSuspense(TrainingEval) },
      { path: 'testset-generation', Component: withSuspense(TestSetGeneration) },
      { path: 'aisafepro', Component: withSuspense(Home) },
    ],
  },
  {
    Component: AuthLayout,
    children: [
      { path: 'login', Component: withSuspense(Login) },
      { path: 'register', Component: withSuspense(Register) },
    ],
  },
  {
    Component: StandaloneLayout,
    children: [
      { path: 'developer', Component: withSuspense(DeveloperCenter) },
      { path: 'admin/:section?', Component: withSuspense(AdminDashboard) },
    ],
  },
]);
