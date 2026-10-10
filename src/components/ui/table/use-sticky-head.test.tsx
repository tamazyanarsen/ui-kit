import { act, render } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { Table, TableBody, TableHeader } from "./table"

// Дизайн-чек от 08.10, замечания 21 и 35. В jsdom шкал просмотра нет, поэтому
// здесь проверяется запасной путь — сдвиг шапки скриптом на прокрутке. Путь
// со шкалой проверен в браузере (Chrome 154, песочные реестры).
describe("Table: липкая строка шапки без внутреннего скролла", () => {
  let tableTop = 0

  beforeEach(() => {
    vi.spyOn(HTMLElement.prototype, "offsetHeight", "get").mockImplementation(
      function (this: HTMLElement) {
        if (this.tagName === "TABLE") return 500
        if (this.tagName === "THEAD") return 48
        return 0
      }
    )
    vi.spyOn(HTMLTableElement.prototype, "getBoundingClientRect").mockImplementation(
      () => ({ top: tableTop }) as DOMRect
    )
    document.documentElement.style.setProperty("--viewport-inset-top", "64px")
  })

  afterEach(() => {
    vi.restoreAllMocks()
    document.documentElement.style.removeProperty("--viewport-inset-top")
  })

  function setup() {
    render(
      <Table>
        <TableHeader>
          <tr>
            <th>Имя</th>
          </tr>
        </TableHeader>
        <TableBody>
          <tr>
            <td>Иванов</td>
          </tr>
        </TableBody>
      </Table>
    )
    return document.querySelector("thead")!
  }

  function scrollTo(top: number) {
    tableTop = top
    act(() => {
      window.dispatchEvent(new Event("scroll"))
    })
  }

  it("стоит на месте, пока верх таблицы ниже занятого верха вьюпорта", () => {
    tableTop = 200
    const head = setup()
    expect(head.style.transform).toBe("")
  })

  it("держится под шапкой страницы на промежуточном скролле", () => {
    const head = setup()
    scrollTo(-100)
    expect(head.style.transform).toBe("translateY(164px)")
  })

  it("уходит вместе с низом таблицы и не выходит за её коробку", () => {
    const head = setup()
    scrollTo(-1000)
    expect(head.style.transform).toBe("translateY(452px)")
    expect(
      document
        .querySelector<HTMLElement>('[data-slot="table-root"]')!
        .style.getPropertyValue("--table-head-travel")
    ).toBe("452px")
  })
})
