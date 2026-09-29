import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { render } from "@testing-library/react"

import { EmployeeMenuNav } from "./employee-menu-nav"

// r27: в шапке сотрудника на 600px ряд закреплённых разделов сжимался до
// 15px, а обязательный пункт и «Ещё» ложились на колокольчик и значок
// профиля. Ряду теперь гарантирован пол — место под один пункт и «Ещё»
// (переменная `--nav-min-width`), а сжимается подпись сотрудника.

const LINKS = [
  { value: "a", label: "Платежи" },
  { value: "b", label: "Счета" },
  { value: "c", label: "Депозиты" },
]

describe("EmployeeMenuNav: пол ширины при переполнении", () => {
  const original = globalThis.ResizeObserver
  beforeEach(() => {
    globalThis.ResizeObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
    } as unknown as typeof ResizeObserver
    // Контейнер 15px, каждый пункт 70px.
    vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockReturnValue(15)
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(
      function (this: HTMLElement) {
        return { width: this.hasAttribute("data-value") ? 70 : 15 } as DOMRect
      }
    )
    vi.spyOn(HTMLElement.prototype, "getClientRects").mockImplementation(
      () => [{}] as unknown as DOMRectList
    )
  })
  afterEach(() => {
    globalThis.ResizeObserver = original
    vi.restoreAllMocks()
  })

  it("пол равен «Ещё» + один пункт: 88 + 70", () => {
    const { container } = render(<EmployeeMenuNav links={LINKS} />)
    const nav = container.querySelector<HTMLElement>("[data-slot=employee-menu-nav]")!
    expect(nav.style.getPropertyValue("--nav-min-width")).toBe("158px")
    expect(nav.className).toContain("min-w-[var(--nav-min-width,0px)]")
  })

  it("когда всё помещается, пола нет", () => {
    vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockReturnValue(1000)
    const { container } = render(<EmployeeMenuNav links={LINKS} />)
    const nav = container.querySelector<HTMLElement>("[data-slot=employee-menu-nav]")!
    expect(nav.style.getPropertyValue("--nav-min-width")).toBe("")
  })
})
