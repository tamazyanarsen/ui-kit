import type { Meta, StoryObj } from "@storybook/react-vite"

import { StatesMatrix, viewportArgType } from "@/stories/matrix"
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

const COLORS: TagColor[] = [
  "green",
  "orange",
  "red",
  "blue",
  "grey",
  "grey-info",
  "white",
  "black",
]

type PlaygroundArgs = TagProps & { viewport?: Viewport }

const meta = {
  title: "Компоненты/Tag",
  component: Tag,
  parameters: { layout: "centered" },
  argTypes: {
    children: { control: "text" },
    color: { control: "select", options: COLORS },
    // Пара `color` + `variant` — это свойство Style мастера: пять статусных
    // цветов в сплошном и контурном («Text») исполнении плюс три «признака»
    // (Grey Info / White / Black), у которых контурного варианта нет.
    variant: { control: "inline-radio", options: ["main", "secondary"] },
    // Show Icon в Figma — булев переключатель с фиксированной галочкой
    // `icon / mark`. Здесь это выбор глифа: дизайн-чек №2 требовал, чтобы
    // «В обработке» и «Отклонён» не получали ту же галочку, что «Исполнено».
    icon: {
      control: "select",
      options: ["без иконки", ...ICON_NAMES],
      mapping: { "без иконки": undefined },
      description: "Ведущая иконка из набора кита (свойство Show Icon)",
    },
    // Size=Desktop/Mobile — контрол, а не ширина окна (дизайн-чек №3 №19).
    viewport: viewportArgType,
  },
  args: {
    children: "Example Text",
    color: "green",
    variant: "main",
    icon: "check",
    viewport: "auto" as Viewport,
  },
} satisfies Meta<PlaygroundArgs>

export default meta
type Story = StoryObj<PlaygroundArgs>

export const Playground: Story = {
  render: ({ viewport, ...args }) => (
    <ViewportScope viewport={viewport}>
      <Tag {...args} />
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
