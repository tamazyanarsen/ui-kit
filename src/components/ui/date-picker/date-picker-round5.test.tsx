import { describe, expect, it } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { DatePicker } from "./date-picker"

// Пятый проход: у поповера не было Trigger, и всё, что Base UI делает для
// него сам, чинилось частными случаями — они и ломались.
describe("DatePicker focus with a real trigger", () => {
  it("Escape closes the calendar while focus is in the field", async () => {
    const user = userEvent.setup()
    render(<DatePicker />)
    const field = screen.getByLabelText("Дата")

    await user.click(field)
    await screen.findByRole("button", { name: "Применить" })
    await user.keyboard("{Escape}")

    await waitFor(() => expect(field).toHaveAttribute("aria-expanded", "false"))
    expect(document.activeElement).toBe(field)
  })

  it("clicking another field keeps focus there", async () => {
    const user = userEvent.setup()
    render(
      <>
        <DatePicker />
        <input aria-label="Другое поле" />
      </>
    )
    const other = screen.getByLabelText("Другое поле") as HTMLInputElement

    await user.click(screen.getByLabelText("Дата"))
    await screen.findByRole("button", { name: "Применить" })
    await user.click(other)
    await user.keyboard("abc")

    await waitFor(() =>
      expect(screen.getByLabelText("Дата")).toHaveAttribute("aria-expanded", "false")
    )
    expect(document.activeElement).toBe(other)
    expect(other.value).toBe("abc")
  })

  it.each(["single", "range"] as const)(
    "%s: Tab from the last calendar button reaches the element after the picker",
    async (mode) => {
      const user = userEvent.setup()
      render(
        <>
          <DatePicker mode={mode} />
          <button type="button">Дальше</button>
        </>
      )
      const field = screen.getByRole("textbox")

      await user.click(field)
      if (mode === "single") await user.keyboard("{ArrowDown}")
      const apply = await screen.findByRole("button", { name: "Применить" })
      apply.focus()
      await user.tab()

      expect(document.activeElement).toBe(screen.getByRole("button", { name: "Дальше" }))
      await waitFor(() => expect(field).toHaveAttribute("aria-expanded", "false"))
    }
  )

  it("a closed picker is one Tab stop: the icon is skipped", async () => {
    const user = userEvent.setup()
    render(
      <>
        <DatePicker />
        <button type="button">Дальше</button>
      </>
    )

    await user.tab()
    await user.tab()

    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Дальше" }))
  })

  it("Shift+Tab from the field closes the calendar and moves back", async () => {
    const user = userEvent.setup()
    render(
      <>
        <button type="button">Назад к началу</button>
        <DatePicker />
      </>
    )
    const field = screen.getByLabelText("Дата")

    await user.click(field)
    await screen.findByRole("button", { name: "Применить" })
    await user.tab({ shift: true })

    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Назад к началу" }))
    await waitFor(() => expect(field).toHaveAttribute("aria-expanded", "false"))
  })

  it("the calendar icon is a trigger that opens the calendar", async () => {
    const user = userEvent.setup()
    render(<DatePicker />)

    await user.click(screen.getByRole("button", { name: "Открыть календарь" }))

    expect(await screen.findByRole("button", { name: "Применить" })).toBeInTheDocument()
    expect(screen.getByLabelText("Дата")).toHaveAttribute("aria-expanded", "true")
  })
})
