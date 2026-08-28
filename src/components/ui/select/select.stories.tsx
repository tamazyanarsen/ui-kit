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

import { Select, SelectValue } from "./root"
import { SelectTrigger } from "./trigger"
import { SelectContent } from "./content"
import { SelectItem } from "./item"

const FRUIT_OPTIONS = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "cherry", label: "Cherry" },
]

/* Дизайн-чек 3/3 №21: «не хватает контролов для выбора маски». В макете
   (65732:19613) содержимое триггера — отдельный набор «масок»: Empty (только
   подпись), Fill (подпись + значение), Lock (то же плюс замок),
   Logotype (логотип слева от подписи/значения) и Logotype BIK (логотип и
   третья строка с БИК). В контролах выбрать их было нельзя. */
const SELECT_MASKS = ["Empty", "Fill", "Lock", "Logotype", "Logotype BIK"] as const
type SelectMask = (typeof SELECT_MASKS)[number]

const BANK_OPTIONS = [
  { value: "alfa", label: "Альфа-Банк", bik: "044525593" },
  { value: "sber", label: "Сбербанк", bik: "044525225" },
  { value: "vtb", label: "ВТБ", bik: "044525187" },
]

/** Кружок-логотип банка — в макете это 24px-слот перед подписью. */
function BankLogo({ letter }: { letter: string }) {
  return (
    <span
      aria-hidden="true"
      className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#EF3124] text-[12px] font-medium text-white"
    >
      {letter}
    </span>
  )
}

interface DemoSelectProps {
  size?: "sm" | "lg"
  mask?: SelectMask
  label?: string
  placeholder?: string
  error?: string
  comment?: string
  defaultValue?: string | null
  clearable?: boolean
  disabled?: boolean
  readOnly?: boolean
  open?: boolean
}

function DemoSelect({
  size,
  mask = "Fill",
  label = "Label",
  placeholder = "",
  error,
  comment,
  defaultValue = null,
  clearable = true,
  disabled,
  readOnly,
  open,
}: DemoSelectProps) {
  const withLogo = mask === "Logotype" || mask === "Logotype BIK"
  const options = withLogo ? BANK_OPTIONS : FRUIT_OPTIONS
  // Маска Empty — это незаполненное поле, Lock — заблокированное.
  const initial = mask === "Empty" ? null : (defaultValue ?? options[0].value)
  const [value, setValue] = useState<string | null>(initial)
  // Дизайн-чек 3/3 №21: контрол Open не работал, потому что состояние
  // передавалось через `defaultOpen` — его читают только при монтировании,
  // поэтому переключение контрола на уже смонтированном поле ничего не
  // меняло. Держим `open` управляемым, но с локальным состоянием, чтобы
  // список по-прежнему можно было закрыть мышью.
  const [isOpen, setIsOpen] = useState(Boolean(open))
  const [lastOpen, setLastOpen] = useState(open)
  if (open !== lastOpen) {
    setLastOpen(open)
    setIsOpen(Boolean(open))
  }

  return (
    <Select
      items={options}
      value={value}
      onValueChange={setValue}
      disabled={disabled}
      readOnly={readOnly || mask === "Lock"}
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <SelectTrigger
        size={size}
        label={label}
        error={error}
        comment={comment}
        // Дизайн-чек 3/3 №26: `clearable` до сих пор доходил только до
        // обработчика `onClear`, а сам проп триггера оставался в дефолтном
        // `true` — крестик рисовался всегда, просто переставал что-либо
        // делать. Прокидываем флаг явно.
        clearable={clearable}
        onClear={() => setValue(null)}
      >
        <SelectValue placeholder={placeholder}>
          {(selected: unknown) => {
            const option = options.find((o) => o.value === selected)
            if (!option) return null
            const bik =
              mask === "Logotype BIK" && "bik" in option
                ? String(option.bik)
                : null
            return (
              <>
                {withLogo && <BankLogo letter={option.label[0]} />}
                <span className="flex min-w-0 flex-col">
                  <span className="truncate">{option.label}</span>
                  {bik && (
                    <span className="text-p3-medium text-[var(--select-label-fg)]">
                      {bik}
                    </span>
                  )}
                </span>
              </>
            )
          }}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {options.map((o) => (
          <SelectItem key={o.value} value={o.value}>
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

type PlaygroundArgs = DemoSelectProps & {
  state?: PlaygroundState
  viewport?: Viewport
}

const meta = {
  title: "Компоненты/Select",
  component: DemoSelect,
  parameters: { layout: "padded" },
  // `DemoSelect` is a plain function declared locally in this file rather
  // than imported from its own component module — Storybook's docgen
  // (react-docgen-typescript) only reliably extracts props from component
  // modules, so most of this wrapper's props silently get NO Controls row at
  // all. Declare every one of them explicitly instead.
  argTypes: {
    size: { control: "inline-radio", options: ["lg", "sm"] },
    mask: { control: "select", options: SELECT_MASKS, name: "Маска" },
    label: { control: "text" },
    placeholder: { control: "text" },
    error: { control: "text" },
    comment: { control: "text" },
    defaultValue: { table: { disable: true } },
    clearable: { control: "boolean" },
    disabled: { control: "boolean" },
    readOnly: { control: "boolean" },
    open: { control: "boolean" },
    state: stateArgType,
    // Дизайн-чек №3 №19: форма Desktop/Mobile выбирается контролом в
    // панели истории, а не изменением размера вьюпорта.
    viewport: viewportArgType,
  },
  args: {
    size: "lg",
    mask: "Fill",
    label: "Label",
    comment: "Comment",
    clearable: true,
    disabled: false,
    readOnly: false,
    open: false,
    state: "default" as PlaygroundState,
    viewport: "auto" as Viewport,
  },
} satisfies Meta<PlaygroundArgs>

export default meta
type Story = StoryObj<PlaygroundArgs>

export const Playground: Story = {
  render: ({ state, viewport, ...args }) => (
    <PseudoBox state={state} viewport={viewport} className="w-80">
      <DemoSelect {...args} />
    </PseudoBox>
  ),
}

export const Matrix: Story = {
  name: "Matrix (все состояния)",
  parameters: { layout: "fullscreen", controls: { disable: true } },
  render: () => (
    <StatesMatrix<DemoSelectProps>
      stretch
      cellClassName="min-w-72"
      responsive
      columns={[
        { label: "L (default)", props: { size: "lg" } },
        { label: "S", props: { size: "sm" } },
      ]}
      rows={[
        { label: "Default", props: {} },
        { label: "Hover", props: {}, pseudo: "hover" },
        { label: "Focus", props: {}, pseudo: "focus-within" },
        { label: "Filled", props: { defaultValue: "banana" } },
        {
          label: "Comment",
          props: { defaultValue: "banana", comment: "Comment" },
        },
        {
          label: "Error",
          props: { defaultValue: "banana", error: "Text about error here" },
        },
        { label: "Read only", props: { defaultValue: "banana", readOnly: true } },
        { label: "Disabled", props: { defaultValue: "banana", disabled: true } },
      ]}
      render={(props) => <DemoSelect {...props} />}
    />
  ),
}

/* The open list is a portalled popup, so it can't live inside the matrix
   (every cell would overlay the next). */
export const Opened: Story = {
  name: "Раскрытый список",
  parameters: { layout: "padded", controls: { disable: true } },
  render: () => (
    <div className="h-80 w-80">
      <DemoSelect open defaultValue="banana" />
    </div>
  ),
}
