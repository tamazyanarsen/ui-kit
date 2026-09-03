import { Trash } from "@/icons"
import { Button } from "@/components/ui/button"
import { DataTable, type TableField } from "@/components/ui/table"

/** Одна строка, в которой показан каждый тип поля. */
interface SampleRow {
  text: string
  list: string[]
  number: number
  money: number
  percent: number
  date: string
  datetime: string
  time: string
  boolean: boolean
  checkbox: boolean
  tag: string
  link: string
  custom: number
  empty: string | null
}

const SAMPLE_ROWS: SampleRow[] = [
  {
    text: "Текст в ячейке",
    list: ["Первое", "Второе", "Третье"],
    number: 1250,
    money: 31922980.05,
    percent: 14.25,
    date: "2026-08-25",
    datetime: "2026-08-25T14:05:00",
    time: "2026-08-25T14:05:00",
    boolean: true,
    checkbox: true,
    tag: "done",
    link: "Открыть карточку",
    custom: 3,
    empty: null,
  },
]

const SAMPLE_FIELDS: TableField<SampleRow>[] = [
  { key: "text", title: "text", width: 160 },
  { key: "list", title: "list", width: 150 },
  { key: "number", title: "number", type: "number", width: 120 },
  {
    key: "money",
    title: "money",
    type: "money",
    signed: true,
    width: 240,
    // Дельта под значением: цветной ТОЛЬКО знак, а не весь комментарий —
    // статус несёт стрелка, остальное служебный текст.
    description: () => "к прошлому месяцу",
    descriptionSign: () => "↑ 12 %",
    descriptionSignTone: () => "positive",
  },
  { key: "percent", title: "percent", type: "percent", decimals: 2, width: 130 },
  { key: "date", title: "date", type: "date", width: 130 },
  { key: "datetime", title: "datetime", type: "datetime", width: 180 },
  { key: "time", title: "time", type: "time", width: 100 },
  { key: "boolean", title: "boolean", type: "boolean", width: 110 },
  { key: "checkbox", title: "checkbox", type: "checkbox", width: 110 },
  {
    key: "tag",
    title: "tag",
    type: "tag",
    width: 150,
    tagColors: { done: "green" },
    tagLabels: { done: "Исполнен" },
  },
  { key: "link", title: "link", type: "link", href: () => "#", width: 180 },
  {
    key: "custom",
    title: "custom",
    type: "custom",
    width: 150,
    render: (row) => (
      <Button variant="secondary-grey" size="sm" icon={Trash}>
        {String(row.custom)}
      </Button>
    ),
  },
  { key: "empty", title: "пусто", width: 110 },
]

/** Стенд «каждый тип поля» — по строке на каждый вариант конфига. */
function TableFieldTypesExample() {
  return <DataTable fields={SAMPLE_FIELDS} rows={SAMPLE_ROWS} />
}

export { SAMPLE_FIELDS, SAMPLE_ROWS, TableFieldTypesExample }
export type { SampleRow }
