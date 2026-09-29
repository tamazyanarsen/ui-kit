import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import { BankCard } from "./bank-card"

// Аудит r25: длинное имя держателя на обороте переносилось на вторую строку и
// выталкивало «до 01/2025» за нижний край карты (мобильная 254×160: срез
// на 4px, срок действия не виден). Живая проверка в Chrome: после правки
// имя в одну строку с многоточием, срок виден целиком.

describe("BankCard: длинное имя держателя", () => {
  it("рисуется одной строкой с многоточием", () => {
    render(
      <BankCard
        type="back"
        size="mobile"
        cardholderName="KONSTANTIN KONSTANTINOPOLSKY-ANDRIEVSKY JUNIOR"
      />
    )
    const name = screen.getByText("KONSTANTIN KONSTANTINOPOLSKY-ANDRIEVSKY JUNIOR")
    expect(name).toHaveClass("truncate", "w-full")
    expect(name.tagName).toBe("SPAN")
  })
})
