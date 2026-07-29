import type { Meta, StoryObj } from "@storybook/react-vite"

import { AccordionList, AccordionListItem } from "./accordion-list"

const meta = {
  title: "UI/AccordionList",
  component: AccordionList,
  parameters: { layout: "padded" },
} satisfies Meta<typeof AccordionList>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <AccordionList>
      <AccordionListItem title="Личные данные" subtitle="Паспорт, СНИЛС" defaultOpen>
        Содержимое раздела личных данных.
      </AccordionListItem>
      <AccordionListItem title="Контакты" subtitle="Телефон, e-mail">
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
