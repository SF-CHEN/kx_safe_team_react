# 对接纪要：用户联系填报（产品页）

- **日期：** 2026-08-21
- **范围：** 个人敏感信息审查、具身智能可信评测页底部「联系我们」表单
- **相关路径：**
  - `src/app/components/ProductContactSection.tsx`
  - `src/app/components/Layout.tsx`
  - `src/api/contact/userContact.ts`、`src/api/types.ts`
- **OpenAPI：** `src/api/docs/api.md` / `api.json` → `/temp/user-contact/*`
- **UI 改动：** 否（仅数据源与提交成功提示；提交中按钮文案为最小 loading）

## 变更记录

| 日期 | 说明 |
| --- | --- |
| 2026-08-21 | 两页底部联系表单改走 `POST /temp/user-contact/submit`；其余产品页仍 mailto |

## 已对接（可联调）

| 能力 | 接口 | 前端封装 | 备注 |
| --- | --- | --- | --- |
| 前台填报联系信息 | `POST /temp/user-contact/submit` | `submitUserContact` | 仅 `/privacy-data-audit`、`/embodied-intelligence` |

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
| 联系方式 | `contactInformation` | 已实现 | 手机号或邮箱，原样提交 |
| 需求描述 | `requirementDescription` | 已实现 | 提交时加产品名前缀 `【{productName}】`，因 DTO 无产品字段 |
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

- **现状：** `PrivacyDataAudit.tsx` 内仍有 `LeadFormSection`（姓名/电话/公司 + mailto），主渲染未调用；页底实际表单是 Layout 的 `ProductContactSection`。
- **影响：** 本轮对接的是可见的页底表单，不是该死代码。
- **方案：**
  1. 保持不挂载，避免与页底表单重复（本轮）
  2. 挂载并同样接 `submit`（会多一块 UI）
  3. 删除死代码
- **建议（仅建议）：** 方案 1 或 3
- **状态：** 待确认（本轮按方案 1）

## 后端缺口（如需同步后端）

| 缺口能力 | 现状 | 建议接口 / 字段 | 前端临时策略 |
| --- | --- | --- | --- |
| 咨询产品 / 来源页 | SubmitSo 无该字段 | `productName` 或 `source` | 需求描述加 `【产品名】` 前缀 |
| 管理端联系记录列表 | 有 `page/update/delete` | 本轮不做 | 等明确要接后台再接线 |

## 过时文案清理

| 文案位置 | 处理 | 说明 |
| --- | --- | --- |
| 两页提交成功 toast「请在邮件客户端确认发送」 | 已改为「提交成功，我们将尽快与您联系」 | 已走真实接口 |
| 其余产品页 mailto 成功提示 | 保留 | 本轮未对接 |

## 验收要点

- [ ] Network：在 `/#/privacy-data-audit`、`/#/embodied-intelligence` 提交可见 `POST /temp/user-contact/submit`
- [ ] 请求体含 `userName` / `companyName` / `contactInformation` / `requirementDescription`
- [ ] 其它产品页联系表单仍为 mailto，不发该接口
- [ ] 样式未改布局
- [ ] 待确认项未擅自拼接管理端 CRUD
- [ ] 失败走现有 toast
