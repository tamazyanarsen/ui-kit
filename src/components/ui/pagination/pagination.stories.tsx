import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"

import { StatesMatrix, viewportArgType } from "@/stories/matrix"
import { ViewportScope, type Viewport } from "@/lib/viewport"

import { Pagination, type PaginationProps } from "./pagination"

/* Дизайн-чек №17: набор вариантов «записей на странице» — готовые пресеты,
   а не JSON-массив в контролах. */
const PAGE_SIZE_PRESETS = {
  "25 / 50 / 100": [25, 50, 100],
  "10 / 25 / 50": [10, 25, 50],
  "50 / 100": [50, 100],
} satisfies Record<string, number[]>

type PageSizePreset = keyof typeof PAGE_SIZE_PRESETS

type PlaygroundArgs = PaginationProps & {
  pageSizePreset?: PageSizePreset
  viewport?: Viewport
}

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
    page: { control: { type: "number", min: 1 } },
    totalPages: { control: { type: "number", min: 1 } },
    pageSize: { control: "number" },
    pageSizePreset: {
      name: "Варианты записей на странице",
      control: "select",
      options: Object.keys(PAGE_SIZE_PRESETS),
    },
    pageSizeOptions: { table: { disable: true } },
    showPages: { name: "Блок страниц", control: "boolean" },
    showPageSize: { name: "Выбор числа записей", control: "boolean" },
    // Дизайн-чек №3 №19: форма Desktop/Mobile выбирается контролом в панели
    // истории, а не изменением ширины вьюпорта.
    viewport: viewportArgType,
  },
  args: {
    size: "L",
    pageSizePreset: "25 / 50 / 100",
    page: 5,
    totalPages: 20,
    pageSize: 25,
    showPages: true,
    showPageSize: true,
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
  render: ({ pageSizePreset, viewport, ...args }) => (
    <ViewportScope viewport={viewport}>
    <Controlled
      key={`${args.page}-${args.pageSize}-${pageSizePreset}`}
      {...args}
      pageSizeOptions={PAGE_SIZE_PRESETS[pageSizePreset ?? "25 / 50 / 100"]}
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
      // Без `pageSize` правая часть («Показать на странице» + 25/50/100) не
      // рендерится вовсе, и половина строк матрицы — включая «Без выбора
      // размера» и «Пустой результат» — выглядела одинаково пустой.
      baseProps={{ pageSize: 25 }}
      columns={[{ label: "Paginator" }]}
      rows={[
        // ≤ 7 pages renders every number, no ellipsis.
        { label: "5 страниц\n(без многоточия)", props: { page: 1, totalPages: 5 } },
        { label: "Первая из 20", props: { page: 1, totalPages: 20 } },
        { label: "Средняя из 20", props: { page: 10, totalPages: 20 } },
        { label: "Последняя из 20", props: { page: 20, totalPages: 20 } },
        {
          label: "Без выбора размера",
          props: { page: 1, totalPages: 10, showPageSize: false },
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
