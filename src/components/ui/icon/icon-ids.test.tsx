import type * as React from "react"
import { describe, expect, it } from "vitest"
import { render } from "@testing-library/react"

import * as icons from "@/icons"
import { Calendar } from "@/icons"
import type { IconProps } from "@/icons"

// id внутри svg общие для всего документа. Figma выгружала иконки с жёстко
// прописанными id обрезок и масок: две одинаковые иконки на странице (два
// DatePicker — два значка календаря) давали повторяющийся id, а `url(#…)`
// второй ссылался на обрезку первой.

type IconComponent = (props: IconProps) => React.ReactElement

const components = Object.entries(icons).filter(
  (entry): entry is [string, IconComponent] => typeof entry[1] === "function"
)

function duplicateIds(container: HTMLElement) {
  const seen = new Map<string, number>()
  for (const el of container.querySelectorAll("[id]")) {
    seen.set(el.id, (seen.get(el.id) ?? 0) + 1)
  }
  return [...seen].filter(([, count]) => count > 1).map(([id]) => id)
}

describe("иконки: внутренние id", () => {
  it("две копии иконки с настоящей обрезкой получают разные id", () => {
    const { container } = render(
      <>
        <Calendar />
        <Calendar />
      </>
    )
    const clips = [...container.querySelectorAll("clipPath")]
    expect(clips).toHaveLength(2)
    expect(clips[0].id).not.toBe(clips[1].id)
    // Ссылка каждой копии ведёт на её собственную обрезку.
    for (const clip of clips) {
      expect(container.querySelector(`[clip-path="url(#${clip.id})"]`)).not.toBeNull()
    }
  })

  it("все иконки дважды, в обоих размерах, — ни одного повторяющегося id", () => {
    const { container } = render(
      <>
        {[16, 24].flatMap((size) =>
          components.flatMap(([name, Icon]) => [
            <Icon key={`${name}-${size}-a`} size={size as IconProps["size"]} />,
            <Icon key={`${name}-${size}-b`} size={size as IconProps["size"]} />,
          ])
        )}
      </>
    )
    expect(components.length).toBeGreaterThan(400)
    expect(duplicateIds(container)).toEqual([])
  })

  it("каждая ссылка url(#…) указывает на существующий узел", () => {
    const { container } = render(
      <>
        {[16, 24].flatMap((size) =>
          components.map(([name, Icon]) => (
            <Icon key={`${name}-${size}`} size={size as IconProps["size"]} />
          ))
        )}
      </>
    )
    const dangling: string[] = []
    for (const el of container.querySelectorAll("[clip-path], [mask]")) {
      for (const attr of ["clip-path", "mask"]) {
        const id = el.getAttribute(attr)?.match(/^url\(#(.+)\)$/)?.[1]
        if (id && !container.ownerDocument.getElementById(id)) dangling.push(id)
      }
    }
    expect(dangling).toEqual([])
  })
})
