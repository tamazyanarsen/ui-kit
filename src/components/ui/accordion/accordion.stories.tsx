import type { Meta, StoryObj } from "@storybook/react-vite"
import type { ComponentProps } from "react"

import { StatesMatrix } from "@/stories/matrix"

import { Accordion, AccordionItem, AccordionTrigger, AccordionPanel } from "./accordion"

type AccordionProps = ComponentProps<typeof Accordion>

/* This is the demo page's own chrome rather than a Figma component (see the
   pixel-pass note in accordion.tsx) — it has no spec sheet, so the second
   story is a small behaviour grid rather than a mirror of a Figma page. */

const meta = {
  title: "Компоненты/Accordion (нет аналога в Figma)",
  component: Accordion,
  parameters: { layout: "padded" },
  argTypes: {
    multiple: { control: "boolean" },
    // Which items start open; `multiple: false` collapses it back to one.
    defaultValue: { control: "object" },
  },
  args: { multiple: false, defaultValue: ["a"] },
} satisfies Meta<AccordionProps>

export default meta
type Story = StoryObj<AccordionProps>

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

export const Playground: Story = {
  // Remount on a `defaultValue` change so the control actually re-seeds the
  // (otherwise internally-owned) open set.
  render: (args) => (
    <Accordion key={String(args.defaultValue)} {...args}>
      <Rows />
    </Accordion>
  ),
}

export const Matrix: Story = {
  name: "Matrix (все состояния)",
  parameters: { layout: "fullscreen", controls: { disable: true } },
  render: () => (
    <StatesMatrix<AccordionProps>
      stretch
      cellClassName="min-w-[360px]"
      columns={[
        { label: "Single (по умолчанию)", props: { multiple: false } },
        { label: "Multiple", props: { multiple: true } },
      ]}
      rows={[
        { label: "Всё свёрнуто", props: { defaultValue: [] } },
        { label: "Открыт первый", props: { defaultValue: ["a"] } },
        // Two open at once is only reachable in `multiple` mode — the Single
        // column collapses back to one.
        { label: "Открыты два", props: { defaultValue: ["a", "b"] } },
        { label: "Hover", props: { defaultValue: [] }, pseudo: "hover" },
      ]}
      render={(props) => (
        <Accordion {...props}>
          <Rows />
        </Accordion>
      )}
    />
  ),
}
