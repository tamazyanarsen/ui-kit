import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"

import { Switcher } from "@/components/ui/switcher"

import { Tabs } from "./tabs"

// Аудит 16: откат неуправляемого значения на первый пункт жил только в
// отрисовке. `onValueChange` не вызывался — потребитель показывал раздел
// пропавшего пункта под выбранной первой вкладкой, а когда пункт
// возвращали, выбор сам прыгал обратно, хотя пользователь ничего не нажимал.

const ABC = [
  { value: "a", label: "A" },
  { value: "b", label: "B" },
  { value: "c", label: "C" },
]
const AB = ABC.slice(0, 2)

const selectedTab = () =>
  screen.queryAllByRole("tab").find((tab) => tab.getAttribute("aria-selected") === "true")
    ?.textContent

const pressedSegment = () =>
  screen
    .queryAllByRole("button")
    .find((button) => button.getAttribute("aria-pressed") === "true")?.textContent

describe("Tabs: откат неуправляемого значения фиксируется", () => {
  it("пункт пропал — onValueChange(первый) один раз; вернулся — выбор не прыгает", () => {
    const onValueChange = vi.fn()
    const { rerender } = render(
      <Tabs items={ABC} defaultValue="c" onValueChange={onValueChange} />
    )
    rerender(<Tabs items={AB} defaultValue="c" onValueChange={onValueChange} />)
    expect(onValueChange).toHaveBeenCalledTimes(1)
    expect(onValueChange).toHaveBeenCalledWith("a")
    expect(selectedTab()).toBe("A")

    rerender(<Tabs items={ABC} defaultValue="c" onValueChange={onValueChange} />)
    expect(selectedTab()).toBe("A")
    expect(onValueChange).toHaveBeenCalledTimes(1)
  })

  it("управляемое значение наружу само не сообщается", () => {
    const onValueChange = vi.fn()
    const { rerender } = render(<Tabs items={ABC} value="c" onValueChange={onValueChange} />)
    rerender(<Tabs items={AB} value="c" onValueChange={onValueChange} />)
    expect(onValueChange).not.toHaveBeenCalled()
  })

  it("пока пунктов нет, значение ждёт их, а не откатывается", () => {
    const onValueChange = vi.fn()
    const { rerender } = render(<Tabs items={[]} defaultValue="c" onValueChange={onValueChange} />)
    rerender(<Tabs items={ABC} defaultValue="c" onValueChange={onValueChange} />)
    expect(onValueChange).not.toHaveBeenCalled()
    expect(selectedTab()).toBe("C")
  })
})

// Проверка правок r17: метка «откат уже сообщён» не снималась, и повторное
// удаление того же пункта (вернули, пользователь выбрал его, убрали снова)
// не откатывалось — выбор снова расходился с данными.
describe("Tabs: повторное удаление того же пункта", () => {
  it("снова откатывается и сообщается", async () => {
    const onValueChange = vi.fn()
    const { rerender } = render(
      <Tabs items={ABC} defaultValue="c" onValueChange={onValueChange} />
    )
    rerender(<Tabs items={AB} defaultValue="c" onValueChange={onValueChange} />)
    rerender(<Tabs items={ABC} defaultValue="c" onValueChange={onValueChange} />)
    screen.getByRole("tab", { name: "C" }).click()
    await Promise.resolve()
    expect(selectedTab()).toBe("C")
    onValueChange.mockClear()

    rerender(<Tabs items={AB} defaultValue="c" onValueChange={onValueChange} />)
    expect(onValueChange).toHaveBeenCalledWith("a")
    expect(selectedTab()).toBe("A")

    rerender(<Tabs items={ABC} defaultValue="c" onValueChange={onValueChange} />)
    expect(selectedTab()).toBe("A")
  })
})

describe("Switcher: откат неуправляемого значения фиксируется", () => {
  it("пункт пропал — onValueChange(первый) один раз; вернулся — выбор не прыгает", () => {
    const onValueChange = vi.fn()
    const { rerender } = render(
      <Switcher items={ABC} defaultValue="c" onValueChange={onValueChange} />
    )
    rerender(<Switcher items={AB} defaultValue="c" onValueChange={onValueChange} />)
    expect(onValueChange).toHaveBeenCalledTimes(1)
    expect(onValueChange).toHaveBeenCalledWith("a")

    rerender(<Switcher items={ABC} defaultValue="c" onValueChange={onValueChange} />)
    expect(pressedSegment()).toBe("A")
    expect(onValueChange).toHaveBeenCalledTimes(1)
  })
})
