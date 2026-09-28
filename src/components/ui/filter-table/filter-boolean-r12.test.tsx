import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { FilterBoolean } from "./filter-boolean"
import { FilterDate } from "./filter-date"

// Аудит 11: подпись лежала голым текстом во флекс-кнопке — анонимный
// элемент, `truncate` многоточия не давал, а `justify-center` срезал
// длинную подпись с обеих сторон.

describe("FilterBoolean: длинная подпись режется многоточием в конце", () => {
  it("подпись — в своём узле с многоточием", () => {
    render(<FilterBoolean label="Только документы с просроченным сроком исполнения" />)
    const text = screen.getByText("Только документы с просроченным сроком исполнения")
    expect(text.tagName).toBe("SPAN")
    expect(text).toHaveClass("min-w-0", "overflow-clip", "text-ellipsis")
  })
})

describe("FilterDate: подписи заготовок в своём узле", () => {
  it("подпись заготовки режется по max-w-64 кнопки", async () => {
    const user = userEvent.setup()
    const day = new Date(2025, 0, 1)
    render(
      <FilterDate
        label="Дата"
        presets={[{ label: "Очень длинная заготовка периода", range: () => [day, day] }]}
      />
    )
    await user.click(screen.getByText("Дата"))
    const text = screen.getByText("Очень длинная заготовка периода")
    expect(text.tagName).toBe("SPAN")
    expect(text).toHaveClass("min-w-0", "overflow-clip", "text-ellipsis")
    expect(text.closest("button")).toHaveClass("max-w-64")
  })
})
