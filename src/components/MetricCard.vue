<template>
  <article class="metric-card" :class="`metric-card-${metric.status}`" data-testid="metric-card">
    <div class="metric-icon">
      <span />
    </div>
    <div class="metric-content">
      <p class="metric-label">{{ metric.label }}</p>
      <div class="metric-value-row">
        <strong>{{ displayValue }}</strong>
        <span>{{ displayUnit }}</span>
      </div>
      <p class="metric-trend" :class="`metric-trend-${metric.trend}`">
        {{ metric.trend === 'down' ? '较昨日' : '同比增长' }} {{ trendText }}
      </p>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import type { SummaryMetric } from '@/types/dashboard'
import { formatCompactNumber, formatTrend } from '@/utils/format'

const props = defineProps<{
  metric: SummaryMetric
}>()

const displayValue = computed(() => {
  if (props.metric.unit === '%') {
    return props.metric.value.toFixed(1)
  }

  return formatCompactNumber(props.metric.value)
})

const displayUnit = computed(() => props.metric.unit ?? '')
const trendText = computed(() => formatTrend(props.metric.delta))
</script>

<style scoped>
.metric-card {
  position: relative;
  display: grid;
  grid-template-columns: 58px 1fr;
  gap: 16px;
  min-width: 0;
  height: 126px;
  padding: 20px 22px;
  overflow: hidden;
  background:
    radial-gradient(circle at 88% 18%, rgb(36 215 255 / 18%), transparent 32%),
    linear-gradient(145deg, rgb(10 38 62 / 88%), rgb(7 23 40 / 78%));
  border: 1px solid rgb(101 231 255 / 20%);
  border-radius: 8px;
  box-shadow: inset 0 0 26px rgb(36 215 255 / 8%);
}

.metric-card::after {
  position: absolute;
  right: -32px;
  bottom: -54px;
  width: 138px;
  height: 138px;
  content: '';
  border: 1px solid rgb(101 231 255 / 16%);
  border-radius: 50%;
}

.metric-icon {
  display: grid;
  width: 58px;
  height: 58px;
  place-items: center;
  margin-top: 7px;
  background: rgb(36 215 255 / 10%);
  border: 1px solid rgb(101 231 255 / 28%);
  border-radius: 8px;
}

.metric-icon span {
  width: 24px;
  height: 24px;
  background: linear-gradient(135deg, #24d7ff, #45f0a0);
  clip-path: polygon(50% 0, 100% 38%, 82% 100%, 18% 100%, 0 38%);
  filter: drop-shadow(0 0 12px rgb(36 215 255 / 68%));
}

.metric-content {
  min-width: 0;
}

.metric-label {
  margin: 0;
  color: #8fbfd0;
  font-size: 15px;
}

.metric-value-row {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-top: 8px;
}

.metric-value-row strong {
  color: #f2feff;
  font-size: 34px;
  font-variant-numeric: tabular-nums;
  line-height: 1;
}

.metric-value-row span {
  color: #65e7ff;
  font-size: 14px;
}

.metric-trend {
  margin: 13px 0 0;
  font-size: 13px;
}

.metric-trend-up {
  color: #45f0a0;
}

.metric-trend-down {
  color: #ffcf5a;
}

.metric-trend-stable {
  color: #9fd8e8;
}

.metric-card-warning .metric-icon span {
  background: linear-gradient(135deg, #ffcf5a, #24d7ff);
}

.metric-card-danger .metric-icon span {
  background: linear-gradient(135deg, #ff7a90, #ffcf5a);
}
</style>
