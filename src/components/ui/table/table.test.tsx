import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { ChevronDown } from "lucide-react"

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHeadCell,
  TableCell,
} from "./table"
import { ButtonMenuOverflowItem } from "@/components/ui/button-menu"

describe("TableHeadCell", () => {
  it("renders a select-all checkbox and calls onCheckedChange", async () => {
    const user = userEvent.setup()
    const onCheckedChange = vi.fn()
    render(
      <table>
        <thead>
          <tr>
            <TableHeadCell type="checkbox" onCheckedChange={onCheckedChange} />
          </tr>
        </thead>
      </table>
    )

    await user.click(screen.getByRole("checkbox"))

    expect(onCheckedChange).toHaveBeenCalledWith(true, expect.anything())
  })

  it("renders a sortable label and calls onSortClick", async () => {
    const user = userEvent.setup()
    const onSortClick = vi.fn()
    render(
      <table>
        <thead>
          <tr>
            <TableHeadCell type="subtitle-left" sortable onSortClick={onSortClick}>
              Сотрудник
            </TableHeadCell>
          </tr>
        </thead>
      </table>
    )

    await user.click(screen.getByRole("button", { name: /Сотрудник/ }))

    expect(onSortClick).toHaveBeenCalledTimes(1)
  })

  it("renders a plain (non-sortable) label as static text", () => {
    render(
      <table>
        <thead>
          <tr>
            <TableHeadCell type="subtitle-left">Статус</TableHeadCell>
          </tr>
        </thead>
      </table>
    )
    expect(screen.queryByRole("button")).not.toBeInTheDocument()
    expect(screen.getByText("Статус")).toBeInTheDocument()
  })

  it("renders the action menu for the button type", async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(
      <table>
        <thead>
          <tr>
            <TableHeadCell
              type="button"
              menu={<ButtonMenuOverflowItem text="Настроить столбцы" onClick={onClick} />}
            />
          </tr>
        </thead>
      </table>
    )

    await user.click(screen.getByRole("button", { name: "Настроить таблицу" }))
    await user.click(await screen.findByText("Настроить столбцы"))

    expect(onClick).toHaveBeenCalledTimes(1)
  })
})

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

  it("marks itself added via data attribute and its own background", () => {
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
    expect(row).toHaveClass("bg-[var(--table-row-added-bg)]")
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
})
