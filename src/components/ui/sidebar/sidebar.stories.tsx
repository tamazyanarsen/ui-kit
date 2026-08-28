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

/* Свойства компонент-сета `ELK / sidebar`: Open, State, Show Text
   (Icon / Text / Select) и Value — количество пунктов, 2…10. Раньше в
   контролах были только Open и пара булевых: ни число пунктов, ни режим
   подписи переключить было нельзя, хотя это основные оси компонента.
   Sidebar собирается из детей, поэтому контролы синтетические. */
const ITEM_POOL = [
  { value: "main", icon: Briefcase, label: "Главная" },
  { value: "payments", icon: Coins, label: "Платежи", group: true },
  { value: "cards", icon: Wallet, label: "Карты" },
  { value: "settings", icon: Settings, label: "Настройки" },
  { value: "accounts", icon: Wallet, label: "Счета" },
  { value: "deposits", icon: Coins, label: "Депозиты" },
  { value: "letters", icon: Briefcase, label: "Письма в банк" },
  { value: "reports", icon: Settings, label: "Отчёты" },
  { value: "help", icon: Briefcase, label: "Помощь" },
  { value: "more", icon: Settings, label: "Ещё" },
]

interface DemoSidebarProps {
  defaultOpen?: boolean
  activeItem?: boolean
  expandGroup?: boolean
  itemsCount?: number
}

/* Дизайн-чек 3/3 №22: «при смене контролов Open и Show Text Select ничего
   не происходит». Оба значения уходили в `defaultOpen` / `defaultExpandedGroups`,
   а их читают только при монтировании — на уже отрисованной панели
   переключение контрола ничего не меняло. Держим оба состояния локально и
   синхронизируем с пропом, когда контрол поменяли: панель по-прежнему можно
   свернуть/развернуть мышью, но контрол теперь тоже работает. */
function DemoSidebar({
  defaultOpen = true,
  activeItem = true,
  expandGroup = false,
  itemsCount = 4,
}: DemoSidebarProps) {
  const [open, setOpen] = useState(defaultOpen)
  const [lastOpen, setLastOpen] = useState(defaultOpen)
  if (defaultOpen !== lastOpen) {
    setLastOpen(defaultOpen)
    setOpen(defaultOpen)
  }

  const [expanded, setExpanded] = useState<string[]>(
    expandGroup ? ["payments"] : []
  )
  const [lastExpand, setLastExpand] = useState(expandGroup)
  if (expandGroup !== lastExpand) {
    setLastExpand(expandGroup)
    setExpanded(expandGroup ? ["payments"] : [])
  }

  return (
    <div className="h-96">
      <Sidebar
        open={open}
        onOpenChange={setOpen}
        expandedGroups={expanded}
        onExpandedGroupsChange={setExpanded}
      >
        {ITEM_POOL.slice(0, itemsCount).map((item, index) =>
          item.group ? (
            <SidebarGroup
              key={item.value}
              value={item.value}
              icon={item.icon}
              label={item.label}
            >
              <SidebarItem label="СБП" nested />
              <SidebarItem label="QR-коды СБП" nested />
            </SidebarGroup>
          ) : (
            <SidebarItem
              key={item.value}
              icon={item.icon}
              label={item.label}
              active={index === 0 && activeItem}
            />
          )
        )}
      </Sidebar>
    </div>
  )
}

const meta = {
  title: "Компоненты/Sidebar",
  component: DemoSidebar,
  parameters: { layout: "padded" },
  // `DemoSidebar` is declared locally in this file rather than imported from
  // a component module, so react-docgen-typescript doesn't extract its props
  // — declare every control explicitly.
  argTypes: {
    // `Open` в макете: развёрнутая панель показывает подписи, свёрнутая —
    // только иконки (`Show Text=Icon` против `Text`).
    defaultOpen: { control: "boolean", name: "Open" },
    itemsCount: {
      name: "Value (пунктов)",
      control: { type: "range", min: 2, max: ITEM_POOL.length, step: 1 },
    },
    activeItem: { control: "boolean", name: "State: Active" },
    expandGroup: { control: "boolean", name: "Show Text: Select (раскрытая группа)" },
  },
  args: { defaultOpen: true, activeItem: true, expandGroup: false, itemsCount: 4 },
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
