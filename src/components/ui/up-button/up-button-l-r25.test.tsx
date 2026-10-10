import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import { UpButton } from "./up-button"

// Дизайн-чек от 08.10, замечание 25: кнопка L из обычного Button (56 на
// Desktop, 48 на Mobile — один `icon-lg`), тень Universal Shadow, Arrow Up.
describe("UpButton: кнопка L", () => {
  it("icon-lg, тень дизайн-системы и стрелка, а не шеврон", () => {
    render(<UpButton threshold={-1} />)
    const button = screen.getByRole("button", { name: "Наверх" })
    expect(button.className).toContain("size-12")
    expect(button.className).toContain("desktop:size-14")
    expect(button.className).toContain("shadow-universal")
    expect(button.className).not.toContain("size-8")
    // Arrow Up 16: ствол стрелки, а не галочка шеврона.
    expect(button.querySelector("path")?.getAttribute("d")).toMatch(/^M7 11\.536/)
  })
})
