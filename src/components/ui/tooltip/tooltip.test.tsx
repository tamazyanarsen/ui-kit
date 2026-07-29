import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { Tooltip } from "./tooltip"
import { Hint } from "./hint"

describe("Tooltip", () => {
  it("shows its content on hover and hides it after the pointer leaves", async () => {
    const user = userEvent.setup()
    render(
      <Tooltip content="Подсказка">
        <button type="button">Наведите</button>
      </Tooltip>
    )

    expect(screen.queryByText("Подсказка")).not.toBeInTheDocument()

    await user.hover(screen.getByRole("button", { name: "Наведите" }))
    expect(await screen.findByText("Подсказка")).toBeInTheDocument()

    await user.unhover(screen.getByRole("button", { name: "Наведите" }))
    await vi.waitFor(() => {
      expect(screen.queryByText("Подсказка")).not.toBeInTheDocument()
    })
  })
})

describe("Hint", () => {
  it("opens on click and shows its title and content", async () => {
    const user = userEvent.setup()
    render(
      <Hint title="Заголовок" content="Текст подсказки">
        <button type="button">Открыть</button>
      </Hint>
    )

    expect(screen.queryByText("Текст подсказки")).not.toBeInTheDocument()

    await user.click(screen.getByRole("button", { name: "Открыть" }))

    expect(await screen.findByText("Заголовок")).toBeInTheDocument()
    expect(screen.getByText("Текст подсказки")).toBeInTheDocument()
  })

  it("closes via its own close (X) button", async () => {
    const user = userEvent.setup()
    render(
      <Hint content="Текст подсказки">
        <button type="button">Открыть</button>
      </Hint>
    )

    await user.click(screen.getByRole("button", { name: "Открыть" }))
    await screen.findByText("Текст подсказки")

    await user.click(screen.getByRole("button", { name: "Закрыть" }))

    expect(screen.queryByText("Текст подсказки")).not.toBeInTheDocument()
  })

  it("hides the close button when showCross is false", async () => {
    const user = userEvent.setup()
    render(
      <Hint content="Текст подсказки" showCross={false}>
        <button type="button">Открыть</button>
      </Hint>
    )

    await user.click(screen.getByRole("button", { name: "Открыть" }))
    await screen.findByText("Текст подсказки")

    expect(screen.queryByRole("button", { name: "Закрыть" })).not.toBeInTheDocument()
  })
})
