import type { Meta, StoryObj } from "@storybook/react-vite"

import { StatesMatrix } from "@/stories/matrix"

import { TopFixedMessage, type TopFixedMessageProps } from "./top-fixed-message"

const meta = {
  title: "Компоненты/Top Fixed Message",
  component: TopFixedMessage,
  parameters: { layout: "fullscreen" },
  // `buttonLabel` is typed React.ReactNode but every usage is a plain string
  // — pin a text control so leaving it unset doesn't fall back to
  // Storybook's "Set object" JSON-editor placeholder.
  argTypes: {
    type: { control: "inline-radio", options: ["blue", "red"] },
    text: { control: "text" },
    buttonLabel: { control: "text" },
    showIcon: { control: "boolean" },
    showButton: { control: "boolean" },
    showIconClose: { control: "boolean" },
  },
  args: {
    type: "blue",
    text: "Плановые технические работы с 02:00 до 04:00 мск",
    showIcon: true,
    showButton: false,
    buttonLabel: "Подробнее",
    showIconClose: true,
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
