<template>
  <div class="resource-edit-page">
    <div class="section-block">
      <a-form :label-col="{ span: 4 }" :wrapper-col="{ span: 16 }">
        <!-- 基本信息 -->
        <h3 style="margin-bottom: 16px; font-weight: 600">基本信息</h3>

        <a-form-item label="资源名称" required>
          <a-input v-model:value="formData.name" placeholder="请输入资源名称" />
        </a-form-item>

        <a-form-item label="Slug" required>
          <a-input v-model:value="formData.slug" placeholder="URL 标识，如 cliproxy" />
        </a-form-item>

        <a-form-item label="Logo URL">
          <a-input v-model:value="formData.logo" placeholder="请输入 Logo 图片地址" />
        </a-form-item>

        <a-form-item label="简短描述" required>
          <a-input v-model:value="formData.shortDesc" placeholder="卡片上展示的简短描述" />
        </a-form-item>

        <a-form-item label="详细描述">
          <a-textarea v-model:value="formData.fullDesc" placeholder="详情页展示的完整描述" :rows="6" />
        </a-form-item>

        <!-- 分类 -->
        <a-divider />
        <h3 style="margin-bottom: 16px; font-weight: 600">分类</h3>

        <a-form-item label="所属分类" required>
          <a-select v-model:value="formData.categoryId" placeholder="请选择分类" style="width: 240px">
            <a-select-option v-for="cat in categoryOptions" :key="cat.id" :value="cat.id">
              {{ cat.icon }} {{ cat.name }}
            </a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="子分类">
          <a-select
            v-model:value="formData.subCategoryId"
            placeholder="请选择子分类"
            allow-clear
            style="width: 240px"
          >
            <a-select-option v-for="sub in subCategoryOptions" :key="sub.id" :value="sub.id">
              {{ sub.name }}
            </a-select-option>
          </a-select>
        </a-form-item>

        <!-- 展示 -->
        <a-divider />
        <h3 style="margin-bottom: 16px; font-weight: 600">展示设置</h3>

        <a-form-item label="标签">
          <a-checkbox-group v-model:value="formData.tags" :options="tagOptions" />
        </a-form-item>

        <a-form-item label="评分">
          <a-rate v-model:value="formData.rating" />
        </a-form-item>

        <a-form-item label="精选推荐">
          <a-switch v-model:checked="formData.featured" />
        </a-form-item>

        <!-- 链接行为 -->
        <a-divider />
        <h3 style="margin-bottom: 16px; font-weight: 600">链接行为</h3>

        <a-form-item label="打开方式">
          <a-radio-group v-model:value="formData.linkType">
            <a-radio value="external">直接跳转外部链接</a-radio>
            <a-radio value="detail">进入详情页</a-radio>
          </a-radio-group>
        </a-form-item>

        <a-form-item v-if="formData.linkType === 'external'" label="外部链接">
          <a-input v-model:value="formData.externalUrl" placeholder="请输入外部链接地址" />
        </a-form-item>

        <!-- SEO -->
        <a-divider />
        <h3 style="margin-bottom: 16px; font-weight: 600">SEO 设置</h3>

        <a-form-item label="页面标题">
          <a-input v-model:value="formData.metaTitle" placeholder="详情页 title 标签" />
        </a-form-item>

        <a-form-item label="页面描述">
          <a-textarea v-model:value="formData.metaDescription" placeholder="详情页 meta description" :rows="3" />
        </a-form-item>

        <!-- 截图 -->
        <a-divider />
        <h3 style="margin-bottom: 16px; font-weight: 600">产品截图</h3>

        <a-form-item v-for="(_, i) in formData.screenshots" :key="i" :label="`截图 ${i + 1}`">
          <div style="display: flex; gap: 8px">
            <a-input v-model:value="formData.screenshots[i]" placeholder="请输入截图 URL" />
            <a-button danger @click="formData.screenshots.splice(i, 1)">删除</a-button>
          </div>
        </a-form-item>

        <a-form-item :wrapper-col="{ offset: 4 }">
          <a-button @click="formData.screenshots.push('')">
            <template #icon><PlusOutlined /></template>
            添加截图
          </a-button>
        </a-form-item>
      </a-form>

      <!-- 底部保存 -->
      <div class="save-footer">
        <a-button type="primary" :disabled="!canSave" @click="handleSave">保存</a-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { message } from "ant-design-vue";
