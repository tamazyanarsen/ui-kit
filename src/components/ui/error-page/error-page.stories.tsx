import type { Meta, StoryObj } from "@storybook/react-vite"

import { ErrorPage } from "./error-page"

const meta = {
  title: "Template/ErrorPage",
  component: ErrorPage,
  parameters: { layout: "fullscreen" },
  args: {
    code: "404",
    title: "Страница не найдена",
    description: "Возможно, она была перемещена или удалена",
    buttonLabel: "На главную",
  },
} satisfies Meta<typeof ErrorPage>

export default meta
type Story = StoryObj<typeof meta>

export const NotFound: Story = {}

export const Forbidden: Story = {
  args: { code: "403", title: "Доступ запрещён", description: "У вас нет прав для просмотра этой страницы" },
}

export const NoCode: Story = {
  args: { code: undefined },
}
