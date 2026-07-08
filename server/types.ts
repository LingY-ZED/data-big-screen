export interface HostRow {
  hostId: string
  hostname: string
  locationRoom: string
  model: string
  owner: string
  rack: string
}

export interface MetricPointRow {
  hostId: string
  metricType: string
  mod: string
  sampledAt: string
  tag: string
  ts: number
  value: number
}

export type MetricTrend = 'down' | 'stable' | 'up'
export type MetricStatus = 'danger' | 'success' | 'warning'
export type ActivityLevel = 'error' | 'info' | 'success' | 'warning'
export type MapNodeStatus = 'busy' | 'normal' | 'risk'

export interface SummaryMetric {
  delta: number
  id: string
  label: string
  status: MetricStatus
  trend: MetricTrend
  unit?: string
  value: number
}

export interface TrendPoint {
  cpuUsage: number
  memoryUsage: number
  networkIn: number
  networkOut: number
  time: string
}

export interface CategoryDistribution {
  color: string
  name: string
  value: number
}

export interface RankingItem {
  name: string
  status?: MetricStatus
  unit?: string
  value: number
}

export interface RadarIndicator {
  max: number
  name: string
}

export interface RadarData {
  indicators: RadarIndicator[]
  values: number[]
}

export interface ActivityItem {
  description: string
  id: string
  level: ActivityLevel
  time: string
  title: string
}

export interface MapNode {
  name: string
  status: MapNodeStatus
  value: number
  x: number
  y: number
}

export interface MapLink {
  source: string
  target: string
  value: number
}

export interface DashboardMapData {
  links: MapLink[]
  nodes: MapNode[]
}

export interface DashboardData {
  activities: ActivityItem[]
  categories: CategoryDistribution[]
  map: DashboardMapData
  metrics: SummaryMetric[]
  radar: RadarData
  rankings: RankingItem[]
  trends: TrendPoint[]
  updatedAt: string
}

export interface DashboardInput {
  diskPoints: MetricPointRow[]
  hosts: HostRow[]
  prefPoints: MetricPointRow[]
}
