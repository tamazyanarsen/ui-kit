import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import { Item } from "./item"

// r25: число 0 в подписи и комментарии, пустая миниатюра и длинный правый текст.

describe("Item", () => {
  it("text = 0 рисуется внутри оформленной строки", () => {
    render(<Item value="Значение" text={0} />)
    expect(screen.getByText("0").className).toContain("truncate")
  })

  it("comment = 0 рисуется внутри оформленной строки", () => {
    render(<Item value="Значение" comment={0} />)
    expect(screen.getByText("0").className).toContain("line-clamp-5")
  })

  it("thumbnail = null не оставляет пустую обёртку с зазором", () => {
    const { container } = render(<Item value="Значение" thumbnail={null} />)
    expect(container.querySelector(".shrink-0.opacity-50")).toBeNull()
    expect(
      container.querySelector('[data-slot="item"] > span > span.shrink-0')
    ).toBeNull()
  })

  it("thumbnail = «» тоже не рисуется", () => {
    const { container } = render(<Item value="Значение" thumbnail="" />)
    expect(
      container.querySelector('[data-slot="item"] > span > span.shrink-0')
    ).toBeNull()
  })

  it("thumbnail = true по-прежнему рисует плашку по умолчанию", () => {
    const { container } = render(<Item value="Значение" thumbnail />)
    expect(container.querySelector("svg")).not.toBeNull()
  })

  it("длинный правый текст сжимается и переносится, а не выдавливает значение", () => {
    render(
      <Item
        value="Значение"
        rightElement="text"
        rightText="ОченьДлинныйПравыйТекстБезПробеловОченьДлинный"
      />
    )
    const right = screen.getByText(/ОченьДлинный/)
    expect(right.className).toContain("min-w-0")
    expect(right.className).not.toContain("shrink-0")
    expect(right.className).toContain("[overflow-wrap:anywhere]")
  })
})
