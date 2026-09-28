import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { MailFeed } from "./mail-feed"

// Итоговая проверка №3: `checked = false` по умолчанию делал флажок всегда
// управляемым — без `checked` клик звал `onCheckedChange(true)`, а галочка
// не ставилась.

const mail = { id: "№1", sender: "Банк", date: "12.09", subject: "Тема", message: "Текст" }

describe("MailFeed: неуправляемый флажок", () => {
  it("без checked клик переключает галочку и сообщает об этом", async () => {
    const user = userEvent.setup()
    const onCheckedChange = vi.fn()
    render(<MailFeed {...mail} showCheckbox onCheckedChange={onCheckedChange} />)
    const box = screen.getByRole("checkbox", { name: "Выбрать письмо" })

    await user.click(box)
    expect(box).toHaveAttribute("aria-checked", "true")
    expect(onCheckedChange).toHaveBeenLastCalledWith(true)

    await user.click(box)
    expect(box).toHaveAttribute("aria-checked", "false")
    expect(onCheckedChange).toHaveBeenLastCalledWith(false)
  })

  it("defaultChecked задаёт начальное состояние", () => {
    render(<MailFeed {...mail} showCheckbox defaultChecked />)
    expect(screen.getByRole("checkbox", { name: "Выбрать письмо" })).toHaveAttribute(
      "aria-checked",
      "true"
    )
  })
})
