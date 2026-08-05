import type { Meta, StoryObj } from "@storybook/react-vite"

import { StatusScreen } from "./status-screen"
import type { StatusType } from "./status-screen"

const meta = {
  title: "Template/StatusScreen",
  component: StatusScreen,
  parameters: { layout: "padded" },
  args: {
    title: "Платёж выполнен",
    subtitle: "Средства зачислены на счёт получателя",
    primaryLabel: "На главную",
  },
  // `secondaryLabel` is typed React.ReactNode but every story only ever puts
  // a plain string in it — pin a text control so a story that leaves it
  // unset doesn't fall back to Storybook's "Set object" JSON-editor
  // placeholder.
  argTypes: {
    secondaryLabel: { control: "text" },
  },
} satisfies Meta<typeof StatusScreen>

export default meta
type Story = StoryObj<typeof meta>

export const Success: Story = {
  args: { status: "success" },
}

export const ErrorStatus: Story = {
  args: { status: "error", title: "Не удалось выполнить платёж", subtitle: "Попробуйте ещё раз" },
}

export const Attention: Story = {
  args: { status: "attention", title: "Требуется подтверждение" },
}

export const TwoButtons: Story = {
  args: { secondaryLabel: "Отмена" },
}

export const AllStatuses: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
      {(
        [
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
        ] as StatusType[]
      ).map((status) => (
        <StatusScreen key={status} status={status} title={status} />
      ))}
    </div>
  ),
}
