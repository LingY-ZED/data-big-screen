import { delay, http, HttpResponse } from 'msw'

import { createDashboardMock } from '@/mocks/dashboardMock'

async function dashboardResolver() {
  await delay(180)
  return HttpResponse.json(createDashboardMock())
}

export const handlers = [
  http.get('/api/dashboard', dashboardResolver),
  http.get('http://localhost/api/dashboard', dashboardResolver),
]
