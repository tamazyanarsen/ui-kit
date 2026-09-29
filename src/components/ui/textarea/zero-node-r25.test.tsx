import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import { Textarea } from "./textarea"

// Раунд 25, класс «{x && …} с числом 0»: подпись 0 выводилась голым текстом
// без <label>, комментарий 0 — голым текстом мимо абзаца и без связи с полем.

describe("Textarea: числа-узлы", () => {
  it("подпись 0 — это label поля", () => {
    render(<Textarea label={0} />)
    expect(screen.getByLabelText("0")).toBeInTheDocument()
  })

  it("комментарий 0 лежит в абзаце и описывает поле", () => {
    const { container } = render(<Textarea label="Заметка" comment={0} />)
    const caption = container.querySelector("p")
    expect(caption?.textContent).toBe("0")
    expect(screen.getByLabelText("Заметка")).toHaveAttribute("aria-describedby", caption?.id)
  })
})
