import { afterEach, describe, expect, it, vi } from "vitest"
import { act, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { CREATE_ITEMS, MENU_GROUPS, NAV_ITEMS, ORG_ONE } from "@/test/header-fixtures"

import { HeaderMenu } from "@/components/ui/header-menu"

import { Header } from "./header"
import { NotificationMenu } from "./notification-menu"

// Финальный аудит: панель «Меню»/«Создать» и подсветка колокольчика.

const settle = () => act(() => new Promise((resolve) => setTimeout(resolve, 250)))

describe("панели шапки закрываются при переходе", () => {
  it("щелчок по ссылке «Меню» зовёт onClick и закрывает панель", async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    const groups = MENU_GROUPS.map((group, index) =>
      index === 0
        ? {
            ...group,
            links: group.links.map((link) =>
              link.value === "statements" ? { ...link, onClick } : link
            ),
          }
        : group
    )
    render(<Header type="client" navItems={NAV_ITEMS} organizations={ORG_ONE} menuGroups={groups} />)

    await user.click(screen.getByRole("button", { name: "Меню" }))
    await user.click(await screen.findByRole("button", { name: "Операции и выписки" }))
    await settle()

    expect(onClick).toHaveBeenCalledTimes(1)
    expect(document.querySelector('[data-slot="header-menu-overlay"]')).toBeNull()
    // Прокрутка страницы снова свободна: затемнение не висит поверх
    // открытой после перехода страницы.
    expect(document.body.style.overflow).not.toBe("hidden")
  })

  it("щелчок по плитке «Создать» закрывает панель", async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(
      <Header
        type="client"
        navItems={NAV_ITEMS}
        organizations={ORG_ONE}
        createItems={CREATE_ITEMS.map((item) => ({ ...item, onClick }))}
      />
    )

    await user.click(screen.getByRole("button", { name: "Создать" }))
    const tile = (await screen.findByText("Платёж по реквизитам")).closest("button")!
    await user.click(tile)
    await settle()

    expect(onClick).toHaveBeenCalledTimes(1)
    expect(document.querySelector('[data-slot="header-menu-overlay"]')).toBeNull()
  })
})

describe("текущий раздел объявляется aria-current", () => {
  it("в видимом нижнем ряду шапки", () => {
    render(
      <Header type="client" navItems={NAV_ITEMS} organizations={ORG_ONE} activeSection="cash" />
    )
    expect(screen.getByRole("button", { name: "Рублёвые операции" })).toHaveAttribute(
      "aria-current",
      "page"
    )
    expect(screen.getByRole("button", { name: "Счета и карты" })).not.toHaveAttribute(
      "aria-current"
    )
  })

  it("в раскрытом меню разделов", () => {
    render(<HeaderMenu groups={MENU_GROUPS} activeLink="statements" />)
    expect(screen.getByRole("button", { name: "Операции и выписки" })).toHaveAttribute(
      "aria-current",
      "page"
    )
    expect(screen.getByRole("button", { name: "Платежи" })).not.toHaveAttribute("aria-current")
  })
})

describe("подсветка колокольчика", () => {
  afterEach(() => vi.useRealTimers())

  it("гаснет, если счётчик уменьшился раньше, чем прошла секунда", () => {
    vi.useFakeTimers()
    const trigger = () => screen.getByRole("button", { name: "Уведомления" })
    const { rerender } = render(<NotificationMenu items={[]} unreadCount={1} />)

    rerender(<NotificationMenu items={[]} unreadCount={2} />)
    expect(trigger()).toHaveAttribute("data-highlighted")

    // Уведомление прочитали через 300 мс — таймер подсветки снят очисткой.
    act(() => vi.advanceTimersByTime(300))
    rerender(<NotificationMenu items={[]} unreadCount={1} />)
    act(() => vi.advanceTimersByTime(5000))

    expect(trigger()).not.toHaveAttribute("data-highlighted")
  })
})
