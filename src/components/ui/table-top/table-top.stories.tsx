import { useState } from "react"

import { StorySection, StoryShowcase } from "@/stories/matrix"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { Menu as MenuPrimitive } from "@base-ui/react/menu"
import { ChevronDown, Search, Settings as Settings2, X } from "@/icons"

import {
  TableTop,
  TableTopTitle,
  TableTopToolbar,
  TableTopSummary,
  TableTopSummaryItem,
  TableTopDetails,
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

/* `Number of Chips` — свойство `Group Chips (ELK)` (1…12+). Раньше в
   истории было жёстко два фильтра, и проверить, как панель ведёт себя при
   переполнении, было негде. */
const CHIP_LABELS = [
  "Статус",
  "Менеджер",
  "Валюта",
  "Тип операции",
  "Организация",
  "Период",
  "Счёт",
  "Контрагент",
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

interface FullExampleProps {
  title?: string
  showTitleAction?: boolean
  showTabs?: boolean
  showSearch?: boolean
  showFilters?: boolean
  chipsCount?: number
  showActions?: boolean
  showDetails?: boolean
}

function FullExample({
  title = "Заголовок таблицы",
  showTitleAction = true,
  showTabs = true,
  showSearch = true,
  showFilters = true,
  chipsCount = 2,
  showActions = true,
  showDetails = true,
}: FullExampleProps = {}) {
  const [tab, setTab] = useState("all")
  const [search, setSearch] = useState("")
  const [moreOpen, setMoreOpen] = useState(false)
  const [values, setValues] = useState<Record<string, string | null>>({})
  // Первый чип виден всегда, остальные раскрываются кнопкой «Ещё фильтры» —
  // так же, как в макете.
  const chips = CHIP_LABELS.slice(0, chipsCount)
  const visibleChips = moreOpen ? chips : chips.slice(0, 1)
  const appliedCount = Object.values(values).filter(Boolean).length

  return (
    <TableTop>
      <TableTopTitle
        title={title}
        action={
          showTitleAction ? (
            <Button variant="secondary-grey" size="sm">
              Button
            </Button>
          ) : undefined
        }
      />
      {showTabs && <Tabs items={TABS} value={tab} onValueChange={setTab} />}
      <TableTopToolbar>
        {/* Figma's search field is a fixed 260px column inside the filter
            row; Input's own root is always w-full, so the width lives on a
            wrapper. */}
        {showSearch && (
        <div className="w-[260px]">
          <Input
            size="sm"
            iconLeft={<Search aria-hidden="true" />}
            placeholder="Поиск по нескольким крит..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        )}
        {showFilters &&
          visibleChips.map((label) => (
            <Filter
              key={label}
              label={label}
              value={values[label] ?? null}
              onValueChange={(next) =>
                setValues((prev) => ({ ...prev, [label]: next }))
              }
              chip
            />
          ))}
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
            onClick={() => setValues({})}
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
          showActions ? (
            <>
              <DownloadMenu />
              <Button variant="secondary-grey" size="sm" icon={Settings2} iconPosition="left">
                Настроить столбцы
              </Button>
            </>
          ) : undefined
        }
      />
      {/* "Сводка" — the Details slot at the bottom of `ELK / table-top`
          (node 70279:10367). Optional: "Дополнительная функция, наличие
          определяется при разработке конкретного продукта". */}
      {showDetails && (
        <TableTopDetails
          items={[
            { label: "Кешбэк", value: "17 шт" },
            { label: "Поступления", value: "15 шт" },
            { label: "Сумма операций", value: "40 500 000,00 ₽" },
          ]}
        />
      )}
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

/* Table Top is a slot container (title / toolbar / summary), not a
   prop-driven component — it has no props of its own beyond `children`.
   The Playground's controls therefore switch the *slots* on and off, which
   is the only variant axis the component actually has. */
const meta = {
  title: "Компоненты/Table Top",
  component: FullExample,
  parameters: { layout: "padded" },
  argTypes: {
    title: { control: "text" },
    showTitleAction: { control: "boolean" },
    showTabs: { control: "boolean" },
    showSearch: { control: "boolean" },
    showFilters: { control: "boolean" },
    chipsCount: {
      name: "Number of Chips",
      control: { type: "range", min: 1, max: CHIP_LABELS.length, step: 1 },
      description: "Сколько фильтров-чипов в панели; лишние скрыты под «Ещё фильтры»",
    },
    showActions: { control: "boolean" },
    showDetails: { control: "boolean" },
  },
  args: {
    title: "Заголовок таблицы",
    showTitleAction: true,
    showTabs: true,
    showSearch: true,
    showFilters: true,
    chipsCount: 2,
    showActions: true,
    showDetails: true,
  },
} satisfies Meta<FullExampleProps>

export default meta
type Story = StoryObj<FullExampleProps>

export const Playground: Story = {}

export const Examples: Story = {
  name: "Варианты использования",
  parameters: { layout: "fullscreen", controls: { disable: true } },
  render: () => (
    <StoryShowcase>
      <StorySection
        title="Полная сборка"
        description="Заголовок, вкладки, поиск, фильтры и кнопки действий."
      >
        <div className="w-full">
          <FullExample />
        </div>
      </StorySection>

      <StorySection
        title="Строка итогов с сортировкой"
        description="Label и Value отличаются только цветом — оба P2 Medium."
      >
        <div className="w-full">
          <SortSummaryExample />
        </div>
      </StorySection>

      <StorySection
        title="Сводка (Details)"
        description="Лента «label: value» с разделителями Grey 166; при переполнении прокручивается по горизонтали независимо от таблицы."
      >
        <div className="w-full">
          <TableTop>
            <TableTopDetails
              items={[
                { label: "Кешбэк", value: "17 шт" },
                { label: "Поступления", value: "15 шт" },
                { label: "Сумма операций", value: "40 500 000,00 ₽" },
                { label: "Сумма параметра №1", value: "1 500 000,00 ₽" },
                { label: "Сумма параметра №2", value: "500 000,00 ₽" },
              ]}
            />
          </TableTop>
        </div>
      </StorySection>

      <StorySection
        title="Только заголовок"
        description="Table Top — прозрачный блок с одной нижней линией, не карточка."
      >
        <div className="w-full">
          <TableTop>
            <TableTopTitle title="Сотрудники" />
          </TableTop>
        </div>
      </StorySection>
    </StoryShowcase>
  ),
}
