import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { NotificationMenu } from "./notification-menu"
import { ProfileMenu } from "./profile-menu"

// r26: Header отбрасывает пустые элементы списков (r25), но ProfileMenu и
// NotificationMenu экспортируются отдельно, и `[cond && {...}]` в их
// `organizations` / `items` роняло меню на `org.id` и `item.id`.

const org = { id: "1", name: "ООО «Север»", inn: "7701", role: "Оператор" }
const other = { id: "2", name: "ООО «Юг»", inn: "7702", role: "Казначей" }

describe("отдельные меню шапки: пустые элементы в списках", () => {
  it("ProfileMenu: null и false в organizations пропускаются", async () => {
    render(
      <ProfileMenu
        organizations={[null, org, false, other] as never}
        value="2"
      />
    )
    expect(screen.getByText("ООО «Юг»")).toBeInTheDocument()
    await userEvent.setup().click(screen.getByRole("button", { name: /Юг/ }))
    expect(await screen.findByText("Мои организации (2)")).toBeInTheDocument()
  })

  it("NotificationMenu: null и false в items пропускаются", async () => {
    const item = {
      id: "a",
      title: "Платёж",
      org: "ООО",
      timestamp: "12:00",
      description: "Исполнен",
    }
    render(<NotificationMenu items={[null, item, false] as never} />)
    await userEvent.setup().click(screen.getByRole("button", { name: "Уведомления" }))
    expect(await screen.findByText("Платёж")).toBeInTheDocument()
  })
})
