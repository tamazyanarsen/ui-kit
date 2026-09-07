import { useMemo, useState } from "react"

import { Pencil } from "@/icons"
import { BankCard } from "@/components/ui/bank-card"
import { Button } from "@/components/ui/button"
import { Filter } from "@/components/ui/filter"
import { Input } from "@/components/ui/input"
import { ItemInformationField } from "@/components/ui/item-information-field"
import { Pagination } from "@/components/ui/pagination"
import { ProgressBar } from "@/components/ui/progress-bar"
import { SelectionButton } from "@/components/ui/selection-button"
import { DataTable, type TableSort } from "@/components/ui/table"
import {
  TableTop,
  TableTopSummary,
  TableTopSummaryItem,
  TableTopToolbar,
} from "@/components/ui/table-top"
import { TitleCard } from "@/components/ui/title"
import { useToast } from "@/components/ui/toast-message"

import {
  SandboxBlock,
  SandboxColumns,
  SandboxPage,
  SandboxSection,
  money,
} from "../../shell"

import { CARD_LIMITS, OPERATIONS, OPERATION_FIELDS } from "./data"

// D7. «Деталка бизнес-карты» — инстанс конструктора 70371:25281.
//
// ⚠️ Единственный экран пачки, где УЗКАЯ колонка стоит СЛЕВА: 584 + 24 +
// 1192, то есть пролёты 4 и 8. На остальных двухколоночных экранах узкая
// колонка справа, поэтому здесь это отдельно оговорено — иначе при следующей
// правке шелла её «поправят» под общий вид.
//
// Шкалы лимитов собраны по правилу кита, а не по рисунку: эталон в этом
// блоке разъехался сам с собой (подписи наезжают на полосы, а полностью
// израсходованный лимит нарисован полной полосой рядом с «Осталось 0,00 ₽»).
// Здесь полоса показывает ИЗРАСХОДОВАННУЮ долю, а цвет берётся правилом
// `timelineColorForValue` — 0…50 зелёный, 50…99 жёлтый, 100 красный, — то
// есть тем самым, что документация кита и описывает.

const CHIPS = ["Вид операции", "Дата операции", "Статус"]
const PAGE_SIZE_DEFAULT = 25

function BusinessCardDetail() {
  const toast = useToast()

  const [search, setSearch] = useState("")
  const [chips, setChips] = useState<Record<string, string | null>>({})
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(PAGE_SIZE_DEFAULT)
  const [sort, setSort] = useState<TableSort>({ key: "date", direction: "desc" })

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()
    return OPERATIONS.filter((row) => {
      if (query && !row.operation.toLowerCase().includes(query)) return false
      const byKind = chips["Вид операции"]
      if (byKind && !row.operation.toLowerCase().includes(byKind.toLowerCase())) {
        return false
      }
      const byDate = chips["Дата операции"]
      if (byDate && !row.date.includes(byDate)) return false
      return true
    })
  }, [chips, search])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const safePage = Math.min(page, totalPages)
  const pageRows = filtered.slice((safePage - 1) * pageSize, safePage * pageSize)
  const appliedCount = Object.values(chips).filter(Boolean).length

  return (
    <SandboxPage
      activeSection="business-cards"
      title={
        <TitleCard
          title="Бизнес-карта Оплата расходов · 0835"
          helpLabel={null}
          onBack={() => {}}
          tag="Ограничения"
          tagColor="orange"
        />
      }
    >
      <SandboxColumns widths={[4, 8]}>
        <SandboxBlock>
          <SandboxSection title="О карте" gap={24}>
            <BankCard
              skin="black-classic"
              paymentSystem="mir"
              last4="4498"
              balance={money(1_200_101.16)}
              showBalance
            />

            <div className="flex flex-col">
              <ItemInformationField
                label="Номер"
                value="1234 56·· ···· 0835"
                divider
              />
              <ItemInformationField
                label="Срок действия"
                value="07 / 2030"
                divider
              />
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <Button variant="secondary-grey">Экспорт операций</Button>
              <Button variant="secondary-grey">Перейти к счёту карты</Button>
              <SelectionButton
                items={[
                  { text: "Переименовать" },
                  { text: "Перевыпустить" },
                  {
                    text: "Заблокировать",
                    onSelect: () =>
                      toast.add({
                        type: "attention",
                        title: "Карта заблокирована",
                        description: "Бизнес-карта Оплата расходов · 0835",
                      }),
                  },
                  { text: "Закрыть карту" },
                ]}
              />
            </div>
          </SandboxSection>
        </SandboxBlock>

        <div className="flex flex-col gap-6">
          <SandboxBlock>
            <SandboxSection title="Основная информация" gap={0}>
              <ItemInformationField
                label="Счёт"
                value="40702 810 7 00590062544"
                subText="Карточный"
                copyable
                divider
              />
              <ItemInformationField
                label="Тип карты"
                value="MIR Classic Business"
                subText="Персонализированная"
                divider
              />
              <ItemInformationField
                label="Держатель"
                value="КОНСТАНТИНОПОЛЬСКИЙ КОНСТАНТИН КОНСТАНТИНОВИЧ"
                divider
              />
            </SandboxSection>
          </SandboxBlock>

          <SandboxBlock>
            <SandboxSection
              title="Лимиты"
              action={
                <Button
                  variant="secondary-grey"
                  size="sm"
                  icon={Pencil}
                  iconPosition="left"
                >
                  Настроить
                </Button>
              }
            >
              {CARD_LIMITS.map((limit) => (
                <ProgressBar
                  key={limit.title}
                  variant="timeline"
                  title={limit.title}
                  showDescription={false}
                  value={(limit.spent / limit.total) * 100}
                  subtitle={`Осталось ${money(limit.total - limit.spent)}`}
                  statusDescription={`из ${money(limit.total)}`}
                />
              ))}
            </SandboxSection>
          </SandboxBlock>

          <SandboxBlock padding={0}>
            <div className="px-8 pt-8">
              <SandboxSection title="История операций" gap={0} />
            </div>
            <TableTop>
              <TableTopToolbar>
                <div className="w-[260px]">
                  <Input
                    size="sm"
                    placeholder="Операция"
                    value={search}
                    onChange={(event) => {
                      setSearch(event.target.value)
                      setPage(1)
                    }}
                  />
                </div>
                {CHIPS.map((label) => (
                  <Filter
                    key={label}
                    chip
                    label={label}
                    value={chips[label] ?? null}
                    onValueChange={(next) => {
                      setChips((prev) => ({ ...prev, [label]: next }))
                      setPage(1)
                    }}
                  />
                ))}
              </TableTopToolbar>
              <TableTopSummary
                info={
                  <>
                    <TableTopSummaryItem
                      label="Выбрано фильтров:"
                      value={appliedCount}
                    />
                    <TableTopSummaryItem
                      label="Результатов:"
                      value={filtered.length}
                    />
                  </>
                }
              />
            </TableTop>

            {/* Сортировка задана явно. Без неё таблица берёт первый
                сортируемый столбец ПО ВОЗРАСТАНИЮ, и история операций
                открывалась самой старой записью — для выписки это ровно
                наоборот. */}
            <DataTable
              fields={OPERATION_FIELDS}
              rows={pageRows}
              sort={sort}
              onSortChange={setSort}
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
          </SandboxBlock>
        </div>
      </SandboxColumns>
    </SandboxPage>
  )
}

export { BusinessCardDetail }
