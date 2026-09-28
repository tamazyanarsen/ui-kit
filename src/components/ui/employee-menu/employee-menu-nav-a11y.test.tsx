import { afterEach, describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { EmployeeMenuNav } from "./employee-menu-nav"

// Третий раунд аудита: текущий раздел, спрятанный под «Ещё», объявляется
// атрибутом, а не только галочкой под `aria-hidden`.

const LINKS = [
  { value: "a", label: "Письма" },
  { value: "b", label: "Задачник" },
  { value: "c", label: "Справки" },
]

describe("EmployeeMenuNav: «Ещё»", () => {
  afterEach(() => vi.restoreAllMocks())

  it("активный раздел в списке помечен aria-current", async () => {
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
    const active = await screen.findByRole("menuitem", { name: "Справки" })
    expect(active).toHaveAttribute("aria-current", "page")
    expect(screen.getByRole("menuitem", { name: "Задачник" })).not.toHaveAttribute(
      "aria-current"
    )
  })
})
