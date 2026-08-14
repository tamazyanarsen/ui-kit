import type { Meta, StoryObj } from "@storybook/react-vite"

import { StatesMatrix } from "@/stories/matrix"

import { ICON_NAMES } from "@/components/ui/icon"

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
    // Иконка выбирается, а не включается: в Figma это instance swap.
    // «Без иконки» — отдельный пункт, потому что чаще всего тег без неё.
    icon: {
      control: "select",
      options: ["без иконки", ...ICON_NAMES],
      mapping: { "без иконки": undefined },
      description: "Ведущая иконка из набора кита",
    },
  },
  args: {
    children: "Example Text",
    color: "green",
    variant: "main",
    size: "l",
    icon: "check",
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
            props: { variant: "main", size: "l", icon: "check" },
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
            props: { variant: "secondary", size: "l", icon: "check" },
          },
        ]}
        render={(props) => <Tag {...props} />}
      />

      {/* Иконка подбирается под смысл статуса — ради этого её и сделали
          выбираемой: раньше «В обработке» и «Отклонён» получали ту же
          галочку, что и «Исполнено». */}
      <StatesMatrix<TagProps>
        rowHeader="Иконка — любая из набора кита, а не одна фиксированная галочка."
        columns={[{ label: "Tag" }]}
        rows={[
          { label: "Исполнено", props: { color: "green", icon: "circle-check", children: "Исполнено" } },
          { label: "В обработке", props: { color: "orange", icon: "clock", children: "В обработке" } },
          { label: "Отклонён", props: { color: "red", icon: "circle-x", children: "Отклонён" } },
          { label: "Системный", props: { color: "blue", icon: "info", children: "Системный" } },
          { label: "Черновик", props: { color: "grey", icon: "pencil", children: "Черновик" } },
          { label: "Без иконки", props: { color: "green", children: "Исполнено" } },
        ]}
        render={(props) => <Tag {...props} />}
      />
    </div>
  ),
}
