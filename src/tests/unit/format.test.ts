import { describe, expect, it } from 'vitest'

import { formatCompactNumber, formatNumber, formatPercent, formatTrend } from '@/utils/format'

describe('format utilities', () => {
  it('formats normal numbers with zh-CN separators', () => {
    expect(formatNumber(128640)).toBe('128,640')
  })

  it('formats compact numbers using Chinese ten-thousand unit', () => {
    expect(formatCompactNumber(128640)).toBe('12.9万')
    expect(formatCompactNumber(9800)).toBe('9,800')
  })

  it('formats percent and trend values', () => {
    expect(formatPercent(98.678)).toBe('98.7%')
    expect(formatTrend(12.6)).toBe('+12.6%')
    expect(formatTrend(-0.4)).toBe('-0.4%')
  })
})
