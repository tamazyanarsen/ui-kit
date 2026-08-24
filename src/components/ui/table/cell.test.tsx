import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import {
  Table,
  TableBody,
  TableCell,
  TableHeadCell,
  TableRow,
} from "."
import { ChevronDown } from "@/icons"

describe("TableCell", () => {
  it("renders a checkbox and calls onCheckedChange", async () => {
    const user = userEvent.setup()
    const onCheckedChange = vi.fn()
    render(
      <table>
        <tbody>
          <tr>
            <TableCell type="checkbox" onCheckedChange={onCheckedChange} />
          </tr>
        </tbody>
      </table>
    )

    await user.click(screen.getByRole("checkbox"))

    expect(onCheckedChange).toHaveBeenCalledWith(true, expect.anything())
  })

  it("renders text with an optional description line", () => {
    render(
      <table>
        <tbody>
          <tr>
            <TableCell type="text" description="Менеджер">
              Воронаев Сергей
            </TableCell>
          </tr>
        </tbody>
      </table>
    )
    expect(screen.getByText("Воронаев Сергей")).toBeInTheDocument()
    expect(screen.getByText("Менеджер")).toBeInTheDocument()
  })

  it("wraps tag content in a colored Tag", () => {
    render(
      <table>
        <tbody>
          <tr>
            <TableCell type="tag" tagColor="green">
              Активен
            </TableCell>
          </tr>
        </tbody>
      </table>
    )
    expect(screen.getByText("Активен")).toBeInTheDocument()
  })

  it("renders an icon", () => {
    const { container } = render(
      <table>
        <tbody>
          <tr>
            <TableCell type="icon" icon={<ChevronDown data-testid="chevron" />} />
          </tr>
        </tbody>
      </table>
    )
    expect(container.querySelector("svg")).toBeInTheDocument()
  })
})

// "Сворачивание/разворачивание строк" (node 70279:7290).
describe("row nesting", () => {
  it("indents the cell content by 16px per level", () => {
    const { container } = render(
      <Table>
        <TableBody>
          <TableRow>
            <TableCell level={2}>1.1.1</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    )

    const content = container.querySelector('[data-slot="table-cell"] > span')
    expect(content).toHaveStyle({ paddingLeft: "32px" })
  })

  it("toggles a row through its collapse chevron", async () => {
    const user = userEvent.setup()
    const onExpandedChange = vi.fn()
    render(
      <Table>
        <TableBody>
          <TableRow>
            <TableCell
              expandable
              expanded
              onExpandedChange={onExpandedChange}
            >
              1.1
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    )

    await user.click(screen.getByRole("button", { name: "Свернуть строку" }))

    expect(onExpandedChange).toHaveBeenCalledWith(false)
  })

  // "в таблицах со сворачиванием/разворачиванием не предусмотрена
  // пользовательская сортировка" + "не может менять ширину столбца,
  // идентифицирующего иерархию".
  it("refuses sort and resize on the hierarchy column", () => {
    const { container } = render(
      <table>
        <thead>
          <tr>
            <TableHeadCell collapsible sortable resizable>
              Код
            </TableHeadCell>
            <TableHeadCell sortable resizable>
              Статья расходов
            </TableHeadCell>
          </tr>
        </thead>
      </table>
    )

    const [hierarchy, plain] = container.querySelectorAll(
      '[data-slot="table-head-cell"]'
    )
    expect(hierarchy.querySelector('[data-slot="table-sort"]')).toBeNull()
    expect(
      hierarchy.querySelector('[data-slot="table-resize-handle"]')
    ).toBeNull()
    expect(
      hierarchy.querySelector('[data-slot="table-collapse-toggle"]')
    ).not.toBeNull()
    expect(plain.querySelector('[data-slot="table-sort"]')).not.toBeNull()
    expect(
      plain.querySelector('[data-slot="table-resize-handle"]')
    ).not.toBeNull()
  })

  it("omits the chevron on the deepest level but keeps the indent", () => {
    const { container } = render(
      <Table>
        <TableBody>
          <TableRow>
            <TableCell level={3}>1.1.1.1</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    )

    expect(
      container.querySelector('[data-slot="table-collapse-toggle"]')
    ).toBeNull()
    expect(container.querySelector('[data-slot="table-cell"] > span')).toHaveStyle(
      { paddingLeft: "48px" }
    )
  })
})

// "Статусная" (node 70279:7054) — the Tag is clipped to the column and the
// full status moves into a hint, since Tag itself is `w-fit whitespace-nowrap`.
describe("TableCell tag type", () => {
  it("clips the tag inside the cell instead of letting it spill", () => {
    const { container } = render(
      <Table>
        <TableBody>
          <TableRow>
            <TableCell type="tag" tagColor="orange">
              Готов к подписанию
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    )

    const wrapper = container.querySelector('[data-slot="table-cell"] > span')!
    expect(wrapper).toHaveClass("overflow-hidden")
    expect(wrapper.querySelector('[data-slot="tag"] > span')).toHaveClass(
      "truncate"
    )
  })
})

// "Действия со строкой" (node 70279:7066) — "Для строк с единственным

// действием допускается замена на кнопку с пиктограммой и обязательной
// текстовой подсказкой при наведении".
describe("TableCell action types", () => {
  it("renders the single-action form with its label as the accessible name", async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(
      <Table>
        <TableBody>
          <TableRow>
            <TableCell
              type="button"
              action={{
                icon: ChevronDown,
                label: "Скачать выписку",
                onClick,
              }}
            />
          </TableRow>
        </TableBody>
      </Table>
    )

    await user.click(screen.getByRole("button", { name: "Скачать выписку" }))

    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it("prefers the single action over the menu form", () => {
    render(
      <Table>
        <TableBody>
          <TableRow>
            <TableCell
              type="button"
              action={{ icon: ChevronDown, label: "Скачать" }}
              actions={[{ text: "Удалить" }]}
            />
          </TableRow>
        </TableBody>
      </Table>
    )

    expect(screen.getByRole("button", { name: "Скачать" })).toBeInTheDocument()
    expect(
      screen.queryByRole("button", { name: "Действия со строкой" })
    ).not.toBeInTheDocument()
  })
})
