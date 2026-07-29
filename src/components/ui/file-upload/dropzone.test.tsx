import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { FileUploadDropzone } from "./dropzone"

describe("FileUploadDropzone", () => {
  it("renders the default hint text", () => {
    render(<FileUploadDropzone />)
    expect(screen.getByText("Перетащите или загрузите файлы")).toBeInTheDocument()
  })

  it("renders custom children and subtitle", () => {
    render(
      <FileUploadDropzone subtitle="PDF, DOCX до 10 МБ">
        Загрузить документ
      </FileUploadDropzone>
    )
    expect(screen.getByText("Загрузить документ")).toBeInTheDocument()
    expect(screen.getByText("PDF, DOCX до 10 МБ")).toBeInTheDocument()
  })

  it("calls onFilesSelected when a file is chosen via the picker", async () => {
    const user = userEvent.setup()
    const onFilesSelected = vi.fn()
    const { container } = render(<FileUploadDropzone onFilesSelected={onFilesSelected} />)

    const file = new File(["hello"], "hello.txt", { type: "text/plain" })
    const input = container.querySelector('input[type="file"]') as HTMLInputElement

    await user.upload(input, file)

    expect(onFilesSelected).toHaveBeenCalledTimes(1)
    expect(onFilesSelected.mock.calls[0][0][0].name).toBe("hello.txt")
  })

  it("calls onFilesSelected on drop", () => {
    const onFilesSelected = vi.fn()
    const { container } = render(<FileUploadDropzone onFilesSelected={onFilesSelected} />)
    const zone = container.querySelector('[data-slot="file-upload-dropzone"]')!

    const file = new File(["hello"], "hello.txt", { type: "text/plain" })
    const dataTransfer = { files: [file] }

    zone.dispatchEvent(
      Object.assign(new Event("drop", { bubbles: true, cancelable: true }), {
        dataTransfer,
      })
    )

    expect(onFilesSelected).toHaveBeenCalledTimes(1)
  })

  it("marks itself disabled and does not open the picker", async () => {
    const user = userEvent.setup()
    const { container } = render(<FileUploadDropzone disabled />)
    const zone = container.querySelector('[data-slot="file-upload-dropzone"]')!

    expect(zone).toHaveAttribute("aria-disabled", "true")

    const input = container.querySelector('input[type="file"]') as HTMLInputElement
    expect(input).toBeDisabled()

    await user.click(zone)
    // No assertion on file picker opening (jsdom can't do that anyway) —
    // just confirms the click handler doesn't throw when disabled.
  })
})
