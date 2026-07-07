import { httpClient } from '@/services/http'
import { getDataSource } from '@/services/dataSource'
import type { DashboardData } from '@/types/dashboard'
import { logger } from '@/logs/logger'

interface ApiResponse<T> {
  data: T
  message?: string
  success?: boolean
}

function unwrapDashboardResponse(response: ApiResponse<DashboardData> | DashboardData) {
  if ('metrics' in response) {
    return response
  }

  return response.data
}

export const dashboardService = {
  async getDashboardData(): Promise<DashboardData> {
    logger.debug('Fetching dashboard data', {
      source: getDataSource(),
    })

    const response = await httpClient.get<ApiResponse<DashboardData> | DashboardData>('/dashboard')
    return unwrapDashboardResponse(response.data)
  },
}
