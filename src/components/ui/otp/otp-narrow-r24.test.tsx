import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import { OtpInput } from "./input"

// Аудит 23: после r20 (`max-w-full`) поле кода в десктопной форме сужалось
// по колонке, а кегль и разрядка оставались десктопными (44px, 0.35em):
// восемь цифр в колонке 288 не помещались — видно было «1234567».

describe("OtpInput: в узкой десктопной колонке цифры помещаются", () => {
  it("контейнер поля — контейнерный запрос только в десктопной форме", () => {
    render(<OtpInput length={8} defaultValue="12345678" aria-label="Код" />)
    const container = screen.getByLabelText("Код").parentElement!
    expect(container.className.split(/\s+/)).toContain("desktop:@container/otp")
    expect(container.className.split(/\s+/)).not.toContain("@container/otp")
  })

  it("уже 368px поле берёт мобильный кегль и разрядку", () => {
    render(<OtpInput length={8} defaultValue="12345678" aria-label="Код" />)
    const classes = screen.getByLabelText("Код").className.split(/\s+/)
    expect(classes).toEqual(
      expect.arrayContaining([
        "desktop:@max-[367px]/otp:text-[28px]",
        "desktop:@max-[367px]/otp:leading-[38px]",
        "desktop:@max-[367px]/otp:tracking-[0.29em]",
        "desktop:@max-[367px]/otp:indent-[0.29em]",
      ])
    )
    // Широкая колонка — прежний десктопный кегль.
    expect(classes).toContain("desktop:text-h1")
  })
})
