<template>
  <div class="developer-docs-page">
    <MarketingHeader />

    <div class="developer-docs-shell">
      <ProductSubNav active-key="developer-docs" :show-cta="false" />

      <section class="developer-docs-hero">
        <div class="developer-docs-hero__inner">
          <h1>👋 欢迎来到 Chat 开发文档</h1>
          <p>在这里可以查看公开 API、Webhook 与调用示例～</p>
        </div>
      </section>

      <section class="developer-docs-body">
        <div class="developer-docs-body__container">
          <aside class="developer-docs-sidebar">
            <div class="developer-docs-sidebar__inner">
              <div v-for="group in docGroups" :key="group.id" class="doc-group">
                <button
                  type="button"
                  class="doc-group__trigger"
                  :class="{ 'doc-group__trigger--open': isGroupOpen(group.id) }"
                  :aria-expanded="isGroupOpen(group.id)"
                  @click="toggleGroup(group.id)"
                >
                  <span>{{ group.title }}</span>
                  <svg class="doc-group__arrow" width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                    <path d="M3.5 5.25L7 8.75L10.5 5.25" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </button>

                <div v-show="isGroupOpen(group.id)" class="doc-group__items">
                  <button
                    v-for="item in group.items"
                    :key="item.id"
                    type="button"
                    class="doc-group__item"
                    :class="{ 'doc-group__item--active': item.id === activeDocId }"
                    @click="setActiveDoc(group.id, item.id)"
                  >
                    {{ item.label }}
                  </button>
                </div>
              </div>
            </div>
          </aside>

          <main class="developer-docs-article">
            <h2>{{ currentDoc.title }}</h2>

            <section class="developer-docs-article__intro">
              <h3>{{ currentDoc.subheading ?? currentDoc.title }}</h3>
              <p v-for="paragraph in currentDoc.intro" :key="paragraph" class="developer-docs-article__paragraph">
                {{ paragraph }}
              </p>
            </section>

            <section
              v-for="section in currentDoc.sections"
              :key="section.title"
              class="developer-docs-article__section"
            >
              <h4>{{ section.title }}</h4>

              <div v-if="section.endpoint" class="developer-docs-api">
                <span
                  class="developer-docs-api__method"
                  :class="`developer-docs-api__method--${section.endpoint.method.toLowerCase()}`"
                >
                  {{ section.endpoint.method }}
                </span>
                <code class="developer-docs-api__path">{{ section.endpoint.path }}</code>
              </div>

              <p
                v-for="paragraph in section.paragraphs ?? []"
                :key="paragraph"
                class="developer-docs-article__paragraph"
              >
                {{ paragraph }}
              </p>

              <div v-for="table in section.tables ?? []" :key="table.title ?? table.columns.join('|')" class="developer-docs-table-wrap">
                <h5 v-if="table.title" class="developer-docs-table__title">{{ table.title }}</h5>
                <div class="developer-docs-table">
                  <table>
                    <thead>
                      <tr>
                        <th v-for="column in table.columns" :key="column">{{ column }}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="row in table.rows" :key="row.join('|')">
                        <td v-for="cell in row" :key="cell">{{ cell }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div v-for="example in section.codeExamples ?? []" :key="example.title ?? example.code" class="developer-docs-code">
                <div v-if="example.title" class="developer-docs-code__title">{{ example.title }}</div>
                <pre><code>{{ example.code }}</code></pre>
              </div>

              <ul v-if="section.notes?.length" class="developer-docs-note-list">
                <li v-for="note in section.notes" :key="note">{{ note }}</li>
              </ul>
            </section>
          </main>
        </div>
      </section>

      <SiteFooter />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import MarketingHeader from '../components/layout/MarketingHeader.vue';
import ProductSubNav from '../components/layout/ProductSubNav.vue';
import SiteFooter from '../components/layout/SiteFooter.vue';

type DocTable = {
  title?: string;
  columns: string[];
  rows: string[][];
};

type DocCodeExample = {
  title?: string;
  code: string;
};

type DocEndpoint = {
  method: 'GET' | 'POST';
  path: string;
};

type DocSection = {
  title: string;
  paragraphs?: string[];
  endpoint?: DocEndpoint;
  tables?: DocTable[];
  codeExamples?: DocCodeExample[];
  notes?: string[];
};

type DocArticle = {
  id: string;
  title: string;
  subheading?: string;
  intro: string[];
  sections: DocSection[];
};

type DocGroup = {
  id: string;
  title: string;
  items: Array<{
    id: string;
    label: string;
  }>;
};

const doc = (
  id: string,
  title: string,
  intro: string[],
  sections: DocSection[],
  subheading?: string
): DocArticle => ({
  id,
  title,
  subheading,
  intro,
  sections
});

const docGroups: DocGroup[] = [
  {
    id: 'open-api',
    title: '开发文档',
    items: [
      { id: 'api-overview', label: '接口概览' },
      { id: 'auth-guide', label: '鉴权说明' },
      { id: 'customer-upsert', label: '创建或更新客户资料' },
      { id: 'session-message', label: '发送会话消息' },
      { id: 'webhook-guide', label: 'Webhook 回调' },
      { id: 'error-codes', label: '错误码' }
    ]
  }
];

const docArticles: Record<string, DocArticle> = {
  'api-overview': doc(
    'api-overview',
    '接口概览',
    [
      'TWT Chat 对外提供 REST API 与 Webhook 两类开放能力，适合把客户资料、消息上下文和业务事件接入你自己的 CRM、订单系统或自动化工作流。',
      '如果你第一次接入，建议先看鉴权说明，再按顺序调客户资料 API、消息 API 和 Webhook 回调。'
    ],
    [
      {
        title: '基础约定',
        tables: [
          {
            columns: ['项目', '说明'],
            rows: [
              ['Base URL', 'https://{your-openapi-host}/open/v1'],
              ['请求格式', 'application/json'],
              ['鉴权方式', 'Authorization: Bearer {api_key}'],
              ['字符编码', 'UTF-8']
            ]
          }
        ]
      },
      {
        title: '开放能力范围',
        paragraphs: [
          '当前公开能力主要包含客户资料同步、会话消息写入和 Webhook 事件回调。建议先把客户唯一标识打通，再逐步补充更多业务字段和自动化能力。'
        ]
      }
    ],
    '公开 API 概览'
  ),
  'auth-guide': doc(
    'auth-guide',
    '鉴权说明',
    [
      '公开 API 调用和 Webhook 回调是两套不同的安全链路。主动请求平台时使用 API Key，平台回调你的服务时使用 AppSecret 做签名校验。',
      '这个地方最容易犯的错，就是把 Bearer Token 和 AppSecret 混着用。真这么干，接口调不通不说，还很难排查。'
    ],
    [
      {
        title: 'OpenAPI 请求头',
        tables: [
          {
            columns: ['Header', '必填', '说明', '示例'],
            rows: [
              ['Authorization', '是', 'Bearer Token 形式的访问凭证', 'Bearer twt_live_xxx'],
              ['Content-Type', '是', '请求体格式', 'application/json'],
              ['X-Request-Id', '否', '请求链路追踪 ID', 'req_20260330_001']
            ]
          }
        ],
        codeExamples: [
          {
            title: 'cURL 示例',
            code: `curl -X GET https://{your-openapi-host}/open/v1/customers/cus_10001 \\
  -H "Authorization: Bearer twt_live_xxx" \\
  -H "Content-Type: application/json"`
          }
        ]
      },
      {
        title: 'Webhook 验签',
        paragraphs: [
          'Webhook 回调会通过 `x-chat-signature` 头部传入签名。你需要使用开发设置中生成的 AppSecret，对原始请求体执行 HMAC-SHA256 运算后再与该值对比。'
        ],
        codeExamples: [
          {
            title: 'Node.js 验签示例',
            code: `import crypto from "node:crypto";

const rawBody = req.rawBody;
const signature = req.headers["x-chat-signature"];
const expected = crypto
  .createHmac("sha256", process.env.TWT_APP_SECRET!)
  .update(rawBody)
  .digest("hex");

if (signature !== expected) {
  return res.status(403).json({ code: 40301, message: "invalid signature" });
}`
          }
        ],
        notes: [
          '验签一定要用原始请求体，不要把 body 重新序列化后再算，不然签名很容易对不上。'
        ]
      }
    ]
  ),
  'customer-upsert': doc(
    'customer-upsert',
    '创建或更新客户资料',
    [
      '这个接口用于把你业务系统里的客户资料同步到 Chat。只要 `customer_id` 是稳定的，你后面再补名字、邮箱、标签这些字段都不麻烦。',
      '如果客户已经存在，接口会按 `customer_id` 执行更新；如果不存在，则创建新客户。'
    ],
    [
      {
        title: '接口信息',
        endpoint: {
          method: 'POST',
          path: '/open/v1/customers/upsert'
        },
        paragraphs: [
          '建议把这个接口作为 CRM 或订单系统的统一同步出口，别让多个系统各自写入，不然字段覆盖策略迟早打架。'
        ]
      },
      {
        title: '请求头',
        tables: [
          {
            columns: ['Header', '必填', '说明'],
            rows: [
              ['Authorization', '是', 'Bearer Token 形式的 API Key'],
              ['Content-Type', '是', '固定为 application/json'],
              ['X-Request-Id', '否', '请求去重和链路追踪用']
            ]
          }
        ]
      },
      {
        title: '请求参数',
        tables: [
          {
            columns: ['字段', '类型', '必填', '说明'],
            rows: [
              ['customer_id', 'string', '是', '客户在你系统中的唯一标识'],
              ['name', 'string', '否', '客户姓名'],
              ['nickname', 'string', '否', '备注名或展示名'],
              ['email', 'string', '否', '邮箱地址'],
              ['phone', 'string', '否', '手机号或联系电话'],
              ['tags', 'string[]', '否', '客户标签列表']
            ]
          }
        ]
      },
      {
        title: '调用方式',
        codeExamples: [
          {
            title: 'cURL',
            code: `curl -X POST https://{your-openapi-host}/open/v1/customers/upsert \\
  -H "Authorization: Bearer twt_live_xxx" \\
  -H "Content-Type: application/json" \\
  -H "X-Request-Id: req_20260330_001" \\
  -d '{
    "customer_id": "cus_10001",
    "name": "Luna Chen",
    "nickname": "VIP-Luna",
    "email": "luna@example.com",
    "phone": "+86 13800000000",
    "tags": ["vip", "repeat-buyer"]
  }'`
          },
          {
            title: 'JavaScript fetch',
            code: `const response = await fetch("https://{your-openapi-host}/open/v1/customers/upsert", {
  method: "POST",
  headers: {
    "Authorization": "Bearer twt_live_xxx",
    "Content-Type": "application/json",
    "X-Request-Id": "req_20260330_001"
  },
  body: JSON.stringify({
    customer_id: "cus_10001",
    name: "Luna Chen",
    nickname: "VIP-Luna",
    email: "luna@example.com",
    phone: "+86 13800000000",
    tags: ["vip", "repeat-buyer"]
  })
});

const data = await response.json();`
          },
          {
            title: 'Node.js Axios',
            code: `import axios from "axios";

const { data } = await axios.post(
  "https://{your-openapi-host}/open/v1/customers/upsert",
  {
    customer_id: "cus_10001",
    name: "Luna Chen",
    nickname: "VIP-Luna",
    email: "luna@example.com",
    phone: "+86 13800000000",
    tags: ["vip", "repeat-buyer"]
  },
  {
    headers: {
      Authorization: "Bearer twt_live_xxx",
      "Content-Type": "application/json"
    }
  }
);`
          }
        ]
      },
      {
        title: '响应示例',
        codeExamples: [
          {
            code: `{
  "code": 0,
  "message": "ok",
  "data": {
    "customer_id": "cus_10001",
    "updated_at": "2026-03-30T10:20:00Z"
  }
}`
          }
        ],
        notes: [
          '如果你有多个来源系统，建议在 metadata 或标签层面显式标记来源，不然后面回写来源归因会很难看。',
          '高频同步建议做幂等处理，尤其是重试场景，别把同一个客户反复刷脏。'
        ]
      }
    ],
    '客户资料 API'
  ),
  'session-message': doc(
    'session-message',
    '发送会话消息',
    [
      '会话消息 API 适合把订单状态、系统通知或者外部服务消息写入指定会话，让客服和客户能看到完整上下文。'
    ],
    [
      {
        title: '接口信息',
        endpoint: {
          method: 'POST',
          path: '/open/v1/sessions/{session_id}/messages'
        }
      },
      {
        title: '请求参数',
        tables: [
          {
            columns: ['字段', '位置', '类型', '说明'],
            rows: [
              ['session_id', 'Path', 'string', '目标会话 ID'],
              ['sender', 'Body', 'string', '消息发送者类型，如 system / agent'],
              ['message_type', 'Body', 'string', '消息类型，默认 text'],
              ['content', 'Body', 'string', '消息正文'],
              ['metadata', 'Body', 'object', '扩展字段，可写订单号、来源系统等']
            ]
          }
        ],
        codeExamples: [
          {
            title: '请求示例',
            code: `{
  "sender": "system",
  "message_type": "text",
  "content": "你的订单 20260330001 已发货，预计 24 小时内更新物流信息。",
  "metadata": {
    "order_id": "20260330001",
    "source": "oms"
  }
}`
          }
        ]
      }
    ]
  ),
  'webhook-guide': doc(
    'webhook-guide',
    'Webhook 回调',
    [
      'Webhook 用于把平台事件实时推送到你的服务。当前公开文档主要覆盖通用回调结构和访客消息未回复事件。'
    ],
    [
      {
        title: '配置流程',
        paragraphs: [
          '1. 在开发设置中生成 AppSecret。',
          '2. 在 Webhooks 页面填写你的 HTTPS 接收地址并保存。',
          '3. 服务端按 `x-chat-signature = HMAC-SHA256(AppSecret, raw_body)` 校验请求后再消费事件。'
        ]
      },
      {
        title: '请求头',
        tables: [
          {
            columns: ['Header', '说明', '示例'],
            rows: [
              ['content-type', '固定为 JSON 请求体', 'application/json'],
              ['x-chat-signature', '回调签名，用于来源验证', '4ecdcaf813c422d34413671b2ed68e0a6e69ea8496d34ab40bd33cef26571e70']
            ]
          }
        ]
      },
      {
        title: '请求体结构',
        tables: [
          {
            columns: ['字段', '说明', '示例'],
            rows: [
              ['created_at', 'webhook 发送时间戳', '1765439941'],
              ['event', '事件名称', 'UNREPLIED'],
              ['webhook_id', '唯一的 webhook ID', '58946f5f583edd94f5cf87e3534d04fb'],
              ['content', '事件详细数据', '-']
            ]
          }
        ],
        codeExamples: [
          {
            title: 'Webhook 示例',
            code: `{
  "created_at": 1765439941,
  "event": "UNREPLIED",
  "webhook_id": "58946f5f583edd94f5cf87e3534d04fb",
  "content": [
    {
      "subject": "New Conversation",
      "visitor_name": "Visitor15",
      "created_at": 1765439652,
      "message_content": "Can you help me check the order status?",
      "property_name": "global-store",
      "visitor_nickname": "VIP",
      "sbs": "234442313",
      "status": "1",
      "push_times": 2,
      "time_sec": 289,
      "assigned_agent_nickname": "Mia"
    }
  ]
}`
          }
        ]
      }
    ]
  ),
  'error-codes': doc(
    'error-codes',
    '错误码',
    [
      '建议在接入时先把错误按鉴权失败、参数错误、资源不存在和频率限制这几类分开处理，不然日志会像一锅粥。'
    ],
    [
      {
        title: '常见错误码',
        tables: [
          {
            columns: ['HTTP 状态', '业务码', '说明', '建议处理'],
            rows: [
              ['400', '40001', '请求参数缺失或格式不合法', '检查字段类型和必填项'],
              ['401', '40101', '凭证无效或已过期', '更新 API Key，重新发起请求'],
              ['403', '40301', '签名校验失败或权限不足', '检查签名算法、角色权限和应用配置'],
              ['404', '40401', '目标客户或会话不存在', '确认资源 ID 是否正确'],
              ['429', '42901', '请求频率超限', '退避重试，并控制并发'],
              ['500', '50001', '服务内部异常', '记录请求 ID，联系平台支持排查']
            ]
          }
        ]
      }
    ]
  )
};

const defaultDocId = 'customer-upsert';
const activeDocId = ref(defaultDocId);
const openGroupIds = ref<string[]>(['open-api']);

const currentDoc = computed(() => docArticles[activeDocId.value] ?? docArticles[defaultDocId]);

const isGroupOpen = (groupId: string) => openGroupIds.value.includes(groupId);

const toggleGroup = (groupId: string) => {
  if (isGroupOpen(groupId)) {
    openGroupIds.value = openGroupIds.value.filter((id) => id !== groupId);
    return;
  }

  openGroupIds.value = [...openGroupIds.value, groupId];
};

const setActiveDoc = (groupId: string, docId: string) => {
  activeDocId.value = docId;

  if (!isGroupOpen(groupId)) {
    openGroupIds.value = [...openGroupIds.value, groupId];
  }
};
</script>

<style scoped>
.developer-docs-page {
  min-height: 100vh;
  background: #fff;
}

.developer-docs-shell {
  background: #fff;
}

.developer-docs-hero {
  background: #f3f6fc;
  padding: 82px 24px 92px;
  text-align: center;
}

.developer-docs-hero__inner {
  max-width: 1200px;
  margin: 0 auto;
}

.developer-docs-hero h1 {
  margin: 0;
  font-size: clamp(38px, 5.1vw, 72px);
  line-height: 1.18;
  font-weight: 600;
  color: var(--links-color-text-primary);
}

.developer-docs-hero p {
  margin: 28px 0 0;
  font-size: 16px;
  color: #70788c;
}

.developer-docs-body {
  padding: 42px 0 88px;
}

.developer-docs-body__container {
  display: grid;
  grid-template-columns: 320px minmax(0, 1fr);
  gap: 44px;
  align-items: start;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 24px;
}

.developer-docs-sidebar__inner {
  padding: 22px 18px;
  border-radius: 16px;
  background: #f7f8fb;
}

.doc-group + .doc-group {
  margin-top: 4px;
}

.doc-group__trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 12px 12px;
  border: none;
  background: transparent;
  font: inherit;
  font-size: 16px;
  font-weight: 600;
  color: var(--links-color-text-primary);
  text-align: left;
  cursor: pointer;
}

