import type { Meta, StoryObj } from "@storybook/react-vite"

import { StorySection, StoryShowcase } from "@/stories/matrix"

import {
  SelectionButton,
  type SelectionButtonDirection,
  type SelectionButtonProps,
} from "./selection-button"

const DIRECTIONS: SelectionButtonDirection[] = [
  "top-left",
  "top-right",
  "down-left",
  "down-right",
]

const ITEMS = [
  { text: "Редактировать" },
  { text: "Дублировать", description: "Создать копию" },
  { text: "Удалить" },
  { text: "Архивировать" },
]

/* Дизайн-чек №17: количество пунктов меню — списком, а не правкой JSON. */
const ITEM_COUNTS = [1, 2, 3, 4] as const
type ItemCount = (typeof ITEM_COUNTS)[number]

type PlaygroundArgs = SelectionButtonProps & { itemsCount?: ItemCount }

const meta = {
  title: "Компоненты/Selection Button",
  component: SelectionButton,
  parameters: { layout: "centered" },
  argTypes: {
    size: { control: "inline-radio", options: ["lg", "sm"] },
    direction: { control: "select", options: DIRECTIONS },
    showDropdown: { control: "boolean" },
    triggerLabel: { control: "text" },
    modal: { control: "boolean" },
    itemsCount: {
      name: "Количество пунктов",
      control: "select",
      options: ITEM_COUNTS,
    },
    items: { table: { disable: true } },
    // `trigger` takes a JSX element instance — map a friendly "Default
    // (⋯)"/"Custom Button" choice to the real element/`undefined` instead of
    // disabling the control (same technique as Button's `icon`).
    trigger: {
      control: {
        type: "select",
        labels: { default: "Default (⋯)", custom: "Custom Button" },
      },
      options: ["default", "custom"],
      mapping: {
        default: undefined,
        custom: <button type="button">Открыть меню</button>,
      },
    },
  },
  args: { items: ITEMS, itemsCount: 3, size: "lg" },
} satisfies Meta<PlaygroundArgs>

export default meta
type Story = StoryObj<PlaygroundArgs>

export const Playground: Story = {
  render: ({ itemsCount = 3, ...args }) => (
    <SelectionButton {...args} items={ITEMS.slice(0, itemsCount)} />
  ),
}

/* The menu is a portalled popup, so a real grid would have every open cell
   overlaying the next — the variants are laid out as separate open menus
   with room around each instead. */
export const Examples: Story = {
  name: "Варианты использования",
  parameters: { layout: "fullscreen", controls: { disable: true } },
  render: () => (
    <StoryShowcase>
      <StorySection title="Размеры" description="L (по умолчанию) и S.">
        <div className="flex gap-16">
          <SelectionButton items={ITEMS} size="lg" />
          <SelectionButton items={ITEMS} size="sm" />
        </div>
      </StorySection>

      <StorySection
        title="Направление раскрытия"
        description="8 вариантов положения меню относительно триггера."
      >
        <div className="grid grid-cols-4 gap-x-24 gap-y-32 py-24">
          {DIRECTIONS.map((direction) => (
            <div key={direction} className="flex flex-col items-center gap-2">
              <SelectionButton items={ITEMS} direction={direction} />
              <span className="text-p4-regular text-[#6D6D6D]">{direction}</span>
            </div>
          ))}
        </div>
      </StorySection>

      <StorySection
        title="Свой триггер"
        description="Любой элемент вместо кнопки «⋯»."
      >
        <SelectionButton
          items={ITEMS}
          trigger={<button type="button">Открыть меню</button>}
        />
      </StorySection>
    </StoryShowcase>
  ),
}
