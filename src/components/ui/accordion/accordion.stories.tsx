import type { Meta, StoryObj } from "@storybook/react-vite"

import { Accordion, AccordionItem, AccordionTrigger, AccordionPanel } from "./accordion"

const meta = {
  title: "Content/Accordion/Accordion",
  component: Accordion,
  parameters: { layout: "padded" },
} satisfies Meta<typeof Accordion>

export default meta
type Story = StoryObj<typeof meta>

function Rows() {
  return (
    <>
      <AccordionItem value="a">
        <AccordionTrigger>Раздел A</AccordionTrigger>
        <AccordionPanel>Содержимое раздела A</AccordionPanel>
      </AccordionItem>
      <AccordionItem value="b">
        <AccordionTrigger>Раздел B</AccordionTrigger>
        <AccordionPanel>Содержимое раздела B</AccordionPanel>
      </AccordionItem>
      <AccordionItem value="c">
        <AccordionTrigger>Раздел C</AccordionTrigger>
        <AccordionPanel>Содержимое раздела C</AccordionPanel>
      </AccordionItem>
    </>
  )
}

export const SingleOpen: Story = {
  name: "Single (default)",
  render: () => (
    <Accordion defaultValue={["a"]}>
      <Rows />
    </Accordion>
  ),
}

export const MultipleOpen: Story = {
  render: () => (
    <Accordion multiple defaultValue={["a", "b"]}>
      <Rows />
    </Accordion>
  ),
}
