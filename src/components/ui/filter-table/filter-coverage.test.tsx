import * as React from "react"
import { describe, expect, it } from "vitest"
import { act, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { FilterDate } from "./filter-date"

// Добор покрытия к исправлениям фильтров (раунд 1 таблиц): черновик
// FilterDate — у FilterSelect и FilterRange тест уже есть.

describe("черновик FilterDate переживает перерисовку родителя", () => {
  it("выбранный заготовкой период не сбрасывается", async () => {
    const user = userEvent.setup()
    const from = new Date(2026, 8, 1)
    const to = new Date(2026, 8, 7)
    let rerenderParent = () => {}
    function Parent() {
      const [, setTick] = React.useState(0)
      rerenderParent = () => act(() => setTick((tick) => tick + 1))
      // Новый кортеж на каждый рендер — обычный управляемый режим.
      return (
        <FilterDate
          label="Дата"
          value={[null, null]}
          presets={[{ label: "Неделя", range: () => [from, to] }]}
        />
      )
    }
    render(<Parent />)

    await user.click(screen.getByText("Дата"))
    await user.click(screen.getByRole("button", { name: "Неделя" }))
    expect(screen.getByLabelText("С")).toHaveValue(from.toLocaleDateString("ru-RU"))

    rerenderParent()

    expect(screen.getByLabelText("С")).toHaveValue(from.toLocaleDateString("ru-RU"))
    expect(screen.getByLabelText("По")).toHaveValue(to.toLocaleDateString("ru-RU"))
  })
})
