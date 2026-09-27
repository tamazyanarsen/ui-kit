import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import { IssueItem } from "@/components/ui/issue-item"

import { ListOfErrors } from "./list-of-errors"

describe("ListOfErrors", () => {
  it("оборачивает каждую строку в пункт списка", () => {
    render(
      <ListOfErrors>
        <IssueItem>Первая</IssueItem>
        <IssueItem>Вторая</IssueItem>
      </ListOfErrors>
    )
    expect(screen.getAllByRole("listitem")).toHaveLength(2)
    expect(screen.getByText("Первая")).toBeInTheDocument()
    expect(screen.getByText("Вторая")).toBeInTheDocument()
  })

  // Разделитель во всю ширину — часть анатомии, но у него есть выключатель.
  it("разделитель показан по умолчанию и гасится пропсом", () => {
    const { unmount } = render(
      <ListOfErrors>
        <IssueItem>Ошибка</IssueItem>
      </ListOfErrors>
    )
    expect(screen.getByRole("separator")).toBeInTheDocument()
    unmount()

    render(
      <ListOfErrors showDivider={false}>
        <IssueItem>Ошибка</IssueItem>
      </ListOfErrors>
    )
    expect(screen.queryByRole("separator")).not.toBeInTheDocument()
  })

  // Задержка появления растёт по строкам, но упирается в пятую: иначе
  // длинный список доезжал бы секундами.
  it("задержка появления зажата пятой строкой", () => {
    render(
      <ListOfErrors>
        {Array.from({ length: 7 }, (_, i) => (
          <IssueItem key={i}>Ошибка {i}</IssueItem>
        ))}
      </ListOfErrors>
    )
    const items = screen.getAllByRole("listitem")
    expect(items[0]).toHaveStyle({ animationDelay: "0ms" })
    expect(items[4]).toHaveStyle({ animationDelay: "160ms" })
    expect(items[6]).toHaveStyle({ animationDelay: "160ms" })
  })

  it("пустой список не падает", () => {
    render(<ListOfErrors data-testid="list" />)
    expect(screen.getByTestId("list")).toBeInTheDocument()
    expect(screen.queryAllByRole("listitem")).toHaveLength(0)
  })
})
