import { describe, expect, it } from "vitest"
import { act, render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { CheckboxGroup } from "./group"

// Проверка правок r7: флажки группы управляемые (им правит массив группы),
// и после нативного сброса формы каждый держал текущий выбор — неуправляемая
// группа не возвращалась к `defaultValue`, хотя RadioGroup возвращается.

const ITEMS = [
  { value: "a", label: "A" },
  { value: "b", label: "B" },
]

const hiddenChecked = (container: HTMLElement) =>
  Array.from(container.querySelectorAll<HTMLInputElement>('input[type="checkbox"]')).map(
    (input) => input.checked
  )

describe("CheckboxGroup: нативный сброс формы", () => {
  it("неуправляемая группа возвращается к defaultValue", async () => {
    const user = userEvent.setup()
    const { container } = render(
      <form>
        <CheckboxGroup items={ITEMS} defaultValue={["a"]} />
      </form>
    )
    const form = container.querySelector("form")!
    await user.click(screen.getByRole("checkbox", { name: "B" }))
    expect(screen.getByRole("checkbox", { name: "B" })).toHaveAttribute("aria-checked", "true")

    act(() => form.reset())
    await waitFor(() =>
      expect(screen.getByRole("checkbox", { name: "B" })).toHaveAttribute("aria-checked", "false")
    )
    expect(screen.getByRole("checkbox", { name: "A" })).toHaveAttribute("aria-checked", "true")
    // Скрытые input — то, что уйдёт с формой, — совпадают с экраном.
    expect(hiddenChecked(container)).toEqual([true, false])
  })

  it("управляемая группа сброс не трогает", async () => {
    const { container } = render(
      <form>
        <CheckboxGroup items={ITEMS} value={["a", "b"]} onValueChange={() => {}} />
      </form>
    )
    const form = container.querySelector("form")!
    act(() => form.reset())
    await new Promise((resolve) => setTimeout(resolve, 20))
    expect(screen.getByRole("checkbox", { name: "B" })).toHaveAttribute("aria-checked", "true")
    expect(hiddenChecked(container)).toEqual([true, true])
  })
})
