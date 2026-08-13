import React from 'react';
import { createBrowserRouter, Navigate, Outlet } from 'react-router';
import { Layout } from './components/Layout';
import { CompanyHome } from './pages/CompanyHome';
import { Home } from './pages/Home';
import { Leaderboard } from './pages/Leaderboard';
import { EvaluationIntro } from './pages/EvaluationIntro';
import { LLMEvaluation } from './pages/LLMEvaluation';
import { SafetyEvaluation } from './pages/SafetyEvaluation';
import { ResourceCenter } from './pages/ResourceCenter';
import { AgentSafety } from './pages/AgentSafety';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { AboutUs } from './pages/AboutUs';
import { HelpDocs } from './pages/HelpDocs';
import { ProductSeries } from './pages/ProductSeries';
import { ProductsOverview } from './pages/ProductsOverview';
import { AigcContent } from './pages/AigcContent';
import { AigcContentMarking } from './pages/AigcContentMarking';
import { DeveloperCenter } from './pages/DeveloperCenter';
import { ModelSafetyEval } from './pages/ModelSafetyEval';
import { ModelFilingService } from './pages/ModelFilingService';
import { CodeVulnerabilityAudit } from './pages/CodeVulnerabilityAudit';
import { AiSafetyEdu } from './pages/AiSafetyEdu';
import { TiancheStandardService } from './pages/TiancheStandardService';
import { DeepModelEval } from './pages/DeepModelEval';
import { PenetrationTest } from './pages/PenetrationTest';
import { PrivacyDataAudit } from './pages/PrivacyDataAudit';
import { AdminDashboard } from './pages/AdminDashboard';
import { EmbodiedIntelligence } from './pages/EmbodiedIntelligence';
import { OnlineExperience } from './pages/OnlineExperience';
import { NotFound } from './pages/NotFound';

function Root() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}

function AuthLayout() {
  return <Outlet />;
}

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Root,
    children: [
      // Company Portal — new homepage
      { index: true, Component: CompanyHome },
      // Company-level pages
      { path: 'about', Component: AboutUs },
      { path: 'help-docs', Component: HelpDocs },
      { path: 'help-docs/:articleId', Component: HelpDocs },
      { path: 'online-experience', Component: OnlineExperience },
      // Products overview (all 4 series detail)
      { path: 'products-overview', Component: ProductsOverview },
      { path: 'products/tianyuan', element: <Navigate to="/products-overview" replace /> },
      // Product series placeholders (天源/天巡/天策)
      { path: 'products/:seriesId', Component: ProductSeries },
      { path: 'model-filing-service', Component: ModelFilingService },
      { path: 'tianche-standard-service', Component: TiancheStandardService },
      { path: 'ai-safety-edu', Component: AiSafetyEdu },
      { path: 'deep-model-eval', Component: DeepModelEval },
      // ─── AISafePro-LM product pages (unchanged) ───────────────
      { path: 'aigc-content', Component: AigcContent },
      { path: 'aigc-content-marking', Component: AigcContentMarking },
      { path: 'code-vulnerability-audit', Component: CodeVulnerabilityAudit },
      { path: 'penetration-test', Component: PenetrationTest },
      { path: 'privacy-data-audit', Component: PrivacyDataAudit },
      { path: 'model-safety-eval', Component: ModelSafetyEval },
      { path: 'leaderboard', Component: Leaderboard },
      { path: 'evaluation-intro', Component: EvaluationIntro },
      { path: 'llm-evaluation', Component: LLMEvaluation },
      { path: 'safety-evaluation', Component: SafetyEvaluation },
      { path: 'resource-center', Component: ResourceCenter },
      { path: 'agent-safety', Component: AgentSafety },
      { path: 'embodied-intelligence', Component: EmbodiedIntelligence },
      // Legacy AISafePro home (preserved)
      { path: 'aisafepro', Component: Home },
      { path: '*', Component: NotFound },
    ],
  },
  {
    Component: AuthLayout,
    children: [
      { path: 'login', Component: Login },
      { path: 'register', Component: Register },
    ],
  },
  { path: 'developer', Component: DeveloperCenter },
  { path: 'admin', Component: AdminDashboard },
]);
