import { afterEach, describe, expect, it, vi } from "vitest"
import { fireEvent, render } from "@testing-library/react"

import { CardBox } from "./card-box"

// Правки UI-Kit от 25.10, «Блок с внутренней прокруткой — фейд у нижней
// кромки 96 и гаснет в конце списка».

const fade = () => document.querySelector<HTMLElement>('[data-slot="card-box-fade"]')

afterEach(() => vi.restoreAllMocks())

describe("CardBox small: низ «фейд»", () => {
  it("по умолчанию — прежний низ, без фейда", () => {
    render(<CardBox type="small">Контент</CardBox>)
    expect(fade()).toBeNull()
  })

  it("фейд 96 поверх содержимого, указатель не ловит, гаснет за 200 мс ease", () => {
    render(
      <CardBox type="small" bottom="fade">
        Контент
      </CardBox>
    )
    const classes = fade()!.className.split(/\s+/)
    expect(classes).toEqual(
      expect.arrayContaining([
        "h-24",
        "pointer-events-none",
        "bg-linear-to-t",
        "from-(--card-box-bg)",
        "to-transparent",
        "transition-opacity",
        "duration-200",
        "ease-[ease]",
      ])
    )
  })

  it("всё помещается — фейд погашен", () => {
    render(
      <CardBox type="small" bottom="fade">
        Контент
      </CardBox>
    )
    expect(fade()).toHaveAttribute("data-end")
    expect(fade()).toHaveClass("opacity-0")
  })

  it("есть что прокручивать — виден; докрутили — гаснет", () => {
    vi.spyOn(HTMLElement.prototype, "scrollHeight", "get").mockReturnValue(1000)
    vi.spyOn(HTMLElement.prototype, "clientHeight", "get").mockReturnValue(300)
    render(
      <CardBox type="small" bottom="fade">
        Контент
      </CardBox>
    )
    expect(fade()).not.toHaveAttribute("data-end")
    expect(fade()).not.toHaveClass("opacity-0")

    const area = document.querySelector<HTMLElement>('[data-slot="scrollbar"]')!
    area.scrollTop = 700
    fireEvent.scroll(area)
    expect(fade()).toHaveAttribute("data-end")
    expect(fade()).toHaveClass("opacity-0")
  })
})
