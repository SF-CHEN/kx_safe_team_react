# 对接纪要：用户联系填报（产品页）

- **日期：** 2026-08-21
- **范围：** 全部产品页底部「联系我们」、专家咨询弹窗、渗透测试预约；个人敏感信息页死代码 LeadForm 同步接线
- **相关路径：**
  - `src/app/components/ProductContactSection.tsx`
  - `src/app/components/Layout.tsx`
  - `src/app/components/ExpertConsultModal.tsx`
  - `src/app/pages/PenetrationTest.tsx`
  - `src/app/pages/PrivacyDataAudit.tsx`（LeadFormSection，主渲染未挂载）
  - `src/api/contact/userContact.ts`、`src/api/types.ts`
- **OpenAPI：** `src/api/docs/api.md` / `api.json` → `/temp/user-contact/*`
- **UI 改动：** 否（仅数据源、成功态文案从 mailto 改为接口成功提示；最小 loading）

## 变更记录

| 日期 | 说明 |
| --- | --- |
| 2026-08-21 | 两页底部联系表单改走 `POST /temp/user-contact/submit`；其余产品页仍 mailto |
| 2026-08-21 | 全量产品页 `ProductContactSection` 走 submit；专家咨询 / 渗透预约 / LeadForm 同步接 API，去掉 mailto |

## 已对接（可联调）

| 能力 | 接口 | 前端封装 | 备注 |
| --- | --- | --- | --- |
| 产品页底部联系表单 | `POST /temp/user-contact/submit` | `submitUserContact` | 凡 `PRODUCT_CONTACT_NAMES` 命中的路径（14 个产品页） |
| 专家咨询预约弹窗 | 同上 | 同上 | `ModelFilingService`、`TiancheStandardService` |
| 渗透测试预约弹窗 | 同上 | 同上 | `PenetrationTest` BookingModal |
| LeadFormSection | 同上 | 同上 | 仍未挂载；避免日后恢复仍走 mailto |

### 产品页路径清单

`/privacy-data-audit`、`/model-safety-eval`、`/aigc-content`、`/aigc-content-marking`、`/deep-model-eval`、`/embodied-intelligence`、`/agent-safety`、`/llm-evaluation`、`/safety-evaluation`、`/code-vulnerability-audit`、`/penetration-test`、`/ai-safety-edu`、`/model-filing-service`、`/tianche-standard-service`

## 关联接口清单（有表单选项 / 外键时必填）

| 依赖能力 | 接口 | 状态 | 说明 |
| --- | --- | --- | --- |
| 联系填报 | `POST /temp/user-contact/submit` | 已接 | 四字段均为自由文本，无下拉/字典 |
| 分页 / 详情 / 改删 | `/temp/user-contact/page` 等 | 未接 | 管理端列表本轮不在范围内 |
| 预置场景 / 维度 / 模型 | — | 无 | 本表单无外键选项 |

> 主实体 CRUD 之外，凡 OpenAPI 已有、用于填表单选项的接口，同轮应闭环。本表单无选项字段。

## 字段映射

| UI 列 / 能力 | 接口字段 | 状态 | 说明 |
| --- | --- | --- | --- |
| 姓名 | `userName` | 已实现 | 必填 |
| 公司 | `companyName` | 已实现 | SubmitSo 用 `companyName`；实体字段为 `compantName`（OpenAPI 拼写） |
| 联系方式 | `contactInformation` | 已实现 | 底部表单：手机或邮箱原样；弹窗：`手机 / 邮箱` 拼接 |
| 需求描述 | `requirementDescription` | 已实现 | 前缀 `【产品/服务名】`；弹窗另附主题/痛点与双联系方式明细 |
| 咨询产品 | — | 已选定：方案 A | 见 Q1；写入需求描述前缀 |

## 待确认事项（不阻塞其余对接）

### Q1：DTO 无「咨询产品 / 来源页」字段

- **现状：** `UserContactSubmitSo` 仅有姓名、公司、联系方式、需求描述。
- **影响：** 后台无法用独立字段区分来自哪一产品页。
- **方案：**
  1. 前端把产品名写入 `requirementDescription` 前缀（本轮已用）
  2. 后端新增 `productName` / `source` 字段后再改前端
  3. 仅提交用户填写的需求原文，不带产品名
- **建议（仅建议）：** 方案 2 更干净；方案 1 可联调
- **状态：** 已选定：方案 1（本轮）

### Q2：未登录是否允许 submit

- **现状：** 客户端始终附带 `X-token`（有会话才有值）。联系表单面向访客，可能未登录。
- **影响：** 若接口强制鉴权，未登录提交会 401。
- **方案：**
  1. 后端将 `submit` 做成公开接口（建议）
  2. 前端未登录先跳转登录再提交（需改交互，本轮未做）
  3. 维持现状，联调看实际返回
- **建议（仅建议）：** 方案 1
- **状态：** 待确认

### Q3：个人敏感信息页 `LeadFormSection` 未挂载

- **现状：** `PrivacyDataAudit.tsx` 内 `LeadFormSection` 已接 submit，但主渲染仍未调用；页底实际表单是 Layout 的 `ProductContactSection`。
- **影响：** 可见表单已走 API；死代码仅防误恢复 mailto。
- **方案：**
  1. 保持不挂载（本轮）
  2. 挂载并同样接 `submit`（会多一块 UI）
  3. 删除死代码
- **建议（仅建议）：** 方案 1 或 3
- **状态：** 待确认（本轮按方案 1，逻辑已接线）

### Q4：专家/渗透弹窗双联系方式如何写入单字段

- **现状：** UI 有邮箱 + 手机；DTO 仅 `contactInformation`。
- **方案：**
  1. `contactInformation` 用 `手机 / 邮箱` 拼接，明细再写入 `requirementDescription`（本轮）
  2. 仅提交手机，邮箱只放需求描述
  3. 等后端拆字段
- **状态：** 已选定：方案 1

## 后端缺口（如需同步后端）

| 缺口能力 | 现状 | 建议接口 / 字段 | 前端临时策略 |
| --- | --- | --- | --- |
| 咨询产品 / 来源页 | SubmitSo 无该字段 | `productName` 或 `source` | 需求描述加 `【产品名】` 前缀 |
| 管理端联系记录列表 | 有 `page/update/delete` | 本轮不做 | 等明确要接后台再接线 |

## 过时文案清理

| 文案位置 | 处理 | 说明 |
| --- | --- | --- |
| 产品页 / 弹窗成功态「请在邮件客户端确认发送」 | 已改为「提交成功…」 | 已走真实接口 |
| mailto 回退分支 | 已删除 | `ProductContactSection` 不再保留 mailto |

## 验收要点

- [ ] Network：任意命中 `PRODUCT_CONTACT_NAMES` 的产品页提交可见 `POST /temp/user-contact/submit`
- [ ] 备案服务 / 天测标准「预约专家咨询」弹窗提交同上
- [ ] 渗透测试预约弹窗提交同上
- [ ] 请求体含 `userName` / `companyName` / `contactInformation` / `requirementDescription`
- [ ] 样式未改布局
- [ ] 待确认项未擅自拼接管理端 CRUD
- [ ] 失败走现有 toast
