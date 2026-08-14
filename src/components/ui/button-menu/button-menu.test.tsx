import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { ButtonMenu } from "./root"
import { ButtonMenuBlack } from "./black"
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

  // «Панель всегда закреплена в нижней части экрана» — закрепление включено
  // по умолчанию, а не по требованию.
  it("is pinned to the bottom by default", () => {
    const { container } = render(
      <ButtonMenu>
        <Button>Primary</Button>
      </ButtonMenu>
    )
    const bar = container.querySelector('[data-slot="button-menu"]')
    expect(bar).toHaveAttribute("data-pinned", "true")
    expect(bar).toHaveClass("sticky")
  })

  it("can be unpinned", () => {
    const { container } = render(
      <ButtonMenu pinned={false}>
        <Button>Primary</Button>
      </ButtonMenu>
    )
    const bar = container.querySelector('[data-slot="button-menu"]')
    expect(bar).not.toHaveAttribute("data-pinned")
    expect(bar).not.toHaveClass("sticky")
  })
})

describe("ButtonMenuBlack", () => {
  it("is pinned to the bottom by default and can be unpinned", () => {
    const { container, rerender } = render(
      <ButtonMenuBlack>
        <Button>Подписать</Button>
      </ButtonMenuBlack>
    )
    expect(container.querySelector('[data-slot="button-menu-black"]')).toHaveClass("sticky")

    rerender(
      <ButtonMenuBlack pinned={false}>
        <Button>Подписать</Button>
      </ButtonMenuBlack>
    )
    expect(container.querySelector('[data-slot="button-menu-black"]')).not.toHaveClass("sticky")
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
