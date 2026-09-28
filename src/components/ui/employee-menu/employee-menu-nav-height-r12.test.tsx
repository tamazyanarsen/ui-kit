import { afterEach, describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { EmployeeMenuNav } from "./employee-menu-nav"

// Аудит 11: «Ещё» липкой шапки сотрудника не ограничивал высоту — при
// длинном избранном нижние разделы уходили за край окна.

const LINKS = [
  { value: "a", label: "Письма" },
  { value: "b", label: "Задачник" },
  { value: "c", label: "Справки" },
]

describe("EmployeeMenuNav: высота «Ещё»", () => {
  afterEach(() => vi.restoreAllMocks())

  it("список ограничен --available-height и прокручивается", async () => {
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
    render(<EmployeeMenuNav links={LINKS} activeLink="a" />)
    await user.click(screen.getByRole("button", { name: /Ещё/ }))
    const list = await screen.findByRole("menu")
    expect(list).toHaveClass("max-h-(--available-height)", "overflow-y-auto", "themed-scrollbar")
    expect(list).not.toHaveClass("overflow-hidden")
  })
})
