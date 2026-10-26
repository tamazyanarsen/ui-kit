import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { TitleCard } from "./title-card"
import { TitleRegistry } from "./title-registry"

// jsdom не применяет CSS, поэтому мобильная форма проверяется по классам:
// кнопки, которых нет в Size=Mobile, скрыты до `desktop:`.
describe("Title — мобильная форма и Button Title (ELK)", () => {
  it("Title Card: «Назад» и «Справка» в мобильной форме скрыты", () => {
    render(<TitleCard title="Договор" onBack={() => {}} />)
    expect(screen.getByRole("button", { name: "Назад" })).toHaveClass("hidden", "desktop:inline-flex")
    expect(screen.getByRole("button", { name: "Справка" }).parentElement).toHaveClass(
      "hidden",
      "desktop:flex"
    )
    expect(screen.getByRole("heading")).toHaveClass("text-h2-adaptive")
  })

  it("Title Card: тип More — «Ещё» с шевроном справа", () => {
    render(<TitleCard title="Договор" helpType="more" />)
    const more = screen.getByRole("button", { name: "Ещё" })
    // Содержимое кнопки — в одной обёртке (нажатие `press-clip`, Правки
    // UI-Kit от 25.10).
    const content = more.querySelector('[data-slot="button-content"]')
    expect(content?.lastElementChild?.tagName.toLowerCase()).toBe("svg")
    expect(screen.queryByRole("button", { name: "Справка" })).toBeNull()
  })

  it("Registry: справка и действия в мобильной форме скрыты", () => {
    render(<TitleRegistry title="Реестр" actions={<button type="button">Создать</button>} />)
    const group = screen.getByRole("button", { name: "Создать" }).parentElement
    expect(group).toHaveClass("hidden", "desktop:flex")
  })
})
