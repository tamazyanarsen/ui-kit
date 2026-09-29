import { useEffect, useMemo, useState } from "react"

import { Plus } from "@/icons"
import { Button } from "@/components/ui/button"
import { ButtonMenuBlack } from "@/components/ui/button-menu"
import { EMPTY_FILTERED, EmptySearchResults } from "@/components/ui/empty-search"
import { Pagination } from "@/components/ui/pagination"
import {
  DataTable,
  TableBlock,
  columnsFromFields,
  sortTableRows,
  type TableSort,
} from "@/components/ui/table"
import { Tabs } from "@/components/ui/tabs"
import { TitleRegistry } from "@/components/ui/title"
import { TopFixedMessage } from "@/components/ui/top-fixed-message"
import { useToast } from "@/components/ui/toast-message"

import { SandboxPage, money } from "../../shell"

import { amountQuery, matchesAmount } from "./amount-filter"
import { LETTERS_OF_CREDIT, STATUS_LABELS } from "./data"
import { LETTER_FIELDS } from "./fields"
import { visibleSort } from "./sort"
import { LettersTableHeader } from "./table-header"

/** «2026-03-05» → «05.03.2026» — без `Date`, чтобы не зависеть от пояса. */
function ruDate(iso: string) {
  const [year, month, day] = iso.split("-")
  return `${day}.${month}.${year}`
}

// D2. «Реестр заявок на аккредитив» — инстанс конструктора.
//
// Самый плотный табличный экран пачки и главный носитель разделов B1–B3
// документа. Живьём здесь работает всё, что там описано: отбор чипами и
// поиском, сортировка, выбор строк на СТРАНИЦЕ и отдельная кнопка «Выбрать
// на всех страницах (N)» с живым счётчиком и суммой, которая исчезает,
// когда выбрано уже всё.
//
// Разделение обязанностей выбора — не деталь реализации, а требование
// документа: чекбокс шапки берёт видимые строки, кнопка чёрной панели —
// весь отбор целиком, включая другие страницы.

const PAGE_SIZE_DEFAULT = 25

