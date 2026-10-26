import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"

import {
  StorySection,
  StoryShowcase,
  optionsArgType,
  toggleArgType,
} from "@/stories/matrix"

import { Button } from "@/components/ui/button"

import {
  SelectionButton,
  SelectionButtonChevron,
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
  { id: "edit", text: "Редактировать" },
  { id: "copy", text: "Дублировать", description: "Создать копию" },
  { id: "delete", text: "Удалить" },
  { id: "archive", text: "Архивировать" },
  // Длинный пункт — проверка переноса (Правки UI-Kit от 25.10): текст
  // строки списка переносится, многоточия нет.
  {
    id: "long",
    text: "40801 810 7 0024 0011708 · Спецсчёт закупок для расчётов с поставщиками",
  },
]

/* Режимы переключателя — пример меню с отметкой выбранного. */
const MODES = [
  { id: "list", text: "Списком" },
  { id: "cards", text: "Карточками" },
  { id: "table", text: "Таблицей", description: "Все колонки" },
]

/* Дизайн-чек №17: количество пунктов меню — списком, а не правкой JSON. */
const ITEM_COUNTS = [1, 2, 3, 4, 5] as const
type ItemCount = (typeof ITEM_COUNTS)[number]

type PlaygroundArgs = SelectionButtonProps & {
  itemsCount?: ItemCount
  /** Отметка выбранного (`value`): выбор пункта переставляет галку. */
  showCheck?: boolean
}

/** Меню с отметкой: `value` живёт в состоянии и меняется выбором пункта. */
function CheckedSelectionButton({
  items,
  initial,
  ...props
}: Omit<SelectionButtonProps, "value"> & { initial: string | null }) {
  const [value, setValue] = React.useState<string | null>(initial)
  return (
    <SelectionButton
      {...props}
      value={value}
      items={items.map((item) => ({
        ...item,
        onSelect: () => setValue(String(item.id)),
      }))}
    />
  )
}

/* Панель повторяет «Свойства компонента» `ELK / selection button`:
   Size / Show Dropdown / Direction — те же имена и подписи, что в правой
   панели Figma. */
const meta = {
  title: "Компоненты/Selection Button",
  component: SelectionButton,
  parameters: { layout: "centered" },
  argTypes: {
    size: optionsArgType("Size", { lg: "L", sm: "S" }, "inline-radio"),
    showDropdown: toggleArgType("Show Dropdown"),
    direction: optionsArgType<SelectionButtonDirection>("Direction", {
      "top-left": "Top Left",
      "top-right": "Top Right",
      "down-left": "Down Left",
      "down-right": "Down Right",
    }),
    // Ниже — то, чего в панели Figma нет: пункты меню там нарисованы
    // вложенными инстансами `Menu Point (ELK)`, а не свойствами сета.
    triggerLabel: { control: "text", table: { category: "Контент" } },
    // Правки UI-Kit от 25.10: в мобильном виде список — штора; пусто —
    // подпись триггера.
    sheetTitle: {
      name: "Заголовок шторы (мобайл)",
      control: "text",
      table: { category: "Контент" },
    },
    modal: { control: "boolean", table: { category: "Контент" } },
    showCheck: {
      name: "Отметка выбранного (value)",
      control: "boolean",
      table: { category: "Контент" },
    },
    value: { table: { disable: true } },
    itemsCount: {
      name: "Количество пунктов",
      control: "select",
      options: ITEM_COUNTS,
      table: { category: "Контент" },
    },
    items: { table: { disable: true } },
    // `trigger` принимает экземпляр JSX-элемента: понятный выбор «Default
    // (⋯)» и «Custom Button» отображается в настоящий элемент или
    // `undefined`, а не выключает контрол (тот же приём, что и с `icon` у
    // Button).
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
  /* Порядок ключей здесь задаёт порядок строк в панели Storybook (argTypes
     на него не влияет), поэтому он повторяет порядок таблицы свойств. */
  args: {
    size: "lg",
    showDropdown: true,
    direction: "down-right",
    items: ITEMS,
    itemsCount: 3,
    showCheck: false,
    sheetTitle: "",
  },
} satisfies Meta<PlaygroundArgs>

export default meta
type Story = StoryObj<PlaygroundArgs>

export const Playground: Story = {
  render: ({ itemsCount = 3, showCheck, sheetTitle, ...rest }) => {
    const args = { ...rest, sheetTitle: sheetTitle || undefined }
    return showCheck ? (
      <CheckedSelectionButton
        {...args}
        items={ITEMS.slice(0, itemsCount)}
        initial={ITEMS[0].id}
      />
    ) : (
      <SelectionButton {...args} items={ITEMS.slice(0, itemsCount)} />
    )
  },
}

/* Меню — это всплывающее окно в портале, поэтому в настоящей сетке каждая
   открытая ячейка накрывала бы следующую: варианты вместо этого разложены
   отдельными открытыми меню с запасом места вокруг каждого. */
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
              <span className="text-p4-medium text-[#6D6D6D]">{direction}</span>
            </div>
          ))}
        </div>
      </StorySection>

      <StorySection
        title="Свой триггер"
        description="Любой элемент вместо кнопки «⋯». Шеврон SelectionButtonChevron при открытии поворачивается на 180°."
      >
        <div className="flex gap-16">
          <SelectionButton
            items={ITEMS}
            trigger={<button type="button">Открыть меню</button>}
          />
          <SelectionButton
            items={MODES}
            trigger={
              <Button
                variant="secondary-grey"
                icon={SelectionButtonChevron}
                iconPosition="right"
              >
                Вид
              </Button>
            }
          />
        </div>
      </StorySection>

      <StorySection
        title="Отметка выбранного"
        description="С value — голубая галка у выбранного пункта и место 48 справа у всех; без value — меню действий без галок."
      >
        <div className="flex gap-16">
          <CheckedSelectionButton
            items={MODES}
            initial="list"
            trigger={
              <Button
                variant="secondary-grey"
                icon={SelectionButtonChevron}
                iconPosition="right"
              >
                Режим
              </Button>
            }
          />
          <CheckedSelectionButton items={MODES} initial={null} />
        </div>
      </StorySection>
    </StoryShowcase>
  ),
}
