import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { FilterDate, FilterRange } from "."

// Аудит 14.
// 1) FilterDate в низком окне: поле -mb-4 под тень календаря заходит на
//    подвал, и прокрученные дни (позиционированные ячейки) рисовались
//    поверх его линии, а щелчок в «Сбросить» попадал в день «21». Подвал
//    теперь в слое над календарём; вживую сверено в Chrome на 1280×400.
// 2) FilterRange принимал поле из одних пробелов: наружу уходило
//    `{ from: "   " }`, а в триггере стояло «     – 100».

describe("FilterDate: подвал над прокручиваемым календарём", () => {
  it("подвал в слое выше календаря", async () => {
    render(<FilterDate label="Период" />)
    await userEvent.setup().click(screen.getByText("Период"))
    const footer = document.querySelector('[data-slot="combobox-footer"]') as HTMLElement
    expect(footer).toHaveClass("relative", "z-10")
  })
})

describe("FilterRange: пробелы — пустое поле", () => {
  it("наружу уходят обрезанные значения, в триггере «До 100»", async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<FilterRange label="Сумма" onValueChange={onChange} />)
    await user.click(screen.getByText("Сумма"))
    await user.type(screen.getByLabelText("От"), "   ")
    await user.type(screen.getByLabelText("До"), "100")
    await user.click(screen.getByRole("button", { name: /Применить/ }))
    expect(onChange).toHaveBeenCalledWith({ from: "", to: "100" })
    expect(screen.getByText("До 100")).toBeInTheDocument()
  })

  it("управляемое значение из пробелов не попадает в подпись", () => {
    render(<FilterRange label="Сумма" value={{ from: "  ", to: "100" }} />)
    expect(screen.getByText("До 100")).toBeInTheDocument()
  })
})
