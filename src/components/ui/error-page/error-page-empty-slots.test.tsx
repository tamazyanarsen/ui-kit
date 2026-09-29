import { describe, expect, it } from "vitest"
import { render } from "@testing-library/react"

import { ErrorPage } from "./error-page"

// Пустой слот не оставляет после себя обёртки, а значит и зазора: раньше у
// описания стоял собственный `mt-2`, у иллюстрации — `mt-12`, и они
// оставались при пустом заголовке или пустом тексте. Геометрию (нули вместо
// зазоров) проверяет сценарий content-status-figma в живом Chrome, здесь —
// состав детей корня.

const rootOf = (ui: React.ReactElement) =>
  render(ui).container.querySelector<HTMLElement>("[data-slot=error-page]")!

describe("ErrorPage: пустые слоты", () => {
  it("без текста и кнопки в корне только иллюстрация", () => {
    const root = rootOf(<ErrorPage type="404" />)
    expect(root.children).toHaveLength(1)
    expect(root.firstElementChild).toHaveAttribute("data-slot", "error-page-illustration")
  })

  it("только описание — без заголовка, и абзац первый в группе текста", () => {
    const root = rootOf(<ErrorPage description="Описание" />)
    expect(root.querySelector("h1")).toBeNull()
    const text = root.querySelector("p")!.parentElement!
    expect(text.firstElementChild?.tagName).toBe("P")
    expect(text.children).toHaveLength(1)
  })

  it("только кнопка — группа текста не рисуется", () => {
    const root = rootOf(<ErrorPage buttonLabel="На главную" />)
    expect(root.querySelector("h1, p")).toBeNull()
    expect(root.querySelector("button")).not.toBeNull()
  })
})
