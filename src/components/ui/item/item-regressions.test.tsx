import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { Item } from "./item"
import { NotificationItem } from "@/components/ui/notification"
import { MailFeed } from "@/components/ui/mail-feed"
import { TitleInformationText } from "@/components/ui/title"

describe("Enter/Space на вложенном управлении не нажимает строку", () => {
  it("Item: Space на Toggle переключает его и не вызывает onClick строки", async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    const onToggleChange = vi.fn()
    render(
      <Item
        text="Уведомления"
        value="Вкл"
        rightElement="toggle"
        toggleChecked={false}
        onToggleChange={onToggleChange}
        onClick={onClick}
      />
    )

    screen.getByRole("switch").focus()
    await user.keyboard(" ")

    expect(onToggleChange.mock.calls[0]?.[0]).toBe(true)
    expect(onClick).not.toHaveBeenCalled()
  })

  it("Item: Enter на самой строке по-прежнему вызывает onClick", async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<Item text="Счёт" value="40702" onClick={onClick} />)
    screen.getByRole("button", { name: /Счёт/ }).focus()
    await user.keyboard("{Enter}")
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it("NotificationItem: Enter на кнопке строки вызывает onButtonClick, а не onClick", async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    const onButtonClick = vi.fn()
    render(
      <NotificationItem
        title="Новый платёж"
        buttonLabel="Подписать"
        onButtonClick={onButtonClick}
        onClick={onClick}
      />
    )

    screen.getByRole("button", { name: "Подписать" }).focus()
    await user.keyboard("{Enter}")

    expect(onButtonClick).toHaveBeenCalledTimes(1)
    expect(onClick).not.toHaveBeenCalled()
  })
})

describe("Кликабельное доступно с клавиатуры", () => {
  const mail = { id: "№1", sender: "Банк", date: "12.09", subject: "Тема", message: "Текст" }

  it("MailFeed с onClick — кнопка, нажимается Enter", async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    const { container } = render(<MailFeed {...mail} onClick={onClick} />)
    const root = container.querySelector('[data-slot="mail-feed"]') as HTMLElement
    expect(root).toHaveAttribute("role", "button")
    root.focus()
    await user.keyboard("{Enter}")
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it("MailFeed: у чекбокса есть доступное имя, клик по нему не открывает письмо", async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    const onCheckedChange = vi.fn()
    render(
      <MailFeed {...mail} showCheckbox onCheckedChange={onCheckedChange} onClick={onClick} />
    )
    await user.click(screen.getByRole("checkbox", { name: "Выбрать письмо" }))
    expect(onCheckedChange).toHaveBeenCalledWith(true)
    expect(onClick).not.toHaveBeenCalled()
  })

  it("MailFeed без onClick не объявляет себя кнопкой", () => {
    const { container } = render(<MailFeed {...mail} />)
    expect(container.querySelector('[data-slot="mail-feed"]')).not.toHaveAttribute("role")
  })

  it("TitleInformationText: ссылка без href — кнопка, нажимается с клавиатуры", async () => {
    const user = userEvent.setup()
    const onLinkClick = vi.fn()
    render(<TitleInformationText onLinkClick={onLinkClick}>Подробнее</TitleInformationText>)
    const button = screen.getByRole("button", { name: "Подробнее" })
    button.focus()
    await user.keyboard("{Enter}")
    expect(onLinkClick).toHaveBeenCalledTimes(1)
  })

  it("TitleInformationText: с href остаётся ссылкой", () => {
    render(<TitleInformationText href="/help">Подробнее</TitleInformationText>)
    expect(screen.getByRole("link", { name: "Подробнее" })).toHaveAttribute("href", "/help")
  })
})
