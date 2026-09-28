import * as React from "react"
import { describe, expect, it, vi } from "vitest"
import { act, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { CREATE_ITEMS, MENU_GROUPS, NAV_ITEMS, ORG_ONE } from "@/test/header-fixtures"

import { Header } from "./header"

// Итоговая проверка №2: панели шапки закрывались только по ссылкам меню и
// плиткам «Создать». Переход из ряда избранного над затемнением и кнопка
// баннера оставляли панель висеть, а панель «Создать» переживала исчезновение
// своей кнопки.

const settle = () => act(() => new Promise((resolve) => setTimeout(resolve, 250)))
const overlay = () => document.querySelector('[data-slot="header-menu-overlay"]')

describe("панель «Меню» закрывается и из других входов", () => {
  it("избранный раздел в ряду над открытой панелью", async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    const groups = MENU_GROUPS.map((group) => ({
      ...group,
      links: group.links.map((link) =>
        link.value === "statements" ? { ...link, onClick } : link
      ),
    }))
    render(
      <Header
        type="client"
        organizations={ORG_ONE}
        menuGroups={groups}
        favourites={["statements"]}
      />
    )

    await user.click(screen.getByRole("button", { name: "Меню" }))
    await screen.findByRole("button", { name: "Платежи" })
    const favourite = document.querySelector<HTMLElement>(
      '[data-slot="header-nav-item"]'
    )!
    await user.click(favourite)
    await settle()

    expect(onClick).toHaveBeenCalledTimes(1)
    expect(overlay()).toBeNull()
    expect(document.body.style.overflow).not.toBe("hidden")
  })

  it("кнопка баннера внутри меню", async () => {
    const user = userEvent.setup()
    const onButtonClick = vi.fn()
    render(
      <Header
        type="client"
        navItems={NAV_ITEMS}
        organizations={ORG_ONE}
        menuGroups={MENU_GROUPS}
        menuBanners={[{ title: "Кредит", buttonLabel: "Подробнее", onButtonClick }]}
      />
    )

    await user.click(screen.getByRole("button", { name: "Меню" }))
    await user.click(await screen.findByRole("button", { name: "Подробнее" }))
    await settle()

    expect(onButtonClick).toHaveBeenCalledTimes(1)
    expect(overlay()).toBeNull()
  })
})

describe("панель «Создать» и исчезновение её кнопки", () => {
  it("закрывается, когда шапка переходит в «клиент без счёта»", async () => {
    const user = userEvent.setup()
    function Harness() {
      const [withAccount, setWithAccount] = React.useState(true)
      return (
        <>
          <button type="button" onClick={() => setWithAccount(false)}>
            без счёта
          </button>
          <Header
            type="client"
            clientHeaderType={withAccount ? "client" : "client-without-account"}
            navItems={NAV_ITEMS}
            organizations={ORG_ONE}
            createItems={CREATE_ITEMS}
          />
        </>
      )
    }
    render(<Harness />)

    await user.click(screen.getByRole("button", { name: "Создать" }))
    await screen.findByText("Платёж по реквизитам")
    await user.click(screen.getByRole("button", { name: "без счёта" }))
    await settle()

    expect(screen.queryByRole("button", { name: "Создать" })).not.toBeInTheDocument()
    expect(overlay()).toBeNull()
    expect(document.body.style.overflow).not.toBe("hidden")
  })
})
