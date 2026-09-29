import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { DatePicker } from "./date-picker"

// Аудит r25: календарь в поповере не был ограничен по высоте — в низком
// окне (телефон в альбомной ориентации, окно 260px) он стоял выше экрана
// (верх на y=-297), и до его начала не добраться. Живая проверка в Chrome:
// после правки календарь укладывается в окно и прокручивается.
// Раскладку jsdom не считает — проверяются ограничения на узле.

describe("DatePicker: поповер в низком окне", () => {
  it("календарь не выше свободного места и прокручивается по вертикали", async () => {
    const user = userEvent.setup()
    const { baseElement } = render(<DatePicker />)
    await user.click(screen.getByLabelText("Дата"))
    const calendar = baseElement.querySelector('[data-slot="calendar"]')
    expect(calendar).toHaveClass("max-h-(--available-height)", "overflow-y-auto")
    // Обрезка по скруглению и по горизонтали остаётся.
    expect(calendar).toHaveClass("overflow-hidden", "rounded-[16px]")
  })

  it("то же для диапазона", async () => {
    const user = userEvent.setup()
    const { baseElement } = render(<DatePicker mode="range" />)
    await user.click(screen.getByLabelText("Дата начала — Дата окончания"))
    expect(baseElement.querySelector('[data-slot="calendar"]')).toHaveClass(
      "max-h-(--available-height)"
    )
  })
})
