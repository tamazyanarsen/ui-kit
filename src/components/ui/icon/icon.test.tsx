import { describe, expect, it, vi } from "vitest"
import { render } from "@testing-library/react"
import * as glyphs from "@/icons"

import { Icon, ICON_NAMES } from "./icon"

describe("Icon", () => {
  // Реестр собирается из бочонка автоматически — тест держит это свойство:
  // как только в @/icons появляется глиф, он обязан быть доступен по имени.
  it("covers every glyph exported from @/icons", () => {
    const unique = new Set(
      Object.values(glyphs).filter((value) => typeof value === "function")
    )
    expect(ICON_NAMES).toHaveLength(unique.size)
    expect(ICON_NAMES).toContain("check")
    expect(ICON_NAMES).toContain("plus")
    expect(ICON_NAMES).toContain("circle-alert")
  })

  it("renders the requested glyph and tags it with its name", () => {
    const { container } = render(<Icon name="check" />)
    const svg = container.querySelector("svg")
    expect(svg).toHaveAttribute("data-icon-name", "check")
    expect(svg).toHaveClass("size-4")
  })

  it("uses the 24px box for size 24", () => {
    const { container } = render(<Icon name="bell" size={24} />)
    expect(container.querySelector("svg")).toHaveClass("size-6")
  })

  it("lets className override the default box", () => {
    const { container } = render(<Icon name="bell" className="size-8" />)
    expect(container.querySelector("svg")).toHaveClass("size-8")
    expect(container.querySelector("svg")).not.toHaveClass("size-4")
  })

  it("renders nothing and warns for an unknown name", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {})
    const { container } = render(<Icon name="нет-такой" />)
    expect(container.querySelector("svg")).toBeNull()
    expect(warn).toHaveBeenCalled()
    warn.mockRestore()
  })
})
