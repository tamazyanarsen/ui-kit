import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { Sidebar } from "./sidebar"
import { SidebarItem, SidebarGroup } from "./item"

// Финальный аудит: раскрытие группы из свёрнутой полосы с клавиатуры.
// Кнопка-значок при раскрытии снимается, и фокус с неё падал на body.

describe("SidebarGroup: фокус при раскрытии из свёрнутой полосы", () => {
  it("переезжает на триггер той же группы в развёрнутой панели", async () => {
    const user = userEvent.setup()
    render(
      <Sidebar defaultOpen={false}>
        <SidebarGroup value="payments" label="Платежи">
          <SidebarItem label="СБП" />
        </SidebarGroup>
      </Sidebar>
    )
    const icon = screen.getByRole("button", { name: "Платежи" })
    icon.focus()
    await user.keyboard("{Enter}")

    expect(screen.getByText("СБП")).toBeInTheDocument()
    const trigger = document.querySelector('[data-slot="sidebar-group-trigger"]')
    expect(document.activeElement).not.toBe(document.body)
    expect(document.activeElement).toBe(trigger)
  })
})
