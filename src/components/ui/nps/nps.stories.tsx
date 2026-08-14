import type { Meta, StoryObj } from "@storybook/react-vite"

import { StatesMatrix } from "@/stories/matrix"

import { Nps, type NpsProps } from "./nps"

/* Дизайн-чек №17: количество реплик-подсказок выбирается списком, а не
   правкой JSON-массива в контролах. */
const CHIP_POOL = [
  "Долго грузится",
  "Непонятный интерфейс",
  "Не хватает функций",
  "Всё устраивает",
]

const CHIP_COUNTS = [0, 1, 2, 3, 4] as const
type ChipCount = (typeof CHIP_COUNTS)[number]

type PlaygroundArgs = NpsProps & { chipsCount?: ChipCount }

const meta = {
  title: "Компоненты/NPS",
  component: Nps,
  parameters: { layout: "centered" },
  // `title` is typed React.ReactNode but every real usage (including the
  // component's own runtime default) is a plain string — pin a text control
  // so an unset value doesn't fall back to Storybook's "Set object"
  // placeholder. `value`/`defaultValue` are typed `number | null` — the
  // `| null` union confuses Storybook's type inference into the same
  // JSON-editor placeholder, even though every real usage is a 1–5 rating.
  argTypes: {
    title: { control: "text" },
    value: { control: "number" },
    defaultValue: { control: "number" },
    comment: { control: "text" },
    chipsCount: {
      name: "Количество реплик",
      control: "select",
      options: CHIP_COUNTS,
    },
    chips: { table: { disable: true } },
    showDescription: { control: "boolean" },
    showChips: { control: "boolean" },
    submitted: { control: "boolean" },
  },
  args: {
    showDescription: true,
    showChips: true,
    submitted: false,
    chipsCount: 4,
  },
} satisfies Meta<PlaygroundArgs>

export default meta
type Story = StoryObj<PlaygroundArgs>

export const Playground: Story = {
  render: ({ chipsCount = 4, ...args }) => (
    <Nps {...args} chips={CHIP_POOL.slice(0, chipsCount)} />
  ),
}

export const Matrix: Story = {
  name: "Matrix (все состояния)",
  parameters: { layout: "fullscreen", controls: { disable: true } },
  render: () => (
    <StatesMatrix<NpsProps>
      stretch
      cellClassName="min-w-[420px]"
      columns={[{ label: "Feedback (NPS)" }]}
      rows={[
        { label: "Оценка не выбрана", props: {} },
        { label: "Оценка 4", props: { defaultValue: 4 } },
        { label: "Оценка 2", props: { defaultValue: 2 } },
        // Both follow-up blocks are independently switchable.
        { label: "Без плашек", props: { defaultValue: 3, showChips: false } },
        {
          label: "Без поля комментария",
          props: { defaultValue: 3, showDescription: false },
        },
        { label: "Отправлено", props: { submitted: true } },
      ]}
      render={(props) => <Nps {...props} />}
    />
  ),
}
