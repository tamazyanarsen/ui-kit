import { describe, expect, it } from "vitest"
import { render, screen, waitFor, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { MENU_GROUPS, NAV_ITEMS, ORG_MANY, ORG_ONE } from "@/test/header-fixtures"

import { Header } from "./header"

describe("Header: исправления аудита", () => {
  it("счётчик уведомлений считает только непрочитанные", () => {
    render(
      <Header
        type="client"
        organizations={ORG_ONE}
        notificationItems={[
          { id: "1", title: "Новое", org: "ООО", timestamp: "10:00", description: "текст" },
          { id: "2", title: "Прочитано", org: "ООО", timestamp: "10:00", description: "текст", viewed: true },
          { id: "3", title: "Тоже прочитано", org: "ООО", timestamp: "10:00", description: "текст", viewed: true },
        ]}
      />
    )
    const bell = screen.getByRole("button", { name: "Уведомления" })
    expect(within(bell).getByText("1")).toBeInTheDocument()
  })

  it("без organizationId выбор организации переключает триггер", async () => {
    const user = userEvent.setup()
    render(<Header type="client" organizations={ORG_MANY} />)
    const first = ORG_MANY[0].name as string
    await user.click(screen.getByText(first))
    await user.click(await screen.findByText("ООО «Чекап»"))
    await waitFor(() =>
      expect(
        screen.getByRole("button", { name: /ООО «Чекап»/ })
      ).toBeInTheDocument()
    )
  })

  it("«Выйти» остаётся в меню профиля при showOrgSettings={false}", async () => {
    const user = userEvent.setup()
    render(<Header type="client" organizations={ORG_MANY} showOrgSettings={false} />)
    await user.click(screen.getByText(ORG_MANY[0].name as string))
    expect(await screen.findByText("Выйти")).toBeInTheDocument()
    expect(screen.queryByText("Профиль и настройки")).not.toBeInTheDocument()
  })

  it("раскрытое меню закрывается по Escape", async () => {
    const user = userEvent.setup()
    render(
      <Header
        type="client"
        navItems={NAV_ITEMS}
        organizations={ORG_ONE}
        menuGroups={MENU_GROUPS}
      />
    )
    await user.click(screen.getByRole("button", { name: "Меню" }))
    expect(screen.getByText("Платежи и операции")).toBeInTheDocument()
    await user.keyboard("{Escape}")
    await waitFor(() =>
      expect(screen.queryByText("Платежи и операции")).not.toBeInTheDocument()
    )
  })
})
