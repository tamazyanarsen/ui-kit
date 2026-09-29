import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import { Informer } from "./informer"

// r25: `{description && …}` с числом 0 выводил голый «0» без оформления
// (0 ложно, а React рисует число). Теперь 0 — это содержимое в своей обёртке.

describe("Informer с числом 0", () => {
  it("описание 0 рисуется внутри оформленной строки", () => {
    render(<Informer title="Заголовок" description={0} />)
    expect(screen.getByText("0").className).toContain("text-p3-medium")
  })

  it("дата 0 рисуется внутри оформленной строки", () => {
    render(<Informer title="Заголовок" date={0} />)
    expect(screen.getByText("0").className).toContain("text-p3-medium")
  })

  it("пустая строка и false по-прежнему ничего не рисуют", () => {
    const { container } = render(
      <Informer title="Заголовок" description="" date={false} />
    )
    expect(container.querySelectorAll(".text-p3-medium")).toHaveLength(0)
  })
})
