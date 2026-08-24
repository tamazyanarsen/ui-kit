import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import {
  TableHeadCell,
} from "."
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
