import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import { MenuItemContent } from "./menu-item"

// r25: подпись и описание 0 выводились голым «0» без оформления.

describe("MenuItemContent с числом 0", () => {
  it("label = 0 рисуется в оформленной строке", () => {
    render(<MenuItemContent label={0}>Пункт</MenuItemContent>)
    expect(screen.getByText("0").className).toContain("truncate")
  })

  it("description = 0 рисуется в оформленной строке", () => {
    render(<MenuItemContent description={0}>Пункт</MenuItemContent>)
    expect(screen.getByText("0").className).toContain("truncate")
  })
})
