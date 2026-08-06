/** temp-maven / 业务后端共用 DTO */

export type UserRoleCode = 'ADMIN' | 'USER';

export interface SysUser {
  id?: number;
  username?: string;
  password?: string;
  role?: UserRoleCode | string;
  deleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserLoginSo {
  username: string;
  password: string;
}

export interface UserLoginVo {
  user?: SysUser;
  token?: string;
}

export interface PageQuery<T = unknown> {
  pageSize?: number;
  pageCurrent?: number;
  orderColumn?: string;
  orderType?: string;
  entity?: T;
}

export interface PageResult<T> {
  records?: T[];
  total?: number;
  size?: number;
  current?: number;
  pages?: number;
}

export interface ModelTrustEvaluationTask {
  id?: number;
  userId?: number;
  fileId?: number;
  evaluationRequirement?: string;
  status?: string;
  emailStatus?: string;
  deleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ModelDataSafetyEvaluationTask {
  id?: number;
  userId?: number;
  fileId?: number;
  evaluationRequirement?: string;
  status?: string;
  emailStatus?: string;
  deleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
