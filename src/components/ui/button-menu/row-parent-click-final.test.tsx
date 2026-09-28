import { afterEach, describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { Button } from "@/components/ui/button"

import { ButtonMenuRow } from "./row"

// Круг проверки после финальных исправлений: пункт «Ещё» нажимает саму
// кнопку в закадровой копии ряда, и этот лишний клик всплывал к предкам
// ряда — кликабельная карточка вокруг получала клик по невидимой копии.
//
// Сколько кликов предок получает от самого пункта меню — забота Base UI
// Menu (у голого пункта их тоже два), поэтому проверяется именно источник:
// ни один клик у предка не должен идти из мерной копии.

describe("ButtonMenuRow: пункт «Ещё» и предки ряда", () => {
  afterEach(() => vi.restoreAllMocks())

  it("клик по копии кнопки не всплывает к предкам ряда", async () => {
    // Ряд 150, каждая кнопка 100: во второй ряд не помещается, «B» уходит в «Ещё».
    vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockImplementation(function (
      this: HTMLElement
    ) {
      return this.dataset.slot === "button-menu-row" ? 150 : 0
    })
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(
      () => ({ width: 100, height: 40, top: 0, left: 0, right: 100, bottom: 40 }) as DOMRect
    )
    const user = userEvent.setup()
    const fromCopy: EventTarget[] = []
    const onParentClick = vi.fn((event: { target: EventTarget }) => {
      if ((event.target as Element).closest('[aria-hidden="true"]')) {
        fromCopy.push(event.target)
      }
    })
    const onB = vi.fn()
    render(
      <div onClick={onParentClick}>
        <ButtonMenuRow>
          <Button>A</Button>
          <Button onClick={onB}>B</Button>
        </ButtonMenuRow>
      </div>
    )

    await user.click(screen.getByRole("button", { name: "Ещё" }))
    onParentClick.mockClear()
    await user.click(await screen.findByRole("menuitem", { name: "B" }))

    expect(onB).toHaveBeenCalledTimes(1)
    expect(onParentClick).toHaveBeenCalled()
    expect(fromCopy).toEqual([])
  })
})
