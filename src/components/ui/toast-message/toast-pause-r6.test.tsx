import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { act, fireEvent, render, screen } from "@testing-library/react"

import { ToastProvider, Toaster } from "./toast-message"
import { useToast } from "./use-toast"

// Аудит r6: щелчок мышью по кнопке действия тоста оставлял на ней фокус, и
// после увода курсора очередь стояла на паузе — тосты не закрывались, пока
// пользователь не щёлкнет где-то ещё.

let api: ReturnType<typeof useToast>

function Capture() {
  api = useToast()
  return null
}

function renderToaster() {
  const utils = render(
    <ToastProvider timeout={1000}>
      <Capture />
      <Toaster />
    </ToastProvider>
  )
  const column = utils.container.querySelector("[aria-live]") as HTMLElement
  return { ...utils, column }
}

beforeEach(() => vi.useFakeTimers())
afterEach(() => vi.useRealTimers())

describe("Toast: фокус от щелчка мышью не держит паузу", () => {
  it("после щелчка по действию и увода курсора тост закрывается", () => {
    const { column } = renderToaster()
    act(
      () =>
        void api.add({
          title: "С действием",
          data: { primaryButtonLabel: "Повторить", onPrimaryButtonClick: () => {} },
        })
    )
    const action = screen.getByRole("button", { name: "Повторить" })
    // Порядок событий настоящего щелчка: фокус приходит между нажатием и
    // отпусканием.
    fireEvent.mouseEnter(column)
    fireEvent.pointerDown(action)
    fireEvent.mouseDown(action)
    act(() => action.focus())
    fireEvent.pointerUp(action)
    fireEvent.mouseUp(action)
    fireEvent.click(action)
    expect(document.activeElement).toBe(action)
    fireEvent.mouseLeave(column)

    act(() => void vi.advanceTimersByTime(1400))
    expect(screen.queryByText("С действием")).not.toBeInTheDocument()
  })

  it("фокус с клавиатуры по-прежнему держит паузу", () => {
    const { column } = renderToaster()
    act(() => void api.add({ title: "Читаю с клавиатуры" }))
    // Щелчок по тексту фокуса не дал — флаг не должен дожить до Tab.
    fireEvent.pointerDown(screen.getByText("Читаю с клавиатуры"))
    fireEvent.pointerUp(screen.getByText("Читаю с клавиатуры"))
    act(() => screen.getByRole("button", { name: "Закрыть" }).focus())
    expect(column.contains(document.activeElement)).toBe(true)

    act(() => void vi.advanceTimersByTime(3000))
    expect(screen.getByText("Читаю с клавиатуры")).toBeInTheDocument()
  })

  // Проверка правок r6: кнопку отпустили за колонкой — `pointerup` в колонку
  // не пришёл, и флаг «фокус от мыши» доживал до Tab с клавиатуры.
  it("отпускание за колонкой не глушит паузу от Tab", () => {
    const { column } = renderToaster()
    act(() => void api.add({ title: "Выделяю и увожу" }))
    fireEvent.mouseEnter(column)
    fireEvent.pointerDown(screen.getByText("Выделяю и увожу"))
    fireEvent.mouseLeave(column)
    fireEvent.pointerUp(document.body)
    act(() => screen.getByRole("button", { name: "Закрыть" }).focus())

    act(() => void vi.advanceTimersByTime(3000))
    expect(screen.getByText("Выделяю и увожу")).toBeInTheDocument()
  })
})
