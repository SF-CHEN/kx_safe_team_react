import React from "react";

// ─── Autonomous Driving Mock ────────────────────────────────────────
export function AutonomousDrivingMock() {
  const signs = [
    {
      label: "停车标志",
      status: "ok",
      conf: 99.1,
      attacked: false,
    },
    {
      label: "限速 60",
      status: "fail",
      conf: 12.4,
      attacked: true,
    },
    {
      label: "禁止驶入",
      status: "ok",
      conf: 97.8,
      attacked: false,
    },
    {
      label: "前方弯道",
      status: "fail",
      conf: 8.7,
      attacked: true,
    },
    {
      label: "让行标志",
      status: "ok",
      conf: 98.3,
      attacked: false,
    },
    {
      label: "学校路段",
      status: "fail",
      conf: 5.2,
      attacked: true,
    },
  ];
  const attacks = [
    { name: "FGSM", status: "done", found: 3 },
    { name: "PGD", status: "done", found: 2 },
    { name: "C&W", status: "running", found: 1 },
  ];

  return (
    <div
      style={{
        background: "#0d1117",
        borderRadius: 12,
        overflow: "hidden",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <div
        style={{
          padding: "9px 14px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <div
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: "#3b82f6",
            boxShadow: "0 0 6px #3b82f6",
            flexShrink: 0,
          }}
        />
        <span
          style={{
            color: "#e2e8f0",
            fontSize: 12,
            fontWeight: 700,
          }}
        >
          对抗鲁棒性测试报告
        </span>
        <div
          style={{
            marginLeft: "auto",
            display: "flex",
            gap: 6,
          }}
        >
          <span
            style={{
              padding: "1px 7px",
              background: "rgba(59,130,246,0.12)",
              border: "1px solid rgba(59,130,246,0.3)",
              borderRadius: 4,
              color: "#60a5fa",
              fontSize: 10,
            }}
          >
            6 标志测试
          </span>
          <span
            style={{
              padding: "1px 7px",
              background: "rgba(239,68,68,0.12)",
              border: "1px solid rgba(239,68,68,0.3)",
              borderRadius: 4,
              color: "#f87171",
              fontSize: 10,
            }}
          >
            3 失效
          </span>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 140px",
        }}
      >
        <div
          style={{
            padding: "10px",
            display: "grid",
            gridTemplateColumns: "repeat(3,1fr)",
            gap: 5,
          }}
        >
          {signs.map((s, i) => (
            <div
              key={i}
              style={{
                borderRadius: 6,
                overflow: "hidden",
                border: `1.5px solid ${s.attacked ? "#ef4444" : "rgba(255,255,255,0.06)"}`,
                position: "relative",
                background: s.attacked
                  ? "rgba(239,68,68,0.08)"
                  : "linear-gradient(135deg,#1a2540,#0d1525)",
                padding: "8px",
                boxShadow: s.attacked
                  ? "0 0 8px rgba(239,68,68,0.3)"
                  : "none",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: 28,
                  marginBottom: 4,
                }}
              >
                <div
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: s.label.includes("停车")
                      ? "50%"
                      : 4,
                    background: s.attacked
                      ? "rgba(239,68,68,0.3)"
                      : "rgba(59,130,246,0.25)",
                    border: `1.5px solid ${s.attacked ? "#ef4444" : "#3b82f6"}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <span
                    style={{
                      fontSize: 9,
                      color: s.attacked ? "#f87171" : "#60a5fa",
                      fontWeight: 700,
                    }}
                  >
                    {s.attacked ? "?" : "✓"}
                  </span>
                </div>
              </div>
              <div
                style={{
                  fontSize: 8,
                  color: "rgba(255,255,255,0.55)",
                  textAlign: "center",
                  lineHeight: 1.3,
                }}
              >
                {s.label}
              </div>
              <div
                style={{
                  fontSize: 9,
                  fontWeight: 700,
                  color: s.attacked ? "#f87171" : "#4ade80",
                  textAlign: "center",
                  marginTop: 2,
                }}
              >
                {s.conf.toFixed(1)}%
              </div>
              {s.attacked && (
                <div
                  style={{
                    position: "absolute",
                    top: 2,
                    right: 2,
                    padding: "1px 3px",
                    background: "#ef4444",
                    borderRadius: 2,
                    fontSize: 7,
                    color: "#fff",
                    fontWeight: 700,
                  }}
                >
                  FAIL
                </div>
              )}
            </div>
          ))}
        </div>
        <div
          style={{
            borderLeft: "1px solid rgba(255,255,255,0.06)",
            padding: "10px",
          }}
        >
          <div
            style={{
              fontSize: 9,
              color: "#475569",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              marginBottom: 7,
            }}
          >
            攻击算法
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 6,
            }}
          >
            {attacks.map((a, i) => (
              <div
                key={i}
                style={{
                  padding: "6px 8px",
                  borderRadius: 6,
                  background:
                    a.status === "running"
                      ? "rgba(251,146,60,0.08)"
                      : "rgba(59,130,246,0.06)",
                  border: `1px solid ${a.status === "running" ? "rgba(251,146,60,0.25)" : "rgba(59,130,246,0.18)"}`,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{
                      fontSize: 9.5,
                      fontWeight: 700,
                      color:
                        a.status === "running"
                          ? "#fb923c"
                          : "#60a5fa",
                    }}
                  >
                    {a.name}
                  </span>
                  <span
                    style={{
                      fontSize: 8,
                      color:
                        a.status === "running"
                          ? "#fb923c"
                          : "#4ade80",
                    }}
                  >
                    {a.status === "running" ? "运行中" : "完成"}
                  </span>
                </div>
                <div
                  style={{
                    fontSize: 8,
                    color: "#64748b",
                    marginTop: 2,
                  }}
                >
                  发现 {a.found} 个漏洞
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div
        style={{
          padding: "7px 14px",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          background: "rgba(255,255,255,0.02)",
          display: "flex",
          gap: 20,
        }}
      >
        {[
          {
            label: "鲁棒性得分",
            value: "51/100",
            accent: "#ef4444",
          },
          {
            label: "攻击成功率",
            value: "50%",
            accent: "#f97316",
          },
          { label: "平均置信度", value: "53.6%" },
          {
            label: "建议",
            value: "对抗训练",
            accent: "#3b82f6",
          },
        ].map((s) => (
          <div key={s.label}>
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: (s as any).accent ?? "#e2e8f0",
              }}
            >
              {s.value}
            </div>
            <div style={{ fontSize: 8.5, color: "#475569" }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Financial Risk PII Mock ──────────────────────────────────────────
export function FinancialRiskMock() {
  const piiFields = [
    {
      field: "user_id_card",
      type: "身份证号",
      count: 87,
      risk: "HIGH",
      color: "#ef4444",
    },
    {
      field: "phone_number",
      type: "手机号码",
      count: 1240,
      risk: "HIGH",
      color: "#ef4444",
    },
    {
      field: "credit_score",
      type: "信用评分",
      count: 3200,
      risk: "MEDIUM",
      color: "#f59e0b",
    },
    {
      field: "bank_account",
      type: "银行卡号",
      count: 245,
      risk: "HIGH",
      color: "#ef4444",
    },
    {
      field: "user_address",
      type: "家庭住址",
      count: 1100,
      risk: "MEDIUM",
      color: "#f59e0b",
    },
    {
      field: "loan_history",
      type: "贷款记录",
      count: 5600,
      risk: "LOW",
      color: "#10b981",
    },
  ];
  const riskColor: Record<string, string> = {
    HIGH: "#ef4444",
    MEDIUM: "#f59e0b",
    LOW: "#10b981",
  };

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 12,
        overflow: "hidden",
        border: "1px solid #e2e8f0",
      }}
    >
      <div
        style={{
          padding: "9px 14px",
          borderBottom: "1px solid #f1f5f9",
          background: "#f8fafc",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <span
          style={{
            fontSize: 12,
            fontWeight: 700,
            color: "#0f172a",
          }}
        >
          🔍 训练数据 PII 隐私扫描报告
        </span>
        <div
          style={{
            marginLeft: "auto",
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          <div
            style={{
              width: 5,
              height: 5,
              borderRadius: "50%",
              background: "#f59e0b",
              boxShadow: "0 0 5px #f59e0b",
            }}
          />
          <span style={{ fontSize: 9, color: "#64748b" }}>
            风控模型训练集
          </span>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          borderBottom: "1px solid #f1f5f9",
        }}
      >
        {[
          {
            label: "检测字段",
            value: "6 项",
            color: "#3b82f6",
          },
          { label: "高风险", value: "3 项", color: "#ef4444" },
          {
            label: "需脱敏",
            value: "1,572 条",
            color: "#f59e0b",
          },
        ].map((s, i) => (
          <div
            key={s.label}
            style={{
              padding: "8px 10px",
              textAlign: "center",
              borderRight: i < 2 ? "1px solid #f1f5f9" : "none",
            }}
          >
            <div
              style={{
                fontSize: 15,
                fontWeight: 800,
                color: s.color,
              }}
            >
              {s.value}
            </div>
            <div
              style={{
                fontSize: 9,
                color: "#94a3b8",
                marginTop: 1,
              }}
            >
              {s.label}
            </div>
          </div>
        ))}
      </div>

      <div style={{ padding: "8px 12px" }}>
        {piiFields.map((f, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "5px 0",
              borderBottom:
                i < piiFields.length - 1
                  ? "1px solid #f8fafc"
                  : "none",
            }}
          >
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: riskColor[f.risk],
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontSize: 10,
                color: "#374151",
                flex: 1,
              }}
            >
              {f.type}
            </span>
            <span style={{ fontSize: 9, color: "#94a3b8" }}>
              {f.count.toLocaleString()} 条
            </span>
            <span
              style={{
                fontSize: 9,
                padding: "1px 6px",
                borderRadius: 4,
                background: `${riskColor[f.risk]}15`,
                color: riskColor[f.risk],
                fontWeight: 700,
              }}
            >
              {f.risk}
            </span>
          </div>
        ))}
      </div>

      <div
        style={{
          padding: "7px 14px",
          borderTop: "1px solid #f1f5f9",
          background: "#fef2f2",
          display: "flex",
          gap: 8,
          alignItems: "center",
        }}
      >
        <span
          style={{
            fontSize: 9,
            color: "#ef4444",
            fontWeight: 700,
          }}
        >
          ⚠ 合规状态：不合规
        </span>
        <span
          style={{
            marginLeft: "auto",
            padding: "2px 8px",
            background: "#3b82f6",
            color: "#fff",
            borderRadius: 6,
            fontSize: 9,
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          一键脱敏处理
        </span>
      </div>
    </div>
  );
}

// ─── LLM Finetune Privacy Mock ────────────────────────────────────────
export function LLMFinetuneMock() {
  const risks = [
    {
      label: "商业合同条款",
      risk: 98,
      color: "#ef4444",
      icon: "📑",
    },
    {
      label: "产品路线图",
      risk: 87,
      color: "#ef4444",
      icon: "🗺️",
    },
    {
      label: "客户数据列表",
      risk: 75,
      color: "#f59e0b",
      icon: "👥",
    },
    {
      label: "内部技术文档",
      risk: 62,
      color: "#f59e0b",
      icon: "📂",
    },
  ];
  const samples = [
    {
      text: "公司2026年Q3将发布...",
      flag: "商业机密",
      color: "#ef4444",
    },
    {
      text: "与XX客户签署的协议金额...",
      flag: "PII+机密",
      color: "#ef4444",
    },
    {
      text: "内部服务器地址为192.168...",
      flag: "敏感配置",
      color: "#f59e0b",
    },
  ];

  return (
    <div
      style={{
        background: "#0d1117",
        borderRadius: 12,
        overflow: "hidden",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <div
        style={{
          padding: "9px 14px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <div
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: "#a78bfa",
            boxShadow: "0 0 6px #a78bfa",
            flexShrink: 0,
          }}
        />
        <span
          style={{
            color: "#e2e8f0",
            fontSize: 12,
            fontWeight: 700,
          }}
        >
          微调数据集隐私风险扫描
        </span>
        <div style={{ marginLeft: "auto" }}>
          <span
            style={{
              padding: "1px 7px",
              background: "rgba(167,139,250,0.12)",
              border: "1px solid rgba(167,139,250,0.3)",
              borderRadius: 4,
              color: "#c4b5fd",
              fontSize: 10,
            }}
          >
            企业知识库
          </span>
        </div>
      </div>

      <div style={{ padding: "10px 12px" }}>
        <div
          style={{
            fontSize: 9,
            color: "#475569",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            marginBottom: 8,
          }}
        >
          数据类别风险评分
        </div>
        {risks.map((r, i) => (
          <div key={i} style={{ marginBottom: 8 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 3,
              }}
            >
              <span
                style={{
                  fontSize: 9.5,
                  color: "rgba(255,255,255,0.65)",
                }}
              >
                {r.icon} {r.label}
              </span>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: r.color,
                }}
              >
                {r.risk}%
              </span>
            </div>
            <div
              style={{
                height: 4,
                background: "rgba(255,255,255,0.06)",
                borderRadius: 2,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${r.risk}%`,
                  background: r.color,
                  borderRadius: 2,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          borderTop: "1px solid rgba(255,255,255,0.06)",
          padding: "8px 12px",
        }}
      >
        <div
          style={{
            fontSize: 9,
            color: "#475569",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            marginBottom: 6,
          }}
        >
          高危样本示例
        </div>
        {samples.map((s, i) => (
          <div
            key={i}
            style={{
              padding: "5px 8px",
              marginBottom: 4,
              borderRadius: 5,
              background: "rgba(239,68,68,0.07)",
              border: `1px solid ${s.color}30`,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span
              style={{
                fontSize: 9,
                color: "rgba(255,255,255,0.5)",
                flex: 1,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {s.text}
            </span>
            <span
              style={{
                fontSize: 8,
                padding: "1px 5px",
                background: `${s.color}20`,
                color: s.color,
                borderRadius: 3,
                fontWeight: 700,
                whiteSpace: "nowrap",
              }}
            >
              {s.flag}
            </span>
          </div>
        ))}
      </div>

      <div
        style={{
          padding: "7px 14px",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          background: "rgba(167,139,250,0.06)",
          display: "flex",
          gap: 16,
          alignItems: "center",
        }}
      >
        {[
          {
            label: "过拟合风险",
            value: "高",
            accent: "#ef4444",
          },
          {
            label: "机密泄露风险",
            value: "严重",
            accent: "#dc2626",
          },
          {
            label: "建议",
            value: "深度脱敏",
            accent: "#a78bfa",
          },
        ].map((s) => (
          <div key={s.label}>
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: s.accent,
              }}
            >
              {s.value}
            </div>
            <div style={{ fontSize: 8.5, color: "#475569" }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}