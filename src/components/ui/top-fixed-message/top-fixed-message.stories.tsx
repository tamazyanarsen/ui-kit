import type { Meta, StoryObj } from "@storybook/react-vite"

import { StatesMatrix, optionsArgType, toggleArgType } from "@/stories/matrix"

import { TopFixedMessage, type TopFixedMessageProps } from "./top-fixed-message"

/* Панель повторяет свойства компонент-сета `ELK / top fixed message`
   (5701:22192): Type со значениями «Red (Error)» и «Blue (System)» — ровно
   теми подписями, что видит дизайнер в правой панели, — плюс булевы слоты
   мастера. */
const meta = {
  title: "Компоненты/Top Fixed Message",
  component: TopFixedMessage,
  parameters: { layout: "fullscreen" },
  // `buttonLabel` is typed React.ReactNode but every usage is a plain string
  // — pin a text control so leaving it unset doesn't fall back to
  // Storybook's "Set object" JSON-editor placeholder.
  argTypes: {
    type: optionsArgType(
      "Type",
      { red: "Red (Error)", blue: "Blue (System)" },
      "inline-radio"
    ),
    showIcon: toggleArgType("Show Icon"),
    showButton: toggleArgType("Show Button"),
    showIconClose: toggleArgType("Show Icon Close"),
    text: { control: "text", table: { category: "Контент" } },
    buttonLabel: { control: "text", table: { category: "Контент" } },
  },
  /* Порядок ключей здесь задаёт порядок строк в панели Storybook (argTypes
     на него не влияет), поэтому он повторяет порядок свойств мастера. */
  args: {
    type: "blue",
    showIcon: true,
    showButton: false,
    showIconClose: true,
    text: "Плановые технические работы с 02:00 до 04:00 мск",
    buttonLabel: "Подробнее",
  },
} satisfies Meta<TopFixedMessageProps>

export default meta
type Story = StoryObj<TopFixedMessageProps>

export const Playground: Story = {}

export const Matrix: Story = {
  name: "Matrix (все состояния)",
  parameters: { layout: "fullscreen", controls: { disable: true } },
  render: () => (
    <StatesMatrix<TopFixedMessageProps>
      stretch
      cellClassName="min-w-[520px]"
      baseProps={{ text: "Notification Text Example" }}
      columns={[
        { label: "Blue", props: { type: "blue" } },
        { label: "Red", props: { type: "red" } },
      ]}
      rows={[
        { label: "Default", props: {} },
        { label: "С кнопкой", props: { showButton: true, buttonLabel: "Button" } },
        { label: "Без иконки", props: { showIcon: false } },
        { label: "Без крестика", props: { showIconClose: false } },
        {
          // Overflowing text truncates with an ellipsis and exposes the full
          // string on hover rather than wrapping to a second line.
          label: "Длинный текст",
          props: {
            text: "Очень длинное сообщение, которое не помещается на одну строку и должно обрезаться многоточием, а полный текст доступен по наведению курсора",
          },
        },
      ]}
      render={(props) => <TopFixedMessage {...props} onClose={() => {}} />}
    />
  ),
}
