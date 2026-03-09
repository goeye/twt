<template>
  <section class="agent-content-page agent-content-page--hide-scrollbar report-page">
    <!-- 数据概览 -->
    <template v-if="activeKey === 'data-overview'">
      <h1 class="report-page__title">数据概览</h1>

      <div class="report-filter-bar">
        <div class="report-date-picker-wrap">
          <div class="report-date-picker" @click="showDatePicker = !showDatePicker">
            <span class="report-date-picker__text">{{ dateRange.start }}</span>
            <span class="report-date-picker__sep">&nbsp;&nbsp;</span>
            <span class="report-date-picker__text">{{ dateRange.end }}</span>
            <span class="report-date-picker__icon">📅</span>
          </div>
          <div v-if="showDatePicker" class="report-datepicker-panel">
            <div class="report-datepicker-panel__shortcuts">
              <button
                v-for="shortcut in dateShortcuts"
                :key="shortcut.label"
                type="button"
                class="report-datepicker-panel__shortcut"
                @click="applyDateShortcut(shortcut); showDatePicker = false"
              >{{ shortcut.label }}</button>
            </div>
            <div class="report-datepicker-panel__calendars">
              <div class="report-datepicker-panel__month">
                <div class="report-datepicker-panel__month-header">
                  <button type="button" class="report-datepicker-panel__nav" @click="prevMonth">«</button>
                  <button type="button" class="report-datepicker-panel__nav" @click="prevMonth">‹</button>
                  <span class="report-datepicker-panel__month-title">{{ calendarMonthLabel(0) }}</span>
                </div>
                <div class="report-datepicker-panel__weekdays">
                  <span v-for="d in weekdays" :key="d">{{ d }}</span>
                </div>
                <div class="report-datepicker-panel__days">
                  <button
                    v-for="(day, i) in calendarDays(0)"
                    :key="i"
                    type="button"
                    class="report-datepicker-panel__day"
                    :class="{
                      'report-datepicker-panel__day--other': !day.currentMonth,
                      'report-datepicker-panel__day--start': day.isStart,
                      'report-datepicker-panel__day--end': day.isEnd,
                      'report-datepicker-panel__day--in-range': day.inRange
                    }"
                    @click="pickDate(day.date)"
                  >{{ day.day }}</button>
                </div>
              </div>
              <div class="report-datepicker-panel__month">
                <div class="report-datepicker-panel__month-header">
                  <span class="report-datepicker-panel__month-title">{{ calendarMonthLabel(1) }}</span>
                  <button type="button" class="report-datepicker-panel__nav" @click="nextMonth">›</button>
                  <button type="button" class="report-datepicker-panel__nav" @click="nextMonth">»</button>
                </div>
                <div class="report-datepicker-panel__weekdays">
                  <span v-for="d in weekdays" :key="d">{{ d }}</span>
                </div>
                <div class="report-datepicker-panel__days">
                  <button
                    v-for="(day, i) in calendarDays(1)"
                    :key="i"
                    type="button"
                    class="report-datepicker-panel__day"
                    :class="{
                      'report-datepicker-panel__day--other': !day.currentMonth,
                      'report-datepicker-panel__day--start': day.isStart,
                      'report-datepicker-panel__day--end': day.isEnd,
                      'report-datepicker-panel__day--in-range': day.inRange
                    }"
                    @click="pickDate(day.date)"
                  >{{ day.day }}</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="report-agent-select" @click="showAgentDropdown = !showAgentDropdown">
          <span class="report-agent-select__text">{{ selectedAgent }}</span>
          <span class="report-agent-select__arrow">▾</span>
          <div v-if="showAgentDropdown" class="report-agent-select__dropdown">
            <div
              v-for="agent in agentOptions"
              :key="agent"
              class="report-agent-select__option"
              @click.stop="selectedAgent = agent; showAgentDropdown = false"
            >
              <span v-if="agent !== '全部客服'" class="report-agent-select__avatar" />
              {{ agent }}
            </div>
          </div>
        </div>
      </div>

      <!-- Stat Cards -->
      <div class="report-stat-row">
        <div v-for="card in overviewStatCards" :key="card.label" class="report-stat-card agent-panel">
          <div class="report-stat-card__label">
            {{ card.label }}
            <span class="report-stat-card__help" title="帮助">ⓘ</span>
          </div>
          <div class="report-stat-card__value">{{ card.value }}</div>
        </div>
      </div>

      <!-- Charts Grid -->
      <div class="report-charts-grid">
        <div class="report-chart-panel agent-panel">
          <div class="report-chart-panel__header">
            <span class="report-chart-panel__title">会话趋势 <span class="report-stat-card__help">ⓘ</span></span>
            <span class="report-chart-panel__legend">平均数量 <strong>0</strong></span>
          </div>
          <div class="report-chart-panel__body">
            <div class="report-line-chart">
              <div class="report-line-chart__y-axis">
                <span v-for="v in [1, 0.8, 0.6, 0.4, 0.2, 0]" :key="v">{{ v }}</span>
              </div>
              <div class="report-line-chart__area">
                <svg viewBox="0 0 500 200" preserveAspectRatio="none" class="report-line-chart__svg">
                  <line x1="0" y1="200" x2="500" y2="200" stroke="var(--agent-color-border-default)" stroke-width="1" />
                  <polyline
                    fill="none"
                    stroke="var(--agent-color-brand-primary)"
                    stroke-width="2"
                    :points="trendLinePoints"
                  />
                  <circle
                    v-for="(pt, idx) in trendPoints"
                    :key="idx"
                    :cx="pt.x"
                    :cy="pt.y"
                    r="4"
                    fill="#fff"
                    stroke="var(--agent-color-brand-primary)"
                    stroke-width="2"
                  />
                </svg>
                <div class="report-line-chart__x-axis">
                  <span v-for="d in chartXAxisLabels" :key="d">{{ d }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="report-chart-panel agent-panel">
          <div class="report-chart-panel__header">
            <span class="report-chart-panel__title">满意度分布 <span class="report-stat-card__help">ⓘ</span></span>
          </div>
          <div class="report-chart-panel__body report-chart-panel__body--empty">
            <span class="report-chart-panel__empty-text">暂无满意度数据</span>
          </div>
        </div>

        <div class="report-chart-panel agent-panel">
          <div class="report-chart-panel__header">
            <span class="report-chart-panel__title">首次响应时间分布 <span class="report-stat-card__help">ⓘ</span></span>
          </div>
          <div class="report-chart-panel__body report-chart-panel__body--empty">
            <span class="report-chart-panel__empty-text">暂无响应时间数据</span>
          </div>
        </div>

        <div class="report-chart-panel agent-panel">
          <div class="report-chart-panel__header">
            <span class="report-chart-panel__title">会话时长分布 <span class="report-stat-card__help">ⓘ</span></span>
          </div>
          <div class="report-chart-panel__body report-chart-panel__body--empty">
            <span class="report-chart-panel__empty-text">暂无会话时长数据</span>
          </div>
        </div>
      </div>
    </template>

    <!-- AI Agent 报表 -->
    <template v-else-if="activeKey === 'ai-agent-report'">
      <h1 class="report-page__title">AI Agent</h1>

      <!-- Filters -->
      <div class="report-filter-bar">
        <div class="report-date-picker-wrap">
          <div class="report-date-picker" @click="showDatePicker = !showDatePicker">
            <span class="report-date-picker__text">{{ dateRange.start }}</span>
            <span class="report-date-picker__sep"> - </span>
            <span class="report-date-picker__text">{{ dateRange.end }}</span>
            <span class="report-date-picker__icon">📅</span>
          </div>
          <div v-if="showDatePicker" class="report-datepicker-panel">
            <div class="report-datepicker-panel__shortcuts">
              <button
                v-for="shortcut in dateShortcuts"
                :key="shortcut.label"
                type="button"
                class="report-datepicker-panel__shortcut"
                @click="applyDateShortcut(shortcut); showDatePicker = false"
              >{{ shortcut.label }}</button>
            </div>
            <div class="report-datepicker-panel__calendars">
              <div class="report-datepicker-panel__month">
                <div class="report-datepicker-panel__month-header">
                  <button type="button" class="report-datepicker-panel__nav" @click="prevMonth">«</button>
                  <button type="button" class="report-datepicker-panel__nav" @click="prevMonth">‹</button>
                  <span class="report-datepicker-panel__month-title">{{ calendarMonthLabel(0) }}</span>
                </div>
                <div class="report-datepicker-panel__weekdays">
                  <span v-for="d in weekdays" :key="d">{{ d }}</span>
                </div>
                <div class="report-datepicker-panel__days">
                  <button
                    v-for="(day, i) in calendarDays(0)"
                    :key="i"
                    type="button"
                    class="report-datepicker-panel__day"
                    :class="{
                      'report-datepicker-panel__day--other': !day.currentMonth,
                      'report-datepicker-panel__day--start': day.isStart,
                      'report-datepicker-panel__day--end': day.isEnd,
                      'report-datepicker-panel__day--in-range': day.inRange
                    }"
                    @click="pickDate(day.date)"
                  >{{ day.day }}</button>
                </div>
              </div>
              <div class="report-datepicker-panel__month">
                <div class="report-datepicker-panel__month-header">
                  <span class="report-datepicker-panel__month-title">{{ calendarMonthLabel(1) }}</span>
                  <button type="button" class="report-datepicker-panel__nav" @click="nextMonth">›</button>
                  <button type="button" class="report-datepicker-panel__nav" @click="nextMonth">»</button>
                </div>
                <div class="report-datepicker-panel__weekdays">
                  <span v-for="d in weekdays" :key="d">{{ d }}</span>
                </div>
                <div class="report-datepicker-panel__days">
                  <button
                    v-for="(day, i) in calendarDays(1)"
                    :key="i"
                    type="button"
                    class="report-datepicker-panel__day"
                    :class="{
                      'report-datepicker-panel__day--other': !day.currentMonth,
                      'report-datepicker-panel__day--start': day.isStart,
                      'report-datepicker-panel__day--end': day.isEnd,
                      'report-datepicker-panel__day--in-range': day.inRange
                    }"
                    @click="pickDate(day.date)"
                  >{{ day.day }}</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Stat Cards -->
      <div class="report-stat-row">
        <div v-for="card in aiTopStatCards" :key="card.label" class="report-stat-card agent-panel">
          <div class="report-stat-card__label">
            {{ card.label }}
            <span class="report-stat-card__help">ⓘ</span>
          </div>
          <div class="report-stat-card__value">{{ card.value }}</div>
        </div>
      </div>

      <!-- 会话解决 + 会话解决占比 -->
      <div class="report-charts-grid">
        <div class="report-chart-panel agent-panel">
          <div class="report-chart-panel__header">
            <span class="report-chart-panel__title">会话解决</span>
          </div>
          <div class="report-chart-panel__legend-bar">
            <span class="report-chart-panel__legend-item">
              <span class="report-chart-panel__dot" style="background: var(--agent-color-brand-primary)" /> 已解决会话 <span class="report-stat-card__help">ⓘ</span>
            </span>
            <span class="report-chart-panel__legend-item">
              <span class="report-chart-panel__dot" style="background: #f5222d" /> 未解决会话 <span class="report-stat-card__help">ⓘ</span>
            </span>
          </div>
          <div class="ai-report-inline-stats">
            <span class="ai-report-inline-stat"><strong>1</strong></span>
            <span class="ai-report-inline-stat" style="margin-left: 64px;"><strong>2</strong></span>
          </div>
          <div class="report-chart-panel__body">
            <div class="report-line-chart">
              <div class="report-line-chart__y-axis">
                <span>3</span><span>2</span><span>1</span><span>0</span>
              </div>
              <div class="report-line-chart__area">
                <svg viewBox="0 0 500 150" preserveAspectRatio="none" class="report-line-chart__svg">
                  <line v-for="n in 4" :key="n" x1="0" :y1="(n-1)*50" x2="500" :y2="(n-1)*50" stroke="var(--agent-color-border-default)" stroke-width="0.5" stroke-dasharray="4" />
                  <polyline fill="none" stroke="var(--agent-color-brand-primary)" stroke-width="2" points="0,150 380,150 420,100 500,100" />
                  <polyline fill="none" stroke="#f5222d" stroke-width="2" points="0,150 300,150 360,100 420,50 480,50 500,100" />
                </svg>
                <div class="report-line-chart__x-axis">
                  <span v-for="d in aiChartXLabels" :key="d">{{ d }}</span>
                </div>
              </div>
            </div>
          </div>
          <a class="ai-report-link" href="javascript:void(0)">查看会话</a>
        </div>

        <!-- 会话解决占比 -->
        <div class="report-chart-panel agent-panel">
          <div class="report-chart-panel__header">
            <span class="report-chart-panel__title">会话解决占比</span>
          </div>
          <div class="ai-report-donut-section">
            <div class="ai-report-donut-meta">
              <span class="ai-report-donut-meta__label">总计</span>
              <span class="ai-report-donut-meta__value">3</span>
            </div>
            <div class="ai-report-donut">
              <svg viewBox="0 0 120 120" class="ai-report-donut__svg">
                <circle cx="60" cy="60" r="50" fill="none" stroke="var(--agent-color-bg-muted)" stroke-width="16" />
                <circle cx="60" cy="60" r="50" fill="none" stroke="var(--agent-color-status-success)" stroke-width="16" stroke-dasharray="105 314" stroke-dashoffset="0" transform="rotate(-90 60 60)" />
                <circle cx="60" cy="60" r="50" fill="none" stroke="#f5222d" stroke-width="16" stroke-dasharray="209 314" stroke-dashoffset="-105" transform="rotate(-90 60 60)" />
              </svg>
            </div>
            <div class="ai-report-donut-legend">
              <span class="report-chart-panel__legend-item">
                <span class="report-chart-panel__dot" style="background: var(--agent-color-status-success)" /> 已解决会话 33.3% (1)
              </span>
              <span class="report-chart-panel__legend-item">
                <span class="report-chart-panel__dot" style="background: #f5222d" /> 未解决会话 66.7% (2)
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- 转人工趋势 -->
      <div class="report-chart-panel report-chart-panel--wide agent-panel">
        <div class="report-chart-panel__header">
          <span class="report-chart-panel__title">转人工趋势 <span class="report-stat-card__help">ⓘ</span></span>
        </div>
        <div class="ai-report-avg">
          <span class="ai-report-avg__label">平均</span>
          <span class="ai-report-avg__value">3</span>
        </div>
        <div class="report-chart-panel__body">
          <div class="report-line-chart">
            <div class="report-line-chart__y-axis">
              <span>8</span><span>6</span><span>4</span><span>2</span><span>0</span>
            </div>
            <div class="report-line-chart__area">
              <svg viewBox="0 0 700 200" preserveAspectRatio="none" class="report-line-chart__svg">
                <line v-for="n in 5" :key="n" x1="0" :y1="(n-1)*50" x2="700" :y2="(n-1)*50" stroke="var(--agent-color-border-default)" stroke-width="0.5" stroke-dasharray="4" />
                <polyline fill="none" stroke="#ff7d00" stroke-width="2" points="0,175 100,150 200,125 300,175 400,100 500,75 600,50 700,100" />
              </svg>
              <div class="report-line-chart__x-axis">
                <span v-for="d in aiChartXLabels" :key="d">{{ d }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 满意度 -->
      <div class="report-chart-panel report-chart-panel--wide agent-panel">
        <div class="report-chart-panel__header">
          <span class="report-chart-panel__title">满意度趋势 <span class="report-stat-card__help">ⓘ</span></span>
        </div>
        <div class="report-chart-panel__body report-chart-panel__body--empty">
          <span class="report-chart-panel__empty-text">暂无满意度数据</span>
        </div>
      </div>
    </template>

    <!-- 会话评价分析 -->
    <template v-else-if="activeKey === 'evaluation-analysis'">
      <h1 class="report-page__title">会话评价分析</h1>

      <div class="report-filter-bar">
        <div class="report-date-picker-wrap">
          <div class="report-date-picker" @click="showDatePicker = !showDatePicker">
            <span class="report-date-picker__text">{{ dateRange.start }}</span>
            <span class="report-date-picker__sep">&nbsp;&nbsp;</span>
            <span class="report-date-picker__text">{{ dateRange.end }}</span>
            <span class="report-date-picker__icon">📅</span>
          </div>
          <div v-if="showDatePicker" class="report-datepicker-panel">
            <div class="report-datepicker-panel__shortcuts">
              <button
                v-for="shortcut in dateShortcuts"
                :key="shortcut.label"
                type="button"
                class="report-datepicker-panel__shortcut"
                @click="applyDateShortcut(shortcut); showDatePicker = false"
              >{{ shortcut.label }}</button>
            </div>
            <div class="report-datepicker-panel__calendars">
              <div class="report-datepicker-panel__month">
                <div class="report-datepicker-panel__month-header">
                  <button type="button" class="report-datepicker-panel__nav" @click="prevMonth">«</button>
                  <button type="button" class="report-datepicker-panel__nav" @click="prevMonth">‹</button>
                  <span class="report-datepicker-panel__month-title">{{ calendarMonthLabel(0) }}</span>
                </div>
                <div class="report-datepicker-panel__weekdays">
                  <span v-for="d in weekdays" :key="d">{{ d }}</span>
                </div>
                <div class="report-datepicker-panel__days">
                  <button
                    v-for="(day, i) in calendarDays(0)"
                    :key="i"
                    type="button"
                    class="report-datepicker-panel__day"
                    :class="{
                      'report-datepicker-panel__day--other': !day.currentMonth,
                      'report-datepicker-panel__day--start': day.isStart,
                      'report-datepicker-panel__day--end': day.isEnd,
                      'report-datepicker-panel__day--in-range': day.inRange
                    }"
                    @click="pickDate(day.date)"
                  >{{ day.day }}</button>
                </div>
              </div>
              <div class="report-datepicker-panel__month">
                <div class="report-datepicker-panel__month-header">
                  <span class="report-datepicker-panel__month-title">{{ calendarMonthLabel(1) }}</span>
                  <button type="button" class="report-datepicker-panel__nav" @click="nextMonth">›</button>
                  <button type="button" class="report-datepicker-panel__nav" @click="nextMonth">»</button>
                </div>
                <div class="report-datepicker-panel__weekdays">
                  <span v-for="d in weekdays" :key="d">{{ d }}</span>
                </div>
                <div class="report-datepicker-panel__days">
                  <button
                    v-for="(day, i) in calendarDays(1)"
                    :key="i"
                    type="button"
                    class="report-datepicker-panel__day"
                    :class="{
                      'report-datepicker-panel__day--other': !day.currentMonth,
                      'report-datepicker-panel__day--start': day.isStart,
                      'report-datepicker-panel__day--end': day.isEnd,
                      'report-datepicker-panel__day--in-range': day.inRange
                    }"
                    @click="pickDate(day.date)"
                  >{{ day.day }}</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="report-agent-select" @click="showAgentDropdown = !showAgentDropdown">
          <span class="report-agent-select__text">{{ selectedAgent }}</span>
          <span class="report-agent-select__arrow">▾</span>
          <div v-if="showAgentDropdown" class="report-agent-select__dropdown">
            <div
              v-for="agent in agentOptions"
              :key="agent"
              class="report-agent-select__option"
              @click.stop="selectedAgent = agent; showAgentDropdown = false"
            >
              <span v-if="agent !== '全部客服'" class="report-agent-select__avatar" />
              {{ agent }}
            </div>
          </div>
        </div>
      </div>

      <!-- Stat Cards -->
      <div class="report-stat-row">
        <div v-for="card in evalStatCards" :key="card.label" class="report-stat-card agent-panel">
          <div class="report-stat-card__label">
            {{ card.label }}
            <span class="report-stat-card__help">ⓘ</span>
          </div>
          <div class="report-stat-card__value">{{ card.value }}</div>
          <div class="report-stat-card__sub">{{ card.sub }}</div>
        </div>
      </div>

      <!-- 满意度趋势 -->
      <div class="report-chart-panel report-chart-panel--wide agent-panel">
        <div class="report-chart-panel__header">
          <span class="report-chart-panel__title">满意度趋势 <span class="report-stat-card__help">ⓘ</span></span>
        </div>
        <div class="report-chart-panel__legend-bar">
          <span class="report-chart-panel__legend-item">
            <span class="report-chart-panel__dot" style="background: var(--agent-color-brand-primary)" /> 满意
          </span>
          <span class="report-chart-panel__legend-item">
            <span class="report-chart-panel__dot" style="background: var(--agent-color-status-warning)" /> 一般
          </span>
          <span class="report-chart-panel__legend-item">
            <span class="report-chart-panel__dot" style="background: #36cfc9" /> 不满意
          </span>
        </div>
        <div class="report-chart-panel__body">
          <div class="report-line-chart">
            <div class="report-line-chart__y-axis">
              <span v-for="v in [1, 0.8, 0.6, 0.4, 0.2, 0]" :key="v">{{ v }}</span>
            </div>
            <div class="report-line-chart__area">
              <svg viewBox="0 0 700 200" preserveAspectRatio="none" class="report-line-chart__svg">
                <line x1="0" y1="0" x2="0" y2="200" stroke="var(--agent-color-border-default)" stroke-width="0.5" />
                <line v-for="n in 5" :key="n" :x1="0" :y1="n * 40 - 40" :x2="700" :y2="n * 40 - 40" stroke="var(--agent-color-border-default)" stroke-width="0.5" stroke-dasharray="4" />
                <line x1="0" y1="200" x2="700" y2="200" stroke="var(--agent-color-border-default)" stroke-width="1" />
              </svg>
              <div class="report-line-chart__x-axis">
                <span v-for="d in evalXAxisLabels" :key="d">{{ d }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 客服明细 -->
      <div class="report-table-panel agent-panel">
        <h3 class="report-table-panel__title">客服明细</h3>
        <table class="report-table">
          <thead>
            <tr>
              <th class="report-table__th report-table__th--left">客服账号</th>
              <th class="report-table__th">总会话数</th>
              <th class="report-table__th">参评数</th>
              <th class="report-table__th">参评率</th>
              <th class="report-table__th">满意</th>
              <th class="report-table__th">一般</th>
              <th class="report-table__th">不满意</th>
              <th class="report-table__th">满意率 <span class="report-stat-card__help">ⓘ</span></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in agentDetailRows" :key="row.name">
              <td class="report-table__td report-table__td--left">
                <span class="report-table__agent-avatar" />
                {{ row.name }}
              </td>
              <td class="report-table__td">{{ row.totalSessions }}</td>
              <td class="report-table__td">{{ row.ratedCount }}</td>
              <td class="report-table__td">{{ row.ratedRate }}</td>
              <td class="report-table__td">{{ row.satisfied }}</td>
              <td class="report-table__td">{{ row.neutral }}</td>
              <td class="report-table__td">{{ row.unsatisfied }}</td>
              <td class="report-table__td">{{ row.satisfactionRate }}</td>
            </tr>
          </tbody>
        </table>
        <div class="report-table-panel__footer">
          <span class="report-table-panel__total">共 {{ agentDetailRows.length }} 条</span>
          <div class="report-table-panel__pagination">
            <button type="button" class="report-pagination__btn" disabled>‹</button>
            <button type="button" class="report-pagination__btn report-pagination__btn--active">1</button>
            <button type="button" class="report-pagination__btn" disabled>›</button>
            <div class="report-pagination__size">10 条/页 ▾</div>
          </div>
        </div>
      </div>
    </template>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

const props = defineProps<{
  activeKey: string;
}>();

// ── Shared state ──
const showDatePicker = ref(false);
const showAgentDropdown = ref(false);
const selectedAgent = ref("全部客服");
const calendarBaseMonth = ref(new Date(2026, 2, 1)); // March 2026

const dateRange = ref({
  start: "2026-03-02",
  end: "2026-03-08"
});

const agentOptions = ["全部客服", "客服主管"];
const weekdays = ["一", "二", "三", "四", "五", "六", "日"];

// ── Date picker logic ──
interface DateShortcut {
  label: string;
  getRange: () => { start: string; end: string };
}

const today = new Date(2026, 2, 8);

function formatDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

const dateShortcuts: DateShortcut[] = [
  { label: "今天", getRange: () => ({ start: formatDate(today), end: formatDate(today) }) },
  { label: "昨天", getRange: () => {
    const d = new Date(today); d.setDate(d.getDate() - 1);
    return { start: formatDate(d), end: formatDate(d) };
  }},
  { label: "近7天", getRange: () => {
    const d = new Date(today); d.setDate(d.getDate() - 6);
    return { start: formatDate(d), end: formatDate(today) };
  }},
  { label: "近30天", getRange: () => {
    const d = new Date(today); d.setDate(d.getDate() - 29);
    return { start: formatDate(d), end: formatDate(today) };
  }},
  { label: "上月", getRange: () => {
    const s = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const e = new Date(today.getFullYear(), today.getMonth(), 0);
    return { start: formatDate(s), end: formatDate(e) };
  }},
  { label: "本月", getRange: () => {
    const s = new Date(today.getFullYear(), today.getMonth(), 1);
    return { start: formatDate(s), end: formatDate(today) };
  }}
];

function applyDateShortcut(shortcut: DateShortcut) {
  dateRange.value = shortcut.getRange();
}

function prevMonth() {
  const d = new Date(calendarBaseMonth.value);
  d.setMonth(d.getMonth() - 1);
  calendarBaseMonth.value = d;
}

function nextMonth() {
  const d = new Date(calendarBaseMonth.value);
  d.setMonth(d.getMonth() + 1);
  calendarBaseMonth.value = d;
}

function calendarMonthLabel(offset: number) {
  const d = new Date(calendarBaseMonth.value);
  d.setMonth(d.getMonth() + offset);
  return `${d.getFullYear()}年 ${d.getMonth() + 1}月`;
}

interface CalendarDay {
  day: number;
  date: string;
  currentMonth: boolean;
  isStart: boolean;
  isEnd: boolean;
  inRange: boolean;
}

function calendarDays(offset: number): CalendarDay[] {
  const base = new Date(calendarBaseMonth.value);
  base.setMonth(base.getMonth() + offset);
  const year = base.getFullYear();
  const month = base.getMonth();
  const firstDay = new Date(year, month, 1);
  let startWeekday = firstDay.getDay();
  if (startWeekday === 0) startWeekday = 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const result: CalendarDay[] = [];
  const prevMonthDays = new Date(year, month, 0).getDate();
  for (let i = startWeekday - 1; i >= 1; i--) {
    const d = prevMonthDays - i + 1;
    const dateStr = formatDate(new Date(year, month - 1, d));
    result.push({ day: d, date: dateStr, currentMonth: false, isStart: dateStr === dateRange.value.start, isEnd: dateStr === dateRange.value.end, inRange: dateStr >= dateRange.value.start && dateStr <= dateRange.value.end });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = formatDate(new Date(year, month, d));
    result.push({ day: d, date: dateStr, currentMonth: true, isStart: dateStr === dateRange.value.start, isEnd: dateStr === dateRange.value.end, inRange: dateStr >= dateRange.value.start && dateStr <= dateRange.value.end });
  }
  const remaining = 42 - result.length;
  for (let d = 1; d <= remaining; d++) {
    const dateStr = formatDate(new Date(year, month + 1, d));
    result.push({ day: d, date: dateStr, currentMonth: false, isStart: dateStr === dateRange.value.start, isEnd: dateStr === dateRange.value.end, inRange: dateStr >= dateRange.value.start && dateStr <= dateRange.value.end });
  }
  return result;
}

const pickDateState = ref<"start" | "end">("start");

function pickDate(dateStr: string) {
  if (pickDateState.value === "start") {
    dateRange.value.start = dateStr;
    dateRange.value.end = dateStr;
    pickDateState.value = "end";
  } else {
    if (dateStr < dateRange.value.start) {
      dateRange.value.start = dateStr;
    } else {
      dateRange.value.end = dateStr;
    }
    pickDateState.value = "start";
  }
}

// ── Data Overview ──
const overviewStatCards = [
  { label: "会话总数", value: "0" },
  { label: "已接待的会话", value: "0" },
  { label: "完结率", value: "0%" },
  { label: "错过的会话", value: "0" }
];

const MAX_X_LABELS = 8;
const thinLabels = (labels: string[]) => {
  const count = labels.length;
  if (count <= MAX_X_LABELS) return labels;
  const step = (count - 1) / (MAX_X_LABELS - 1);
  const result: string[] = [];
  for (let i = 0; i < MAX_X_LABELS; i++) {
    result.push(labels[Math.round(i * step)]);
  }
  return result;
};

const chartDateLabels = computed(() => {
  const labels: string[] = [];
  const start = new Date(dateRange.value.start);
  const end = new Date(dateRange.value.end);
  const d = new Date(start);
  while (d <= end) {
    labels.push(formatDate(d));
    d.setDate(d.getDate() + 1);
  }
  return labels;
});

const chartXAxisLabels = computed(() => thinLabels(chartDateLabels.value));

const trendPoints = computed(() => {
  const count = chartDateLabels.value.length;
  if (count === 0) return [];
  return chartDateLabels.value.map((_, i) => ({
    x: count === 1 ? 250 : (i / (count - 1)) * 500,
    y: 200
  }));
});

const trendLinePoints = computed(() =>
  trendPoints.value.map((p) => `${p.x},${p.y}`).join(" ")
);

// ── AI Agent ──
const aiTopStatCards = [
  { label: "总会话数", value: "3" },
  { label: "已解决会话", value: "1" },
  { label: "未解决会话", value: "2" },
  { label: "转人工", value: "3" }
];

const aiChartXLabels = ["02/07", "02/11", "02/15", "02/19", "02/23", "02/27", "03/03", "03/07"];

// ── Evaluation Analysis ──
const evalStatCards = [
  { label: "参评率", value: "0%", sub: "0 会话" },
  { label: "满意", value: "0%", sub: "0 / 0 会话" },
  { label: "一般", value: "0%", sub: "0 / 0 会话" },
  { label: "不满意", value: "0%", sub: "0 / 0 会话" }
];

const evalChartDateLabels = computed(() => {
  const labels: string[] = [];
  const start = new Date(dateRange.value.start);
  const end = new Date(dateRange.value.end);
  const d = new Date(start);
  while (d <= end) {
    labels.push(formatDate(d));
    d.setDate(d.getDate() + 1);
  }
  return labels;
});

const evalXAxisLabels = computed(() => thinLabels(evalChartDateLabels.value));

const agentDetailRows = [
  {
    name: "客服主管",
    totalSessions: 0,
    ratedCount: 0,
    ratedRate: "0%",
    satisfied: 0,
    neutral: 0,
    unsatisfied: 0,
    satisfactionRate: "0%"
  }
];
</script>

<style scoped>
.report-page {
  gap: var(--agent-space-20);
  padding: var(--agent-space-24);
  padding-bottom: 48px;
}

.report-page__title {
  font-size: var(--agent-font-size-xl);
  font-weight: var(--agent-font-weight-semibold);
  color: var(--agent-color-text-primary);
  margin: 0;
}

/* ── Filter Bar ── */
.report-filter-bar {
  display: flex;
  align-items: center;
  gap: var(--agent-space-12);
}

.report-date-picker-wrap {
  position: relative;
}

.report-date-picker {
  display: inline-flex;
  align-items: center;
  gap: var(--agent-space-4);
  padding: 6px 12px;
  border: 1px solid var(--agent-color-border-default);
  border-radius: var(--agent-radius-md);
  background: var(--agent-color-bg-panel);
  cursor: pointer;
  font-size: var(--agent-font-size-sm);
  color: var(--agent-color-text-primary);
  user-select: none;
}

.report-date-picker__icon {
  font-size: var(--agent-font-size-sm);
  opacity: 0.5;
}

.report-agent-select {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: var(--agent-space-8);
  padding: 6px 12px;
  border: 1px solid var(--agent-color-border-default);
  border-radius: var(--agent-radius-md);
  background: var(--agent-color-bg-panel);
  cursor: pointer;
  font-size: var(--agent-font-size-sm);
  color: var(--agent-color-text-secondary);
  min-width: 120px;
  user-select: none;
}

.report-agent-select__arrow {
  margin-left: auto;
  color: var(--agent-color-text-tertiary);
}

.report-agent-select__dropdown {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  min-width: 100%;
  background: var(--agent-color-bg-panel);
  border: 1px solid var(--agent-color-border-default);
  border-radius: var(--agent-radius-md);
  box-shadow: var(--agent-shadow-md);
  z-index: var(--agent-z-dropdown);
  overflow: hidden;
}

.report-agent-select__option {
  display: flex;
  align-items: center;
  gap: var(--agent-space-8);
  padding: 8px 12px;
  font-size: var(--agent-font-size-sm);
  cursor: pointer;
  white-space: nowrap;
}

.report-agent-select__option:hover {
  background: var(--agent-color-bg-muted);
}

.report-agent-select__avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: linear-gradient(135deg, #e8d5b7, #c4a882);
  flex-shrink: 0;
}

/* ── Date Picker Panel ── */
.report-datepicker-panel {
  display: flex;
  background: var(--agent-color-bg-panel);
  border: 1px solid var(--agent-color-border-default);
  border-radius: var(--agent-radius-lg);
  box-shadow: var(--agent-shadow-lg);
  overflow: hidden;
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  z-index: var(--agent-z-dropdown);
}

.report-datepicker-panel__shortcuts {
  display: flex;
  flex-direction: column;
  padding: var(--agent-space-12) 0;
  border-right: 1px solid var(--agent-color-border-default);
  min-width: 80px;
}

.report-datepicker-panel__shortcut {
  padding: 8px 16px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: var(--agent-font-size-sm);
  color: var(--agent-color-text-primary);
  text-align: left;
  white-space: nowrap;
}

.report-datepicker-panel__shortcut:hover {
  background: var(--agent-color-bg-muted);
}

.report-datepicker-panel__calendars {
  display: flex;
  gap: var(--agent-space-16);
  padding: var(--agent-space-16);
}

.report-datepicker-panel__month {
  min-width: 260px;
}

.report-datepicker-panel__month-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--agent-space-8);
  margin-bottom: var(--agent-space-12);
}

