import { describe, expect, it } from "vitest"
import { render } from "@testing-library/react"

import { TableTopDetails } from "./table-top"

// Раунд 25, класс «.map по массиву без отбрасывания пустых»: пары сводки
// собирают условно — `[cond && pair, pair]` — и `false` в списке ронял ленту.
// Разделитель ставится между рисуемыми парами, а не по индексу исходного
// списка: пропущенный первый элемент не должен оставлять его перед первой парой.

describe("TableTopDetails: пустые элементы списка", () => {
  it("false и null пропускаются, разделитель только между парами", () => {
    const items = [
      false,
      { label: "Договоров", value: "5" },
      null,
      { label: "Сумма", value: "10" },
    ] as unknown as { label: string; value: string }[]
    const { container } = render(<TableTopDetails items={items} />)

    const pairs = container.querySelectorAll("[data-slot=table-top-details-item]")
    expect(pairs).toHaveLength(2)
    expect(pairs[0].querySelector("[aria-hidden=true]")).toBeNull()
    expect(pairs[1].querySelector("[aria-hidden=true]")).not.toBeNull()
  })
})
