import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { Briefcase as Home, Wallet as CreditCard, Settings, Wallet as Landmark } from "@/icons"

import { Sidebar } from "./sidebar"
import { SidebarItem, SidebarGroup } from "./item"

function DemoSidebar({ defaultOpen = true }: { defaultOpen?: boolean }) {
  return (
    <div className="h-96">
      <Sidebar defaultOpen={defaultOpen}>
        <SidebarItem icon={Home} label="Главная" active />
        <SidebarGroup value="payments" icon={Landmark} label="Платежи">
          <SidebarItem label="СБП" nested />
          <SidebarItem label="QR-коды СБП" nested />
        </SidebarGroup>
        <SidebarItem icon={CreditCard} label="Карты" />
        <SidebarItem icon={Settings} label="Настройки" />
      </Sidebar>
    </div>
  )
}

const meta = {
  title: "Navigation/Sidebar",
  component: DemoSidebar,
  parameters: { layout: "padded" },
} satisfies Meta<typeof DemoSidebar>

export default meta
type Story = StoryObj<typeof meta>

export const Expanded: Story = {
  args: { defaultOpen: true },
}

export const Collapsed: Story = {
  args: { defaultOpen: false },
}

function ControlledSidebar() {
  const [open, setOpen] = useState(false)
  const [expanded, setExpanded] = useState<string[]>([])
  return (
    <div className="h-96">
      <Sidebar
        open={open}
        onOpenChange={setOpen}
        expandedGroups={expanded}
        onExpandedGroupsChange={setExpanded}
      >
        <SidebarItem icon={Home} label="Главная" />
        <SidebarGroup value="payments" icon={Landmark} label="Платежи">
          <SidebarItem label="СБП" nested />
          <SidebarItem label="QR-коды СБП" nested />
        </SidebarGroup>
      </Sidebar>
    </div>
  )
}

export const CollapsedGroupClickExpandsRail: Story = {
  name: "Collapsed rail: clicking a group opens + pre-expands it",
  render: () => <ControlledSidebar />,
}
