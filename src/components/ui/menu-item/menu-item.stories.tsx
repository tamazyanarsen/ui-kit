import type { Meta, StoryObj } from "@storybook/react-vite"

import { PseudoBox, StatesMatrix, iconArgType, stateArgType, type PlaygroundState } from "@/stories/matrix"
import { Check } from "@/icons"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Dropdown } from "@/components/ui/dropdown"
import { Thumbnail } from "@/components/ui/thumbnail"

import {
  MenuItemContent,
  menuItemRowClass,
  type MenuItemLevel,
} from "./menu-item"

/**
 * Menu Item — «Menu Point (ELK)», централизованная строка выпадающего
 * списка (дизайн-чек №21). Истории у неё не было, хотя в Figma это
 * отдельный компонент-сет со своей матрицей.
 *
 * Свойства сета и что им соответствует здесь:
 *
 *   Size   Desktop | Mobile   — медиазапрос, отдельного пропа нет
 *   State  Default | Hover | Disabled — hover эмулируется контролом
 *          `state`, disabled задаёт контейнер строки
 *   Style  Text | Extended | Title | Thumbnail | Product Put In/Out
 *          — набор слотов: `children`, `description`, `label`, `leading`
 *
 * `Product / Put In` и `Product / Put Out` в контролах не выведены: это
 * продуктовые строки со своей вёрсткой, которой у компонента пока нет —
 * глухой пункт списка вводил бы в заблуждение.
 *
 * Сам контейнер строки — не компонент, а классы (`menuItemRowClass`):
 * контейнером выступает `Combobox.Item`, `Menu.Item` или обычная кнопка, у
 * каждого свои обработчики. Поэтому в историях строка обёрнута в `div` с
 * этими классами, как это делают настоящие потребители.
 */

const STYLES = ["Text", "Extended", "Title", "Thumbnail"] as const
type MenuItemStyle = (typeof STYLES)[number]

/** Свойство `Type` сета — Level 1…4. */
const LEVELS: MenuItemLevel[] = [1, 2, 3, 4]

interface PlaygroundArgs {
  figmaStyle: MenuItemStyle
  level: MenuItemLevel
  text: string
  description: string
  label: string
  leading: React.ReactNode
  showCheck: boolean
  disabled: boolean
  state?: PlaygroundState
}

function Row({
  figmaStyle,
  level = 1,
  text,
  description,
  label,
  leading,
  showCheck,
  disabled,
}: Omit<PlaygroundArgs, "state">) {
  return (
    <div
      data-disabled={disabled || undefined}
      className={menuItemRowClass(
        "hover:bg-[var(--menu-item-bg-highlighted)]",
        "data-disabled:pointer-events-none data-disabled:opacity-40",
        level
      )}
    >
      <MenuItemContent
        leading={
          figmaStyle === "Thumbnail" ? (
            <Thumbnail type="card" size="m" last4="4482" />
          ) : (
            leading
          )
        }
        label={figmaStyle === "Title" ? label : undefined}
        description={figmaStyle === "Extended" ? description : undefined}
        trailing={
          showCheck ? (
            <Check aria-hidden="true" className="size-6 shrink-0 text-[var(--header-check-fg)]" />
          ) : undefined
        }
      >
        {text}
      </MenuItemContent>
    </div>
  )
}

const meta = {
  // Дизайн-чек Storybook 2 (от Notification до Loader) №8: «замени название
  // компонента на "Menu point"» — так называется компонент-сет в Figma.
  title: "Компоненты/Menu Point",
  parameters: { layout: "padded" },
  argTypes: {
    figmaStyle: {
      name: "Style",
      control: "inline-radio",
      options: STYLES,
      description: "Свойство Style компонент-сета Menu Point (ELK)",
    },
    level: {
      name: "Type",
      control: "inline-radio",
      options: [1, 2, 3, 4],
      description:
        "Свойство Type компонент-сета — уровень вложенности. Отличается левым полем: 16 px на уровень",
    },
    text: { control: "text", description: "Основной текст, P1 Medium" },
    description: { control: "text", description: "Строка под основным текстом (Style=Extended)" },
    label: { control: "text", description: "Подпись НАД основным текстом (Style=Title)" },
    leading: iconArgType("Ведущий элемент: иконка. Чекбокс и миниатюра — в примерах"),
    showCheck: { control: "boolean", name: "Галочка выбора" },
    disabled: { control: "boolean", name: "State: Disabled" },
    state: stateArgType,
  },
  args: {
    figmaStyle: "Extended",
    level: 1,
    text: "Название пункта",
    description: "Пояснение под названием",
    label: "Подпись сверху",
    showCheck: false,
    disabled: false,
    state: "default" as PlaygroundState,
  },
} satisfies Meta<PlaygroundArgs>

