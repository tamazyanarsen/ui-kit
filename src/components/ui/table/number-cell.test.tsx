import { describe, expect, it } from "vitest"
import { render } from "@testing-library/react"

import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "."

describe("TableCell number type", () => {
  it("right-aligns with tabular figures and tints incoming money", () => {
    const { container } = render(
      <Table>
        <TableBody>
          <TableRow>
            <TableCell type="number" tone="positive" description="Поступление">
              +31 922 980,05
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    )

    const cell = container.querySelector('[data-slot="table-cell"]')!
    expect(cell).toHaveClass("text-right")
    // Значение разбито на узлы: каждая цифра стоит в коробке одинаковой
    // ширины, потому что в Object Sans табличных цифр НЕТ вовсе и
    // `tabular-nums` ничего не даёт. Правило в классах оставлено на будущее.
    const value = container.querySelector(".tabular-nums.font-medium")!
    expect(value).toHaveClass("text-[var(--table-number-positive-fg)]")
    expect(value.textContent).toBe("+31 922 980,05")
    // 0.93ch, а не 1ch: `ch` — это ширина нуля, а он в Object Sans заметно
    // шире прочих цифр, и коробка по нему раздувала число (дизайн-чек:
    // «надо немного сократить кернинг»).
    const digits = value.querySelectorAll(".w-\\[0\\.93ch\\]")
    expect(digits).toHaveLength(10)
    // Разряды, запятая и знак ширину не меняют — их не трогаем.
    expect([...digits].map((node) => node.textContent).join("")).toBe(
      "3192298005"
    )
    // Разрядные пробелы исключены из выделения: при копировании числа они не
    // должны попадать в текст. Пробел перед знаком валюты — часть значения,
    // его не трогаем (проверяется отдельным тестом ниже).
    const separators = value.querySelectorAll(".select-none")
    expect(separators).toHaveLength(2)
    expect(
      [...separators].every((node) => /^\s$/.test(node.textContent!))
    ).toBe(true)
  })

  // Знак живёт В ЯЧЕЙКЕ через неразрывный пробел после числа, а не в
  // заголовке столбца: в одной колонке значения бывают в разных единицах.
  it("puts the unit after the value with a non-breaking space", () => {
    const { container } = render(
      <Table>
        <TableBody>
          <TableRow>
            <TableCell type="number" unit="₽">
              1 250,00
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    )

    const unit = container.querySelector('[data-slot="table-cell-unit"]')!
    expect(unit.textContent).toBe(" ₽")
    // Один знак на колонку — просто текст в потоке, без коробки: любая
    // коробка со своим `display` вставила бы в выделение перенос строки.
    expect(unit.className).toBe("")
  })

  // Разные знаки в одной колонке — тогда все варианты лежат в ОДНОЙ клетке
  // грида, и она получает ширину самого широкого глифа: «запятая под
  // запятой» держится и там, где рядом «₽» и «$».
  it("reserves the widest unit when a column mixes signs", () => {
    const { container } = render(
      <Table>
        <TableBody>
          <TableRow>
            <TableCell type="number" unit="$" unitVariants={["₽", "$"]}>
              500 000,00
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    )

    const unit = container.querySelector('[data-slot="table-cell-unit"]')!
    expect(unit).toHaveClass("inline-grid")
    const items = unit.querySelectorAll("span")
    expect(items).toHaveLength(2)
    // Двойник держит ширину, но не читается ни глазом, ни скринридером.
    const ghost = [...items].find((node) => node.textContent === " ₽")!
    expect(ghost).toHaveClass("invisible")
    expect(ghost).toHaveAttribute("aria-hidden", "true")
    const visible = [...items].find((node) => node.textContent === " $")!
    expect(visible.className).not.toContain("invisible")
  })

  // Пустая ячейка знака не получает: «₽» в одиночестве читается как
  // значение, которого нет, а выравнивать в пустой строке нечего.
  it("skips the unit on an empty value", () => {
    const { container } = render(
      <Table>
        <TableBody>
          <TableRow>
            <TableCell type="number" unit="₽" />
          </TableRow>
        </TableBody>
      </Table>
    )

    expect(
      container.querySelector('[data-slot="table-cell-unit"]')
    ).toBeNull()
  })
})
