import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { ViewportScope } from "@/lib/viewport"

import { Hint } from "./hint"
import { Tooltip } from "./tooltip"

// Раунд 25, класс «{x && …} с числом 0»: заголовок 0 выводился голым текстом
// мимо жирной строки заголовка.

describe("Tooltip и Hint: заголовок-число", () => {
  it("Hint: 0 — это заголовок", () => {
    render(
      <ViewportScope viewport="desktop">
        <Hint title={0} content="Текст" defaultOpen>
          <button type="button">?</button>
        </Hint>
      </ViewportScope>
    )
    expect(screen.getByText("0")).toHaveClass("font-medium")
  })

  it("Tooltip: 0 — это заголовок", async () => {
    const user = userEvent.setup()
    render(
      <Tooltip title={0} content="Текст">
        <button type="button">Наведите</button>
      </Tooltip>
    )
    await user.hover(screen.getByRole("button", { name: "Наведите" }))
    expect(await screen.findByText("0")).toHaveClass("font-medium")
  })
})
