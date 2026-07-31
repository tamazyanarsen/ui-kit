import type { Meta, StoryObj } from "@storybook/react-vite"

import { FileListItem } from "./file-item"

const meta = {
  title: "Interaction/FileUpload/FileListItem",
  component: FileListItem,
  parameters: { layout: "padded" },
  args: { name: "Договор аренды.pdf", meta: "1.2 МБ" },
} satisfies Meta<typeof FileListItem>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Loading: Story = {
  args: { state: "loading" },
}

export const ErrorState: Story = {
  args: { state: "error", errorText: "Не удалось загрузить файл" },
}

export const Disabled: Story = {
  args: { state: "disabled" },
}

export const List: Story = {
  render: () => (
    <div className="w-96 divide-y">
      <FileListItem name="Договор.pdf" meta="1.2 МБ" />
      <FileListItem name="Скан паспорта.jpg" state="loading" />
      <FileListItem name="Выписка.pdf" state="error" errorText="Файл повреждён" />
    </div>
  ),
}
