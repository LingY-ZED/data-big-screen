<template>
  <div ref="chartRef" class="chart-canvas" data-testid="chart-line" />
</template>

<script setup lang="ts">
import type { EChartsOption } from 'echarts'
import * as echarts from 'echarts'
import { ref, watch } from 'vue'

import { useEChart } from '@/charts/useEChart'
import type { TrendPoint } from '@/types/dashboard'

const props = defineProps<{
  data: TrendPoint[]
}>()

const chartRef = ref<HTMLElement | null>(null)

function createArea(color: string) {
  return new echarts.graphic.LinearGradient(0, 0, 0, 1, [
    { color, offset: 0 },
    { color: 'rgba(0, 0, 0, 0)', offset: 1 },
  ])
}

const { render } = useEChart(chartRef, (): EChartsOption => {
  const labels = props.data.map((item) => item.time)

  return {
    backgroundColor: 'transparent',
    color: ['#24d7ff', '#45f0a0', '#ffcf5a', '#5b8cff'],
    grid: {
      bottom: 32,
      left: 44,
      right: 48,
      top: 42,
    },
    legend: {
      right: 12,
      textStyle: {
        color: '#9fd8e8',
      },
      top: 6,
    },
    tooltip: {
      axisPointer: {
        lineStyle: {
          color: '#65e7ff',
        },
        type: 'line',
      },
      trigger: 'axis',
    },
    xAxis: {
      axisLabel: {
        color: '#89b8c9',
      },
      axisLine: {
        lineStyle: {
          color: 'rgba(137, 184, 201, 0.32)',
        },
      },
      boundaryGap: false,
      data: labels,
      type: 'category',
    },
    yAxis: [
      {
        axisLabel: {
          color: '#89b8c9',
          formatter: '{value}%',
        },
        max: 100,
        min: 0,
        name: '使用率',
        nameTextStyle: {
          color: '#89b8c9',
        },
        splitLine: {
          lineStyle: {
            color: 'rgba(137, 184, 201, 0.14)',
          },
        },
        type: 'value',
      },
      {
        axisLabel: {
          color: '#89b8c9',
        },
        name: 'MB/s',
        nameTextStyle: {
          color: '#89b8c9',
        },
        splitLine: {
          show: false,
        },
        type: 'value',
      },
    ],
    series: [
      {
        areaStyle: {
          color: createArea('rgba(36, 215, 255, 0.32)'),
        },
        data: props.data.map((item) => item.cpuUsage),
        name: 'CPU使用率',
        showSymbol: false,
        smooth: true,
        type: 'line',
        yAxisIndex: 0,
      },
      {
        areaStyle: {
          color: createArea('rgba(69, 240, 160, 0.2)'),
        },
        data: props.data.map((item) => item.memoryUsage),
        name: '内存使用率',
        showSymbol: false,
        smooth: true,
        type: 'line',
        yAxisIndex: 0,
      },
      {
        data: props.data.map((item) => item.networkIn),
        name: '入站带宽',
        showSymbol: false,
        smooth: true,
        type: 'line',
        yAxisIndex: 1,
      },
      {
        data: props.data.map((item) => item.networkOut),
        name: '出站带宽',
        showSymbol: false,
        smooth: true,
        type: 'line',
        yAxisIndex: 1,
      },
    ],
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
