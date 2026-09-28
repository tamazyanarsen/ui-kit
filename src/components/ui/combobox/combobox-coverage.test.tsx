import * as React from "react"
import { describe, expect, it } from "vitest"
import { render } from "@testing-library/react"

import { Combobox } from "./root"
import { ComboboxSearchInput } from "./content"

// Добор покрытия: `forwardRef` у строки поиска Combobox раньше не
// проверялся — на React 18 ref потребителя терялся молча.
describe("ComboboxSearchInput coverage", () => {
  it("forwards ref to the native search input", () => {
    const ref = React.createRef<HTMLInputElement>()
    const { container } = render(
      <Combobox items={[]}>
        <ComboboxSearchInput ref={ref} aria-label="Поиск" />
      </Combobox>
    )
    expect(ref.current).toBe(container.querySelector('[data-slot="combobox-search"]'))
    expect(ref.current).toBeInstanceOf(HTMLInputElement)
  })
})
