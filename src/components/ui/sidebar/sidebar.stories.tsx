import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
// Icons named for the glyph they actually are — the previous aliases
// (`Briefcase as Home`, `Wallet as Landmark`) described icons this set
// doesn't contain, which made the story look like it used glyphs it never
// rendered.
import { Briefcase, Coins, Settings, Wallet } from "@/icons"

import { StorySection, StoryShowcase } from "@/stories/matrix"

import { Sidebar } from "./sidebar"
import { SidebarItem, SidebarGroup } from "./item"

interface DemoSidebarProps {
  defaultOpen?: boolean
  activeItem?: boolean
  expandGroup?: boolean
}

function DemoSidebar({
  defaultOpen = true,
  activeItem = true,
  expandGroup = false,
}: DemoSidebarProps) {
  return (
    <div className="h-96">
      <Sidebar
        defaultOpen={defaultOpen}
        defaultExpandedGroups={expandGroup ? ["payments"] : []}
      >
        <SidebarItem icon={Briefcase} label="Главная" active={activeItem} />
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
  // `DemoSidebar` is declared locally in this file rather than imported from
  // a component module, so react-docgen-typescript doesn't extract its props
  // — declare every control explicitly.
  argTypes: {
    defaultOpen: { control: "boolean" },
    activeItem: { control: "boolean" },
    expandGroup: { control: "boolean" },
  },
  args: { defaultOpen: true, activeItem: true, expandGroup: false },
} satisfies Meta<DemoSidebarProps>

export default meta
type Story = StoryObj<DemoSidebarProps>

export const Playground: Story = {}

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

/* The sidebar is a full-height rail whose two forms (56px collapsed vs
   expanded) are laid out side by side rather than as matrix cells. */
export const Examples: Story = {
  name: "Варианты использования",
  parameters: { layout: "fullscreen", controls: { disable: true } },
  render: () => (
    <StoryShowcase>
      <StorySection
        title="Развёрнутый и свёрнутый"
        description="Свёрнутая полоса — 56px, только иконки."
      >
        <div className="flex gap-8">
          <DemoSidebar defaultOpen />
          <DemoSidebar defaultOpen={false} />
        </div>
      </StorySection>

      <StorySection
        title="Раскрытая группа"
        description="Вложенные пункты появляются под родителем."
      >
        <DemoSidebar defaultOpen expandGroup />
      </StorySection>

      <StorySection
        title="Свёрнутая полоса: клик по группе"
        description="Разворачивает панель и сразу раскрывает нужную группу."
      >
        <ControlledSidebar />
      </StorySection>
    </StoryShowcase>
  ),
}
