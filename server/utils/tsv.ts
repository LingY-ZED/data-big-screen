import { readFileSync } from 'node:fs'

export type TsvRecord = Record<string, string>

export function readTsv(filePath: string): TsvRecord[] {
  const content = readFileSync(filePath, 'utf8').trim()
  const [headerLine, ...lines] = content.split(/\r?\n/)

  if (!headerLine) {
    return []
  }

  const headers = headerLine.split('\t')

  return lines
    .filter((line) => line.trim().length > 0)
    .map((line) => {
      const values = line.split('\t')

      return headers.reduce<TsvRecord>((record, header, index) => {
        record[header] = values[index] ?? ''
        return record
      }, {})
    })
}
