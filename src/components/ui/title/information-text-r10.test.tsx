import { describe, expect, it } from "vitest"
import { render } from "@testing-library/react"

import { TitleCard, TitleInformationText } from "./title-card"

// Аудит 9: пары «подпись: значение» стояли в одну строку без переноса и на
// полосе 343 уходили за край (до 587px). Ряд статуса TitleCard тоже не
// переносился.

const ITEMS = [
  { label: "Номер заявки", value: "№ 000123" },
  { label: "Дата создания", value: "12.09.2026" },
  { label: "Статус", value: "На рассмотрении" },
]

const classes = (el: Element | null) => (el?.getAttribute("class") ?? "").split(/\s+/)

describe("TitleInformationText и TitleCard: перенос на узкой полосе", () => {
  it("пары type=text переносятся целиком", () => {
    const { container } = render(<TitleInformationText type="text" items={ITEMS} />)
    const root = container.querySelector('[data-slot="title-information-text"]')
    expect(classes(root)).toContain("flex-wrap")
    // Внутри пары подпись и значение не разрываются.
    expect(classes(root!.firstElementChild)).toContain("shrink-0")
  })

  it("ряд статуса TitleCard переносится", () => {
    const { container } = render(
      <TitleCard
        title="Заявка"
        tag="На рассмотрении"
        information={<TitleInformationText type="text" items={ITEMS} />}
      />
    )
    expect(classes(container.querySelector('[data-slot="title-card-status"]'))).toContain(
      "flex-wrap"
    )
  })
})
