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

function Controlled({ totalPages = 20 }: { totalPages?: number }) {
  const [page, setPage] = useState(5)
  const [pageSize, setPageSize] = useState(25)
  return (
    <Pagination
      page={page}
      totalPages={totalPages}
      onPageChange={setPage}
      pageSize={pageSize}
      onPageSizeChange={setPageSize}
    />
  )
}

export const Default: Story = {
  render: () => <Controlled />,
}

export const FewPages: Story = {
  name: "7 or fewer pages (no ellipsis)",
  render: () => <Controlled totalPages={5} />,
}

export const NoPageSize: Story = {
  render: () => <Pagination page={1} totalPages={10} showPageSize={false} />,
}
