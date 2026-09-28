import * as React from "react"
import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import { Button } from "@/components/ui/button"

import { ButtonMenuBlack } from "./black"
import { ButtonMenu } from "./root"
import { ButtonMenuOverflow, ButtonMenuOverflowItem } from "./overflow"
import { ButtonMenuRow } from "./row"

describe("ref у Button Menu", () => {
  it("доезжает до узла полосы и не ломает внутренний замер", () => {
    const white = React.createRef<HTMLDivElement>()
    const black = React.createRef<HTMLDivElement>()
    const row = React.createRef<HTMLDivElement>()
    render(
      <>
        <ButtonMenu ref={white} />
        <ButtonMenuBlack ref={black} />
        <ButtonMenuRow ref={row} />
      </>
    )
    expect(white.current).toHaveAttribute("data-slot", "button-menu")
    expect(black.current).toHaveAttribute("data-slot", "button-menu-black")
    expect(row.current).toHaveAttribute("data-slot", "button-menu-row")
  })

  it("доезжает до строки меню «ещё»", () => {
    const item = React.createRef<HTMLDivElement>()
    render(
      <ButtonMenuOverflow defaultOpen>
        <ButtonMenuOverflowItem ref={item} text="Удалить" />
      </ButtonMenuOverflow>
    )
    expect(item.current).toHaveAttribute("data-slot", "button-menu-overflow-item")
  })
})

describe("ButtonMenuRow: ключи кнопок", () => {
  it("кнопка, вставленная в начало, не сдвигает фокус на соседку", () => {
    const { rerender } = render(
      <ButtonMenuRow>
        <Button key="a">Альфа</Button>
        <Button key="b">Бета</Button>
      </ButtonMenuRow>
    )
    const beta = screen.getAllByRole("button", { name: "Бета" })[0]
    beta.focus()
    rerender(
      <ButtonMenuRow>
        <Button key="c">Гамма</Button>
        <Button key="a">Альфа</Button>
        <Button key="b">Бета</Button>
      </ButtonMenuRow>
    )
    expect(document.activeElement).toBe(beta)
    expect(document.activeElement).toHaveTextContent("Бета")
  })
})
