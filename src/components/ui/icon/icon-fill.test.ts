import { readdirSync, readFileSync } from "node:fs"
import { join } from "node:path"
import { describe, expect, it } from "vitest"

// Дизайн-чек от 08.10, замечание 1: в старой теме иконки не красились. Часть
// глифов была выгружена с литеральным `fill="#000"` / `#252628` вместо
// `currentColor` и не слушалась ни className, ни темы. Цветными по праву
// остаются только многоцветные значки типов файлов (vkp-*) и цветной логотип
// СБП — у них цвет и есть рисунок.
const MULTICOLOR = /^(vkp-.*|sbp-request)\.tsx$/
const DIR = join(process.cwd(), "src/icons")

describe("набор иконок: цвет из currentColor", () => {
  it("одноцветные глифы не держат чёрный литерал", () => {
    const offenders = readdirSync(DIR)
      .filter((name) => name.endsWith(".tsx") && !MULTICOLOR.test(name))
      .filter((name) =>
        /(fill|stroke)="#(000|000000|252628)"/i.test(
          readFileSync(join(DIR, name), "utf-8")
        )
      )
    expect(offenders).toEqual([])
  })
})
