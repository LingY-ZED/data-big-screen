import { createPinia } from 'pinia'
import { createApp } from 'vue'

import '@/assets/styles/main.css'
import App from '@/app/App.vue'
import { logger } from '@/logs/logger'
import { getDataSource } from '@/services/dataSource'

async function prepareMocking() {
  if (getDataSource() !== 'mock') {
    return
  }

  const { worker } = await import('@/mocks/browser')
  await worker.start({
    onUnhandledRequest: 'bypass',
    serviceWorker: {
      url: '/mockServiceWorker.js',
    },
  })
  logger.info('Mock service worker started')
}

async function bootstrap() {
  await prepareMocking()

  const app = createApp(App)
  app.use(createPinia())
  app.mount('#app')

  logger.info('DataVisionLab app mounted', {
    dataSource: getDataSource(),
  })
}

void bootstrap().catch((error: unknown) => {
  logger.error('Failed to bootstrap application', error)
})
