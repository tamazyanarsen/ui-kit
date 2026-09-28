import { describe, expect, it } from "vitest"

import type { TableField } from "./field-types"
import { sortTableRows } from "./table-rows"

// Итоговая проверка №5: сортировка по конфигу полей.

type Row = { id: string; amount?: unknown; done?: boolean }

const order = (rows: Row[]) => rows.map((row) => row.id)
const asc = { key: "amount", direction: "asc" } as const

describe("sortTableRows: числа, пришедшие строкой", () => {
  // «100 000,00» стояло раньше «20 000,00»: строка сравнивалась текстом.
  it("отформатированные суммы сортируются числом", () => {
    const fields: TableField<Row>[] = [{ key: "amount", type: "money", sortable: true }]
    const rows: Row[] = [
      { id: "a", amount: "100 000,00" },
      { id: "b", amount: "20 000,00" },
      { id: "c", amount: "3 500,00 ₽" },
      { id: "d", amount: "−5,5" },
    ]
    expect(order(sortTableRows(rows, fields, asc))).toEqual(["d", "c", "b", "a"])
  })

  it("проценты со знаком и отбивкой", () => {
    const fields: TableField<Row>[] = [{ key: "amount", type: "percent", sortable: true }]
    const rows: Row[] = [
      { id: "a", amount: "12 %" },
      { id: "b", amount: "−5,5 %" },
      { id: "c", amount: "+3%" },
    ]
    expect(order(sortTableRows(rows, fields, asc))).toEqual(["b", "c", "a"])
  })

  // Пара «число — текст» сравнивалась текстом, пара чисел — числом: порядок
  // нетранзитивный и зависел от исходной расстановки.
  it("числа и текст в одной колонке упорядочены одинаково при любой исходной расстановке", () => {
    const fields: TableField<Row>[] = [{ key: "amount", type: "number", sortable: true }]
    const rows: Row[] = [
      { id: "five", amount: 5 },
      { id: "text", amount: "н/д" },
      { id: "big", amount: 300 },
      { id: "forty", amount: "40" },
    ]
    const expected = ["five", "forty", "big", "text"]
    expect(order(sortTableRows(rows, fields, asc))).toEqual(expected)
    expect(order(sortTableRows([...rows].reverse(), fields, asc))).toEqual(expected)
    expect(
      order(sortTableRows([rows[2], rows[0], rows[3], rows[1]], fields, asc))
    ).toEqual(expected)
  })
})

describe("sortTableRows: чекбокс с checked", () => {
  // Сортировка читала значение поля, а его у такого поля нет: все строки
  // считались пустыми, и порядок не менялся.
  it("сортируется по тому, что показывает чекбокс", () => {
    const fields: TableField<Row>[] = [
      { key: "flag", type: "checkbox", sortable: true, checked: (row) => Boolean(row.done) },
    ]
    const rows: Row[] = [
      { id: "on1", done: true },
      { id: "off", done: false },
      { id: "on2", done: true },
    ]
    expect(order(sortTableRows(rows, fields, { key: "flag", direction: "asc" }))).toEqual([
      "off",
      "on1",
      "on2",
    ])
  })
})
