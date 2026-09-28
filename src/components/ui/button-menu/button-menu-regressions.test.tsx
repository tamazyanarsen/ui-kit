import * as React from "react"
import { afterEach, describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"

import { Button } from "@/components/ui/button"

import { ButtonMenuBlack } from "./black"
import { ButtonMenu } from "./root"
import { ButtonMenuOverflow, ButtonMenuOverflowItem } from "./overflow"
import { ButtonMenuRow } from "./row"

const inset = () =>
  document.documentElement.style.getPropertyValue("--viewport-inset-bottom")

describe("ButtonMenuBlack: занятый низ вьюпорта", () => {
  afterEach(() => vi.restoreAllMocks())

  it("перемеряет новый узел панели, когда появляется кнопка «Выбрать на всех страницах»", () => {
    // Панель — 72, блок «кнопка + панель» — 136; обе у самого низа экрана.
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (
      this: HTMLElement
    ) {
      const height = this.dataset.slot === "button-menu-black" ? 72 : 136
      return { top: window.innerHeight - height, height } as DOMRect
    })
    const props = { selectAllPagesCount: 10, onSelectAllPages: () => {} }
    const { rerender } = render(<ButtonMenuBlack {...props} selectedCount={10} />)
    expect(inset()).toBe("72px")

    rerender(<ButtonMenuBlack {...props} selectedCount={3} />)
    expect(inset()).toBe("72px")

    rerender(<ButtonMenuBlack {...props} selectedCount={10} />)
    expect(inset()).toBe("72px")
  })
})

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
