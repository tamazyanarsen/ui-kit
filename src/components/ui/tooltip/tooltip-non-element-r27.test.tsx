import { describe, expect, it } from "vitest"
import { render } from "@testing-library/react"

import { Tooltip } from "./tooltip"

// r27: фикс r26 читал `children.props.id` без проверки, и
// `<Tooltip>{cond && <Button/>}</Tooltip>` при false/null/undefined/строке
// бросал TypeError и ронял дерево. Id берётся только у настоящего элемента.

describe("Tooltip: ребёнок не элемент", () => {
  const cases: [string, unknown][] = [
    ["false", false],
    ["null", null],
    ["undefined", undefined],
    ["строка", "просто текст"],
  ]
  for (const [name, child] of cases) {
    it(`не падает на ${name}`, () => {
      expect(() =>
        render(<Tooltip content="подсказка">{child as never}</Tooltip>)
      ).not.toThrow()
    })
  }

  it("ничего не рисует вместо false/null, а строку делает текстом триггера", () => {
    const empty = render(<Tooltip content="подсказка">{false as never}</Tooltip>)
    expect(empty.container).toBeEmptyDOMElement()
    const text = render(<Tooltip content="подсказка">{"просто текст" as never}</Tooltip>)
    expect(text.getByText("просто текст")).toBeInTheDocument()
  })

  it("id настоящего элемента по-прежнему уходит на триггер", () => {
    const { getByRole } = render(
      <Tooltip content="подсказка">
        <button id="save">Сохранить</button>
      </Tooltip>
    )
    expect(getByRole("button", { name: "Сохранить" })).toHaveAttribute("id", "save")
  })
})
