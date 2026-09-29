import { describe, expect, it } from "vitest"
import { render } from "@testing-library/react"

import { DropdownItem } from "./dropdown"

// Аудит r25: `description={0}` (`description && …`) выводил голый «0» в
// колонку пункта — без серой строки описания.

describe("DropdownItem: описание 0", () => {
  it("рисуется второй строкой пункта", () => {
    const { container } = render(<DropdownItem text="Пункт" description={0} />)
    const rows = container.querySelectorAll('[data-slot="dropdown-item"] > span')
    expect(rows).toHaveLength(2)
    expect(rows[1]).toHaveTextContent("0")
  })

  it("пустая строка вторую строку не рисует", () => {
    const { container } = render(<DropdownItem text="Пункт" description="" />)
    expect(container.querySelectorAll('[data-slot="dropdown-item"] > span')).toHaveLength(1)
  })
})
