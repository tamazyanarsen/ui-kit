import * as React from "react"
import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"

import {
  PseudoBox,
  StatesMatrix,
  optionsArgType,
  stateArgTypeOf,
  toggleArgType,
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
  /** `true` — состояние ошибки без текста (Show Text Error = False). */
  error?: React.ReactNode
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

/* Панель повторяет «Свойства компонента» `ELK / select` (компонент-сет
   687:9278, таблица 29750:54028): Size / State / Type / Add /
   Show Text Error.

   `Size` в Figma — одно свойство с четырьмя значениями: размер (L/S) и форма
   (Desktop/Mobile) там не разъезжаются, в коде это `size` + <ViewportScope>.
   `State=Active` — раскрытый список (в коде проп `open`).

   Свойства `Black Theme`, `Mask Comment` и `Mask Error` из таблицы сюда не
   переносим: осей с такими именами у компонент-сета в доступной копии файла
   нет, а тёмной темы у Select в ките нет вовсе. */
const SIZE_LABELS = {
  "lg-desktop": "L / Desktop",
  "sm-desktop": "S / Desktop",
  "lg-mobile": "L / Mobile",
  "sm-mobile": "S / Mobile",
} as const
type FigmaSize = keyof typeof SIZE_LABELS

const TYPE_LABELS = {
  Empty: "Empty",
  Fill: "Filled",
  Lock: "Locked",
} as const

const ADD_LABELS = { none: "None", error: "Error", comment: "Comment" } as const
type FigmaAdd = keyof typeof ADD_LABELS

type PlaygroundArgs = Omit<DemoSelectProps, "size" | "error"> & {
  state?: PlaygroundState
  viewport?: Viewport
  figmaSize?: FigmaSize
  figmaType?: "Empty" | "Fill" | "Lock"
  add?: FigmaAdd
  errorText?: string
  showErrorText?: boolean
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
    figmaSize: optionsArgType<FigmaSize>("Size", SIZE_LABELS),
    // Active в Figma — раскрытый список, Disabled — настоящий проп.
    state: stateArgTypeOf(["default", "hover", "active", "disabled"]),
    figmaType: optionsArgType("Type", TYPE_LABELS, "inline-radio"),
    add: optionsArgType<FigmaAdd>("Add", ADD_LABELS, "inline-radio"),
    showErrorText: toggleArgType("Show Text Error"),
    /* Дизайн-чек 3/3 №21: «не хватает контролов для выбора маски». Свойства
       компонент-сета у этого списка нет — в макете (65732:19613) содержимое
       триггера набрано отдельными мастерами, поэтому контрол свой. */
    mask: {
      control: "select",
      options: SELECT_MASKS,
      name: "Маска содержимого",
      table: { category: "Контент" },
    },
    label: { control: "text", table: { category: "Контент" } },
    placeholder: { control: "text", table: { category: "Контент" } },
    comment: { control: "text", table: { category: "Контент" } },
    errorText: { control: "text", table: { category: "Контент" } },
    clearable: { control: "boolean", table: { category: "Контент" } },
    defaultValue: { table: { disable: true } },
    // Значения осей Type и State — отдельных контролов у них нет.
    disabled: { table: { disable: true } },
    readOnly: { table: { disable: true } },
    open: { table: { disable: true } },
  },
  /* Порядок ключей здесь задаёт порядок строк в панели Storybook (argTypes
     на него не влияет), поэтому он повторяет порядок таблицы свойств. */
  args: {
    figmaSize: "lg-desktop" as FigmaSize,
    state: "default" as PlaygroundState,
    figmaType: "Fill" as const,
    add: "none" as FigmaAdd,
    showErrorText: true,
    mask: "Fill",
    label: "Label",
    comment: "Comment",
    errorText: "Text about error here",
    clearable: true,
  },
} satisfies Meta<PlaygroundArgs>

export default meta
type Story = StoryObj<PlaygroundArgs>

export const Playground: Story = {
  render: ({
    state,
    figmaSize = "lg-desktop",
    figmaType = "Fill",
    add = "none",
    errorText,
    showErrorText,
    comment,
    mask,
    ...args
  }) => {
    const [size, viewport] = figmaSize.split("-") as [
      NonNullable<DemoSelectProps["size"]>,
      Viewport,
    ]
    return (
      <PseudoBox state={state} viewport={viewport} className="w-80">
        <DemoSelect
          {...args}
          size={size}
          // Ось Type задаёт наполнение триггера, а «Маска содержимого» —
          // его раскладку; Empty/Lock из Type побеждают, иначе контрол Type
          // выглядел бы мёртвым при выбранной маске с логотипом.
          mask={figmaType === "Fill" ? mask : figmaType}
          open={state === "active"}
          disabled={state === "disabled"}
          comment={add === "comment" ? comment : undefined}
          error={
            add === "error"
              ? showErrorText
                ? errorText || true
                : true
              : undefined
          }
        />
      </PseudoBox>
    )
  },
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
