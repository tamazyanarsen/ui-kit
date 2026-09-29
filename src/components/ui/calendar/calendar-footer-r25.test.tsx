import { describe, expect, it } from "vitest"
import { render } from "@testing-library/react"

import { CalendarFooter } from "./footer"

// Аудит r25: подвал `h-14` с верхней рамкой 1px оставляет кнопкам 55px, а
// кнопки ростом 56 выступали за него на 1px. Пока календарь обрезал всё
// сам, этого не было видно; но когда календарь стал прокручиваемым (низкое
// окно), у него появлялась полоса прокрутки на 1px даже в высоком окне.
// Кнопки берут высоту подвала (`h-full`), а не свою: `overflow-hidden` срезал
// бы верх кольца фокуса (регрессия, найденная проверкой r26).

describe("CalendarFooter: выступ кнопок", () => {
  it.each([false, true])("compact=%s: кнопки по высоте подвала, без обрезки", (compact) => {
    const { container } = render(<CalendarFooter compact={compact} />)
    expect(container.firstElementChild).not.toHaveClass("overflow-hidden")
    for (const b of container.querySelectorAll("button")) {
      expect(b).toHaveClass("h-full")
    }
  })
})
