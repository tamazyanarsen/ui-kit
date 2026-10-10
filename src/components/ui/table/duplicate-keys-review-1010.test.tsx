import { afterEach, describe, expect, it, vi } from "vitest"
import { render } from "@testing-library/react"

import { DataTable } from "./data-table"

afterEach(() => {
  vi.restoreAllMocks()
})

// Ревью 10.10, п. 24: две разные записи с одним `id` молча делили выбор и
// раскрытие, а React путал их узлы. Таблица предупреждает в разработке.
describe("DataTable: повторяющиеся ключи строк (ревью 10.10, п. 24)", () => {
  const fields = [{ key: "name" as const, title: "Название" }]

  it("предупреждает о повторе id у разных записей", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {})
    vi.spyOn(console, "error").mockImplementation(() => {})
    render(
      <DataTable
        fields={fields}
        rows={[
          { id: "dup-1", name: "Альфа" },
          { id: "dup-1", name: "Бета" },
        ]}
      />
    )
    expect(warn).toHaveBeenCalledWith(expect.stringContaining("dup-1"))
  })

  it("уникальные ключи — без предупреждения", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {})
    render(
      <DataTable
        fields={fields}
        rows={[
          { id: "u-1", name: "Альфа" },
          { id: "u-2", name: "Бета" },
        ]}
      />
    )
    expect(warn).not.toHaveBeenCalledWith(expect.stringContaining("повторяющиеся ключи"))
  })
})
