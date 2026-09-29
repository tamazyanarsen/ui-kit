import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import { Nps } from "./nps"

// r27: `value={0}` (пустая оценка из формы) раскрывал панель отзыва и рисовал
// под звёздами голый «0»; строка «5» не отмечала звезду.

describe("Nps: значение вне 1–5", () => {
  it("0 — это «оценки нет»: ни «0» под звёздами, ни отмеченной звезды", () => {
    const { container } = render(<Nps value={0 as never} />)
    expect(container.textContent).not.toMatch(/(^|[^\d])0([^\d]|$)/)
    expect(screen.queryByRole("radio", { checked: true })).toBeNull()
    expect(container.querySelector("[aria-hidden=true][inert], [inert]")).not.toBeNull()
  })

  it("строка «5» отмечает пятую звезду", () => {
    render(<Nps value={"5" as never} />)
    expect(screen.getByRole("radio", { checked: true, name: /^5 из 5/ })).toBeInTheDocument()
  })
})
