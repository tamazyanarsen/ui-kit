import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { AccordionList, AccordionListItem } from "./accordion-list"

describe("AccordionList", () => {
  it("renders as a list", () => {
    render(
      <AccordionList>
        <AccordionListItem title="Первая">Содержимое</AccordionListItem>
      </AccordionList>
    )
    expect(screen.getByRole("list")).toBeInTheDocument()
  })
})

describe("AccordionListItem", () => {
  it("renders title and subtitle", () => {
    render(
      <AccordionListItem title="Заголовок" subtitle="Подзаголовок">
        Содержимое
      </AccordionListItem>
    )

    expect(screen.getByText("Заголовок")).toBeInTheDocument()
    expect(screen.getByText("Подзаголовок")).toBeInTheDocument()
  })

  it("expands on click (uncontrolled)", async () => {
    const user = userEvent.setup()
    render(<AccordionListItem title="Заголовок">Содержимое</AccordionListItem>)

    const trigger = screen.getByText("Заголовок").closest('[data-slot="accordion-list-trigger"]')!
    expect(trigger).toHaveAttribute("aria-expanded", "false")

    await user.click(trigger)

    expect(trigger).toHaveAttribute("aria-expanded", "true")
  })

  it("calls onCheckedChange without toggling the row open", async () => {
    const user = userEvent.setup()
    const onCheckedChange = vi.fn()
    render(
      <AccordionListItem title="Заголовок" showCheckbox onCheckedChange={onCheckedChange}>
        Содержимое
      </AccordionListItem>
    )

    const trigger = screen.getByText("Заголовок").closest('[data-slot="accordion-list-trigger"]')!
    await user.click(screen.getByRole("checkbox"))

    expect(onCheckedChange).toHaveBeenCalledWith(true, expect.anything())
    expect(trigger).toHaveAttribute("aria-expanded", "false")
  })

  it("calls onButtonClick without toggling the row open", async () => {
    const user = userEvent.setup()
    const onButtonClick = vi.fn()
    render(
      <AccordionListItem
        title="Заголовок"
        showButtons
        buttonsType="button"
        buttonLabel="Действие"
        onButtonClick={onButtonClick}
      >
        Содержимое
      </AccordionListItem>
    )

    const trigger = screen.getByText("Заголовок").closest('[data-slot="accordion-list-trigger"]')!
    await user.click(screen.getByRole("button", { name: "Действие" }))

    expect(onButtonClick).toHaveBeenCalledTimes(1)
    expect(trigger).toHaveAttribute("aria-expanded", "false")
  })

  it("calls onMoreClick from the kebab button without toggling the row open", async () => {
    const user = userEvent.setup()
    const onMoreClick = vi.fn()
    render(
      <AccordionListItem
        title="Заголовок"
        showButtons
        buttonsType="dropdown"
        onMoreClick={onMoreClick}
      >
        Содержимое
      </AccordionListItem>
    )

    const trigger = screen.getByText("Заголовок").closest('[data-slot="accordion-list-trigger"]')!
    await user.click(screen.getByRole("button", { name: "Ещё" }))

    expect(onMoreClick).toHaveBeenCalledTimes(1)
    expect(trigger).toHaveAttribute("aria-expanded", "false")
  })
})
