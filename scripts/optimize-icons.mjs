#!/usr/bin/env node
// Оптимизация путей в иконках `src/icons/*.tsx` через SVGO.
//
// Две причины, по которым иконки весят больше нужного:
//
// 1. У части 24px-начертаний viewBox не приведён к нулю —
//    `viewBox="104.000 756.000 24.000 24.000"`, то есть в путях лежат
//    абсолютные координаты канваса Figma, и каждое число занимает 7 знаков
//    вместо двух. Лечится обёрткой в `translate(-minX, -minY)`: SVGO с
//    `applyTransforms` вплавляет сдвиг в сами координаты, после чего viewBox
//    становится `0 0 24 24`.
// 2. Избыточная точность и абсолютные команды пути — обычная работа
//    `convertPathData`.
//
// Скрипт правит ТОЛЬКО содержимое svg-разметки: имя компонента, пропсы,
// комментарии и логика размеров остаются как есть.
//
// Запуск: node scripts/optimize-icons.mjs [--dry]
import { readdirSync, readFileSync, writeFileSync } from "node:fs"
import { join } from "node:path"
import { optimize } from "svgo"

import {
  dropNoopClips,
  ensureUidHook,
  placeholderToUid,
  uidToPlaceholder,
} from "./icon-ids.mjs"

const ICONS_DIR = "src/icons"
/** Сколько раз прогнать SVGO по одному начертанию, пока вывод не устоится. */
const MAX_PASSES = 5
const dry = process.argv.includes("--dry")

// JSX-атрибуты не совпадают с SVG-атрибутами: перед SVGO переводим в
// разметочный вид, после — обратно.
const JSX_TO_SVG = [
  ["fillRule", "fill-rule"],
  ["clipRule", "clip-rule"],
  ["clipPath", "clip-path"],
  ["strokeWidth", "stroke-width"],
  ["strokeLinecap", "stroke-linecap"],
  ["strokeLinejoin", "stroke-linejoin"],
  ["strokeMiterlimit", "stroke-miterlimit"],
  ["strokeDasharray", "stroke-dasharray"],
  ["stopColor", "stop-color"],
  ["stopOpacity", "stop-opacity"],
  ["gradientUnits", "gradientUnits"],
  ["gradientTransform", "gradientTransform"],
  ["maskUnits", "maskUnits"],
  ["patternUnits", "patternUnits"],
  ["xmlnsXlink", "xmlns:xlink"],
  ["xlinkHref", "xlink:href"],
]

const toSvgAttrs = (s) =>
  JSX_TO_SVG.reduce((acc, [jsx, svg]) => acc.replaceAll(`${jsx}=`, `${svg}=`), s)
const toJsxAttrs = (s) =>
  JSX_TO_SVG.reduce((acc, [jsx, svg]) => acc.replaceAll(`${svg}=`, `${jsx}=`), s)

// Конфиг собирается на каждое начертание: плагину обрезок нужен его viewBox.
const configFor = (viewBox) => ({
  multipass: true,
  floatPrecision: 3,
  plugins: [
    {
      name: "preset-default",
      params: {
        overrides: {
          // Идентификаторы clipPath/mask ссылаются друг на друга внутри
          // файла — переименование и удаление ломает рендер.
          cleanupIds: false,
          removeViewBox: false,
          // Без этого SVGO не тронет transform на обёртке, ради которой всё
          // и затевается.
          convertPathData: { applyTransforms: true, floatPrecision: 3 },
        },
      },
    },
    // Обрезка по рамке не меньше viewBox ничего не обрезает, а её id
    // повторяется у каждой копии иконки на странице (см. icon-ids.mjs).
    dropNoopClips(viewBox),
  ],
})

let before = 0
let after = 0
let changed = 0

for (const file of readdirSync(ICONS_DIR)) {
  if (!file.endsWith(".tsx")) continue
  const path = join(ICONS_DIR, file)
  const source = readFileSync(path, "utf8")
  before += Buffer.byteLength(source)

  let result = source

  // Каждый <svg …> … </svg> в файле обрабатываем отдельно: у иконки бывает
  // два начертания (16 и 24) в одном компоненте.
  const blocks = [...source.matchAll(/<svg\s([^>]*)>([\s\S]*?)<\/svg>/g)]

  for (const block of blocks) {
    const [whole, attrs, inner] = block
    const viewBox = attrs.match(/viewBox="([^"]+)"/)?.[1]
    if (!viewBox) continue

    const [minX, minY, width, height] = viewBox.split(/\s+/).map(Number)
    const needsShift = Math.abs(minX) > 0.001 || Math.abs(minY) > 0.001

    const body = needsShift
      ? `<g transform="translate(${-minX} ${-minY})">${inner}</g>`
      : inner

    // Корневые атрибуты исходного svg (fill="none", stroke и прочее) обязаны
    // попасть в документ, который видит SVGO: иначе он считает, что путь с
    // fill="black" просто повторяет значение по умолчанию, вычищает его — и
    // путь наследует fill="none" от корня, то есть иконка пропадает.
    // JSX-вставки (`{...props}`) в XML недопустимы, их убираем.
    const rootAttrs = attrs
      .replace(/\{[^}]*\}/g, " ")
      .replace(/viewBox="[^"]*"/, "")
      .replace(/xmlns="[^"]*"/, "")
      .trim()

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" ${toSvgAttrs(rootAttrs)}>${toSvgAttrs(uidToPlaceholder(body))}</svg>`

    let optimized
    try {
      // До неподвижной точки: снятая обрезка оставляет пустую обёртку
      // `<g transform>`, которую SVGO сворачивает (и вплавляет сдвиг в путь)
      // только на следующем запуске. Без цикла второй прогон скрипта менял
      // бы ещё 70 файлов, то есть скрипт не был бы идемпотентным.
      optimized = svg
      for (let pass = 0; pass < MAX_PASSES; pass++) {
        const next = optimize(optimized, configFor([0, 0, width, height])).data
        if (next === optimized) break
        optimized = next
      }
    } catch (error) {
      console.warn(`пропуск ${file}: SVGO не смог — ${error.message}`)
      // Пути остаются как есть, но id уникализируются и здесь: иначе
      // иконка, которую SVGO не разобрал, так и дублировала бы их.
      result = result.replace(whole, `<svg ${attrs}>${placeholderToUid(inner)}</svg>`)
      continue
    }

    const optimizedInner = optimized.match(/<svg[^>]*>([\s\S]*)<\/svg>/)?.[1]
    if (!optimizedInner) {
      console.warn(`пропуск ${file}: не разобрал результат SVGO`)
      continue
    }

    const newAttrs = attrs.replace(
      /viewBox="[^"]+"/,
      `viewBox="0 0 ${width} ${height}"`
    )
    result = result.replace(
      whole,
      `<svg ${newAttrs.trim()}>${placeholderToUid(toJsxAttrs(optimizedInner))}</svg>`
    )
  }
  // Оставшиеся id (настоящие обрезки и маски) уникальны на экземпляр.
  result = ensureUidHook(result)

  after += Buffer.byteLength(result)
  if (result !== source) {
    changed += 1
    if (!dry) writeFileSync(path, result)
  }
}

const KB = (n) => (n / 1024).toFixed(1)
console.log(
  `${dry ? "[dry] " : ""}иконок изменено: ${changed}; ${KB(before)} КБ → ${KB(after)} КБ ` +
    `(−${(100 - (after / before) * 100).toFixed(1)}%)`
)
