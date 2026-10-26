import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import { Input } from "./input"

// Правки UI-Kit от 25.10, «Поле поиска в ряду фильтров — особый вид, НЕ правка
// Input»: `variant="filter-search"`.

const box = (input: HTMLElement) => input.parentElement as HTMLElement
const classes = (element: Element) => element.className.split(" ")

describe("Input variant=filter-search", () => {
  it("заливка фильтров, скругление 16, без рамки и без смены при наведении", () => {
    render(<Input variant="filter-search" size="sm" placeholder="Поиск" />)
    const field = screen.getByPlaceholderText("Поиск")
    const list = classes(box(field))
    expect(list).toEqual(
      expect.arrayContaining([
        "bg-[var(--filter-grey-bg)]",
        "rounded-[16px]",
        "border-transparent",
        "has-[input:focus]:border-[var(--input-border-hover)]",
      ])
    )
    expect(list).not.toContain("rounded-[8px]")
    expect(list).not.toContain("border-[var(--input-border)]")
    expect(list.some((name) => name.startsWith("hover:"))).toBe(false)
  })

  it("подсказка Grey 517, текст Grey 1514", () => {
    render(<Input variant="filter-search" size="sm" placeholder="Поиск" />)
    const list = classes(screen.getByPlaceholderText("Поиск"))
    expect(list).toContain(
      "placeholder:text-[var(--filter-search-placeholder-fg,var(--grey-517))]"
    )
    expect(list).toContain("text-[var(--input-fg)]")
  })

  it("ошибка — как у Input", () => {
    render(<Input variant="filter-search" size="sm" placeholder="Поиск" error="Ошибка" />)
    const list = classes(box(screen.getByPlaceholderText("Поиск")))
    expect(list).toContain("border-[var(--input-border-error)]")
    expect(list).not.toContain("border-transparent")
  })

  it("базовый Input не меняется", () => {
    render(<Input size="sm" placeholder="Обычное" />)
    const list = classes(box(screen.getByPlaceholderText("Обычное")))
    expect(list).toEqual(
      expect.arrayContaining([
        "rounded-[8px]",
        "border-[var(--input-border)]",
        "bg-[var(--input-bg)]",
        "hover:border-[var(--input-border-hover)]",
      ])
    )
  })
})
