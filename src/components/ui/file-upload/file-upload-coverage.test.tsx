import * as React from "react"
import { describe, expect, it } from "vitest"
import { render } from "@testing-library/react"

import { FileUploadDropzone } from "./dropzone"
import { FileListItem } from "./file-item"

// Добор покрытия к исправлениям загрузки файлов: `forwardRef` у зоны и у
// строки файла раньше не проверялся — на React 18 ref терялся молча.
describe("file upload refs coverage", () => {
  it("forwards ref to the dropzone root", () => {
    const ref = React.createRef<HTMLDivElement>()
    const { container } = render(<FileUploadDropzone ref={ref} />)
    expect(ref.current).toBe(container.querySelector('[data-slot="file-upload-dropzone"]'))
  })

  it("forwards ref to the file row", () => {
    const ref = React.createRef<HTMLDivElement>()
    const { container } = render(<FileListItem ref={ref} name="Договор.pdf" />)
    expect(ref.current).toBe(container.querySelector('[data-slot="file-item"]'))
  })
})
