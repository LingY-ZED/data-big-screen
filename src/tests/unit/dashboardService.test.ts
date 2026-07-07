import { describe, expect, it } from 'vitest'

import { dashboardService } from '@/services/dashboardService'

describe('dashboardService', () => {
  it('returns dashboard data from mock source by default', async () => {
    const data = await dashboardService.getDashboardData()

    expect(data.metrics.length).toBeGreaterThan(0)
    expect(data.trends.length).toBeGreaterThan(0)
    expect(data.categories.length).toBeGreaterThan(0)
    expect(data.rankings.length).toBeGreaterThan(0)
    expect(data.activities.length).toBeGreaterThan(0)
  })
})
