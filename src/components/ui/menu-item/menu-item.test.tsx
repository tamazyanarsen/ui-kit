import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import { MenuItemContent, menuItemRowClass } from "./menu-item"

// Общая строка меню: на ней стоят пункты Dropdown, Select, Combobox,
// Employee Menu и навигации шапки.
describe("MenuItemContent", () => {
  it("рисует основной текст", () => {
    render(
      <div>
        <MenuItemContent>Платежи</MenuItemContent>
      </div>
    )
    expect(screen.getByText("Платежи")).toBeInTheDocument()
  })

  it("рисует все четыре слота вокруг текста", () => {
    render(
      <div>
        <MenuItemContent
          leading={<span>слева</span>}
          label="Подпись"
          description="Описание"
          trailing={<span>справа</span>}
        >
          Платежи
        </MenuItemContent>
      </div>
    )
    for (const text of ["слева", "Подпись", "Платежи", "Описание", "справа"]) {
      expect(screen.getByText(text)).toBeInTheDocument()
    }
  })

  it("необязательные слоты не рисуются, когда их не дали", () => {
    render(
      <div data-testid="row">
        <MenuItemContent>Платежи</MenuItemContent>
      </div>
    )
    expect(screen.getByTestId("row")).toHaveTextContent("Платежи")
    expect(screen.queryByText("Описание")).not.toBeInTheDocument()
  })
})

describe("menuItemRowClass", () => {
  // Уровни отличаются только левым полем: Level 1 — обычные p-16, дальше
  // поле растёт на 16 за уровень.
  it("первый уровень не добавляет левого поля", () => {
    expect(menuItemRowClass("")).not.toMatch(/\bpl-/)
  })

  it("каждый следующий уровень отодвигает строку левее", () => {
    expect(menuItemRowClass("", undefined, 2)).toContain("pl-8")
    expect(menuItemRowClass("", undefined, 3)).toContain("pl-12")
    expect(menuItemRowClass("", undefined, 4)).toContain("pl-16")
  })

  it("подсветку и класс вызывающего кода сохраняет", () => {
    const cls = menuItemRowClass("bg-highlight", "cursor-pointer")
    expect(cls).toContain("bg-highlight")
    expect(cls).toContain("cursor-pointer")
  })
})
