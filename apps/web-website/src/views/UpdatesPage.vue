<template>
  <div class="updates-page">
    <MarketingHeader />

    <div class="updates-shell">
      <ProductSubNav />

      <section class="updates-hero">
        <div class="container">
          <span class="updates-hero__eyebrow">Release notes</span>
          <h1>Chat 更新日志</h1>
          <p class="subtitle">记录每一次功能上线、体验优化与关键修复，帮你快速看懂版本变化。</p>
        </div>
      </section>

      <section class="updates-content">
        <div class="container">
          <div class="timeline">
            <article v-for="item in updates" :key="item.id" class="timeline-item">
              <div class="timeline-card">
                <h2>{{ item.title }}</h2>

                <div class="card-sections">
                  <div v-for="section in item.sections" :key="section.label + section.text" class="section-item">
                    <span :class="['section-tag', `section-tag--${section.type}`]">{{ section.label }}</span>
                    <p class="section-text">{{ section.text }}</p>
                  </div>
                </div>
              </div>

              <div class="timeline-marker" aria-hidden="true">
                <span class="date-circle"></span>
              </div>

              <div class="timeline-date">
                <span class="date-text">{{ item.date }}</span>
              </div>
            </article>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  </div>
</template>

<script setup lang="ts">
import MarketingHeader from '../components/layout/MarketingHeader.vue';
import ProductSubNav from '../components/layout/ProductSubNav.vue';
import SiteFooter from '../components/layout/SiteFooter.vue';

type UpdateSection = {
  type: 'new' | 'optimize';
  label: string;
  text: string;
};

type UpdateItem = {
  id: number;
  title: string;
  date: string;
  sections: UpdateSection[];
};

const updates: UpdateItem[] = [
  {
    id: 1,
    title: '排队提醒上线，会话档案维护更高效',
    date: '2026-03-27',
    sections: [
      {
        type: 'new',
        label: '新增',
        text: '自定义模块新增排队提醒配置，访客进入队列后可即时展示等待状态与排队信息。'
      },
      {
        type: 'optimize',
        label: '优化',
        text: '会话档案评价支持多选，同时补充标签与标题编辑能力，归档整理更顺手。'
      }
    ]
  },
  {
    id: 2,
    title: '角色权限配置升级，邀请记录支持追踪',
    date: '2026-03-26',
    sections: [
      {
        type: 'new',
        label: '新增',
        text: '支持按角色配置后台操作权限，团队分工更清晰，权限管理更可控。'
      },
      {
        type: 'new',
        label: '新增',
        text: '成员列表新增邀请记录视图，可查看邀请时间、状态与历史详情。'
      }
    ]
  },
  {
    id: 3,
    title: '小部件自定义能力扩展，时间配置精确到秒',
    date: '2026-03-20',
    sections: [
      {
        type: 'new',
        label: '新增',
        text: '聊天小部件支持自定义位置、展示内容、交互行为与品牌露出，接入更灵活。'
      },
      {
        type: 'new',
        label: '新增',
        text: '边写边译新增菲律宾英语支持，跨语种沟通更自然。'
      },
      {
        type: 'optimize',
        label: '优化',
        text: '系统时间配置支持时、分、秒三级精度，触发条件设置更精细。'
      }
    ]
  },
  {
    id: 4,
    title: '主动营销与协作能力增强，会话待处理交互简化',
    date: '2026-03-18',
    sections: [
      {
        type: 'new',
        label: '新增',
        text: '主动营销支持创建定向活动，向指定访客发送个性化消息与推广内容。'
      },
      {
        type: 'new',
        label: '新增',
        text: '群聊支持 @成员提及，团队协同沟通更直接。'
      },
      {
        type: 'new',
        label: '新增',
        text: '客户接入 API 现支持附加备注名、姓名、电话、邮箱等扩展字段。'
      },
      {
        type: 'optimize',
        label: '优化',
        text: '会话支持不发送消息直接标记为待处理，状态流转与历史记录展示更清晰。'
      }
    ]
  },
  {
    id: 5,
    title: '在线会话转移与访客资料编辑能力上线',
    date: '2026-03-09',
    sections: [
      {
        type: 'new',
        label: '新增',
        text: '在线会话支持转移会话与添加客服，复杂问题交接更顺畅。'
      },
      {
        type: 'new',
        label: '新增',
        text: '访客列表、客户列表以及会话中的访客信息面板支持直接编辑基础资料。'
      }
    ]
  }
];
</script>

