import type { Meta, StoryObj } from "@storybook/react-vite"
import type { ComponentProps } from "react"

import {
  PseudoBox,
  StatesMatrix,
  iconArgType,
  viewportArgType,
} from "@/stories/matrix"
import type { Viewport } from "@/lib/viewport"

import { EmptySearchResults } from "./empty-search"

type EmptySearchResultsProps = ComponentProps<typeof EmptySearchResults>

/* Ось `Size` (Desktop | Mobile) в макете есть, но пропом не выставляется —
   её даёт общий контрол `viewport`. */
type PlaygroundArgs = EmptySearchResultsProps & { viewport?: Viewport }

const meta = {
  // Мастер в Figma переименован в `ELK / empty-page` — заголовок истории
  // следует за именем компонента в макете.
  title: "Компоненты/Empty Page",
  component: EmptySearchResults,
  parameters: { layout: "padded" },
  argTypes: {
    viewport: viewportArgType,
    // `icon` — готовый JSX-узел, значением из контрола его не набрать.
    // Иконка выбирается из набора: `null` — вообще без неё, остальные
    // значения приходят из общего реестра (см. iconArgType).
    icon: iconArgType("Иконка в плитке; «без иконки» — плитка не рисуется"),
    // `description`/`buttonLabel` are `React.ReactNode` but every usage is a
    // plain string — without this, leaving one unset falls back to a generic
    // "Set object" JSON editor.
    title: { control: "text" },
    description: { control: "text" },
    // Дизайн-чек №27: кнопка включается булевым свойством, а её вид —
    // отдельным списком, а не «включается текстовой строчкой».
    showButton: { control: "boolean" },
    buttonLabel: { control: "text" },
    buttonVariant: { control: "inline-radio", options: ["primary", "secondary-grey"] },
    largeIcon: {
      control: "boolean",
      description:
        "Размер плитки (свойство Large Icon мастера): true — L (48px на десктопе), false — M (40px)",
    },
  },
  args: {
    viewport: "auto" as Viewport,
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
  render: ({ viewport, ...args }) => (
    <PseudoBox viewport={viewport} className="w-full">
      <EmptySearchResults {...args} />
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
