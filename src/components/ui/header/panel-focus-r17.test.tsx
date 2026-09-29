import { describe, expect, it } from "vitest"
import { act, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { CREATE_ITEMS, MENU_GROUPS, NAV_ITEMS, ORG_ONE } from "@/test/header-fixtures"

import { Header } from "./header"

// Аудит 16: фокус на кнопку, открывшую панель, возвращался только после
// Escape. Выбор плитки «Создать» или ссылки «Меню» закрывал панель, и через
// 160 мс узел с фокусом снимался — фокус падал на body.

const afterExit = () => act(() => new Promise((resolve) => setTimeout(resolve, 250)))

function renderHeader() {
  render(
    <Header
      type="client"
      navItems={NAV_ITEMS}
      organizations={ORG_ONE}
      createItems={CREATE_ITEMS}
      menuGroups={MENU_GROUPS}
    />
  )
}

describe("Шапка: фокус после действия из панели", () => {
  it("Enter на плитке «Создать» — фокус на кнопке «Создать»", async () => {
    const user = userEvent.setup()
    renderHeader()
    await user.click(screen.getByRole("button", { name: "Создать" }))
    const tile = (await screen.findByText("Платёж по реквизитам")).closest<HTMLElement>("a, button")!
    tile.focus()
    await user.keyboard("{Enter}")
    await afterExit()
    expect(screen.getByRole("button", { name: "Создать" })).toHaveFocus()
  })

  it("Enter на ссылке «Меню» — фокус на кнопке «Меню»", async () => {
    const user = userEvent.setup()
    renderHeader()
    await user.click(screen.getByRole("button", { name: "Меню" }))
    const panel = document.querySelector<HTMLElement>('[data-slot="header-menu-overlay"]')!
    const link = [...panel.querySelectorAll<HTMLElement>("a, button")].find(
      (el) => el.textContent?.trim() && !el.getAttribute("aria-label")
    )!
    link.focus()
    await user.keyboard("{Enter}")
    await afterExit()
    expect(screen.getByRole("button", { name: "Меню" })).toHaveFocus()
  })

  it("фокус, уведённый действием наружу, не перехватывается", async () => {
    const user = userEvent.setup()
    const outside = document.createElement("button")
    outside.textContent = "Снаружи"
    document.body.append(outside)
    render(
      <Header
        type="client"
        navItems={NAV_ITEMS}
        organizations={ORG_ONE}
        menuGroups={MENU_GROUPS}
        createItems={CREATE_ITEMS.map((item, index) =>
          index === 0 ? { ...item, onClick: () => outside.focus() } : item
        )}
      />
    )
    await user.click(screen.getByRole("button", { name: "Создать" }))
    const tile = (await screen.findByText("Платёж по реквизитам")).closest<HTMLElement>("a, button")!
    tile.focus()
    await user.keyboard("{Enter}")
    await afterExit()
    expect(outside).toHaveFocus()
    outside.remove()
  })
})
