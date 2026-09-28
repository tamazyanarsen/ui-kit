import { describe, expect, it } from "vitest"

import type { TableField } from "@/components/ui/table"

import { visibleSort } from "./sort"

interface Row {
  number: string
  amount: number
}

const FIELDS: TableField<Row>[] = [
  { key: "number", title: "Номер", sortable: true },
  { key: "amount", title: "Сумма", sortable: true },
]

describe("сортировка реестра аккредитивов", () => {
  it("не сортирует по столбцу, скрытому в настройке", () => {
    const columns = [
      { id: "number", visible: false },
      { id: "amount", visible: true },
    ]
    expect(visibleSort(FIELDS, null, columns)).toEqual({ key: "amount", direction: "asc" })
    expect(visibleSort(FIELDS, { key: "number", direction: "desc" }, columns)).toEqual({
      key: "amount",
      direction: "asc",
    })
  })

  it("выбор пользователя по видимому столбцу сохраняется", () => {
    const columns = [
      { id: "number", visible: true },
      { id: "amount", visible: true },
    ]
    const sort = { key: "amount", direction: "desc" } as const
    expect(visibleSort(FIELDS, sort, columns)).toBe(sort)
  })
})
