import * as React from "react"
import { describe, expect, it, vi } from "vitest"
import { act, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { Radio } from "@/components/ui/radio/radio"
import { RadioGroup } from "@/components/ui/radio/root"
import { Toggle } from "@/components/ui/toggle/toggle"

import { Checkbox } from "./checkbox"

// Пятый проход. Клик по подписи браузер превращает в клик по скрытому
// input, React успевал применить его раньше нативного `change`, и сверка
// «было/стало» по нативному событию молча глотала `onChange`.
describe("onChange on a label click", () => {
  it.each([
    ["Checkbox", (onChange: (checked: boolean) => void) => (
      <Checkbox label="Согласен" onChange={(e) => onChange(e.currentTarget.checked)} />
    )],
    ["Toggle", (onChange: (checked: boolean) => void) => (
      <Toggle label="Согласен" onChange={(e) => onChange(e.currentTarget.checked)} />
    )],
  ])("%s: fires onChange(true) then onChange(false)", async (_, renderControl) => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(renderControl(onChange))

    await user.click(screen.getByText("Согласен"))
    await user.click(screen.getByText("Согласен"))

    expect(onChange.mock.calls).toEqual([[true], [false]])
  })

  it("stays silent when a controlled parent rejects the change", async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Checkbox label="Согласен" checked={false} onChange={onChange} />)

    await user.click(screen.getByText("Согласен"))

    expect(onChange).not.toHaveBeenCalled()
  })
})

// Форма (react-hook-form `setValue`/`reset`) пишет `checked` всем кнопкам
// группы по порядку DOM. Запись `false` в прежде выбранную кнопку, идущая
// ПОСЛЕ записи `true` в новую, снимала только что сделанный выбор.
describe("form writes to an uncontrolled RadioGroup", () => {
  function renderGroup(defaultValue: string) {
    const refs = {
      a: React.createRef<HTMLInputElement>(),
      b: React.createRef<HTMLInputElement>(),
      c: React.createRef<HTMLInputElement>(),
    }
    render(
      <RadioGroup aria-label="Тариф" defaultValue={defaultValue}>
        <Radio value="a" label="A" ref={refs.a} />
        <Radio value="b" label="B" ref={refs.b} />
        <Radio value="c" label="C" ref={refs.c} />
      </RadioGroup>
    )
    return refs
  }

  const checkedOf = (name: string) =>
    screen.getByRole("radio", { name }).getAttribute("aria-checked")

  it("selects an earlier radio (c → a)", () => {
    const refs = renderGroup("c")
    act(() => {
      refs.a.current!.checked = true
      refs.b.current!.checked = false
      refs.c.current!.checked = false
    })
    expect([checkedOf("A"), checkedOf("B"), checkedOf("C")]).toEqual(["true", "false", "false"])
  })

  it("selects a later radio (a → c)", () => {
    const refs = renderGroup("a")
    act(() => {
      refs.a.current!.checked = false
      refs.b.current!.checked = false
      refs.c.current!.checked = true
    })
    expect([checkedOf("A"), checkedOf("B"), checkedOf("C")]).toEqual(["false", "false", "true"])
  })
})

// Обёртка Radio при смене значения группы не перерисовывается, и сверка с
// «применённым» значением по ней устаревала: после выбора кликом запись
// формы терялась, а повторный выбор той же кнопки не давал `onChange`.
describe("Radio after a user selection", () => {
  it("fires onChange every time the radio is selected again", async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <RadioGroup aria-label="Тариф">
        <Radio value="a" label="A" onChange={(e) => onChange(e.currentTarget.value)} />
        <Radio value="c" label="C" />
      </RadioGroup>
    )

    await user.click(screen.getByText("A"))
    await user.click(screen.getByText("C"))
    await user.click(screen.getByText("A"))

    expect(onChange.mock.calls).toEqual([["a"], ["a"]])
  })

  it("applies a form write after the user picked a radio", async () => {
    const user = userEvent.setup()
    const refs = [React.createRef<HTMLInputElement>(), React.createRef<HTMLInputElement>()]
    render(
      <RadioGroup aria-label="Тариф">
        <Radio value="a" label="A" ref={refs[0]} />
        <Radio value="c" label="C" ref={refs[1]} />
      </RadioGroup>
    )

    await user.click(screen.getByText("A"))
    await user.click(screen.getByText("C"))
    await user.click(screen.getByText("A"))
    act(() => {
      refs[0].current!.checked = false
      refs[1].current!.checked = true
    })

    expect(screen.getByRole("radio", { name: "C" })).toHaveAttribute("aria-checked", "true")
    expect(screen.getByRole("radio", { name: "A" })).toHaveAttribute("aria-checked", "false")
  })
})