.report-datepicker-panel__month-title {
  font-size: var(--agent-font-size-md);
  font-weight: var(--agent-font-weight-semibold);
  color: var(--agent-color-text-primary);
  flex: 1;
  text-align: center;
}

.report-datepicker-panel__nav {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px 8px;
  color: var(--agent-color-text-tertiary);
  font-size: var(--agent-font-size-lg);
}

.report-datepicker-panel__nav:hover {
  color: var(--agent-color-text-primary);
}

.report-datepicker-panel__weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  font-size: var(--agent-font-size-xs);
  color: var(--agent-color-text-tertiary);
  margin-bottom: var(--agent-space-8);
}

.report-datepicker-panel__days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
}

.report-datepicker-panel__day {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  font-size: var(--agent-font-size-sm);
  border: none;
  border-radius: 50%;
  cursor: pointer;
  background: none;
  color: var(--agent-color-text-primary);
  margin: 0 auto;
}

.report-datepicker-panel__day:hover {
  background: var(--agent-color-bg-muted);
}

.report-datepicker-panel__day--other {
  color: var(--agent-color-text-disabled);
}

.report-datepicker-panel__day--start,
.report-datepicker-panel__day--end {
  background: var(--agent-color-brand-primary) !important;
  color: #fff !important;
  border-radius: 50%;
}

