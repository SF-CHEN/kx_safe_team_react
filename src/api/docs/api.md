# temp-maven Api Doc

> 版本: Application Version: 1.0, Spring Boot Version: 4.0.6
> 文档规范: OpenAPI 3.x
> 描述: 此文档由脚本生成，旨在供 AI 助手理解系统接口定义。

## 1. 数据模型定义 (Data Models)

以下是系统中涉及的所有数据结构的 TypeScript 接口定义：

```typescript
interface SysUser { // 首页用户
  id?: number; // id
  username?: string;
  password?: string;
  role?: 'ADMIN' | 'USER'; // 用户角色
  deleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
  lastLoginAt?: string; // 最近登录时间
  enabled?: boolean; // 是否启用：true-启用、false-禁用
}

interface ResultBoolean {
  message?: string;
  code?: number;
  data?: boolean;
}

interface SysDict {
  id?: number; // id
  name?: string; // 字典名称
  value?: string; // 字典值
  type?: 'DIMENSION' | 'PRESET_SCENE'; // 字典类型，维度、预设场景
  pid?: number; // 上级id
  remark?: string; // 备注说明
  icon?: string; // 图标
  deleted?: boolean; // 软删除标记
  createdAt?: string; // 创建时间
  updatedAt?: string; // 更新时间
}

interface PresetScene { // 预制场景表，原sys_dict中type=PRESET_SCENE的数据迁移至此
  id?: number; // 场景id
  name?: string; // 场景名称
  dimensionIds?: string; // 场景包含的维度id集合，由小写逗号分隔，如:1,2,3，实体中用List<Integer>映射，由ArrayIntegerTypeHandler完成与数据库字符串的转换
  sortOrder?: number; // 排序值，越小越靠前，用于场景列表的展示顺序
  deleted?: boolean; // 软删除标记，false未删除，true已删除
  createdAt?: string; // 创建时间
  updatedAt?: string; // 更新时间
  evaluationTaskType?: 'PERFORMANCE' | 'SAFETY'; // 评测任务类型
}

interface ModelTrustEvaluationTask { // 模型可信评测任务表
  id?: number; // 自增主键ID
  userId?: number; // 用户ID
  fileId?: number; // 文件ID
  evaluationRequirement?: string; // 评测诉求
  status?: string; // 状态
  emailStatus?: string; // 邮件发送状态
  deleted?: boolean; // 软删除标记
  createdAt?: string; // 创建时间
  updatedAt?: string; // 更新时间
}

interface ModelDataSafetyEvaluationTask { // 模型数据安全评测任务表
  userId?: number; // 用户ID
  fileId?: number; // 文件ID
  evaluationRequirement?: string; // 评测诉求
  status?: string; // 状态
  emailStatus?: string; // 邮件发送状态
  deleted?: boolean; // 软删除标记
  createdAt?: string; // 创建时间
  updatedAt?: string; // 更新时间
  id?: number; // id
}

interface EvaluationDimension { // 评测维度表，树形结构，原sys_dict中type=DIMENSION的数据迁移至此
  id?: number; // 维度id
  name?: string; // 维度名称
  parentId?: number; // 父维度id，0表示顶级维度，支撑维度下拉树的父子结构
  sortOrder?: number; // 排序值，越小越靠前，用于同级维度的展示顺序
  deleted?: boolean; // 软删除标记，false未删除，true已删除
  createdAt?: string; // 创建时间
  updatedAt?: string; // 更新时间
  evaluationTaskType?: 'PERFORMANCE' | 'SAFETY'; // 评测任务类型
}

interface DepthModel {
  id?: number; // id
  name?: string; // 模型名称
  baseUrl?: string; // 模型url
  apiKey?: string; // 模型apikey
  type?: 'BUILT_IN' | 'USER'; // 模型类型，分为内置模型和用户模型
  userId?: number; // 用户id，当模型类型为用户模型的时候生效
  deleted?: boolean; // 软删除标记
  createdAt?: string; // 创建时间
  updatedAt?: string; // 更新时间
}

interface UserStatusSo { // 禁用/启用用户账号请求参数
  userId?: number; // 目标用户id
  enabled?: boolean; // 是否启用：true-启用、false-禁用
}

interface ResetPasswordSo { // 重置用户密码请求参数
  userId?: number; // 目标用户id
}

interface UserLoginSo { // 用户登录请求参数
  username?: string; // 用户名
  password?: string; // 密码
}

interface ResultUserLoginVo {
  message?: string;
  code?: number;
  data?: UserLoginVo;
}

interface UserLoginVo { // 用户登录返回VO
  user?: SysUser; // 用户信息
  token?: string; // JWT token
}

interface PageQuerySo {
  pageSize?: number; // 分页大小
  pageCurrent?: number; // 当前页
  orderColumn?: string; // 排序字段
  orderType?: string; // 排序方式
  entity?: SysUser; // 实体参数
}

interface OrderItem {
  column?: string;
  asc?: boolean;
}

interface PageSysUser {
  records?: SysUser[];
  total?: number;
  size?: number;
  current?: number;
  orders?: OrderItem[];
  optimizeCountSql?: PageSysUser;
  searchCount?: PageSysUser;
  optimizeJoinOfCountSql?: boolean;
  maxLimit?: number;
  countId?: string;
  pages?: number;
}

interface ResultPageSysUser {
  message?: string;
  code?: number;
  data?: PageSysUser;
}

interface ResultSysUser {
  message?: string;
  code?: number;
  data?: SysUser;
}

interface ResultSysFile {
  message?: string;
  code?: number;
  data?: SysFile;
}

interface SysFile { // 文件表，公网用户上传的文件信息，磁盘文件存放于local_save_path配置目录
  id?: number; // 文件id，评测任务等通过file_id关联
  storagePath?: string; // 磁盘存储相对路径，如:20260807/ab12cd34-....pdf，与local_save_path拼接得到完整路径，使用uuid命名避免路径穿越和重名
  originalName?: string; // 原始文件名，仅用于下载时还原展示，不参与磁盘存储
  size?: number; // 文件大小，单位字节
  contentType?: string; // 文件类型，服务端校验后的MIME类型
  userId?: number; // 上传用户id，关联sys_user.id
  deleted?: boolean; // 软删除标记，false未删除，true已删除
  createdAt?: string; // 上传时间
  updatedAt?: string; // 更新时间
}

interface PageSysFile {
  records?: SysFile[];
  total?: number;
  size?: number;
  current?: number;
  orders?: OrderItem[];
  optimizeCountSql?: PageSysFile;
  searchCount?: PageSysFile;
  optimizeJoinOfCountSql?: boolean;
  maxLimit?: number;
  countId?: string;
  pages?: number;
}

interface ResultPageSysFile {
  message?: string;
  code?: number;
  data?: PageSysFile;
}

interface PageSysDict {
  records?: SysDict[];
  total?: number;
  size?: number;
  current?: number;
  orders?: OrderItem[];
  optimizeCountSql?: PageSysDict;
  searchCount?: PageSysDict;
  optimizeJoinOfCountSql?: boolean;
  maxLimit?: number;
  countId?: string;
  pages?: number;
}

interface ResultPageSysDict {
  message?: string;
  code?: number;
  data?: PageSysDict;
}

interface ResultSysDict {
  message?: string;
  code?: number;
  data?: SysDict;
}

interface PagePresetScene {
  records?: PresetScene[];
  total?: number;
  size?: number;
  current?: number;
  orders?: OrderItem[];
  optimizeCountSql?: PagePresetScene;
  searchCount?: PagePresetScene;
  optimizeJoinOfCountSql?: boolean;
  maxLimit?: number;
  countId?: string;
  pages?: number;
}

interface ResultPagePresetScene {
  message?: string;
  code?: number;
  data?: PagePresetScene;
}

interface ResultPresetScene {
  message?: string;
  code?: number;
  data?: PresetScene;
}

interface PageModelTrustEvaluationTask {
  records?: ModelTrustEvaluationTask[];
  total?: number;
  size?: number;
  current?: number;
  orders?: OrderItem[];
  optimizeCountSql?: PageModelTrustEvaluationTask;
  searchCount?: PageModelTrustEvaluationTask;
  optimizeJoinOfCountSql?: boolean;
  maxLimit?: number;
  countId?: string;
  pages?: number;
}

interface ResultPageModelTrustEvaluationTask {
  message?: string;
  code?: number;
  data?: PageModelTrustEvaluationTask;
}

interface ResultModelTrustEvaluationTask {
  message?: string;
  code?: number;
  data?: ModelTrustEvaluationTask;
}

interface PageModelDataSafetyEvaluationTask {
  records?: ModelDataSafetyEvaluationTask[];
  total?: number;
  size?: number;
  current?: number;
  orders?: OrderItem[];
  optimizeCountSql?: PageModelDataSafetyEvaluationTask;
  searchCount?: PageModelDataSafetyEvaluationTask;
  optimizeJoinOfCountSql?: boolean;
  maxLimit?: number;
  countId?: string;
  pages?: number;
}

interface ResultPageModelDataSafetyEvaluationTask {
  message?: string;
  code?: number;
  data?: PageModelDataSafetyEvaluationTask;
}

interface ResultModelDataSafetyEvaluationTask {
  message?: string;
  code?: number;
  data?: ModelDataSafetyEvaluationTask;
}

interface EvaluationTask { // 评测任务
  id?: number; // id
  type?: 'PERFORMANCE' | 'SAFETY'; // 评测任务类型
  name?: string; // 评测任务名称
  useModelType?: 'BUILT_IN' | 'CUSTOM' | 'USER_MODEL'; // 使用的模型类型（内置模型、自定义、用户模型）
  modelId?: number; // 模型id，当use_model_type为内置模型和用户模型的时候生效
  customModelConfig?: string; // 自定义的模型配置信息，是一个json对象，包含模型名称、baseUrl、apiKey
  sampleSize?: number; // 样本数量
  evaluationDimensionType?: 'PRESET_SCENE' | 'CUSTOM'; // 评测维度类型（预设场景维度、自定义评测维度）
  presumedSceneDimensionId?: number; // 预设场景维度id，当evaluation_dimension_type是预设场景维度的时候使生效
  customDimensionIds?: string; // 自定义维度id集合，当evaluation_dimension_type是自定义评测维度的时候生效
  needSendEmail?: boolean; // 是否需要在任务完成后发送邮件
  email?: string; // 邮件地址
  status?: 'PENDING' | 'QUEUED' | 'RUNNING' | 'SUCCESS' | 'FAILED'; // 任务状态
  hasSendEmail?: boolean; // 是否已经发送邮件
  deleted?: boolean; // 软删除标记
  createdAt?: string; // 创建时间
  updatedAt?: string; // 更新时间
  userId?: number; // 创建用户的id
  demandSupplement?: string; // 需求补充
}

interface PageEvaluationTask {
  records?: EvaluationTask[];
  total?: number;
  size?: number;
  current?: number;
  orders?: OrderItem[];
  optimizeCountSql?: PageEvaluationTask;
  searchCount?: PageEvaluationTask;
  optimizeJoinOfCountSql?: boolean;
  maxLimit?: number;
  countId?: string;
  pages?: number;
}

interface ResultPageEvaluationTask {
  message?: string;
  code?: number;
  data?: PageEvaluationTask;
}

interface ResultEvaluationTask {
  message?: string;
  code?: number;
  data?: EvaluationTask;
}

interface SupplementMaterialSo { // 用户补充评测材料请求参数
  id?: number; // 评测任务总表id
  supplementFileId?: number; // 补充材料文件id，关联sys_file.id
}

interface EvaluationTaskMaster { // 评测任务总表（统一管理四种评测任务）
  id?: number; // 主键id
  name?: string; // 任务名称
  productType?: 'PERFORMANCE' | 'SAFETY' | 'DATA_SAFETY' | 'TRUST'; // 所属产品：PERFORMANCE-大模型性能评测、SAFETY-大模型安全评测、DATA_SAFETY-模型数据安全评测、TRUST-模型可信评测
  targetObject?: string; // 被测对象
  configSummary?: string; // 配置摘要
  submitType?: 'LOCAL_PROJECT_FILE' | 'USER_MODEL'; // 提交方式：LOCAL_PROJECT_FILE-本地工程文件、USER_MODEL-用户模型
  status?: 'PROCESSING' | 'AWAIT_SUPPLEMENT' | 'DELIVERED' | 'TERMINATED'; // 当前状态：PROCESSING-处理中、AWAIT_SUPPLEMENT-待补充、DELIVERED-已交付、TERMINATED-已终止
  taskRefId?: number; // 关联��体任务表记录的主键
  userId?: number; // 创建用户的id
  supplementFileId?: number; // 补充材料文件id，关联sys_file.id
  deliverFileId?: number; // 交付文件id，关联sys_file.id
  createdAt?: string; // 创建时间
  updatedAt?: string; // 修改时间
  deleted?: boolean; // 逻辑删除标记
}

interface PageEvaluationTaskMaster {
  records?: EvaluationTaskMaster[];
  total?: number;
  size?: number;
  current?: number;
  orders?: OrderItem[];
  optimizeCountSql?: PageEvaluationTaskMaster;
  searchCount?: PageEvaluationTaskMaster;
  optimizeJoinOfCountSql?: boolean;
  maxLimit?: number;
  countId?: string;
  pages?: number;
}

interface ResultPageEvaluationTaskMaster {
  message?: string;
  code?: number;
  data?: PageEvaluationTaskMaster;
}

interface DeliverTaskSo { // 管理员交付评测任务请求参数
  id?: number; // 评测任务总表id
  deliverFileId?: number; // 交付文件id，关联sys_file.id
}

interface AdminReplySo { // 管理员返回意见请求参数
  evaluationTaskMasterId?: number; // 评测任务总表id
  handleResult?: 'REQUEST_SUPPLEMENT' | 'TERMINATE'; // 处理结果：REQUEST_SUPPLEMENT-请求用户补件、TERMINATE-终止任务
  adminComment?: string; // 管理员意见说明
}

interface PageEvaluationDimension {
  records?: EvaluationDimension[];
  total?: number;
  size?: number;
  current?: number;
  orders?: OrderItem[];
  optimizeCountSql?: PageEvaluationDimension;
  searchCount?: PageEvaluationDimension;
  optimizeJoinOfCountSql?: boolean;
  maxLimit?: number;
  countId?: string;
  pages?: number;
}

interface ResultPageEvaluationDimension {
  message?: string;
  code?: number;
  data?: PageEvaluationDimension;
}

interface ResultEvaluationDimension {
  message?: string;
  code?: number;
  data?: EvaluationDimension;
}

interface PageDepthModel {
  records?: DepthModel[];
  total?: number;
  size?: number;
  current?: number;
  orders?: OrderItem[];
  optimizeCountSql?: PageDepthModel;
  searchCount?: PageDepthModel;
  optimizeJoinOfCountSql?: boolean;
  maxLimit?: number;
  countId?: string;
  pages?: number;
}

interface ResultPageDepthModel {
  message?: string;
  code?: number;
  data?: PageDepthModel;
}

interface ResultDepthModel {
  message?: string;
  code?: number;
  data?: DepthModel;
}

interface PresetSceneVo { // 预置场景VO
  sceneId?: number; // 场景id
  sceneName?: string; // 场景名称
  dimensionNames?: string[]; // 场景下的所有子维度名称集合
}

interface ResultListPresetSceneVo {
  message?: string;
  code?: number;
  data?: PresetSceneVo[];
}

interface ResultUserOverviewVo {
  message?: string;
  code?: number;
  data?: UserOverviewVo;
}

interface UserOverviewVo { // 用户总览VO
  totalUserCount?: number; // 总注册用户数
  todayNewUserCount?: number; // 今日新增用户数量
  activeUserCountLast7Days?: number; // 近7天活跃的用户数量
  disabledUserCount?: number; // 当前禁用的账号数量
}

interface ResultTaskOverviewVo {
  message?: string;
  code?: number;
  data?: TaskOverviewVo;
}

interface TaskOverviewVo { // 任务概览VO
  processingCount?: number; // 处理中任务数量
  awaitSupplementCount?: number; // 待补充任务数量
  deliveredCount?: number; // 已交付任务数量
  terminatedCount?: number; // 已终止任务数量
}

interface OverviewVo { // 运营总览VO
  totalUserCount?: number; // 平台注册用户总数
  weeklyNewUserCount?: number; // 本周新增注册用户数量
  processingTaskCount?: number; // 进行中任务数量（处理中+待补充）
  inProcessingTaskCount?: number; // 处于处理中的任务数量
  recent7DaysNewTaskCount?: number; // 近7天新增的任务数量
  totalDeliveredCount?: number; // 累计完成交付数量（已交付+已终止）
  weeklyDeliveredCount?: number; // 本周交付数量
}

interface ResultOverviewVo {
  message?: string;
  code?: number;
  data?: OverviewVo;
}

interface ResultString {
  message?: string;
  code?: number;
  data?: string;
}

interface EvaluationTaskMasterDetailVo { // 评测任务总表详情VO
  id?: number; // 任务id
  evaluationRequirement?: string; // 评测诉求
  username?: string; // 提交用户的username
  email?: string; // 邮箱
  configSummary?: string; // 配置摘要
  materialName?: string; // 用户提交的材料名称
  supplementFileId?: number; // 提交的补充材料id
  evaluationMaterialFileId?: number; // 用户提交的评测材料id
  evaluationMaterialName?: string; // 评测材料名称
  deliverFileId?: number; // 交付文件id
  deliverFileName?: string; // 交付文件名称
  status?: 'PROCESSING' | 'AWAIT_SUPPLEMENT' | 'DELIVERED' | 'TERMINATED'; // 任务状态
  createdAt?: string; // 创建时间
}

interface ResultEvaluationTaskMasterDetailVo {
  message?: string;
  code?: number;
  data?: EvaluationTaskMasterDetailVo;
}

interface EvaluationTaskMasterCommunication { // 评测任务沟通记录表（管理员与任务所属用户围绕评测任务总表的沟通记录）
  id?: number; // 主键id
  evaluationTaskMasterId?: number; // 关联的评测任务总表id
  handleResult?: 'REQUEST_SUPPLEMENT' | 'TERMINATE'; // 处理结果：REQUEST_SUPPLEMENT-请求用户补件、TERMINATE-终止任务
  adminComment?: string; // 管理员意见说明
  supplementFileName?: string; // 用户补充文件名称
  supplementFileId?: number; // 用户补充文件id，关联sys_file.id
  userReplied?: boolean; // 用户是否回复，false未回复，true已回复
  createdAt?: string; // 创建时间
  updatedAt?: string; // 修改时间
  deleted?: boolean; // 软删除标记
}

interface ResultListEvaluationTaskMasterCommunication {
  message?: string;
  code?: number;
  data?: EvaluationTaskMasterCommunication[];
}

interface ResultListTreeDropEvaluationDimension {
  message?: string;
  code?: number;
  data?: TreeDropEvaluationDimension[];
}

interface TreeDropEvaluationDimension {
  id?: number;
  name?: string;
  data?: EvaluationDimension;
  childs?: TreeDropEvaluationDimension[];
}

interface BaseDropDepthModel {
  id?: number;
  name?: string;
  data?: DepthModel;
}

interface ResultListBaseDropDepthModel {
  message?: string;
  code?: number;
  data?: BaseDropDepthModel[];
}

```

