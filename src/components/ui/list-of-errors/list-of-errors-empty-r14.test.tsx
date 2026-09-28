import { describe, expect, it } from "vitest"
import { render } from "@testing-library/react"

import { IssueItem } from "@/components/ui/issue-item"

import { ListOfErrors } from "./list-of-errors"

// Аудит 13: пустой список (`errors.map(...)` при `errors = []`) рисовал
// одинокий разделитель и пустой `ul` над формой.

describe("ListOfErrors без ошибок", () => {
  it("пустой массив ничего не рисует", () => {
    const errors: string[] = []
    const { container } = render(
      <ListOfErrors>
        {errors.map((text) => (
          <IssueItem key={text}>{text}</IssueItem>
        ))}
      </ListOfErrors>
    )
    expect(container.querySelector('[data-slot="list-of-errors"]')).toBeNull()
  })

  it("null и false среди детей тоже не считаются ошибками", () => {
    const { container } = render(
      <ListOfErrors>
        {null}
        {false}
      </ListOfErrors>
    )
    expect(container).toBeEmptyDOMElement()
  })
})
