import { afterEach, describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen } from "@testing-library/react"

import { Button } from "@/components/ui/button"

import { ButtonMenuRow } from "./row"

// Аудит r6: пункт «Ещё» от кнопки с `isLoading` брал только `disabled` —
// выглядел активным, а клик до кнопки не доходил (она занята загрузкой).

function mockRow(width: number) {
  vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockImplementation(function (
    this: HTMLElement
  ) {
    return this.dataset.slot === "button-menu-row" ? width : 0
  })
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(
    () => ({ width: 100, height: 40, top: 0, left: 0, right: 100, bottom: 40 }) as DOMRect
  )
}

describe("ButtonMenuRow: загружающаяся кнопка в «Ещё»", () => {
  afterEach(() => vi.restoreAllMocks())

  it("пункт меню отключён", async () => {
    // Ряд 150, кнопки по 100: вторая не помещается и уходит в «Ещё».
    mockRow(150)
    render(
      <ButtonMenuRow>
        <Button>Первая</Button>
        <Button isLoading>Сохранить</Button>
      </ButtonMenuRow>
    )
    fireEvent.click(screen.getByRole("button", { name: "Ещё" }))
    const item = await screen.findByRole("menuitem", { name: /Сохранить/ })
    expect(item.getAttribute("aria-disabled")).toBe("true")
  })
})
