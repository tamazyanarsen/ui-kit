import { act, render } from "@testing-library/react"
import { afterEach, describe, expect, it } from "vitest"

import { DataTable } from "./data-table"
import type { TableField } from "./field-types"

// Раунд 26: признак «текст усечён» (он включает подсказку с полным значением)
// снимался при отрисовке и по размеру коробки. Загрузка шрифта меняет ширину
// текста при той же коробке — ни того ни другого не происходило, и ячейка
// оставалась без подсказки.

type Row = { id: string; name: string }
const fields: TableField<Row>[] = [{ key: "name", title: "Название" }]

let scrollWidth = 100
const original = Object.getOwnPropertyDescriptor(HTMLElement.prototype, "scrollWidth")
const originalClient = Object.getOwnPropertyDescriptor(HTMLElement.prototype, "clientWidth")

afterEach(() => {
  Reflect.deleteProperty(document, "fonts")
  if (original) Object.defineProperty(HTMLElement.prototype, "scrollWidth", original)
  if (originalClient) Object.defineProperty(HTMLElement.prototype, "clientWidth", originalClient)
  scrollWidth = 100
})

describe("Ячейка таблицы: загрузка шрифта", () => {
  it("после загрузки шрифта усечённая ячейка получает признак усечения", async () => {
    let loaded: () => void = () => {}
    const ready = new Promise<void>((resolve) => (loaded = resolve))
    Object.defineProperty(document, "fonts", { value: { ready }, configurable: true })
    Object.defineProperty(HTMLElement.prototype, "scrollWidth", {
      configurable: true,
      get: () => scrollWidth,
    })
    Object.defineProperty(HTMLElement.prototype, "clientWidth", {
      configurable: true,
      get: () => 100,
    })

    render(<DataTable fields={fields} rows={[{ id: "1", name: "Длинное название" }]} />)
    expect(document.querySelector("[data-truncated]")).toBeNull()

    scrollWidth = 180
    await act(async () => {
      loaded()
      await ready
    })
    expect(document.querySelector("[data-truncated]")).not.toBeNull()
  })
})
