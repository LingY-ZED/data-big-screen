<template>
  <div ref="chartRef" class="chart-canvas" data-testid="chart-pie" />
</template>

<script setup lang="ts">
import type { EChartsOption } from 'echarts'
import { ref, watch } from 'vue'

import { useEChart } from '@/charts/useEChart'
import type { CategoryDistribution } from '@/types/dashboard'

const props = defineProps<{
  data: CategoryDistribution[]
}>()

const chartRef = ref<HTMLElement | null>(null)

const { render } = useEChart(chartRef, (): EChartsOption => ({
  backgroundColor: 'transparent',
  legend: {
    bottom: 2,
    icon: 'circle',
    itemGap: 12,
    textStyle: {
      color: '#9fd8e8',
      fontSize: 12,
    },
  },
  series: [
    {
      avoidLabelOverlap: true,
      center: ['50%', '42%'],
      data: props.data.map((item) => ({
        itemStyle: {
          color: item.color,
        },
        name: item.name,
        value: item.value,
      })),
      emphasis: {
        scale: true,
        scaleSize: 8,
      },
      label: {
        color: '#d9f7ff',
        formatter: '{b}\n{d}%',
      },
      labelLine: {
        lineStyle: {
          color: 'rgba(217, 247, 255, 0.38)',
        },
      },
      radius: ['48%', '68%'],
      type: 'pie',
    },
  ],
  tooltip: {
    formatter: '{b}: {d}%',
    trigger: 'item',
  },
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
