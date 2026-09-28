import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { fireEvent, render } from "@testing-library/react"

import { DataTable, type TableField } from "./index"

// Итоговая проверка кита, четвёртый заход: тег, столбец значков, ресайз.

type Row = { id: string; a: string; s: string }
const rows: Row[] = [{ id: "1", a: "A", s: "ok" }]

describe("поле tag: вариант тега", () => {
  it("variant из tag() доходит до самого Tag", () => {
    const fields: TableField<Row>[] = [
      {
        key: "s",
        title: "Статус",
        type: "tag",
        tag: () => ({ label: "Готово", color: "green", variant: "secondary" }),
      },
    ]
    render(<DataTable fields={fields} rows={rows} />)
    const tag = document.querySelector<HTMLElement>('tbody [data-slot="tag"]')!
    expect(tag.dataset.variant).toBe("secondary")
  })
})

describe("столбец значков без headIcon", () => {
  it("шапка шириной 32 — как ячейка тела, без филлера и лишнего разделителя", () => {
    const fields: TableField<Row>[] = [
      { key: "a", title: "A" },
      { key: "i", type: "icon", icon: () => <svg data-testid="glyph" /> },
    ]
    render(<DataTable fields={fields} rows={rows} />)
    const heads = Array.from(document.querySelectorAll<HTMLElement>("thead th"))
    const icon = heads.find((th) => th.dataset.type === "icon")
    expect(icon).toBeDefined()
    expect(icon!.style.width).toBe("32px")
    expect(heads.some((th) => th.dataset.type === "filler")).toBe(false)
  })
})

describe("ресайз столбца не перерисовывает тело таблицы", () => {
  const original = Object.getOwnPropertyDescriptor(HTMLElement.prototype, "offsetWidth")
  beforeEach(() => {
    Object.defineProperty(HTMLElement.prototype, "offsetWidth", {
      configurable: true,
      get() {
        return (this as HTMLElement).tagName === "TH" ? 200 : 0
      },
    })
    HTMLElement.prototype.setPointerCapture ??= () => {}
    HTMLElement.prototype.hasPointerCapture ??= () => false
    HTMLElement.prototype.releasePointerCapture ??= () => {}
  })
  afterEach(() => {
    if (original) Object.defineProperty(HTMLElement.prototype, "offsetWidth", original)
  })

  it("на каждое движение тело не перерисовывается; итог — один раз при отпускании", () => {
    let renders = 0
    const many: Row[] = Array.from({ length: 50 }, (_, i) => ({
      id: String(i),
      a: `A${i}`,
      s: "",
    }))
    const onColumnWidthsChange = vi.fn()
    const fields: TableField<Row>[] = [
      { key: "a", title: "A", width: 200 },
      {
        key: "s",
        title: "S",
        type: "custom",
        render: () => {
          renders += 1
          return "x"
        },
      },
    ]
    render(
      <DataTable
        fields={fields}
        rows={many}
        onColumnWidthsChange={onColumnWidthsChange}
      />
    )
    const head = Array.from(document.querySelectorAll<HTMLElement>("thead th")).find(
      (th) => th.textContent === "A"
    )!
    const handle = head.querySelector<HTMLElement>('[data-slot="table-resize-handle"]')!

    const before = renders
    fireEvent.pointerDown(handle, { clientX: 0, pointerId: 1 })
    for (let step = 1; step <= 5; step += 1) {
      fireEvent.pointerMove(handle, { clientX: step * 30, pointerId: 1 })
    }
    // Во время жеста — ни одной перерисовки ячеек тела.
    expect(renders).toBe(before)
    // Ширину держит сама ячейка шапки. Первая колонка несёт поле строки 8:
    // замер 200 − 8 = 192, +150 → 342 объявленных, на экране 350.
    expect(head.style.width).toBe("350px")

    fireEvent.pointerUp(handle, { pointerId: 1 })
    expect(onColumnWidthsChange).toHaveBeenCalledTimes(1)
    expect(onColumnWidthsChange).toHaveBeenCalledWith({ a: 342 })
    expect(head.style.width).toBe("350px")
  })
})
