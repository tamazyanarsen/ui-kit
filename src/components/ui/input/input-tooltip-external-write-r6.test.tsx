import { act } from "react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { Input } from "./input"

// Итоговая проверка №5: подсказка «значение не помещается» замерялась только
// по событию input и по смене пропсов. Запись `el.value = …` снаружи
// (react-hook-form: `setValue`, `reset`) и нативный `form.reset()` замер не
// повторяли — очищенное поле показывало прежнее значение, а длинное
// записанное значение оставалось без подсказки.

const LONG = "Очень длинное значение, которое не помещается в поле"

describe("Input: подсказка после записи значения снаружи", () => {
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
    // Ширина текста — 10px на символ, коробка 100px.
    vi.spyOn(HTMLElement.prototype, "scrollWidth", "get").mockImplementation(function (
      this: HTMLElement
    ) {
      return this instanceof HTMLInputElement ? this.value.length * 10 : 0
    })
    vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockReturnValue(100)
  })
  afterEach(() => vi.restoreAllMocks())

  it("очищенное через ref поле не показывает прежнее значение", async () => {
    const user = userEvent.setup()
    render(<Input label="Имя" defaultValue={LONG} />)
    const field = screen.getByRole("textbox") as HTMLInputElement
    act(() => {
      field.value = ""
    })
    await user.hover(field)
    await new Promise((resolve) => setTimeout(resolve, 700))
    expect(screen.queryByText(LONG)).not.toBeInTheDocument()
  })

  it("длинное значение, записанное через ref, видно в подсказке", async () => {
    const user = userEvent.setup()
    render(<Input label="Имя" />)
    const field = screen.getByRole("textbox") as HTMLInputElement
    act(() => {
      field.value = LONG
    })
    await user.hover(field)
    expect(await screen.findByText(LONG)).toBeInTheDocument()
  })

  it("после form.reset() подсказка не показывает стёртое значение", async () => {
    const user = userEvent.setup()
    const { container } = render(
      <form>
        <Input label="Имя" />
      </form>
    )
    const field = screen.getByRole("textbox") as HTMLInputElement
    await user.type(field, LONG)
    // Контроль: до сброса длинное значение в подсказке видно.
    await user.unhover(field)
    await user.hover(field)
    expect(await screen.findByText(LONG)).toBeInTheDocument()
    await user.unhover(field)
    await waitFor(() => expect(screen.queryByText(LONG)).not.toBeInTheDocument())

    await act(async () => {
      container.querySelector("form")!.reset()
      await new Promise((resolve) => setTimeout(resolve, 0))
    })
    expect(field.value).toBe("")
    await user.hover(field)
    await new Promise((resolve) => setTimeout(resolve, 700))
    expect(screen.queryByText(LONG)).not.toBeInTheDocument()
  })
})
