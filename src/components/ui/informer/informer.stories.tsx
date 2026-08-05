import type { Meta, StoryObj } from "@storybook/react-vite"

import { Informer } from "./informer"

const meta = {
  title: "Status/Message/Informer",
  component: Informer,
  parameters: { layout: "padded" },
  // `description`/`mainButtonLabel`/`additionalButtonLabel` are all
  // `React.ReactNode` but every usage is a plain string — without this,
  // leaving one unset (MinimalIconAndTitle for description; every story
  // but WithButtons for the two labels) falls back to a generic
  // "Set object" JSON editor.
  argTypes: {
    description: { control: "text" },
    mainButtonLabel: { control: "text" },
    additionalButtonLabel: { control: "text" },
  },
  args: {
    title: "Требуется подпись",
    date: "24.12.2022",
    description: "Документ ожидает вашей подписи для продолжения работы",
  },
} satisfies Meta<typeof Informer>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithButtons: Story = {
  args: { mainButtonLabel: "Подписать", additionalButtonLabel: "Отложить" },
}

export const GreySolid: Story = {
  args: { solid: "grey" },
}

export const NoCloseButton: Story = {
  args: { showCross: false },
}

export const MinimalIconAndTitle: Story = {
  args: { date: undefined, description: undefined },
}
