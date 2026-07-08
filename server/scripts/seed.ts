import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'

import type { Pool } from 'mysql2/promise'

import { createDbPool } from '../db/pool'
import { readTsv } from '../utils/tsv'

const rootDir = process.cwd()
const homeworkDir = path.join(rootDir, 'homework')
const schemaPath = path.join(rootDir, 'server', 'db', 'schema.sql')

function assertHomeworkFiles() {
  const requiredFiles = ['host_detail.dat', 'mod_detail.dat', 'disk_tsar.dat', 'pref_tsar.dat']
  const missing = requiredFiles.filter((file) => !existsSync(path.join(homeworkDir, file)))

  if (missing.length > 0) {
    throw new Error(`缺少 homework 数据文件：${missing.join(', ')}`)
  }
}

function formatMysqlDate(milliseconds: number) {
  const date = new Date(milliseconds)
  const pad = (value: number, size = 2) => String(value).padStart(size, '0')

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(
    date.getHours(),
  )}:${pad(date.getMinutes())}:${pad(date.getSeconds())}.${pad(date.getMilliseconds(), 3)}`
}

async function insertInBatches(pool: Pool, sql: string, rows: unknown[][], batchSize = 1000) {
  for (let index = 0; index < rows.length; index += batchSize) {
    const batch = rows.slice(index, index + batchSize)
    await pool.query(sql, [batch])
  }
}

function readPointRows(fileName: string) {
  return readTsv(path.join(homeworkDir, fileName)).map((row) => {
    const ts = Number(row.ts)

    return [ts, formatMysqlDate(ts), row.hostid, row.type, row.mod, Number(row.value), row.tag]
  })
}

async function main() {
  assertHomeworkFiles()

  const pool = createDbPool()
  const schema = readFileSync(schemaPath, 'utf8')

  try {
    console.log('Applying database schema...')
    await pool.query(schema)

    console.log('Clearing old data...')
    await pool.query(
      'SET FOREIGN_KEY_CHECKS=0; TRUNCATE TABLE metric_points; TRUNCATE TABLE metrics; TRUNCATE TABLE hosts; SET FOREIGN_KEY_CHECKS=1;',
    )

    const hosts = readTsv(path.join(homeworkDir, 'host_detail.dat')).map((row) => [
      row.hostid,
      row.hostname,
      row.owner,
      row.model,
      row.location1,
      row.location2,
    ])

    const metrics = readTsv(path.join(homeworkDir, 'mod_detail.dat')).map((row) => [
      row.mod,
      row.type,
      row.desc,
      row.unit,
      row.tag,
    ])

    console.log(`Importing ${hosts.length} hosts...`)
    await insertInBatches(
      pool,
      'INSERT INTO hosts (host_id, hostname, owner, model, location_room, rack) VALUES ?',
      hosts,
    )

    console.log(`Importing ${metrics.length} metric definitions...`)
    await insertInBatches(
      pool,
      'INSERT INTO metrics (`mod`, metric_type, description, unit, tag) VALUES ?',
      metrics,
    )

    const diskRows = readPointRows('disk_tsar.dat')
    const prefRows = readPointRows('pref_tsar.dat')
    const pointSql =
      'INSERT INTO metric_points (ts, sampled_at, host_id, metric_type, `mod`, value, tag) VALUES ?'

    console.log(`Importing ${diskRows.length} disk metric points...`)
    await insertInBatches(pool, pointSql, diskRows)

    console.log(`Importing ${prefRows.length} performance metric points...`)
    await insertInBatches(pool, pointSql, prefRows)

    console.log('Database seed completed.')
  } finally {
    await pool.end()
  }
}

void main().catch((error: unknown) => {
  console.error(error)
  process.exitCode = 1
})
