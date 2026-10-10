import { describe, expect, it } from "vitest"
import { render } from "@testing-library/react"

import { FilterShell } from "./shell"
import { FilterTableSelect } from "./filter-table-select"

// Ревью 10.10, п. 10: правка «пилюля сжимается до узкой колонки» жила только
// в обёртке `FilterTableSelect`, а `FilterShell` (FilterSelect, FilterRange,
// FilterDate) остался на блочном `w-fit` — его чип вылезал из колонки.
// jsdom раскладку не считает, поэтому сверяется сама обёртка: у обоих
// триггеров она обязана быть одинаковой.
describe("FilterShell: обёртка пилюли (ревью 10.10, п. 10)", () => {
  it("совпадает с обёрткой FilterTableSelect", () => {
    const shell = render(
      <FilterShell label="Статус" open={false} onOpenChange={() => {}} />
    ).container.firstElementChild as HTMLElement
    const select = render(
      <FilterTableSelect label="Статус" />
    ).container.firstElementChild as HTMLElement

    expect(shell.className).toBe(select.className)
    expect(shell.className.split(" ")).toEqual(
      expect.arrayContaining(["flex", "max-w-full", "min-w-0"])
    )
  })

  // КК-2: триггер фильтра теперь один. Правило триггера «минимальная
  // ширина — 80 px» жило только в FilterShell и до FilterTableSelect не
  // доходило.
  it("пилюля FilterTableSelect — та же, что у FilterShell, с минимумом 80", () => {
    const { container } = render(<FilterTableSelect label="Номер" />)
    const pill = container.querySelector('[data-slot="filter"]')!
    expect(pill.className.split(" ")).toContain("min-w-20")
    expect(pill).toHaveAttribute("data-type", "select")
  })

  it("тип text — без шеврона, counter — с плашкой и без шеврона", () => {
    const text = render(<FilterTableSelect label="ИНН" type="text" />).container
    expect(text.querySelector("svg")).toBeNull()
    const counter = render(<FilterTableSelect label="Счета" type="counter" count={3} />).container
    expect(counter.querySelector('[data-slot="badge"]')).toHaveTextContent("3")
    expect(counter.querySelectorAll("svg")).toHaveLength(0)
  })
})
