import * as React from "react"
import { Menu as MenuPrimitive } from "@base-ui/react/menu"
import { ChevronDown, Search, Settings as Settings2, X } from "@/icons"

import {
  TableTop,
  TableTopTitle,
  TableTopToolbar,
  TableTopSummary,
  TableTopSummaryItem,
} from "@/components/ui/table-top"
import { Tabs, type TabItem } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Filter } from "@/components/ui/filter"
import { Button } from "@/components/ui/button"
import { CountButton } from "@/components/ui/count-button"
import { ButtonMenuOverflowItem } from "@/components/ui/button-menu"
import { Dropdown } from "@/components/ui/dropdown"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  AccordionItem,
  AccordionTrigger,
  AccordionPanel,
} from "@/components/ui/accordion"

import { RowLabel } from "./shared"

const TABS: TabItem[] = [
  { value: "all", label: "Все" },
  { value: "open", label: "Открытые" },
  { value: "closed", label: "Закрытые" },
]

const SORT_OPTIONS = [
  { value: "desc", label: "По убыванию" },
  { value: "asc", label: "По возрастанию" },
]

// "Скачать" — a labeled dropdown trigger (Button + Menu), distinct from
// `ButtonMenuOverflow` (which is fixed to an icon-only "..." trigger) — the
// spec's own anatomy shows this as a text button with a PDF/XLSX list.
function DownloadMenu() {
  return (
    <MenuPrimitive.Root modal={false}>
      <MenuPrimitive.Trigger
        render={
          <Button
            variant="secondary-grey"
            size="sm"
            icon={ChevronDown}
            iconPosition="right"
          >
            Скачать
          </Button>
        }
      />
      <MenuPrimitive.Portal>
        <MenuPrimitive.Positioner
          side="bottom"
          align="end"
          sideOffset={8}
          className="isolate z-50"
        >
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

// Filter Setting variant — "Выбрано фильтров / Результатов" + Скачать /
// Настроить столбцы.
function TableTopFilterSettingExample() {
  const [tab, setTab] = React.useState("all")
  const [search, setSearch] = React.useState("")
  const [status, setStatus] = React.useState<string | null>(null)
  const [moreOpen, setMoreOpen] = React.useState(false)
  const [manager, setManager] = React.useState<string | null>(null)

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
      <Tabs items={TABS} value={tab} onValueChange={setTab} />
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
        {moreOpen && (
          <Filter
            label="Менеджер"
            value={manager}
            onValueChange={setManager}
            chip
          />
        )}
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

// Filter Select variant — same info line, but the right slot is a sort
// Select ("По убыванию") instead of Скачать/Настроить столбцы.
function TableTopFilterSelectExample() {
  const [sort, setSort] = React.useState<string | null>("desc")

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

function TableTopDemo() {
  return (
    <AccordionItem value="table-top">
      <AccordionTrigger>Table Top</AccordionTrigger>
      <AccordionPanel>
        <div className="flex flex-col gap-2">
          <RowLabel>
            Полная сборка — Title + Button, Tabs, поиск + Filter(chip) +
            «Ещё фильтры»/«Сбросить фильтры», строка «Выбрано фильтров /
            Результатов» + Скачать / Настроить столбцы
          </RowLabel>
          <TableTopFilterSettingExample />
        </div>

        <div className="mt-8 flex flex-col gap-2">
          <RowLabel>Filter Select — правый слот с сортировкой вместо Скачать</RowLabel>
          <TableTopFilterSelectExample />
        </div>
      </AccordionPanel>
    </AccordionItem>
  )
}

export { TableTopDemo }