.report-datepicker-panel__day--in-range:not(.report-datepicker-panel__day--start):not(.report-datepicker-panel__day--end) {
  background: var(--agent-color-brand-soft);
  border-radius: 0;
}

/* ── Stat Cards ── */
.report-stat-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0;
}

.report-stat-row .report-stat-card {
  border-radius: 0;
  border-right: 1px solid var(--agent-color-border-default);
}

.report-stat-row .report-stat-card:first-child {
  border-radius: var(--agent-radius-lg) 0 0 var(--agent-radius-lg);
}

.report-stat-row .report-stat-card:last-child {
  border-radius: 0 var(--agent-radius-lg) var(--agent-radius-lg) 0;
  border-right: none;
}

.report-stat-card {
  display: flex;
  flex-direction: column;
  gap: var(--agent-space-8);
  padding: var(--agent-space-20);
}

.report-stat-card__label {
  display: flex;
  align-items: center;
  gap: var(--agent-space-4);
  color: var(--agent-color-text-secondary);
  font-size: var(--agent-font-size-sm);
}

.report-stat-card__help {
  color: var(--agent-color-text-disabled);
  font-size: var(--agent-font-size-xs);
  cursor: help;
}

.report-stat-card__value {
  font-size: 28px;
  font-weight: var(--agent-font-weight-semibold);
  color: var(--agent-color-text-primary);
  font-variant-numeric: tabular-nums;
  line-height: 1.2;
}

