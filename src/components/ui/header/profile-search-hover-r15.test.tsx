import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { ORG_MANY } from "@/test/header-fixtures"

import { ProfileMenu } from "./profile-menu"

// Аудит 14: при поиске организаций наведение на пункт списка переносило на
// него фокус (Base UI подсвечивает пункт фокусом), и дальнейший набор уходил
// из поля в меню — в поиск по первым буквам, а Enter жал подсвеченный пункт.

describe("ProfileMenu: наведение не уводит фокус из поиска", () => {
  it("после наведения на пункт набор продолжается в поле", async () => {
    const user = userEvent.setup()
    render(<ProfileMenu organizations={ORG_MANY} value="1" />)
    await user.click(screen.getByRole("button", { name: /ИП Константинопольский/ }))
    const search = await screen.findByRole("textbox", { name: "Поиск организации" })
    await user.click(search)
    await user.type(search, "ооо")

    const [firstRow] = await screen.findAllByRole("menuitemradio")
    await user.hover(firstRow)
    expect(document.activeElement).toBe(search)

    await user.keyboard("с")
    expect(search).toHaveValue("ооос")
  })

  it("стрелка вниз из поля по-прежнему ведёт в список", async () => {
    const user = userEvent.setup()
    render(<ProfileMenu organizations={ORG_MANY} value="1" />)
    await user.click(screen.getByRole("button", { name: /ИП Константинопольский/ }))
    const search = await screen.findByRole("textbox", { name: "Поиск организации" })
    await user.click(search)
    await user.keyboard("{ArrowDown}")
    expect(document.activeElement).not.toBe(search)
    expect(document.activeElement?.closest('[role="menu"]')).not.toBeNull()
  })

  // Сверка r15: без подсветки по наведению строка под курсором при поиске
  // переставала подсвечиваться — её ставил только `data-highlighted`.
  it("строка под курсором подсвечивается и без переноса фокуса", async () => {
    const user = userEvent.setup()
    render(<ProfileMenu organizations={ORG_MANY} value="1" />)
    await user.click(screen.getByRole("button", { name: /ИП Константинопольский/ }))
    const [row] = await screen.findAllByRole("menuitemradio")
    expect(row.className).toContain("hover:bg-[var(--header-item-hover-bg)]")
  })
})
