import { describe, expect, it } from "vitest"
import { act, render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { MENU_GROUPS, NAV_ITEMS, ORG_MANY, ORG_ONE } from "@/test/header-fixtures"

import { Header } from "./header"
import { ProfileMenu } from "./profile-menu"

// Второй раунд аудита: клавиатура шапки — меню профиля с поиском, возврат
// фокуса после Escape, устаревший внутренний выбор организации.

describe("ProfileMenu с поиском: клавиатура", () => {
  it("Escape из поля поиска закрывает меню", async () => {
    const user = userEvent.setup()
    render(<ProfileMenu organizations={ORG_MANY} value="1" />)
    await user.click(screen.getByRole("button", { name: /ИП Константинопольский/ }))
    const search = await screen.findByRole("textbox", { name: "Поиск организации" })
    search.focus()
    await user.keyboard("{Escape}")
    await waitFor(() =>
      expect(screen.queryByRole("textbox", { name: "Поиск организации" })).not.toBeInTheDocument()
    )
  })

  it("стрелка вниз из поля поиска уводит фокус в список организаций", async () => {
    const user = userEvent.setup()
    render(<ProfileMenu organizations={ORG_MANY} value="1" />)
    await user.click(screen.getByRole("button", { name: /ИП Константинопольский/ }))
    const search = await screen.findByRole("textbox", { name: "Поиск организации" })
    search.focus()
    await user.keyboard("{ArrowDown}")
    await waitFor(() => expect(document.activeElement).not.toBe(search))
    expect(document.activeElement?.getAttribute("role")).toMatch(/menuitem/)
  })

  it("печатные символы по-прежнему попадают в поле, а не в поиск меню по буквам", async () => {
    const user = userEvent.setup()
    render(<ProfileMenu organizations={ORG_MANY} value="1" />)
    await user.click(screen.getByRole("button", { name: /ИП Константинопольский/ }))
    const search = await screen.findByRole("textbox", { name: "Поиск организации" })
    search.focus()
    await user.keyboard("Чек")
    expect(search).toHaveValue("Чек")
    expect(search).toHaveFocus()
  })
})

describe("MenuOverlay: фокус после Escape", () => {
  it("возвращается на кнопку «Меню», а не падает на body", async () => {
    const user = userEvent.setup()
    render(
      <Header type="client" navItems={NAV_ITEMS} organizations={ORG_ONE} menuGroups={MENU_GROUPS} />
    )
    const trigger = screen.getByRole("button", { name: "Меню" })
    await user.click(trigger)
    await screen.findByText("Платежи и операции")
    // Фокус внутри панели — так его оставляет клавиатурный пользователь.
    const inside = document.querySelector<HTMLElement>(
      '[data-slot="header-menu"] a, [data-slot="header-menu"] button'
    )
    expect(inside).not.toBeNull()
    inside!.focus()
    expect(inside).toHaveFocus()
    await user.keyboard("{Escape}")
    // Уход панели длится 160 мс: после снятия узла фокус не должен
    // оказаться на body.
    await act(() => new Promise((resolve) => setTimeout(resolve, 250)))
    expect(screen.getByRole("button", { name: "Меню" })).toHaveFocus()
  })
})

describe("Header: устаревший выбор организации", () => {
  it("после смены списка без выбранной организации галочка стоит у первой", async () => {
    const user = userEvent.setup()
    const { rerender } = render(<Header type="client" organizations={ORG_MANY} />)
    await user.click(screen.getByText(ORG_MANY[0].name as string))
    await user.click(await screen.findByText("ООО «Чекап»"))
    // Выбранной «Чекап» в новом списке нет.
    const next = ORG_MANY.filter((organization) => organization.id !== "3")
    rerender(<Header type="client" organizations={next} />)
    await user.click(screen.getByRole("button", { name: /ИП Константинопольский/ }))
    // Выбранная строка — та, у которой есть галочка (единственный svg строки).
    await screen.findAllByRole("menuitem")
    const checked = Array.from(
      document.querySelectorAll('[data-slot="profile-menu-org-item"]')
    ).filter((row) => row.querySelector("svg"))
    expect(checked).toHaveLength(1)
    expect(checked[0]).toHaveTextContent("ИП Константинопольский")
  })
})
