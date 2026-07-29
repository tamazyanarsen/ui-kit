import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { Menu as MenuPrimitive } from "@base-ui/react/menu"
import { ChevronDown, Search, Settings2, X } from "lucide-react"

import { TableTop, TableTopTitle, TableTopToolbar, TableTopSummary } from "./table-top"
import { Tabs, type TabItem } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Filter } from "@/components/ui/filter"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ButtonMenuOverflowItem } from "@/components/ui/button-menu"
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
            className="min-w-40 origin-(--transform-origin) rounded-2xl bg-white p-2 shadow-lg ring-1 ring-foreground/10 outline-none data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95"
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
      <TableTopTitle title="Заголовок таблицы" action={<Button size="sm">Button</Button>} />
      <Tabs items={TABS} value={tab} onValueChange={setTab} size="md" />
      <TableTopToolbar>
        <Input
          size="sm"
          iconLeft={<Search aria-hidden="true" />}
          placeholder="Поиск по нескольким крит..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          containerClassName="w-56"
        />
        <Filter label="Статус" value={status} onValueChange={setStatus} chip />
        {moreOpen && <Filter label="Менеджер" value={manager} onValueChange={setManager} chip />}
        <Button
          variant="secondary-grey"
          size="sm"
          icon={ChevronDown}
          iconPosition="left"
          onClick={() => setMoreOpen((v) => !v)}
        >
          {moreOpen ? "Скрыть фильтры" : "Ещё фильтры"}
          <Badge type="counter" value={appliedCount} color="light-grey" />
        </Button>
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
            <span>
              Выбрано фильтров: <strong>{appliedCount}</strong>
            </span>
            <span>
              Результатов: <strong>8</strong>
            </span>
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
            <span>
              Выбрано фильтров: <strong>0</strong>
            </span>
            <span>
              Результатов: <strong>8</strong>
            </span>
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
  title: "UI/TableTop",
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
