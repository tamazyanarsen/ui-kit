import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { CloseCross } from "./close-cross"

describe("CloseCross", () => {
  it("имеет доступное имя по умолчанию", () => {
    render(<CloseCross />)
    expect(screen.getByRole("button", { name: "Закрыть" })).toBeInTheDocument()
  })

  it("позволяет переопределить доступное имя", () => {
    render(<CloseCross aria-label="Скрыть подсказку" />)
    expect(
      screen.getByRole("button", { name: "Скрыть подсказку" })
    ).toBeInTheDocument()
  })

  it("вызывает onClick", async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<CloseCross onClick={onClick} />)
    await user.click(screen.getByRole("button"))
    expect(onClick).toHaveBeenCalledOnce()
  })

  it("в выключенном состоянии не нажимается", async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<CloseCross disabled onClick={onClick} />)
    await user.click(screen.getByRole("button"))
    expect(onClick).not.toHaveBeenCalled()
  })

  // Два размера — это два рисунка глифа, а не один растянутый: коробка 24px
  // берёт 24-пиксельный контур.
  it("размер меняет класс глифа", () => {
    const { container: small } = render(<CloseCross size={16} />)
    expect(small.querySelector("svg")).toHaveClass("size-4")
    const { container: large } = render(<CloseCross size={24} />)
    expect(large.querySelector("svg")).toHaveClass("size-6")
  })
})
