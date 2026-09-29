import { describe, expect, it } from "vitest"
import { fireEvent, render, screen } from "@testing-library/react"

import { ToastProvider, Toaster } from "./toast-message"
import { useToast } from "./use-toast"

// Раунд 25, узкая колонка. Строка тоста — `display: grid` без объявленной
// колонки: неявная колонка `auto` растёт до min-content, и тост с длинным
// неразрывным словом (номер договора, ссылка) вылезал за экран — живой
// Chrome на 375: карточка шириной 592 при колонке 343. Колонка обязана быть
// `minmax(0, 1fr)`, а текст — переноситься.

const LONG = "ДоговорНомер1234567890АБВГДЕЖЗИКЛМНОП1234567890QWERTY"

function Add() {
  const { add } = useToast()
  return (
    <button type="button" onClick={() => add({ title: LONG, description: LONG, timeout: 0 })}>
      Показать
    </button>
  )
}

describe("Toast: длинное слово", () => {
  it("колонка строки не растёт от содержимого, текст переносится", () => {
    render(
      <ToastProvider>
        <Add />
        <Toaster />
      </ToastProvider>
    )
    fireEvent.click(screen.getByText("Показать"))
    const row = document.querySelector("[data-slot=toast-row]") as HTMLElement
    expect(row.className).toContain("grid-cols-[minmax(0,1fr)]")
    const [title, description] = [
      screen.getAllByText(LONG)[0],
      screen.getAllByText(LONG)[1],
    ]
    expect(title).toHaveClass("break-words")
    expect(description).toHaveClass("break-words")
  })
})