.report-stat-card__sub {
  color: var(--agent-color-text-tertiary);
  font-size: var(--agent-font-size-xs);
}

.report-stat-card__desc {
  color: var(--agent-color-text-tertiary);
  font-size: var(--agent-font-size-xs);
  line-height: 1.5;
}

/* ── Charts Grid ── */
.report-charts-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--agent-space-16);
}

.report-chart-panel {
  display: flex;
  flex-direction: column;
  min-height: 280px;
  min-width: 0;
  overflow-x: hidden;
  padding: var(--agent-space-20);
}

.report-chart-panel--wide {
  grid-column: 1 / -1;
}

.report-chart-panel__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--agent-space-16);
}

.report-chart-panel__title {
  font-size: var(--agent-font-size-md);
  font-weight: var(--agent-font-weight-semibold);
  color: var(--agent-color-text-primary);
}

.report-chart-panel__legend {
  font-size: var(--agent-font-size-sm);
  color: var(--agent-color-brand-primary);
}

.report-chart-panel__legend strong {
  margin-left: var(--agent-space-4);
}

.report-chart-panel__legend-bar {
  display: flex;
  gap: var(--agent-space-16);
  margin-bottom: var(--agent-space-16);
}

.report-chart-panel__legend-item {
  display: flex;
  align-items: center;
  gap: var(--agent-space-4);
  font-size: var(--agent-font-size-sm);
  color: var(--agent-color-text-secondary);
}

