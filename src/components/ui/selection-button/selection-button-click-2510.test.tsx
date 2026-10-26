import "@/test/desktop-viewport"
import { describe, expect, it } from "vitest"
import { act, fireEvent, render, screen } from "@testing-library/react"

import { NotificationMenu } from "@/components/ui/header/notification-menu"
import { SelectionButton } from "./selection-button"

// Правки UI-Kit от 25.10, «Menu раскрывается на нажатии, а не на клике»:
// триггеры меню открывают список по клику (после отпускания), а не на
// `mousedown`; повторный клик закрывает, другое открытое меню закрывается.

const ITEMS = [{ id: "a", text: "Скачать" }, { id: "b", text: "Удалить" }]

async function pressDown(el: HTMLElement) {
  await act(async () => {
    fireEvent.pointerDown(el, { button: 0, pointerType: "mouse" })
    fireEvent.mouseDown(el, { button: 0 })
    await new Promise((r) => requestAnimationFrame(() => r(null)))
  })
}

async function release(el: HTMLElement) {
  await act(async () => {
    fireEvent.pointerUp(el, { button: 0, pointerType: "mouse" })
    fireEvent.mouseUp(el, { button: 0 })
    fireEvent.click(el, { button: 0, detail: 1 })
    await new Promise((r) => requestAnimationFrame(() => r(null)))
  })
}

describe("SelectionButton: меню по клику", () => {
  it("pointerdown + mousedown не открывают, click открывает, повторный click закрывает", async () => {
    render(<SelectionButton items={ITEMS} />)
    const trigger = screen.getByRole("button", { name: "Ещё" })

    await pressDown(trigger)
    expect(trigger).toHaveAttribute("aria-expanded", "false")
    // Пока кнопка зажата, триггер помечен нажатым — сжатие работает.
    expect(trigger).toHaveAttribute("data-pressing")

    await release(trigger)
    expect(trigger).toHaveAttribute("aria-expanded", "true")
    expect(trigger).not.toHaveAttribute("data-pressing")

    await pressDown(trigger)
    expect(trigger).toHaveAttribute("aria-expanded", "true")
    await release(trigger)
    expect(trigger).toHaveAttribute("aria-expanded", "false")
  })

  it("нажатие на другой триггер закрывает открытое меню и открывает своё по клику", async () => {
    render(
      <>
        <SelectionButton items={ITEMS} triggerLabel="Первое" />
        <SelectionButton items={ITEMS} triggerLabel="Второе" />
      </>
    )
    const first = screen.getByRole("button", { name: "Первое" })
    const second = screen.getByRole("button", { name: "Второе" })

    await pressDown(first)
    await release(first)
    expect(first).toHaveAttribute("aria-expanded", "true")

    await pressDown(second)
    expect(first).toHaveAttribute("aria-expanded", "false")
    expect(second).toHaveAttribute("aria-expanded", "false")
    await release(second)
    expect(second).toHaveAttribute("aria-expanded", "true")
  })
})

describe("Меню шапки (уведомления): по клику", () => {
  it("pointerdown + mousedown не открывают, click открывает", async () => {
    render(
      <NotificationMenu
        items={[
          {
            id: "1",
            title: "Платёж исполнен",
            org: "ООО «Ромашка»",
            timestamp: "10:00",
            description: "Платёж № 15",
          },
        ]}
      />
    )
    const trigger = screen.getByRole("button", { name: "Уведомления" })
    await pressDown(trigger)
    expect(trigger).toHaveAttribute("aria-expanded", "false")
    await release(trigger)
    expect(trigger).toHaveAttribute("aria-expanded", "true")
  })
})
