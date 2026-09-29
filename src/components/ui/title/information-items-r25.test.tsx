import { describe, expect, it } from "vitest"
import { render } from "@testing-library/react"

import { TitleInformationText } from "./information-text"

// Раунд 25, класс «.map по массиву без отбрасывания пустых»: пары
// информационного текста собирают условно, и `false` в списке ронял
// компонент (`false.label`).

describe("TitleInformationText: пустые элементы списка", () => {
  it("false и null пропускаются", () => {
    const items = [
      { label: "Договор", value: "№ 5" },
      false,
      null,
      { label: "Дата", value: "01.02.2026" },
    ] as unknown as { label: string; value: string }[]
    const { container } = render(<TitleInformationText type="text" items={items} />)
    expect(container.textContent).toBe("Договор№ 5Дата01.02.2026")
  })
})
