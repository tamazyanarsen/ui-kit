import type { TableField } from "@/components/ui/table"

import {
  STATUS_COLORS,
  STATUS_LABELS,
  type LetterOfCreditRow,
} from "./data"

// Столбцы реестра аккредитивов — конфигом полей, а не JSX-ячейками: тип
// поля выбирает и вариант ячейки, и форматирование, поэтому «Сумма» здесь
// печатается тем же форматтером, что и итог, а «Статус» — тем же `Tag`, что
// на карточке заявки.

const LETTER_FIELDS: TableField<LetterOfCreditRow>[] = [
  {
    key: "status",
    title: "Статус",
    type: "tag",
    width: 180,
    sortable: true,
    tag: (row) => ({
      label: STATUS_LABELS[row.status],
      color: STATUS_COLORS[row.status],
    }),
    compare: (a, b) => STATUS_LABELS[a.status].localeCompare(STATUS_LABELS[b.status]),
  },
  { key: "number", title: "Номер", width: 120, sortable: true },
  {
    key: "date",
    title: "Дата",
    type: "date",
    width: 120,
    sortable: true,
    format: (value) =>
      new Date(String(value)).toLocaleDateString("ru-RU", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }),
  },
  { key: "kind", title: "Вид аккредитива", width: 320 },
  {
    key: "requestType",
    title: "Тип заявки",
    width: 140,
    // Скрыт стартово: столбец есть в «Настроить столбцы», но эталон его не
    // рисует — так проверяется и сама настройка, и то, что скрытая колонка
    // не ломает ширины.
    hidden: true,
  },
  {
    key: "amount",
    title: "Сумма",
    type: "money",
    width: 180,
    sortable: true,
  },
  {
    key: "term",
    title: "Срок, дней",
    type: "number",
    width: 130,
    sortable: true,
  },
  { key: "beneficiary", title: "Бенефициар", width: 240 },
  { key: "bank", title: "Банк бенефициара", width: 200 },
]

export { LETTER_FIELDS }
