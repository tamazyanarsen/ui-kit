import { describe, expect, it } from "vitest"
import { act, renderHook } from "@testing-library/react"

import { useComboboxSelection } from "./use-combobox-selection"

describe("useComboboxSelection", () => {
  it("allows applying an emptied draft to clear the selection", () => {
    const { result } = renderHook(() => useComboboxSelection(["a", "b"]))

    act(() => result.current.setOpen(true))
    act(() => result.current.reset())

    expect(result.current.hasChanges).toBe(true)
    expect(result.current.canApply).toBe(true)

    act(() => result.current.apply())
    expect(result.current.committed).toEqual([])
  })

  it("does not offer applying an unchanged draft", () => {
    const { result } = renderHook(() => useComboboxSelection(["a"]))

    act(() => result.current.setOpen(true))

    expect(result.current.canApply).toBe(false)
  })
})
