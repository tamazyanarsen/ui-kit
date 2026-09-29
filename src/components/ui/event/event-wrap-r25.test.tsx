import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import { Event } from "./event"

// Аудит r25: неразрывное слово в заголовке, авторе, имени подписанта, значении
// сведений и комментарии выходило за колонку события (в колонке 300px
// `scrollWidth` был 644): у текстов не было `overflow-wrap: anywhere`, а у
// заголовка и имени — `min-w-0` во флекс-строке. Живая проверка в Chrome:
// после правки `scrollWidth` колонки равен её ширине.
//
// Позже сверка с мастером `ELK / event` уточнила способ: автор, имя подписанта
// и подпись «Комментарий» там `whitespace-nowrap` + ellipsis (обрезаются, а не
// переносятся), а заголовок, значение сведений и текст комментария
// переносятся. Реальные значения (высота строки, многоточие) проверяет
// сценарий scripts/qa/scenarios/nav-messages-figma.mjs в живом Chrome.

const LONG = "Договор_поставки_оборудования_000123456789"

describe("Event: длинные неразрывные слова", () => {
  it("тексты события не выходят за колонку: одни обрезаются, другие переносятся", () => {
    render(
      <Event
        title={LONG}
        author={`${LONG}_автор`}
        signatories={[{ status: "success", name: `${LONG}_подписант` }]}
        info={[{ label: "Сумма:", value: `${LONG}_значение` }]}
        comment={`${LONG}_комментарий`}
      />
    )
    for (const [text, tag, cls] of [
      [LONG, "SPAN", "[overflow-wrap:anywhere]"],
      [`${LONG}_автор`, "P", "truncate"],
      [`${LONG}_подписант`, "SPAN", "truncate"],
      [`${LONG}_значение`, "SPAN", "[overflow-wrap:anywhere]"],
      [`${LONG}_комментарий`, "P", "[overflow-wrap:anywhere]"],
    ] as const) {
      const node = screen.getByText(text)
      expect(node.tagName).toBe(tag)
      expect(node).toHaveClass(cls)
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
