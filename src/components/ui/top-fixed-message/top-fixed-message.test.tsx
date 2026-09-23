import * as React from "react"
import { describe, expect, it, vi } from "vitest"
import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { ViewportScope } from "@/lib/viewport"

import { TopFixedMessage } from "./top-fixed-message"

// jsdom не умеет matchMedia, поэтому `useIsDesktop()` без обёртки всегда
// отвечает «мобайл». Форму здесь задаёт `<ViewportScope>` — тот же
// механизм, что и в матрице Storybook, — иначе десктопная ветка просто не
// проверялась бы.
function Desktop({ children }: { children: React.ReactNode }) {
  return <ViewportScope viewport="desktop">{children}</ViewportScope>
}

function Mobile({ children }: { children: React.ReactNode }) {
  return <ViewportScope viewport="mobile">{children}</ViewportScope>
}

describe("TopFixedMessage", () => {
  it("renders the text", () => {
    render(<TopFixedMessage text="Плановые технические работы" />)
    expect(screen.getByText("Плановые технические работы")).toBeInTheDocument()
  })

  it("renders the action button and calls onButtonClick", async () => {
    const user = userEvent.setup()
    const onButtonClick = vi.fn()
    render(
      <TopFixedMessage
        text="Сообщение"
        showButton
        buttonLabel="Подробнее"
        onButtonClick={onButtonClick}
      />
    )

    await user.click(screen.getByRole("button", { name: "Подробнее" }))

    expect(onButtonClick).toHaveBeenCalledTimes(1)
  })

  describe("десктопная форма", () => {
    it("shows a 24px icon by default and can hide it", () => {
      const { container, rerender } = render(
        <Desktop>
          <TopFixedMessage text="Сообщение" />
        </Desktop>
      )
      expect(container.querySelector("svg")).toHaveAttribute("viewBox", "0 0 24 24")

      rerender(
        <Desktop>
          <TopFixedMessage text="Сообщение" showIcon={false} />
        </Desktop>
      )
      // Only the close (X) icon remains once the leading alert icon is hidden.
      expect(container.querySelectorAll("svg")).toHaveLength(1)
    })

    it("closes via the cross and hides it when showIconClose is false", async () => {
      const user = userEvent.setup()
      const onClose = vi.fn()
      const { rerender } = render(
        <Desktop>
          <TopFixedMessage text="Сообщение" onClose={onClose} />
        </Desktop>
      )

      const cross = screen.getByRole("button", { name: "Закрыть" })
      expect(cross).toHaveAttribute("data-slot", "close-cross")
      await user.click(cross)
      expect(onClose).toHaveBeenCalledTimes(1)

      rerender(
        <Desktop>
          <TopFixedMessage text="Сообщение" showIconClose={false} />
        </Desktop>
      )
      expect(screen.queryByRole("button", { name: "Закрыть" })).not.toBeInTheDocument()
    })
  })

  describe("мобильная форма", () => {
    it("draws the 16px icon and no close cross", () => {
      const { container } = render(
        <Mobile>
          <TopFixedMessage text="Сообщение" />
        </Mobile>
      )

      expect(container.querySelector("svg")).toHaveAttribute("viewBox", "0 0 16 16")
      expect(container.querySelector("[data-slot='close-cross']")).toBeNull()
    })

    it("closes via the «Закрыть» button", async () => {
      const user = userEvent.setup()
      const onClose = vi.fn()
      render(
        <Mobile>
          <TopFixedMessage text="Сообщение" onClose={onClose} />
        </Mobile>
      )

      await user.click(screen.getByRole("button", { name: "Закрыть" }))

      expect(onClose).toHaveBeenCalledTimes(1)
    })

    // Ось Type сета `Buttons Top Fix (ELK)`: Two Buttons | Main | Close.
    it.each([
      { showButton: true, showIconClose: true, buttons: ["Подробнее", "Закрыть"] },
      { showButton: true, showIconClose: false, buttons: ["Подробнее"] },
      { showButton: false, showIconClose: true, buttons: ["Закрыть"] },
    ])(
      "ряд кнопок: showButton=$showButton showIconClose=$showIconClose",
      ({ showButton, showIconClose, buttons }) => {
        const { container } = render(
          <Mobile>
            <TopFixedMessage
              text="Сообщение"
              showButton={showButton}
              buttonLabel="Подробнее"
              showIconClose={showIconClose}
            />
          </Mobile>
        )

        const message = container.querySelector<HTMLElement>(
          "[data-slot='top-fixed-message']"
        )!
        expect(
          within(message)
            .getAllByRole("button")
            .map((button) => button.textContent)
        ).toEqual(buttons)
      }
    )

    it("не рисует пустой ряд кнопок, когда оба слота выключены", () => {
      const { container } = render(
        <Mobile>
          <TopFixedMessage text="Сообщение" showButton={false} showIconClose={false} />
        </Mobile>
      )

      expect(container.querySelectorAll("button")).toHaveLength(0)
    })
  })
})
