import type { TableColumn } from "@/components/ui/table"
import type { TagColor } from "@/components/ui/tag"

// Демонстрационные данные таблицы — один набор на все стенды: матрицу
// (`table.stories.tsx`), собранный пример (`table-example.tsx`) и страницу
// разработчика (`src/demo/table-demo.tsx`). Ни один из них не попадает в
// пакет: и `src/stories`, и `src/demo` вне списка `include` у dts.

interface TableStoryRow {
  id: string
  level: number
  parent?: string
  code: string
  title: string
  status: TagColor
  statusLabel: string
  number: string
  account: string
  payer: string
  amount: string
  /** Знак живёт при значении, а не в заголовке столбца. */
  unit: string
  amountNote?: string
  positive?: boolean
}

const TABLE_ROWS: TableStoryRow[] = [
  { id: "1", level: 0, code: "1", title: "Подготовка территории строительства", status: "green", statusLabel: "Исполнен", number: "159638", account: "40702 810 7 00590062573", payer: "ИП Филлимонов Павел Алексеевич", amount: "10 000 000,00", unit: "₽", amountNote: "Списание" },
  { id: "1.1", level: 1, parent: "1", code: "1.1", title: "Договор о развитии застроенной территории", status: "orange", statusLabel: "Готов к подписанию", number: "159639", account: "40702 810 7 00590062573", payer: "ООО «ВИЛКА-СТРОЙ»", amount: "2 000 000,00", unit: "₽", amountNote: "Списание" },
  { id: "1.1.1", level: 2, parent: "1.1", code: "1.1.1", title: "Работы и услуги сторонних организаций", status: "grey", statusLabel: "Черновик", number: "159640", account: "40702 810 7 00590062573", payer: "ООО «РИС И КУРИЦА»", amount: "+31 922 980,05", unit: "₽", amountNote: "Поступление", positive: true },
  { id: "1.1.1.1", level: 3, parent: "1.1.1", code: "1.1.1.1", title: "Водоснабжение, энергоснабжение и водоотведение", status: "red", statusLabel: "Замечания банка", number: "154438", account: "40702 810 7 00590062573", payer: "ИП Филлимонов Павел Алексеевич", amount: "500 000,00", unit: "$" },
  { id: "2", level: 0, code: "2", title: "Основные объекты строительства", status: "orange", statusLabel: "На согласовании", number: "40038", account: "40702 810 7 00590062573", payer: "ООО «ИВАНОВО-СТРОЙ»", amount: "6 000 000,00", unit: "₽", amountNote: "Списание" },
  { id: "3", level: 0, code: "3", title: "Объекты подсобного и обслуживающего назначения", status: "green", statusLabel: "Исполнен", number: "40039", account: "40702 810 7 00590062573", payer: "ИП Воропаев Сергей Владимирович", amount: "99 999,99", unit: "₽" },
]

/** Все знаки, встречающиеся в колонке суммы. Ячейка своей колонки не видит,
 * поэтому список собирается здесь: слот знака резервирует ширину по самому
 * широкому глифу, и разряды стоят друг под другом даже там, где рядом «₽» и
 * «$». Считать в `ch` нельзя — эти два знака одной длины, но разной ширины. */
const AMOUNT_UNITS = ["₽", "$"]

const INITIAL_COLUMNS: TableColumn[] = [
  // ⚠️ Заголовок остаётся чистым — «Сумма», а не «Сумма, ₽»: единица
  // принадлежит значению, а не колонке.
  { id: "status", label: "Статус", visible: true, locked: true },
  { id: "number", label: "Номер платежа", visible: true },
  { id: "account", label: "Со счёта", visible: true },
  { id: "payer", label: "Получатель", visible: true },
  { id: "amount", label: "Сумма", visible: true },
]

export { AMOUNT_UNITS, INITIAL_COLUMNS, TABLE_ROWS }
export type { TableStoryRow }
