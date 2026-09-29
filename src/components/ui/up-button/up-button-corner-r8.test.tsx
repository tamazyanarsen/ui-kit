import { afterEach, describe, expect, it, vi } from "vitest"
import { act, render, screen } from "@testing-library/react"

import { UpButton } from "./up-button"

// Аудит r8: плавающая NPS в том же правом нижнем углу закрывала кнопку
// «Наверх» — на 375 целиком. Открытая карточка публикует занятую высоту в
// `--floating-corner-inset`, и кнопка встаёт над ней; без карточки отступ
// прежний (над занятым низом вьюпорта).

describe("UpButton: над плавающей карточкой в углу", () => {
  afterEach(() => vi.restoreAllMocks())

  it("отступ снизу — наибольший из занятого низа и занятого угла", () => {
    vi.spyOn(window, "scrollY", "get").mockReturnValue(800)
    render(<UpButton />)
    act(() => void window.dispatchEvent(new Event("scroll")))
    const button = screen.getByRole("button", { name: "Наверх" })
    expect(button.className.split(/\s+/)).toContain(
      "bottom-[max(calc(1.5rem+var(--floating-bottom,0px)),var(--floating-corner-inset,0px))]"
    )
  })
})
