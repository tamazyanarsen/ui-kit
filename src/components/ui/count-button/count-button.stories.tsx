import type { Meta, StoryObj } from "@storybook/react-vite"

import {
  PseudoBox,
  StatesMatrix,
  optionsArgType,
  stateArgTypeOf,
  toggleArgType,
  type PlaygroundState,
} from "@/stories/matrix"
import { ViewportScope, type Viewport } from "@/lib/viewport"

import { CountButton, type CountButtonProps } from "./count-button"

/**
 * Дизайн-чек от 07.09, замечание 11: «Для Count Button нужен вариант
 * Mobile. Можно собрать из существующих компонентов».
 *
 * Собирать ничего не пришлось: мобильная форма у кнопки уже есть — размеры
 * `Button` заданы парой «база + `desktop:`» (`default` — 40px на мобайле и
 * 48 на десктопе, `lg` — 48 и 56), а счётчик `Badge` от формы не зависит.
 * Не хватало именно УПРАВЛЕНИЯ: форму в ките выбирает `ViewportScope`, и
 * его контрола в этой истории не было — проверить мобильный вид было
 * нечем. Теперь он есть в Playground, а в матрице обе формы стоят рядом
 * (`responsive`).
 */
/* Мастер `ELK / count button` (34:17381) — обёртка над `ELK / button` с
   единственным собственным свойством `Show Count`; размер, состояние и тип
   он наследует от вложенной кнопки, а цвет счётчика — от вложенного
   `ELK / badge`. Панель собрана в том же порядке. */
const SIZE_LABELS = {
  "lg-desktop": "L / Desktop",
  "default-desktop": "M / Desktop",
  "sm-desktop": "S / Desktop",
  "lg-mobile": "L / Mobile",
  "default-mobile": "M / Mobile",
  "sm-mobile": "S / Mobile",
} as const
type FigmaSize = keyof typeof SIZE_LABELS

const TYPE_LABELS = {
  primary: "Primary (Blue)",
  "secondary-black": "Secondary (Dark Blue)",
  "secondary-grey": "Secondary (Grey)",
  "secondary-white": "Secondary (White)",
  "secondary-outline": "· с обводкой (White)",
} as const

const COUNT_COLOR_LABELS = {
  red: "Red",
  black: "Black",
  "contra-red": "Contra-Red",
  "dark-grey": "Dark-Grey",
  "light-grey": "Light-Grey",
} as const

type PlaygroundArgs = Omit<CountButtonProps, "size"> & {
  state?: PlaygroundState
  viewport?: Viewport
  figmaSize?: FigmaSize
  showCount?: boolean
}

const meta = {
  title: "Компоненты/Count Button",
  component: CountButton,
  parameters: { layout: "centered" },
  argTypes: {
    figmaSize: optionsArgType<FigmaSize>("Size", SIZE_LABELS),
    state: stateArgTypeOf(["default", "hover", "active", "disabled"]),
    variant: optionsArgType("Type", TYPE_LABELS),
    showCount: toggleArgType("Show Count"),
    countColor: {
      ...optionsArgType("Color", COUNT_COLOR_LABELS),
      table: { category: "ELK / badge" },
    },
    count: {
      control: { type: "number", min: 0, max: 999 },
      table: { category: "ELK / badge" },
    },
    children: { control: "text", table: { category: "Контент" } },
    // Значения осей Size и State — отдельных контролов у них нет.
    disabled: { table: { disable: true } },
  },
  /* Порядок ключей здесь задаёт порядок строк в панели Storybook (argTypes
     на него не влияет), поэтому он повторяет порядок свойств мастера. */
  args: {
    figmaSize: "default-desktop" as FigmaSize,
    state: "default" as PlaygroundState,
    variant: "secondary-grey",
    showCount: true,
    countColor: "red",
    count: 3,
    children: "Уведомления",
  },
} satisfies Meta<PlaygroundArgs>

export default meta
type Story = StoryObj<PlaygroundArgs>

export const Playground: Story = {
  render: ({ state, figmaSize = "default-desktop", showCount, ...args }) => {
    const [size, viewport] = figmaSize.split("-") as [
      NonNullable<CountButtonProps["size"]>,
      Viewport,
    ]
    return (
      <ViewportScope viewport={viewport}>
        <PseudoBox state={state}>
          <CountButton
            {...args}
            size={size}
            count={showCount ? args.count : undefined}
            disabled={state === "disabled"}
          />
        </PseudoBox>
      </ViewportScope>
    )
  },
}

export const Matrix: Story = {
  name: "Matrix (все состояния)",
  parameters: { layout: "fullscreen", controls: { disable: true } },
  render: () => (
    <StatesMatrix<CountButtonProps>
      responsive
      baseProps={{ children: "Уведомления", count: 3 }}
      columns={[
        { label: "secondary-grey", props: { variant: "secondary-grey" } },
        { label: "primary", props: { variant: "primary" } },
        { label: "secondary-outline", props: { variant: "secondary-outline" } },
      ]}
      rows={[
        { label: "Default", props: {} },
        { label: "Hover", props: {}, pseudo: "hover" },
        { label: "Pressed", props: {}, pseudo: "active" },
        { label: "Счётчик 99+", props: { count: 250 } },
        // `ELK / count button`'s own master carries the red badge, but Table
        // Top's "Ещё фильтры" instance overrides it to the dark one.
        { label: "Тёмный счётчик\n(Table Top)", props: { countColor: "black" } },
        { label: "S", props: { size: "sm" } },
        { label: "L", props: { size: "lg" } },
        { label: "Disabled", props: { disabled: true } },
      ]}
      render={(props) => <CountButton {...props} />}
    />
  ),
}
