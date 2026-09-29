import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
// Значки названы по тому глифу, которым они на самом деле являются:
// прежние псевдонимы (`Briefcase as Home`, `Wallet as Landmark`) описывали
// значки, которых в этом наборе нет, и из-за этого стори выглядела так,
// будто использует глифы, которые никогда не рисовала.
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

/* Подписи для строки состояния под панелью: значение активного пункта
   само по себе ни о чём не говорит, а вложенным нужны свои названия. */
const ACTIVE_LABELS: Record<string, string> = {
  ...Object.fromEntries(ITEM_POOL.map((item) => [item.value, item.label])),
  sbp: "СБП",
  qr: "QR-коды СБП",
}

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

  // Активный пункт живёт здесь: клик по пункту (и Enter на нём) переносит
  // выделение. Контрол `State: Active` задаёт начальный: главная или никакой.
  const [active, setActive] = useState<string | null>(activeItem ? "main" : null)
  const [lastActiveItem, setLastActiveItem] = useState(activeItem)
  if (activeItem !== lastActiveItem) {
    setLastActiveItem(activeItem)
    setActive(activeItem ? "main" : null)
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
    <div className="flex h-96 flex-col">
      <div className="min-h-0 flex-1">
        <Sidebar
          open={open}
          onOpenChange={setOpen}
          expandedGroups={expanded}
          onExpandedGroupsChange={setExpanded}
        >
          {ITEM_POOL.slice(0, itemsCount).map((item) =>
            item.group ? (
              <SidebarGroup
                key={item.value}
                value={item.value}
                icon={item.icon}
                label={item.label}
                active={active === "sbp" || active === "qr"}
              >
                <SidebarItem
                  label="СБП"
                  nested
                  active={active === "sbp"}
                  onClick={() => setActive("sbp")}
                />
                <SidebarItem
                  label="QR-коды СБП"
                  nested
                  active={active === "qr"}
                  onClick={() => setActive("qr")}
                />
              </SidebarGroup>
            ) : (
              <SidebarItem
                key={item.value}
                icon={item.icon}
                label={item.label}
                active={active === item.value}
                onClick={() => setActive(item.value)}
              />
            )
          )}
        </Sidebar>
      </div>
      <p
        data-slot="story-status"
        className="mt-2 text-p3-medium text-[var(--nav-sidebar-fg)]"
      >
        Активный пункт: {ACTIVE_LABELS[active ?? ""] ?? "нет"}
      </p>
    </div>
  )
}

const meta = {
  title: "Компоненты/Sidebar",
  component: DemoSidebar,
  parameters: { layout: "padded" },
  // `DemoSidebar` объявлен локально в этом файле, а не импортирован из
  // модуля компонента, поэтому react-docgen-typescript не извлекает его
  // пропсы — объявляем каждый контрол явно.
  /* Панель повторяет свойства мастеров с канваса Header: у
     `ELK / sidebar` единственная ось `Open`, число пунктов — свойство
     `Value` вложенного `Sidebar Menu (ELK)`, а состояние и раскрытая
     группа — оси `Sidebar Item (ELK)`: State и Show Text. */
  argTypes: {
    // `Open` в макете: развёрнутая панель показывает подписи, свёрнутая —
    // только иконки (`Show Text=Icon` против `Text`).
    defaultOpen: { control: "boolean", name: "Open" },
    itemsCount: {
      name: "Value",
      control: { type: "range", min: 2, max: ITEM_POOL.length, step: 1 },
      description: "Свойство Value вложенного сета Sidebar Menu (ELK): 2 — 10",
    },
    activeItem: {
      control: "boolean",
      name: "State: Active",
      table: { category: "Sidebar Item (ELK)" },
    },
    expandGroup: {
      control: "boolean",
      name: "Show Text: Select",
      description: "Раскрытая группа — третье значение оси Show Text",
      table: { category: "Sidebar Item (ELK)" },
    },
  },
  args: { defaultOpen: true, itemsCount: 4, activeItem: true, expandGroup: false },
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

/* Боковая панель — это полоса во всю высоту, и две её формы (свёрнутая
   56px против развёрнутой) разложены рядом, а не ячейками матрицы. */
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
