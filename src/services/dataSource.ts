export type DataSource = 'api' | 'mock'

export function getDataSource(): DataSource {
  return import.meta.env.VITE_DATA_SOURCE === 'api' ? 'api' : 'mock'
}

export function isMockDataSource() {
  return getDataSource() === 'mock'
}
