import type { Meta, StoryObj } from "@storybook/react-vite"

import { StatesMatrix } from "@/stories/matrix"

import { Tag, type TagProps } from "./tag"
import type { TagColor } from "./variants"

const STATUS_COLORS: TagColor[] = ["green", "orange", "red", "blue", "grey"]
const SIGN_COLORS: TagColor[] = ["black", "white", "grey-info"]

const meta = {
  title: "Компоненты/Tag",
  component: Tag,
  parameters: { layout: "centered" },
  argTypes: {
    children: { control: "text" },
    color: {
      control: "select",
      options: [...STATUS_COLORS, ...SIGN_COLORS] satisfies TagColor[],
    },
    variant: { control: "inline-radio", options: ["main", "secondary"] },
    size: { control: "inline-radio", options: ["l", "s"] },
    showIcon: { control: "boolean" },
  },
  args: {
    children: "Example Text",
    color: "green",
    variant: "main",
    size: "l",
    showIcon: false,
  },
} satisfies Meta<TagProps>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

/* Figma splits Tag into two colour families — Status (a state change on the
   object) and Sign (a neutral marker) — crossed with Main/Secondary style,
   L/S size and the optional leading icon. */
export const Matrix: Story = {
  name: "Matrix (все состояния)",
  parameters: { layout: "fullscreen", controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-8">
      <StatesMatrix<TagProps>
        baseProps={{ children: "Example Text" }}
        columnGroups={[
          {
            label: "Status colors",
            columns: STATUS_COLORS.map((color) => ({
              label: color,
              props: { color },
            })),
          },
          {
            label: "Sign colors",
            columns: SIGN_COLORS.map((color) => ({
              label: color,
              props: { color },
            })),
          },
        ]}
        rows={[
          { label: "Main · L", props: { variant: "main", size: "l" } },
          { label: "Main · S", props: { variant: "main", size: "s" } },
          {
            label: "Main · L\n+ icon",
            props: { variant: "main", size: "l", showIcon: true },
          },
          {
            label: "Secondary · L",
            props: { variant: "secondary", size: "l" },
          },
          {
            label: "Secondary · S",
            props: { variant: "secondary", size: "s" },
          },
          {
            label: "Secondary · L\n+ icon",
            props: { variant: "secondary", size: "l", showIcon: true },
          },
        ]}
        render={(props) => <Tag {...props} />}
      />
    </div>
  ),
}
