import type { Meta, StoryObj } from "@storybook/react-vite"

import { RESPONSIVE_NOTE, StatesMatrix } from "@/stories/matrix"

import {
  ItemInformationField,
  type FieldStatus,
  type FieldType,
  type ItemInformationFieldProps,
} from "./item-information-field"
import { ToastProvider, Toaster } from "@/components/ui/toast-message"

const TYPES: FieldType[] = ["label-left", "label-line", "label-top", "large-value"]
const STATUSES: FieldStatus[] = [
  "default",
  "success",
  "error",
  "attention",
  "information",
]

const meta = {
  title: "Content/Item/Information Field",
  component: ItemInformationField,
  parameters: { layout: "padded" },
  argTypes: {
    type: { control: "inline-radio", options: TYPES },
    label: { control: "text" },
    value: { control: "text" },
    // `subText`/`labelInfo`/`valueInfo` are `React.ReactNode` but every
    // usage is a plain string — without this, leaving one unset falls back
    // to a generic "Set object" JSON editor.
    subText: { control: "text" },
    labelInfo: { control: "text" },
    valueInfo: { control: "text" },
    copyable: { control: "boolean" },
    divider: { control: "boolean" },
    valueStatus: { control: "select", options: STATUSES },
    // `subTextStatus` is `Exclude<FieldStatus, "information">` — react-docgen
    // can't resolve a computed utility type into an enum the way it does the
    // plain `FieldStatus` alias (`valueStatus` already gets a select
    // automatically), so it falls back to the same generic "Set object"
    // editor. Pin the real (narrower) option list explicitly instead.
    subTextStatus: {
      control: "select",
      options: ["default", "success", "error", "attention"] satisfies Exclude<
        FieldStatus,
        "information"
      >[],
    },
  },
  args: {
    type: "label-left",
    label: "ИНН",
    value: "7710140123",
    copyable: false,
  },
  decorators: [
    (Story) => (
      <ToastProvider>
        <Story />
        <Toaster />
      </ToastProvider>
    ),
  ],
} satisfies Meta<ItemInformationFieldProps>

export default meta
type Story = StoryObj<ItemInformationFieldProps>

export const Playground: Story = {}

export const Matrix: Story = {
  name: "Matrix (все состояния)",
  parameters: { layout: "fullscreen", controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-2">
      <StatesMatrix<ItemInformationFieldProps>
        stretch
        cellClassName="min-w-[280px]"
        rowHeader={RESPONSIVE_NOTE}
        baseProps={{ label: "Label", value: "Value" }}
        columnGroups={[
          {
            label: "Type",
            columns: TYPES.map((type) => ({ label: type, props: { type } })),
          },
        ]}
        rows={[
          { label: "Default", props: {} },
          { label: "+ подпись", props: { subText: "Subtext" } },
          { label: "+ копирование", props: { copyable: true, copyValue: "Value" } },
          {
            label: "+ иконки инфо",
            props: { labelInfo: "О поле", valueInfo: "О значении" },
          },
          // Only Label Left carries the divider; the others are bare content
          // the container spaces itself.
          { label: "+ разделитель", props: { divider: true } },
        ]}
        render={(props) => <ItemInformationField {...props} />}
      />

      <StatesMatrix<ItemInformationFieldProps>
        stretch
        cellClassName="min-w-[240px]"
        baseProps={{ label: "Label", value: "Value", subText: "Subtext" }}
        columnGroups={[
          {
            label: "Value status",
            columns: STATUSES.map((valueStatus) => ({
              label: valueStatus,
              props: { valueStatus },
            })),
          },
        ]}
        rows={[
          { label: "Label Left", props: { type: "label-left" } },
          { label: "Label Top", props: { type: "label-top" } },
          { label: "Large Value", props: { type: "large-value" } },
        ]}
        render={(props) => <ItemInformationField {...props} />}
      />
    </div>
  ),
}
