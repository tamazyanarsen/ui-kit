import type { Meta, StoryObj } from "@storybook/react-vite"

import { TopFixedMessage } from "./top-fixed-message"

const meta = {
  title: "UI/TopFixedMessage",
  component: TopFixedMessage,
  parameters: { layout: "fullscreen" },
  args: { text: "Плановые технические работы с 02:00 до 04:00 мск" },
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
