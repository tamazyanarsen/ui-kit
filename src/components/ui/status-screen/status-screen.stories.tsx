import type { Meta, StoryObj } from "@storybook/react-vite"
import type { ComponentProps } from "react"

import { StatesMatrix } from "@/stories/matrix"

import { StatusScreen } from "./status-screen"
import type { StatusType } from "./status-screen"

type StatusScreenProps = ComponentProps<typeof StatusScreen>

const STATUSES: StatusType[] = [
  "success",
  "error",
  "attention",
  "question",
  "search",
  "clock",
  "lock",
  "edit",
  "search-attention",
  "time-attention",
]

const meta = {
  title: "Template/Status Screen",
  component: StatusScreen,
  parameters: { layout: "padded" },
  argTypes: {
    status: { control: "select", options: STATUSES },
    title: { control: "text" },
    subtitle: { control: "text" },
    primaryLabel: { control: "text" },
    // `secondaryLabel` is typed React.ReactNode but every usage is a plain
    // string — pin a text control so leaving it unset doesn't fall back to
    // Storybook's "Set object" JSON-editor placeholder.
    secondaryLabel: { control: "text" },
  },
  args: {
    status: "success",
    title: "Платёж выполнен",
    subtitle: "Средства зачислены на счёт получателя",
    primaryLabel: "На главную",
  },
} satisfies Meta<StatusScreenProps>

export default meta
type Story = StoryObj<StatusScreenProps>

export const Playground: Story = {}

export const Matrix: Story = {
  name: "Matrix (все состояния)",
  parameters: { layout: "fullscreen", controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-2">
      <StatesMatrix<StatusScreenProps>
        stretch
        cellClassName="min-w-[240px]"
        baseProps={{ title: "Title", subtitle: "Subtitle" }}
        columnGroups={[
          {
            label: "Status",
            columns: STATUSES.slice(0, 5).map((status) => ({
              label: status,
              props: { status },
            })),
          },
        ]}
        rows={[{ label: "Default", props: {} }]}
        render={(props) => <StatusScreen {...props} />}
      />
      <StatesMatrix<StatusScreenProps>
        stretch
        cellClassName="min-w-[240px]"
        baseProps={{ title: "Title", subtitle: "Subtitle" }}
        columnGroups={[
          {
            label: "Status (продолжение)",
            columns: STATUSES.slice(5).map((status) => ({
              label: status,
              props: { status },
            })),
          },
        ]}
        rows={[{ label: "Default", props: {} }]}
        render={(props) => <StatusScreen {...props} />}
      />
      <StatesMatrix<StatusScreenProps>
        stretch
        cellClassName="min-w-[320px]"
        baseProps={{ status: "success", title: "Платёж выполнен" }}
        columns={[{ label: "Состав экрана" }]}
        rows={[
          { label: "Только заголовок", props: {} },
          {
            label: "+ подзаголовок",
            props: { subtitle: "Средства зачислены на счёт получателя" },
          },
          {
            label: "+ одна кнопка",
            props: {
              subtitle: "Средства зачислены на счёт получателя",
              primaryLabel: "На главную",
            },
          },
          {
            label: "+ две кнопки",
            props: {
              subtitle: "Средства зачислены на счёт получателя",
              primaryLabel: "На главную",
              secondaryLabel: "Отмена",
            },
          },
        ]}
        render={(props) => <StatusScreen {...props} />}
      />
    </div>
  ),
}
