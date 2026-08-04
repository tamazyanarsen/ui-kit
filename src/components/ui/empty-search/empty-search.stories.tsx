import type { Meta, StoryObj } from "@storybook/react-vite"

import { EmptySearchResults } from "./empty-search"

const meta = {
  title: "Template/EmptySearchResults",
  component: EmptySearchResults,
  parameters: { layout: "padded" },
  // `icon` defaults to a real JSX element (`<CircleAlert />`) — no JSON
  // value a control could hold would ever reproduce that, so this is a
  // dead "Set object" control (same class as Button's old `icon` bug).
  argTypes: { icon: { control: false } },
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
