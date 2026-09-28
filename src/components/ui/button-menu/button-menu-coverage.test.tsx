import { act, render } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"

import { ButtonMenuBlack } from "./black"

// Добор покрытия к исправлениям навигации (раунд 1): у существующего теста
// «перемеряет новый узел панели» заглушка отдавала 72 и снятому узлу, и
// старый код, продолжавший мерить его, тест проходил.

const inset = () =>
  document.documentElement.style.getPropertyValue("--viewport-inset-bottom")

describe("ButtonMenuBlack: замер после смены узла панели", () => {
  afterEach(() => vi.restoreAllMocks())

  it("после переезда панели в блок «кнопка + панель» меряется новый узел, а не снятый", () => {
    // Снятый из DOM узел, как и в браузере, отдаёт нулевую коробку.
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (
      this: HTMLElement
    ) {
      if (!this.isConnected) return { top: 0, height: 0 } as DOMRect
      const height = this.dataset.slot === "button-menu-black" ? 72 : 136
      return { top: window.innerHeight - height, bottom: window.innerHeight, height } as DOMRect
    })
    const props = { selectAllPagesCount: 10, onSelectAllPages: () => {} }
    const { rerender, container } = render(
      <ButtonMenuBlack {...props} selectedCount={10} />
    )
    const before = container.querySelector('[data-slot="button-menu-black"]')
    expect(inset()).toBe("72px")

    // Выбрано не всё — появляется кнопка «Выбрать на всех страницах», и
    // панель переезжает в блок: React пересоздаёт её узел.
    rerender(<ButtonMenuBlack {...props} selectedCount={3} />)
    const after = container.querySelector('[data-slot="button-menu-black"]')
    expect(after).not.toBe(before)

    // Любой следующий замер (прокрутка, resize) обязан смотреть на живой узел.
    act(() => {
      window.dispatchEvent(new Event("resize"))
    })
    expect(inset()).toBe("72px")
  })
})
