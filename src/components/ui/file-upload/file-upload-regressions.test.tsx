import { describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { FileUploadDropzone } from "./dropzone"
import { FileListItem } from "./file-item"

function drop(target: Element, files: File[]) {
  fireEvent.drop(target, { dataTransfer: { files, types: ["Files"] } })
}

const pdf = new File(["a"], "Договор.PDF", { type: "application/pdf" })
const exe = new File(["b"], "setup.exe", { type: "application/x-msdownload" })
const png = new File(["c"], "scan.png", { type: "image/png" })

describe("FileUploadDropzone regressions", () => {
  it("filters dropped files by accept and multiple", () => {
    const onFilesSelected = vi.fn()
    const onFilesRejected = vi.fn()
    const { container } = render(
      <FileUploadDropzone
        accept=".pdf,image/*"
        multiple={false}
        onFilesSelected={onFilesSelected}
        onFilesRejected={onFilesRejected}
      />
    )
    drop(container.firstElementChild!, [exe, pdf, png])

    const selected = Array.from(onFilesSelected.mock.calls[0][0] as FileList)
    expect(selected.map((f) => f.name)).toEqual(["Договор.PDF"])
    expect(onFilesRejected.mock.calls[0][0].map((f: File) => f.name)).toEqual([
      "setup.exe",
      "scan.png",
    ])
  })

  it("does not call onFilesSelected when every dropped file is rejected", () => {
    const onFilesSelected = vi.fn()
    const { container } = render(
      <FileUploadDropzone accept=".pdf" onFilesSelected={onFilesSelected} />
    )
    drop(container.firstElementChild!, [exe])
    expect(onFilesSelected).not.toHaveBeenCalled()
  })

  it("keeps opening the picker when the consumer passes onClick", async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    const { container } = render(<FileUploadDropzone onClick={onClick} />)
    const input = container.querySelector('input[type="file"]') as HTMLInputElement
    const pickerClick = vi.spyOn(input, "click")

    await user.click(screen.getByText("загрузите файлы"))

    expect(onClick).toHaveBeenCalled()
    expect(pickerClick).toHaveBeenCalled()
  })

  it("still accepts a drop when the consumer passes onDragOver", () => {
    const onDragOver = vi.fn()
    const { container } = render(<FileUploadDropzone onDragOver={onDragOver} />)
    const zone = container.firstElementChild!
    const event = new Event("dragover", { bubbles: true, cancelable: true })
    zone.dispatchEvent(event)
    expect(onDragOver).toHaveBeenCalled()
    expect(event.defaultPrevented).toBe(true)
  })
})

describe("FileListItem regressions", () => {
  it("disables the action buttons in the disabled state", () => {
    render(<FileListItem name="Договор.pdf" state="disabled" onRemove={() => {}} />)
    expect(screen.getByRole("button", { name: "Удалить файл" })).toBeDisabled()
    expect(screen.getByRole("button", { name: "Действия с файлом" })).toBeDisabled()
  })

  it("calls onEdit from the Show Edit button", async () => {
    const user = userEvent.setup()
    const onEdit = vi.fn()
    render(<FileListItem name="Договор.pdf" size="s" onEdit={onEdit} />)
    await user.click(screen.getByRole("button", { name: "Скачать файл" }))
    expect(onEdit).toHaveBeenCalledTimes(1)
  })
})
