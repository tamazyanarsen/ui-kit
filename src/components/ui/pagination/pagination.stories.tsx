import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"

import { StatesMatrix, viewportArgType } from "@/stories/matrix"
import { orderedOptionLabels } from "@/stories/options"
import { ViewportScope, type Viewport } from "@/lib/viewport"

import { PAGE_COUNTS, Pagination, type PaginationProps } from "./pagination"

/* Дизайн-чек №17: набор вариантов «записей на странице» — готовые пресеты,
   а не JSON-массив в контролах. Дизайн-чек №4 №7: пресетов ровно два — по
   значениям `Value` элемента «Page Count (ELK)» (нода 14679:38986). */

type PlaygroundArgs = PaginationProps & { viewport?: Viewport }

const meta = {
  title: "Компоненты/Paginator",
  component: Pagination,
  parameters: { layout: "padded" },
  argTypes: {
    // Дизайн-чек №36: набор свойств приведён к компонент-сету «ELK /
    // paginator» — появились `Size` (L/M) и переключатель блока страниц,
    // которого не хватало, чтобы проверить случай «всё уместилось на одной
    // странице».
    size: { name: "Size", control: "inline-radio", options: ["L", "M"] },
    // Дизайн-чек №4 №6: контрол «Page» — по имени элемента «Page (ELK)»
    // (14679:36012), у которого свойство Value = 1 – 7 / Begin / Middle /
    // End. В коде раскладка блока номеров считается из текущей и общей
    // страницы, поэтому здесь два числа, а не один список.
    page: { name: "Page", control: { type: "number", min: 1 } },
    totalPages: { control: { type: "number", min: 1 } },
    pageCount: {
      name: "Page Count",
      control: { type: "inline-radio", labels: orderedOptionLabels(PAGE_COUNTS) },
      options: PAGE_COUNTS,
    },
    // Дизайн-чек от 07.09, замечание 24: «В Paginator заложить вариант,
    // когда страниц слева не видно… поддержать возможность и вывести в
    // управление стори Playground». В таблице свойств (29998:35419) это
    // отдельная строка «Show All Page», ею контрол и назван.
    showPages: {
      name: "Show All Page",
      control: "boolean",
      description:
        "Блок номеров страниц слева. Выключается, когда выдача пуста: пагинатор остаётся, но показывает только выбор числа записей справа",
    },
    pageSize: { control: "number", table: { category: "Контент" } },
    // Дизайн-чек №4 №8: className — не свойство компонента из макета.
    className: { table: { disable: true } },
    // Дизайн-чек №3 №19: форма Desktop/Mobile выбирается контролом в панели
    // истории, а не изменением ширины вьюпорта.
    viewport: viewportArgType,
  },
  args: {
    size: "L",
    pageCount: "100 (Without 75)",
    page: 5,
    totalPages: 20,
    pageSize: 25,
    showPages: true,
    viewport: "auto",
  },
} satisfies Meta<PlaygroundArgs>

export default meta
type Story = StoryObj<PlaygroundArgs>

function Controlled({ page, pageSize, ...props }: PaginationProps) {
  const [currentPage, setCurrentPage] = useState(page)
  const [currentSize, setCurrentSize] = useState(pageSize)
  return (
    <Pagination
      {...props}
      page={currentPage}
      onPageChange={setCurrentPage}
      pageSize={currentSize}
      onPageSizeChange={setCurrentSize}
    />
  )
}

export const Playground: Story = {
  // Remount on every arg change so the `page`/`pageSize` controls actually
  // move the (otherwise internally-owned) state.
  render: ({ viewport, ...args }) => (
    <ViewportScope viewport={viewport}>
      <Controlled
        key={`${args.page}-${args.pageSize}-${args.pageCount}`}
        {...args}
      />
    </ViewportScope>
  ),
}

export const Matrix: Story = {
  name: "Matrix (все состояния)",
  parameters: { layout: "fullscreen", controls: { disable: true } },
  render: () => (
    <StatesMatrix<PaginationProps>
      stretch
      cellClassName="min-w-[560px]"
      responsive
      baseProps={{ pageSize: 25 }}
      columns={[{ label: "Paginator" }]}
      rows={[
        // ≤ 7 pages renders every number, no ellipsis.
        { label: "5 страниц\n(без многоточия)", props: { page: 1, totalPages: 5 } },
        { label: "Первая из 20", props: { page: 1, totalPages: 20 } },
        { label: "Средняя из 20", props: { page: 10, totalPages: 20 } },
        { label: "Последняя из 20", props: { page: 20, totalPages: 20 } },
        {
          label: "Page Count = 100\n(25 / 50 / 75 / 100)",
          props: { page: 1, totalPages: 10, pageCount: "100" },
        },
        // «Если все записи отображаются на одной странице, в правой части
        // пагинатора должен оставаться только один активный элемент —
        // текущая страница» (нода 30021:39016).
        { label: "Одна страница", props: { page: 1, totalPages: 1 } },
        // «В случае, если система возвращает пустое значение, пагинатор
        // также отображается, но отображается только правая часть (с
        // выбором числа записей на странице)» — там же.
        {
          label: "Пустой результат\n(страницы отключены)",
          props: { page: 1, totalPages: 1, showPages: false },
        },
        // Size=M: «выбор числа записей перемещается вниз на левую сторону».
        { label: "Size = M", props: { page: 5, totalPages: 20, size: "M" } },
        { label: "Hover", props: { page: 10, totalPages: 20 }, pseudo: "hover" },
      ]}
      render={(props) => <Controlled {...props} />}
    />
  ),
}
