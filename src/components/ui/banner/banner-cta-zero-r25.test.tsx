import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import { Banner } from "./banner"

// Аудит r25: `ctaLabel={0}` (`ctaLabel && …`) выводил голый «0» в колонку
// баннера вместо кнопки.

describe("Banner: подпись кнопки 0", () => {
  it.each(["desktop", "compact", "mobile"] as const)("%s: рисуется кнопкой", (size) => {
    render(<Banner size={size} title="Заголовок" ctaLabel={0} />)
    expect(screen.getByRole("button", { name: "0" })).toBeInTheDocument()
  })

  it("пустая строка кнопку не рисует", () => {
    render(<Banner title="Заголовок" ctaLabel="" />)
    expect(screen.queryByRole("button")).toBeNull()
  })
})
