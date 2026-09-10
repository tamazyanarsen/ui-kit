import type { Meta, StoryObj } from "@storybook/react-vite"

import {
  StatesMatrix,
  optionsArgType,
  sizeArgType,
  toggleArgType,
} from "@/stories/matrix"
import { ViewportScope, type Viewport } from "@/lib/viewport"

import {
  ItemInformationField,
  type FieldStatus,
  type FieldType,
  type ItemInformationFieldProps,
} from "./item-information-field"
import { ToastProvider, Toaster } from "@/components/ui/toast-message"

/* Панель «Свойства компонента» компонент-сета `ELK / item.information field`
   (таблица 70240:38965 на канвасе Item 11159:9039):

     Size              Desktop, Mobile
     Type              Label Left, Label Top, Large Value, Line
     Show Sub Text     True, False
     Show Divider      True, False
     Value Status      Default, Success, Error, Attention, Information
     Sub Title Status  Default, Success, Error, Attention, Information
     Show Information  True, False
     Show Icon         True, False

   Дизайн-чек «Сторибук Ч.2» от 10.09.2026, замечание 8: панель не совпадала
   с этим списком — половина свойств была включена не переключателем, а тем,
   что в текстовое поле что-то вписали.

   `Show Information` — это значок «i» у подписи и у значения (пропы
   `labelInfo`/`valueInfo`), `Show Icon` — значок копирования (`copyable`). */
const TYPE_LABELS: Record<FieldType, string> = {
  "label-left": "Label Left",
  "label-top": "Label Top",
  "large-value": "Large Value",
  "label-line": "Line",
}

const TYPES = Object.keys(TYPE_LABELS) as FieldType[]

const STATUS_LABELS: Record<FieldStatus, string> = {
  default: "Default",
  success: "Success",
  error: "Error",
  attention: "Attention",
  information: "Information",
}

const STATUSES = Object.keys(STATUS_LABELS) as FieldStatus[]

type SubTextStatus = Exclude<FieldStatus, "information">

const SUB_STATUS_LABELS: Record<SubTextStatus, string> = {
  default: "Default",
  success: "Success",
  error: "Error",
  attention: "Attention",
}

type PlaygroundArgs = ItemInformationFieldProps & {
  viewport?: Viewport
  showSubText?: boolean
  showInformation?: boolean
}

const CONTENT = { table: { category: "Контент" } }

const meta = {
  title: "Компоненты/Information Field",
  component: ItemInformationField,
  parameters: { layout: "padded" },
  argTypes: {
    viewport: sizeArgType,
    type: optionsArgType("Type", TYPE_LABELS),
    showSubText: toggleArgType("Show Sub Text"),
    divider: toggleArgType("Show Divider"),
    valueStatus: optionsArgType("Value Status", STATUS_LABELS),
    subTextStatus: {
      ...optionsArgType("Sub Title Status", SUB_STATUS_LABELS),
      if: { arg: "showSubText", truthy: true },
    },
    showInformation: toggleArgType(
      "Show Information",
      "Значок «i» у подписи и у значения — текст подсказки задаётся полями ниже"
    ),
    copyable: toggleArgType("Show Icon", "Значок копирования значения"),
    label: { control: "text", ...CONTENT },
    value: { control: "text", ...CONTENT },
    subText: {
      control: "text",
      if: { arg: "showSubText", truthy: true },
      ...CONTENT,
    },
    labelInfo: {
      control: "text",
      if: { arg: "showInformation", truthy: true },
      ...CONTENT,
    },
    valueInfo: {
      control: "text",
      if: { arg: "showInformation", truthy: true },
      ...CONTENT,
    },
    // Что попадёт в буфер обмена; без значения копируется `value`.
    copyValue: {
      control: "text",
      if: { arg: "copyable", truthy: true },
      ...CONTENT,
    },
  },
  args: {
    viewport: "desktop" as Viewport,
    type: "label-left" as FieldType,
    showSubText: true,
    divider: true,
    valueStatus: "default" as FieldStatus,
    subTextStatus: "default" as SubTextStatus,
    showInformation: true,
    copyable: true,
    label: "ИНН",
    value: "7710140123",
    subText: "Подтверждён",
    labelInfo: "Идентификационный номер налогоплательщика",
    valueInfo: "Значение получено из ЕГРЮЛ",
    copyValue: "7710140123",
  },
  decorators: [
    (Story) => (
      <ToastProvider>
        <Story />
        <Toaster />
      </ToastProvider>
    ),
  ],
} satisfies Meta<PlaygroundArgs>

export default meta
type Story = StoryObj<PlaygroundArgs>

export const Playground: Story = {
  render: ({ viewport, showSubText, showInformation, ...args }) => (
    <ViewportScope viewport={viewport}>
      <ItemInformationField
        {...args}
        subText={showSubText ? args.subText : undefined}
        labelInfo={showInformation ? args.labelInfo : undefined}
        valueInfo={showInformation ? args.valueInfo : undefined}
      />
    </ViewportScope>
  ),
}

export const Matrix: Story = {
  name: "Matrix (все состояния)",
  parameters: { layout: "fullscreen", controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-2">
      <StatesMatrix<ItemInformationFieldProps>
        stretch
        cellClassName="min-w-[280px]"
        responsive
        baseProps={{ label: "Label", value: "Value" }}
        columnGroups={[
          {
            label: "Type",
            columns: TYPES.map((type) => ({
              label: TYPE_LABELS[type],
              props: { type },
            })),
          },
        ]}
        rows={[
          { label: "Default", props: {} },
          { label: "+ подпись", props: { subText: "Subtext" } },
          {
            label: "+ копирование",
            props: { copyable: true, copyValue: "Value" },
          },
          {
            label: "+ иконки инфо",
            props: { labelInfo: "О поле", valueInfo: "О значении" },
          },
          // Only Label Left carries the divider; the others are bare content
          // the container spaces itself.
          { label: "+ разделитель", props: { divider: true } },
        ]}
        render={(props) => <ItemInformationField {...props} />}
      />

      <StatesMatrix<ItemInformationFieldProps>
        stretch
        cellClassName="min-w-[240px]"
        baseProps={{ label: "Label", value: "Value", subText: "Subtext" }}
        columnGroups={[
          {
            label: "Value status",
            columns: STATUSES.map((valueStatus) => ({
              label: STATUS_LABELS[valueStatus],
              props: { valueStatus },
            })),
          },
        ]}
        rows={[
          { label: "Label Left", props: { type: "label-left" } },
          { label: "Label Top", props: { type: "label-top" } },
          { label: "Large Value", props: { type: "large-value" } },
        ]}
        render={(props) => <ItemInformationField {...props} />}
      />
    </div>
  ),
}