.report-chart-panel__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.report-chart-panel__body {
  flex: 1;
  display: flex;
  align-items: stretch;
}

.report-chart-panel__body--empty {
  align-items: center;
  justify-content: center;
}

.report-chart-panel__empty-text {
  color: var(--agent-color-text-disabled);
  font-size: var(--agent-font-size-sm);
}

/* ── Line Chart ── */
.report-line-chart {
  display: flex;
  flex: 1;
  gap: var(--agent-space-8);
}

.report-line-chart__y-axis {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  font-size: var(--agent-font-size-xs);
  color: var(--agent-color-text-tertiary);
  padding-bottom: 24px;
  min-width: 28px;
  text-align: right;
}

.report-line-chart__area {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.report-line-chart__svg {
  height: 200px;
  width: 100%;
}

.report-line-chart__x-axis {
  display: flex;
  justify-content: space-between;
  font-size: var(--agent-font-size-xs);
  color: var(--agent-color-text-tertiary);
  min-width: 0;
  overflow: hidden;
  padding-top: var(--agent-space-8);
}

.report-line-chart__x-axis > span {
  flex-shrink: 0;
  text-align: center;
  white-space: nowrap;
}

/* ── Bar Chart ── */
.report-bar-chart {
  display: flex;
  align-items: flex-end;
  gap: var(--agent-space-12);
  height: 200px;
  justify-content: space-between;
  flex: 1;
}

.report-bar-chart__group {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  flex: 1;
  height: 100%;
  justify-content: flex-end;
}

.report-bar-chart__track {
  background: var(--agent-color-bg-muted);
  border-radius: var(--agent-radius-sm);
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: flex-end;
  overflow: hidden;
  width: 100%;
  max-width: 48px;
}

.report-bar-chart__fill {
  background: linear-gradient(180deg, #2f6bff 0%, #69a1ff 100%);
  border-radius: var(--agent-radius-sm) var(--agent-radius-sm) 0 0;
  min-height: 4px;
  transition: height var(--agent-motion-base);
  width: 100%;
}

.report-bar-chart__label {
  color: var(--agent-color-text-tertiary);
  font-size: var(--agent-font-size-xs);
}

.report-bar-chart__value {
  color: var(--agent-color-text-secondary);
  font-size: var(--agent-font-size-xs);
  font-variant-numeric: tabular-nums;
  font-weight: var(--agent-font-weight-medium);
}

/* ── AI Inline Stats ── */
.ai-report-inline-stats {
  display: flex;
  gap: var(--agent-space-24);
  margin-bottom: var(--agent-space-12);
}

.ai-report-inline-stat strong {
  font-size: var(--agent-font-size-xl);
  font-weight: var(--agent-font-weight-semibold);
  color: var(--agent-color-text-primary);
}

/* ── AI Report Link ── */
.ai-report-link {
  color: var(--agent-color-brand-primary);
  font-size: var(--agent-font-size-sm);
  text-decoration: none;
  margin-top: var(--agent-space-12);
}

.ai-report-link:hover {
  text-decoration: underline;
}

/* ── AI Report Average ── */
.ai-report-avg {
  display: flex;
  flex-direction: column;
  gap: var(--agent-space-4);
  margin-bottom: var(--agent-space-12);
}

.ai-report-avg__label {
  color: var(--agent-color-brand-primary);
  font-size: var(--agent-font-size-sm);
}

.ai-report-avg__value {
  font-size: 28px;
  font-weight: var(--agent-font-weight-semibold);
  color: var(--agent-color-text-primary);
  line-height: 1.2;
}

/* ── Donut Chart ── */
.ai-report-donut-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--agent-space-16);
  flex: 1;
  padding-top: var(--agent-space-8);
}

