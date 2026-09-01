import type { Meta, StoryObj } from "@storybook/react-vite"
import type { ComponentProps } from "react"

import {
  StatesMatrix,
  optionsArgType,
  toggleArgType,
} from "@/stories/matrix"

import { AccordionList, AccordionListItem } from "./accordion-list"

type ItemProps = ComponentProps<typeof AccordionListItem>

const DESCRIPTION_TYPES = [
  "default",
  "success",
  "attention",
  "error",
  "information",
] as const

const CONTENT = { table: { category: "Контент" } }

/* `showDescription` / `showSubtitle` — синтетические аргументы: в макете это
   свойства-переключатели, в коде — наличие содержимого в слоте. */
type PlaygroundArgs = ItemProps & {
  showDescription?: boolean
  showSubtitle?: boolean
}

const meta = {
  title: "Компоненты/Content Accordion",
  component: AccordionListItem,
  parameters: { layout: "padded" },
  argTypes: {
    // Дизайн-чек Storybook (Аня Багрова) №25: панель приведена к «Свойствам
    // компонента» — Style, Open, Show Checkbox, Show Description,
    // Show Buttons, Show Subtitle. Остальные контролы — наполнение строки,
    // они убраны в отдельную группу.
    titleAs: optionsArgType(
      "Style",
      { h3: "Title H3", h4: "Title H4" },
      "inline-radio"
    ),
    defaultOpen: toggleArgType("Open"),
    showCheckbox: toggleArgType("Show Checkbox"),
    showDescription: toggleArgType("Show Description"),
    showButtons: toggleArgType("Show Buttons"),
    showSubtitle: toggleArgType("Show Subtitle"),
    defaultChecked: { name: "Чекбокс отмечен", control: "boolean" },
    title: { control: "text", ...CONTENT },
    subtitle: { control: "text", ...CONTENT },
    description: { control: "text", ...CONTENT },
    descriptionType: {
      control: "select",
      options: DESCRIPTION_TYPES,
      ...CONTENT,
    },
    buttonLabel: { control: "text", ...CONTENT },
    buttonsType: {
      control: "inline-radio",
      options: ["button", "dropdown", "both"],
      ...CONTENT,
    },
    children: { control: "text", ...CONTENT },
    // Управляемые близнецы `defaultChecked` / `defaultOpen`.
    checked: { table: { disable: true } },
    open: { table: { disable: true } },
  },
  args: {
    title: "Личные данные",
    subtitle: "Паспорт, СНИЛС",
    showCheckbox: true,
    defaultChecked: true,
    showDescription: true,
    showSubtitle: true,
    description: "Подписано",
    // Дизайн-чек №24, вторая половина («поменять цвет»). Пять статусов сами
    // по себе совпадают с макетом один в один: Status (ELK), нода 50451:9206
    // — Default #252628, Success #39C182, Error #D74B54, Attention #EEA20F,
    // Information #999999. Тёмным «Подписано» выглядело потому, что в
    // Playground стоял Default, а в анатомии компонента этот же элемент
    // нарисован серым (инстанс I42675:20084;50451:9233 — Information).
    // Поэтому меняем не палитру, а значение по умолчанию в примере.
    descriptionType: "information",
    showButtons: true,
    buttonsType: "both",
    buttonLabel: "Изменить",
    defaultOpen: true,
    titleAs: "h3",
    children: "Содержимое раздела личных данных.",
  },
} satisfies Meta<PlaygroundArgs>

export default meta
type Story = StoryObj<PlaygroundArgs>

export const Playground: Story = {
  render: ({ showDescription, showSubtitle, description, subtitle, ...args }) => (
    <AccordionList>
      {/* Дизайн-чек Storybook (Аня Багрова) №24: «не работает настройка
          Checked — при изменении True на False остаётся Checked».
          `defaultChecked` и `defaultOpen` — начальные значения, а не
          управляемые пропы: без перемонтирования по ключу переключатель в
          панели выглядит мёртвым. */}
      <AccordionListItem
        key={`${args.defaultChecked}-${args.defaultOpen}`}
        {...args}
        subtitle={showSubtitle ? subtitle : undefined}
        description={showDescription ? description : undefined}
      />
    </AccordionList>
  ),
}

/* Every anatomy example in the "Content Accordion" spec carries the full
   row — checkbox on the left, description + button + kebab on the right — so
   the matrix varies those blocks rather than showing a stripped-down row. */
export const Matrix: Story = {
  name: "Matrix (все состояния)",
  parameters: { layout: "fullscreen", controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-2">
      <StatesMatrix<ItemProps>
        stretch
        cellClassName="min-w-[420px]"
        baseProps={{ title: "Title", children: "Содержимое раздела." }}
        columns={[
          { label: "Свёрнут", props: {} },
          { label: "Раскрыт", props: { defaultOpen: true } },
        ]}
        rows={[
          { label: "Только заголовок", props: {} },
          { label: "С подзаголовком", props: { subtitle: "Subtitle" } },
          {
            label: "С чекбоксом",
            props: { showCheckbox: true, defaultChecked: true },
          },
          { label: "С описанием", props: { description: "Подписано" } },
          {
            label: "С кнопкой",
            props: { showButtons: true, buttonsType: "button", buttonLabel: "Изменить" },
          },
          {
            label: "С кнопкой и «ещё»",
            props: { showButtons: true, buttonsType: "both", buttonLabel: "Изменить" },
          },
          {
            label: "Полная строка",
            props: {
              subtitle: "Subtitle",
              showCheckbox: true,
              defaultChecked: true,
              description: "Подписано",
              showButtons: true,
              buttonsType: "both",
              buttonLabel: "Изменить",
            },
          },
          { label: "Hover", props: {}, pseudo: "hover" },
        ]}
        render={(props) => (
          <AccordionList>
            <AccordionListItem {...props} />
          </AccordionList>
        )}
      />
      <StatesMatrix<ItemProps>
        stretch
        cellClassName="min-w-[420px]"
        baseProps={{ title: "Title", description: "Description" }}
        columnGroups={[
          {
            label: "Description type",
            columns: DESCRIPTION_TYPES.map((descriptionType) => ({
              label: descriptionType,
              props: { descriptionType },
            })),
          },
        ]}
        rows={[{ label: "Default", props: {} }]}
        render={(props) => (
          <AccordionList>
            <AccordionListItem {...props} />
          </AccordionList>
        )}
      />
    </div>
  ),
}
