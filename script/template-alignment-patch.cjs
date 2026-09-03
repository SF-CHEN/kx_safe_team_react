const fs = require('node:fs')

function read(path) {
  return fs.readFileSync(path, 'utf8')
}

function write(path, content) {
  fs.writeFileSync(path, content)
}

function replaceOnce(path, from, to) {
  const content = read(path)
  if (!content.includes(from)) {
    throw new Error(`[${path}] expected patch source not found: ${from.slice(0, 120)}`)
  }
  write(path, content.replace(from, to))
}

function replaceAll(path, from, to) {
  const content = read(path)
  if (!content.includes(from)) {
    throw new Error(`[${path}] expected patch source not found: ${from.slice(0, 120)}`)
  }
  write(path, content.split(from).join(to))
}

function removeBetween(path, startMarker, endMarker) {
  const content = read(path)
  const start = content.indexOf(startMarker)
  const end = content.indexOf(endMarker)
  if (start < 0 || end < 0 || end <= start) {
    throw new Error(`[${path}] cleanup markers not found or out of order`)
  }
  write(path, `${content.slice(0, start)}${content.slice(end)}`)
}

// Layout: widen chat message role and use an explicit union guard for menu items.
replaceOnce(
  'src/components/Layout.tsx',
  '// ── Floating Chat Panel ───────────────────────────────────────────\nfunction FloatingChatPanel',
  "// ── Floating Chat Panel ───────────────────────────────────────────\ninterface ChatMessage {\n  from: 'agent' | 'user';\n  text: string;\n  ts: string;\n}\n\nfunction FloatingChatPanel",
)
replaceOnce(
  'src/components/Layout.tsx',
  'const [messages, setMessages] = React.useState([',
  'const [messages, setMessages] = React.useState<ChatMessage[]>([',
)
replaceAll('src/components/Layout.tsx', 'item.isGroup ? (', "'children' in item ? (")

// About page: CSS drop-shadow belongs in filter, not as a non-standard React style property.
replaceOnce(
  'src/pages/AboutUs.tsx',
  "filter: 'brightness(0) invert(1)', opacity: 0.92, drop_shadow: '0 0 16px rgba(255,255,255,0.2)'",
  "filter: 'brightness(0) invert(1) drop-shadow(0 0 16px rgba(255,255,255,0.2))', opacity: 0.92",
)

// Agent demo: give heterogeneous demo messages one explicit display type.
replaceOnce(
  'src/pages/AgentSafety.tsx',
  "const CHAT_MESSAGES_IDLE = [",
  "interface AgentDemoMessage {\n  role: 'user' | 'agent' | 'system';\n  text: string;\n  safe?: boolean;\n  isAttack?: boolean;\n  isWarning?: boolean;\n}\n\nconst CHAT_MESSAGES_IDLE: AgentDemoMessage[] = [",
)
replaceOnce(
  'src/pages/AgentSafety.tsx',
  'const INJECTION_SEQUENCE = [',
  'const INJECTION_SEQUENCE: AgentDemoMessage[] = [',
)

// AIGC hero: event handlers must not pass the click event into business parameters.
replaceOnce(
  'src/pages/AigcContent.tsx',
  'onClick={handleOnlineExperience}',
  'onClick={() => handleOnlineExperience()}',
)

// Knowledge cards are buttons, so keep currentTarget typed as HTMLButtonElement.
replaceAll(
  'src/pages/CompanyHome.tsx',
  'const el = e.currentTarget as HTMLDivElement;',
  'const el = e.currentTarget;',
)

// Formal task creation: successful server tasks/models must not be mirrored into UserContext/localStorage.
replaceOnce(
  'src/components/TaskCreationModal.tsx',
  "import { useUser, EvalTask, MyModel } from '../context/UserContext';",
  "import { useUser, EvalTask } from '../context/UserContext';",
)
replaceOnce(
  'src/components/TaskCreationModal.tsx',
  'const { user, addTask, addModel } = useUser();',
  'const { user } = useUser();',
)
replaceOnce(
  'src/components/TaskCreationModal.tsx',
  `\n        const newModel: MyModel = {\n          id: \`m_\${Date.now()}\`,\n          name: customModelName,\n          type: '自定义',\n          apiBase: customApiBase,\n          modelId: customModelName,\n          createdAt: new Date().toISOString().split('T')[0],\n        };\n        addModel(newModel);`,
  '',
)
replaceOnce(
  'src/components/TaskCreationModal.tsx',
  `const created = await addEvaluationTask(payload);\n\n      const newTask: EvalTask = {\n        id: created.id != null ? \`evaluation:\${created.id}\` : \`t_\${Date.now()}\`,\n        name: taskName.trim(),\n        model: modelName,\n        modelType:\n          payload.useModelType === 'BUILT_IN'\n            ? '内置'\n            : payload.useModelType === 'USER_MODEL'\n              ? '用户模型'\n              : '自定义',\n        evalSet: sceneName,\n        evalType: resolveEvalType(),\n        status: '待受理',\n        score: null,\n        createdAt:\n          created.createdAt ||\n          new Date().toLocaleString('zh-CN', { hour12: false }),\n        plan: pricingPlan,\n        requirement: scenarioDescription || selectedScene?.sceneName || sceneName,\n        configSummary: \`测试类型：\${taskType === 'multimodal' ? '多模态模型' : '文本模型'}；场景：\${sceneName}\`,\n      };\n\n      addTask(newTask);`,
  'await addEvaluationTask(payload);',
)

// DeepModelEval already uses LightweightUploadTaskModal + real model-trust API.
// Remove the unreachable legacy fake-success modal entirely.
removeBetween(
  'src/pages/DeepModelEval.tsx',
  '// ── Types ─────────────────────────────────────────────────────────',
  '// ── Hero Dashboard: Model Analysis Visualization ───────────────────',
)
replaceAll('src/pages/DeepModelEval.tsx', 'top: (s as any).top,', "top: 'top' in s ? s.top : undefined,")
replaceAll('src/pages/DeepModelEval.tsx', 'bottom: (s as any).bottom,', "bottom: 'bottom' in s ? s.bottom : undefined,")
replaceAll('src/pages/DeepModelEval.tsx', 'left: (s as any).left,', "left: 'left' in s ? s.left : undefined,")
replaceAll('src/pages/DeepModelEval.tsx', 'right: (s as any).right,', "right: 'right' in s ? s.right : undefined,")

console.log('Template alignment guarded patch set applied successfully.')