.doc-group__trigger--open {
  color: var(--links-color-primary);
}

.doc-group__arrow {
  flex-shrink: 0;
  color: #8b93a6;
  transition: transform var(--links-motion-fast);
}

.doc-group__trigger--open .doc-group__arrow {
  transform: rotate(180deg);
}

.doc-group__items {
  margin: 4px 0 10px 22px;
  padding: 6px 0 2px 24px;
}

.doc-group__item {
  display: block;
  width: 100%;
  padding: 12px 0;
  border: none;
  background: transparent;
  font: inherit;
  font-size: 15px;
  color: #3f4758;
  text-align: left;
  cursor: pointer;
}

.doc-group__item--active {
  color: var(--links-color-primary);
}

.developer-docs-article {
  min-width: 0;
  color: #2e3445;
}

.developer-docs-article h2 {
  margin: 0 0 38px;
  font-size: clamp(34px, 4vw, 52px);
  line-height: 1.18;
  font-weight: 600;
  color: var(--links-color-text-primary);
}

.developer-docs-article__intro {
  margin-bottom: 32px;
}

.developer-docs-article__intro h3,
.developer-docs-article__section h4 {
  margin: 0 0 16px;
  font-size: 18px;
  line-height: 1.5;
  font-weight: 600;
  color: var(--links-color-text-primary);
}

