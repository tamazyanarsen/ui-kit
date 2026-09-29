import { describe, expect, it } from "vitest"
import { render } from "@testing-library/react"

import { ErrorPage } from "./error-page"

// r27: маскот без цифр держал высоту 160px при aspect-ratio, и на ширине
// колонки меньше 232px ширина выходила за неё. Теперь ширина — от высоты
// 160px, но не больше колонки (высота следует за пропорцией).

describe("ErrorPage: маскот в узкой колонке", () => {
  it("ширина ограничена колонкой, высота не фиксирована", () => {
    const { container } = render(<ErrorPage title="Ошибка" />)
    const mascot = container.querySelector(".error-page-mascot-image")!
    expect(mascot).toHaveClass("max-w-full")
    expect(mascot).not.toHaveClass("h-40")
  })
})