<style scoped>
.updates-page {
  min-height: 100vh;
  background: #fff;
}

.updates-shell {
  background: linear-gradient(180deg, #f2f5fb 0 320px, #ffffff 320px);
}

.updates-hero {
  padding: 74px 0 88px;
  text-align: center;
}

.container {
  max-width: 1040px;
  margin: 0 auto;
  padding: 0 24px;
}

.updates-hero__eyebrow {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 32px;
  padding: 0 14px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.84);
  border: 1px solid rgba(22, 119, 255, 0.12);
  color: var(--links-color-primary);
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.updates-hero h1 {
  margin: 20px 0 16px;
  font-size: clamp(36px, 5vw, 56px);
  line-height: 1.12;
  color: var(--links-color-text-primary);
}

.subtitle {
  margin: 0;
  font-size: 18px;
  line-height: 1.8;
  color: var(--links-color-text-secondary);
}

.updates-content {
  padding: 0 0 88px;
}

.timeline {
  --timeline-date-width: 132px;
  --timeline-marker-width: 60px;
  position: relative;
}

.timeline::before {
  content: '';
  position: absolute;
  right: calc(var(--timeline-date-width) + (var(--timeline-marker-width) / 2) - 1px);
  top: 18px;
  bottom: 18px;
  width: 2px;
  background: var(--links-color-border);
}

.timeline-item {
  display: grid;
  grid-template-columns: minmax(0, 1fr) var(--timeline-marker-width) var(--timeline-date-width);
  align-items: start;
  margin-bottom: 32px;
}

.timeline-item:last-child {
  margin-bottom: 0;
}

.timeline-card {
  padding: 28px 30px;
  border-radius: 28px;
  border: 1px solid rgba(232, 233, 240, 0.92);
  background: #fff;
  box-shadow: 0 24px 54px rgba(15, 23, 42, 0.08);
}

.timeline-card h2 {
  margin: 0 0 18px;
  font-size: 22px;
  line-height: 1.45;
  color: var(--links-color-text-primary);
}

.card-sections {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.section-item {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 12px;
  align-items: start;
  padding: 14px 16px;
  border-radius: 18px;
  border: 1px solid rgba(232, 233, 240, 0.88);
  background: linear-gradient(180deg, #ffffff 0%, #f9fbff 100%);
}

.section-tag {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 50px;
  min-height: 28px;
  padding: 0 10px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 700;
}

.section-tag--new {
  background: #f0f8e8;
  color: #3f8a1d;
}

.section-tag--optimize {
  background: #eaf3ff;
  color: #1677ff;
}

.section-text {
  margin: 0;
  font-size: 14px;
  line-height: 1.85;
  color: var(--links-color-text-secondary);
}

.timeline-marker {
  display: flex;
  justify-content: center;
  padding-top: 10px;
}

.date-circle {
  position: relative;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #fff;
  border: 4px solid var(--links-color-primary);
  z-index: 1;
}

.timeline-date {
  display: flex;
  align-items: center;
  min-height: 34px;
  padding-top: 1px;
}

.date-text {
  display: inline-flex;
  align-items: center;
  min-height: 34px;
  padding: 0 14px;
  border-radius: 999px;
  background: #f7f9fc;
  color: var(--links-color-text-secondary);
  font-size: 13px;
  font-weight: 600;
}

@media (max-width: 768px) {
  .updates-hero {
    padding: 56px 0 72px;
  }

  .container {
    padding: 0 16px;
  }

  .subtitle {
    font-size: 16px;
  }

  .updates-content {
    padding-bottom: 72px;
  }

  .timeline {
    --timeline-date-width: 92px;
    --timeline-marker-width: 40px;
  }

  .timeline-item {
    margin-bottom: 24px;
  }

  .timeline-card {
    padding: 22px 20px;
    border-radius: 22px;
  }

  .timeline-card h2 {
    font-size: 18px;
  }

  .section-item {
    grid-template-columns: 1fr;
    gap: 10px;
  }
}
</style>
