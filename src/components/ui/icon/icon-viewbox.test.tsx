import { describe, expect, it } from "vitest"
import { renderToStaticMarkup } from "react-dom/server"
import * as glyphs from "@/icons"

// Полный проход 30.09: часть иконок (транспорт, спорт, Coins, Clock, Highlight и
// ещё около сорока) когда-то выгрузили окном по границе самого вектора
// (`viewBox="0 0 13.497 13.497"`, `0 0 20.245 20.245`, `0 0 22 22`) или одним
// начертанием на оба размера. Такой рисунок растягивается на всю коробку и
// выходит на 20–90% пикселей больше мастера. Значение окна проверяем прямо:
// у начертания `size` окно обязано быть `0 0 size size`.
//
// Исключения — только там, где в мастере нет своего 16/24 или окно устроено
// иначе; у каждого записана причина.
const ALLOW: Record<string, string> = {
  "Copy|16": "вектор 16×16,67 с выходом за рамку на 0,33px сверху и снизу",
  "Sbp|16": "в мастере SBP только 72/56/48, начертаний 16/24 нет",
  "Sbp|24": "в мастере SBP только 72/56/48, начертаний 16/24 нет",
  "Star|16": "звезда нарисована в окне 32×32 (Stroke/Fill)",
  "Star|24": "звезда нарисована в окне 32×32 (Stroke/Fill)",
  "SbpRequest|16": "окно в координатах канваса, рисунок сверен с мастером",
  "SbpRequest|24": "окно в координатах канваса, рисунок сверен с мастером",
  "Loader2|16": "loader — сознательное отличие: анимированный вектор вместо растра",
  "Download|24": "24px в мастере совпадает с масштабированным 16px (расхождение 0,13%)",
  "ImageIcon|24": "нет отдельного 24px-начертания в мастере",
  "Image|24": "нет отдельного 24px-начертания в мастере",
}

describe("иконки: окно viewBox равно размеру начертания", () => {
  const seen = new Set<unknown>()
  for (const [name, Glyph] of Object.entries(glyphs)) {
    if (typeof Glyph !== "function" || seen.has(Glyph)) continue
    seen.add(Glyph)
    for (const size of [16, 24] as const) {
      const key = `${name}|${size}`
      if (key in ALLOW) continue
      it(key, () => {
        const G = Glyph as React.ComponentType<{ size: 16 | 24 }>
        const markup = renderToStaticMarkup(<G size={size} />)
        const viewBox = markup.match(/viewBox="([^"]+)"/)?.[1]
        expect(viewBox).toBe(`0 0 ${size} ${size}`)
      })
    }
  }
})
