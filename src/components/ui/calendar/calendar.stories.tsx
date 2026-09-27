import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"

import {
  StatesMatrix,
  optionsArgType,
  toggleArgType,
} from "@/stories/matrix"
import { ViewportScope } from "@/lib/viewport"

import { Calendar } from "./calendar"
import type { CalendarProps } from "./types"

/* Дизайн-чек Storybook (Аня Багрова) №16 и №17.

   №16 — «при изменении на мобильный вариант компонента отображение не
   меняется». Форму календаря задаёт не `<ViewportScope>`, а собственный
   проп `layout` (`popover` — десктопная карточка, `sheet` — мобильный
   лист): это два разных дерева, а не одно с медиазапросом. В панели же
   стоял общий контрол `viewport`, который для этого компонента не делает
   ничего. Теперь `Size` переключает именно `layout` (и заодно скоуп, чтобы
   вложенные размеры шрифтов шли по той же форме).

   №17 — панель приведена к «Свойствам компонента»: Size, Type, Show
   Buttons, Show Secondary Button. Внутреннее свойство `Type` инстанса
   `Calendar (Desktop, ELK)` (Day / Month / Year / Range) — та же ось, что и
   внешняя, поэтому контрол один: Week = Day, Double Calendar = Range. */
const TYPE_LABELS: Record<NonNullable<CalendarProps["mode"]>, string> = {
  single: "Week",
  month: "Month",
  year: "Year",
  range: "Double Calendar",
}

type PlaygroundArgs = CalendarProps

const meta = {
  title: "Компоненты/Calendar",
  component: Calendar,
  parameters: { layout: "centered" },
  // `defaultMonth`, `value`, `rangeValue`, `monthValue` и `yearValue` все
  // построены на Date и принадлежат собственной локальной обёртке состояния
  // каждой стори — панель Controls ими править не должна. Это хуже, чем
  // просто недружелюбная заглушка JSON-редактора «Set object»: проверено
  // вживую, что установка значения роняет стори целиком (`TypeError:
  // initial.getFullYear is not a function`, поскольку JSON-редактор выдаёт
  // обычный объект, а не настоящий экземпляр Date). `control: false` убирает
  // грабли, а не наводит красоту на контрол, который и так не был
  // безопасен.
  argTypes: {
    layout: optionsArgType(
      "Size",
      { popover: "Desktop", sheet: "Mobile" },
      "inline-radio"
    ),
    mode: optionsArgType("Type", TYPE_LABELS),
    footer: toggleArgType("Show Buttons"),
    showSecondaryButton: toggleArgType(
      "Show Secondary Button",
      "Кнопка «Сбросить» в подвале"
    ),
    title: { control: "text", table: { category: "Контент" } },
    // Это предикат, а не значение: никакой JSON-контрол его не выразит,
    // поэтому понятный выбор отображается в настоящую функцию (тот же
    // приём, что и с `icon` у Button).
    disabledDate: {
      control: { type: "select", labels: { none: "Нет", weekends: "Выходные" } },
      options: ["none", "weekends"],
      mapping: {
        none: undefined,
        weekends: (date: Date) => date.getDay() === 0 || date.getDay() === 6,
      },
    },
    defaultMonth: { control: false },
    value: { control: false },
    rangeValue: { control: false },
    monthValue: { control: false },
    yearValue: { control: false },
  },
  args: {
    layout: "popover",
    mode: "single",
    footer: true,
    showSecondaryButton: true,
    title: "Выберите дату",
  },
  // Скоуп идёт за `layout`: у листа мобильные размеры шрифтов, у карточки —
  // десктопные. В матрицах форму задаёт сама матрица (`responsive`), поэтому
  // там args.layout не выставлен и скоуп остаётся в «auto».
  decorators: [
    (Story, context) => {
      const layout = (context.args as { layout?: CalendarProps["layout"] }).layout
      return (
        <ViewportScope
          viewport={
            layout === "sheet" ? "mobile" : layout === "popover" ? "desktop" : "auto"
          }
        >
          <Story />
        </ViewportScope>
      )
    },
  ],
} satisfies Meta<PlaygroundArgs>

export default meta
type Story = StoryObj<PlaygroundArgs>

// `value` и `onChange` зафиксированы собственным локальным состоянием
// этого демо (голый `Date | null`, несовместимый с формами значений у
// range, month и year), а все остальные контролы (раскладка, заголовок,
// подвал и прочие) по-прежнему пробрасываются, так что панель Controls не
// декоративная (та же схема, что у обёртки `Controlled` у Checkbox).
function SingleDateCalendar(
  props: Omit<CalendarProps, "value" | "onChange">
) {
  const [value, setValue] = useState<Date | null>(new Date(2024, 0, 15))
  return <Calendar value={value} onChange={setValue} {...props} />
}

function RangeCalendar(
  props: Omit<CalendarProps, "rangeValue" | "onRangeChange">
) {
  const [range, setRange] = useState<[Date | null, Date | null]>([
    new Date(2024, 0, 10),
    new Date(2024, 0, 20),
  ])
  return (
    <Calendar mode="range" rangeValue={range} onRangeChange={setRange} {...props} />
  )
}

export const Playground: Story = {
  render: (args) =>
    args.mode === "range" ? (
      <RangeCalendar {...args} />
    ) : (
      <SingleDateCalendar {...args} />
    ),
}

/* Собственные оси макета — Mode (Single / Range / Month / Year) × Layout
   (поповер на десктопе, нижняя шторка на мобильном). */
export const Matrix: Story = {
  name: "Matrix (все состояния)",
  parameters: { layout: "fullscreen", controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-2">
      <StatesMatrix<CalendarProps>
        responsive
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
          { label: "Popover (Desktop)", props: { layout: "popover" } },
          { label: "Без подвала", props: { layout: "popover", footer: false } },
          {
            // Выходные показывают работу `disabledDate`: вся сетка
            // продолжает работать, инертными становятся только эти ячейки.
            label: "Недоступные дни\n(выходные)",
            props: {
              layout: "popover",
              disabledDate: (date: Date) => date.getDay() === 0 || date.getDay() === 6,
            },
          },
        ]}
        render={(props) =>
          props.mode === "range" ? (
            <RangeCalendar {...props} />
          ) : (
            <SingleDateCalendar {...props} />
          )
        }
      />
      <StatesMatrix<CalendarProps>
        baseProps={{ layout: "sheet" }}
        columnGroups={[
          {
            label: "Sheet (Mobile)",
            columns: [
              { label: "Single", props: { mode: "single", title: "Выберите дату" } },
              { label: "Range", props: { mode: "range", title: "Выберите даты" } },
              { label: "Month", props: { mode: "month", title: "Выберите месяц" } },
              { label: "Year", props: { mode: "year", title: "Выберите год" } },
            ],
          },
        ]}
        rows={[{ label: "Default", props: {} }]}
        render={(props) =>
          props.mode === "range" ? (
            <RangeCalendar {...props} />
          ) : (
            <SingleDateCalendar {...props} />
          )
        }
      />
    </div>
  ),
}
