import * as React from "react"
import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { OtpInput } from "./input"

describe("OtpInput regressions", () => {
  it.each(["123-456", "123 456", "Код: 123456"])(
    "keeps all digits when pasting %s",
    async (text) => {
      const user = userEvent.setup()
      const onComplete = vi.fn()
      render(<OtpInput aria-label="Код" onComplete={onComplete} />)

      await user.click(screen.getByLabelText("Код"))
      await user.paste(text)

      expect(screen.getByLabelText("Код")).toHaveValue("123456")
      expect(onComplete).toHaveBeenCalledWith("123456")
    }
  )

  it("still caps typed input at length", async () => {
    const user = userEvent.setup()
    render(<OtpInput aria-label="Код" length={4} />)
    await user.type(screen.getByLabelText("Код"), "123456")
    expect(screen.getByLabelText("Код")).toHaveValue("1234")
  })

  it("forwards ref and renders no empty caption for error={true}", () => {
    const ref = React.createRef<HTMLInputElement>()
    const { container } = render(<OtpInput ref={ref} aria-label="Код" error />)
    expect(ref.current).toBe(screen.getByLabelText("Код"))
    expect(container.querySelector("p")).toBeNull()
  })
})
