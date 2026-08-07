import type { Meta, StoryObj } from "@storybook/react-vite"
import type { ComponentProps } from "react"

import { StatesMatrix } from "@/stories/matrix"

import { FileListItem } from "./file-item"

type FileListItemProps = ComponentProps<typeof FileListItem>

const meta = {
  title: "Interaction/File Upload/Files",
  component: FileListItem,
  parameters: { layout: "padded" },
  // `errorText` is `React.ReactNode` but every usage is a plain string —
  // without this, leaving it unset falls back to a generic "Set object"
  // JSON editor.
  argTypes: {
    name: { control: "text" },
    meta: { control: "text" },
    errorText: { control: "text" },
    state: {
      control: "inline-radio",
      options: ["default", "loading", "error", "disabled"],
    },
    showEdit: { control: "boolean" },
    showCross: { control: "boolean" },
  },
  args: { name: "Договор аренды.pdf", meta: "1.2 МБ", state: "default" },
} satisfies Meta<FileListItemProps>

export default meta
type Story = StoryObj<FileListItemProps>

export const Playground: Story = {}

export const Matrix: Story = {
  name: "Matrix (все состояния)",
  parameters: { layout: "fullscreen", controls: { disable: true } },
  render: () => (
    <StatesMatrix<FileListItemProps>
      stretch
      cellClassName="min-w-[360px]"
      baseProps={{ name: "Договор аренды.pdf", meta: "1.2 МБ" }}
      columns={[
        { label: "С крестиком", props: { showCross: true } },
        { label: "С карандашом", props: { showEdit: true } },
        { label: "Без действий", props: { showCross: false, showEdit: false } },
      ]}
      rows={[
        { label: "Default", props: {} },
        { label: "Hover", props: {}, pseudo: "hover" },
        { label: "Loading", props: { state: "loading" } },
        {
          label: "Error",
          props: { state: "error", errorText: "Не удалось загрузить файл" },
        },
        { label: "Disabled", props: { state: "disabled" } },
      ]}
      render={(props) => <FileListItem {...props} />}
    />
  ),
}
