import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { Informer } from "./informer"

describe("Informer", () => {
  it("renders the title", () => {
    render(<Informer title="Требуется подпись" />)
    expect(screen.getByText("Требуется подпись")).toBeInTheDocument()
  })

  it("renders date and description when given", () => {
    render(<Informer title="Заголовок" date="24.12.2022" description="Подробности" />)
    expect(screen.getByText("24.12.2022")).toBeInTheDocument()
    expect(screen.getByText("Подробности")).toBeInTheDocument()
  })

  it("shows a close button by default and calls onClose", async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(<Informer title="Заголовок" onClose={onClose} />)

    await user.click(screen.getByRole("button", { name: "Закрыть" }))

    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it("hides the close button when showCross is false", () => {
    render(<Informer title="Заголовок" showCross={false} />)
    expect(screen.queryByRole("button", { name: "Закрыть" })).not.toBeInTheDocument()
  })

  it("renders main and additional buttons and calls their handlers", async () => {
    const user = userEvent.setup()
    const onMainButtonClick = vi.fn()
    const onAdditionalButtonClick = vi.fn()
    render(
      <Informer
        title="Заголовок"
        mainButtonLabel="Подписать"
        onMainButtonClick={onMainButtonClick}
        additionalButtonLabel="Отложить"
        onAdditionalButtonClick={onAdditionalButtonClick}
      />
    )

    await user.click(screen.getByRole("button", { name: "Подписать" }))
    await user.click(screen.getByRole("button", { name: "Отложить" }))

    expect(onMainButtonClick).toHaveBeenCalledTimes(1)
    expect(onAdditionalButtonClick).toHaveBeenCalledTimes(1)
  })
})
