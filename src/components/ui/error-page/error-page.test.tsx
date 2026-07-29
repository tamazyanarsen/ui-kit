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

  it("renders the error code when given", () => {
    render(<ErrorPage title="Заголовок" code="404" />)
    expect(screen.getByText("404")).toBeInTheDocument()
  })

  it("omits the code when not given", () => {
    render(<ErrorPage title="Заголовок" />)
    expect(screen.queryByText("404")).not.toBeInTheDocument()
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
