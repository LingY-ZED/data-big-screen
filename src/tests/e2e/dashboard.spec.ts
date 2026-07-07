import { expect, test } from '@playwright/test'

test('renders the DataVisionLab dashboard', async ({ page }) => {
  const consoleErrors: string[] = []
  const pageErrors: string[] = []

  page.on('console', (message) => {
    if (message.type() === 'error') {
      consoleErrors.push(message.text())
    }
  })
  page.on('pageerror', (error) => {
    pageErrors.push(error.message)
  })

  await page.goto('/')

  await expect(page.getByRole('heading', { name: /数据视界中枢大屏/ })).toBeVisible()
  await expect(page.getByTestId('metric-card').first()).toBeVisible()
  await expect(page.getByTestId('chart-line')).toBeVisible()
  await expect(page.locator('canvas').first()).toBeVisible()
  expect(consoleErrors).toEqual([])
  expect(pageErrors).toEqual([])
})
