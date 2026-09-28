import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { Sidebar } from "./sidebar"
import { SidebarItem } from "./item"

describe("SidebarItem без href", () => {
  it("достижим с клавиатуры и срабатывает по Enter", async () => {
    const onClick = vi.fn()
    render(
      <Sidebar>
        <SidebarItem label="Платежи" onClick={onClick} />
      </Sidebar>
    )
    const link = screen.getByRole("link", { name: "Платежи" })
    await userEvent.tab()
    expect(link).toHaveFocus()
    await userEvent.keyboard("{Enter}")
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it("активный пункт объявляет себя текущей страницей", () => {
    render(
      <Sidebar>
        <SidebarItem label="Платежи" href="/p" active />
      </Sidebar>
    )
    expect(screen.getByRole("link", { name: "Платежи" })).toHaveAttribute(
      "aria-current",
      "page"
    )
  })
})
