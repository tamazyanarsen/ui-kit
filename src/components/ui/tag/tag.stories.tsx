import type { Meta, StoryObj } from "@storybook/react-vite"

import { StatesMatrix, optionsArgType, sizeArgType } from "@/stories/matrix"
import { ViewportScope, type Viewport } from "@/lib/viewport"

import { ICON_NAMES } from "@/components/ui/icon"

import { Tag, type TagProps } from "./tag"
import type { TagColor, TagVariant } from "./variants"

/* Дизайн-чек №3 №1: «У тега много лишних вариантов и нет разбивки
   desktop/mobile. Нужно варианты унаследовать из фигмы, лишнее убрать».

   Компонент-сет `ELK / tag` (737:411) держит ровно два варьирующих
   свойства — Size (Desktop / Mobile) и Style (13 значений) — плюс булев
   Show Icon. Раньше матрица перемножала цвет × Main/Secondary × L/S ×
   «+ icon» и давала 48 клеток вместо 26, причём L/S были теми же
   Desktop/Mobile под другими именами.

   Здесь Style разложен ровно в порядке мастера, а Size даёт две матрицы
   рядом (`responsive`). */
const FIGMA_STYLES: {
  label: string
  color: TagColor
  variant?: TagVariant
}[] = [
  { label: "Green\n(Сompleted)", color: "green", variant: "main" },
  { label: "Green Text\n(Сompleted)", color: "green", variant: "secondary" },
  { label: "Orange\n(Process)", color: "orange", variant: "main" },
  { label: "Orange Text\n(Process)", color: "orange", variant: "secondary" },
  { label: "Red\n(Rejected)", color: "red", variant: "main" },
  { label: "Red Text\n(Rejected)", color: "red", variant: "secondary" },
  { label: "Blue\n(System)", color: "blue", variant: "main" },
  { label: "Blue Text\n(System)", color: "blue", variant: "secondary" },
  { label: "Grey\n(Draft)", color: "grey", variant: "main" },
  { label: "Grey Text\n(Draft)", color: "grey", variant: "secondary" },
  { label: "Grey\n(Info Sign)", color: "grey-info" },
  { label: "White\n(Sign)", color: "white" },
  { label: "Black\n(Sign)", color: "black" },
]

/* Значение свойства `Style` мастера → пара `color` + `variant` в коде.
   Ключи и подписи — как в именах вариантов компонент-сета 847:53629
   (включая фигмовскую «Сompleted» с кириллической С). */
const STYLE_PROPS = {
  "green-main": { color: "green", variant: "main" },
  "green-text": { color: "green", variant: "secondary" },
  "orange-main": { color: "orange", variant: "main" },
  "orange-text": { color: "orange", variant: "secondary" },
  "red-main": { color: "red", variant: "main" },
  "red-text": { color: "red", variant: "secondary" },
  "blue-main": { color: "blue", variant: "main" },
  "blue-text": { color: "blue", variant: "secondary" },
  "grey-main": { color: "grey", variant: "main" },
  "grey-text": { color: "grey", variant: "secondary" },
  "grey-info": { color: "grey-info", variant: "main" },
  white: { color: "white", variant: "main" },
  black: { color: "black", variant: "main" },
} satisfies Record<string, { color: TagColor; variant: TagVariant }>

type FigmaStyle = keyof typeof STYLE_PROPS

const STYLE_LABELS: Record<FigmaStyle, string> = {
  "green-main": "Green (Сompleted)",
  "green-text": "Green Text (Сompleted)",
  "orange-main": "Orange (Process)",
  "orange-text": "Orange Text (Process)",
  "red-main": "Red (Rejected)",
  "red-text": "Red Text (Rejected)",
  "blue-main": "Blue (System)",
  "blue-text": "Blue Text (System)",
  "grey-main": "Grey (Draft)",
  "grey-text": "Grey Text (Draft)",
  "grey-info": "Grey (Info Sign)",
  white: "White (Sign)",
  black: "Black (Sign)",
}

type PlaygroundArgs = Omit<TagProps, "color" | "variant"> & {
  viewport?: Viewport
  figmaStyle?: FigmaStyle
}

const meta = {
  title: "Компоненты/Tag",
  component: Tag,
  parameters: { layout: "centered" },
  /* Панель повторяет «Свойства компонента» `ELK / tag` (компонент-сет
     847:53629, таблица 5694:9311): Size / Style / Show Icon. Пара
     `color` + `variant` в коде — это одно свойство Style в Figma, поэтому
     контрол один, а раскладывает его `render`. */
  argTypes: {
    // Size=Desktop/Mobile — контрол, а не ширина окна (дизайн-чек №3 №19).
    viewport: sizeArgType,
    figmaStyle: optionsArgType<FigmaStyle>("Style", STYLE_LABELS),
    // Show Icon в Figma — булев переключатель с фиксированной галочкой
    // `icon / mark`. Здесь это выбор глифа: дизайн-чек №2 требовал, чтобы
    // «В обработке» и «Отклонён» не получали ту же галочку, что «Исполнено».
    icon: {
      name: "Show Icon",
      control: "select",
      options: ["без иконки", ...ICON_NAMES],
      mapping: { "без иконки": undefined },
      description: "Ведущая иконка из набора кита (свойство Show Icon)",
    },
    children: { control: "text", table: { category: "Контент" } },
  },
  /* Порядок ключей здесь задаёт порядок строк в панели Storybook (argTypes
     на него не влияет), поэтому он повторяет порядок таблицы свойств. */
  args: {
    viewport: "desktop" as Viewport,
    figmaStyle: "green-main" as FigmaStyle,
    icon: "check",
    children: "Example Text",
  },
} satisfies Meta<PlaygroundArgs>

export default meta
type Story = StoryObj<PlaygroundArgs>

export const Playground: Story = {
  render: ({ viewport, figmaStyle = "green-main", ...args }) => (
    <ViewportScope viewport={viewport}>
      <Tag {...args} {...STYLE_PROPS[figmaStyle]} />
    </ViewportScope>
  ),
}

export const Matrix: Story = {
  name: "Matrix (все состояния)",
  parameters: { layout: "fullscreen", controls: { disable: true } },
  render: () => (
    <StatesMatrix<TagProps>
      responsive
      baseProps={{ children: "Example Text" }}
      columnGroups={[
        {
          label: "Show Icon = False",
          columns: [{ label: "Tag", props: {} }],
        },
        {
          label: "Show Icon = True",
          columns: [{ label: "Tag", props: { icon: "check" } }],
        },
      ]}
      rows={FIGMA_STYLES.map(({ label, color, variant }) => ({
        label,
        props: { color, variant },
      }))}
      render={(props) => <Tag {...props} />}
    />
  ),
}
