import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import { NotificationItem, NotificationPanel } from "./notification"

// Аудит r26: неразрывное слово (номер договора, адрес, URL) в свободном
// тексте выходило за край блока — у узла не было `overflow-wrap: anywhere`.
const WORD = "Договор_поставки_000123456789_без_пробелов"
const WRAP = "[overflow-wrap:anywhere]"

describe("NotificationItem: тексты", () => {
  it("заголовок, сумма, статус и описание переносятся", () => {
    render(<NotificationItem title={WORD + "1"} sum={WORD + "2"} status={WORD + "3"} description={WORD + "4"} />)
    for (const n of ["1", "2", "3", "4"]) expect(screen.getByText(WORD + n)).toHaveClass(WRAP)
  })
  it("заголовок панели переносится", () => {
    render(<NotificationPanel title={WORD} items={[]} />)
    expect(screen.getByText(WORD)).toHaveClass(WRAP)
  })
})
