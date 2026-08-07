import type { Meta, StoryObj } from "@storybook/react-vite"
import type { ComponentProps } from "react"

import { StatesMatrix } from "@/stories/matrix"

import { FileUploadDropzone } from "./dropzone"

type DropzoneProps = ComponentProps<typeof FileUploadDropzone>

const meta = {
  title: "Interaction/File Upload/Dropzone",
  component: FileUploadDropzone,
  parameters: { layout: "padded" },
  argTypes: {
    children: { control: "text" },
    subtitle: { control: "text" },
    accept: { control: "text" },
    error: { control: "boolean" },
    disabled: { control: "boolean" },
    multiple: { control: "boolean" },
  },
  args: {
    subtitle: "PDF, DOCX до 10 МБ",
    error: false,
    disabled: false,
    multiple: false,
  },
} satisfies Meta<DropzoneProps>

export default meta
type Story = StoryObj<DropzoneProps>

export const Playground: Story = {}

export const Matrix: Story = {
  name: "Matrix (все состояния)",
  parameters: { layout: "fullscreen", controls: { disable: true } },
  render: () => (
    <StatesMatrix<DropzoneProps>
      stretch
      cellClassName="min-w-[360px]"
      columns={[
        { label: "С подписью", props: { subtitle: "PDF, DOCX до 10 МБ" } },
        { label: "Без подписи", props: {} },
      ]}
      rows={[
        { label: "Default", props: {} },
        { label: "Hover", props: {}, pseudo: "hover" },
        { label: "Error", props: { error: true } },
        { label: "Disabled", props: { disabled: true } },
        { label: "Свой текст", props: { children: "Загрузите скан паспорта" } },
      ]}
      render={(props) => <FileUploadDropzone {...props} />}
    />
  ),
}
