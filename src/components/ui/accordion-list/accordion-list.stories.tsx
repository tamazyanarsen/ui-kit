import type { Meta, StoryObj } from "@storybook/react-vite"

import { AccordionList, AccordionListItem } from "./accordion-list"

const meta = {
  title: "Content/Accordion/List",
  component: AccordionList,
  parameters: { layout: "padded" },
} satisfies Meta<typeof AccordionList>

export default meta
type Story = StoryObj<typeof meta>

// Design-check #1/#2: the previous Default story only showed Title/
// chevron/Subtitle — the row's left half. Against
// ui/accordion-content/content accordion.png (the actual "Content
// Accordion" spec) that reads as a different, stripped-down component,
// since every anatomy example there also has the checkbox and the
// Description/Button/kebab group on the right. Default now matches that
// full row so the first thing shown lines up with the spec's own preview;
// the variants below stay as focused single-feature demos.
export const Default: Story = {
  render: () => (
    <AccordionList>
      <AccordionListItem
        title="Личные данные"
        subtitle="Паспорт, СНИЛС"
        showCheckbox
        defaultChecked
        description="Подписано"
        showButtons
        buttonsType="both"
        buttonLabel="Изменить"
        defaultOpen
      >
        Содержимое раздела личных данных.
      </AccordionListItem>
      <AccordionListItem
        title="Контакты"
        subtitle="Телефон, e-mail"
        showCheckbox
        showButtons
        buttonsType="both"
        buttonLabel="Изменить"
      >
        Содержимое раздела контактов.
      </AccordionListItem>
    </AccordionList>
  ),
}

export const WithCheckboxAndDescription: Story = {
  render: () => (
    <AccordionList>
      <AccordionListItem
        title="Согласие на обработку данных"
        showCheckbox
        defaultChecked
        description="Подписано"
      >
        Текст согласия на обработку персональных данных.
      </AccordionListItem>
    </AccordionList>
  ),
}

export const WithButtons: Story = {
  render: () => (
    <AccordionList>
      <AccordionListItem
        title="Документ"
        showButtons
        buttonsType="both"
        buttonLabel="Скачать"
      >
        Содержимое.
      </AccordionListItem>
    </AccordionList>
  ),
}
