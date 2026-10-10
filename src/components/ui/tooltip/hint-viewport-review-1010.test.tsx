import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { ViewportScope } from "@/lib/viewport"

import { Hint } from "./hint"

// Ревью 10.10, КК-5: Hint — шторка Modal на мобильном и поповер на
// десктопе. Неуправляемая открытость жила внутри каждой формы, и смена
// брейкпоинта закрывала открытую подсказку.
describe("Hint: открытость переживает смену формы (ревью 10.10, КК-5)", () => {
  function App({ viewport }: { viewport: "mobile" | "desktop" }) {
    return (
      <ViewportScope viewport={viewport}>
        <Hint content="Комиссия списывается в конце месяца">
          <button type="button">Подробнее</button>
        </Hint>
      </ViewportScope>
    )
  }

  it("открытая на мобильном подсказка остаётся открытой на десктопе", async () => {
    const user = userEvent.setup()
    const { rerender } = render(<App viewport="mobile" />)
    await user.click(screen.getByRole("button", { name: "Подробнее" }))
    expect(document.querySelector('[data-slot="hint-sheet"]')).not.toBeNull()

    rerender(<App viewport="desktop" />)
    expect(await screen.findByText("Комиссия списывается в конце месяца")).toBeInTheDocument()
    expect(document.querySelector('[data-slot="hint-content"]')).not.toBeNull()
  })
})
