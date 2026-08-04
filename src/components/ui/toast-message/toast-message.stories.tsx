import type { Meta, StoryObj } from "@storybook/react-vite"

import { ToastProvider, Toaster } from "./toast-message"
import { useToast } from "./use-toast"
import { Button } from "@/components/ui/button"

function ToastLauncher({
  type,
  title,
  description,
  buttons = "none",
}: {
  type: "checked" | "attention" | "error" | "information"
  title: string
  description?: string
  // Figma's own "Type (Button)" property: Two Buttons / Black Button
  // (primary only) / White Button (secondary only) / none.
  buttons?: "none" | "two" | "black" | "white"
}) {
  const toast = useToast()
  return (
    <Button
      onClick={() =>
        toast.add({
          type,
          title,
          description,
          data:
            buttons === "none"
              ? undefined
              : {
                  primaryButtonLabel: buttons !== "white" ? "Повторить" : undefined,
                  secondaryButtonLabel: buttons !== "black" ? "Отмена" : undefined,
                },
        })
      }
    >
      Показать тост
    </Button>
  )
}

const meta = {
  title: "Status/Message/ToastMessage",
  component: ToastLauncher,
  parameters: { layout: "centered" },
  decorators: [
    (Story) => (
      <ToastProvider>
        <Story />
        <Toaster />
      </ToastProvider>
    ),
  ],
} satisfies Meta<typeof ToastLauncher>

export default meta
type Story = StoryObj<typeof meta>

export const Success: Story = {
  args: { type: "checked", title: "Скопировано в буфер обмена" },
}

export const Attention: Story = {
  args: { type: "attention", title: "Проверьте введённые данные" },
}

export const ErrorToast: Story = {
  args: { type: "error", title: "Не удалось сохранить", description: "Попробуйте ещё раз" },
}

export const Information: Story = {
  args: { type: "information", title: "Новая версия доступна" },
}

export const WithActionButtons: Story = {
  args: {
    type: "error",
    title: "Не удалось выполнить платёж",
    description: "Проверьте соединение с интернетом",
    buttons: "two",
  },
}

export const SingleBlackButton: Story = {
  args: {
    type: "checked",
    title: "Скопировано в буфер обмена",
    buttons: "black",
  },
}

export const SingleWhiteButton: Story = {
  args: {
    type: "attention",
    title: "Проверьте введённые данные",
    buttons: "white",
  },
}
