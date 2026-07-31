import type { Meta, StoryObj } from "@storybook/react-vite"

import { FileUploadDropzone } from "./dropzone"

const meta = {
  title: "Interaction/FileUpload/Dropzone",
  component: FileUploadDropzone,
  parameters: { layout: "padded" },
  args: {
    subtitle: "PDF, DOCX до 10 МБ",
  },
} satisfies Meta<typeof FileUploadDropzone>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const ErrorState: Story = {
  args: { error: true },
}

export const Disabled: Story = {
  args: { disabled: true },
}

export const CustomLabel: Story = {
  args: { children: "Загрузите скан паспорта" },
}
