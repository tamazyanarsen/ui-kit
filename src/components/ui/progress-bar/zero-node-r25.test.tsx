import { describe, expect, it } from "vitest"
import { render } from "@testing-library/react"

import { ProgressBar } from "./progress-bar"

// Раунд 25, класс «{x && …} с числом 0». Описание в строке заголовка с 0
// выводилось голым текстом мимо обёртки с многоточием, а подзаголовок и
// описание статуса с 0 пропадали вовсе: `Boolean(0)` считал ноль пустотой.

describe("ProgressBar: числа-узлы", () => {
  it("описание 0 стоит в своей обёртке с многоточием", () => {
    const { container } = render(<ProgressBar title="Загрузка" description={0} />)
    const description = container.querySelector(".truncate")
    expect(description?.textContent).toBe("0")
  })

  it("подзаголовок 0 не пропадает", () => {
    const { container } = render(<ProgressBar title="Загрузка" subtitle={0} />)
    expect(container.textContent).toContain("0")
    expect(container.querySelectorAll("span.break-words").length).toBe(2)
  })

  it("описание статуса 0 не пропадает", () => {
    const { container } = render(<ProgressBar title="Загрузка" statusDescription={0} />)
    expect(container.querySelector(".truncate")?.textContent).toBe("0")
  })

  it("пустые узлы по-прежнему ничего не рисуют", () => {
    const { container } = render(
      <ProgressBar title="Загрузка" description="" subtitle={null} statusDescription={false} />
    )
    expect(container.querySelector(".truncate")).toBeNull()
    expect(container.querySelectorAll("span.break-words").length).toBe(1)
  })
})
