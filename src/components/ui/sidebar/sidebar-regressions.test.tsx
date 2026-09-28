import { afterEach, describe, expect, it, vi } from "vitest"
import { act, fireEvent, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { Sidebar } from "./sidebar"
import { SidebarItem } from "./item"

describe("SidebarItem без href", () => {
  it("достижим с клавиатуры и срабатывает по Enter", async () => {
    const onClick = vi.fn()
    render(
      <Sidebar>
        <SidebarItem label="Платежи" onClick={onClick} />
      </Sidebar>
    )
    const link = screen.getByRole("link", { name: "Платежи" })
    await userEvent.tab()
    expect(link).toHaveFocus()
    await userEvent.keyboard("{Enter}")
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it("активный пункт объявляет себя текущей страницей", () => {
    render(
      <Sidebar>
        <SidebarItem label="Платежи" href="/p" active />
      </Sidebar>
    )
    expect(screen.getByRole("link", { name: "Платежи" })).toHaveAttribute(
      "aria-current",
      "page"
    )
  })
})

describe("SidebarItem: замер обрезки", () => {
  const original = globalThis.ResizeObserver
  afterEach(() => {
    globalThis.ResizeObserver = original
    vi.restoreAllMocks()
  })

  it("перемеряет подпись после анимации ширины и не пересоздаёт ссылку", () => {
    const callbacks: ResizeObserverCallback[] = []
    globalThis.ResizeObserver = class {
      constructor(cb: ResizeObserverCallback) {
        callbacks.push(cb)
      }
      observe() {}
      unobserve() {}
      disconnect() {}
    } as unknown as typeof ResizeObserver

    // Первый рендер застаёт панель посреди анимации — подпись сжата.
    let scrollWidth = 200
    vi.spyOn(HTMLElement.prototype, "scrollWidth", "get").mockImplementation(() => scrollWidth)
    vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockReturnValue(100)

    render(
      <Sidebar>
        <SidebarItem label="Главная" href="/" />
      </Sidebar>
    )
    const link = screen.getByRole("link", { name: "Главная" })
    link.focus()

    // Анимация закончилась: подпись поместилась.
    scrollWidth = 50
    act(() => callbacks.forEach((cb) => cb([], {} as ResizeObserver)))
    fireEvent.mouseEnter(link)

    expect(screen.getByRole("link", { name: "Главная" })).toBe(link)
    expect(link).toHaveFocus()
  })
})
