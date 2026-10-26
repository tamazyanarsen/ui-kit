import { afterEach, describe, expect, it, vi } from "vitest"
import { act, render, screen } from "@testing-library/react"

import type * as React from "react"

import { Button } from "@/components/ui/button"
import { ViewportScope } from "@/lib/viewport"

import { ButtonMenuBlack } from "./black"

// Правки UI-Kit от 25.10: «ButtonMenuBlack — появление и уход движением» и
// «не больше трёх команд, остальные в „…“».

const desktop = {
  wrapper: ({ children }: { children: React.ReactNode }) => (
    <ViewportScope viewport="desktop">{children}</ViewportScope>
  ),
}

/** Ряд действий шириной 1000, каждая кнопка — 100: места на всё. */
function mockWideRow() {
  vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockImplementation(function (
    this: HTMLElement
  ) {
    return this.dataset.slot === "button-menu-black-actions" ? 1000 : 0
  })
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(
    () => ({ width: 100, height: 32, top: 0, left: 0, right: 100, bottom: 32 }) as DOMRect
  )
}

const LABELS = ["Подписать", "Отправить", "Скачать", "Удалить", "Архив"]

const visibleButtons = () =>
  screen
    .getAllByRole("button")
    .map((button) => button.textContent?.trim() || button.getAttribute("aria-label"))

const panel = () => document.querySelector<HTMLElement>('[data-slot="button-menu-black"]')

afterEach(() => {
  vi.restoreAllMocks()
  vi.useRealTimers()
})

describe("ButtonMenuBlack: не больше трёх команд", () => {
  it("5 команд → видно 3 и «…»", () => {
    mockWideRow()
    render(
      <ButtonMenuBlack showSelectAllPages={false}>
        {LABELS.map((label) => (
          <Button key={label}>{label}</Button>
        ))}
      </ButtonMenuBlack>,
      desktop
    )
    const visible = visibleButtons()
    expect(visible).toEqual(expect.arrayContaining(["Подписать", "Отправить", "Скачать", "Ещё"]))
    expect(visible).not.toContain("Удалить")
    expect(visible).not.toContain("Архив")
  })

  it("3 команды → 3 без «…»", () => {
    mockWideRow()
    render(
      <ButtonMenuBlack showSelectAllPages={false}>
        {LABELS.slice(0, 3).map((label) => (
          <Button key={label}>{label}</Button>
        ))}
      </ButtonMenuBlack>,
      desktop
    )
    expect(visibleButtons()).not.toContain("Ещё")
  })

  it("maxVisible меняет предел", () => {
    mockWideRow()
    render(
      <ButtonMenuBlack showSelectAllPages={false} maxVisible={2}>
        {LABELS.map((label) => (
          <Button key={label}>{label}</Button>
        ))}
      </ButtonMenuBlack>,
      desktop
    )
    const visible = visibleButtons()
    expect(visible).toContain("Отправить")
    expect(visible).not.toContain("Скачать")
  })
})

describe("ButtonMenuBlack: появление и уход", () => {
  it("появляется выездом снизу, класс выезда живёт 320 мс", () => {
    vi.useFakeTimers()
    render(
      <ButtonMenuBlack showSelectAllPages={false}>
        <Button>Подписать</Button>
      </ButtonMenuBlack>,
      desktop
    )
    expect(panel()!.className).toContain("button-menu-black-in_320ms_var(--ease-soft)")
    act(() => void vi.advanceTimersByTime(320))
    expect(panel()!.className).not.toContain("button-menu-black-in")
  })

  it("open={false}: панель ещё 200 мс в разметке, уезжает вниз и держит последний состав", () => {
    vi.useFakeTimers()
    const { rerender } = render(
      <ButtonMenuBlack open showSelectAllPages={false} info={[{ label: "Выбрано", value: "3" }]}>
        <Button>Подписать</Button>
      </ButtonMenuBlack>,
      desktop
    )
    act(() => void vi.advanceTimersByTime(320))
    // Выделение снято: состав пустой, панель закрывается.
    rerender(<ButtonMenuBlack open={false} showSelectAllPages={false} />)
    expect(panel()).not.toBeNull()
    expect(panel()!.className).toContain("button-menu-black-out_200ms_var(--ease-out)")
    expect(screen.getAllByText("Подписать").length).toBeGreaterThan(0)
    expect(screen.getByText("3")).toBeInTheDocument()
    act(() => void vi.advanceTimersByTime(199))
    expect(panel()).not.toBeNull()
    act(() => void vi.advanceTimersByTime(1))
    expect(panel()).toBeNull()
  })

  it("open={false} с первого рендера — панели нет; true — выезжает", () => {
    const { rerender } = render(
      <ButtonMenuBlack open={false} showSelectAllPages={false}>
        <Button>Подписать</Button>
      </ButtonMenuBlack>,
      desktop
    )
    expect(panel()).toBeNull()
    rerender(
      <ButtonMenuBlack open showSelectAllPages={false}>
        <Button>Подписать</Button>
      </ButtonMenuBlack>
    )
    expect(panel()!.className).toContain("button-menu-black-in")
  })

  it("с кнопкой «Выбрать на всех страницах» выезжает весь блок, а не одна панель", () => {
    render(
      <ButtonMenuBlack onSelectAllPages={() => {}}>
        <Button>Подписать</Button>
      </ButtonMenuBlack>,
      desktop
    )
    const block = document.querySelector('[data-slot="button-menu-black-block"]')!
    expect(block.className).toContain("button-menu-black-in")
    expect(panel()!.className).not.toContain("button-menu-black-in")
  })
})
