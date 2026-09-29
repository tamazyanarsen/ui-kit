import { describe, expect, it } from "vitest"
import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { MENU_GROUPS, NAV_ITEMS, ORG_MANY, ORG_ONE } from "@/test/header-fixtures"

import { Header } from "./header"
import { ProfileMenu } from "./profile-menu"
import { NotificationMenu } from "./notification-menu"

// r25: пустые элементы массивов (`[cond && item]`) роняли шапку на `item.x`;
// имя сотрудника без обрезки растягивало шапку; профиль отмечал «никакую»
// организацию при незнакомом value; статус уведомления 0 рисовался голым нулём.

const holes = <T,>(...items: (T | null | false | undefined)[]) =>
  items as unknown as T[]

describe("Header с пустыми элементами в массивах", () => {
  it("navItems, notificationItems и organizations с null не роняют шапку", () => {
    render(
      <Header
        type="client"
        navItems={holes(null, ...NAV_ITEMS, false)}
        organizations={holes(undefined, ...ORG_ONE)}
        notificationItems={holes(
          null,
          { id: "n1", title: "Новость", org: "Орг", timestamp: "10:00", description: "Текст" }
        )}
        documentMenuItems={holes(null, { value: "d", label: "Документ" })}
      />
    )
    expect(screen.getByRole("button", { name: "Уведомления" })).toBeInTheDocument()
    expect(screen.getAllByText("Рублёвые операции").length).toBeGreaterThan(0)
  })

  it("ссылка null внутри группы меню не роняет раскрытое меню", async () => {
    const user = userEvent.setup()
    const groups = [
      { ...MENU_GROUPS[0], links: holes(null, ...MENU_GROUPS[0].links) },
      null,
      MENU_GROUPS[1],
    ] as unknown as typeof MENU_GROUPS
    render(<Header type="client" organizations={ORG_ONE} menuGroups={groups} />)
    await user.click(screen.getByRole("button", { name: "Меню" }))
    expect(await screen.findByRole("button", { name: "Платежи" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Счета" })).toBeInTheDocument()
  })
})

describe("Header сотрудника", () => {
  it("длинное имя обрезается многоточием, а не растягивает шапку", () => {
    render(
      <Header
        type="employee"
        employeeName="Константинопольский-Заикин Александр Александрович"
      />
    )
    const name = screen.getByText(/Константинопольский/)
    expect(name.className).toContain("truncate")
    expect(name.className).toContain("min-w-0")
    const trigger = name.closest("button") as HTMLElement
    expect(trigger.className).toContain("max-w-[304px]")
    expect(trigger.className).not.toContain("shrink-0")
  })
})

describe("ProfileMenu", () => {
  it("при незнакомом value отмечена та организация, что в триггере", async () => {
    const user = userEvent.setup()
    render(<ProfileMenu organizations={ORG_MANY.slice(0, 3)} value="нет-такой" />)
    await user.click(screen.getByRole("button", { name: /Константинопольский/ }))
    const items = await screen.findAllByRole("menuitemradio")
    expect(items[0]).toHaveAttribute("aria-checked", "true")
    expect(within(items[0]).getByText(/Константинопольский/)).toBeInTheDocument()
  })
})

describe("NotificationMenu: статус 0", () => {
  it("статус 0 рисуется в своей оформленной ячейке", async () => {
    const user = userEvent.setup()
    render(
      <NotificationMenu
        items={[
          { id: "1", title: "Т", status: 0, org: "О", timestamp: "10:00", description: "Д" },
        ]}
      />
    )
    await user.click(screen.getByRole("button", { name: "Уведомления" }))
    const zero = await screen.findByText("0")
    expect(zero.className).toContain("shrink-0")
  })
})
