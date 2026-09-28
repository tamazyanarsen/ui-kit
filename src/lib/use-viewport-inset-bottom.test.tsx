import * as React from "react"
import { describe, expect, it } from "vitest"
import { render } from "@testing-library/react"

import { useViewportInsetBottom } from "./use-viewport-inset-bottom"

const Bar = React.forwardRef<HTMLDivElement>(function Bar(_, forwardedRef) {
  const ref = useViewportInsetBottom<HTMLDivElement>(true, forwardedRef)
  return <div ref={ref} data-testid="bar" />
})

describe("useViewportInsetBottom: ref потребителя", () => {
  it("новый ref получает узел, а старый — null, когда потребитель сменил ref", () => {
    const first = React.createRef<HTMLDivElement>()
    const second = React.createRef<HTMLDivElement>()
    const { rerender, getByTestId } = render(<Bar ref={first} />)
    expect(first.current).toBe(getByTestId("bar"))

    rerender(<Bar ref={second} />)
    expect(second.current).toBe(getByTestId("bar"))
    expect(first.current).toBeNull()
  })
})
