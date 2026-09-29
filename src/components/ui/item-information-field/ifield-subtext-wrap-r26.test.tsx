import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import { ItemInformationField } from "./item-information-field"

// Аудит r26: неразрывное слово (номер договора, адрес, URL) в свободном
// тексте выходило за край блока — у узла не было `overflow-wrap: anywhere`.
const WORD = "Договор_поставки_000123456789_без_пробелов"
const WRAP = "[overflow-wrap:anywhere]"

describe("ItemInformationField: подпись под значением", () => {
  it.each(["label-left", "label-line", "label-top", "large-value"] as const)("%s: переносится", (type) => {
    render(<ItemInformationField type={type} label="Метка" value="Значение" subText={WORD} />)
    expect(screen.getByText(WORD)).toHaveClass(WRAP)
  })
})
