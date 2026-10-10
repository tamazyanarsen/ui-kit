import * as React from "react"
import { describe, expect, it } from "vitest"
import { render } from "@testing-library/react"

import { useLatest } from "./use-latest"

// Ревью 10.10, КК-5: «ref с последним колбэком» писался в теле рендера —
// побочный эффект, который бросенная отрисовка (concurrent, StrictMode)
// оставляла в ref. `useLatest` пишет значение только после фиксации.
describe("useLatest (ревью 10.10, КК-5)", () => {
  it("во время рендера ref ещё прежний, после фиксации — новый", () => {
    const seenDuringRender: string[] = []
    let ref: React.MutableRefObject<string> | undefined
    function Probe({ value }: { value: string }) {
      ref = useLatest(value)
      seenDuringRender.push(ref.current)
      return null
    }
    const { rerender } = render(<Probe value="первое" />)
    rerender(<Probe value="второе" />)

    expect(seenDuringRender).toEqual(["первое", "первое"])
    expect(ref!.current).toBe("второе")
  })
})