## 2. 接口列表 (API Endpoints)

### 📂 首页用户

### 修改首页用户

- **Method**: `PUT`
- **URL**: `/temp/sys-user/update`
- **Request Body**: `SysUser`
- **Response**: `ResultBoolean`

---

### 禁用/启用用户账号

- **Method**: `POST`
- **URL**: `/temp/sys-user/updateUserStatus`
- **Request Body**: `UserStatusSo`
- **Response**: `ResultBoolean`

---

### 重置用户密码为123456的MD5编码

- **Method**: `POST`
- **URL**: `/temp/sys-user/resetPassword`
- **Request Body**: `ResetPasswordSo`
- **Response**: `ResultBoolean`

---

### 用户注册

- **Method**: `POST`
- **URL**: `/temp/sys-user/register`
- **Request Body**: `UserLoginSo`
- **Response**: `ResultUserLoginVo`

---

### 分页查询首页用户

- **Method**: `POST`
- **URL**: `/temp/sys-user/page`
- **Request Body**: `PageQuerySo`
- **Response**: `ResultPageSysUser`

---

### 用户登录

- **Method**: `POST`
- **URL**: `/temp/sys-user/login`
- **Request Body**: `UserLoginSo`
- **Response**: `ResultUserLoginVo`

---

### 新增首页用户

