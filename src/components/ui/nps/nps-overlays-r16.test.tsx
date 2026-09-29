import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { ButtonMenuOverflow, ButtonMenuOverflowItem } from "@/components/ui/button-menu"
import { Nps } from "./nps"

// Аудит 15: плавающий опрос (слой 80) лежал поверх раскрытых списков
// (слой 50) и меню шапки (40) — раскрытый вверх список «…» у закреплённой
// панели и разделы меню не нажимались. Теперь опрос уходит под любой
// открытый попап Base UI и под оверлей меню шапки.

const UNDER_OVERLAYS =
  "[:root:has([data-side][data-open],[data-slot=header-menu-overlay])_&]:z-[35]"

describe("NPS floating: под открытыми слоями", () => {
  it("плавающая карточка опускается под попапы и меню шапки", () => {
    const { container } = render(<Nps floating />)
    expect(container.querySelector('[data-slot="nps"]')).toHaveClass(UNDER_OVERLAYS)
  })

  it("правило держится за настоящие атрибуты открытого попапа", async () => {
    const user = userEvent.setup()
    render(
      <ButtonMenuOverflow>
        <ButtonMenuOverflowItem text="Удалить" />
      </ButtonMenuOverflow>
    )
    expect(document.querySelector("[data-side][data-open]")).toBeNull()
    await user.click(screen.getByRole("button", { name: /Ещё/ }))
    await screen.findByRole("menu")
    expect(document.querySelector("[data-side][data-open]")).not.toBeNull()
  })

  it("встроенная карточка слой не трогает", () => {
    const { container } = render(<Nps />)
    expect(container.querySelector('[data-slot="nps"]')).not.toHaveClass(UNDER_OVERLAYS)
  })
})
