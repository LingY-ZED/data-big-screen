<template>
  <div ref="chartRef" class="chart-canvas" data-testid="chart-bar" />
</template>

<script setup lang="ts">
import type { EChartsOption } from 'echarts'
import * as echarts from 'echarts'
import { ref, watch } from 'vue'

import { useEChart } from '@/charts/useEChart'
import type { RankingItem } from '@/types/dashboard'

const props = defineProps<{
  data: RankingItem[]
}>()

const chartRef = ref<HTMLElement | null>(null)

const { render } = useEChart(chartRef, (): EChartsOption => ({
  backgroundColor: 'transparent',
  grid: {
    bottom: 22,
    left: 58,
    right: 24,
    top: 22,
  },
  tooltip: {
    formatter: '{b}<br />访问量：{c}',
    trigger: 'axis',
  },
  xAxis: {
    axisLabel: {
      color: '#89b8c9',
    },
    splitLine: {
      lineStyle: {
        color: 'rgba(137, 184, 201, 0.12)',
      },
    },
    type: 'value',
  },
  yAxis: {
    axisLabel: {
      color: '#d9f7ff',
      fontSize: 13,
    },
    axisLine: {
      show: false,
    },
    axisTick: {
      show: false,
    },
    data: props.data.map((item) => item.city).reverse(),
    type: 'category',
  },
  series: [
    {
      barMaxWidth: 16,
      data: props.data.map((item) => item.value).reverse(),
      itemStyle: {
        borderRadius: [0, 10, 10, 0],
        color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
          { color: '#1a77ff', offset: 0 },
          { color: '#24d7ff', offset: 0.62 },
          { color: '#45f0a0', offset: 1 },
        ]),
      },
      label: {
        color: '#b8ecff',
        formatter: '{c}',
        position: 'right',
        show: true,
      },
      name: '城市访问量',
      type: 'bar',
    },
  ],
}))

watch(
  () => props.data,
  () => render(),
  { deep: true },
)
</script>

<style scoped>
.chart-canvas {
  width: 100%;
  height: 100%;
  min-height: 0;
}
</style>
