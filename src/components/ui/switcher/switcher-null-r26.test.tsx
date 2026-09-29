import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import { Switcher } from "./switcher"

// r26: см. tabs-null-r26 — тот же класс, `false` в массиве `items`.

describe("Switcher: пустые элементы в items", () => {
  it("false и null между сегментами пропускаются", () => {
    const items = [
      { value: "a", label: "День" },
      false,
      null,
      { value: "b", label: "Неделя" },
    ] as never
    render(<Switcher items={items} defaultValue="b" />)
    const pressed = screen
      .getAllByRole("button")
      .filter((button) => button.getAttribute("aria-pressed") === "true")
    expect(pressed.map((button) => button.textContent)).toEqual(["Неделя"])
    expect(screen.getAllByText("День").length).toBeGreaterThan(0)
  })
})
