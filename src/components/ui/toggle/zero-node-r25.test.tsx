import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import { Toggle } from "./toggle"

// Раунд 25, класс «{x && …} с числом 0»: подпись 0 пропадала (без комментария
// компонент отдавал голую дорожку), а комментарий 0 не рисовался и не
// описывал переключатель.

describe("Toggle: числа-узлы", () => {
  it("подпись 0 не пропадает", () => {
    render(<Toggle label={0} />)
    expect(screen.getByText("0")).toBeInTheDocument()
  })

  it("комментарий 0 лежит в своём узле и описывает переключатель", () => {
    render(<Toggle label="Уведомления" comment={0} />)
    const comment = screen.getByText("0")
    expect(comment.id).toMatch(/-comment$/)
    expect(screen.getByRole("switch")).toHaveAttribute("aria-describedby", comment.id)
  })

  it("текст ошибки 0 не теряется", () => {
    render(<Toggle label="Уведомления" error={0} />)
    expect(screen.getByText("0").id).toMatch(/-error$/)
  })
})
