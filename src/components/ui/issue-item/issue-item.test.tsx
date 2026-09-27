import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import { IssueItem } from "./issue-item"

describe("IssueItem", () => {
  it("рисует текст проблемы", () => {
    render(<IssueItem>Не заполнен ИНН</IssueItem>)
    expect(screen.getByText("Не заполнен ИНН")).toBeInTheDocument()
  })

  it("статус по умолчанию — ошибка", () => {
    render(<IssueItem data-testid="row">Ошибка</IssueItem>)
    expect(screen.getByTestId("row")).toHaveAttribute("data-status", "error")
  })

  // `Status=Information` — полноценное значение оси макета, а не наша
  // надстройка, поэтому проверяем все три (в коде оно зовётся `info`).
  it("статус переключается пропсом", () => {
    for (const status of ["error", "attention", "info"] as const) {
      const { unmount } = render(
        <IssueItem data-testid="row" status={status}>
          Текст
        </IssueItem>
      )
      expect(screen.getByTestId("row")).toHaveAttribute("data-status", status)
      unmount()
    }
  })

  // Значок — оформление: текст проблемы и так рядом, дублировать его
  // скринридеру незачем.
  it("значок скрыт от скринридера", () => {
    const { container } = render(<IssueItem>Ошибка</IssueItem>)
    expect(container.querySelector('[aria-hidden="true"]')).toBeInTheDocument()
  })

  it("принимает нативные пропсы", () => {
    render(
      <IssueItem data-testid="row" id="issue-1">
        Ошибка
      </IssueItem>
    )
    expect(screen.getByTestId("row")).toHaveAttribute("id", "issue-1")
  })
})
