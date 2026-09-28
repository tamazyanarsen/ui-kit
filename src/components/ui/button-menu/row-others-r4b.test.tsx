import { afterEach, describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"

import { Button } from "@/components/ui/button"

import { ButtonMenuRow } from "./row"

// Аудит r4: прочие дети ряда (кнопка в своей обёртке) рисовались в том же
// flex-ряду, но в расчёт места не входили — кнопки не уходили в «…», и ряд
// вылезал за край.

/** Ряд шириной `width`; кнопки копии и обёртка прочих — по 100. */
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

const visibleButtons = () =>
  screen
    .getAllByRole("button")
    .filter((button) => !button.closest('[aria-hidden="true"]'))
    .map((button) => button.textContent?.trim() || button.getAttribute("aria-label"))

describe("ButtonMenuRow: прочие дети занимают место", () => {
  afterEach(() => vi.restoreAllMocks())

  it("кнопка уходит в «…», когда рядом стоит обёртка", () => {
    // Ряд 350: три кнопки по 100 с зазорами 16 — 332, помещаются. Но обёртка
    // (100 + зазор 16) занимает место — кнопки + обёртка = 448 > 350.
    mockRow(350)
    render(
      <ButtonMenuRow>
        <Button>Первая</Button>
        <Button>Вторая</Button>
        <Button>Третья</Button>
        <span>
          <Button>В обёртке</Button>
        </span>
      </ButtonMenuRow>
    )
    const visible = visibleButtons()
    expect(visible).toContain("В обёртке")
    expect(visible).toContain("Ещё")
    expect(visible).not.toContain("Третья")
  })

  // Аудит r4b: ребёнок, отрисовавший `null` (компонент прав без доступа),
  // оставлял обёртку нулевой ширины — зазор перед ней в ряду был, а в
  // расчёте нет, и ряд впритык вылезал на этот зазор.
  it("пустая обёртка всё равно занимает зазор", () => {
    // Ряд 340: три кнопки — 332, помещаются впритык. Пустая обёртка
    // шириной 0 добавляет зазор 16 → 348 > 340, «Третья» уходит в «…».
    vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockImplementation(function (
      this: HTMLElement
    ) {
      return this.dataset.slot === "button-menu-row" ? 340 : 0
    })
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (
      this: HTMLElement
    ) {
      const width = this.dataset.slot === "button-menu-row-others" ? 0 : 100
      return { width, height: 40, top: 0, left: 0, right: width, bottom: 40 } as DOMRect
    })
    const Nothing = () => null
    render(
      <ButtonMenuRow>
        <Button>Первая</Button>
        <Button>Вторая</Button>
        <Button>Третья</Button>
        <Nothing />
      </ButtonMenuRow>
    )
    expect(visibleButtons()).not.toContain("Третья")
  })
})
