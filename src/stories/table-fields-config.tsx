import { Attach } from "@/icons"
import type { TableField } from "@/components/ui/table"

import type { ContractRow } from "./table-fields-data"

/**
 * Конфиг полей. Тип поля выбирает и вариант ячейки, и форматирование: даты
 * приходят строками ISO, суммы — числами, статусы — ключами словаря, и ни
 * одно место использования не пишет для этого свою разметку.
 */
const CONTRACT_FIELDS: TableField<ContractRow>[] = [
  {
    key: "code",
    title: "Договор",
    hierarchy: true,
    pin: "left",
    width: 200,
    sortable: true,
    locked: true,
  },
  {
    key: "subject",
    title: "Предмет",
    type: "link",
    width: 280,
    href: () => "#",
    description: (row) => row.account,
  },
  {
    key: "status",
    title: "Статус",
    type: "tag",
    width: 180,
    tagColors: {
      done: "green",
      signing: "orange",
      draft: "grey",
      rejected: "red",
    },
    tagLabels: {
      done: "Исполнен",
      signing: "Готов к подписанию",
      draft: "Черновик",
      rejected: "Замечания банка",
    },
  },
  // Массив значений сворачивается в «Несколько (N)» — правило документации.
  { key: "payers", title: "Плательщики", type: "list", width: 220 },
  { key: "date", title: "Дата", type: "date", width: 140, sortable: true },
  { key: "updatedAt", title: "Изменён", type: "datetime", width: 190 },
  { key: "rate", title: "Ставка", type: "percent", decimals: 1, width: 130 },
  {
    key: "amount",
    title: "Сумма",
    type: "money",
    width: 220,
    sortable: true,
    // Поступление получает плюс и зелёный цвет, списание — обычный.
    signed: true,
    unit: (row) => row.unit,
    description: (row) => row.amountNote,
  },
  { key: "approved", title: "Согласовано", type: "checkbox", width: 140 },
  {
    key: "attachments",
    title: "Вложения",
    type: "icon",
    headIcon: <Attach aria-hidden="true" className="size-4" />,
    icon: (row) =>
      row.attachments > 0 ? (
        <Attach aria-hidden="true" className="size-4" />
      ) : null,
  },
  {
    key: "actions",
    type: "actions",
    pin: "right",
    actions: () => [
      { text: "Скачать печатную форму" },
      { text: "Скопировать" },
      { text: "Удалить" },
    ],
  },
]

export { CONTRACT_FIELDS }
