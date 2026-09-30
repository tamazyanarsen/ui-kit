import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { Input } from "./input"

// Comment & Icon / Error Input & Icon мастера `ELK / input`: значок «i» в
// правом краю строки подписи под полем (по образцу `showCommentIcon` у
// Textarea). Значение, а не имена классов: значок лежит В СТРОКЕ подписи,
// рядом с текстом, и подпись остаётся связана с полем.

function captionOf(field: HTMLElement) {
  return document.getElementById(field.getAttribute("aria-describedby") ?? "none")!
}

describe("Input: значок «i» в строке подписи", () => {
  it("по умолчанию значка нет", () => {
    render(<Input label="Поле" comment="Подсказка" />)
    expect(captionOf(screen.getByLabelText("Поле")).parentElement!.querySelector("svg")).toBeNull()
  })

  it("showCommentIcon рисует значок в одном ряду с текстом подписи", () => {
    render(<Input label="Поле" comment="Подсказка" showCommentIcon />)
    const caption = captionOf(screen.getByLabelText("Поле"))
    expect(caption.textContent).toBe("Подсказка")
    // Значок — сосед текста внутри ряда, а не часть самого абзаца.
    expect(caption.querySelector("svg")).toBeNull()
    expect(caption.parentElement!.querySelectorAll("svg")).toHaveLength(1)
  })

  it("у ошибки значок тоже есть, а текст ошибки остаётся подписью поля", () => {
    render(<Input label="Поле" error="Неверно" showCommentIcon />)
    const field = screen.getByLabelText("Поле")
    expect(field).toHaveAttribute("aria-invalid", "true")
    expect(captionOf(field).textContent).toBe("Неверно")
    expect(captionOf(field).parentElement!.querySelectorAll("svg")).toHaveLength(1)
  })

  it("без подписи значок не рисуется — не к чему его привязать", () => {
    const { container } = render(<Input label="Поле" showCommentIcon />)
    expect(container.querySelector("p")).toBeNull()
  })

  it("с commentHint значок — кнопка, раскрывающая подсказку", async () => {
    const user = userEvent.setup()
    render(<Input label="Поле" comment="Подсказка" showCommentIcon commentHint="Подробности по полю" />)
    const button = screen.getByRole("button", { name: "Дополнительная информация" })
    expect(screen.queryByText("Подробности по полю")).toBeNull()
    await user.click(button)
    expect(await screen.findByText("Подробности по полю")).toBeInTheDocument()
  })
})
