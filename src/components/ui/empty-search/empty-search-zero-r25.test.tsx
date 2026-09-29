import { describe, expect, it } from "vitest"
import { render } from "@testing-library/react"

import { EmptySearchResults } from "./empty-search"

// Аудит r25: `description={0}` (`description && …`) рисовал голый «0» в
// колонке текста — без абзаца описания.

describe("EmptySearchResults: описание 0", () => {
  it("рисуется абзацем описания", () => {
    const { container } = render(<EmptySearchResults title="Пусто" description={0} />)
    expect(container.querySelector("p")).toHaveTextContent("0")
  })

  it("пустая строка абзац не рисует", () => {
    const { container } = render(<EmptySearchResults title="Пусто" description="" />)
    expect(container.querySelector("p")).toBeNull()
  })
})
