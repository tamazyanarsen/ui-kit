import { useState } from "react"
import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { DatePicker } from "@/components/ui/date-picker"
import { Calendar } from "./calendar"

// «Применить» подтверждает черновик через `onChange`, только если он
// отличается от уже подтверждённого значения. DatePicker сообщает дату ещё
// при ручном вводе, и «Применить» после ввода давал второй `onChange` с той
// же датой — обработчик с побочным эффектом срабатывал дважды.

describe("Calendar: «Применить» без изменения", () => {
  it("не вызывает onChange повторно, но вызывает onApply", async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    const onApply = vi.fn()
    render(<Calendar value={new Date(2026, 2, 15)} onChange={onChange} onApply={onApply} />)
    await user.click(screen.getByRole("button", { name: "Применить" }))
    expect(onChange).not.toHaveBeenCalled()
    expect(onApply).toHaveBeenCalledTimes(1)
  })

  it("новый день по-прежнему подтверждается", async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Calendar value={new Date(2026, 2, 15)} onChange={onChange} />)
    await user.click(screen.getByRole("button", { name: "16" }))
    await user.click(screen.getByRole("button", { name: "Применить" }))
    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange.mock.calls[0][0]).toEqual(new Date(2026, 2, 16))
  })

  it("управляемый Range без изменений не вызывает onRangeChange", async () => {
    const user = userEvent.setup()
    const onRangeChange = vi.fn()
    render(
      <Calendar
        mode="range"
        defaultMonth={new Date(2026, 2, 1)}
        rangeValue={[new Date(2026, 2, 3), new Date(2026, 2, 5)]}
        onRangeChange={onRangeChange}
      />
    )
    await user.click(screen.getByRole("button", { name: "Применить" }))
    expect(onRangeChange).not.toHaveBeenCalled()
  })
})

function Picker({ onChange }: { onChange: (d: Date | null) => void }) {
  const [value, setValue] = useState<Date | null>(null)
  return (
    <DatePicker
      value={value}
      onChange={(d) => {
        setValue(d)
        onChange(d)
      }}
    />
  )
}

describe("DatePicker: ручной ввод и «Применить»", () => {
  it("одна дата — один onChange", async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Picker onChange={onChange} />)
    const field = screen.getByLabelText("Дата")
    await user.click(field)
    await user.keyboard("15032026")
    expect(onChange).toHaveBeenCalledTimes(1)
    await user.click(await screen.findByRole("button", { name: "Применить" }))
    expect(onChange).toHaveBeenCalledTimes(1)
  })
})
