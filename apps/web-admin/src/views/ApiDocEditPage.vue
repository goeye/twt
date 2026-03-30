<template>
  <div class="api-doc-edit-page">
    <div class="section-block">
      <a-alert message="API 文档支持的格式" type="info" show-icon class="format-alert">
        <template #description>
          <div class="format-alert__description">
            <p>文本段落：简介和章节说明都按一行一段来填。</p>
            <p>接口块：配置 method、path、baseUrl，前台就能渲染成接口说明头。</p>
            <p>表格块：表头一行一个字段，数据行用 <code>|</code> 分隔列。</p>
            <p>代码块：选择语言后直接贴代码，支持 curl、bash、JSON、JavaScript、TypeScript、Python、HTTP。</p>
            <p>注意事项：一行一条，适合写限制、排错提醒和接入建议。</p>
          </div>
        </template>
      </a-alert>

      <a-form :label-col="{ span: 4 }" :wrapper-col="{ span: 18 }">
        <h3 class="form-title">基本信息</h3>

        <a-form-item label="文档标题" required>
          <a-input v-model:value="formData.title" placeholder="例如：发送会话消息" />
        </a-form-item>

        <a-form-item label="Slug" required>
          <a-input v-model:value="formData.slug" placeholder="例如：session-message" />
        </a-form-item>

        <a-form-item label="侧边栏名称" required>
          <a-input v-model:value="formData.navLabel" placeholder="例如：发送会话消息" />
        </a-form-item>

        <a-form-item label="文档分组 ID" required>
          <a-input v-model:value="formData.groupId" placeholder="例如：open-api" />
        </a-form-item>

        <a-form-item label="文档分组名称" required>
          <a-input v-model:value="formData.groupTitle" placeholder="例如：开发文档" />
        </a-form-item>

        <a-form-item label="摘要">
          <a-textarea
            v-model:value="formData.summary"
            placeholder="列表页和运营侧可以快速识别这篇文档是干什么的"
            :rows="3"
          />
        </a-form-item>

        <a-form-item label="副标题">
          <a-input v-model:value="formData.subheading" placeholder="例如：POST /sessions/{session_id}/messages" />
        </a-form-item>

        <a-form-item label="发布状态">
          <a-radio-group v-model:value="formData.status">
            <a-radio value="published">已发布</a-radio>
            <a-radio value="draft">草稿</a-radio>
          </a-radio-group>
        </a-form-item>

        <a-divider />
        <h3 class="form-title">简介内容</h3>

        <a-form-item label="简介段落">
          <a-textarea
            v-model:value="formData.introText"
            placeholder="每行一段，例如第一段写能力简介，第二段写接入建议"
            :rows="5"
          />
        </a-form-item>

        <a-divider />
        <div class="sections-header">
          <h3 class="form-title">文档章节</h3>
          <a-button @click="addSection">
            <template #icon><PlusOutlined /></template>
            添加章节
          </a-button>
        </div>

        <div
          v-for="(section, sectionIndex) in formData.sections"
          :key="section.id"
          class="doc-section-editor"
        >
          <div class="doc-section-editor__head">
            <div class="doc-section-editor__title">章节 {{ sectionIndex + 1 }}</div>
            <a-button danger @click="removeSection(sectionIndex)">删除章节</a-button>
          </div>

          <a-form-item label="章节标题">
            <a-input v-model:value="section.title" placeholder="例如：请求头 / Body 参数 / 错误码" />
          </a-form-item>

          <a-form-item label="段落说明">
            <a-textarea
              v-model:value="section.paragraphText"
              placeholder="每行一段。适合解释接口用途、业务约束和接入建议"
              :rows="4"
            />
          </a-form-item>

          <a-form-item label="接口块">
            <div class="endpoint-editor">
              <template v-if="section.hasEndpoint">
                <div class="endpoint-editor__fields">
                  <a-select v-model:value="section.endpointMethod" style="width: 120px">
                    <a-select-option v-for="method in httpMethods" :key="method" :value="method">
                      {{ method }}
                    </a-select-option>
                  </a-select>

                  <a-input
                    v-model:value="section.endpointPath"
                    placeholder="/sessions/{session_id}/messages"
                  />

                  <a-input
                    v-model:value="section.endpointBaseUrl"
                    placeholder="https://{your-openapi-host}/open/v1"
                  />
                </div>

                <a-button danger @click="removeEndpoint(section)">移除接口块</a-button>
              </template>

              <a-button v-else @click="addEndpoint(section)">
                <template #icon><PlusOutlined /></template>
                添加接口块
              </a-button>
            </div>
          </a-form-item>

          <a-form-item label="表格配置">
            <div class="table-editor-list">
              <div
                v-for="(table, tableIndex) in section.tables"
                :key="table.id"
                class="table-editor"
              >
                <div class="block-header">
                  <div class="block-header__title">表格 {{ tableIndex + 1 }}</div>
                  <a-button danger @click="removeTable(section, tableIndex)">删除表格</a-button>
                </div>

                <a-input
                  v-model:value="table.title"
                  placeholder="表格标题，可选，例如：请求头 / Body 参数"
                />

                <a-textarea
                  v-model:value="table.columnsText"
                  :rows="3"
                  placeholder="表头配置，每行一个字段，例如&#10;字段&#10;类型&#10;说明"
                />

                <a-textarea
                  v-model:value="table.rowsText"
                  :rows="5"
                  placeholder="表格内容，每行一条记录，列之间用 | 分隔，例如&#10;sender_type | string | 消息发送方&#10;content | string | 消息正文"
                />
              </div>

              <a-button @click="addTable(section)">
                <template #icon><PlusOutlined /></template>
                添加表格
              </a-button>
            </div>
          </a-form-item>

          <a-form-item label="代码示例">
            <div class="code-editor-list">
              <div
                v-for="(example, exampleIndex) in section.codeExamples"
                :key="example.id"
                class="code-editor"
              >
                <div class="block-header">
                  <div class="block-header__title">代码块 {{ exampleIndex + 1 }}</div>
                  <a-button danger @click="removeCodeExample(section, exampleIndex)">删除代码块</a-button>
                </div>

                <div class="code-editor__meta">
                  <a-input
                    v-model:value="example.title"
                    placeholder="代码块标题，例如：cURL 调用方式"
                  />

                  <a-select v-model:value="example.language" style="width: 180px">
                    <a-select-option v-for="language in codeLanguages" :key="language" :value="language">
                      {{ language }}
                    </a-select-option>
                  </a-select>
                </div>

                <a-textarea
                  v-model:value="example.code"
                  :rows="10"
                  placeholder="直接粘贴完整代码示例"
                />
              </div>

              <a-button @click="addCodeExample(section)">
                <template #icon><PlusOutlined /></template>
                添加代码块
              </a-button>
            </div>
          </a-form-item>

          <a-form-item label="注意事项">
            <a-textarea
              v-model:value="section.notesText"
              placeholder="每行一条，例如限流、幂等、字段约束、排错提示"
              :rows="4"
            />
          </a-form-item>
        </div>
      </a-form>

      <div class="save-footer">
        <a-button type="primary" :disabled="!canSave" @click="handleSave">保存</a-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive } from "vue";
