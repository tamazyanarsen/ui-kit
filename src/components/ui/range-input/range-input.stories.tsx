import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"

import {
  PseudoBox,
  StatesMatrix,
  optionsArgType,
  sizeArgType,
  stateArgTypeOf,
  toggleArgType,
  type PlaygroundState,
} from "@/stories/matrix"
import { type Viewport } from "@/lib/viewport"

import { RangeInput, type RangeInputProps } from "./range-input"

/* Дизайн-чек №17: вместо JSON-редакторов — понятные списки готовых
   вариантов. Оба свойства здесь не «сколько элементов», а «какой пресет»,
   поэтому и выбор пресетами, а не счётчиком. */
const SCALE_PRESETS = {
  "Без шкалы": [],
  "0 — 50 — 100": ["0", "50", "100"],
  "0 — 25 — 50 — 75 — 100": ["0", "25", "50", "75", "100"],
  "Min / Max": ["Min", "Max"],
} satisfies Record<string, string[]>

const FORMAT_PRESETS = {
  "Без форматирования": undefined,
  "Рубли": { style: "currency", currency: "RUB", maximumFractionDigits: 0 },
  "Проценты": { style: "unit", unit: "percent" },
} satisfies Record<string, Intl.NumberFormatOptions | undefined>

type ScalePreset = keyof typeof SCALE_PRESETS
type FormatPreset = keyof typeof FORMAT_PRESETS

/* Панель повторяет «Свойства компонента» `ELK / range input` (компонент-сет
   687:18338, таблица 31984:19733): Size / State / Show Comment /
   Show Indicator / Range Line.

   `State` — ось компонент-сета (Default, Hover, Focused, Disabled, Error):
   Disabled и Error задаются пропами, а hover и фокус пропом не выставить —
   их даёт общий контрол `state`, как у остальных полей ввода кита.
   `Range Line` в Figma — три положения ползунка, в коде это просто значение. */
const RANGE_LINE_LABELS = {
  beginning: "Beginning",
  middle: "Middle",
  end: "The End",
} as const
type RangeLine = keyof typeof RANGE_LINE_LABELS

const RANGE_LINE_FRACTION: Record<RangeLine, number> = {
  beginning: 0,
  middle: 0.5,
  end: 1,
}

type PlaygroundArgs = Omit<RangeInputProps, "error"> & {
  scalePreset?: ScalePreset
  formatPreset?: FormatPreset
  state?: PlaygroundState
  viewport?: Viewport
  rangeLine?: RangeLine
  // Дизайн-чек 3/3 №3: текст ошибки и комментарий — независимые тоглы, а
  // не наличие текста в поле ввода. Само состояние ошибки — значение State.
  errorText?: string
  showErrorText?: boolean
  showComment?: boolean
  showIndicator?: boolean
}

const meta = {
  title: "Компоненты/Range Input",
  component: RangeInput,
  parameters: { layout: "padded" },
  argTypes: {
    // Дизайн-чек №3 №19: «Пропс на мобайл должен быть в панели стори, не
    // по изменению размера вьюпорта».
    viewport: sizeArgType,
    state: stateArgTypeOf(
      ["default", "hover", "focus", "disabled", "error"],
      { focus: "Focused" }
    ),
    disabled: { table: { disable: true } },
    showComment: toggleArgType("Show Comment"),
    // «Индикатор» — подписи под дорожкой (в макете это шкала min/max).
    showIndicator: toggleArgType("Show Indicator"),
    rangeLine: optionsArgType<RangeLine>(
      "Range Line",
      RANGE_LINE_LABELS,
      "inline-radio"
    ),
    showErrorText: toggleArgType("Show Error Text"),
    // comment/error are typed React.ReactNode but every usage is a plain
    // string — pin text controls so leaving one unset doesn't fall back to
    // Storybook's "Set object" JSON-editor placeholder.
    label: { control: "text", table: { category: "Контент" } },
    comment: { control: "text", table: { category: "Контент" } },
    errorText: { control: "text", table: { category: "Контент" } },
    // Captions under the track (Figma's "Шкала"); за показ отвечает
    // Show Indicator, а этот список — что именно на ней написано.
    scalePreset: {
      name: "Значения шкалы",
      control: "select",
      options: Object.keys(SCALE_PRESETS),
      table: { category: "Контент" },
    },
    // Intl.NumberFormat options for the value bubble, e.g. currency.
    formatPreset: {
      name: "Формат значения",
      control: "select",
      options: Object.keys(FORMAT_PRESETS),
      table: { category: "Контент" },
    },
    min: { control: "number", table: { category: "Контент" } },
    max: { control: "number", table: { category: "Контент" } },
    step: { control: "number", table: { category: "Контент" } },
    scaleLabels: { table: { disable: true } },
    format: { table: { disable: true } },
    defaultValue: { table: { disable: true } },
  },
  /* Порядок ключей здесь задаёт порядок строк в панели Storybook (argTypes
     на него не влияет), поэтому он повторяет порядок таблицы свойств. */
  args: {
    viewport: "desktop" as Viewport,
    state: "default" as PlaygroundState,
    showComment: true,
    showIndicator: true,
    rangeLine: "middle" as RangeLine,
    showErrorText: true,
    label: "Label",
    comment: "Comment",
    errorText: "Text about error here",
    scalePreset: "0 — 50 — 100",
    formatPreset: "Без форматирования",
    min: 0,
    max: 100,
    step: 1,
  },
} satisfies Meta<PlaygroundArgs>

