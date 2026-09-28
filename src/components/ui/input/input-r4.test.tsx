import { describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen, act } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { Input } from "./input"

// Итоговая проверка №3, формы.

/** Вырезание со всем выделенным: так Ctrl+X приходит в поле. */
function cutAll(field: HTMLInputElement) {
  field.setSelectionRange(0, field.value.length)
  const data = new Map<string, string>()
  fireEvent.cut(field, {
    clipboardData: {
      setData: (type: string, text: string) => data.set(type, text),
      getData: (type: string) => data.get(type) ?? "",
    },
  })
  return data
}

describe("Input: вырезание в поле, которое править нельзя", () => {
  it("заблокированное поле с маской не теряет значение и не зовёт onChange", () => {
    const onChange = vi.fn()
    render(<Input label="Сумма" mask="amount" locked defaultValue="1000000" onChange={onChange} />)
    const field = screen.getByLabelText("Сумма") as HTMLInputElement
    const before = field.value

    const clipboard = cutAll(field)

    expect(field.value).toBe(before)
    expect(onChange).not.toHaveBeenCalled()
    // Копирование при этом работает — без разрядных пробелов.
    expect(clipboard.get("text/plain")).toBe("1000000")
  })

  it("выключенное поле с маской не теряет значение и не зовёт onChange", () => {
    const onChange = vi.fn()
    render(<Input label="Сумма" mask="amount" disabled defaultValue="1000000" onChange={onChange} />)
    const field = screen.getByLabelText("Сумма") as HTMLInputElement
    const before = field.value

    cutAll(field)

    expect(field.value).toBe(before)
    expect(onChange).not.toHaveBeenCalled()
  })
})

describe("Input: поле только для чтения от потребителя", () => {
  it("не показывает крестик очистки", () => {
    render(<Input label="Имя" readOnly value="abc" onChange={() => {}} />)
    expect(screen.queryByRole("button", { name: "Очистить поле" })).toBeNull()
  })

  it("маскированное поле тоже без крестика и остаётся readOnly", () => {
    render(<Input label="Телефон" mask="phone" readOnly value="+7 912 345-67-89" onChange={() => {}} />)
    expect(screen.queryByRole("button", { name: "Очистить поле" })).toBeNull()
    expect(screen.getByLabelText("Телефон")).toHaveAttribute("readonly")
  })
})

describe("Input: тип маскированного поля", () => {
  it('type="tel" доезжает до поля с маской', () => {
    render(<Input label="Телефон" mask="phone" type="tel" />)
    expect(screen.getByLabelText("Телефон")).toHaveAttribute("type", "tel")
  })

  it("тип, на котором маска не работает, не передаётся", () => {
    render(<Input label="Сумма" mask="amount" type="number" />)
    expect(screen.getByLabelText("Сумма")).not.toHaveAttribute("type", "number")
  })
})

describe("Input: нативный сброс формы", () => {
  it("после form.reset() маска начинает с пустого поля", async () => {
    const user = userEvent.setup()
    render(
      <form data-testid="form">
        <Input label="Телефон" mask="phone" name="phone" />
      </form>
    )
    const field = screen.getByLabelText("Телефон") as HTMLInputElement
    await user.type(field, "912345")
    expect(field.value).not.toBe("")

    act(() => {
      ;(screen.getByTestId("form") as HTMLFormElement).reset()
    })
    // Маска подхватывает сброс в следующей задаче.
    await act(() => new Promise((resolve) => setTimeout(resolve, 0)))
    expect(field.value).toBe("")

    // Маска должна знать о сбросе: иначе imask на следующем нажатии клавиши
    // обнаруживает, что значение поменяли «в обход маски», и продолжает
    // старую строку. Это его собственный сигнал рассинхронизации.
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {})
    fireEvent.keyDown(field, { key: "8" })
    expect(warn.mock.calls.flat().join(" ")).not.toMatch(/changed outside of mask/)
    warn.mockRestore()

    // Ввод «8» — как его делает браузер: значение в узел и событие `input`.
    // Не `user.type`: user-event помнит введённое им самим и программного
    // сброса формы не видит, дописывая к старой строке.
    const setNative = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")!.set!
    act(() => {
      setNative.call(field, "8")
      field.setSelectionRange(1, 1)
      fireEvent.input(field)
    })
    expect(field.value).toBe("+7 8")
  })
})
