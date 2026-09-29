import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import { ErrorPage } from "./error-page"

// Аудит r25: неразрывное слово в заголовке и описании страницы ошибки
// выходило за край блока (в колонке 300px `scrollWidth` был 714): у текстов
// не было `overflow-wrap: anywhere`.

describe("ErrorPage: длинные тексты", () => {
  it("заголовок и описание переносятся по буквам", () => {
    render(
      <ErrorPage
        title="Договор_поставки_оборудования_000123456789"
        description="Описание_поставки_оборудования_000123456789"
      />
    )
    expect(screen.getByRole("heading", { level: 1 })).toHaveClass(
      "max-w-full",
      "[overflow-wrap:anywhere]"
    )
    expect(screen.getByText("Описание_поставки_оборудования_000123456789")).toHaveClass(
      "[overflow-wrap:anywhere]"
    )
  })
})