import { useRoute, useRouter } from "vue-router";
import { message } from "ant-design-vue";
import { PlusOutlined } from "@ant-design/icons-vue";
import {
  apiDocsData,
  type ApiDocCodeExample,
  type ApiDocCodeLanguage,
  type ApiDocMethod,
  type ApiDocRecord,
  type ApiDocSection,
  type ApiDocTable,
} from "../mock/apiDocsData";

type ApiDocTableForm = {
  id: string;
  title: string;
  columnsText: string;
  rowsText: string;
};

type ApiDocCodeExampleForm = {
  id: string;
  title: string;
  language: ApiDocCodeLanguage;
  code: string;
};

type ApiDocSectionForm = {
  id: string;
  title: string;
  paragraphText: string;
  hasEndpoint: boolean;
  endpointMethod: ApiDocMethod;
  endpointPath: string;
  endpointBaseUrl: string;
  tables: ApiDocTableForm[];
  codeExamples: ApiDocCodeExampleForm[];
  notesText: string;
};

type ApiDocFormState = {
  title: string;
  slug: string;
  navLabel: string;
  groupId: string;
  groupTitle: string;
  summary: string;
  subheading: string;
  introText: string;
  status: ApiDocRecord["status"];
  sections: ApiDocSectionForm[];
};

const route = useRoute();
const router = useRouter();

const isNew = computed(() => route.params.id === "new");
const httpMethods: ApiDocMethod[] = ["GET", "POST", "PUT", "DELETE", "PATCH"];
const codeLanguages: ApiDocCodeLanguage[] = [
  "curl",
  "bash",
  "json",
  "javascript",
  "typescript",
  "python",
  "http",
];

let seed = 0;

function nextId(prefix: string) {
  seed += 1;
  return `${prefix}_${Date.now()}_${seed}`;
}

function createEmptyTableForm(): ApiDocTableForm {
  return {
    id: nextId("table"),
    title: "",
    columnsText: "",
    rowsText: "",
  };
}

