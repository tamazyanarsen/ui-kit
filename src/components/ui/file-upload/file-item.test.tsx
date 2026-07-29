import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { FileListItem } from "./file-item"

describe("FileListItem", () => {
  it("renders the file name and meta", () => {
    render(<FileListItem name="Договор.pdf" meta="1.2 МБ" />)
    expect(screen.getByText("Договор.pdf")).toBeInTheDocument()
    expect(screen.getByText("1.2 МБ")).toBeInTheDocument()
  })

  it("shows 'Загрузка' instead of meta while loading", () => {
    render(<FileListItem name="Договор.pdf" meta="1.2 МБ" state="loading" />)
    expect(screen.getByText("Загрузка")).toBeInTheDocument()
    expect(screen.queryByText("1.2 МБ")).not.toBeInTheDocument()
  })

  it("shows the error text instead of meta when in error state", () => {
    render(
      <FileListItem
        name="Договор.pdf"
        meta="1.2 МБ"
        state="error"
        errorText="Файл повреждён"
      />
    )
    expect(screen.getByText("Файл повреждён")).toBeInTheDocument()
  })

  it("calls onRetry and onRemove from their respective buttons", async () => {
    const user = userEvent.setup()
    const onRetry = vi.fn()
    const onRemove = vi.fn()
    render(<FileListItem name="Договор.pdf" onRetry={onRetry} onRemove={onRemove} />)

    await user.click(screen.getByRole("button", { name: "Загрузить заново" }))
    await user.click(screen.getByRole("button", { name: "Удалить файл" }))

    expect(onRetry).toHaveBeenCalledTimes(1)
    expect(onRemove).toHaveBeenCalledTimes(1)
  })

  it("hides the retry/remove buttons when disabled via showEdit/showCross", () => {
    render(<FileListItem name="Договор.pdf" showEdit={false} showCross={false} />)
    expect(screen.queryByRole("button")).not.toBeInTheDocument()
  })
})
