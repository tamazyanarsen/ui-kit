import type { Meta, StoryObj } from "@storybook/react-vite"
import type { ComponentProps } from "react"

import { StatesMatrix } from "@/stories/matrix"

import { EmptySearchResults } from "./empty-search"

type EmptySearchResultsProps = ComponentProps<typeof EmptySearchResults>

const meta = {
  title: "Template/Empty Search Results",
  component: EmptySearchResults,
  parameters: { layout: "padded" },
  argTypes: {
    // `icon` defaults to a real JSX element (`<CircleAlert />`) — no JSON
    // value a control could hold would ever reproduce that, so map a
    // friendly "Default"/"None" choice to the real element/`null` instead of
    // disabling the control (same technique as Button's `icon`).
    icon: {
      control: {
        type: "select",
        labels: { default: "Default (Circle Alert)", none: "None" },
      },
      options: ["default", "none"],
      mapping: { default: undefined, none: null },
    },
    // `description`/`buttonLabel` are `React.ReactNode` but every usage is a
    // plain string — without this, leaving one unset falls back to a generic
    // "Set object" JSON editor.
    title: { control: "text" },
    description: { control: "text" },
    buttonLabel: { control: "text" },
    largeIcon: { control: "boolean" },
  },
  args: {
    title: "Ничего не найдено",
    description: "Попробуйте изменить параметры поиска",
    largeIcon: false,
  },
} satisfies Meta<EmptySearchResultsProps>

export default meta
type Story = StoryObj<EmptySearchResultsProps>

export const Playground: Story = {}

export const Matrix: Story = {
  name: "Matrix (все состояния)",
  parameters: { layout: "fullscreen", controls: { disable: true } },
  render: () => (
    <StatesMatrix<EmptySearchResultsProps>
      stretch
      cellClassName="min-w-[320px]"
      baseProps={{ title: "Ничего не найдено" }}
      columns={[
        { label: "Иконка 16px", props: { largeIcon: false } },
        // largeIcon picks the 24px drawing, not a scaled 16px one.
        { label: "Иконка 24px", props: { largeIcon: true } },
        { label: "Без иконки", props: { icon: null } },
      ]}
      rows={[
        { label: "Только заголовок", props: {} },
        {
          label: "С описанием",
          props: { description: "Попробуйте изменить параметры поиска" },
        },
        {
          label: "С кнопкой",
          props: {
            description: "Попробуйте изменить параметры поиска",
            buttonLabel: "Сбросить фильтры",
          },
        },
      ]}
      render={(props) => <EmptySearchResults {...props} />}
    />
  ),
}
