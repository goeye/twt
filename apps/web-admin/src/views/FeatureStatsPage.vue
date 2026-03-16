<template>
  <div class="feature-stats-page">
    <!-- ========== 功能使用排行 ========== -->
    <div class="section-block">
      <div class="section-header">
        <h3 class="section-heading" style="margin-bottom: 0">会话功能统计</h3>
        <div class="section-filters">
          <a-range-picker
            v-model:value="dateRange"
            format="YYYY-MM-DD"
            :presets="rangePresets"
            :disabled-date="disabledDate"
            style="width: 280px"
          />
          <a-select
            v-model:value="projectFilter"
            show-search
            :filter-option="filterProjectOption"
            placeholder="全部项目"
            style="width: 140px"
          >
            <a-select-option value="all">全部项目</a-select-option>
            <a-select-option v-for="p in projectList" :key="p" :value="p">{{ p }}</a-select-option>
          </a-select>
          <a-button type="primary" @click="handleQuery">查询</a-button>
        </div>
      </div>
      <a-table
        :columns="columns"
        :data-source="featureRanking"
        :pagination="false"
        size="middle"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'rank'">
            <span class="rank-number">{{ record.rank }}</span>
          </template>
          <template v-if="column.dataIndex === 'name'">
            <span class="feature-name">{{ record.name }}</span>
          </template>
          <template v-if="column.dataIndex === 'count'">
            <span class="count-value">{{ record.count.toLocaleString() }}</span>
          </template>
          <template v-if="column.dataIndex === 'ratio'">
            <div class="ratio-cell">
              <div class="ratio-bar" :style="{ width: record.ratio }"></div>
              <span class="ratio-text">{{ record.ratio }}</span>
            </div>
          </template>
        </template>
      </a-table>
    </div>

    <!-- ========== 功能趋势 ========== -->
    <div class="section-block">
      <div class="trend-header">
        <h3 class="section-heading" style="margin-bottom: 0">功能趋势（近 7 天 · Top 5）</h3>
        <div class="legend-list">
          <span v-for="key in trendKeys" :key="key" class="legend-item">
            <span class="legend-dot" :style="{ background: featureTrendColors[key] }"></span>
            {{ featureTrendLabels[key] }}
          </span>
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
          v-for="(d, i) in featureTrendDays"
          :key="'xl' + i"
          :x="xPos(i)"
          :y="chartH - 6"
          text-anchor="middle"
          fill="#bbb"
          font-size="11"
        >{{ d }}</text>

        <!-- 各功能折线 -->
        <template v-for="key in trendKeys" :key="key">
          <polyline
            :points="trendPoints[key]"
            fill="none"
            :stroke="featureTrendColors[key]"
            stroke-width="2"
          />
          <circle
            v-for="(pt, i) in trendCoords[key]"
            :key="key + i"
            :cx="pt[0]"
            :cy="pt[1]"
            r="3.5"
            :fill="featureTrendColors[key]"
            stroke="#fff"
            stroke-width="1.5"
          />
        </template>
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import dayjs, { type Dayjs } from "dayjs";
import {
  featureRanking,
  featureTrendDays,
  featureTrends,
  featureTrendLabels,
  featureTrendColors,
} from "../mock/featureStatsData";

/* ---- 筛选 ---- */
const today = dayjs();
const dateRange = ref<[Dayjs, Dayjs]>([today.subtract(6, "d"), today]);
const projectFilter = ref("all");
const projectList = ["qwe", "测试app的项目", "撒打算大", "阿德巴约", "电饭锅电饭锅"];
const filterProjectOption = (input: string, option: any) => {
  return (option?.children?.toString() ?? "").toLowerCase().includes(input.toLowerCase());
};
const handleQuery = () => {};

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

/* ---- 表格列 ---- */
const columns = [
  { title: "排名", dataIndex: "rank", width: 72, align: "center" as const },
  { title: "功能名称", dataIndex: "name", width: 160 },
  { title: "事件标识", dataIndex: "eventKey" },
  { title: "使用次数", dataIndex: "count", width: 140, sorter: (a: any, b: any) => a.count - b.count },
  { title: "占比", dataIndex: "ratio", width: 180 },
];

/* ---- 图表 ---- */
const trendKeys = Object.keys(featureTrends);
const chartW = 960;
const chartH = 340;
const padL = 50;
const padR = 30;
const padT = 20;
const padB = 40;
const drawW = chartW - padL - padR;
const drawH = chartH - padT - padB;

const allMax = computed(() => {
  let m = 0;
  for (const arr of Object.values(featureTrends)) {
    for (const v of arr) {
      if (v > m) m = v;
    }
  }
  return Math.ceil((m * 1.1) / 100) * 100;
});

const yTicks = computed(() => {
  const step = allMax.value / 4;
  return [0, step, step * 2, step * 3, step * 4];
});

function yTickY(v: number): number {
  return padT + drawH - (v / allMax.value) * drawH;
}

function xPos(i: number): number {
  return padL + (i * drawW) / (featureTrendDays.length - 1);
}

function toCoords(data: number[]): [number, number][] {
  return data.map((v, i) => [xPos(i), yTickY(v)]);
}

const trendCoords = computed(() => {
  const map: Record<string, [number, number][]> = {};
  for (const key of trendKeys) {
    map[key] = toCoords(featureTrends[key]);
  }
  return map;
});

const trendPoints = computed(() => {
  const map: Record<string, string> = {};
  for (const key of trendKeys) {
    map[key] = trendCoords.value[key].map((p) => p.join(",")).join(" ");
  }
  return map;
});
</script>

<style scoped>
.feature-stats-page {
  display: flex;
  flex-direction: column;
  gap: 0;
}

/* ---- 通用区块（与数据看板对齐） ---- */
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

/* ---- 标题行 + 筛选 ---- */
.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.section-filters {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* ---- 排行榜 ---- */
.rank-number {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  font-variant-numeric: tabular-nums;
}

.feature-name {
  font-weight: 500;
  color: #333;
}

.count-value {
  font-weight: 600;
  color: #222;
  font-variant-numeric: tabular-nums;
}

.ratio-cell {
  display: flex;
  align-items: center;
  gap: 8px;
}

.ratio-bar {
  height: 6px;
  border-radius: 3px;
  background: linear-gradient(90deg, #4e83fd, #7ea8ff);
  max-width: 100px;
  min-width: 4px;
}

.ratio-text {
  font-size: 13px;
  color: #666;
  white-space: nowrap;
}

/* ---- 趋势图 ---- */
.trend-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.legend-list {
  display: flex;
  align-items: center;
  gap: 20px;
  font-size: 13px;
  color: #666;
}

.legend-item {
  display: inline-flex;
  align-items: center;
}

.legend-dot {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 6px;
}

.trend-chart {
  width: 100%;
  height: auto;
}
</style>
