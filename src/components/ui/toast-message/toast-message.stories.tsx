import type { Meta, StoryObj } from "@storybook/react-vite"

import { ToastProvider, Toaster } from "./toast-message"
import { useToast } from "./use-toast"
import { Button } from "@/components/ui/button"

function ToastLauncher({
  type,
  title,
  description,
  withButtons,
}: {
  type: "checked" | "attention" | "error" | "information"
  title: string
  description?: string
  withButtons?: boolean
}) {
  const toast = useToast()
  return (
    <Button
      onClick={() =>
        toast.add({
          type,
          title,
          description,
          data: withButtons
            ? { primaryButtonLabel: "Повторить", secondaryButtonLabel: "Отмена" }
            : undefined,
        })
      }
    >
      Показать тост
    </Button>
  )
}

const meta = {
  title: "UI/ToastMessage",
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
    withButtons: true,
  },
}
