import { afterEach, describe, expect, it, vi } from "vitest"
import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { Tabs } from "./tabs"

// Второй раунд аудита: стрелки из списка «Ещё», выключенная активная
// вкладка, состав `tablist` и мерная копия.

const SIX = ["a", "b", "c", "d", "e", "f"].map((value) => ({
  value,
  label: `Tab ${value}`,
}))

/** Ряд шириной 250, каждая вкладка 100 — помещается одна, остальное в «Ещё». */
function mockNarrowRow() {
  vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockImplementation(function (
    this: HTMLElement
  ) {
    return this.dataset.slot === "tabs" ? 250 : 0
  })
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (
    this: HTMLElement
  ) {
    const width = this.dataset.slot === "tabs-item" ? 100 : 0
    return { width, height: 44, top: 0, left: 0, right: width, bottom: 44 } as DOMRect
  })
}

describe("Tabs: второй раунд", () => {
  afterEach(() => vi.restoreAllMocks())

  it("стрелки в выпадающем списке «Ещё» не переключают вкладки", async () => {
    mockNarrowRow()
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(<Tabs items={SIX} onValueChange={onValueChange} />)
    expect(screen.getAllByRole("tab")).toHaveLength(1)

    await user.click(screen.getByRole("button", { name: "Ещё" }))
    // Ждать именно пункт меню: «Tab c» есть и в закадровой мерной копии
    // ряда (aria-hidden), и `findByText` то хватал её раньше, чем меню
    // открылось, то падал на двух совпадениях — тест мигал под нагрузкой.
    await screen.findByRole("menuitem", { name: "Tab c" })
    // Фокус — на пункте списка, как после навигации стрелками по меню.
    await user.keyboard("{ArrowDown}")
    await user.keyboard("{ArrowRight}")
    await user.keyboard("{ArrowLeft}")

    expect(onValueChange).not.toHaveBeenCalled()
  })

  it("выключенная активная вкладка не вычёркивает ленту из обхода по Tab", async () => {
    const user = userEvent.setup()
    render(
      <Tabs
        items={[
          { value: "a", label: "Альфа", disabled: true },
          { value: "b", label: "Бета" },
          { value: "c", label: "Гамма" },
        ]}
        defaultValue="a"
        showMore={false}
      />
    )
    expect(screen.getByRole("tab", { name: "Бета" })).toHaveAttribute("tabindex", "0")
    await user.tab()
    expect(screen.getByRole("tab", { name: "Бета" })).toHaveFocus()
    await user.keyboard("{ArrowLeft}")
    // Выключенная «Альфа» пропускается — по кругу на «Гамму».
    expect(screen.getByRole("tab", { name: "Гамма" })).toHaveFocus()
  })

  it("в tablist лежат только вкладки: триггер «Ещё» стоит рядом", () => {
    render(<Tabs items={SIX.slice(0, 3)} />)
    const list = screen.getByRole("tablist")
    const children = Array.from(list.children).filter(
      (child) => child.getAttribute("aria-hidden") !== "true"
    )
    expect(children.every((child) => child.getAttribute("role") === "tab")).toBe(true)
    expect(within(list).queryByRole("button", { name: "Ещё" })).not.toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Ещё" })).toBeInTheDocument()
  })

  it("мерная копия лежит в обрезающей обёртке и не раздвигает страницу", () => {
    const { container } = render(<Tabs items={SIX} />)
    const copy = Array.from(
      container.querySelectorAll<HTMLElement>('[data-slot="tabs-item"]')
    ).find((el) => !el.getAttribute("role"))
    expect(copy?.closest(".overflow-hidden.inset-0")).not.toBeNull()
  })
})
