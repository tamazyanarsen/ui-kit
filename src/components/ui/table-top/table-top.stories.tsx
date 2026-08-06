import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { Menu as MenuPrimitive } from "@base-ui/react/menu"
import { ChevronDown, Search, Settings as Settings2, X } from "@/icons"

import {
  TableTop,
  TableTopTitle,
  TableTopToolbar,
  TableTopSummary,
  TableTopSummaryItem,
} from "./table-top"
import { Tabs, type TabItem } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Filter } from "@/components/ui/filter"
import { Button } from "@/components/ui/button"
import { CountButton } from "@/components/ui/count-button"
import { ButtonMenuOverflowItem } from "@/components/ui/button-menu"
import { Dropdown } from "@/components/ui/dropdown"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const TABS: TabItem[] = [
  { value: "all", label: "Все" },
  { value: "open", label: "Открытые" },
  { value: "closed", label: "Закрытые" },
]

const SORT_OPTIONS = [
  { value: "desc", label: "По убыванию" },
  { value: "asc", label: "По возрастанию" },
]

function DownloadMenu() {
  return (
    <MenuPrimitive.Root modal={false}>
      <MenuPrimitive.Trigger
        render={
          <Button variant="secondary-grey" size="sm" icon={ChevronDown} iconPosition="right">
            Скачать
          </Button>
        }
      />
      <MenuPrimitive.Portal>
        <MenuPrimitive.Positioner side="bottom" align="end" sideOffset={8} className="isolate z-50">
          <MenuPrimitive.Popup
            data-slot="table-top-download-content"
            render={<Dropdown className="min-w-40 overflow-hidden" />}
          >
            <ButtonMenuOverflowItem text="PDF" />
            <ButtonMenuOverflowItem text="XLSX" />
          </MenuPrimitive.Popup>
        </MenuPrimitive.Positioner>
      </MenuPrimitive.Portal>
    </MenuPrimitive.Root>
  )
}

function FullExample() {
  const [tab, setTab] = useState("all")
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState<string | null>(null)
  const [moreOpen, setMoreOpen] = useState(false)
  const [manager, setManager] = useState<string | null>(null)
  const appliedCount = [status, manager].filter(Boolean).length

  return (
    <TableTop>
      <TableTopTitle
        title="Заголовок таблицы"
        action={
          <Button variant="secondary-grey" size="sm">
            Button
          </Button>
        }
      />
      <Tabs items={TABS} value={tab} onValueChange={setTab} size="md" />
      <TableTopToolbar>
        {/* Figma's search field is a fixed 260px column inside the filter
            row; Input's own root is always w-full, so the width lives on a
            wrapper. */}
        <div className="w-[260px]">
          <Input
            size="sm"
            iconLeft={<Search aria-hidden="true" />}
            placeholder="Поиск по нескольким крит..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Filter label="Статус" value={status} onValueChange={setStatus} chip />
        {moreOpen && <Filter label="Менеджер" value={manager} onValueChange={setManager} chip />}
        {/* "Ещё фильтры" is an `ELK / count button` in the spec — the counter
            is a corner badge on the button, dark rather than red here. */}
        <CountButton
          variant="secondary-grey"
          size="sm"
          icon={ChevronDown}
          iconPosition="left"
          count={appliedCount}
          countColor="black"
          onClick={() => setMoreOpen((v) => !v)}
        >
          {moreOpen ? "Скрыть фильтры" : "Ещё фильтры"}
        </CountButton>
        {appliedCount > 0 && (
          <Button
            variant="secondary-grey"
            size="sm"
            icon={X}
            iconPosition="left"
            onClick={() => {
              setStatus(null)
              setManager(null)
            }}
          >
            Сбросить фильтры
          </Button>
        )}
      </TableTopToolbar>
      <TableTopSummary
        info={
          <>
            <TableTopSummaryItem
              label="Выбрано фильтров:"
              value={appliedCount}
            />
            <TableTopSummaryItem label="Результатов:" value={8} />
          </>
        }
        actions={
          <>
            <DownloadMenu />
            <Button variant="secondary-grey" size="sm" icon={Settings2} iconPosition="left">
              Настроить столбцы
            </Button>
          </>
        }
      />
    </TableTop>
  )
}

function SortSummaryExample() {
  const [sort, setSort] = useState<string | null>("desc")
  return (
    <TableTop>
      <TableTopSummary
        info={
          <>
            <TableTopSummaryItem label="Выбрано фильтров:" value={0} />
            <TableTopSummaryItem label="Результатов:" value={8} />
          </>
        }
        actions={
          <Select items={SORT_OPTIONS} value={sort} onValueChange={setSort}>
            <SelectTrigger size="sm">
              <SelectValue placeholder="Сортировка" />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        }
      />
    </TableTop>
  )
}

const meta = {
  title: "Content/Table/TableTop",
  component: FullExample,
  parameters: { layout: "padded" },
} satisfies Meta<typeof FullExample>

export default meta
type Story = StoryObj<typeof meta>

export const FullAssembly: Story = {}

export const SortSummary: Story = {
  name: "Summary row with sort Select",
  render: () => <SortSummaryExample />,
}
