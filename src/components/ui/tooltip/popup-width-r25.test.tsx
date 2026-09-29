import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { TOOLTIP_WIDTH } from "./variants"
import { Tooltip } from "./tooltip"

// Раунд 25, класс «попап без max-w». Режим `auto` держал потолок 592px без
// оглядки на окно: живой Chrome на 375, подсказка с длинным текстом
// выезжала за правый край на 5px и давала странице горизонтальную прокрутку
// (ширина 375 при доступных 365). Потолок обязан быть `min(592px,
// --available-width)`; переменную выставляет позиционер Base UI.

describe("Tooltip: ширина режима auto", () => {
  it("потолок не больше доступной ширины окна", () => {
    expect(TOOLTIP_WIDTH.auto).toBe("max-w-[min(592px,var(--available-width))]")
  })

  it("попап Tooltip width=auto несёт этот потолок", async () => {
    const user = userEvent.setup()
    render(
      <Tooltip content="Длинный текст" width="auto">
        <button type="button">Наведите</button>
      </Tooltip>
    )
    await user.hover(screen.getByRole("button", { name: "Наведите" }))
    const popup = (await screen.findByText("Длинный текст")).closest("[data-slot=tooltip-content]")
    expect(popup?.className).toContain("max-w-[min(592px,var(--available-width))]")
  })
})
