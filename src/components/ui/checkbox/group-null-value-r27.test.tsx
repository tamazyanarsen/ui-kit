import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { CheckboxGroup } from "./group"

// Круг 27: `value={null}` (значение формы, которого ещё нет) считалось
// управляемым: выбор брался из неуправляемого состояния, а писать в него
// клик не мог — флажки не реагировали.

describe("CheckboxGroup: value={null}", () => {
  it("ведёт себя как неуправляемая: клик отмечает флажок и зовёт onValueChange", async () => {
    const onValueChange = vi.fn()
    render(
      <CheckboxGroup
        value={null}
        onValueChange={onValueChange}
        items={[
          { value: "a", label: "А" },
          { value: "b", label: "Б" },
        ]}
      />
    )
    const user = userEvent.setup()
    await user.click(screen.getByRole("checkbox", { name: "А" }))
    expect(onValueChange).toHaveBeenLastCalledWith(["a"])
    expect(screen.getByRole("checkbox", { name: "А" })).toBeChecked()
    await user.click(screen.getByRole("checkbox", { name: "Б" }))
    expect(onValueChange).toHaveBeenLastCalledWith(["a", "b"])
  })
})
