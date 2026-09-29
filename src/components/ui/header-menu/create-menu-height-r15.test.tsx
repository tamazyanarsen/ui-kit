import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { Header } from "@/components/ui/header"
import { CREATE_ITEMS, NAV_ITEMS, ORG_ONE } from "@/test/header-fixtures"

import { CreateMenu } from "./create-menu"

// Аудит 14: панель «Создать» не была ограничена по высоте. В низком окне
// нижний ряд плиток обрезался, а прокрутить было нечем — страница под
// оверлеем заблокирована. У меню навигации в том же ряду предел и своя
// прокрутка были.

describe("CreateMenu: предел высоты и своя прокрутка", () => {
  it("с maxHeight плитки лежат в прокручиваемой области с этим пределом", () => {
    const { container } = render(<CreateMenu items={CREATE_ITEMS} maxHeight={300} />)
    const scroller = container.querySelector<HTMLElement>(".themed-scrollbar")
    expect(scroller).not.toBeNull()
    expect(scroller!.style.maxHeight).toBe("300px")
    expect(scroller!.querySelectorAll('[data-slot="header-create-menu-item"]')).toHaveLength(
      CREATE_ITEMS.length
    )
  })

  it("панель «Создать» в шапке получает предел оверлея", async () => {
    const user = userEvent.setup()
    render(
      <Header type="client" navItems={NAV_ITEMS} organizations={ORG_ONE} createItems={CREATE_ITEMS} />
    )
    await user.click(screen.getByRole("button", { name: "Создать" }))
    await screen.findByText("Платёж по реквизитам")
    const panel = document.querySelector('[data-slot="header-create-menu"]')!
    const scroller = panel.querySelector<HTMLElement>(".themed-scrollbar")
    expect(scroller).not.toBeNull()
    expect(scroller!.style.maxHeight).toContain("--menu-overlay-panel")
  })

  it("без maxHeight раскладка прежняя — без прокручиваемой обёртки", () => {
    const { container } = render(<CreateMenu items={CREATE_ITEMS} />)
    expect(container.querySelector(".themed-scrollbar")).toBeNull()
  })
})
