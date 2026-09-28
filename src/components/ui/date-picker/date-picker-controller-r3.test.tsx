import * as React from "react"
import { describe, expect, it, vi } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { DatePicker } from "./date-picker"

// Итоговая проверка №2: DatePicker нельзя было полноценно подключить через
// `Controller` из react-hook-form — не было ни `ref` (фокус на поле с
// ошибкой), ни `onBlur` (режим onTouched), ни `name`. Сверено с настоящим
// RHF 7: после правки поле помечается тронутым и получает фокус на ошибке.

const focusedDate = () => (document.activeElement as HTMLElement | null)?.dataset.date

describe("DatePicker под Controller", () => {
  it("ref указывает на текстовое поле, name доходит до него", () => {
    const ref = React.createRef<HTMLInputElement>()
    render(<DatePicker ref={ref} name="startDate" />)
    const field = screen.getByLabelText("Дата")
    expect(ref.current).toBe(field)
    expect(field).toHaveAttribute("name", "startDate")
    ref.current!.focus()
    expect(field).toHaveFocus()
  })

  it("onBlur — только когда фокус ушёл из пикера целиком", async () => {
    const user = userEvent.setup()
    const onBlur = vi.fn()
    render(
      <>
        <DatePicker value={new Date(2026, 4, 15)} onBlur={onBlur} />
        <button type="button">после</button>
      </>
    )
    const field = screen.getByLabelText("Дата")

    // Поле → календарь (стрелкой вниз) — это всё ещё пикер.
    await user.click(field)
    await user.keyboard("{ArrowDown}")
    await waitFor(() => expect(focusedDate()).toBe("2026-5-15"))
    expect(onBlur).not.toHaveBeenCalled()

    // Из календаря наружу — уход.
    await user.click(screen.getByRole("button", { name: "после" }))
    expect(onBlur).toHaveBeenCalledTimes(1)
  })
})
