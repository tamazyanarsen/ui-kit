import * as React from "react"
import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { Toggle } from "@/components/ui/toggle"

import { Checkbox } from "./checkbox"

// Покрытие правки «отклонённое изменение молчит». Тест в
// `bridge-regressions.test.tsx` отклоняет изменение без рендера родителя —
// тогда отложенное изменение снимает микрозадача, и сверка «значение до и
// после» не участвует. Здесь родитель отклоняет, но ПЕРЕРИСОВЫВАЕТСЯ
// (счётчик попыток): рендер доходит до моста, и без сверки onChange
// сообщал бы форме изменение, которого не было.

function RejectingCheckbox({ onChange }: { onChange: () => void }) {
  const [, setAttempts] = React.useState(0)
  return (
    <Checkbox
      label="Согласен"
      checked={false}
      onCheckedChange={() => setAttempts((count) => count + 1)}
      onChange={onChange}
    />
  )
}

function RejectingToggle({ onChange }: { onChange: () => void }) {
  const [, setAttempts] = React.useState(0)
  return (
    <Toggle
      label="Уведомления"
      checked={false}
      onCheckedChange={() => setAttempts((count) => count + 1)}
      onChange={onChange}
    />
  )
}

describe("мост нативного input: отказ с перерисовкой родителя", () => {
  it("Checkbox: отклонённое изменение не зовёт onChange", async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<RejectingCheckbox onChange={onChange} />)

    await user.click(screen.getByRole("checkbox", { name: "Согласен" }))

    expect(onChange).not.toHaveBeenCalled()
    expect(screen.getByRole("checkbox", { name: "Согласен" })).toHaveAttribute(
      "aria-checked",
      "false"
    )
  })

  it("Toggle: отклонённое изменение не зовёт onChange", async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<RejectingToggle onChange={onChange} />)

    await user.click(screen.getByRole("switch", { name: "Уведомления" }))

    expect(onChange).not.toHaveBeenCalled()
  })
})