- **Method**: `POST`
- **URL**: `/temp/sys-user/add`
- **Request Body**: `SysUser`
- **Response**: `ResultSysUser`

---

### 获取首页用户

- **Method**: `GET`
- **URL**: `/temp/sys-user/getDetailById`
- **Query / Path Parameters**:
  - `id` (query): number (Required) 
- **Response**: `ResultSysUser`

---

### 获取当前登录用户信息

- **Method**: `GET`
- **URL**: `/temp/sys-user/getCurrentUser`
- **Response**: `ResultSysUser`

---

### 删除首页用户

- **Method**: `DELETE`
- **URL**: `/temp/sys-user/deleteOne`
- **Query / Path Parameters**:
  - `id` (query): number (Required) 
- **Response**: `ResultBoolean`

---

### 批量删除首页用户

- **Method**: `DELETE`
- **URL**: `/temp/sys-user/batchDel`
- **Query / Path Parameters**:
  - `ids` (query): number[] (Required) 
- **Response**: `ResultBoolean`

---

### 📂 

### 修改

- **Method**: `PUT`
- **URL**: `/temp/sys-dict/update`
- **Request Body**: `SysDict`
- **Response**: `ResultBoolean`

---

### 修改

- **Method**: `PUT`
- **URL**: `/temp/depth-model/update`
- **Request Body**: `DepthModel`
- **Response**: `ResultBoolean`

