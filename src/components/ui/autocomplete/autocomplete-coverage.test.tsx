import * as React from "react"
import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import { Autocomplete } from "./root"
import { AutocompleteField } from "./field"

// Добор покрытия к исправлениям полей формы: ref и подпись у
// AutocompleteField раньше не проверялись.
describe("AutocompleteField coverage", () => {
  // Обычная функция на React 18 молча теряла ref потребителя.
  it("forwards ref to the native input", () => {
    const ref = React.createRef<HTMLInputElement>()
    render(
      <Autocomplete<string> items={[]}>
        <AutocompleteField ref={ref} label="Город" />
      </Autocomplete>
    )
    expect(ref.current).toBe(screen.getByRole("combobox"))
  })

  // `error ?? comment` при `error={false}` давал `false` — комментарий
  // пропадал, а `error={true}` оставлял пустой абзац вместо него.
  it.each([false, true] as const)("keeps the comment when error is %j", (error) => {
    render(
      <Autocomplete<string> items={[]}>
        <AutocompleteField label="Город" comment="Подсказка" error={error} />
      </Autocomplete>
    )
    const caption = screen.getByText("Подсказка")
    expect(screen.getByRole("combobox")).toHaveAttribute("aria-describedby", caption.id)
  })
})
