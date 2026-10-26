import { readFileSync } from "node:fs"
import { join } from "node:path"
import { describe, expect, it } from "vitest"

import { cn } from "./utils"

// Правки UI-Kit от 25.10 (мобильная типографика): мобильные пары параграфов в
// шкале, адаптивные утилиты и их регистрация в twMerge.
const read = (path: string) => readFileSync(join(process.cwd(), path), "utf-8")
const theme = read("src/styles/theme.css")
const rules = read("src/styles/rules-content.css")

/** `--text-<key>: Npx; --text-<key>--line-height: Mpx` → [N, M]. */
function metrics(key: string) {
  const size = theme.match(new RegExp(`--text-${key}:\\s*(\\d+)px`))?.[1]
  const leading = theme.match(new RegExp(`--text-${key}--line-height:\\s*(\\d+)px`))?.[1]
  return [Number(size), Number(leading)]
}

describe("мобильные пары параграфов по Figma", () => {
  it.each([
    ["p1-regular-mobile", 14, 20],
    ["p1-medium-mobile", 14, 20],
    ["p1-heavy-mobile", 14, 20],
    ["p1_1-medium-mobile", 16, 24],
    ["p2-regular-mobile", 12, 16],
    ["p2-medium-mobile", 12, 16],
    ["p3-regular-mobile", 12, 16],
    ["p3-medium-mobile", 12, 16],
  ])("%s — %i/%i", (key, size, leading) => {
    expect(metrics(key)).toEqual([size, leading])
  })
})

const ADAPTIVE = [...rules.matchAll(/@utility (text-[\w-]+-adaptive)\s*\{\s*@apply ([^;]+);/g)]

describe("адаптивные утилиты", () => {
  it("есть у всех заголовков и параграфов", () => {
    const names = ADAPTIVE.map((m) => m[1])
    for (const name of [
      "text-factoid-adaptive", "text-h1-adaptive", "text-h2-adaptive",
      "text-h3-adaptive", "text-h4-adaptive", "text-p1-adaptive",
      "text-p1-medium-adaptive", "text-p2-regular-adaptive",
      "text-p3-medium-adaptive", "text-p4-medium-adaptive",
    ]) {
      expect(names).toContain(name)
    }
  })

  it("мобильная пара по умолчанию, десктопный стиль — вариантом desktop:", () => {
    const h3 = ADAPTIVE.find((m) => m[1] === "text-h3-adaptive")?.[2]
    expect(h3).toBe("text-h3-mobile desktop:text-h3")
    const p1 = ADAPTIVE.find((m) => m[1] === "text-p1-medium-adaptive")?.[2]
    expect(p1).toBe("text-p1-medium-mobile desktop:text-p1-medium")
  })

  it("каждый @apply ссылается на существующий ключ шкалы", () => {
    for (const [, , apply] of ADAPTIVE) {
      for (const cls of apply.split(/\s+/)) {
        const key = cls.replace(/^desktop:/, "").replace(/^text-/, "")
        expect(theme, key).toMatch(new RegExp(`--text-${key}:`))
      }
    }
  })
})

describe("twMerge знает новые ключи как размер шрифта", () => {
  const added = [
    ...[...theme.matchAll(/--text-([\w-]+-mobile):/g)].map((m) => `text-${m[1]}`),
    ...ADAPTIVE.map((m) => m[1]),
  ]

  it.each(added)("%s не теряется рядом с цветом и вытесняет text-p1", (cls) => {
    expect(cn(cls, "text-[var(--x)]")).toBe(`${cls} text-[var(--x)]`)
    expect(cn("text-p1", cls)).toBe(cls)
  })
})