---

### 分页查询

- **Method**: `POST`
- **URL**: `/temp/sys-dict/page`
- **Request Body**: `PageQuerySo`
- **Response**: `ResultPageSysDict`

---

### 新增

- **Method**: `POST`
- **URL**: `/temp/sys-dict/add`
- **Request Body**: `SysDict`
- **Response**: `ResultSysDict`

---

### 分页查询

- **Method**: `POST`
- **URL**: `/temp/depth-model/page`
- **Request Body**: `PageQuerySo`
- **Response**: `ResultPageDepthModel`

---

### 新增

- **Method**: `POST`
- **URL**: `/temp/depth-model/add`
- **Request Body**: `DepthModel`
- **Response**: `ResultDepthModel`

---

### 获取

- **Method**: `GET`
- **URL**: `/temp/sys-dict/getDetailById`
- **Query / Path Parameters**:
  - `id` (query): number (Required) 
- **Response**: `ResultSysDict`

---

### 获取

- **Method**: `GET`
- **URL**: `/temp/depth-model/getDetailById`
- **Query / Path Parameters**:
  - `id` (query): number (Required) 
- **Response**: `ResultDepthModel`

---

### 模型下拉

- **Method**: `GET`
- **URL**: `/temp/depth-model/dropdown`
- **Query / Path Parameters**:
  - `type` (query): 'BUILT_IN' | 'USER' (Optional) 
