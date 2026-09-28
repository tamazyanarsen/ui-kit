import { afterEach, describe, expect, it, vi } from "vitest"
import { act, render, screen } from "@testing-library/react"

import { UpButton } from "./up-button"

// Аудит r7: кнопка стояла `bottom-6` от кромки экрана и ложилась на правый
// край закреплённой нижней панели — у ButtonMenuBlack точно на крестик
// «Закрыть». Занятый низ вьюпорта панель публикует в
// `--viewport-inset-bottom`, и кнопка обязана стоять над ним.

describe("UpButton: над занятым низом вьюпорта", () => {
  afterEach(() => vi.restoreAllMocks())

  it("отступ снизу учитывает --viewport-inset-bottom", () => {
    vi.spyOn(window, "scrollY", "get").mockReturnValue(800)
    render(<UpButton />)
    act(() => void window.dispatchEvent(new Event("scroll")))
    const button = screen.getByRole("button", { name: "Наверх" })
    expect(button.className).toContain("calc(1.5rem+var(--viewport-inset-bottom,0px))")
    expect(button.className).not.toMatch(/(^|\s)bottom-6(\s|$)/)
  })
})
