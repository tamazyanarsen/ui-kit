import { describe, expect, it } from "vitest"
import { fireEvent, render, screen } from "@testing-library/react"

import { Textarea } from "./textarea"

// Аудит 11: место под плавающую подпись было верхним внутренним отступом
// самой textarea. Отступ входит в прокручиваемую область, и при прокрутке
// длинного текста строки проезжали через место подписи поверх неё. Полоса
// прокрутки при этом была системной, со стрелками.

const classes = (el: HTMLElement) => el.className.split(/\s+/)

describe("Textarea: прокрутка не заезжает под подпись", () => {
  it("место под подпись — внешний отступ, вне прокрутки", () => {
    render(<Textarea label="Комментарий" defaultValue="Текст" />)
    const field = classes(screen.getByRole("textbox"))
    expect(field).toContain("[&:not(:placeholder-shown)]:mt-4")
    expect(field).toContain("focus:mt-4")
    expect(field.some((c) => /(^|:)pt-5$/.test(c))).toBe(false)
  })

  it("полоса прокрутки — кита", () => {
    render(<Textarea label="Комментарий" />)
    expect(screen.getByRole("textbox")).toHaveClass("themed-scrollbar")
  })

  it("без подписи отступа сверху нет", () => {
    render(<Textarea placeholder="Текст" />)
    const field = classes(screen.getByRole("textbox"))
    expect(field.some((c) => /(^|:)m[ty]-[45]$/.test(c))).toBe(false)
  })
})

// Сверка r12: с внешним отступом полоса под поднятой подписью перестала
// быть частью поля — щелчок в неё и по подписи не давал фокуса, хотя на HEAD
// попадал во внутренний отступ самой textarea.
describe("Textarea: нажатие в коробку ставит фокус в поле", () => {
  const box = () => screen.getByRole("textbox").parentElement!

  it("щелчок по подписи — фокус и каретка в конце", () => {
    render(<Textarea label="Комментарий" defaultValue="Текст" />)
    const field = screen.getByRole("textbox") as HTMLTextAreaElement
    fireEvent.mouseDown(screen.getByText("Комментарий"))
    expect(document.activeElement).toBe(field)
    expect(field.selectionStart).toBe(5)
    expect(field.selectionEnd).toBe(5)
  })

  it("щелчок в саму коробку тоже ставит фокус", () => {
    render(<Textarea label="Комментарий" defaultValue="Текст" />)
    fireEvent.mouseDown(box())
    expect(document.activeElement).toBe(screen.getByRole("textbox"))
  })

  it("нажатие в самом поле не отменяется — выделение работает", () => {
    render(<Textarea label="Комментарий" defaultValue="Текст" />)
    const field = screen.getByRole("textbox")
    expect(fireEvent.mouseDown(field)).toBe(true)
  })

  it("выключенное поле, как и раньше, фокус получает", () => {
    render(<Textarea label="Комментарий" disabled defaultValue="Текст" />)
    fireEvent.mouseDown(box())
    expect(document.activeElement).toBe(screen.getByRole("textbox"))
  })

  it("заблокированное поле, как и раньше, фокус получает", () => {
    render(<Textarea label="Комментарий" locked defaultValue="Текст" />)
    fireEvent.mouseDown(box())
    expect(document.activeElement).toBe(screen.getByRole("textbox"))
  })

  // Аудит 13: каретка уводилась в конец при каждом нажатии в коробку — и
  // когда пользователь уже правил середину текста.
  it("в сфокусированном поле щелчок в коробку не двигает каретку", () => {
    render(<Textarea label="Комментарий" defaultValue="Длинный текст комментария" />)
    const field = screen.getByRole("textbox") as HTMLTextAreaElement
    field.focus()
    field.setSelectionRange(3, 3)
    fireEvent.mouseDown(screen.getByText("Комментарий"))
    expect(document.activeElement).toBe(field)
    expect(field.selectionStart).toBe(3)
  })
})
