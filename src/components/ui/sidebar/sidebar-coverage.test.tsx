import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { act, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { Sidebar } from "./sidebar"
import { SidebarItem } from "./item"

// Добор покрытия к исправлениям навигации (раунд 1): существующий тест
// «перемеряет подпись после анимации ширины» проходил и на старом коде —
// старый замер просто не срабатывал до следующего рендера. Здесь
// проверяется то, что пользователь видит: тултип-дубль и фокус ссылки.

const TOOLTIP = '[data-slot="tooltip-content"]'

describe("SidebarItem: подпись, обрезанная только на время анимации", () => {
  const original = globalThis.ResizeObserver
  const callbacks: ResizeObserverCallback[] = []
  let scrollWidth = 200

  beforeEach(() => {
    callbacks.length = 0
    globalThis.ResizeObserver = class {
      constructor(cb: ResizeObserverCallback) {
        callbacks.push(cb)
      }
      observe() {}
      unobserve() {}
      disconnect() {}
    } as unknown as typeof ResizeObserver
    // Первый рендер застаёт панель посреди анимации ширины: подпись сжата.
    scrollWidth = 200
    vi.spyOn(HTMLElement.prototype, "scrollWidth", "get").mockImplementation(() => scrollWidth)
    vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockReturnValue(100)
  })
  afterEach(() => {
    globalThis.ResizeObserver = original
    vi.restoreAllMocks()
  })

  function finishAnimation() {
    scrollWidth = 50
    act(() => callbacks.forEach((cb) => cb([], {} as ResizeObserver)))
  }

  it("после анимации тултип-дубль видимой подписи не появляется", async () => {
    const user = userEvent.setup()
    render(
      <Sidebar>
        <SidebarItem label="Главная" href="/" />
      </Sidebar>
    )
    finishAnimation()

    await user.hover(screen.getByRole("link", { name: "Главная" }))
    await act(() => new Promise((resolve) => setTimeout(resolve, 600)))

    expect(document.querySelector(TOOLTIP)).toBeNull()
  })

  it("пока подпись обрезана, тултип есть (проверка самой методики)", async () => {
    const user = userEvent.setup()
    render(
      <Sidebar>
        <SidebarItem label="Главная" href="/" />
      </Sidebar>
    )

    await user.hover(screen.getByRole("link", { name: "Главная" }))
    await act(() => new Promise((resolve) => setTimeout(resolve, 600)))

    expect(document.querySelector(TOOLTIP)).not.toBeNull()
  })

  it("перерисовка после смены обрезки не пересоздаёт ссылку и не роняет фокус", () => {
    const { rerender } = render(
      <Sidebar>
        <SidebarItem label="Главная" href="/" />
      </Sidebar>
    )
    const link = screen.getByRole("link", { name: "Главная" })
    link.focus()

    finishAnimation()
    rerender(
      <Sidebar>
        <SidebarItem label="Главная" href="/" />
      </Sidebar>
    )

    expect(screen.getByRole("link", { name: "Главная" })).toBe(link)
    expect(link).toHaveFocus()
  })
})
