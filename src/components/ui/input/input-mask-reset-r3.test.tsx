import * as React from "react"
import { describe, expect, it } from "vitest"
import { act, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { Input } from "./input"

// Итоговая проверка №2: поле с маской под `register()` отвязывалось от
// формы после `reset()`. react-imask вызывает `inputRef` только при
// создании, а react-hook-form после `reset` очищает реестр полей и ждёт,
// что новый ref-колбэк с очередного рендера будет вызван заново.
//
// Сам react-hook-form в зависимостях кита не стоит, поэтому здесь его
// поведение воспроизведено по существу (сверено с настоящим RHF 7):
// новый ref на каждом рендере, запись значения в узел из ref, `reset`
// очищает реестр и перерисовывает форму.

type Api = {
  getValue: () => string | undefined
  reset: (value: string) => void
  setValue: (value: string) => void
}

function FakeForm({ onApi }: { onApi: (api: Api) => void }) {
  const fields = React.useRef<Record<string, HTMLInputElement | undefined>>({})
  const values = React.useRef<Record<string, string | undefined>>({ sum: "" })
  const [, rerender] = React.useState(0)

  onApi({
    getValue: () => values.current.sum,
    reset: (value) => {
      fields.current = {}
      values.current = { sum: value }
      rerender((n) => n + 1)
    },
    setValue: (value) => {
      values.current.sum = value
      const field = fields.current.sum
      if (field) field.value = value
    },
  })

  // Как `register()`: новый объект и новый ref-колбэк на каждый рендер.
  const register = (name: "sum") => ({
    name,
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
      if (fields.current[name]) values.current[name] = event.target.value
      else values.current[name] = undefined
    },
    ref: (element: HTMLInputElement | null) => {
      if (!element || fields.current[name]) return
      fields.current[name] = element
      element.value = values.current[name] ?? ""
    },
  })

  return <Input label="Сумма" mask="amount" {...register("sum")} />
}

describe("Input с маской под register() после reset()", () => {
  it("показывает значение из reset, а ввод и setValue снова доезжают", async () => {
    const user = userEvent.setup()
    let api!: Api
    render(<FakeForm onApi={(value) => (api = value)} />)
    const field = screen.getByRole("textbox") as HTMLInputElement

    await user.type(field, "100")
    expect(api.getValue()).toBe("100")

    act(() => api.reset("5 000"))
    expect(field.value).toBe("5 000")

    await user.type(field, "1")
    expect(api.getValue()).toBe(field.value)

    act(() => api.setValue("7"))
    expect(field.value).toBe("7")
  })
})
