import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
// Icons named for the glyph they actually are — the previous aliases
// (`Briefcase as Home`, `Wallet as Landmark`) described icons this set
// doesn't contain, which made the story look like it used glyphs it never
// rendered.
import { Briefcase, Coins, Settings, Wallet } from "@/icons"

import { Sidebar } from "./sidebar"
import { SidebarItem, SidebarGroup } from "./item"

function DemoSidebar({ defaultOpen = true }: { defaultOpen?: boolean }) {
  return (
    <div className="h-96">
      <Sidebar defaultOpen={defaultOpen}>
        <SidebarItem icon={Briefcase} label="Главная" active />
        <SidebarGroup value="payments" icon={Coins} label="Платежи">
          <SidebarItem label="СБП" nested />
          <SidebarItem label="QR-коды СБП" nested />
        </SidebarGroup>
        <SidebarItem icon={Wallet} label="Карты" />
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

function ControlledSidebar({ defaultOpen = false }: { defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen)
  const [expanded, setExpanded] = useState<string[]>([])
  return (
    <div className="h-96">
      <Sidebar
        open={open}
        onOpenChange={setOpen}
        expandedGroups={expanded}
        onExpandedGroupsChange={setExpanded}
      >
        <SidebarItem icon={Briefcase} label="Главная" />
        <SidebarGroup value="payments" icon={Coins} label="Платежи">
          <SidebarItem label="СБП" nested />
          <SidebarItem label="QR-коды СБП" nested />
        </SidebarGroup>
      </Sidebar>
    </div>
  )
}

export const CollapsedGroupClickExpandsRail: Story = {
  name: "Collapsed rail: clicking a group opens + pre-expands it",
  args: { defaultOpen: false },
  render: (args) => <ControlledSidebar {...args} />,
}
