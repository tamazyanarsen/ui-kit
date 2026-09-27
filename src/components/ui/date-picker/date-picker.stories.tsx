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

import { DatePicker } from "./date-picker"
import type { DatePickerProps } from "./date-picker"
import type { CalendarMode } from "@/components/ui/calendar"
import type { InputSize } from "@/components/ui/input"

/* Ось `State` есть в макете (`ELK / select`, на котором стоит поле: State = Default | Hover | Disabled | Active), а hover пропом не
   выставить — его даёт общий контрол `state`. */
type PlaygroundArgs = DatePickerProps & { state?: PlaygroundState }

const meta = {
  title: "Компоненты/Date Picker",
  component: DatePicker,
  parameters: { layout: "centered" },
  /* Своего мастера у Date Picker нет: в Figma это `ELK / input` с
     выпадающим `ELK / calendar`, поэтому имена свойств взяты оттуда —
     Size у поля, Type у календаря. Значения `Type` — из вложенного сета
     `Calendar (Desktop, ELK)`. */
  argTypes: {
    size: optionsArgType<InputSize>(
      "Size",
      { lg: "L", sm: "S" },
      "inline-radio"
    ),
    // Disabled в Figma — значение оси State, Hover/Focused — псевдоклассы.
    state: stateArgTypeOf(["default", "hover", "focus", "disabled"], {
      focus: "Focused",
    }),
    // `mode` и `size` — это обычные строковые объединения, импортированные
    // из других модулей (`CalendarMode` и `InputSize`), а react-docgen не
    // умеет разрешить импортированный псевдоним типа в перечисление,
    // поэтому оба откатываются на универсальный JSON-редактор «Set object».
    // Вместо этого списки значений заданы явно — та же правка, что и с
    // `color` у Badge.
    mode: optionsArgType<CalendarMode>(
      "Type",
      { single: "Day", range: "Range", month: "Month", year: "Year" },
      "inline-radio"
    ),
    // The popup's "Сбросить / Применить" row.
    footer: toggleArgType("Show Buttons"),
    // `label`, `comment` и `error` объявлены как `React.ReactNode`, но
    // везде используются обычными строками. Без этого незаданное значение
    // откатывается на тот же универсальный редактор «Set object».
    label: { control: "text", table: { category: "Контент" } },
    comment: { control: "text", table: { category: "Контент" } },
    error: { control: "text", table: { category: "Контент" } },
    // Значение оси State — отдельного контрола у него нет.
    disabled: { table: { disable: true } },
    // `value`, `rangeValue`, `monthValue` и `yearValue` принадлежат
    // собственной обёртке локального состояния каждой стори и панелью
    // Controls управляться не должны. Те же грабли проверены вживую на
    // одноимённых пропсах Calendar: установка значения через JSON-редактор
    // роняет стори, потому что он выдаёт обычный объект, а не настоящий
    // экземпляр Date.
    value: { control: false },
    rangeValue: { control: false },
    monthValue: { control: false },
    yearValue: { control: false },
  },
  /* Порядок ключей здесь задаёт порядок строк в панели Storybook. */
  args: {
    size: "lg",
    state: "default" as PlaygroundState,
    mode: "single",
    footer: true,
    label: "Дата",
  },
} satisfies Meta<PlaygroundArgs>

export default meta
type Story = StoryObj<PlaygroundArgs>

// `value` и `onChange` зафиксированы собственным локальным состоянием
// этого демо; все остальные контролы (label, comment, error, disabled,
// size и прочие) по-прежнему пробрасываются.
function ControlledSingle(props: Omit<DatePickerProps, "value" | "onChange">) {
  const [value, setValue] = useState<Date | null>(new Date(2024, 0, 15))
  return <DatePicker value={value} onChange={setValue} {...props} />
}

function ControlledRange(
  props: Omit<DatePickerProps, "rangeValue" | "onRangeChange">
) {
  const [range, setRange] = useState<[Date | null, Date | null]>([
    new Date(2024, 0, 10),
    new Date(2024, 0, 20),
  ])
  return (
    <DatePicker mode="range" rangeValue={range} onRangeChange={setRange} {...props} />
  )
}

function Demo(props: DatePickerProps) {
  return props.mode === "range" ? (
    <ControlledRange {...props} />
  ) : (
    <ControlledSingle {...props} />
  )
}

export const Playground: Story = {
  render: ({ state, ...args }) => (
    <div className="w-80">
      <PseudoBox state={state} className="w-full">
        <Demo {...args} disabled={state === "disabled"} />
      </PseudoBox>
    </div>
  ),
}

export const Matrix: Story = {
  name: "Matrix (все состояния)",
  parameters: { layout: "fullscreen", controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-2">
      <StatesMatrix<DatePickerProps>
        stretch
        cellClassName="min-w-[280px]"
        baseProps={{ label: "Label" }}
        columnGroups={[
          {
            label: "Mode",
            columns: [
              { label: "Single", props: { mode: "single" } },
              { label: "Range", props: { mode: "range" } },
              { label: "Month", props: { mode: "month" } },
              { label: "Year", props: { mode: "year" } },
            ],
          },
        ]}
        rows={[
          { label: "L (default)", props: { size: "lg" } },
          { label: "S", props: { size: "sm" } },
        ]}
        render={(props) => <Demo {...props} />}
      />
      <StatesMatrix<DatePickerProps>
        stretch
        cellClassName="min-w-[280px]"
        baseProps={{ label: "Label", mode: "single" }}
        columns={[
          { label: "L (default)", props: { size: "lg" } },
          { label: "S", props: { size: "sm" } },
        ]}
        rows={[
          { label: "Default", props: {} },
          { label: "Hover", props: {}, pseudo: "hover" },
          { label: "Focus", props: {}, pseudo: "focus-within" },
          { label: "Comment", props: { comment: "Comment" } },
          { label: "Error", props: { error: "Text about error here" } },
          { label: "Disabled", props: { disabled: true } },
        ]}
        render={(props) => <Demo {...props} />}
      />
    </div>
  ),
}
