import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { Accordion, AccordionItem, AccordionTrigger, AccordionPanel } from "./accordion"

function setup() {
  return render(
    <Accordion>
      <AccordionItem value="a">
        <AccordionTrigger>Section A</AccordionTrigger>
        <AccordionPanel>Content A</AccordionPanel>
      </AccordionItem>
      <AccordionItem value="b">
        <AccordionTrigger>Section B</AccordionTrigger>
        <AccordionPanel>Content B</AccordionPanel>
      </AccordionItem>
    </Accordion>
  )
}

describe("Accordion", () => {
  it("renders every trigger and starts collapsed", () => {
    setup()
    expect(screen.getByRole("button", { name: "Section A" })).toHaveAttribute(
      "aria-expanded",
      "false"
    )
    expect(screen.getByRole("button", { name: "Section B" })).toHaveAttribute(
      "aria-expanded",
      "false"
    )
  })

  it("expands a section when its trigger is clicked", async () => {
    const user = userEvent.setup()
    setup()

    await user.click(screen.getByRole("button", { name: "Section A" }))

    expect(screen.getByRole("button", { name: "Section A" })).toHaveAttribute(
      "aria-expanded",
      "true"
    )
  })

  it("collapses the previously open section by default (single mode)", async () => {
    const user = userEvent.setup()
    setup()

    await user.click(screen.getByRole("button", { name: "Section A" }))
    await user.click(screen.getByRole("button", { name: "Section B" }))

    expect(screen.getByRole("button", { name: "Section A" })).toHaveAttribute(
      "aria-expanded",
      "false"
    )
    expect(screen.getByRole("button", { name: "Section B" })).toHaveAttribute(
      "aria-expanded",
      "true"
    )
  })

  it("allows multiple open sections when `multiple` is set", async () => {
    const user = userEvent.setup()
    render(
      <Accordion multiple>
        <AccordionItem value="a">
          <AccordionTrigger>Section A</AccordionTrigger>
          <AccordionPanel>Content A</AccordionPanel>
        </AccordionItem>
        <AccordionItem value="b">
          <AccordionTrigger>Section B</AccordionTrigger>
          <AccordionPanel>Content B</AccordionPanel>
        </AccordionItem>
      </Accordion>
    )

    await user.click(screen.getByRole("button", { name: "Section A" }))
    await user.click(screen.getByRole("button", { name: "Section B" }))

    expect(screen.getByRole("button", { name: "Section A" })).toHaveAttribute(
      "aria-expanded",
      "true"
    )
    expect(screen.getByRole("button", { name: "Section B" })).toHaveAttribute(
      "aria-expanded",
      "true"
    )
  })
})
