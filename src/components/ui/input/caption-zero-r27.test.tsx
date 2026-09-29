import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import { Input } from "./input"
import { Autocomplete, AutocompleteField } from "../autocomplete"
import { Combobox, ComboboxTrigger } from "../combobox"

// Круг 27: `comment={0}` («Осталось символов: 0» в виде числа) не рисовал
// подпись: в Input, AutocompleteField и ComboboxTrigger стояло `{caption &&`,
// а при нуле выводился голый «0» без обёртки, и связь `aria-describedby`
// пропадала.

describe("Подпись-число 0", () => {
  it("Input: comment=0 рисуется подписью и связан с полем", () => {
    render(<Input label="Поле" comment={0} />)
    const field = screen.getByLabelText("Поле")
    const caption = document.getElementById(field.getAttribute("aria-describedby") ?? "none")
    expect(caption?.tagName).toBe("P")
    expect(caption?.textContent).toBe("0")
  })

  it("AutocompleteField: comment=0", () => {
    render(
      <Autocomplete<string> items={[]}>
        <AutocompleteField label="Город" comment={0} />
      </Autocomplete>
    )
    const field = screen.getByRole("combobox")
    const caption = document.getElementById(field.getAttribute("aria-describedby") ?? "none")
    expect(caption?.textContent).toBe("0")
  })

  it("ComboboxTrigger: comment=0", () => {
    render(
      <Combobox items={[]}>
        <ComboboxTrigger label="Док" comment={0} />
      </Combobox>
    )
    const field = screen.getByRole("combobox")
    const caption = document.getElementById(field.getAttribute("aria-describedby") ?? "none")
    expect(caption?.tagName).toBe("P")
    expect(caption?.textContent).toBe("0")
  })
})
