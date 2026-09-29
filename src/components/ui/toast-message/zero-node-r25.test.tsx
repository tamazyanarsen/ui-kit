import { describe, expect, it } from "vitest"
import { fireEvent, render, screen } from "@testing-library/react"

import { ToastProvider, Toaster } from "./toast-message"
import { useToast } from "./use-toast"

// Раунд 25, класс «{x && …} с числом 0»: описание тоста 0 выводилось голым
// текстом мимо абзаца описания.

function Add() {
  const { add } = useToast()
  return (
    <button type="button" onClick={() => add({ title: "Загружено", description: 0 })}>
      Показать
    </button>
  )
}

describe("Toast: описание-число", () => {
  it("ноль лежит в абзаце описания", () => {
    render(
      <ToastProvider>
        <Add />
        <Toaster />
      </ToastProvider>
    )
    fireEvent.click(screen.getByText("Показать"))
    const card = screen.getByText("Загружено").parentElement as HTMLElement
    expect(card.querySelector("p")?.textContent).toBe("0")
  })
})
