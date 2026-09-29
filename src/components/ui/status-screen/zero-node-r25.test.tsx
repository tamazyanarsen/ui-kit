import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import { StatusScreen } from "./status-screen"

// Раунд 25, класс «{x && …} с числом 0»: подзаголовок 0 пропадал
// (`Boolean(0)`), подпись кнопки 0 не рисовала кнопку.

describe("StatusScreen: числа-узлы", () => {
  it("подзаголовок 0 рисуется абзацем", () => {
    const { container } = render(<StatusScreen title="Готово" subtitle={0} />)
    expect(container.querySelector("p")?.textContent).toBe("0")
  })

  it("подпись кнопки 0 рисует кнопку", () => {
    render(<StatusScreen title="Готово" primaryButtonLabel={0} />)
    expect(screen.getByRole("button", { name: "0" })).toBeInTheDocument()
  })
})
