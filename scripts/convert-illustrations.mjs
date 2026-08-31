#!/usr/bin/env node
// Пережимает растровые иллюстрации из PNG в AVIF + WebP.
//
// Зачем: 3D-кадры Status Screen, маскоты Error Page и картинка «спасибо за
// оценку» в NPS — это несжатые PNG-экспорты из Figma (56–350 КБ каждый).
// Вектором они быть не могут (градиенты, блики, тени), поэтому единственный
// путь — современные форматы. AVIF основной, WebP запасной: у WebP сплошная
// поддержка с 2020 года, так что PNG после этого не нужен.
//
// Требует ImageMagick 7 в PATH (`magick`). Отдельной npm-зависимости
// (sharp) не заводим — magick уже есть в окружении и умеет оба формата.
//
// Запуск: node scripts/convert-illustrations.mjs [--force]
import { execFileSync } from "node:child_process"
import { existsSync, readdirSync, statSync } from "node:fs"
import { join, extname, basename, dirname } from "node:path"

// Качество подобрано визуально по сетке 45/55/65: на 55 отличий от
// оригинала не видно, RMSE 1.8%, вес падает в 12 раз.
const AVIF_QUALITY = 55
const WEBP_QUALITY = 82

const ASSETS = "src/assets"
const SKIP_DIRS = new Set(["Object Sans"])

const force = process.argv.includes("--force")

function pngFiles(dir) {
  const out = []
  for (const entry of readdirSync(dir)) {
    if (SKIP_DIRS.has(entry)) continue
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) out.push(...pngFiles(full))
    else if (extname(entry).toLowerCase() === ".png") out.push(full)
  }
  return out
}

const KB = (bytes) => (bytes / 1024).toFixed(1)

let before = 0
let after = 0

for (const png of pngFiles(ASSETS)) {
  const stem = join(dirname(png), basename(png, ".png"))
  const avif = `${stem}.avif`
  const webp = `${stem}.webp`

  if (!force && existsSync(avif) && existsSync(webp)) {
    console.log(`пропуск (уже есть): ${png}`)
    continue
  }

  execFileSync("magick", [png, "-quality", String(AVIF_QUALITY), avif])
  execFileSync("magick", [png, "-quality", String(WEBP_QUALITY), webp])

  const src = statSync(png).size
  const dst = statSync(avif).size + statSync(webp).size
  before += src
  after += dst
  console.log(
    `${png}: PNG ${KB(src)} → AVIF ${KB(statSync(avif).size)} + WebP ${KB(statSync(webp).size)}`
  )
}

if (before) {
  console.log(
    `\nитого: ${KB(before)} КБ → ${KB(after)} КБ (в ${(before / after).toFixed(1)} раза меньше)`
  )
}
