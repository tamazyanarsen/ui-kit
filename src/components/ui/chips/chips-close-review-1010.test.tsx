import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import { Chips } from "./chips"

// Ревью 10.10, КК-5: `closable` без `onRemove` рисовал крестик, который
// проигрывал схлопывание и возвращал чипс на место — как сбой.
describe("Chips: крестик только с обработчиком (ревью 10.10, КК-5)", () => {
  it("без onRemove крестика нет", () => {
    render(<Chips closable>Значение</Chips>)
    expect(screen.queryByRole("button", { name: "Удалить" })).toBeNull()
  })

  it("с onRemove крестик есть", () => {
    render(
      <Chips closable onRemove={() => {}}>
        Значение
      </Chips>
    )
    expect(screen.getByRole("button", { name: "Удалить" })).toBeInTheDocument()
  })
})
