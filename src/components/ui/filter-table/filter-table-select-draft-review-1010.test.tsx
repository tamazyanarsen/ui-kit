import * as React from "react"
import { describe, expect, it } from "vitest"
import { act, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { FilterTableSelect } from "./filter-table-select"

// Ревью 10.10, п. 22: черновик пересинхронизировался эффектом по
// `[open, activeValue]` — внешнее обновление `value` при открытом окне
// стирало то, что пользователь уже набрал.
describe("FilterTableSelect: черновик при открытом окне (ревью 10.10, п. 22)", () => {
  it("внешнее обновление value не стирает набранное", async () => {
    const user = userEvent.setup()
    let push: (next: string) => void = () => {}
    function Harness() {
      const [value, setValue] = React.useState<string | null>("100")
      push = setValue
      return <FilterTableSelect label="Номер" value={value} onValueChange={setValue} />
    }
    render(<Harness />)
    await user.click(screen.getByText("100"))
    const field = screen.getByRole("textbox")
    expect(field).toHaveValue("100")

    await user.clear(field)
    await user.type(field, "777")
    act(() => push("200"))

    expect(screen.getByRole("textbox")).toHaveValue("777")
  })

  it("повторное открытие начинается с применённого значения", async () => {
    const user = userEvent.setup()
    render(<FilterTableSelect label="Номер" defaultValue="100" />)
    await user.click(screen.getByText("100"))
    await user.type(screen.getByRole("textbox"), "5")
    await user.keyboard("{Escape}")
    await user.click(screen.getByText("100"))
    expect(screen.getByRole("textbox")).toHaveValue("100")
  })

  it("управляемое открытие снаружи тоже берёт применённое значение", () => {
    const { rerender } = render(
      <FilterTableSelect label="Номер" value="100" open={false} onOpenChange={() => {}} />
    )
    rerender(<FilterTableSelect label="Номер" value="300" open={false} onOpenChange={() => {}} />)
    rerender(<FilterTableSelect label="Номер" value="300" open onOpenChange={() => {}} />)
    expect(screen.getByRole("textbox")).toHaveValue("300")
  })
})
