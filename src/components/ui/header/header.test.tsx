import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import {
  CREATE_ITEMS,
  MENU_GROUPS,
  NAV_ITEMS,
  ORG_MANY,
  ORG_ONE,
} from "@/test/header-fixtures"

import { Header } from "./header"

// Состояния шапки, панели «Меню»/«Создать» и меню профиля.
// Избранное — в `header-favourites.test.tsx`.

describe("Header", () => {
  // Дизайн-чек №30: в макете (`Menu Header (ELK)`) в нижнем ряду две
  // кнопки — «Меню» и «Создать», — а не одна «Платёж».
  it("renders the Меню/Создать buttons and nav items for the plain Client state", () => {
    render(<Header type="client" navItems={NAV_ITEMS} organizations={ORG_ONE} />)
    expect(screen.getByRole("button", { name: "Меню" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Создать" })).toBeInTheDocument()
    // The always-rendered off-screen measurement copy (see useOverflowCount)
    // duplicates every nav item, so this legitimately renders twice.
    expect(screen.getAllByText("Рублёвые операции").length).toBeGreaterThan(0)
  })

  it("hides the Создать button for Client Without An Account", () => {
    render(
      <Header
        type="client"
        clientHeaderType="client-without-account"
        navItems={NAV_ITEMS}
        organizations={ORG_ONE}
      />
    )
    expect(screen.getByRole("button", { name: "Меню" })).toBeInTheDocument()
    expect(screen.queryByRole("button", { name: "Создать" })).not.toBeInTheDocument()
  })

  it("renders only the logo and org switcher for Client is Blocked", () => {
    render(
      <Header
        type="client"
        clientHeaderType="client-is-blocked"
        navItems={NAV_ITEMS}
        organizations={ORG_ONE}
      />
    )
    expect(screen.queryByRole("button", { name: "Меню" })).not.toBeInTheDocument()
    expect(screen.queryByRole("button", { name: "Создать" })).not.toBeInTheDocument()
    expect(screen.queryByText("Рублёвые операции")).not.toBeInTheDocument()
    expect(screen.getByText("ООО «Северострой»")).toBeInTheDocument()
  })

  // Дизайн-чек №30: раскрывается ровно одна панель за раз, и раскрывают её
  // только кнопки «Меню»/«Создать» — у пункта навигации своего выпадающего
  // списка в макете нет.
  it("opens the navigation panel from Меню and swaps it for the create panel", async () => {
    const user = userEvent.setup()
    render(
      <Header
        type="client"
        navItems={NAV_ITEMS}
        organizations={ORG_ONE}
        menuGroups={MENU_GROUPS}
        createItems={CREATE_ITEMS}
      />
    )

    await user.click(screen.getByRole("button", { name: "Меню" }))
    expect(screen.getByText("Платежи и операции")).toBeInTheDocument()

    await user.click(screen.getByRole("button", { name: "Создать" }))
    expect(screen.queryByText("Платежи и операции")).not.toBeInTheDocument()
    expect(screen.getByText("Платёж по реквизитам")).toBeInTheDocument()

    await user.click(screen.getByRole("button", { name: "Создать" }))
    expect(screen.queryByText("Платёж по реквизитам")).not.toBeInTheDocument()
  })

  it("renders the hamburger and a standalone logout button for Employee", () => {
    render(<Header type="employee" showMenu employeeName="Иванов И. И." />)
    expect(screen.getByRole("button", { name: "Открыть меню" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Выйти" })).toBeInTheDocument()
    expect(screen.getByText("Иванов И. И.")).toBeInTheDocument()
  })

  it("renders only the logo and phone number for Sign Out", () => {
    render(<Header type="sign-out" phoneNumber="8 800 700-87-83" />)
    expect(screen.getByText("8 800 700-87-83")).toBeInTheDocument()
  })

  it("switches the active organization and calls onOrganizationChange", async () => {
    const user = userEvent.setup()
    const onOrganizationChange = vi.fn()
    render(
      <Header
        type="client"
        organizations={ORG_MANY}
        organizationId="2"
        onOrganizationChange={onOrganizationChange}
      />
    )

    await user.click(screen.getByText("ООО «Северострой»"))
    const item = await screen.findByText("ООО «Чекап»")
    await user.click(item)

    expect(onOrganizationChange).toHaveBeenCalledWith("3")
  })

  it("filters organizations via the search box once there are 7+", async () => {
    const user = userEvent.setup()
    render(<Header type="client" organizations={ORG_MANY} organizationId="2" />)

    await user.click(screen.getByText("ООО «Северострой»"))
    const search = await screen.findByPlaceholderText("Поиск")
    await user.type(search, "Прогресс")

    expect(screen.getByText("ООО «Прогресс»")).toBeInTheDocument()
    expect(screen.queryByText("ООО «Чекап»")).not.toBeInTheDocument()
  })

  it("opens the logout confirmation and calls onLogout on confirm", async () => {
    const user = userEvent.setup()
    const onLogout = vi.fn()
    render(
      <Header type="client" organizations={ORG_ONE} onLogout={onLogout} />
    )

    await user.click(screen.getByText("ООО «Северострой»"))
    await user.click(await screen.findByText("Выйти"))

    expect(await screen.findByText("Выйти из личного кабинета?")).toBeInTheDocument()
    await user.click(screen.getByRole("button", { name: "Выйти" }))

    expect(onLogout).toHaveBeenCalledTimes(1)
  })
})
