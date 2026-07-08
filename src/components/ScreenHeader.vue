<template>
  <header class="screen-header">
    <div class="header-side">
      <span class="status-dot" />
      <span>MySQL 数据源 · 实时聚合 API</span>
    </div>
    <div class="title-wrap">
      <h1>数据中心运行监控大屏 <span class="product-name">DataVisionLab</span></h1>
      <p>主机 · CPU · 内存 · 磁盘 · 网络 · 运行告警</p>
    </div>
    <div class="header-time">
      <span class="current-time">{{ currentTime }}</span>
      <small>数据更新时间：{{ updatedText }}</small>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

import { formatDateTime } from '@/utils/format'

const props = defineProps<{
  updatedAt?: string
}>()

const currentTime = ref(formatDateTime(new Date()))
let timer: number | undefined

const updatedText = computed(() => (props.updatedAt ? formatDateTime(props.updatedAt) : '--'))

onMounted(() => {
  timer = window.setInterval(() => {
    currentTime.value = formatDateTime(new Date())
  }, 1_000)
})

onBeforeUnmount(() => {
  if (timer) {
    window.clearInterval(timer)
  }
})
</script>

<style scoped>
.screen-header {
  position: relative;
  display: grid;
  grid-template-columns: 360px 1fr 360px;
  align-items: center;
  height: 86px;
  padding: 0 10px;
}

.screen-header::before,
.screen-header::after {
  position: absolute;
  bottom: 0;
  width: 38%;
  height: 1px;
  content: '';
  background: linear-gradient(90deg, transparent, rgb(101 231 255 / 56%), transparent);
}

.screen-header::before {
  left: 0;
}

.screen-header::after {
  right: 0;
}

.header-side,
.header-time {
  display: flex;
  flex-direction: column;
  gap: 6px;
  color: #9fd8e8;
  font-size: 14px;
}

.header-side {
  flex-direction: row;
  align-items: center;
}

.status-dot {
  width: 9px;
  height: 9px;
  background: #45f0a0;
  border-radius: 50%;
  box-shadow: 0 0 16px #45f0a0;
}

.title-wrap {
  text-align: center;
}

.title-wrap h1 {
  margin: 0;
  color: #f2feff;
  font-size: 37px;
  font-weight: 800;
  letter-spacing: 0;
  text-shadow: 0 0 24px rgb(36 215 255 / 42%);
}

.product-name {
  color: #65e7ff;
  font-size: 24px;
  font-weight: 700;
}

.title-wrap p {
  margin: 8px 0 0;
  color: #74aabd;
  font-size: 13px;
}

.header-time {
  align-items: flex-end;
}

.current-time {
  color: #ecfdff;
  font-size: 18px;
  font-variant-numeric: tabular-nums;
}

.header-time small {
  color: #74aabd;
  font-size: 12px;
}
</style>
