import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import { CardAccount } from "./card-account"

describe("CardAccount", () => {
  // Мини-карта — пиктограмма рядом с названием счёта, а не самостоятельный
  // смысл: её содержимое дублирует текст строки, поэтому от скринридера она
  // скрыта целиком.
  it("скрыта от скринридера", () => {
    const { container } = render(<CardAccount />)
    const tile = container.querySelector('[data-slot="card-account"]')
    expect(tile).toHaveAttribute("aria-hidden", "true")
  })

  it("окончание номера рисуется, когда его дали", () => {
    render(<CardAccount number="1135" />)
    expect(screen.getByText("1135")).toBeInTheDocument()
  })

  // На плитке остаётся надпись платёжной системы — проверяем, что пропал
  // именно номер, а не всё содержимое.
  it("без номера окончание не рисуется", () => {
    render(<CardAccount />)
    expect(screen.queryByText("1135")).not.toBeInTheDocument()
  })

  // Дизайн-чек «Storybook 3», замечание 10: окончание номера — P4 Regular,
  // а не Medium. Разница в один шаг веса, и на 10 пикселях её видно только
  // рядом с эталоном, поэтому держим тестом.
  it("окончание номера идёт в P4 Regular", () => {
    render(<CardAccount number="1135" />)
    expect(screen.getByText("1135")).toHaveClass("text-p4-regular")
  })

  it("платёжная система по умолчанию — «Мир»", () => {
    render(<CardAccount />)
    expect(screen.getByText("МИР")).toBeInTheDocument()
  })

  it("платёжную систему можно сменить", () => {
    render(<CardAccount paymentSystem="mastercard" />)
    expect(screen.queryByText("МИР")).not.toBeInTheDocument()
  })
})