- **Response**: `ResultListBaseDropDepthModel`

---

### 删除

- **Method**: `DELETE`
- **URL**: `/temp/sys-dict/deleteOne`
- **Query / Path Parameters**:
  - `id` (query): number (Required) 
- **Response**: `ResultBoolean`

---

### 批量删除

- **Method**: `DELETE`
- **URL**: `/temp/sys-dict/batchDel`
- **Query / Path Parameters**:
  - `ids` (query): number[] (Required) 
- **Response**: `ResultBoolean`

---

### 删除

- **Method**: `DELETE`
- **URL**: `/temp/depth-model/deleteOne`
- **Query / Path Parameters**:
  - `id` (query): number (Required) 
- **Response**: `ResultBoolean`

---

### 批量删除

- **Method**: `DELETE`
- **URL**: `/temp/depth-model/batchDel`
- **Query / Path Parameters**:
  - `ids` (query): number[] (Required) 
- **Response**: `ResultBoolean`

---

### 📂 预制场景表，原sys_dict中type=PRESET_SCENE的数据迁移至此

### 修改预制场景表，原sys_dict中type=PRESET_SCENE的数据迁移至此

- **Method**: `PUT`
- **URL**: `/temp/preset-scene/update`
- **Request Body**: `PresetScene`
- **Response**: `ResultBoolean`

