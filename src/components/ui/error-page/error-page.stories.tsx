import type { Meta, StoryObj } from "@storybook/react-vite"
import type { ComponentProps } from "react"

import { StatesMatrix } from "@/stories/matrix"

import { ErrorPage } from "./error-page"

type ErrorPageProps = ComponentProps<typeof ErrorPage>

const meta = {
  title: "Компоненты/Error Page",
  component: ErrorPage,
  parameters: { layout: "fullscreen" },
  argTypes: {
    code: { control: "text" },
    title: { control: "text" },
    description: { control: "text" },
    buttonLabel: { control: "text" },
  },
  args: {
    code: "404",
    title: "Страница не найдена",
    description: "Возможно, она была перемещена или удалена",
    buttonLabel: "На главную",
  },
} satisfies Meta<ErrorPageProps>

export default meta
type Story = StoryObj<ErrorPageProps>

export const Playground: Story = {}

export const Matrix: Story = {
  name: "Matrix (все состояния)",
  parameters: { layout: "fullscreen", controls: { disable: true } },
  render: () => (
    <StatesMatrix<ErrorPageProps>
      stretch
      cellClassName="min-w-[560px]"
      columns={[{ label: "Error Page" }]}
      rows={[
        {
          label: "404",
          props: {
            code: "404",
            title: "Страница не найдена",
            description: "Возможно, она была перемещена или удалена",
            buttonLabel: "На главную",
          },
        },
        {
          label: "403",
          props: {
            code: "403",
            title: "Доступ запрещён",
            description: "У вас нет прав для просмотра этой страницы",
            buttonLabel: "На главную",
          },
        },
        {
          label: "500",
          props: {
            code: "500",
            title: "Что-то пошло не так",
            description: "Мы уже работаем над этим — попробуйте позже",
            buttonLabel: "Обновить",
          },
        },
        {
          label: "Без кода",
          props: {
            title: "Раздел временно недоступен",
            description: "Проводятся технические работы",
            buttonLabel: "На главную",
          },
        },
        {
          label: "Без кнопки",
          props: { code: "404", title: "Страница не найдена" },
        },
      ]}
      render={(props) => <ErrorPage {...props} />}
    />
  ),
}