.ai-report-donut-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
}

.ai-report-donut-meta__label {
  color: var(--agent-color-text-tertiary);
  font-size: var(--agent-font-size-sm);
}

.ai-report-donut-meta__value {
  font-size: var(--agent-font-size-xl);
  font-weight: var(--agent-font-weight-semibold);
  color: var(--agent-color-text-primary);
}

.ai-report-donut {
  width: 140px;
  height: 140px;
}

.ai-report-donut__svg {
  width: 100%;
  height: 100%;
}

.ai-report-donut-legend {
  display: flex;
  flex-direction: column;
  gap: var(--agent-space-8);
  width: 100%;
}

/* ── AI Report Empty State ── */
.ai-report-empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  flex: 1;
}

.ai-report-empty-state__icon {
  font-size: 48px;
  margin-bottom: var(--agent-space-16);
  opacity: 0.6;
}

.ai-report-empty-state__title {
  font-size: var(--agent-font-size-md);
  font-weight: var(--agent-font-weight-semibold);
  color: var(--agent-color-text-primary);
  margin: 0 0 var(--agent-space-8) 0;
}

.ai-report-empty-state__desc {
  font-size: var(--agent-font-size-sm);
  color: var(--agent-color-text-tertiary);
  margin: 0;
  text-align: center;
}

