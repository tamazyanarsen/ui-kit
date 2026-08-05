import type { Meta, StoryObj } from "@storybook/react-vite"

import { Event } from "./event"

const meta = {
  title: "Status/Message/Event",
  component: Event,
  parameters: { layout: "padded" },
  // `commentLabel`/`comment`/`buttonLabel` are `React.ReactNode` but every
  // usage is a plain string — without this, leaving one unset falls back
  // to a generic "Set object" JSON editor. `signatories`/`info`/`documents`
  // are left alone: arrays of plain structured data (name/label/value/meta
  // strings), already fine to edit as raw JSON, same as other array-of-data
  // props elsewhere in this kit.
  argTypes: {
    commentLabel: { control: "text" },
    comment: { control: "text" },
    buttonLabel: { control: "text" },
  },
  args: {
    title: "Заявка отправлена",
    timestamp: "10:00",
    author: "Иванов И.И.",
  },
} satisfies Meta<typeof Event>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const StatusTag: Story = {
  args: { type: "tag", title: "Одобрено", status: "success" },
}

export const WithSignatories: Story = {
  args: {
    signatories: [
      { status: "success", name: "Иванов И.И.", attribute: "Первая подпись" },
      { status: "attention", name: "Петров П.П.", attribute: "Вторая подпись" },
    ],
  },
}

export const WithInfoRows: Story = {
  args: {
    info: [
      { label: "Сумма:", value: "10 000 ₽" },
      { label: "Счёт:", value: "40702810...1234" },
    ],
  },
}

export const WithComment: Story = {
  args: { comment: "Комментарий согласующего к заявке" },
}

export const WithDocuments: Story = {
  args: {
    documents: [
      { name: "Договор.pdf", meta: "1.2 МБ" },
      { name: "Приложение.pdf", meta: "512 КБ" },
    ],
  },
}

export const WithButton: Story = {
  args: { buttonLabel: "Подробнее" },
}

export const NoConnector: Story = {
  args: { showConnector: false },
}

export const FullTimeline: Story = {
  render: () => (
    <div>
      <Event
        title="Заявка создана"
        timestamp="09:00"
        author="Иванов И.И."
      />
      <Event
        type="tag"
        title="На согласовании"
        status="attention"
        timestamp="09:15"
        signatories={[{ status: "attention", name: "Петров П.П.", attribute: "Первая подпись" }]}
      />
      <Event
        type="tag"
        title="Одобрено"
        status="success"
        timestamp="10:00"
        showConnector={false}
      />
    </div>
  ),
}
