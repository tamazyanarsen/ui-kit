import { describe, expect, it, vi, beforeEach, afterEach } from "vitest"
import { render, screen, act } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { ToastProvider, Toaster } from "./toast-message"
import { useToast } from "./use-toast"

function AddToastButton(props: Parameters<ReturnType<typeof useToast>["add"]>[0]) {
  const toast = useToast()
  return (
    <button type="button" onClick={() => toast.add(props)}>
      Показать тост
    </button>
  )
}

function Harness(props: Parameters<ReturnType<typeof useToast>["add"]>[0]) {
  return (
    <ToastProvider>
      <AddToastButton {...props} />
      <Toaster />
    </ToastProvider>
  )
}

describe("Toast", () => {
  it("shows a toast when added and closes it via its X button", async () => {
    const user = userEvent.setup()
    render(<Harness title="Скопировано" />)

    expect(screen.queryByRole("status")).not.toBeInTheDocument()

    await user.click(screen.getByRole("button", { name: "Показать тост" }))

    expect(screen.getByRole("status")).toHaveTextContent("Скопировано")

    await user.click(screen.getByRole("button", { name: "Закрыть" }))

    // Закрытие в два шага: карточка сперва помечается уходящей и доигрывает
    // анимацию, и только потом снимается (дизайн-чек от 08.09, замечание 15).
    expect(screen.getByRole("status")).toHaveAttribute("data-closing", "true")
    await screen.findByRole("button", { name: "Показать тост" })
    await vi.waitFor(() =>
      expect(screen.queryByRole("status")).not.toBeInTheDocument()
    )
  })

  it("renders the description and primary/secondary buttons", async () => {
    const user = userEvent.setup()
    const onPrimaryButtonClick = vi.fn()
    render(
      <Harness
        title="Ошибка"
        description="Не удалось сохранить"
        data={{ primaryButtonLabel: "Повторить", onPrimaryButtonClick }}
      />
    )

    await user.click(screen.getByRole("button", { name: "Показать тост" }))

    expect(screen.getByText("Не удалось сохранить")).toBeInTheDocument()
    await user.click(screen.getByRole("button", { name: "Повторить" }))
    expect(onPrimaryButtonClick).toHaveBeenCalledTimes(1)
  })

  describe("with fake timers", () => {
    beforeEach(() => vi.useFakeTimers())
    afterEach(() => vi.useRealTimers())

    it("auto-dismisses after its timeout", async () => {
      render(<Harness title="Скопировано" timeout={1000} />)

      act(() => {
        screen.getByRole("button", { name: "Показать тост" }).click()
      })
      expect(screen.getByRole("status")).toBeInTheDocument()

      await act(async () => {
        vi.advanceTimersByTime(1000)
      })
      // Истёкший тост уходит анимированно, а не пропадает кадром.
      expect(screen.getByRole("status")).toHaveAttribute("data-closing", "true")

      await act(async () => {
        vi.advanceTimersByTime(400)
      })

      expect(screen.queryByRole("status")).not.toBeInTheDocument()
    })

    /* Дизайн-чек от 08.09, замечание 14: «Нажал копирование несколько раз (7),
       но тостов предельно возникает три… Предел нужно убрать». Раньше здесь
       был обратный тест — «caps the number of stacked toasts at the limit». */
    it("не ограничивает количество тостов и добавляет новые в конец", () => {
      function MultiHarness() {
        const toast = useToast()
        return (
          <button
            type="button"
            onClick={() => {
              for (let index = 1; index <= 7; index += 1) {
                toast.add({ title: `Тост ${index}`, timeout: 0 })
              }
            }}
          >
            Показать все
          </button>
        )
      }
      render(
        <ToastProvider>
          <MultiHarness />
          <Toaster />
        </ToastProvider>
      )

      act(() => {
        screen.getByRole("button", { name: "Показать все" }).click()
      })

      const shown = screen.getAllByRole("status")
      expect(shown).toHaveLength(7)
      // Новые — ниже: первый в разметке самый старый.
      expect(shown[0]).toHaveTextContent("Тост 1")
      expect(shown[6]).toHaveTextContent("Тост 7")
    })
  })
})
