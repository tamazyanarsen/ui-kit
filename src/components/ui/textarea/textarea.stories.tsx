import type { Meta, StoryObj } from "@storybook/react-vite"

import {
  PseudoBox,
  RESPONSIVE_NOTE,
  StatesMatrix,
  stateArgType,
  type PlaygroundState,
} from "@/stories/matrix"

import { Textarea, type TextareaProps } from "./textarea"

type PlaygroundArgs = TextareaProps & { state?: PlaygroundState }

const meta = {
  title: "Компоненты/Text Area",
  component: Textarea,
  parameters: { layout: "padded" },
  // comment/error are typed React.ReactNode but every usage here is a plain
  // string — pin text controls so leaving one unset doesn't fall back to
  // Storybook's "Set object" JSON-editor placeholder. `rows` is a genuine
  // native `number` prop (inherited via `React.ComponentProps<"textarea">`),
  // but docgen loses the primitive type across that extends chain and falls
  // back to the same placeholder — pin it too.
  argTypes: {
    label: { control: "text" },
    comment: { control: "text" },
    error: { control: "text" },
    placeholder: { control: "text" },
    rows: { control: "number" },
    locked: { control: "boolean" },
    disabled: { control: "boolean" },
    state: stateArgType,
  },
  args: {
    label: "Label",
    placeholder: "Placeholder",
    locked: false,
    disabled: false,
    state: "default" as PlaygroundState,
  },
} satisfies Meta<PlaygroundArgs>

export default meta
type Story = StoryObj<PlaygroundArgs>

export const Playground: Story = {
  render: ({ state, ...args }) => (
    <PseudoBox state={state} className="w-96">
      <Textarea {...args} />
    </PseudoBox>
  ),
}

export const Matrix: Story = {
  name: "Matrix (все состояния)",
  parameters: { layout: "fullscreen", controls: { disable: true } },
  render: () => (
    <StatesMatrix<TextareaProps>
      stretch
      cellClassName="min-w-80"
      rowHeader={RESPONSIVE_NOTE}
      baseProps={{ label: "Label", placeholder: "Placeholder" }}
      columns={[
        { label: "3 строки (default)", props: {} },
        { label: "6 строк", props: { rows: 6 } },
      ]}
      rows={[
        { label: "Default", props: {} },
        { label: "Hover", props: {}, pseudo: "hover" },
        { label: "Focus", props: {}, pseudo: "focus-within" },
        { label: "Filled", props: { defaultValue: "Value" } },
        {
          label: "Comment",
          props: { defaultValue: "Value", comment: "Comment" },
        },
        {
          label: "Error",
          props: { defaultValue: "Value", error: "Text about error here" },
        },
        { label: "Locked", props: { locked: true, defaultValue: "Value" } },
        { label: "Disabled", props: { disabled: true, defaultValue: "Value" } },
      ]}
      render={(props) => <Textarea {...props} />}
    />
  ),
}
