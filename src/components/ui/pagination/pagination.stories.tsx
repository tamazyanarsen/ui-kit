import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"

import { Pagination } from "./pagination"

const meta = {
  title: "Template/Pagination",
  component: Pagination,
  parameters: { layout: "padded" },
  args: { page: 1, totalPages: 20 },
} satisfies Meta<typeof Pagination>

export default meta
type Story = StoryObj<typeof meta>

function Controlled({
  totalPages = 20,
  initialPage = 5,
  initialPageSize = 25,
  pageSizeOptions,
  showPageSize,
  className,
}: {
  totalPages?: number
  initialPage?: number
  initialPageSize?: number
  pageSizeOptions?: number[]
  showPageSize?: boolean
  className?: string
}) {
  const [page, setPage] = useState(initialPage)
  const [pageSize, setPageSize] = useState(initialPageSize)
  return (
    <Pagination
      page={page}
      totalPages={totalPages}
      onPageChange={setPage}
      pageSize={pageSize}
      onPageSizeChange={setPageSize}
      pageSizeOptions={pageSizeOptions}
      showPageSize={showPageSize}
      className={className}
    />
  )
}

export const Default: Story = {
  render: (args) => (
    <Controlled
      totalPages={args.totalPages}
      initialPage={args.page}
      initialPageSize={args.pageSize}
      pageSizeOptions={args.pageSizeOptions}
      showPageSize={args.showPageSize}
      className={args.className}
    />
  ),
}

export const FewPages: Story = {
  name: "7 or fewer pages (no ellipsis)",
  render: () => <Controlled totalPages={5} />,
}

export const NoPageSize: Story = {
  render: () => <Pagination page={1} totalPages={10} showPageSize={false} />,
}
