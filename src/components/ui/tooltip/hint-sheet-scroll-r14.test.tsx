import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import { ViewportScope } from "@/lib/viewport"

import { Hint } from "./hint"

// Аудит 13: в мобильной шторке текст подсказки лежал в ModalDescription без
// своей прокрутки. Колонка шторки обрезана по высоте, поэтому длинный текст
// уходил за низ экрана вместе с кнопкой «Понятно» — ни прочитать, ни
// закрыть из подвала.

describe("Hint в шторке: длинный текст прокручивается сам", () => {
  it("описание сжимается и прокручивается, подвал на месте", () => {
    render(
      <ViewportScope viewport="mobile">
        <Hint title="Как считается комиссия" content="Длинный текст" defaultOpen>
          <button type="button">?</button>
        </Hint>
      </ViewportScope>
    )
    const description = screen.getByText("Длинный текст")
    expect(description).toHaveClass("min-h-0")
    expect(description).toHaveClass("overflow-y-auto")
    expect(description).toHaveClass("themed-scrollbar")
    expect(screen.getByRole("button", { name: "Понятно" })).toBeInTheDocument()
  })
})
