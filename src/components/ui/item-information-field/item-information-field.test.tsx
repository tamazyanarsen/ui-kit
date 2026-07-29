import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { ItemInformationField } from "./item-information-field"
import { ToastProvider, Toaster } from "@/components/ui/toast-message"

describe("ItemInformationField", () => {
  it("renders the label and value", () => {
    render(<ItemInformationField label="ИНН" value="7710140123" />)
    expect(screen.getByText("ИНН")).toBeInTheDocument()
    expect(screen.getByText("7710140123")).toBeInTheDocument()
  })

  it("renders subText when given", () => {
    render(<ItemInformationField label="Статус" value="Активен" subText="с 01.01.2024" />)
    expect(screen.getByText("с 01.01.2024")).toBeInTheDocument()
  })

  it("shows info tooltips for label and value when given", () => {
    render(
      <ItemInformationField
        label="ИНН"
        value="7710140123"
        labelInfo="Идентификационный номер налогоплательщика"
        valueInfo="Проверено"
      />
    )
    expect(screen.getAllByRole("button", { name: "Информация" })).toHaveLength(2)
  })

  it("copies the value to the clipboard and shows a toast", async () => {
    const user = userEvent.setup()
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText },
      configurable: true,
    })

    render(
      <ToastProvider>
        <ItemInformationField label="ИНН" value="7710140123" copyable />
        <Toaster />
      </ToastProvider>
    )

    await user.click(screen.getByRole("button", { name: "Копировать" }))

    expect(writeText).toHaveBeenCalledWith("7710140123")
    expect(await screen.findByText("Скопировано в буфер обмена")).toBeInTheDocument()
  })

  it("omits the copy button when not copyable", () => {
    render(<ItemInformationField label="ИНН" value="7710140123" />)
    expect(screen.queryByRole("button", { name: "Копировать" })).not.toBeInTheDocument()
  })
})