---

### 分页查询预制场景表，原sys_dict中type=PRESET_SCENE的数据迁移至此

- **Method**: `POST`
- **URL**: `/temp/preset-scene/page`
- **Request Body**: `PageQuerySo`
- **Response**: `ResultPagePresetScene`

---

### 新增预制场景表，原sys_dict中type=PRESET_SCENE的数据迁移至此

- **Method**: `POST`
- **URL**: `/temp/preset-scene/add`
- **Request Body**: `PresetScene`
- **Response**: `ResultPresetScene`

---

### 获取预制场景

- **Method**: `GET`
- **URL**: `/temp/preset-scene/presetScene`
- **Query / Path Parameters**:
  - `evaluationTaskType` (query): 'PERFORMANCE' | 'SAFETY' (Required) 
- **Response**: `ResultListPresetSceneVo`

---

### 获取预制场景表，原sys_dict中type=PRESET_SCENE的数据迁移至此

- **Method**: `GET`
- **URL**: `/temp/preset-scene/getDetailById`
- **Query / Path Parameters**:
  - `id` (query): number (Required) 
- **Response**: `ResultPresetScene`

---

### 删除预制场景表，原sys_dict中type=PRESET_SCENE的数据迁移至此

- **Method**: `DELETE`
- **URL**: `/temp/preset-scene/deleteOne`
- **Query / Path Parameters**:
  - `id` (query): number (Required) 
- **Response**: `ResultBoolean`

---

### 批量删除预制场景表，原sys_dict中type=PRESET_SCENE的数据迁移至此

- **Method**: `DELETE`
- **URL**: `/temp/preset-scene/batchDel`
- **Query / Path Parameters**:
  - `ids` (query): number[] (Required) 
- **Response**: `ResultBoolean`

---

### 📂 模型可信评测任务表

### 修改模型可信评测任务表

- **Method**: `PUT`
- **URL**: `/temp/model-trust-evaluation-task/update`
- **Request Body**: `ModelTrustEvaluationTask`
- **Response**: `ResultBoolean`

---

### 分页查询模型可信评测任务表

- **Method**: `POST`
- **URL**: `/temp/model-trust-evaluation-task/page`
- **Request Body**: `PageQuerySo`
- **Response**: `ResultPageModelTrustEvaluationTask`

---

### 新增模型可信评测任务表

- **Method**: `POST`
- **URL**: `/temp/model-trust-evaluation-task/add`
- **Request Body**: `ModelTrustEvaluationTask`
- **Response**: `ResultModelTrustEvaluationTask`

---

### 获取模型可信评测任务表

- **Method**: `GET`
- **URL**: `/temp/model-trust-evaluation-task/getDetailById`
- **Query / Path Parameters**:
  - `id` (query): number (Required) 
- **Response**: `ResultModelTrustEvaluationTask`

---

### 删除模型可信评测任务表

- **Method**: `DELETE`
- **URL**: `/temp/model-trust-evaluation-task/deleteOne`
- **Query / Path Parameters**:
  - `id` (query): number (Required) 
- **Response**: `ResultBoolean`

---

### 批量删除模型可信评测任务表

- **Method**: `DELETE`
- **URL**: `/temp/model-trust-evaluation-task/batchDel`
- **Query / Path Parameters**:
  - `ids` (query): number[] (Required) 
- **Response**: `ResultBoolean`

---

### 📂 模型数据安全评测任务表

### 修改模型数据安全评测任务表

- **Method**: `PUT`
- **URL**: `/temp/model-data-safety-evaluation-task/update`
- **Request Body**: `ModelDataSafetyEvaluationTask`
- **Response**: `ResultBoolean`

---

