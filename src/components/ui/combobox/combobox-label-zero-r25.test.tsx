import { describe, expect, it } from "vitest"
import { render } from "@testing-library/react"

import { Combobox } from "./root"
import { ComboboxTrigger } from "./trigger"

// Аудит r25: `label={0}` (`label && …`) выводил голый «0» в триггер — без
// узла подписи и без связи `aria-labelledby`.

describe("ComboboxTrigger: подпись 0", () => {
  it("рисуется узлом подписи, на который ссылается триггер", () => {
    const { container } = render(
      <Combobox items={["a"]}>
        <ComboboxTrigger label={0}>Выбрано: 1</ComboboxTrigger>
      </Combobox>
    )
    const label = container.querySelector('[id$="-label"]') as HTMLElement
    expect(label).toHaveTextContent("0")
    const trigger = container.querySelector('[data-slot="combobox-trigger"]')
    expect(trigger).toHaveAttribute("aria-labelledby", label.id)
  })
})
