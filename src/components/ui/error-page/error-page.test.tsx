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

  // Дизайн-чек №28: цифры больше не текст — это векторные ассеты из макета
  // (`Image Error (ELK)`), поэтому проверяем разметку иллюстрации, а не
  // наличие символов «4». Раньше здесь ожидался `getAllByText("4")`, что и
  // фиксировало неверную отрисовку шрифтом.
  it("renders the 404 illustration with two vector digits", () => {
    const { container } = render(<ErrorPage title="Заголовок" code="404" />)
    const illustration = container.querySelector('[data-slot="error-page-illustration"]')
    expect(illustration).toHaveAttribute("data-type", "404")
    expect(illustration?.querySelectorAll("svg")).toHaveLength(2)
    expect(screen.queryByText("4")).not.toBeInTheDocument()
  })

  it("renders the 403 illustration with a four and a three", () => {
    const { container } = render(<ErrorPage title="Заголовок" code="403" />)
    const illustration = container.querySelector('[data-slot="error-page-illustration"]')
    expect(illustration).toHaveAttribute("data-type", "403")
    expect(illustration?.querySelectorAll("svg")).toHaveLength(2)
  })

  it("renders the standalone mascot illustration when no code is given", () => {
    const { container } = render(<ErrorPage title="Заголовок" />)
    const illustration = container.querySelector('[data-slot="error-page-illustration"]')
    expect(illustration).toHaveAttribute("data-type", "image")
    expect(illustration?.querySelectorAll("svg")).toHaveLength(0)
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
