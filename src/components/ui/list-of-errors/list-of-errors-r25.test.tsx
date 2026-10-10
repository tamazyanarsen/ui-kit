import { describe, expect, it } from "vitest"
import { render } from "@testing-library/react"

import { SampleError } from "@/components/ui/sample-error"

import { ListOfErrors } from "./list-of-errors"

// r25: пустая строка среди детей (`{message}` с `""`) давала пустую <li> с
// зазором и задержкой анимации.

describe("ListOfErrors с пустыми строками", () => {
  it("«» не превращается в пункт списка", () => {
    const { container } = render(
      <ListOfErrors>
        {""}
        <SampleError>Ошибка</SampleError>
        {""}
      </ListOfErrors>
    )
    expect(
      container.querySelectorAll('[data-slot="list-of-errors-item"]')
    ).toHaveLength(1)
  })

  it("одни пустые строки — списка нет вовсе", () => {
    const { container } = render(<ListOfErrors>{""}</ListOfErrors>)
    expect(container).toBeEmptyDOMElement()
  })
})
