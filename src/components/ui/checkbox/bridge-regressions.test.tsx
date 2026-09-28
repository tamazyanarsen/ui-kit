import * as React from "react"
import { describe, expect, it, vi } from "vitest"
import { act, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { Radio } from "@/components/ui/radio/radio"
import { RadioGroup } from "@/components/ui/radio/root"
import { Toggle } from "@/components/ui/toggle/toggle"

import { Checkbox } from "./checkbox"

// Третий проход: форма пишет значение прямо в узел (`ref.checked = …`), а
// нативный `change` уходил потребителю даже тогда, когда Base UI изменение
// отклонил.
describe("native input bridge", () => {
  // Как react-hook-form с `defaultValues`: запись в ref-колбэке.
  const writeOnAttach = (checked: boolean) => (node: HTMLInputElement | null) => {
    if (node) node.checked = checked
  }

  it("reflects a checked value written by the form on attach", () => {
    render(
      <>
        <Checkbox label="Согласен" ref={writeOnAttach(true)} />
        <Toggle label="Уведомления" ref={writeOnAttach(true)} />
      </>
    )

    expect(screen.getByRole("checkbox", { name: "Согласен" })).toHaveAttribute(
      "aria-checked",
      "true"
    )
    expect(screen.getByRole("switch", { name: "Уведомления" })).toHaveAttribute(
      "aria-checked",
      "true"
    )
  })

  it("reflects setValue/reset written after mount", () => {
    const ref = React.createRef<HTMLInputElement>()
    render(<Checkbox label="Согласен" ref={ref} />)
    const box = screen.getByRole("checkbox", { name: "Согласен" })

    act(() => {
      ref.current!.checked = true
    })
    expect(box).toHaveAttribute("aria-checked", "true")

    act(() => {
      ref.current!.checked = false
    })
    expect(box).toHaveAttribute("aria-checked", "false")
  })

  it("selects a radio written by the form in an uncontrolled group", () => {
    const refs: Record<string, HTMLInputElement | null> = {}
    render(
      <RadioGroup aria-label="Тариф">
        <Radio value="a" label="А" ref={(node) => (refs.a = node)} />
        <Radio value="b" label="Б" ref={(node) => (refs.b = node)} />
      </RadioGroup>
    )

    act(() => {
      refs.b!.checked = true
    })

    expect(screen.getByRole("radio", { name: "Б" })).toHaveAttribute("aria-checked", "true")
    expect(screen.getByRole("radio", { name: "А" })).toHaveAttribute("aria-checked", "false")
  })

  it("does not report a change that a controlled checkbox rejected", async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Checkbox label="Согласен" checked={false} onCheckedChange={() => {}} onChange={onChange} />)

    await user.click(screen.getByRole("checkbox", { name: "Согласен" }))

    expect(onChange).not.toHaveBeenCalled()
  })

  it("does not report a change canceled via details.cancel()", async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <Toggle
        label="Уведомления"
        onCheckedChange={(_, details) => details.cancel()}
        onChange={onChange}
      />
    )

    await user.click(screen.getByRole("switch", { name: "Уведомления" }))

    expect(onChange).not.toHaveBeenCalled()
    expect(screen.getByRole("switch", { name: "Уведомления" })).toHaveAttribute(
      "aria-checked",
      "false"
    )
  })

  it("reports an accepted change once, with the final checked state", async () => {
    const user = userEvent.setup()
    const seen: boolean[] = []
    render(
      <Checkbox
        label="Согласен"
        onChange={(event) => seen.push((event.target as HTMLInputElement).checked)}
      />
    )

    await user.click(screen.getByRole("checkbox", { name: "Согласен" }))

    expect(seen).toEqual([true])
  })
})
