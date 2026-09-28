import * as React from "react"
import { afterEach, describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { Button } from "@/components/ui/button"

import { ButtonMenuOverflow, ButtonMenuOverflowItem } from "./overflow"
import { ButtonMenuRow } from "./row"

// Итоговая проверка №2: ряд кнопок.

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

describe("ButtonMenuRow: мерная копия", () => {
  afterEach(() => vi.restoreAllMocks())

  it("ref и id потребителя достаются видимой кнопке, а не копии", () => {
    const ref = React.createRef<HTMLButtonElement>()
    render(
      <ButtonMenuRow>
        <Button ref={ref} id="save">
          Сохранить
        </Button>
      </ButtonMenuRow>
    )

    expect(document.querySelectorAll("#save")).toHaveLength(1)
    expect(ref.current).toBe(screen.getByRole("button", { name: "Сохранить" }))
    expect(ref.current?.closest('[aria-hidden="true"]')).toBeNull()
  })
})

describe("ButtonMenuRow: переданное меню с showDropdown={false}", () => {
  afterEach(() => vi.restoreAllMocks())

  it("спрятанные команды остаются доступны из «…»", async () => {
    // Ряд 250: две кнопки по 100 + зазор 16 + своё «…» 56+16 уже не лезут.
    mockRow(250)
    const user = userEvent.setup()
    const onThird = vi.fn()
    render(
      <ButtonMenuRow>
        <Button>Первая</Button>
        <Button>Вторая</Button>
        <Button onClick={onThird}>Третья</Button>
        <ButtonMenuOverflow showDropdown={false}>
          <ButtonMenuOverflowItem text="Своё" />
        </ButtonMenuOverflow>
      </ButtonMenuRow>
    )

    await user.click(screen.getByRole("button", { name: "Ещё" }))
    await user.click(await screen.findByRole("menuitem", { name: "Третья" }))
    expect(onThird).toHaveBeenCalledTimes(1)
  })

  it("место под переданное «…» резервируется: кнопки не заезжают под него", () => {
    // 2 × 100 + 16 = 216 ≤ 250, но рядом стоит «…» (56 + 16): вместе 288.
    mockRow(250)
    render(
      <ButtonMenuRow>
        <Button>Первая</Button>
        <Button>Вторая</Button>
        <ButtonMenuOverflow>
          <ButtonMenuOverflowItem text="Своё" />
        </ButtonMenuOverflow>
      </ButtonMenuRow>
    )

    expect(screen.queryByRole("button", { name: "Вторая" })).not.toBeInTheDocument()
  })
})
