<template>
  <div ref="chartRef" class="chart-canvas" data-testid="chart-map" />
</template>

<script setup lang="ts">
import type { EChartsOption } from 'echarts'
import { ref, watch } from 'vue'

import { useEChart } from '@/charts/useEChart'
import type { DashboardMapData, MapNodeStatus } from '@/types/dashboard'

const props = defineProps<{
  data: DashboardMapData
}>()

const chartRef = ref<HTMLElement | null>(null)

const nodeColors: Record<MapNodeStatus, string> = {
  busy: '#ffcf5a',
  normal: '#24d7ff',
  risk: '#ff7a90',
}

const { render } = useEChart(chartRef, (): EChartsOption => ({
  backgroundColor: 'transparent',
  graphic: [
    {
      left: 'center',
      style: {
        fill: 'rgba(36, 215, 255, 0.08)',
        stroke: 'rgba(101, 231, 255, 0.32)',
      },
      top: 'middle',
      type: 'circle',
      shape: {
        r: 182,
      },
    },
    {
      left: 'center',
      style: {
        fill: 'rgba(69, 240, 160, 0.04)',
        stroke: 'rgba(69, 240, 160, 0.22)',
      },
      top: 'middle',
      type: 'circle',
      shape: {
        r: 252,
      },
    },
  ],
  series: [
    {
      data: props.data.nodes.map((node) => ({
        itemStyle: {
          color: nodeColors[node.status],
          shadowBlur: 26,
          shadowColor: nodeColors[node.status],
        },
        label: {
          color: '#e6fbff',
          fontSize: node.name === '监控中心' ? 17 : 13,
          fontWeight: node.name === '监控中心' ? 700 : 500,
          show: true,
        },
        name: node.name,
        symbolSize: node.name === '监控中心' ? 86 : Math.max(42, node.value * 0.66),
        value: node.value,
        x: node.x,
        y: node.y,
      })),
      edgeSymbol: ['none', 'arrow'],
      edgeSymbolSize: 8,
      force: {
        repulsion: 260,
      },
      layout: 'none',
      lineStyle: {
        color: 'rgba(101, 231, 255, 0.38)',
        curveness: 0.12,
        width: 2,
      },
      links: props.data.links,
      roam: false,
      type: 'graph',
    },
  ],
  tooltip: {
    formatter: '{b}<br />指数：{c}',
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
