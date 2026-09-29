import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import { ItemInformationField } from "./item-information-field"

// Аудит 21: в «Label Left» на десктопе колонка значения — `items-start`, и
// строка значения брала ширину по содержимому. `break-words` не уменьшает
// минимальную ширину, поэтому в узкой колонке слово «корпоративного» не
// переносилось и выталкивало строку за поле (в CardBox на 320 — прокрутка
// страницы вбок).

describe("ItemInformationField: слова значения переносятся в узкой колонке", () => {
  it("значение и подпись — overflow-wrap:anywhere", () => {
    render(
      <ItemInformationField
        type="label-left"
        label="Подразделение"
        value="Управление корпоративного обслуживания"
      />
    )
    const value = screen.getByText("Управление корпоративного обслуживания").parentElement!
    expect(value).toHaveClass("[overflow-wrap:anywhere]")
    expect(value).not.toHaveClass("break-words")
    const label = screen.getByText("Подразделение")
    expect(label).toHaveClass("[overflow-wrap:anywhere]")
  })
})
