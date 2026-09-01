import type { Meta, StoryObj } from "@storybook/react-vite"
import { useState } from "react"

import {
  PseudoBox,
  StatesMatrix,
} from "@/stories/matrix"

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

/* У `ELK / mail` два разных свойства: `Property 1` — это наш `state`
   (Default/New/Used/Error), а `Hover` — отдельное булево, которое пропом не
   выставить. Поэтому Hover эмулируется псевдосостоянием. */
type PlaygroundArgs = MailFeedProps & { hover?: boolean }

const meta = {
  // Дизайн-чек Storybook 2 (от Notification до Loader) №9: «замени название
  // компонента "Mail Components"».
  title: "Компоненты/Mail Components",
  component: MailFeed,
  parameters: { layout: "padded" },
  argTypes: {
    state: { control: "inline-radio", options: STATES },
    // У `ELK / mail` два разных свойства: `Property 1` — это наш `state`
    // (Default/New/Used/Error), а `Hover` — отдельное булево. Пропом его не
    // выставить, поэтому эмулируем псевдосостоянием.
    hover: { control: "boolean", name: "Hover" },
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
} satisfies Meta<PlaygroundArgs>

export default meta
type Story = StoryObj<PlaygroundArgs>

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
  render: ({ hover, ...args }) => (
    <div className="w-[492px]">
      <PseudoBox state={hover ? "hover" : "default"} className="w-full">
        <Controlled {...args} />
      </PseudoBox>
    </div>
  ),
}

/* Дизайн-чек Storybook 2 (от Notification до Loader) №5: «скорректируй вид в
   сетку, опираясь на структуру компонента по ссылке». Сет `Mail feed`
   (796:69794) разложен тремя осями: `Property 1` (Default / New / Used /
   Error), `Hover` (No / Yes) и `Checkbox` (No / Yes) — 16 символов. Раньше
   Hover был одной лишней строкой сбоку, а не осью, поэтому половина сета в
   матрицу не попадала. */
export const Matrix: Story = {
  name: "Matrix (все состояния)",
  parameters: { layout: "fullscreen", controls: { disable: true } },
  render: () => (
    <StatesMatrix<MailFeedProps>
      stretch
      cellClassName="min-w-[492px]"
      baseProps={ROW_PROPS}
      columnGroups={[
        {
          label: "Hover = No",
          columns: [
            { label: "Checkbox = No", props: {} },
            { label: "Checkbox = Yes", props: { showCheckbox: true } },
          ],
        },
        {
          label: "Hover = Yes",
          columns: [
            { label: "Checkbox = No", props: {}, pseudo: "hover" as const },
            {
              label: "Checkbox = Yes",
              props: { showCheckbox: true },
              pseudo: "hover" as const,
            },
          ],
        },
      ]}
      rows={STATES.map((state) => ({ label: state, props: { state } }))}
      render={(props) => <Controlled {...props} />}
    />
  ),
}
