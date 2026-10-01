import { describe, expect, it } from "vitest"
import { render } from "@testing-library/react"

import { Thumbnail } from "./thumbnail"

// Мастер «ELK / thumbnail» 69.36: Black Icon, Logo, Card/Sticker — миниатюра
// карты, значок у всех типов на одном и том же месте.
describe("Thumbnail — релиз 69.36", () => {
  const root = (c: HTMLElement) => c.querySelector("[data-slot=thumbnail]") as HTMLElement

  it("Black Icon: плитка тёмная, глиф белый", () => {
    const { container } = render(<Thumbnail type="icon" background="black" />)
    expect(root(container).style.backgroundColor).toBe("var(--tag-black-bg)")
    expect(root(container).getAttribute("data-background")).toBe("black")
    expect(container.querySelector("svg")!.getAttribute("class")).toContain("text-white")
  })

  it("Grey и White Icon сохраняют тёмный глиф", () => {
    for (const background of ["grey", "white"] as const) {
      const { container, unmount } = render(<Thumbnail type="icon" background={background} />)
      expect(container.querySelector("svg")!.getAttribute("class")).toContain("--tag-grey-secondary-fg")
      unmount()
    }
  })

  it("Logo: серая плитка, внутри знак 24×24; свой знак подменяет умолчание", () => {
    const { container, rerender } = render(<Thumbnail type="logo" />)
    expect(root(container).style.backgroundColor).toBe("var(--tag-grey-secondary-bg)")
    expect(container.querySelector("img")!.getAttribute("class")).toContain("size-6")
    rerender(<Thumbnail type="logo" logo={<b data-testid="mine" />} />)
    expect(container.querySelector("img")).toBeNull()
    expect(container.querySelector("[data-testid=mine]")).not.toBeNull()
  })

  it("Card и Sticker — миниатюра карты с номером, без заливки плитки", () => {
    for (const type of ["card", "sticker"] as const) {
      const { container, unmount } = render(<Thumbnail type={type} last4="2545" paymentSystem="mastercard" />)
      expect(root(container).style.backgroundColor).toBe("")
      const mini = container.querySelector("[data-slot=thumbnail-mini-card]")!
      expect(mini.textContent).toContain("2545")
      unmount()
    }
  })

  it("Card: блик-вектор, Sticker: серый уголок; M — компактная миниатюра 40×28", () => {
    const card = render(<Thumbnail type="card" size="m" />)
    expect(card.container.querySelector("[data-slot=thumbnail-mini-card] img[src]")).not.toBeNull()
    expect(card.container.querySelector("[data-slot=thumbnail-mini-card]")!.className).not.toContain("desktop:w-12")
    card.unmount()
    const sticker = render(<Thumbnail type="sticker" />)
    expect(sticker.container.querySelector("[data-slot=thumbnail-mini-card] > span[class*=\"rounded-bl\"]")).not.toBeNull()
    expect(sticker.container.querySelector("[data-slot=thumbnail-mini-card]")!.className).toContain("desktop:w-12")
  })

  it("значок: у миниатюры карты на top 4, у прочих (в том числе Image) — на −4", () => {
    const badge = (type: "card" | "picture" | "logo") => {
      const { container, unmount } = render(<Thumbnail type={type} showDot />)
      const cls = container.querySelector("[data-slot=thumbnail] > span:last-child")!.className
      unmount()
      return cls
    }
    expect(badge("card")).toContain("top-1")
    expect(badge("picture")).toContain("top-[-4px]")
    expect(badge("logo")).toContain("top-[-4px]")
  })
})
