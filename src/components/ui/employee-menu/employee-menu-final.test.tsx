import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import { EmployeeMenuNav } from "./employee-menu-nav"

// Финальный аудит: текущий раздел в ВИДИМОМ ряду объявлялся только цветом
// и `data-active`; `aria-current` появлялся, лишь когда пункт уезжал в «Ещё».

describe("EmployeeMenuNav: активный раздел в видимом ряду", () => {
  it("помечен aria-current=page, остальные — нет", () => {
    render(
      <EmployeeMenuNav
        links={[
          { value: "a", label: "Письма" },
          { value: "b", label: "Задачник" },
        ]}
        activeLink="a"
      />
    )
    expect(screen.getByRole("button", { name: "Письма" })).toHaveAttribute("aria-current", "page")
    expect(screen.getByRole("button", { name: "Задачник" })).not.toHaveAttribute("aria-current")
  })
})
