import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"

import {
  PseudoBox,
  StatesMatrix,
  stateArgType,
  viewportArgType,
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

/* `State` — ось компонент-сета `ELK / range input` (Default, Hover,
   Focused, Disabled, Error). Disabled и Error задаются пропами, а hover и
   фокус пропом не выставить — их даёт общий контрол `state`, как у
   остальных полей ввода кита. */
type PlaygroundArgs = Omit<RangeInputProps, "error"> & {
  scalePreset?: ScalePreset
  formatPreset?: FormatPreset
  state?: PlaygroundState
  viewport?: Viewport
  // Дизайн-чек 3/3 №3: состояние ошибки, её текст и комментарий —
  // три независимых тогла, а не наличие текста в поле ввода.
  error?: boolean
  errorText?: string
  showErrorText?: boolean
  showComment?: boolean
}

const meta = {
  title: "Компоненты/Range Input",
  component: RangeInput,
  parameters: { layout: "padded" },
  // comment/error are typed React.ReactNode but every usage is a plain
  // string — pin text controls so leaving one unset doesn't fall back to
  // Storybook's "Set object" JSON-editor placeholder.
  argTypes: {
    label: { control: "text" },
    error: { control: "boolean", name: "Error" },
    showErrorText: { control: "boolean", name: "Show Error Text" },
    errorText: { control: "text", name: "Текст ошибки" },
    showComment: { control: "boolean", name: "Show Comment" },
    comment: { control: "text", name: "Текст комментария" },
    min: { control: "number" },
    max: { control: "number" },
    step: { control: "number" },
    disabled: { control: "boolean" },
    state: stateArgType,
    // Дизайн-чек №3 №19: «Пропс на мобайл должен быть в панели стори, не
    // по изменению размера вьюпорта».
    viewport: viewportArgType,
    // Captions under the track (Figma's "Шкала"); «Без шкалы» их прячет.
    scalePreset: {
      name: "Шкала",
      control: "select",
      options: Object.keys(SCALE_PRESETS),
    },
    // Intl.NumberFormat options for the value bubble, e.g. currency.
    formatPreset: {
      name: "Формат значения",
      control: "select",
      options: Object.keys(FORMAT_PRESETS),
    },
    scaleLabels: { table: { disable: true } },
    format: { table: { disable: true } },
  },
  args: {
    label: "Label",
    min: 0,
    max: 100,
    step: 1,
    defaultValue: 50,
    disabled: false,
    scalePreset: "0 — 50 — 100",
    formatPreset: "Без форматирования",
    comment: "Comment",
    showComment: true,
    error: false,
    errorText: "Text about error here",
    showErrorText: true,
    state: "default" as PlaygroundState,
    viewport: "auto" as Viewport,
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
    error,
    errorText,
    showErrorText,
    showComment,
    comment,
    ...args
  }) => (
    <PseudoBox state={state} viewport={viewport} className="w-full">
      <Controlled
        {...args}
        comment={showComment ? comment : undefined}
        // `true` — состояние ошибки без текста: шкала краснеет, подпись
        // остаётся комментарием (см. range-input.tsx).
        error={error ? (showErrorText ? errorText || true : true) : undefined}
        scaleLabels={SCALE_PRESETS[scalePreset ?? "0 — 50 — 100"]}
        format={FORMAT_PRESETS[formatPreset ?? "Без форматирования"]}
      />
    </PseudoBox>
  ),
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
