import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"

import { Banner } from "./banner"

describe("Banner compact: массив строк", () => {
  it("раскладывает строки отдельными абзацами, без предупреждения о ключах", () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {})
    render(<Banner size="compact" title="Новое" description={["Первая", "Вторая"]} />)
    expect(screen.getByText("Первая").tagName).toBe("P")
    expect(screen.getByText("Вторая").tagName).toBe("P")
    expect(screen.getByText("Первая")).not.toBe(screen.getByText("Вторая"))
    expect(error).not.toHaveBeenCalled()
    error.mockRestore()
  })
})
