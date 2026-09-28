import * as React from "react"
import { describe, expect, it } from "vitest"
import { act, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { Input } from "@/components/ui/input"
import { Radio } from "@/components/ui/radio/radio"
import { RadioGroup } from "@/components/ui/radio/root"
import { Toggle } from "@/components/ui/toggle/toggle"

import { Checkbox } from "./checkbox"

// Четвёртый проход: `onChange` зовётся вручную (после микрозадачи моста и
// после очистки маски), и нативное событие к этому моменту уже доставлено —
// браузер обнуляет у него `currentTarget`. Идиоматичный
// `e.currentTarget.checked` падал с TypeError.
describe("manual onChange keeps currentTarget", () => {
  it("Checkbox, Toggle and Radio hand over currentTarget", async () => {
    const seen: Record<string, unknown> = {}
    const user = userEvent.setup()
    render(
      <>
        <Checkbox label="Флажок" onChange={(e) => (seen.checkbox = e.currentTarget.checked)} />
        <Toggle label="Тумблер" onChange={(e) => (seen.toggle = e.currentTarget.checked)} />
        <RadioGroup aria-label="Тариф">
          <Radio value="a" label="А" onChange={(e) => (seen.radio = e.currentTarget.value)} />
        </RadioGroup>
      </>
    )

    await user.click(screen.getByRole("checkbox", { name: "Флажок" }))
    await user.click(screen.getByRole("switch", { name: "Тумблер" }))
    await user.click(screen.getByRole("radio", { name: "А" }))

    expect(seen).toEqual({ checkbox: true, toggle: true, radio: "a" })
  })

  it("masked clear hands over currentTarget", async () => {
    let seen: string | undefined
    function Controlled() {
      const [value, setValue] = React.useState("+7 912 345-67-89")
      return (
        <Input
          label="Телефон"
          mask="phone"
          value={value}
          onChange={(e) => {
            seen = e.currentTarget.value
            setValue(e.currentTarget.value)
          }}
        />
      )
    }
    const user = userEvent.setup()
    render(<Controlled />)

    await user.click(screen.getByRole("button", { name: "Очистить поле" }))

    expect(seen).toBe("")
    expect((screen.getByLabelText("Телефон") as HTMLInputElement).value).toBe("")
  })
})

describe("form clears an uncontrolled RadioGroup", () => {
  it("unchecks the selected radio written false by the form", () => {
    const refs: Record<string, HTMLInputElement | null> = {}
    render(
      <RadioGroup aria-label="Тариф" defaultValue="b">
        <Radio value="a" label="А" ref={(node) => (refs.a = node)} />
        <Radio value="b" label="Б" ref={(node) => (refs.b = node)} />
      </RadioGroup>
    )
    expect(screen.getByRole("radio", { name: "Б" })).toHaveAttribute("aria-checked", "true")

    // Как `reset()` в react-hook-form: `checked = false` во все кнопки.
    act(() => {
      refs.a!.checked = false
      refs.b!.checked = false
    })

    expect(screen.getByRole("radio", { name: "А" })).toHaveAttribute("aria-checked", "false")
    expect(screen.getByRole("radio", { name: "Б" })).toHaveAttribute("aria-checked", "false")
  })

  it("keeps the new selection when React unchecks the previous radio", async () => {
    const user = userEvent.setup()
    render(
      <RadioGroup aria-label="Тариф" defaultValue="a">
        <Radio value="a" label="А" />
        <Radio value="b" label="Б" />
      </RadioGroup>
    )

    await user.click(screen.getByRole("radio", { name: "Б" }))

    expect(screen.getByRole("radio", { name: "Б" })).toHaveAttribute("aria-checked", "true")
    expect(screen.getByRole("radio", { name: "А" })).toHaveAttribute("aria-checked", "false")
  })
})
