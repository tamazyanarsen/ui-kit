import type { Meta, StoryObj } from "@storybook/react-vite"

import { EmptySearchResults } from "./empty-search"

const meta = {
  title: "Template/EmptySearchResults",
  component: EmptySearchResults,
  parameters: { layout: "padded" },
  // `icon` defaults to a real JSX element (`<CircleAlert />`) — no JSON
  // value a control could hold would ever reproduce that, so map a
  // friendly "Default"/"None" choice to the real element/`null` instead
  // of disabling the control (same technique as Button's `icon`).
  argTypes: {
    icon: {
      control: { type: "select", labels: { default: "Default (Circle Alert)", none: "None" } },
      options: ["default", "none"],
      mapping: { default: undefined, none: null },
    },
    // `description`/`buttonLabel` are `React.ReactNode` but every usage is
    // a plain string — without this, leaving one unset (TitleOnly for
    // description; every story but WithButton for buttonLabel) falls back
    // to a generic "Set object" JSON editor.
    description: { control: "text" },
    buttonLabel: { control: "text" },
  },
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
