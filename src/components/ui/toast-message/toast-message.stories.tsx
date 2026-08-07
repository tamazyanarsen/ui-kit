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
  // `ToastLauncher` is a plain function declared locally in this file
  // rather than imported from its own component module — Storybook's
  // docgen (react-docgen-typescript) only reliably extracts props from
  // component modules, so none of this wrapper's props got a Controls row
  // at all. Declare them explicitly so they're actually reachable.
  argTypes: {
    type: { control: "select", options: ["checked", "attention", "error", "information"] },
    title: { control: "text" },
    description: { control: "text" },
    buttons: { control: "select", options: ["none", "two", "black", "white"] },
  },
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

// Size=Mobile: 328px wide, 16px padding and a 16px close cross (Desktop is
// 480/24/24). Pinned through `globals` because `md:` is a viewport media
// query — see the note on Button's own mobile story.
export const MobileSize: Story = {
  name: "Mobile size (328px)",
  globals: { viewport: { value: "mobile1", isRotated: false } },
  args: {
    type: "checked",
    title: "Платёж отправлен",
    description: "Мы уведомим вас о статусе",
  },
}
