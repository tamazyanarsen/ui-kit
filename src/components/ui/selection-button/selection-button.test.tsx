import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { SelectionButton } from "./selection-button"

describe("SelectionButton", () => {
  it("renders the default trigger with its label", () => {
    render(<SelectionButton items={[{ text: "Удалить" }]} />)
    expect(screen.getByRole("button", { name: "Ещё" })).toBeInTheDocument()
  })

  it("supports a custom triggerLabel", () => {
    render(<SelectionButton items={[{ text: "Удалить" }]} triggerLabel="Действия" />)
    expect(screen.getByRole("button", { name: "Действия" })).toBeInTheDocument()
  })

  it("opens the menu and calls onSelect for the clicked item", async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    render(
      <SelectionButton
        items={[
          { text: "Редактировать" },
          { text: "Удалить", onSelect, description: "Безвозвратно" },
        ]}
      />
    )

    await user.click(screen.getByRole("button", { name: "Ещё" }))
    expect(await screen.findByText("Редактировать")).toBeInTheDocument()
    expect(screen.getByText("Безвозвратно")).toBeInTheDocument()

    await user.click(screen.getByText("Удалить"))

    expect(onSelect).toHaveBeenCalledTimes(1)
  })

  it("renders no menu when showDropdown is false", async () => {
    const user = userEvent.setup()
    render(<SelectionButton items={[{ text: "Удалить" }]} showDropdown={false} />)

    await user.click(screen.getByRole("button", { name: "Ещё" }))

    expect(screen.queryByText("Удалить")).not.toBeInTheDocument()
  })

  it("accepts a custom trigger element", () => {
    render(
      <SelectionButton
        items={[{ text: "Удалить" }]}
        trigger={<button type="button">Открыть меню</button>}
      />
    )
    expect(screen.getByRole("button", { name: "Открыть меню" })).toBeInTheDocument()
  })
})
