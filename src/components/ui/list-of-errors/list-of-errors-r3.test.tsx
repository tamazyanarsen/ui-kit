import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import { ListOfErrors } from "./list-of-errors"

// Финальная проверка №2: строки списка шли с ключом по позиции. Ошибка,
// добавленная выше, забирала чужой `li` — фокус внутри строки падал на
// body, анимацию появления проигрывала не новая строка.

function Row({ id }: { id: string }) {
  return <button type="button">{id}</button>
}

describe("ListOfErrors: строки узнаются по ключу ошибки", () => {
  it("добавление ошибки выше не сбрасывает фокус в строке ниже", () => {
    const { rerender } = render(
      <ListOfErrors>
        <Row key="b" id="b" />
        <Row key="c" id="c" />
      </ListOfErrors>
    )
    const b = screen.getByRole("button", { name: "b" })
    const itemOfB = b.closest("li")
    b.focus()

    rerender(
      <ListOfErrors>
        <Row key="a" id="a" />
        <Row key="b" id="b" />
        <Row key="c" id="c" />
      </ListOfErrors>
    )

    expect(screen.getByRole("button", { name: "b" })).toHaveFocus()
    expect(screen.getByRole("button", { name: "b" }).closest("li")).toBe(itemOfB)
  })
})
