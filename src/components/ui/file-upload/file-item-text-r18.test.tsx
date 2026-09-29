import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import { FileListItem } from "./file-item"

// Аудит 17: текст ошибки обрезался в одну строку без подсказки — причину
// отказа («Файл слишком большо…») было не прочитать.

const ERROR = "Файл слишком большой, максимум 10 МБ для загрузки"

describe("FileListItem: текст ошибки читается целиком", () => {
  it("L — переносится до двух строк и доступен в title", () => {
    render(<FileListItem name="Договор.pdf" state="error" errorText={ERROR} />)
    const text = screen.getByText(ERROR)
    expect(text).toHaveClass("line-clamp-2")
    expect(text).not.toHaveClass("truncate")
    expect(text).toHaveAttribute("title", ERROR)
  })

  it("S — одна строка, полный текст в title", () => {
    render(<FileListItem size="s" name="Договор.pdf" state="error" errorText={ERROR} />)
    const text = screen.getByText(ERROR)
    expect(text).toHaveClass("truncate")
    expect(text).toHaveAttribute("title", ERROR)
  })
})
