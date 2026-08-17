import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { ChevronDown } from "@/icons"

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
    // Значение разбито на узлы: каждая цифра стоит в коробке 1ch, потому что
    // в Object Sans табличных цифр НЕТ вовсе и `tabular-nums` ничего не даёт.
    // Правило в классах при этом оставлено на будущее.
    const value = container.querySelector(".tabular-nums.font-medium")!
    expect(value).toHaveClass("text-[var(--table-number-positive-fg)]")
    expect(value.textContent).toBe("+31 922 980,05")
    const digits = value.querySelectorAll(".w-\\[1ch\\]")
    expect(digits).toHaveLength(10)
    // Разряды, запятая и знак ширину не меняют — их не трогаем.
    expect([...digits].map((node) => node.textContent).join("")).toBe(
      "3192298005"
    )
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
