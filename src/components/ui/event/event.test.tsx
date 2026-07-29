import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { Event } from "./event"

describe("Event", () => {
  it("renders the title as plain text by default", () => {
    render(<Event title="Заявка отправлена" />)
    expect(screen.getByText("Заявка отправлена")).toBeInTheDocument()
  })

  it("renders the title as a status tag when type is tag", () => {
    render(<Event type="tag" title="Одобрено" status="success" />)
    expect(screen.getByText("Одобрено")).toBeInTheDocument()
  })

  it("renders timestamp and author when given", () => {
    render(<Event title="Заголовок" timestamp="10:00" author="Иванов И.И." />)
    expect(screen.getByText("10:00")).toBeInTheDocument()
    expect(screen.getByText("Иванов И.И.")).toBeInTheDocument()
  })

  it("renders each signatory's text", () => {
    render(
      <Event
        title="Заголовок"
        signatories={[
          { status: "success", text: "Подписал Иванов" },
          { status: "attention", text: "Ожидает Петров" },
        ]}
      />
    )
    expect(screen.getByText("Подписал Иванов")).toBeInTheDocument()
    expect(screen.getByText("Ожидает Петров")).toBeInTheDocument()
  })

  it("renders info rows", () => {
    render(
      <Event
        title="Заголовок"
        info={[{ label: "Сумма:", value: "10 000 ₽" }]}
      />
    )
    expect(screen.getByText("Сумма:")).toBeInTheDocument()
    expect(screen.getByText("10 000 ₽")).toBeInTheDocument()
  })

  it("renders the comment with its label", () => {
    render(<Event title="Заголовок" comment="Всё в порядке" />)
    expect(screen.getByText("Комментарий:")).toBeInTheDocument()
    expect(screen.getByText("Всё в порядке")).toBeInTheDocument()
  })

  it("renders documents and calls onClick for the clicked one", async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(
      <Event
        title="Заголовок"
        documents={[{ name: "Договор.pdf", meta: "1.2 МБ", onClick }]}
      />
    )

    await user.click(screen.getByText("Договор.pdf"))

    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it("renders the action button and calls onButtonClick", async () => {
    const user = userEvent.setup()
    const onButtonClick = vi.fn()
    render(
      <Event title="Заголовок" buttonLabel="Подробнее" onButtonClick={onButtonClick} />
    )

    await user.click(screen.getByRole("button", { name: "Подробнее" }))

    expect(onButtonClick).toHaveBeenCalledTimes(1)
  })
})
