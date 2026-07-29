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

    expect(screen.queryByRole("status")).not.toBeInTheDocument()
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

      expect(screen.queryByRole("status")).not.toBeInTheDocument()
    })

    it("caps the number of stacked toasts at the limit", () => {
      function MultiHarness() {
        const toast = useToast()
        return (
          <button
            type="button"
            onClick={() => {
              toast.add({ title: "Тост 1", timeout: 0 })
              toast.add({ title: "Тост 2", timeout: 0 })
              toast.add({ title: "Тост 3", timeout: 0 })
              toast.add({ title: "Тост 4", timeout: 0 })
            }}
          >
            Показать все
          </button>
        )
      }
      render(
        <ToastProvider limit={3}>
          <MultiHarness />
          <Toaster />
        </ToastProvider>
      )

      act(() => {
        screen.getByRole("button", { name: "Показать все" }).click()
      })

      expect(screen.getAllByRole("status")).toHaveLength(3)
    })
  })
})
