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
  title: "Компоненты/Status Screen",
  component: StatusScreen,
  parameters: { layout: "padded" },
  // Дизайн-чек 3/3 №17: добавлены тоглы Show Subtitle и Show Buttons, а
  // подписи кнопок переименованы — `primaryLabel`/`secondaryLabel` не давали
  // понять, что это тексты основной и второстепенной кнопки.
  argTypes: {
    status: { control: "select", options: STATUSES },
    title: { control: "text", name: "Заголовок" },
    showSubtitle: { control: "boolean", name: "Show Subtitle" },
    subtitle: { control: "text", name: "Текст подзаголовка" },
    showButtons: { control: "boolean", name: "Show Buttons" },
    primaryButtonLabel: { control: "text", name: "Текст основной кнопки" },
    // Пропсы типизированы как React.ReactNode, но во всех сценариях это
    // обычные строки — контрол закреплён текстовым, иначе Storybook
    // подставляет JSON-редактор «Set object».
    secondaryButtonLabel: {
      control: "text",
      name: "Текст второстепенной кнопки",
    },
  },
  args: {
    status: "success",
    title: "Платёж выполнен",
    showSubtitle: true,
    subtitle: "Средства зачислены на счёт получателя",
    showButtons: true,
    primaryButtonLabel: "На главную",
    secondaryButtonLabel: "Отмена",
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
              primaryButtonLabel: "На главную",
            },
          },
          {
            label: "+ две кнопки",
            props: {
              subtitle: "Средства зачислены на счёт получателя",
              primaryButtonLabel: "На главную",
              secondaryButtonLabel: "Отмена",
            },
          },
        ]}
        render={(props) => <StatusScreen {...props} />}
      />
    </div>
  ),
}
