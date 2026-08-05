import type { Meta, StoryObj } from "@storybook/react-vite"

import { TopFixedMessage } from "./top-fixed-message"

const meta = {
  title: "Status/Message/TopFixedMessage",
  component: TopFixedMessage,
  parameters: { layout: "fullscreen" },
  args: { text: "Плановые технические работы с 02:00 до 04:00 мск" },
  // `buttonLabel` is typed React.ReactNode but every story only ever puts a
  // plain string in it — pin a text control so a story that leaves it unset
  // doesn't fall back to Storybook's "Set object" JSON-editor placeholder.
  argTypes: {
    buttonLabel: { control: "text" },
  },
} satisfies Meta<typeof TopFixedMessage>

export default meta
type Story = StoryObj<typeof meta>

export const Blue: Story = {
  args: { type: "blue" },
}

export const Red: Story = {
  args: { type: "red", text: "Обнаружена подозрительная активность на вашем счёте" },
}

export const WithButton: Story = {
  args: { showButton: true, buttonLabel: "Подробнее" },
}

export const NoIcon: Story = {
  args: { showIcon: false },
}

export const NoCloseButton: Story = {
  args: { showIconClose: false },
}

export const LongTextTruncates: Story = {
  args: {
    text: "Очень длинное сообщение, которое не помещается на одну строку и должно обрезаться многоточием, а полный текст доступен по наведению курсора",
  },
}
