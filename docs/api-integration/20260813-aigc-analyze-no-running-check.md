# 对接纪要：AIGC 算法调用前置检查

- **日期：** 2026-08-13
- **范围：** 在线体验 AIGC 分析（`submitAnalyze` / `analyzeText` / `analyzeFile`）
- **相关路径：** `src/api/aigc/index.ts`、`src/hooks/useAigcAnalyze.ts`
- **OpenAPI：** 网关 `/api/aigc/*`

## 变更记录

| 日期 | 说明 |
| --- | --- |
| 2026-08-13 | 取消 analyze 前对 `/api/aigc/algorithms` 的 `running` / `port_open` 门禁，改为直接调用对应 analyze 接口 |
| 2026-08-13 | analyze HTTP 200 但 `status=failed` 时，解析 `error` 并抛错，页面 toast / 错误区可见（如 GLM 429 限流） |
| 2026-08-13 | 文本审核成功体按 newUI 结果区展示：结论卡、三项统计、风险维度条、检测证据、处置建议 |

## 已对接（可联调）

| 能力 | 接口 | 前端封装 | 备注 |
| --- | --- | --- | --- |
| 文本分析 | `POST /api/aigc/{key}/api/analyze` | `analyzeText` | 不再前置检查 running |
| 文件分析 | `POST /api/aigc/{key}/api/analyze` | `analyzeFile` | 同上 |
| 算法列表 | `GET /api/aigc/algorithms` | `listAigcAlgorithms` 等 | 仍保留查询能力，不作为 analyze 门禁 |

## 结论

原先 `ensureAlgorithmAvailable` 会先拉算法列表，若 `running`/`port_open` 为 false 则抛错阻断调用。按产品约定：**拿到算法后直接调对应接口即可**，服务可用性由后端/网关在 analyze 响应中体现。

## 业务失败体（HTTP 200）

算法侧可能返回：

```json
{ "status": "failed", "error": "GLM API调用失败: 429, {\"error\":{\"message\":\"您的账户已达到速率限制...\"}}" }
```

前端 `assertAigcAnalyzeSuccess` 识别后抛错；文案优先取嵌套 `message`，否则用原始 `error`。

## 联调验收

- [ ] 在线体验文本/图片等模态点击检测，Network 仅见 `POST .../api/analyze`（分析路径上无强制 `/algorithms` 门禁请求）
- [ ] 算法未就绪时由接口错误态提示，不再出现前端「算法服务未启动」前置文案
- [ ] `status=failed` 时页面 toast + 结果区红色错误文案可见，不出现空结果「检测完成」
