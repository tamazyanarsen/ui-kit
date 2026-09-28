import { afterEach, describe, expect, it, vi } from "vitest"
import { render } from "@testing-library/react"

import { Table, TableBody } from "./table"

// Итоговая проверка №5: `sticky` ограничен коробкой родителя, а не «до
// следующего соседа». Прилипшая таблица ехала вниз на высоту пагинатора и
// накрывала его — клик по кнопкам страниц попадал в ячейку таблицы.

/** Пагинатор под таблицей — 45px, прочие узлы нулевые. */
function mockPager(height: number) {
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (
    this: HTMLElement
  ) {
    const h = this.dataset.testid === "pager" ? height : 0
    return { height: h, width: 100, top: 0, left: 0, right: 100, bottom: h } as DOMRect
  })
}

function Block() {
  return (
    <div>
      <Table stickyHeader>
        <TableBody />
      </Table>
      <div data-testid="pager" />
    </div>
  )
}

const root = () => document.querySelector<HTMLElement>('[data-slot="table-root"]')!

describe("Table stickyHeader: пагинатор под таблицей не накрывается", () => {
  afterEach(() => vi.restoreAllMocks())

  it("с видимым соседом ниже липкость гасится вместе с отступом", () => {
    mockPager(45)
    render(<Block />)
    expect(root().style.position).toBe("relative")
    // Отступ липкости у `relative` стал бы сдвигом на пагинатор.
    expect(root().style.top).toBe("0px")
  })

  it("без соседей (или с пустым) таблица липнет как раньше", () => {
    mockPager(0)
    render(<Block />)
    expect(root().style.position).toBe("")
    expect(root().style.top).toBe("")
  })
})
