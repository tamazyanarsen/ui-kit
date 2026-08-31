import type { Meta, StoryObj } from "@storybook/react-vite"

import { StatesMatrix } from "@/stories/matrix"
import { orderedOptionLabels } from "@/stories/options"

import { Nps, type NpsEstimateType, type NpsProps, type NpsShowChips } from "./nps"

/* Дизайн-чек №4 №11: контрол оценки называется «Estimate Type» и выбирается
   из None, 1–5 — по элементу «Estimate (ELK)» (нода 70326:40173).
   Дизайн-чек №4 №12: отдельного `defaultValue` в контролах нет — оценка
   задаётся одним этим контролом (история пересоздаётся, чтобы звёзды
   оставались кликабельными). */
const ESTIMATE_TYPES = ["None", 1, 2, 3, 4, 5] as const
type EstimateType = (typeof ESTIMATE_TYPES)[number]

/* Дизайн-чек №4 №13: «Show Chips» — тоже None, 1–5: сколько предлагаемых
   ответов показать (таблица свойств, нода 70326:40017). */
const SHOW_CHIPS: NpsShowChips[] = ["none", 1, 2, 3, 4, 5]

type PlaygroundArgs = NpsProps & { estimateType?: EstimateType }

const meta = {
  title: "Компоненты/NPS",
  component: Nps,
  parameters: { layout: "centered" },
  // `title` is typed React.ReactNode but every real usage (including the
  // component's own runtime default) is a plain string — pin a text control
  // so an unset value doesn't fall back to Storybook's "Set object"
  // placeholder.
  argTypes: {
    title: { control: "text" },
    estimateType: {
      name: "Estimate Type",
      control: { type: "select", labels: orderedOptionLabels(ESTIMATE_TYPES) },
      options: ESTIMATE_TYPES,
    },
    // Оценка задаётся контролом «Estimate Type» — сырые пропы скрыты.
    value: { table: { disable: true } },
    defaultValue: { table: { disable: true } },
    comment: { control: "text" },
    chips: { table: { disable: true } },
    showDescription: { control: "boolean" },
    showChips: {
      name: "Show Chips",
      // `none` показываем как «None» — ровно как в таблице свойств.
      control: {
        type: "select",
        labels: orderedOptionLabels(SHOW_CHIPS, { none: "None" }),
      },
      options: SHOW_CHIPS,
    },
    submitted: { control: "boolean" },
    // Дизайн-чек №4 №8: className — не свойство компонента из макета.
    className: { table: { disable: true } },
  },
  args: {
    estimateType: "None",
    showDescription: true,
    showChips: 5,
    submitted: false,
  },
} satisfies Meta<PlaygroundArgs>

export default meta
type Story = StoryObj<PlaygroundArgs>

export const Playground: Story = {
  // Оценка приходит контролом, но звёзды должны оставаться живыми, поэтому
  // она задаётся начальным значением, а история пересоздаётся по ключу.
  render: ({ estimateType = "None", value: _value, defaultValue: _default, ...args }) => (
    <Nps
      key={String(estimateType)}
      {...args}
      defaultValue={estimateType === "None" ? null : (estimateType as NpsEstimateType)}
    />
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
        { label: "Estimate Type: None", props: {} },
        { label: "Estimate Type: 4", props: { defaultValue: 4 } },
        { label: "Estimate Type: 2", props: { defaultValue: 2 } },
        // Both follow-up blocks are independently switchable.
        { label: "Show Chips: none", props: { defaultValue: 3, showChips: "none" } },
        { label: "Show Chips: 2", props: { defaultValue: 3, showChips: 2 } },
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
