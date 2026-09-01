import type { Meta, StoryObj } from "@storybook/react-vite"
import { Download } from "@/icons"

import {
  PseudoBox,
  StatesMatrix,
  optionsArgType,
  stateArgTypeOf,
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

/* Дизайн-чек Storybook (Аня Багрова) №9: панель контролов приведена к
   «Свойствам компонента» `ELK / button`.

   `Size` в Figma — одно свойство с шестью значениями: размер и форма
   (Desktop/Mobile) там не разъезжаются. В коде это пара `size` +
   `<ViewportScope>`, поэтому контрол один, а `render` разбирает его на две
   части. */
const SIZE_LABELS = {
  "lg-desktop": "L-Desktop",
  "default-desktop": "M-Desktop",
  "sm-desktop": "S-Desktop",
  "lg-mobile": "L-Mobile",
  "default-mobile": "M-Mobile",
  "sm-mobile": "S-Mobile",
} as const
type FigmaSize = keyof typeof SIZE_LABELS

/* Свойство `Type`. Первые семь имён — ровно из списка в замечании; три
   последних значения в коде без пары в этом списке, но они настоящие
   варианты кита, поэтому остаются в контроле под описательными именами,
   иначе из Playground их не достать. */
const TYPE_LABELS: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary: "Primary (Blue)",
  "secondary-black": "Secondary (Dark Blue)",
  "secondary-logo-black": "Secondary Logo (Dark Blue)",
  "secondary-grey": "Tretiary (Grey)",
  "secondary-white": "Tretiary-Variant (White)",
  "secondary-logo-border-white": "Secondary Logo Border (White)",
  destructive: "Danger (Red)",
  "secondary-outline": "· с обводкой (White)",
  "secondary-logo-white": "· Secondary Logo (White)",
  "secondary-logo-grey": "· Secondary Logo (Grey)",
}

type PlaygroundArgs = ButtonProps & {
  state?: PlaygroundState
  figmaStyle?: ButtonStyle
  figmaSize?: FigmaSize
  viewport?: Viewport
}

const meta = {
  title: "Компоненты/Button",
  component: Button,
  parameters: { layout: "centered" },
  argTypes: {
    // Панель повторяет «Свойства компонента» ELK / button (Size / State /
    // Type / Style), чтобы дизайнер сверял её с Figma контрол в контрол:
    // - Size — один список из шести значений, см. SIZE_LABELS выше.
    // - State (Hover / Active) — CSS-псевдоклассы, их форсирует аддон
    //   pseudo-states через PseudoBox; Disabled и Loading — настоящие пропы.
    // - Style — см. `figmaStyle` ниже (в UI подписан «Style»; имя `style`
    //   занято DOM-пропом кнопки, поэтому арг называется иначе).
    figmaSize: optionsArgType<FigmaSize>("Size", SIZE_LABELS),
    state: stateArgTypeOf([
      "default",
      "hover",
      "active",
      "disabled",
      "loading",
    ]),
    variant: optionsArgType("Type", TYPE_LABELS),
    size: { table: { disable: true } },
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
    // Disabled и Loading — значения оси State, отдельных контролов у них нет.
    isLoading: { table: { disable: true } },
    disabled: { table: { disable: true } },
    viewport: { table: { disable: true } },
    children: { control: "text", table: { category: "Контент" } },
  },
  args: {
    figmaSize: "lg-desktop" as FigmaSize,
    state: "default" as PlaygroundState,
    variant: "primary",
    figmaStyle: "Text",
    children: "Button",
  },
} satisfies Meta<PlaygroundArgs>

export default meta
type Story = StoryObj<PlaygroundArgs>

export const Playground: Story = {
  render: ({ state, figmaStyle, figmaSize = "lg-desktop", ...args }) => {
    const [size, viewport] = figmaSize.split("-") as [
      NonNullable<ButtonProps["size"]>,
      Viewport,
    ]
    return (
      <PseudoBox state={state} viewport={viewport}>
        <Button
          {...args}
          size={size}
          disabled={state === "disabled"}
          isLoading={state === "loading"}
          {...STYLE_PROPS[figmaStyle ?? "Text"]}
          aria-label={figmaStyle === "Icon" ? "Скачать" : undefined}
        />
      </PseudoBox>
    )
  },
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
