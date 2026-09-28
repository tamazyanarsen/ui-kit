import { describe, expect, it } from "vitest"
import { fireEvent, render } from "@testing-library/react"

import { FileUploadDropzone } from "./dropzone"

// Итоговая проверка №4: без отклонённых файлов наружу уходил сам
// `input.files`, а сразу после этого поле очищалось (`value = ""`).
// Chromium обнуляет тот же объект FileList на месте — проверено в headless
// Chrome: before=2 after=0 sameObj=true, — и сохранённый потребителем
// список оказывался пустым. Теперь наружу уходит копия.
//
// jsdom так не делает (и `files` у него каждый раз новый объект), поэтому
// поведение Chromium воспроизводится вручную: у поля один «живой» список,
// и запись `value = ""` опустошает именно его.

function liveFileList(files: File[]) {
  const list: { length: number; item: (i: number) => File | null; [i: number]: File } = {
    length: files.length,
    item: (i) => list[i] ?? null,
  }
  files.forEach((file, i) => (list[i] = file))
  const clear = () => {
    for (let i = 0; i < list.length; i++) delete list[i]
    list.length = 0
  }
  return { list: list as unknown as FileList, clear }
}

describe("FileUploadDropzone: список файлов переживает очистку поля", () => {
  it("сохранённый список не пустеет, когда поле очищается после выбора", () => {
    let received: FileList | null = null
    const { container } = render(
      <FileUploadDropzone multiple onFilesSelected={(files) => (received = files)} />
    )
    const input = container.querySelector<HTMLInputElement>('input[type="file"]')!
    const a = new File(["a"], "a.pdf", { type: "application/pdf" })
    const b = new File(["b"], "b.pdf", { type: "application/pdf" })
    const live = liveFileList([a, b])
    Object.defineProperty(input, "files", { configurable: true, get: () => live.list })
    Object.defineProperty(input, "value", {
      configurable: true,
      get: () => (live.list.length ? "C:\\fakepath\\a.pdf" : ""),
      set: (next: string) => {
        if (next === "") live.clear()
      },
    })

    fireEvent.change(input)

    expect(received).not.toBeNull()
    expect(received!.length).toBe(2)
    expect(received![0]).toBe(a)
    expect(received![1]).toBe(b)
  })
})
