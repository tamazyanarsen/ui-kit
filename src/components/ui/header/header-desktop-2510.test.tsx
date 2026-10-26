import "@/test/desktop-viewport"
import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { NavOverflowTriggerButton } from "@/lib/nav-overflow-row"
import { NAV_ITEMS, ORG_MANY } from "@/test/header-fixtures"

import { Header } from "./header"
import type { NotificationMenuItem } from "./notification-menu"

// Правки UI-Kit от 25.10 — десктопная шапка: p12, p48, p80, p76 и
// публикация `--header-bottom`.

const NOTIFICATIONS: NotificationMenuItem[] = [
  { id: "1", title: "Платёж", org: "ООО", timestamp: "сегодня", description: "Исполнен" },
]

function elementChildren(node: Element) {
  return Array.from(node.children)
}

describe("Header (десктоп) — Правки UI-Kit от 25.10", () => {
  it("p12: переключатель организации сжимает содержимое одной обёрткой, цвет детей плавно", () => {
    render(<Header type="client" organizations={ORG_MANY} organizationId="2" />)
    const trigger = document.querySelector<HTMLElement>('[data-slot="profile-menu-trigger"]')!
    expect(trigger.className).toContain("press-scale-content")
    expect(elementChildren(trigger)).toHaveLength(1)
    const name = screen.getByText("ООО «Северострой»")
    expect(name.className).toContain("transition-colors")
    expect(name.className).toContain("group-hover:")
  })

  it("p48: «Уведомления» и «Сообщения» сжимают значок со счётчиком до 0,92", () => {
    render(
      <Header
        type="client"
        organizations={ORG_MANY}
        notificationItems={NOTIFICATIONS}
        messageCount={2}
      />
    )
    for (const name of ["Уведомления", "Сообщения"]) {
      const button = screen.getByRole("button", { name })
      expect(button.className).toContain("press-scale-content")
      expect(button.className).toContain("[--press-scale:0.92]")
      // Сжимается одна обёртка — значок вместе со счётчиком.
      expect(elementChildren(button)).toHaveLength(1)
      expect(button.firstElementChild!.querySelector('[data-slot="badge"], svg')).not.toBeNull()
    }
  })

  it("p48: подсветка колокольчика при росте счётчика осталась", () => {
    const { rerender } = render(
      <Header type="client" organizations={ORG_MANY} notificationItems={[]} />
    )
    rerender(<Header type="client" organizations={ORG_MANY} notificationItems={NOTIFICATIONS} />)
    const bell = screen.getByRole("button", { name: "Уведомления" })
    expect(bell).toHaveAttribute("data-highlighted")
    expect(bell.className).toContain("bg-[var(--header-notification-highlight-bg)]")
  })

  it("p80: пункт навигации — текст в одной обёртке, сжимается она, а не кнопка", () => {
    render(<Header type="client" navItems={NAV_ITEMS} organizations={ORG_MANY} />)
    const item = document.querySelector<HTMLElement>('[data-slot="header-nav-item"]')!
    expect(item.className).toContain("press-scale-content")
    expect(item.className).not.toMatch(/(^|\s)press-scale(\s|$)/)
    expect(elementChildren(item)).toHaveLength(1)
    expect(item.firstElementChild).toHaveTextContent("Рублёвые операции")
  })

  it("p80: «Ещё» — подпись и шеврон одной обёрткой", () => {
    render(<NavOverflowTriggerButton slot="x" />)
    const button = screen.getByRole("button", { name: "Ещё" })
    expect(button.className).toContain("press-scale-content")
    expect(elementChildren(button)).toHaveLength(1)
    expect(button.firstElementChild!.querySelector("svg")).not.toBeNull()
  })

  it("p76/p24/p75: строки меню организации — общий menu-row, содержимое в обёртке, рука", async () => {
    const user = userEvent.setup()
    render(<Header type="client" organizations={ORG_MANY} organizationId="1" />)
    await user.click(document.querySelector<HTMLElement>('[data-slot="profile-menu-trigger"]')!)
    const rows = [
      await screen.findByRole("menuitem", { name: "Профиль и настройки" }),
      screen.getByRole("menuitem", { name: "Выйти" }),
      ...screen.getAllByRole("menuitemradio"),
    ]
    for (const row of rows) {
      expect(row.className).toContain("menu-row")
      expect(row.className).toContain("press-scale-content")
      expect(row.className).toContain("cursor-pointer")
      expect(row.className).not.toContain("--header-item-hover-bg")
      expect(row.className).not.toContain("--header-logout-hover-bg")
      // Значок и текст — внутри одной обёртки, голого текста у строки нет.
      expect(elementChildren(row)).toHaveLength(1)
      const bareText = Array.from(row.childNodes).filter(
        (node) => node.nodeType === Node.TEXT_NODE && node.textContent?.trim()
      )
      expect(bareText).toHaveLength(0)
    }
  })

  it("p76: строки уведомлений — тот же menu-row с обёрткой", async () => {
    const user = userEvent.setup()
    render(<Header type="client" organizations={ORG_MANY} notificationItems={NOTIFICATIONS} />)
    await user.click(screen.getByRole("button", { name: "Уведомления" }))
    const row = await screen.findByRole("menuitem", { name: /Платёж/ })
    expect(row.className).toContain("menu-row")
    expect(row.className).toContain("press-scale-content")
    expect(elementChildren(row)).toHaveLength(1)
  })

  it("публикует --header-bottom и снимает его при размонтировании", () => {
    const spy = vi
      .spyOn(HTMLElement.prototype, "getBoundingClientRect")
      .mockImplementation(function (this: HTMLElement) {
        const bottom = this.dataset.slot === "header" ? 128 : 0
        return { top: 0, left: 0, right: 100, bottom, width: 100, height: bottom, x: 0, y: 0, toJSON() {} } as DOMRect
      })
    const { unmount } = render(<Header type="client" navItems={NAV_ITEMS} organizations={ORG_MANY} />)
    expect(document.documentElement.style.getPropertyValue("--header-bottom")).toBe("128px")
    unmount()
    expect(document.documentElement.style.getPropertyValue("--header-bottom")).toBe("")
    spy.mockRestore()
  })

  it("pinned=\"desktop\" закрепляет десктоп так же, как true", () => {
    render(<Header type="client" navItems={NAV_ITEMS} organizations={ORG_MANY} pinned="desktop" />)
    const row = document.querySelector<HTMLElement>('[data-slot="header-nav-row"]')!
    expect(row.closest(".sticky")).not.toBeNull()
  })
})
