import { afterEach, describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"

import { Button } from "@/components/ui/button"

import { ButtonMenuBlack } from "./black"

// Сверка r7 на 375: информация чёрной панели (412) была шире самой панели
// (326), ряд действий сжимался до нуля — а нулевую ширину хук ряда считает
// «ещё не померили» и показывал ВСЕ кнопки поверх информации. На панели
// пошире ряд сужался до 32–40, и одна «обязательная» кнопка (минимум ряда)
// вместе с «…» всё равно ложилась на «Выбрано».

/** Ряд действий шириной `width`, каждая кнопка — 100. */
function mockActions(width: number) {
  vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockImplementation(function (
    this: HTMLElement
  ) {
    return this.dataset.slot === "button-menu-black-actions" ? width : 0
  })
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(
    () => ({ width: 100, height: 32, top: 0, left: 0, right: 100, bottom: 32 }) as DOMRect
  )
}

const visibleButtons = () =>
  screen
    .getAllByRole("button")
    .map((button) => button.textContent?.trim() || button.getAttribute("aria-label"))

function renderPanel(buttons = ["Подписать", "Скачать"]) {
  return render(
    <ButtonMenuBlack
      info={[
        { label: "Выбрано", value: "3 документа" },
        { label: "Сумма", value: "1 200 101,16 ₽" },
      ]}
      onClose={() => {}}
    >
      {buttons.map((label) => (
        <Button key={label}>{label}</Button>
      ))}
    </ButtonMenuBlack>
  )
}

describe("ButtonMenuBlack на узкой панели", () => {
  afterEach(() => vi.restoreAllMocks())

  it("в ряду шириной 32 видно только «…», все кнопки — в нём", () => {
    mockActions(32)
    renderPanel()
    const visible = visibleButtons()
    expect(visible).toContain("Ещё")
    expect(visible).not.toContain("Подписать")
    expect(visible).not.toContain("Скачать")
  })

  it("у ряда с кнопками есть минимум под «…», а информация сжимается", () => {
    const { container } = renderPanel()
    const actions = container.querySelector('[data-slot="button-menu-black-actions"]')!
    expect(actions.className).toContain("min-w-8")
    const info = container.querySelector('[data-slot="button-menu-black-info"]')!
    // Не поместившиеся колонки уходят на срезанную вторую строку.
    expect(info.className).toEqual(expect.stringContaining("flex-wrap"))
    expect(info.className).toEqual(expect.stringContaining("max-h-10"))
    expect(info.className).toEqual(expect.stringContaining("min-w-0"))
    // Правая группа (информация + крестик) сама тоже сжимается.
    const right = info.parentElement!
    expect(right.className).toContain("min-w-0")
    expect(right.className).not.toContain("shrink-0")
  })

  it("без кнопок ряд место под «…» не держит", () => {
    const { container } = renderPanel([])
    const actions = container.querySelector('[data-slot="button-menu-black-actions"]')!
    expect(actions.className).not.toContain("min-w-8")
    expect(screen.queryByRole("button", { name: "Ещё" })).toBeNull()
  })
})
