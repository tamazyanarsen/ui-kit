import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { EmptySearchResults } from "./empty-search"

describe("EmptySearchResults", () => {
  it("renders the title", () => {
    render(<EmptySearchResults title="Ничего не найдено" />)
    expect(screen.getByRole("heading", { name: "Ничего не найдено" })).toBeInTheDocument()
  })

  it("renders the description when given", () => {
    render(<EmptySearchResults title="Заголовок" description="Попробуйте другой запрос" />)
    expect(screen.getByText("Попробуйте другой запрос")).toBeInTheDocument()
  })

  it("omits the description when not given", () => {
    render(<EmptySearchResults title="Заголовок" />)
    expect(screen.queryByText("Попробуйте другой запрос")).not.toBeInTheDocument()
  })

  it("shows a default icon", () => {
    const { container } = render(<EmptySearchResults title="Заголовок" />)
    expect(container.querySelector("svg")).toBeInTheDocument()
  })

  it("omits the icon when explicitly disabled", () => {
    const { container } = render(<EmptySearchResults title="Заголовок" icon={null} />)
    expect(container.querySelector("svg")).not.toBeInTheDocument()
  })

  it("renders the action button and calls onButtonClick", async () => {
    const user = userEvent.setup()
    const onButtonClick = vi.fn()
    render(
      <EmptySearchResults
        title="Заголовок"
        buttonLabel="Сбросить фильтры"
        onButtonClick={onButtonClick}
      />
    )

    await user.click(screen.getByRole("button", { name: "Сбросить фильтры" }))

    expect(onButtonClick).toHaveBeenCalledTimes(1)
  })

  it("omits the button when no buttonLabel is given", () => {
    render(<EmptySearchResults title="Заголовок" />)
    expect(screen.queryByRole("button")).not.toBeInTheDocument()
  })
})
