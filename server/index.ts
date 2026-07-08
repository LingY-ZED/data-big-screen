import cors from 'cors'
import express from 'express'

import { serverConfig } from './config'
import { createDbPool } from './db/pool'
import { fetchDashboardData } from './services/dashboardRepository'

const app = express()
const pool = createDbPool()

app.use(
  cors({
    origin: true,
  }),
)
app.use(express.json())

app.get('/api/health', async (_request, response) => {
  try {
    await pool.query('SELECT 1')
    response.json({
      database: 'ok',
      success: true,
    })
  } catch (error: unknown) {
    response.status(500).json({
      database: 'error',
      message: error instanceof Error ? error.message : 'database unavailable',
      success: false,
    })
  }
})

app.get('/api/dashboard', async (_request, response) => {
  try {
    const data = await fetchDashboardData(pool)
    response.json({
      data,
      success: true,
    })
  } catch (error: unknown) {
    response.status(500).json({
      message: error instanceof Error ? error.message : 'dashboard query failed',
      success: false,
    })
  }
})

const server = app.listen(serverConfig.port, () => {
  console.log(`Data center monitor API running at http://127.0.0.1:${serverConfig.port}`)
})

function shutdown() {
  server.close(() => {
    void pool.end().finally(() => {
      process.exit(0)
    })
  })
}

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)
