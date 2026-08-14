import type { Meta, StoryObj } from "@storybook/react-vite"
import type { ComponentProps } from "react"

import { StatesMatrix } from "@/stories/matrix"

import { ErrorPage } from "./error-page"

type ErrorPageProps = ComponentProps<typeof ErrorPage>

/* Дизайн-чек №27: «здесь и далее использовать текстовую строчку в простом
   состоянии для выключения кнопки некорректно» — кнопка включается булевым
   переключателем, а не тем, что подпись стёрли. Сам проп остаётся текстовым
   (это подпись, а не флаг), поэтому переключатель живёт в истории и просто
   гасит подпись при выключении. */
type PlaygroundArgs = ErrorPageProps & { showButton?: boolean }

const meta = {
  title: "Компоненты/Error Page",
  component: ErrorPage,
  parameters: { layout: "fullscreen" },
  argTypes: {
    code: { control: "text" },
    title: { control: "text" },
    description: { control: "text" },
    showButton: { name: "Кнопка", control: "boolean" },
    buttonLabel: { control: "text" },
  },
  args: {
    code: "404",
    title: "Страница не найдена",
    description: "Возможно, она была перемещена или удалена",
    showButton: true,
    buttonLabel: "На главную",
  },
} satisfies Meta<PlaygroundArgs>

export default meta
type Story = StoryObj<PlaygroundArgs>

export const Playground: Story = {
  render: ({ showButton, buttonLabel, ...args }) => (
    <ErrorPage {...args} buttonLabel={showButton ? buttonLabel : undefined} />
  ),
}

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
