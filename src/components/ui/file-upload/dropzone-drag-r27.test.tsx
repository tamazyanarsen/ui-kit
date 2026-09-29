import { describe, expect, it } from "vitest"
import { fireEvent, render } from "@testing-library/react"

import { FileUploadDropzone } from "./dropzone"

// Круг 27: `dragleave` приходит и при переходе с зоны на её дочерний узел, и
// зона гасла на каждом таком переходе (мигала до следующего `dragover`).

const zoneOf = (container: HTMLElement) =>
  container.querySelector<HTMLElement>('[data-slot="file-upload-dropzone"]')!
// Подсветка перетаскивания — залитый фон без префикса `hover:`.
const lit = (el: HTMLElement) =>
  /(^|\s)bg-\[var\(--file-upload-bg-hover\)\]/.test(el.className)

describe("Dropzone: перетаскивание над дочерними узлами", () => {
  it("уход с зоны на значок не гасит подсветку, выход из зоны гасит", () => {
    const { container } = render(<FileUploadDropzone />)
    const zone = zoneOf(container)
    const child = zone.querySelector("svg")!
    fireEvent.dragEnter(zone)
    fireEvent.dragOver(zone)
    expect(lit(zone)).toBe(true)
    // Браузер: вход в дочерний узел, затем «уход» с зоны.
    fireEvent.dragEnter(child)
    fireEvent.dragLeave(zone)
    expect(lit(zone)).toBe(true)
    // Выход из дочернего узла наружу зоны.
    fireEvent.dragLeave(child)
    expect(lit(zone)).toBe(false)
  })

  it("после сброса файла следующее перетаскивание начинается с нуля", () => {
    const { container } = render(<FileUploadDropzone />)
    const zone = zoneOf(container)
    const child = zone.querySelector("svg")!
    fireEvent.dragEnter(zone)
    fireEvent.dragEnter(child)
    fireEvent.drop(zone, { dataTransfer: { files: [] } })
    expect(lit(zone)).toBe(false)
    fireEvent.dragEnter(zone)
    fireEvent.dragOver(zone)
    expect(lit(zone)).toBe(true)
    fireEvent.dragLeave(zone)
    expect(lit(zone)).toBe(false)
  })

  it("обработчики потребителя вызываются", () => {
    let entered = 0
    const { container } = render(<FileUploadDropzone onDragEnter={() => entered++} />)
    fireEvent.dragEnter(zoneOf(container))
    expect(entered).toBe(1)
  })
})
