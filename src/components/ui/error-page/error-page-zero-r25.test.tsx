import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import { ErrorPage } from "./error-page"

// Аудит r25: `title`, `description` и `buttonLabel` со значением 0 выводили
// голый «0» в колонку страницы — без заголовка, абзаца и кнопки.

describe("ErrorPage: нулевые значения", () => {
  it("title 0 — в заголовке h1", () => {
    render(<ErrorPage title={0} />)
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("0")
  })

  it("description 0 — в абзаце", () => {
    const { container } = render(<ErrorPage description={0} />)
    expect(container.querySelector("p")).toHaveTextContent("0")
  })

  it("buttonLabel 0 — в кнопке", () => {
    render(<ErrorPage buttonLabel={0} />)
    expect(screen.getByRole("button", { name: "0" })).toBeInTheDocument()
  })

  it("пустые строки ничего не рисуют", () => {
    const { container } = render(<ErrorPage title="" description="" buttonLabel="" />)
    expect(container.querySelector("h1, p, button")).toBeNull()
  })
})
