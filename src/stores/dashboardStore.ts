import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import { logger } from '@/logs/logger'
import { dashboardService } from '@/services/dashboardService'
import type { DashboardData } from '@/types/dashboard'

function toErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : '数据加载失败'
}

export const useDashboardStore = defineStore('dashboard', () => {
  const dashboard = ref<DashboardData | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const metrics = computed(() => dashboard.value?.metrics ?? [])
  const trends = computed(() => dashboard.value?.trends ?? [])
  const categories = computed(() => dashboard.value?.categories ?? [])
  const rankings = computed(() => dashboard.value?.rankings ?? [])
  const radar = computed(
    () =>
      dashboard.value?.radar ?? {
        indicators: [],
        values: [],
      },
  )
  const map = computed(
    () =>
      dashboard.value?.map ?? {
        links: [],
        nodes: [],
      },
  )
  const activities = computed(() => dashboard.value?.activities ?? [])

  async function fetchDashboard() {
    loading.value = true
    error.value = null

    try {
      dashboard.value = await dashboardService.getDashboardData()
      logger.info('Dashboard data loaded', {
        metrics: dashboard.value.metrics.length,
      })
    } catch (requestError: unknown) {
      error.value = toErrorMessage(requestError)
      logger.error('Dashboard data load failed', requestError)
    } finally {
      loading.value = false
    }
  }

  return {
    activities,
    categories,
    dashboard,
    error,
    fetchDashboard,
    loading,
    map,
    metrics,
    radar,
    rankings,
    trends,
  }
})
