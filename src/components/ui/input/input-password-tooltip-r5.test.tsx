import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { Input } from "./input"

// Итоговая проверка №4: подсказка «значение не помещается» показывала
// `el.value` как есть — длинный пароль всплывал открытым текстом при
// наведении. Секретное значение полным текстом не показывается никогда.

const SECRET = "SuperSecretPassword-123456789"

describe("Input: подсказка по наведению и пароль", () => {
  beforeEach(() => {
    // Десктоп: подсказка «не помещается» есть только там.
    vi.spyOn(window, "matchMedia").mockImplementation(
      (query: string) =>
        ({
          matches: true,
          media: query,
          onchange: null,
          addEventListener: () => {},
          removeEventListener: () => {},
          addListener: () => {},
          removeListener: () => {},
          dispatchEvent: () => false,
        }) as MediaQueryList
    )
    // Значение шире коробки.
    vi.spyOn(HTMLElement.prototype, "scrollWidth", "get").mockReturnValue(500)
    vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockReturnValue(100)
  })
  afterEach(() => vi.restoreAllMocks())

  it("обычное длинное значение по-прежнему видно в подсказке", async () => {
    const user = userEvent.setup()
    render(<Input label="Имя" defaultValue={SECRET} />)
    await user.hover(screen.getByRole("textbox"))
    expect(await screen.findByText(SECRET)).toBeInTheDocument()
  })

  it("пароль не показывается в подсказке", async () => {
    const user = userEvent.setup()
    const { container } = render(<Input label="Пароль" type="password" defaultValue={SECRET} />)
    const field = container.querySelector("input")!
    await user.hover(field)
    await new Promise((resolve) => setTimeout(resolve, 700))
    expect(screen.queryByText(SECRET)).not.toBeInTheDocument()
  })
})
