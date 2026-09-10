import type { Meta, StoryObj } from "@storybook/react-vite"

import {
  StatesMatrix,
  optionsArgType,
  sizeArgType,
  toggleArgType,
} from "@/stories/matrix"
import { ViewportScope, type Viewport } from "@/lib/viewport"

import { Informer, type InformerProps } from "./informer"
import type { InformerIcon, InformerSolid } from "./variants"

/* Панель «Свойства компонента» компонент-сета `ELK / informer`
   (таблица 70240:35839 на канвасе Message 666:20):

     Size              Desktop, Mobile
     Add               None, One Button (Main), One Button (Additional),
                       Two Buttons
     Solid             White, Grey
     Show Date         True, False
     Show Description  True, False
     Show Cross        True, False
     Type Icon         Attention (Red), Attention (Yellow), Check (Green),
                       Information (Grey), Clock (Yellow)

   Дизайн-чек «Сторибук Ч.2» от 10.09.2026:

   • замечание 9 — «Нужно убрать контрол с выбором произвольной иконки».
     Контролы `Произвольная иконка` и `Цвет произвольной иконки` из панели
     убраны: в макете иконка — закрытый список из пяти значений. Сам проп
     `customIcon` у компонента ОСТАВЛЕН: его добавили по замечанию 12
     дизайн-чека от 08.09 («сделать возможность ставить любую иконку из
     кита»), и продуктовый код на него уже может опираться — из витрины ушёл
     только способ им играть;
   • замечание 10 — не хватало `Show Date` и `Show Description`.

   `Add` вместо двух прежних переключателей кнопок: это одно свойство макета,
   и все четыре его значения — комбинации тех же двух кнопок. Замечание 27
   прошлого чека («кнопки включаются переключателем, а не тем, что у них
   стёрли подпись») этим тоже закрыто. */
const ICON_LABELS: Record<InformerIcon, string> = {
  "attention-red": "Attention (Red)",
  "attention-yellow": "Attention (Yellow)",
  check: "Check (Green)",
  information: "Information (Grey)",
  clock: "Clock (Yellow)",
}

const ICONS = Object.keys(ICON_LABELS) as InformerIcon[]

const SOLID_LABELS: Record<InformerSolid, string> = {
  white: "White",
  grey: "Grey",
}

const ADD_LABELS = {
  none: "None",
  main: "One Button (Main)",
  additional: "One Button (Additional)",
  both: "Two Buttons",
} as const

type Add = keyof typeof ADD_LABELS

type PlaygroundArgs = InformerProps & {
  viewport?: Viewport
  add?: Add
  showDate?: boolean
  showDescription?: boolean
}

const CONTENT = { table: { category: "Контент" } }

const meta = {
  title: "Компоненты/Informer",
  component: Informer,
  parameters: { layout: "padded" },
  argTypes: {
    viewport: sizeArgType,
    add: optionsArgType("Add", ADD_LABELS),
    solid: optionsArgType("Solid", SOLID_LABELS),
    showDate: toggleArgType("Show Date"),
    showDescription: toggleArgType("Show Description"),
    showCross: toggleArgType("Show Cross"),
    icon: optionsArgType("Type Icon", ICON_LABELS),
    title: { control: "text", ...CONTENT },
    date: {
      control: "text",
      if: { arg: "showDate", truthy: true },
      ...CONTENT,
    },
    description: {
      control: "text",
      if: { arg: "showDescription", truthy: true },
      ...CONTENT,
    },
    mainButtonLabel: { control: "text", ...CONTENT },
    additionalButtonLabel: { control: "text", ...CONTENT },
    // Замечание 9: произвольная иконка остаётся пропом, но не контролом.
    customIcon: { table: { disable: true } },
    customIconColor: { table: { disable: true } },
  },
  args: {
    viewport: "desktop" as Viewport,
    add: "both" as Add,
    solid: "white" as InformerSolid,
    showDate: true,
    showDescription: true,
    showCross: true,
    icon: "attention-red" as InformerIcon,
    title: "Требуется подпись",
    date: "24.12.2022",
    description: "Документ ожидает вашей подписи для продолжения работы",
    mainButtonLabel: "Подписать",
    additionalButtonLabel: "Отложить",
  },
} satisfies Meta<PlaygroundArgs>

export default meta
type Story = StoryObj<PlaygroundArgs>

export const Playground: Story = {
  render: ({
    viewport,
    add = "both",
    showDate,
    showDescription,
    mainButtonLabel,
    additionalButtonLabel,
    ...args
  }) => (
    <ViewportScope viewport={viewport}>
      <Informer
        {...args}
        date={showDate ? args.date : undefined}
        description={showDescription ? args.description : undefined}
        mainButtonLabel={
          add === "main" || add === "both" ? mainButtonLabel : undefined
        }
        additionalButtonLabel={
          add === "additional" || add === "both"
            ? additionalButtonLabel
            : undefined
        }
      />
    </ViewportScope>
  ),
}

export const Matrix: Story = {
  name: "Matrix (все состояния)",
  parameters: { layout: "fullscreen", controls: { disable: true } },
  render: () => (
    <StatesMatrix<InformerProps>
      stretch
      responsive
      baseProps={{
        title: "Title",
        date: "24.12.2022",
        description: "Description",
      }}
      columnGroups={[
        {
          label: "Type Icon",
          columns: ICONS.map((icon) => ({
            label: ICON_LABELS[icon],
            props: { icon },
          })),
        },
      ]}
      rows={[
        { label: "Default", props: {} },
        { label: "Show Cross: False", props: { showCross: false } },
        {
          label: "Show Date / Description: False",
          props: { date: undefined, description: undefined },
        },
        {
          label: "Add: Two Buttons",
          props: {
            mainButtonLabel: "Подписать",
            additionalButtonLabel: "Отложить",
          },
        },
        { label: "Solid: Grey", props: { solid: "grey" } },
      ]}
      render={(props) => <Informer {...props} onClose={() => {}} />}
    />
  ),
}
