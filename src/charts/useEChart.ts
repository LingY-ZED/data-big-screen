import type { ECharts, EChartsOption } from 'echarts'
import * as echarts from 'echarts'
import { nextTick, onBeforeUnmount, onMounted, shallowRef, type Ref } from 'vue'

import { logger } from '@/logs/logger'
import { bindChartResize } from '@/utils/resize'

export function useEChart(container: Ref<HTMLElement | null>, getOption: () => EChartsOption) {
  const chart = shallowRef<ECharts | null>(null)
  let stopResize: (() => void) | undefined

  const render = () => {
    if (!chart.value) {
      return
    }

    chart.value.setOption(getOption(), true)
  }

  onMounted(async () => {
    await nextTick()

    if (!container.value) {
      logger.warn('Chart container is not ready')
      return
    }

    chart.value = echarts.init(container.value, 'dark', {
      renderer: 'canvas',
    })
    stopResize = bindChartResize(chart.value, container.value)
    render()
  })

  onBeforeUnmount(() => {
    stopResize?.()
    chart.value?.dispose()
    chart.value = null
  })

  return {
    chart,
    render,
  }
}
