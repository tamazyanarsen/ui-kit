import { describe, expect, it } from "vitest"
import { render } from "@testing-library/react"

import { matchesAccept } from "./accept"
import { FileUploadDropzone } from "./dropzone"
import { FileListItem } from "./file-item"
import { buildFileUploadSubtitle } from "./subtitle"

// r25: `accept` из одних пробелов и запятых отвергал каждый файл; пустые
// форматы давали «PDF /  / DOC»; пустая вторая строка файла рисовала пустой
// абзац с межстрочным интервалом.

const file = new File(["x"], "a.pdf", { type: "application/pdf" })

describe("matchesAccept без настоящих ограничений", () => {
  it.each(["  ", ",", " , ,"])("«%s» пропускает любой файл", (accept) => {
    expect(matchesAccept(file, accept)).toBe(true)
  })

  it("настоящее ограничение работает по-прежнему", () => {
    expect(matchesAccept(file, ".png")).toBe(false)
    expect(matchesAccept(file, " .pdf , ")).toBe(true)
  })
})

describe("buildFileUploadSubtitle: пустые форматы", () => {
  it("пустые и null-форматы отбрасываются", () => {
    const formats = ["PDF", "", " ", null, "DOC"] as unknown as string[]
    expect(buildFileUploadSubtitle({ maxFiles: 3, formats })).toBe(
      "До 3 файлов PDF / DOC без ограничений по размеру"
    )
  })

  it("только пустые форматы — как без форматов", () => {
    expect(buildFileUploadSubtitle({ formats: ["", " "] })).toBe(
      "Файл без ограничений по размеру"
    )
  })
})

describe("FileListItem: пустая вторая строка", () => {
  it.each([
    ["пустая строка", ""],
    ["false", false],
    ["null", null],
  ])("meta — %s не рисует пустой абзац", (_, meta) => {
    const { container } = render(
      <FileListItem name="a.pdf" meta={meta as React.ReactNode} />
    )
    expect(container.querySelector(".text-p3-medium")).toBeNull()
  })

  it("meta = 0 рисуется", () => {
    const { getByText } = render(<FileListItem name="a.pdf" meta={0} />)
    expect(getByText("0")).toBeInTheDocument()
  })
})

describe("FileUploadDropzone: подзаголовок 0", () => {
  it("subtitle = 0 рисуется в оформленной строке", () => {
    const { getByText } = render(<FileUploadDropzone subtitle={0} />)
    expect(getByText("0").className).toContain("text-p3-regular")
  })
})
