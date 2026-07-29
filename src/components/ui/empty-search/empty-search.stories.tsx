import type { Meta, StoryObj } from "@storybook/react-vite"

import { EmptySearchResults } from "./empty-search"

const meta = {
  title: "UI/EmptySearchResults",
  component: EmptySearchResults,
  parameters: { layout: "padded" },
  args: {
    title: "Ничего не найдено",
    description: "Попробуйте изменить параметры поиска",
  },
} satisfies Meta<typeof EmptySearchResults>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const LargeIcon: Story = {
  args: { largeIcon: true },
}

export const WithButton: Story = {
  args: { buttonLabel: "Сбросить фильтры", onButtonClick: () => alert("reset") },
}

export const NoIcon: Story = {
  args: { icon: null },
}

export const TitleOnly: Story = {
  args: { description: undefined },
}
