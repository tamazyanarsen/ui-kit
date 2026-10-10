import * as React from "react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { render } from "@testing-library/react"

import { CardBox } from "@/components/ui/card-box"
import { MenuOverlay } from "@/components/ui/header/menu-overlay"
import { DataTable } from "@/components/ui/table"
import { TitleHeading } from "@/components/ui/title/heading"
import { TopFixedMessage } from "@/components/ui/top-fixed-message"
import { ViewportScope } from "@/lib/viewport"

// Ревью 10.10, КК-3: наблюдатели и слушатели пересоздавались на КАЖДЫЙ
// рендер родителя — эффекты зависели от `children`/`text`/`footer`, то есть
// от разметки, новой при любом ре-рендере. А в таблице каждая ячейка
// держала свой ResizeObserver и читала раскладку на каждую отрисовку.

let created = 0
const Original = globalThis.ResizeObserver

beforeEach(() => {
  created = 0
  globalThis.ResizeObserver = class extends Original {
    constructor(callback: ResizeObserverCallback) {
      super(callback)
      created += 1
    }
  } as typeof ResizeObserver
})
afterEach(() => {
  globalThis.ResizeObserver = Original
  vi.restoreAllMocks()
})

/** Перерисовать с новой разметкой того же содержимого `times` раз. */
function rerenderMany(rerender: (ui: React.ReactElement) => void, make: () => React.ReactElement, times = 5) {
  for (let i = 0; i < times; i++) rerender(make())
}

describe("Наблюдатели не пересоздаются на ре-рендер (ревью 10.10, КК-3)", () => {
  it("CardBox (useScrollEdges): ResizeObserver один на всё время жизни", () => {
    // Окно прокрутки с наблюдателем — у малой карточки.
    const make = () => (
      <CardBox type="small" title="Счета">
        <p>Строка</p>
      </CardBox>
    )
    const { rerender } = render(make())
    const afterMount = created
    rerenderMany(rerender, make)
    expect(created).toBe(afterMount)
  })

  it("TitleHeading: наблюдатель не пересоздаётся", () => {
    const make = () => <TitleHeading>{<span>Платёжные поручения</span>}</TitleHeading>
    const { rerender } = render(make())
    const afterMount = created
    rerenderMany(rerender, make)
    expect(created).toBe(afterMount)
  })

  it("TopFixedMessage: наблюдатель не пересоздаётся", () => {
    // Обрезку текста меряет десктопная форма.
    const make = () => (
      <ViewportScope viewport="desktop">
        <TopFixedMessage text={<span>Технические работы</span>} />
      </ViewportScope>
    )
    const { rerender } = render(make())
    const afterMount = created
    rerenderMany(rerender, make)
    expect(created).toBe(afterMount)
  })

  it("MenuOverlay: слушатели прокрутки не переставляются при новом footer", () => {
    const add = vi.spyOn(window, "addEventListener")
    const make = () => (
      <MenuOverlay open onClose={() => {}} footer={<button type="button">Настроить</button>}>
        <p>Разделы</p>
      </MenuOverlay>
    )
    const { rerender } = render(make())
    const scrollsAfterMount = add.mock.calls.filter(([type]) => type === "scroll").length
    rerenderMany(rerender, make)
    expect(add.mock.calls.filter(([type]) => type === "scroll").length).toBe(scrollsAfterMount)
  })

  it("DataTable: ячейки не заводят по наблюдателю и не меряют себя на каждый рендер", () => {
    const fields = [
      { key: "name" as const, title: "Название" },
      { key: "note" as const, title: "Комментарий" },
    ]
    const rows = Array.from({ length: 40 }, (_, i) => ({
      id: `r${i}`,
      name: `Платёж ${i}`,
      note: `Комментарий ${i}`,
    }))
    const { rerender } = render(<DataTable fields={fields} rows={rows} />)
    // 80 ячеек и 2 подписи столбцов: раньше — по наблюдателю на каждую.
    expect(created).toBeLessThan(10)

    const reads = vi.spyOn(HTMLElement.prototype, "scrollWidth", "get")
    rerenderMany(rerender, () => <DataTable fields={fields} rows={rows} />, 3)
    // Содержимое не менялось — ячейкам незачем читать раскладку.
    expect(reads.mock.calls.length).toBeLessThan(10)
  })
})
