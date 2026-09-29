import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import { Event } from "./event"

// Аудит r25: `timestamp`, `author`, `attribute`, `comment` и `buttonLabel`
// со значением 0 выводили голый «0» вместо своих узлов; массивы подписантов,
// сведений и документов с `null` (собранные условиями) роняли рендер.

describe("Event: нулевые значения", () => {
  it("timestamp 0 — в узле времени", () => {
    render(<Event title="Событие" timestamp={0} />)
    expect(screen.getByText("0")).toHaveClass("shrink-0")
  })

  it("author 0 — абзацем автора", () => {
    render(<Event title="Событие" author={0} />)
    expect(screen.getByText("0").tagName).toBe("P")
  })

  it("attribute 0 — после тире в имени подписанта", () => {
    render(
      <Event title="Событие" signatories={[{ status: "success", name: "Иванов", attribute: 0 }]} />
    )
    expect(screen.getByText(/Иванов/)).toHaveTextContent("Иванов – 0")
  })

  it("comment 0 — абзацем комментария под подписью", () => {
    render(<Event title="Событие" comment={0} />)
    expect(screen.getByText("Комментарий:")).toBeInTheDocument()
    expect(screen.getByText("0").tagName).toBe("P")
  })

  it("buttonLabel 0 — в кнопке", () => {
    render(<Event title="Событие" buttonLabel={0} />)
    expect(screen.getByRole("button", { name: "0" })).toBeInTheDocument()
  })
})

describe("Event: пустые элементы массивов", () => {
  it("null и false в signatories, info и documents отбрасываются", () => {
    render(
      <Event
        title="Событие"
        signatories={[null, { status: "success", name: "Иванов" }]}
        info={[false, { label: "Сумма:", value: "10 ₽" }]}
        documents={[null, { name: "Договор.pdf", meta: "1 МБ" }, false]}
      />
    )
    expect(screen.getByText("Иванов")).toBeInTheDocument()
    expect(screen.getByText("10 ₽")).toBeInTheDocument()
    expect(screen.getAllByRole("button")).toHaveLength(1)
  })

  it("одни пустые элементы — блоков нет", () => {
    render(<Event title="Событие" signatories={[null]} info={[false]} documents={[null]} />)
    expect(screen.queryByText("Приложенные документы:")).toBeNull()
    expect(screen.queryByRole("button")).toBeNull()
  })
})
