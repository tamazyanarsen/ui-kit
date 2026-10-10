import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { TabHeadings } from "./tab-headings"

const ITEMS = [
  { value: "fav", label: "Избранное" },
  { value: "all", label: "Все разделы" },
  { value: "off", label: "Недоступно", disabled: true },
]

describe("TabHeadings", () => {
  it("первая доступная вкладка выбрана по умолчанию, выбор переключается кликом", () => {
    const onValueChange = vi.fn()
    render(<TabHeadings items={ITEMS} onValueChange={onValueChange} />)
    expect(screen.getByRole("tab", { name: "Избранное" })).toHaveAttribute("aria-selected", "true")
    fireEvent.click(screen.getByRole("tab", { name: "Все разделы" }))
    expect(onValueChange).toHaveBeenCalledWith("all")
    expect(screen.getByRole("tab", { name: "Все разделы" })).toHaveAttribute("aria-selected", "true")
  })

  it("стрелки ходят только по доступным вкладкам", () => {
    render(<TabHeadings items={ITEMS} />)
    const list = screen.getByRole("tablist")
    fireEvent.keyDown(list, { key: "ArrowRight" })
    expect(screen.getByRole("tab", { name: "Все разделы" })).toHaveAttribute("aria-selected", "true")
    fireEvent.keyDown(list, { key: "ArrowRight" })
    expect(screen.getByRole("tab", { name: "Избранное" })).toHaveAttribute("aria-selected", "true")
  })

  it("единственный заголовок активен и не шлёт onValueChange", () => {
    const onValueChange = vi.fn()
    render(<TabHeadings items={[ITEMS[0]]} onValueChange={onValueChange} />)
    const tab = screen.getByRole("tab", { name: "Избранное" })
    expect(tab).toHaveAttribute("aria-selected", "true")
    fireEvent.click(tab)
    expect(onValueChange).not.toHaveBeenCalled()
  })

  it("пустые элементы списка отбрасываются", () => {
    render(<TabHeadings items={[ITEMS[0], null as never, ITEMS[1]]} />)
    expect(screen.getAllByRole("tab")).toHaveLength(2)
  })
})
