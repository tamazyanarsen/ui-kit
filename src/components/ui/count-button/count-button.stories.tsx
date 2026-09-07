import type { Meta, StoryObj } from "@storybook/react-vite"

import {
  PseudoBox,
  StatesMatrix,
  stateArgType,
  viewportArgType,
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
type PlaygroundArgs = CountButtonProps & {
  state?: PlaygroundState
  viewport?: Viewport
}

const meta = {
  title: "Компоненты/Count Button",
  component: CountButton,
  parameters: { layout: "centered" },
  argTypes: {
    children: { control: "text" },
    count: { control: { type: "number", min: 0, max: 999 } },
    countColor: {
      control: "select",
      options: ["red", "contra-red", "dark-grey", "light-grey", "black"],
    },
    variant: {
      control: "select",
      options: [
        "primary",
        "secondary-black",
        "secondary-grey",
        "secondary-white",
        "secondary-outline",
      ],
    },
    size: { control: "inline-radio", options: ["sm", "default", "lg"] },
    disabled: { control: "boolean" },
    state: stateArgType,
    viewport: viewportArgType,
  },
  args: {
    children: "Уведомления",
    count: 3,
    variant: "secondary-grey",
    size: "default",
    disabled: false,
    state: "default" as PlaygroundState,
    viewport: "auto" as Viewport,
  },
} satisfies Meta<PlaygroundArgs>

export default meta
type Story = StoryObj<PlaygroundArgs>

export const Playground: Story = {
  render: ({ state, viewport, ...args }) => (
    <ViewportScope viewport={viewport}>
      <PseudoBox state={state}>
        <CountButton {...args} />
      </PseudoBox>
    </ViewportScope>
  ),
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
