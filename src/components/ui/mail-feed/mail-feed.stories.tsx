import type { Meta, StoryObj } from "@storybook/react-vite"
import { useState } from "react"

import { MailFeed } from "./mail-feed"
import type { MailFeedState } from "./mail-feed"

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
  title: "Content/MailFeed",
  component: MailFeed,
  parameters: { layout: "padded" },
  args: ROW_PROPS,
  render: (args) => (
    <div className="w-[492px]">
      <MailFeed {...args} />
    </div>
  ),
} satisfies Meta<typeof MailFeed>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const New: Story = {
  args: { state: "new" },
}

export const Used: Story = {
  args: { state: "used" },
}

export const ErrorState: Story = {
  args: { state: "error" },
}

export const AllStates: Story = {
  render: () => (
    <div className="grid w-[492px] grid-cols-1 gap-3">
      {STATES.map((state) => (
        <div key={state} className="flex flex-col gap-1">
          <MailFeed {...ROW_PROPS} state={state} />
          <span className="text-p3 text-muted-foreground">{state}</span>
        </div>
      ))}
    </div>
  ),
}

export const WithCheckbox: Story = {
  render: function WithCheckboxStory() {
    const [checked, setChecked] = useState(false)
    return (
      <div className="w-[492px]">
        <MailFeed {...ROW_PROPS} showCheckbox checked={checked} onCheckedChange={setChecked} />
      </div>
    )
  },
}
