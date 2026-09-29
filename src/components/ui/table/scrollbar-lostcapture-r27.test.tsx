import { fireEvent, render } from "@testing-library/react"
import * as React from "react"
import { describe, expect, it } from "vitest"

import { TableScrollbar } from "./scrollbar"

// Раунд 27: захват указателя у бегунка могут отобрать без pointerup — тогда
// перетаскивание залипало (data-dragging оставался, бегунок шёл за курсором).

function Harness() {
  const ref = React.useRef<HTMLDivElement>(null)
  return (
    <div>
      <div ref={ref}>
        <table />
      </div>
      <TableScrollbar scrollRef={ref} />
    </div>
  )
}

describe("TableScrollbar: потеря захвата", () => {
  it("lostpointercapture завершает перетаскивание", () => {
    const scroll = { scrollWidth: 1000, clientWidth: 400 }
    Object.defineProperty(HTMLElement.prototype, "scrollWidth", {
      configurable: true,
      get: () => scroll.scrollWidth,
    })
    Object.defineProperty(HTMLElement.prototype, "clientWidth", {
      configurable: true,
      get: () => scroll.clientWidth,
    })
    HTMLElement.prototype.setPointerCapture = () => {}
    HTMLElement.prototype.hasPointerCapture = () => false
    try {
      const { container } = render(<Harness />)
      const bar = container.querySelector('[data-slot="table-scrollbar"]')!
      const thumb = container.querySelector('[data-slot="table-scrollbar-thumb"]')!
      fireEvent.pointerDown(thumb, { pointerId: 1, clientX: 10 })
      expect(bar).toHaveAttribute("data-dragging")
      fireEvent.lostPointerCapture(thumb, { pointerId: 1 })
      expect(bar).not.toHaveAttribute("data-dragging")
    } finally {
      Reflect.deleteProperty(HTMLElement.prototype, "scrollWidth")
      Reflect.deleteProperty(HTMLElement.prototype, "clientWidth")
      Reflect.deleteProperty(HTMLElement.prototype, "setPointerCapture")
      Reflect.deleteProperty(HTMLElement.prototype, "hasPointerCapture")
    }
  })
})