.developer-docs-article__section {
  margin-top: 34px;
}

.developer-docs-article__paragraph {
  margin: 0 0 16px;
  font-size: 16px;
  line-height: 1.95;
  color: #3f4758;
}

.developer-docs-api {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 0 0 16px;
  padding: 12px 14px;
  border-radius: 12px;
  background: #f7f8fb;
  overflow-x: auto;
}

.developer-docs-api__method {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 56px;
  min-height: 28px;
  padding: 0 10px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 700;
  flex-shrink: 0;
}

.developer-docs-api__method--get {
  background: #eef7ff;
  color: #1677ff;
}

.developer-docs-api__method--post {
  background: #edf8ef;
  color: #2b8a3e;
}

.developer-docs-api__path {
  font-size: 14px;
  color: #1f2433;
  white-space: nowrap;
}

.developer-docs-table-wrap + .developer-docs-table-wrap {
  margin-top: 16px;
}

.developer-docs-table__title,
.developer-docs-code__title {
  margin: 0 0 10px;
  font-size: 14px;
  font-weight: 600;
  color: #2e3445;
}

.developer-docs-table {
  margin: 0 0 20px;
  overflow-x: auto;
  border-radius: 12px;
  background: #f7f8fb;
}

.developer-docs-table table {
  width: 100%;
  min-width: 640px;
  border-collapse: collapse;
}

