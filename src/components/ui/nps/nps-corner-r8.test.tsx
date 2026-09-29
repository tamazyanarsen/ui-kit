import { afterEach, describe, expect, it, vi } from "vitest"
import { render } from "@testing-library/react"

import { Nps } from "./nps"

// Аудит r8: плавающая NPS стояла от кромки экрана и ложилась на закреплённую
// нижнюю панель — её «Отправить» была недоступна, пока опрос не закрыт. И
// закрывала кнопку «Наверх» в том же углу. Встроенная карточка 360px на 375
// давала горизонтальную прокрутку.

const cornerInset = () =>
  document.documentElement.style.getPropertyValue("--floating-corner-inset")

describe("Nps: над занятым низом и не под кнопкой «Наверх»", () => {
  afterEach(() => vi.restoreAllMocks())

  it("отступ плавающей карточки считается от --viewport-inset-bottom", () => {
    const { container } = render(<Nps floating />)
    const classes = (container.firstElementChild as HTMLElement).className.split(/\s+/)
    expect(classes).toContain("bottom-[calc(1rem+var(--floating-bottom,0px))]")
    expect(classes).toContain(
      "desktop:bottom-[calc(2.5rem+var(--floating-bottom,0px))]"
    )
    expect(classes).not.toContain("bottom-4")
  })

  it("плавающая карточка публикует занятый угол и снимает его при закрытии", () => {
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue({
      height: 300,
      width: 360,
      top: 0,
      left: 0,
      right: 360,
      bottom: 300,
    } as DOMRect)
    const { unmount } = render(<Nps floating />)
    // Отступ карточки в jsdom не вычисляется (CSS кита не подключён) — 0;
    // высота 300 + зазор 16.
    expect(cornerInset()).toBe("calc(var(--floating-bottom, 0px) + 316px)")
    unmount()
    expect(cornerInset()).toBe("")
  })

  it("встроенная карточка угол не занимает", () => {
    render(<Nps />)
    expect(cornerInset()).toBe("")
  })

  it("встроенная карточка не шире контейнера", () => {
    const { container } = render(<Nps />)
    expect((container.firstElementChild as HTMLElement).className.split(/\s+/)).toContain(
      "max-w-full"
    )
  })
})