export default meta
type Story = StoryObj<PlaygroundArgs>

export const Playground: Story = {
  render: ({ state, ...args }) => (
    // Строка живёт внутри выпадающего списка и на его фоне — на голом
    // холсте её края и подсветка не читаются.
    <Dropdown className="w-96 overflow-hidden">
      <PseudoBox state={state} className="w-full">
        <Row {...args} />
      </PseudoBox>
    </Dropdown>
  ),
}

export const Examples: Story = {
  name: "Варианты использования",
  parameters: { layout: "fullscreen", controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-8 p-8">
      {/* Дизайн-чек Storybook 2 (от Notification до Loader) №4: «скорректируй
          вид в сетку, опираясь на структуру компонента по ссылке». В макете
          (`Menu Point (ELK)`, 5877:18233) сет разложен именно сеткой: по
          горизонтали — Style, по вертикали — Type (Level 1…4) × State. Здесь
          та же сетка. */}
      <StatesMatrix<PlaygroundArgs>
        stretch
        cellClassName="min-w-[280px]"
        rowHeader="Ось Style — набор слотов строки; ось Type (Level 1…4) — левое поле, по 16 px на уровень; State — Default / Hover / Disabled."
        columns={STYLES.map((figmaStyle) => ({
          label: figmaStyle,
          props: { figmaStyle },
        }))}
        rows={LEVELS.flatMap((level) => [
          { label: `Level ${level} · Default`, props: { level } },
          { label: `Level ${level} · Hover`, props: { level }, pseudo: "hover" as const },
          { label: `Level ${level} · Disabled`, props: { level, disabled: true } },
        ])}
        baseProps={{
          figmaStyle: "Extended",
          level: 1,
          text: "Text",
          description: "Description",
          label: "Label",
          leading: undefined,
          showCheck: false,
          disabled: false,
        }}
        render={(props) => (
          <Dropdown className="w-full overflow-hidden">
            <Row {...(props as Omit<PlaygroundArgs, "state">)} />
          </Dropdown>
        )}
      />

      <div className="flex flex-col gap-2">
        <p className="text-p2-medium text-[var(--btn-primary-fg)]">
          Ведущий и замыкающий элементы: чекбокс, иконка, миниатюра, счётчик
        </p>
        <p className="text-p3-regular text-[var(--accordion-card-subtitle-fg)]">
          Дизайн-чек №21: ведущий элемент 24px совпадает по высоте с первой
          строкой текста (16/24), поэтому при `items-start` он выравнивается
          сам, без подкручивания отступами.
        </p>
        <Dropdown className="w-96 overflow-hidden">
          <div className={menuItemRowClass("hover:bg-[var(--menu-item-bg-highlighted)]")}>
            <MenuItemContent leading={<Checkbox />}>С чекбоксом</MenuItemContent>
          </div>
          <div className={menuItemRowClass("hover:bg-[var(--menu-item-bg-highlighted)]")}>
            <MenuItemContent
              leading={<Thumbnail type="card" size="m" last4="4482" />}
              description="•• 4482"
            >
              С миниатюрой
            </MenuItemContent>
          </div>
          <div className={menuItemRowClass("hover:bg-[var(--menu-item-bg-highlighted)]")}>
            <MenuItemContent trailing={<Badge type="counter" value={12} color="light-grey" />}>
              Со счётчиком
            </MenuItemContent>
          </div>
        </Dropdown>
      </div>
    </div>
  ),
}