### 分页查询模型数据安全评测任务表

- **Method**: `POST`
- **URL**: `/temp/model-data-safety-evaluation-task/page`
- **Request Body**: `PageQuerySo`
- **Response**: `ResultPageModelDataSafetyEvaluationTask`

---

### 新增模型数据安全评测任务表

- **Method**: `POST`
- **URL**: `/temp/model-data-safety-evaluation-task/add`
- **Request Body**: `ModelDataSafetyEvaluationTask`
- **Response**: `ResultModelDataSafetyEvaluationTask`

---

### 获取模型数据安全评测任务表

- **Method**: `GET`
- **URL**: `/temp/model-data-safety-evaluation-task/getDetailById`
- **Query / Path Parameters**:
  - `id` (query): number (Required) 
- **Response**: `ResultModelDataSafetyEvaluationTask`

---

### 删除模型数据安全评测任务表

- **Method**: `DELETE`
- **URL**: `/temp/model-data-safety-evaluation-task/deleteOne`
- **Query / Path Parameters**:
  - `id` (query): number (Required) 
- **Response**: `ResultBoolean`

---

### 批量删除模型数据安全评测任务表

- **Method**: `DELETE`
- **URL**: `/temp/model-data-safety-evaluation-task/batchDel`
- **Query / Path Parameters**:
  - `ids` (query): number[] (Required) 
- **Response**: `ResultBoolean`

---

### 📂 评测维度表，树形结构，原sys_dict中type=DIMENSION的数据迁移至此

### 修改评测维度表，树形结构，原sys_dict中type=DIMENSION的数据迁移至此

- **Method**: `PUT`
- **URL**: `/temp/evaluation-dimension/update`
- **Request Body**: `EvaluationDimension`
- **Response**: `ResultBoolean`

---

### 分页查询评测维度表，树形结构，原sys_dict中type=DIMENSION的数据迁移至此

- **Method**: `POST`
- **URL**: `/temp/evaluation-dimension/page`
- **Request Body**: `PageQuerySo`
- **Response**: `ResultPageEvaluationDimension`

---

### 新增评测维度表，树形结构，原sys_dict中type=DIMENSION的数据迁移至此

- **Method**: `POST`
- **URL**: `/temp/evaluation-dimension/add`
- **Request Body**: `EvaluationDimension`
- **Response**: `ResultEvaluationDimension`

---

### 获取评测维度表，树形结构，原sys_dict中type=DIMENSION的数据迁移至此

- **Method**: `GET`
- **URL**: `/temp/evaluation-dimension/getDetailById`
- **Query / Path Parameters**:
  - `id` (query): number (Required) 
- **Response**: `ResultEvaluationDimension`

---

### 获取维度下拉树

- **Method**: `GET`
- **URL**: `/temp/evaluation-dimension/dimensionDropdown`
- **Query / Path Parameters**:
  - `evaluationTaskType` (query): 'PERFORMANCE' | 'SAFETY' (Required) 
- **Response**: `ResultListTreeDropEvaluationDimension`

---

### 删除评测维度表，树形结构，原sys_dict中type=DIMENSION的数据迁移至此

- **Method**: `DELETE`
- **URL**: `/temp/evaluation-dimension/deleteOne`
- **Query / Path Parameters**:
  - `id` (query): number (Required) 
- **Response**: `ResultBoolean`

---

### 批量删除评测维度表，树形结构，原sys_dict中type=DIMENSION的数据迁移至此

- **Method**: `DELETE`
- **URL**: `/temp/evaluation-dimension/batchDel`
- **Query / Path Parameters**:
  - `ids` (query): number[] (Required) 
- **Response**: `ResultBoolean`

---

### 📂 文件表，公网用户上传的文件信息，磁盘文件存放于local_save_path配置目录

### 文件上传，支持zip/rar/7z/tar/csv/json/jsonl，最大50MB

- **Method**: `POST`
- **URL**: `/temp/sys-file/upload`
- **Request Body**: `object`
- **Response**: `ResultSysFile`

---

### 分页查询文件表，公网用户上传的文件信息，磁盘文件存放于local_save_path配置目录

- **Method**: `POST`
- **URL**: `/temp/sys-file/page`
- **Request Body**: `PageQuerySo`
- **Response**: `ResultPageSysFile`

---

### 获取文件表，公网用户上传的文件信息，磁盘文件存放于local_save_path配置目录

- **Method**: `GET`
- **URL**: `/temp/sys-file/getDetailById`
- **Query / Path Parameters**:
  - `id` (query): number (Required) 
- **Response**: `ResultSysFile`

---

### 文件下载

- **Method**: `GET`
- **URL**: `/temp/sys-file/download`
- **Query / Path Parameters**:
  - `id` (query): number (Required) 
- **Response**: OK (No Content)

---

