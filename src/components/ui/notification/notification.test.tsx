import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { NotificationItem, NotificationPanel } from "./notification"

describe("NotificationItem", () => {
  it("renders the title", () => {
    render(<NotificationItem title="Платёж выполнен" />)
    expect(screen.getByText("Платёж выполнен")).toBeInTheDocument()
  })

  it("is not a button without onClick", () => {
    render(<NotificationItem title="Заголовок" />)
    expect(screen.queryByRole("button", { name: "Заголовок" })).not.toBeInTheDocument()
  })

  it("becomes clickable and calls onClick when onClick is given", async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<NotificationItem title="Заголовок" onClick={onClick} />)

    await user.click(screen.getByRole("button"))

    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it("calls onButtonClick without also firing the row's onClick", async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    const onButtonClick = vi.fn()
    render(
      <NotificationItem
        title="Заголовок"
        onClick={onClick}
        buttonLabel="Посмотреть"
        onButtonClick={onButtonClick}
      />
    )

    await user.click(screen.getByRole("button", { name: "Посмотреть" }))

    expect(onButtonClick).toHaveBeenCalledTimes(1)
    expect(onClick).not.toHaveBeenCalled()
  })

  it("marks unread items with data-viewed unset and viewed ones as data-viewed", () => {
    const { container: unreadContainer } = render(<NotificationItem title="Новое" />)
    expect(
      unreadContainer.querySelector('[data-slot="notification-item"]')
    ).not.toHaveAttribute("data-viewed")

    const { container: viewedContainer } = render(<NotificationItem title="Просмотрено" viewed />)
    expect(
      viewedContainer.querySelector('[data-slot="notification-item"]')
    ).toHaveAttribute("data-viewed", "true")
  })
})

describe("NotificationPanel", () => {
  it("renders the default title and every item", () => {
    render(
      <NotificationPanel
        items={[{ title: "Первое" }, { title: "Второе" }]}
      />
    )
    expect(screen.getByText("Уведомления и новости")).toBeInTheDocument()
    expect(screen.getByText("Первое")).toBeInTheDocument()
    expect(screen.getByText("Второе")).toBeInTheDocument()
  })

  it("renders primary/secondary panel buttons and calls their handlers", async () => {
    const user = userEvent.setup()
    const onPrimaryButtonClick = vi.fn()
    const onSecondaryButtonClick = vi.fn()
    render(
      <NotificationPanel
        items={[]}
        primaryButtonLabel="Прочитать все"
        onPrimaryButtonClick={onPrimaryButtonClick}
        secondaryButtonLabel="Настройки"
        onSecondaryButtonClick={onSecondaryButtonClick}
      />
    )

    await user.click(screen.getByRole("button", { name: "Прочитать все" }))
    await user.click(screen.getByRole("button", { name: "Настройки" }))

    expect(onPrimaryButtonClick).toHaveBeenCalledTimes(1)
    expect(onSecondaryButtonClick).toHaveBeenCalledTimes(1)
  })
})
