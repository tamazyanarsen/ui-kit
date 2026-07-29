import { useState } from "react"
import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { Sidebar } from "./sidebar"
import { SidebarItem, SidebarGroup } from "./item"

describe("Sidebar", () => {
  it("renders open by default with visible labels", () => {
    render(
      <Sidebar>
        <SidebarItem label="Главная" />
      </Sidebar>
    )
    expect(screen.getByText("Главная")).toBeInTheDocument()
  })

  it("hides the visible label while collapsed, falling back to aria-label", () => {
    render(
      <Sidebar open={false}>
        <SidebarItem label="Главная" href="/" />
      </Sidebar>
    )
    expect(screen.queryByText("Главная")).not.toBeInTheDocument()
    expect(screen.getByRole("link", { name: "Главная" })).toBeInTheDocument()
  })

  it("calls onClick on a SidebarItem", async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(
      <Sidebar>
        <SidebarItem label="Главная" onClick={onClick} />
      </Sidebar>
    )

    await user.click(screen.getByText("Главная"))

    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it("expands a group's panel when open and clicked", async () => {
    const user = userEvent.setup()
    render(
      <Sidebar>
        <SidebarGroup value="payments" label="Платежи">
          <SidebarItem label="СБП" />
        </SidebarGroup>
      </Sidebar>
    )

    expect(screen.queryByText("СБП")).not.toBeInTheDocument()

    await user.click(screen.getByText("Платежи"))

    expect(screen.getByText("СБП")).toBeInTheDocument()
  })

  function ControlledSidebar() {
    const [open, setOpen] = useState(false)
    const [expanded, setExpanded] = useState<string[]>([])
    return (
      <Sidebar
        open={open}
        onOpenChange={setOpen}
        expandedGroups={expanded}
        onExpandedGroupsChange={setExpanded}
      >
        <SidebarGroup value="payments" label="Платежи">
          <SidebarItem label="СБП" />
        </SidebarGroup>
      </Sidebar>
    )
  }

  it("clicking a group's collapsed-rail trigger opens the rail and pre-expands the group", async () => {
    const user = userEvent.setup()
    render(<ControlledSidebar />)

    // Collapsed: the group has no visible label, only its icon-only trigger.
    await user.click(screen.getByRole("button", { name: "Платежи" }))

    // Now open — the group's own label and its pre-expanded child are both visible.
    expect(screen.getByText("Платежи")).toBeInTheDocument()
    expect(screen.getByText("СБП")).toBeInTheDocument()
  })
})