.developer-docs-table th,
.developer-docs-table td {
  padding: 14px 16px;
  border-bottom: 1px solid #e3e7ef;
  text-align: left;
  vertical-align: top;
  font-size: 14px;
  line-height: 1.8;
  color: #3f4758;
}

.developer-docs-table th {
  font-weight: 600;
  color: #1f2433;
  background: #f1f3f8;
}

.developer-docs-table tbody tr:last-child td {
  border-bottom: none;
}

.developer-docs-code {
  margin: 0 0 20px;
  overflow-x: auto;
}

.developer-docs-code pre {
  margin: 0;
  padding: 18px 20px;
  border-radius: 12px;
  background: #f7f8fb;
  font-size: 13px;
  line-height: 1.8;
  color: #1f2433;
}

.developer-docs-code code,
.developer-docs-api__path {
  font-family: SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;
}

.developer-docs-note-list {
  margin: 0;
  padding-left: 20px;
  color: #566074;
}

.developer-docs-note-list li {
  margin-bottom: 10px;
  font-size: 14px;
  line-height: 1.8;
}

@media (max-width: 960px) {
  .developer-docs-body__container {
    grid-template-columns: 1fr;
    gap: 32px;
  }
}

@media (max-width: 768px) {
  .developer-docs-hero {
    padding: 62px 16px 72px;
  }

  .developer-docs-body {
    padding: 28px 0 72px;
  }

  .developer-docs-body__container {
    padding: 0 16px;
  }

  .developer-docs-article h2 {
    margin-bottom: 26px;
  }

  .developer-docs-article__paragraph {
    font-size: 15px;
  }

  .developer-docs-table th,
  .developer-docs-table td {
    font-size: 13px;
    padding: 12px 14px;
  }
}
</style>
