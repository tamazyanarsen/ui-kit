import { afterEach, beforeAll, describe, expect, it, vi } from "vitest"
import { render, screen, act } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { UpButton } from "./up-button"

beforeAll(() => {
  window.scrollTo = vi.fn()
})

function setScrollY(value: number) {
  Object.defineProperty(window, "scrollY", { value, configurable: true })
}

afterEach(() => {
  setScrollY(0)
})

describe("UpButton", () => {
  it("is hidden while scroll is below the threshold", () => {
    render(<UpButton threshold={400} />)
    expect(screen.queryByRole("button")).not.toBeInTheDocument()
  })

  it("appears once scrolled past the threshold", () => {
    render(<UpButton threshold={400} />)

    setScrollY(500)
    act(() => {
      window.dispatchEvent(new Event("scroll"))
    })

    expect(screen.getByRole("button", { name: "Наверх" })).toBeInTheDocument()
  })

  it("scrolls to the top when clicked", async () => {
    const user = userEvent.setup()
    render(<UpButton threshold={400} />)

    setScrollY(500)
    act(() => {
      window.dispatchEvent(new Event("scroll"))
    })
    await user.click(screen.getByRole("button", { name: "Наверх" }))

    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "smooth" })
  })

  it("stays hidden when forced via the hidden prop, even past the threshold", () => {
    render(<UpButton threshold={400} hidden />)

    setScrollY(500)
    act(() => {
      window.dispatchEvent(new Event("scroll"))
    })

    expect(screen.queryByRole("button")).not.toBeInTheDocument()
  })
})
