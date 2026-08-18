import type { Meta, StoryObj } from "@storybook/react-vite"
import { Download } from "@/icons"

import {
  PseudoBox,
  StatesMatrix,
  stateArgType,
  viewportArgType,
  type PlaygroundState,
} from "@/stories/matrix"
import { type Viewport } from "@/lib/viewport"

import { Button, type ButtonProps } from "./button"

const VARIANTS: NonNullable<ButtonProps["variant"]>[] = [
  "primary",
  "secondary-black",
  "secondary-grey",
  "secondary-white",
  "secondary-outline",
  "destructive",
]

const LOGO_VARIANTS: NonNullable<ButtonProps["variant"]>[] = [
  "secondary-logo-black",
  "secondary-logo-border-white",
  "secondary-logo-white",
  "secondary-logo-grey",
]

/* Свойство `Style` компонента ELK / button в Figma (компонент-сет 32:9064).
   В коде оно раскладывается на пару `icon` + `iconPosition`, но в контролах
   должно быть одним списком — см. комментарий у argTypes ниже. */
const STYLES = ["Text", "Icon Left", "Icon Right", "Icon"] as const
type ButtonStyle = (typeof STYLES)[number]

const STYLE_PROPS: Record<ButtonStyle, Pick<ButtonProps, "icon" | "iconPosition">> = {
  Text: { icon: undefined, iconPosition: undefined },
  "Icon Left": { icon: Download, iconPosition: "left" },
  "Icon Right": { icon: Download, iconPosition: "right" },
  Icon: { icon: Download, iconPosition: "only" },
}

type PlaygroundArgs = ButtonProps & {
  state?: PlaygroundState
  figmaStyle?: ButtonStyle
  viewport?: Viewport
}

const meta = {
  title: "Компоненты/Button",
  component: Button,
  parameters: { layout: "centered" },
  argTypes: {
    // Mirrors Figma's own "Current variant" panel for ELK / button (Size /
    // State / Type / Style dropdowns) as closely as Storybook's mechanisms
    // allow, so a designer can compare against Figma control-for-control:
    // - Size/Type map 1:1 onto the real `size`/`variant` props below.
    // - State (Default / Hover / Pressed / Focus) is a CSS pseudo-class, not
    //   a prop — the shared `state` control below forces it through
    //   storybook-addon-pseudo-states. Disabled/Loading are real props.
    // - Style — см. `figmaStyle` ниже (в UI подписан «Style»; имя `style`
    //   занято DOM-пропом кнопки, поэтому арг называется иначе).
    variant: { control: "select", options: [...VARIANTS, ...LOGO_VARIANTS] },
    size: { control: "inline-radio", options: ["sm", "default", "lg"] },
    // Дизайн-чек №11: раньше здесь были два отдельных контрола — `icon`
    // (только «None»/«Download») и `iconPosition`, — и из выпадающего списка
    // нельзя было выбрать сторону иконки: «сейчас иконку в кнопке нельзя
    // поставить с левой или с правой стороны, можно только включить тестовую
    // иконку». В Figma это одно свойство `Style` с четырьмя значениями
    // (Text / Icon Left / Icon Right / Icon — компонент-сет 32:9064), поэтому
    // здесь ровно оно: один список, значения и порядок унаследованы из Figma.
    figmaStyle: {
      name: "Style",
      description: "Свойство Style компонента ELK / button в Figma",
      control: { type: "select" },
      options: STYLES,
    },
    icon: { table: { disable: true } },
    iconPosition: { table: { disable: true } },
    isLoading: { control: "boolean" },
    disabled: { control: "boolean" },
    children: { control: "text" },
    state: stateArgType,
    // - Size=Desktop/Mobile — контрол `viewport`. Дизайн-чек №3 №19:
    //   «пропс на мобайл должен быть в панели стори, не по изменению
    //   размера вьюпорта».
    viewport: viewportArgType,
  },
  args: {
    children: "Button",
    variant: "primary",
    size: "lg",
    figmaStyle: "Text",
    isLoading: false,
    disabled: false,
    state: "default" as PlaygroundState,
    viewport: "auto" as Viewport,
  },
} satisfies Meta<PlaygroundArgs>

export default meta
type Story = StoryObj<PlaygroundArgs>

export const Playground: Story = {
  render: ({ state, figmaStyle, viewport, ...args }) => (
    <PseudoBox state={state} viewport={viewport}>
      <Button
        {...args}
        {...STYLE_PROPS[figmaStyle ?? "Text"]}
        aria-label={figmaStyle === "Icon" ? "Скачать" : undefined}
      />
    </PseudoBox>
  ),
}

export const Matrix: Story = {
  name: "Matrix (все состояния)",
  parameters: { layout: "fullscreen", controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-2">
      {/* Дизайн-чек №9: матрица строится на размере L. Размер M «не популярен
          в продукте ЕЛК, просмотр на нём — нецелевой», поэтому целевой размер
          стоит базовым, а остальные два остались отдельными строками ниже. */}
      <StatesMatrix<ButtonProps>
        responsive
        baseProps={{ children: "Button", size: "lg" }}
        columns={VARIANTS.map((variant) => ({
          label: variant.replace("secondary-", "sec. "),
          props: { variant },
        }))}
        rows={[
          { label: "Default", props: {} },
          { label: "Hover", props: {}, pseudo: "hover" },
          { label: "Pressed", props: {}, pseudo: "active" },
          { label: "Focus", props: {}, pseudo: "focus-visible" },
          { label: "Disabled", props: { disabled: true } },
          { label: "Loading", props: { isLoading: true } },
          // Дизайн-чек №10: строка рядом с обычной «Loading» — по ней видно,
          // что кнопка с иконкой и текстом в загрузке сохраняет свою ширину.
          {
            label: "Loading (с иконкой)",
            props: { isLoading: true, icon: Download, iconPosition: "left" },
          },
          { label: "Icon left", props: { icon: Download, iconPosition: "left" } },
          {
            label: "Icon right",
            props: { icon: Download, iconPosition: "right" },
          },
          {
            label: "Icon only",
            props: { icon: Download, iconPosition: "only", "aria-label": "Скачать" },
          },
          { label: "S", props: { size: "sm" } },
          { label: "M", props: { size: "default" } },
          { label: "L (базовый)", props: { size: "lg" } },
        ]}
        render={(props) => <Button {...props} />}
      />
      {/* Secondary Logo types always carry the fixed Госуслуги glyph, so
          they have no icon/icon-only rows of their own. */}
      <StatesMatrix<ButtonProps>
        baseProps={{ children: "Button", size: "lg" }}
        columnGroups={[
          {
            label: "Secondary Logo (Госуслуги)",
            columns: LOGO_VARIANTS.map((variant) => ({
              label: variant.replace("secondary-logo-", ""),
              props: { variant },
            })),
          },
        ]}
        rows={[
          { label: "Default", props: {} },
          { label: "Hover", props: {}, pseudo: "hover" },
          { label: "Pressed", props: {}, pseudo: "active" },
          { label: "Disabled", props: { disabled: true } },
        ]}
        render={(props) => <Button {...props} />}
      />
    </div>
  ),
}
