import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import { Loader } from "./loader"

describe("Loader", () => {
  // Без подписи крутилка — оформление, и скринридер не должен её объявлять.
  it("по умолчанию скрыт от скринридера", () => {
    const { container } = render(<Loader />)
    const svg = container.querySelector('[data-slot="loader"]')
    expect(svg).toHaveAttribute("aria-hidden", "true")
    expect(svg).not.toHaveAttribute("role")
  })

  it("с подписью становится статусом", () => {
    render(<Loader label="Загрузка" />)
    const status = screen.getByRole("status", { name: "Загрузка" })
    expect(status).toBeInTheDocument()
    expect(status).not.toHaveAttribute("aria-hidden")
  })

  it("размер по умолчанию — md", () => {
    const { container } = render(<Loader />)
    expect(container.querySelector('[data-slot="loader"]')).toHaveClass("size-6")
  })

  it("размер и цвет задаются вариантами", () => {
    const { container } = render(<Loader size="lg" color="white" />)
    const svg = container.querySelector('[data-slot="loader"]')
    expect(svg).toHaveClass("size-10")
    expect(svg).toHaveClass("text-[var(--loader-white-fg)]")
  })
})
