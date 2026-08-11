# 玄鉴任务受理与报告推送——后端对接清单

> 当前前端已实现完整交互原型，数据暂存浏览器 `localStorage`。正式部署必须用以下后端能力替换，不能依赖前端本地数据或前端管理员口令。

## 1. 业务状态

`处理中 ↔ 待用户补充 → 已交付`

任务无法继续时可从“处理中”或“待用户补充”进入“已终止”。统一规则如下：

- 用户提交任务：进入“处理中”。
- 管理员发送补件要求：进入“待用户补充”。
- 用户在资源中心点击“按要求补充材料”并上传文件：回到“处理中”。
- 管理员上传交付文件并确认推送：进入“已交付”。
- 管理员填写终止原因并通知用户：进入“已终止”。

异常分支：`待补充材料`、`处理异常`。

## 2. 数据实体

- `users`：账号、手机号/邮箱、密码哈希、状态、注册时间、最后登录时间。
- `tasks`：用户、产品、模型、评测诉求、配置摘要、状态、受理人、创建/更新时间。
- `task_inputs`：模型/工程/配置文件的文件名、对象存储 key、大小、MIME、哈希。
- `task_outputs`：报告/结果文件的对象存储 key、版本、上传管理员、上传时间、推送时间。
- `notifications`：用户、任务、标题、正文、类型、已读状态、创建时间。
- `task_status_history`：状态前后值、操作人、备注、时间。
- `admin_audit_logs`：管理员下载、上传、推送、停用账号等操作审计。

文件本体存私有对象存储或服务器文件服务，数据库只保存元数据。下载使用有时效的签名 URL。

## 3. 建议接口

- `POST /api/auth/register`、`POST /api/auth/login`、`POST /api/admin/login`
- `GET /api/admin/users`、`PATCH /api/admin/users/:id/status`
- `POST /api/tasks`：创建任务并返回上传凭证
- `POST /api/tasks/:id/inputs`：登记完成上传的输入附件
- `GET /api/admin/tasks`、`GET /api/admin/tasks/:id`
- `GET /api/admin/tasks/:id/inputs/:fileId/download-url`
- `PATCH /api/admin/tasks/:id/status`
- `POST /api/admin/tasks/:id/outputs`：上传/登记报告和结果
- `POST /api/admin/tasks/:id/push`：事务性完成推送、通知与审计
- `GET /api/me/tasks`、`GET /api/me/tasks/:id/outputs`
- `GET /api/me/notifications`、`PATCH /api/me/notifications/:id/read`

## 4. 推送事务

管理员点击“推送给用户”时，后端应在同一业务事务中：

1. 校验任务已有可交付文件；
2. 将任务置为“已推送”并写入推送时间；
3. 创建用户未读消息；
4. 写管理员审计日志；
5. 异步发送邮件通知（失败可重试，不回滚报告交付）。

当前不购买短信服务：邮箱用户采用“邮件 + 站内消息”，手机号用户暂采用站内消息。短信服务以后作为可选通道接入。

## 5. 安全要求

- 管理员采用后端 RBAC 鉴权，删除前端硬编码账号密码。
- API Key 等密钥服务端加密保存，响应中不得返回明文。
- 输入/输出文件必须鉴权，禁止使用永久公开 URL。
- 对下载、状态修改、上传和推送记录审计日志。
- 限制文件类型、大小，执行病毒/恶意文件扫描并校验哈希。
