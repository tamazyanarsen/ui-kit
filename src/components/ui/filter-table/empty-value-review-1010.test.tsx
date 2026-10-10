import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { FilterDate } from "./filter-date"
import { FilterRange } from "./filter-range"

// Ревью 10.10, КК-5: пустое значение фильтра было общей константой модуля и
// уходило наружу через `onValueChange`. Потребитель, поправивший его на
// месте, портил пустое значение всех фильтров до конца сессии.
describe("Пустое значение фильтра — свой объект на каждый сброс (ревью 10.10, КК-5)", () => {
  it("FilterRange", async () => {
    const user = userEvent.setup()
    const first = vi.fn()
    const second = vi.fn()
    render(
      <>
        <FilterRange label="Сумма" value={{ from: "1", to: "2" }} onValueChange={first} />
        <FilterRange label="Срок" value={{ from: "3", to: "4" }} onValueChange={second} />
      </>
    )
    const [clearFirst, clearSecond] = screen.getAllByRole("button", { name: "Сбросить фильтр" })
    await user.click(clearFirst)
    const handedOut = first.mock.calls[0][0] as { from: string; to: string }
    handedOut.from = "999"

    await user.click(clearSecond)
    expect(second).toHaveBeenCalledWith({ from: "", to: "" })
  })

  it("FilterDate", async () => {
    const user = userEvent.setup()
    const first = vi.fn()
    const second = vi.fn()
    const day = new Date(2026, 9, 10)
    render(
      <>
        <FilterDate label="Дата" value={[day, day]} onValueChange={first} />
        <FilterDate label="Срок" value={[day, day]} onValueChange={second} />
      </>
    )
    const [clearFirst, clearSecond] = screen.getAllByRole("button", { name: "Сбросить фильтр" })
    await user.click(clearFirst)
    const handedOut = first.mock.calls[0][0] as [Date | null, Date | null]
    handedOut[0] = day

    await user.click(clearSecond)
    expect(second).toHaveBeenCalledWith([null, null])
  })
})
