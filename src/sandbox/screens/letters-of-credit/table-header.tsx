import { ChevronDown, Search, X } from "@/icons"
import { Button } from "@/components/ui/button"
import { Filter } from "@/components/ui/filter"
import { Input } from "@/components/ui/input"
import { TableColumnSettings, type TableColumn } from "@/components/ui/table"
import {
  TableTop,
  TableTopSummary,
  TableTopSummaryItem,
  TableTopToolbar,
} from "@/components/ui/table-top"

// Шапка табличного блока реестра аккредитивов: поиск, чипы-фильтр, строка
// результата и кнопки управления таблицей.
//
// Отдельным модулем — не только ради длины файла: шапка ничего не решает
// сама, она только сообщает наверх изменения отбора. Экран остаётся
// единственным местом, где отбор считается, а значит числа «Результатов» и
// «Выбрано фильтров» не могут разойтись с самими строками.

const CHIPS = ["Вид аккредитива", "Тип заявки", "Дата", "Статус", "Сумма"]

interface LettersTableHeaderProps {
  search: string
  onSearchChange: (search: string) => void
  chips: Record<string, string | null>
  onChipChange: (label: string, value: string | null) => void
  onChipsReset: () => void
  appliedCount: number
  resultCount: number
  columns: TableColumn[]
  onColumnsChange: (columns: TableColumn[]) => void
}

function LettersTableHeader({
  search,
  onSearchChange,
  chips,
  onChipChange,
  onChipsReset,
  appliedCount,
  resultCount,
  columns,
  onColumnsChange,
}: LettersTableHeaderProps) {
  return (
    <TableTop>
      <TableTopToolbar>
        {/* Ширина поля поиска — своя колонка 260px: `Input` всегда w-full,
            поэтому размер живёт на обёртке, как и в шапке кита. */}
        <div className="w-[260px]">
          <Input
            size="sm"
            iconLeft={<Search aria-hidden="true" />}
            placeholder="Поиск по нескольким крит..."
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
          />
        </div>
        {CHIPS.map((label) => (
          <Filter
            key={label}
            chip
            label={label}
            value={chips[label] ?? null}
            onValueChange={(next) => onChipChange(label, next)}
          />
        ))}
        {appliedCount > 0 && (
          <Button
            variant="secondary-grey"
            size="sm"
            icon={X}
            iconPosition="left"
            onClick={onChipsReset}
          >
            Сбросить фильтры
          </Button>
        )}
      </TableTopToolbar>

      <TableTopSummary
        info={
          <>
            <TableTopSummaryItem label="Выбрано фильтров:" value={appliedCount} />
            <TableTopSummaryItem label="Результатов:" value={resultCount} />
          </>
        }
        actions={
          <>
            <Button
              variant="secondary-grey"
              size="sm"
              icon={ChevronDown}
              iconPosition="right"
            >
              Скачать
            </Button>
            <TableColumnSettings
              columns={columns}
              onColumnsChange={onColumnsChange}
            />
          </>
        }
      />
    </TableTop>
  )
}

export { CHIPS, LettersTableHeader }
export type { LettersTableHeaderProps }
