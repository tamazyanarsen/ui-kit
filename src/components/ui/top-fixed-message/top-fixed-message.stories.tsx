import type * as React from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"

import { StatesMatrix, optionsArgType, sizeArgType, toggleArgType } from "@/stories/matrix"
import { ViewportScope, type Viewport } from "@/lib/viewport"

import { TopFixedMessage, type TopFixedMessageProps } from "./top-fixed-message"

/* Панель повторяет свойства компонент-сета `ELK / top fixed message`
   (70441:14927, Version 1.0.1, Release 68.34): Size со значениями
   «Desktop» и «Mobile», Type со значениями «Red (Error)» и «Blue (System)»
   — ровно теми подписями, что видит дизайнер в правой панели, — плюс
   булевы слоты мастера.

   Мобильная форма перестраивается целиком: значок 16 сверху, текст с
   переносом, кнопки вторым рядом, а закрытие — кнопка «Закрыть», а не
   крестик (ряд кнопок — сет `Buttons Top Fix (ELK)` 70441:14952 с осью
   Type: Two Buttons | Main | Close). Поэтому `Show Icon Close` на мобайле
   показывает кнопку, а не глиф. */
type PlaygroundArgs = TopFixedMessageProps & { viewport?: Viewport }

/** Ширина мастера: Desktop тянется во всю ширину, Mobile нарисован на 360. */
function Frame({
  viewport,
  children,
}: {
  viewport?: Viewport
  children: React.ReactNode
}) {
  return (
    <ViewportScope viewport={viewport}>
      <div className={viewport === "mobile" ? "w-[360px]" : "w-full"}>
        {children}
      </div>
    </ViewportScope>
  )
}

const meta = {
  title: "Компоненты/Top Fixed Message",
  component: TopFixedMessage,
  parameters: { layout: "fullscreen" },
  // `buttonLabel` is typed React.ReactNode but every usage is a plain string
  // — pin a text control so leaving it unset doesn't fall back to
  // Storybook's "Set object" JSON-editor placeholder.
  argTypes: {
    viewport: sizeArgType,
    type: optionsArgType(
      "Type",
      { red: "Red (Error)", blue: "Blue (System)" },
      "inline-radio"
    ),
    showIcon: toggleArgType("Show Icon"),
    showButton: toggleArgType("Show Button"),
    showIconClose: toggleArgType(
      "Show Icon Close",
      "На десктопе это крестик, на мобайле — кнопка «Закрыть» (тип Close ряда Buttons Top Fix)"
    ),
    text: { control: "text", table: { category: "Контент" } },
    buttonLabel: { control: "text", table: { category: "Контент" } },
    closeLabel: {
      control: "text",
      description: "Подпись кнопки закрытия — только мобильная форма",
      table: { category: "Контент" },
    },
  },
  /* Порядок ключей здесь задаёт порядок строк в панели Storybook (argTypes
     на него не влияет), поэтому он повторяет порядок свойств мастера. */
  args: {
    viewport: "desktop" as Viewport,
    type: "blue",
    showIcon: true,
    showButton: true,
    showIconClose: true,
    text: "Плановые технические работы с 02:00 до 04:00 мск",
    buttonLabel: "Подробнее",
    closeLabel: "Закрыть",
  },
} satisfies Meta<PlaygroundArgs>

export default meta
type Story = StoryObj<PlaygroundArgs>

export const Playground: Story = {
  render: ({ viewport, ...args }) => (
    <Frame viewport={viewport}>
      <TopFixedMessage {...args} />
    </Frame>
  ),
}

export const Matrix: Story = {
  name: "Matrix (все состояния)",
  parameters: { layout: "fullscreen", controls: { disable: true } },
  render: () => (
    <StatesMatrix<TopFixedMessageProps>
      responsive
      baseProps={{ text: "Notification Text Example", buttonLabel: "Подробнее" }}
      columns={[
        { label: "Blue", props: { type: "blue" } },
        { label: "Red", props: { type: "red" } },
      ]}
      rows={[
        // Ось Type ряда кнопок мобильной формы — те же три сочетания
        // слотов, что и на десктопе.
        { label: "Two Buttons", props: { showButton: true } },
        { label: "Main (без закрытия)", props: { showButton: true, showIconClose: false } },
        { label: "Close (без кнопки)", props: {} },
        { label: "Без иконки", props: { showButton: true, showIcon: false } },
        {
          // Десктоп обрезает многоточием и отдаёт полный текст тултипом,
          // мобайл переносит — это и видно рядом в двух матрицах.
          label: "Длинный текст",
          props: {
            showButton: true,
            text: "Очень длинное сообщение, которое не помещается на одну строку и должно обрезаться многоточием, а полный текст доступен по наведению курсора",
          },
        },
      ]}
      /* Ширина клетки задана здесь, а не `stretch`: у десктопной формы
         текст обрезается многоточием, а `truncate` не уменьшает ширину
         max-content — без рамки строка «Длинный текст» растягивала колонку
         и уносила крестик за край матрицы. Mobile — ширина мастера, 360. */
      render={(props) => (
        <div className="w-[360px] desktop:w-[560px]">
          <TopFixedMessage {...props} onClose={() => {}} />
        </div>
      )}
    />
  ),
}
