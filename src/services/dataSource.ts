export type DataSource = 'api' | 'mock'

export function getDataSource(): DataSource {
  return import.meta.env.VITE_DATA_SOURCE === 'mock' ? 'mock' : 'api'
}

export function isMockDataSource() {
  return getDataSource() === 'mock'
}
