export type WorkflowStatus =
  | '待受理'
  | '材料已接收'
  | '处理中'
  | '待补充材料'
  | '待交付'
  | '已推送'
  | '处理异常';

export interface StoredAttachment {
  id: string;
  name: string;
  size: number;
  type: string;
  category: 'input' | 'config' | 'report' | 'result';
  dataUrl?: string;
  uploadedAt: string;
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
  pushedAt?: string;
  pushedBy?: string;
  outputVersion?: number;
}

export interface PlatformUserRecord {
  id: string;
  name: string;
  contact: string;
  registeredAt: string;
  lastLoginAt: string;
  status: '正常' | '已停用';
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
export const WORKFLOW_EVENT = 'xuanjian-workflow-change';
const FORMAL_TASK_PRODUCTS = new Set([
  '模型数据安全评测', '深度模型可信测评', '智能体安全评测',
  '大模型评测', '大模型安全评测', '多模态大模型安全评测',
]);

function read<T>(key: string): T[] {
  try { return JSON.parse(localStorage.getItem(key) || '[]') as T[]; } catch { return []; }
}
function write<T>(key: string, value: T[]) {
  localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new CustomEvent(WORKFLOW_EVENT));
}
export const getWorkflowTasks = () => read<WorkflowTask>(TASK_KEY).filter(task => FORMAL_TASK_PRODUCTS.has(task.product));
export const saveWorkflowTasks = (tasks: WorkflowTask[]) => write(TASK_KEY, tasks);
export const getPlatformUsers = () => read<PlatformUserRecord>(USERS_KEY);
export const getNotifications = () => read<UserNotification>(NOTICE_KEY);
export const getAdminOperationLogs = () => read<AdminOperationLog>(OPERATION_LOG_KEY);

export function addAdminOperationLog(input: Omit<AdminOperationLog, 'id' | 'createdAt'>) {
  const logs = getAdminOperationLogs();
  logs.unshift({
    ...input,
    id: `admin-log-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    createdAt: new Date().toLocaleString('zh-CN', { hour12: false }),
  });
  write(OPERATION_LOG_KEY, logs.slice(0, 300));
}

export function setPlatformUserStatus(id: string, status: PlatformUserRecord['status']) {
  write(USERS_KEY, getPlatformUsers().map(user => user.id === id ? { ...user, status } : user));
  addAdminOperationLog({ operator: 'admin', action: status === '正常' ? '启用用户' : '停用用户', detail: id });
}

export function upsertPlatformUser(user: Omit<PlatformUserRecord, 'registeredAt' | 'lastLoginAt' | 'status'>) {
  const now = new Date().toLocaleString('zh-CN', { hour12: false });
  const users = getPlatformUsers();
  const index = users.findIndex(item => item.id === user.id || item.contact === user.contact);
  if (index >= 0) users[index] = { ...users[index], ...user, lastLoginAt: now };
  else users.unshift({ ...user, registeredAt: now, lastLoginAt: now, status: '正常' });
  write(USERS_KEY, users);
}

export function createWorkflowTask(task: WorkflowTask) {
  if (!FORMAL_TASK_PRODUCTS.has(task.product)) return;
  const tasks = getWorkflowTasks().filter(item => item.id !== task.id);
  write(TASK_KEY, [task, ...tasks]);
  addNotification({
    userId: task.userId,
    taskId: task.id,
    type: 'task',
    title: '任务提交成功',
    content: `“${task.name}”已提交，技术团队将在工作时间内受理。`,
  });
}

export function updateWorkflowTask(id: string, updates: Partial<WorkflowTask>) {
  const tasks = getWorkflowTasks().map(item => item.id === id
    ? { ...item, ...updates, updatedAt: new Date().toLocaleString('zh-CN', { hour12: false }) }
    : item);
  write(TASK_KEY, tasks);
}

export function addNotification(input: Omit<UserNotification, 'id' | 'createdAt' | 'read'>) {
  const notices = getNotifications();
  notices.unshift({ ...input, id: `notice-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, createdAt: new Date().toLocaleString('zh-CN', { hour12: false }), read: false });
  write(NOTICE_KEY, notices);
}

export function markNotificationRead(id: string) {
  write(NOTICE_KEY, getNotifications().map(item => item.id === id ? { ...item, read: true } : item));
}

export function markAllNotificationsRead(userId: string) {
  write(NOTICE_KEY, getNotifications().map(item => item.userId === userId ? { ...item, read: true } : item));
}

export function pushTaskToUser(taskId: string, operator = 'admin') {
  const task = getWorkflowTasks().find(item => item.id === taskId);
  if (!task) return;
  const now = new Date().toLocaleString('zh-CN', { hour12: false });
  const version = (task.outputVersion || 0) + 1;
  updateWorkflowTask(taskId, { status: '已推送', pushedAt: now, pushedBy: operator, outputVersion: version });
  addAdminOperationLog({ operator, taskId, action: '推送给用户', detail: `交付文件版本 v${version}` });
  addNotification({
    userId: task.userId,
    taskId,
    type: 'report',
    title: '评测结果已推送',
    content: `“${task.name}”的报告与结果文件已送达资源中心，请及时查看。`,
  });
}

export async function fileToStoredAttachment(file: File, category: StoredAttachment['category']): Promise<StoredAttachment> {
  // The current phase is a browser-only integration prototype. Small files are
  // persisted for a real download demo; large files keep metadata and must be
  // uploaded through the backend/object-storage API in production.
  const dataUrl = file.size <= 2 * 1024 * 1024 ? await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  }) : undefined;
  return { id: `file-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, name: file.name, size: file.size, type: file.type || 'application/octet-stream', category, dataUrl, uploadedAt: new Date().toLocaleString('zh-CN', { hour12: false }) };
}

export function downloadAttachment(file: StoredAttachment) {
  if (!file.dataUrl) return false;
  const anchor = document.createElement('a');
  anchor.href = file.dataUrl;
  anchor.download = file.name;
  anchor.click();
  return true;
}
