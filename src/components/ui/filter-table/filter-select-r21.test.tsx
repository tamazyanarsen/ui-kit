// Поповер фильтра — десктопная форма: в мобильном виде (уже 1280) вместо
// него штора (Правки UI-Kit от 25.10), а jsdom по умолчанию — «телефон».
import "@/test/desktop-viewport"
import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { FilterSelect } from "./filter-select"

// Аудит 20: подпись варианта обрезалась в одну строку, а длинные варианты
// различаются хвостом («…№ 40702810000000001234 / …5678») — у всех был виден
// один и тот же текст, и выбрать нужный счёт было невозможно.

const LONG = "Расчётный счёт в рублях № 40702810000000001234"

describe("FilterSelect: длинная подпись варианта", () => {
  // Правки UI-Kit от 25.10: высота строки не ограничена — текст переносится
  // целиком, без `line-clamp-2` и многоточия, так что `title` больше не нужен.
  it("переносится целиком, без обрезки в две строки", async () => {
    const user = userEvent.setup()
    render(<FilterSelect label="Счёт" options={[{ value: "a", label: LONG }]} />)
    await user.click(screen.getByRole("button", { name: /Счёт/ }))
    const text = await screen.findByText(LONG)
    expect(text).not.toHaveClass("line-clamp-2")
    expect(text).not.toHaveClass("truncate")
    expect(text.className).toContain("[overflow-wrap:anywhere]")
  })

  // Проверка правок r21: у двухстрочного варианта флажок стоял по центру
  // строки, а не у первой строки текста.
  it("флажок выровнен по первой строке", async () => {
    const user = userEvent.setup()
    render(<FilterSelect label="Счёт" options={[{ value: "a", label: LONG }]} />)
    await user.click(screen.getByRole("button", { name: /Счёт/ }))
    const text = await screen.findByText(LONG)
    const row = text.closest('[data-slot="filter-select-option"]')
    expect(row).toHaveClass("items-start")
    expect(row).not.toHaveClass("items-center")
  })
})
