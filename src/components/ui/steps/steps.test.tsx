import { beforeAll, describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { Steps } from "./steps"

// The active step scrolls itself into view — not implemented in jsdom.
beforeAll(() => {
  Element.prototype.scrollIntoView = vi.fn()
})

describe("Steps", () => {
  it("renders each step's title and description", () => {
    render(
      <Steps
        steps={[
          { title: "Шаг 1", description: "Заполнение" },
          { title: "Шаг 2", description: "Проверка" },
        ]}
      />
    )
    expect(screen.getByText("Шаг 1")).toBeInTheDocument()
    expect(screen.getByText("Проверка")).toBeInTheDocument()
  })

  it("is clickable only when a step has onClick and isn't disabled", async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(
      <Steps
        steps={[
          { title: "Шаг 1", description: "Заполнение", onClick },
          { title: "Шаг 2", description: "Заблокирован", state: "disabled", onClick: vi.fn() },
        ]}
      />
    )

    await user.click(screen.getByText("Шаг 1"))
    expect(onClick).toHaveBeenCalledTimes(1)

    expect(screen.getByText("Шаг 2").closest('[data-slot="step"]')).not.toHaveAttribute(
      "role",
      "button"
    )
  })

  it("shows a tooltip hint on a disabled step", async () => {
    const user = userEvent.setup()
    render(
      <Steps
        steps={[
          {
            title: "Шаг 2",
            description: "Заблокирован",
            state: "disabled",
            disabledHint: "Заполните предыдущий шаг",
          },
        ]}
      />
    )

    await user.hover(screen.getByText("Шаг 2"))

    expect(
      await screen.findByText("Заполните предыдущий шаг")
    ).toBeInTheDocument()
  })

  it("renders left/right fade nav buttons and calls their handlers", async () => {
    const user = userEvent.setup()
    const onClickLeft = vi.fn()
    const onClickRight = vi.fn()
    render(
      <Steps
        steps={[{ title: "Шаг 1", description: "Заполнение" }]}
        showLeftFade
        showRightFade
        onClickLeft={onClickLeft}
        onClickRight={onClickRight}
      />
    )

    await user.click(screen.getByRole("button", { name: "Назад" }))
    await user.click(screen.getByRole("button", { name: "Далее" }))

    expect(onClickLeft).toHaveBeenCalledTimes(1)
    expect(onClickRight).toHaveBeenCalledTimes(1)
  })
})
