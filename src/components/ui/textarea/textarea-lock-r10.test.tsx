import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import { Textarea } from "./textarea"

// Аудит 9: у заблокированной области без подписи замок стоит в правом
// верхнем углу, а у самой textarea не было правого отступа — конец первой
// строки рисовался прямо под значком.

describe("Textarea locked: место под замок", () => {
  it("без подписи текст не заходит под замок", () => {
    render(<Textarea locked defaultValue="Текст в заблокированном поле" />)
    expect(screen.getByRole("textbox").className.split(/\s+/)).toContain("pr-6")
  })

  it("с подписью отступ не добавляется — первая строка ниже замка", () => {
    render(<Textarea locked label="Комментарий" defaultValue="Текст" />)
    expect(screen.getByRole("textbox").className.split(/\s+/)).not.toContain("pr-6")
  })

  it("без блокировки отступа нет", () => {
    render(<Textarea defaultValue="Текст" />)
    expect(screen.getByRole("textbox").className.split(/\s+/)).not.toContain("pr-6")
  })
})
