import type { Meta, StoryObj } from "@storybook/react-vite"

import { PseudoBox, StatesMatrix, viewportArgType } from "@/stories/matrix"
import type { Viewport } from "@/lib/viewport"

import { ProgressBar, type ProgressBarProps } from "./progress-bar"
import type {
  ProgressBarStatus,
  ProgressBarStatusLine,
  ProgressBarStatusTimeline,
} from "./variants"

/* Ось `Size` (Desktop | Mobile) в макете есть, но пропом не выставляется —
   её даёт общий контрол `viewport`. */
type PlaygroundArgs = ProgressBarProps & { viewport?: Viewport }

const STATUSES: ProgressBarStatus[] = [
  "default",
  "success",
  "attention",
  "error",
  "information",
]

const STATUS_TIMELINE: ProgressBarStatusTimeline[] = [
  "process",
  "success",
  "attention",
  "error",
]

const STATUS_LINE: ProgressBarStatusLine[] = [
  "subtitle-description",
  "subtitle",
  "description",
]

/* Дизайн-чек №4 №3-5: контролы повторяют таблицу «Свойства компонента»
   (70333:2365) — Show Description / Show Status / Show Timeline / Status
   Line / Status / Status Timeline, поэтому они разложены по тем же
   группам, что и блоки макета. */
const meta = {
  title: "Компоненты/Progress Bar",
  component: ProgressBar,
  parameters: { layout: "padded" },
  // description/subtitle/statusDescription are typed React.ReactNode but
  // every usage is a plain string — pin text controls so leaving one unset
  // doesn't fall back to Storybook's "Set object" JSON-editor placeholder.
  argTypes: {
    viewport: viewportArgType,
    variant: { control: "inline-radio", options: ["step", "timeline"] },
    title: { control: "text", table: { category: "Top" } },
    description: { control: "text", table: { category: "Top" } },
    showDescription: { control: "boolean", table: { category: "Top" } },
    showTimeline: { control: "boolean", table: { category: "Timeline" } },
    value: {
      control: { type: "range", min: 0, max: 100 },
      table: { category: "Timeline" },
    },
    statusTimeline: {
      control: "inline-radio",
      options: STATUS_TIMELINE,
      table: { category: "Timeline" },
    },
    totalSteps: {
      control: { type: "number", min: 2, max: 10 },
      table: { category: "Steps" },
    },
    currentStep: {
      control: { type: "number", min: 1, max: 10 },
      table: { category: "Steps" },
    },
    showStatus: { control: "boolean", table: { category: "Status Line" } },
    statusLine: {
      control: "inline-radio",
      options: STATUS_LINE,
      table: { category: "Status Line" },
    },
    subtitle: { control: "text", table: { category: "Status Line" } },
    statusDescription: { control: "text", table: { category: "Status Line" } },
    status: {
      control: "select",
      options: STATUSES,
      table: { category: "Status Line" },
    },
  },
  args: {
    viewport: "auto" as Viewport,
    variant: "timeline",
    title: "Title",
    description: "Description",
    showDescription: true,
    showTimeline: true,
    showStatus: true,
    statusLine: "subtitle-description",
    subtitle: "Value",
    statusDescription: "Description",
    value: 50,
    statusTimeline: "process",
    totalSteps: 4,
    currentStep: 2,
    status: "default",
  },
} satisfies Meta<PlaygroundArgs>

export default meta
type Story = StoryObj<PlaygroundArgs>

export const Playground: Story = {
  render: ({ viewport, ...args }) => (
    <PseudoBox viewport={viewport} className="w-full">
      <ProgressBar {...args} />
    </PseudoBox>
  ),
}

export const Matrix: Story = {
  name: "Matrix (все состояния)",
  parameters: { layout: "fullscreen", controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-2">
      {/* Timeline — a continuous bar whose fill colour is set by
          `statusTimeline`, independent of the Value colour set by `status`. */}
      <StatesMatrix<ProgressBarProps>
        responsive
        stretch
        cellClassName="min-w-[280px]"
        baseProps={{
          variant: "timeline",
          title: "Title",
          description: "Description",
          subtitle: "Value",
          statusDescription: "Description",
        }}
        columnGroups={[
          {
            label: "Status Timeline",
            columns: STATUS_TIMELINE.map((statusTimeline) => ({
              label: statusTimeline,
              props: { statusTimeline },
            })),
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
      {/* Step — a segmented bar ("Шаг 2 из 4"): Done / Waiting / None. */}
      <StatesMatrix<ProgressBarProps>
        responsive
        stretch
        cellClassName="min-w-[280px]"
        baseProps={{ variant: "step", totalSteps: 4, description: "Description" }}
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
      {/* Status Line — три варианта группы плюс её полное отключение. */}
      <StatesMatrix<ProgressBarProps>
        responsive
        stretch
        cellClassName="min-w-[280px]"
        baseProps={{
          variant: "timeline",
          value: 50,
          statusTimeline: "process",
          title: "Title",
          description: "Description",
          subtitle: "Value",
          statusDescription: "Description",
        }}
        columnGroups={[
          {
            label: "Status Line",
            columns: [
              {
                label: "Subtitle / Description",
                props: { statusLine: "subtitle-description" },
              },
              { label: "Subtitle", props: { statusLine: "subtitle" } },
              { label: "Description", props: { statusLine: "description" } },
            ],
          },
        ]}
        rows={[
          { label: "Show Status = True", props: { showStatus: true } },
          { label: "Show Status = False", props: { showStatus: false } },
          {
            label: "Show Description = False",
            props: { showDescription: false },
          },
          { label: "Show Timeline = False", props: { showTimeline: false } },
        ]}
        render={(props) => <ProgressBar {...props} />}
      />
    </div>
  ),
}
