import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import { ProgressBar } from "./progress-bar"

// Аудит 9: подпись статуса стояла `shrink-0` — длинный статус шёл одной
// строкой за контейнер (до 549px при полосе 343), как заголовок до r9.

describe("ProgressBar: длинная подпись статуса переносится", () => {
  it("подпись может сжиматься и переносится по словам", () => {
    render(
      <ProgressBar
        title="Заявка"
        subtitle="Ожидает подписания руководителем организации и главным бухгалтером"
        statusDescription="12.09.2026"
      />
    )
    const subtitle = screen.getByText(/Ожидает подписания/)
    const classes = subtitle.className.split(/\s+/)
    expect(classes).not.toContain("shrink-0")
    expect(classes).toContain("min-w-0")
    expect(classes).toContain("break-words")
  })
})