function LettersOfCreditScreen() {
  const toast = useToast()

  const [tab, setTab] = useState("requests")
  const [search, setSearch] = useState("")
  const [chips, setChips] = useState<Record<string, string | null>>({})
  const [selected, setSelected] = useState<string[]>([])
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(PAGE_SIZE_DEFAULT)
  const [ownSort, setSort] = useState<TableSort | null>(null)
  const [columns, setColumns] = useState(() => columnsFromFields(LETTER_FIELDS))
  const [messageOpen, setMessageOpen] = useState(true)

  // Тост «Заявка на аккредитив создана» нарисован прямо на эталоне — это
  // состояние экрана после возврата с формы, а не украшение, поэтому
  // показываем его при открытии истории.
  useEffect(() => {
    toast.add({
      type: "checked",
      title: "Заявка на аккредитив создана",
    })
    // Один раз на монтирование: `toast.add` стабилен, но в зависимостях он
    // всё равно перезапускал бы эффект на каждом рендере провайдера.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()
    return LETTERS_OF_CREDIT.filter((row) => {
      if (
        query &&
        ![row.number, row.kind, row.beneficiary, row.bank].some((text) =>
          text.toLowerCase().includes(query)
        )
      ) {
        return false
      }
      const byKind = chips["Вид аккредитива"]
      if (byKind && !row.kind.toLowerCase().includes(byKind.toLowerCase())) {
        return false
      }
      const byType = chips["Тип заявки"]
      if (
        byType &&
        !row.requestType.toLowerCase().includes(byType.toLowerCase())
      ) {
        return false
      }
      // Дата в данных — ISO «гггг-мм-дд», а в чип её вводят так, как видят в
      // колонке, — «дд.мм.гггг» (можно началом: «05.03»). Раньше этот чип
      // считался в «Выбрано фильтров», но отбор его не читал вовсе.
      const byDate = chips["Дата"]?.trim()
      if (byDate && !ruDate(row.date).startsWith(byDate)) {
        return false
      }
      const byStatus = chips["Статус"]
      if (
        byStatus &&
        !STATUS_LABELS[row.status].toLowerCase().includes(byStatus.toLowerCase())
      ) {
        return false
      }
      const byAmount = amountQuery(chips["Сумма"])
      if (byAmount && !matchesAmount(row.amount, byAmount)) return false
      return true
    })
  }, [chips, search])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const safePage = Math.min(page, totalPages)
  // Сортируется ВЕСЬ отбор, а страница режется потом: таблице уходит уже
  // вырезанная страница, и её собственная сортировка переставляла бы строки
  // только внутри неё.
  const sort = useMemo(
    () => visibleSort(LETTER_FIELDS, ownSort, columns),
    [ownSort, columns]
  )
  const sorted = useMemo(
    () => sortTableRows(filtered, LETTER_FIELDS, sort),
    [filtered, sort]
  )
  const pageRows = sorted.slice((safePage - 1) * pageSize, safePage * pageSize)

  // Чип «Сумма» без единой цифры ничего не отбирает — и применённым не
  // считается.
  const appliedCount = Object.entries(chips).filter(([label, value]) =>
    label === "Сумма" ? amountQuery(value) !== null : Boolean(value)
  ).length
  // Сумма выбранного считается по ВСЕМУ отбору, а не по странице: кнопка
  // «Выбрать на всех страницах» кладёт в выбор ключи со всех страниц, и
  // панель обязана уметь их сложить.
  const selectedSum = useMemo(() => {
    const keys = new Set(selected)
    return filtered
      .filter((row) => keys.has(row.id))
      .reduce((sum, row) => sum + row.amount, 0)
  }, [filtered, selected])

  const allKeys = useMemo(() => filtered.map((row) => row.id), [filtered])

  function resetPaging() {
    setPage(1)
    setSelected([])
  }

  return (
    <SandboxPage
      activeSection="letters-of-credit"
      notifications={
        messageOpen && (
          <TopFixedMessage
            type="red"
            text="У вас истекает срок действия полномочий в некоторых организациях. Доступ к личному кабинету будет ограничен"
            showButton
            buttonLabel="Подробнее"
            showIconClose
            onClose={() => setMessageOpen(false)}
          />
        )
      }
      title={
        <TitleRegistry
          title="Аккредитивы"
          helpLabel={null}
          actions={
            <Button variant="primary" size="sm" icon={Plus} iconPosition="left">
              Создать заявку на аккредитив
            </Button>
          }
        />
      }
      additional={
        <Tabs
          items={[
            { value: "all", label: "Все аккредитивы" },
            { value: "requests", label: "Заявки" },
          ]}
          showMore={false}
          value={tab}
          onValueChange={(next) => {
            setTab(next)
            resetPaging()
          }}
        />
      }
      bottomBar={
        selected.length > 0 ? (
          <ButtonMenuBlack
            info={[
              { label: "Выбрано", value: String(selected.length) },
              { label: "На сумму", value: money(selectedSum) },
            ]}
            selectAllPagesCount={allKeys.length}
            selectedCount={selected.length}
            onSelectAllPages={() => setSelected(allKeys)}
            onClose={() => setSelected([])}
          >
            <Button
              onClick={() =>
                toast.add({
                  type: "information",
                  title: `Отменено заявок: ${selected.length}`,
                  description: money(selectedSum),
                })
              }
            >
              Отменить заявку
            </Button>
          </ButtonMenuBlack>
        ) : undefined
      }
    >
      <TableBlock>
        <LettersTableHeader
          search={search}
          onSearchChange={(next) => {
            setSearch(next)
            resetPaging()
          }}
          chips={chips}
          onChipChange={(label, next) => {
            setChips((prev) => ({ ...prev, [label]: next }))
            resetPaging()
          }}
          onChipsReset={() => {
            setChips({})
            resetPaging()
          }}
          appliedCount={appliedCount}
          resultCount={filtered.length}
          columns={columns}
          onColumnsChange={setColumns}
        />

        <DataTable
          fields={LETTER_FIELDS}
          rows={pageRows}
          sort={sort}
          onSortChange={(next) => {
            setSort(next)
            setPage(1)
          }}
          manualSort
          // Страницу режет сам экран: расширение окна (размер страницы,
          // стёртый символ поиска) таблица приняла бы за новые строки.
          highlightAddedRows={false}
          columnSettings={columns}
          selectable
          selectedKeys={selected}
          onSelectedKeysChange={setSelected}
          resizable
          empty={
            <EmptySearchResults
              {...EMPTY_FILTERED}
              // Кнопка «Сбросить фильтры» под пустым результатом обязана
              // сбрасывать и поиск, и чипы — иначе она ничего не делает.
              onButtonClick={() => {
                setSearch("")
                setChips({})
                resetPaging()
              }}
            />
          }
        />

        <Pagination
          page={safePage}
          totalPages={totalPages}
          onPageChange={setPage}
          pageSize={pageSize}
          onPageSizeChange={(size) => {
            setPageSize(size)
            setPage(1)
          }}
        />
      </TableBlock>
    </SandboxPage>
  )
}

export { LettersOfCreditScreen }
