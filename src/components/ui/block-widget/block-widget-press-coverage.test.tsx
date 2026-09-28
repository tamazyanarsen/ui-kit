import { createPortal } from "react-dom"
import { describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { BlockWidget } from "./block-widget"

// Добор покрытия к переводу BlockWidget на `lib/press`. Прежняя своя
// проверка смотрела только на короткий список селекторов и не отличала
// узлы из портала — оба случая ниже раньше нажимали весь блок.
describe("BlockWidget: нажатие только по самому блоку", () => {
  it("Enter в поле ввода внутри блока не нажимает блок", async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(
      <BlockWidget onClick={onClick}>
        <textarea aria-label="Комментарий" />
      </BlockWidget>
    )

    await user.click(screen.getByLabelText("Комментарий"))
    onClick.mockClear()
    await user.keyboard("{Enter}")

    expect(onClick).not.toHaveBeenCalled()
    expect(screen.getByLabelText("Комментарий")).toHaveValue("\n")
  })

  it("клик по содержимому портала не нажимает блок", () => {
    const onClick = vi.fn()
    render(
      <BlockWidget onClick={onClick}>
        {createPortal(<div>Всплывающая подсказка</div>, document.body)}
      </BlockWidget>
    )

    fireEvent.click(screen.getByText("Всплывающая подсказка"))

    expect(onClick).not.toHaveBeenCalled()
  })

  it("клик и Enter по самому блоку по-прежнему вызывают onClick", () => {
    const onClick = vi.fn()
    render(<BlockWidget onClick={onClick}>Лимит</BlockWidget>)
    const block = screen.getByRole("button", { name: "Лимит" })
    fireEvent.click(block)
    fireEvent.keyDown(block, { key: "Enter" })
    expect(onClick).toHaveBeenCalledTimes(2)
  })
})
