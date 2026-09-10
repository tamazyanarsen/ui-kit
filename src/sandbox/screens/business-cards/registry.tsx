import { useMemo, useState } from "react"

import { X } from "@/icons"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { DataTable, TableBlock } from "@/components/ui/table"
import { EMPTY_FILTERED, EmptySearchResults } from "@/components/ui/empty-search"
import { Filter } from "@/components/ui/filter"
import { Pagination } from "@/components/ui/pagination"
import {
  TableTop,
  TableTopSummary,
  TableTopSummaryItem,
  TableTopToolbar,
} from "@/components/ui/table-top"
import { Tabs } from "@/components/ui/tabs"
import { TitleRegistry } from "@/components/ui/title"
import { useToast } from "@/components/ui/toast-message"

import { SandboxPage } from "../../shell"

import {
  BUSINESS_CARDS,
  CARD_STATUS_COLORS,
  CARD_STATUS_LABELS,
  OPERATIONS,
  OPERATION_FIELDS,
} from "./data"

// D6. «Реестр бизнес-карт» — инстанс конструктора 70371:24883.
//
// Список из компонентов `Card`, а не из строк таблицы: карточка карты — это
// сущность кита («карта или счёт в списке продуктов: миниатюра, номер,
// владелец, кнопка-многоточие»), и подменять её табличной строкой значило бы
// проверять не тот компонент.
//
// Шапка блока при этом ТАБЛИЧНАЯ (`ELK / table-top`): вкладки, чипы-фильтр,
// строка результата и пагинатор — те же, поэтому и собраны тем же
// компонентом. Пустое состояние подставляется вместо списка, а шапка
// остаётся — так же, как у таблицы.

const PAGE_SIZE_DEFAULT = 25
const CHIPS = ["Статус", "Тип", "Держатель", "Счёт"]

function BusinessCardsRegistry() {
  const toast = useToast()

  const [section, setSection] = useState("cards")
  const [scope, setScope] = useState("active")
  const [chips, setChips] = useState<Record<string, string | null>>({})
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(PAGE_SIZE_DEFAULT)

  const filtered = useMemo(() => {
    return BUSINESS_CARDS.filter((card) => {
      if (card.closed !== (scope === "closed")) return false
      const byStatus = chips["Статус"]
      if (
        byStatus &&
        !CARD_STATUS_LABELS[card.status]
          .toLowerCase()
          .includes(byStatus.toLowerCase())
      ) {
        return false
      }
      const byType = chips["Тип"]
      if (byType && !card.title.toLowerCase().includes(byType.toLowerCase())) {
        return false
      }
      const byHolder = chips["Держатель"]
      if (
        byHolder &&
        !card.holder.toLowerCase().includes(byHolder.toLowerCase())
      ) {
        return false
      }
      const byAccount = chips["Счёт"]
      if (byAccount && !card.account.includes(byAccount)) return false
      return true
    })
  }, [chips, scope])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const safePage = Math.min(page, totalPages)
  const pageRows = filtered.slice((safePage - 1) * pageSize, safePage * pageSize)
  const appliedCount = Object.values(chips).filter(Boolean).length

  return (
    <SandboxPage
      activeSection="business-cards"
      title={
        <TitleRegistry
          title="Бизнес-карты"
          helpLabel={null}
          actions={
            /* Дизайн-чек «Storybook 3», замечание 12: «убрать иконку в
               кнопке "Выпустить карту"» — в макете это подпись без глифа. */
            <Button variant="primary" size="sm">
              Выпустить карту
            </Button>
          }
        />
      }
      additional={
        <Tabs
          items={[
            { value: "cards", label: "Карты" },
            { value: "operations", label: "Операции" },
          ]}
          showMore={false}
          value={section}
          onValueChange={setSection}
        />
      }
    >
      <TableBlock>
        {section === "cards" ? (
          <>
            <TableTop>
              {/* Дизайн-чек «Storybook 3», замечание 4: лента разделов ВНУТРИ
                  шапки таблицы — «мобильного» размера и на десктопе (лента
                  40, зазор 24, подпись P2 Medium), а 4 сверху добирают блок
                  до 44. Страничные табы выше остаются обычными. */}
              <Tabs
                items={[
                  { value: "active", label: "Действующие" },
                  { value: "closed", label: "Закрытые" },
                ]}
                size="medium"
                className="pt-1"
                showMore={false}
                value={scope}
                onValueChange={(next) => {
                  setScope(next)
                  setPage(1)
                }}
              />
              <TableTopToolbar>
                {CHIPS.map((label) => (
                  <Filter
                    key={label}
                    label={label}
                    value={chips[label] ?? null}
                    onValueChange={(next) => {
                      setChips((prev) => ({ ...prev, [label]: next }))
                      setPage(1)
                    }}
                  />
                ))}
                {appliedCount > 0 && (
                  <Button
                    variant="secondary-grey"
                    size="sm"
                    icon={X}
                    iconPosition="left"
                    onClick={() => {
                      setChips({})
                      setPage(1)
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
                    <TableTopSummaryItem
                      label="Результатов:"
                      value={filtered.length}
                    />
                  </>
                }
                /* Дизайн-чек «Storybook 3», замечание 12: «убрать кнопку
                   "Скачать"». В макете реестра (14002:113930) справа в строке
                   итогов пусто — выгрузки у реестра карт нет. */
              />
            </TableTop>

            {pageRows.length === 0 ? (
              <div className="px-4 py-16">
                <EmptySearchResults {...EMPTY_FILTERED} />
              </div>
            ) : (
              <div className="flex flex-col gap-2 p-4">
                {pageRows.map((card) => (
                  <Card
                    key={card.id}
                    title={card.title}
                    // Точку-разделитель рисует сам `Card`, поэтому в suffix
                    // идёт только номер: со своей точкой получалось «· · 4135».
                    titleSuffix={card.last4}
                    tag={CARD_STATUS_LABELS[card.status]}
                    tagColor={CARD_STATUS_COLORS[card.status]}
                    subtitle={card.holder}
                    value={`Счёт ${card.account}`}
                    showThumbnail
                    thumbnailNumber={card.last4}
                    paymentSystem={card.paymentSystem}
                    menuItems={[
                      {
                        text: "Активировать карту",
                        disabled: card.status !== "needs-activation",
                        onSelect: () =>
                          toast.add({
                            type: "checked",
                            title: `Карта · ${card.last4} активирована`,
                          }),
                      },
                      { text: "Перейти к счёту карты" },
                      { text: "Переименовать" },
                      {
                        text: "Закрыть карту",
                        onSelect: () =>
                          toast.add({
                            type: "attention",
                            title: `Заявка на закрытие карты · ${card.last4}`,
                          }),
                      },
                    ]}
                  />
                ))}
              </div>
            )}

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
          </>
        ) : (
          <DataTable fields={OPERATION_FIELDS} rows={OPERATIONS} />
        )}
      </TableBlock>
    </SandboxPage>
  )
}

export { BusinessCardsRegistry }
