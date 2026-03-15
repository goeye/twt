<template>
  <div class="dashboard-page">
    <!-- ========== 累计总量 ========== -->
    <div class="section-block">
      <h3 class="section-heading">累计总量</h3>
      <div class="total-grid">
        <div v-for="card in totalCards" :key="card.label" class="total-card">
          <div class="total-card__header">
            <span class="total-card__label">{{ card.label }}</span>
            <span class="total-card__icon" :style="{ background: card.bg, color: card.color }">
              <component :is="iconMap[card.icon]" />
            </span>
          </div>
          <div class="total-card__value">{{ card.value.toLocaleString() }}</div>
        </div>
      </div>
    </div>

    <!-- ========== 数据概览 ========== -->
    <div class="section-block overview-section">
      <div class="overview-header">
        <h3 class="section-heading" style="margin-bottom: 0">数据概览</h3>
        <div class="overview-filters">
          <a-range-picker
            v-model:value="dateRange"
            :format="'YYYY-MM-DD'"
            :presets="rangePresets"
            :disabled-date="disabledDate"
            style="width: 280px"
          />
          <a-select v-model:value="projectFilter" style="width: 120px">
            <a-select-option value="all">全部项目</a-select-option>
          </a-select>
        </div>
      </div>
      <div class="overview-grid">
        <div v-for="card in overviewCards" :key="card.label" class="overview-card">
          <div class="overview-card__header">
            <span class="overview-card__label">{{ card.label }}</span>
            <span class="overview-card__icon" :style="{ background: card.bg, color: card.color }">
              <component :is="iconMap[card.icon]" />
            </span>
          </div>
          <div class="overview-card__value">{{ card.value }}</div>
        </div>
      </div>
    </div>

    <!-- ========== 趋势分析 ========== -->
    <div class="section-block trend-section">
      <div class="trend-header">
        <h3 class="section-heading" style="margin-bottom: 0">趋势分析</h3>
        <div class="trend-tabs">
          <button
            v-for="tab in trendTabs"
            :key="tab"
            class="trend-tab"
            :class="{ 'trend-tab--active': activeTrendTab === tab }"
            @click="activeTrendTab = tab"
          >{{ tab }}</button>
        </div>
      </div>

      <svg :viewBox="`0 0 ${chartW} ${chartH}`" class="trend-chart" preserveAspectRatio="xMidYMid meet">
        <!-- Y 轴网格线 + 标签 -->
        <template v-for="(yv, i) in yTicks" :key="'yt' + i">
          <line
            :x1="padL"
            :y1="yTickY(yv)"
            :x2="chartW - padR"
            :y2="yTickY(yv)"
            stroke="#f0f0f0"
            stroke-dasharray="4 3"
          />
          <text
            :x="padL - 8"
            :y="yTickY(yv) + 4"
            text-anchor="end"
            fill="#bbb"
            font-size="12"
          >{{ yv }}</text>
        </template>

        <!-- X 轴标签 -->
        <text
          v-for="(d, i) in trendDays"
          :key="'xl' + i"
          :x="xPos(i)"
          :y="chartH - 6"
          text-anchor="middle"
          fill="#bbb"
          font-size="11"
        >{{ d }}</text>

        <!-- 面积填充 -->
        <polygon :points="areaPoints" fill="rgba(78,131,253,0.08)" />

        <!-- 折线 -->
        <polyline :points="linePoints" fill="none" stroke="#4e83fd" stroke-width="2" />
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, type Component } from "vue";
import dayjs, { type Dayjs } from "dayjs";
import {
  ProjectOutlined,
  CustomerServiceOutlined,
  CheckCircleOutlined,
  PayCircleOutlined,
  TeamOutlined,
  UserOutlined,
  MessageOutlined,
  CommentOutlined,
  FolderAddOutlined,
  CheckOutlined,
} from "@ant-design/icons-vue";
import {
  totalCards,
  overviewCards,
  trendTabs,
  trendDays,
  trendDataMap,
} from "../mock/dashboardData";

/* 图标映射 */
const iconMap: Record<string, Component> = {
  project: ProjectOutlined,
  headset: CustomerServiceOutlined,
  "check-circle": CheckCircleOutlined,
  pay: PayCircleOutlined,
  team: TeamOutlined,
  user: UserOutlined,
  message: MessageOutlined,
  chat: CommentOutlined,
  "folder-add": FolderAddOutlined,
  check: CheckOutlined,
};

