export type WorkflowStatus =
  | '处理中'
  | '待用户补充'
  | '已交付'
  | '已终止';

export type PlatformActivityType = '登录' | '在线体验' | '提交任务' | '下载报告';

export interface StoredAttachment {
  id: string;
  name: string;
  size: number;
  type: string;
  category: 'input' | 'config' | 'report' | 'result';
  dataUrl?: string;
  uploadedAt: string;
}

export interface WorkflowCommunication {
  id: string;
  sender: 'admin' | 'user' | 'system';
  type: '补充材料请求' | '补充材料提交' | '交付说明' | '终止通知' | '状态更新';
  content: string;
  createdAt: string;
}

export interface WorkflowTask {
  id: string;
  userId: string;
  userName: string;
  contact: string;
  name: string;
  product: string;
  model: string;
  requirement: string;
  configSummary?: string;
  status: WorkflowStatus;
  createdAt: string;
  updatedAt: string;
  inputs: StoredAttachment[];
  outputs: StoredAttachment[];
  adminNote?: string;
  publicMessage?: string;
  supplementCategory?: string;
  supplementDueAt?: string;
  communications?: WorkflowCommunication[];
  pushedAt?: string;
  pushedBy?: string;
  outputVersion?: number;
  deliveryNote?: string;
  terminatedAt?: string;
  terminatedBy?: string;
  terminationReason?: string;
}

export interface PlatformUserRecord {
  id: string;
  name: string;
  contact: string;
  registeredAt: string;
  lastLoginAt: string;
  status: '正常' | '已停用';
  /** 管理端展示所需的归一化角色；旧本地记录缺失时按普通用户处理。 */
  role?: 'admin' | 'user';
}

export interface PlatformActivity {
  id: string;
  userId: string;
  type: PlatformActivityType;
  createdAt: string;
}

export interface UserNotification {
  id: string;
  userId: string;
  taskId?: string;
  title: string;
  content: string;
  createdAt: string;
  read: boolean;
  type: 'task' | 'report' | 'system';
}

export interface AdminOperationLog {
  id: string;
  taskId?: string;
  operator: string;
  action: string;
  detail?: string;
  createdAt: string;
}

const TASK_KEY = 'xuanjian-workflow-tasks-v1';
const USERS_KEY = 'xuanjian-platform-users-v1';
const NOTICE_KEY = 'xuanjian-notifications-v1';
const OPERATION_LOG_KEY = 'xuanjian-admin-operation-logs-v1';
const ACTIVITY_KEY = 'xuanjian-platform-activities-v1';
export const WORKFLOW_EVENT = 'xuanjian-workflow-change';
export const TERMINAL_WORKFLOW_STATUSES: WorkflowStatus[] = ['已交付', '已终止'];
export const FORMAL_TASK_PRODUCTS = new Set([
  '数据集安全评测', '模型数据安全评测', '深度模型可信测评', '智能体安全评测',
  '大模型评测', '大模型性能评测', '大模型安全评测', '多模态大模型安全评测',
]);

const nowText = () => new Date().toLocaleString('zh-CN', { hour12: false });

function read<T>(key: string): T[] {
  try { return JSON.parse(localStorage.getItem(key) || '[]') as T[]; } catch { return []; }
}

function write<T>(key: string, value: T[]) {
  localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new CustomEvent(WORKFLOW_EVENT));
}

function normalizeStatus(status: string): WorkflowStatus {
  const aliases: Record<string, WorkflowStatus> = {
    待受理: '处理中', 材料核验: '处理中', 待交付: '处理中', 材料已接收: '处理中',
    待补充材料: '待用户补充', 已推送: '已交付', 处理异常: '处理中', 评测中: '处理中', 排队中: '处理中',
  };
  if (aliases[status]) return aliases[status];
  if (status === '处理中' || status === '待用户补充' || status === '已交付' || status === '已终止') return status;
  return '处理中';
}

function normalizeTask(task: WorkflowTask): WorkflowTask {
  const normalized = normalizeStatus(String(task.status));
  return {
    ...task,
    product: task.product === '模型数据安全评测' ? '数据集安全评测' : task.product,
    status: normalized,
    communications: task.communications || [],
    publicMessage: task.publicMessage || (String(task.status) === '处理异常' ? '任务处理遇到异常，管理员正在核实。' : undefined),
  };
}

