import { afterEach, describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { Button } from "@/components/ui/button"

import { ButtonMenu } from "./root"
import { ButtonMenuRow } from "./row"

// Итоговая проверка №3: `Children.toArray` не раскрывает фрагменты, и ряд
// узнавал только прямых детей-`Button`. Кнопки в `<>…</>` ButtonMenuRow
// молча не рисовал, кнопку в своей обёртке — тоже; ButtonMenu уводил их
// «прочим» за ряд, мимо «…».

/** Ряд шириной `width`, каждая кнопка копии — 100. */
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

const visibleNames = () =>
  screen
    .getAllByRole("button")
    .filter((button) => !button.closest('[aria-hidden="true"]'))
    .map((button) => button.textContent?.trim() || button.getAttribute("aria-label"))

describe("ButtonMenuRow: фрагменты и обёртки", () => {
  afterEach(() => vi.restoreAllMocks())

  it("кнопки во фрагменте видны в ряду", () => {
    render(
      <ButtonMenuRow>
        <Button>Первая</Button>
        <>
          <Button>Сохранить</Button>
          <Button>Отмена</Button>
        </>
      </ButtonMenuRow>
    )
    expect(visibleNames()).toEqual(["Первая", "Сохранить", "Отмена"])
  })

  it("кнопка из фрагмента уходит в «…», когда не помещается", async () => {
    // Ряд 200: обе кнопки с зазором — 216 > 200; первая + «…» 56+16 = 172.
    mockRow(200)
    const user = userEvent.setup()
    render(
      <ButtonMenuRow>
        <>
          <Button>Первая</Button>
          <Button>Вторая</Button>
        </>
      </ButtonMenuRow>
    )
    expect(visibleNames()).toContain("Первая")
    expect(visibleNames()).not.toContain("Вторая")
    await user.click(screen.getByRole("button", { name: "Ещё" }))
    expect(await screen.findByRole("menuitem", { name: "Вторая" })).toBeInTheDocument()
  })

  it("ребёнок в своей обёртке рисуется, а не пропадает", () => {
    render(
      <ButtonMenuRow>
        <Button>Первая</Button>
        <span data-testid="wrapper">
          <Button>В обёртке</Button>
        </span>
      </ButtonMenuRow>
    )
    expect(screen.getByTestId("wrapper")).toBeInTheDocument()
    expect(visibleNames()).toContain("В обёртке")
  })
})

describe("ButtonMenu: кнопки во фрагменте — кнопки ряда", () => {
  afterEach(() => vi.restoreAllMocks())

  it("не уходят «прочим» за ряд", () => {
    render(
      <ButtonMenu pinned={false}>
        <>
          <Button>Первая</Button>
          <Button>Вторая</Button>
        </>
      </ButtonMenu>
    )
    const row = document.querySelector('[data-slot="button-menu-row"]')!
    const inRow = Array.from(row.querySelectorAll("button"))
      .filter((button) => !button.closest('[aria-hidden="true"]'))
      .map((button) => button.textContent?.trim())
    expect(inRow).toEqual(["Первая", "Вторая"])
  })
})
