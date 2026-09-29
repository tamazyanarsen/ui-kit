import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import { Event } from "./event"

// Аудит r25: неразрывное слово в заголовке, авторе, имени подписанта, значении
// сведений и комментарии выходило за колонку события (в колонке 300px
// `scrollWidth` был 644): у текстов не было `overflow-wrap: anywhere`, а у
// заголовка и имени — `min-w-0` во флекс-строке. Живая проверка в Chrome:
// после правки `scrollWidth` колонки равен её ширине.

const LONG = "Договор_поставки_оборудования_000123456789"

describe("Event: длинные неразрывные слова", () => {
  it("тексты события переносятся внутри колонки", () => {
    render(
      <Event
        title={LONG}
        author={`${LONG}_автор`}
        signatories={[{ status: "success", name: `${LONG}_подписант` }]}
        info={[{ label: "Сумма:", value: `${LONG}_значение` }]}
        comment={`${LONG}_комментарий`}
      />
    )
    for (const [text, tag] of [
      [LONG, "SPAN"],
      [`${LONG}_автор`, "P"],
      [`${LONG}_подписант`, "SPAN"],
      [`${LONG}_значение`, "SPAN"],
      [`${LONG}_комментарий`, "P"],
    ] as const) {
      const node = screen.getByText(text)
      expect(node.tagName).toBe(tag)
      expect(node).toHaveClass("[overflow-wrap:anywhere]")
    }
  })

  it("заголовок и имя подписанта могут сжиматься во флекс-строке", () => {
    render(
      <Event title={LONG} signatories={[{ status: "success", name: `${LONG}_подписант` }]} />
    )
    expect(screen.getByText(LONG)).toHaveClass("min-w-0")
    expect(screen.getByText(`${LONG}_подписант`)).toHaveClass("min-w-0")
  })
})