/* 数据概览筛选 */
const today = dayjs();
const dateRange = ref<[Dayjs, Dayjs]>([today.subtract(6, "d"), today]);
const projectFilter = ref("all");

const rangePresets = ref([
  { label: "昨天", value: [today.subtract(1, "d"), today.subtract(1, "d")] as [Dayjs, Dayjs] },
  { label: "近7天", value: [today.subtract(6, "d"), today] as [Dayjs, Dayjs] },
  { label: "近30天", value: [today.subtract(29, "d"), today] as [Dayjs, Dayjs] },
  { label: "本月", value: [today.startOf("month"), today] as [Dayjs, Dayjs] },
  { label: "上月", value: [today.subtract(1, "month").startOf("month"), today.subtract(1, "month").endOf("month")] as [Dayjs, Dayjs] },
]);

const disabledDate = (current: Dayjs) => {
  return current && (current.isAfter(today, "day") || current.isBefore(today.subtract(1, "year"), "day"));
};

/* 趋势分析 */
const activeTrendTab = ref(trendTabs[0]);

const activeTrendData = computed(() => trendDataMap[activeTrendTab.value] ?? []);

/* 图表尺寸 */
const chartW = 960;
const chartH = 360;
const padL = 50;
const padR = 30;
const padT = 20;
const padB = 40;
const drawW = chartW - padL - padR;
const drawH = chartH - padT - padB;

/* Y 轴 */
const yMax = computed(() => {
  const m = Math.max(...activeTrendData.value, 1);
  return Math.ceil(m / 10) * 10;
});

const yTicks = computed(() => {
  const step = yMax.value / 4;
  return [0, step, step * 2, step * 3, step * 4];
});

function yTickY(v: number): number {
  return padT + drawH - (v / yMax.value) * drawH;
}

function xPos(i: number): number {
  return padL + (i * drawW) / (trendDays.length - 1);
}

function toCoords(data: number[]): [number, number][] {
  return data.map((v, i) => [xPos(i), yTickY(v)]);
}

const lineCoords = computed(() => toCoords(activeTrendData.value));
const linePoints = computed(() => lineCoords.value.map((p) => p.join(",")).join(" "));

const areaPoints = computed(() => {
  const coords = lineCoords.value;
  if (coords.length === 0) return "";
  const bottom = padT + drawH;
  const start = `${coords[0][0]},${bottom}`;
  const end = `${coords[coords.length - 1][0]},${bottom}`;
  return `${start} ${linePoints.value} ${end}`;
});
</script>

<style scoped>
.dashboard-page {
  display: flex;
  flex-direction: column;
  gap: 0;
}

/* ---- 通用区块 ---- */
.section-block {
  background: #fff;
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 16px;
}

.section-heading {
  font-size: 16px;
  font-weight: 600;
  color: #222;
  margin-bottom: 16px;
}

/* ---- 累计总量 ---- */
.total-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.total-card {
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.total-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.total-card__label {
  font-size: 14px;
  color: #666;
}

.total-card__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  font-size: 16px;
}

.total-card__value {
  font-size: 28px;
  font-weight: 700;
  color: #222;
  line-height: 1;
}

/* ---- 数据概览 ---- */
.overview-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.overview-filters {
  display: flex;
  align-items: center;
  gap: 12px;
}

.overview-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 16px;
}

.overview-card {
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  padding: 14px 16px;
  background: #fafbfd;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.overview-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.overview-card__label {
  font-size: 13px;
  color: #666;
}

.overview-card__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 6px;
  font-size: 14px;
}

.overview-card__value {
  font-size: 26px;
  font-weight: 700;
  color: #222;
  line-height: 1;
}

/* ---- 趋势分析 ---- */
.trend-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.trend-tabs {
  display: flex;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  overflow: hidden;
}

.trend-tab {
  border: none;
  background: #fff;
  padding: 6px 16px;
  font-size: 13px;
  color: #666;
  cursor: pointer;
  border-right: 1px solid #d9d9d9;
  transition: all 0.2s;
}

.trend-tab:last-child {
  border-right: none;
}

.trend-tab--active {
  color: #222;
  font-weight: 600;
  background: #f5f7fa;
}

.trend-tab:hover:not(.trend-tab--active) {
  background: #fafafa;
}

.trend-chart {
  width: 100%;
  height: auto;
}
</style>
