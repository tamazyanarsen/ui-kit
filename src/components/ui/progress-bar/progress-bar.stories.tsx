import type { Meta, StoryObj } from "@storybook/react-vite"

import { StatesMatrix } from "@/stories/matrix"

import { ProgressBar, type ProgressBarProps } from "./progress-bar"
import type { ProgressBarStatus } from "./variants"

const STATUSES: ProgressBarStatus[] = [
  "default",
  "success",
  "attention",
  "error",
  "information",
]

const meta = {
  title: "Content/Progress Bar",
  component: ProgressBar,
  parameters: { layout: "padded" },
  // label/subtitle/description are typed React.ReactNode but every usage is
  // a plain string — pin text controls so leaving one unset doesn't fall
  // back to Storybook's "Set object" JSON-editor placeholder.
  argTypes: {
    variant: { control: "inline-radio", options: ["step", "timeline"] },
    title: { control: "text" },
    label: { control: "text" },
    subtitle: { control: "text" },
    description: { control: "text" },
    status: { control: "select", options: STATUSES },
    color: { control: "inline-radio", options: ["green", "yellow", "red"] },
    value: { control: { type: "range", min: 0, max: 100 } },
    totalSteps: { control: { type: "number", min: 1, max: 10 } },
    currentStep: { control: { type: "number", min: 0, max: 10 } },
  },
  args: {
    variant: "timeline",
    title: "Title",
    label: "Label",
    value: 50,
    status: "default",
  },
} satisfies Meta<ProgressBarProps>

export default meta
type Story = StoryObj<ProgressBarProps>

export const Playground: Story = {}

export const Matrix: Story = {
  name: "Matrix (все состояния)",
  parameters: { layout: "fullscreen", controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-2">
      {/* Timeline — a continuous bar whose fill colour is set by `color`,
          independent of the caption colour set by `status`. */}
      <StatesMatrix<ProgressBarProps>
        stretch
        cellClassName="min-w-[280px]"
        baseProps={{
          variant: "timeline",
          title: "Title",
          label: "Label",
          subtitle: "Value",
          description: "Description",
        }}
        columnGroups={[
          {
            label: "Timeline — цвет заливки",
            columns: [
              { label: "green", props: { color: "green" } },
              { label: "yellow", props: { color: "yellow" } },
              { label: "red", props: { color: "red" } },
            ],
          },
        ]}
        rows={[
          { label: "0 %", props: { value: 0 } },
          { label: "30 %", props: { value: 30 } },
          { label: "70 %", props: { value: 70 } },
          { label: "100 %", props: { value: 100 } },
        ]}
        render={(props) => <ProgressBar {...props} />}
      />
      {/* Step — a segmented bar ("Шаг 2 из 4"). */}
      <StatesMatrix<ProgressBarProps>
        stretch
        cellClassName="min-w-[280px]"
        baseProps={{ variant: "step", totalSteps: 4, label: "Label" }}
        columnGroups={[
          {
            label: "Step",
            columns: [
              { label: "1 / 4", props: { currentStep: 1 } },
              { label: "2 / 4", props: { currentStep: 2 } },
              { label: "4 / 4", props: { currentStep: 4 } },
            ],
          },
        ]}
        rows={STATUSES.map((status) => ({
          label: `Статус: ${status}`,
          props: { status, title: "Шаг", subtitle: "Value" },
        }))}
        render={(props) => <ProgressBar {...props} />}
      />
    </div>
  ),
}
