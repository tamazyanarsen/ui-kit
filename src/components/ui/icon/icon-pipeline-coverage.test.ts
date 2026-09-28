// @vitest-environment node
import { describe, expect, it } from "vitest"
import { optimize } from "svgo"

// Скрипт конвейера — чистый .mjs без деклараций типов и вне `src`: заводить
// ради теста .d.ts в `scripts/` незачем, типы здесь не проверяются.
// @ts-expect-error TS7016 — у модуля нет деклараций
import * as iconIds from "../../../../scripts/icon-ids.mjs"

const { dropNoopClips, ensureUidHook, placeholderToUid, uidToPlaceholder } = iconIds

// Покрытие правки конвейера `optimize-icons`: закоммиченные иконки тест
// `icon-ids.test.tsx` проверяет по готовой разметке, а здесь — сами шаги,
// которыми скрипт делает то же на новых выгрузках из Figma. Без них
// следующий прогон скрипта вернул бы зашитые строкой id.

const svg = (body: string) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">${body}</svg>`

const run = (source: string) =>
  optimize(source, { plugins: [dropNoopClips([0, 0, 24, 24])] }).data

describe("конвейер иконок: id", () => {
  it("литеральные id и ссылки на них переводятся на uid экземпляра", () => {
    const out = placeholderToUid('<clipPath id="calendar-16-clip0"/><g clip-path="url(#calendar-16-clip0)"/>')
    expect(out).toContain("id={`${uid}-calendar-16-clip0`}")
    expect(out).toContain("clip-path={`url(#${uid}-calendar-16-clip0)`}")
    expect(out).not.toContain('id="calendar-16-clip0"')
  })

  it("JSX-форма id проходит SVGO туда и обратно без потерь", () => {
    const jsx = "<clipPath id={`${uid}-c`}/><g clip-path={`url(#${uid}-c)`}/>"
    const markup = uidToPlaceholder(jsx)
    expect(markup).not.toContain("${uid}")
    expect(placeholderToUid(markup)).toBe(jsx)
  })

  it("хук useId добавляется, когда разметке нужен uid, и снимается, когда нет", () => {
    const icon = (body: string) =>
      `import type { IconProps } from "./types"\n` +
      `export function Sample({ size = 24 }: IconProps) {\n  return <svg>${body}</svg>\n}\n`

    const withHook = ensureUidHook(icon("<g clip-path={`url(#${uid}-c)`}/>"))
    expect(withHook).toContain('import { useId } from "react"')
    expect(withHook).toContain("const uid = useId()")

    const withoutRefs = withHook.replace("<g clip-path={`url(#${uid}-c)`}/>", "<g/>")
    const cleaned = ensureUidHook(withoutRefs)
    expect(cleaned).not.toContain("useId")
  })
})

describe("конвейер иконок: плагин dropNoopClips", () => {
  it("снимает обрезку по рамке не меньше viewBox вместе со ссылкой", () => {
    const out = run(
      svg(
        '<defs><clipPath id="clip0"><rect width="24" height="24"/></clipPath></defs>' +
          '<g clip-path="url(#clip0)"><path d="M0 0h24v24H0z"/></g>'
      )
    )
    expect(out).not.toContain("clipPath")
    expect(out).not.toContain("clip-path")
  })

  it("настоящую обрезку меньше viewBox оставляет", () => {
    const out = run(
      svg(
        '<defs><clipPath id="clip0"><rect width="12" height="12"/></clipPath></defs>' +
          '<g clip-path="url(#clip0)"><path d="M0 0h24v24H0z"/></g>'
      )
    )
    expect(out).toContain('id="clip0"')
    expect(out).toContain('clip-path="url(#clip0)"')
  })

  it("снимает висячую ссылку на обрезку, которой в иконке нет (brush-2)", () => {
    const out = run(svg('<g clip-path="url(#missing)"><path d="M0 0h24v24H0z"/></g>'))
    expect(out).not.toContain("clip-path")
  })
})
