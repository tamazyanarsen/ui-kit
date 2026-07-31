import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { Header } from "./header"
import type { HeaderNavItem } from "./header"
import type { ProfileMenuOrganization } from "./profile-menu"

const NAV_ITEMS: HeaderNavItem[] = [
  { value: "cash", label: "Рублёвые операции" },
  { value: "accounts", label: "Счета и карты" },
]

const ORG_ONE: ProfileMenuOrganization[] = [
  { id: "1", name: "ООО «Северострой»", inn: "7701234522", role: "Оператор" },
]

const ORG_MANY: ProfileMenuOrganization[] = [
  { id: "1", name: "ИП Константинопольский", inn: "7701234511", role: "Сотрудник" },
  { id: "2", name: "ООО «Северострой»", inn: "7701234522", role: "Оператор" },
  { id: "3", name: "ООО «Чекап»", inn: "7701234541", role: "Казначей" },
  { id: "4", name: "ООО «Внешние системы»", inn: "7701234515", role: "Наблюдатель" },
  { id: "5", name: "ООО «Северсталь»", inn: "7701234503", role: "Казначей" },
  { id: "6", name: "ООО «Чекало»", inn: "7701234556", role: "Оператор" },
  { id: "7", name: "ООО «Прогресс»", inn: "7701234578", role: "Бухгалтер" },
]

describe("Header", () => {
  it("renders the payment button and nav items for the plain Client state", () => {
    render(<Header type="client" navItems={NAV_ITEMS} organizations={ORG_ONE} />)
    expect(screen.getByRole("button", { name: /Платёж/ })).toBeInTheDocument()
    // The always-rendered off-screen measurement copy (see useOverflowCount)
    // duplicates every nav item, so this legitimately renders twice.
    expect(screen.getAllByText("Рублёвые операции").length).toBeGreaterThan(0)
  })

  it("hides the payment button for Client Without An Account", () => {
    render(
      <Header
        type="client"
        clientHeaderType="client-without-account"
        navItems={NAV_ITEMS}
        organizations={ORG_ONE}
      />
    )
    expect(screen.queryByRole("button", { name: /Платёж/ })).not.toBeInTheDocument()
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
    expect(screen.queryByRole("button", { name: /Платёж/ })).not.toBeInTheDocument()
    expect(screen.queryByText("Рублёвые операции")).not.toBeInTheDocument()
    expect(screen.getByText("ООО «Северострой»")).toBeInTheDocument()
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
