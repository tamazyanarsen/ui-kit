import type { Meta, StoryObj } from "@storybook/react-vite"
import type { ComponentProps } from "react"

import { StatesMatrix } from "@/stories/matrix"

import { FileListItem } from "./file-item"

type FileListItemProps = ComponentProps<typeof FileListItem>

const meta = {
  title: "Компоненты/Files",
  component: FileListItem,
  parameters: { layout: "padded" },
  // `errorText` is `React.ReactNode` but every usage is a plain string —
  // without this, leaving it unset falls back to a generic "Set object"
  // JSON editor.
  argTypes: {
    name: { control: "text" },
    meta: { control: "text" },
    errorText: { control: "text" },
    size: {
      name: "Size",
      control: "inline-radio",
      options: ["l", "s"],
      description: "L — строка с плиткой 48px, S — компактная с иконкой 16px",
    },
    state: {
      control: "inline-radio",
      options: ["default", "loading", "error", "disabled"],
    },
    showEdit: { control: "boolean" },
    showCross: { control: "boolean" },
  },
  args: { name: "Договор аренды.pdf", meta: "1.2 МБ", size: "l", state: "default" },
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
      rowHeader="Size=S — компактная строка: иконка 16px без плитки, имя P3, подпись P4."
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
        { label: "Size=S", props: { size: "s" } },
        { label: "Size=S\nLoading", props: { size: "s", state: "loading" } },
        {
          label: "Size=S\nError",
          props: { size: "s", state: "error", errorText: "Не удалось загрузить файл" },
        },
      ]}
      render={(props) => <FileListItem {...props} />}
    />
  ),
}
