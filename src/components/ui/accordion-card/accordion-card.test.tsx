import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { AccordionCard } from "./accordion-card"

describe("AccordionCard", () => {
  it("renders title and subtitle", () => {
    render(
      <AccordionCard title="Заголовок" subtitle="Подзаголовок">
        Содержимое
      </AccordionCard>
    )

    expect(screen.getByText("Заголовок")).toBeInTheDocument()
    expect(screen.getByText("Подзаголовок")).toBeInTheDocument()
  })

  it("starts collapsed and expands on click (uncontrolled)", async () => {
    const user = userEvent.setup()
    render(<AccordionCard title="Заголовок">Содержимое</AccordionCard>)

    const trigger = screen.getByRole("button", { name: "Заголовок" })
    expect(trigger).toHaveAttribute("aria-expanded", "false")

    await user.click(trigger)

    expect(trigger).toHaveAttribute("aria-expanded", "true")
  })

  it("honors defaultOpen", () => {
    render(
      <AccordionCard title="Заголовок" defaultOpen>
        Содержимое
      </AccordionCard>
    )

    expect(screen.getByRole("button", { name: "Заголовок" })).toHaveAttribute(
      "aria-expanded",
      "true"
    )
  })

  it("calls onOpenChange with the new open state", async () => {
    const user = userEvent.setup()
    const onOpenChange = vi.fn()
    render(
      <AccordionCard title="Заголовок" onOpenChange={onOpenChange}>
        Содержимое
      </AccordionCard>
    )

    await user.click(screen.getByRole("button", { name: "Заголовок" }))

    expect(onOpenChange).toHaveBeenCalledWith(true)
  })

  it("stays controlled by the `open` prop instead of toggling itself", async () => {
    const user = userEvent.setup()
    const onOpenChange = vi.fn()
    render(
      <AccordionCard title="Заголовок" open={false} onOpenChange={onOpenChange}>
        Содержимое
      </AccordionCard>
    )

    const trigger = screen.getByRole("button", { name: "Заголовок" })
    await user.click(trigger)

    expect(onOpenChange).toHaveBeenCalledWith(true)
    expect(trigger).toHaveAttribute("aria-expanded", "false")
  })
})
