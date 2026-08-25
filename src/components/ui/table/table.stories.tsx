import type { Meta, StoryObj } from "@storybook/react-vite"

import { Download } from "@/icons"
import { ButtonMenuOverflowItem } from "@/components/ui/button-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHeadCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { StorySection, StoryShowcase } from "@/stories/matrix"
import { TABLE_ROWS } from "@/stories/table-data"
import { TableExample, type TableExampleProps } from "@/stories/table-example"
import { TableFieldTypesExample } from "@/stories/table-field-types-example"
import { TableFieldsExample } from "@/stories/table-fields-example"

const meta = {
  title: "Компоненты/Table",
  component: TableExample,
  parameters: { layout: "padded" },
  argTypes: {
    block: { control: "boolean" },
    showTop: { control: "boolean" },
    showDetails: { control: "boolean" },
    showPagination: { control: "boolean" },
    selectable: { control: "boolean" },
    sortable: { control: "boolean" },
    nested: { control: "boolean" },
    pinned: { control: "boolean" },
    stickyHeader: { control: "boolean" },
    resizable: { control: "boolean" },
    showDescription: { control: "boolean" },
    empty: { control: "boolean" },
  },
  args: {
    block: true,
    showTop: true,
    showDetails: true,
    showPagination: true,
    selectable: true,
    sortable: true,
    nested: true,
    pinned: true,
    stickyHeader: false,
    resizable: true,
    showDescription: true,
    empty: false,
  },
} satisfies Meta<TableExampleProps>

export default meta
type Story = StoryObj<TableExampleProps>

export const Playground: Story = {}

/* Table is a composition, not a single prop-driven component — the real
   variant axis is the cell type, so the second story enumerates every
   head-cell and body-cell type the kit ships, plus the row fills. */
