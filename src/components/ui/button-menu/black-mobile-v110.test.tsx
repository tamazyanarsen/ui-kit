import type * as React from "react"
import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import { ViewportScope } from "@/lib/viewport"
import { Button } from "@/components/ui/button"

import { ButtonMenuBlack } from "./black"

// «ELK / button menu (black)» v1.1.0 — дизайн-чек от 08.10:
//   №2 — без общих действий вместо пустой зоны текст «Нет общих действий
//        для выбранных элементов»;
//   №3 — мобильная форма: столбик, одна растянутая кнопка L и «…» с прочими.

const scope = (viewport: "desktop" | "mobile") => ({
  wrapper: ({ children }: { children: React.ReactNode }) => (
    <ViewportScope viewport={viewport}>{children}</ViewportScope>
  ),
})

const INFO = [
  { label: "Выбрано", value: "10" },
  { label: "На сумму", value: "1 847 540,00 ₽" },
]

describe("ButtonMenuBlack: нет общих действий", () => {
  it.each(["desktop", "mobile"] as const)("%s: подпись вместо пустой зоны", (viewport) => {
    const { container } = render(
      <ButtonMenuBlack info={INFO} onClose={() => {}} />,
      scope(viewport)
    )
    const empty = container.querySelector('[data-slot="button-menu-black-actions"]')!
    expect(empty).toHaveTextContent("Нет общих действий для выбранных элементов")
    expect(empty.hasAttribute("data-empty")).toBe(true)
    expect(empty.className).toContain("text-[var(--button-menu-black-empty-fg)]")
  })

  it("подпись переопределяется", () => {
    render(<ButtonMenuBlack emptyActionsText="Действий нет" />, scope("desktop"))
    expect(screen.getByText("Действий нет")).toBeInTheDocument()
  })
})

describe("ButtonMenuBlack: Size=Mobile", () => {
  it("видна одна кнопка L, остальные уходят в «…»", () => {
    render(
      <ButtonMenuBlack info={INFO} onClose={() => {}}>
        <Button>Подписать</Button>
        <Button>Скачать</Button>
      </ButtonMenuBlack>,
      scope("mobile")
    )
    const panel = document.querySelector('[data-slot="button-menu-black"]')!
    expect(panel.getAttribute("data-size")).toBe("mobile")
    expect(panel.className).toContain("flex-col")
    // Мерная копия ряда скрыта от дерева доступности — роли видят только ряд.
    const visible = screen
      .getAllByRole("button")
      .map((button) => button.textContent?.trim() || button.getAttribute("aria-label"))
    expect(visible).toEqual(["Закрыть", "Подписать", "Ещё"])
    // Кнопка L, текст — умолчание самой кнопки (панель его не трогает).
    const primary = screen.getByRole("button", { name: "Подписать" })
    expect(primary.className).toContain("h-12")
    expect(primary.className).toContain("flex-1")
  })

  it("одна кнопка — без «…»", () => {
    render(
      <ButtonMenuBlack>
        <Button>Подписать</Button>
      </ButtonMenuBlack>,
      scope("mobile")
    )
    expect(screen.queryByRole("button", { name: "Ещё" })).toBeNull()
  })

  it("одно поле информации — строкой с двоеточием, несколько — таблицей", () => {
    const { container, rerender } = render(
      <ButtonMenuBlack info={[INFO[0]]} />,
      scope("mobile")
    )
    expect(container.querySelector('[data-slot="button-menu-black-info"]')).toHaveTextContent(
      "Выбрано:10"
    )
    rerender(<ButtonMenuBlack info={INFO} />)
    const rows = container.querySelector('[data-slot="button-menu-black-info"]')!.children
    expect(rows).toHaveLength(2)
    expect(rows[0].className).toContain("grid-cols-[3fr_5fr]")
  })

  it("desktop остаётся строкой 72", () => {
    render(<ButtonMenuBlack info={INFO} />, scope("desktop"))
    const panel = document.querySelector('[data-slot="button-menu-black"]')!
    expect(panel.getAttribute("data-size")).toBe("desktop")
    expect(panel.className).toContain("min-h-[72px]")
  })
})
