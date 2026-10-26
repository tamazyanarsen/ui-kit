import type { Meta, StoryObj } from "@storybook/react-vite"

import { StorySection, StoryShowcase, toggleArgType } from "@/stories/matrix"
import { ViewportScope } from "@/lib/viewport"
import { Button } from "@/components/ui/button"
import { ButtonMenuOverflow, ButtonMenuOverflowItem } from "@/components/ui/button-menu"
import { SelectionButton } from "@/components/ui/selection-button"

import { MenuSheet, MenuSheetItem, type MenuSheetProps } from "./menu-sheet"

/* MenuSheet — мобильная форма выпадающего списка (Правки UI-Kit от 25.10):
   штора Modal со строками во всю ширину. Сама по себе на экранах почти не
   нужна — её рисуют SelectionButton, «…» ButtonMenuOverflow и Select в
   мобильном виде (уже 1280). */

const ITEMS = [
  { id: "list", text: "Списком" },
  { id: "cards", text: "Карточками" },
  { id: "table", text: "Таблицей", description: "Все колонки" },
]

type PlaygroundArgs = Omit<MenuSheetProps, "children" | "title"> & {
  title: string
  showCheck: boolean
}

const meta = {
  title: "Компоненты/Menu Sheet",
  component: MenuSheet,
  parameters: { layout: "centered" },
  argTypes: {
    title: { name: "Заголовок", control: "text", table: { category: "Контент" } },
    showCheck: toggleArgType("Галка у выбранного", "Одиночный выбор: у второй строки галка"),
    role: { control: "inline-radio", options: ["menu", "listbox"] },
    // Триггер — элемент; в Playground это кнопка «Открыть штору».
    trigger: { table: { disable: true } },
    open: { table: { disable: true } },
    defaultOpen: { table: { disable: true } },
    onOpenChange: { table: { disable: true } },
  },
  args: {
    title: "Вид списка",
    showCheck: true,
    role: "menu",
  },
} satisfies Meta<PlaygroundArgs>

export default meta
type Story = StoryObj<PlaygroundArgs>

export const Playground: Story = {
  render: ({ showCheck, ...args }) => (
    <ViewportScope viewport="mobile">
      <MenuSheet {...args} trigger={<Button variant="secondary-grey">Открыть штору</Button>}>
        {ITEMS.map((item, index) => (
          <MenuSheetItem
            key={item.id}
            text={item.text}
            description={item.description}
            checked={showCheck ? index === 1 : undefined}
          />
        ))}
      </MenuSheet>
    </ViewportScope>
  ),
}

export const Examples: Story = {
  name: "Варианты использования",
  parameters: { layout: "fullscreen", controls: { disable: true } },
  render: () => (
    <StoryShowcase>
      <StorySection
        title="Компоненты кита в мобильном виде"
        description="SelectionButton (с отметкой выбранного) и «…» ButtonMenuOverflow открывают штору, а не поповер."
      >
        <ViewportScope viewport="mobile">
          <div className="flex gap-6">
            <SelectionButton items={ITEMS} value="cards" sheetTitle="Вид списка" />
            <ButtonMenuOverflow>
              <ButtonMenuOverflowItem text="Дублировать" description="Создать копию" />
              <ButtonMenuOverflowItem text="Удалить" />
            </ButtonMenuOverflow>
          </div>
        </ViewportScope>
      </StorySection>
    </StoryShowcase>
  ),
}
