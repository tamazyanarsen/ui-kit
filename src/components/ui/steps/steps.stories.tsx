import type { Meta, StoryObj } from "@storybook/react-vite"

import { Steps } from "./steps"

const meta = {
  title: "Navigation/Steps",
  component: Steps,
  parameters: { layout: "padded" },
} satisfies Meta<typeof Steps>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    steps: [
      { title: "Шаг 1", description: "Заполнение заявки", state: "default", status: "filled" },
      { title: "Шаг 2", description: "Проверка данных", state: "active" },
      { title: "Шаг 3", description: "Подписание", state: "default" },
      { title: "Шаг 4", description: "Заблокирован", state: "disabled", disabledHint: "Заполните предыдущий шаг" },
    ],
  },
}

export const WithErrorStatus: Story = {
  args: {
    steps: [
      { title: "Шаг 1", description: "Заполнение", status: "error", statusText: "Ошибка в данных" },
      { title: "Шаг 2", description: "Проверка", state: "active" },
    ],
  },
}

export const WithFadeArrows: Story = {
  args: {
    showLeftFade: true,
    showRightFade: true,
    steps: Array.from({ length: 6 }, (_, i) => ({
      title: `Шаг ${i + 1}`,
      description: "Описание шага",
      state: i === 2 ? "active" : "default",
    })),
  },
}
