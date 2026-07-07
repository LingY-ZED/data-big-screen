import axios from 'axios'

import { logger } from '@/logs/logger'

function resolveBaseURL() {
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL
  }

  return import.meta.env.MODE === 'test' ? 'http://localhost/api' : '/api'
}

export const httpClient = axios.create({
  baseURL: resolveBaseURL(),
  timeout: 8_000,
})

httpClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    logger.error('HTTP request failed', error)
    return Promise.reject(error)
  },
)
