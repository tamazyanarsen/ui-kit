import { describe, expect, it, vi } from "vitest"
import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { AccordionListItem } from "@/components/ui/accordion-list"
import { BankCard } from "@/components/ui/bank-card"
import { BlockWidget, BlockWidgetHead } from "@/components/ui/block-widget"
import { Card } from "@/components/ui/card"
import { Item } from "@/components/ui/item"
import { MailFeed } from "@/components/ui/mail-feed"
import { NotificationPanel } from "@/components/ui/notification"

// Ревью 10.10, п. 25: у роли `button` дети по ARIA «презентационные», а
// BankCard, Card, BlockWidget и строка AccordionList были `role="button"`
// с настоящими кнопками и флажком внутри. Теперь вход в блок — отдельная
// кнопка-соседка, и ни один контрол не вложен в другой.

/** Интерактивный узел внутри предка с ролью `button` (или самой кнопки). */
function nestedInButton(root: HTMLElement) {
  const controls = root.querySelectorAll<HTMLElement>(
    'button, input, [role="checkbox"], [role="button"], a[href]'
  )
  return [...controls].filter((control) =>
    control.parentElement?.closest('button, [role="button"]')
  )
}

describe("Блок-кнопка без вложенных контролов внутри роли button (ревью 10.10, п. 25)", () => {
  it("Card: «…» — сосед кнопки карточки; Enter нажимает карточку", async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    const { container } = render(
      <Card
        title="Основная карта"
        subtitle="Иванов И."
        onClick={onClick}
        menuItems={[{ text: "Заблокировать" }]}
      />
    )
    expect(nestedInButton(container)).toEqual([])
    const target = screen.getByRole("button", { name: "Основная карта" })
    expect(target).toHaveAccessibleDescription("Иванов И.")
    target.focus()
    await user.keyboard("{Enter}")
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it("Card: клик мышью по тексту карточки — одно нажатие", async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<Card title="Основная карта" onClick={onClick} />)
    await user.click(screen.getByText("Основная карта"))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it("BlockWidget: кнопка шапки — соседка, имя блока — заголовок", async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    const { container } = render(
      <BlockWidget onClick={onClick}>
        <BlockWidgetHead title="Лимиты" action={<button type="button">Изменить</button>} />
      </BlockWidget>
    )
    expect(nestedInButton(container)).toEqual([])
    screen.getByRole("button", { name: "Лимиты" }).focus()
    await user.keyboard("{Enter}")
    expect(onClick).toHaveBeenCalledTimes(1)
    await user.click(screen.getByRole("button", { name: "Изменить" }))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it("BlockWidget: aria-label потребителя — имя кнопки блока", () => {
    render(
      <BlockWidget onClick={() => {}} aria-label="Перейти к лимитам">
        <BlockWidgetHead title="Лимиты" />
      </BlockWidget>
    )
    expect(screen.getByRole("button", { name: "Перейти к лимитам" })).toBeInTheDocument()
  })

  it("BankCard: «Показать реквизиты» и «глаз» — соседи кнопки карты", async () => {
    const user = userEvent.setup()
    const { container } = render(<BankCard last4="4498" />)
    expect(nestedInButton(container)).toEqual([])
    const target = screen.getByRole("button", { name: "Показать реквизиты карты •• 4498" })
    target.focus()
    await user.keyboard("{Enter}")
    expect(screen.getByRole("button", { name: "Скрыть реквизиты карты •• 4498" })).toHaveFocus()
  })

  // Тот же дефект нашёлся в Item, MailFeed и уведомлении — вне списка
  // ревью, но тем же пунктом.
  it("Item: Toggle и флажок — соседи кнопки строки; выключенная строка не нажимается", async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    const { container, rerender } = render(
      <Item value="Уведомления" rightElement="toggle" onClick={onClick} />
    )
    expect(nestedInButton(container)).toEqual([])
    const row = screen.getByRole("button", { name: /Уведомления/ })
    row.focus()
    await user.keyboard("{Enter}")
    expect(onClick).toHaveBeenCalledTimes(1)

    rerender(<Item value="Уведомления" rightElement="toggle" disabled onClick={onClick} />)
    expect(row).toHaveAttribute("aria-disabled", "true")
    await user.click(row)
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it("MailFeed: флажок — сосед кнопки письма", () => {
    const { container } = render(
      <MailFeed
        id="№ 15"
        sender="ООО Ромашка"
        date="10.10.2026"
        subject="Акт сверки"
        message="Направляем акт сверки за квартал"
        showCheckbox
        onClick={() => {}}
      />
    )
    expect(nestedInButton(container)).toEqual([])
  })

  it("Уведомление: кнопка действия — соседка кнопки уведомления", () => {
    const { container } = render(
      <NotificationPanel
        items={[{ title: "Платёж исполнен", buttonLabel: "Открыть", onClick: () => {} }]}
      />
    )
    expect(nestedInButton(container)).toEqual([])
  })

  it("AccordionList: триггер — кнопка в заголовке, флажок и кнопки — рядом", async () => {
    const user = userEvent.setup()
    const { container } = render(
      <AccordionListItem
        title="Договор № 12"
        showCheckbox
        showButtons
        buttonLabel="Подписать"
      >
        Содержимое
      </AccordionListItem>
    )
    expect(nestedInButton(container)).toEqual([])
    const heading = screen.getByRole("heading", { name: "Договор № 12" })
    expect(heading.querySelector("div")).toBeNull()
    const trigger = within(heading).getByRole("button", { name: "Договор № 12" })
    expect(trigger).toHaveAttribute("aria-expanded", "false")

    trigger.focus()
    await user.keyboard("{Enter}")
    expect(trigger).toHaveAttribute("aria-expanded", "true")

    // Флажок и кнопка строку не переключают.
    await user.click(screen.getByRole("checkbox"))
    await user.click(screen.getByRole("button", { name: "Подписать" }))
    expect(trigger).toHaveAttribute("aria-expanded", "true")
  })
})
