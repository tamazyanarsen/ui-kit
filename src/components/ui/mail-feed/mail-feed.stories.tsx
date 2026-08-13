import type { Meta, StoryObj } from "@storybook/react-vite"
import { useState } from "react"

import { StatesMatrix } from "@/stories/matrix"

import { MailFeed, type MailFeedProps, type MailFeedState } from "./mail-feed"

const ROW_PROPS = {
  id: "159638",
  sender: "ООО «Родники и речки России»",
  date: "24.12.2022, 09:32",
  subject: "Ошибки в данных",
  message: "У меня сломалось отображение зарплатного проекта",
  preview:
    "Ответ банка: Повседневная практика показывает, что постоянный количественный рост и сфера нашей активности позволяет выполнять важные задания по разработке системы обучения кадров.",
}

const STATES: MailFeedState[] = ["default", "new", "used", "error"]

const meta = {
  title: "Компоненты/Mail Feed",
  component: MailFeed,
  parameters: { layout: "padded" },
  argTypes: {
    state: { control: "inline-radio", options: STATES },
    id: { control: "text" },
    sender: { control: "text" },
    date: { control: "text" },
    subject: { control: "text" },
    message: { control: "text" },
    preview: { control: "text" },
    showCheckbox: { control: "boolean" },
    checked: { control: "boolean" },
  },
  args: { ...ROW_PROPS, state: "default", showCheckbox: false },
} satisfies Meta<MailFeedProps>

export default meta
type Story = StoryObj<MailFeedProps>

function Controlled(props: MailFeedProps) {
  const [checked, setChecked] = useState(false)
  return (
    <MailFeed
      {...props}
      checked={props.checked ?? checked}
      onCheckedChange={setChecked}
    />
  )
}

export const Playground: Story = {
  render: (args) => (
    <div className="w-[492px]">
      <Controlled {...args} />
    </div>
  ),
}

export const Matrix: Story = {
  name: "Matrix (все состояния)",
  parameters: { layout: "fullscreen", controls: { disable: true } },
  render: () => (
    <StatesMatrix<MailFeedProps>
      stretch
      cellClassName="min-w-[492px]"
      baseProps={ROW_PROPS}
      columns={[
        { label: "Без чекбокса", props: {} },
        { label: "С чекбоксом", props: { showCheckbox: true } },
      ]}
      rows={[
        ...STATES.map((state) => ({ label: state, props: { state } })),
        { label: "Hover", props: { state: "default" as MailFeedState }, pseudo: "hover" as const },
      ]}
      render={(props) => <Controlled {...props} />}
    />
  ),
}