function createEmptyCodeExampleForm(): ApiDocCodeExampleForm {
  return {
    id: nextId("example"),
    title: "",
    language: "curl",
    code: "",
  };
}

function createEmptySectionForm(): ApiDocSectionForm {
  return {
    id: nextId("section"),
    title: "",
    paragraphText: "",
    hasEndpoint: false,
    endpointMethod: "GET",
    endpointPath: "",
    endpointBaseUrl: "",
    tables: [],
    codeExamples: [],
    notesText: "",
  };
}

function createEmptyForm(): ApiDocFormState {
  return {
    title: "",
    slug: "",
    navLabel: "",
    groupId: "open-api",
    groupTitle: "开发文档",
    summary: "",
    subheading: "",
    introText: "",
    status: "draft",
    sections: [createEmptySectionForm()],
  };
}

function joinLines(lines: string[]) {
  return lines.join("\n");
}

function splitLines(text: string) {
  return text
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function rowsToText(rows: string[][]) {
  return rows.map((row) => row.join(" | ")).join("\n");
}

function parseRows(text: string) {
  return splitLines(text).map((line) =>
    line.split("|").map((cell) => cell.trim())
  );
}

function recordToForm(record: ApiDocRecord): ApiDocFormState {
  return {
    title: record.title,
    slug: record.slug,
    navLabel: record.navLabel,
    groupId: record.groupId,
    groupTitle: record.groupTitle,
    summary: record.summary,
    subheading: record.subheading ?? "",
    introText: joinLines(record.intro),
    status: record.status,
    sections: record.sections.map((section) => ({
      id: section.id,
      title: section.title,
      paragraphText: joinLines(section.paragraphs),
      hasEndpoint: Boolean(section.endpoint),
      endpointMethod: section.endpoint?.method ?? "GET",
      endpointPath: section.endpoint?.path ?? "",
      endpointBaseUrl: section.endpoint?.baseUrl ?? "",
      tables: section.tables.map((table) => ({
        id: table.id,
        title: table.title ?? "",
        columnsText: joinLines(table.columns),
        rowsText: rowsToText(table.rows),
      })),
      codeExamples: section.codeExamples.map((example) => ({
        id: example.id,
        title: example.title ?? "",
        language: example.language,
        code: example.code,
      })),
      notesText: joinLines(section.notes),
    })),
  };
}

function tableFormToData(table: ApiDocTableForm): ApiDocTable {
  return {
    id: table.id,
    title: table.title.trim() || undefined,
    columns: splitLines(table.columnsText),
    rows: parseRows(table.rowsText),
  };
}

function codeExampleFormToData(example: ApiDocCodeExampleForm): ApiDocCodeExample {
  return {
    id: example.id,
    title: example.title.trim() || undefined,
    language: example.language,
    code: example.code,
  };
}

function sectionFormToData(section: ApiDocSectionForm): ApiDocSection {
  return {
    id: section.id,
    title: section.title.trim(),
    paragraphs: splitLines(section.paragraphText),
    endpoint: section.hasEndpoint && section.endpointPath.trim()
      ? {
          method: section.endpointMethod,
          path: section.endpointPath.trim(),
          baseUrl: section.endpointBaseUrl.trim() || undefined,
        }
      : undefined,
    tables: section.tables
      .map(tableFormToData)
      .filter((table) => table.columns.length && table.rows.length),
    codeExamples: section.codeExamples
      .map(codeExampleFormToData)
      .filter((example) => example.code.trim()),
    notes: splitLines(section.notesText),
  };
}

const formData = reactive<ApiDocFormState>(createEmptyForm());

const canSave = computed(() => {
  return Boolean(formData.title.trim() && formData.slug.trim() && formData.navLabel.trim());
});

onMounted(() => {
  if (isNew.value) return;

  const id = Number(route.params.id);
  const record = apiDocsData.find((item) => item.id === id);

  if (!record) {
    message.error("未找到 API 文档");
    router.push("/content/api-docs");
    return;
  }

  const next = recordToForm(record);
  formData.title = next.title;
  formData.slug = next.slug;
  formData.navLabel = next.navLabel;
  formData.groupId = next.groupId;
  formData.groupTitle = next.groupTitle;
  formData.summary = next.summary;
  formData.subheading = next.subheading;
  formData.introText = next.introText;
  formData.status = next.status;
  formData.sections = next.sections;
});

function addSection() {
  formData.sections.push(createEmptySectionForm());
}

function removeSection(index: number) {
  if (formData.sections.length === 1) {
    message.warning("至少保留一个章节");
    return;
  }

  formData.sections.splice(index, 1);
}

function addEndpoint(section: ApiDocSectionForm) {
  section.hasEndpoint = true;
  section.endpointMethod = "GET";
  section.endpointPath = "";
  section.endpointBaseUrl = "";
}

function removeEndpoint(section: ApiDocSectionForm) {
  section.hasEndpoint = false;
  section.endpointMethod = "GET";
  section.endpointPath = "";
  section.endpointBaseUrl = "";
}

function addTable(section: ApiDocSectionForm) {
  section.tables.push(createEmptyTableForm());
}

function removeTable(section: ApiDocSectionForm, index: number) {
  section.tables.splice(index, 1);
}

function addCodeExample(section: ApiDocSectionForm) {
  section.codeExamples.push(createEmptyCodeExampleForm());
}

function removeCodeExample(section: ApiDocSectionForm, index: number) {
  section.codeExamples.splice(index, 1);
}

function nowStr() {
  const now = new Date();
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
}

function handleSave() {
  if (!canSave.value) {
    message.warning("请先补齐标题、Slug 和侧边栏名称");
    return;
  }

  const duplicated = apiDocsData.find((item) => {
    if (item.slug !== formData.slug.trim()) return false;
    if (isNew.value) return true;
    return item.id !== Number(route.params.id);
  });

  if (duplicated) {
    message.warning("Slug 已存在，请换一个");
    return;
  }

  const sections = formData.sections
    .map(sectionFormToData)
    .filter((section) => section.title);

  if (!sections.length) {
    message.warning("至少配置一个有标题的章节");
    return;
  }

  const timestamp = nowStr();

  if (isNew.value) {
    const maxId = apiDocsData.reduce((max, item) => Math.max(max, item.id), 0);
    const newRecord: ApiDocRecord = {
      id: maxId + 1,
      slug: formData.slug.trim(),
      title: formData.title.trim(),
      navLabel: formData.navLabel.trim(),
      groupId: formData.groupId.trim(),
      groupTitle: formData.groupTitle.trim(),
      summary: formData.summary.trim(),
      subheading: formData.subheading.trim() || undefined,
      intro: splitLines(formData.introText),
      sections,
      status: formData.status,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    apiDocsData.unshift(newRecord);
    message.success("新增 API 文档成功");
  } else {
    const currentId = Number(route.params.id);
    const idx = apiDocsData.findIndex((item) => item.id === currentId);
    if (idx === -1) {
      message.error("未找到 API 文档");
      return;
    }

    apiDocsData[idx] = {
      ...apiDocsData[idx],
      slug: formData.slug.trim(),
      title: formData.title.trim(),
      navLabel: formData.navLabel.trim(),
      groupId: formData.groupId.trim(),
      groupTitle: formData.groupTitle.trim(),
      summary: formData.summary.trim(),
      subheading: formData.subheading.trim() || undefined,
      intro: splitLines(formData.introText),
      sections,
      status: formData.status,
      updatedAt: timestamp,
    };
    message.success("更新 API 文档成功");
  }

  router.push("/content/api-docs");
}
</script>

<style scoped>
.api-doc-edit-page {
  display: flex;
  flex-direction: column;
}

.section-block {
  background: #fff;
  border-radius: 8px;
  padding: 24px;
}

.format-alert {
  margin-bottom: 24px;
}

.format-alert__description {
  display: grid;
  gap: 6px;
  line-height: 1.7;
}

.form-title {
  margin-bottom: 16px;
  font-weight: 600;
}

.sections-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.doc-section-editor {
  padding: 20px 20px 4px;
  border: 1px solid #f0f0f0;
  border-radius: 10px;
  background: #fafafa;
}

.doc-section-editor + .doc-section-editor {
  margin-top: 16px;
}

.doc-section-editor__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.doc-section-editor__title {
  font-size: 15px;
  font-weight: 600;
  color: #1f1f1f;
}

.endpoint-editor {
  display: grid;
  gap: 12px;
}

.endpoint-editor__fields {
  display: grid;
  grid-template-columns: 120px minmax(0, 1fr) minmax(0, 1fr);
  gap: 12px;
}

.table-editor-list,
.code-editor-list {
  display: grid;
  gap: 12px;
}

.table-editor,
.code-editor {
  display: grid;
  gap: 12px;
  padding: 16px;
  border-radius: 8px;
  background: #fff;
  border: 1px solid #f2f2f2;
}

.block-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.block-header__title {
  font-weight: 600;
  color: #1f1f1f;
}

.code-editor__meta {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 180px;
  gap: 12px;
}

.save-footer {
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
}

@media (max-width: 960px) {
  .endpoint-editor__fields,
  .code-editor__meta {
    grid-template-columns: 1fr;
  }
}
</style>
