import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import { Informer } from "./informer"

// Аудит r26: неразрывное слово (номер договора, адрес, URL) в свободном
// тексте выходило за край блока — у узла не было `overflow-wrap: anywhere`.
const WORD = "Договор_поставки_000123456789_без_пробелов"
const WRAP = "[overflow-wrap:anywhere]"

describe("Informer: тексты", () => {
  it("заголовок, дата и описание переносятся", () => {
    render(<Informer title={WORD + "1"} date={WORD + "2"} description={WORD + "3"} />)
    for (const n of ["1", "2", "3"]) expect(screen.getByText(WORD + n)).toHaveClass(WRAP)
  })
})
