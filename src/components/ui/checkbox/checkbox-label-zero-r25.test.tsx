import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import { Checkbox } from "./checkbox"
import { CheckboxGroup } from "./group"

// Аудит r25: подпись `0` считалась пустой (`!label`) — чекбокс рисовался без
// подписи вовсе; а массив пунктов группы с `null` (собранный условиями)
// падал на `item.disabled`.

describe("Checkbox: подпись 0", () => {
  it("рисуется подписью, по которой находится флажок", () => {
    render(<Checkbox label={0} />)
    expect(screen.getByRole("checkbox", { name: "0" })).toBeInTheDocument()
  })
})

describe("CheckboxGroup: пустые элементы items", () => {
  it("null и false отбрасываются, остальные рисуются", () => {
    render(
      <CheckboxGroup
        selectAllLabel="Все"
        items={[null, { value: "a", label: "Первый" }, false, { value: "b", label: "Второй" }]}
      />
    )
    expect(screen.getAllByRole("checkbox")).toHaveLength(3)
    expect(screen.getByRole("checkbox", { name: "Второй" })).toBeInTheDocument()
  })
})
