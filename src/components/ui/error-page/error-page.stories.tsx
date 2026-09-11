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
    // Дизайн-чек от 07.09, замечание 14: «выбор из списка или радио.
    // Варианты — 403, 404, Image». Свободная строка не годилась: компонент
    // и так понимает ровно три значения, а панель предлагала вписать любое.
    type: {
      name: "Type",
      control: "inline-radio",
      options: ["403", "404", "image"],
      description:
        "Вариант страницы. 403 и 404 рисуют крупные цифры с маскотом вместо нуля, Image — обобщённую иллюстрацию без цифр",
    },
    showButton: { name: "Show Button", control: "boolean" },
    title: { control: "text", table: { category: "Контент" } },
    description: { control: "text", table: { category: "Контент" } },
    buttonLabel: { control: "text", table: { category: "Контент" } },
  },
  args: {
    type: "404",
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
            type: "404",
            title: "Страница не найдена",
            description: "Возможно, она была перемещена или удалена",
            buttonLabel: "На главную",
          },
        },
        {
          label: "403",
          props: {
            type: "403",
            title: "Доступ запрещён",
            description: "У вас нет прав для просмотра этой страницы",
            buttonLabel: "На главную",
          },
        },
        {
          // Любая другая ошибка (500, техработы) — это `Type=Image`:
          // цифрового начертания в мастере под них нет вовсе. Раньше строка
          // называлась «500» и передавала `code: "500"`, что выглядело как
          // поддержанный вариант, а компонент молча рисовал ту же картинку.
          label: "Прочие ошибки (Image)",
          props: {
            type: "image",
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
          props: { type: "404", title: "Страница не найдена" },
        },
      ]}
      render={(props) => <ErrorPage {...props} />}
    />
  ),
}
