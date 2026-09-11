import type { Meta, StoryObj } from "@storybook/react-vite"

import {
  StorySection,
  StoryShowcase,
  optionsArgType,
  toggleArgType,
} from "@/stories/matrix"

import { Tooltip, type TooltipProps } from "./tooltip"
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

type PlaygroundArgs = TooltipProps & { showTitle?: boolean }

const meta = {
  title: "Компоненты/Tooltip",
  component: Tooltip,
  parameters: { layout: "centered" },
  argTypes: {
    /* Свойство `Direction` компонент-сета `ELK / tooltip & hint`
       (687:25263) — подписи ровно как в правой панели Figma. Девятое
       значение сета, `Mobile`, — это боттом-шит: он живёт в истории Hint,
       потому что в коде это подменённая форма, а не направление. */
    direction: optionsArgType<TooltipDirection>("Direction", {
      left: "Left",
      right: "Right",
      "top-center": "Top Center",
      "top-left": "Top Left",
      "top-right": "Top Right",
      "down-center": "Down Center",
      "down-left": "Down Left",
      "down-right": "Down Right",
    }),
    // Дизайн-чек 3/3 №5: Show Title / Show Cross — свойства компонент-сета
    // `ELK / tooltip & hint` (11756:8037 / 11756:8039), поэтому они должны
    // переключаться из панели, а не быть зашиты.
    showTitle: toggleArgType("Show Title"),
    showCross: toggleArgType("Show Cross"),
    content: { control: "text", table: { category: "Контент" } },
    title: { control: "text", table: { category: "Контент" } },
    // Дизайн-чек от 07.09, замечание 18: «Тултипам нужно 2 режима ширины.
    // Базовый 256px, альтернативный — динамический».
    width: {
      name: "Width",
      control: "inline-radio",
      options: ["base", "auto"],
      description: "base — 256px, auto — по содержимому",
    },
    disabled: { control: "boolean" },
    // `children` is a React.ReactElement (the trigger) — no JSON value can
    // represent it; Storybook falls back to a raw editable tree of the
    // element's internals, which looks like a working control but isn't.
    // Map a friendly choice between two real trigger elements instead of
    // disabling the control (same technique as Button's `icon`).
    children: {
      control: {
        type: "select",
        labels: { grey: "Button (Grey)", primary: "Button (Primary)" },
      },
      options: ["grey", "primary"],
      mapping: {
        grey: <Button variant="secondary-grey">Наведите курсор</Button>,
        primary: <Button variant="primary">Наведите курсор</Button>,
      },
    },
  },
  /* Порядок ключей здесь задаёт порядок строк в панели Storybook (argTypes
     на него не влияет), поэтому он повторяет порядок таблицы свойств. */
  args: {
    direction: "top-center",
    showTitle: false,
    showCross: false,
    width: "base",
    disabled: false,
    title: "Title",
    content: "Подсказка с пояснением",
    children: <Button variant="secondary-grey">Наведите курсор</Button>,
  },
} satisfies Meta<PlaygroundArgs>

export default meta
type Story = StoryObj<PlaygroundArgs>

export const Playground: Story = {
  render: ({ showTitle, title, ...args }) => (
    <Tooltip {...args} title={showTitle ? title : undefined} />
  ),
}

/* Tooltips are portalled popups that only appear on hover, so a matrix would
   show empty cells — the directions are laid out as a spaced grid of live
   triggers instead. */
export const Examples: Story = {
  name: "Направления",
  parameters: { layout: "fullscreen", controls: { disable: true } },
  render: () => (
    <StoryShowcase>
      <StorySection
        title="8 направлений"
        description="Наведите курсор на кнопку, чтобы увидеть подсказку."
      >
        <div className="grid grid-cols-4 gap-x-16 gap-y-24 py-16">
          {DIRECTIONS.map((direction) => (
            <Tooltip key={direction} content={direction} direction={direction}>
              <Button variant="secondary-grey">{direction}</Button>
            </Tooltip>
          ))}
        </div>
      </StorySection>
      <StorySection
        title="Отключённая подсказка"
        description="`disabled` подавляет всплытие, триггер остаётся обычной кнопкой."
      >
        <Tooltip content="Не появится" disabled>
          <Button variant="secondary-grey">Без подсказки</Button>
        </Tooltip>
      </StorySection>
    </StoryShowcase>
  ),
}
