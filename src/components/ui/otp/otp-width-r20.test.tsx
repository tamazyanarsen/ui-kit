import { describe, expect, it } from "vitest"
import { render } from "@testing-library/react"

import { OtpInput } from "./input"

// Аудит 19: в десктопной форме контейнер был ровно 368px без ограничения —
// в колонке уже 368 (боковая панель, узкая карточка) поле и подчёркивание
// выходили за край (на 25px в колонке 343).

describe("OtpInput: не шире колонки в десктопной форме", () => {
  it("контейнер ограничен шириной колонки", () => {
    const { container } = render(<OtpInput length={6} />)
    const box = container.querySelector('[data-slot="otp-input"]')!.parentElement!
    expect(box).toHaveClass("desktop:w-[368px]")
    expect(box).toHaveClass("max-w-full")
  })
})
