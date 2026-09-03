const fs = require('node:fs')

const file = 'src/components/TaskCreationModal.tsx'
let content = fs.readFileSync(file, 'utf8')

function replaceOnce(from, to) {
  if (!content.includes(from)) {
    throw new Error(`Expected source not found: ${from.slice(0, 120)}`)
  }
  content = content.replace(from, to)
}

replaceOnce(
  "import { addEvaluationTask } from '@/api/evaluation';",
  "import { addEvaluationTask, type CreateEvaluationTaskInput } from '@/api/evaluation';",
)
replaceOnce("  EvaluationTask,\n", '')
replaceOnce(
`    const payload: EvaluationTask = {
      type: resolveApiType(),
      name: taskName.trim(),
      needSendEmail: enableEmail,
      ...(enableEmail ? { email: notifyEmail.trim() } : {}),
      ...(Number.isFinite(userId) ? { userId } : {}),
      ...(scenarioDescription ? { demandSupplement: scenarioDescription } : {}),
    };

    if (modelSource === 'my_models' && selectedDrop) {
      payload.useModelType =
        selectedDrop.type === 'BUILT_IN' ? 'BUILT_IN' : 'USER_MODEL';
      payload.modelId = selectedDrop.id;
    } else {
      payload.useModelType = 'CUSTOM';
      payload.customModelConfig = buildCustomModelConfig({
        name: customModelName,
        baseUrl: customApiBase.trim(),
        apiKey: customApiKey,
      });
    }
`,
`    const basePayload: Omit<CreateEvaluationTaskInput, 'useModelType'> = {
      type: resolveApiType(),
      name: taskName.trim(),
      needSendEmail: enableEmail,
      ...(enableEmail ? { email: notifyEmail.trim() } : {}),
      ...(Number.isFinite(userId) ? { userId } : {}),
      ...(scenarioDescription ? { demandSupplement: scenarioDescription } : {}),
    };

    const payload: CreateEvaluationTaskInput =
      modelSource === 'my_models' && selectedDrop
        ? {
            ...basePayload,
            useModelType: selectedDrop.type === 'BUILT_IN' ? 'BUILT_IN' : 'USER_MODEL',
            modelId: selectedDrop.id,
          }
        : {
            ...basePayload,
            useModelType: 'CUSTOM',
            customModelConfig: buildCustomModelConfig({
              name: customModelName,
              baseUrl: customApiBase.trim(),
              apiKey: customApiKey,
            }),
          };
`)

fs.writeFileSync(file, content)
console.log('TaskCreationModal now submits CreateEvaluationTaskInput directly.')