export default meta
type Story = StoryObj<PlaygroundArgs>

function Controlled({ defaultValue, ...props }: RangeInputProps) {
  const [value, setValue] = useState<number>(
    typeof defaultValue === "number" ? defaultValue : 50
  )
  return (
    <RangeInput
      {...props}
      value={value}
      onValueChange={(v) => setValue(v as number)}
    />
  )
}

export const Playground: Story = {
  render: ({
    scalePreset,
    formatPreset,
    state,
    viewport,
    rangeLine = "middle",
    errorText,
    showErrorText,
    showComment,
    showIndicator,
    comment,
    min = 0,
    max = 100,
    ...args
  }) => {
    const error = state === "error"
    return (
      <PseudoBox state={state} viewport={viewport} className="w-full">
        <Controlled
          {...args}
          min={min}
          max={max}
          // `key` — иначе Controlled сохранит прежнее значение и контрол
          // Range Line будет выглядеть мёртвым (см. дизайн-чек про default*).
          key={rangeLine}
          defaultValue={min + (max - min) * RANGE_LINE_FRACTION[rangeLine]}
          disabled={state === "disabled"}
          comment={showComment ? comment : undefined}
          // `true` — состояние ошибки без текста: шкала краснеет, подпись
          // остаётся комментарием (см. range-input.tsx).
          error={error ? (showErrorText ? errorText || true : true) : undefined}
          scaleLabels={
            showIndicator
              ? SCALE_PRESETS[scalePreset ?? "0 — 50 — 100"]
              : undefined
          }
          format={FORMAT_PRESETS[formatPreset ?? "Без форматирования"]}
        />
      </PseudoBox>
    )
  },
}

export const Matrix: Story = {
  name: "Matrix (все состояния)",
  parameters: { layout: "fullscreen", controls: { disable: true } },
  render: () => (
    <StatesMatrix<RangeInputProps>
      responsive
      stretch
      cellClassName="min-w-[320px]"
      baseProps={{ label: "Label", min: 0, max: 100, step: 1 }}
      columns={[
        { label: "Без шкалы", props: {} },
        { label: "Со шкалой", props: { scaleLabels: ["0", "50", "100"] } },
      ]}
      rows={[
        { label: "0 %", props: { defaultValue: 0 } },
        { label: "50 %", props: { defaultValue: 50 } },
        { label: "100 %", props: { defaultValue: 100 } },
        { label: "Hover", props: { defaultValue: 50 }, pseudo: "hover" },
        {
          label: "Comment",
          props: { defaultValue: 50, comment: "Comment" },
        },
        {
          label: "Error",
          props: { defaultValue: 50, error: "Text about error here" },
        },
        { label: "Disabled", props: { defaultValue: 50, disabled: true } },
      ]}
      render={(props) => <Controlled {...props} />}
    />
  ),
}
