import { afterEach, describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen } from "@testing-library/react"

import { Tabs } from "@/components/ui/tabs"
import { Switcher } from "@/components/ui/switcher"

import { ButtonMenuOverflow, ButtonMenuOverflowItem } from "./overflow"

// Аудит r11: список «…» не был ограничен по высоте и не прокручивался. У
// закреплённой нижней панели длинный список раскрывается вверх, и верхние
// пункты уходили за экран — ни мышью, ни колесом до них не добраться.
// Высота должна браться из `--available-height` позиционера, как у Select.

const ITEMS = [
  { value: "a", label: "A" },
  { value: "b", label: "B" },
  { value: "c", label: "C" },
  { value: "d", label: "D" },
]

/** Ряд 300, пункт 100 — с резервом «…» видны два. */
function mockRow(rootSlot: string, itemSlot: string) {
  vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockImplementation(function (
    this: HTMLElement
  ) {
    return this.dataset.slot === rootSlot ? 300 : 0
  })
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (
    this: HTMLElement
  ) {
    const w = this.dataset.slot === itemSlot ? 100 : 0
    return { width: w, height: 40, top: 0, left: 0, right: w, bottom: 40 } as DOMRect
  })
}

async function openedList() {
  fireEvent.click(screen.getByRole("button", { name: "Ещё" }))
  await screen.findAllByRole("menuitem")
  return screen.getByRole("menu")
}

function expectCapped(list: HTMLElement) {
  expect(list).toHaveClass("max-h-(--available-height)")
  expect(list).toHaveClass("overflow-y-auto")
  expect(list).not.toHaveClass("overflow-hidden")
  // Полоса прокрутки — кита, как у Select, а не системная.
  expect(list).toHaveClass("themed-scrollbar")
}

describe("Список «…»: высота ограничена местом до края окна", () => {
  afterEach(() => vi.restoreAllMocks())

  it("ButtonMenuOverflow", async () => {
    render(
      <ButtonMenuOverflow>
        <ButtonMenuOverflowItem text="Первая" />
        <ButtonMenuOverflowItem text="Вторая" />
      </ButtonMenuOverflow>
    )
    expectCapped(await openedList())
  })

  it("Tabs", async () => {
    mockRow("tabs", "tabs-item")
    render(<Tabs items={ITEMS} defaultValue="a" showMore={false} />)
    expectCapped(await openedList())
  })

  it("Switcher", async () => {
    mockRow("switcher", "switcher-item")
    render(<Switcher items={ITEMS} defaultValue="a" />)
    expectCapped(await openedList())
  })
})