export const getWorkflowTasks = () => read<WorkflowTask>(TASK_KEY).filter(task => FORMAL_TASK_PRODUCTS.has(task.product)).map(normalizeTask);
export const saveWorkflowTasks = (tasks: WorkflowTask[]) => write(TASK_KEY, tasks);
export const getPlatformUsers = (): PlatformUserRecord[] => read<PlatformUserRecord>(USERS_KEY).map((user) => ({ ...user, role: user.role || 'user' }));
export const getNotifications = () => read<UserNotification>(NOTICE_KEY);
export const getAdminOperationLogs = () => read<AdminOperationLog>(OPERATION_LOG_KEY);
export const getPlatformActivities = () => read<PlatformActivity>(ACTIVITY_KEY);

export function addAdminOperationLog(input: Omit<AdminOperationLog, 'id' | 'createdAt'>) {
  const logs = getAdminOperationLogs();
  logs.unshift({ ...input, id: `admin-log-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, createdAt: nowText() });
  write(OPERATION_LOG_KEY, logs.slice(0, 1000));
}

export function recordPlatformActivity(userId: string, type: PlatformActivityType) {
  if (!userId || userId === 'guest') return;
  const activities = getPlatformActivities();
  activities.unshift({ id: `activity-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, userId, type, createdAt: nowText() });
  write(ACTIVITY_KEY, activities.slice(0, 3000));
}

export function setPlatformUserStatus(id: string, status: PlatformUserRecord['status']) {
  write(USERS_KEY, getPlatformUsers().map(user => user.id === id ? { ...user, status } : user));
  addAdminOperationLog({ operator: 'admin', action: status === '正常' ? '启用用户' : '停用用户', detail: id });
}

export function updatePlatformUser(id: string, updates: Pick<PlatformUserRecord, 'name' | 'contact'>) {
  write(USERS_KEY, getPlatformUsers().map(user => user.id === id ? { ...user, ...updates } : user));
  addAdminOperationLog({ operator: 'admin', action: '编辑用户资料', detail: `${id} · ${updates.name}` });
}

export function upsertPlatformUser(user: Omit<PlatformUserRecord, 'registeredAt' | 'lastLoginAt' | 'status'>) {
  const now = nowText();
  const users = getPlatformUsers();
  const index = users.findIndex(item => item.id === user.id || item.contact === user.contact);
  if (index >= 0) users[index] = { ...users[index], ...user, lastLoginAt: now };
  else users.unshift({ ...user, registeredAt: now, lastLoginAt: now, status: '正常' });
  write(USERS_KEY, users);
}

export function createWorkflowTask(task: WorkflowTask) {
  if (!FORMAL_TASK_PRODUCTS.has(task.product)) return;
  const tasks = getWorkflowTasks().filter(item => item.id !== task.id);
  const created = normalizeTask({ ...task, status: '处理中', communications: [{ id: `comm-${Date.now()}`, sender: 'system', type: '状态更新', content: '任务已提交，正在处理中。', createdAt: nowText() }] });
  write(TASK_KEY, [created, ...tasks]);
  recordPlatformActivity(task.userId, '提交任务');
  addNotification({ userId: task.userId, taskId: task.id, type: 'task', title: '任务提交成功', content: `“${task.name}”已提交并进入处理流程。` });
}

export function updateWorkflowTask(id: string, updates: Partial<WorkflowTask>) {
  const tasks = getWorkflowTasks().map(item => item.id === id ? { ...item, ...updates, updatedAt: nowText() } : item);
  write(TASK_KEY, tasks);
}

export function addNotification(input: Omit<UserNotification, 'id' | 'createdAt' | 'read'>) {
  const notices = getNotifications();
  notices.unshift({ ...input, id: `notice-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, createdAt: nowText(), read: false });
  write(NOTICE_KEY, notices);
}

export function markNotificationRead(id: string) {
  write(NOTICE_KEY, getNotifications().map(item => item.id === id ? { ...item, read: true } : item));
}

export function markAllNotificationsRead(userId: string) {
  write(NOTICE_KEY, getNotifications().map(item => item.userId === userId ? { ...item, read: true } : item));
}

function appendCommunication(task: WorkflowTask, communication: Omit<WorkflowCommunication, 'id' | 'createdAt'>) {
  return [...(task.communications || []), { ...communication, id: `comm-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, createdAt: nowText() }];
}

