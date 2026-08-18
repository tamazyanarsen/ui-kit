import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"

import {
  PseudoBox,
  StatesMatrix,
  stateArgType,
  viewportArgType,
  type PlaygroundState,
} from "@/stories/matrix"
import { type Viewport } from "@/lib/viewport"

import { Select, SelectValue } from "./root"
import { SelectTrigger } from "./trigger"
import { SelectContent } from "./content"
import { SelectItem } from "./item"

const FRUIT_OPTIONS = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "cherry", label: "Cherry" },
]

interface DemoSelectProps {
  size?: "sm" | "lg"
  label?: string
  placeholder?: string
  error?: string
  comment?: string
  defaultValue?: string | null
  clearable?: boolean
  disabled?: boolean
  readOnly?: boolean
  open?: boolean
}

function DemoSelect({
  size,
  label = "Label",
  placeholder = "",
  error,
  comment,
  defaultValue = null,
  clearable = true,
  disabled,
  readOnly,
  open,
}: DemoSelectProps) {
  const [value, setValue] = useState<string | null>(defaultValue)
  return (
    <Select
      items={FRUIT_OPTIONS}
      value={value}
      onValueChange={setValue}
      disabled={disabled}
      readOnly={readOnly}
      defaultOpen={open}
    >
      <SelectTrigger
        size={size}
        label={label}
        error={error}
        comment={comment}
        onClear={clearable ? () => setValue(null) : undefined}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {FRUIT_OPTIONS.map((o) => (
          <SelectItem key={o.value} value={o.value}>
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

type PlaygroundArgs = DemoSelectProps & {
  state?: PlaygroundState
  viewport?: Viewport
}

const meta = {
  title: "Компоненты/Select",
  component: DemoSelect,
  parameters: { layout: "padded" },
  // `DemoSelect` is a plain function declared locally in this file rather
  // than imported from its own component module — Storybook's docgen
  // (react-docgen-typescript) only reliably extracts props from component
  // modules, so most of this wrapper's props silently get NO Controls row at
  // all. Declare every one of them explicitly instead.
  argTypes: {
    size: { control: "inline-radio", options: ["lg", "sm"] },
    label: { control: "text" },
    placeholder: { control: "text" },
    error: { control: "text" },
    comment: { control: "text" },
    defaultValue: { control: "select", options: [null, "apple", "banana", "cherry"] },
    clearable: { control: "boolean" },
    disabled: { control: "boolean" },
    readOnly: { control: "boolean" },
    open: { control: "boolean" },
    state: stateArgType,
    // Дизайн-чек №3 №19: форма Desktop/Mobile выбирается контролом в
    // панели истории, а не изменением размера вьюпорта.
    viewport: viewportArgType,
  },
  args: {
    size: "lg",
    label: "Label",
    clearable: true,
    disabled: false,
    readOnly: false,
    open: false,
    state: "default" as PlaygroundState,
    viewport: "auto" as Viewport,
  },
} satisfies Meta<PlaygroundArgs>

export default meta
type Story = StoryObj<PlaygroundArgs>

export const Playground: Story = {
  render: ({ state, viewport, ...args }) => (
    <PseudoBox state={state} viewport={viewport} className="w-80">
      <DemoSelect {...args} />
    </PseudoBox>
  ),
}

export const Matrix: Story = {
  name: "Matrix (все состояния)",
  parameters: { layout: "fullscreen", controls: { disable: true } },
  render: () => (
    <StatesMatrix<DemoSelectProps>
      stretch
      cellClassName="min-w-72"
      responsive
      columns={[
        { label: "L (default)", props: { size: "lg" } },
        { label: "S", props: { size: "sm" } },
      ]}
      rows={[
        { label: "Default", props: {} },
        { label: "Hover", props: {}, pseudo: "hover" },
        { label: "Focus", props: {}, pseudo: "focus-within" },
        { label: "Filled", props: { defaultValue: "banana" } },
        {
          label: "Comment",
          props: { defaultValue: "banana", comment: "Comment" },
        },
        {
          label: "Error",
          props: { defaultValue: "banana", error: "Text about error here" },
        },
        { label: "Read only", props: { defaultValue: "banana", readOnly: true } },
        { label: "Disabled", props: { defaultValue: "banana", disabled: true } },
      ]}
      render={(props) => <DemoSelect {...props} />}
    />
  ),
}

/* The open list is a portalled popup, so it can't live inside the matrix
   (every cell would overlay the next). */
export const Opened: Story = {
  name: "Раскрытый список",
  parameters: { layout: "padded", controls: { disable: true } },
  render: () => (
    <div className="h-80 w-80">
      <DemoSelect open defaultValue="banana" />
    </div>
  ),
}
