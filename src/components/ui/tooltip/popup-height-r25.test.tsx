import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { ViewportScope } from "@/lib/viewport"

import { Hint } from "./hint"
import { Tooltip } from "./tooltip"

// Раунд 25, класс «попап без max-h-(--available-height)». Десктопный Hint
// с длинным текстом на низком окне вырастал выше экрана (живой Chrome:
// окно 500px — попап 1008px, низ на 1013), потому что попап не имел потолка
// высоты. Прокрутку берёт колонка текста, а не сам попап: стрелка стоит
// снаружи его рамки, и `overflow` на попапе срезал бы её.

const CEILING = "max-h-[calc(var(--available-height)-1.5rem)]"

describe("Hint и Tooltip: потолок высоты", () => {
  it("колонка текста Hint не выше доступного места и прокручивается", () => {
    render(
      <ViewportScope viewport="desktop">
        <Hint content="Длинный текст" defaultOpen>
          <button type="button">?</button>
        </Hint>
      </ViewportScope>
    )
    const column = screen.getByText("Длинный текст").parentElement as HTMLElement
    expect(column.className).toContain(CEILING)
    expect(column).toHaveClass("overflow-y-auto")
    // Стрелка вне колонки — прокрутка её не срезает.
    expect(document.querySelector("[data-slot=hint-content]")).not.toHaveClass("overflow-y-auto")
  })

  it("колонка текста Tooltip — то же", async () => {
    const user = userEvent.setup()
    render(
      <Tooltip content="Длинный текст">
        <button type="button">Наведите</button>
      </Tooltip>
    )
    await user.hover(screen.getByRole("button", { name: "Наведите" }))
    const column = (await screen.findByText("Длинный текст")).parentElement as HTMLElement
    expect(column.className).toContain(CEILING)
    expect(column).toHaveClass("overflow-y-auto")
  })
})
