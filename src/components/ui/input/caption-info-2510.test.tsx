import { describe, expect, it } from "vitest"
import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

// Правки UI-Kit от 25.10, правило каркаса «Значок „Информация“ (i) в
// мобильном виде — штора с текстом»: правило касается и подсказок у полей.
// jsdom — мобильный вид: вместо Hint с кнопкой «Понятно» — штора без кнопок.

const TEXT = "Номер указан в договоре"

async function expectSheet() {
  await userEvent.setup().click(
    screen.getByRole("button", { name: "Дополнительная информация" })
  )
  const sheet = screen.getByRole("dialog")
  expect(sheet).toHaveAttribute("data-slot", "info-hint-sheet")
  expect(within(sheet).getByRole("heading", { name: "Информация" })).toBeInTheDocument()
  expect(within(sheet).getByText(TEXT)).toBeInTheDocument()
  expect(within(sheet).queryByRole("button", { name: "Понятно" })).toBeNull()
}

describe("Значок «i» под полем в мобильном виде", () => {
  it("Input: нажатие открывает штору «Информация» без кнопок", async () => {
    render(<Input label="Договор" comment="Комментарий" showCommentIcon commentHint={TEXT} />)
    await expectSheet()
  })

  it("Textarea: нажатие открывает штору «Информация» без кнопок", async () => {
    render(<Textarea label="Описание" comment="Комментарий" showCommentIcon commentHint={TEXT} />)
    await expectSheet()
  })
})
