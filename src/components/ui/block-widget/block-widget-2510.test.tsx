import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import { Checkbox } from "@/components/ui/checkbox"

import { BlockWidget } from "./block-widget"
import { BlockWidgetHead } from "./head"

// Правки UI-Kit от 25.10, «Нажимаемые серые карточки»: нажатие ловит сам
// блок; при нажатии вложенного контрола (чекбокс, «i», кнопка) блок не
// подсвечивается и не сжимается; сжатие крупной серой карточки — 0,98;
// наведение — только у настоящего курсора.

/** `:active` в jsdom не наступает — нажатие помечается атрибутом. */
const asTest = (selector: string) => selector.replace(/:active/g, "[data-active]")

function variantSelector(className: string, utility: string): string {
  const token = className
    .split(/\s+/)
    .find((cls) => cls.includes("[&:active") && cls.endsWith(`]:${utility}`))
  expect(token, `класс с ${utility}`).toBeDefined()
  const start = token!.indexOf("[&")
  const variant = token!.slice(start + 1, token!.length - utility.length - 2)
  return asTest(variant.replace("&", "[data-slot=block-widget]"))
}

function renderWidget() {
  render(
    <BlockWidget onClick={() => {}}>
      <BlockWidgetHead title="Заявка" info="Подсказка" leading={<Checkbox aria-label="Отметить" />} />
    </BlockWidget>
  )
  return document.querySelector<HTMLElement>("[data-slot='block-widget']")!
}

describe("BlockWidget: нажатие серой карточки", () => {
  it("заливка нажатия гаснет, когда нажат вложенный чекбокс или «i»", () => {
    const root = renderWidget()
    const pressed = variantSelector(root.className, "bg-[var(--block-widget-bg-active)]")

    root.setAttribute("data-active", "")
    expect(root.matches(pressed)).toBe(true)

    const checkbox = screen.getByRole("checkbox")
    checkbox.setAttribute("data-active", "")
    expect(root.matches(pressed)).toBe(false)
    checkbox.removeAttribute("data-active")

    const info = screen.getByRole("button", { name: "Информация" })
    info.setAttribute("data-active", "")
    expect(root.matches(pressed)).toBe(false)
    info.removeAttribute("data-active")

    // Своя кнопка-подложка — это нажатие самого блока (пробел с клавиатуры).
    root.querySelector("[data-slot='press-target']")!.setAttribute("data-active", "")
    expect(root.matches(pressed)).toBe(true)
  })

  it("сжатие до 0,98 — с тем же условием, что и заливка", () => {
    const root = renderWidget()
    const scale = variantSelector(root.className, "scale-[.98]")
    root.setAttribute("data-active", "")
    expect(root.matches(scale)).toBe(true)
    screen.getByRole("checkbox").setAttribute("data-active", "")
    expect(root.matches(scale)).toBe(false)
    expect(root.className).toContain("[--press-t:var(--duration-release)_var(--ease-soft)]")
  })

  it("наведение — только у настоящего курсора", () => {
    const root = renderWidget()
    expect(root.className).toContain("[@media(pointer:fine)]:hover:bg-[var(--block-widget-bg-hover)]")
    expect(root.className).not.toMatch(/(^|\s)hover:bg-/)
    expect(root.className).not.toMatch(/(^|\s)active:bg-/)
  })

  it("скругление 12 на обеих формах (правило каркаса о серых карточках выполнено)", () => {
    const root = renderWidget()
    expect(root.className).toContain("rounded-[12px]")
    expect(root.className).not.toContain("desktop:rounded-")
  })

  it("некликабельный блок без нажатия и сжатия", () => {
    render(<BlockWidget>Текст</BlockWidget>)
    const root = document.querySelector<HTMLElement>("[data-slot='block-widget']")!
    expect(root.className).not.toContain("scale-[.98]")
    expect(root.className).not.toContain("cursor-pointer")
  })
})
