import { afterEach, describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { EmployeeMenuNav } from "./employee-menu-nav"

// Правки UI-Kit от 25.10: строки «Ещё» — общая строка списка menu-row,
// содержимое (текст и галочка) в одной обёртке сжимается к центру строки.

const LINKS = [
  { value: "a", label: "Письма" },
  { value: "b", label: "Задачник" },
  { value: "c", label: "Справки" },
]

describe("EmployeeMenuNav: строки «Ещё»", () => {
  afterEach(() => vi.restoreAllMocks())

  it("menu-row и одна обёртка содержимого", async () => {
    // Полоса 300, пункт 100, резерв «Ещё» 88: помещается один пункт.
    vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockImplementation(function (
      this: HTMLElement
    ) {
      return this.dataset.slot === "employee-menu-nav" ? 300 : 0
    })
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (
      this: HTMLElement
    ) {
      const w = this.dataset.value ? 100 : 0
      return { width: w, height: 24, top: 0, left: 0, right: w, bottom: 24 } as DOMRect
    })
    const user = userEvent.setup()
    render(<EmployeeMenuNav links={LINKS} activeLink="c" />)

    await user.click(screen.getByRole("button", { name: /Ещё/ }))
    const row = await screen.findByRole("menuitem", { name: "Справки" })
    expect(row).toHaveClass("menu-row", "press-scale-content")
    expect(row.className).not.toContain("--press-origin")
    expect(row.className).not.toContain("data-highlighted:bg-")
    expect(row.children).toHaveLength(1)
    // Галочка текущего раздела — внутри той же обёртки.
    expect(row.firstElementChild!.querySelector("svg")).not.toBeNull()
  })
})
