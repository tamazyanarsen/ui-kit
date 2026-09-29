import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import { Radio } from "./radio"

// Раунд 25, класс «{x && …} с числом 0»: подпись 0 пропадала (без подписи
// рисовался голый кружок), комментарий 0 не рисовался вовсе.

describe("Radio: числа-узлы", () => {
  it("подпись 0 не пропадает", () => {
    render(<Radio value="a" label={0} />)
    expect(screen.getByText("0")).toBeInTheDocument()
  })

  it("комментарий 0 виден и описывает переключатель", () => {
    render(<Radio value="a" label="Опция" comment={0} />)
    const comment = screen.getByText("0")
    expect(screen.getByRole("radio")).toHaveAttribute("aria-describedby", comment.id)
  })
})