/* ── Table Panel ── */
.report-table-panel {
  padding: var(--agent-space-20);
}

.report-table-panel__title {
  font-size: var(--agent-font-size-md);
  font-weight: var(--agent-font-weight-semibold);
  color: var(--agent-color-text-primary);
  margin: 0 0 var(--agent-space-16) 0;
}

.report-table {
  width: 100%;
  border-collapse: collapse;
  font-size: var(--agent-font-size-sm);
}

.report-table__th {
  padding: 10px 12px;
  text-align: center;
  font-weight: var(--agent-font-weight-medium);
  color: var(--agent-color-text-secondary);
  background: var(--agent-color-bg-muted);
  border-bottom: 1px solid var(--agent-color-border-default);
  white-space: nowrap;
}

.report-table__th--left {
  text-align: left;
}

.report-table__td {
  padding: 12px;
  text-align: center;
  color: var(--agent-color-text-primary);
  border-bottom: 1px solid var(--agent-color-border-default);
  font-variant-numeric: tabular-nums;
}

.report-table__td--left {
  text-align: left;
}

.report-table__agent-avatar {
  display: inline-block;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: linear-gradient(135deg, #e8d5b7, #c4a882);
  vertical-align: middle;
  margin-right: var(--agent-space-8);
}

.report-table-panel__footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: var(--agent-space-16);
  margin-top: var(--agent-space-16);
  font-size: var(--agent-font-size-sm);
  color: var(--agent-color-text-secondary);
}

.report-table-panel__pagination {
  display: flex;
  align-items: center;
  gap: var(--agent-space-4);
}

.report-pagination__btn {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 32px;
  height: 32px;
  padding: 0 8px;
  border: 1px solid var(--agent-color-border-default);
  border-radius: var(--agent-radius-sm);
  background: var(--agent-color-bg-panel);
  font-size: var(--agent-font-size-sm);
  color: var(--agent-color-text-secondary);
  cursor: pointer;
}

.report-pagination__btn:disabled {
  cursor: default;
  opacity: 0.4;
}

.report-pagination__btn--active {
  border-color: var(--agent-color-brand-primary);
  color: var(--agent-color-brand-primary);
  font-weight: var(--agent-font-weight-medium);
}

.report-pagination__size {
  padding: 4px 8px;
  border: 1px solid var(--agent-color-border-default);
  border-radius: var(--agent-radius-sm);
  font-size: var(--agent-font-size-sm);
  color: var(--agent-color-text-secondary);
  white-space: nowrap;
}
</style>
