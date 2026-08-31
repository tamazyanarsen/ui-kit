#!/usr/bin/env node
// Размеры сборки: raw / gzip / brotli по каждому файлу и итог.
//
// Запуск:
//   node scripts/measure.mjs            # по dist
//   node scripts/measure.mjs <dir>      # по любой другой папке
//   node scripts/measure.mjs --json     # машиночитаемый вывод
import { gzipSync, brotliCompressSync, constants } from "node:zlib"
import { readFileSync, readdirSync, statSync } from "node:fs"
import { join, relative, sep } from "node:path"

const args = process.argv.slice(2)
const asJson = args.includes("--json")
const root = args.find((a) => !a.startsWith("--")) ?? "dist"

function walk(dir) {
  const out = []
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) out.push(...walk(full))
    else out.push(full)
  }
  return out
}

const KB = (bytes) => bytes / 1024

function measure(file) {
  const buf = readFileSync(file)
  return {
    file: relative(root, file).split(sep).join("/"),
    raw: buf.length,
    gzip: gzipSync(buf, { level: 9 }).length,
    // Уровень 11 — то, чем реально отдаёт статику CDN/nginx.
    brotli: brotliCompressSync(buf, {
      params: { [constants.BROTLI_PARAM_QUALITY]: 11 },
    }).length,
  }
}

let files
try {
  files = walk(root)
} catch {
  console.error(`Нет папки «${root}» — сначала соберите проект (npm run build).`)
  process.exit(1)
}

const rows = files.map(measure).sort((a, b) => b.raw - a.raw)
const total = rows.reduce(
  (acc, r) => ({
    raw: acc.raw + r.raw,
    gzip: acc.gzip + r.gzip,
    brotli: acc.brotli + r.brotli,
  }),
  { raw: 0, gzip: 0, brotli: 0 }
)

if (asJson) {
  console.log(JSON.stringify({ root, rows, total }, null, 2))
} else {
  const width = Math.max(4, ...rows.map((r) => r.file.length))
  const num = (n) => `${KB(n).toFixed(1)} КБ`.padStart(11)
  console.log(`\n${root}\n`)
  console.log(
    `${"файл".padEnd(width)}${"raw".padStart(11)}${"gzip".padStart(11)}${"brotli".padStart(11)}`
  )
  console.log("-".repeat(width + 33))
  for (const r of rows) {
    console.log(`${r.file.padEnd(width)}${num(r.raw)}${num(r.gzip)}${num(r.brotli)}`)
  }
  console.log("-".repeat(width + 33))
  console.log(
    `${`итого (${rows.length} файлов)`.padEnd(width)}${num(total.raw)}${num(total.gzip)}${num(total.brotli)}`
  )
  console.log()
}
