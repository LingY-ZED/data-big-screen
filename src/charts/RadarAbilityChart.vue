<template>
  <div ref="chartRef" class="chart-canvas" data-testid="chart-radar" />
</template>

<script setup lang="ts">
import type { EChartsOption } from 'echarts'
import { ref, watch } from 'vue'

import { useEChart } from '@/charts/useEChart'
import type { RadarData } from '@/types/dashboard'

const props = defineProps<{
  data: RadarData
}>()

const chartRef = ref<HTMLElement | null>(null)

const { render } = useEChart(chartRef, (): EChartsOption => {
  if (props.data.indicators.length === 0) {
    return {
      backgroundColor: 'transparent',
    }
  }

  return {
    backgroundColor: 'transparent',
    radar: {
      axisName: {
        color: '#b8ecff',
        fontSize: 13,
      },
      indicator: props.data.indicators,
      radius: '66%',
      splitArea: {
        areaStyle: {
          color: ['rgba(36, 215, 255, 0.03)', 'rgba(36, 215, 255, 0.08)'],
        },
      },
      splitLine: {
        lineStyle: {
          color: 'rgba(101, 231, 255, 0.26)',
        },
      },
    },
    series: [
      {
        areaStyle: {
          color: 'rgba(69, 240, 160, 0.22)',
        },
        data: [
          {
            name: '能力指数',
            value: props.data.values,
          },
        ],
        itemStyle: {
          color: '#45f0a0',
        },
        lineStyle: {
          color: '#45f0a0',
          width: 2,
        },
        symbol: 'circle',
        symbolSize: 5,
        type: 'radar',
      },
    ],
    tooltip: {
      trigger: 'item',
    },
  }
})

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
