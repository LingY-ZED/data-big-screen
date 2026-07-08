import { describe, expect, it } from 'vitest'

import { buildDashboardData } from '../../../server/services/dashboardAggregator'
import type { DashboardInput } from '../../../server/types'

describe('dashboardAggregator', () => {
  it('builds datacenter dashboard data from raw metric points', () => {
    const input: DashboardInput = {
      hosts: [
        {
          hostId: 'host001',
          hostname: 'server-001.hismartlab.cn',
          locationRoom: 'A机房',
          model: 'Dell R750',
          owner: '陈三',
          rack: '机柜01',
        },
      ],
      prefPoints: [
        {
          hostId: 'host001',
          metricType: 'pref',
          mod: 'cpu_usage',
          sampledAt: '2026-07-07 23:00:00.000',
          tag: 'cpu_percent',
          ts: 1783436400000,
          value: 82,
        },
        {
          hostId: 'host001',
          metricType: 'pref',
          mod: 'cpu_wait',
          sampledAt: '2026-07-07 23:00:00.000',
          tag: 'cpu_percent',
          ts: 1783436400000,
          value: 12,
        },
        {
          hostId: 'host001',
          metricType: 'pref',
          mod: 'mem_used',
          sampledAt: '2026-07-07 23:00:00.000',
          tag: 'mem_metric',
          ts: 1783436400000,
          value: 80,
        },
        {
          hostId: 'host001',
          metricType: 'pref',
          mod: 'mem_free',
          sampledAt: '2026-07-07 23:00:00.000',
          tag: 'mem_metric',
          ts: 1783436400000,
          value: 20,
        },
        {
          hostId: 'host001',
          metricType: 'pref',
          mod: 'mem_cache',
          sampledAt: '2026-07-07 23:00:00.000',
          tag: 'mem_metric',
          ts: 1783436400000,
          value: 0,
        },
        {
          hostId: 'host001',
          metricType: 'pref',
          mod: 'mem_buff',
          sampledAt: '2026-07-07 23:00:00.000',
          tag: 'mem_metric',
          ts: 1783436400000,
          value: 0,
        },
        {
          hostId: 'host001',
          metricType: 'pref',
          mod: 'load1',
          sampledAt: '2026-07-07 23:00:00.000',
          tag: 'load_average',
          ts: 1783436400000,
          value: 9.2,
        },
        {
          hostId: 'host001',
          metricType: 'pref',
          mod: 'net_in',
          sampledAt: '2026-07-07 23:00:00.000',
          tag: 'net_speed_mb',
          ts: 1783436400000,
          value: 12.5,
        },
        {
          hostId: 'host001',
          metricType: 'pref',
          mod: 'net_out',
          sampledAt: '2026-07-07 23:00:00.000',
          tag: 'net_speed_mb',
          ts: 1783436400000,
          value: 8.5,
        },
      ],
      diskPoints: [
        {
          hostId: 'host001',
          metricType: 'disk',
          mod: 'sda_util',
          sampledAt: '2026-07-07 23:00:00.000',
          tag: 'disk_util_percent',
          ts: 1783436400000,
          value: 91,
        },
      ],
    }

    const dashboard = buildDashboardData(input)

    expect(dashboard.metrics.find((metric) => metric.id === 'hosts')?.value).toBe(1)
    expect(dashboard.metrics.find((metric) => metric.id === 'cpu')?.status).toBe('warning')
    expect(dashboard.metrics.find((metric) => metric.id === 'disk')?.status).toBe('danger')
    expect(dashboard.trends[0]).toMatchObject({
      cpuUsage: 82,
      memoryUsage: 80,
      networkIn: 12.5,
      networkOut: 8.5,
    })
    expect(dashboard.rankings[0].name).toBe('server-001')
    expect(dashboard.activities.some((activity) => activity.title === '磁盘利用率告警')).toBe(true)
  })
})
