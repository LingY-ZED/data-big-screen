export function formatCompactNumber(value: number) {
  if (Math.abs(value) >= 10_000) {
    return `${(value / 10_000).toFixed(1)}万`
  }

  return new Intl.NumberFormat('zh-CN').format(value)
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat('zh-CN').format(value)
}

export function formatPercent(value: number, fractionDigits = 1) {
  return `${value.toFixed(fractionDigits)}%`
}

export function formatTrend(delta: number) {
  const sign = delta > 0 ? '+' : ''
  return `${sign}${delta.toFixed(1)}%`
}

export function formatDateTime(value: string | Date) {
  const date = typeof value === 'string' ? new Date(value) : value

  return new Intl.DateTimeFormat('zh-CN', {
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    month: '2-digit',
    second: '2-digit',
    year: 'numeric',
  }).format(date)
}
