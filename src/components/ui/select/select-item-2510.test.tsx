// Поповер — десктопная форма: в мобильном виде (уже 1280) список — штора
// (Правки UI-Kit от 25.10).
import "@/test/desktop-viewport"
import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { Select, SelectValue } from "./root"
import { SelectTrigger } from "./trigger"
import { SelectContent } from "./content"
import { SelectItem } from "./item"

// Правки UI-Kit от 25.10: строки списков — общий menu-row, сжатие к центру
// одной обёрткой, текст переносится; шеврон триггера — 200 мс ease-out.

const LONG = "40801 810 7 0024 0011708 · Спецсчёт закупок"

describe("SelectItem: строка списка", () => {
  it("menu-row, одна обёртка с полями и галочкой, без опоры слева", async () => {
    const user = userEvent.setup()
    render(
      <Select items={[{ value: "a", label: LONG }]} defaultValue="a">
        <SelectTrigger label="Счёт">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="a">{LONG}</SelectItem>
        </SelectContent>
      </Select>
    )
    await user.click(screen.getByRole("combobox"))
    const option = await screen.findByRole("option", { name: LONG })
    expect(option).toHaveClass("menu-row", "press-scale-content")
    expect(option.className).not.toContain("--press-origin")
    expect(option.className).not.toContain("cursor-default")
    expect(option.className).not.toMatch(/(^|\s)(data-disabled:)?pointer-events-none/)
    expect(option.children).toHaveLength(1)
    const content = option.firstElementChild as HTMLElement
    expect(content).toHaveAttribute("data-slot", "select-item-content")
    expect(content).toHaveClass("relative", "pl-4", "pr-12", "py-4")

    const text = option.querySelector('[data-slot="clip-text"]')
    expect(text).toHaveTextContent(LONG)
    expect(text).not.toHaveClass("text-ellipsis")
    expect(text).not.toHaveClass("whitespace-nowrap")
    expect(text).toHaveClass("[overflow-wrap:anywhere]")

    // В значении триггера многоточие остаётся.
    const value = document.querySelector('[data-slot="select-value"] [data-slot="clip-text"]')
    expect(value).toHaveClass("text-ellipsis", "whitespace-nowrap")
  })
})

describe("Шеврон триггера: поворот 200 мс ease-out", () => {
  it("Select и Combobox", () => {
    for (const file of ["./trigger.tsx", "../combobox/trigger.tsx"]) {
      const src = readFileSync(resolve(__dirname, file), "utf8")
      expect(src).toMatch(/transition-transform duration-200 ease-out[^"]*rotate-180/)
    }
  })
})
