import type { Pool, RowDataPacket } from 'mysql2/promise'

import type { DashboardData, HostRow, MetricPointRow } from '../types'
import { buildDashboardData } from './dashboardAggregator'

interface HostDbRow extends RowDataPacket {
  hostId: string
  hostname: string
  locationRoom: string
  model: string
  owner: string
  rack: string
}

interface MetricPointDbRow extends RowDataPacket {
  hostId: string
  metricType: string
  mod: string
  sampledAt: string
  tag: string
  ts: number
  value: string
}

function normalizePoint(row: MetricPointDbRow): MetricPointRow {
  return {
    hostId: row.hostId,
    metricType: row.metricType,
    mod: row.mod,
    sampledAt: row.sampledAt,
    tag: row.tag,
    ts: Number(row.ts),
    value: Number(row.value),
  }
}

export async function fetchDashboardData(pool: Pool): Promise<DashboardData> {
  const [hosts] = await pool.query<HostDbRow[]>(`
    SELECT
      host_id AS hostId,
      hostname,
      owner,
      model,
      location_room AS locationRoom,
      rack
    FROM hosts
    ORDER BY host_id
  `)

  const [prefPoints] = await pool.query<MetricPointDbRow[]>(`
    SELECT
      ts,
      sampled_at AS sampledAt,
      host_id AS hostId,
      metric_type AS metricType,
      \`mod\` AS \`mod\`,
      value,
      tag
    FROM metric_points
    WHERE metric_type = 'pref'
    ORDER BY ts ASC
  `)

  const [diskPoints] = await pool.query<MetricPointDbRow[]>(`
    SELECT
      ts,
      sampled_at AS sampledAt,
      host_id AS hostId,
      metric_type AS metricType,
      \`mod\` AS \`mod\`,
      value,
      tag
    FROM metric_points
    WHERE metric_type = 'disk'
    ORDER BY ts ASC
  `)

  return buildDashboardData({
    diskPoints: diskPoints.map(normalizePoint),
    hosts: hosts as HostRow[],
    prefPoints: prefPoints.map(normalizePoint),
  })
}
