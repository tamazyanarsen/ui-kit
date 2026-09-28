import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import { Button } from "@/components/ui/button"

import { ButtonMenuBlack } from "./black"

// Итоговая проверка №4: ButtonMenuBlack обходил детей `Children.map`, который
// фрагмент не раскрывает. Кнопка внутри `<>…</>` не получала принудительные
// `size="sm"` и `variant="secondary-white"` — брендовая «Подписать» снова
// оказывалась голубой на чёрной панели.

describe("ButtonMenuBlack: кнопки во фрагменте", () => {
  it("получают белый вариант и размер sm, как прямые дети", () => {
    render(
      <ButtonMenuBlack selectedCount={1}>
        <Button>Прямая</Button>
        <>
          <Button variant="primary">Подписать</Button>
        </>
      </ButtonMenuBlack>
    )
    const direct = screen.getByRole("button", { name: "Прямая" })
    const inFragment = screen.getByRole("button", { name: "Подписать" })
    expect(inFragment.className).toBe(direct.className)
  })
})
