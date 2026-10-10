import { describe, expect, it, vi } from "vitest"
import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { ViewportScope } from "@/lib/viewport"
import { MENU_GROUPS, ORG_MANY } from "@/test/header-fixtures"

import { Header } from "./header"
import type { HeaderProps } from "./header"

// Мобильная форма шапки (`ELK / header`, `Size=Mobile`). В jsdom `useIsDesktop`
// и так видит телефон, но форма задаётся явно — как в витрине.

function renderMobile(props: HeaderProps) {
  return render(
    <ViewportScope viewport="mobile">
      <Header {...props} />
    </ViewportScope>
  )
}

describe("Header — мобильная форма", () => {
  it("клиент: одна полоса, без нижнего ряда, кнопки «Создать» и «Меню» иконками", () => {
    renderMobile({ type: "client", menuGroups: MENU_GROUPS, organizations: ORG_MANY })
    expect(document.querySelector('[data-slot="header-mobile-row"]')).not.toBeNull()
    expect(document.querySelector('[data-slot="header-nav-row"]')).toBeNull()
    expect(document.querySelector('[data-slot="profile-menu-trigger"]')).toBeNull()
    expect(screen.getByRole("button", { name: "Создать" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Меню" })).toHaveAttribute("aria-expanded", "false")
    expect(screen.getByRole("button", { name: "Уведомления" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Сообщения" })).toBeInTheDocument()
  })

  it("«Меню» раскрывает мобильное меню: карточка организации и вкладки", async () => {
    const user = userEvent.setup()
    renderMobile({
      type: "client",
      menuGroups: MENU_GROUPS,
      favourites: ["accounts"],
      onFavouritesChange: () => {},
      organizations: ORG_MANY,
    })
    await user.click(screen.getByRole("button", { name: "Меню" }))
    expect(screen.getByRole("button", { name: "Меню" })).toHaveAttribute("aria-expanded", "true")
    const menu = document.querySelector<HTMLElement>('[data-slot="header-mobile-menu"]')!
    expect(menu).not.toBeNull()
    expect(within(menu).getByRole("tab", { name: "Избранное" })).toHaveAttribute("aria-selected", "true")
    expect(menu.querySelector('[data-slot="profile-menu-card"]')).not.toBeNull()
    // Вкладка «Избранное» — только избранные разделы.
    expect(within(menu).getByRole("button", { name: "Счета" })).toBeInTheDocument()
    expect(within(menu).queryByRole("button", { name: "Платежи" })).toBeNull()
    await user.click(within(menu).getByRole("tab", { name: "Все разделы" }))
    expect(within(menu).getByRole("button", { name: "Платежи" })).toBeInTheDocument()
    expect(within(menu).getByRole("button", { name: "Как настроить избранное" })).toBeInTheDocument()
  })

  it("звезда в мобильном меню меняет избранное", async () => {
    const user = userEvent.setup()
    const onFavouritesChange = vi.fn()
    renderMobile({
      type: "client",
      menuGroups: MENU_GROUPS,
      favourites: [],
      onFavouritesChange,
      organizations: ORG_MANY,
    })
    await user.click(screen.getByRole("button", { name: "Меню" }))
    const menu = document.querySelector<HTMLElement>('[data-slot="header-mobile-menu"]')!
    await user.click(within(menu).getByRole("tab", { name: "Все разделы" }))
    await user.click(within(menu).getAllByRole("button", { name: "Добавить в избранное" })[0])
    expect(onFavouritesChange).toHaveBeenCalledWith(["payments"])
  })

  it("без избранного остаётся один заголовок «Все разделы»", async () => {
    const user = userEvent.setup()
    renderMobile({ type: "client", menuGroups: MENU_GROUPS, organizations: ORG_MANY })
    await user.click(screen.getByRole("button", { name: "Меню" }))
    const tabs = screen.getAllByRole("tab")
    expect(tabs).toHaveLength(1)
    expect(tabs[0]).toHaveTextContent("Все разделы")
  })

  it("клиент без счёта — без «Создать»", () => {
    renderMobile({ type: "client", clientHeaderType: "client-without-account", organizations: ORG_MANY })
    expect(screen.queryByRole("button", { name: "Создать" })).toBeNull()
    expect(screen.getByRole("button", { name: "Меню" })).toBeInTheDocument()
  })

  it("заблокированный клиент и Sign Out — только логотип", () => {
    const { unmount } = renderMobile({
      type: "client",
      clientHeaderType: "client-is-blocked",
      organizations: ORG_MANY,
    })
    expect(screen.queryAllByRole("button")).toHaveLength(0)
    unmount()
    renderMobile({ type: "sign-out", phoneNumber: "8 800 700-87-83" })
    expect(screen.queryAllByRole("button")).toHaveLength(0)
    expect(screen.queryByText("8 800 700-87-83")).toBeNull()
    expect(screen.getByRole("img", { name: "ДОМ.РФ Банк" })).toBeInTheDocument()
  })

  it("у сотрудника мобильного варианта нет — шапка остаётся десктопной", () => {
    renderMobile({ type: "employee", employeeName: "Иванов И. И." })
    expect(document.querySelector('[data-slot="header-mobile-row"]')).toBeNull()
    expect(screen.getByRole("button", { name: "Выйти" })).toBeInTheDocument()
  })
})
