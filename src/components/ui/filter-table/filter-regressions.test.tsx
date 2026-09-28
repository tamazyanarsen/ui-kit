import * as React from "react"
import { describe, expect, it } from "vitest"
import { act, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { FilterBoolean } from "./filter-boolean"
import { FilterRange } from "./filter-range"
import { FilterSelect } from "./filter-select"
import { FilterTableSelect } from "./filter-table-select"

// Регрессии аудита: черновик фильтра, отключение открытого фильтра, ref.

const OPTIONS = [
  { value: "a", label: "Исполнен" },
  { value: "b", label: "Черновик" },
]

/** Родитель, который перерисовывается по команде и каждый раз отдаёт
 * фильтру НОВЫЙ массив или объект в `value` — обычный управляемый режим. */
function useTick() {
  const [, setTick] = React.useState(0)
  return () => act(() => setTick((tick) => tick + 1))
}

describe("черновик фильтра переживает перерисовку родителя", () => {
  it("FilterSelect: отмеченная галочка не сбрасывается", async () => {
    const user = userEvent.setup()
    let rerenderParent = () => {}
    function Parent() {
      rerenderParent = useTick()
      return <FilterSelect label="Статус" options={OPTIONS} value={[]} />
    }
    render(<Parent />)

    await user.click(screen.getByText("Статус"))
    await user.click(screen.getAllByRole("checkbox")[0])
    rerenderParent()

    expect(screen.getAllByRole("checkbox")[0]).toHaveAttribute("aria-checked", "true")
  })

  it("FilterRange: введённое «от» не стирается", async () => {
    const user = userEvent.setup()
    let rerenderParent = () => {}
    function Parent() {
      rerenderParent = useTick()
      return <FilterRange label="Сумма" value={{ from: "", to: "" }} />
    }
    render(<Parent />)

    await user.click(screen.getByText("Сумма"))
    const [from] = screen.getAllByRole("textbox")
    await user.type(from, "100")
    rerenderParent()

    expect(screen.getAllByRole("textbox")[0]).toHaveValue("100")
  })
})

describe("отключение открытого фильтра", () => {
  it("FilterSelect не открывается сам после включения", async () => {
    const user = userEvent.setup()
    const { rerender } = render(<FilterSelect label="Статус" options={OPTIONS} />)
    await user.click(screen.getByText("Статус"))
    expect(document.querySelector('[data-slot="filter-content"]')).not.toBeNull()

    rerender(<FilterSelect label="Статус" options={OPTIONS} disabled />)
    rerender(<FilterSelect label="Статус" options={OPTIONS} />)

    expect(document.querySelector('[data-slot="filter-content"]')).toBeNull()
  })

  it("FilterTableSelect не открывается сам после включения", async () => {
    const user = userEvent.setup()
    const { rerender } = render(<FilterTableSelect label="Номер" />)
    await user.click(screen.getByText("Номер"))
    expect(document.querySelector('[data-slot="filter-content"]')).not.toBeNull()

    rerender(<FilterTableSelect label="Номер" disabled />)
    rerender(<FilterTableSelect label="Номер" />)

    expect(document.querySelector('[data-slot="filter-content"]')).toBeNull()
  })
})

describe("FilterBoolean", () => {
  it("отдаёт ref на кнопку", () => {
    const ref = React.createRef<HTMLButtonElement>()
    render(<FilterBoolean ref={ref} label="Ненулевой баланс" />)
    expect(ref.current?.tagName).toBe("BUTTON")
  })
})
