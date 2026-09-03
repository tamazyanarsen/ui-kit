import { useState } from "react"

import { Menu as MenuPrimitive } from "@base-ui/react/menu"

import { ChevronDown, Search, Settings as Settings2, X } from "@/icons"

import {
  TableTop,
  TableTopTitle,
  TableTopToolbar,
  TableTopSummary,
  TableTopSummaryItem,
  TableTopDetails,
} from "@/components/ui/table-top"
import { Tabs, type TabItem } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Filter } from "@/components/ui/filter"
import { Button } from "@/components/ui/button"
import { CountButton } from "@/components/ui/count-button"
import { ButtonMenuOverflowItem } from "@/components/ui/button-menu"
import { Dropdown } from "@/components/ui/dropdown"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Собранная шапка таблицы для историй: все слоты разом, каждый —
// отдельным тумблером в Playground.

const TABS: TabItem[] = [
  { value: "all", label: "Все" },
  { value: "open", label: "Открытые" },
  { value: "closed", label: "Закрытые" },
]

/* `Number of Chips` — свойство `Chips Table` (1…16 по таблице свойств
   8503:20951). Раньше в истории было жёстко два фильтра, и проверить, как
   панель ведёт себя при переполнении, было негде. */
const CHIP_LABELS = [
  "Статус",
  "Менеджер",
  "Валюта",
  "Тип операции",
  "Организация",
  "Период",
  "Счёт",
  "Контрагент",
  "Подразделение",
  "Ategория",
  "Ответственный",
  "Источник",
  "Приоритет",
  "Регион",
  "Проект",
  "Договор",
]

/* Дизайн-чек 3/3 №25: «по многим компонентам внутри компонента table top
   недостаточно контролов отображения». Полный список свойств из макета
   (1246:196999) — четыре таблицы, по одной на вложенный блок:

     Table Top      — Show Title, Show Tab, Show Filter
     Title Options  — Show Button
     Chips Table    — Number of Chips (1–16), Show Search, Show Last Chips,
                      Show Clean Filter
     Filter Options — Type (Setting / Select), Show Filters, Show Select,
                      Show Setting, Show Download

   Раньше из них в контролах жили только пять, причём под своими именами
   («showActions» одним тумблером гасил и «Скачать», и «Настроить столбцы»,
   а «Ещё фильтры» и «Сбросить фильтры» не гасились вовсе). Ниже пропсы
   названы ровно как свойства в макете, чтобы список сходился один в один. */

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
  // Table Top
  title?: string
  showTitle?: boolean
  showTab?: boolean
  showFilter?: boolean
  // Title Options
  showButton?: boolean
  // Chips Table
  chipsCount?: number
  showSearch?: boolean
  showLastChips?: boolean
  showCleanFilter?: boolean
  // Filter Options (информационная строка)
  resultType?: "Setting" | "Select"
  showFilters?: boolean
  showSelect?: boolean
  showSetting?: boolean
  showDownload?: boolean
  // Собственный слот кита — «Сводка» внизу (70279:10367)
  showDetails?: boolean
}

function FullExample({
  title = "Заголовок таблицы",
  showTitle = true,
  showTab = true,
  showFilter = true,
  showButton = true,
  chipsCount = 2,
  showSearch = true,
  showLastChips = true,
  showCleanFilter = true,
  resultType = "Setting",
  showFilters = true,
  showSelect = false,
  showSetting = true,
  showDownload = true,
  showDetails = false,
}: FullExampleProps = {}) {
  const [tab, setTab] = useState("all")
  const [search, setSearch] = useState("")
  const [moreOpen, setMoreOpen] = useState(false)
  const [sort, setSort] = useState<string | null>("desc")
  const [values, setValues] = useState<Record<string, string | null>>({})
  // Первый чип виден всегда, остальные раскрываются кнопкой «Ещё фильтры» —
  // так же, как в макете.
  const chips = CHIP_LABELS.slice(0, chipsCount)
  const visibleChips = moreOpen ? chips : chips.slice(0, 1)
  const appliedCount = Object.values(values).filter(Boolean).length

  // `Type=Setting` — справа кнопки управления таблицей, `Type=Select` — поле
  // сортировки. По таблице свойств это одна ось, поэтому Select появляется
  // только во втором режиме.
  const settingMode = resultType === "Setting"
  const summaryActions = settingMode ? (
    <>
      {showDownload && <DownloadMenu />}
      {showSetting && (
        <Button variant="secondary-grey" size="sm" icon={Settings2} iconPosition="left">
          Настроить столбцы
        </Button>
      )}
    </>
  ) : showSelect ? (
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
  ) : undefined
  const hasSummaryActions = settingMode
    ? showDownload || showSetting
    : showSelect

  return (
    <TableTop>
      {showTitle && (
        <TableTopTitle
          title={title}
          action={
            showButton ? (
              <Button variant="secondary-grey" size="sm">
                Button
              </Button>
            ) : undefined
          }
        />
      )}
      {showTab && <Tabs items={TABS} value={tab} onValueChange={setTab} />}
      {/* Дизайн-чек 3/3 №24: «при отключении контрола show Filters кнопка
          "Ещё фильтры" должна тоже скрываться». Раньше под флагом были только
          сами чипы, а CountButton и «Сбросить фильтры» стояли снаружи и
          оставались висеть в пустой строке. Теперь `Show Filter` гасит всю
          строку фильтров целиком — как одно свойство `ELK / table-top`. */}
      {showFilter && (
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
          {visibleChips.map((label) => (
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
          {/* "Ещё фильтры" — `Show Last Chips` в макете; это `ELK / count
              button`, счётчик рисуется угловым бейджем, тёмным, а не красным. */}
          {showLastChips && (
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
          )}
          {showCleanFilter && appliedCount > 0 && (
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
      )}
      <TableTopSummary
        info={
          showFilters ? (
            <>
              <TableTopSummaryItem
                label="Выбрано фильтров:"
                value={appliedCount}
              />
              <TableTopSummaryItem label="Результатов:" value={8} />
            </>
          ) : undefined
        }
        actions={hasSummaryActions ? summaryActions : undefined}
      />
      {/* "Сводка" — the Details slot at the bottom of `ELK / table-top`
          (node 70279:10367).

          ⚠️ Умолчание — ВЫКЛЮЧЕНО, хотя в мастере Figma свойство
          `Show Summary` включено. Документация кита называет сводку
          «дополнительной функцией, наличие которой определяется при
          разработке конкретного продукта», и прямое правило документации
          сильнее правила «дефолт как в сете».

          (Сравните с кнопкой «Выбрать на всех страницах» у Button Menu
          Black — там умолчание, наоборот, снимается с сета: возможность,
          спрятанная по умолчанию, просто не находится. Разница ровно в
          том, что доки про неё такого не пишут.) */}
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

export { CHIP_LABELS, FullExample, SortSummaryExample }
export type { FullExampleProps }
