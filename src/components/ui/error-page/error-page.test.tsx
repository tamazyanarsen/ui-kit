import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { ErrorPage } from "./error-page"

describe("ErrorPage", () => {
  it("renders the title", () => {
    render(<ErrorPage title="Страница не найдена" />)
    expect(screen.getByRole("heading", { name: "Страница не найдена" })).toBeInTheDocument()
  })

  it("renders the description when given", () => {
    render(<ErrorPage title="Заголовок" description="Попробуйте позже" />)
    expect(screen.getByText("Попробуйте позже")).toBeInTheDocument()
  })

  it("renders the error code when given, with each '0' as the mascot illustration", () => {
    const { container } = render(<ErrorPage title="Заголовок" code="404" />)
    expect(screen.getAllByText("4")).toHaveLength(2)
    expect(screen.queryByText("0")).not.toBeInTheDocument()
    expect(container.querySelectorAll("img")).toHaveLength(1)
  })

  it("renders the standalone mascot illustration when no code is given", () => {
    const { container } = render(<ErrorPage title="Заголовок" />)
    expect(screen.queryByText("4")).not.toBeInTheDocument()
    expect(container.querySelectorAll("img")).toHaveLength(1)
  })

  it("renders the action button and calls onButtonClick", async () => {
    const user = userEvent.setup()
    const onButtonClick = vi.fn()
    render(
      <ErrorPage title="Заголовок" buttonLabel="На главную" onButtonClick={onButtonClick} />
    )

    await user.click(screen.getByRole("button", { name: "На главную" }))

    expect(onButtonClick).toHaveBeenCalledTimes(1)
  })
})
