import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"

import { RESPONSIVE_NOTE, StatesMatrix } from "@/stories/matrix"

import { Pagination, type PaginationProps } from "./pagination"

const meta = {
  title: "Компоненты/Paginator",
  component: Pagination,
  parameters: { layout: "padded" },
  argTypes: {
    page: { control: { type: "number", min: 1 } },
    totalPages: { control: { type: "number", min: 1 } },
    pageSize: { control: "number" },
    pageSizeOptions: { control: "object" },
    showPageSize: { control: "boolean" },
  },
  args: { page: 5, totalPages: 20, pageSize: 25, showPageSize: true },
} satisfies Meta<PaginationProps>

export default meta
type Story = StoryObj<PaginationProps>

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
  render: (args) => (
    <Controlled key={`${args.page}-${args.pageSize}`} {...args} />
  ),
}

export const Matrix: Story = {
  name: "Matrix (все состояния)",
  parameters: { layout: "fullscreen", controls: { disable: true } },
  render: () => (
    <StatesMatrix<PaginationProps>
      stretch
      cellClassName="min-w-[560px]"
      rowHeader={RESPONSIVE_NOTE}
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
        { label: "Одна страница", props: { page: 1, totalPages: 1 } },
        { label: "Hover", props: { page: 10, totalPages: 20 }, pseudo: "hover" },
      ]}
      render={(props) => <Controlled {...props} />}
    />
  ),
}
