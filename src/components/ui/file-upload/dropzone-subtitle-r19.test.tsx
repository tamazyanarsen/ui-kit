import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import { FileUploadDropzone } from "./dropzone"

// Аудит 18: подзаголовок — элемент колонки `items-center` с шириной по
// содержимому; неразрывное имя файла вылезало из зоны в обе стороны.

describe("FileUploadDropzone: подзаголовок не шире зоны", () => {
  it("max-w-full и overflow-wrap:anywhere", () => {
    render(<FileUploadDropzone subtitle="Файл_Договор_поставки_000123456789.pdf" />)
    const subtitle = screen.getByText("Файл_Договор_поставки_000123456789.pdf")
    expect(subtitle).toHaveClass("max-w-full")
    expect(subtitle).toHaveClass("[overflow-wrap:anywhere]")
  })
})
