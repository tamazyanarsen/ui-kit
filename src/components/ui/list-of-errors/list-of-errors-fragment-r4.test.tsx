import { describe, expect, it } from "vitest"
import { render } from "@testing-library/react"

import { IssueItem } from "@/components/ui/issue-item"

import { ListOfErrors } from "./list-of-errors"

// Итоговая проверка №3: `Children.toArray` не раскрывает фрагменты, и две
// ошибки внутри `<>…</>` попадали в одну строку `li` — без зазора между
// ними, с общей анимацией и одной задержкой на обе.

describe("ListOfErrors: ошибки во фрагменте", () => {
  it("каждая ошибка фрагмента получает свою строку", () => {
    const has = true
    const { container } = render(
      <ListOfErrors>
        <IssueItem>Первая</IssueItem>
        {has && (
          <>
            <IssueItem>Вторая</IssueItem>
            <IssueItem>Третья</IssueItem>
          </>
        )}
      </ListOfErrors>
    )
    const rows = container.querySelectorAll('[data-slot="list-of-errors-item"]')
    expect(Array.from(rows, (row) => row.textContent)).toEqual(["Первая", "Вторая", "Третья"])
  })
})
