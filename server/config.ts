import 'dotenv/config'

export const serverConfig = {
  db: {
    database: process.env.DB_NAME ?? 'datacenter_monitor',
    host: process.env.DB_HOST ?? '127.0.0.1',
    password: process.env.DB_PASSWORD ?? 'datacenter_pass',
    port: Number(process.env.DB_PORT ?? 3307),
    user: process.env.DB_USER ?? 'datacenter',
  },
  port: Number(process.env.SERVER_PORT ?? 3001),
}
