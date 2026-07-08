import type {
  ActivityItem,
  CategoryDistribution,
  DashboardData,
  DashboardInput,
  HostRow,
  MapNodeStatus,
  MetricPointRow,
  MetricStatus,
  RankingItem,
  TrendPoint,
} from '../types'

const categoryColors = ['#24d7ff', '#45f0a0', '#ffcf5a', '#5b8cff', '#ff7a90', '#b889ff']
const memoryMods = ['mem_used', 'mem_free', 'mem_cache', 'mem_buff'] as const

type MemoryMod = (typeof memoryMods)[number]

function round(value: number, digits = 1) {
  const factor = 10 ** digits
  return Math.round(value * factor) / factor
}

function average(values: number[]) {
  if (values.length === 0) {
    return 0
  }

  return values.reduce((sum, value) => sum + value, 0) / values.length
}

function clamp(value: number, min = 0, max = 100) {
  return Math.min(max, Math.max(min, value))
}

function latestTimestamp(points: MetricPointRow[]) {
  return points.reduce((max, point) => Math.max(max, Number(point.ts)), 0)
}

function latestPoints(points: MetricPointRow[]) {
  const latest = latestTimestamp(points)
  return points.filter((point) => point.ts === latest)
}

function formatClock(ts: number) {
  const date = new Date(ts)
  const pad = (value: number) => String(value).padStart(2, '0')
  return `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
}

function formatHourLabel(hourTs: number) {
  const date = new Date(hourTs)
  const pad = (value: number) => String(value).padStart(2, '0')
  return `${pad(date.getMonth() + 1)}/${pad(date.getDate())} ${pad(date.getHours())}:00`
}

function toIsoLike(sampledAt: string | undefined, fallbackTs: number) {
  if (!sampledAt) {
    return new Date(fallbackTs).toISOString()
  }

  return sampledAt.includes('T') ? sampledAt : sampledAt.replace(' ', 'T')
}

function buildLatestMemoryUsage(points: MetricPointRow[]) {
  const latest = latestPoints(points)
  const memoryByHost = new Map<string, Partial<Record<MemoryMod, number>>>()

  latest
    .filter((point) => memoryMods.includes(point.mod as MemoryMod))
    .forEach((point) => {
      const record = memoryByHost.get(point.hostId) ?? {}
      record[point.mod as MemoryMod] = point.value
      memoryByHost.set(point.hostId, record)
    })

  return [...memoryByHost.entries()].map(([hostId, record]) => {
    const used = record.mem_used ?? 0
    const total = used + (record.mem_free ?? 0) + (record.mem_cache ?? 0) + (record.mem_buff ?? 0)

    return {
      hostId,
      usage: total > 0 ? (used / total) * 100 : 0,
    }
  })
}

function statusFromUsage(value: number): MetricStatus {
  if (value >= 85) {
    return 'danger'
  }

  if (value >= 70) {
    return 'warning'
  }

  return 'success'
}

function buildTrends(points: MetricPointRow[]) {
  const hourly = new Map<
    number,
    {
      cpu: number[]
      memory: number[]
      netIn: number[]
      netOut: number[]
    }
  >()
  const memoryBySample = new Map<string, Partial<Record<MemoryMod, number>>>()

  const ensureHour = (hourTs: number) => {
    const existing = hourly.get(hourTs)

    if (existing) {
      return existing
    }

    const created = {
      cpu: [],
      memory: [],
      netIn: [],
      netOut: [],
    }
    hourly.set(hourTs, created)
    return created
  }

  points.forEach((point) => {
    const hourTs = Math.floor(point.ts / 3_600_000) * 3_600_000
    const bucket = ensureHour(hourTs)

    if (point.mod === 'cpu_usage') {
      bucket.cpu.push(point.value)
    }

    if (point.mod === 'net_in') {
      bucket.netIn.push(point.value)
    }

    if (point.mod === 'net_out') {
      bucket.netOut.push(point.value)
    }

    if (memoryMods.includes(point.mod as MemoryMod)) {
      const key = `${hourTs}-${point.hostId}-${point.ts}`
      const record = memoryBySample.get(key) ?? {}
      record[point.mod as MemoryMod] = point.value
      memoryBySample.set(key, record)
    }
  })

  memoryBySample.forEach((record, key) => {
    const [hourTsText] = key.split('-')
    const used = record.mem_used ?? 0
    const total = used + (record.mem_free ?? 0) + (record.mem_cache ?? 0) + (record.mem_buff ?? 0)

    if (total > 0) {
      ensureHour(Number(hourTsText)).memory.push((used / total) * 100)
    }
  })

  return [...hourly.entries()]
    .sort(([left], [right]) => left - right)
    .slice(-24)
    .map<TrendPoint>(([hourTs, bucket]) => ({
      cpuUsage: round(average(bucket.cpu)),
      memoryUsage: round(average(bucket.memory)),
      networkIn: round(average(bucket.netIn), 2),
      networkOut: round(average(bucket.netOut), 2),
      time: formatHourLabel(hourTs),
    }))
}

function buildCategories(hosts: HostRow[]) {
  const countByRoom = new Map<string, number>()

  hosts.forEach((host) => {
    countByRoom.set(host.locationRoom, (countByRoom.get(host.locationRoom) ?? 0) + 1)
  })

  return [...countByRoom.entries()]
    .sort(([, left], [, right]) => right - left)
    .map<CategoryDistribution>(([name, value], index) => ({
      color: categoryColors[index % categoryColors.length],
      name,
      value,
    }))
}

function buildRankings(points: MetricPointRow[], hosts: HostRow[]) {
  const latest = latestPoints(points).filter((point) => point.mod === 'load1')
  const hostById = new Map(hosts.map((host) => [host.hostId, host]))

  return latest
    .map<RankingItem>((point) => {
      const host = hostById.get(point.hostId)

      return {
        name: host?.hostname.replace('.hismartlab.cn', '') ?? point.hostId,
        status: statusFromUsage(point.value * 8),
        unit: '',
        value: round(point.value, 2),
      }
    })
    .sort((left, right) => right.value - left.value)
    .slice(0, 6)
}

function buildMap(hosts: HostRow[], hostHealth: Map<string, number>) {
  const roomGroups = new Map<string, HostRow[]>()

  hosts.forEach((host) => {
    const list = roomGroups.get(host.locationRoom) ?? []
    list.push(host)
    roomGroups.set(host.locationRoom, list)
  })

  const roomEntries = [...roomGroups.entries()].sort(([left], [right]) => left.localeCompare(right))
  const centerX = 430
  const centerY = 250
  const radius = 215

  const nodes = [
    {
      name: '监控中心',
      status: 'normal' as MapNodeStatus,
      value: 100,
      x: centerX,
      y: centerY,
    },
    ...roomEntries.map(([room, roomHosts], index) => {
      const angle = (Math.PI * 2 * index) / Math.max(roomEntries.length, 1) - Math.PI / 2
      const health = average(roomHosts.map((host) => hostHealth.get(host.hostId) ?? 100))
      const status: MapNodeStatus = health < 70 ? 'risk' : health < 85 ? 'busy' : 'normal'

      return {
        name: room,
        status,
        value: round(health),
        x: Math.round(centerX + Math.cos(angle) * radius),
        y: Math.round(centerY + Math.sin(angle) * radius),
      }
    }),
  ]

  return {
    links: roomEntries.map(([room, roomHosts]) => ({
      source: '监控中心',
      target: room,
      value: roomHosts.length,
    })),
    nodes,
  }
}

function buildActivities(
  hosts: HostRow[],
  prefPoints: MetricPointRow[],
  diskPoints: MetricPointRow[],
  memoryUsageByHost: Map<string, number>,
) {
  const latest = latestPoints(prefPoints)
  const latestTs = latestTimestamp(prefPoints)
  const hostById = new Map(hosts.map((host) => [host.hostId, host]))
  const activities: ActivityItem[] = []

  latest
    .filter((point) => point.mod === 'cpu_usage' && point.value >= 80)
    .forEach((point) => {
      activities.push({
        description: `${hostById.get(point.hostId)?.hostname ?? point.hostId} CPU 使用率达到 ${round(point.value)}%。`,
        id: `cpu-${point.hostId}`,
        level: 'warning',
        time: formatClock(point.ts),
        title: 'CPU 使用率偏高',
      })
    })

  memoryUsageByHost.forEach((usage, hostId) => {
    if (usage >= 85) {
      activities.push({
        description: `${hostById.get(hostId)?.hostname ?? hostId} 内存使用率达到 ${round(usage)}%。`,
        id: `mem-${hostId}`,
        level: 'warning',
        time: formatClock(latestTs),
        title: '内存容量压力',
      })
    }
  })

  diskPoints
    .filter((point) => point.mod.endsWith('_util') && point.value >= 85)
    .sort((left, right) => right.value - left.value)
    .slice(0, 4)
    .forEach((point) => {
      activities.push({
        description: `${hostById.get(point.hostId)?.hostname ?? point.hostId} ${point.mod} 达到 ${round(
          point.value,
        )}%。`,
        id: `disk-${point.hostId}-${point.mod}-${point.ts}`,
        level: point.value >= 92 ? 'error' : 'warning',
        time: formatClock(point.ts),
        title: '磁盘利用率告警',
      })
    })

  if (activities.length === 0) {
    return [
      {
        description: '当前 CPU、内存、磁盘与网络指标均处于可控范围。',
        id: 'system-ok',
        level: 'success',
        time: formatClock(latestTs),
        title: '运行状态正常',
      },
    ] satisfies ActivityItem[]
  }

  return activities.slice(0, 5)
}

export function buildDashboardData(input: DashboardInput): DashboardData {
  const latestPref = latestPoints(input.prefPoints)
  const latestMemory = buildLatestMemoryUsage(input.prefPoints)
  const memoryUsageByHost = new Map(latestMemory.map((item) => [item.hostId, item.usage]))
  const avgCpu = average(
    latestPref.filter((point) => point.mod === 'cpu_usage').map((point) => point.value),
  )
  const avgMemory = average(latestMemory.map((item) => item.usage))
  const diskUtilValues = input.diskPoints
    .filter((point) => point.mod.endsWith('_util'))
    .map((point) => point.value)
  const maxDiskUtil = Math.max(...diskUtilValues, 0)
  const avgCpuWait = average(
    latestPref.filter((point) => point.mod === 'cpu_wait').map((point) => point.value),
  )
  const healthScore = clamp(
    100 - avgCpu * 0.25 - avgMemory * 0.25 - maxDiskUtil * 0.2 - avgCpuWait * 0.3,
  )
  const hostHealth = new Map<string, number>()

  input.hosts.forEach((host) => {
    const cpu =
      latestPref.find((point) => point.hostId === host.hostId && point.mod === 'cpu_usage')
        ?.value ?? 0
    const wait =
      latestPref.find((point) => point.hostId === host.hostId && point.mod === 'cpu_wait')?.value ??
      0
    const memory = memoryUsageByHost.get(host.hostId) ?? 0
    const disk = Math.max(
      ...input.diskPoints
        .filter((point) => point.hostId === host.hostId && point.mod.endsWith('_util'))
        .map((point) => point.value),
      0,
    )
    hostHealth.set(host.hostId, clamp(100 - cpu * 0.25 - memory * 0.25 - disk * 0.2 - wait * 0.3))
  })

  const latestTs = Math.max(latestTimestamp(input.prefPoints), latestTimestamp(input.diskPoints))

  return {
    activities: buildActivities(input.hosts, input.prefPoints, input.diskPoints, memoryUsageByHost),
    categories: buildCategories(input.hosts),
    map: buildMap(input.hosts, hostHealth),
    metrics: [
      {
        delta: 0,
        id: 'hosts',
        label: '监控主机数',
        status: 'success',
        trend: 'stable',
        unit: '台',
        value: input.hosts.length,
      },
      {
        delta: round(avgCpu - 50),
        id: 'cpu',
        label: '平均 CPU 使用率',
        status: statusFromUsage(avgCpu),
        trend: avgCpu >= 50 ? 'up' : 'down',
        unit: '%',
        value: round(avgCpu),
      },
      {
        delta: round(avgMemory - 60),
        id: 'memory',
        label: '平均内存使用率',
        status: statusFromUsage(avgMemory),
        trend: avgMemory >= 60 ? 'up' : 'down',
        unit: '%',
        value: round(avgMemory),
      },
      {
        delta: round(maxDiskUtil - 70),
        id: 'disk',
        label: '磁盘最高利用率',
        status: statusFromUsage(maxDiskUtil),
        trend: maxDiskUtil >= 70 ? 'up' : 'down',
        unit: '%',
        value: round(maxDiskUtil),
      },
      {
        delta: round(healthScore - 80),
        id: 'health',
        label: '系统健康度',
        status: healthScore < 70 ? 'danger' : healthScore < 85 ? 'warning' : 'success',
        trend: healthScore >= 80 ? 'up' : 'down',
        unit: '%',
        value: round(healthScore),
      },
    ],
    radar: {
      indicators: [
        { max: 100, name: 'CPU余量' },
        { max: 100, name: '内存余量' },
        { max: 100, name: '磁盘余量' },
        { max: 100, name: 'IO稳定' },
        { max: 100, name: '整体健康' },
      ],
      values: [
        round(clamp(100 - avgCpu)),
        round(clamp(100 - avgMemory)),
        round(clamp(100 - maxDiskUtil)),
        round(clamp(100 - avgCpuWait)),
        round(healthScore),
      ],
    },
    rankings: buildRankings(input.prefPoints, input.hosts),
    trends: buildTrends(input.prefPoints),
    updatedAt: toIsoLike(
      [...input.prefPoints, ...input.diskPoints].find((point) => point.ts === latestTs)?.sampledAt,
      latestTs,
    ),
  }
}
