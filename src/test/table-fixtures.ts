import type { TableField } from "@/components/ui/table"

// Общие данные для тестов `DataTable`. Лежат в `src/test`, а не рядом с
// компонентом: каталог не попадает в сборку пакета, в отличие от файлов в
// `src/components/ui` (там из `dist` исключены только `*.test.tsx` и
// `*.stories.tsx`).

interface TestRow {
  id: string
  name: string
  amount: number
  unit?: string
  date: string
  status: string
  ok: boolean
  payers: string[]
  note: string | null
  children?: TestRow[]
}

const TEST_ROWS: TestRow[] = [
  {
    id: "1",
    name: "Бета",
    amount: -10000,
    unit: "₽",
    date: "2026-08-25",
    status: "done",
    ok: true,
    payers: ["Первый", "Второй", "Третий"],
    note: null,
    children: [
      {
        id: "1.1",
        name: "Бета вложенная",
        amount: 250.5,
        unit: "$",
        date: "2026-01-02",
        status: "draft",
        ok: false,
        payers: ["Только один"],
        note: "Пояснение",
      },
    ],
  },
  {
    id: "2",
    name: "Альфа",
    amount: 31922980.05,
    unit: "₽",
    date: "2026-03-01",
    status: "draft",
    ok: false,
    payers: [],
    note: "Есть",
  },
]

const TEST_FIELDS: TableField<TestRow>[] = [
  { key: "name", title: "Название", hierarchy: true, sortable: true },
  {
    key: "amount",
    title: "Сумма",
    type: "money",
    signed: true,
    sortable: true,
    unit: (row) => row.unit ?? "",
  },
  { key: "date", title: "Дата", type: "date", sortable: true },
  {
    key: "status",
    title: "Статус",
    type: "tag",
    tagColors: { done: "green", draft: "grey" },
    tagLabels: { done: "Исполнен", draft: "Черновик" },
  },
  { key: "ok", title: "Признак", type: "boolean" },
  { key: "payers", title: "Плательщики", type: "list" },
  { key: "note", title: "Примечание" },
]

/** Ячейки строки по её видимому порядку — тестам нужен именно порядок. */
function rowCells(index: number) {
  const rows = document.querySelectorAll('[data-slot="table-row"]')
  return [...rows[index].querySelectorAll('[data-slot="table-cell"]')]
}

/** Первая ячейка каждой строки: по ней проверяются порядок и вложенность. */
function rowNames() {
  return [...document.querySelectorAll('[data-slot="table-row"]')].map(
    (row) => row.querySelector('[data-slot="table-cell"]')?.textContent
  )
}

/** Строка без вложенных — сортировка проверяется на плоском наборе. */
function flatRow(row: TestRow): TestRow {
  const { children: _children, ...rest } = row
  return rest
}

export { TEST_FIELDS, TEST_ROWS, flatRow, rowCells, rowNames }
export type { TestRow }
