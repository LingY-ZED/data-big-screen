export type MetricTrend = 'down' | 'stable' | 'up'
export type MetricStatus = 'danger' | 'success' | 'warning'
export type ActivityLevel = 'error' | 'info' | 'success' | 'warning'
export type MapNodeStatus = 'busy' | 'normal' | 'risk'

export interface SummaryMetric {
  id: string
  label: string
  value: number
  unit?: string
  delta: number
  trend: MetricTrend
  status: MetricStatus
}

export interface TrendPoint {
  activeUsers: number
  orders: number
  time: string
  visits: number
}

export interface CategoryDistribution {
  color: string
  name: string
  value: number
}

export interface RankingItem {
  city: string
  growth: number
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
