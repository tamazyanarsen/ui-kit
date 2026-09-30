import { describe, expect, it } from "vitest"
import { render } from "@testing-library/react"

import { CardAccount } from "./card-account"

// Аудит r25: окончание номера `0` (`number && …`) рисовалось голым текстом
// без позиции в правом нижнем углу плашки.

describe("CardAccount: окончание 0", () => {
  it("стоит в своём узле в правом нижнем углу", () => {
    const { container } = render(<CardAccount number={0} />)
    const end = container.querySelector('[data-slot="card-account"] > span.text-p4-regular')
    expect(end).toHaveTextContent("0")
    // «в правом нижнем углу» — это `right-[3px]` и `bottom-0` (строка 12 вплотную
    // к низу рамки по мастеру; число измерено сценарием full-content).
    expect(end).toHaveClass("absolute", "right-[3px]", "bottom-0")
  })

  it("пустая строка узел не рисует", () => {
    const { container } = render(<CardAccount number="" />)
    expect(container.querySelector('[data-slot="card-account"] > span.text-p4-regular')).toBeNull()
  })
})
