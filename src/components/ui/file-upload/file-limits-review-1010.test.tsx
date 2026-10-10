import { describe, expect, it, vi } from "vitest"
import { fireEvent, render } from "@testing-library/react"

import { FileUploadDropzone } from "./dropzone"

// Ревью 10.10, КК-5: подзаголовок зоны печатал лимиты («До 3 файлов…, не
// более 1 MB»), а зона их не проверяла — файл больше предела уходил в
// `onFilesSelected`, и каждый потребитель проверял размер сам.

const MB = 1024 * 1024
const sized = (name: string, size: number) => {
  const file = new File(["x"], name, { type: "application/pdf" })
  Object.defineProperty(file, "size", { value: size })
  return file
}

function drop(target: Element, files: File[]) {
  fireEvent.drop(target, { dataTransfer: { files, types: ["Files"] } })
}

describe("FileUploadDropzone: лимиты числа и размера (ревью 10.10, КК-5)", () => {
  it("отклоняет лишние и слишком большие файлы и называет причину", () => {
    const onFilesSelected = vi.fn()
    const onFilesRejected = vi.fn()
    const { container } = render(
      <FileUploadDropzone
        maxFiles={3}
        maxFileSizeMb={1}
        maxTotalSizeMb={1.5}
        onFilesSelected={onFilesSelected}
        onFilesRejected={onFilesRejected}
      />
    )
    drop(container.firstElementChild!, [
      sized("a.pdf", 0.5 * MB),
      sized("big.pdf", 2 * MB),
      sized("b.pdf", 1 * MB),
      sized("c.pdf", 0.4 * MB),
      sized("d.pdf", 0),
      sized("e.pdf", 0),
    ])

    // a (0,5) — принят; big (2) — больше 1 MB; b (1,0) — сумма 1,5 ещё в
    // пределе, принят; c — сумма вышла бы за 1,5; d (0) — принят третьим;
    // e — уже три файла.
    const selected = Array.from(onFilesSelected.mock.calls[0][0] as FileList)
    expect(selected.map((file) => file.name)).toEqual(["a.pdf", "b.pdf", "d.pdf"])
    const [files, rejections] = onFilesRejected.mock.calls[0]
    expect(files.map((file: File) => file.name)).toEqual(["big.pdf", "c.pdf", "e.pdf"])
    expect(rejections.map((r: { reason: string }) => r.reason)).toEqual([
      "size",
      "total-size",
      "count",
    ])
  })

  it("число файлов ограничено maxFiles", () => {
    const onFilesRejected = vi.fn()
    const { container } = render(
      <FileUploadDropzone maxFiles={1} onFilesRejected={onFilesRejected} />
    )
    drop(container.firstElementChild!, [sized("a.pdf", 10), sized("b.pdf", 10)])
    expect(onFilesRejected.mock.calls[0][1]).toEqual([
      { file: expect.objectContaining({ name: "b.pdf" }), reason: "count" },
    ])
  })
})
