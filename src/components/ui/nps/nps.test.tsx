import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { Nps } from "./nps"

describe("Nps", () => {
  it("renders the title", () => {
    render(<Nps title="Оцените процесс" />)
    expect(screen.getByText("Оцените процесс")).toBeInTheDocument()
  })

  it("selects a rating and calls onValueChange", async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(<Nps onValueChange={onValueChange} />)

    await user.click(screen.getByRole("radio", { name: /^4 из 5/ }))

    expect(onValueChange).toHaveBeenCalledWith(4)
    expect(screen.getByRole("radio", { name: /^4 из 5/ })).toHaveAttribute(
      "aria-checked",
      "true"
    )
  })

  it("reveals the comment field, chips, and submit button only after a rating is picked", async () => {
    const user = userEvent.setup()
    render(<Nps />)

    expect(screen.queryByRole("button", { name: "Отправить" })).not.toBeInTheDocument()

    await user.click(screen.getByRole("radio", { name: /^3 из 5/ }))

    expect(screen.getByRole("button", { name: "Отправить" })).toBeInTheDocument()
    expect(screen.getByLabelText("Комментарий")).toBeInTheDocument()
  })

  // Дизайн-чек 08.10, замечание 16: чипы — независимый мультивыбор, текст
  // комментария они не трогают.
  it("toggles chips without touching the comment text", async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(<Nps onSubmit={onSubmit} />)

    await user.click(screen.getByRole("radio", { name: /^2 из 5/ }))
    await user.type(screen.getByLabelText("Комментарий"), "Неудобно подписыват")
    await user.click(screen.getByRole("button", { name: "Неудобно подписывать" }))
    await user.click(screen.getByRole("button", { name: "Долго заполнять" }))

    expect(screen.getByLabelText("Комментарий")).toHaveValue("Неудобно подписыват")
    expect(screen.getByRole("button", { name: "Долго заполнять" })).toHaveAttribute("aria-pressed", "true")

    // Повторное нажатие снимает выбор.
    await user.click(screen.getByRole("button", { name: "Долго заполнять" }))
    expect(screen.getByRole("button", { name: "Долго заполнять" })).toHaveAttribute("aria-pressed", "false")

    await user.click(screen.getByRole("button", { name: "Отправить" }))
    expect(onSubmit).toHaveBeenCalledWith({
      value: 2,
      comment: "Неудобно подписыват",
      chips: ["Неудобно подписывать"],
    })
  })

  it("submits the rating and comment", async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(<Nps onSubmit={onSubmit} />)

    await user.click(screen.getByRole("radio", { name: /^5 из 5/ }))
    await user.type(screen.getByLabelText("Комментарий"), "Отлично")
    await user.click(screen.getByRole("button", { name: "Отправить" }))

    expect(onSubmit).toHaveBeenCalledWith({ value: 5, comment: "Отлично", chips: [] })
  })

  it("calls onClose from the close button", async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(<Nps onClose={onClose} />)

    await user.click(screen.getByRole("button", { name: "Закрыть" }))

    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it("shows the thank-you state when submitted", () => {
    render(<Nps submitted />)
    expect(screen.getByText("Спасибо за оценку")).toBeInTheDocument()
  })
})