export const Matrix: Story = {
  name: "Matrix (типы ячеек и состояния)",
  parameters: { layout: "fullscreen", controls: { disable: true } },
  render: () => (
    <StoryShowcase>
      <StorySection
        title="Типы ячеек заголовка (TableHeadCell)"
        description="Чекбокс, сворачивание всех строк, текст с левой и правой выключкой (с сортировкой и без), иконка, меню и филлер над закреплённым блоком действий."
      >
        <Table>
          <TableHeader>
            <tr>
              <TableHeadCell type="checkbox" />
              <TableHeadCell type="collapse" expanded />
              <TableHeadCell type="subtitle-left">Subtitle Left</TableHeadCell>
              <TableHeadCell type="subtitle-left" sortable>
                Sortable
              </TableHeadCell>
              <TableHeadCell type="subtitle-left" sortable sortDirection="asc">
                Sorted ↑
              </TableHeadCell>
              <TableHeadCell type="subtitle-left" sortable sortDirection="desc">
                Sorted ↓
              </TableHeadCell>
              <TableHeadCell type="subtitle-right" sortable>
                Subtitle Right
              </TableHeadCell>
              <TableHeadCell
                type="icon"
                icon={<Download aria-hidden="true" className="size-4" />}
              />
              <TableHeadCell
                type="button"
                menu={<ButtonMenuOverflowItem text="Настроить столбцы" />}
              />
              <TableHeadCell type="filler" />
            </tr>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell type="checkbox" />
              <TableCell type="collapse" expandable expanded />
              <TableCell>Text</TableCell>
              <TableCell>Text</TableCell>
              <TableCell>Text</TableCell>
              <TableCell>Text</TableCell>
              <TableCell type="number">99 999,99 ₽</TableCell>
              <TableCell
                type="icon"
                icon={<Download aria-hidden="true" className="size-4" />}
              />
              <TableCell>—</TableCell>
              <TableCell
                type="button"
                actions={[{ text: "Открыть карточку" }]}
              />
            </TableRow>
          </TableBody>
        </Table>
      </StorySection>

      <StorySection
        title="Типы ячеек строки (TableCell)"
        description="Числовая ячейка использует табличные цифры («запятая под запятой»), поступления окрашены в зелёный."
      >
        <Table>
          <TableHeader>
            <tr>
              <TableHeadCell type="subtitle-left">checkbox</TableHeadCell>
              <TableHeadCell type="subtitle-left">collapse</TableHeadCell>
              <TableHeadCell type="subtitle-left">text</TableHeadCell>
              <TableHeadCell type="subtitle-left">
                text + description
              </TableHeadCell>
              <TableHeadCell type="subtitle-right">number</TableHeadCell>
              <TableHeadCell type="subtitle-right">number +</TableHeadCell>
              <TableHeadCell type="subtitle-left">tag</TableHeadCell>
              <TableHeadCell type="filler" />
            </tr>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell type="checkbox" />
              <TableCell type="collapse" expandable expanded={false} />
              <TableCell>Текст в ячейке</TableCell>
              <TableCell description="Пояснение в ячейке">
                Текст в ячейке
              </TableCell>
              <TableCell type="number" description="Списание">
                2 980 133 515,05 ₽
              </TableCell>
              <TableCell type="number" tone="positive" description="Поступление">
                +31 922 980,05 ₽
              </TableCell>
              <TableCell type="tag" tagColor="green">
                Исполнен
              </TableCell>
              <TableCell type="button" actions={[{ text: "Удалить" }]} />
            </TableRow>
          </TableBody>
        </Table>
      </StorySection>

      <StorySection
        title="Line Fill — состояния строки"
        description="Ховер и Active появляются только у кликабельных строк; Added живёт 2000 ms (1000 статично + 1000 затухание), поэтому в статике виден уже погасшим."
      >
        <Table>
          <TableHeader>
            <tr>
              <TableHeadCell type="subtitle-left">Состояние</TableHeadCell>
              <TableHeadCell type="subtitle-left">Строка</TableHeadCell>
            </tr>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Default</TableCell>
              <TableCell>Без заливки</TableCell>
            </TableRow>
            <TableRow clickable>
              <TableCell>Hover / Active</TableCell>
              <TableCell>Наведите курсор — строка кликабельна</TableCell>
            </TableRow>
            <TableRow selected>
              <TableCell>Selected</TableCell>
              <TableCell>Выбрана чекбоксом</TableCell>
            </TableRow>
            <TableRow added>
              <TableCell>Added</TableCell>
              <TableCell>Только что созданная строка</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </StorySection>

      <StorySection
        title="Вложенность"
        description="Каждый уровень сдвигает контент на 16px; у самого глубокого уровня шеврон не показывается, но отступ сохраняется."
      >
        <Table>
          <TableHeader>
            <tr>
              <TableHeadCell type="subtitle-left" collapsible expanded>
                Код
              </TableHeadCell>
              <TableHeadCell type="subtitle-left">
                Статья расходов
              </TableHeadCell>
            </tr>
          </TableHeader>
          <TableBody>
            {TABLE_ROWS.map((row) => (
              <TableRow key={row.id}>
                <TableCell
                  level={row.level}
                  expandable={TABLE_ROWS.some((r) => r.parent === row.id)}
                  expanded
                >
                  {row.code}
                </TableCell>
                <TableCell>{row.title}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </StorySection>

      <StorySection
        title="Табличный блок целиком"
        description="Прокрутите таблицу по горизонтали: закреплённые блоки слева и справа отбрасывают тень только пока за ними есть скрытый контент."
      >
        <TableExample stickyHeader />
      </StorySection>
    </StoryShowcase>
  ),
}

/* Третья история — не вариант оформления, а второй способ собрать таблицу:
   вместо разметки строк место использования отдаёт данные и конфиг полей, а
   ячейки строит `DataTable` по типу поля. */
export const Fields: Story = {
  name: "По конфигу полей (DataTable)",
  parameters: { layout: "fullscreen", controls: { disable: true } },
  render: () => (
    <StoryShowcase>
      <StorySection
        title="Таблица по конфигу полей"
        description="Ни одной ячейки в разметке: `fields` описывает столбцы, `rows` отдаёт данные. Даты приходят строками ISO, суммы — числами, статусы — ключами словаря; формат, выключка, табличные цифры и знак валюты выбираются по типу поля. Вложенность выключает сортировку — по документации она невозможна без нарушения иерархии."
      >
        <TableFieldsExample />
      </StorySection>

      <StorySection
        title="Все типы полей"
        description="По столбцу на тип: text, list («Несколько (N)»), number, money, percent, date, datetime, time, boolean, checkbox, tag, link, custom и пустое значение."
      >
        <TableFieldTypesExample />
      </StorySection>
    </StoryShowcase>
  ),
}