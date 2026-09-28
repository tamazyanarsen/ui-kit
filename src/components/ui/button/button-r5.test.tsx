import * as React from "react"
import { describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { Button } from "./button"

// Итоговая проверка №4: на время загрузки кнопка получала нативный
// `disabled`, и Chromium переносил фокус с неё на body — после «Сохранить»
// с клавиатуры пользователь оказывался в начале документа.

function Saving({ onClick }: { onClick: () => void }) {
  const [loading, setLoading] = React.useState(false)
  return (
    <Button
      isLoading={loading}
      onClick={() => {
        onClick()
        setLoading(true)
      }}
    >
      Сохранить
    </Button>
  )
}

describe("Button: загрузка не снимает фокус", () => {
  it("без нативного disabled, с aria-disabled", () => {
    render(<Button isLoading>Сохранить</Button>)
    const button = screen.getByRole("button", { name: "Сохранить" })
    expect(button).not.toHaveAttribute("disabled")
    expect(button).toHaveAttribute("aria-disabled", "true")
  })

  it("кнопка остаётся в фокусе, когда переходит в загрузку", async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<Saving onClick={onClick} />)
    const button = screen.getByRole("button", { name: "Сохранить" })
    button.focus()
    await user.keyboard("{Enter}")
    expect(onClick).toHaveBeenCalledTimes(1)
    expect(screen.getByRole("button", { name: "Сохранить" })).toHaveFocus()
  })

  it("во время загрузки клик и Enter не вызывают onClick", async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(
      <Button isLoading onClick={onClick}>
        Сохранить
      </Button>
    )
    const button = screen.getByRole("button", { name: "Сохранить" })
    fireEvent.click(button)
    button.focus()
    await user.keyboard("{Enter}")
    expect(onClick).not.toHaveBeenCalled()
  })

  it("настоящий disabled остаётся нативным", () => {
    render(<Button disabled>Сохранить</Button>)
    expect(screen.getByRole("button", { name: "Сохранить" })).toBeDisabled()
  })
})
