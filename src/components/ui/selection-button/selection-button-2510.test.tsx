// Поповер — десктопная форма: в мобильном виде (уже 1280) список — штора
// (Правки UI-Kit от 25.10).
import "@/test/desktop-viewport"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { Button } from "@/components/ui/button"

import { SelectionButton, SelectionButtonChevron } from "./selection-button"

// Правки UI-Kit от 25.10.

const ITEMS = [
  { id: "list", text: "Списком" },
  { id: "cards", text: "Карточками" },
  { id: "table", text: "Таблицей" },
]

describe("SelectionButton: отметка выбранного (value)", () => {
  it("с value — пункты menuitemradio, галка только у выбранного", async () => {
    const user = userEvent.setup()
    render(<SelectionButton items={ITEMS} value="cards" />)
    await user.click(screen.getByRole("button", { name: "Ещё" }))

    const radios = await screen.findAllByRole("menuitemradio")
    expect(radios).toHaveLength(3)
    expect(radios.map((r) => r.getAttribute("aria-checked"))).toEqual([
      "false",
      "true",
      "false",
    ])
    const checks = document.querySelectorAll('[data-slot="dropdown-item-check"]')
    expect(checks).toHaveLength(1)
    expect(radios[1]).toContainElement(checks[0] as HTMLElement)
    expect(checks[0]).toHaveClass("right-4", "size-4", "text-[var(--check-mark-fg)]")
    // Место 48 справа — у всех пунктов, не только у выбранного.
    for (const radio of radios) {
      expect(radio.querySelector('[data-slot="dropdown-item-content"]')).toHaveClass("pr-12")
    }
  })

  it("value = null — отметка включена, но галок нет", async () => {
    const user = userEvent.setup()
    render(<SelectionButton items={ITEMS} value={null} />)
    await user.click(screen.getByRole("button", { name: "Ещё" }))
    expect(await screen.findAllByRole("menuitemradio")).toHaveLength(3)
    expect(document.querySelectorAll('[data-slot="dropdown-item-check"]')).toHaveLength(0)
  })

  it("без value — обычные пункты меню без галок и без поля под них", async () => {
    const user = userEvent.setup()
    render(<SelectionButton items={ITEMS} />)
    await user.click(screen.getByRole("button", { name: "Ещё" }))
    const items = await screen.findAllByRole("menuitem")
    expect(items).toHaveLength(3)
    expect(screen.queryAllByRole("menuitemradio")).toHaveLength(0)
    expect(document.querySelectorAll('[data-slot="dropdown-item-check"]')).toHaveLength(0)
    for (const item of items) {
      expect(item.querySelector('[data-slot="dropdown-item-content"]')).not.toHaveClass("pr-12")
    }
  })

  it("выбор пункта зовёт onSelect и закрывает меню", async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    render(
      <SelectionButton
        items={[...ITEMS.slice(0, 2), { id: "table", text: "Таблицей", onSelect }]}
        value="list"
      />
    )
    await user.click(screen.getByRole("button", { name: "Ещё" }))
    await user.click(await screen.findByText("Таблицей"))
    expect(onSelect).toHaveBeenCalledTimes(1)
    await waitFor(() => expect(screen.queryByRole("menu")).not.toBeInTheDocument())
  })
})

describe("SelectionButton: шеврон поворачивается, а не подменяется", () => {
  it("один svg с поворотом 180° на открытом списке, 200 мс ease-out", () => {
    render(
      <Button variant="secondary-grey" icon={SelectionButtonChevron} iconPosition="right">
        Вид
      </Button>
    )
    const chevrons = document.querySelectorAll('[data-slot="selection-button-chevron"]')
    expect(chevrons).toHaveLength(1)
    expect(document.querySelectorAll("svg")).toHaveLength(1)
    expect(chevrons[0]).toHaveClass(
      "group-data-popup-open/button:rotate-180",
      "transition-transform",
      "duration-200",
      "ease-out"
    )
    expect(chevrons[0].getAttribute("class")).not.toMatch(/\bhidden\b/)
  })
})

// Размещение. Раскладку jsdom не считает, поэтому геометрия подставлена:
// окно 1400×785, список 240×200.
describe("SelectionButton: по умолчанию раскрывается вниз, direction — предпочтение", () => {
  const VIEW_W = 1400
  const VIEW_H = 785
  const POPUP_H = 200
  let triggerTop = 100

  beforeEach(() => {
    const html = document.documentElement
    Object.defineProperty(html, "clientWidth", { configurable: true, value: VIEW_W })
    Object.defineProperty(html, "clientHeight", { configurable: true, value: VIEW_H })
    vi.spyOn(HTMLElement.prototype, "offsetWidth", "get").mockImplementation(function (
      this: HTMLElement
    ) {
      return this.closest("[data-side]") || this.hasAttribute("data-side") ? 240 : 56
    })
    vi.spyOn(HTMLElement.prototype, "offsetHeight", "get").mockImplementation(function (
      this: HTMLElement
    ) {
      return this.closest("[data-side]") || this.hasAttribute("data-side") ? POPUP_H : 56
    })
    vi.spyOn(Element.prototype, "getBoundingClientRect").mockImplementation(function (
      this: Element
    ) {
      if (this.matches('[aria-haspopup="menu"]')) {
        return DOMRect.fromRect({ x: 600, y: triggerTop, width: 56, height: 56 })
      }
      if (this.hasAttribute("data-side")) {
        return DOMRect.fromRect({ x: 0, y: 0, width: 240, height: POPUP_H })
      }
      return DOMRect.fromRect({ x: 0, y: 0, width: 0, height: 0 })
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
    delete (document.documentElement as unknown as Record<string, unknown>).clientWidth
    delete (document.documentElement as unknown as Record<string, unknown>).clientHeight
  })

  async function openAndGetSide(props: Partial<React.ComponentProps<typeof SelectionButton>> = {}) {
    const user = userEvent.setup()
    render(<SelectionButton items={ITEMS} {...props} />)
    await user.click(screen.getByRole("button", { name: "Ещё" }))
    const popup = await screen.findByRole("menu")
    const positioner = popup.parentElement as HTMLElement
    return positioner
  }

  it("кнопка вверху — список под ней", async () => {
    triggerTop = 100
    const positioner = await openAndGetSide()
    await waitFor(() => expect(positioner).toHaveAttribute("data-side", "bottom"))
  })

  it("кнопка у нижнего края — список отражается вверх", async () => {
    triggerTop = VIEW_H - 56
    const positioner = await openAndGetSide()
    await waitFor(() => expect(positioner).toHaveAttribute("data-side", "top"))
  })

  it("direction top-* — только предпочтение: у верхнего края список уходит вниз", async () => {
    triggerTop = 8
    const positioner = await openAndGetSide({ direction: "top-right" })
    await waitFor(() => expect(positioner).toHaveAttribute("data-side", "bottom"))
  })

  it("direction top-* при месте сверху — список над кнопкой", async () => {
    triggerTop = 500
    const positioner = await openAndGetSide({ direction: "top-right" })
    await waitFor(() => expect(positioner).toHaveAttribute("data-side", "top"))
  })
})
