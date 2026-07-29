import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { ButtonMenu } from "./root"
import { ButtonMenuOverflow, ButtonMenuOverflowItem } from "./overflow"
import { Button } from "@/components/ui/button"

describe("ButtonMenu", () => {
  it("renders its children", () => {
    render(
      <ButtonMenu>
        <Button>Primary</Button>
      </ButtonMenu>
    )
    expect(screen.getByRole("button", { name: "Primary" })).toBeInTheDocument()
  })
})

describe("ButtonMenuOverflow", () => {
  it("opens the menu and calls onClick on an item", async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(
      <ButtonMenuOverflow>
        <ButtonMenuOverflowItem text="Удалить" description="Безвозвратно" onClick={onClick} />
      </ButtonMenuOverflow>
    )

    expect(screen.queryByText("Удалить")).not.toBeInTheDocument()

    await user.click(screen.getByRole("button", { name: "Ещё" }))

    const item = await screen.findByText("Удалить")
    expect(screen.getByText("Безвозвратно")).toBeInTheDocument()

    await user.click(item)
    expect(onClick).toHaveBeenCalledTimes(1)
  })
})
