import type { Meta, StoryObj } from "@storybook/react-vite"
import type { ComponentProps } from "react"

import { StatesMatrix } from "@/stories/matrix"

import { AccordionList, AccordionListItem } from "./accordion-list"

type ItemProps = ComponentProps<typeof AccordionListItem>

const DESCRIPTION_TYPES = [
  "default",
  "success",
  "attention",
  "error",
  "information",
] as const

const meta = {
  title: "Компоненты/Content Accordion",
  component: AccordionListItem,
  parameters: { layout: "padded" },
  argTypes: {
    title: { control: "text" },
    subtitle: { control: "text" },
    description: { control: "text" },
    descriptionType: { control: "select", options: DESCRIPTION_TYPES },
    buttonLabel: { control: "text" },
    buttonsType: { control: "inline-radio", options: ["button", "dropdown", "both"] },
    showCheckbox: { control: "boolean" },
    defaultChecked: { control: "boolean" },
    showButtons: { control: "boolean" },
    defaultOpen: { control: "boolean" },
    children: { control: "text" },
    titleAs: { control: "inline-radio", options: ["h3", "h4"] },
  },
  args: {
    title: "Личные данные",
    subtitle: "Паспорт, СНИЛС",
    showCheckbox: true,
    defaultChecked: true,
    description: "Подписано",
    showButtons: true,
    buttonsType: "both",
    buttonLabel: "Изменить",
    defaultOpen: true,
    children: "Содержимое раздела личных данных.",
  },
} satisfies Meta<ItemProps>

export default meta
type Story = StoryObj<ItemProps>

export const Playground: Story = {
  render: (args) => (
    <AccordionList>
      <AccordionListItem {...args} />
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
