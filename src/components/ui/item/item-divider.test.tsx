import { describe, expect, it } from "vitest"
import { render } from "@testing-library/react"

import { Item } from "./item"

// Дизайн-чек от 08.10, замечания 14 и 46: разделитель — отдельный слой,
// который начинается от колонки текста (мастер `ELK / item` v1.0.1), а не
// рамка строки во всю ширину.

function divider(container: HTMLElement) {
  return container.querySelector<HTMLElement>("[data-slot='item-divider']")
}

describe("Item: разделитель", () => {
  it("рисуется отдельным слоем, а не рамкой строки", () => {
    const { container } = render(<Item value="Значение" />)
    const row = container.querySelector<HTMLElement>("[data-slot='item']")!
    expect(row.className).not.toMatch(/\bborder-b\b/)
    expect(divider(container)).not.toBeNull()
  })

  it("divider={false} — слоя нет вовсе", () => {
    const { container } = render(<Item value="Значение" divider={false} />)
    expect(divider(container)).toBeNull()
  })

  it("начинается от колонки текста: с плашкой отступ 72/80, без — 16", () => {
    const plain = render(<Item value="Значение" />)
    expect(divider(plain.container)!.className).toContain("left-4")
    plain.unmount()

    const thumb = render(<Item value="Значение" thumbnail />)
    expect(divider(thumb.container)!.className).toContain("left-[72px]")
    expect(divider(thumb.container)!.className).toContain("desktop:left-20")
    thumb.unmount()

    const sub = render(<Item value="Значение" thumbnail subCategory />)
    expect(divider(sub.container)!.className).toContain("desktop:left-[144px]")
  })

  // Правки UI-Kit от 25.10: у нажатия своя заливка Grey 124 (было — одна
  // заливка Grey 114 на Hover и Active), см. item-2510.test.tsx.
  it("заливка Hover — Grey 114, у Active своя; скругление только у десктопа", () => {
    const { container } = render(<Item value="Значение" />)
    const row = container.querySelector<HTMLElement>("[data-slot='item']")!
    expect(row.className).toContain("not-data-[disabled]:hover:bg-[var(--item-hover-bg)]")
    expect(row.className).toMatch(/\]:bg-\[var\(--item-pressed-bg\)\]/)
    expect(row.className).toContain("desktop:rounded-[16px]")
  })
})
