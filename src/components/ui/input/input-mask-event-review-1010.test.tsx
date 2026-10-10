import * as React from "react"
import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { Input } from "./input"

// Ревью 10.10, п. 7: поле с маской отдавало в `onChange` нативный
// `InputEvent` под видом React `ChangeEvent`. У него нет `persist` и
// `isPropagationStopped`, и обработчик падал только на полях с маской.
describe("Input с маской: событие onChange (ревью 10.10, п. 7)", () => {
  it("событие ведёт себя как синтетическое React", async () => {
    const user = userEvent.setup()
    const seen: { value: string; current: string }[] = []
    function Harness() {
      const [value, setValue] = React.useState("")
      return (
        <Input
          label="Телефон"
          mask="phone"
          value={value}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            event.persist()
            expect(event.isPropagationStopped()).toBe(false)
            expect(event.isDefaultPrevented()).toBe(false)
            seen.push({ value: event.target.value, current: event.currentTarget.value })
            setValue(event.target.value)
          }}
        />
      )
    }
    render(<Harness />)
    await user.type(screen.getByLabelText("Телефон"), "9")
    expect(seen.length).toBeGreaterThan(0)
    expect(seen.at(-1)!.value).toBe(seen.at(-1)!.current)
    expect(seen.at(-1)!.value).toContain("9")
  })
})
