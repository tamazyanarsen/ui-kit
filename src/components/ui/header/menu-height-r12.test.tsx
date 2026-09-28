import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { ORG_MANY } from "@/test/header-fixtures"

import { ProfileMenu } from "./profile-menu"

// Аудит 11: у меню шапки не было предела высоты. У липкой шапки триггер
// едет вместе с окном, и нижние пункты длинного меню (профиль с дюжиной
// организаций — «Выйти») оставались за краем окна без прокрутки внутри.

describe("Меню шапки: высота не больше места до края окна", () => {
  it("профиль ограничен --available-height и прокручивается", async () => {
    const user = userEvent.setup()
    render(<ProfileMenu organizations={ORG_MANY} value="3" />)
    await user.click(screen.getByRole("button", { name: /Чекап/ }))
    const popup = await screen.findByRole("menu")
    expect(popup).toHaveClass("max-h-(--available-height)", "overflow-y-auto", "themed-scrollbar")
    expect(popup).not.toHaveClass("overflow-hidden")
  })
})
