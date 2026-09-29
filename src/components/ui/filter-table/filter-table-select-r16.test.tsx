import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { FilterTableSelect } from "./filter-table-select"

// Аудит 15: пустота проверялась по `trim()`, а наружу уходил сырой
// черновик — «  ООО  » из буфера давало поиску пустую выдачу.

describe("FilterTableSelect: наружу — обрезанное значение", () => {
  it("пробелы по краям отбрасываются при «Применить»", async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(<FilterTableSelect label="ИНН" onValueChange={onValueChange} />)
    await user.click(screen.getByText("ИНН"))
    await user.type(await screen.findByRole("textbox"), "  ООО  ")
    await user.click(screen.getByRole("button", { name: /^Применить/ }))
    expect(onValueChange).toHaveBeenCalledWith("ООО")
  })
})
