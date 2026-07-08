import mysql from 'mysql2/promise'

import { serverConfig } from '../config'

export function createDbPool() {
  return mysql.createPool({
    ...serverConfig.db,
    charset: 'utf8mb4',
    connectionLimit: 10,
    dateStrings: true,
    multipleStatements: true,
    namedPlaceholders: true,
  })
}
