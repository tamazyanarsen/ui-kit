import type { Meta, StoryObj } from "@storybook/react-vite"
import type { ComponentProps } from "react"

import {
  PseudoBox,
  StatesMatrix,
  optionsArgType,
  sizeArgType,
  stateArgTypeOf,
  toggleArgType,
  type PlaygroundState,
} from "@/stories/matrix"
import type { Viewport } from "@/lib/viewport"

import { AccordionCard } from "./accordion-card"

type AccordionCardProps = ComponentProps<typeof AccordionCard>

/* Панель свойств `ELK / accordion` в Figma — Size, State, Type, Open,
   Show subtitle. В коде часть из них не пропы: Size задаёт `ViewportScope`,
   State (Default | Hover) — псевдокласс, Type (Default | Blocked) — булев
   `blocked`, а Show subtitle — наличие содержимого. Поэтому у истории есть
   синтетические аргументы, которые `render` раскладывает по пропам. */
type PlaygroundArgs = AccordionCardProps & {
  state?: PlaygroundState
  viewport?: Viewport
  type?: "default" | "blocked"
  showSubtitle?: boolean
}

const CONTENT = { table: { category: "Контент" } }

const meta = {
  title: "Компоненты/Accordion",
  component: AccordionCard,
  parameters: { layout: "padded" },
  argTypes: {
    // Дизайн-чек Storybook (Аня Багрова) №6: «панель настройки Properties не
    // соответствует настройкам в Figma» — порядок и имена ниже взяты из
    // приложенного к замечанию списка.
    viewport: sizeArgType,
    state: stateArgTypeOf(["default", "hover"]),
    type: {
      ...optionsArgType(
        "Type",
        { default: "Default", blocked: "Blocked" },
        "inline-radio"
      ),
      description:
        "Blocked — карточка раскрыта постоянно, сворачивать её нельзя",
    },
    defaultOpen: toggleArgType("Open"),
    showSubtitle: toggleArgType("Show subtitle"),
    // `subtitle` — это React.ReactNode (как и `title`), но во всех случаях
    // туда кладут строку. Без явного `control: "text"` Storybook по такому
    // широкому типу подставляет JSON-редактор вместо текстового поля.
    title: { control: "text", ...CONTENT },
    subtitle: { control: "text", ...CONTENT },
    children: { control: "text", ...CONTENT },
    // Не свойства макета: `blocked` ведёт `Type`, `open`/`onOpenChange` —
    // управляемый близнец `defaultOpen`, `className` — деталь вёрстки.
    blocked: { table: { disable: true } },
    open: { table: { disable: true } },
    onOpenChange: { table: { disable: true } },
    className: { table: { disable: true } },
  },
  args: {
    viewport: "desktop" as Viewport,
    state: "default" as PlaygroundState,
    type: "default" as const,
    defaultOpen: false,
    showSubtitle: true,
    title: "Заголовок карточки",
    subtitle: "Подзаголовок с пояснением",
    children: "Раскрытое содержимое карточки.",
  },
} satisfies Meta<PlaygroundArgs>

export default meta
type Story = StoryObj<PlaygroundArgs>

export const Playground: Story = {
  render: ({ state, viewport, type, showSubtitle, subtitle, ...args }) => (
    <PseudoBox state={state} viewport={viewport} className="w-full">
      {/* `defaultOpen` — начальное значение, а не управляемое: без
          перемонтирования по ключу контрол Open выглядел бы мёртвым. */}
      <AccordionCard
        key={String(args.defaultOpen)}
        {...args}
        subtitle={showSubtitle ? subtitle : undefined}
        blocked={type === "blocked"}
      />
    </PseudoBox>
  ),
}

export const Matrix: Story = {
  name: "Matrix (все состояния)",
  parameters: { layout: "fullscreen", controls: { disable: true } },
  render: () => (
    <StatesMatrix<AccordionCardProps>
      responsive
      stretch
      cellClassName="min-w-[360px]"
      baseProps={{ title: "Title", children: "Раскрытое содержимое карточки." }}
      columns={[
        { label: "С подзаголовком", props: { subtitle: "Subtitle" } },
        { label: "Без подзаголовка", props: {} },
      ]}
      rows={[
        { label: "Свёрнута", props: {} },
        { label: "Hover", props: {}, pseudo: "hover" },
        { label: "Раскрыта", props: { defaultOpen: true } },
        // `blocked` pins the card open and removes the toggle affordance.
        { label: "Blocked", props: { blocked: true, defaultOpen: true } },
      ]}
      render={(props) => <AccordionCard {...props} />}
    />
  ),
}
