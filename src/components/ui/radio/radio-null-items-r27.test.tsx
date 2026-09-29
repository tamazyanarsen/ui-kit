import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import { RadioGroup } from "./root"

// Круг 27: `items={[cond && { … }]}` роняло RadioGroup на `false.value`
// (CheckboxGroup такие пункты уже пропускал).

describe("RadioGroup: пустые пункты", () => {
  it("null и false среди пунктов пропускаются", () => {
    render(
      <RadioGroup
        items={[{ value: "a", label: "А" }, null, false, { value: "b", label: "Б" }]}
      />
    )
    expect(screen.getAllByRole("radio")).toHaveLength(2)
  })
})
