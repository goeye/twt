export type ApiDocMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

export type ApiDocCodeLanguage =
  | "bash"
  | "curl"
  | "json"
  | "javascript"
  | "typescript"
  | "python"
  | "http";

export interface ApiDocTable {
  id: string;
  title?: string;
  columns: string[];
  rows: string[][];
}

export interface ApiDocCodeExample {
  id: string;
  title?: string;
  language: ApiDocCodeLanguage;
  code: string;
}

export interface ApiDocEndpoint {
  method: ApiDocMethod;
  path: string;
  baseUrl?: string;
}

export interface ApiDocSection {
  id: string;
  title: string;
  paragraphs: string[];
  endpoint?: ApiDocEndpoint;
  tables: ApiDocTable[];
  codeExamples: ApiDocCodeExample[];
  notes: string[];
}

export interface ApiDocRecord {
  id: number;
  slug: string;
  title: string;
  navLabel: string;
  groupId: string;
  groupTitle: string;
  summary: string;
  subheading?: string;
  intro: string[];
  sections: ApiDocSection[];
  status: "draft" | "published";
  createdAt: string;
  updatedAt: string;
}

export const apiDocsData: ApiDocRecord[] = [
  {
    id: 1,
    slug: "api-overview",
    title: "接口概览",
    navLabel: "接口概览",
    groupId: "open-api",
    groupTitle: "开发文档",
    summary: "说明公开 API 的基础约定、鉴权方式和开放能力范围。",
    subheading: "公开 API 概览",
    intro: [
      "TWT Chat 对外提供 REST API 与 Webhook 两类开放能力，适合把客户资料、消息上下文和业务事件接入你自己的 CRM、订单系统或自动化工作流。",
      "如果你第一次接入，建议先看鉴权说明，再按顺序调客户资料 API、消息 API 和 Webhook 回调。"
    ],
    sections: [
      {
        id: "overview-basic",
        title: "基础约定",
        paragraphs: [],
        tables: [
          {
            id: "overview-basic-table",
            columns: ["项目", "说明"],
            rows: [
              ["Base URL", "https://{your-openapi-host}/open/v1"],
              ["请求格式", "application/json"],
              ["鉴权方式", "Authorization: Bearer {api_key}"],
              ["字符编码", "UTF-8"]
            ]
          }
        ],
        codeExamples: [],
        notes: []
      },
      {
        id: "overview-scope",
        title: "开放能力范围",
        paragraphs: [
          "当前公开能力主要包含客户资料同步、会话消息写入和 Webhook 事件回调。建议先把客户唯一标识打通，再逐步补充更多业务字段和自动化能力。"
        ],
        tables: [],
        codeExamples: [],
        notes: [
          "先调通客户资料 API，再接消息 API，排查链路会简单很多。",
          "请求和响应统一使用 UTF-8 编码，避免中文字段乱码。"
        ]
      }
    ],
    status: "published",
    createdAt: "2026-03-30 10:00:00",
    updatedAt: "2026-03-30 10:00:00"
  },
  {
    id: 2,
    slug: "auth-guide",
    title: "鉴权说明",
    navLabel: "鉴权说明",
    groupId: "open-api",
    groupTitle: "开发文档",
    summary: "配置 Bearer Token 与 Webhook 签名校验的完整说明。",
    subheading: "请求鉴权与回调验签",
    intro: [
      "公开 API 调用和 Webhook 回调是两套不同的安全链路。主动请求平台时使用 API Key，平台回调你的服务时使用 AppSecret 做签名校验。",
      "Bearer Token 和 AppSecret 不是一回事，你要是把这俩混着填，接口能通才见鬼。"
    ],
    sections: [
      {
        id: "auth-request-headers",
        title: "OpenAPI 请求头",
        paragraphs: [],
        tables: [
          {
            id: "auth-request-headers-table",
            title: "Header 说明",
            columns: ["Header", "必填", "说明", "示例"],
            rows: [
              ["Authorization", "是", "Bearer Token 形式的访问凭证", "Bearer twt_live_xxx"],
              ["Content-Type", "是", "请求体格式", "application/json"],
              ["X-Request-Id", "否", "请求链路追踪 ID", "req_20260330_001"]
            ]
          }
        ],
        codeExamples: [
          {
            id: "auth-curl",
            title: "cURL 示例",
            language: "curl",
            code: `curl -X GET https://{your-openapi-host}/open/v1/customers/cus_10001 \\
  -H "Authorization: Bearer twt_live_xxx" \\
  -H "Content-Type: application/json"`
          }
        ],
        notes: [
          "线上和测试环境请使用不同的 API Key，别图省事混用。",
          "建议每次请求都透传 X-Request-Id，线上排错很省命。"
        ]
      },
      {
        id: "auth-webhook-signature",
        title: "Webhook 验签",
        paragraphs: [
          "平台回调你的服务时，会在 Header 中附带时间戳和签名。你需要使用 AppSecret 与原始请求体重新计算签名，和 Header 中的值进行比对。",
          "验签一定要基于原始 body。很多人中间先 JSON.parse 再 stringify，一来一回签名就变了。"
        ],
        tables: [
          {
            id: "auth-webhook-signature-table",
            columns: ["Header", "说明"],
            rows: [
              ["X-TWT-Timestamp", "回调发起的 Unix 时间戳"],
              ["X-TWT-Signature", "HMAC-SHA256 签名结果"]
            ]
          }
        ],
        codeExamples: [
          {
            id: "auth-webhook-node",
            title: "Node.js 验签示例",
            language: "typescript",
            code: `import crypto from "node:crypto";

function verifySignature(timestamp: string, rawBody: string, signature: string, appSecret: string) {
  const payload = \`\${timestamp}.\${rawBody}\`;
  const expected = crypto
    .createHmac("sha256", appSecret)
    .update(payload, "utf8")
    .digest("hex");

  return expected === signature;
}`
          }
        ],
        notes: [
          "建议校验时间戳有效期，比如 5 分钟内有效，防止重放攻击。"
        ]
      }
    ],
    status: "published",
    createdAt: "2026-03-30 10:30:00",
    updatedAt: "2026-03-30 10:30:00"
  },
  {
    id: 3,
    slug: "session-message",
    title: "发送会话消息",
    navLabel: "发送会话消息",
    groupId: "open-api",
    groupTitle: "开发文档",
    summary: "向指定会话写入消息，支持服务端主动同步业务消息。",
    subheading: "POST /sessions/{session_id}/messages",
    intro: [
      "这个接口用于向指定会话主动写入一条消息，适合订单系统、CRM 或自动化任务把业务动作同步到 Chat 会话中。",
      "如果你的业务要做状态通知、人工接管提示或者外部系统回写，基本都会用到这个接口。"
    ],
    sections: [
      {
        id: "session-message-endpoint",
        title: "接口定义",
        paragraphs: [
          "发送成功后会返回 message_id、session_id 和服务端记录时间。消息写入后可在会话详情页中查看。"
        ],
        endpoint: {
          method: "POST",
          path: "/sessions/{session_id}/messages",
          baseUrl: "https://{your-openapi-host}/open/v1"
        },
        tables: [
          {
            id: "session-message-headers",
            title: "请求头",
            columns: ["Header", "必填", "说明"],
            rows: [
              ["Authorization", "是", "Bearer Token 访问凭证"],
              ["Content-Type", "是", "固定为 application/json"]
            ]
          },
          {
            id: "session-message-body",
            title: "Body 参数",
            columns: ["字段", "类型", "必填", "说明"],
            rows: [
              ["sender_type", "string", "是", "消息发送方，如 system、agent"],
              ["content", "string", "是", "消息正文"],
              ["content_type", "string", "否", "默认 text，可扩展 markdown、json"],
              ["metadata", "object", "否", "业务透传字段"]
            ]
          },
          {
            id: "session-message-response",
            title: "响应示例字段",
            columns: ["字段", "类型", "说明"],
            rows: [
              ["code", "number", "业务状态码，0 表示成功"],
              ["message", "string", "状态信息"],
              ["data.message_id", "string", "平台生成的消息 ID"],
              ["data.session_id", "string", "当前会话 ID"]
            ]
          }
        ],
        codeExamples: [
          {
            id: "session-message-curl",
            title: "cURL 调用方式",
            language: "curl",
            code: `curl -X POST https://{your-openapi-host}/open/v1/sessions/ses_20260330/messages \\
  -H "Authorization: Bearer twt_live_xxx" \\
  -H "Content-Type: application/json" \\
  -d '{
    "sender_type": "system",
    "content": "订单 O20260330001 已支付成功",
    "content_type": "text",
    "metadata": {
      "order_id": "O20260330001",
      "biz_scene": "order_paid"
    }
  }'`
          },
          {
            id: "session-message-fetch",
            title: "fetch 示例",
            language: "javascript",
            code: `await fetch("https://{your-openapi-host}/open/v1/sessions/ses_20260330/messages", {
  method: "POST",
  headers: {
    Authorization: "Bearer twt_live_xxx",
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    sender_type: "system",
    content: "订单 O20260330001 已支付成功",
    content_type: "text",
    metadata: {
      order_id: "O20260330001",
      biz_scene: "order_paid"
    }
  })
});`
          }
        ],
        notes: [
          "content_type 暂时建议优先使用 text，最稳。",
          "metadata 适合塞业务主键，但别把敏感信息一股脑全塞进去。"
        ]
      }
    ],
    status: "draft",
    createdAt: "2026-03-30 11:00:00",
    updatedAt: "2026-03-30 11:00:00"
  }
];