### 删除文件表，公网用户上传的文件信息，磁盘文件存放于local_save_path配置目录

- **Method**: `DELETE`
- **URL**: `/temp/sys-file/deleteOne`
- **Query / Path Parameters**:
  - `id` (query): number (Required) 
- **Response**: `ResultBoolean`

---

### 批量删除文件表，公网用户上传的文件信息，磁盘文件存放于local_save_path配置目录

- **Method**: `DELETE`
- **URL**: `/temp/sys-file/batchDel`
- **Query / Path Parameters**:
  - `ids` (query): number[] (Required) 
- **Response**: `ResultBoolean`

---

### 📂 评测任务

### 分页查询评测任务

- **Method**: `POST`
- **URL**: `/temp/evaluation-task/page`
- **Request Body**: `PageQuerySo`
- **Response**: `ResultPageEvaluationTask`

---

### 新增评测任务

- **Method**: `POST`
- **URL**: `/temp/evaluation-task/add`
- **Request Body**: `EvaluationTask`
- **Response**: `ResultEvaluationTask`

---

### 获取评测任务

- **Method**: `GET`
- **URL**: `/temp/evaluation-task/getDetailById`
- **Query / Path Parameters**:
  - `id` (query): number (Required) 
- **Response**: `ResultEvaluationTask`

---

### 删除评测任务

- **Method**: `DELETE`
- **URL**: `/temp/evaluation-task/deleteOne`
- **Query / Path Parameters**:
  - `id` (query): number (Required) 
- **Response**: `ResultBoolean`

---

### 批量删除评测任务

- **Method**: `DELETE`
- **URL**: `/temp/evaluation-task/batchDel`
- **Query / Path Parameters**:
  - `ids` (query): number[] (Required) 
- **Response**: `ResultBoolean`

---

### 📂 评测任务总表（统一管理四种评测任务）

### 用户补充评测材料

- **Method**: `POST`
- **URL**: `/temp/evaluation-task-master/supplementMaterial`
- **Request Body**: `SupplementMaterialSo`
- **Response**: `ResultBoolean`

---

### 分页查询评测任务总表（统一管理四种评测任务）

- **Method**: `POST`
- **URL**: `/temp/evaluation-task-master/page`
- **Request Body**: `PageQuerySo`
- **Response**: `ResultPageEvaluationTaskMaster`

---

### 管理员交付评测任务

- **Method**: `POST`
- **URL**: `/temp/evaluation-task-master/deliver`
- **Request Body**: `DeliverTaskSo`
- **Response**: `ResultBoolean`

---

### 获取评测任务总表（统一管理四种评测任务）

- **Method**: `GET`
- **URL**: `/temp/evaluation-task-master/getDetailById`
- **Query / Path Parameters**:
  - `id` (query): number (Required) 
- **Response**: `ResultEvaluationTaskMasterDetailVo`

---

### 删除评测任务总表（统一管理四种评测任务）

- **Method**: `DELETE`
- **URL**: `/temp/evaluation-task-master/deleteOne`
- **Query / Path Parameters**:
  - `id` (query): number (Required) 
- **Response**: `ResultBoolean`

---

### 批量删除评测任务总表（统一管理四种评测任务）

- **Method**: `DELETE`
- **URL**: `/temp/evaluation-task-master/batchDel`
- **Query / Path Parameters**:
  - `ids` (query): number[] (Required) 
- **Response**: `ResultBoolean`

---

### 📂 评测任务沟通记录表（管理员与任务所属用户围绕评测任务总表的沟通记录）

### 管理员返回意见

- **Method**: `POST`
- **URL**: `/temp/evaluation-task-master-communication/adminReply`
- **Request Body**: `AdminReplySo`
- **Response**: `ResultBoolean`

---

### 查询用户沟通记录

- **Method**: `GET`
- **URL**: `/temp/evaluation-task-master-communication/listByMasterId`
- **Query / Path Parameters**:
  - `evaluationTaskMasterId` (query): number (Required) 
- **Response**: `ResultListEvaluationTaskMasterCommunication`

---

### 📂 运营总览

### 用户总览查看

- **Method**: `GET`
- **URL**: `/temp/overview/userOverview`
- **Response**: `ResultUserOverviewVo`

---

### 任务概览查看

- **Method**: `GET`
- **URL**: `/temp/overview/taskOverview`
- **Response**: `ResultTaskOverviewVo`

---

### 运营总览查看

- **Method**: `GET`
- **URL**: `/temp/overview/operationalOverview`
- **Response**: `ResultOverviewVo`

---

### 我的任务概览查看

- **Method**: `GET`
- **URL**: `/temp/overview/myTaskOverview`
- **Response**: `ResultTaskOverviewVo`

---

### 📂 测试页面

### 你好

- **Method**: `GET`
- **URL**: `/temp/hello/`
- **Response**: `ResultString`

---

