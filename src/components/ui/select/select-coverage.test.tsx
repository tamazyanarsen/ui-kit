import * as React from "react"
import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import { Select, SelectValue } from "./root"
import { SelectTrigger } from "./trigger"

// Добор покрытия к исправлениям полей формы: у триггера Select не было
// ни теста на ref потребителя, ни на подпись при булевом `error`.
function renderTrigger(props: React.ComponentProps<typeof SelectTrigger>) {
  return render(
    <Select items={[{ value: "a", label: "А" }]}>
      <SelectTrigger label="Фрукт" {...props}>
        <SelectValue placeholder="" />
      </SelectTrigger>
    </Select>
  )
}

describe("SelectTrigger coverage", () => {
  // Обычная функция на React 18 молча теряла ref — register() из
  // react-hook-form получал null.
  it("forwards ref to the trigger button", () => {
    const ref = React.createRef<HTMLButtonElement>()
    renderTrigger({ ref })
    expect(ref.current).toBe(screen.getByRole("combobox"))
  })

  // `error ?? comment` при `error={false}` давал `false`, и комментарий
  // пропадал; при `error={true}` рисовался пустой абзац.
  it.each([false, true] as const)("keeps the comment when error is %j", (error) => {
    renderTrigger({ comment: "Подсказка", error })
    const caption = screen.getByText("Подсказка")
    expect(screen.getByRole("combobox")).toHaveAttribute("aria-describedby", caption.id)
  })
})
