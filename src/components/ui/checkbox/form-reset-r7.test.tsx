import { describe, expect, it } from "vitest"
import { act, render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { Toggle } from "@/components/ui/toggle"
import { RadioGroup } from "@/components/ui/radio"

import { Checkbox } from "./checkbox"

// Аудит 6: нативный сброс формы (`form.reset()`, `<button type="reset">`)
// браузер делает мимо сеттеров. Скрытые input теряли отметку, а контролы
// показывали прежнее — в `FormData` уходило не то, что на экране.

const entries = (form: HTMLFormElement) => [...new FormData(form).entries()]

describe("Нативный сброс формы у Checkbox, Toggle и RadioGroup", () => {
  it("неуправляемые Checkbox и Toggle возвращаются к умолчанию", async () => {
    const user = userEvent.setup()
    const { container } = render(
      <form>
        <Checkbox name="a" label="Флажок" />
        <Toggle name="t" label="Тумблер" />
        <Checkbox name="d" label="Отмечен" defaultChecked />
      </form>
    )
    const form = container.querySelector("form")!
    await user.click(screen.getByRole("checkbox", { name: "Флажок" }))
    await user.click(screen.getByRole("switch", { name: "Тумблер" }))
    await user.click(screen.getByRole("checkbox", { name: "Отмечен" }))

    act(() => form.reset())
    await waitFor(() =>
      expect(screen.getByRole("checkbox", { name: "Флажок" })).toHaveAttribute(
        "aria-checked",
        "false"
      )
    )
    expect(screen.getByRole("switch", { name: "Тумблер" })).toHaveAttribute("aria-checked", "false")
    expect(screen.getByRole("checkbox", { name: "Отмечен" })).toHaveAttribute("aria-checked", "true")
    expect(entries(form).map(([key]) => key)).toEqual(["d"])
  })

  it("управляемый Checkbox сохраняет значение и скрытый input", async () => {
    const { container } = render(
      <form>
        <Checkbox name="c" label="Управляемый" checked onCheckedChange={() => {}} />
      </form>
    )
    const form = container.querySelector("form")!
    act(() => form.reset())
    await waitFor(() => expect(entries(form).map(([key]) => key)).toEqual(["c"]))
    expect(screen.getByRole("checkbox", { name: "Управляемый" })).toHaveAttribute(
      "aria-checked",
      "true"
    )
  })

  it("RadioGroup возвращается к defaultValue и отдаёт его форме", async () => {
    const user = userEvent.setup()
    const { container } = render(
      <form>
        <RadioGroup
          name="r"
          defaultValue="a"
          items={[
            { value: "a", label: "A" },
            { value: "b", label: "B" },
          ]}
        />
      </form>
    )
    const form = container.querySelector("form")!
    await user.click(screen.getByRole("radio", { name: "B" }))
    expect(entries(form)).toEqual([["r", "b"]])

    act(() => form.reset())
    await waitFor(() =>
      expect(screen.getByRole("radio", { name: "A" })).toHaveAttribute("aria-checked", "true")
    )
    expect(screen.getByRole("radio", { name: "B" })).toHaveAttribute("aria-checked", "false")
    expect(entries(form)).toEqual([["r", "a"]])
  })
})
