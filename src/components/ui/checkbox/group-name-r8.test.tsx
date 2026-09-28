import { describe, expect, it } from "vitest"
import { act, render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { CheckboxGroup } from "./group"

// Аудит 7: у CheckboxGroup не было `name`, флажки его не получали, и в
// нативную форму группа ничего не отправляла — в отличие от RadioGroup.

const ITEMS = [
  { value: "a", label: "A" },
  { value: "b", label: "B" },
  { value: "c", label: "C" },
]

describe("CheckboxGroup: name и FormData", () => {
  it("отмеченные значения уходят в FormData под именем группы", async () => {
    const user = userEvent.setup()
    const { container } = render(
      <form>
        <CheckboxGroup name="kinds" items={ITEMS} defaultValue={["a"]} />
      </form>
    )
    const form = container.querySelector("form")!
    await user.click(screen.getByRole("checkbox", { name: "C" }))
    expect(new FormData(form).getAll("kinds")).toEqual(["a", "c"])
  })

  it("после сброса формы в FormData снова только defaultValue", async () => {
    const user = userEvent.setup()
    const { container } = render(
      <form>
        <CheckboxGroup name="kinds" items={ITEMS} defaultValue={["a"]} />
      </form>
    )
    const form = container.querySelector("form")!
    await user.click(screen.getByRole("checkbox", { name: "B" }))
    act(() => form.reset())
    await waitFor(() =>
      expect(screen.getByRole("checkbox", { name: "B" })).toHaveAttribute("aria-checked", "false")
    )
    expect(new FormData(form).getAll("kinds")).toEqual(["a"])
  })
})