export function requestTaskSupplement(taskId: string, content: string, category: string, dueAt?: string, operator = 'admin') {
  const task = getWorkflowTasks().find(item => item.id === taskId);
  if (!task || TERMINAL_WORKFLOW_STATUSES.includes(task.status)) return;
  updateWorkflowTask(taskId, {
    status: '待用户补充', publicMessage: content, supplementCategory: category, supplementDueAt: dueAt,
    communications: appendCommunication(task, { sender: 'admin', type: '补充材料请求', content: `${category}：${content}${dueAt ? `（请于 ${dueAt} 前补充）` : ''}` }),
  });
  addAdminOperationLog({ operator, taskId, action: '请求用户补充材料', detail: `${category} · ${content}` });
  addNotification({ userId: task.userId, taskId, type: 'task', title: '请补充任务材料', content: `“${task.name}”需要补充：${content}` });
}

export function submitTaskSupplement(taskId: string, files: StoredAttachment[], userId: string) {
  const task = getWorkflowTasks().find(item => item.id === taskId);
  if (!task || task.status !== '待用户补充' || task.userId !== userId || !files.length) return;
  updateWorkflowTask(taskId, {
    inputs: [...task.inputs, ...files], status: '处理中', publicMessage: '补充材料已提交，任务已恢复处理。',
    communications: appendCommunication(task, { sender: 'user', type: '补充材料提交', content: `已补充 ${files.length} 个文件：${files.map(file => file.name).join('、')}` }),
  });
  addAdminOperationLog({ operator: userId, taskId, action: '用户补充材料', detail: files.map(file => file.name).join('、') });
}

export function deliverTaskToUser(taskId: string, deliveryNote: string, operator = 'admin') {
  const task = getWorkflowTasks().find(item => item.id === taskId);
  if (!task || TERMINAL_WORKFLOW_STATUSES.includes(task.status) || !task.outputs.length) return false;
  const now = nowText();
  const version = (task.outputVersion || 0) + 1;
  updateWorkflowTask(taskId, {
    status: '已交付', pushedAt: now, pushedBy: operator, outputVersion: version, deliveryNote,
    publicMessage: deliveryNote || '报告与结果文件已交付，请及时下载查看。',
    communications: appendCommunication(task, { sender: 'admin', type: '交付说明', content: deliveryNote || `报告与结果文件已交付（v${version}）。` }),
  });
  addAdminOperationLog({ operator, taskId, action: '交付并推送给用户', detail: `交付文件版本 v${version}` });
  addNotification({ userId: task.userId, taskId, type: 'report', title: '评测结果已交付', content: `“${task.name}”的报告与结果文件已送达资源中心。` });
  return true;
}

export function terminateWorkflowTask(taskId: string, reason: string, operator = 'admin') {
  const task = getWorkflowTasks().find(item => item.id === taskId);
  if (!task || TERMINAL_WORKFLOW_STATUSES.includes(task.status)) return;
  const now = nowText();
  updateWorkflowTask(taskId, {
    status: '已终止', terminationReason: reason, terminatedAt: now, terminatedBy: operator, publicMessage: reason,
    communications: appendCommunication(task, { sender: 'admin', type: '终止通知', content: reason }),
  });
  addAdminOperationLog({ operator, taskId, action: '终止任务并通知用户', detail: reason });
  addNotification({ userId: task.userId, taskId, type: 'task', title: '任务已终止', content: `“${task.name}”未能继续处理：${reason}` });
}

/** 保留旧调用名称，统一转入正式交付流程。 */
export function pushTaskToUser(taskId: string, operator = 'admin') {
  return deliverTaskToUser(taskId, '', operator);
}

export async function fileToStoredAttachment(file: File, category: StoredAttachment['category']): Promise<StoredAttachment> {
  const dataUrl = file.size <= 2 * 1024 * 1024 ? await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  }) : undefined;
  return { id: `file-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, name: file.name, size: file.size, type: file.type || 'application/octet-stream', category, dataUrl, uploadedAt: nowText() };
}

export function downloadAttachment(file: StoredAttachment) {
  if (!file.dataUrl) return false;
  const anchor = document.createElement('a');
  anchor.href = file.dataUrl;
  anchor.download = file.name;
  anchor.click();
  return true;
}
