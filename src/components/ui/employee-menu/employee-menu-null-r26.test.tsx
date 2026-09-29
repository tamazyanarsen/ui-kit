import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import { EmployeeMenu } from "./employee-menu"
import { EmployeeMenuNav } from "./employee-menu-nav"

// r26: HeaderMenu пустые элементы отбрасывает с r25, а меню сотрудника из
// того же семейства падало на `group.links` и `link.value`.

const link = { value: "a", label: "Заявки" }

describe("меню сотрудника: пустые элементы в списках", () => {
  it("EmployeeMenu: null-группа и null-ссылка пропускаются", () => {
    const groups = [
      null,
      false,
      { value: "g", title: "Группа", links: [null, link, false] },
    ] as never
    render(<EmployeeMenu groups={groups} columns={2} />)
    expect(screen.getByText("Заявки")).toBeInTheDocument()
    expect(screen.getByText("Группа")).toBeInTheDocument()
  })

  it("EmployeeMenuNav: null-ссылка пропускается", () => {
    render(<EmployeeMenuNav links={[null, link, false] as never} />)
    expect(screen.getAllByRole("button", { name: "Заявки" })).not.toHaveLength(0)
  })
})
