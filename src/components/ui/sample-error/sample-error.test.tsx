import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import { IssueItem } from "@/components/ui/issue-item"

import { SampleError } from "./sample-error"

describe("SampleError", () => {
  it("рисует текст проблемы", () => {
    render(<SampleError>Не заполнен ИНН</SampleError>)
    expect(screen.getByText("Не заполнен ИНН")).toBeInTheDocument()
  })

  it("статус по умолчанию — ошибка", () => {
    render(<SampleError data-testid="row">Ошибка</SampleError>)
    expect(screen.getByTestId("row")).toHaveAttribute("data-status", "error")
  })

  // Ось `Status` мастера `Sample Error (ELK)`: Error / Attention / Information.
  it("статус переключается пропсом", () => {
    for (const status of ["error", "attention", "information"] as const) {
      const { unmount } = render(
        <SampleError data-testid="row" status={status}>
          Текст
        </SampleError>
      )
      expect(screen.getByTestId("row")).toHaveAttribute("data-status", status)
      unmount()
    }
  })

  // Значок — оформление: текст проблемы и так рядом, дублировать его
  // скринридеру незачем.
  it("значок скрыт от скринридера", () => {
    const { container } = render(<SampleError>Ошибка</SampleError>)
    expect(container.querySelector('[aria-hidden="true"]')).toBeInTheDocument()
  })

  it("принимает нативные пропсы", () => {
    render(
      <SampleError data-testid="row" id="issue-1">
        Ошибка
      </SampleError>
    )
    expect(screen.getByTestId("row")).toHaveAttribute("id", "issue-1")
  })
})

// Дизайн-чек от 08.10, замечание 13: компонент переименован, прежнее имя
// оставлено устаревшим псевдонимом — старый код должен работать как был.
describe("IssueItem (устаревший псевдоним)", () => {
  it("рисует ту же строку, что и SampleError", () => {
    render(<IssueItem data-testid="row">Ошибка</IssueItem>)
    expect(screen.getByTestId("row")).toHaveAttribute("data-slot", "sample-error")
  })

  it("прежний статус `info` переводится в `information`", () => {
    render(
      <IssueItem data-testid="row" status="info">
        Ошибка
      </IssueItem>
    )
    expect(screen.getByTestId("row")).toHaveAttribute("data-status", "information")
  })
})
