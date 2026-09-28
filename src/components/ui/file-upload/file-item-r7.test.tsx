import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import { FileListItem } from "./file-item"

// Аудит 6: без `errorText` строка ошибки показывала английскую заглушку из
// макета «Text about error here» — ровно так было в демо загрузки файлов.

describe("FileListItem: ошибка без текста", () => {
  it("вторая строка не рисуется и заглушки нет", () => {
    const { container } = render(<FileListItem name="File.doc" state="error" />)
    expect(screen.queryByText("Text about error here")).not.toBeInTheDocument()
    expect(container.textContent).toBe("File.doc")
  })

  it("переданный текст ошибки по-прежнему показывается", () => {
    render(<FileListItem name="File.doc" state="error" errorText="Файл повреждён" />)
    expect(screen.getByText("Файл повреждён")).toBeInTheDocument()
  })
})
