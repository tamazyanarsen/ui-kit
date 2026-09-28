import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import { Informer } from "./informer"

// Аудит r9: две кнопки стояли в ряду без переноса и на полосе 343 уходили
// за край (до 436px).

describe("Informer: кнопки не уходят за край", () => {
  it("ряд кнопок переносится", () => {
    render(
      <Informer
        title="Заголовок"
        mainButtonLabel="Основное действие"
        additionalButtonLabel="Дополнительное действие"
      />
    )
    const row = screen.getByRole("button", { name: "Основное действие" }).parentElement!
    expect(row.className.split(/\s+/)).toContain("flex-wrap")
    // Сверка r9: на десктопе ряд без переноса — иначе в контейнере по
    // содержимому карточка сжималась и кнопки падали в столбик.
    expect(row.className.split(/\s+/)).toContain("desktop:flex-nowrap")
  })
})
