import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { TopFixedMessage } from "./top-fixed-message"

describe("TopFixedMessage", () => {
  it("renders the text", () => {
    render(<TopFixedMessage text="Плановые технические работы" />)
    expect(screen.getByText("Плановые технические работы")).toBeInTheDocument()
  })

  it("shows an icon by default and can hide it", () => {
    const { container, rerender } = render(<TopFixedMessage text="Сообщение" />)
    expect(container.querySelector("svg")).toBeInTheDocument()

    rerender(<TopFixedMessage text="Сообщение" showIcon={false} />)
    // Only the close (X) icon remains once the leading alert icon is hidden.
    expect(container.querySelectorAll("svg")).toHaveLength(1)
  })

  it("renders the action button and calls onButtonClick", async () => {
    const user = userEvent.setup()
    const onButtonClick = vi.fn()
    render(
      <TopFixedMessage
        text="Сообщение"
        showButton
        buttonLabel="Подробнее"
        onButtonClick={onButtonClick}
      />
    )

    await user.click(screen.getByRole("button", { name: "Подробнее" }))

    expect(onButtonClick).toHaveBeenCalledTimes(1)
  })

  it("calls onClose from the close button", async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(<TopFixedMessage text="Сообщение" onClose={onClose} />)

    await user.click(screen.getByRole("button", { name: "Закрыть" }))

    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it("hides the close button when showIconClose is false", () => {
    render(<TopFixedMessage text="Сообщение" showIconClose={false} />)
    expect(screen.queryByRole("button", { name: "Закрыть" })).not.toBeInTheDocument()
  })
})
