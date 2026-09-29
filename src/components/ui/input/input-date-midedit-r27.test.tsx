import * as React from "react"
import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { DatePicker } from "@/components/ui/date-picker"
import { Input } from "./input"

// Круг 27: блоки `MaskedRange` (день 01–31, месяц 01–12) заново прогоняли
// через себя хвост правее правки и отбрасывали «невалидные» промежуточные
// цифры: правка в середине заполненной даты теряла год («12.05.2024», день
// → «15» давало «05.02.4»). Диапазоны проверяются по набранным цифрам, хвост
// сдвигается как у обычного шаблона.

const field = () => screen.getByLabelText("Дата") as HTMLInputElement

async function edit(start: number, end: number, keys: string) {
  const user = userEvent.setup()
  render(<Input label="Дата" mask="date" defaultValue="12.05.2024" />)
  field().focus()
  field().setSelectionRange(start, end)
  await user.keyboard(keys)
  return field().value
}

describe("Маска даты: правка в середине заполненной даты", () => {
  it.each([
    ["день поверх выделения → 15", 0, 2, "15", "15.05.2024"],
    ["Backspace×2 после дня и «15»", 2, 2, "{Backspace}{Backspace}15", "15.05.2024"],
    ["месяц поверх выделения → 11", 3, 5, "11", "12.11.2024"],
    ["месяц одной цифрой ≥2 → ведущий ноль", 3, 5, "3", "12.03.2024"],
    ["день одной цифрой ≥4 → ведущий ноль", 0, 2, "4", "04.05.2024"],
    ["год поверх выделения", 6, 10, "1999", "12.05.1999"],
    ["Backspace посреди дня сдвигает хвост", 1, 1, "{Backspace}", "20.52.024"],
    ["Delete в начале сдвигает хвост", 0, 0, "{Delete}", "20.52.024"],
    ["«1» → «0» даёт 02", 0, 1, "0", "02.05.2024"],
  ])("%s", async (_name, start, end, keys, expected) => {
    expect(await edit(start, end, keys)).toBe(expected)
  })
})

describe("Маска даты: невозможные значения при наборе по-прежнему не принимаются", () => {
  it.each([
    ["45", "04.05"],
    ["3112", "31.12"],
    ["3513", "31.03"],
    ["4", "04"],
  ])("набор %s → %s", async (typed, expected) => {
    const user = userEvent.setup()
    render(<Input label="Дата" mask="date" />)
    await user.type(field(), typed)
    expect(field().value).toBe(expected)
  })

  it.each([["45132024"], ["00.00.0000"], ["32.01.2024"]])("вставка %s отбрасывается", async (text) => {
    const user = userEvent.setup()
    render(<Input label="Дата" mask="date" />)
    await user.click(field())
    await user.paste(text)
    expect(field().value).toBe("")
  })
})

describe("DatePicker: дату можно поправить руками", () => {
  it("смена дня в заполненном поле доходит до onChange и не откатывается", async () => {
    const seen: string[] = []
    function Host() {
      const [value, setValue] = React.useState<Date | null>(new Date(2024, 4, 12))
      return (
        <DatePicker
          label="Дата"
          value={value}
          onChange={(d) => {
            setValue(d)
            if (d) seen.push(d.toLocaleDateString("ru-RU"))
          }}
        />
      )
    }
    const user = userEvent.setup()
    render(<Host />)
    field().focus()
    field().setSelectionRange(0, 2)
    await user.keyboard("15")
    await user.tab()
    expect(field().value).toBe("15.05.2024")
    expect(seen.at(-1)).toBe("15.05.2024")
  })
})
