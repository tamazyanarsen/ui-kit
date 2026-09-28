import type * as React from "react"
import { describe, expect, it } from "vitest"
import { render } from "@testing-library/react"

import { Button } from "@/components/ui/button"

import { ButtonMenuBlack } from "./black"

// Проверка правок r7: действия чёрной панели ушли в ButtonMenuRow, а тот
// рисует сначала кнопки, потом прочих детей. Кнопка в своей обёртке
// (`<PermissionGate>`) уезжала в конец: A, B, C превращались в A, C, B.

function Gate({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

const visibleLabels = (container: HTMLElement) =>
  Array.from(
    container.querySelectorAll<HTMLElement>('[data-slot="button-menu-black-actions"] button')
  )
    .filter((button) => !button.closest('[aria-hidden="true"]'))
    .map((button) => button.textContent?.trim())

describe("ButtonMenuBlack: порядок действий", () => {
  it("кнопка в обёртке остаётся на своём месте", () => {
    const { container } = render(
      <ButtonMenuBlack>
        <Button>A</Button>
        <Gate>
          <Button>B</Button>
        </Gate>
        <Button>C</Button>
      </ButtonMenuBlack>
    )
    expect(visibleLabels(container)).toEqual(["A", "B", "C"])
  })

  it("одни кнопки по-прежнему собираются рядом с уходом в «…»", () => {
    const { container } = render(
      <ButtonMenuBlack>
        <Button>A</Button>
        <Button>B</Button>
      </ButtonMenuBlack>
    )
    const actions = container.querySelector('[data-slot="button-menu-black-actions"]')
    expect(actions).toHaveAttribute("data-slot", "button-menu-black-actions")
    expect(container.querySelector('[data-slot="button-menu-black-actions"] [aria-hidden="true"]')).not.toBeNull()
  })
})
