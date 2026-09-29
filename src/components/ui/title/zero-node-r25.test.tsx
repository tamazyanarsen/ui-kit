import { describe, expect, it } from "vitest"
import { render } from "@testing-library/react"

import { TitleCard } from "./title-card"
import { TitleRegistry } from "./title-registry"

// Раунд 25, класс «{x && …} с числом 0». Тег-счётчик 0 пропадал (`tag ||
// information` считал его пустотой), а описание 0 выводилось голым текстом
// мимо абзаца.

describe("Title: числа-узлы", () => {
  it("тег 0 в карточке заголовка рисуется", () => {
    const { container } = render(<TitleCard title="Заявки" tag={0} />)
    expect(container.querySelector("[data-slot=tag]")?.textContent).toBe("0")
  })

  it("описание 0 в карточке лежит в абзаце", () => {
    const { container } = render(<TitleCard title="Заявки" description={0} />)
    expect(container.querySelector("p")?.textContent).toBe("0")
  })

  it("описание 0 в реестре лежит в абзаце", () => {
    const { container } = render(<TitleRegistry title="Заявки" description={0} />)
    expect(container.querySelector("p")?.textContent).toBe("0")
  })

  it("пустая строка тег не рисует", () => {
    const { container } = render(<TitleCard title="Заявки" tag="" />)
    expect(container.querySelector("[data-slot=tag]")).toBeNull()
  })
})
