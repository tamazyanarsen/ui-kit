import * as React from "react"
import { describe, expect, it } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { DatePicker } from "./date-picker"

// Восьмой раунд аудита: поповер Base UI, пока фокус снаружи, прячет
// остановку Tab в `data-tabindex` и при возврате восстанавливает её оттуда.
// Если остановка за это время переехала на другой день, старый день
// возвращался в обход по Tab — остановок становилось две.

const days = () =>
  Array.from(document.querySelectorAll<HTMLElement>('[data-slot="calendar-day"]'))
const tabStops = () =>
  days()
    .filter((day) => day.getAttribute("tabindex") === "0")
    .map((day) => day.dataset.date)
const focusedDate = () => (document.activeElement as HTMLElement | null)?.dataset.date

function Single() {
  const [value, setValue] = React.useState<Date | null>(new Date(2026, 4, 15))
  return (
    <>
      <DatePicker value={value} onChange={setValue} />
      <button type="button">после</button>
    </>
  )
}

describe("DatePicker: одна остановка Tab в сетке дней", () => {
  it("ввод даты при открытом календаре не оставляет вторую остановку", async () => {
    const user = userEvent.setup()
    render(<Single />)
    const field = screen.getByLabelText("Дата") as HTMLInputElement

    await user.click(field)
    await screen.findByRole("button", { name: "Применить" })
    const popup = document.querySelector('[data-slot="date-picker-content"]')!
    const next = Array.from(popup.querySelectorAll("button")).find((button) =>
      /след|впер/i.test(button.getAttribute("aria-label") ?? "")
    )!
    // Листаем мышью: остановка уезжает на 1 июня, фокус — на кнопке шапки.
    await user.click(next)
    // Возврат в поле: Base UI прячет остановку 1 июня в data-tabindex.
    await user.click(field)
    await user.clear(field)
    await user.type(field, "20062026")
    await user.keyboard("{ArrowDown}")
    await waitFor(() => expect(focusedDate()).toBe("2026-6-20"))

    expect(tabStops()).toEqual(["2026-6-20"])
  })

  // Девятый раунд: день, на котором последним стоял фокус, оставался
  // остановкой и после того, как дату поменяли в поле.
  it("после ввода даты ArrowDown ведёт на введённый день, а не на прежний", async () => {
    const user = userEvent.setup()
    render(<Single />)
    const field = screen.getByLabelText("Дата") as HTMLInputElement

    await user.click(field)
    await user.keyboard("{ArrowDown}")
    await waitFor(() => expect(focusedDate()).toBe("2026-5-15"))
    await user.keyboard("{ArrowRight}{ArrowRight}")
    expect(focusedDate()).toBe("2026-5-17")

    await user.click(field)
    await user.clear(field)
    await user.type(field, "25052026")
    await user.keyboard("{ArrowDown}")
    await waitFor(() => expect(focusedDate()).toBe("2026-5-25"))
    expect(tabStops()).toEqual(["2026-5-25"])
  })
})
