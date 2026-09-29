import * as React from "react"
import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { CheckboxGroup } from "./group"

// Круг 27: родитель сначала отдаёт `value={null}`, потом массив, потом
// снова `null` — группа показывает последний выбор, а не устаревший от
// первого клика.

const items = [
  { value: "a", label: "А" },
  { value: "b", label: "Б" },
]

describe("CheckboxGroup: null → массив → null", () => {
  it("возврат к null показывает последний выбор", async () => {
    function Host() {
      const [value, setValue] = React.useState<string[] | null>(null)
      return (
        <>
          <CheckboxGroup value={value} onValueChange={setValue} items={items} />
          <button onClick={() => setValue(null)}>сброс</button>
        </>
      )
    }
    const user = userEvent.setup()
    render(<Host />)
    await user.click(screen.getByRole("checkbox", { name: "А" }))
    await user.click(screen.getByRole("checkbox", { name: "Б" }))
    expect(screen.getByRole("checkbox", { name: "Б" })).toBeChecked()
    await user.click(screen.getByText("сброс"))
    expect(screen.getByRole("checkbox", { name: "А" })).toBeChecked()
    expect(screen.getByRole("checkbox", { name: "Б" })).toBeChecked()
  })
})
