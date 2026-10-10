import { afterEach, describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen } from "@testing-library/react"

import { TableCell } from "./cell"
import { TableHeadCell } from "./head-cell"
import { Table, TableBody, TableRow } from "./table"

afterEach(() => {
  vi.restoreAllMocks()
})

// Ревью 10.10, п. 27 — доступность таблицы.
describe("Таблица: доступность (ревью 10.10, п. 27)", () => {
  it("кликабельная строка объявляет своё действие", () => {
    render(
      <Table>
        <TableBody>
          <TableRow clickable onClick={() => {}}>
            <TableCell>Платёж</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Итого</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    )
    const [clickable, plain] = screen.getAllByRole("row")
    expect(clickable).toHaveAttribute("aria-description", "Открывается по Enter")
    expect(plain).not.toHaveAttribute("aria-description")
  })

  it("ручка ширины принимает фокус и меняет ширину стрелками", () => {
    const onWidthCommit = vi.fn()
    render(
      <table>
        <thead>
          <tr>
            <TableHeadCell resizable defaultWidth={200} onWidthCommit={onWidthCommit}>
              Дата
            </TableHeadCell>
          </tr>
        </thead>
      </table>
    )
    const handle = screen.getByRole("separator")
    expect(handle).toHaveAttribute("tabindex", "0")
    expect(handle).toHaveAttribute("aria-valuenow", "200")
    // Имя заголовка столбца не загрязнено подсказкой ручки.
    expect(screen.getByRole("columnheader", { name: "Дата" })).toBeInTheDocument()

    fireEvent.keyDown(handle, { key: "ArrowRight" })
    expect(onWidthCommit).toHaveBeenLastCalledWith(216)
    fireEvent.keyDown(handle, { key: "ArrowLeft", shiftKey: true })
    expect(onWidthCommit).toHaveBeenLastCalledWith(152)
    expect(handle).toHaveAttribute("aria-valuenow", "152")
  })

  it("обрезанное значение ячейки встаёт в обход по Tab, необрезанное — нет", () => {
    vi.spyOn(HTMLElement.prototype, "scrollWidth", "get").mockImplementation(function (
      this: HTMLElement
    ) {
      return this.textContent?.includes("Очень длинное") ? 500 : 0
    })
    vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockReturnValue(100)
    const { container } = render(
      <table>
        <tbody>
          <tr>
            <TableCell>Очень длинное назначение платежа</TableCell>
            <TableCell>Коротко</TableCell>
          </tr>
        </tbody>
      </table>
    )
    const values = container.querySelectorAll('[data-slot="table-cell"] > span > span')
    const truncated = container.querySelector("[data-truncated]")
    expect(truncated).toHaveAttribute("tabindex", "0")
    expect(truncated).toHaveTextContent("Очень длинное")
    expect([...values].filter((el) => el.getAttribute("tabindex") === "0")).toHaveLength(1)
  })

  it("спейсер тела скрыт от скринридера, как спейсер шапки", () => {
    render(
      <table>
        <tbody>
          <tr>
            <TableCell type="spacer" />
          </tr>
        </tbody>
      </table>
    )
    expect(document.querySelector('[data-type="spacer"]')).toHaveAttribute("aria-hidden", "true")
  })
})
