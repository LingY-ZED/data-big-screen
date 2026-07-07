import type { ECharts } from 'echarts'

export function bindChartResize(chart: ECharts, element: HTMLElement) {
  const resize = () => {
    chart.resize()
  }

  const observer = new ResizeObserver(resize)
  observer.observe(element)
  window.addEventListener('resize', resize)

  return () => {
    observer.disconnect()
    window.removeEventListener('resize', resize)
  }
}
