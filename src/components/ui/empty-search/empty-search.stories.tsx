import type { Meta, StoryObj } from "@storybook/react-vite"
import type { ComponentProps } from "react"

import {
  PseudoBox,
  StatesMatrix,
  iconArgType,
  sizeArgType,
  toggleArgType,
} from "@/stories/matrix"
import type { Viewport } from "@/lib/viewport"

import { ArrowRotateReload, ClearFilter } from "@/icons"

import { EmptySearchResults } from "./empty-search"

type EmptySearchResultsProps = ComponentProps<typeof EmptySearchResults>

/* Ось `Size` (Desktop | Mobile) в макете есть, но пропом не выставляется —
   форму задаёт `<ViewportScope>`.

   Дизайн-чек Storybook (Аня Багрова) №29: панель приведена к «Свойствам
   компонента» — Size, Show Button, Show Description. */
type PlaygroundArgs = EmptySearchResultsProps & {
  viewport?: Viewport
  showDescription?: boolean
}

const CONTENT = { table: { category: "Контент" } }

const meta = {
  // Мастер в Figma переименован в `ELK / empty-page` — заголовок истории
  // следует за именем компонента в макете.
  title: "Компоненты/Empty Page",
  component: EmptySearchResults,
  parameters: { layout: "padded" },
  argTypes: {
    viewport: sizeArgType,
    showButton: toggleArgType("Show Button"),
    showDescription: toggleArgType("Show Description"),
    // `icon` — готовый JSX-узел, значением из контрола его не набрать.
    // Иконка выбирается из набора: `null` — вообще без неё, остальные
    // значения приходят из общего реестра (см. iconArgType).
    // Плитка отводит глифу коробку 24px, поэтому контрол отдаёт 24-е
    // начертание набора, а не растянутое 16-е (дизайн-чек №28).
    icon: iconArgType("Иконка в плитке; «без иконки» — плитка не рисуется", 24),
    // `description`/`buttonLabel` are `React.ReactNode` but every usage is a
    // plain string — without this, leaving one unset falls back to a generic
    // "Set object" JSON editor.
    title: { control: "text", ...CONTENT },
    description: { control: "text", ...CONTENT },
    // Дизайн-чек №27: кнопка включается булевым свойством, а её вид —
    // отдельным списком, а не «включается текстовой строчкой».
    buttonLabel: { control: "text", ...CONTENT },
    // Дизайн-чек 3/3 №27: у кейса «нулевой результат фильтрации» кнопка
    // «Сбросить фильтры» несёт значок `icon / clear filter`. Проп принимает
    // компонент-глиф, поэтому контрол — тот же реестр иконок.
    buttonIcon: {
      name: "Иконка в кнопке",
      control: { type: "select" as const },
      options: ["без иконки", "clear-filter", "arrow-rotate-reload"],
      mapping: {
        "без иконки": undefined,
        "clear-filter": ClearFilter,
        "arrow-rotate-reload": ArrowRotateReload,
      },
      ...CONTENT,
    },
    buttonVariant: {
      control: "inline-radio",
      options: ["primary", "secondary-grey"],
      ...CONTENT,
    },
    largeIcon: {
      control: "boolean",
      description:
        "Размер плитки (свойство Large Icon мастера): true — L (48px на десктопе), false — M (40px)",
    },
  },
  args: {
    viewport: "desktop" as Viewport,
    showDescription: true,
    title: "Ничего не найдено",
    description: "Попробуйте изменить параметры поиска",
    largeIcon: true,
    // По умолчанию кнопка включена: иначе её вариант и подпись не видно, а
    // Playground должен показывать все необязательные блоки (см. правило
    // «Playground покрывает все свойства»).
    showButton: true,
    buttonLabel: "Сбросить фильтры",
    buttonVariant: "secondary-grey",
  },
} satisfies Meta<PlaygroundArgs>

export default meta
type Story = StoryObj<PlaygroundArgs>

export const Playground: Story = {
  render: ({ viewport, showDescription, description, ...args }) => (
    <PseudoBox viewport={viewport} className="w-full">
      <EmptySearchResults
        {...args}
        description={showDescription ? description : undefined}
      />
    </PseudoBox>
  ),
}

export const Matrix: Story = {
  name: "Matrix (все состояния)",
  parameters: { layout: "fullscreen", controls: { disable: true } },
  render: () => (
    <StatesMatrix<EmptySearchResultsProps>
      responsive
      stretch
      cellClassName="min-w-[320px]"
      baseProps={{ title: "Ничего не найдено" }}
      columns={[
        // `largeIcon` — размер плитки Thumbnail (L/M), глиф в обеих 24px.
        { label: "Плитка L", props: { largeIcon: true } },
        { label: "Плитка M", props: { largeIcon: false } },
        { label: "Без иконки", props: { icon: null } },
      ]}
      rows={[
        { label: "Только заголовок", props: {} },
        {
          label: "С описанием",
          props: { description: "Попробуйте изменить параметры поиска" },
        },
        {
          label: "С серой кнопкой",
          props: {
            description: "Попробуйте изменить параметры поиска",
            showButton: true,
            buttonLabel: "Сбросить фильтры",
            buttonVariant: "secondary-grey",
          },
        },
        {
          label: "С брендовой кнопкой",
          props: {
            description: "Попробуйте изменить параметры поиска",
            showButton: true,
            buttonLabel: "Вернуться на главную",
            buttonVariant: "primary",
          },
        },
      ]}
      render={(props) => <EmptySearchResults {...props} />}
    />
  ),
}
