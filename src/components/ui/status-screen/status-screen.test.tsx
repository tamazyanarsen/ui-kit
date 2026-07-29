import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { StatusScreen } from "./status-screen"

describe("StatusScreen", () => {
  it("renders the title", () => {
    render(<StatusScreen title="Платёж выполнен" />)
    expect(screen.getByRole("heading", { name: "Платёж выполнен" })).toBeInTheDocument()
  })

  it("renders the subtitle when given", () => {
    render(<StatusScreen title="Заголовок" subtitle="Средства зачислены" />)
    expect(screen.getByText("Средства зачислены")).toBeInTheDocument()
  })

  it("renders primary and secondary buttons and calls their handlers", async () => {
    const user = userEvent.setup()
    const onPrimaryClick = vi.fn()
    const onSecondaryClick = vi.fn()
    render(
      <StatusScreen
        title="Заголовок"
        primaryLabel="На главную"
        onPrimaryClick={onPrimaryClick}
        secondaryLabel="Отмена"
        onSecondaryClick={onSecondaryClick}
      />
    )

    await user.click(screen.getByRole("button", { name: "На главную" }))
    await user.click(screen.getByRole("button", { name: "Отмена" }))

    expect(onPrimaryClick).toHaveBeenCalledTimes(1)
    expect(onSecondaryClick).toHaveBeenCalledTimes(1)
  })

  it("omits the button row when no labels are given", () => {
    render(<StatusScreen title="Заголовок" />)
    expect(screen.queryByRole("button")).not.toBeInTheDocument()
  })
})
