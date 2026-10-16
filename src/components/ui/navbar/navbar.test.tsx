import { act, fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { Navbar } from "./navbar"

describe("Navbar", () => {
  it("Top: «Назад» с подписью и круглая справка", () => {
    const onBack = vi.fn()
    const onHelp = vi.fn()
    render(<Navbar type="top" onBack={onBack} onHelp={onHelp} date="21 сентября" />)
    const nav = screen.getByRole("navigation")
    expect(nav).toHaveAttribute("data-type", "top")
    fireEvent.click(screen.getByRole("button", { name: "Назад" }))
    fireEvent.click(screen.getByRole("button", { name: "Справка" }))
    expect(onBack).toHaveBeenCalledTimes(1)
    expect(onHelp).toHaveBeenCalledTimes(1)
    // Дата — только в типе Scroll.
    expect(screen.queryByText("21 сентября")).toBeNull()
  })

  it("Scroll: «Назад» — круг без подписи, но с доступным именем; дата по центру", () => {
    render(<Navbar type="scroll" date="21 сентября" />)
    const back = screen.getByRole("button", { name: "Назад" })
    expect(back).not.toHaveTextContent("Назад")
    expect(screen.getByText("21 сентября")).toBeInTheDocument()
  })

  it("Show Help = false убирает справку", () => {
    render(<Navbar type="top" showHelp={false} />)
    expect(screen.queryByRole("button", { name: "Справка" })).toBeNull()
  })

  it("auto: переходит в Scroll, когда прокрутка довела полосу до края", () => {
    render(
      <div data-testid="scroller" style={{ overflowY: "auto", height: 200 }}>
        <Navbar date="21 сентября" />
      </div>
    )
    const scroller = screen.getByTestId("scroller")
    const nav = screen.getByRole("navigation")
    expect(nav).toHaveAttribute("data-type", "top")

    // jsdom не считает раскладку: полоса «прилипла» = её верх совпал с
    // верхом прокручиваемого предка.
    scroller.getBoundingClientRect = () => ({ top: 0 }) as DOMRect
    nav.getBoundingClientRect = () => ({ top: 0 }) as DOMRect
    act(() => {
      scroller.scrollTop = 120
      scroller.dispatchEvent(new Event("scroll"))
    })
    expect(nav).toHaveAttribute("data-type", "scroll")

    act(() => {
      scroller.scrollTop = 0
      scroller.dispatchEvent(new Event("scroll"))
    })
    expect(nav).toHaveAttribute("data-type", "top")
  })

  it("auto: пока над полосой есть шапка, тип не меняется", () => {
    render(
      <div data-testid="scroller" style={{ overflowY: "auto", height: 200 }}>
        <Navbar />
      </div>
    )
    const scroller = screen.getByTestId("scroller")
    const nav = screen.getByRole("navigation")
    scroller.getBoundingClientRect = () => ({ top: 0 }) as DOMRect
    nav.getBoundingClientRect = () => ({ top: 30 }) as DOMRect
    act(() => {
      scroller.scrollTop = 20
      scroller.dispatchEvent(new Event("scroll"))
    })
    expect(nav).toHaveAttribute("data-type", "top")
  })
})
