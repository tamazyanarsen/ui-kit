import type * as React from "react"
import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import { ViewportScope } from "@/lib/viewport"
import { Button } from "@/components/ui/button"

import { ButtonMenuBlack } from "./black"
import { ButtonMenuOverflow, ButtonMenuOverflowItem } from "./overflow"

const scope = (viewport: "desktop" | "mobile") => ({
  wrapper: ({ children }: { children: React.ReactNode }) => (
    <ViewportScope viewport={viewport}>{children}</ViewportScope>
  ),
})

// Ревью 10.10, п. 9: в ветке «не только кнопки» (кнопка в обёртке прав и
// т. п.) «…» получал только тёмный тон, без размера, и на мобильном стоял
// 32px рядом с кнопками L.
describe("ButtonMenuBlack: размер «…» рядом с обёрнутой кнопкой (ревью 10.10, п. 9)", () => {
  function Panel() {
    return (
      <ButtonMenuBlack onClose={() => {}}>
        <span>
          <Button>Подписать</Button>
        </span>
        <ButtonMenuOverflow>
          <ButtonMenuOverflowItem text="Скачать" />
        </ButtonMenuOverflow>
      </ButtonMenuBlack>
    )
  }

  it("мобильный: «…» L, как кнопки панели", () => {
    render(<Panel />, scope("mobile"))
    expect(screen.getByRole("button", { name: "Ещё" }).className).toContain("size-12")
  })

  it("десктоп: «…» по-прежнему 32px", () => {
    render(<Panel />, scope("desktop"))
    expect(screen.getByRole("button", { name: "Ещё" }).className).toContain("size-8")
  })
})
