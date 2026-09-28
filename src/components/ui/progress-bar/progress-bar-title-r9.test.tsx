import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import { ProgressBar } from "./progress-bar"

// Аудит r9: заголовок стоял `shrink-0` и длинный шёл одной строкой за
// контейнер (до 745px при полосе 343) — горизонтальная прокрутка страницы.

describe("ProgressBar: длинный заголовок переносится", () => {
  it("заголовок может сжиматься и переносится по словам", () => {
    render(
      <ProgressBar
        title="Заявка на открытие расчётного счёта для индивидуального предпринимателя"
        description="Шаг 2 из 5"
        showDescription
      />
    )
    const title = screen.getByText(/Заявка на открытие/)
    expect(title.className.split(/\s+/)).not.toContain("shrink-0")
    expect(title.className.split(/\s+/)).toContain("min-w-0")
  })
})
