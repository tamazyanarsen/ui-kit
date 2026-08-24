import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import {
  Table,
  TableBody,
  TableCell,
  TableHeadCell,
  TableHeader,
  TableRow,
} from "."

describe("TableRow", () => {
  it("marks itself selected via data attribute and active background", () => {
    const { container } = render(
      <table>
        <tbody>
          <TableRow selected>
            <td>Строка</td>
          </TableRow>
        </tbody>
      </table>
    )
    const row = container.querySelector('[data-slot="table-row"]')!
    expect(row).toHaveAttribute("data-selected", "true")
    expect(row).toHaveClass("bg-[var(--table-row-active-bg)]")
  })

  // The Added highlight is no longer a static fill: per "Добавление новой
  // строки/строк" it lives 2000ms (1000 static + 1000 fading), so the row
  // carries the keyframe animation instead of a background class.
  it("marks itself added via data attribute and the fading highlight", () => {
    const { container } = render(
      <table>
        <tbody>
          <TableRow added>
            <td>Строка</td>
          </TableRow>
        </tbody>
      </table>
    )
    const row = container.querySelector('[data-slot="table-row"]')!
    expect(row).toHaveAttribute("data-added", "true")
    expect(row).toHaveClass("animate-[table-row-added_2000ms_linear_forwards]")
  })
})

describe("Table", () => {
  it("composes into a real table with header and body rows", () => {
    render(
      <Table>
        <TableHeader>
          <tr>
            <TableHeadCell type="subtitle-left">Имя</TableHeadCell>
          </tr>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell type="text">Иванов</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    )
    expect(screen.getByRole("table")).toBeInTheDocument()
    expect(screen.getByRole("columnheader", { name: "Имя" })).toBeInTheDocument()
    expect(screen.getByText("Иванов")).toBeInTheDocument()
  })

  it("marks the table for the sticky header rule only when asked", () => {
    const { rerender } = render(<Table />)
    expect(screen.getByRole("table")).not.toHaveAttribute("data-sticky-header")

    rerender(<Table stickyHeader />)
    expect(screen.getByRole("table")).toHaveAttribute("data-sticky-header")
  })
})

// "Варианты — Line Fill" (node 70279:7145).
describe("TableRow Line Fill", () => {
  // "если переход невозможен, строка не меняет цвет и сохраняет стандартный
  // курсор, исключая состояния наведения и активности"
  it("gives Hover/Active fills only to a row that navigates", () => {
    const { container, rerender } = render(
      <table>
        <tbody>
          <TableRow>
            <td>Строка</td>
          </TableRow>
        </tbody>
      </table>
    )
    let row = container.querySelector('[data-slot="table-row"]')!
    expect(row).not.toHaveClass("cursor-pointer")
    expect(row.className).not.toContain("hover:bg-")
    expect(row.className).not.toContain("active:bg-")

    rerender(
      <table>
        <tbody>
          <TableRow clickable>
            <td>Строка</td>
          </TableRow>
        </tbody>
      </table>
    )
    row = container.querySelector('[data-slot="table-row"]')!
    expect(row).toHaveAttribute("data-clickable", "true")
    expect(row).toHaveClass("cursor-pointer")
    expect(row.className).toContain("hover:bg-[var(--table-row-hover-bg)]")
    expect(row.className).toContain("active:bg-[var(--table-row-active-bg)]")
  })

  // "Строка также меняет цвет — для понимания пользователя, к какой именно
  // строке относятся раскрытые действия."
  it("keeps the fill while the row's action menu is open", () => {
    const { container } = render(
      <table>
        <tbody>
          <TableRow>
            <td>Строка</td>
          </TableRow>
        </tbody>
      </table>
    )
    expect(
      container.querySelector('[data-slot="table-row"]')!.className
    ).toContain("has-[[data-popup-open]]:bg-[var(--table-row-hover-bg)]")
  })

  // ⚠️ Ховер ПЕРЕБИВАЕТ выбор и делает выбранную строку светлее: покой Grey
  // 124 → наведение Grey 114 → нажатие снова Grey 124. Клиент должен видеть
  // реакцию строки и понимать, что провалиться можно и при включённом
  // чекбоксе. Раньше выбор гасил ховер — это был неверный порядок.
  it("keeps the hover and menu-open fills on a selected row", () => {
    const { container } = render(
      <table>
        <tbody>
          <TableRow selected clickable>
            <td>Строка</td>
          </TableRow>
        </tbody>
      </table>
    )
    const row = container.querySelector('[data-slot="table-row"]')!
    expect(row).toHaveClass("bg-[var(--table-row-active-bg)]")
    expect(row.className).toContain("has-[[data-popup-open]]")
    expect(row).toHaveClass("hover:bg-[var(--table-row-hover-bg)]")
    expect(row).toHaveClass("active:bg-[var(--table-row-active-bg)]")
  })
})

// "Прокрутки и закрепления" (node 70279:7616) — pinned cells are sticky and
// offset by the width of the cells they are anchored past.
describe("column pinning", () => {
  it("makes pinned cells sticky and leaves the rest alone", () => {
    const { container } = render(
      <Table>
        <TableBody>
          <TableRow>
            <TableCell type="checkbox" pin="left" />
            <TableCell type="text">Наименование</TableCell>
            <TableCell type="button" pin="right" actions={[{ text: "Удалить" }]} />
          </TableRow>
        </TableBody>
      </Table>
    )

    const cells = container.querySelectorAll('[data-slot="table-cell"]')
    expect(cells[0]).toHaveAttribute("data-pin", "left")
    expect(cells[0]).toHaveClass("sticky")
    expect(cells[1]).not.toHaveAttribute("data-pin")
    expect(cells[1]).not.toHaveClass("sticky")
    expect(cells[2]).toHaveAttribute("data-pin", "right")
    expect(cells[2]).toHaveClass("sticky")
  })

  // Правый блок держит собственную белую заливку поверх выделенной строки
  // только пока он реально перекрывает прокручиваемый контент — то же
  // условие, что и у тени («Если [прокрутка] в крайнем правом положении —
  // не отображается правая подложка»). Без горизонтальной прокрутки (как
  // здесь, в jsdom) перекрывать нечего, поэтому ячейка — обычная часть
  // строки и берёт её заливку; иначе последний столбец с selection button
  // выпадал из выделения строки, когда таблицу докручивали вправо до конца.
  it("lets the right action block take the row fill when it covers nothing", () => {
    const { container } = render(
      <Table>
        <TableBody>
          <TableRow selected>
            <TableCell type="text" pin="left">
              Наименование
            </TableCell>
            <TableCell type="button" pin="right" actions={[{ text: "Удалить" }]} />
          </TableRow>
        </TableBody>
      </Table>
    )

    const cells = container.querySelectorAll('[data-slot="table-cell"]')
    expect(cells[0]).toHaveClass("bg-inherit")
    expect(cells[1]).toHaveClass("bg-inherit")
  })
})