import { PlusOutlined } from "@ant-design/icons-vue";
import {
  linkResourcesData,
  type ResourceRecord,
  type ResourceTag,
} from "../mock/linkResourcesData";
import { linkCategoriesData } from "../mock/linkCategoriesData";

const route = useRoute();
const router = useRouter();

const isNew = computed(() => route.params.id === "new");
const categoryOptions = linkCategoriesData;

const tagOptions = [
  { label: "推荐", value: "推荐" },
  { label: "TOP", value: "TOP" },
  { label: "NEW", value: "NEW" },
  { label: "优", value: "优" },
];

const formData = reactive({
  name: "",
  slug: "",
  logo: "",
  shortDesc: "",
  fullDesc: "",
  categoryId: undefined as number | undefined,
  subCategoryId: undefined as number | undefined,
  tags: [] as ResourceTag[],
  rating: 5,
  featured: false,
  linkType: "detail" as "external" | "detail",
  externalUrl: "",
  metaTitle: "",
  metaDescription: "",
  screenshots: [] as string[],
});

const subCategoryOptions = computed(() => {
  if (!formData.categoryId) return [];
  const cat = linkCategoriesData.find((c) => c.id === formData.categoryId);
  return cat?.subCategories ?? [];
});

const canSave = computed(() => !!formData.name.trim() && !!formData.slug.trim());

onMounted(() => {
  if (!isNew.value) {
    const id = Number(route.params.id);
    const record = linkResourcesData.find((r) => r.id === id);
    if (record) {
      formData.name = record.name;
      formData.slug = record.slug;
      formData.logo = record.logo;
      formData.shortDesc = record.shortDesc;
      formData.fullDesc = record.fullDesc;
      formData.categoryId = record.categoryId;
      formData.subCategoryId = record.subCategoryId;
      formData.tags = [...record.tags];
      formData.rating = record.rating;
      formData.featured = record.featured;
      formData.linkType = record.link.type;
      formData.externalUrl = record.link.type === "external" ? record.link.url : "";
      formData.metaTitle = record.metaTitle;
      formData.metaDescription = record.metaDescription;
      formData.screenshots = [...record.screenshots];
    }
  }
});

function nowStr() {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
}

function handleSave() {
  if (!formData.name.trim() || !formData.slug.trim()) {
    message.warning("请填写必填项");
    return;
  }

  const ts = nowStr();
  const link = formData.linkType === "external"
    ? { type: "external" as const, url: formData.externalUrl }
    : { type: "detail" as const, slug: formData.slug };

  if (isNew.value) {
    const maxId = linkResourcesData.reduce((m, r) => Math.max(m, r.id), 0);
    const newRecord: ResourceRecord = {
      id: maxId + 1,
      slug: formData.slug.trim(),
      name: formData.name.trim(),
      logo: formData.logo.trim(),
      shortDesc: formData.shortDesc.trim(),
      fullDesc: formData.fullDesc.trim(),
      tags: [...formData.tags],
      rating: formData.rating,
      link,
      screenshots: formData.screenshots.filter(Boolean),
      featured: formData.featured,
      categoryId: formData.categoryId!,
      subCategoryId: formData.subCategoryId,
      metaTitle: formData.metaTitle.trim(),
      metaDescription: formData.metaDescription.trim(),
      createdAt: ts,
      updatedAt: ts,
    };
    linkResourcesData.unshift(newRecord);
    message.success("新增成功");
  } else {
    const id = Number(route.params.id);
    const idx = linkResourcesData.findIndex((r) => r.id === id);
    if (idx !== -1) {
      linkResourcesData[idx] = {
        ...linkResourcesData[idx],
        slug: formData.slug.trim(),
        name: formData.name.trim(),
        logo: formData.logo.trim(),
        shortDesc: formData.shortDesc.trim(),
        fullDesc: formData.fullDesc.trim(),
        tags: [...formData.tags],
        rating: formData.rating,
        link,
        screenshots: formData.screenshots.filter(Boolean),
        featured: formData.featured,
        categoryId: formData.categoryId!,
        subCategoryId: formData.subCategoryId,
        metaTitle: formData.metaTitle.trim(),
        metaDescription: formData.metaDescription.trim(),
        updatedAt: ts,
      };
    }
    message.success("编辑成功");
  }

  router.push("/links/resources");
}
</script>

<style scoped>
.resource-edit-page {
  display: flex;
  flex-direction: column;
}

.section-block {
  background: #fff;
  border-radius: 8px;
  padding: 24px;
}

.save-footer {
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
}
</style>
