import type { Meta, StoryObj } from "@storybook/react-vite"

import {
  StorySection,
  StoryShowcase,
  optionsArgType,
  toggleArgType,
} from "@/stories/matrix"
import { ViewportScope } from "@/lib/viewport"

import { Hint, type HintProps } from "./hint"
import type { TooltipDirection } from "./variants"
import { Button } from "@/components/ui/button"

const DIRECTIONS: TooltipDirection[] = [
  "top-left",
  "top-center",
  "top-right",
  "down-left",
  "down-center",
  "down-right",
  "left",
  "right",
]

/* Панель «Свойства компонента» компонент-сета `ELK / tooltip & hint`
   (таблица 11756:9183 на канвасе Tooltip & Hint 675:9540):

     Direction   Left, Right, Top Center, Top Left, Top Right,
                 Down Center, Down Left, Down Right, Mobile
     Show Cross  True, False
     Show Title  True, False

   Дизайн-чек «Сторибук Ч.2» от 10.09.2026, замечание 7.

   ⚠️ `Mobile` — значение той же оси Direction, а не отдельный контрол формы:
   ниже 768 подсказка разворачивается в Bottom Sheet (символ 11756:8112), и
   направления у неё уже нет. Поэтому прежний контрол `viewport` из панели
   убран, а мобильную форму включает сам список. */
const DIRECTION_LABELS = {
  left: "Left",
  right: "Right",
  "top-center": "Top Center",
  "top-left": "Top Left",
  "top-right": "Top Right",
  "down-center": "Down Center",
  "down-left": "Down Left",
  "down-right": "Down Right",
  mobile: "Mobile",
} as const

type DirectionArg = keyof typeof DIRECTION_LABELS

/* Ось Direction шире пропа `direction` на значение `Mobile`, поэтому в
   аргументах истории она отдельным ключом, а сам проп из панели убран. */
type PlaygroundArgs = HintProps & {
  figmaDirection?: DirectionArg
  showTitle?: boolean
}

const CONTENT = { table: { category: "Контент" } }
/** Пропы кита сверх таблицы свойств Figma — чтобы они не мешались наверху. */
const EXTRA = { table: { category: "Дополнительно" } }

const meta = {
  title: "Компоненты/Hint",
  component: Hint,
  parameters: { layout: "centered" },
  argTypes: {
    figmaDirection: optionsArgType("Direction", DIRECTION_LABELS),
    direction: { table: { disable: true } },
    showCross: toggleArgType("Show Cross"),
    showTitle: toggleArgType("Show Title"),
    title: {
      control: "text",
      if: { arg: "showTitle", truthy: true },
      ...CONTENT,
    },
    content: { control: "text", ...CONTENT },
    // Дизайн-чек от 07.09, замечание 18: «Тултипам нужно 2 режима ширины.
    // Базовый 256px, альтернативный — динамический». В таблице свойств
    // макета этого нет, поэтому проп живёт отдельной категорией.
    width: {
      name: "Width",
      control: "inline-radio",
      options: ["base", "auto"],
      description: "base — 256px, auto — по содержимому",
      ...EXTRA,
    },
    defaultOpen: { name: "Раскрыта", control: "boolean", ...EXTRA },
    // Управляемый двойник `defaultOpen` — в панели он не нужен.
    open: { table: { disable: true } },
    // `children` — это React-узел (кнопка-триггер), контролом его не набрать;
    // выбор из двух готовых кнопок, как у `icon` у Button.
    children: {
      name: "Триггер",
      control: {
        type: "select",
        labels: { grey: "Button (Grey)", primary: "Button (Primary)" },
      },
      options: ["grey", "primary"],
      mapping: {
        grey: <Button variant="secondary-grey">Открыть подсказку</Button>,
        primary: <Button variant="primary">Открыть подсказку</Button>,
      },
      ...EXTRA,
    },
  },
  args: {
    figmaDirection: "top-center" as DirectionArg,
    showCross: true,
    showTitle: false,
    title: "Заголовок подсказки",
    content:
      "Развёрнутый текст подсказки, который поясняет назначение элемента.",
    width: "base",
    children: <Button variant="secondary-grey">Открыть подсказку</Button>,
  },
} satisfies Meta<PlaygroundArgs>

export default meta
type Story = StoryObj<PlaygroundArgs>

export const Playground: Story = {
  render: ({ figmaDirection, showTitle, title, ...args }) => {
    const mobile = figmaDirection === "mobile"
    return (
      <ViewportScope viewport={mobile ? "mobile" : "desktop"}>
        <Hint
          {...args}
          // У мобильной формы направления нет — это Bottom Sheet.
          direction={
            mobile ? "top-center" : (figmaDirection as TooltipDirection)
          }
          title={showTitle ? title : undefined}
        />
      </ViewportScope>
    )
  },
}

/* Hint is a click-opened, portalled popup, so its variants are laid out as
   live triggers rather than a grid of static cells. Мобильную форму (Bottom
   Sheet с кнопкой «Понятно») показывает значение `Mobile` оси Direction в
   Playground. */
export const Examples: Story = {
  name: "Варианты использования",
  parameters: { layout: "fullscreen", controls: { disable: true } },
  render: () => (
    <StoryShowcase>
      <StorySection
        title="8 направлений"
        description="Нажмите на кнопку, чтобы раскрыть подсказку."
      >
        <div className="grid grid-cols-4 gap-x-16 gap-y-24 py-16">
          {DIRECTIONS.map((direction) => (
            <Hint key={direction} content={direction} direction={direction}>
              <Button variant="secondary-grey">{direction}</Button>
            </Hint>
          ))}
        </div>
      </StorySection>

      <StorySection title="Состав подсказки">
        <div className="flex gap-8">
          <Hint content="Текст подсказки без заголовка.">
            <Button variant="secondary-grey">Без заголовка</Button>
          </Hint>
          <Hint title="Заголовок подсказки" content="Текст подсказки.">
            <Button variant="secondary-grey">С заголовком</Button>
          </Hint>
          <Hint content="Текст подсказки." showCross={false}>
            <Button variant="secondary-grey">Без крестика</Button>
          </Hint>
        </div>
      </StorySection>
    </StoryShowcase>
  ),
}
